import DynamicForm, { TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useRef, useState } from "react";
import { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import CommunicationService from '../../services/Communication/CommunicationService';
import { API_URL } from '../../services/ServiceConstants';
import Validate from '../../helpers/Validate';
import { AlertContext, CustomerContext } from '../Contexts/UserContext';
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure';
import { Button } from 'react-bootstrap';

const CustomerCommunication = ({ helpers }) => {
  const { setStackedToastContent } = useContext(AlertContext);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const validate = Validate()
  const {customerId} = useContext(CustomerContext)

  const getOrdersValidate = async (formData) => {
    return await CommunicationService().validateOrders({
      orderId: formData.orderId, orderType: formData.orderType, customerId: customerId
    }).then((data) => {
      if (data != null && data == 'success') {
        return true
      }
      else {
        setStackedToastContent({ toastMessage: "Invalid OrderId, OrderType combination", position: TOAST_POSITION.BOTTOM_START });
        return false;
      }
    },
    (err) => {
      setStackedToastContent({ toastMessage: "Error while unsubscribing refill order"});
      return false;
  })
  }

  const validateFormValues = async (formData) => {
    if (validate.isEmpty(formData?.completeReason[0] || validate.isEmpty(formData?.subReason[0]))) {
      setStackedToastContent({ toastMessage: "Please select reasons."});
      return false;
    }
    if (formData == null) {
      return false;
    }
    else {
      if ((formData.orderId && !formData.orderType) || (!formData.orderId && formData.orderType)) {
        setStackedToastContent({ toastMessage: 'Please Please provide OrderId along with OrderType.'});
        return false;
      }
      else if (formData.orderId && formData.orderType) {
        if (formData.orderId.length != 15 && formData.orderId.length != 7) {
          setStackedToastContent({ toastMessage: 'Please give valid orderID'});
          return false;
        }
        else {
          return (await getOrdersValidate(formData));
        }
      }
      else {
        return true;
      }
    }
  }

  const sendRequest = async (payload) => {
    //payload[0].preventDefault();
    const formValues = helpers.validateAndCollectValuesForSubmit("recordCommunication");
    if (validate.isNotEmpty(formValues?.completeReason) && validate.isNotEmpty(formValues?.subReason)) {
      formValues.reason = formValues.completeReason + " : " + formValues.subReason
    }
    let validOrder = false;
    if(formValues?.orderId || formValues?.orderType)
      validOrder = await validateFormValues(formValues);
    let requestParams = {
      reason: formValues?.reason,
      modeOfContact: helpers.getHtmlElementValue("modeOfContact"),
      message: helpers.getHtmlElementValue("message"),
      type: "C",
      customerId: customerId
    };
      if (validOrder) {
        requestParams = {
          orderId: helpers.getHtmlElementValue("orderId"),
          orderType: helpers.getHtmlElementValue("orderType"),
          reason: formValues?.reason,
          modeOfContact: helpers.getHtmlElementValue("modeOfContact"),
          message: helpers.getHtmlElementValue("message"),
          type: "C",
          customerId: customerId
      }}
      else if(formValues?.reason && formValues?.modeOfContact && formValues?.message){
        requestParams = {
        reason: formValues?.reason,
        modeOfContact: helpers.getHtmlElementValue("modeOfContact"),
        message: helpers.getHtmlElementValue("message"),
        type: "C",
        customerId: customerId
    }}
    if((validOrder && formValues?.orderId && formValues?.orderType) || (!formValues?.orderId && !formValues?.orderType && formValues?.reason && formValues?.modeOfContact && formValues?.message)){
      CommunicationService().getInsertCommunicationLog(requestParams).then((data) => {
        if ("success" == data) {
          setStackedToastContent({ toastMessage: "Communication Submitted Successfully" });
          helpers.resetForm('recordCommunication');
          return;
        }
        else {
          setStackedToastContent({ toastMessage: "Something Went Wrong" });
        }
        return;
      },
      (err) => {
        console.log(err);
        setStackedToastContent({ toastMessage: "Error while unsubscribing refil order. "});
        return;
    })
  }
  else{
    // helpers.resetForm('recordCommunication');
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

  const resetForm = ()=>{
    helpers.hideElement('subReason');
  }

  const observerMap = {
    'submit': [['click', (payload) => sendRequest(payload)]],
    'completeReason': [['select', (payload)=>onReasonSelect(payload)], ['change', (payload)=>onChangeValue(payload)]],
    'Reset': [['click', ()=> resetForm()]]
  }

  return (
    <Wrapper>
    <HeaderComponent ref={headerRef} className="custom-tabs-forms py-2 px-3">
        Record Communication
    </HeaderComponent>
    <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height">
            <DynamicForm requestUrl={`${API_URL}getCommunicationForm`} helpers={helpers} observers={observerMap} requestMethod={'GET'} />
    </BodyComponent>
</Wrapper>
    
  )
}
export default withFormHoc(CustomerCommunication)