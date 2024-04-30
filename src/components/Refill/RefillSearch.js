
import React, { useContext, useState } from 'react';
import DynamicForm, { withFormHoc, CustomAlert, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import Validate from '../../helpers/Validate';
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import dateFormat from 'dateformat';
import qs from 'qs';
import { AlertContext } from '../Contexts/UserContext';

const RefillSearch = ({ helpers, formData, ...props }) => {

    const { setStackedToastContent } = useContext(AlertContext);
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const [show, setShow] = useState();
    const [alertMessage, setAlertMessage] = useState("");
    const validate = Validate()



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

    const validateSearchCriteria = (refillSearchCriteria) => {
        let fromDate = '';
        let toDate = '';
        if(Validate().isEmpty(refillSearchCriteria) || Validate().isEmpty(refillSearchCriteria.dateRange) && Validate().isEmpty(refillSearchCriteria.customerId) && Validate().isEmpty(refillSearchCriteria.refillId)){
            setStackedToastContent({toastMessage:"Please give Atleast one Search Criteria for finding Refill Orders.",position : TOAST_POSITION.BOTTOM_START})
            return false;
        }
        if(Validate().isEmpty(refillSearchCriteria.dateRange) && Validate().isEmpty(refillSearchCriteria.refillId) && refillSearchCriteria.customerId.length < 5){
            showAlert("Customer ID must be atleast 5 characters")
            return false;
        }
        if(Validate().isEmpty(refillSearchCriteria.dateRange) && Validate().isEmpty(refillSearchCriteria.refillId) && refillSearchCriteria.customerId.length > 11){
            showAlert("Customer ID must be atmost 11 characters")
            return false;
        }
        if(Validate().isEmpty(refillSearchCriteria.dateRange) && Validate().isEmpty(refillSearchCriteria.customerId) && refillSearchCriteria.refillId.length < 5){
            showAlert("Refill ID must be atleast 5 characters")
            return false;
        }
        if(Validate().isEmpty(refillSearchCriteria.dateRange) && Validate().isEmpty(refillSearchCriteria.customerId) && refillSearchCriteria.refillId.length > 10){
            showAlert("Refill ID must be atmost 11 characters")
            return false;
        }
        if ((Validate().isEmpty(refillSearchCriteria.dateRange[0]) && Validate().isNotEmpty(refillSearchCriteria.dateRange[1])) || (Validate().isNotEmpty(refillSearchCriteria.dateRange[0]) && Validate().isEmpty(refillSearchCriteria.dateRange[1]))) {
            showAlert("Please give Valid Date Range!");
            return false;
        }
        if (Validate().isNotEmpty(refillSearchCriteria.dateRange[0]) && Validate().isNotEmpty(refillSearchCriteria.dateRange[1])) {
            fromDate = dateFormat(refillSearchCriteria.dateRange[0], 'yyyy-mm-dd 00:00:00');
            toDate = dateFormat(refillSearchCriteria.dateRange[1], 'yyyy-mm-dd 23:59:59');
        }
        if (fromDate && toDate) {
            const difference = new Date(toDate).getTime() - new Date(fromDate).getTime();
            if (difference < 0) {
                showAlert("From Date should be less than or equal to To-Date!");
                return false;
            }
        }
        return true;
    }

    const bindEnter=(payload)=>{
        const [event] = payload;
        if(event.key == 'Enter'){
            getRefillInfo();
        }
      }

    const getRefillInfo = () => {
        const refillSearchCriteria = helpers.validateAndCollectValuesForSubmit("refillRequestForm");
        let filteredData={}
        let fromDate = '';
        let toDate = '';
        if (validateSearchCriteria(refillSearchCriteria)) {
            if(validate.isNotEmpty(refillSearchCriteria.dateRange)){
                fromDate = dateFormat(refillSearchCriteria.dateRange[0], 'yyyy-mm-dd 00:00:00');
                toDate = dateFormat(refillSearchCriteria.dateRange[1], 'yyyy-mm-dd 23:59:59');
            }
        for (let key in refillSearchCriteria) {
            if (refillSearchCriteria[key] && key == "dateRange" && validate.isNotEmpty(refillSearchCriteria[key])) {
            filteredData["fromDate"]=fromDate
            filteredData["toDate"]=toDate
            }
            else if(validate.isNotEmpty(refillSearchCriteria[key])){
                filteredData[key]= refillSearchCriteria[key] 
            }
        }
            filteredData["v"] = Date.now();
            const qs = '?' + new URLSearchParams(filteredData).toString()
            props.handleOnSearchClick?.();
            props.history.push(`${CRM_UI}/refillSearch` + qs);
        }
    }

    const updateValues = () => {
        let formValues = { ...params, fromDate: dateFormat(params.fromDate, 'yyyy-mm-dd'), toDate: dateFormat(params.toDate, 'yyyy-mm-dd') };
        if(validate.isNotEmpty(params)){
            let dateRange = [];
            if (validate.isNotEmpty(params.fromDate)) {
                dateRange.push(params.fromDate);
            }
            if (validate.isNotEmpty(params.toDate)) {
                dateRange.push(params.toDate)
            }
            formValues = {...formValues, "dateRange": dateRange}

            if(validate.isNotEmpty(params.customerId)){
                formValues = {...formValues , "customerId": params.customerId}
            }
            if(validate.isNotEmpty(params.refillId)){
                formValues = {...formValues , "refillId": params.refillId}
            }
            let status = []
            if(validate.isNotEmpty(params.status)){
                status.push(params.status)
                formValues = {...formValues , "status" : status}
            }
            helpers.updateSpecificValues(formValues, "refillRequestForm");
        }
    }

    const observersMap = {
        'search': [['click', getRefillInfo]],
        'refillRequestForm' : [['load', updateValues], ['keydown' , bindEnter]]
    }

    return (<React.Fragment>
        {show && <CustomAlert alertMessage={getAlertContent} isAutohide={true} isTransition={true} delayTime={2000} isShow={show} onClose={() => { setShow(false) }} isDismissibleRequired={true} alertType={'danger'} />}
        <DynamicForm requestUrl={`${API_URL}refillRequestForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} headers={{'X-Requested-With':"XMLHttpRequest"}}/>
    </React.Fragment>
    )
}
export default withFormHoc(RefillSearch);