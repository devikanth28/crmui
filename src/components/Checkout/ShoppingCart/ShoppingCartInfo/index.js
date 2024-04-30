import CommonDataGrid, { AddIcon, DeleteIcon ,CellTextEditor} from "@medplus/react-common-components/DataGrid"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import DataGridHelper from "../../../../helpers/DataGridHelper"
import Validate from "../../../../helpers/Validate"
import CheckoutService from "../../../../services/Checkout/CheckoutService"
import { CRM_UI } from "../../../../services/ServiceConstants"
import CurrencyFormatter from "../../../Common/CurrencyFormatter"
import DynamicGridHeight from "../../../Common/DynamicGridHeight"
import { AlertContext, CustomerContext, ShoppingCartContext } from "../../../Contexts/UserContext"
import PatientInfo from "../PatientInfo"
import ShipmentDetails from "./ShipmentDetails"
import { getCustomerRedirectionURL } from "../../../customer/CustomerHelper"
import CatalogService from "../../../../services/Catalog/CatalogService"
import { Link } from "react-router-dom"
import { BodyComponent } from "../../../Common/CommonStructure"
import OrderHelper from "../../../../helpers/OrderHelper"
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm"
import { ComplimentaryIcon, PrescriptionRequiredIcon } from "../../../../helpers/TypeIcons"
import qs from 'qs';

