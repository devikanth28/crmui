import { useContext, useEffect, useRef, useState } from "react";
import Validate from "../../../helpers/Validate"
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../../Common/CommonStructure"
import { AlertContext, CustomerContext, LocalityContext, ShoppingCartContext } from "../../Contexts/UserContext";
import DeliveryDetails from "../Review/DeliveryDetails";
import CheckoutService from "../../../services/Checkout/CheckoutService";
import PatientCard from "../ShoppingCart/PatientInfo/PatientCard";
import DisplayThankYouOrder from "./DisplayThankYouOrder";
import { getCustomerRedirectionURL } from "../../customer/CustomerHelper";
import { CRM_UI } from "../../../services/ServiceConstants";
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";

export default (props) => {
    const { customerId } = useContext(CustomerContext);
    const {setShoppingCart} = useContext(ShoppingCartContext);
    const {setIsLocalityComponentNeeded} = useContext(LocalityContext)
    const validate = Validate();
    const checkoutService = CheckoutService();
    const [displayOrderList, setDisplayOrderList] = useState(undefined);
    const [shippingAddress, setShippingAddress] = useState(undefined);
    const [pickStoreInfo, setPickStoreInfo] = useState(undefined);
    const [patientInfo, setPatientInfo] = useState(undefined);
    const [cartId, setCartId] = useState();
    const homeDelivery = 'D';
    const storePick = 'S';
    const [isProceed, setIsProceed] = useState(true);
    const footerRef = useRef(null);
    const headerRef = useRef(null);
    const [refilInterval, setRefilInterval] = useState(undefined);
    const { setStackedToastContent } = useContext(AlertContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefilRequestLoading,setIsRefilRequestLoading] = useState(undefined);

    useEffect(() => {
        setIsLocalityComponentNeeded(false);
        getThankYouResponse();
    }, [])

    const getLastOrderDetails = () => {
        return checkoutService.getThankYouOrderDetails({ headers: { customerId }, params: { cartId: props.match.params.cartId } });
    }

    const redirectToCatalog = () => {
        props.history.push(getCustomerRedirectionURL(customerId, "catalog"));
    }

    const prepareDeliveryDetails = (deliveryType, eachOrder, orderInfo) => {
        switch (deliveryType) {
            case storePick:
                setPickStoreInfo(orderInfo.pickStoreInfo[eachOrder['pickStoreId']]);
                return;
            case homeDelivery:
                setShippingAddress(eachOrder?.shipmentOmsAddress);
                return;
        }
    }

    const preparePatientInfo = (order) => {
        let selectedPatient = {};
        selectedPatient['patientName'] = order?.patientName
        selectedPatient['age'] = order?.patientAge
        selectedPatient['gender'] = order?.patientGender
        selectedPatient['doctorName'] = order?.doctorName
        setPatientInfo(validate.isEmpty(selectedPatient) ? undefined : selectedPatient);
    }

    const prepareDisplayThankYouResponse = (orderInfo) => {
        let orderList = orderInfo.orderList
        const displayOrders = [];
        orderList.map((eachOrder, index) => {
            if (index == 0) {
                prepareDeliveryDetails(eachOrder?.deliveryType, eachOrder, orderInfo)
                preparePatientInfo(eachOrder);
                setCartId(eachOrder['cartId']);
            }
            let displayOrder = {};
            displayOrder['orderSno'] = index + 1;
            displayOrder['orderId'] = eachOrder['orderId'];
            displayOrder['displayOrderId'] = eachOrder['displayOrderId'];
            displayOrder['cartId'] = eachOrder['cartId'],
            displayOrder['paymentType'] = eachOrder['paymentType'],
            displayOrder['deliveryTime'] = eachOrder['deliveryTime'];
            displayOrders.push(displayOrder);
        })
        setDisplayOrderList(displayOrders);
    }

    const setOrderDetails = (thankYouResponse) => {
        if (validate.isNotEmpty(thankYouResponse) && validate.isNotEmpty(thankYouResponse.dataObject) && "SUCCESS" == thankYouResponse?.statusCode && validate.isNotEmpty(thankYouResponse.dataObject?.orderList)) {
            setShoppingCart({});
            prepareDisplayThankYouResponse(thankYouResponse.dataObject);
        } else {
            redirectToCatalog();
        }
        setIsLoading(false);
    }

    const getThankYouResponse = async () => {
        setIsLoading(true);
        const thankYouResponse = await getLastOrderDetails();
        setOrderDetails(thankYouResponse);
    }

    const handleRefil = async () => {
        if(validate.isEmpty(refilInterval) || isRefilRequestLoading){
            return;
        }
        setIsRefilRequestLoading(true);
        const refilOrderResponse = await createRefilOrder();
        if (validate.isNotEmpty(refilOrderResponse) && validate.isNotEmpty(refilOrderResponse.dataObject) && "SUCCESS" == refilOrderResponse?.statusCode) {
            setStackedToastContent({ toastMessage: `your refil is success for ${refilInterval} days` });
            setIsProceed(false);
        } else {
            setIsProceed(true);
            setIsProceed({ toastMessage: `failed to refil` });
        }
        setIsRefilRequestLoading(false);
    }

    const createRefilOrder = () => {
        return checkoutService.createRefilRequest({ headers: { customerId }, params: { cartId: cartId, interval: refilInterval } })
    }

    const handleRefilInterval = (e) => {
        const value = e.target.value;
        if (validate.isNotEmpty(value)) {
            setRefilInterval(value);
        }
    }

    return (
        <Wrapper>
            <HeaderComponent className={"border-bottom"} ref={headerRef}>
                <p className="mb-2 m-2 my-2">Order Summary</p>
            </HeaderComponent>
            <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height" loading={isLoading}>
                <div className="d-flex justify-content-center">
                    <div className="col-12 col-lg-9">
                        <div className="card">
                            <div className="row card-body p-12">
                                <h1 className="text-center text-success"><u>Thank You..!</u></h1>
                                <div className="col-12 col-lg-8 border-end pe-3">
                                    {validate.isNotEmpty(displayOrderList) && displayOrderList.map(order => {
                                        return <DisplayThankYouOrder orderInfo={order} />
                                    })}
                                    <div className="row g-3 g-lg-0">
                                        {validate.isNotEmpty(patientInfo) &&
                                            <div className="col-12 custom-border-bottom-dashed pb-3">
                                                <p className="d-lg-none custom-fieldset mb-2">Patient Details</p>
                                                <PatientCard patientInfo={patientInfo} isReviewPage />
                                            </div>
                                        }
                                        {(validate.isNotEmpty(pickStoreInfo) || validate.isNotEmpty(shippingAddress)) &&
                                            <div className="col-12">
                                                <p className="d-lg-none custom-fieldset mb-2">Delivery Details</p>
                                                <div className="p-12 px-0">
                                                    <DeliveryDetails fullWidthRequired={true} pickStoreDetails={pickStoreInfo} shipmentOmsAddress={shippingAddress} />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                {displayOrderList?.[0]?.cartId != null && "C" == displayOrderList?.[0]?.paymentType && <div className="col-12 col-lg-4">
                                    {!isLoading && <div className="card border-0">
                                        <div className="card-header bg-white fw-bold">
                                            Refill Product Information
                                        </div>
                                        <div className="card-body">
                                            <p>I want to repeat every</p>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="radio" value="30" id="flexCheckDefault1" checked={30 == refilInterval} onClick={(e) => { handleRefilInterval(e) }} disabled={!isProceed} />
                                                <label for="flexCheckDefault1">30 Days</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="radio" value="45" id="flexCheckDefault2" checked={45 == refilInterval} onClick={(e) => { handleRefilInterval(e) }} disabled={!isProceed} />
                                                <label for="flexCheckDefault2">45 Days</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="radio" value="60" id="flexCheckDefault3" checked={60 == refilInterval} onClick={(e) => { handleRefilInterval(e) }} disabled={!isProceed} />
                                                <label for="flexCheckDefault3">60 Days</label>
                                            </div>
                                        </div>
                                    </div>}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </BodyComponent>
            <FooterComponent className="footer p-3" ref={footerRef}>
                <div className="d-flex align-items-center justify-content-end">
                    <div>
                        <button className="btn btn-sm brand-secondary me-3 px-3" onClick={() => props.history.replace(`${CRM_UI}/customer/${customerId}/${'catalog'}`)}>Continue Shopping</button>
                        {isProceed && displayOrderList?.[0]?.cartId!=null && "C" == displayOrderList?.[0]?.paymentType && <button className="btn btn-sm btn-brand px-3" disabled={validate.isEmpty(refilInterval)} onClick={() => handleRefil()}>{isRefilRequestLoading ? <CustomSpinners spinnerText={"Proceed"} className={" spinner-position"} innerClass={"invisible"} />: "Proceed"}</button>}
                    </div>
                </div>
            </FooterComponent>
        </Wrapper>
    )
}

