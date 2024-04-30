import { ALERT_TYPE, CustomSpinners, withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import Validate from "../../../helpers/Validate";
import CheckoutService from "../../../services/Checkout/CheckoutService";
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../../Common/CommonStructure";
import { AlertContext, CustomerContext, LocalityContext, ShoppingCartContext } from "../../Contexts/UserContext";
import { getCustomerRedirectionURL } from "../../customer/CustomerHelper";
import { TrackScrolling } from "../../order/PrepareOrderDetails";
import DeliveryDetails from "./DeliveryDetails";
import Payment from "./Payment";
import Prescription from "./Prescription";
import ShoppingCartInfo from "./ShoppingCartInfo";
import CatalogService from "../../../services/Catalog/CatalogService";
import CurrencyFormatter from "../../Common/CurrencyFormatter";
import { PrescriptionConstants } from "../../customer/Constants/CustomerConstants";




export default withFormHoc((props)=>{

    const headerRef = useRef(0);
    const footerRef = useRef(0)
    const homeDeliveryRef = useRef(null);

    const {customerId} = useContext(CustomerContext);
    const validate = Validate();
    const checkoutService = CheckoutService();
    const catalogService = CatalogService();
    const [activeTab , setActiveTab] = useState('ShoppingCart')
    const [backDropLoader, setBackDropLoader] = useState(false)
    const [isRequiredPrescription, setIsRequiredPrescription] = useState(undefined);
    const [prescImgList, setPrescImgList] = useState(undefined);
    const homeDeliveryInfo = useRef({})
    const [storeDeliveryDetails, setStoreDeliveryDetails] = useState({});
    const [paymentType, setPaymentType] = useState(undefined);
    const { setAlertContent,setStackedToastContent } = useContext(AlertContext);
    const {isOnlineCartAdded,redisCart, setisOnlineCartAdded,shoppingCart, setShoppingCart} = useContext(ShoppingCartContext);
    const [activeDeliveryTab, setActiveDeliveryTab] = useState(undefined);
    const [isPrescriptionSectionSelected, setIsPrescriptionSectionSelected] = useState(false);
    const [isAllowedToCheckout,setIsAllowedToCheckout] = useState(false);
    const [selectedImagePath, setSelectedImagePath] = useState(undefined);
    const {martLocality,setIsLocalityComponentNeeded} = useContext(LocalityContext);

    const [cartDiscountAmount, setCartDiscountAmount] = useState(undefined);
    const [cartGrandTotal, setCartGrandTotal] = useState(0);
    const [coData, setCOData] = useState(undefined);
    const [cfpStoreId, setCfpStoreId] = useState(undefined);
    const [decoderComment, setDecoderComment] = useState(undefined);
    const [isFromPrescription, setIsFromPrescription] = useState(false);
    const [healthRecordId, setHealthRecordId] = useState(undefined);
    const [prescStatus, setPrescStatus] = useState(undefined);
    const [decodedCart, setDecodedCart] = useState(undefined);
    const [isAnyOutOfStock,setIsAnyOutOfStock] = useState(false);

    useEffect(()=>{
        setIsLocalityComponentNeeded(false);
        if(validate.isEmpty(customerId)){
            return
        }
    },[isRequiredPrescription,customerId,])

    useEffect(() => {
        setIsLocalityComponentNeeded(false);
        getCOData();
    }, []);

    const getCOData = () => {
        checkoutService.getCOData({ headers: { customerId: customerId } }).then(async (response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.dataObject)) {
                setCOData(response.dataObject);
                if(validate.isNotEmpty(response.dataObject.tokenResponse)) {
                    let tokenData = response.dataObject.tokenResponse;
                
                if(validate.isNotEmpty(tokenData.cfpStoreId)) {
                    setCfpStoreId(tokenData.cfpStoreId);
                }

                if(validate.isNotEmpty(tokenData.prescriptionId)) {
                    setIsFromPrescription(true);
                    getMartCatalogPrescriptions(tokenData.prescriptionId);
                }

                if(validate.isNotEmpty(tokenData.recordId)) {
                    setIsFromPrescription(true);
                    setHealthRecordId(tokenData.recordId);
                    const healthRecordResponse = await getHealthRecordDetails(tokenData.recordId);
                    if (validate.isNotEmpty(healthRecordResponse) && "SUCCESS" == healthRecordResponse.statusCode && validate.isNotEmpty(healthRecordResponse.dataObject) && validate.isNotEmpty(healthRecordResponse.dataObject.recordImageDetailList)) {
                        setPrescImgList(healthRecordResponse.dataObject.recordImageDetailList);
                        shoppingCart.healthRecordId = tokenData.recordId;
                    } 
                }
                }

                if(validate.isNotEmpty(response.dataObject.decodedCart)) {
                    setDecodedCart(response.dataObject.decodedCart);
                }

            }
        }).catch((error) => {
            console.log("error is "+error);
        });
           
    }

    const validateAndSetDeliveryAndPaymentDetails = () => {
        let deliveryAndPaymentDetailsObj = {};
        if(activeDeliveryTab == 1) {
                if(!homeDeliveryRef.current.validateRequiredFields()) {
                    setAlertContent({ alertMessage: "Please Enter Valid Home Delivery Details", show: true, type: ALERT_TYPE.ERROR });
                    return false;
                }

                const homeDeliveryMetaInfo = homeDeliveryInfo.current
                deliveryAndPaymentDetailsObj["deliveryType"] = homeDeliveryMetaInfo["deliveryType"];
                deliveryAndPaymentDetailsObj["address"] = homeDeliveryMetaInfo["address"];
                deliveryAndPaymentDetailsObj["customerStoreId"] = homeDeliveryMetaInfo["customerStoreId"];
                deliveryAndPaymentDetailsObj["isCardOrder"] = homeDeliveryMetaInfo["isCardOrder"];
            
        } else if(activeDeliveryTab == 2 ){
            if(validate.isEmpty(storeDeliveryDetails)) {
                setAlertContent({ alertMessage: "Please Select the Store", show: true, type: ALERT_TYPE.ERROR });
                return false;
            }
            deliveryAndPaymentDetailsObj["deliveryType"] = storeDeliveryDetails["deliveryType"];
            deliveryAndPaymentDetailsObj["pickstoreId"] = storeDeliveryDetails["pickStoreId"];
        }

        if (validate.isEmpty(paymentType)) {
            setAlertContent({ alertMessage: "Please Select Payment Type", show: true, type: ALERT_TYPE.ERROR });
            return false;
        }

        deliveryAndPaymentDetailsObj["paymentType"] = paymentType;
        return deliveryAndPaymentDetailsObj;

    }

    const setDeliveryAndPaymentDetails = () => {
        if(isAnyOutOfStock){
            setStackedToastContent({toastMessage:"Please remove out of stock product from your cart to proceed"})
            return;
        }
        if(!isAllowedToCheckout){
            setStackedToastContent({toastMessage:"Please check your shoppingcart"})
        } 

        if(validate.isEmpty(prescImgList) && (isRequiredPrescription && !isPrescriptionSectionSelected && activeDeliveryTab ==1)) {
            setAlertContent({ alertMessage: "Please Select Prescription", show: true, type: ALERT_TYPE.ERROR });
            return false;
        }

        const deliveryAndPaymentDetailsObj = validateAndSetDeliveryAndPaymentDetails();
        if(validate.isEmpty(deliveryAndPaymentDetailsObj) && !deliveryAndPaymentDetailsObj) {
            return;
        }
        
        const data = Object.keys(deliveryAndPaymentDetailsObj)
            .map((key) => `${key}=${encodeURIComponent(deliveryAndPaymentDetailsObj[key])}`)
            .join('&');

        const config = { headers: { customerId: customerId }, data };

        checkoutService.setDeliveryAndPaymentDetails(config).then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS") {
                let prescriptionObj = {
                    isRequiredPrescription : isRequiredPrescription,
                    prescImgList: prescImgList,
                }
                props.history.push({pathname: getCustomerRedirectionURL(customerId, "checkout/orderReview"), state : {prescriptionObj}}) 
                
            }

        }).catch((error) => {
            console.log("error is " + error);
        })

    }
   
    const getMartCatalogPrescriptions = async (prescriptionId) => {
        checkoutService.getMartCatalogPrescriptions({ headers: { customerId: customerId }, params: {presOrderId : prescriptionId} }).then(async(response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.dataObject)) {
                let prescriptionOrder = response.dataObject;
                let recordId = prescriptionOrder.recordId;
                shoppingCart.prescriptionId = prescriptionId;
                if(validate.isNotEmpty(prescriptionOrder.imageList)) {
                    setPrescImgList(prescriptionOrder.imageList);
                }

                setPrescStatus(prescriptionOrder.status);

                if(((PrescriptionConstants.PRESCRIPTION_ORDER_CONVERTED_TO_OMS == prescriptionOrder.status || PrescriptionConstants.PRESCRIPTION_ORDER_CANCEL == prescriptionOrder.status) && (validate.isEmpty(shoppingCart.healthRecordId))) && validate.isNotEmpty(recordId)) {
                    const healthRecordResponse = await getHealthRecordDetails(recordId);
                    if (validate.isNotEmpty(healthRecordResponse) && "SUCCESS" == healthRecordResponse.statusCode && validate.isNotEmpty(healthRecordResponse.dataObject) && validate.isNotEmpty(healthRecordResponse.dataObject.recordImageDetailList)) {
                        setPrescImgList(healthRecordResponse.dataObject.recordImageDetailList);
                    }
                }

                if(PrescriptionConstants.PRESCRIPTION_ORDER_STATUS_DECODED == prescriptionOrder.status) {
                    const healthRecordResponse = await getHealthRecordDetails(recordId);
                    if (validate.isNotEmpty(healthRecordResponse) && "SUCCESS" == healthRecordResponse.statusCode && validate.isNotEmpty(healthRecordResponse.dataObject) && validate.isNotEmpty(healthRecordResponse.dataObject.decoderComment)) {
                        setDecoderComment(healthRecordResponse.dataObject.decoderComment);
                    }
                }
            }
        }).catch((error) => {
            console.log("error is " + error);
        })
    }

    const getHealthRecordDetails = (healthRecordId) => {
        if(validate.isEmpty(healthRecordId)) {
            return;
        }
        return checkoutService.getHealthRecordDetails({ headers: { customerId: customerId }, params: { healthRecordId } });
    }

    const jumpToTab = (tabId) => {
        document.getElementById(tabId).scrollIntoView({ behavior: "smooth", block: "start"});
    };

    const getCartInfo = async (onlineCartAdded) => {
        setBackDropLoader(true)
        const config = { headers: { customerId: customerId }, params: { onlineCartAdded } }
        await catalogService.getCartInfo(config).then(data => {
            if (data && "SUCCESS" === data?.statusCode && validate.isNotEmpty(data?.dataObject)) {
                setShoppingCart(data?.dataObject)
                if (onlineCartAdded) {
                    setisOnlineCartAdded(onlineCartAdded)
                }
            }else if ("FAILURE" === data?.statusCode && "EMPTY_CART" !== data?.message) {
                props.history.push(getCustomerRedirectionURL(customerId, "catalog"));
                setShoppingCart({})
            }else if("FAILURE" === data?.statusCode && validate.isNotEmpty(data?.message)){
                setStackedToastContent({toastMessage:data?.message});
                setShoppingCart({})
            }
            setBackDropLoader(false)
        }).catch(error => {
            setStackedToastContent({ toastMessage: "Unable to get Shopping Cart details..!" })
            setBackDropLoader(false)
            console.log(error)
        })

    }
    
    return (

        <Wrapper>
            <HeaderComponent className={"border-bottom"} ref={headerRef}>
                <div className="d-flex align-items-center justify-content-between p-12">
                    <p className="mb-0">Shopping Cart</p>
                    {backDropLoader ? <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" />:validate.isNotEmpty(redisCart) && !isOnlineCartAdded && !isFromPrescription && <button type="button" className="btn btn-sm link-success btn-link border-0" disabled={backDropLoader} onClick={() => getCartInfo(true)}>
                        <svg className="align-text-top me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <g id="Group_28287" data-name="Group 28287" transform="translate(-1135.314)">
                                <path id="Path_47170" data-name="Path 47170" d="M38,30a8,8,0,1,0,8,8A8.007,8.007,0,0,0,38,30Zm0,14.905A6.905,6.905,0,1,1,44.905,38,6.915,6.915,0,0,1,38,44.905Z" transform="translate(1105.314 -30)" fill="#11b094" />
                                <path id="Path_47171" data-name="Path 47171" d="M5.975.164a.539.539,0,0,0-.775,0L3.078,2.286.939.164a.539.539,0,0,0-.775,0,.539.539,0,0,0,0,.775L2.3,3.061.181,5.2a.539.539,0,0,0,0,.775.562.562,0,0,0,.387.152.562.562,0,0,0,.387-.152L3.078,3.836,5.217,5.975a.571.571,0,0,0,.775,0,.539.539,0,0,0,0-.775L3.853,3.061,5.992.922A.534.534,0,0,0,5.975.164Z" transform="translate(1143.302 3.66) rotate(45)" fill="#11b094" />
                            </g>
                        </svg>
                        Add My Online Cart
                    </button>}
                </div>
            </HeaderComponent>
            <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height">
                <div className={`custom-tabs-forms tabs-nowrap custom-tabs-forms-icon border rounded h-unset h-100`}>
                    <Nav tabs className="border-bottom">
                        <NavItem>
                            <NavLink
                                className={`${activeTab == 'ShoppingCart' ? 'active rounded-top' : 'rounded-top'} d-flex`}
                                onClick={() => jumpToTab("ShoppingCart")}
                            >
                                Shopping Cart
                                <span className={`${activeTab == 'ShoppingCart' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                            </NavLink>
                        </NavItem>
                        {(isRequiredPrescription || prescImgList)  && <NavItem>
                            <NavLink className={`${activeTab == 'SelectPrescription' ? "active" : ''} d-flex`}
                                onClick={() => jumpToTab("SelectPrescription")}
                            >
                                Select Prescription
                                <span className={`${activeTab == 'SelectPrescription' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                            </NavLink>
                        </NavItem>
                        }
                        <NavItem>
                            <NavLink className={`${activeTab == 'DeliveryDetails' ? "active" : ''} d-flex`}
                                onClick={() => jumpToTab("DeliveryDetails")}
                            >
                                Delivery Details
                                <span className={`${activeTab == 'DeliveryDetails' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={`${activeTab == 'Payments' ? "active" : ''} d-flex`}
                                onClick={() => jumpToTab("Payments")}
                            >
                                Payments
                                <span className={`${activeTab == 'Payments' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                            </NavLink>
                        </NavItem>
                        {<NavItem>
                            <NavLink className={`${activeTab == 'ReviewandProceed' ? "active" : ''} d-flex`}>
                                Review & Promotions
                                <span className={`${activeTab == 'ReviewandProceed' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                            </NavLink>
                        </NavItem>}
                    </Nav>
                    <div id="TabContent" className="overflow-y-auto tab-content-height" style={{ 'height': `calc(100% - 41px)` }} onScroll={(element) => TrackScrolling(element, (activeTab) => setActiveTab(activeTab))}>
                        <div className="scrolling-tabs" id="ShoppingCart">
                            <ShoppingCartInfo key={shoppingCart?.shoppingCartItems?.length} setIsRequiredPrescription={setIsRequiredPrescription} setIsAllowedToCheckout={setIsAllowedToCheckout} setCartDiscountAmount={setCartDiscountAmount} setCartGrandTotal={setCartGrandTotal} {...props} setIsAnyOutOfStock={setIsAnyOutOfStock}/>
                        </div>
                        {(isRequiredPrescription || prescImgList) && <div className="scrolling-tabs" id="SelectPrescription">
                            <div className="mt-3 p-12 h-100">
                                <p className="custom-fieldset mb-2">Select Prescription</p>
                                    {<Prescription isRequiredPrescription={isRequiredPrescription} prescImgList={prescImgList} setIsPrescriptionSectionSelected = {setIsPrescriptionSectionSelected} decoderComment = {decoderComment} prescStatus = {prescStatus} setPrescImgList = {setPrescImgList} decodedCart = {decodedCart}/>}
                            </div>
                        </div>}
                        <div className="scrolling-tabs" id="DeliveryDetails">
                            <div className="p-12 h-100">
                                <p className="custom-fieldset mb-2">Select Delivery Type</p>
                                <DeliveryDetails ref={homeDeliveryRef} homeDeliveryInfo={homeDeliveryInfo} storeDeliveryDetails={storeDeliveryDetails}  setStoreDeliveryDetails = {setStoreDeliveryDetails} setActiveDeliveryTab = {setActiveDeliveryTab}  history={props.history} helpers= {props.helpers} setPaymentType = {setPaymentType} cfpStoreId = {cfpStoreId}/>
                            </div>
                        </div>
                        <div className="scrolling-tabs tab-pane-height" id="Payments">
                            <div className="p-12 h-100">
                                <p className="custom-fieldset mb-2">Select Payment Type</p>
                                {(martLocality.hdcodAllowed || martLocality.spcodAllowed || martLocality.allowedOnlinePayment)  ? <Payment setPaymentType = {setPaymentType} deliveryType = {validate.isNotEmpty(activeDeliveryTab) && "1" == activeDeliveryTab ? "S" : "D"} paymentType = {paymentType}/> : <p>Payment Modes not configured</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </BodyComponent>
            <FooterComponent className="footer" ref={footerRef}>
                <div class="p-3 d-flex justify-content-end font-14 align-items-center border-bottom">
                   <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex flex-column flex-lg-row justify-content-end align-itens-stretch align-items-lg-center">
                        {validate.isNotEmpty(cartDiscountAmount) && <React.Fragment>
                            <div className="d-flex justify-content-between justify-content-lg-end flex-lg-row">
                                <p class="text-secondary text-end mb-0 align-self-lg-center  font-normal">Discount Amount</p>
                                <p class="font-weight-bold text-end mb-0 ms-3"><CurrencyFormatter data={cartDiscountAmount} decimalPlaces={2} /></p>
                            </div>
                            <span class="mx-3 text-secondary hide-on-mobile">|</span>
                        </React.Fragment>}
                        <div className="d-flex justify-content-between justify-content-lg-end flex-lg-row">
                            <p class="text-secondary text-end mb-0 align-self-lg-center  font-normal">Grand Total</p>
                            <p class="font-weight-bold text-end ms-3 mb-0"><CurrencyFormatter data={cartGrandTotal} decimalPlaces={2} /></p>
                        </div>
                   </div>
                </div>
                <div className="d-flex align-items-center justify-content-end p-3">
                    <button className="btn btn-sm brand-secondary px-3" onClick={()=>{props?.history.replace(getCustomerRedirectionURL(customerId, "catalog"))}}>Add More Products</button>
                    {<button className="btn btn-sm btn-brand px-3 ms-3"  disabled={validate.isEmpty(paymentType)} onClick={() => {setDeliveryAndPaymentDetails() }}>Review &amp; Place the Order</button>}
                </div>
            </FooterComponent>
        </Wrapper>
    )
})