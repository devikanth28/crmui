import { useContext, useEffect, useRef, useState } from "react";
import DataGridHelper from "../../../../helpers/DataGridHelper";
import Validate from "../../../../helpers/Validate";
import { AlertContext, CustomerContext, LocalityContext } from "../../../Contexts/UserContext";
import CheckoutService from "../../../../services/Checkout/CheckoutService";
import CurrencyFormatter from "../../../Common/CurrencyFormatter";
import { getCustomerRedirectionURL } from "../../../customer/CustomerHelper";
import DynamicGridHeight from "../../../Common/DynamicGridHeight";
import CommonDataGrid, { ViewIcon } from "@medplus/react-common-components/DataGrid";
import { Link } from "react-router-dom"
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../../../Common/CommonStructure";
import { CRM_UI } from "../../../../services/ServiceConstants";
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import qs from 'qs';
import CustomerLocalitySearchForm from "../../../customer/CustomerLocalitySearchForm";
import UserService from "../../../../services/Common/UserService";


export default (props) => {
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const headerRef = useRef(0);
    const footerRef = useRef(0)
    const validate = Validate();
    const switchProductGrid = DataGridHelper().getSwitchCartDataGrid();
    const { customerId } = useContext(CustomerContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const checkoutService = CheckoutService();
    const [selectedAll, setSelectedAll] = useState(false);
    const [isSwitchAvaliable, setIsSwitchAvailable] = useState(false);
    const [switchProductResponse, setSwitchProductResponse] = useState(undefined);
    const [switchProductDataSet, setSwitchProductDataSet] = useState(undefined);
    const [modifiedProductMap,setModifiedProductMap] = useState(undefined);
    const [switchCartTotal,setSwitchCartTotal] = useState(undefined);
    const [totalPayableAmount,setTotalPayableAmount] = useState(undefined);
    const [isLoading,setIsLoading] = useState(true);
    const [isCartTotalLoading,setIsCartTotalLoading] = useState(undefined);
    const [showCalculateButton, setShowCalculateButton] = useState(false);
    const {setIsLocalityComponentNeeded, setMartLocality} = useContext(LocalityContext);
    const cfpStoreId = props?.location?.state?.cfpStoreId;
    const cfpLocality = props?.location?.state?.cfpLocality;

    useEffect(() => {
        setIsLocalityComponentNeeded(false);
        getSwitchProducts();
         if(validate.isNotEmpty(cfpStoreId) && validate.isNotEmpty(cfpLocality)) {
            selectedLocalityInfo(cfpLocality);
        }
    }, [])

    useEffect(() => {
        if (isSwitchAvaliable) {
            getShoppingCartInfo();
        }
    }, [isSwitchAvaliable])

    const selectedLocalityInfo = (cfpLocalityInfo) => {
        if (validate.isNotEmpty(cfpLocalityInfo) && validate.isNotEmpty(cfpLocalityInfo.split(",")[0]) && validate.isNotEmpty(cfpLocalityInfo.split(",")[1])) {
            const config = { headers: { customerId: customerId }, params: { "locationInfo": { lattitude: cfpLocalityInfo.split(",")[0], longitude: cfpLocalityInfo.split(",")[1] } } }
            UserService().setLocality(config).then(res => {
                if (validate.isNotEmpty(res) && validate.isNotEmpty(res.dataObject) && "SUCCESS" == res.statusCode) {
                    setMartLocality(res.dataObject);
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const prepareSwitchProductsDataset = (cartItems) => {
        const swithDataset = [];
        if (validate.isEmpty(switchProductResponse) || validate.isEmpty(cartItems)) {
            return
        }
        for (var productId in switchProductResponse) {
            let switchProduct = switchProductResponse[productId];
            cartItems.map(eachProduct => {
                if (eachProduct?.productId == productId) {
                    let easchSwitchProduct = {};
                    easchSwitchProduct['requestedProductId'] = productId;
                    easchSwitchProduct['switchProductId'] = switchProduct['productId'];
                    easchSwitchProduct['requestedProductName'] = eachProduct['productName'];
                    easchSwitchProduct['requestedManufacturer'] = eachProduct['manufacturer'];
                    easchSwitchProduct['requestedUnits'] = eachProduct['units'];
                    easchSwitchProduct['requestedPackSize'] = eachProduct['packSize'];
                    easchSwitchProduct['requestedMrp'] = <CurrencyFormatter data={eachProduct['mrp']} decimalPlaces={2} />;
                    easchSwitchProduct['switchProductName'] = switchProduct['productName'];
                    easchSwitchProduct['switchManufacturer'] = switchProduct['manufacturer'];
                    easchSwitchProduct['switchUnits'] = eachProduct['units'];
                    easchSwitchProduct['switchPackSize'] = switchProduct['packSize'];
                    easchSwitchProduct['switchMrp'] = <CurrencyFormatter data={switchProduct['mrp']} decimalPlaces={2} />;
                    easchSwitchProduct['switchSelected'] = false;
                    swithDataset.push(easchSwitchProduct);
                }
            })
        }
        setSwitchProductDataSet(swithDataset);
    }

    const redirectToCatalog=()=>{
        props.history.replace(getCustomerRedirectionURL(customerId, "catalog"));
    }

    const prepareShoppingCartDataSet = (shoppingCartItems) => {
        let cartItems = [];
        shoppingCartItems.map(cartItem => {
            let shoppingCartItem = {}
            shoppingCartItem['productName'] = cartItem['productName'];
            shoppingCartItem['packSize'] = cartItem['packSize'];
            shoppingCartItem['packs'] = cartItem['packSizeQuantity'];
            shoppingCartItem['units'] = cartItem['quantity'];
            shoppingCartItem['mrp'] = cartItem['mrp'];
            shoppingCartItem['restrictedQuantity'] = cartItem['restrictedQuantity'];
            shoppingCartItem['productId'] = cartItem['productId'];
            shoppingCartItem['manufacturer'] = cartItem['manufacturer'];
            cartItems.push(shoppingCartItem)
        })
        return cartItems;
    }

    const setShoppingCartResponse = (shoppingCartResponse) => {
        if (validate.isNotEmpty(shoppingCartResponse) && validate.isNotEmpty(shoppingCartResponse.dataObject) && "SUCCESS" == shoppingCartResponse?.statusCode) {
            let cartItems = prepareShoppingCartDataSet(shoppingCartResponse.dataObject?.shoppingCartItems);
            if(validate.isNotEmpty(shoppingCartResponse.dataObject?.cartSummary?.totalAmount)){
                setTotalPayableAmount(Number(shoppingCartResponse.dataObject?.cartSummary?.totalAmount));
            }
            prepareSwitchProductsDataset(cartItems);
            return;
        } else if (validate.isNotEmpty(shoppingCartResponse) && "FAILURE" == shoppingCartResponse?.statusCode && validate.isNotEmpty(shoppingCartResponse?.message)) {
            setStackedToastContent({ toastMessage: shoppingCartResponse?.message });
        }
        redirectToCatalog();
    }
    const getShoppingCartInfo = async () => {
        setIsLoading(true);
        const shoppingCart = await getShoppingCart();
        setShoppingCartResponse(shoppingCart);
        setIsLoading(false);
    }

    const getShoppingCart = () => {
        return checkoutService.getCartInfo({ headers: { customerId: customerId } });
    }

    const getSwitchProductsData = (params) => {
        return checkoutService.getSwitchProducts({ headers: { customerId },params: params});
    }

    const getSwitchProducts = async () => {
        setIsLoading(true);
        let parameters = {};
        if(validate.isNotEmpty(params) && validate.isNotEmpty(params['isReorder'] && "Y" == params['isReorder'])){
            parameters['isForReorder'] = "Y";
        }
        const switchProductsResponse = await getSwitchProductsData(parameters);
        if (validate.isNotEmpty(switchProductsResponse) && validate.isNotEmpty(switchProductsResponse.dataObject) && "SUCCESS" == switchProductsResponse?.statusCode) {
            setSwitchProductResponse(switchProductsResponse?.dataObject);
            setIsSwitchAvailable(true);
            return;
        }
        setIsLoading(false);
        props.history.replace(getCustomerRedirectionURL(customerId, "checkout/shoppingCart"));
    }

    const modifyMiniCart=()=>{
        return checkoutService.modifyMiniCart({headers:{customerId:customerId},params:{"switchProductsMap":modifiedProductMap}});
    }

    const updateIsProductChecked = (productId, isSelected, isFromSelectAll) => {
        let updatedSwitchDataset = switchProductDataSet;
        updatedSwitchDataset = updatedSwitchDataset.map(eachSwitchData => {
            if (validate.isNotEmpty(productId) && eachSwitchData['requestedProductId'] == productId) {
                eachSwitchData['switchSelected'] = isSelected;
                return eachSwitchData;
            } else if (isFromSelectAll) {
                eachSwitchData['switchSelected'] = isSelected;
                return eachSwitchData;
            } else {
                return eachSwitchData;
            }
        })
        let selectedCount = 0;
        let productMap = {};
        updatedSwitchDataset.map(eachSwitchData=>{
            if(eachSwitchData['switchSelected']){
                selectedCount+=1;
                productMap[eachSwitchData['requestedProductId']]=eachSwitchData['switchProductId'];
            }
        })
        setModifiedProductMap(productMap);
        setShowCalculateButton(validate.isNotEmpty(productMap));
        if(updatedSwitchDataset.length==selectedCount){
            setSelectedAll(true);
        }else{
            setSelectedAll(false);
        }
        setSwitchProductDataSet(updatedSwitchDataset);
    }

    const handleSelect = (e, row) => {
        const isSelected = e.target.checked;
        updateIsProductChecked(row['requestedProductId'], isSelected, false);
    }

    const handleSelectAll = (e) => {
        const isSelected = e.target.checked;
        updateIsProductChecked(undefined, isSelected, true);
        setSelectedAll(isSelected);
    }

    const getCartTotal=()=>{
        return checkoutService.getSwitchCartTotal({headers:{customerId},params:{productMap:modifiedProductMap}});
    }

    const getSwicthCartTotal=async()=>{
        if(isCartTotalLoading){
            return;
        }
        setIsCartTotalLoading(true);
        const switchCartTotalResponse = await getCartTotal();
        if (validate.isNotEmpty(switchCartTotalResponse) && validate.isNotEmpty(switchCartTotalResponse.dataObject) && "SUCCESS" == switchCartTotalResponse?.statusCode) {
            setSwitchCartTotal(Number(switchCartTotalResponse.dataObject));
            setShowCalculateButton(false);
        }
        setIsCartTotalLoading(false);
    }

    const handleProceedToCheckout=async()=>{
        let modifyCartResponse = undefined;
        if(validate.isNotEmpty(modifiedProductMap)){
            modifyCartResponse = await modifyMiniCart();
        }
        if (validate.isNotEmpty(modifyCartResponse) && validate.isNotEmpty(modifyCartResponse.statusCode) && "SUCCESS" == modifyCartResponse.statusCode) {
            props.history.replace(getCustomerRedirectionURL(customerId, "checkout/shoppingcart"));
        }else if(validate.isNotEmpty(modifyCartResponse) && "FAILURE"==modifyCartResponse.statusCode){
            setStackedToastContent({toastMessage:validate.isNotEmpty(modifyCartResponse.message)});
        }else{
            props.history.replace(getCustomerRedirectionURL(customerId, "checkout/shoppingcart"));
        }
    }

    const renderActionHeader = () => {
        return <input className="form-check-input" type="checkbox" id="selectAll" checked={selectedAll} onClick={(e) => { handleSelectAll(e) }} />
    }

    const renderActionColumn = ({ row }) => {
        return <input className="form-check-input" type="checkbox" id={`checkBox_${row['rowIndex']}`} checked={row['switchSelected']} onClick={(e) => { handleSelect(e, row) }} />
    }

    const redirectToRequestedProductDetail = ({ row, column }) => {
        return <Link to={`${CRM_UI}/customer/${customerId}/catalog/${row.requestedProductId}`} title={'See Product'} className="btn btn-link bg-transparent w-100 p-0 text-start pointer" role="link">
            {row[column.key]}
        </Link>
    }

    const redirectToSWitchProductDetail = ({ row, column }) => {
        return <Link to={`${CRM_UI}/customer/${customerId}/catalog/${row.switchProductId}`} title={'See Product'} className="btn btn-link bg-transparent w-100 p-0 text-start pointer" role="link">
            {row[column.key]}
        </Link>
    }

    const renderArrowIcon=()=>{
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style={{rotate: "180deg"}}>
            <g id="back-arrow-icn-16" transform="translate(-125 -84)">
                <rect id="Rectangle_10430" data-name="Rectangle 10430" width="16" height="16" rx="3" transform="translate(125 84)" fill="none" />
                <path id="blue-arrow-icn" d="M54.872,319.236a.534.534,0,0,0-.348.139L49.1,324.453a.547.547,0,0,0,0,.765l5.426,5.009a.551.551,0,0,0,.765-.069.546.546,0,0,0,0-.765l-4.313-4.035H62.385a.557.557,0,1,0,0-1.113H50.976l4.383-4.035a.494.494,0,0,0,.209-.417.991.991,0,0,0-.139-.418A3.142,3.142,0,0,0,54.872,319.236Z" transform="translate(77.059 -232.736)" fill="#1c3ffd" />
            </g>
        </svg>
    }

    const CallBackMapping = {
        'renderActionHeader': renderActionHeader,
        'renderActionColumn': renderActionColumn,
        'openRequestedProductDetails': redirectToRequestedProductDetail,
        'openSwitchProductDetails' : redirectToSWitchProductDetail,
        'renderArrowIcon' : renderArrowIcon
    }

    return (
        <Wrapper>
            <HeaderComponent className={"border-bottom"} ref={headerRef}>
                <div className="d-flex align-items-center justify-content-between p-12">
                    <p className="mb-0">Switch Products</p>
                </div>
            </HeaderComponent>
            <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height p-0" loading={isLoading}>
                {validate.isNotEmpty(switchProductDataSet) && validate.isNotEmpty(switchProductGrid) && <div><label class="d-block pb-0 p-12 font-weight-bold custom-fieldset">Products ready for switch</label>
                    <div className='p-12 pb-0'>
                        <div className={`card me-0 `}>
                            <DynamicGridHeight id="switchproduct-datagrid" className="block-size-100" metaData={switchProductGrid} dataSet={switchProductDataSet} >
                                <CommonDataGrid {...switchProductGrid} dataSet={switchProductDataSet} callBackMap={CallBackMapping} />
                            </DynamicGridHeight>
                            <div className="card-footer bg-white">
                                <div className="row g-0 justify-content-end">
                                    {showCalculateButton && <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 d-flex justify-content-end justify-content-lg-start mb-4 mb-lg-0"><div><button className="btn btn-sm brand-secondary px-3" onClick={() => {getSwicthCartTotal()}}>{isCartTotalLoading?<CustomSpinners spinnerText={"Calculate Cart Total"} className={" spinner-position"} innerClass={"invisible"} />:'Calculate Cart Total'}</button></div></div>} 
                                    {validate.isNotEmpty(totalPayableAmount) && <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 d-flex flex-column text-end font-weight-bold pt-1">
                                        <p className="d-flex flex-wrap justify-content-end mb-1"><div className="col-6">Cart Total</div><div className="col-6 col-lg-4"><CurrencyFormatter data={totalPayableAmount} decimalPlaces={2} /></div></p>
                                        {validate.isNotEmpty(switchCartTotal) && <>
                                            <p className="d-flex flex-wrap justify-content-end mb-1"><div className="col-6">Switch Cart Total</div><div className="col-6 col-lg-4"><CurrencyFormatter data={switchCartTotal} decimalPlaces={2} /></div></p>
                                            <p className="d-flex flex-wrap justify-content-end mb-1"><div className="col-6">Total savings on Switch Cart</div><div className="col-6 col-lg-4"><CurrencyFormatter data={totalPayableAmount - switchCartTotal} decimalPlaces={2} /></div></p>
                                        </>
                                        }
                                    </div>}
                                </div>                    
                            </div>
                        </div>
                    </div>
                </div>}                
            </BodyComponent>
            <FooterComponent className="footer p-3" ref={footerRef}>
                <div className="d-flex align-items-center justify-content-end">
                    <button className="btn btn-sm brand-secondary px-3" onClick={() => {redirectToCatalog()}}>Continue Shopping</button>
                    <button className="btn btn-sm btn-brand px-3 ms-3" onClick={() => {handleProceedToCheckout()}}>Proceed to checkout</button>
                </div>
            </FooterComponent>
        </Wrapper>
    )
}