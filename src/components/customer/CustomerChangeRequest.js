import DynamicForm, { withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React from "react";
import { API_URL, CRM_UI } from "../../services/ServiceConstants";
import Validate from "../../helpers/Validate";
import qs from 'qs';

const CustomerChangeRequest = ({ helpers, formData, ...props }) =>{

    const validate = Validate()
    let filteredData = {}

    const sendRequest = (payload) =>{
        if(validate.isNotEmpty(payload))
            payload[0].preventDefault();
        let customerRequestSearchCriteria = helpers.collectValuesForSubmit("findCustomerRequest");
        const customerId =validate.isNotEmpty(customerRequestSearchCriteria.customerId) ? customerRequestSearchCriteria.customerId : null;
        props.handleOnSearchClick?.();
        filteredData['customerId'] = customerId;
        const qs = '?' + new URLSearchParams(filteredData).toString();
        props.history.push(`${CRM_UI}/customer/customerChangeRequest${qs}`);
    }

    const setValuesToForm = () =>{
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        if(validate.isNotEmpty(params.customerId)){
            helpers.updateValue(params.customerId,'customerId');
        }
    }

    const submitOnEnter=()=>{
        sendRequest();
      }

    const observersMap = {
        'submit': [['click', payload=>sendRequest(payload)]],
        'findCustomerRequest': [['load',setValuesToForm], ['submit',submitOnEnter]]
    }

    return (
        <React.Fragment>
            {<DynamicForm requestUrl={`${API_URL}findCustomerRequestForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />}
        </React.Fragment>
    )
}

export default withFormHoc(CustomerChangeRequest);