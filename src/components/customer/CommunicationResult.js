import CommonDataGrid, { CustomPopOver } from "@medplus/react-common-components/DataGrid";
import React, { useContext, useEffect, useRef, useState } from "react";
import Validate from "../../helpers/Validate";
import CommunicationService from "../../services/Communication/CommunicationService";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import OrderDetailModal from "../order/OrderDetailModal";
import { AlertContext, CustomerContext } from "../Contexts/UserContext";
import qs from 'qs';
import dateFormat from 'dateformat';
import NoDataFound from "../Common/NoDataFound";
import HealthRecord from "../healthRecord/HealthRecord";
import LabOrderDetailModal from "../labOrders/labOrderModal/LabOrderDetailModal";

const CommunicationResult=(props)=>{
    const {customerId} = useContext(CustomerContext);    
    const headerRef = useRef(null);
    const { setStackedToastContent } = useContext(AlertContext);
    const [loading, isLoading] = useState(false);
    const [gridData, setGridData] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const [sendDataSet,setSendDataSet] = useState([])
    const [showOrderDetailPopUp, setShowOrderDetailPopUp] = useState(false);
    const [orderId,setOrderId] = useState();
    const [prescriptionOrderId,setPrescriptionOrderId] = useState();
    const [disableMode, setDisableMode] = useState(false);
    const [openOrderDetailModal,setOpenOrderDetailModal] = useState(false);
    const [openLabOrderDetailModal, setOpenLabOrderDetailModal] = useState(false);
    const [labOrderId, setLabOrderId] = useState();
    const [openPrescriptionOrderDetailModal,setopenPrescriptionOrderDetailModal] = useState(false);
    const params = qs.parse(props?.location?.search, { ignoreQueryPrefix: true });
    const [closePropover , setClosePopover] = useState(false)

    const defaultCriteria ={
        fromDate: dateFormat(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 'yyyy-mm-dd 00:00:00'),
        toDate: dateFormat(new Date(), 'yyyy-mm-dd 23:59:59'),
        customerId: customerId,
        start: 0,
        end: 10,
        orderBy: "datecreated",
        showMsgOutOnly:"",
        sortOrder: "desc",
        type: "C",
    }

    useEffect(()=>{
        // if(props.tabId==1){
            getInitialData(defaultCriteria, true);
        // }
    },[])

    useEffect(() => {
        if(Validate().isNotEmpty(params))
            getInitialData(params, true);
    }, [props.location.search]);


    const getInitialData = async (searchCriteria,isInitialRequest) => {
        isLoading(isInitialRequest);
        const data = await getCommunicationData(searchCriteria);
        if (Validate().isNotEmpty(data)) {
            setGridData(data.dataGrid);
            setDataSet(data.dataSet);
            isLoading(false)
        } else {
            setGridData(undefined);
            setDataSet([]);
            isLoading(false)
        }
        return data;
    }

    const getCommunicationData = async (obj) => {
        const data = await CommunicationService().getLogDetails(obj).then((data) => {
            if (data && data.statusCode === "SUCCESS") {
                return data.dataObject;
            } else if (data && data.statusCode === "FAILURE") {
                setStackedToastContent({ toastMessage: data.message});
                isLoading(false)
                return {};
            } else {
                return {};
            }
        }).catch(() => {
            alert("The System is Offline")
            isLoading(false)
            return {};
        });
        return data;
    }

    // const getOrderDetails=()=>{
    //     return(
    //         <React.Fragment>
    //             {openOrderDetailModal &&
    //                 <OrderDetailModal setOpenOrderDetailModal={setOpenOrderDetailModal} orderId={orderId} customerId={customerId} dataSet={sendDataSet} setDataSet={setSendDataSet} hideOrderStatusDetails={true} hideOrderLocationDetails={true} hideTrackOrder={true} hideTickets={true}/>
    //             }
    //             {openLabOrderDetailModal && 
    //                 <LabOrderDetailModal hideHeaderButtons={true} orderId={labOrderId} setSelectedOrderId = {setLabOrderId} showOrderDeatilsModal={openLabOrderDetailModal} setShowOrderDeatilsModal={setOpenLabOrderDetailModal} customerId={customerId} disableMode ={disableMode} setDisableMode={setDisableMode} handleOrderDetailsModal = {handleOrderDetailsModal}/>
    //             }
    //             </React.Fragment>
    //     )
    // }

    const onOrderIdClick = (row) =>{
        setSendDataSet(dataSet); 
        setShowOrderDetailPopUp(true); 
        if(row.orderType == "MART"){
            setOrderId(row.orderId); 
            setOpenOrderDetailModal(true)
        }
        if(row.orderType == "PRESCRIPTION"){
            setPrescriptionOrderId(row.orderId); 
            setopenPrescriptionOrderDetailModal(true);
        }
        if(row.orderType == "LAB"){
            setLabOrderId(row.orderId); 
            setOpenLabOrderDetailModal(true);
        }
    }

    function renderOrderIdColumn(props) {
        return <React.Fragment>
            <a className='pb-5 mb-4' style={{ height: "0px", width: "0px" }} onClick={()=>{onOrderIdClick(props.row)}}>{props.row.orderId}</a>
        </React.Fragment>
    }

    const getDescriptionColumn = ({ row, column }) => {
        return (
            <React.Fragment>
                {
                    Validate().isNotEmpty(row) && Validate().isNotEmpty(row.message) ?
                        <React.Fragment>
                            <p id={`description-column_${row.communicationId}`} className="text-truncate pointer" title="Click To Show Description">{row.message}</p>
                            <CustomPopOver value={row.message} target ={`description-column_${row.communicationId}`} headerText ={column.name} closePopOver={closePropover}  setClosePopOver={setClosePopover}/>
                        </React.Fragment>
                        :
                        <p>-</p>
                }
            </React.Fragment>
        );
    }

    const callBackMapping = {
        "renderOrderIdColumn": renderOrderIdColumn,
        "descriptionPopOver" : getDescriptionColumn
    }

    const appendParamsToUrl = async (limitTo, startIndex) => {
        let params = Validate().isNotEmpty(props.data) ? { ...props.data } : defaultCriteria
        params = {...params,limitFrom: startIndex, limitTo: limitTo};
        const data = await getInitialData(params, false);
        return data?.dataSet;
    }

    const remoteDataFunction = async ({ startIndex, limit, totalRecords}) => {
        const data =await appendParamsToUrl(limit, startIndex);
        return {dataSet: data , totalRowsCount : totalRecords , status : true}

    }

    const handleOrderDetailsModal = (value) => {
        setOpenLabOrderDetailModal(value);
    }

    return <React.Fragment>
        <Wrapper>
            <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
            <p className="mb-0">Communication Search Results</p>
            </HeaderComponent>
            {!loading && <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height" >
                {!openPrescriptionOrderDetailModal && <div className={`card h-100`}>
                {(!loading && gridData && dataSet) ?
                <CommonDataGrid {...gridData}
                    callBackMap={callBackMapping}
                    dataSet={dataSet}
                    remoteDataFunction={remoteDataFunction}
                />
                :<NoDataFound text={"No Communication record found."}/>}
                </div>}
                {/* {(showOrderDetailPopUp || openLabOrderDetailModal) && getOrderDetails()} */}
                </BodyComponent>}
        {openPrescriptionOrderDetailModal &&
        <div className="custom-modal header">
            <HealthRecord {...props} needBackButton={true} openHealthRecordModal={openPrescriptionOrderDetailModal} setOpenHealthRecordModal={setopenPrescriptionOrderDetailModal} id={'p_'+prescriptionOrderId}/>
        </div>
        }
        {openOrderDetailModal &&
        <OrderDetailModal showModal={openOrderDetailModal} setOpenOrderDetailModal={setOpenOrderDetailModal} orderId={orderId} customerId={customerId} dataSet={sendDataSet} setDataSet={setSendDataSet} hideOrderStatusDetails={true} hideOrderLocationDetails={true} hideTrackOrder={true} hideTickets={true}/>
        }
        {openLabOrderDetailModal && 
        <div className="custom-modal header">
        <LabOrderDetailModal hideHeaderButtons={true} orderId={labOrderId} setSelectedOrderId = {setLabOrderId} showOrderDeatilsModal={openLabOrderDetailModal} setShowOrderDeatilsModal={setOpenLabOrderDetailModal} customerId={customerId} disableMode ={disableMode} setDisableMode={setDisableMode} handleOrderDetailsModal = {handleOrderDetailsModal}/>
    </div>
        }
        </Wrapper>
    </React.Fragment>
}
export default CommunicationResult;