import CommonDataGrid, { ChangeType } from '@medplus/react-common-components/DataGrid';
import { TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import dateFormat from 'dateformat';
import qs from 'qs';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Validate from '../../helpers/Validate';
import CustomerService from '../../services/Customer/CustomerService';
import { BodyComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure';
import NoDataFound from '../Common/NoDataFound';
import SeachNow from '../Common/SearchNow';
import { AlertContext, UserContext } from "../Contexts/UserContext";
import RequisitionDetailModal from './RequisitionDetailModal';
import { CRM_UI } from '../../services/ServiceConstants';
import OrderHelper from '../../helpers/OrderHelper';
import useRowClassFunction from '../../hooks/useRowClassFunction';

const CustomersProcurementDetails = (props) => {

  const [showRequisitionDetailModal , setShowRequisitionDetailModal] = useState(false)
  const headerRef = useRef(null);
  const [loading, isLoading] =  useState(false)
  const [dataSet, setDataSet] = useState([])
  const [dataGrid, setDataGrid] = useState(undefined)
  const [totalRecords, setTotalRecords] = useState(0)
  const validate = Validate();
  const [parameterExists , setSearchParamsExist] = useState(false)
  const [searchCriteria, setSearchCriteria] = useState({});
  const [requisitionId, setRequisitionId] = useState(undefined)
  const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const { setStackedToastContent } = useContext(AlertContext);
  const userSessionInfo = useContext(UserContext);
  const [requisitionDataset, setRequisitionDataset] = useState([])
  const [RequisitionDataGrid, setRequisitionDataGrid] = useState(undefined)
  const [RequisitionTotalRecords,setRequisitionsTotalRecords] = useState(0)
  const [customerId, setCustomerId] = useState("")
  const [customerMobileNo , setCustomerMobileNo] = useState("")
  const [requisitionType , setRequisitionType] = useState("")
  const [requisitionDataLoading , setRequisitionDataLoading] = useState(false)
  const [requisitionStatus, setRequisitionStatus] = useState("")
  const [rowClassFunction] = useRowClassFunction({uniqueId:'requisitionId',selectedOrderId:requisitionId});
  
  const defaultCriteria = {
    limitTo: 30
  }

  const getActualSearchCriteria = (criteria) => {
    const { pageNumber, limitTo, limitFrom, ...rest } = criteria;
    return rest;
  }

  useEffect(() => {
    const paramsSearchCriteria = getActualSearchCriteria(params);
    const currentSearchCriteria = getActualSearchCriteria(searchCriteria);
    if (validate.isEqualObject(paramsSearchCriteria, currentSearchCriteria)) {
      return;
    }
    if (validate.isNotEmpty(params)) {
      Object.entries(params).forEach(([key, value]) => {
        if (validate.isEmpty(value))
          delete params[key];
      });
    }
    if (validate.isNotEmpty(params)) {
      setSearchParamsExist(true)
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

  const handleRequisitionDetailModal = (value) =>{
    setShowRequisitionDetailModal(value)
    if(!value) {
      setTimeout(() => {
          setRequisitionId(undefined);
      },2000)
  }
  }

  const getInitialData = async(searchCriteria) => {
    isLoading(true);
    const data = await getProcurementDetails(searchCriteria);
    if(validate.isNotEmpty(data)){
      setDataGrid(validate.isNotEmpty(data.dataGrid) ? data.dataGrid : []);
      setDataSet(validate.isNotEmpty(data.dataset) ? [...data.dataset] : []);
      setTotalRecords(data.totalRecords);
    }
    isLoading(false);
  } 

  const getInitialRequisitionData = async (requisitionId) => {
    setRequisitionDataLoading(true)
    const data = await getRequisitionDetails(requisitionId);
    if (validate.isNotEmpty(data)) {
        setCustomerId(validate.isNotEmpty(data.customerId) ? data.customerId : "")
        setCustomerMobileNo(validate.isNotEmpty(data.customerMobileNo)? data.customerMobileNo : "")
        setRequisitionType(validate.isNotEmpty(data.requisitionType)? data.requisitionType : "");
        setRequisitionStatus(validate.isNotEmpty(data.requisitionStatus)? data.requisitionStatus : "");
        setRequisitionDataGrid(validate.isNotEmpty(data.dataGrid) ? data.dataGrid : []);
        setRequisitionDataset(validate.isNotEmpty(data.dataSet) ? [...data.dataSet] : []);
        setRequisitionsTotalRecords(data.totalRecords);
    }
    setRequisitionDataLoading(false)
  }

  const getRequisitionDetails = async (requisitionId) => {
    const data = await CustomerService().getRequisitionDeatls({"requisitionId" : requisitionId}).then(data =>{
      if (data && "SUCCESS" === data.statusCode && Validate().isNotEmpty(data.dataObject)) {
        return data.dataObject;
      } else {
        setStackedToastContent({ toastMessage: data.message, position: TOAST_POSITION.BOTTOM_START })
        console.log(data.message)
      }
    }).catch((err) => {
      setStackedToastContent({ toastMessage: "Something went wrong, Please Try Again!", position: TOAST_POSITION.BOTTOM_START })
      console.log(err)
    });
    return data;
  }


  const openRequisitionDetailModal = (requisitionId) => {
    setRequisitionId(requisitionId)
    getInitialRequisitionData(requisitionId)
    setShowRequisitionDetailModal(true)
  }

  const getProcurementDetails = async (procurementSearcgCriteria) => {
    setShowRequisitionDetailModal(false)
    const data = await CustomerService().getProcurementDetails(procurementSearcgCriteria).then(data =>{
      if (data && "SUCCESS" === data.statusCode && Validate().isNotEmpty(data.dataObject)) {
        return data.dataObject;
      } else {
        setStackedToastContent({ toastMessage: data.message, position: TOAST_POSITION.BOTTOM_START })
        console.log(data.message)
      }
    }).catch((err) => {
      setStackedToastContent({ toastMessage: "Something went wrong, Please Try Again!", position: TOAST_POSITION.BOTTOM_START })
      console.log(err)
    });
    return data;
  }

  function renderCustomerIdColumn(props) {
    return <React.Fragment>
      <div className="d-flex align-items-center h-100" onClick={() => openRequisitionDetailModal(props.row.requisitionId)}>
      <a href="javascript:void(0)" id={props.row.customerId} className="btn btn-sm btn-link w-100" rel="noopener" aria-label={props.row.customerId} role="link" title="Show Requisition Details">{props.row.customerId}</a>
      </div>
    </React.Fragment>
}

const getBadgeColorClassForStatus = (status) => {
  let badgeColorClass = "badge-created";
  if (Validate().isEmpty(status)) {
    return badgeColorClass;
  }
  if ("CREATED" === status) {
    badgeColorClass = "badge-created";
  }
  if ("INACTIVE" === status) {
    badgeColorClass = "badge-rejected";
  }
  if ("ACTIVE" === status) {
    badgeColorClass = "badge-approved";
  }
  return badgeColorClass;
}


  function renderstatusColumn(props) {
    let statusCellClass = getBadgeColorClassForStatus(props.row.status) + " badge rounded-pill";
    return <React.Fragment>
      <div className={statusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.status)}</div>
    </React.Fragment>
  }
  function renderMobileNumberColumn(props) {
    return <React.Fragment>
      <a href="tel:+"{...props.row.CustomerMobileNo} title="Contact Customer" className='text-decoration-none'>{props.row.CustomerMobileNo} </a>
    </React.Fragment>
  }

  const appendParamsToUrl = (pageNumber, limitTo) => {
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    props.history.replace(`${CRM_UI}/customerProcurement?${qs.stringify({...params, pageNumber:pageNumber, limitFrom: (pageNumber-1)*limitTo , limitTo:limitTo})}`);
}

  const remoteDataFunction = async ({ startIndex, limit ,pageNumber, changeType}) => {
    let params = { ...searchCriteria, limitFrom: startIndex, limitTo: limit };
    appendParamsToUrl(pageNumber, limit);
    const data = await getProcurementDetails({ ...params });
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
    // setDataSet(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataset) ? data.dataset: []);
    // return { dataSet: data.dataset, totalRowsCount: data.totalRecords, status: true } 
}
const callBackMapping = {
  renderCustomerIdColumn,
  renderstatusColumn,
  renderMobileNumberColumn,
  'rowClass': rowClassFunction,
}

 return  <React.Fragment>
    <Wrapper showHeader={false}>
      <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
        <p className="mb-0">Customers Procurement Details</p>
      </HeaderComponent>
      <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height" >
          {!loading ?  validate.isNotEmpty(dataSet)  && validate.isNotEmpty(dataGrid) ?
            <div className={'h-100'}>
                <div className="card h-100">
                    <div  className="card-body p-0 h-100">
                    <CommonDataGrid {...dataGrid} 
                    dataSet={dataSet} 
                    callBackMap={callBackMapping}
                    remoteDataFunction={remoteDataFunction} />
                    </div>
                </div>

            </div> :(parameterExists  && !loading && totalRecords === 0 && <NoDataFound searchButton text={"No Procurement Details found based on the given Search Criteria. Try with other Details!"}/>): null}
            {showRequisitionDetailModal && <RequisitionDetailModal requisitionId={requisitionId} customerId={customerId} customerMobileNo={customerMobileNo}  requisitionStatus= {requisitionStatus} dataGrid ={RequisitionDataGrid} procurementDataSet={dataSet} setProcurementDataSet={setDataSet} dataset={requisitionDataset}  totalRecords={RequisitionTotalRecords}  isLoading={requisitionDataLoading} showRequisitionDetailModal={showRequisitionDetailModal} setShowRequisitionDetailModal={setShowRequisitionDetailModal} setIsLoading={setRequisitionDataLoading} requisitionType={requisitionType} getBadgeColorClassForStatus={getBadgeColorClassForStatus} handleRequisitionDetailModal={handleRequisitionDetailModal} />}
          {!parameterExists && <SeachNow />}
      </BodyComponent>
    </Wrapper>      
  </React.Fragment>
}


export default CustomersProcurementDetails
