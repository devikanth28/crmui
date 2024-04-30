import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import { ALERT_TYPE, CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TabContent, TabPane } from "reactstrap";
import DataGridHelper from "../../../helpers/DataGridHelper";
import Validate from '../../../helpers/Validate';
import CatalogService from '../../../services/Catalog/CatalogService';
import { BodyComponent, HeaderComponent } from '../../Common/CommonStructure';
import CurrencyFormatter from "../../Common/CurrencyFormatter";
import DynamicGridHeight from "../../Common/DynamicGridHeight";
import NavTabs from '../../Common/NavTabs';
import NoDataFound from '../../Common/NoDataFound';
import { AlertContext, CustomerContext, LocalityContext, ShoppingCartContext } from '../../Contexts/UserContext';
import { MEDPLUS_ADVANTAGE } from "../../customer/Constants/CustomerConstants";
import { getCustomerRedirectionURL } from "../../customer/CustomerHelper";
import { RedirectToProductDetail } from "../RedirectToProductDetail";
import AddToBag from "./AddToBagDynamicForm";
import MoleculeInfo from './MoleculeInfo';
import NearByStores from "./NearByStores";
import SuggestedProducts from './SuggestedProduct';


const ProductDetails = (props) => {
    const validate = Validate()
    const productAlternatives = DataGridHelper().productAlternatives();
    const headerRef = useRef(null);
    const {setAlertContent, setStackedToastContent } = useContext(AlertContext)
    const { customerId } = useContext(CustomerContext)
    const [initialLoader, setInitialLoader] = useState(true)
    const [tabId, setTabId] = useState('1')
    const catalogService = CatalogService();
    const [productInfo, setProductInfo] = useState({});
    const [locationETAInfo, setLocationETAInfo] = useState({});
    const [moleculeInfo, setMoleculeInfo] = useState({})
    const [tabs, setTabs] = useState([])
    const [alternateProductInfo, setAlternateProductInfo] = useState({});
    const [productDetailInfo, setProductDetailInfo] = useState(undefined)
    const { martLocality } = useContext(LocalityContext)
    const [showRequestProduct, setShowRequestProduct] = useState(false);
    const [requestedQty, setRequestedQty] = useState('');
    const [isNotifingProduct, setIsNotifingProduct] = useState(false);
    const [suggestedAlternativeProduct, setSuggestedAlternattiveProduct]=useState(undefined);
    const [suggestedAlternativeProductDiscountInfo, setSuggestedAlternattiveProductDiscountInfo] = useState(undefined);
    const [bestPharmaPlanInfo, setBestPharmaPlanInfo]=useState(undefined);
    const [productQuantities, setProductQuantities] = useState({})
    const [openLocationsModel, setOpenLocationsModel] = useState(false);
    const [deliveryInfoAvailable, setDeliveryInfoAvailable] = useState(false); 
    const [storeInfo, setNearByStores] = useState({});  
    const [alternateProductIds, setlternateProductIds] = useState([])
    const {setProductId, productId} = useContext(ShoppingCartContext) 

    useEffect(() => {
        if(productId){
            getProductDetails(productId);
        }
    }, [productId])

    useEffect(() => {
        checkIfDeliveryInfoAvailable();
      }, [martLocality, productDetailInfo]);

    const handleTabId = (tabId) => {
        let numToString = tabId.toString();
        setTabId(numToString)
    }
    const callBackMapping = {
        renderStatusColumn,
        renderProductNameColumn
    }

    function renderStatusColumn(props) {     
    	if(validate.isEmpty(props.row.price)){
            return <div>-</div>
        }   
        return <div className={`d-flex justify-content-end align-items-center ${props.row.price > 0 ? 'text-success' : props.row.price < 0 ? 'text-brand' : ''}`}>
                    <span>{Math.abs(props.row.price).toFixed(1)} %</span>
                    {props.row.price != 0 && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" style={props.row.price > 0 ? {transform: "rotate(180deg)"} : {}}><g id="bottomcaret_black_icon_18px" transform="translate(-762.18 -983.18)"><rect id="Rectangle_4719" data-name="Rectangle 4719" width="18" height="18" transform="translate(780.18 1001.18) rotate(180)" fill="none"></rect><path id="Path_23398" data-name="Path 23398" d="M61.248,563.964a.367.367,0,0,1-.538,0l-2.416-2.808L56.008,558.5c-.165-.192-.007-.465.269-.465h9.4c.277,0,.434.273.269.465l-2.284,2.655Z" transform="translate(710.133 431.054)" fill={props.row.price > 0 ? "#08CE73" : "#E71C37"}></path></g></svg>}
                </div>
    }
    const goToAlternameProductDetails = (productName) => {
        let alternateProductId = "";
    
        if (validate.isNotEmpty(alternateProductInfo)) {
            const selectedAlternativeProduct = alternateProductInfo.find(product => product.productName === productName);
            if (selectedAlternativeProduct) {
                alternateProductId = selectedAlternativeProduct.productId;
                setProductId(alternateProductId)
                RedirectToProductDetail(alternateProductId, customerId,props.history)
            }
        }
    }
    

    function renderProductNameColumn(props) {
        return <>
            <a className="btn btn-link bg-transparent w-100 p-0 text-start pointer" href="javascript:void(0)" rel="noopener" aria-label={props.row.productName} role="link" title={props.row.productName} onClick={() => goToAlternameProductDetails(props.row.productName)}>{props.row.productName}</a>
        </>

    }

    const getAlternateProductInfo = async (obj) => {
        return await catalogService.getAlternateProductsInfo(obj).then((data) => {
            if (data && validate.isNotEmpty(data.dataObject) && data.statusCode === "SUCCESS") {
               setAlternateProductInfo([...alternateProductInfo,...data.dataObject.alternateProducts])
               return data.dataObject.alternateProducts;
            } else if (data && data.statusCode === "FAILURE") {
                setStackedToastContent({ toastMessage: data.message });
                return [];
            } 
        }).catch((err) => {
            setStackedToastContent({ toastMessage: "Unable to get follow up details , Please try again" });
            return [];
        });
    }

    const remoteDataFunction = async( {startIndex, limit, filters, pageNumber, changeType }) => {
        const requestedProductIds = alternateProductIds.slice(startIndex , startIndex+limit);
        const alternateDataParams = { productId: productInfo.productId, pageNo: (startIndex/limit)+1, recordsPerPage: limit ,maxRecords: 999, alternateProductIds: JSON.stringify(requestedProductIds), suggestedAlternativeRequired: validate.isNotEmpty(productDetailInfo.membershipPrice) ? 'N' :'Y' } 
        const data = Object.keys(alternateDataParams)
            .map((key) => `${key}=${encodeURIComponent(alternateDataParams[key])}`)
            .join('&');
        const config = { headers: { customerId }, data }
        const response =await getAlternateProductInfo(config);
        if(validate.isEmpty(response)) {
            return {status : false}
        }
        return {dataSet: response , totalRowsCount: alternateProductIds.length, status : true}

    }
    const getAlternateProducts = (config) => {
        catalogService.getAlternateProductsInfo(config).then((res) => {
            if (validate.isNotEmpty(res) && validate.isNotEmpty(res.dataObject) && "SUCCESS" === res.statusCode) {
                setlternateProductIds(res.dataObject.alternateProductIds)
                setAlternateProductInfo(res.dataObject.alternateProducts);
                suggestedAlternativeProductData(res.dataObject.suggestedAlternativeProduct, res.dataObject.suggestedAlternativeProductDiscountInfo)
            }else if (res && res.statusCode === "FAILURE"){
                suggestedAlternativeProductData(null,null)
                setAlternateProductInfo({})
                setlternateProductIds([])
            }
            setInitialLoader(false);
        }).catch((error) => {
            console.log(error);

            setStackedToastContent({ toastMessage: "Something went wrong while getting alternate Product Info..!" });
            setInitialLoader(false);
        });
    }

    const getProductDetails = (productId) => {
        setProductId(productId)
        const config = { headers: { customerId: customerId }, params: { productId: productId } }
        setInitialLoader(true);
        catalogService.getProductDetail(config).then(res => {
            if (validate.isNotEmpty(res) && Validate().isNotEmpty(res.dataObject) && Validate().isNotEmpty(res.statusCode) && "SUCCESS" == res.statusCode) {
                setProductDetailInfo(res.dataObject)
                setProductInfo(validate.isNotEmpty(res.dataObject.product) ? res.dataObject.product : {});
                setQuantity('');
                setShowRequestProduct(false);
                getLocationETAInfo();
                const bestPharmaPlanInfo = {};
                bestPharmaPlanInfo.price = res.dataObject.bestPharmaPlanPrice;
                bestPharmaPlanInfo.planName=res.dataObject.bestPharmaPlanName;
                bestPharmaPlanInfo.planId=res.dataObject.bestPharmaPlanId;
                setBestPharmaPlanInfo(bestPharmaPlanInfo);
                const moleculeInfo = res.dataObject.moleculesInfo
                const transformedData = {};
                if (validate.isNotEmpty(moleculeInfo)) {
                    moleculeInfo.forEach((each) => {
                        const { moleculeName_s, ...restOfData } = each;
                        transformedData[moleculeName_s] = restOfData;
                    });
                }
                setMoleculeInfo(transformedData)
                setTabs(transformedData ? Object.keys(transformedData) : []);
                if (validate.isNotEmpty(res.dataObject.product)) {
                    const config = { headers: { customerId }, params: { productId: res.dataObject.product.id, pageNo: 1, recordsPerPage: 10, maxRecords: 999, alternateProductIds: [] , suggestedAlternativeRequired: validate.isNotEmpty(res.dataObject.membershipPrice) ? 'N' :'Y'} }
                    getAlternateProducts(config);
                }
                setNearByStores(validate.isNotEmpty(res.dataObject.prodAvailStore)? JSON.parse(res.dataObject.prodAvailStore): {})
            }
            if ("FAILURE" === res.statusCode && validate.isNotEmpty(res.message)) {
                setStackedToastContent({ toastMessage: res.message });
                setInitialLoader(false);
            }
        }).catch((error) => {
            setStackedToastContent({ toastMessage: "Unable to get Product details" });
            setInitialLoader(false);
            console.log(error);
        });
    }

    const getLocationETAInfo = () => {
        const config = { headers: { customerId: customerId } }
        catalogService.getLocationETAInfo(config).then(res => {
            if (validate.isNotEmpty(res) && validate.isNotEmpty(res.dataObject) && validate.isNotEmpty(res.statusCode) && "SUCCESS" === res.statusCode) {
                setLocationETAInfo(validate.isNotEmpty(res.dataObject) ? res.dataObject : {});
            } else if ("FAILURE" === res.statusCode && validate.isNotEmpty(res.message)) {
                setStackedToastContent({toastMessage: res.message});
            }
        }).catch(error => {
            setStackedToastContent({toastMessage: "Could not get details for Estimated Time of Arrival"});
            console.log("error occured in LocationETA calculation ", error);
            setInitialLoader(false);
        })
    }

    const truncateDecimals = (number, digits) => {
        const multiplier = Math.pow(10, digits);
        const adjustedNum = number * multiplier;
        const truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);
        return truncatedNum / multiplier;
    };

    const getAlternativeProductDetails = () => {
        const filteredAlternativeProducts = [];
        alternateProductInfo.forEach(product => {
            const { productName, manufacturer, auditForm, packSize, packSizeMrp, price , productId} = product;
            const filteredProduct = {
                productName,
                manufacturer,
                auditForm,
                packSize,
                packSizeMrp,
                price,
                productId
            };
            filteredAlternativeProducts.push(filteredProduct);
        });
        return filteredAlternativeProducts;
    }

    const showProductOtherMsgs = () => {
        if (validate.isNotEmpty(productDetailInfo.isDiscontinued) && validate.isNotEmpty(productDetailInfo.productMessages) && (validate.isNotEmpty(productInfo.productReasons) && productInfo.productReasons.indexOf('MSG_10004') == -1)) {
            return true
        } else if (validate.isNotEmpty(productDetailInfo.productMessages) && validate.isNotEmpty(productDetailInfo.isShortSupply)) {
            return false
        } else if (validate.isNotEmpty(productDetailInfo.replacementProduct)) {
            return true
        }
    }

    const showRequestProductInput = () => {
        setShowRequestProduct(true);
    }

    const setQuantity = (qty) => {
        const numberpattern = /^[0-9\b]+$/;
        if (qty === '' || numberpattern.test(qty)) {
        setRequestedQty(qty);
        }
    }

    const requestProduct = (productId, requestedQty) => {
        if (validate.isEmpty(requestedQty) || isNaN(requestedQty) || 0 >= parseInt(requestedQty) || 99 < parseInt(requestedQty)) {
            setStackedToastContent({toastMessage:"Please Enter valid quantity for this product"});
            return false;
        }
        setIsNotifingProduct(true);
        const config = { headers: { customerId : customerId,}, params: { productId, requestedQty} }
        catalogService.productNotifyMe(config).then(response => {
            if (validate.isNotEmpty(response) && response.statusCode === "SUCCESS") {
                setAlertContent({ alertMessage: "Product requisition successfull. We will reply back to your Email Id / Mobile on stock availability", show: true, alertType: ALERT_TYPE.SUCCESS })
            }else if (validate.isNotEmpty(response) && response.statusCode === "WARNING") {
                setAlertContent({ alertMessage: response.message, show: true, alertType: ALERT_TYPE.SUCCESS })
            }
             else {
                if (response.message == "Product already notified") {
                    setStackedToastContent({toastMessage:"You have already requested to notify for this product"});
                }
                else {
                    setStackedToastContent({toastMessage:response.message});
                }
            }
        setIsNotifingProduct(false);    
        setShowRequestProduct(false)
        }).catch(function (error) {
            console.log(error);
            setIsNotifingProduct(false);
            setShowRequestProduct(false)
        });
    }

    const suggestedAlternativeProductData = (product, discountInfo) => {
        setSuggestedAlternattiveProduct(validate.isNotEmpty(product) ? [product] : undefined);
        setSuggestedAlternattiveProductDiscountInfo(discountInfo ? [discountInfo] : undefined);
    }

    const checkIfDeliveryInfoAvailable = () => {
        const hubStoreId = validate.isNotEmpty(martLocality.hubId) ? martLocality.hubId : "";
        const wareHouseId = validate.isNotEmpty(martLocality.wareHouseId) ? martLocality.wareHouseId : "";
        const intermediateWareHouseId = validate.isNotEmpty(martLocality.intermediateWareHouseId) ? martLocality.intermediateWareHouseId : "";
        const productQtyinHub = validate.isNotEmpty(productDetailInfo?.availableQtyInStores) ? productDetailInfo?.availableQtyInStores[hubStoreId] : 0;
        const productQtyinWareHouse = validate.isNotEmpty(productDetailInfo?.availableQtyInStores) ? productDetailInfo?.availableQtyInStores[wareHouseId] : 0;
        const productQtyInIntermediateWareHouse = validate.isNotEmpty(productDetailInfo?.availableQtyInStores) ? productDetailInfo?.availableQtyInStores[intermediateWareHouseId] : 0;
      
        let productQuantities = {
          "productQtyinHub": productQtyinHub,
          "productQtyinWareHouse": productQtyinWareHouse,
          "productQtyInIntermediateWareHouse": productQtyInIntermediateWareHouse
        };
      
        setProductQuantities(productQuantities);
      
        const isDeliveryAvailable =
          validate.isNotEmpty(productDetailInfo?.deliveryInfo) ||
          (validate.isNotEmpty(martLocality?.hubId) && productQtyinHub > 0) ||
          (validate.isNotEmpty(martLocality?.intermediateWareHouseId) && productQtyInIntermediateWareHouse > 0) ||
          (validate.isNotEmpty(martLocality?.wareHouseId) && productQtyinWareHouse > 0) ||
          (validate.isNotEmpty(productDetailInfo?.wareHouseInfo) && productDetailInfo?.wareHouseInfo.AVAILABLE_QUANTITY > 0);
      
        setDeliveryInfoAvailable(isDeliveryAvailable);
      };


    return (
        <div className="h-100">
            {initialLoader ? <div className="d-flex justify-content-center align-items-center h-100 p-4">
                <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText={"Please be patient while we prepare your data for loading!"} />
            </div>
                : validate.isEmpty(productDetailInfo) ?
                    <NoDataFound text={"Unable to get product details. Please try again..!"} />
                    :
                    <React.Fragment>
                        <HeaderComponent ref={headerRef} className="d-flex flex-column flex-lg-row align-items-lg-center align-items-start gap-3 gap-lg-0 justify-content-between border-bottom p-12">
                            <div className="col">
                                <p className="mb-0 font-12 text-secondary">{productInfo.manufacturer}</p>
                                <p className="mb-0 font-weight-bold" id='productNametooltip'>{productInfo.productName}<span className="ms-1">{` - ${productInfo.productId}`}</span></p>
                            </div>
                            <button type="button" class="align-self-end align-self-lg-center btn btn-sm brand-secondary px-4 py-2" onClick={() => { props.history.push(getCustomerRedirectionURL(customerId, MEDPLUS_ADVANTAGE)) }}>View MedPlus Advantage Plans</button>
                        </HeaderComponent>
                        {/* body section begins */}
                        <BodyComponent allRefs={{ headerRef }} className="body-height p-0">
                            <div className="d-flex flex-column flex-xl-row">
                                <div className={`col-12 ${validate.isEmpty(productDetailInfo.membershipPrice) && validate.isNotEmpty(suggestedAlternativeProduct) ? "col-xl-7" : "col-xl-12"} p-12`}>
                                    <div className="row g-3 mb-3">
                                        {productInfo.isGeneral === 'N' && validate.isNotEmpty(productInfo.compositionName) && productInfo.compositionName !== "Not Available"  &&<div className="col-12 col-lg-9">
                                            <label className="font-12 text-secondary">Composition</label>
                                            <p className="mb-0 font-weight-bold" id='compositionName'>{productInfo.compositionName}</p>
                                        </div>}
                                        {productInfo.drugSchedule && (productInfo.drugSchedule.includes('H') || productInfo.drugSchedule.includes('H1') || productInfo.drugSchedule.includes('X')) &&
                                            <div className="col-12 col-lg-3">
                                                <label className="font-12 text-secondary">Drug Schedule</label>
                                                <p className="mb-0 font-weight-bold text-red">
                                                    <span>{productInfo.drugSchedule.join(', ')}</span>
                                                </p>
                                            </div>}
                                        <div className="col-6 col-lg-3">
                                            <label className="font-12 text-secondary">Pack Size</label>
                                            <p className="mb-0 font-weight-bold">{productInfo.packSize} Units / Pack</p>
                                        </div>
                                        {validate.isEmpty(productDetailInfo.membershipPrice) && <div className="col-6 col-lg-3">
                                            <label className="font-12 text-secondary">MRP / Pack</label>
                                            <p className="mb-0 font-weight-bold "><CurrencyFormatter data={productInfo.packSizeMrp} decimalPlaces={2} /></p>
                                        </div>}
                                        {productDetailInfo.membershipPrice && <div className="col-6 col-lg-3">
                                            <label className="font-12 text-secondary">Member Price</label>
                                            <div className="d-flex align-items-center">
                                                <p className="mb-0 text-secondary font-weight-bold me-2"><del><CurrencyFormatter data={productInfo.packSizeMrp} decimalPlaces={2} /></del></p>
                                                <p className="mb-0 font-weight-bold "><CurrencyFormatter data={productDetailInfo.membershipPrice} decimalPlaces={-1} /></p>
                                            </div>
                                        </div>}
                                        {!productDetailInfo.membershipPrice && productInfo.discountPercent > 0 && <div className="col-6 col-lg-3">
                                            <label className="font-12 text-secondary">Unit Price</label>
                                            <p className="mb-0 font-weight-bold "><CurrencyFormatter data={productInfo.mrp * (100 - productInfo.discountPercent) / 100.0 !== null ? parseFloat(productInfo.mrp * (100 - productInfo.discountPercent) / 100.0) : ''} decimalPlaces={2} /></p>
                                        </div>}
                                        {productInfo.discountPercent > 0 && <div className="col-6 col-lg-3">
                                            <label className="font-12 text-secondary">{productDetailInfo.membershipPrice ? "Regular Discount" : "Discount"}</label>
                                            <p className="mb-0 font-weight-bold">
                                                {productInfo.discountAmount > 0 ? (`Off Rs:${truncateDecimals(productInfo.discountAmount, 2)}`) : (`${truncateDecimals(productInfo.discountPercent, 2)}%`)
                                                }
                                            </p>
                                        </div>}                                        
                                    </div>
                                    <div className="row">
                                        {(validate.isNotEmpty(productDetailInfo.hubStatus) && productDetailInfo.hubStatus != "TRUE" && validate.isNotEmpty(productInfo.packSizeMrp) && productInfo.packSizeMrp !== 0) &&
                                            <div className='position-relative'>
                                                <svg id="note_black_icon_18px" xmlns="http://www.w3.org/2000/svg" className='position-absolute' style={{ "top": "0.25rem" }} width="18" height="18" viewBox="0 0 18 18"><path id="Icon_awesome-info-circle" data-name="Icon awesome-info-circle" d="M9.563.563a9,9,0,1,0,9,9A9,9,0,0,0,9.563.563Zm0,3.992A1.524,1.524,0,1,1,8.038,6.079,1.524,1.524,0,0,1,9.563,4.554Zm2.032,9.218a.436.436,0,0,1-.435.435H7.966a.436.436,0,0,1-.435-.435V12.9a.436.436,0,0,1,.435-.435H8.4V10.143H7.966a.436.436,0,0,1-.435-.435V8.837A.436.436,0,0,1,7.966,8.4h2.323a.436.436,0,0,1,.435.435v3.629h.435a.436.436,0,0,1,.435.435Z" transform="translate(-0.563 -0.563)"></path></svg>
                                                <p className='px-4 m-lg-1'>Our services are not currently available in this location.</p>
                                            </div>}
                                        <div className={`col-12 ${validate.isEmpty(productDetailInfo.membershipPrice) && validate.isNotEmpty(suggestedAlternativeProduct) ? "col-xl-12" : "col-xl-7"} mt-0`}>
                                            <AddToBag setCatalogRestrictedQty={props.setCatalogRestrictedQty} key={productInfo.productId} productDetailInfo={productDetailInfo} getProductDetails={getProductDetails} history={props.history}></AddToBag>
                                        </div>
                                        
                                        <div className={`col-12 ${validate.isEmpty(productDetailInfo.membershipPrice) && validate.isNotEmpty(suggestedAlternativeProduct) ? "col-xl-12" : "col-xl-7"} mt-0`}>                                            
                                            {(productInfo.purchaseStatus === "A" && validate.isNotEmpty(martLocality.wareHouseId)) && !((productInfo.isInStock) && (productDetailInfo.availQty > 0) && (validate.isNotEmpty(productInfo.isSellable) && productInfo.isSellable === "Y") && (validate.isNotEmpty(productInfo.packSizeMrp) && productInfo.packSizeMrp > 0)) && validate.isNotEmpty(productInfo) &&
                                                <div className="row">
                                                    <div>
                                                        <button className="btn btn-outline-warning" onClick={showRequestProductInput} disabled={showRequestProduct}>
                                                            Out of Stock - Get Notified
                                                        </button>
                                                    </div>
                                                    {showRequestProduct &&
                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex align-itens-center flex-wrap mt-3">
                                                        <div className="col-12 col-lg-6 col-md-6 col-sm-6 col-xl-6 col-xxl-6 form-floating col me-2">
                                                            <input className="form-control" id="orderQty" type="text" placeholder=" " value={requestedQty} onChange={(e) => setQuantity(e.target.value)} maxLength={2} />
                                                            <label for="orderQty">Enter quantity</label>
                                                        </div>
                                                        <button className="col-12 col-lg-4 col-md-4 col-sm-4 col-xl-4 col-xxl-4 btn btn-sm btn-success mt-2 mt-sm-0" onClick={() => requestProduct(productInfo.productId, requestedQty)} disabled = {isNotifingProduct} style={{height: "50px"}}>{ isNotifingProduct?  <CustomSpinners spinnerText={"Notified Product"} className={" spinner-position"} innerClass={"invisible"} />:"Submit"}</button>
                                                    </div>}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {validate.isEmpty(productDetailInfo.membershipPrice) && validate.isNotEmpty(suggestedAlternativeProduct) && <div className='col-12 col-xl-5 p-12'>
                                    <SuggestedProducts getProductDetail={getProductDetails} suggestedAlternativeProduct={suggestedAlternativeProduct} suggestedAlternativeProductDiscountInfo={suggestedAlternativeProductDiscountInfo} bestPharmaPlanInfo={bestPharmaPlanInfo} history={props.history}/>
                                </div>}
                            </div>
                            <hr className="border-style-dashed my-2" />
                            <div className="p-12 pb-0">
                                <div className="d-flex justify-content-between flex-wrap flex-xl-nowrap">
                                    {validate.isNotEmpty(storeInfo) && <div className="flex-grow-1 flex-shrink-1 pointer" onClick={() => {setOpenLocationsModel(true)}}>
                                        <div className="d-flex align-items-center p-12 border border-primary rounded h-100">
                                            <div className="me-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="11.564" height="16" viewBox="0 0 11.564 16"><g id="reset_black_icon_16px" transform="translate(-2.476 -1)"><g id="Group_34581" data-name="Group 34581" transform="translate(2.476 1)">
                                                    <path id="Union_130" data-name="Union 130" d="M.658,8.283a5.737,5.737,0,0,1,.909-6.62A5.626,5.626,0,0,1,5.719,0H5.88A5.613,5.613,0,0,1,10,1.662a5.738,5.738,0,0,1,.908,6.62A69.415,69.415,0,0,1,5.768,16,70.906,70.906,0,0,1,.658,8.283ZM2.32,2.38A4.693,4.693,0,0,0,1.58,7.8a60.9,60.9,0,0,0,4.191,6.457A59.581,59.581,0,0,0,9.985,7.8,4.7,4.7,0,0,0,9.244,2.38,4.507,4.507,0,0,0,5.88,1.04H5.719A4.494,4.494,0,0,0,2.32,2.38Zm.731,3.164a2.73,2.73,0,1,1,2.73,2.731A2.731,2.731,0,0,1,3.051,5.544Zm1.039,0A1.691,1.691,0,1,0,5.782,3.853,1.693,1.693,0,0,0,4.091,5.544Z" transform="translate(0)" fill="#080808"></path>
                                                </g></g>
                                                </svg>
                                            </div>
                                            <p class="mb-0 font-14 text-wrap">Also available at the following stores near you</p>
                                        </div>
                                    </div>}
                                    {validate.isNotEmpty(storeInfo) && <NearByStores productName={productInfo.productName} storeInfo={storeInfo} openlocationflag={openLocationsModel} setOpenlocationflag={setOpenLocationsModel} />}
                                    {((validate.isNotEmpty(productDetailInfo.productPromotion) && validate.isNotEmpty(productDetailInfo.hideSlabDetails) && false === productDetailInfo.hideSlabDetails) || (validate.isNotEmpty(productDetailInfo.productPromotion) && validate.isNotEmpty(productDetailInfo.productPromotion.specialPromotionRanges) && validate.isNotEmpty(productDetailInfo.hideSlabDetails) && true === productDetailInfo.hideSlabDetails)) &&
                                        <div className="col-12 col-xl-7 ps-0 ps-xl-3 pt-3 pt-xl-0">
                                            <div class="d-flex align-items-center p-12 border border-success border rounded w-100 h-100">
                                                <div class="me-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15.998" viewBox="0 0 16 15.998">
                                                        <g id="reset_black_icon_16px" transform="translate(-2 -2)">
                                                            <path id="np_promotion_5208886_000000" d="M15.511,7.5a1.144,1.144,0,0,0-.615.2c-.18.1-.362.218-.535.337s-.338.238-.476.327a2.456,2.456,0,0,1-.251.138h-.285c-.163,0-.367-.025-.577-.042a5.393,5.393,0,0,0-.632-.027,1.1,1.1,0,0,0-.629.136,1.168,1.168,0,0,0-.438.479c-.107.176-.2.37-.292.56s-.176.376-.25.521c-.067.13-.138.232-.146.246s-.117.079-.246.146-.332.159-.521.25a6.284,6.284,0,0,0-.56.292,1.149,1.149,0,0,0-.476.435,1.163,1.163,0,0,0-.138.632c0,.205.021.423.027.632s.034.413.042.577v.285a1.183,1.183,0,0,1-.138.247c-.088.138-.207.306-.327.479s-.238.352-.337.532a1.171,1.171,0,0,0-.2.618,1.144,1.144,0,0,0,.2.615c.1.18.218.358.337.532s.238.342.327.479c.077.121.13.238.138.25a1.215,1.215,0,0,1,0,.285c0,.163-.025.367-.042.577a5.331,5.331,0,0,0-.027.629,1.107,1.107,0,0,0,.138.632,1.15,1.15,0,0,0,.476.435c.176.107.37.2.56.292s.376.178.521.254c.13.067.235.14.246.146s.079.115.146.243c.075.146.159.332.25.521a6.283,6.283,0,0,0,.292.56,1.173,1.173,0,0,0,.438.479,1.151,1.151,0,0,0,.629.138c.205,0,.423-.021.632-.027s.413-.034.577-.042h.285a2.53,2.53,0,0,1,.251.138c.138.088.3.207.476.327s.355.238.535.337a1.052,1.052,0,0,0,1.23,0c.18-.1.362-.218.535-.337s.338-.238.477-.327a2.457,2.457,0,0,1,.251-.138,1.177,1.177,0,0,1,.285,0c.163,0,.367.025.577.042a5.4,5.4,0,0,0,.632.027,1.094,1.094,0,0,0,.629-.138,1.161,1.161,0,0,0,.438-.479c.107-.176.2-.37.292-.56s.176-.376.25-.521a2.8,2.8,0,0,1,.146-.243c.021,0,.115-.079.246-.146.146-.075.332-.163.521-.254a6.284,6.284,0,0,0,.56-.292,1.066,1.066,0,0,0,.615-1.067c0-.205-.021-.419-.027-.629s-.034-.413-.042-.577v-.285a1.316,1.316,0,0,1,.138-.25c.088-.138.207-.306.327-.479s.238-.352.338-.532a1.057,1.057,0,0,0,0-1.233c-.1-.18-.218-.358-.338-.532s-.238-.342-.327-.479-.13-.235-.138-.247a1.22,1.22,0,0,1,0-.285c0-.163.025-.367.042-.577a5.4,5.4,0,0,0,.027-.632,1.107,1.107,0,0,0-.138-.632,1.151,1.151,0,0,0-.477-.435c-.176-.107-.37-.2-.56-.292s-.376-.176-.521-.25c-.13-.067-.234-.14-.246-.146s-.079-.117-.146-.246c-.075-.146-.159-.332-.25-.521a6.285,6.285,0,0,0-.292-.56,1.161,1.161,0,0,0-.438-.479,1.148,1.148,0,0,0-.629-.136c-.205,0-.423.021-.632.027s-.413.034-.577.042h-.285a2.529,2.529,0,0,1-.251-.138c-.138-.088-.3-.207-.477-.327s-.355-.238-.535-.337a1.159,1.159,0,0,0-.616-.2Zm0,.953c.032.021.094.032.163.069.126.069.286.174.452.288s.339.238.5.344a1.757,1.757,0,0,0,.514.254,1.72,1.72,0,0,0,.574.035c.195,0,.4-.027.6-.042a4.791,4.791,0,0,1,.539-.025c.077,0,.14.021.174.021a.854.854,0,0,1,.107.143c.074.124.159.294.247.477s.174.371.264.546a1.459,1.459,0,0,0,.8.8c.174.09.367.18.549.268s.353.171.476.247a.923.923,0,0,1,.143.107c0,.034.021.1.021.174a4.325,4.325,0,0,1-.025.539c-.021.2-.035.409-.046.6a2.017,2.017,0,0,0,.035.574,1.7,1.7,0,0,0,.257.514c.1.165.226.335.34.5s.223.329.292.455a1.036,1.036,0,0,1,.069.163c-.021.032-.032.092-.069.161-.069.126-.178.289-.292.455s-.235.339-.34.5a1.437,1.437,0,0,0-.293,1.088c0,.195.029.4.046.6a4.789,4.789,0,0,1,.025.539c0,.077-.021.14-.021.174a.854.854,0,0,1-.143.107c-.124.075-.294.159-.476.247s-.375.174-.549.264a1.72,1.72,0,0,0-.476.316,1.692,1.692,0,0,0-.32.479c-.09.174-.178.368-.264.549s-.171.353-.247.477a1,1,0,0,1-.107.143c-.034,0-.1.021-.174.021a4.324,4.324,0,0,1-.539-.025c-.2-.021-.409-.035-.6-.046a2.017,2.017,0,0,0-.574.035,1.7,1.7,0,0,0-.514.257c-.165.1-.338.226-.5.34s-.326.219-.452.288a1.3,1.3,0,0,1-.163.071c-.032-.021-.094-.034-.163-.071-.126-.069-.285-.174-.452-.288s-.339-.235-.5-.34a1.437,1.437,0,0,0-1.088-.293c-.195,0-.4.029-.6.046a4.789,4.789,0,0,1-.539.025c-.077,0-.14-.021-.174-.021a.854.854,0,0,1-.107-.143c-.075-.124-.159-.294-.247-.477s-.174-.375-.264-.549a1.719,1.719,0,0,0-.32-.479,1.686,1.686,0,0,0-.477-.316c-.174-.09-.367-.178-.549-.264s-.353-.171-.476-.247a.923.923,0,0,1-.143-.107c0-.034-.021-.1-.021-.174a4.325,4.325,0,0,1,.025-.539c.021-.2.035-.409.046-.6a2.017,2.017,0,0,0-.035-.574,1.7,1.7,0,0,0-.257-.514c-.107-.165-.226-.338-.34-.5s-.223-.329-.292-.455a1.131,1.131,0,0,1-.069-.161c.021-.032.032-.094.069-.163.069-.126.178-.289.292-.455s.235-.335.34-.5A1.437,1.437,0,0,0,9.455,13.3c0-.195-.029-.4-.046-.6a4.79,4.79,0,0,1-.025-.539c0-.077.021-.14.021-.174a.854.854,0,0,1,.143-.107c.124-.074.294-.159.476-.247s.375-.178.549-.268a1.457,1.457,0,0,0,.8-.8c.09-.174.178-.364.264-.546a5.322,5.322,0,0,1,.247-.477,1,1,0,0,1,.107-.143c.034,0,.1-.021.174-.021A4.325,4.325,0,0,1,12.7,9.4c.2.021.41.032.6.042a2.017,2.017,0,0,0,.574-.035,1.73,1.73,0,0,0,.514-.254c.165-.107.338-.23.5-.344s.326-.219.452-.288a.97.97,0,0,1,.163-.069Zm-2.244,3.236a1.571,1.571,0,1,0,1.113.458,1.569,1.569,0,0,0-1.113-.458Zm4.893.71h0a.435.435,0,0,0-.088,0,.473.473,0,0,0-.26.132L12.544,17.8h0a.471.471,0,1,0,.666.666L18.478,13.2a.472.472,0,0,0-.318-.8Zm-4.893.226a.635.635,0,1,1-.446.188.629.629,0,0,1,.446-.188Zm4.488,3.552a1.571,1.571,0,1,0,1.113.458,1.569,1.569,0,0,0-1.113-.458Zm0,.936a.635.635,0,1,1-.446.188.629.629,0,0,1,.446-.188Z" transform="translate(-5.512 -5.5)" fill="#080808" />
                                                        </g>
                                                    </svg>
                                                </div>
                                                <div>
                                                    {(validate.isNotEmpty(productDetailInfo.productPromotion.specialPromotionRanges) && productDetailInfo.productPromotion.specialPromotionRanges.length > 0) &&
                                                        <React.Fragment>
                                                            {productDetailInfo.productPromotion.specialPromotionRanges.map((specialPromotion, index) => (
                                                                <>
                                                                    {index > 0 && <br />}
                                                                    {(specialPromotion.fromQuantity <= 0 && specialPromotion.toQuantity > 0) ?
                                                                        <span>
                                                                            <p className='mb-0 font-14'>{`Get ${truncateDecimals(specialPromotion.discountPercentage, 2)}% off on orders up to ${specialPromotion.toQuantity}`}</p>
                                                                        </span> : <></>}
                                                                    {(specialPromotion.fromQuantity === specialPromotion.toQuantity) ?
                                                                        <span>
                                                                            <p className='mb-0 font-14'>{`Get ${truncateDecimals(specialPromotion.discountPercentage, 2)}% off on orders of ${specialPromotion.fromQuantity}`}</p>
                                                                        </span> : <></>}
                                                                    {(specialPromotion.fromQuantity > 0 && specialPromotion.fromQuantity !== specialPromotion.toQuantity) ?
                                                                        <span>
                                                                            <p className='mb-0 font-14'>{`Get ${truncateDecimals(specialPromotion.discountPercentage, 2)}% off on orders of ${specialPromotion.fromQuantity} or above`}</p>
                                                                        </span> : <></>}
                                                                </>
                                                            ))}
                                                        </React.Fragment>
                                                    }
                                                    {(validate.isNotEmpty(productDetailInfo.productPromotion.slabs) && productDetailInfo.productPromotion.slabs.length > 0) &&
                                                        <React.Fragment>
                                                            {productDetailInfo.productPromotion.slabs.map((slabPromotion, index) => (
                                                                <>
                                                                    {(productDetailInfo.hideSlabDetails === true) ?
                                                                        <span>
                                                                            <p className='mb-0 font-14'>{`Get ${truncateDecimals(slabPromotion.discountPercentage, 2)}% off`}</p>
                                                                        </span> : <></>}
                                                                    {(slabPromotion.fromValue <= 0 && slabPromotion.toValue > 0 && productDetailInfo.hideSlabDetails !== true) ?
                                                                        <span>
                                                                            <p className='mb-0 font-14'>{`Get ${truncateDecimals(slabPromotion.discountPercentage, 2)}% off on orders up to ${slabPromotion.toValue}`}</p>
                                                                        </span> : <></>}
                                                                    {(slabPromotion.fromValue > 0 && productDetailInfo.hideSlabDetails !== true) ?
                                                                        <span>
                                                                            <p className='mb-0 font-14'>{`Get ${truncateDecimals(slabPromotion.discountPercentage, 2)}% off on orders over ${slabPromotion.fromValue}`}</p>
                                                                        </span> : <></>}
                                                                </>
                                                            ))}
                                                        </React.Fragment>
                                                    }
                                                    {(validate.isNotEmpty(productDetailInfo.productPromotion.supplementPromotionRanges) && productDetailInfo.productPromotion.supplementPromotionRanges.length > 0) &&
                                                        <React.Fragment>
                                                            {productDetailInfo.productPromotion.supplementPromotionRanges.map((supplementPromotion, index) => (
                                                                <span>
                                                                    <p className='mb-0 font-14'>{supplementPromotion.displayMessage}</p>
                                                                </span>
                                                            ))}
                                                        </React.Fragment>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            {validate.isNotEmpty(productDetailInfo.isShortSupply) && validate.isNotEmpty(productDetailInfo.productMessages) && (
                                <div className="p-12 py-0" style={{marginTop: "0.75rem"}}>
                                    <div className="alert alert-info mb-0 text-center w-100" style={{ display: 'inline-block', marginTop: '10px' }}>
                                        <span><i className="fa fa-info-circle fa-lg" style={{ paddingRight: '5px' }}></i></span>
                                        {(productDetailInfo.productMessages[0]).replace("<strong>", " ").replace("</strong>", " ")}
                                        {validate.isNotEmpty(productDetailInfo.returnAndReplacableMsg) && (
                                            <span>{productDetailInfo.returnAndReplacableMsg}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                            {productInfo.drugSchedule != null && productInfo.drugSchedule.indexOf('X') !== -1 && (
                                <div className="p-12 py-0" style={{marginTop: "0.75rem"}}>
                                    <div className="alert alert-info mb-0 text-center w-100">
                                        <span>Please visit a MedPlus store to purchase this Medicine.</span>
                                    </div>
                                </div>
                            )}
                            {showProductOtherMsgs() &&
                                <React.Fragment>
                                    {validate.isNotEmpty(productDetailInfo.replacementProduct) ?
                                        <div className="p-12 py-0" style={{ display: validate.isNotEmpty(productDetailInfo.replacementProduct) ? 'block' : 'none', marginTop: "0.75rem" }}>
                                            <div className="alert alert-info mb-0 text-center w-100">
                                                This product by the manufacturer has been replaced with
                                                <a onClick={() => getProductDetails(productDetailInfo.replacementProduct.id)} href="javascript:void(0);" className="color-black"> {productDetailInfo.replacementProduct.name}</a>
                                                {productInfo.returnAndReplacableMsg != null && <span>{productInfo.returnAndReplacableMsg}</span>}
                                            </div>
                                        </div> :
                                        <div className="p-12 py-0" style={{ display: validate.isNotEmpty(productDetailInfo.replacementProduct) ? 'none' : 'block', marginTop: "0.75rem" }}>
                                            <div className="alert alert-info mb-0 text-center w-100" style={{ display: 'inline-block' }}>
                                                {(productDetailInfo.productMessages[0]).replace("<strong>", " ").replace("</strong>", " ")}
                                                {validate.isNotEmpty(productInfo.returnAndReplacableMsg) && <span>{productInfo.returnAndReplacableMsg}</span>}
                                            </div>
                                        </div>
                                    }
                                </React.Fragment>
                            }
                            {validate.isNotEmpty(productInfo.productReasons) && productInfo.productReasons.indexOf('MSG_10004') == 0 &&
                                <div className="p-12 py-0" style={{ display: validate.isNotEmpty(productInfo.productReasons) ? 'block' : 'none', marginTop: "0.75rem" }}>
                                    <div className="alert alert-info mb-0 text-center w-100" style={{ display: 'inline-block' }}>
                                        This Product Not Available For Online Sale.
                                        {productInfo.returnAndReplacableMsg != null && <span>{productInfo.returnAndReplacableMsg}</span>}
                                    </div>
                                </div>
                            }
                            {validate.isNotEmpty(productInfo.returnAndReplacableMsg) && !(validate.isNotEmpty(productInfo.productReasons) && productInfo.productReasons.indexOf('MSG_10004') == 0) && validate.isEmpty(productDetailInfo.replacementProduct) && !(validate.isNotEmpty(productDetailInfo.isShortSupply) && validate.isNotEmpty(productDetailInfo.productMessages)) &&
                                <div className="p-12 py-0" style={{marginTop: "0.75rem"}}>
                                    <div className="alert alert-info mb-0 text-center w-100" style={{ display: 'inline-block' }}>
                                        <span>{productInfo.returnAndReplacableMsg}</span>
                                    </div>
                                </div>
                            }
                            {deliveryInfoAvailable && <div className="p-12 py-0" style={{marginTop: "0.75rem"}}>
                                <div className="card p-12">
                                    <div>
                                        <p className="text-secondary mb-1">Delivery Information</p>
                                        {[
                                            { key: "hubId", label: "Hub ID", quantityKey: "productQtyinHub" },
                                            { key: "intermediateWareHouseId", label: "InterMediate WareHouseId", quantityKey: "productQtyInIntermediateWareHouse" },
                                            { key: "wareHouseId", label: "Ware house ID", quantityKey: "productQtyinWareHouse" }
                                        ].map(location => (
                                            validate.isNotEmpty(martLocality[location.key]) && productQuantities[location.quantityKey] > 0 && (
                                                <p key={location.key} className="d-flex flex-column gap-2 d-xl-block mb-0">
                                                    <span>{location.label} - <span className="font-weight-bold">{martLocality[location.key]}</span></span>
                                                    <span className="d-none d-xl-inline-block mx-2 text-secondary">|</span>
                                                    <span>Available Quantity - <span className="font-weight-bold">{productQuantities[location.quantityKey]}</span></span>
                                                    {locationETAInfo[martLocality[location.key]] && <><span className="d-none d-xl-inline-block mx-2 text-secondary">|</span>
                                                    <span>Pick Up Time - <span className="font-weight-bold">{locationETAInfo[martLocality[location.key]]}</span></span></>}
                                                </p>
                                            )
                                        ))}
                                        {validate.isNotEmpty(productDetailInfo.wareHouseInfo) && productDetailInfo.wareHouseInfo.AVAILABLE_QUANTITY > 0 && <>
                                            <p className="text-secondary mb-1">WareHouse Info :</p>
                                            <p className="mb-0">
                                                <span>Store: - <span className="font-weight-bold">{productDetailInfo.wareHouseInfo.WAREHOUSE}-{productDetailInfo.wareHouseInfo.WAREHOUSENAME}</span></span>
                                                <span className="mx-2 text-secondary">|</span>
                                                <span>Available Qty - <span className="font-weight-bold">{productDetailInfo.wareHouseInfo.AVAILABLE_QUANTITY}</span></span>
                                            </p>
                                        </>
                                        }
                                    </div>
                                </div>
                                {validate.isNotEmpty(productInfo.fridgeItemAllowed) && !productInfo.fridgeItemAllowed && <>
                                    <div class="col-lg-8">
                                        <span class="color-red">Fridge item, not available for sale in your locality</span>
                                    </div>
                                </>}
                                
                            </div>}
                            {deliveryInfoAvailable && <p className="p-12 py-0"><span className="text-danger font-12 ">**</span><span className="font-12 text-secondary">Delivery charges may apply</span></p>}
                            {validate.isNotEmpty(alternateProductInfo) && ('PHARMACY' === productInfo.productType || 'Y' !== productInfo.isGeneral) &&
                                <React.Fragment>
                                    <label class="d-block py-0 p-12 font-weight-bold custom-fieldset">Alternative Products</label>
                                    <div className='p-12'>
                                        <div className={`card mb-3 me-0 `}>
                                            <DynamicGridHeight id="ProductDetails" metaData={productAlternatives} dataSet={[...getAlternativeProductDetails()]}>
                                                <CommonDataGrid {...({...productAlternatives , totalRowsCount: alternateProductIds.length})} remoteDataFunction = {remoteDataFunction} dataSet={[...getAlternativeProductDetails()]} callBackMap={callBackMapping} />
                                            </DynamicGridHeight>
                                        </div>
                                    </div>
                                </React.Fragment>}
                            {validate.isNotEmpty(moleculeInfo) && <div>
                                <label class="d-block py-0 p-12 font-weight-bold custom-fieldset">Product Information</label>
                                <div className='p-12'>
                                    <div className={`custom-tabs-forms mobile-compatible-tabs d-flex pb-0 card`}>
                                        <NavTabs tabs={tabs} onTabChange={handleTabId} />
                                        {
                                            tabs.length > 0 && tabs.map((each, index) => {
                                                return (<TabContent key={index} activeTab={tabId}>
                                                    <TabPane tabId={(index + 1).toString()}>
                                                        <div className='p-12 catalog-faq'>
                                                            <MoleculeInfo moleculeData={[moleculeInfo[each]]}></MoleculeInfo>
                                                        </div>
                                                    </TabPane>
                                                </TabContent>);
                                            })
                                        }

                                    </div>
                                </div>
                            </div>}
                        </BodyComponent>
                    </React.Fragment>
            }
        </div>
    )
}

export default ProductDetails;