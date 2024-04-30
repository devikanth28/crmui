import React, { useContext , useEffect, useRef, useState} from 'react';
import DynamicForm, { withFormHoc ,TOAST_POSITION} from '@medplus/react-common-components/DynamicForm';
import Validate from "../../helpers/Validate";
import dateFormat from 'dateformat';
import { AlertContext, UserContext } from '../Contexts/UserContext';
import qs from 'qs';
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import { getSavedWorkspaceForLabOrder } from '../../helpers/LabOrderHelper';
import FormHelpers from '../../helpers/FormHelpers';
import CustomDataList from '@medplus/react-common-components/CustomDataList';
import { isResponseSuccess } from '../../helpers/CommonHelper';

const LabOrderSearchForm = ({ helpers, formData, ...props }) => {

  const { setStackedToastContent } = useContext(AlertContext);
  const userSessionInfo = useContext(UserContext);
  const validate = Validate()
  const [departmentData, setDepartmentData] = useState(null);
  const [labFormData, setLabFormData] = useState(null);
  const [selectedDepartments,setSelectedDepartments] = useState([]);
  const [selectedForms,setSelectedForms] = useState([]);
  const params = props?.urlParams ? props.urlParams : qs.parse(props.location.search, { ignoreQueryPrefix: true });
  let filteredData = {}

  useEffect(() => {
    (userSessionInfo?.vertical && userSessionInfo.vertical == "V")
                    ? props.history.push({
                      pathname: `${CRM_UI}/labOrder/searchResults/search`,
                      state: { urlParams: params }
                    }) : null 
  }, [])

  const validateSearchCriteria = (labOrderSearchCriteria) => {
    let fromDateTime = new Date(labOrderSearchCriteria.fromDate).getTime();
    let toDateTime = new Date(labOrderSearchCriteria.toDate).getTime();
    if (toDateTime < fromDateTime) {
      helpers.updateErrorMessage("Please give From Date less than or equals to ToDate.","dateRange");
      return false;
    }
    if((new Date(labOrderSearchCriteria.toDate) - new Date(labOrderSearchCriteria.fromDate))/(1000 * 3600 * 24) > 30){
      setStackedToastContent({toastMessage:"The date Range should be of 30 days"});
      return false;
    }
    const pattern = new RegExp(/^[0-9\b\+\-\(\)]+$/);
    if(validate.isNotEmpty(labOrderSearchCriteria.pscRegistrationId) && pattern.test(labOrderSearchCriteria.pscRegistrationId)===false){
      helpers.updateErrorMessage("Only Numbers allowed for RegistrationId","pscRegistrationId");
      return false;
    
    }
    if(validate.isNotEmpty(labOrderSearchCriteria.pscRegistrationId)){
      if(validate.isEmpty(labOrderSearchCriteria.customerId) && validate.isEmpty(labOrderSearchCriteria.collectionCenterId)){
        helpers.updateErrorMessage("CustomerId (or) Collection Center is mandotory when PSC RegId is given","pscRegistrationId")
        return false;
      }
    }
    if(validate.isNotEmpty(labOrderSearchCriteria.couponCode)){
      if(validate.isEmpty(labOrderSearchCriteria.customerId) && validate.isEmpty(labOrderSearchCriteria.mobileNo)){
        helpers.updateErrorMessage("CustomerId (or) Mobile Numner is required if coupon code is given.","couponCode");
        return false;
      }
    }
    if (toDateTime - fromDateTime >= 7776000000) {
      return false;
    }

    for (let key in labOrderSearchCriteria) {
      if (validate.isNotEmpty(labOrderSearchCriteria[key])) {
          if(key !== 'dateRange' && key!= 'completeReason' && key !='subReason') 
              filteredData[key] = labOrderSearchCriteria[key]
      }
    }
    if(validate.isNotEmpty(selectedDepartments)){
      filteredData['departmentIds'] = selectedDepartments.map(department => Object.keys(department)[0]);
    }
    if(validate.isNotEmpty(selectedForms)){
      filteredData['formIds'] = selectedForms.map(form => Object.keys(form)[0]);
    }
  if (Object.keys(filteredData).length === 0) {
    setStackedToastContent({toastMessage:"Please give Atleast one Search Criteria for Finding Lab Orders." , position : TOAST_POSITION.BOTTOM_START})
    return false;
  }
  filteredData["v"] = Date.now();
    return true;
  }

  const LabOrderSearchForm = (payload) => {
    payload[0].preventDefault();
    let labOrderSearchCriteria = helpers.validateAndCollectValuesForSubmit("labOrderSearch", true, true, true);
    if(validate.isNotEmpty(labOrderSearchCriteria.dateRange) && labOrderSearchCriteria.dateRange.length > 1) {
      labOrderSearchCriteria.fromDate = dateFormat(labOrderSearchCriteria.dateRange[0],'yyyy-mm-dd 00:00:00');
      labOrderSearchCriteria.toDate = dateFormat(labOrderSearchCriteria.dateRange[1],'yyyy-mm-dd 23:59:59');
    }
    if (validateSearchCriteria(labOrderSearchCriteria)) {
      props.handleOnSearchClick?.();
      const qs = '?' + new URLSearchParams(filteredData).toString()
      props.history.push(`${CRM_UI}/labOrder/searchResults${qs}`);
    }
  }
const updateValues = () => {
  getSavedWorkspaceForLabOrder(params,helpers);
}

const checkForPaymentStatusCriteria = (payload) => {
  if(payload[0].target.value==="O"){
      helpers.showElement("gatewayStatus")
  }else{
      helpers.hideElement("gatewayStatus")
  }
}

const onDepartmentChange = (selected) => {
  setSelectedDepartments(selected.map((department) => {return {[department.key]:department.value}}));
}
  const onFormChange = (selected) => {
    setSelectedForms(selected.map((form) => {return {[form.key]:form.value}}))
  }
const DataListDept=()=>{
  return  ( 
    <React.Fragment>
      { validate.isNotEmpty(departmentData) && <CustomDataList portalId={"body"} id="departmentIds" value={selectedDepartments} className="col-12" controlId='InputGroup department' label="Department" handleChange={onDepartmentChange} data={departmentData} />}
     { validate.isNotEmpty(labFormData) &&<CustomDataList portalId={"body"} id="formIds" className="col-12" value={selectedForms} controlId='InputGroup form' label="Form" handleChange={onFormChange} data={labFormData} />  }
    </React.Fragment>)
}
const customHtmlMap = {
  'group9' : [['INSERT_BEFORE',DataListDept]],
}
  const handleLabOrderSearchResponse = (response) => {
    if (validate.isNotEmpty(response.data) && validate.isNotEmpty(response.data.responseData)) {
      setLabFormData(prepareDataInDataListFormat(response.data.responseData.labFormData,"FORM"));
      setDepartmentData(prepareDataInDataListFormat(response.data.responseData.departmentData,"DEPARTMENT"));
    }
  }

  const prepareDataInDataListFormat = (data,dataType) => {
    let preparedData = [];
    let selectedFormsFromParams = [];
    let selectedDepartmentsFromParams = [];
    Object.entries(data).map(([key, value]) => {
      preparedData.push({ [key]: value });
      if("DEPARTMENT" == dataType && validate.isNotEmpty(params.departmentIds) && params.departmentIds.split(",").includes(key)){
        selectedDepartmentsFromParams.push({ [key]: value });
      }
      if("FORM" == dataType && validate.isNotEmpty(params.formIds) && params.formIds.split(",").includes(key)){
        selectedFormsFromParams.push({ [key]: value });
      }
    })
    if("FORM" == dataType){
      setSelectedForms(selectedFormsFromParams);
    }
    if("DEPARTMENT" == dataType){
      setSelectedDepartments(selectedDepartmentsFromParams,...selectedDepartments);
    }
    return preparedData;
  }

  const observersMap = {
    'submit': [['click',(payload) => LabOrderSearchForm(payload)]],
    'labOrderSearch': [['load', updateValues], ['submit', LabOrderSearchForm]],
    'RESPONSE': [['RESPONSE', handleLabOrderSearchResponse]],
    'paymentType': [['click', checkForPaymentStatusCriteria]],
    'reset': [['click',(payload)=>{checkForPaymentStatusCriteria(payload);setSelectedDepartments([]);setSelectedForms([])}]],
    'customerId': [['change', (payload) => FormHelpers().onInputCustomerId(payload, helpers, "customerId")]]
  }


  return (
    <React.Fragment>
      {<DynamicForm requestUrl={`${API_URL}getLabOrderSearchForm`} headers={{"x-requested-with":"XMLHttpRequest"}} helpers={helpers} requestMethod={'GET'} observers={observersMap} customHtml={customHtmlMap}/>}
    </React.Fragment>
  )
}

export default withFormHoc(LabOrderSearchForm);
