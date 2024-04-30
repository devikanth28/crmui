
import DynamicForm, { withFormHoc, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import React, { useContext , useEffect } from "react";
import qs from 'qs';
import Validate from '../../helpers/Validate';
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import { getNotNullCriteria } from '../../helpers/HelperMethods';
import { AlertContext , UserContext } from '../Contexts/UserContext';
import FormHelpers from '../../helpers/FormHelpers';


const CustomerSearchForm = ({ helpers, formData, ...props }) => {

  const validate = Validate();
  const { setStackedToastContent } = useContext(AlertContext);
  const userSessionInfo = useContext(UserContext);
  const params = props?.urlParams ? props.urlParams : qs.parse(props.location.search, { ignoreQueryPrefix: true });

  const checkFields=(formData)=>{
    const {customerId,mobileNumber,emailId} = formData;
    if(validate.isEmpty(customerId) && validate.isEmpty(mobileNumber) && validate.isEmpty(emailId)){
      setStackedToastContent({toastMessage:"Please give Atleast one Search Criteria for Finding Customer Details." , position : TOAST_POSITION.BOTTOM_START})
      return false;
    }
    return true;
  }

  useEffect(() => {
    (userSessionInfo?.vertical && userSessionInfo.vertical == "V")
                    ? props.history.push({
                      pathname: `${CRM_UI}/searchCustomer/search`,
                      state: { urlParams: params }
                    }) : null 
  }, [])

  const setFormDetails = (payload) => {
    payload[0].preventDefault();
    const customerSearchCriteria = helpers.validateAndCollectValuesForSubmit("customerSearchForm");
    if (validate.isNotEmpty(customerSearchCriteria) && checkFields(customerSearchCriteria)) {
      props.handleOnSearchClick?.();
      let finalSearchCriteria = {customerId:customerSearchCriteria.customerId,mobileNo:customerSearchCriteria.mobileNumber,emailId:customerSearchCriteria.emailId,v:Date.now()};
      finalSearchCriteria = getNotNullCriteria(finalSearchCriteria);
      props.history.push(`${CRM_UI}/searchCustomer?${finalSearchCriteria}`);
    }
  }

  const submitOnEnter=()=>{
    setFormDetails();
  }

  const searchValues = () => {
    let formValues = { ...params };
    if (validate.isNotEmpty(formValues)) {
      if (validate.isNotEmpty(params.mobileNo)) {
        formValues = { ...formValues, mobileNumber: params.mobileNo };
      }
      helpers.updateSpecificValues(formValues, "customerSearchForm");
    }
  }

  const observersMap = {
    'search': [['click',payload=>setFormDetails(payload)]],
    'customerSearchForm' : [['load',searchValues],['submit',submitOnEnter]],
    'customerId': [['change', (payload)=>FormHelpers().onInputCustomerId(payload, helpers, "customerId")]]
  }

  return <React.Fragment>
      <DynamicForm requestUrl={`${API_URL}customerSearchForm`} requestMethod={'GET'} helpers={helpers} observers={observersMap}/>
  </React.Fragment>
}

export default withFormHoc(CustomerSearchForm);