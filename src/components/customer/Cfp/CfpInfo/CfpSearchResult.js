import CommonDataGrid, { ChangeType, ViewIcon } from "@medplus/react-common-components/DataGrid";
import dateFormat from 'dateformat';
import qs from 'qs';
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { gotoMartCustomerPage } from "../../../../helpers/CommonRedirectionPages";
import Validate from "../../../../helpers/Validate";
import CustomerService from "../../../../services/Customer/CustomerService";
import { BodyComponent, HeaderComponent, Wrapper } from "../../../Common/CommonStructure";
import NoDataFound from "../../../Common/NoDataFound";
import { AlertContext, UserContext } from "../../../Contexts/UserContext";
import { CRM_UI } from "../../../../services/ServiceConstants";
import CfpActionDetails from "./CfpActionDetails";
import OrderHelper from "../../../../helpers/OrderHelper";
import SeachNow from "../../../Common/SearchNow";
import { TOAST_POSITION } from "@medplus/react-common-components/DynamicForm";


const defaultCriteria = {
    limitTo: 30
}

export const getBadgeColorClassForCfpStatus = (status) => {
    let badgeColorClass = "badge-created";
    if(Validate().isEmpty(status) || status.toLowerCase().includes("pending")){
        return badgeColorClass;
    }
    if(status.toLowerCase().includes("sales done") || status.toLowerCase().includes("sale done")){
        badgeColorClass = "badge-approved";
    }
    if(status.toLowerCase().includes("follow ups")){
        badgeColorClass = "badge-pending";
    }
    if(status.toLowerCase().includes("withdrawn")){
        badgeColorClass = "badge-rejected";
    }
    if(status.toLowerCase().includes("closed")){
        badgeColorClass = "badge-Cancelled";
    }
    return badgeColorClass;
}

