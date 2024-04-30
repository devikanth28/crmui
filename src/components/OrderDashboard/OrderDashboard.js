
import qs from 'qs';
import React, { useEffect, useRef, useState, useContext } from 'react';
import Validate from "../../helpers/Validate";
import OrderService from '../../services/Order/OrderService';
import { BodyComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure';
import { MART_ORDER_DASHBOARD_ORDER_SEQUENCE } from './Constants';
import OrderCountBadges from './OrderCountBadges';
import OrderDashboardBarGraph from './OrderDashboardBarGraph';
import OrderDashboardForm from './OrderDashboardForm';
import { AlertContext } from "../Contexts/UserContext";
import dateFormat from 'dateformat';
import NoDataFound from '../Common/NoDataFound';

function OrderDashboard(props) {
    const orderService=OrderService();
    const [orderCount, setOrderCount] = useState({});
    const [loading, setLoading] = useState(true);
    const headerRef = useRef(null);
    const validate=Validate();
    const [fdate,setFdate]= useState("");
    const [tdate,setTdate]= useState("");
    const [hubId,setHubId] = useState("");
    const [hubStoreName,setHubStoreName] = useState(undefined);
    const [noDataFound, setNoDataFound] = useState(false);
    const [dateDiff,setDateDiff] = useState(0);
    const { setStackedToastContent } = useContext(AlertContext);
    
    useEffect(() => {
            let params={};
            let type = "mart";
            if(props.type !== undefined && props.type == "prescription")
                type="prescription";
            getOrderDashboardData(params,null,type);
            
        } ,[]);

    const getOrderDashboardData = async(params,hubStoreName,type) => {
        setLoading(true);
        if(validate.isNotEmpty(hubStoreName)){
            setHubStoreName(hubStoreName);
        }
        else{
            setHubStoreName("");
        }
        const data = await getData(params,type);
        if (validate.isNotEmpty(data)) {
          setOrderCount(data.ordersCount);
          setFdate(data.fromDate);
          setTdate(data.toDate);
          setHubId(data.hubId);
          setLoading(false);
          if(validate.isNotEmpty(data.fromDate) && validate.isNotEmpty(data.toDate)){
            let difference =new Date(data.toDate).getTime() - new Date(data.fromDate).getTime();
            setDateDiff(difference/ (1000 * 60 * 60 * 24) + 1);
          }
          setNoDataFound(false);
          if(validate.isEmpty(data.ordersCount) || Object.values(data.ordersCount).every((value) => value === 0)){
              setNoDataFound(true);
          }
        }
        
       
    }
    
    const handleOrderStatusClick = (statusKey) => {
        let finalorderSearchCriteria = {};
        if(statusKey == "PI"){
            finalorderSearchCriteria.ePrescription = "I";
            finalorderSearchCriteria.status = "I";
        }
        else{
            finalorderSearchCriteria.status = statusKey;
        }
        if(validate.isNotEmpty(hubId)){
            finalorderSearchCriteria.hubId=hubId
        }
        if(validate.isNotEmpty(fdate)){
            finalorderSearchCriteria.fromDate=dateFormat(fdate, "yyyy-mm-dd") + " 00:00:00";
        }
        if(validate.isNotEmpty(tdate)){
            finalorderSearchCriteria.toDate=dateFormat(tdate, "yyyy-mm-dd") + " 23:59:59";
        }
        if(props.type !== undefined && props.type == "prescription"){
            props.history.push(`/customer-relations/ui/prescriptionOrderSearch?${qs.stringify(finalorderSearchCriteria)}`);
        }else{
        props.history.push(`/customer-relations/ui/orderSearch?${qs.stringify(finalorderSearchCriteria)}`);
        }

    }

    const getData =async (params,type) => {
        const data =await orderService.getMartOrdersCount(params,type);
      if (data && data.statusCode === "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
            return data.dataObject;
      } else if (Validate().isNotEmpty(data.message)) {
        setStackedToastContent({toastMessage:data.message})
    }
    
  }
  return (
      <React.Fragment>
          <Wrapper showHeader={false}>
              <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                  { props.type !== undefined && props.type == "prescription" ? <p className="mb-0">Prescription Order Dashboard</p> : <p className="mb-0">Mart Order Dashboard</p> }
              </HeaderComponent>
              <BodyComponent loading={loading} allRefs={{ headerRef }} className="overflow-hidden body-height">
                {!loading && <div className={'h-100 w-100'}>
                  <div className='row g-3 h-100'>
                      <div className='col-12 col-xl-4 col-xxl-4 h-100'>
                          {validate.isNotEmpty(orderCount) && dateDiff>0 && <OrderCountBadges orderCount={orderCount} orderSequence={props.orderSequence !== undefined ? props.orderSequence : MART_ORDER_DASHBOARD_ORDER_SEQUENCE.mart} dateDifferences={dateDiff} handleOrderStatusClick={handleOrderStatusClick} />}
                      </div>
                      <div className='col-8 h-100 d-none d-lg-none d-xl-flex d-xxl-flex'>
                        {((validate.isNotEmpty(fdate) && validate.isNotEmpty(tdate)) || validate.isNotEmpty(orderCount)) && <div className='card h-100 w-100'>
                              <div className='h-100 overflow-y-auto p-12 scroll-on-hover'>
                                  {(validate.isNotEmpty(fdate) && validate.isNotEmpty(tdate)) && <OrderDashboardForm orderCount ={orderCount} setOrderCount={(countvalues)=>{setOrderCount({countvalues})}} getOrderDashboardData={getOrderDashboardData} fromDate={fdate} toDate={tdate} hubStore={hubStoreName} type={validate.isNotEmpty(props.type)?props.type:"mart"} noDataFoundFlag = {noDataFound} setNoDataFound={setNoDataFound}/> }
                                  {noDataFound == false ? <OrderDashboardBarGraph orderCount={orderCount} type={props.type !== undefined? props.type : "mart"}/>
                                  :
                                    <><div class='card mt-3' style={{height:'calc(100% - 106px'}}><NoDataFound text="No records found based on the given criteria. Try with other details!"/></div></>
                                }
                              </div>
                          </div>}
                      </div>
                  </div>
                </div>}
              </BodyComponent>
          </Wrapper>
    </React.Fragment>
  )
}

export default OrderDashboard;