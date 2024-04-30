import DynamicForm, { CustomAlert, withFormHoc, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import dateFormat from 'dateformat';
import React, { useEffect, useState, useContext } from 'react';
import Validate from '../../../helpers/Validate';
import { API_URL, CRM_UI } from '../../../services/ServiceConstants';
import { getNotNullCriteria } from '../../../helpers/HelperMethods';
import qs from 'qs';
import { UserContext } from '../../Contexts/UserContext';


const ApproveProposedOrdersSearchForm = (props) => {
    const {helpers,type}=props;
    const params = props?.urlParams ? props.urlParams :  qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const [show, setShow] = useState();
    const [alertMessage, setAlertMessage] = useState("");
    const validate=Validate();

    const userSessionInfo = useContext(UserContext);

    useEffect(() => {
        (userSessionInfo?.vertical && userSessionInfo.vertical == "V")
                        ? props.history.push({
                          pathname: `${CRM_UI}/proposedOrdersDashboard/search`,
                          state: { urlParams: params }
                        }) : null 
      }, [])
    
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
    const validateSearchCriteria = (orderSearchCriteria) => {
        if(validate.isNotEmpty(orderSearchCriteria.dateRange)){
            fdate = validate.isNotEmpty(orderSearchCriteria.dateRange[0])?dateFormat(orderSearchCriteria.dateRange[0], "yyyy-mm-dd 00:00:00"):"";
            tdate = validate.isNotEmpty(orderSearchCriteria.dateRange[1])?dateFormat(orderSearchCriteria.dateRange[1], "yyyy-mm-dd 23:59:59"):"";
        }
         if ((validate.isEmpty(fdate) && validate.isEmpty(tdate)) || (Validate().isEmpty(fdate) && Validate().isNotEmpty(tdate)) || (Validate().isNotEmpty(fdate) && Validate().isEmpty(tdate))) {
                showAlert("Please give valid Date range");
                return false;
            }
        const difference = new Date(tdate).getTime() - new Date(fdate).getTime();
        const days = difference / (1000 * 60 * 60 * 24);
        if (difference < 0) {
                showAlert("From date is greater than To date");
                return false;
        }
        if (days >= 90) {
                showAlert("Date range should not be greater than 90 days.");
                return false;
        }
        return true;
    }
    const proposedOrdersSearchData = (payload) => {
        payload[0].preventDefault();
        let obj={};
        const orderSearchCriteria = helpers.validateAndCollectValuesForSubmit("proposedOrdersSearchForm");
            if (validateSearchCriteria(orderSearchCriteria)) {
                props.handleOnSearchClick?.();
                obj.fromDate=fdate;
                obj.toDate=tdate;
                obj.v=Date.now();
                let finalSearchCriteria = getNotNullCriteria(obj);
                props.history.push(`${CRM_UI}/proposedOrdersDashboard?${finalSearchCriteria}`)
            }
    } 
    
    const resetFormData = () => {
        helpers.resetForm("proposedOrdersSearchForm");
    }  
    
   const updateValues = () => {
    if(validate.isEmpty(params)){
        let toDate = new Date().toISOString().slice(0, 10);
        let fromDate = new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0,10);
        helpers.updateValue([fromDate,toDate],'dateRange');
      }
    let formValues = { ...params, fromDate: dateFormat(params.fromDate, 'yyyy-mm-dd'), toDate: dateFormat(params.toDate, 'yyyy-mm-dd') };
    if(Validate().isNotEmpty(props.location.search)){
        formValues = {...formValues, "dateRange": []};
    }
    if (Validate().isNotEmpty(params.fromDate) && Validate().isNotEmpty(params.toDate)) {
        let dateRange = [];
        dateRange.push(params.fromDate);
        dateRange.push(params.toDate);
        formValues = {...formValues, "dateRange": dateRange};
    }
    helpers.updateSpecificValues(formValues, "martOrderSearchForm");
   }
    const observersMap = {
        'submit': [['click', (payload)=>proposedOrdersSearchData(payload)]],
        'reset' : [['click', resetFormData]],
        'proposedOrdersSearchForm' : [['load', updateValues]]
        }
    return (
    <React.Fragment>
                {show && <CustomAlert alertMessage={getAlertContent} isAutohide={true} isTransition={true} delayTime={2000} isShow={show} onClose={() => { setShow(false) }} isDismissibleRequired={true} alertType={'danger'} />}
                {<div className='custom-model-filter-container'>
                <DynamicForm requestUrl={`${API_URL}proposedOrdersSearchForm`}  requestMethod={'GET'} helpers={helpers} observers={observersMap}/>
                </div>}
    </React.Fragment>
  )
}

export default withFormHoc(ApproveProposedOrdersSearchForm); 