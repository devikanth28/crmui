import React, { useContext, useState } from 'react';
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import DynamicForm, { withFormHoc ,TOAST_POSITION} from '@medplus/react-common-components/DynamicForm';
import Validate from "../../helpers/Validate";
import dateFormat from 'dateformat';
import qs from 'qs';
import { AlertContext } from '../Contexts/UserContext';
import { getSavedWorkspaceForLabOrder } from '../../helpers/LabOrderHelper';

const CollectionCenterLabOrderSearchForm = ({ helpers, formData, ...props }) => {
  const { setStackedToastContent } = useContext(AlertContext);
  const [collectionCenters, setCollectionCenters] = useState([]);
  const [defaultFormData,setDefaultFormData] = useState({});
  const validate = Validate()
  let filteredData = {}
  const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });

  if (validate.isNotEmpty(formData) && validate.isEmpty(defaultFormData)) {
    setDefaultFormData({ collectionCenter: formData?.[0].htmlGroups?.[0].groups?.[0].groupElements?.[0].value, status: formData?.[0].htmlGroups?.[0].groups?.[0].groupElements?.[1].value })
    setCollectionCenters(formData?.[0].htmlGroups?.[0].groups?.[0].groupElements?.[0].values);
    if (validate.isEmpty(formData?.[0].htmlGroups?.[0].groups?.[0].groupElements?.[0].values)) {
      setStackedToastContent({ toastMessage: "No Collection Center Assigned for Current Logged-In User.", position: TOAST_POSITION.BOTTOM_START })
      return;
    }
  }

  const validateSearchCriteria = (searchCriteria) => {
    let fromDateTime = new Date(searchCriteria?.dateRange?.[0]).getTime();
    let toDateTime = new Date(searchCriteria?.dateRange?.[1]).getTime();
    if((!Number.isNaN(fromDateTime) && Number.isNaN(toDateTime)) || (Number.isNaN(fromDateTime) && !Number.isNaN(toDateTime))){
      helpers.updateErrorMessage("Please give valid Date Range.","dateRange");
      return false;
    }
    if (toDateTime < fromDateTime) {
      helpers.updateErrorMessage("Please give From Date less than or equals to ToDate.","dateRange");
      return false;
    }
    
    const pattern = new RegExp(/^[0-9\b\+\-\(\)]+$/);
    if(validate.isNotEmpty(searchCriteria.pscRegistrationId) && pattern.test(searchCriteria.pscRegistrationId)===false){
      helpers.updateErrorMessage("Only Numbers allowed for PSC Registration Id","pscRegistrationId");
      return false;
    
    }
    if(validate.isNotEmpty(searchCriteria.pscRegistrationId)){
      if(validate.isEmpty(searchCriteria.customerId) && validate.isEmpty(searchCriteria.collectionCenterId)){
        helpers.updateErrorMessage("CustomerId (or) Collection Center is mandatory when PSC Register Id is given","pscRegistrationId")
        return false;
      }
    }
    if(validate.isNotEmpty(searchCriteria.couponCode)){
      if(validate.isEmpty(searchCriteria.customerId) && validate.isEmpty(searchCriteria.mobileNo)){
        helpers.updateErrorMessage("CustomerId (or) Mobile Number is required if coupon code is given.","couponCode");
        return false;
      }
    }

    for (let key in searchCriteria) {
      if (validate.isNotEmpty(searchCriteria[key])) {
          if(key !== 'dateRange') 
              filteredData[key] = searchCriteria[key]
      }
  }
  if (Object.keys(filteredData).length === 0) {
    setStackedToastContent({toastMessage:"Please give Atleast one Search Criteria for Finding Collection Center Lab Orders." , position : TOAST_POSITION.BOTTOM_START})
    return false;
  }
  filteredData["v"] = Date.now();
    return true;
  }

  const LabOrderSearchForm = (payload) => {
    payload[0].preventDefault();
    if (validate.isEmpty(collectionCenters)) {
      setStackedToastContent({ toastMessage: "No Collection Center Assigned for Current Logged-In User.", position: TOAST_POSITION.BOTTOM_START })
      return;
    }
    let searchCriteria = helpers.validateAndCollectValuesForSubmit("labOrderSearch", true, true, true);
    searchCriteria.visitType = 2;
    if(validate.isNotEmpty(searchCriteria.dateRange) && searchCriteria.dateRange.length > 1) {
      searchCriteria.fromDate = dateFormat(searchCriteria.dateRange[0],'yyyy-mm-dd 00:00:00');
      searchCriteria.toDate = dateFormat(searchCriteria.dateRange[1],'yyyy-mm-dd 23:59:59');
  }
    if(validate.isNotEmpty(searchCriteria)){
      if(validate.isEmpty(searchCriteria.collectionCenterId)){
        helpers.updateErrorMessage("Please provide Collection Center Id","collectionCenterId");
        return;
      }
      if(validate.isEmpty(searchCriteria.status)){
        helpers.updateErrorMessage("Please provide Status","status");
        return;
      }
      if(validate.isNotEmpty(searchCriteria.cartId) && !validate.isNumeric(searchCriteria.cartId)){
        helpers.updateErrorMessage("Only Numbers allowed for CartId","cartId");
        return;
      }
    }
    if (validateSearchCriteria(searchCriteria)) {
      const qs = '?' + new URLSearchParams(filteredData).toString()
      props.history.push(`${CRM_UI}/labCollectionCenterDashboard${qs}`);
    }
  }

  const checkForCollectionCenterAndStatus = () => {
    helpers.updateValue(defaultFormData.collectionCenter,"collectionCenterId");
    helpers.updateValue(defaultFormData.status,"status")
  }

  const updateValues = () => {
    getSavedWorkspaceForLabOrder(params,helpers);
  }

  const observersMap = {
    'labOrderSearch': [['load', updateValues]],
    'submit': [['click',(payload) => LabOrderSearchForm(payload)]],
    'reset': [['click', checkForCollectionCenterAndStatus]]
  }

    return (
       <React.Fragment>
            {<DynamicForm requestUrl={`${API_URL}getCollectionCenterLabOrderSearchForm`} headers={{ "x-requested-with": "XMLHttpRequest" }} helpers={helpers} requestMethod={'GET'} observers={observersMap} />}
        </React.Fragment>
    )
}

export default withFormHoc(CollectionCenterLabOrderSearchForm); 
