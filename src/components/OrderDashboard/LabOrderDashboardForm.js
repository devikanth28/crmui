import DynamicForm, { CustomAlert, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import dateFormat from 'dateformat';
import React, { useState } from 'react';
import Validate from '../../helpers/Validate';
import { API_URL } from '../../services/ServiceConstants';

const LabOrderDashboardForm = (props) => {
    const {helpers,getOrderDashboardData,fromDate,toDate, hubStoreName, collectionCenterName}=props;
    const [show, setShow] = useState();
    const [alertMessage, setAlertMessage] = useState("");
    const validate=Validate();
    let daysRange="10";
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
    let collectionCenterId="";
    let hubStore="";
    let collectionCenter="";
    const validateSearchCriteria = (orderDashboardSearchCriteria) => {
        if(validate.isNotEmpty(orderDashboardSearchCriteria.dateRange)){
            fdate = validate.isNotEmpty(orderDashboardSearchCriteria.dateRange[0])?dateFormat(orderDashboardSearchCriteria.dateRange[0], "yyyy-mm-dd"):"";
            tdate = validate.isNotEmpty(orderDashboardSearchCriteria.dateRange[1])?dateFormat(orderDashboardSearchCriteria.dateRange[1], "yyyy-mm-dd"):"";
        }
        if(validate.isNotEmpty(orderDashboardSearchCriteria.hubStoreIds)){
            hubStore=orderDashboardSearchCriteria.hubStoreIds[0];
            hubid=orderDashboardSearchCriteria.hubStoreIds[0].split("-")[0];
        }
        if(validate.isNotEmpty(orderDashboardSearchCriteria.collectionCenterIds)){
            collectionCenter=orderDashboardSearchCriteria.collectionCenterIds[0];
            collectionCenterId=orderDashboardSearchCriteria.collectionCenterIds[0].split("-")[0];
        }
        if ((validate.isEmpty(fdate) && validate.isNotEmpty(tdate)) || (validate.isNotEmpty(fdate) && validate.isEmpty(tdate))) {
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
            if ((validate.isEmpty(fdate) || validate.isEmpty(tdate) ) && validate.isEmpty(orderDashboardSearchCriteria.hubStoreIds) && validate.isEmpty(orderDashboardSearchCriteria.collectionCenterIds)) {
                showAlert("Please give valid Date range or select Lab Stores");
                return false;
            }
            return true;
    }
    const resetDateRangeElement = () => {
            const today = new Date();
            const formattedToday = dateFormat(today, "yyyy-mm-dd");
            const tenDaysAgo = new Date(today);
            tenDaysAgo.setDate(today.getDate() - 9);
            const formattedTenDaysAgo = dateFormat(tenDaysAgo, "yyyy-mm-dd");
            helpers.updateValue([formattedTenDaysAgo, formattedToday],'dateRange');
    }

    const orderDashboardSearchData = () => {
        let params={};
            const orderDashboardSearchCriteria = helpers.validateAndCollectValuesForSubmit("labOrderDashboard", false, false, false);
            if (validateSearchCriteria(orderDashboardSearchCriteria)) {
                if(validate.isEmpty(orderDashboardSearchCriteria.dateRange)){
                    resetDateRangeElement();
                }    
                params.hubId=hubid;
                params.fromDate=fdate;
                params.toDate=tdate;
                params.collectionCenterId=collectionCenterId;
                getOrderDashboardData(params,hubStore,collectionCenter);
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
        if(validate.isNotEmpty(hubStoreName)){
            helpers.updateValue([hubStoreName],'hubStoreIds');
        }
        if(validate.isNotEmpty(collectionCenterName)){
            helpers.updateValue([collectionCenterName],'collectionCenterIds');
        }
    }
    const resetForm = () => {
        helpers.updateValue([],'hubStoreIds');
        helpers.updateValue([], 'collectionCenterIds');
        resetDateRangeElement();
        getOrderDashboardData({},null,null);
    }
    const observersMap = {
        'submit': [['click', orderDashboardSearchData]],
        'labOrderDashboard': [['load', updateValues]],
        'reset' : [['click', resetForm]]
    }
    return (
    <React.Fragment>
        {show && <CustomAlert alertMessage={getAlertContent} isAutohide={true} isTransition={true} delayTime={2000} isShow={show} onClose={() => { setShow(false) }} isDismissibleRequired={true} alertType={'danger'} />}
        {<div className='custom-model-filter-container'>
            <DynamicForm requestUrl={`${API_URL}labOrderDashboardForm`}  requestMethod={'GET'} helpers={helpers} observers={observersMap}/>
        </div>
            
        }
    </React.Fragment>
  )
}

export default withFormHoc(LabOrderDashboardForm); 