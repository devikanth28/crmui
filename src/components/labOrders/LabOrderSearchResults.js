import CommonDataGrid, {PaymentAwaited,RetryPayment,Payment, AcknowledgedIcn, AssignIcn, CallIcon, CancelIcon, EditBarcode, PaymentReceipt, PaymentStatus, PrescriptionUpload, ReAssign, ReScheduleIcon, SampleCollectedIcon, VisitProof, Badges, Claimed, ChangeType, ClaimConstants, CustomPopOver } from '@medplus/react-common-components/DataGrid';
import { ALERT_TYPE, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import qs from 'qs';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { UncontrolledTooltip } from 'reactstrap';
import { makeOutBoundCall, redirectCustomerPage } from '../../helpers/CommonRedirectionPages';
import { downloadFile, getLabStausBadgeColourClass } from '../../helpers/LabOrderHelper';
import OrderHelper from '../../helpers/OrderHelper';
import Validate from '../../helpers/Validate';
import useRowClassFunction from '../../hooks/useRowClassFunction';
import LAB_ORDER_CONFIG from '../../services/LabOrder/LabOrderConfig';
import LabOrderService from '../../services/LabOrder/LabOrderService';
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import { CollectPaymentsIcon } from '../Common/ActionSvgIcons';
import { BodyComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure';
import CommonConfirmationModal from '../Common/ConfirmationModel';
import NoDataFound from '../Common/NoDataFound';
import SeachNow from '../Common/SearchNow';
import { AlertContext, SidebarContext, UserContext } from '../Contexts/UserContext';
import CancelOrder from '../order/CancelOrder';
import CollectPaymentsModal from './CollectPaymentsModal';
import HealthRecordModal from './labOrderModal/HealthRecordModal';
import LabOrderDetailModal from './labOrderModal/LabOrderDetailModal';
import LabOrderRescheduleModal from './labOrderRescheduleModal/LabOrderRescheduleModal';
import LabOrderSampleCollect from './LabOrderSampleCollect';
import HandleClaims from '../Common/HandleClaims';
import { claimOrders, processOrderClaimedAlready, RECORD_TYPE, unclaimOrders } from '../../helpers/HelperMethods';
import ClaimTabs from '../Common/ClaimTabs';
import { modifyUrlColumnOptions, COLUMN_OPTIONS_URL_KEY_CONSTANT, prepareModifiedColumnOptionsMap } from "../../helpers/ColumnOptionsHelper"
import { searchElement } from '../order/OrderSearchResult';
import { handleClaimRequest } from '../Common/HandleClaims';
import { flattenColumnsList } from '../../helpers/CommonHelper';
import ClaimUnclaimHandler from '../Common/ClaimUnclaimHandler';
import CurrencyFormatter from '../Common/CurrencyFormatter';


export default (props) => {

  const defaultCriteria = {
    startIndex: 0,
    limit: 30
  }

  const { sidebarCollapsedFlag, setSidebarCollapsedFlag } = useContext(SidebarContext);
  const validate = Validate();
  const labOrderService = LabOrderService();
  const headerRef = useRef(0);
  const footerRef = useRef(0);
  const gridRef = useRef(null);
  const { setStackedToastContent } = useContext(AlertContext);
  const userSessionInfo = useContext(UserContext); 

  const [allowedLabOrderClaimRight, setAllowedLabOrderClaimRight] = useState(true);
  const [initialLoading, setInitialLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [gridData, setGridData] = useState(undefined);
  const [dataSet, setDataSet] = useState([]);
  const [showOrderDeatilsModal, setShowOrderDeatilsModal] = useState(false);
  const [orderDeatilsModalObj, setOrderDeatilsModalObj] = useState(undefined);
  const [rescheduleModalObj, setRescheduleModalObj] = useState({});
  const [showOrderScheduleModal, setShowOrderScheduleModal] = useState(false);
  const [collectPaymentsModalObj, setCollectPaymentsModalObj] = useState({});
  const [showCollectPaymentsModal, setShowCollectPaymentsModal] = useState(false);
  const [showSampleCollectModal, setShowSampleCollectModal] = useState(false);
  const [flag, setFlag] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmationModal,setConfirmationModal] = useState(false);
  const [cancelButtonValue, setCancelButtonValue] = useState(undefined);
  const [cancelButtonInfo, setCancelButtonInfo] = useState(undefined);
  const [value,setValueForModal] = useState(null);
  const [cancelReason,setCancelReason] = useState(null);
  const [scanModal, setScanModal] = useState(false);
  const [scanModalObj, setScanModalObj] = useState(undefined);
  const [searchCriteria, setSearchCriteria] = useState({});
  const [searchParamsExist, setSearchParamsExist] = useState(false);
  const [confirmationModalProps,setConfirmationModalProps] = useState({message:"",onSubmit:null,headerText:""});
  const [disableMode, setDisableMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(null); 
  const [activeTabId,setActiveTabId] = useState(2);
  const [claimedData,setClaimedData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalClaimedRecords,setTotalClaimedRecords] = useState(undefined);
  const [orderIdsList, setOrderIdsList] = useState([]);
  const [claimedRecordsCount, setClaimedRecordsCount] = useState(0);  
  const [totalRecordsAnimation, setTotalRecordsAnimation] = useState(false);
  const [totalClaimedRecordsAnimation, setTotalClaimedRecordsAnimation] = useState(false);
  const [fetchClaimedOrdersLoading,isFetchClaimedOrderLoading] = useState(false);
  const [columnOptionsMap, setColumnOptionsMap] = useState({});
  const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const [closePopOver, setClosePopOver] = useState(false);
  const departmentValues =["Clinical Pathology","Profile Parameters","Serology","Microbiology"]
  const formValues=["blood","urine"]


  /* 
    if any model gets clicked we need to unique reference id for the row to highlight when model gets closed
   */
  const [selectedOrderId, setSelectedOrderId] = useState(undefined);
  const [isClaimed,setIsClaimed] = useState(false);
  const [rowClassFunction, rowClaimedClassFunction] = useRowClassFunction({uniqueId:"orderId", selectedOrderId});

  useEffect(() => {
    setSidebarCollapsedFlag(sidebarCollapsedFlag);
    closeAllModals();
    Object.entries(params).forEach(([key, value]) => {
      if (key == "activeClaimedTab"){
          delete params[key];
          setActiveTabId(1);
      }
      if(key == COLUMN_OPTIONS_URL_KEY_CONSTANT){
        setColumnOptionsMap(prepareModifiedColumnOptionsMap(props));
      }
    });
    const paramsSearchCriteria = getActualSearchCriteria(params);
    const currentSearchCriteria = getActualSearchCriteria(searchCriteria);
    if (Validate().isEqualObject(paramsSearchCriteria, currentSearchCriteria)) {
      return;
    }
    if (Validate().isNotEmpty(params)) {
      setSearchParamsExist(true);
      let limitTo = params.limitTo ? params.limitTo : defaultCriteria.limit;
      setSearchCriteria({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
      getInitialData({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
    }
  }, [props.location.search]);

  const handleClosePopOver = () => {
    setClosePopOver(true); 
  }

  useEffect(()=>{
    if(validate.isNotEmpty(gridRef ) && validate.isNotEmpty(gridRef .current)){
        gridRef .current?.element.addEventListener('scroll', handleClosePopOver);
    }
    
    return () => {
        if (validate.isNotEmpty(gridRef ?.current?.element)){
            gridRef ?.current?.element.removeEventListener('scroll', handleClosePopOver);
        }
    }
});





  /*
    this model is used to make selected order Id undefined after 2 seconds so row highlting stops after two seconds 
   */
  useEffect(() => {
    if(showOrderDeatilsModal || showOrderScheduleModal || showCollectPaymentsModal || showSampleCollectModal || showCancelModal || scanModal) {
        return;
    } else if(validate.isNotEmpty(selectedOrderId)) {
        setTimeout(()=>{
          setSelectedOrderId(undefined);
        },2000)
    }

  },[showOrderDeatilsModal,showOrderScheduleModal,showCollectPaymentsModal,showSampleCollectModal,showCancelModal,scanModal])

  useEffect(()=>{
    if(activeTabId==1 && (validate.isEmpty(claimedData) || (totalClaimedRecords > 0 && claimedData.length != totalClaimedRecords) )) {
        getClaimedRecords();
    }
    setOrderIdsList([]);
    setClaimedRecordsCount(0);
  },[activeTabId]);

  useEffect(()=>{
    gridRef?.current?.reCalculateColumnWidths()
  }, [dataSet, claimedData])

  const getActualSearchCriteria = (criteria) => {
    const { pageNumber, limitTo, limitFrom, [COLUMN_OPTIONS_URL_KEY_CONSTANT]: columnOptionsUrlKey, ...rest } = criteria;
    return rest;
  }

 

  const closeAllModals=()=>{
    setShowCollectPaymentsModal(false);
    setScanModal(false);
    setShowSampleCollectModal(false);
    setShowOrderScheduleModal(false);
    setShowOrderDeatilsModal(false);
  }

  const getInitialData = async (searchCriteria) => {
    const searchParams = new URLSearchParams(props.location.search);
    if(!searchParams.has("activeClaimedTab")){
      setActiveTabId(2);
    }
    setInitialLoading(true)
    let obj = { ...searchCriteria, "departmentIds": searchCriteria.departmentIds ? searchCriteria.departmentIds.split(",") : [], formIds: searchCriteria.formIds ? searchCriteria.formIds.split(",") : [] }
    const data = await getData(obj);
    setGridData(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataGrid) ? data.dataGrid : undefined);
    setDataSet(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet) ? [...data.dataSet] : []);
    if(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataGrid) && validate.isNotEmpty(data.dataGrid.totalRowsCount)){
      setTotalRecords(data.dataGrid.totalRowsCount);
      setTotalRecordsAnimation(true);
    }
    else{
      setTotalRecords(0);
    }
    setInitialLoading(false);
  }

  const getClaimedRecords = async () => {
    isFetchClaimedOrderLoading(true)
    await labOrderService.getLabOrderClaimedRecords().then(data => {
      if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data)) {
        setAllowedLabOrderClaimRight(data.dataObject.allowedOrdersClaimRight);
        setClaimedData(validate.isNotEmpty(data.dataObject.dataSet)?data.dataObject.dataSet:[]);
        if(validate.isNotEmpty(data.dataObject.dataSet)){
          setTotalClaimedRecords(data.dataObject.dataSet.length);
          setTotalClaimedRecordsAnimation(true);
        }
        else{
          setTotalClaimedRecords(0);
        }
        if(validate.isNotEmpty(data.dataObject.dataGrid))
          setGridData(data.dataObject.dataGrid);
      }
    }).catch((err) => {
      console.log(err)
    });
    isFetchClaimedOrderLoading(false);
  }

  const getData = async (obj) => {
    setErrorMessage("");
    let serverPayLoad = { ...obj };
    Object.keys(serverPayLoad).map((key) => {
      if(key !== 'departmentIds' && key !== 'formIds') {
        serverPayLoad[key] = serverPayLoad[key].toString(); 
      }
    })
    const data = await labOrderService.getLabOrderInfo(serverPayLoad).then(data => {
      if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
          setAllowedLabOrderClaimRight(data.dataObject.allowedOrdersClaimRight);
          return data.dataObject;
      } else {
        setErrorMessage(data.message)
      }
    }).catch((err) => {
      console.log(err)
      setInitialLoading(false);
    });
    return data;
  }

  const orderDeatilsModal = (orderId, status, customerId) => {
    let obj = {
      orderId: orderId,
      orderStatus: status,
      customerId: customerId
    }
    setSelectedOrderId(orderId);
    setOrderDeatilsModalObj(obj)
    setShowOrderDeatilsModal(true);
  }

  const viewCustomerPage = (customerId, mobile, localityId) => {
    const obj = {
      customerId: customerId,
      locality: localityId,
      mobile: mobile,
      customerType: "POS",
      isMergedFlag: false
    }
    redirectCustomerPage(obj, handleFailure);
  }

  const handleFailure = ({ message }) => {
    setStackedToastContent({ toastMessage: message, position: TOAST_POSITION.BOTTOM_START })
  }

  const getBulletedDescription = (description) => {
    return (
      <React.Fragment>
        {validate.isNotEmpty(description) &&
          <ol className="mb-0 ps-3">
            {description.map((eachDescription, index) => ((validate.isNotEmpty(eachDescription)) && <li key={index}>{eachDescription}</li>))}
          </ol>
        }
      </React.Fragment>
    );
  }

  const columnsLength = useMemo(() => {
    if(gridData?.columns) {
       const columns = flattenColumnsList(gridData?.columns);
       return columns.length;
    } else {
      return 0;
    }
  
  },[gridData])

  const popoverPosition=(idx)=>{
    if(idx==columnsLength-1 || idx==columnsLength-2){
      return "left"
    }
    else 
    return "right"
  }

  
  
  
  const rescheduleModal = (obj , row) => {
    
    setRescheduleModalObj(obj);
    setShowOrderScheduleModal(true);
    if(row) {
      setSelectedOrderId(row['orderId']);
    }
  }

  const collectPaymentsModal = (obj, flag , row) => {
    setCollectPaymentsModalObj(obj);
    setShowCollectPaymentsModal(true);
    setFlag(flag);
    if(row) {
      setSelectedOrderId(row['orderId']);
    }
  }
  const retryLabOrderPayment = async (obj) => {
    try {
      console.log(value);
      setDisableMode(true);
      const data = await labOrderService.retryLabOrderPayment(obj);
      if (data && data.statusCode === "SUCCESS") {
        onSubmitClick(obj.orderId);
        if (data.dataObject && data.dataObject.status == "ACCEPTED_SUCCESS") {
          setStackedToastContent({ toastMessage: "Payment Created successfully", position: TOAST_POSITION.BOTTOM_START });
        } else {
          setStackedToastContent({ toastMessage: "Payment Creation Failed", position: TOAST_POSITION.BOTTOM_START });
        }
      } else {
        onSubmitClick(obj.orderId);
        setStackedToastContent({ toastMessage: data.message, position: TOAST_POSITION.BOTTOM_START });
      }
      setDisableMode(false);
    } catch (error) {
      setStackedToastContent({ toastMessage: "Unable to check Lab Order Payment Status", position: TOAST_POSITION.BOTTOM_START });
      setDisableMode(false);
    }
  }

  const checkLabOrderPaymentStatus = async (obj) => {
    try {
      setDisableMode(true);
      const response = await labOrderService.checkLabOrderPaymentStatus(obj);
      if (response && response.dataObject && response.statusCode == "SUCCESS") {
        var gatewayStatus = response.dataObject;
        if(gatewayStatus == "SUCCESS"){
          setStackedToastContent({ toastMessage: "Payment Completed Successfully", position: TOAST_POSITION.BOTTOM_START })
        }
        else if(gatewayStatus == "FAILURE"){
          setStackedToastContent({ toastMessage: "Payment Failed", position: TOAST_POSITION.BOTTOM_START })
        }
        else{
        setStackedToastContent({ toastMessage: "Payment Pending", position: TOAST_POSITION.BOTTOM_START })
        }
        if (gatewayStatus != "PENDING") {
          onSubmitClick(obj.orderId);
        }
        else {
          setStackedToastContent({ toastMessage: response.dataObject, position: TOAST_POSITION.BOTTOM_START });
        }
      } else {
        setStackedToastContent({ toastMessage: response.dataObject, position: TOAST_POSITION.BOTTOM_START });
      }
      setDisableMode(false)
    } catch (error) {
      setStackedToastContent({ toastMessage: "Unable to check Lab Order Payment Status", position: TOAST_POSITION.BOTTOM_START });
      setDisableMode(false)
    }
  }

  const handleVisitProof = (value) => {
    window.open(value?.visitProofURL);
  }

  const handleCancelIcon = (value, rowValues) => {

    const orderInfo = {
      title: "Do you want to cancel this order",
      orderId: `${rowValues.displayOrderId}/${rowValues.orderId}`,
      scheduledSlot: rowValues.slotDate+", "+rowValues.slotTime,
      placeholder: "Please specify reason for cancellation",
      buttonText: "Yes, Cancel this order"
    }
    setCancelButtonInfo(orderInfo);
    setShowCancelModal(true);
    setCancelButtonValue(value);
  }

  const handleActions = (key, value, rowValues) => {
    switch (key) {
      case "Assign Agent":
        return <div onClick={() => !disableMode && rescheduleModal(value,rowValues)}>{<AssignIcn tooltip="Assign Agent"/>}</div>
      case "Reassign Agent":
        return <div onClick={() => !disableMode && rescheduleModal(value,rowValues)}>{<ReAssign tooltip="ReAssign Agent"/>}</div>
      case "Reschedule Agent":
        return <div onClick={() => !disableMode && rescheduleModal(value,rowValues)}>{<ReScheduleIcon />}</div>
      case "Mark As Sample Collected":
        return <div onClick={() => { if(!disableMode){setRescheduleModalObj(value);setShowSampleCollectModal(true);setSelectedOrderId(rowValues['orderId']) }}}>{<SampleCollectedIcon  tooltip="Mark As Sample Collected"/>}</div>
      case "folderIcon":
        return <div onClick={() => { if(!disableMode){setScanModal(true); setScanModalObj(value);setSelectedOrderId(rowValues['orderId']); }}}><PrescriptionUpload tooltip="Patient Clinical History"/></div>
      case "Visit Proof":
        return <div onClick={() => !disableMode && handleVisitProof(value)}>{<VisitProof />}</div>
      case "Edit Barcodes":
        return <div onClick={() => { if(!disableMode){setRescheduleModalObj(value); setShowSampleCollectModal(true); setSelectedOrderId(rowValues['orderId']); }}}>{<EditBarcode />}</div>
      case "Collect Payment":
        return <div onClick={() => !disableMode && collectPaymentsModal(value, "collect",rowValues)}>{<Payment text="Collect Payment"/>}</div>
      case "Acknowledge Patient":
        return <div onClick={() => !disableMode && collectPaymentsModal(value, "acknowledge" , rowValues)}>{<AcknowledgedIcn />}</div>
      case "Call":
        return <div onClick={() => !disableMode && makeOutBoundCall(value.callUrl)}>{<CallIcon  tooltip="Call To Customer"/>}</div>
      case "Lab Order Payment Receipt":
        return <div onClick={() => !disableMode && downloadReceipt(value)}><PaymentReceipt tooltip="View Payment Receipt" /></div>
      case "Cancel":
        return <div onClick={() => !disableMode && handleCancelIcon(value, rowValues)}>{<CancelIcon />}</div>
    }
  }

  const setPropsToConfirmationModal=(value)=>{
    setConfirmationModal(true);
    setValueForModal(value);
    setConfirmationModalProps({message:`The payment will be proccessed in Paytm EDC device of\nCollection Center:${value.collectionCenterStoreId} Do you want to continue ?`,onSubmit:retryLabOrderPayment,headerText:"Payment",buttonText:"Yes"})
  }

  const handlepaymentStatus = (key, value) => {
    switch (key) {
      case "Retry Payment":
        return <div onClick={() => {!disableMode && setPropsToConfirmationModal(value)}}><RetryPayment /></div>
      case "Check Payment Status":
        return <div onClick={() => !disableMode && checkLabOrderPaymentStatus(value)}><PaymentStatus tooltip="Check Payment Status" /></div>
      case "Payment Awaited":
        //let statusCellClass = OrderHelper().getBadgeColorClassForStatus("Pending") + " badge rounded-pill";
        // return <div className={statusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized("Payment Awaited")}</div>
        <div><PaymentAwaited/></div>
      default: 
        break;
    }
  }

  const downloadReceipt = async (value) => {
    const downloadPdfUrl = `${API_URL}${LAB_ORDER_CONFIG.GET_LAB_ORDER_RECEIPT.url}?labOrderId=${value.orderId}`;
    const response = downloadFile(downloadPdfUrl)
    if (response && response.status && response.status === "failure") {
      setStackedToastContent(response.message);
    }
  }

const handleOrderDetailsModal = (value) => {
  setSidebarCollapsedFlag(value);
  setShowOrderDeatilsModal(value);
  setIsClaimed(false);
}

const handleClaimFailure = (message, recordId) => {
  if(message.indexOf("already claimed by") != -1){
      let processedDataset = processOrderClaimedAlready(recordId, dataSet, "orderId");
      setDataSet(processedDataset);
  }
  setStackedToastContent({ toastMessage: message });
}

  const processClaimAction = (recordId, orderIdsList) => {
    if(validate.isEmpty(orderIdsList)){
      orderIdsList.push(recordId);
    }
    else if(validate.isNotEmpty(orderIdsList) && orderIdsList.indexOf(recordId) == -1){
      orderIdsList.length = 0;
      orderIdsList.push(recordId);
    }
    let claimObject = {};
    let row = dataSet?.find(row => row['orderId'] == recordId);
    if(!row)
        row = claimedData?.find(row => row['orderId'] == recordId);
    if (validate.isEmpty(row.claimedBy) || row.claimedBy=="O") {
      claimObject = claimOrders(orderIdsList, dataSet, claimedData, 'orderId');
      setTotalClaimedRecords(totalClaimedRecords+orderIdsList.length);
      setTotalClaimedRecordsAnimation(true);
      setIsClaimed(true);
    } else {
      claimObject = unclaimOrders(orderIdsList, dataSet, claimedData, "orderId");
      setTotalClaimedRecords(totalClaimedRecords-orderIdsList.length);
      setTotalClaimedRecordsAnimation(true);
    }
    
    setClaimedData([...claimObject['claimedDataSet']]);
    setDataSet([...claimObject.dataset]);
    setStackedToastContent({ toastMessage: (orderIdsList.length == 1 ? ("Order ID(s) " + orderIdsList + " ") : ("Order ID(s) ")) + claimObject.toastMessage });
    setOrderIdsList([]);
    setClaimedRecordsCount(0);
    setSelectedOrderId(recordId);
    if(!showOrderDeatilsModal){
    setTimeout(()=>{
      setSelectedOrderId(undefined);
    },2000)
    }
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
                let index_of_row  = searchElement(row.orderId,orderIds,'orderId')
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
                let index_of_row  = searchElement(row.orderId,orderIds,'orderId')
                if(index_of_row !== -1){
                    orderIds.splice(index_of_row,1);
                }
                setOrderIdsList(orderIds);
            }
        }
    }
    return <React.Fragment>
          { ( !allowedLabOrderClaimRight || row.status == "Cancelled" || (validate.isNotEmpty(row.claimedBy) && activeTabId == 2 )) ? <></>
          : <input type={'checkbox'}  checked={searchElement(row.orderId , orderIdsList,'orderId') != -1} onChange={(event) => {handleOnCheckBoxChange(event)}} />
          } 
   </React.Fragment>
  }

  function handleCheckBoxHeaderFunction(props) {

    const handleOnCheckAndUncheck = (event) => {
        if(event.target.checked == true){
            let claimedOrderIds = claimedData.map(order => order);
            setOrderIdsList(claimedOrderIds);
        }
        else{
            setOrderIdsList([]);
        }

    }
    return <React.Fragment>
        { (activeTabId == 1 && allowedLabOrderClaimRight) ?  
           <input type={'checkbox'} checked = {orderIdsList.length == claimedData.length} onChange={(event) => {handleOnCheckAndUncheck(event)}} /> 
           : <></>
        }
    </React.Fragment>
}

  const callBackMapping = {
    
    "displayOrderId": (props) => {
      async function copyToClip(text) {
          await navigator.clipboard.writeText(text);
          setCopySuccess(text);      
      }
      const { row } = props;
      return <React.Fragment>
      <div className='copy' >      
      <span className="copy-icon  position-absolute"  style={{cursor:"pointer"}}>       
        <span className={ copySuccess == row.displayOrderId ? "" : "d-none"}>
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
        <span className={ copySuccess == row.displayOrderId ? "d-none" : ""} onClick={()=>copyToClip(row.displayOrderId)}>
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
        <a className="btn btn-sm btn-link w-100" id={row.displayOrderId} href="javascript:void(0)" rel="noopener" aria-label={row.displayOrderId} role="link" title="View order details" onClick={() => {setSidebarCollapsedFlag(true); !disableMode && orderDeatilsModal(row.orderId, row.labOrderStatus, row.customerId);}}>{row.displayOrderId}</a>
      </div>
        </React.Fragment>
      
    },
    "customerId": (props) => {      
      const { row } = props;
      return <React.Fragment>
        <a className="btn btn-sm btn-link w-100 text-start" id={row.customerId} href="javascript:void(0)" rel="noopener" aria-label={row.customerId} role="link" title="View Customer details" onClick={() => !disableMode && viewCustomerPage(row.customerId, row.mobile, row.locality)}>{row.customerId}</a>
        </React.Fragment>
    },
    "actions": (props) => {
      const { row } = props;
      return <React.Fragment>
        {( !allowedLabOrderClaimRight || (((validate.isNotEmpty(row.claimedBy) && row.claimedBy == "S") && activeTabId == 1) || props.row.status == 'Cancelled')) && Object.keys(row.action).map(key => {
          if (key == "Payment Awaited") {
            return key
          } else {
            return <div>{handleActions(key, row.action[key], row)}</div>
          }
        })}
        {allowedLabOrderClaimRight && validate.isNotEmpty(props.row.claimedBy) && (props.row.claimedBy == "O" || (props.row.claimedBy == "S" && activeTabId != 1))
          ? <React.Fragment>
            <Claimed id={"record_"+props.row.orderId}/>
          </React.Fragment>
          : <React.Fragment />
        } 
        {(allowedLabOrderClaimRight && ((validate.isEmpty(props.row.claimedBy) && props.row.status != "Cancelled") || (props.row.claimedBy == "S" && activeTabId!=2) || (activeTabId == 1 && props.row.status == "Cancelled"))) && <HandleClaims recordId={props.row.orderId} onSuccess={(recordId) => processClaimAction(recordId, orderIdsList)} onFailure={(message, recordId)=>handleClaimFailure(message, recordId)} recordType={RECORD_TYPE.LAB_ORDER} claimedBy={props.row.claimedBy} />}
      </React.Fragment>
    },
    "paymentStatusAction": (props) => {
      const { row } = props;
      return <React.Fragment>
        {/* {validate.isNotEmpty(row.gateWayStatus) && row.gateWayStatus !="NA" && row.gateWayStatus != "INITIATED" && row.gateWayStatus!="FAILURE" &&
          <div className={statusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(row.gateWayStatus)}</div>
        } */}
        {validate.isNotEmpty(row.paymentStatusAction) && Object.keys(row.paymentStatusAction).map(key => {
          return handlepaymentStatus(key, row.paymentStatusAction[key])
        }) 
        }
        {validate.isEmpty(row.paymentStatusAction)&& <div className='text-center'>-</div>}
      </React.Fragment>
    },
    "status": (props) => {
      const { row } = props;
      return <React.Fragment>
        {validate.isNotEmpty(row.status) ?
          <span className={`${getLabStausBadgeColourClass(row.status)} badge rounded-pill`}>{row.status}</span>

          : <div className='text-center'>-</div>
        }
      </React.Fragment>
    },
    "orderAmount": (props) => {
      const { row } = props;
      return <React.Fragment>
        <div><CurrencyFormatter data={row?.orderAmount} decimalPlaces={-1} /></div>
      </React.Fragment>
    },
    "payableAmount": (props) => {
      const { row } = props;
      return <React.Fragment>
        <div><CurrencyFormatter data={row?.payableAmount} decimalPlaces={-1} /></div>
      </React.Fragment>
    },
    "paymentStatus": (props) =>{
      const { row } = props;
      let statusCellClass = OrderHelper().getBadgeColorClassForStatus(row.gateWayStatus) + " badge rounded-pill";
      return <React.Fragment>
        {validate.isNotEmpty(row.gateWayStatus) && row.gateWayStatus !="NA" &&
          <div className={statusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(row.gateWayStatus)}</div>
        }
        {(validate.isEmpty(validate.isEmpty(row.gateWayStatus)) || row.gateWayStatus=="NA") ? <div className='text-center'>-</div> : null}
      </React.Fragment>
    },

    "department":(props)=>{
      return validate.isNotEmpty(props.row.department) ? <React.Fragment>
        {props.row.department.length > 1 ? (<><p id={props.column.key + props.row.cartId} className="text-truncate pointer">{props.row.department[0]}<span className='text-primary'> ...</span></p>
        <CustomPopOver target={props.column.key+props.row.cartId} value={getBulletedDescription(props.row.department)} closePopOver={closePopOver} setClosePopOver={setClosePopOver} headerText={"Department"} placement={popoverPosition(props.column.idx)} /></>) : (<p id={props.column.key + props.row.cartId} className="text-truncate pointer">{props.row.department.join(", ")}</p>) }
            </React.Fragment> : <>-</>

    },
    "form":(props)=>{
      return validate.isNotEmpty(props.row.form) ? <React.Fragment>
        {props.row.form.length>1 ? (<><p id={props.column.key+props.row.cartId} className="text-truncate pointer">{props.row.form[0]}<span className='text-primary'> ...</span></p>
        <CustomPopOver target={props.column.key+props.row.cartId} value={getBulletedDescription(props.row.form)} closePopOver={closePopOver} setClosePopOver={setClosePopOver} headerText={"Form"} placement={popoverPosition(props.column.idx)} /></>
        ):(<p id={props.column.key+props.row.cartId} className="text-truncate pointer">{props.row.form.join(", ")}</p>) } 
            </React.Fragment> : <>-</>

    },
    
    'rowClass': isClaimed ? rowClaimedClassFunction : rowClassFunction,
    'checkBox' : handleCheckBoxColumn,
    'checkBoxHeader' : handleCheckBoxHeaderFunction 
  }

  const appendParamsToUrl = (pageNumber, limitTo) => {
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    props.history.replace(`${CRM_UI}/labOrder/searchResults?${qs.stringify({ ...params, pageNumber: pageNumber, limitTo: limitTo })}`);
  }

  const remoteDataFunction = async ({ startIndex, limit, sortColumns, filters, pageNumber, changeType }) => {
    let temObj = { ...searchCriteria, limitFrom: startIndex, limitTo: limit };
    if (validate.isNotEmpty(filters) && filters['mobile'] && filters['mobile'].value && filters['mobile'].value.length !== 10) {
      return { status: false };
    }
    let filterData = filters.mobile.value
    if(validate.isNotEmpty(filterData)){
      temObj = { ...temObj, 'mobileNo': filterData };
    }
    if (validate.isNotEmpty(sortColumns)) {
      temObj = { ...temObj, 'sortColumnIndex': sortColumns[0].columnKey, 'sortDirection': sortColumns[0].direction }
    }
    const data = await getData(temObj);
    appendParamsToUrl(pageNumber, limit);
    if (userSessionInfo?.vertical && userSessionInfo.vertical == "V") {
      if (validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet)) {
        if (changeType == ChangeType.PAGINATION_INFO && startIndex > 0) {
          setDataSet([...dataSet, ...data.dataSet]);
        } else {
          setDataSet(data.dataSet);
        }
      }else if(changeType == ChangeType.FILTER_INFO){
        setDataSet([])
      }
    } else {
      setDataSet(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet) ? data.dataSet : []);
    }
    return { dataSet: data?.dataSet ? data.dataSet : [], totalRowsCount: data?.dataGrid?.totalRowsCount ? data.dataGrid.totalRowsCount : 0, status: true }
    /* if (validate.isNotEmpty(data)) {
      if (userSessionInfo?.vertical && userSessionInfo.vertical == "V") {
        setDataSet([...dataSet, ...data.dataSet]);
        return { dataSet: [...data.dataSet], totalRowsCount: data.dataGrid.totalRowsCount, status: true }
      } else {
        setDataSet(data.dataSet);
        return { dataSet: data.dataSet, totalRowsCount: data.dataGrid.totalRowsCount, status: true }
      }
    } else {
      return { dataSet: [], totalRowsCount: 0, status: true }
    } */
  }
  const setPropsToDeleteModal=(cancelReason)=>{
    setCancelReason(cancelReason);
    setConfirmationModal(true);
    setConfirmationModalProps({message:`Do you really want to cancel this order ${cancelButtonValue.orderId}?`,onSubmit:cancelOrder,headerText:"Cancel Order"});
  }
  const updateRecord = async (orderId) => {
    const dataForOrderId = await getData({  orderId: orderId, pageNumber: '', limitTo: '30', limitFrom: '0' }).then(response => {
      if (validate.isEmpty(response)) {
        return null;
      }
      return response.dataSet[0];
    })
    if (validate.isEmpty(dataForOrderId)) {
      let temporaryDataSet = [...dataSet];
      temporaryDataSet.splice(temporaryDataSet.findIndex(obj => obj.orderId == orderId), 1);
      setDataSet([...temporaryDataSet]);
    } else {
      setDataSet(dataSet.map(eachRecord => {
        if (eachRecord.orderId == orderId) {
          return dataForOrderId;
        }
        return eachRecord;
      }));
      let claimedDataSet = []
      if (validate.isNotEmpty(dataForOrderId.claimedBy) && dataForOrderId.claimedBy == 'S') {
        let claimedInfo = claimedData.find(eachRecord => eachRecord.orderId == orderId);
        const claimedDataObj = [...claimedData];
        if (Validate().isEmpty(claimedInfo)) {
          claimedDataObj.push(dataForOrderId);
        }
        claimedDataSet = claimedDataObj.map(eachRecord => {
          if (eachRecord.orderId == orderId) {
            return dataForOrderId;
          }
          return eachRecord;
        })
      } else {
        claimedDataSet =  claimedData.filter(eachRecord => {
          return eachRecord.orderId != orderId
        });
      }
      setClaimedData(claimedDataSet);
      setTotalClaimedRecords(claimedDataSet.length);
    }
  }

  const onSubmitClick=(orderId)=>{
    setTimeout(()=>{
      updateRecord(orderId);
    },1000)
  }

  const cancelOrder = async (obj,reason) => {
    setDisableMode(true);
    await LabOrderService().cancelLabOrder({'orderId': cancelButtonValue.orderId,'reason': reason}).then(response => {
      if ("SUCCESS" === response.statusCode) {
        onSubmitClick(cancelButtonValue.orderId);
        setStackedToastContent({toastMessage:`${cancelButtonValue.orderId} cancelled Successfully!`});
      } else if (Validate().isNotEmpty(response.message)) {
        setStackedToastContent({toastMessage:response.message});
      } else {
        setStackedToastContent({toastMessage:"Unable to cancel order, Please try again"});
      }
      setDisableMode(false)
    }, (err) => {
      console.log(err);
      setStackedToastContent({toastMessage:"Unable to process request, Please try again!"});
      setDisableMode(false)
    })
  }


  const claimedMetaInfo = useMemo(() => {
    return gridData ? { ...gridData,columns: [...gridData.columns].map((column, index) => {
      let columnObject = {...column}
      if(column.showFilter) {
          columnObject['showFilter'] = false;
      }
      return columnObject;
  }), paginationInfo: { isPaginationRequired: false } } : undefined

  }, [gridData]);

  const gridMetaInfo = useMemo(() => {
    return gridData ? {
      ...gridData,
      totalRowsCount: totalRecords,
      paginationInfo: {
        ...gridData.paginationInfo,
        initialPageNumber: params.pageNumber ? Number(params.pageNumber) : gridData?.paginationInfo?.initialPageNumber,
        limit: params.limitTo ? params.limitTo : defaultCriteria.limit
      }
    } : undefined

  }, [gridData, totalRecords, params])

  const displayMetaInfo = useMemo(() => {
    return activeTabId == 1 ? { ...claimedMetaInfo } : { ...gridMetaInfo }

  }, [claimedMetaInfo, gridMetaInfo, activeTabId])

  const onColumnOptionChange = (rowDataKey, columnOptionsMap) => {
    modifyUrlColumnOptions(props, rowDataKey, columnOptionsMap);
  }

  const actionSuccess = (recordid,listofOrderIds)=>{
    processClaimAction(listofOrderIds[0], listofOrderIds)
}

 const claimedSet =(claim)=>{
    let listofOrderIds = orderIdsList.map(function (el) { return el.orderId; });
    handleClaimRequest({'recordId':listofOrderIds[0], 'claimedBy':(claim == ClaimConstants.CLAIM) ?' ' : 'S', recordType:RECORD_TYPE.LAB_ORDER , 'onSuccess':(recordid)=>{actionSuccess(recordid,listofOrderIds)},'onFailure':(message,recordid)=>{handleClaimFailure(message,recordid)}},listofOrderIds)
}


  return <Wrapper>
    {/* <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
      <p className="mb-0">Order Search Results</p>
      {Validate().isNotEmpty(dataSet) && (claimed ?
                <button className="ms-4 btn btn-rounded-pill bg-success text-white" onClick={() => claimedOnClick()}> Claimed Orders</button> : <button className="ms-4 btn btn-rounded-pill bg-info text-white" onClick={() => setClaimed(true)}> All Orders</button>)
                }
    </HeaderComponent> */}
    <ClaimTabs {...props} allowedOrderClaimRight={allowedLabOrderClaimRight} selectedRecordsLength ={orderIdsList.length}  claimedSet={claimedSet} loading={initialLoading || fetchClaimedOrdersLoading} recordType={RECORD_TYPE.LAB_ORDER} headerRef={headerRef} footerRef={footerRef} tabOneHeaderContent={"My Claimed List"} tabTwoHeaderContent={props?.routePath == "labCollectionCenterDashboard" ?  "Collection Center Lab Order Details" : "Lab Order Search Results"} claimedCount={totalClaimedRecords} totalRecords={totalRecords} activeTabId={activeTabId} setActiveTabId={setActiveTabId}  setTotalClaimedRecords={setTotalClaimedRecords} totalRecordsAnimation={totalRecordsAnimation} setTotalRecordsAnimation={setTotalRecordsAnimation} totalClaimedRecordsAnimation={totalClaimedRecordsAnimation} setTotalClaimedRecordsAnimation={setTotalClaimedRecordsAnimation}>
          {(!initialLoading && !fetchClaimedOrdersLoading )? (!(activeTabId==2 && totalRecords == 0) && !(activeTabId==1 && Validate().isEmpty(claimedData))? <div className={`card h-100`}>
            <CommonDataGrid {...displayMetaInfo} dataSet={activeTabId==1 ? [...claimedData] : [...dataSet]}
              ref={gridRef}
              remoteDataFunction={remoteDataFunction}
              selectedRows={selectedRows}
              onRowSelectionCallback={setSelectedRows}
              callBackMap={callBackMapping}
              onColumnOptionChange={onColumnOptionChange}
              columnOptionsMap={columnOptionsMap}
              customGridToolbar={{component: ClaimUnclaimHandler, componentProps: {activeTabId, selectedRecordsLength: orderIdsList.length, claimedSet}}}
            /> </div> : activeTabId == 1 ? (<NoDataFound text={"No Claimed orders found for you!"} />) :
            searchParamsExist && <NoDataFound text={props?.routePath == "labCollectionCenterDashboard" ? "Collection Center Lab Order Details are not found based on given criteria. Search with other details!" : "No Lab orders found based on the given criteria. Try with other details!"} searchButton={true} />):null
          }
      {!searchParamsExist && activeTabId==2 && <SeachNow {...props} />}
      {showCancelModal && <CancelOrder orderInfo={cancelButtonInfo} cancelButtonValue={cancelButtonValue} setShowCancelModal={setShowCancelModal} showCancelModal={showCancelModal} setPropsToDeleteModal={(obj)=>setPropsToDeleteModal(obj)} setDisableMode = {setDisableMode} disableMode = {disableMode} orderId = {cancelButtonValue.orderId} onSubmitClick = {onSubmitClick} from="LAB_ORDER_PAGE"/>}
      {showOrderDeatilsModal && <LabOrderDetailModal allowedLabOrderClaimRight={allowedLabOrderClaimRight} processClaimAction={processClaimAction}  orderId={orderDeatilsModalObj.orderId} showOrderDeatilsModal={showOrderDeatilsModal} customerId={orderDeatilsModalObj.customerId} onSubmitClick={onSubmitClick} setDisableMode = {setDisableMode} disableMode = {disableMode} setSelectedOrderId={setSelectedOrderId} handleOrderDetailsModal={handleOrderDetailsModal}/>}
      {showOrderScheduleModal && <LabOrderRescheduleModal value={rescheduleModalObj} showOrderScheduleModal={showOrderScheduleModal} setShowOrderScheduleModal={setShowOrderScheduleModal} setDisableMode = {setDisableMode} disableMode = {disableMode} onSubmitClick={onSubmitClick}/>}
      {showCollectPaymentsModal && <CollectPaymentsModal value={collectPaymentsModalObj} showCollectPaymentsModal={showCollectPaymentsModal} setShowCollectPaymentsModal={setShowCollectPaymentsModal} flag={flag} onSubmitClick={(orderId)=>onSubmitClick(orderId)} setDisableMode = {setDisableMode} disableMode = {disableMode}/>}
      {showSampleCollectModal && <LabOrderSampleCollect value={rescheduleModalObj} showSampleCollectModal={showSampleCollectModal} setShowSampleCollectModal={setShowSampleCollectModal} setDisableMode = {setDisableMode} disableMode = {disableMode} onSubmitClick={onSubmitClick}/>}
      {scanModal && <HealthRecordModal scanModalObj={scanModalObj} scanModal={scanModal} setScanModal={setScanModal} setDisableMode = {setDisableMode} disableMode = {disableMode}/>}
      {showConfirmationModal && <CommonConfirmationModal headerText={confirmationModalProps.headerText} isConfirmationPopOver={showConfirmationModal} setConfirmationPopOver={setConfirmationModal} message={confirmationModalProps.message} buttonText={"Submit"} onSubmit={()=>confirmationModalProps.onSubmit(value,cancelReason)} setDisableMode = {setDisableMode} disableMode = {disableMode}/>}
    </ClaimTabs>
  </Wrapper>
}
