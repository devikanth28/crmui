import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import React, { useContext, useEffect, useRef, useState } from "react";
import Validate from "../../helpers/Validate";
import CatalogService from "../../services/Catalog/CatalogService";
import CheckoutService from "../../services/Checkout/CheckoutService";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import { AlertContext, CustomerContext, LocalityContext, ShoppingCartContext } from "../Contexts/UserContext";
import CartButton from "./Common/MobileCartButton";
import PrescriptionToggler from "./Common/PrescriptionToggler";
import MartCatalogPrescription from "./MartCatalogPrescription";
import ProductDetails from "./ProductDetails";
import ProductSearch from "./ProductSearch";

const Catalog = (props) => {
    const validate = Validate();
    const { martLocality } = useContext(LocalityContext);
    const [backDropLoader, setBackDropLoader] = useState(false)
    const { productId , setProductId , setShoppingCart, shoppingCart, isOnlineCartAdded, setisOnlineCartAdded, redisCart, setRedisCart} = useContext(ShoppingCartContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const { customerId } = useContext(CustomerContext);
    const catalogService = CatalogService();
    const [catalogRestrictedQty, setCatalogRestrictedQty] = useState(null);
    const [showPrescription, setShowPrescription] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [toggleButton, setToggleButton] = useState(false);
    const [showCartSection, setShowCartSection] = useState(false);
    const [redisDataLoading, setRediDataLoading] = useState(true);
    const [isFromPrescription, setIsFromPrescription] = useState(false);
    const [cfpStoreId, setCfpStoreId] = useState(undefined);
    const [prescriptionId, setPrescriptionId] = useState(undefined);
    const [healthRecordId, setHealthRecordId] = useState(undefined);

    const checkoutService = CheckoutService();

    const headerRef = useRef(0);

    useEffect(() => {
        setProductId(props.match.params.productId && "prescription" !== props.match.params.productId  ? props.match.params.productId : '')
        getCartInfoFromRedis()
        getCOData();
    }, [])

    useEffect(() => {
        getCartInfo()
    }, [martLocality?.locationLatLong])

    const getCOData = () => {
        checkoutService.getCOData({ headers: { customerId: customerId } }).then(async (response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.dataObject)) {
                if(validate.isNotEmpty(response.dataObject.tokenResponse)) {
                    let tokenData = response.dataObject.tokenResponse;
                
                if(validate.isNotEmpty(tokenData.cfpStoreId)) {
                    setCfpStoreId(tokenData.cfpStoreId);
                }

                if(validate.isNotEmpty(tokenData.prescriptionId)) {
                    setIsFromPrescription(true);
                    setPrescriptionId(tokenData.prescriptionId);
                    setShowPrescription(true);
                    setToggleButton(true);
                }

                if(validate.isNotEmpty(tokenData.recordId)) {
                    setIsFromPrescription(true);
                    setHealthRecordId(tokenData.recordId);
                    setShowPrescription(true);
                    setToggleButton(true);
                }
                }
            }
        }).catch((error) => {
            console.log("error is "+error);
        });
           
    }

    const getCartInfoFromRedis = () => {
        const config = { headers: { customerId: customerId } }
        catalogService.getCartInfoFromRedis(config).then(data => {
            if (data && "SUCCESS" === data.statusCode) {
                setRedisCart(data.dataObject);
                if (data.dataObject.isOnlineShoppingCartAdded) {
                    setisOnlineCartAdded(Boolean(data.dataObject.isOnlineShoppingCartAdded))
                }
                if (validate.isNotEmpty(data.dataObject) && Object.keys(data.dataObject).length === 1 && 'isOnlineShoppingCartAdded' in data.dataObject) {
                    setShoppingCart({})
                }
                if(validate.isNotEmpty(data.dataObject.isFromDecoded)) {
                    setIsFromPrescription(true);
                }
            } else {
                setStackedToastContent({ toastMessage: "Unable to get Cart Information" })
            }
            setRediDataLoading(false)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        if (validate.isNotEmpty(props?.location?.state?.prescriptionId) || props?.location?.state?.recordId) {
            setToggleButton(true);
            setShowPrescription(true);
            setShowCartSection(false);
        }
    }, []);

    useEffect(() => {
        if (validate.isNotEmpty(productId)) {
            setShowProductDetails(true);
            setShowCartSection(false);
        }
        else {
            setShowProductDetails(false);
        }
    }, [productId]);

    useEffect(() => {
        if (showProductDetails) {
            setShowPrescription(false);
        }
    }, [showProductDetails]);

    useEffect(() => {
        if (showPrescription) {
            setShowProductDetails(false);
        }
        else if (validate.isNotEmpty(productId)) {
            setShowProductDetails(true);
        }
    }, [showPrescription]);

    const getCartInfo = async (onlineCartAdded) => {
        setBackDropLoader(true)
        const config = { headers: { customerId: customerId }, params: { onlineCartAdded , isFromCatalogPage: true} }
        await catalogService.getCartInfo(config).then(data => {
            if (data && "SUCCESS" === data.statusCode && validate.isNotEmpty(data.dataObject)) {
                setShoppingCart(data.dataObject)
                if (onlineCartAdded) {
                    setisOnlineCartAdded(onlineCartAdded)
                }
            } else if ("FAILURE" === data.statusCode && validate.isNotEmpty(data.dataObject) && "EMPTY_CART" === data.dataObject) {
                setStackedToastContent({ toastMessage: `Online shopping cart for the customer: ${customerId}, is empty. Please add some products to proceed further..!` })
                setShoppingCart({})
            }
            else if ("FAILURE" === data.statusCode) {
            if("INVALID MEDPLUS ID" == data?.message) {
                    setStackedToastContent({ toastMessage: data.message});
                }                
                setShoppingCart({})
            }
            setBackDropLoader(false)

        }).catch(error => {
            setStackedToastContent({ toastMessage: "Unable to get Shopping Cart details..!" })
            setBackDropLoader(false)
            console.log(error)
        })

    }

    const handleToggle = () => {
        setShowPrescription(!showPrescription);
    }

    return (
        <Wrapper key={martLocality?.locationLatLong}>
            <HeaderComponent className={"border-bottom"} ref={headerRef}>
                <div className="d-flex align-items-center justify-content-between p-12">
                    <p className="mb-0">Search Catalogue</p>
                    {validate.isNotEmpty(redisCart) && !isOnlineCartAdded && martLocality?.hubId && !isFromPrescription &&  <button type="button" className="btn btn-sm link-success btn-link border-0" disabled={backDropLoader} onClick={() => getCartInfo(true)}>
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
            {redisDataLoading || backDropLoader? 
                 <div className="d-flex justify-content-center align-items-center h-100 position-absolute w-100 z-1">
                 <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText={"We are fetching your Online Cart Please wait..!"}/>
             </div>  
            :
            <BodyComponent allRefs={{ headerRef }} className="body-height position-relative">
                <div className="catalog-body">
                    <div className="col-12 col-xl-4 pe-xl-2 h-100 sticky-product-search">
                        <ProductSearch catalogRestrictedQty={catalogRestrictedQty} getCartInfo={getCartInfo} backDropLoader={backDropLoader} history={props.history} showCartSection={showCartSection} setShowCartSection={setShowCartSection} />
                    </div>
                    {showProductDetails &&
                        <React.Fragment>
                            <label class="d-block d-xl-none py-0 mt-3 font-weight-bold custom-fieldset">Product Details</label>
                            <div className="col-12 col-xl-8 ps-xl-2 h-100">
                                <div className="h-100 border rounded">
                                    <ProductDetails setCatalogRestrictedQty={setCatalogRestrictedQty} history={props.history}/>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                    {showPrescription &&
                        <div className="col-12 col-xl-8 mt-3 mt-xl-0 ps-xl-2 h-100">
                            <div className="h-100 card p-12">
                                <MartCatalogPrescription prescriptionId = {prescriptionId} recordId = {healthRecordId}/>
                            </div>
                        </div>
                    }
                    <CartButton quantity={shoppingCart?.shoppingCartItems?.length} openCartSection={setShowCartSection} />                    
                    {toggleButton && <PrescriptionToggler showPrescription={showPrescription} handlePrescriptionToggle={handleToggle}/>}                    
                </div>
            </BodyComponent>}
        </Wrapper>

    )
}
export default Catalog