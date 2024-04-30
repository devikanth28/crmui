import React, { useContext, useEffect } from 'react'
import Validate from '../../helpers/Validate';
import { AlertContext , UserContext } from '../Contexts/UserContext';
import qs from 'qs';
import dateFormat from 'dateformat';
import DynamicForm, { TOAST_POSITION, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import { getNotNullCriteria } from '../../helpers/HelperMethods';

const CustomersProcurememntSearchForm = ({ helpers, formData, ...props }) => {
   
  const params = props?.urlParams ? props.urlParams : qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const userSessionInfo = useContext(UserContext);
  const { setStackedToastContent } = useContext(AlertContext);

  const validate = Validate()
  let filteredData = {}

  useEffect(()=>{
    const minDate = calculateUnixForGivenDays()
    helpers.updateSingleKeyValueIntoField("minRange", minDate, "dateRange")
    helpers.updateSingleKeyValueIntoField("maxRange", new Date(), "dateRange")
  }, []
  )

  useEffect(() => {
    (userSessionInfo?.vertical && userSessionInfo.vertical == "V")
                    ? props.history.push({
                      pathname: `${CRM_UI}/customerProcurement/search`,
                      state: { urlParams: params }
                    }) : null 
  }, [])

  const calculateUnixForGivenDays = () => {
    var result = new Date();
    result.setDate(result.getDate() + -730);
    result = parseInt((new Date(result).getTime()).toFixed(0));
    return result
  }

  const validateSearchCriteria = (searchCriteria) =>{
    let fromDateTime = searchCriteria.dateRange[0];
    let toDateTime = searchCriteria.dateRange[1];
    if (validate.isEmpty(fromDateTime) && validate.isEmpty(toDateTime) && validate.isEmpty(searchCriteria.customerId) && validate.isEmpty(searchCriteria.inventoryId) && validate.isEmpty(searchCriteria.productId) && validate.isEmpty(searchCriteria.status)) {
      setStackedToastContent({ toastMessage: "Please give Atleast one Search Criteria for Finding Customer Procurement Orders.", position: TOAST_POSITION.BOTTOM_START })
      return false;
    }
    if (toDateTime < fromDateTime) {
      helpers.updateErrorMessage("To date cannot be less than from date. Please give a valid date range!","dateRange")
      return false;
    }
    if (toDateTime - fromDateTime >= 2592000000) {
      helpers.updateErrorMessage("You cannot select a date Range more than 30 days.","dateRange")
      return false;
    }
    const pattern = new RegExp(/^[0-9\b\+\-\(\)]+$/);
    if (validate.isNotEmpty(searchCriteria.customerId) && isNaN(searchCriteria.customerId) && !pattern.test(searchCriteria.customerId)) {
      helpers.updateErrorMessage("Please give a valid customer ID.","customerId")
        return false;
     }
     if(validate.isNotEmpty(searchCriteria.productId) && searchCriteria.productId.trim().length != 8){
      helpers.updateErrorMessage("Please give a valid product ID.","productId")
      return false;
     }
     return true

  }

  const sendRequest = (payload) =>{
    payload[0].preventDefault();
    let procurementSearchCriteria = helpers.collectValuesForSubmit("procurementSearchForm", true, true, true, true);
    if(validate.isNotEmpty(procurementSearchCriteria.dateRange) && procurementSearchCriteria.dateRange.length>1){
      procurementSearchCriteria.fromDate = dateFormat(procurementSearchCriteria.dateRange[0], 'yyyy-mm-dd 00:00:00');
      procurementSearchCriteria.toDate = dateFormat(procurementSearchCriteria.dateRange[1] ,'yyyy-mm-dd 23:59:59' );
    }

    if(validateSearchCriteria(procurementSearchCriteria)){
      props.handleOnSearchClick?.();
      let finalSearchCriteria = {"fromDate": procurementSearchCriteria.fromDate, "toDate":procurementSearchCriteria.toDate, "inventoryId":procurementSearchCriteria.inventoryId[0], "customerId":procurementSearchCriteria.customerId, "productId":procurementSearchCriteria.productId, "status":procurementSearchCriteria.status[0] , v:Date.now()};
      finalSearchCriteria = getNotNullCriteria(finalSearchCriteria);
      props.history.push(`${CRM_UI}/customerProcurement?${finalSearchCriteria}`)
    }
     
  }
  const updateValues = () => {
    let formValues = { ...params, fromDate: dateFormat(params.fromDate, 'yyyy-mm-dd'), toDate: dateFormat(params.toDate, 'yyyy-mm-dd') };
    if (validate.isNotEmpty(params)) {
      let dateRange = [];
      if (validate.isNotEmpty(params.fromDate)) {
        dateRange.push(params.fromDate);
      }
      if (validate.isNotEmpty(params.toDate)) {
        dateRange.push(params.toDate)
      }
      formValues = { ...formValues, "dateRange": dateRange }
      if (validate.isNotEmpty(params.customerId)) {
        formValues = { ...formValues, "customerId": params.customerId }
      }
      if (validate.isNotEmpty(params.productId)) {
        formValues = { ...formValues, "productId": params.productId }
      }
      let inventoryIds = []
      if(validate.isNotEmpty(params.inventoryId)){
        inventoryIds.push(params.inventoryId)
        formValues = {...formValues , "inventoryId" : inventoryIds  }
      }
      let status = []
      if(validate.isNotEmpty(params.status)){
        status.push(params.status)
        formValues = {...formValues , "status" : status}
      }

      
      helpers.updateSpecificValues(formValues, "procurementSearchForm");
    }
  }
const onClickEnter = () =>{
  sendRequest()
}
  
  const observersMap = {
    'search' : [['click' , payload => sendRequest(payload)]],
    'procurementSearchForm' : [['load', updateValues] , ['submit' , onClickEnter]]
  }

  return (
    <React.Fragment>
      {<DynamicForm requestUrl={`${API_URL}getCustomerProcurementSearchForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />}
    </React.Fragment>
  )
}

export default withFormHoc(CustomersProcurememntSearchForm);

