import React, { useContext, useEffect, useState } from "react";
import { TOAST_POSITION, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import DynamicForm from '@medplus/react-common-components/DynamicForm';
import CommunicationResult from "./CommunicationResult";
import dateFormat from 'dateformat';
import Validate from "../../helpers/Validate";
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import { AlertContext, CustomerContext, UserContext } from "../Contexts/UserContext";
import qs from 'qs';
import { Wrapper } from "../Common/CommonStructure";

const CommunicationSearch = ({ helpers, ...props }) => {

  useEffect(() => {
    if(userSessionInfo?.vertical && userSessionInfo.vertical == "V"){                    
        props.history.push({
        pathname: `${CRM_UI}/customer/${customerId}/searchCommunication/search`,
        state: { urlParams: params }
      });                     
    }
    else
        null 
    }, [])

    const userSessionInfo = useContext(UserContext);
    let filteredData = {}
    const { customerId } = useContext(CustomerContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const [completeReason, setCompleteReason] = useState()
    const validate = Validate()
    
    const validateSearchCriteria = (communicationSearchCriteria) => {
    const fromDateTime = communicationSearchCriteria.fromDate ? communicationSearchCriteria.fromDate : null;
    const toDateTime = communicationSearchCriteria.toDate ? communicationSearchCriteria.toDate : null;
    const orderId = communicationSearchCriteria.orderId ? communicationSearchCriteria.orderId : null
    const messageOutOnly = communicationSearchCriteria.messageOutOnly ? communicationSearchCriteria.messageOutOnly : null;
    
    if ((!fromDateTime || !toDateTime) && !messageOutOnly && !orderId && (!communicationSearchCriteria.reason || communicationSearchCriteria.reason == "Select Reason")) {
      setStackedToastContent({ toastMessage: "Please give proper searching criteria"});
      return false;
    }
    if (toDateTime < fromDateTime) {
      setStackedToastContent({ toastMessage: "From date should not greater than To date." });
      return false;
    }
    if (communicationSearchCriteria.orderId && Validate().isNotEmpty(communicationSearchCriteria.orderId)) {
      if (communicationSearchCriteria.orderId.length != 15 && communicationSearchCriteria.orderId.length != 7) {
        setStackedToastContent({ toastMessage: "Please give valid orderID." });
        return false;
      }
    }
    if (toDateTime - fromDateTime >= 7776000000) {
      return false;
    }
    if (completeReason && Validate().isNotEmpty(completeReason)) {
      filteredData["reason"] = completeReason
    }
    for (let key in communicationSearchCriteria) {
      if (Validate().isNotEmpty(communicationSearchCriteria[key])) {
        if (key !== 'dateRange')
          filteredData[key] = communicationSearchCriteria[key]
      }
    }

    if (Object.keys(filteredData).length === 0) {
      setStackedToastContent({ toastMessage: "Please give Atleast one Search Criteria for Finding Orders." });
      return false;
    }
    return true;
  }

  const sendRequest = () => {
    let communicationSearchCriteria = helpers.validateAndCollectValuesForSubmit("displayCommunication", false, false, false);
    if (Validate().isEmpty(communicationSearchCriteria?.completeReason) && Validate().isEmpty(communicationSearchCriteria?.dateRange) && Validate().isEmpty(communicationSearchCriteria?.messageOutOnly) && Validate().isEmpty(communicationSearchCriteria?.orderId)) {
      setStackedToastContent({ toastMessage: "Please give Atleast one Search Criteria for Finding Orders." });
      return;
    }
    let messageOutOnlyCheck = communicationSearchCriteria.messageOutOnly ? communicationSearchCriteria.messageOutOnly[0] : null;
    communicationSearchCriteria.customerId = customerId;
    if (Validate().isNotEmpty(communicationSearchCriteria.dateRange) && communicationSearchCriteria.dateRange.length > 1) {
      communicationSearchCriteria.fromDate = dateFormat(communicationSearchCriteria.dateRange[0], 'yyyy-mm-dd 00:00:00');
      communicationSearchCriteria.toDate = dateFormat(communicationSearchCriteria.dateRange[1], 'yyyy-mm-dd 23:59:59');
    }

    if (validate.isNotEmpty(communicationSearchCriteria.completeReason) && validate.isNotEmpty(communicationSearchCriteria.subReason)) {
      communicationSearchCriteria.reason = communicationSearchCriteria.completeReason + " : " + communicationSearchCriteria.subReason
    }
    if (validateSearchCriteria(communicationSearchCriteria)) {
      const criteria ={
        fromDate: communicationSearchCriteria.fromDate,
        toDate: communicationSearchCriteria.toDate,
        customerId: customerId,
        start: 0,
        end: 10,
        orderBy: "datecreated",
        sortOrder: "desc",
        showMsgOutOnly: messageOutOnlyCheck,
        // displayOrderId: communicationSearchCriteria.orderId.length ==15? communicationSearchCriteria.orderId: null,
        orderId: communicationSearchCriteria.orderId,
        type: "C",
        reason: communicationSearchCriteria.reason
      }
      props.history.replace(`${CRM_UI}/customer/${customerId}/searchCommunication?${qs.stringify(criteria)}`);
    }
  }

  const prepareSubReasons = (subReasonsStr) => {
    const subReasons = subReasonsStr?.split(',')?.map(subReason => {
      return helpers.createOption(subReason, subReason, subReason);
    })
    return subReasons;
  }

  const onReasonSelect = (payload) => {
    const [event, htmlElement] = payload;
    const [selectedReason] = event.target.value;
    const [selectedOption] = htmlElement.values.filter(value => value.id == selectedReason);
    let subReasonOptions = prepareSubReasons(selectedOption.attributes['data-reason']);
    if (validate.isNotEmpty(event.target.value)) {
      helpers.updateSingleKeyValueIntoField("hidden", false, "subReason");
    }
    helpers.updateSingleKeyValueIntoField('values', subReasonOptions, "subReason");
  }

  const onChangeValue = (payload) => {
    const [event] = payload;
    if (validate.isEmpty(event.target.value)) {
      helpers.updateSingleKeyValueIntoField("value", null, "subReason");
      helpers.updateSingleKeyValueIntoField("hidden", true, "subReason");
    }
  }

  const resetForm = ()=>{
    helpers.hideElement('subReason');
  }

  const observerMap = {
    'submit': [['click', () => sendRequest()]],
    'completeReason': [['select', (payload) => onReasonSelect(payload)], ['change', (payload) => onChangeValue(payload)]],
    'reset': [['click', ()=> resetForm()]]
  }
  return (
    <React.Fragment>
      {
        <DynamicForm requestUrl={`${API_URL}getDisplayCommunicationSearchForm`} requestMethod={'GET'} helpers={helpers} observers={observerMap} />
      }
    </React.Fragment>
  )
}
export default withFormHoc(CommunicationSearch);