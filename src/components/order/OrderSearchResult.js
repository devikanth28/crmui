import CommonDataGrid, { RecordIcon, CallIcon, Shop, EditOrder, BackOrder, PaymentFailed, PrescriptionRequired, EprescriptionOrder, FilterIcon, SmsIcon ,Badges, Claimed, ChangeType, ClaimConstants } from "@medplus/react-common-components/DataGrid";
import qs from 'qs';
import { UncontrolledTooltip } from 'reactstrap';
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import Validate from "../../../src/helpers/Validate";
import { gotoMartCustomerPage, makeOutBoundCall } from "../../helpers/CommonRedirectionPages";
import OrderHelper from "../../helpers/OrderHelper";
import OrderService from "../../services/Order/OrderService";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import NoDataFound from "../Common/NoDataFound";
import { SidebarContext, UserContext ,AlertContext} from "../Contexts/UserContext";
import EditOrderModel from "./EditOrderModel";
import ViewPrescription from "./ViewPrescription";
import PrepareOrderDetails from "./PrepareOrderDetails";
import SeachNow from "../Common/SearchNow";
import { TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import { CRM_UI } from "../../services/ServiceConstants";
import dateFormat from 'dateformat';
import useRowClassFunction from "../../hooks/useRowClassFunction";
import HandleClaims from "../Common/HandleClaims";
import { RECORD_TYPE, claimOrders, unclaimOrders, processOrderClaimedAlready } from "../../helpers/HelperMethods";
import ClaimTabs from "../Common/ClaimTabs";
import { modifyUrlColumnOptions, COLUMN_OPTIONS_URL_KEY_CONSTANT, prepareModifiedColumnOptionsMap } from "../../helpers/ColumnOptionsHelper";
import { handleClaimRequest } from "../Common/HandleClaims";
import ClaimUnclaimHandler from "../Common/ClaimUnclaimHandler";
import CurrencyFormatter from "../Common/CurrencyFormatter";

const defaultCriteria = {
    limitTo: 30
}
 
export function searchElement(namekey , orderIds ,key) {
    for(let i =0 ;i<orderIds.length ; i++ ) {
        if(orderIds[i][key] == namekey) {
            return i;
        }
    }
    return -1;
}

const OrderSearchResult = (props) => {

    const { sidebarCollapsedFlag, setSidebarCollapsedFlag } = useContext(SidebarContext);
    const userSessionInfo = useContext(UserContext);
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const gridRef = useRef(null);
    const [loading, isLoading] = useState(false);
    const [fetchClaimedOrdersLoading, setFetchClaimedOrdersLoading] = useState(false);
    const [gridData, setGridData] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const [techInfoUrl, setTechInfoUrl] = useState("");
    const [techInfoDni, setTechInfoDni] = useState("");
    const [clientIpAddress, setClientIpAddress] = useState("");
    const [searchCriteria, setSearchCriteria] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState(undefined);
    const [selectedCartId, setSelectedCartId] = useState(undefined);
    const [selectedCustomerId, setSelectedCustomerId] = useState(undefined);
    const [selectedPrescriptionOrderId, setSelectedPrescriptionOrderId] = useState(undefined);
    const [openEditOrderModel, setOpenEditOrderModel] = useState(false);
    const [openOrderDetailModal, setOpenOrderDetailModal] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalClaimedRecords, setTotalClaimedRecords] = useState(undefined);
    const [totalRecordsAnimation, setTotalRecordsAnimation] = useState(false);
    const [totalClaimedRecordsAnimation, setTotalClaimedRecordsAnimation] = useState(false);
    const [searchParamsExist, setSearchParamsExist] = useState(false);
    const [copySuccess, setCopySuccess] = useState(null);    
    const [claimedDataSet, setClaimedDataSet] = useState([]);
    const [isClaimed, setIsClaimed] = useState(false);
    const [rowClassFunction, rowClaimedClassFunction] = useRowClassFunction({uniqueId:'orderId',selectedOrderId});
    const [activeTabId,setActiveTabId] = useState(2);
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const [selectedRecordRow, setSelectedRecordRow] = useState(undefined);
    const [claimedRecordsCount, setClaimedRecordsCount] = useState(0);
    const [orderIdsList, setOrderIdsList] = useState([]);
    const [columnOptionsMap, setColumnOptionsMap] = useState({});


    const { setStackedToastContent } = useContext(AlertContext);
    const validate = Validate();

    const allowedOrdersClaimRight = useMemo(() => {
        if(userSessionInfo?.vertical && userSessionInfo.vertical == "V"){
            return false;
        }
        return true;
    }, [userSessionInfo])

    useEffect(() => {
        setOpenOrderDetailModal(false);
        setSidebarCollapsedFlag(sidebarCollapsedFlag);
        setOpenEditOrderModel(false);
        Object.entries(params).forEach(([key, value]) => {
            if(key == "activeClaimedTab"){
                delete params[key];
                setActiveTabId(1);
            }
            if(key == COLUMN_OPTIONS_URL_KEY_CONSTANT){
                setColumnOptionsMap(prepareModifiedColumnOptionsMap(props));
            }
        });
        const paramsSearchCriteria = getActualSearchCriteria(params);
        const currentSearchCriteria = getActualSearchCriteria(searchCriteria);
        if(validate.isEqualObject(paramsSearchCriteria,currentSearchCriteria)) {
            return;
        }
        if(validate.isNotEmpty(params)) {
            Object.entries(params).forEach(([key, value]) => {
                if (validate.isEmpty(value))
                    delete params[key];
            });
        }
        if (validate.isNotEmpty(params)) {
            setSearchParamsExist(true);
            let limitTo = params.limitTo ? params.limitTo : defaultCriteria.limitTo;
            setSearchCriteria({ ...params, limitFrom: params.pageNumber ? (params.pageNumber-1)*limitTo : 0, limitTo: limitTo });
            if (validate.isNotEmpty(params.fromDate) && validate.isNotEmpty(params.toDate)) {
                let fromDate = dateFormat(params.fromDate, "yyyy-mm-dd") + " 00:00:00";
                let toDate = dateFormat(params.toDate, "yyyy-mm-dd") + " 23:59:59";
                setSearchCriteria({ ...params, fromDate: fromDate, toDate: toDate});
                getInitialData({ ...params, limitFrom: params.pageNumber ? (params.pageNumber-1)*limitTo : 0, limitTo: limitTo, fromDate: fromDate, toDate: toDate });
            }else{
                getInitialData({ ...params, limitFrom: params.pageNumber ? (params.pageNumber-1)*limitTo : 0, limitTo: limitTo });
            }
        }
    }, [props.location.search]);

    useEffect(() => {
        if((typeof totalClaimedRecords == "undefined" || totalClaimedRecords > 0) && activeTabId == 1){
            getInitialClaimedDataSet();
        }
        setOrderIdsList([]);
        setClaimedRecordsCount(0);

    }, [activeTabId])

    const getInitialData = async (searchCriteria) => {
        const searchParams = new URLSearchParams(props.location.search);
        if(!searchParams.has("activeClaimedTab")){
            setActiveTabId(2);
        }
        isLoading(true);
        delete searchCriteria['v'];
        const data = await getOrders(searchCriteria);
        if (validate.isNotEmpty(data)) {
            setGridData(validate.isNotEmpty(data.dataGrid) ? data.dataGrid : []);
            setDataSet(validate.isNotEmpty(data.dataSet) ? [...data.dataSet] : []);
            setTechInfoUrl(data.techInfoUrl);
            setTechInfoDni(data.techInfoDni);
            setClientIpAddress(data.clientIpAddress);
            setTotalRecords(data.totalRecords);
            setTotalRecordsAnimation(true);            
        }
        isLoading(false);
    }

    const handleOrderDetailsModal = (value) => {
        setOpenOrderDetailModal(value);
        setSidebarCollapsedFlag(value);
        setIsClaimed(false);
        if(!value) {
            setTimeout(() => {
                setSelectedOrderId(undefined);
            },2000)
        }

    }


    const handleEditOrderModal = (value) => {
        setOpenEditOrderModel(value);
        setIsClaimed(false);
        if(!value) {
            setTimeout(() => {
                setSelectedOrderId(undefined);
            },2000)
        }
    }

    /* const handleClaimSuccess=async(orderId)=>{
        const response = await getOrders({ ...searchCriteria, orderId:orderId}).then(response=>{
          if(Validate().isEmpty(response)){
            return null;
          }
          return response;
        })
        const dataForOrderId = response.dataSet[0];
        if (Validate().isEmpty(dataForOrderId)) {
          let temporaryDataSet = dataSet;
          temporaryDataSet.splice(temporaryDataSet.findIndex(obj => obj.orderId == orderId), 1);
          setDataSet([...temporaryDataSet]);
        } else {
          setDataSet(dataSet.map(eachRecord => {
            if (eachRecord.orderId == orderId) {
              return dataForOrderId;
            }
            return eachRecord;
          }));
          setSelectedOrderId(orderId);
        }
    } */

    const getOrders = async (obj) => {
        const data = await OrderService().getOrders(obj).then(data => {
            if (data && data.statusCode === "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                return data.dataObject;
            } else {
                setStackedToastContent({ toastMessage: "Error while fetching data, Please Try Again!", position: TOAST_POSITION.BOTTOM_START });
                console.log("error while fetching data")
            }
        }).catch((err) => {
            setStackedToastContent({ toastMessage: "Something went wrong, Please Try Again!", position: TOAST_POSITION.BOTTOM_START });
            console.log(err)
        });
        return data;
    }

    const handleFailure = () => {
        setStackedToastContent({ toastMessage: "Customer is Already Opened", position: TOAST_POSITION.BOTTOM_START });
      }

    function renderCustomerIdColumn(props) {
        let customerType = "";
        if ("Kynzo" === props.row.requestFrom) {
            customerType = "KYNZO";
        } else if ("DOCONLINE" === props.row.otherDetails.orderType) {
            customerType = "DOCONLINE";
        }
        return <React.Fragment>
            <a className="btn btn-sm btn-link w-100 text-start" href="javascript:void(0)" rel="noopener" aria-label={props.row.customerId} role="link" title="View customer details" onClick={() => gotoMartCustomerPage({ customerId: props.row.customerId, orderId: props.row.orderId, locality: props.row.latLong, beautyCustomerId: props.row.beautyCustomerId, mobile: props.row.mobileNo, hubStoreId: props.row.hubStoreId, customerType: customerType },handleFailure)}>{props.row.customerId}</a>
        </React.Fragment>
    }

    const ShopAndPrescButtons = (props) => {
        return <React.Fragment>
            <Shop handleOnClick={() => { gotoMartCustomerPage({ pageToRedirect: "Catalog", customerId: props.row.customerId, orderId: props.row.orderId, locality: props.row.latLong, beautyCustomerId: props.row.beautyCustomerId, mobile: props.row.mobileNo, hubStoreId: props.row.hubStoreId },handleFailure) }} />
            {props.row.otherDetails.showEditButton && <EditOrder handleOnClick={() => { showEditOrderInfo(props.row.orderId) }} />}
            {(validate.isNotEmpty(props.row.prescriptionOrderId) && props.row.prescriptionOrderId > 0) &&
                <ViewPrescription  {...props} tooltip="View Prescription"></ViewPrescription>

            }
            {validate.isNotEmpty(props.row.prescriptionOrderId) && props.row.prescriptionOrderId > 0 && ("I" === props.row.otherDetails.orderStatus || "E" === props.row.otherDetails.orderStatus) &&
                <ViewPrescription forms={true} {...props} tooltip="Edit Prescription"></ViewPrescription>
            }

        </React.Fragment>
    }

    const handleClaimFailure = (message, recordId) => {
        if(message.indexOf("already claimed by") != -1){
            let processedDataset = processOrderClaimedAlready(recordId, dataSet, "orderId");
            setDataSet(processedDataset);
        }
        setStackedToastContent({ toastMessage: message });
    }

    function renderActionColumn(props) {
        return <React.Fragment>
            <div style={{ display: "flex" }}>
                {(!allowedOrdersClaimRight || ((validate.isNotEmpty(props.row.claimedBy) && props.row.claimedBy == "S" && activeTabId==1) || (validate.isEmpty(props.row.claimedBy) && props.row.status == "Cancelled")))&&
                    <React.Fragment>
                        {validate.mobileNumber(props.row.mobile) &&
                            <CallIcon handleOnClick={() => makeOutBoundCall(`${techInfoUrl}?cmd=AGENTMAKECALL&${techInfoDni}&${props.row.mobileNo}&&&${clientIpAddress}&`)} tooltip={"Call Customer"}/>
                        }
                        {userSessionInfo.roles && userSessionInfo.roles.includes("ROLE_CRM_MEDI_ASSISIT") ? <ShopAndPrescButtons {...props} /> : ("Kynzo" === props.row.requestFrom
                            ? props.row.otherDetails.showEditButton && <EditOrder handleOnClick={() => { showEditOrderInfo(props.row.orderId) }} />
                            :
                            <React.Fragment>
                                <RecordIcon handleOnClick={() => { gotoMartCustomerPage({ pageToRedirect: "Communication", customerId: props.row.customerId, orderId: props.row.orderId, locality: props.row.latLong, beautyCustomerId: props.row.beautyCustomerId, mobile: props.row.mobileNo }, handleFailure) }} />
                                <ShopAndPrescButtons {...props} />
                            </React.Fragment>
                        )}
                    </React.Fragment>
                }
                {allowedOrdersClaimRight && validate.isNotEmpty(props.row.claimedBy) && (props.row.claimedBy == "O" || (props.row.claimedBy == "S" && activeTabId!=1))
                    ? <React.Fragment>
                        <Claimed id={"record_"+props.row.orderId}/>
                    </React.Fragment>
                    : <React.Fragment/>
                }
               { (allowedOrdersClaimRight && ((validate.isEmpty(props.row.claimedBy) && props.row.status != "Cancelled") || (props.row.claimedBy == "S" && activeTabId!=2) || (activeTabId == 1 && props.row.status == "Cancelled"))) && <HandleClaims recordId = {props.row.orderId}  onSuccess={(recordId) => processClaimAction(recordId, orderIdsList, props.row)} recordType={RECORD_TYPE.MART_ORDER} onFailure={(message, recordId)=>handleClaimFailure(message, recordId)} claimedBy={props.row.claimedBy}/>}
            </div>
        </React.Fragment>
    }

    const showEditOrderInfo = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenEditOrderModel(true);
    }
    const onclickDisplayOrderId = (orderId, cartId, customerId, prescriptionOrderId) => {
        setSelectedOrderId(orderId);
        setSelectedCartId(cartId);
        setSelectedCustomerId(customerId);
        setSelectedPrescriptionOrderId(prescriptionOrderId);
        setOpenOrderDetailModal(true);
    }
   
    async function copyToClip(text) {
        await navigator.clipboard.writeText(text);
        setCopySuccess(text);
        /* setTimeout(()=>{
            setCopySuccess(null);
        },2000) */
      }

    // function checkCopied(){
    //     alert(navigator.clipboard.readText());
    //     setCopySuccess(navigator.clipboard.readText());
    // }

    function renderDisplayOrderIdColumn(props) {
        let textColorClass = "btn btn-sm btn-link w-100";
        if (props.row.paymentType.includes("Payment Failed") && props.row.convertToCodNotAllowed) {
            textColorClass = textColorClass+"text-danger";
        }
        return <React.Fragment>
        <div className='copy' >      
      <span className="copy-icon  position-absolute"  style={{cursor:"pointer"}}  onClick={()=>copyToClip(props.row.displayOrderId)}>  

      
        <span className={ copySuccess == props.row.displayOrderId ? "" : "d-none"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" id="man1">
                <g id="done-icn-16" transform="translate(-262 -283)">
                <rect id="Rectangle_12488" data-name="Rectangle 12488" width="16" height="16" rx="3" transform="translate(262 283)" fill="none"/>
                <path id="np_check_5468232_000000" d="M21,15a6,6,0,1,0,6,6A6,6,0,0,0,21,15Zm2.588,4.952-3.323,3.323a.545.545,0,0,1-.177.118.535.535,0,0,1-.581-.118l-1.671-1.67a.536.536,0,0,1,.757-.757l1.292,1.292,2.945-2.945a.536.536,0,1,1,.758.757Z" transform="translate(249 270)" fill="#11b094"/>
                </g>
            </svg> 
            <UncontrolledTooltip placement="bottom" target={"man1"}>        
            Copied
        </UncontrolledTooltip>
        </span>   
        <span className={ copySuccess == props.row.displayOrderId ? "d-none" : ""}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" id="man">
          <g id="text_copy_black_icon_16px" transform="translate(-180.258 -387.452)">
            <rect id="Rectangle_3299" data-name="Rectangle 3299" width="16" height="16" rx="3" transform="translate(180.258 387.452)" fill="none"/>
            <path id="copy-icn" d="M9.275,4.214H5.03v-.6a1.107,1.107,0,0,1,1.1-1.1h5.657a1.107,1.107,0,0,1,1.1,1.1V9.271a1.107,1.107,0,0,1-1.1,1.1h-.6V6.128A1.919,1.919,0,0,0,9.275,4.214Zm-5.057,0h-.6A1.919,1.919,0,0,0,1.7,6.128v5.657A1.919,1.919,0,0,0,3.618,13.7H9.275a1.919,1.919,0,0,0,1.914-1.914v-.6h.6A1.919,1.919,0,0,0,13.7,9.271V3.614A1.919,1.919,0,0,0,11.789,1.7H6.132A1.919,1.919,0,0,0,4.217,3.614Zm-.6.812H9.275a1.107,1.107,0,0,1,1.1,1.1v5.657a1.107,1.107,0,0,1-1.1,1.1H3.618a1.107,1.107,0,0,1-1.1-1.1V6.128a1.107,1.107,0,0,1,1.1-1.1Z" transform="translate(180.555 387.752)" fill="#080808"/>
          </g>
        </svg>
        <UncontrolledTooltip placement="bottom" target={"man"}>
        
         Click to Copy Text
      </UncontrolledTooltip>
        </span>
     </span>
      <a className={textColorClass}  id={props.row.displayOrderId} href="javascript:void(0)" rel="noopener" aria-label={props.row.displayOrderId} role="link" title="View order details" onClick={() => {setSidebarCollapsedFlag(true); onclickDisplayOrderId(props.row.orderId, props.row.cartId, props.row.customerId, props.row.prescriptionOrderId);setSelectedRecordRow(props.row)}}>{props.row.displayOrderId}</a>
       
     </div>
             </React.Fragment>
    }

    function renderStatusColumn(props) {
        let statusCellClass = OrderHelper().getBadgeColorClassForStatus(props.row.status) + " badge rounded-pill";
        return <React.Fragment>
            <div className={statusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.status)}</div>
        </React.Fragment>
    }

    function renderEPrescStatusColumn(props) {
        let prescStatusCellClass = "";
        if (validate.isNotEmpty(props.row.ePrescStatus)) {
            prescStatusCellClass = OrderHelper().getBadgeColorClassForStatus(props.row.ePrescStatus) + " badge rounded-pill ms-1";
        }
        return <React.Fragment>
            {
                validate.isNotEmpty(props.row.ePrescStatus)
                    ? <div style={{display:"flex", justifyContent:"center"}} className={prescStatusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.ePrescStatus)}</div>
                    : <div style={{display:"flex", justifyContent:"center"}}>-</div>
            }
        </React.Fragment>
    }

    function renderPaymentStatusColumn(props) {
        let cellClass = "";
        if (validate.isNotEmpty(props.row.paymentStatus)) {
            cellClass = OrderHelper().getBadgeColorClassForStatus(props.row.paymentStatus) + " badge rounded-pill";
        }
        return <React.Fragment>
            {
                validate.isNotEmpty(props.row.paymentStatus) && props.row.paymentType.toLowerCase() === "online"
                    ? <div className={cellClass} style={{display:"flex", justifyContent:"center"}}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.paymentStatus)}</div>
                    : <div style={{display:"flex", justifyContent:"center"}}>-</div>
            }
        </React.Fragment>
    }

    function renderTypeColumn(props) {
        return <React.Fragment>
            {!props.row.otherDetails.containsBackOrder && !props.row.otherDetails.isPrescriptionRequired && !props.row.otherDetails.isEPrescriptionRequired && props.row.paymentStatus.toLowerCase() !== "payment failed"
                ? <div style={{display:"flex", justifyContent:"center"}}>-</div>
                : <div style={{ display: "flex", justifyContent:"center" }}>
                    {props.row.otherDetails.containsBackOrder && <BackOrder tooltip="Contains Back Order Product" id={`backOrderBadge_${props.row.orderId}`} />}
                    {props.row.paymentType.toLowerCase() === "online" && props.row.paymentStatus.toLowerCase() === "payment failed" && <PaymentFailed id={`paymentFailedBadge_${props.row.orderId}`} />}
                    {props.row.otherDetails.isPrescriptionRequired && <PrescriptionRequired id={`prescriptionRequiredBadge_${props.row.orderId}`} />}
                    {props.row.otherDetails.isEPrescriptionRequired && <EprescriptionOrder id={`ePrescriptionOrderBadge_${props.row.orderId}`} />}
                </div>
            }
        </React.Fragment>
    }

    function renderHubStoreIdColumn(props) {
        return StoreDetails(props.row.storeId, props.row.storeName);
    }
    function renderPickStoreIdColumn(props) {
        return StoreDetails(props.row.pickStoreId, props.row.pickStoreName)
    }

    function renderOrderAmountColumn(props) {
        return <React.Fragment>
            <div className="text-end">
                <CurrencyFormatter data={props.row.otherDetails.orderType !== "PB_ORDER" ? props.row.orderAmount : props.row.orderAmount} decimalPlaces={2} />
            </div>
        </React.Fragment>
    }

    function StoreDetails(storeId, storeName) {
        return <React.Fragment>
            {storeId} - {storeName}
        </React.Fragment>
    }



    function handleCheckBoxColumn(props){
        const{ row }= props;
        let orderIds = [...orderIdsList];
        const handleOnCheckBoxChange = (event) => {
            if(activeTabId == "2"){
                if(event.target.checked == true){
                    if((totalClaimedRecords + claimedRecordsCount) > 9){
                        alert("claim limit exceeded .")
                        return;
                    }
                    setClaimedRecordsCount((prevCount) => prevCount + 1);
                    orderIds.push(row);
                    setOrderIdsList(orderIds);
                }
                else{
                    let index_of_row  = searchElement(row.orderId , orderIds,'orderId');
                    if(index_of_row !== -1){
                        orderIds.splice(index_of_row,1);
                    }
                    setClaimedRecordsCount(prevCount => prevCount - 1);
                    setOrderIdsList(orderIds);
                }
            }
            else{
                if(event.target.checked == true){
                    orderIds.push(row);
                    setOrderIdsList(orderIds);
                }
                else{
                    let index_of_row  = searchElement(row.orderId , orderIds,'orderId');
                    if(index_of_row !== -1){
                        orderIds.splice(index_of_row,1);
                    }
                    setOrderIdsList(orderIds);
                }
            }
        }
        return <React.Fragment>
              { ( !allowedOrdersClaimRight || row.status == "Cancelled" || (validate.isNotEmpty(row.claimedBy) && activeTabId == 2 )) ? <></>
              : <input type={'checkbox'}  checked={searchElement(row.orderId , orderIdsList,'orderId') != -1} onChange={(event) => {handleOnCheckBoxChange(event)}} />
              } 
       </React.Fragment>
    }
    function handleCheckBoxHeaderFunction(props) {

        const handleOnCheckAndUncheck = (event) => {
            if(event.target.checked == true){
                let claimedOrderIds = claimedDataSet.map(order => order);
                setOrderIdsList(claimedOrderIds);
            }
            else{
                setOrderIdsList([]);
            }

        }
        return <React.Fragment>
            { (activeTabId == 1 && allowedOrdersClaimRight) ?  
               <input type={'checkbox'} className={(orderIdsList.length != claimedDataSet.length && orderIdsList.length >= 1) ? "checkbox-indeterminante" : ""} checked = {orderIdsList.length == claimedDataSet.length} onChange={(event) => {handleOnCheckAndUncheck(event)}} /> 
               : <></>
            }
        </React.Fragment>
    }
    const callBackMapping = {
        'renderCustomerIdColumn': renderCustomerIdColumn,
        'renderDisplayOrderIdColumn': renderDisplayOrderIdColumn,
        'renderTypeColumn': renderTypeColumn,
        'renderActionColumn': renderActionColumn,
        'renderPickStoreIdColumn': renderPickStoreIdColumn,
        'renderHubStoreIdColumn': renderHubStoreIdColumn,
        'renderStatusColumn': renderStatusColumn,
        'renderEPrescStatusColumn': renderEPrescStatusColumn,
        'renderOrderAmountColumn': renderOrderAmountColumn,
        'renderPaymentStatusColumn': renderPaymentStatusColumn,
        'rowClass': isClaimed ? rowClaimedClassFunction : rowClassFunction,
        'checkBox' : handleCheckBoxColumn ,
        'checkBoxHeader' : handleCheckBoxHeaderFunction
    }

    const getActualSearchCriteria = (criteria) => {
        const {pageNumber,limitTo,limitFrom,[COLUMN_OPTIONS_URL_KEY_CONSTANT]: columnOptionsUrlKey,...rest} = criteria;
        return rest;
    }

    const appendParamsToUrl = (pageNumber, limitTo) => {
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        props.history.replace(`${CRM_UI}/orderSearch?${qs.stringify({...params, pageNumber:pageNumber, limitTo:limitTo})}`);
    }

    const remoteDataFunction = async ({ startIndex, limit, sortColumns, changeType, filters ,pageNumber}) => {
        if(validate.isNotEmpty(filters) && filters['mobileNo'] && filters['mobileNo'].value && filters['mobileNo'].value.length!==10) {
            return {status: false}
        }
        let params = { ...searchCriteria, limitFrom: startIndex, limitTo: limit };
        Object.entries(filters).forEach((data) => {
            if(data[0]==="mobileNo" ){
                data[1].value && data[1].value.length===10 ? params = {...params, [data[0]]: data[1].value} : {...params};
            }else if(data[1].value){
                params = {...params, [data[0]]: data[1].value};
            }
        })
        appendParamsToUrl(pageNumber, limit);
        const data = await getOrders({ ...params });
        if (userSessionInfo?.vertical && userSessionInfo.vertical == "V") {
           if(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet)) {
                if(changeType == ChangeType.PAGINATION_INFO && startIndex > 0){
                    setDataSet([...dataSet, ...data.dataSet]);
                } else {
                    setDataSet(data.dataSet);
                }
           } 
        }else{
            setDataSet(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet) ? data.dataSet : []);
        }
        return { dataSet: data?.dataSet ? data.dataSet : [], totalRowsCount: data.totalRecords, status: true }
    }
    const processClaimAction = (recordId, orderIdsList, row) => {
         if(validate.isEmpty(orderIdsList)){
            orderIdsList.push(recordId);
        }
        else if(validate.isNotEmpty(orderIdsList) && orderIdsList.indexOf(recordId) == -1){
            orderIdsList.length = 0;
            orderIdsList.push(recordId);
        }
        let claimObject = null;
        if (validate.isEmpty(row.claimedBy) || row.claimedBy=="O") {
            claimObject = claimOrders(orderIdsList, dataSet, claimedDataSet,"orderId");
            setTotalClaimedRecords(totalClaimedRecords+orderIdsList.length);
            setTotalClaimedRecordsAnimation(true);
            setIsClaimed(true);
        } else {
            claimObject = unclaimOrders(orderIdsList, dataSet, claimedDataSet, "orderId");
            setTotalClaimedRecords(totalClaimedRecords-orderIdsList.length);
            setTotalClaimedRecordsAnimation(true);
        }
        setClaimedDataSet(claimObject?.claimedDataSet);
        setDataSet(claimObject?.dataset);
        setStackedToastContent({ toastMessage: (orderIdsList.length == 1 ? ("Order ID(s) " + orderIdsList + " ") : ("Order ID(s) ")) + claimObject.toastMessage });
        setOrderIdsList([]);
        setClaimedRecordsCount(0);
        setSelectedOrderId(recordId);
        if(!openOrderDetailModal){
            setTimeout(()=>{
                setSelectedOrderId(undefined);
            },2000)
        }
    }

    const getInitialClaimedDataSet = async () => {
        setFetchClaimedOrdersLoading(true);
        if (validate.isEmpty(claimedDataSet) || (totalClaimedRecords > 0 && claimedDataSet.length != totalClaimedRecords)) {
            await OrderService().getMartClaimedOrders().then(data => {
                if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                    setClaimedDataSet(data.dataObject.dataSet);
                    setTotalClaimedRecords(data.dataObject.dataSet.length);
                    setTotalClaimedRecordsAnimation(true);
                    setGridData(data?.dataObject?.dataGrid);
                }else {
                    if(validate.isEmpty(gridData)){
                        setGridData(data?.dataObject?.dataGrid);
                    }
                    setTotalClaimedRecords(0);
                }
            }).catch((err) => {
                console.log(err)
            });
        }
        setFetchClaimedOrdersLoading(false);
    }

    const claimedMetaInfo = useMemo(() => {
        return gridData ? { ...gridData, columns: [...gridData.columns].map((column, index) => {
            let columnObject = {...column}
            if(column.showFilter) {
                columnObject['showFilter'] = false;
            }
            return columnObject;
        }), paginationInfo: {isPaginationRequired: false } }:undefined
    },[gridData]);

    const gridMetaInfo = useMemo(() => {
        return gridData ? { ...gridData, 
            totalRowsCount: totalRecords,
            paginationInfo : {
                ...gridData.paginationInfo,
                initialPageNumber: params.pageNumber ? Number(params.pageNumber)  : gridData?.paginationInfo?.initialPageNumber ,
                limit: params.limitTo ? params.limitTo:defaultCriteria.limitTo
            }
         }:undefined

    },[gridData,totalRecords,params])

    const displayMetaInfo  =  useMemo(() => {
        return activeTabId == 1 ? {...claimedMetaInfo} : {...gridMetaInfo}

    },[claimedMetaInfo,gridMetaInfo,activeTabId])

    const onColumnOptionChange = (rowDataKey, columnOptionsMap) => {
        modifyUrlColumnOptions(props, rowDataKey, columnOptionsMap);
        setColumnOptionsMap(columnOptionsMap);
    }

    const actionSuccess = (recordid,listofOrderIds)=>{
        processClaimAction(listofOrderIds[0], listofOrderIds, orderIdsList[0])
    }

     const claimedSet =(claim)=>{
        let listofOrderIds = orderIdsList.map(function (el) { return el.orderId; });
        handleClaimRequest({'recordId':listofOrderIds[0], 'claimedBy':(claim == ClaimConstants.CLAIM) ?' ' : 'S', recordType:RECORD_TYPE.MART_ORDER , 'onSuccess':(recordid)=>{actionSuccess(recordid,listofOrderIds)},'onFailure':(message,recordid)=>{handleClaimFailure(message,recordid)}},listofOrderIds)
    }
    
    return <React.Fragment>

        <Wrapper showHeader={false}>
            <ClaimTabs {...props} allowedOrderClaimRight={allowedOrdersClaimRight} selectedRecordsLength={orderIdsList.length}  claimedSet={claimedSet}  recordType={RECORD_TYPE.MART_ORDER} setTotalClaimedRecords={setTotalClaimedRecords} loading={(loading || fetchClaimedOrdersLoading)}  headerRef={headerRef} footerRef={footerRef} tabOneHeaderContent={"My Claimed List"} tabTwoHeaderContent={"Mart Order Search Results"} claimedCount={totalClaimedRecords} totalRecords={typeof totalRecords == "undefined" ? 0 : totalRecords} totalRecordsAnimation={totalRecordsAnimation} setTotalRecordsAnimation={setTotalRecordsAnimation} totalClaimedRecordsAnimation={totalClaimedRecordsAnimation} setTotalClaimedRecordsAnimation={setTotalClaimedRecordsAnimation} activeTabId={activeTabId} setActiveTabId={setActiveTabId}>
               {(!loading && !fetchClaimedOrdersLoading && validate.isNotEmpty(gridData)) ? ((activeTabId == 2 && totalRecords != 0) || (activeTabId == 1 && validate.isNotEmpty(claimedDataSet))) ? <div className={`card h-100`}>
                    <CommonDataGrid {...displayMetaInfo}
                        customGridToolbar={{component: ClaimUnclaimHandler, componentProps: {activeTabId, selectedRecordsLength: orderIdsList.length, claimedSet}}}
                        dataSet={activeTabId == 1 ? (claimedDataSet ? [...claimedDataSet] : []) : (dataSet ? [...dataSet] : [])}
                        callBackMap={callBackMapping}
                        remoteDataFunction={remoteDataFunction}
                        onColumnOptionChange={onColumnOptionChange}
                        columnOptionsMap = {columnOptionsMap}
                    /> </div>
                    : ((searchParamsExist && activeTabId == 2 && totalRecords == 0 ) || ( activeTabId == 1 && totalClaimedRecords == 0 ) ? <NoDataFound searchButton = {activeTabId == 2} text={ activeTabId == 2 ?"No orders found are based on the given criteria. Try other details!" : "No Claimed Orders found for you!"} /> : null )
                    : null
                }
                {!searchParamsExist && activeTabId == 2 && <SeachNow {...props} />}
                {openOrderDetailModal && <PrepareOrderDetails {...props} setTotalClaimedRecords={setTotalClaimedRecords} setDataSet={setDataSet} allowedOrdersClaimRight={allowedOrdersClaimRight} claimedDataSet={claimedDataSet} setClaimedDataSet={setClaimedDataSet} processClaimAction={processClaimAction} handleClaimFailure={handleClaimFailure} row={selectedRecordRow} dataSet={dataSet} orderId={selectedOrderId} cartId={selectedCartId} customerId={selectedCustomerId} prescriptionOrderId={selectedPrescriptionOrderId} openOrderDetailModal={openOrderDetailModal} setOpenOrderDetailModal={handleOrderDetailsModal} />}
                {openEditOrderModel && <EditOrderModel setDataSet={setDataSet} dataSet={dataSet} orderId={selectedOrderId} openModal={openEditOrderModel} claimedDataSet={claimedDataSet} setClaimedDataSet={setClaimedDataSet} setOpenModal={handleEditOrderModal} setSelectedOrderId={setSelectedOrderId} />}
            </ClaimTabs>
        </Wrapper>
    </React.Fragment>;
}

export default OrderSearchResult;