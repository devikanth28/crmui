import React, { useContext, useRef, useState } from "react";
import DynamicForm, { TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import UserService from "../../services/Common/UserService";
import Validate from '../../helpers/Validate';
import { API_URL } from "../../services/ServiceConstants";
import { AlertContext, CustomerContext } from "../Contexts/UserContext"
import CommunicationService from "../../services/Communication/CommunicationService";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import CustomerFollowUpResult from "./CustomerFollowUpResult";

const CustomerFollowUp = ({ helpers, ...props }) => {
  const queryString = props.location.search;
  const queryParams = new URLSearchParams(queryString);
  const communicationId = queryParams.get('communicationId');
  const orderId = queryParams.get('orderId');
  const nextContactTime = queryParams.get('nextContactTime');
  const message = queryParams.get('message');
  const completeReason = queryParams.get('completeReason');
  const [reason, subReason] = completeReason.split(':').map(str => str.trim());
  const { customerId } = useContext(CustomerContext);
  const [searchingParameters,setSearchingParameter] = useState({
    customerId: customerId,
    type: "F",
    start: 0,
    end: 10,
    orderBy: "datecreated",
    sortOrder: "desc",
    orderId: orderId

  })


  const headerRef = useRef(null);

  const validate = Validate()
  const { setStackedToastContent } = useContext(AlertContext);
 


  const inFuture = (date) => {
    const currDateTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();
    return date > currDateTime;
  };

  const getOrdersValidate = async () => {
    return await CommunicationService().validateOrders({ orderId: orderId, orderType: helpers.getHtmlElementValue("orderType"), customerId: customerId }).then(data => {
      if (data != null && data == 'success') {
        return true
      }
      else {
        setStackedToastContent({ toastMessage: "Invalid OrderId, OrderType combination.", position: TOAST_POSITION.BOTTOM_START })
        return false;
      }
    })
  }

  const validateFormForFollowUp = async (formData) => {
    if (!inFuture(helpers.getHtmlElementValue("nextContactTime"))) {
      setStackedToastContent({ toastMessage: "Next ContactTime cannot be less than currentTime.", position: TOAST_POSITION.BOTTOM_START })
      return false;
    }
    if (formData == null) {
      return false;
    }
    else {
      if (formData.orderId && formData.orderType) {
        if (formData.orderId.length > 15 && formData.orderId.length < 6) {
          setStackedToastContent({ toastMessage: "Please give valid orderID.", position: TOAST_POSITION.BOTTOM_START })
          return false;
        }
        else {
          return (await getOrdersValidate());
        }
      }
      else if ((formData.orderId && !formData.orderType) || (!formData.orderId && formData.orderType)) {
        setStackedToastContent({ toastMessage: "Please provide OrderId along with OrderType.", position: TOAST_POSITION.BOTTOM_START })
        return false;
      }
      else {
        return true;
      }
    }
  }

  const sendRequest = async (payload) => {
    payload[0].preventDefault();
    let formValues = helpers.validateAndCollectValuesForSubmit("FollowUp")
    if (validate.isNotEmpty(formValues?.completeReason) && validate.isNotEmpty(formValues?.subReason)) {
      formValues.reason = formValues.completeReason + " : " + formValues.subReason;
    }
    let validOrder = false;
    if(formValues?.orderId && formValues?.orderType)
      validOrder = await validateFormForFollowUp(formValues);
    if (validOrder) {
      formValues = (({completeReason, subReason, ...rest})=>rest)(formValues)
      formValues.customerId = customerId;
      CommunicationService().getInsertCommunicationLog({ ...formValues, type: "F" }).then(data => {
        if ("success" == data) {
          setStackedToastContent({ toastMessage: "FollowUp Submitted Successfully.", position: TOAST_POSITION.BOTTOM_START })
        } else {
          setStackedToastContent({ toastMessage: "Failed.", position: TOAST_POSITION.BOTTOM_START })
        }
      })
    }
  }

  const completeCall = (payload) => {
    payload[0].preventDefault();
    UserService().updateCallAttendedStatus({ communicationId: communicationId, status: "Y" }).then(data => {
      if ("success" == data) {
        setStackedToastContent({ toastMessage: "Call Completed.", position: TOAST_POSITION.BOTTOM_START })
      }
      else if ("alreadyCompleted" == data) {
        setStackedToastContent({ toastMessage: "Call Already Completed.", position: TOAST_POSITION.BOTTOM_START })
      }
      else {
        setStackedToastContent({ toastMessage: "Failure in Call Completion,Please try again.", position: TOAST_POSITION.BOTTOM_START })
      }
    })
  }
  const createOneMoreFollowUp = (payload) => {
    UserService().updateCallAttendedStatus({ communicationId: communicationId, status: "Y" }).then(data => {
      if ("success" == data) {
        sendRequest(payload);
      }
      else if ("alreadyCompleted" == data) {
        setStackedToastContent({ toastMessage: "Call Already Complete.", position: TOAST_POSITION.BOTTOM_START })
        sendRequest(payload);
      }
      else {
        setStackedToastContent({ toastMessage: "Failure in Call Completion,Please try again.", position: TOAST_POSITION.BOTTOM_START })
      }
    })
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
    console.log(selectedOption?.attributes['data-reason']);
    const subReasonOptions = prepareSubReasons(selectedOption.attributes['data-reason']);
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

  const defaultValues =()=> {
    
    if (orderId) { 
      helpers.updateSingleKeyValueIntoField("value", orderId, "orderId");
    }
    if (nextContactTime) { 
      helpers.updateSingleKeyValueIntoField("value", nextContactTime, "nextContactTime");
    }
    if (message) { 
      helpers.updateSingleKeyValueIntoField("value", message, "message");
    }
    if (completeReason) {

       helpers.updateSingleKeyValueIntoField("value", [reason], "completeReason");
      helpers.updateSingleKeyValueIntoField("value", [subReason], "subReason");
    }
    if(communicationId){
      helpers.updateSingleKeyValueIntoField("hidden",true, "reset");
      helpers.updateSingleKeyValueIntoField("hidden",true, "submit");
    }
    else{
      helpers.updateSingleKeyValueIntoField("hidden",true, "completeCall");
      helpers.updateSingleKeyValueIntoField("hidden",true, "createOneMoreFollowUp");
    }


  }

  const observerMap = {
    'FollowUp' : [['load', ()=> (defaultValues())]],
    'submit': [['click', (payload)=>sendRequest(payload)]],
    'completeReason': [['select', (payload)=>onReasonSelect(payload)], ['change', (payload)=>onChangeValue(payload)]],
    'completeCall': [['click', (payload)=>completeCall(payload)]],
    'createOneMoreFollowUp': [['click', (payload)=>createOneMoreFollowUp(payload)]],
  }

  return (
    <React.Fragment>
      {
        <Wrapper>
          <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
            <p className="mb-0">Create Customer Follow Up</p>
          </HeaderComponent>
          <BodyComponent allRefs={{ headerRef }} className={'body-height'}>
            <div className={`h-100`}>
              <DynamicForm requestUrl={`${API_URL}getFollowUpForm`} helpers={helpers} observers={observerMap}  requestMethod={'GET'} />
            </div>
            <CustomerFollowUpResult data = {searchingParameters} />
          </BodyComponent>
        </Wrapper>
      }

    </React.Fragment>
  )
}
export default withFormHoc(CustomerFollowUp);
