import DynamicForm, { TOAST_POSITION, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import dateFormat from 'dateformat';
import React, { useContext, useEffect } from 'react';
import { getSavedWorkspaceForLabOrder } from '../../helpers/LabOrderHelper';
import Validate from "../../helpers/Validate";
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import { AlertContext, SidebarContext } from '../Contexts/UserContext';

const MobileLabOrderSearchForm = ({ helpers, formData, ...props }) => {

  const { setStackedToastContent } = useContext(AlertContext);
  const validate = Validate()
  const params = props?.urlParams;

  let filteredData = {}

  const  { setSidebarCollapsedFlag} = useContext(SidebarContext)


  useEffect(() => {
    setTimeout(() => {
      setSidebarCollapsedFlag(true);

    },[500])

  },[])

  const validateSearchCriteria = (labOrderSearchCriteria) => {
    let fromDateTime = new Date(labOrderSearchCriteria.fromDate).getTime();
    let toDateTime = new Date(labOrderSearchCriteria.toDate).getTime();
    if (toDateTime < fromDateTime) {
      helpers.updateErrorMessage("Please give From Date less than or equals to ToDate.", "dateRange");
      return false;
    }
    if ((new Date(labOrderSearchCriteria.toDate) - new Date(labOrderSearchCriteria.fromDate)) / (1000 * 3600 * 24) > 30) {
      setStackedToastContent({ toastMessage: "The date Range should be of 30 days" });
      return false;
    }
    const pattern = new RegExp(/^[0-9\b\+\-\(\)]+$/);
    if (validate.isNotEmpty(labOrderSearchCriteria.pscRegistrationId) && pattern.test(labOrderSearchCriteria.pscRegistrationId) === false) {
      helpers.updateErrorMessage("Only Numbers allowed for RegistrationId", "pscRegistrationId");
      return false;

    }
    if (validate.isNotEmpty(labOrderSearchCriteria.pscRegistrationId)) {
      if (validate.isEmpty(labOrderSearchCriteria.customerId) && validate.isEmpty(labOrderSearchCriteria.collectionCenterId)) {
        helpers.updateErrorMessage("CustomerId (or) Collection Center is mandotory when PSC RegId is given", "pscRegistrationId")
        return false;
      }
    }
    if (validate.isNotEmpty(labOrderSearchCriteria.couponCode)) {
      if (validate.isEmpty(labOrderSearchCriteria.customerId) && validate.isEmpty(labOrderSearchCriteria.mobileNo)) {
        helpers.updateErrorMessage("CustomerId (or) Mobile Numner is required if coupon code is given.", "couponCode");
        return false;
      }
    }
    if (toDateTime - fromDateTime >= 7776000000) {
      return false;
    }

    for (let key in labOrderSearchCriteria) {
      if (validate.isNotEmpty(labOrderSearchCriteria[key])) {
        if (key !== 'dateRange' && key != 'completeReason' && key != 'subReason')
          filteredData[key] = labOrderSearchCriteria[key]
      }
    }
    if (Object.keys(filteredData).length === 0) {
      setStackedToastContent({ toastMessage: "Please give Atleast one Search Criteria for Finding Lab Orders.", position: TOAST_POSITION.BOTTOM_START })
      return false;
    }
    filteredData["v"] = Date.now();
    return true;
  }

  const LabOrderSearchForm = (payload) => {
    payload[0].preventDefault();
    let labOrderSearchCriteria = helpers.validateAndCollectValuesForSubmit("labOrderSearch", true, true, true);
    if (validate.isNotEmpty(labOrderSearchCriteria.dateRange) && labOrderSearchCriteria.dateRange.length > 1) {
      labOrderSearchCriteria.fromDate = dateFormat(labOrderSearchCriteria.dateRange[0], 'yyyy-mm-dd 00:00:00');
      labOrderSearchCriteria.toDate = dateFormat(labOrderSearchCriteria.dateRange[1], 'yyyy-mm-dd 23:59:59');
    }
    if (validateSearchCriteria(labOrderSearchCriteria)) {
      const qs = '?' + new URLSearchParams(filteredData).toString()
      props.history.push(`${CRM_UI}/labOrder/searchResults${qs}`);
    }
  }
  const updateValues = () => {
    if (params) {
      getSavedWorkspaceForLabOrder(params, helpers);
    }
  }

  const checkForPaymentStatusCriteria = (payload) => {
    if (payload[0].target.value === "O") {
      helpers.showElement("gatewayStatus")
    } else {
      helpers.hideElement("gatewayStatus")
    }
  }

  const observersMap = {
    'submit': [['click', (payload) => LabOrderSearchForm(payload)]],
    'labOrderSearch': [['load', updateValues], ['submit', LabOrderSearchForm]],
    'paymentType': [['click', checkForPaymentStatusCriteria]],
    'reset': [['click', checkForPaymentStatusCriteria]]
  }

  return (
    <React.Fragment>
      {<div className='bg-white'>
        <DynamicForm requestUrl={`${API_URL}getLabOrderSearchForm`} headers={{ "x-requested-with": "XMLHttpRequest" }} helpers={helpers} requestMethod={'GET'} observers={observersMap} />
      </div>
      }
    </React.Fragment>
  )
}

export default withFormHoc(MobileLabOrderSearchForm);