const CfpSearchResult = (props) => {

    const validate = Validate();
    const [loading, isLoading] = useState(false);
    const [gridData, setGridData] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const userSessionInfo = useContext(UserContext);
    const {setAlertContent} = useContext(AlertContext);
    const [openModal, setOpenModal] = useState(false);
    const [noRecordsFoundMsg, setNoRecordsFoundMsg] = useState(undefined);
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const [searchCriteria, setSearchCriteria] = useState({});
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedCustomerId, setSelectedCustomerId] = useState(undefined);
    const [selectedActionId, setSelectedActionId] = useState(undefined);
    const [searchParamsExist, setSearchParamsExist] = useState(false);
    const headerRef = useRef(null);
    const { setStackedToastContent } = useContext(AlertContext);


    useEffect(() => {
        setOpenModal(false);
        if (Validate().isNotEmpty(params)) {
            setSearchParamsExist(true);
            let limitTo = params.limitTo ? params.limitTo : defaultCriteria.limitTo;
            let obj = { ...params, 'limitFrom': 0, 'limitTo': 10 };
            setSearchCriteria({ ...params, limitFrom: params.pageNumber ? (params.pageNumber-1)*limitTo : 0, limitTo: limitTo });
            if (validate.isNotEmpty(params.fromDate) && validate.isNotEmpty(params.toDate)) {
                let fromDate = dateFormat(params.fromDate, "yyyy-mm-dd") + " 00:00:00";
                let toDate = dateFormat(params.toDate, "yyyy-mm-dd") + " 23:59:59";
                setSearchCriteria({ ...params, fromDate: fromDate, toDate: toDate});
                getInitialCustomerData({ ...params, limitFrom: params.pageNumber ? (params.pageNumber-1)*limitTo : 0, limitTo: limitTo, fromDate: fromDate, toDate: toDate });
            }else{
                getInitialCustomerData({ ...params, limitFrom: params.pageNumber ? (params.pageNumber-1)*limitTo : 0, limitTo: limitTo });
            }
        }

    }, [props.location.search]);

    const getInitialCustomerData = async (obj) => {
        isLoading(true);
        let initialCustomerData = await getCfpInfo(obj);
        if (Validate().isNotEmpty(initialCustomerData)) {
            setGridData(initialCustomerData.dataGrid);
            setDataSet(initialCustomerData.dataSet);
            setTotalRecords(initialCustomerData.dataGrid.totalRowsCount);
        } else {
            setGridData(undefined);
            setDataSet([]);
        }
        isLoading(false);
    }


    const getCfpInfo = async (obj) => {
        return await CustomerService().getCfpActions(obj).then((data) => {
            if (data && data.statusCode === "SUCCESS") {
                return data.dataObject;
            }else if(data.statusCode === "FAILURE"){
                setNoRecordsFoundMsg(data.message);
            } 
        }).catch((err) => {
            setAlertContent({alertmessage:"Error while searching CFP info, Please try after some time"});
            return [];
        });
    }

    const handleFailure = () => {
        setStackedToastContent({ toastMessage: "Customer is Already Opened", position: TOAST_POSITION.BOTTOM_START })
    }

    const CustomerIdCustomComponent = (props) => {
        return <React.Fragment>
                    <a className="btn btn-sm btn-link w-100" href="javascript:void(0)" rel="noopener" aria-label={props.row.customerId} role="link" title="View customer details" onClick={() => gotoMartCustomerPage({ customerId: props.row.customerId, mobile: props.row.mobileNo}, handleFailure)}>{props.row.customerId}</a>
                </React.Fragment>
    
    }

    const view = (actionId, customerId) => {
        console.log("openModal");
        setSelectedActionId(actionId);
        setSelectedCustomerId(customerId);
        setOpenModal(true);
    }

    const ActionCustomComponent = (props) => {
        return <ViewIcon id={"action_"+props.row.actionId} handleOnClick={() => {view(props.row.actionId, props.row.customerId)}}></ViewIcon>
    }

    const StatusCustomComponent = (props) => {
        let statusCellClass = getBadgeColorClassForCfpStatus(props.row.status) + " badge rounded-pill";
        return <React.Fragment>
            <div className={statusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.status)}</div>
        </React.Fragment>
    }

    

    const appendParamsToUrl = (pageNumber, limitTo) => {
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        props.history.replace(`${CRM_UI}/cfpSearch?${qs.stringify({...params, pageNumber:pageNumber, limitTo:limitTo})}`);
    }

    const remoteDataFunction = async ({ startIndex, limit, sortColumns, filters, pageNumber, changeType}) => {
        let params = { ...searchCriteria, limitFrom: startIndex, limitTo: limit };
        appendParamsToUrl(pageNumber, limit);
        const data = await getCfpInfo({ ...params });
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
         return { dataSet: data?.dataSet ? data.dataSet : [], totalRowsCount: data.dataGrid.totalRowsCount, status: true }
    }

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
        return {...gridMetaInfo}

    },[gridMetaInfo])



    const callBackMapping = {
        "renderCustomerIdColumn": CustomerIdCustomComponent,
        "renderActionColumn": ActionCustomComponent,
        "renderStatusColumn": StatusCustomComponent
    }

    return <React.Fragment>
        <Wrapper showHeader={false}>
            <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                <p className="mb-0">CFP Search Results</p>
            </HeaderComponent>
            <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height">
                {(!loading && validate.isNotEmpty(dataSet)) ? <div className={'h-100'}>
                    <div className='card h-100'>
                        <div className='card-body p-0'>
                            <CommonDataGrid {...displayMetaInfo} dataSet={dataSet}
                                callBackMap={callBackMapping}
                                remoteDataFunction={remoteDataFunction}
                            />
                        </div>
                    </div>
                </div>
                    : (searchParamsExist && !loading && noRecordsFoundMsg ? <NoDataFound searchButton text={noRecordsFoundMsg}></NoDataFound> : null)}
                {!searchParamsExist && <SeachNow {...props} />}
                {openModal && <CfpActionDetails openModal={openModal} dataSet={dataSet} setDataSet={setDataSet} setOpenModal={setOpenModal} actionId={selectedActionId} customerId={selectedCustomerId}></CfpActionDetails>}
            </BodyComponent>
        </Wrapper>
    </React.Fragment>
}

export default CfpSearchResult;