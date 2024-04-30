import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import CommonDataGrid, { ChangeType } from "@medplus/react-common-components/DataGrid";
import RefillService from "../../services/Refill/RefillService";
import OrderService from "../../services/Order/OrderService";
import Validate from "../../../src/helpers/Validate";
import qs from 'qs';
import { CRM_UI } from "../../services/ServiceConstants";
import RefillSearchResultModal from "./RefillSearchResultModal";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import { AlertContext, UserContext } from "../Contexts/UserContext";
import { ALERT_TYPE } from '@medplus/react-common-components/DynamicForm';
import { Unsubscribe } from "@medplus/react-common-components/DataGrid";
import CustomerIdLink from "../../helpers/CustomerIdLink";
import NoDataFound from "../Common/NoDataFound";
import SeachNow from "../Common/SearchNow";
import CommonConfirmationModal from "../Common/ConfirmationModel";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import DisabledCell from "../Common/DisabledCell";
import useRowClassFunction from "../../hooks/useRowClassFunction";
import CurrencyFormatter from "../Common/CurrencyFormatter";


const RefillSearchResult = (props) => {
 
    const [gridData, setGridData] = useState(undefined);
    const [loading, isLoading] = useState(false);
    const [dataSet, setDataSet] = useState(undefined);
    const [showModal, setShowModal] = useState(false);
    const [refillId, setRefillId] = useState();
    const [customerId, setCustomerId] = useState();
    const [refilIdToUnsubscribe, setRefilIdToUnsubscribe] = useState(undefined);
    const [searchCriteria, setSearchCriteria] = useState({});
    const headerRef = useRef(null);
    const [availableParams, setAvailableParams] = useState(true)
    const { setAlertContent } = useContext(AlertContext);
    const userSessionInfo = useContext(UserContext);
    const [showConfirmationModal, setConfirmationModal] = useState(false);
    const [timeInterval,setTimeInterval] = useState(undefined);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedrefiilId,setSelectedrefiilId] = useState(undefined);
    const [rowClassFunction] = useRowClassFunction({uniqueId:"refillId" , selectedOrderId: selectedrefiilId});
    const validate = Validate();


    useEffect(() => {
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        const rest = getActualSearchCriteria(params);
        const restCriteria = getActualSearchCriteria(searchCriteria);
        if(validate.isEqualObject(rest,restCriteria)) {
            return;
        }
        if (Validate().isNotEmpty(params)) {
            setShowModal(false);
            let limit = params.limitTo ? params.limitTo : 30;
            let startIndex = params.pageNumber ? (params.pageNumber-1)*limit : 0;
            setAvailableParams(false);
            setSearchCriteria({ ...params,limitTo:limit,startIndex:startIndex});
            getInitialData({ ...params,limitTo:limit,startIndex:startIndex});
        }
    }, [props.location.search]);

    const getInitialData = async (searchCriteria) => {
        isLoading(true);
        const data = await getRefillOrders(searchCriteria);
        if (Validate().isNotEmpty(data)) {
            setGridData(data.dataGrid);
            setDataSet([...data.dataSet]);
            if(validate.isNotEmpty(data.totalRecords)){
                setTotalRecords(data.totalRecords);
            }
        }
        isLoading(false);
    }

    const getActualSearchCriteria = (criteria) => {
        const {pageNumber,limitTo,startIndex,...rest} = criteria;
        return rest;
    }

    const getRefillOrders = async (obj) => {
        const {v,...rest} = obj;
        const data = await RefillService().getRefillInfo(rest).then(data => {
            if (data && data.statusCode === "SUCCESS" && Validate().isNotEmpty(data.dataObject)) {
                return data.dataObject;
            } else {
                return {dataSet:[]};
            }
        }).catch((err) => {
            setAlertContent({alertMessage:"Error while getting Refill Orders"})
        });
        return data;
    }

    const setModalProps = (props) => {
        setShowModal(true);
        setRefillId(props.row.refillId);
        setSelectedrefiilId(props.row.refillId);
        setCustomerId((props.row.customerId));
        let number = 0;
        switch (props.row.deliveryInterval) {
            case "60 Days":
                number = 3;
                break;
            case "45 Days":
                number = 2;
                break;
            case "30 Days":
                number = 1;
                break;
            default:
                break;
        }
        setTimeInterval(number);
    }

    const renderRefillIdColumn = (props) => {
        return (
            <React.Fragment>
                <OverlayTrigger
                    key={"RefillDetailsToolTip"}
                    placement={"bottom"}
                    overlay={
                        <Tooltip id={`RefillDetailsToolTip`}>
                            View to Refill Details
                        </Tooltip>
                    }>
                    <div onClick={() => { setModalProps(props) }} className="d-flex align-items-center h-100">
                        <a className="btn btn-sm btn-link w-100" href="javascript:void(0)" >{props.row.refillId}
                        </a>
                    </div>
                </OverlayTrigger>
            </React.Fragment>

        )
    }

    const renderCustomerIdColumn = (props) => {
        return <React.Fragment>
            <CustomerIdLink customerId={props.row.customerId} className={"d-flex align-items-center h-100"} anchorClassName={"btn btn-link btn-sm w-100"} />
        </React.Fragment>
    }

    const propsToUnsubscribeModal = (id) => {
        if (validate.isNotEmpty(id)) {
            setConfirmationModal(!showConfirmationModal);
            setRefilIdToUnsubscribe(id);
        }else{
            setAlertContent({alertMessage:"Empty Refill Id",alertType: ALERT_TYPE.INFO});
        }
    }

    const unSubscribeRefillOrder = async(refillId) => {
        let status ='';
        await OrderService().unsubscribeRefillOrder({refillId}).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setAlertContent({ alertMessage: `Refill order Unsubscribed Successfully!`, alertType: ALERT_TYPE.SUCCESS });
                getInitialData(searchCriteria);
            }
            else {
                setAlertContent({ alertMessage: "Unable to unsubscribe refill order, Please try again", alertType: ALERT_TYPE.ERROR });
                status = 'failed'    
            }
            return;
        }, (err) => {
            setAlertContent({ alertMessage: "Error while unsubscribing refil order" });
            status = 'failed'
            return;
        })
        return status
    }

    const renderActionColumn = (props) => {
        return <React.Fragment>
            {props.row.orderStatus === "ACTIVE" 
                        ? <Unsubscribe tooltip={props.tooltip} handleOnClick={() => { propsToUnsubscribeModal(props.row.refillId) }} />
                        : <DisabledCell cellId={props.row['refillId']} showComponent={<Unsubscribe isDisabled/>} cellTooltip="Inactive Order"/>}
        </React.Fragment>
    }

    const renderorderAmountColumn = (props) => {
        return <React.Fragment>
                <CurrencyFormatter data={props.row.orderAmount} decimalPlaces={2} />
        </React.Fragment>
    }

    const appendParamsToUrl = (pageNumber, limitTo) => {
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        props.history.replace(`${CRM_UI}/refillSearch?${qs.stringify({...params, pageNumber:pageNumber, limitTo:limitTo})}`);
    }

    const remoteDataFunction = async ({ startIndex, limit, sortColumns, filters ,pageNumber, changeType}) => {
        let temObj = validate.isNotEmpty(searchCriteria) ? { ...searchCriteria, 'startIndex': startIndex, 'limitTo': limit } : { 'startIndex': startIndex, 'limitTo': limit }
        const data = await getRefillOrders(temObj);
        appendParamsToUrl(pageNumber,limit);
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
         return { dataSet: data?.dataSet ? data.dataSet : [], totalRowsCount: data.totalRows, status: true }
        /* if (validate.isNotEmpty(data)) {
            setDataSet(data.dataSet);
            return { dataSet: data.dataSet, totalRowsCount: data.totalRows, status: true }
        }
        return { status: false }; */
    }
    

    const callBackMap = {
        "renderRefillIdColumn": renderRefillIdColumn,
        "renderCustomerIdColumn": renderCustomerIdColumn,
        "renderActionColumn": renderActionColumn,
        "renderorderAmountColumn": renderorderAmountColumn,
        "rowClass": rowClassFunction
    }
    const unsubscribeRefill =(id) =>{
        //setRefilIdToUnsubscribe(id)
        unSubscribeRefillOrder(id).then((data)=>{
            if(data != 'failed'){
                setShowModal(!showModal)
            }
        })
      
    }
    return <React.Fragment>
        <Wrapper showHeader={false}>
            <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                <p className="mb-0"> Refill Details</p>
            </HeaderComponent>
            <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height" >
                {!loading && validate.isNotEmpty(gridData) ? <div className={'h-100'}>
                <div className="card h-100">
                    <div className="card-body p-0 h-100">
                    <CommonDataGrid
                            {...gridData}
                            remoteDataFunction={remoteDataFunction}
                            dataSet={dataSet}
                            callBackMap={callBackMap}
                        />
                    </div></div></div> : ((!loading && totalRecords === 0 && !availableParams) && <NoDataFound searchButton text="No Refill Details found  based on the given criteria. Try other details!" />)}
                {availableParams && <SeachNow />}
                {showConfirmationModal && <CommonConfirmationModal small={true} headerText={"Do you to Want to Unsubscribe"} isConfirmationPopOver={showConfirmationModal} setConfirmationPopOver={setConfirmationModal} message={`Do you want to unsubscribe Refill ID - ${refilIdToUnsubscribe} ?`} buttonText={"Yes, Unsubscribe this Refill"} onSubmit={() => unSubscribeRefillOrder(refilIdToUnsubscribe)} />}
            {showModal &&
                    <RefillSearchResultModal showModal={showModal} unsubscribeRefill={unsubscribeRefill} refillId={refillId} customerId={customerId} setShowModal={setShowModal} timeInterval={timeInterval} setSelectedrefiilId={setSelectedrefiilId}/>
            }
            </BodyComponent>
        </Wrapper>
    </React.Fragment>
}

export default RefillSearchResult;