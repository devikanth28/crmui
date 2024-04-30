import React, { useContext, useEffect } from 'react'
import { withFormHoc } from '@medplus/react-common-components/DynamicForm'
import DynamicForm from "@medplus/react-common-components/DynamicForm";
import Validate from '../../../../helpers/Validate';
import { CustomerContext, LocalityContext } from '../../../Contexts/UserContext';

const LabHomeDelivery = (props) => {

  const obj = {
    "htmlElementType": "FORM",
    "id": "labHomeDeliveryForm",
    "label": null,
    "name": null,
    "value": null,
    "className": null,
    "readOnly": false,
    "disabled": false,
    "autofocus": false,
    "required": false,
    "style": null,
    "attributes": null,
    "message": null,
    "htmlActions": null,
    "elementSize": null,
    "defaultValue": null,
    "helperText": null,
    "labelClassName": null,
    "htmlGroups": [
      {
        "htmlElementType": "ELEMENTGROUP",
        "id": "group1",
        "label": null,
        "name": null,
        "value": null,
        "className": "row g-3",
        "readOnly": false,
        "disabled": props.isForReportDelivery && props.tabId == 1,
        "autofocus": false,
        "required": false,
        "style": null,
        "attributes": null,
        "message": null,
        "htmlActions": null,
        "elementSize": null,
        "defaultValue": null,
        "helperText": null,
        "labelClassName": null,
        "groups": null,
        "groupElements": [
          {
            "htmlElementType": "INPUT",
            "id": "firstName",
            "label": "Receiver's Name",
            "name": null,
            "value": null,
            "className": null,
            "readOnly": false,
            "disabled": props.isForReportDelivery && props.tabId == 1,
            "autofocus": false,
            "required": false,
            "style": null,
            "attributes": null,
            "message": null,
            "htmlActions": null,
            "elementSize": null,
            "helperText": null,
            "labelClassName": "col-12 col-lg-4",
            "type": "text",
            "placeholder": null,
            "hidden": false,
            "regex": "^[a-zA-Z][a-zA-Z ]*$",
            "maxlength": 45,
          },
          {
            "htmlElementType": "INPUT",
            "id": "addressLine1",
            "label": "Door No / House Name",
            "name": null,
            "value": null,
            "className": null,
            "readOnly": false,
            "disabled": props.isForReportDelivery && props.tabId == 1,
            "autofocus": false,
            "required": false,
            "style": null,
            "attributes": null,
            "message": null,
            "htmlActions": null,
            "elementSize": null,
            "helperText": null,
            "labelClassName": "col-8",
            "type": "text",
            "placeholder": null,
            "hidden": false,
            "maxlength": 200,
          },
          {
            "htmlElementType": "INPUT",
            "id": "addressLine2",
            "label": "Address",
            "name": null,
            "value": null,
            "className": null,
            "readOnly": false,
            "disabled": true,
            "autofocus": false,
            "required": true,
            "style": null,
            "attributes": null,
            "message": null,
            "htmlActions": null,
            "elementSize": null,
            "helperText": null,
            "labelClassName": "col-12",
            "type": "text",
            "placeholder": null,
            "hidden": false,
            "maxlength": 300,
          },
          {
            "htmlElementType": "INPUT",
            "id": "city",
            "label": "City",
            "name": null,
            "value": null,
            "className": null,
            "readOnly": false,
            "disabled": true,
            "autofocus": false,
            "required": true,
            "style": null,
            "attributes": null,
            "message": null,
            "htmlActions": null,
            "elementSize": null,
            "helperText": null,
            "labelClassName": "col-12 col-lg-4",
            "type": "text",
            "placeholder": null,
            "hidden": false
          },
          {
            "htmlElementType": "INPUT",
            "id": "state",
            "label": "State",
            "name": null,
            "value": null,
            "className": null,
            "readOnly": false,
            "disabled": true,
            "autofocus": false,
            "required": true,
            "style": null,
            "attributes": null,
            "message": null,
            "htmlActions": null,
            "elementSize": null,
            "helperText": null,
            "labelClassName": "col-12 col-lg-4",
            "type": "text",
            "placeholder": null,
            "hidden": false
          },
          {
            "htmlElementType": "INPUT",
            "id": "pincode",
            "label": "Pincode",
            "name": null,
            "value": null,
            "className": null,
            "readOnly": false,
            "disabled": true,
            "autofocus": false,
            "required": true,
            "style": null,
            "attributes": null,
            "message": null,
            "htmlActions": null,
            "elementSize": null,
            "helperText": null,
            "labelClassName": "col-12 col-lg-4",
            "type": "text",
            "placeholder": null,
            "hidden": false
          },
          {
            "htmlElementType": "INPUT",
            "id": "emailID",
            "label": "Email ID",
            "name": null,
            "value": null,
            "className": null,
            "readOnly": false,
            "disabled": true,
            "autofocus": false,
            "required": false,
            "style": null,
            "attributes": null,
            "message": null,
            "htmlActions": null,
            "elementSize": null,
            "helperText": null,
            "labelClassName": "col-12 col-lg-4",
            "type": "text",
            "placeholder": null,
            "hidden": false,
          },
          {
            "htmlElementType": "INPUT",
            "id": "mobileNo",
            "label": "Mobile Number",
            "name": null,
            "value": null,
            "className": null,
            "readOnly": false,
            "disabled": props.isForReportDelivery && props.tabId == 1,
            "autofocus": false,
            "required": false,
            "style": null,
            "attributes": null,
            "message": null,
            "htmlActions": null,
            "elementSize": null,
            "helperText": null,
            "labelClassName": "col-12 col-sm-6 col-lg-4",
            "type": "text",
            "regex": "^[0-9]{1,10}$",
            "placeholder": null,
            "hidden": false,
            "maxlength": 10,
          },
        ]
      },
    ],
    "notes": null,
    "atleastOneFieldRequired": false,
    "submitDisabled": false,
    "hidden": false
  }

  const { helpers } = props;
  const { martLocality } = useContext(LocalityContext);
  const { customer } = useContext(CustomerContext);
  const validate = Validate();
  const customerAddressFormData = props.customerAddressFormData;

  useEffect(() => {
    onFormLoad();
  }, [])

  const prepareCustomerName = () => {
    return (customer.firstName != null && customer.lastName != null) ? customer.firstName + " " + customer.lastName : (customer.firstName != null ? customer.firstName : (customer.lastName != null ? customer.lastName : ""))
  }

  const onFormLoad = () => {
    if (validate.isNotEmpty(martLocality) && validate.isNotEmpty(customer)) {
      helpers.updateValue(martLocality.combination, "addressLine2")
      helpers.updateValue(martLocality.state, "state");
      helpers.updateValue(martLocality.city, "city");
      helpers.updateValue(martLocality.pincode, "pincode");
      helpers.updateValue(prepareCustomerName(), "firstName");
      helpers.updateValue(customer.emailId, "emailID");
      helpers.updateValue(customer.mobileNumber, "mobileNo");
    }
    if (validate.isNotEmpty(customerAddressFormData) && validate.isNotEmpty(customerAddressFormData.addressLine1)) {
      helpers.updateValue(customerAddressFormData.addressLine1, "addressLine1");
    } else {
      helpers.updateValue("", "addressLine1");
    }
  }

  const handleMobileNumber = () => {
    const errorMessage = validate.mobileNumber(helpers.getHtmlElementValue("mobileNo"));
    if (validate.isNotEmpty(errorMessage)) {
      helpers.updateErrorMessage(errorMessage, "mobileNo");
      return false;
    }
    return true;
  }

  const handleAddressLine = () => {
    if (validate.isEmpty(helpers.getHtmlElementValue("addressLine1"))) {
      helpers.updateErrorMessage("Please Enter Valid Address", "addressLine1");
      return false;
    }
    return true;
  }

  const handleFirstName = () => {
    if (validate.isEmpty(helpers.getHtmlElementValue("firstName"))) {
      helpers.updateErrorMessage("Please Enter Valid Receiver's Name", "firstName");
      return false;
    }
    return true;
  }

  const validateRequiredFields = () => {
    const homeDeliverySearchCriteria = helpers.validateAndCollectValuesForSubmit("labHomeDeliveryForm");
    props.setCustomerAddressFormData(homeDeliverySearchCriteria);
    if (validate.isEmpty(homeDeliverySearchCriteria)) {
      return false;
    }
    if (!handleFirstName() || !handleAddressLine() || !handleMobileNumber()) {
      props.setShowTimeSlotsNav(false);
      return false;
    }
    prepareHomeDeliveryDetails();
    return true;
  }

  const prepareHomeDeliveryDetails = () => {

    let fieldsIds = [];
    fieldsIds.push("firstName");
    fieldsIds.push("addressLine1");
    fieldsIds.push("addressLine2");
    fieldsIds.push("city");
    fieldsIds.push("state");
    fieldsIds.push("pincode");
    fieldsIds.push("mobileNo");
    const homeDeliveryDetails = helpers.collectSpecificFieldValues("labHomeDeliveryForm", fieldsIds);
    props.setCustomerAddressFormData(homeDeliveryDetails);
    if (props.tabId == 1) {
      props.handleCallBack(undefined, homeDeliveryDetails);
    }
    if (props.reportDeliveryType == 'H') {
      props.addReportDeliveryAddress('H', homeDeliveryDetails);
    }
  }

  const observersMap = {
    "mobileNo": [['blur', validateRequiredFields]],
    "addressLine1": [['blur', validateRequiredFields]],
    "firstName": [['blur', validateRequiredFields]]
  }

  return (
    <DynamicForm formJson={obj} helpers={helpers} observers={observersMap} />
  )
}

export default withFormHoc(LabHomeDelivery)