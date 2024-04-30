import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import React, { useContext, useEffect, useRef, useState } from "react";
import Validate from "../../helpers/Validate";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import OrderDetailModal from "../order/OrderDetailModal";
import { CustomerContext } from "../Contexts/UserContext";
import UserService from "../../services/Common/UserService";

const CustomerFollowUpResult=(props)=>{
    const {customerId} = useContext(CustomerContext);
    const defaultCriteria = props.data;
    
    const headerRef = useRef(null);
    const [loading, isLoading] = useState(true);
    const [gridData, setGridData] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const [sendDataSet,setSendDataSet] = useState([])
    const [showOrderDetailPopUp, setShowOrderDetailPopUp] = useState(false);
    const [orderId,setOrderId] = useState();
    const [openOrderDetailModal,setOpenOrderDetailModal] = useState(false);

    useEffect(() => {
        setOpenOrderDetailModal(false);
        getInitialData(Validate().isNotEmpty(props.data) ? { ...props.data } : defaultCriteria);
    }, [props.data]);


    const getInitialData = async (searchCriteria) => {
        isLoading(true);
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
    }

    const getCommunicationData = async (obj) => {
        return await UserService().getCommunicationLogDetails(obj).then((data) => {
            if (data && data.statusCode === "SUCCESS") {
                return data.dataObject;
            } else if (data && data.statusCode === "FAILURE") {
                alert(data.message)
                isLoading(false)
                return [];
            } else {
                return [];
            }
        }).catch(() => {
            alert("The System is Offline")
            isLoading(false)
            return [];
        });
    }

    const getOrderDetails=()=>{
        return(
            <React.Fragment>
                {openOrderDetailModal &&
                <OrderDetailModal setOpenOrderDetailModal={setOpenOrderDetailModal} orderId={orderId} customerId={customerId} dataSet={sendDataSet} setDataSet={setSendDataSet} hideOrderStatusDetails={true} hideOrderLocationDetails={true} hideTrackOrder={true} hideTickets={true}/>
               }
                </React.Fragment>
        )
    }

    function renderOrderIdColumn(props) {
        return <React.Fragment>
            <a className='pb-5 mb-4' style={{ height: "0px", width: "0px" }} onClick={()=>{setSendDataSet(dataSet); setShowOrderDetailPopUp(true); setOrderId(props.row.orderId); setOpenOrderDetailModal(true)}}>{props.row.orderId}</a>
        </React.Fragment>
    }

    const callBackMapping = {
        "renderOrderIdColumn": renderOrderIdColumn,
    }

    return <React.Fragment>
        <Wrapper showHeader={false}>
            <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height" >
                <div className={`h-100`}>
                {!loading && gridData &&
                <CommonDataGrid {...gridData}
                    callBackMap={callBackMapping}
                    dataSet={dataSet}
                />
                }
                </div>
                {showOrderDetailPopUp && getOrderDetails()}
                </BodyComponent>
        </Wrapper>

    </React.Fragment>
}
export default CustomerFollowUpResult;