export default (props)=>{

    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const gridRef = useRef(null);
    const validate = Validate();
    const  {customerId}  = useContext(CustomerContext);
    const [recommendedDataSet,setRecommendedDataSet] = useState(undefined);
    const [shoppingCartDataSet,setShoppingCartDataSet] = useState(undefined);
    const [complimentaryCartDataSet,setComplimentaryCartDataSet] = useState(undefined);
    const [cartSummaryDisplay,setCartSummaryDisplay] = useState(undefined);
    const {setStackedToastContent} = useContext(AlertContext);
    const {shoppingCart,setShoppingCart} = useContext(ShoppingCartContext);
    const checkoutService = CheckoutService();
    const catalogService = CatalogService();
    const complimentaryDataGrid = DataGridHelper().getComplimentaryDataGrid();
    const shoppingCartDataGrid = DataGridHelper().getShoppingCartDataGrid();
    const [recommendedDataGrid,setRecommendedDataGrid] = useState(DataGridHelper().getRecommendedDataGrid());
    const [isCustomerAgreeToSingleOrder,setIsCustomerAgreeToSingleOrder] = useState(undefined);
    const [selectedPatientInfo, setSelectedPatientInfo] = useState(undefined);
    const [complimentaryDiscount,setComplimentaryDiscount] = useState(undefined);
    const [isLoading,setIsLoading] = useState(true);
    const [isComplimentaryAdded,setComplimentaryAdded] = useState(false);
    const [backDropLoader, setBackDropLoader] = useState(false)

    useEffect(() => {
        if(validate.isNotEmpty(customerId)){
            getShoppingCartInfo(true);
        }
    }, [isCustomerAgreeToSingleOrder])

    const prepareComplimentaryDataSet=(shoppingCart)=>{
        let complimentaryList = [];
        if(validate.isNotEmpty(shoppingCart?.complimentaryItem)){
            setComplimentaryAdded("ADDED" == shoppingCart.complimentaryItem?.complimentaryType ? true : false);
            const complimentaryItem = shoppingCart.complimentaryItem;
            let productDiscountPrice = 0;
            let complimentaryItemData = {};
            complimentaryItemData['productName'] = complimentaryItem?.productName;
            complimentaryItemData['packSize'] = complimentaryItem?.packSize;
            complimentaryItemData['units'] = complimentaryItem?.quantity;
            complimentaryItemData['mrp'] = complimentaryItem?.mrp;
            complimentaryItemData['amount'] = complimentaryItem?.totalPrice;
            if(validate.isNotEmpty(complimentaryItem?.discountPercentage)){
                productDiscountPrice += complimentaryItem?.packMrp - ((complimentaryItem?.discountPercentage / 100) * complimentaryItem?.packMrp);
            }
            setComplimentaryDiscount(`${complimentaryItem?.discountPercentage}%`);
            complimentaryItemData['complimentaryType'] = complimentaryItem?.complimentaryType;
            complimentaryItemData['discountPrice'] = productDiscountPrice;
            complimentaryItemData['productId'] = complimentaryItem?.productId;
            complimentaryList.push(complimentaryItemData);
        }
        setComplimentaryCartDataSet(complimentaryList);
    }

    const prepareRecommendedDataSet=(shoppingCart)=>{
        let recommendedProductsList = [];
        let recommendedProducts = shoppingCart?.recommendedProducts;
        if (validate.isNotEmpty(recommendedProducts)) {
            recommendedProducts.map(eachProduct => {
                if(validate.isEmpty(eachProduct)){
                    return
                }
                let isNotAddedToCart  = eachProduct['packSizeQuantity']==0;
                let initialQuantityInPacks = isNotAddedToCart?eachProduct['configuredRecommendedPackQuantity']:eachProduct['packSizeQuantity']
                let initialQuantity = isNotAddedToCart?eachProduct['configuredRecommendedPackQuantity']*eachProduct['packSize']:eachProduct['quantity']
                let recommendedProduct = {}
                let dataGrid = recommendedDataGrid;
                let columns = recommendedDataGrid['columns'].map(eachCloumn => {
                    if (eachCloumn?.rowDataKey == 'packs') {
                        let column = eachCloumn;
                        column['isEditable'] = isNotAddedToCart ? false : true;
                        return column;
                    }
                    return eachCloumn;
                }
                )
                setRecommendedDataGrid({ ...dataGrid, columns: columns });
                let deliveryTime = getDeliveryDisplayTime(eachProduct?.overFlowItems);
                recommendedProduct['productName'] = eachProduct['productName'];
                recommendedProduct['offers'] = getOffers(eachProduct['discountList']);
                recommendedProduct['packSize'] = eachProduct['packSize'];
                recommendedProduct['deliveryTimeList'] = deliveryTime;
                recommendedProduct['packs'] = initialQuantityInPacks;
                recommendedProduct['units'] = initialQuantity;
                recommendedProduct['mrp'] = eachProduct['mrp'];
                recommendedProduct['isAdded']=!isNotAddedToCart;
                recommendedProduct['amount'] = eachProduct['totalPrice'];
                recommendedProduct['totalMrp'] = eachProduct['totalMrp'];
                recommendedProduct['restrictedQuantity'] = eachProduct['restrictedQuantity'];
                recommendedProduct['availableRecommendedQuantity'] = eachProduct['availableRecommendedQuantity'];
                recommendedProduct['configuredRecommendedPackQuantity'] = eachProduct['configuredRecommendedPackQuantity'];
                recommendedProduct['productId'] = eachProduct?.productId;
                recommendedProductsList.push(recommendedProduct);
            })
        }
        setRecommendedDataSet(recommendedProductsList);
    }

    const getShoppingCartInfo=async(isInitialRequest)=>{
        const shoppingCart = await getShoppingCart();
        setShoppingCartResponse(shoppingCart);
        if(isInitialRequest){
            setIsLoading(false);
        }
    }

    const getShoppingCart=()=>{
        let parameters = {};
        if(validate.isNotEmpty(isCustomerAgreeToSingleOrder)){
            parameters['isCustomerAgreeToSingleOrder'] = isCustomerAgreeToSingleOrder;
        }
        if(validate.isNotEmpty(params) && validate.isNotEmpty(params['isReorder'] && "Y" == params['isReorder'])){
            parameters['isForReorder'] = "Y";
        }
        return checkoutService.getCartInfo({headers:{customerId:customerId},params:parameters});
    }

    const setShoppingCartResponse=(shoppingCartResponse)=>{
        if(validate.isNotEmpty(shoppingCartResponse) && validate.isNotEmpty(shoppingCartResponse.dataObject) && "SUCCESS"==shoppingCartResponse?.statusCode){
            setShoppingCart(shoppingCartResponse.dataObject);
            props?.setIsAllowedToCheckout(shoppingCartResponse.dataObject?.isCheckoutAllowed);
            props?.setIsRequiredPrescription(shoppingCartResponse.dataObject?.isPrescriptionRequired);
            if(validate.isNotEmpty(shoppingCartResponse.dataObject?.patientDetails)){
                setSelectedPatientInfo(shoppingCartResponse.dataObject.patientDetails)
            }
            prepareShoppingCartDataSet(shoppingCartResponse.dataObject);
            prepareComplimentaryDataSet(shoppingCartResponse.dataObject);
            prepareRecommendedDataSet(shoppingCartResponse.dataObject);
            setBackDropLoader(false);
            return true;
        }else if(validate.isNotEmpty(shoppingCartResponse) && "FAILURE"==shoppingCartResponse?.statusCode && validate.isNotEmpty(shoppingCartResponse?.message) && "EMPTY_CART"==shoppingCartResponse.message){
            props.history.push(getCustomerRedirectionURL(customerId, "catalog"));
        }else if(validate.isNotEmpty(shoppingCartResponse) && "FAILURE"==shoppingCartResponse?.statusCode && validate.isNotEmpty(shoppingCartResponse?.message)){
            setStackedToastContent({toastMessage:shoppingCartResponse?.message});
            setBackDropLoader(false);
            return false;
        }
        setBackDropLoader(false);
    }

    const editQuantity= async(productId , value, restrictedQty)=>{
        let restrictedQuantity = validate.isNotEmpty(restrictedQty)?restrictedQty:99;
        if(validate.isNotEmpty(value) && Number.isInteger(Number(value)) && value<=restrictedQuantity && value>=0){
            setBackDropLoader(true)
            const shoppingCartResponse = await modifyCartItem(productId,Number(value));
            const editUpdated = setShoppingCartResponse(shoppingCartResponse);
            return editUpdated;
        }

    }

    const handleRemoveProduct=async(row)=>{
        if(validate.isNotEmpty(row)){
            const shoppingCartResponse = await modifyCartItem(row?.productId,0);
            setShoppingCartResponse(shoppingCartResponse);
        }
    }

    const modifyCartItem=(productId,quantity)=>{
        let params ={}
        params[productId]=quantity;
        return checkoutService.modifyCart({headers:{customerId:customerId},params:{"CART_OBJECT":params}});
    }

    const renderActionColumn=({row})=>{
        return <DeleteIcon handleOnClick={() => {(row?.complimentaryType && "ADDED" == row.complimentaryType)?handleAddOrModifyComplimentary(row?.productId,0,`${row?.productName} removed successfully`) : handleRemoveProduct(row)}} tooltip={"remove"} id={`deleteIcon${row['rowIndex']}`}/>
    }

    const renderOffersColumn=(props)=>{
        return validate.isEmpty(props?.row?.offers)?<>No Offer Applied</>:props?.row?.offers;
    }
    const getDeliveryDisplayTime=(overFlowItems)=>{
        if(validate.isEmpty(overFlowItems)){
            return
        }
        let deliveryTimeList = [];
        overFlowItems.map(overFlowItem=>{
            if(validate.isNotEmpty(overFlowItem)){
                deliveryTimeList.push(`${overFlowItem?.deliveryTime}`);
            }
        })
        return deliveryTimeList.join(', ');
    }

    const prepareShoppingCartDataSet=(shoppingcartResponse)=>{
        const shoppingCartItems = shoppingcartResponse?.shoppingCartItems;
        const cartSummary = shoppingcartResponse?.cartSummary;
        const productAvalibaleQuantity = shoppingcartResponse?.productAvailableQty;
        let cartItems = [];
        let isAnyOutOfStock = false;
        shoppingCartItems.map(cartItem=>{
            let shoppingCartItem={}
            let deliveryTime = getDeliveryDisplayTime(cartItem?.overFlowItems);
            shoppingCartItem['productName']=cartItem['productName'];
            shoppingCartItem['offers']=getOffers(cartItem['discountList']);
            shoppingCartItem['packSize']=cartItem['packSize'];
            shoppingCartItem['deliveryTimeList']=deliveryTime;
            shoppingCartItem['packs']=cartItem['packSizeQuantity'];
            shoppingCartItem['units']=cartItem['quantity'];
            shoppingCartItem['mrp']=cartItem['mrp'];
            shoppingCartItem['amount']=cartItem['totalPrice'];
            shoppingCartItem['restrictedQuantity']=cartItem['restrictedQuantity'];
            shoppingCartItem['productId']=cartItem['productId'];
            shoppingCartItem['isPrescriptionRequired']=cartItem['isPrescriptionRequired'];
            shoppingCartItem['manufacturer']=cartItem['manufacturer'];
            shoppingCartItem['complimentaryType']=cartItem['complimentaryType']
            if(validate.isNotEmpty(productAvalibaleQuantity) && productAvalibaleQuantity[cartItem['productId']] && productAvalibaleQuantity[cartItem['productId']]<=0){
                shoppingCartItem['outOfStock']= true;
                isAnyOutOfStock = true;
            }else{
                shoppingCartItem['outOfStock']= false;
            }
            cartItems.push(shoppingCartItem)
        })
        let cartSummaryDisplayDataset = [{
            'amount' : <div className=" font-weight-bold">Cart Total</div>,
            'action' : <div className="text-end font-weight-bold"><CurrencyFormatter data={cartSummary['totalMrp']} decimalPlaces={2}/></div>
        },
        {
            'amount' : <div className=" font-weight-bold">Discount Amount</div>,
            'action' : <div className="text-end font-weight-bold"><CurrencyFormatter data={cartSummary['totalDiscount']} decimalPlaces={2}/></div>
        },
        {
            'amount' : <div className=" font-weight-bold">Medplus Payback Points to be Credited</div>,
            'action' : <div className="text-end font-weight-bold"><CurrencyFormatter data={cartSummary['totalPaybackPoints']} decimalPlaces={2}/></div>
        },
        {
            'amount' : <div className=" font-weight-bold">Grand Total</div>,
            'action' : <div className="text-end font-weight-bold"><CurrencyFormatter data={cartSummary['totalAmount']} decimalPlaces={2}/></div>
        }];

        if(validate.isNotEmpty(cartSummary['totalPaybackPoints']) && cartSummary['totalPaybackPoints']<=0 ){
            cartSummaryDisplayDataset.splice(2,1);
        }
        setCartSummaryDisplay(cartSummaryDisplayDataset);
        props.setIsAnyOutOfStock(isAnyOutOfStock?isAnyOutOfStock:false);
        setShoppingCartDataSet(cartItems);
        props.setCartGrandTotal(cartSummary['totalAmount']);
        props.setCartDiscountAmount(validate.isNotEmpty(cartSummary['totalDiscount']) ? cartSummary['totalDiscount'] : undefined);
    }

    const redirectToProductDetail=({ row, column })=>{
        return <Link to={`${CRM_UI}/customer/${customerId}/catalog/${row.productId}`} title={'See Product'} className="btn btn-link bg-transparent w-100 p-0 text-start pointer" role="link">
            {row[column.key]}
        </Link>
    }


    const handleGridColumnEdit = async ({row , column, updatedRowIndex}) => {
        if(column.key === "packs" && 'ADDED'!==shoppingCartDataSet[updatedRowIndex]['complimentaryType'] ) {
            let editedQuantity = row[column.key];
            if(validate.isEmpty(editedQuantity)){
                row[column.key] = shoppingCartDataSet[updatedRowIndex][column.key];
                return {status: false}
            }
            const editUpdated = await editQuantity(row.productId,editedQuantity,row['restrictedQuantity']);
            if(!editUpdated){
                row[column.key] = shoppingCartDataSet[updatedRowIndex][column.key];
                return {status: false}
            }
        }
        gridRef.current?.deselectCell();
        return {status: true}
    }

    const handleEditRecommended=async ({row , column, updatedRowIndex})=>{
        if(column.key === "packs") {
            let editedQuantity = row[column.key];
            if((validate.isEmpty(editedQuantity)) || (validate.isNotEmpty(editedQuantity) && (editedQuantity>row['availableRecommendedQuantity'] || editedQuantity>row['configuredRecommendedPackQuantity']))){
                row[column.key] = recommendedDataSet[updatedRowIndex][column.key];
                return {status: false}
            }
            const editUpdated = await editQuantity(row.productId,editedQuantity,row['restrictedQuantity']);
            if(!editUpdated){
                row[column.key] = recommendedDataSet[updatedRowIndex][column.key];
                return {status: false}
            }else if(editUpdated && editedQuantity==0){
                setStackedToastContent({toastMessage:`${row?.productName} removed successfully`})
            }
        }
        return {status: true}
    }

    const renderTypeColumn = (props) => {
        return(
            <React.Fragment>
                {props?.row?.complimentaryType && "ADDED" == props.row.complimentaryType ? <ComplimentaryIcon id={props.row.productId} />:props.row.isPrescriptionRequired?<PrescriptionRequiredIcon id={props.row.productId} />:<div className=''>-</div>}
                {props.row.outOfStock && <p className={`${OrderHelper().getBadgeColorClassForStatus("out of stock")} badge rounded-pill mb-2`}>{OrderHelper().getStatusWithFirstLetterCapitalized("out of stock")}</p>}
            </React.Fragment>
        )
    }

    const renderDeliveryColumn=(props)=>{
        return validate.isEmpty(props?.row?.deliveryTimeList)?<>-</>:props?.row?.deliveryTimeList;
    }

    const renderMrpColumn=(props)=>{
        return <div className="text-end"><CurrencyFormatter data={props?.row?.mrp} decimalPlaces={2}/></div>
    }

    const renderAmountColumn = props => {
        return <div className="text-end"><CurrencyFormatter data={props?.row?.amount} decimalPlaces={2}/></div>
    }

    const renderDiscountPriceColumn = props => {
        return <div className="text-end"><CurrencyFormatter data={props?.row?.discountPrice} decimalPlaces={2}/></div>
    }

    const packEditor = useCallback(({row,column,onRowChange,onClose}) => {
        if('ADDED'===row['complimentaryType'] ) {
            return <span className="px-2">{row[column.key]}</span>
        } 

        return  <CellTextEditor inputAttributes = {column?.defaultColumnEditorProps} selectedValue = {row[column.key]} onChange = {(e) => onRowChange({...row,[column.key] : e.target.value})} onBlur = {(e) => {onClose(true,false)}} />

    },[]);

    const shoppingCartCallBackMapping={
        'renderOffers' : renderOffersColumn,
        'renderActionColumn' : renderActionColumn,
        'openProductDetails' : redirectToProductDetail,
        'renderTypeColumn' : renderTypeColumn,
        'renderDeliveryColumn' : renderDeliveryColumn,
        'renderMrpColumn' : renderMrpColumn,
        'renderAmountColumn' : renderAmountColumn,
        packEditor
    }

    const handleAddOrModifyComplimentary=async(productId,quantity,message)=>{
        setBackDropLoader(true)
        const addOrModifyComplimentaryItemResponse = await addOrModifyComplimentaryItem(productId,quantity);
        setShoppingCartResponse(addOrModifyComplimentaryItemResponse);
        if(validate.isNotEmpty(message) && "SUCCESS"==addOrModifyComplimentaryItemResponse?.statusCode){
            setStackedToastContent({toastMessage:message});
        }
    }
    const addOrModifyComplimentaryItem=(productId,quantity)=>{
        return checkoutService.addOrModifyComplimentaryItem({headers:{customerId},params:{productId:productId,requestedQuantity:quantity}})
    }

    const renderComplimenteryActionColumn=(props)=>{
        const complimentaryType = props?.row?.complimentaryType;
        switch(complimentaryType){
            case "ADDED":
                return <DeleteIcon handleOnClick={() => {handleAddOrModifyComplimentary(props?.row?.productId,0,`${props?.row?.productName} removed successfully`)}} tooltip={"Remove"} id={`complimentaryDelete${props?.row['rowIndex']}`}/>
            case "RECOMMENDED":
                return <AddIcon handleOnClick={() => {handleAddOrModifyComplimentary(props?.row?.productId,props?.row?.units,`${props?.row?.productName} added successfully`)}} tooltip={"Add"} className="btn-add-success" id={`complimentaryAdd${props?.row['rowIndex']}`}/>
        }
    }

    const handleRecommendedModify = async (productId, quantity, message) => {
        setBackDropLoader(true)
        const shoppingCartResponse = await modifyCartItem(productId, quantity);
        setShoppingCartResponse(shoppingCartResponse);
        if (validate.isNotEmpty(message) && "SUCCESS" == shoppingCartResponse?.statusCode) {
            setStackedToastContent({ toastMessage: message });
        }
    }

    const addRecommendedProduct=(productId,quantity)=>{
        let params ={}
        params['productId']=productId;
        params['requestedQuantity']=quantity;
        params['isRecommendedProduct']=true;
        return catalogService.addOrModifyProductToCart({headers:{customerId:customerId},params});
    }

    const handleAddRecommendAndRenderCartInfo=async (productId, quantity, message)=>{
        setBackDropLoader(true)
        const addRecommendedProductResponse = await addRecommendedProduct(productId, quantity);
        if(validate.isNotEmpty(addRecommendedProductResponse) && "SUCCESS"==addRecommendedProductResponse?.statusCode){
            getShoppingCartInfo();
            setStackedToastContent({toastMessage:message});
        }
    }

    const renderRecommendeActionColumn = (props) => {
        const isAdded = props?.row?.isAdded;
        if (isAdded) {
            return <DeleteIcon handleOnClick={() => { handleRecommendedModify(props?.row?.productId, 0, `${props?.row?.productName} removed successfully`) }} tooltip={"Remove"} id={`recomendedDelete${props?.row['rowIndex']}`}/>
        } else {
            return <AddIcon handleOnClick={() => { handleAddRecommendAndRenderCartInfo(props?.row?.productId, props?.row?.packs, `${props?.row?.productName} added successfully`)}} tooltip={"Add"} className="btn-add-success" id={`recomendedAdd${props?.row['rowIndex']}`}/>
        }
    }

    const complimenteryCallBackMapping={
        'renderActionColumn' : renderComplimenteryActionColumn,
        'openProductDetails' : redirectToProductDetail,
        'renderMrpColumn' : renderMrpColumn,
        'renderAmount' : renderAmountColumn,
        'renderDiscountPrice' : renderDiscountPriceColumn

    }

    const recommondedCallBackMapping={
        'openProductDetails' : redirectToProductDetail,
        'renderActionColumn' : renderRecommendeActionColumn,
        'renderDeliveryColumn' : renderDeliveryColumn,
        'renderMrpColumn' : renderMrpColumn,
        'renderAmount' : renderAmountColumn
    }

    const getOffers=(discountList=[])=>{
        let offers = [];
        if(validate.isEmpty(discountList)){
            return
        }
        discountList.forEach((eachProductDiscount)=>{
            let offerOnPacks = (eachProductDiscount.discountPercent*100)%100 == 0;
            let pointsRedemOnPacks = (eachProductDiscount.redemptionPointsPerUnit*eachProductDiscount.quantity*100)%100 == 0;
            let reedemPoints = parseFloat(eachProductDiscount.redemptionPointsPerUnit*eachProductDiscount.quantity).toFixed(pointsRedemOnPacks?0:2)
            let offer = parseFloat(eachProductDiscount.discountPercent).toFixed(offerOnPacks?0:2);
            let noOfPacks = eachProductDiscount.noOfPacks>1?`${eachProductDiscount.noOfPacks} packs`:`${eachProductDiscount.noOfPacks} pack`;
            if(eachProductDiscount !== undefined && eachProductDiscount?.discountPercent>0){
                offers.push(`${offer}% Off on ${noOfPacks}`)
            }else if(eachProductDiscount !== undefined && parseInt(eachProductDiscount.promotiontype)===2 && parseFloat(eachProductDiscount.redemptionPointsPerUnit)>0) {
                offers.push(`${reedemPoints} Points awarded on ${noOfPacks}`)
            }
        })
        return offers.join(', ');
    }



    return (
        <React.Fragment>
            {isLoading || backDropLoader ? <div className="body-height d-flex justify-content-center align-items-center">
                <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText={"Please be patient while we prepare your data for loading!"} />
            </div>:<BodyComponent className={`body-height p-0`} >
                <div>
                    {validate.isNotEmpty(shoppingCart) && shoppingCart?.isDualShipmentAllowed &&
                        <ShipmentDetails shoppingCart={shoppingCart} setIsCustomerAgreeToSingleOrder={setIsCustomerAgreeToSingleOrder} isCustomerAgreeToSingleOrder={validate.isEmpty(isCustomerAgreeToSingleOrder) ? "N" : isCustomerAgreeToSingleOrder} />
                    }
                    {validate.isNotEmpty(shoppingCart) &&
                        <PatientInfo setSelectedPatientInfo={setSelectedPatientInfo} selectedPatientId={selectedPatientInfo?.patientId} {...props} />
                    }
                    {validate.isNotEmpty(shoppingCartDataSet) && validate.isNotEmpty(shoppingCartDataGrid) && <div><label class="d-block pb-0 p-12 font-weight-bold custom-fieldset">Products In Cart</label>
                        <div className='p-12 pb-0'>
                            <div className={`card me-0 `}>
                                <DynamicGridHeight id="shoppingCartProducts-datagrid" metaData={shoppingCartDataGrid} dataSet={shoppingCartDataSet} bottomSummaryRows={cartSummaryDisplay} className="block-size-100" >
                                    <CommonDataGrid ref={gridRef} {...shoppingCartDataGrid} dataSet={shoppingCartDataSet} callBackMap={shoppingCartCallBackMapping} bottomSummaryRows={cartSummaryDisplay} onEdit={handleGridColumnEdit} />
                                </DynamicGridHeight>
                            </div>
                        </div>
                    </div>}
                    {!isComplimentaryAdded && validate.isNotEmpty(complimentaryCartDataSet) && validate.isNotEmpty(complimentaryDataGrid) && <div className="mt-3"><label class="d-block pb-0 p-12 font-weight-bold custom-fieldset">{`Complimentary Products for you With ${complimentaryDiscount} Discount`} </label>
                        <div className='p-12 pb-0'>
                            <div className={`card me-0`}>
                                <DynamicGridHeight id="complimentary-datagrid" className="block-size-100" metaData={complimentaryDataGrid} dataSet={complimentaryCartDataSet} >
                                    <CommonDataGrid {...complimentaryDataGrid} dataSet={complimentaryCartDataSet} callBackMap={complimenteryCallBackMapping} />
                                </DynamicGridHeight>
                            </div>
                        </div>
                    </div>}
                    {validate.isNotEmpty(recommendedDataSet) && validate.isNotEmpty(recommendedDataGrid) && <div className="mt-3"><label class="d-block pb-0 p-12 font-weight-bold custom-fieldset">{validate.isNotEmpty(shoppingCart?.upsellProductHeading) ? shoppingCart?.upsellProductHeading : 'Recommended COVID-19 prevention products for you'}</label>
                        <div className='p-12 pb-0'>
                            <div className={`card me-0 `}>
                                <DynamicGridHeight id="recommended-datagrid" className="block-size-100" metaData={recommendedDataGrid} dataSet={recommendedDataSet} >
                                    <CommonDataGrid {...recommendedDataGrid} dataSet={recommendedDataSet} callBackMap={recommondedCallBackMapping} onEdit={handleEditRecommended} />
                                </DynamicGridHeight>
                            </div>
                        </div>
                    </div>}
                </div>
        </BodyComponent>}
        </React.Fragment>
    )
}