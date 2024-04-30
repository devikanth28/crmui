import DynamicForm, { CustomAlert, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import dateFormat from 'dateformat';
import React, { useState } from 'react';
import Validate from '../../helpers/Validate';
import { API_URL } from '../../services/ServiceConstants';

const OrderDashboardForm = (props) => {
    const {helpers,getOrderDashboardData,fromDate,toDate,hubStore,type}=props;
    const [show, setShow] = useState();
    const [alertMessage, setAlertMessage] = useState("");
    const validate=Validate();

    let daysRange="2";
    let dashboardType="mart";
    if(type == "prescription"){
        daysRange="10";
        dashboardType=type;
    }
    const getAlertContent = () => {
        return (
            <React.Fragment>
                {alertMessage}
            </React.Fragment>
        );
    }

    const showAlert=(message)=>{
        setAlertMessage(message);
        setShow(true);
    }
    
    let fdate="";
    let tdate="";
    let hubid="";
    let hubStoreName="";
    const validateSearchCriteria = (orderDashboardSearchCriteria) => {
        if(validate.isNotEmpty(orderDashboardSearchCriteria.dateRange)){
            fdate = validate.isNotEmpty(orderDashboardSearchCriteria.dateRange[0])?dateFormat(orderDashboardSearchCriteria.dateRange[0], "yyyy-mm-dd"):"";
            tdate = validate.isNotEmpty(orderDashboardSearchCriteria.dateRange[1])?dateFormat(orderDashboardSearchCriteria.dateRange[1], "yyyy-mm-dd"):"";
        }
        if(validate.isNotEmpty(orderDashboardSearchCriteria.hubStoreIds)){
            hubStoreName = orderDashboardSearchCriteria.hubStoreIds[0];
            hubid=orderDashboardSearchCriteria.hubStoreIds[0].split("-")[0];
        }
            if ((Validate().isEmpty(fdate) && Validate().isNotEmpty(tdate)) || (Validate().isNotEmpty(fdate) && Validate().isEmpty(tdate))) {
                showAlert("Please give valid Date range");
                return false;
            }
            const difference = new Date(tdate).getTime() - new Date(fdate).getTime();
            const days = difference / (1000 * 60 * 60 * 24);
            if (difference < 0) {
                    showAlert("From date is greater than To date");
                    return false;
                }
            if (days >= daysRange) {
                showAlert("Date range should not be greater than "+daysRange+" days.");
                    return false;
                }
            if (Validate().isEmpty(fdate) && Validate().isEmpty(tdate)  && Validate().isEmpty(orderDashboardSearchCriteria.hubStoreIds)) {
                showAlert("Please give valid Date range or select Hub Store.");
                return false;
            }
            return true;
    }

    const resetDateRangeToDefault = () => {
                    const today = new Date();
                    const formattedToday = dateFormat(today, "yyyy-mm-dd");
                    const fiveDaysAgo = new Date(today);
                    if(type && "prescription" == type){
                        fiveDaysAgo.setDate(today.getDate() - 4);
                    }else{
                        fiveDaysAgo.setDate(today.getDate() - 1);
                    }
                    const formattedFiveDaysAgo = dateFormat(fiveDaysAgo, "yyyy-mm-dd");
                    helpers.updateValue([formattedFiveDaysAgo, formattedToday],'dateRange');
    }
    const orderDashboardSearchData = () => {
        let params={};
             const orderDashboardSearchCriteria = helpers.validateAndCollectValuesForSubmit("orderDashboard", false, false, false);
            if (validateSearchCriteria(orderDashboardSearchCriteria)) {
                if(validate.isEmpty(orderDashboardSearchCriteria.dateRange)){
                    resetDateRangeToDefault();
                }
                params.hubId=hubid;
                params.fromDate=fdate;
                params.toDate=tdate;
                getOrderDashboardData(params,hubStoreName,type);
            }
            else {
                props.setNoDataFound(true)
                let countvalues = Object.assign({}, props.orderCount);
                Object.keys(countvalues).forEach((i)=>{countvalues[i] = 0})
                props.setOrderCount(countvalues)
                
            }
    }
    const updateValues = () =>{
        if(toDate !== undefined && fromDate !== undefined){
            helpers.updateValue([fromDate,toDate],'dateRange');
        }
        if(hubStore !== undefined){
            helpers.updateValue([hubStore],'hubStoreIds');
        }
    }  
    const resetForm = () => {
        helpers.updateValue([],'hubStoreIds');
        resetDateRangeToDefault();
        getOrderDashboardData({},null,type);
    }   
    const observersMap = {
        'submit': [['click', orderDashboardSearchData]],
        'orderDashboard': [['load', updateValues]],
        'reset' : [['click', resetForm]]
    }
    return (
    <React.Fragment>
        {show && <CustomAlert alertMessage={getAlertContent} isAutohide={true} isTransition={true} delayTime={2000} isShow={show} onClose={() => { setShow(false) }} isDismissibleRequired={true} alertType={'danger'} />}
        {<div className='custom-model-filter-container'>
            <DynamicForm requestUrl={`${API_URL}orderDashboardForm?type=${dashboardType}`}  requestMethod={'GET'} helpers={helpers} observers={observersMap}/>
        </div>
        }
    </React.Fragment>
  )
}

export default withFormHoc(OrderDashboardForm); 