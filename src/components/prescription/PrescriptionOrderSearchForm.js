import DynamicForm, { withFormHoc,TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import React, { useContext } from 'react';
import qs from 'qs';
import Validate from '../../helpers/Validate';
import dateFormat from 'dateformat';
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import { getNotNullCriteria } from '../../helpers/HelperMethods';
import { AlertContext } from '../Contexts/UserContext';

const PrescriptionOrderSearchForm = ({ helpers, formData, ...props }) => {

    const validate = Validate();
    const { setStackedToastContent } = useContext(AlertContext);
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const validateSearchCriteria = (prescriptionOrderSearchCriteria) => {
        let fromDateTime = prescriptionOrderSearchCriteria.dateRange[0];
        let toDateTime = prescriptionOrderSearchCriteria.dateRange[1];
        if(validate.isEmpty(fromDateTime) && validate.isEmpty(toDateTime) && validate.isEmpty(prescriptionOrderSearchCriteria.customerId) && validate.isEmpty(prescriptionOrderSearchCriteria.prescriptionOrderId) && validate.isEmpty(prescriptionOrderSearchCriteria.mobileNumber) && validate.isEmpty(prescriptionOrderSearchCriteria.prescriptionStatus) && validate.isEmpty(prescriptionOrderSearchCriteria.pharmaSaleNotAllowed) && validate.isEmpty(prescriptionOrderSearchCriteria.requestFrom)){
            setStackedToastContent({toastMessage:"Please give Atleast one Search Criteria for Finding prescription Orders." , position : TOAST_POSITION.BOTTOM_START})
            return false;
        }
        if (toDateTime < fromDateTime) {
            return false;
        }
        if (((fromDateTime-toDateTime)/(1000*3600*24))>30) {
            return false;
        }
        return true;
    }
    const searchValues=()=>{
        let formValues = {...params,fromDate:dateFormat(params.fromDate,'yyyy-mm-dd'),toDate:dateFormat(params.toDate,'yyyy-mm-dd')};
        if (validate.isNotEmpty(params.fromDate) && validate.isNotEmpty(params.toDate)) {
            let dateRange = [];
            dateRange.push(params.fromDate);
            dateRange.push(params.toDate);
            formValues = {...formValues, "dateRange": dateRange};
        }
        if(validate.isNotEmpty(params.mobileNo)){
            formValues = {...formValues,mobileNumber:params.mobileNo};
        }
        if(validate.isNotEmpty(params.pharmaNotAllowed)){
            formValues = {...formValues,pharmaSaleNotAllowed:[params.pharmaNotAllowed]};
        }
        if(validate.isNotEmpty(params.status)){
            formValues = {...formValues,prescriptionStatus:params.status};
        }
        helpers.updateSpecificValues(formValues, "prescriptionSearch");
    }

    const submitOnClick=()=>{
        prescriptionOrderSearchData();
    }
    const resetToDefaultValues=()=>{
        helpers.resetForm("prescriptionSearch");
        helpers.updateValue("decoded","prescriptionStatus");
        helpers.updateValue("All", "requestFrom");
    }
    

    const prescriptionOrderSearchData = (payload) => {
        payload[0].preventDefault();
        const prescriptionOrderSearchCriteria = helpers.validateAndCollectValuesForSubmit("prescriptionSearch", false, false, false);
        let fromDate = '';
        let toDate = '';
        if(validate.isNotEmpty(prescriptionOrderSearchCriteria.dateRange[0])){
            fromDate = dateFormat(prescriptionOrderSearchCriteria.dateRange[0], 'yyyy-mm-dd 00:00:00');
        }
        if(validate.isNotEmpty(prescriptionOrderSearchCriteria.dateRange[1])){
            toDate = dateFormat(prescriptionOrderSearchCriteria.dateRange[1], 'yyyy-mm-dd 23:59:59');
        }
        let pharmaSaleAllowed = null;
        if (validate.isNotEmpty(prescriptionOrderSearchCriteria.pharmaSaleNotAllowed)) {
            pharmaSaleAllowed = prescriptionOrderSearchCriteria.pharmaSaleNotAllowed[0];
        }
        if (validateSearchCriteria(prescriptionOrderSearchCriteria)) {
            props.handleOnSearchClick?.();
            let finalSearchCriteria = {fromDate:fromDate,toDate:toDate,customerId:prescriptionOrderSearchCriteria.customerId,prescriptionOrderId:prescriptionOrderSearchCriteria.prescriptionOrderId,mobileNo:prescriptionOrderSearchCriteria.mobileNumber,status:prescriptionOrderSearchCriteria.prescriptionStatus,pharmaNotAllowed:pharmaSaleAllowed,requestFrom:prescriptionOrderSearchCriteria.requestFrom,v:Date.now()};
            finalSearchCriteria = getNotNullCriteria(finalSearchCriteria);
            props.history.push(`${CRM_UI}/prescriptionOrderSearch?${finalSearchCriteria}`)
        }
    }
    const observersMap = {
        'reset' : [['click',resetToDefaultValues]],
        'search': [['click', (payload)=>prescriptionOrderSearchData(payload)]],
        'prescriptionSearch': [['load',searchValues],['submit',submitOnClick]]

    }
    return <React.Fragment>
        {<DynamicForm requestUrl={`${API_URL}prescriptionOrderSearchForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />}
    </React.Fragment>
}
export default withFormHoc(PrescriptionOrderSearchForm);