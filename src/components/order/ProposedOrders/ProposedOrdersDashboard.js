import CommonDataGrid, { CallIcon, RecordIcon, Shop } from '@medplus/react-common-components/DataGrid';
import React,{useEffect, useState, useContext ,useRef} from "react";
import qs from 'qs';
import { makeOutBoundCall } from '../../../helpers/CommonRedirectionPages';
import Validate from "../../../helpers/Validate";
import OrderService from '../../../services/Order/OrderService';
import HandleGridForProposalOrder from './HandleGridForProposalOrder';
import { Wrapper ,HeaderComponent,BodyComponent} from '../../Common/CommonStructure';
import { AlertContext} from '../../Contexts/UserContext';
import { UncontrolledTooltip } from 'reactstrap';
import NoDataFound from '../../Common/NoDataFound';
import { gotoMartCustomerPage } from "../../../helpers/CommonRedirectionPages";
import SeachNow from "../../Common/SearchNow";
import useRowClassFunction from '../../../hooks/useRowClassFunction';

const ProposedOrdersDashboard = (props) => {

  const defaultCriteria = {
    startIndex: 0,
    limit: 10
}
  const validate = Validate();
  const [searchCriteria, setSearchCriteria] = useState({});
  const [openOrderDetailModal, setOpenOrderDetailModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(undefined);
  const [displayOrderId,setDisplayOrderId] = useState(undefined);
  const [proposedOrderObject, setproposedOrderObject]= useState({});
  const [dataSet,setDataSet] = useState([]);
  const [dataGrid, setGridData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(undefined);
  const [getData,setGetData] = useState(false);
  const headerRef = useRef(null);
  const [loading, isLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(null);  
  const [noDataFound, setNoDataFound ] = useState(false);
  const { setStackedToastContent } = useContext(AlertContext);
  const [couponCode, setCouponCode] = useState('');
  const [orderType, setOrderType] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const [rowClassFunction] = useRowClassFunction({uniqueId:'orderId',selectedOrderId});

  useEffect(() => {
    if(validate.isNotEmpty(props.location.search)) {
      isLoading(true);
      let limitTo = params.limit ? params.limit : defaultCriteria.limit;
      setOpenOrderDetailModal(false);
      getInitialData({ ...params,  startIndex: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limit: limitTo  });
    }
  }, [props.location.search]);

  useEffect( () => {
    if(getData == true){
        getProposedOrders(params);
    }
  },[getData])

  const getUpdatedData = () => {
    setGetData(true);
  }

  const getInitialData = async (searchCriteria) => {
    getProposedOrders(searchCriteria);

  }

  const getProposedOrders= async (orderSearchCriteria) => {
    return await OrderService().getApprovedProposedOrders(orderSearchCriteria).then(data => {
        setOpenOrderDetailModal(false);
      if (data.message === "SUCCESS" && data.statusCode === "SUCCESS" && Validate().isNotEmpty(data.dataObject)) {
        setDataSet(data.dataObject.dataSet);
        setGridData(data.dataObject.dataGrid);
        setTotalRecords(data.dataObject.totalRecords);
        setGetData(false);
      }
      setNoDataFound(false); 
      if(data && data.dataObject && validate.isEmpty(data.dataObject.dataSet)){
        setNoDataFound(true);
      }
      isLoading(false)
    }).catch(err => {
      console.log(err);
      setGetData(false);
      isLoading(false);
    });

  }
  
  function CustomerIdCustomComponent(props) {
        return <React.Fragment>
            <a className="btn btn-sm btn-link w-100" href="javascript:void(0)" rel="noopener" aria-label={props.row.customerId} role="link" title="View customer details" onClick={() => gotoMartCustomerPage({ customerId: props.row.customerId, orderId: props.row.orderId, locality: props.row.latLong, beautyCustomerId: props.row.beautyCustomerId, mobile: props.row.mobileNo, hubStoreId: props.row.hubStoreId, pageToRedirect: 'order-history' },handleFailure)}>{props.row.customerId}</a>
        </React.Fragment>
  }
  
  function ActionCustomComponent(props) {
    const { row } = props;
  
    return <React.Fragment>
      <CallIcon handleOnClick={() => { makeOutBoundCall(row.callActionUrl)}} tooltip={"Call to Customer"} />
      <RecordIcon handleOnClick={() => { gotoMartCustomerPage({ pageToRedirect: "Communication", customerId: row.customerId, orderId: row.orderId, locality: row.latLong, beautyCustomerId: row.beautyCustomerId, mobile: row.mobileNo }, handleFailure) }} />
      <Shop handleOnClick={() => { gotoMartCustomerPage({ customerId: row.customerId, orderId: row.orderId, locality: row.latLong, beautyCustomerId: row.beautyCustomerId, mobile: row.mobileNo, hubStoreId: row.hubStoreId, pageToRedirect: 'order-history' },handleFailure)}} />
    </React.Fragment>
  }

  const handleFailure = () => {
    setStackedToastContent({ toastMessage: "Customer is Already Opened" })
  }

  const handleOrderDetailsModal = (value) => {
    setOpenOrderDetailModal(value);
    if(!value) {
      setTimeout(() => {
          setSelectedOrderId(undefined);
      },2000)
  }
  }

  const handleOnProposedOrderClick = (row) => {
    let obj={
      'mobileNo' : row.mobileNo,
      'prescriptionId' : row.displayOrderId,
      'customerId' : row.customerId,
      'customerName' : row.customerName,
      'orderType' : 'MART',
      'orderId': row.orderId
    }
    setSelectedOrderId(row.orderId);
    setDisplayOrderId(row.displayOrderId);
    setCouponCode(row.couponCode);
    setOrderType(row.orderType);
    setOrderStatus(row.status);
    setproposedOrderObject(obj);
    setOpenOrderDetailModal(true);
  }

  async function copyToClip(text) {
    await navigator.clipboard.writeText(text);
    setCopySuccess(text);
  }
  
  const renderDisplayOrderIdColumn = (props) => {
    let textColorClass = "btn btn-sm btn-link w-100";
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
      <a className={textColorClass}  id={props.row.displayOrderId} href="javascript:void(0)" rel="noopener" aria-label={props.row.displayOrderId} role="link" title="View order details" onClick={() => {handleOnProposedOrderClick(props.row)}}>{props.row.displayOrderId}</a>
       
     </div>
  </React.Fragment>

  }

  const callBackMapping = {
    "Customer Id": CustomerIdCustomComponent,
    "renderDisplayOrderIdColumn": renderDisplayOrderIdColumn,
    "renderActionColumn": ActionCustomComponent,
    "rowClass": rowClassFunction
  }

  const appendParamsToUrl = (pageNumber, limitTo) => {
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    props.history.replace(`${CRM_UI}/proposedOrdersDashboard?${qs.stringify({ ...params, pageNumber: pageNumber, limitTo: limitTo })}`);
}

  const remoteDataFunction = async ({ startIndex, limit, filters, pageNumber }) => {
    let temObj = { ...searchCriteria, startIndex: startIndex, limit: limit };
    
    await getProposedOrders(temObj);
    appendParamsToUrl(pageNumber, limit);
    if (validate.isNotEmpty(dataSet)) {
        return { dataSet: dataSet, totalRowsCount: totalRecords, status: true }
    } else {
        return { dataSet: [], totalRowsCount: 0, status: true }
    }
}


  return <React.Fragment>

    <Wrapper showHeader={false}>
      <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
        <p className="mb-0">Approve Proposed Edits</p>
      </HeaderComponent>
      <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height" >
           {noDataFound == true && <NoDataFound text="No records found based on the given criteria. Try with other details!"/>} 
          {!loading &&  validate.isNotEmpty(dataSet)  && validate.isNotEmpty(dataGrid) && 
            <div className={'h-100'}>
                <div className="card h-100">
                    <div  className="card-body p-0 h-100">
                    <CommonDataGrid {...dataGrid} dataSet={dataSet} callBackMap={callBackMapping} remoteDataFunction={remoteDataFunction}/>
                    </div>
                </div>

            </div>}
          {openOrderDetailModal && <HandleGridForProposalOrder proposedOrderObject={proposedOrderObject} orderId={proposedOrderObject.orderId} displayOrderId={displayOrderId} getUpdatedData = {getUpdatedData} setOpenOrderDetailModal={handleOrderDetailsModal} couponCode={couponCode} orderType={orderType} status={orderStatus}/>}
          {validate.isEmpty(params) && <SeachNow />}
      </BodyComponent>
    </Wrapper>      
  </React.Fragment>
}

export default ProposedOrdersDashboard;

