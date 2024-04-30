import React, { useContext } from "react";
import { AlertContext } from '../Contexts/UserContext';
import DynamicForm from '@medplus/react-common-components/DynamicForm';
import { withFormHoc, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import Validate from "../../helpers/Validate";
import dateFormat from 'dateformat';
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import qs from 'qs';


const FollowUp = ({ helpers, formData, ...props }) => {

    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const { setStackedToastContent } = useContext(AlertContext);
    const validate = Validate()
    let filteredData = {}

    const validateSearchCriteria = (followUPSearchCriteria) => {

        if(validate.isNotEmpty(followUPSearchCriteria.dateRange) && followUPSearchCriteria.dateRange.length <= 1){
            helpers.updateErrorMessage("Give a valid Date Range","dateRange")
            return false
        }

        const customerId =validate.isNotEmpty(followUPSearchCriteria.customerId) ? followUPSearchCriteria.customerId : null
        const fromDateTime = validate.isNotEmpty(followUPSearchCriteria.fromDate) ?followUPSearchCriteria.fromDate:null;
        const toDateTime = validate.isNotEmpty(followUPSearchCriteria.toDate)? followUPSearchCriteria.toDate:null;
        const orderId =validate.isNotEmpty(followUPSearchCriteria.orderId) ? followUPSearchCriteria.orderId: null
        const orderType=validate.isNotEmpty(followUPSearchCriteria.orderType)? followUPSearchCriteria.orderType: null
        const reason=validate.isNotEmpty(followUPSearchCriteria.completeReason)? followUPSearchCriteria.completeReason: null
        const subReason=validate.isNotEmpty(followUPSearchCriteria.subReason)? followUPSearchCriteria.subReason: null
        if(validate.isEmpty(followUPSearchCriteria.callAttended)){
            followUPSearchCriteria.callAttended="N"
        }
        if (toDateTime < fromDateTime) {
            helpers.updateErrorMessage("From date should not greater than To date." , "dateRange")
            return false;
        }
        if(validate.isNotEmpty(followUPSearchCriteria.completeReason) && validate.isEmpty(followUPSearchCriteria.subReason)){
            helpers.updateErrorMessage("Select the respective Sub Reason","subReason")
            return false;
        }
        const pattern = new RegExp(/^[0-9\b\+\-\(\)]+$/);
         if((customerId && validate.isNotEmpty(customerId)) || (fromDateTime && validate.isNotEmpty(fromDateTime ) && toDateTime && validate.isNotEmpty(toDateTime)) || (orderId && validate.isNotEmpty(orderId) ) || (reason && validate.isNotEmpty(reason)) || (orderType && validate.isNotEmpty(orderType)) || (subReason && validate.isNotEmpty(subReason))){
             if(followUPSearchCriteria.customerId && !pattern.test(followUPSearchCriteria.customerId )){
                    helpers.updateErrorMessage('Please give valid CustomerId','customerId');
                    return false;
                }
            }

        if (toDateTime - fromDateTime >= 7776000000) {
            return false;
        }
        for (let key in followUPSearchCriteria) {
            if (validate.isNotEmpty(followUPSearchCriteria[key])) {
                if(key !== 'dateRange' && key!= 'completeReason' && key !='subReason') 
                    filteredData[key] = followUPSearchCriteria[key]
            }
        }

        if (Object.keys(filteredData).length === 1) { setStackedToastContent({toastMessage:"Please give Atleast one Search Criteria to get Follow up Data." , position : TOAST_POSITION.BOTTOM_START})
            return false;
        }
        return true;
    }

    const sendRequest = (payload) => {
        payload[0].preventDefault();
        let followUPSearchCriteria = helpers.collectValuesForSubmit("FollowUp", true, true, true);
        if(validate.isNotEmpty(followUPSearchCriteria.completeReason) && validate.isNotEmpty(followUPSearchCriteria.subReason)){
            followUPSearchCriteria.reason = followUPSearchCriteria.completeReason + " : " + followUPSearchCriteria.subReason
        }
        if(validate.isNotEmpty(followUPSearchCriteria.dateRange) && followUPSearchCriteria.dateRange.length > 1) {
            followUPSearchCriteria.fromDate = dateFormat(followUPSearchCriteria.dateRange[0],'yyyy-mm-dd 00:00:00');
            followUPSearchCriteria.toDate = dateFormat(followUPSearchCriteria.dateRange[1],'yyyy-mm-dd 23:59:59');
        }
        if (validateSearchCriteria(followUPSearchCriteria)) {
            props.handleOnSearchClick?.();
            filteredData['type'] = 'F';
            filteredData['v'] = Date.now();
            const qs = '?' + new URLSearchParams(filteredData).toString()
            props.history.push(`${CRM_UI}/followup${qs}`);
        }
    }
    const onReasonSelect = (payload)=> {
        const [event,htmlElement] = payload;
        const [selectedReason] = event.target.value;
        const [selectedOption] = htmlElement.values.filter(value=>value.id == selectedReason);
        const subReasonOptions = prepareSubReasons(selectedOption.attributes['data-reason']);
        if(validate.isNotEmpty(event.target.value)){
            helpers.updateSingleKeyValueIntoField("hidden", false, "subReason");
        }
        helpers.updateSingleKeyValueIntoField('values',subReasonOptions,"subReason");
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
            if(validate.isNotEmpty(params.orderId)){
                formValues = {...formValues , "orderId": params.orderId}
            }
            let completeReason=[]
            let subReason =[]
            if(validate.isNotEmpty(params.reason)){
                completeReason.push(params.reason.split(" : ")[0])
                subReason.push(params.reason.split(" : ")[1])
                helpers.updateSingleKeyValueIntoField("hidden", false, "subReason");
                formValues = {...formValues , completeReason: completeReason , subReason:subReason }
            }
            if(validate.isNotEmpty(params.callAttended)){
                formValues = {...formValues , "callAttended": params.callAttended}
            }
            helpers.updateSpecificValues(formValues, "FollowUp");
        }
    }

    const prepareSubReasons = (subReasonsStr) => {
        const subReasons = subReasonsStr?.split(',')?.map(subReason=> {
            return helpers.createOption(subReason,subReason,subReason);
        })
        return subReasons;
    }

    const onChangeValue = (payload) =>{
        const [event] = payload;
        if(validate.isEmpty(event.target.value)){
            helpers.updateSingleKeyValueIntoField("value", null, "subReason");
            helpers.updateSingleKeyValueIntoField("hidden", true, "subReason");
        }

    }
    const onClickEnter = () =>{
            sendRequest()
    }
    const observersMap = {
        'submit': [['click', payload=>sendRequest(payload)]],
        'completeReason' : [['select',onReasonSelect] , ['change',onChangeValue]],
        'FollowUp': [['load', updateValues] , ['submit', onClickEnter]],


    }

    return (
        <React.Fragment>
            {<DynamicForm requestUrl={`${API_URL}getFollowUpDashboardForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />}
        </React.Fragment>
    )
}

export default withFormHoc(FollowUp);
