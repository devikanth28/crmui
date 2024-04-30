import CommonDataGrid, { CompleteCall,Badges, Claimed, ClaimConstants} from "@medplus/react-common-components/DataGrid";
import React, { useEffect, useRef, useState, useContext, useCallback, useMemo, useDebugValue } from "react";
import { ImageLightBox, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import Validate from "../../helpers/Validate";
import UserService from "../../services/Common/UserService";
import { updateStatus } from "../../helpers/CommonRedirectionPages";
import PrescriptionService from "../../services/Prescription/PrescriptionService";
import {  Wrapper } from "../Common/CommonStructure";
import qs from 'qs';
import { AlertContext } from '../Contexts/UserContext';
import NoDataFound from "../Common/NoDataFound";
import LabOrderDetailModal from '../labOrders/labOrderModal/LabOrderDetailModal';
import CustomerIdLink from "../../helpers/CustomerIdLink";
import { CRM_UI } from "../../services/ServiceConstants";
import SeachNow from "../Common/SearchNow";
import PrepareOrderDetails from "../order/PrepareOrderDetails";
import useRowClassFunction from "../../hooks/useRowClassFunction";
import HandleClaims from "../Common/HandleClaims";
import '../../scss/OrderSearchResult.scss'
import { RECORD_TYPE, claimOrders, unclaimOrders, processOrderClaimedAlready } from "../../helpers/HelperMethods";
import ClaimTabs from "../Common/ClaimTabs";
import { searchElement } from "../order/OrderSearchResult";
import { handleClaimRequest } from "../Common/HandleClaims";
import ClaimUnclaimHandler from "../Common/ClaimUnclaimHandler";

const FollowupSearchResult = (props) => {
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const [loading, isLoading] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({});
    const [gridData, setGridData] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(undefined);
    const [selectedCommunicationId , setSelectedCommunicationId] = useState(undefined);
    const [selectedCustomerId, setSelectedCustomerId] = useState(undefined);
    const [martOrderDetailModal, setMartOrderDetailModal] = useState(false);
    const [labOrderDeatilsModal, setLabOrderDeatailsModal] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState("")
    const [showPrescriptionOrderdetail, setShowPrescriptionOrderdetail] = useState(false)
    const [imagesForLightBox, setImagesForLightBox] = useState([]);
    const [searchParamsExist, setSearchParamsExist] = useState(false);
    const [rowClassFunction, rowClaimedClassFunction] = useRowClassFunction({uniqueId : "communicationID" , selectedOrderId : selectedCommunicationId })
    const { setStackedToastContent } = useContext(AlertContext);
    const [disableMode, setDisableMode] = useState(false);
    const [totalRecords,setTotalRecords] = useState(0);
    const [totalRecordsAnimation, setTotalRecordsAnimation] = useState(false);
    const [claimedCount,setClaimedCount] = useState(undefined);
    const [claimedData, setClaimedData] = useState([]);
    const [activeTabId,setActiveTabId] = useState(params.activeTabId?Number(params.activeTabId):2);
    const [claimedRecordsCount, setClaimedRecordsCount] = useState(0);
    const [orderIdsList, setOrderIdsList] = useState([]);
    const [totalClaimedRecords,setTotalClaimedRecords] = useState(undefined);
    const [totalClaimedRecordsAnimation, setTotalClaimedRecordsAnimation] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const validate = Validate()
    const defaultCriteria = {
        type: "F",
        limitTo: 30
    }

    useEffect(() => {
        Object.entries(params).forEach(([key, value]) => {
            if (key == "activeClaimedTab"){
                delete params[key];
                setActiveTabId(1);
            }
        });
        const paramsSearchCriteria = getActualSearchCriteria(params);
        const currentSearchCriteria = getActualSearchCriteria(searchCriteria);
        if (validate.isEqualObject(paramsSearchCriteria, currentSearchCriteria)) {
            return;
        }
        closeAllModals();
        if (validate.isNotEmpty(params)) {
            setSearchParamsExist(true);
            let limitTo = params.limitTo ? params.limitTo : defaultCriteria.limitTo;
            setSearchCriteria({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
            getInitialData({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
        }
    }, [props.location.search]);

    useEffect(()=>{
        if (activeTabId == 1 && claimedCount!=0) {
            setClaimedDataSet();
            setMetaInfo();
        }
        setOrderIdsList([]);
        setClaimedRecordsCount(0);
    },[activeTabId])

    const closeAllModals=()=>{
        setMartOrderDetailModal(false);
        setLabOrderDeatailsModal(false);
    }
    const setClaimedDataSet = async () =>{
        isLoading(true);
        if (validate.isEmpty(claimedData) && claimedCount!=0) {
            const claimedData = await getInitialClaimedData();
            setClaimedData(validate.isEmpty(claimedData) ? [] : claimedData);
            setClaimedCount(validate.isEmpty(claimedData) ? 0 : claimedData.length);
        }
        isLoading(false);
    }

    useEffect(() => {
        if(martOrderDetailModal || labOrderDeatilsModal || showPrescriptionOrderdetail) {
            return;
        } else if (validate.isNotEmpty(selectedCommunicationId)) {
            setTimeout(()=> {
                setSelectedCommunicationId(undefined);
            },2000);
        }
    },[martOrderDetailModal,labOrderDeatilsModal,showPrescriptionOrderdetail])

    const getActualSearchCriteria = (criteria) => {
        const { pageNumber, limitTo, limitFrom, ...rest } = criteria;
        return rest;
    }

    const getInitialData = async (searchCriteria) => {
        const searchParams = new URLSearchParams(props.location.search);
        if(!searchParams.has("activeClaimedTab")){
            setActiveTabId(2);
        }
        isLoading(true);
        const data = await getFollowUpDetails(searchCriteria);
        setDataSet(validate.isNotEmpty(data.dataSet) ? [...data.dataSet] : []);
        if(validate.isEmpty(gridData)){
            setMetaInfo();
        }
        setClaimedDataSet();
        setTotalRecords(validate.isEmpty(data.totalRecords)?0:data.totalRecords);
        setTotalRecordsAnimation(true);
        isLoading(false);
    }

    const getFollowUpMetaInfo = async ()=>{
        return await UserService().getFollowUpMetaInfo({"pageNumber":params.pageNumber?params.pageNumber:undefined,"limitTo":params.limit?params.limit:defaultCriteria.limitTo}).then(response=>{
            if(response.statusCode=="SUCCESS" && response.message=="SUCCESS"){
                return response.dataObject;
            }else{
                return undefined;
            }
        }
        ).catch(error=>{
            console.log(error);
            return undefined;
        })

    }

    const getFollowUpDetails = async (obj) => {
        const {v,...rest} = obj;
        return await UserService().getCommunicationLogDetails(rest).then((data) => {
            if (data && validate.isNotEmpty(data.dataObject) && data.statusCode === "SUCCESS") {
                return data.dataObject;
            } else if (data && data.statusCode === "FAILURE") {
                isLoading(false)
                setErrorMessage(data.message)
                return [];
            } else {
                isLoading(false)
                return [];
            }
        }).catch((err) => {
            setStackedToastContent({ toastMessage: "Unable to get follow up details , please try again", position: TOAST_POSITION.BOTTOM_START });
            isLoading(false)
            return [];
        });
    }
    const handleFailure = ({ message }) => {
        setStackedToastContent({ toastMessage: message, position: TOAST_POSITION.BOTTOM_START })
    }

    const handleClickofCall = (props) => {
        updateStatus({ customerId: props.row.customerId, orderId: props.row.orderId, communicationId: props.row.communicationID  , nextContactTime: props.row.nextContactTime, message: props.row.message , completeReason: props.row.reason}, handleFailure)
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
            claimObject = claimOrders(orderIdsList, dataSet, claimedData, 'communicationID');
            setTotalClaimedRecords(totalClaimedRecords+orderIdsList.length);
            setTotalClaimedRecordsAnimation(true);
            setIsClaimed(true);
        } else {
            claimObject = unclaimOrders(orderIdsList, dataSet, claimedData, 'communicationID');
            setTotalClaimedRecords(totalClaimedRecords-orderIdsList.length);
            setTotalClaimedRecordsAnimation(true);
        }
        setClaimedData(claimObject?.claimedDataSet);
        setClaimedCount(claimObject?.claimedDataSet?.length);   
        setDataSet(claimObject?.dataset);
        setStackedToastContent({ toastMessage: (orderIdsList.length == 1 ? ("Communication ID(s) " + orderIdsList + " ") : ("Communication ID(s) ")) + claimObject?.toastMessage });
        setOrderIdsList([]);
        setClaimedRecordsCount(0);
        setSelectedCommunicationId(recordId);
        setTimeout(()=>{
            setSelectedCommunicationId(undefined);
        },2000)
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
                    let index_of_row  = searchElement(row.communicationID,orderIds,"communicationID")
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
                    let index_of_row  = searchElement(row.communicationID,orderIds,"communicationID")
                    if(index_of_row !== -1){
                        orderIds.splice(index_of_row,1);
                    }
                    setOrderIdsList(orderIds);
                }
            }
        }
        return <React.Fragment>
              { ( row.status == "Cancelled" || (validate.isNotEmpty(row.claimedBy) && activeTabId == 2 )) ? <></>
              : <input type={'checkbox'}  checked={searchElement(row.communicationID,orderIds,"communicationID") !== -1} onChange={(event) => {handleOnCheckBoxChange(event)}} />
              } 
       </React.Fragment>
      }

    const handleClaimFailure = (message, recordId) => {
        if(message.indexOf("already claimed by") != -1){
            let processedDataset = processOrderClaimedAlready(recordId, dataSet, "communicationID");
            setDataSet(processedDataset);
        }
        setStackedToastContent({ toastMessage: message });
    }

    function renderActionColumn(props) {
        return <React.Fragment>
            {(activeTabId==2 && props.row.claimedBy=='S') ? <Claimed />:<React.Fragment>{validate.isNotEmpty(props.row.claimedBy) && props.row.claimedBy == "S" ?<React.Fragment>
            {"N" === props.row.status ? <React.Fragment>
                        <CompleteCall handleOnClick={() => handleClickofCall(props)}/>
                </React.Fragment> : <React.Fragment>-</React.Fragment>
            }</React.Fragment>:null}
            {validate.isNotEmpty(props.row.claimedBy) && props.row.claimedBy == "O"
                    ? <React.Fragment>
                        <Claimed id={"record_"+props.row.communicationID}/>
                    </React.Fragment>
                    : <React.Fragment/>
            }
            <HandleClaims recordId={props.row.communicationID} recordType={RECORD_TYPE.FOLLOWUP_ORDER} claimedBy={props.row.claimedBy} onSuccess={(recordId) => processClaimAction(recordId, orderIdsList, props.row)} onFailure={(message, recordId) => handleClaimFailure(message, recordId)} /></React.Fragment>}
        </React.Fragment>
    }

    function rendercustomerIdColumn(props) {
        return <React.Fragment>
            <CustomerIdLink customerId={props.row.customerId} className={"d-flex justify-content-center align-items-center h-100"} anchorClassName={"btn btn-link btn-sm w-100"} />
        </React.Fragment>
    }

    const appendParamsToUrl = (pageNumber, limitTo) => {
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        props.history.replace(`${CRM_UI}/followup?${qs.stringify({ ...params, pageNumber: pageNumber, limitTo: limitTo })}`);
    }

    const remoteDataFunction = async ({ startIndex, limit, pageNumber }) => {
        let params = { ...searchCriteria, limitFrom: startIndex, limitTo: limit };
        setSearchCriteria({ ...params });
        appendParamsToUrl(pageNumber, limit);
        const data = await getFollowUpDetails({ ...params });
        setDataSet(data.dataSet);
        return { dataSet: data.dataSet, totalRowsCount: data.totalRecords, status: true }
    }

    const getInitialClaimedData = async () => {
        if (validate.isEmpty(claimedData)) {
           return await UserService().getFollowupClaimedOrders().then((data)=>{
                if(data && validate.isNotEmpty(data.dataObject) && data.statusCode === "SUCCESS"){
                    return data.dataObject;
                }
            }).catch((error)=>{
                console.log(error)
                return undefined;
            })
        }
    }

    const onclickOrderId = (orderType, orderId, customerId ,row) => {
        setSelectedOrderId(orderId);
        setSelectedCustomerId(customerId);
        if ("MART" === orderType) {
            setMartOrderDetailModal(true);
        }
        if ("LAB" === orderType) {
            setLabOrderDeatailsModal(true);
        }
        if ("PRESCRIPTION" == orderType) {
            let imageUrls = []
            PrescriptionService().getPrescriptionDetails({ orderId }).then((prescriptionData) => {
                if (prescriptionData && Validate().isNotEmpty(prescriptionData.dataObject) && prescriptionData.statusCode === "SUCCESS" && validate.isNotEmpty(prescriptionData.dataObject.imageList)) {
                    prescriptionData.dataObject.imageList.map(imageObj => {
                        imageUrls.push(imageObj.imagePath)
                    })
                    setImagesForLightBox(imageUrls)
                    setSelectedOrderId(orderId)
                    setShowPrescriptionOrderdetail(true)
                } else {
                    setStackedToastContent({ toastMessage: prescriptionData.dataObject.message, position: TOAST_POSITION.BOTTOM_START })
                }
            }).catch((err) => {
                setStackedToastContent({ toastMessage: "Unable to get Prescription details , please try again", position: TOAST_POSITION.BOTTOM_START });
            });
        }
        setSelectedCommunicationId(row['communicationID']);
    }
    const renderOrderIdColumn = (props) => {
        return <React.Fragment>
            {validate.isNotEmpty(props.row.orderId) ?
                <div onClick={() => onclickOrderId(props.row.orderType, props.row.orderId, props.row.customerId , props.row)} className="d-flex justify-content-center align-items-center h-100">
                    <a href="javascript:void(0)" className="btn btn-sm btn-link w-100" rel="noopener" aria-label={props.row.orderId} role="link" title=" ">{props.row.orderId}</a>
                </div> :
                <React.Fragment><div className="d-flex justify-content-center align-items-center h-100">-</div></React.Fragment>
            }
        </React.Fragment>
    }

    const handleOrderDetailsModal = (value) => {
        setLabOrderDeatailsModal(value);
        setIsClaimed(false);
    }

    const setMetaInfo=async()=>{
        if(validate.isEmpty(gridData)){
            const metaInfo = await getFollowUpMetaInfo();
            setGridData(metaInfo);
        }
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
            { activeTabId == 1 ?  
               <input type={'checkbox'} checked = {orderIdsList.length == claimedData.length} onChange={(event) => {handleOnCheckAndUncheck(event)}} /> 
               : <></>
            }
        </React.Fragment>
    }

    const callBackMapping = {
        rendercustomerIdColumn,
        renderActionColumn,
        renderOrderIdColumn,
        'rowClass': isClaimed ? rowClaimedClassFunction : rowClassFunction,
        'checkBox' : handleCheckBoxColumn,
        'checkBoxHeader' : handleCheckBoxHeaderFunction 
    }

    const claimedMetaInfo = useMemo(() => {
        return gridData ? { ...gridData, paginationInfo: { isPaginationRequired: false } } : undefined
    }, [gridData]);
    const gridMetaInfo = useMemo(() => {
        return gridData ? {
            ...gridData,
            totalRowsCount: totalRecords,
            paginationInfo: {
                ...gridData.paginationInfo,
                initialPageNumber: params.pageNumber ? Number(params.pageNumber) : gridData?.paginationInfo?.initialPageNumber,
                limit: params.limitTo ? params.limitTo : defaultCriteria.limitTo
            }
        } : undefined

    }, [gridData, totalRecords, params])
    const displayMetaInfo = useMemo(() => {
        return  activeTabId == 1 ? (claimedMetaInfo ? { ...claimedMetaInfo } : undefined) : (gridMetaInfo ? { ...gridMetaInfo } : undefined);
    }, [claimedMetaInfo, gridMetaInfo, activeTabId])

    const claimedSet =(claim)=>{
        let listofOrderIds = orderIdsList.map(function (el) { return el.communicationID; });
        handleClaimRequest({'recordId':listofOrderIds[0], 'claimedBy':(claim == ClaimConstants.CLAIM) ?' ' : 'S', recordType:RECORD_TYPE.FOLLOWUP_ORDER , 'onSuccess':(recordid)=>{actionSuccess(recordid,listofOrderIds)},'onFailure':(message,recordid)=>{handleClaimFailure(message,recordid)}},listofOrderIds)
    }

    const actionSuccess = (recordid,listofOrderIds)=>{
        processClaimAction(listofOrderIds[0], listofOrderIds, orderIdsList[0])
    }

    const getBodyContent = (tabId) => {
        return <React.Fragment>
            {!loading && (!(tabId == 2 && validate.isEmpty(dataSet)) && !(tabId == 1 && validate.isEmpty(claimedData)) && displayMetaInfo ?
                (<div className={`h-100`}>
                    <div className="card h-100">
                        <div className='card-body p-0'>
                            <CommonDataGrid {...displayMetaInfo}
                                customGridToolbar={{component: ClaimUnclaimHandler, componentProps: {activeTabId, selectedRecordsLength: orderIdsList.length, claimedSet}}}
                                callBackMap={callBackMapping}
                                remoteDataFunction={remoteDataFunction}
                                dataSet={tabId == 1 ? claimedData : dataSet}
                            />
                        </div>
                    </div>
                </div>)
                : ((tabId == 1 && validate.isEmpty(claimedData)) ? <NoDataFound text={"No Claimed Orders for you!"} /> : errorMessage && <NoDataFound searchButton text={errorMessage ? errorMessage : "No Follow Up Details found based on the given criteria. Try other details!"} />))
            }</React.Fragment>
    }



    return <React.Fragment>
        <Wrapper showHeader={false}>
            <ClaimTabs {...props} selectedRecordsLength ={orderIdsList.length}  claimedSet={claimedSet} recordType={RECORD_TYPE.FOLLOWUP_ORDER} setTotalClaimedRecords={setClaimedCount} loading={loading} headerRef={headerRef} footerRef={footerRef} tabOneHeaderContent={"My Claimed List"} tabTwoHeaderContent={"Follow-Up Dashboard"} claimedCount={claimedCount} totalRecords={totalRecords} totalRecordsAnimation={totalRecordsAnimation} setTotalRecordsAnimation={setTotalRecordsAnimation} totalClaimedRecordsAnimation={totalClaimedRecordsAnimation} setTotalClaimedRecordsAnimation={setTotalClaimedRecordsAnimation} activeTabId={activeTabId} setActiveTabId={setActiveTabId}  parentProps={props}>
                 {getBodyContent(activeTabId)} 
                {!searchParamsExist && !(activeTabId==1) && <SeachNow {...props} />}
                {martOrderDetailModal && <PrepareOrderDetails {...props} fromPage={"FollowupForm"} setDataSet={setDataSet} dataSet={dataSet} orderId={selectedOrderId}  communicationId={selectedCommunicationId} customerId={selectedCustomerId} openOrderDetailModal={martOrderDetailModal} setOpenOrderDetailModal={setMartOrderDetailModal} />}
                {labOrderDeatilsModal && <LabOrderDetailModal orderId={selectedOrderId} setSelectedOrderId = {setSelectedOrderId} showOrderDeatilsModal={labOrderDeatilsModal} setShowOrderDeatilsModal={setLabOrderDeatailsModal} customerId={selectedCustomerId} disableMode ={disableMode} setDisableMode={setDisableMode} handleOrderDetailsModal = {handleOrderDetailsModal}/>}
                {showPrescriptionOrderdetail && <ImageLightBox imageIndex={activeIndex} prescImages={imagesForLightBox}
                    mainSrc={imagesForLightBox[activeIndex]}
                    nextSrc={imagesForLightBox[(activeIndex + 1) % imagesForLightBox.length]}
                    prevSrc={imagesForLightBox[(activeIndex + imagesForLightBox.length - 1) % imagesForLightBox.length]}
                    imageTitle={"Prescription"}
                    onCloseRequest={() => { setShowPrescriptionOrderdetail(false); setActiveIndex(0) }}
                    onMovePrevRequest={() => setActiveIndex((activeIndex + imagesForLightBox.length - 1) % imagesForLightBox.length)}
                    onMoveNextRequest={() => setActiveIndex((activeIndex + 1) % imagesForLightBox.length)} />}
            </ClaimTabs>
        </Wrapper>
    </React.Fragment>
}
export default FollowupSearchResult;
