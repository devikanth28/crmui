import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useState } from "react";
import Database from "../../Database";
import Validate from "../../helpers/Validate";
import CustomerService from "../../services/Customer/CustomerService";
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import { AlertContext } from '../Contexts/UserContext';
import { CUSTOMER } from './Constants/CustomerConstants';


const CreateCustomerForm = ({ helpers, fieldValues, formData, ...props }) => {

  const validate = Validate();
  const { mobileNo } = fieldValues;
  const { setAlertContent , setStackedToastContent } = useContext(AlertContext);

  useEffect(() => {
    helpers.resetForm('newCustomerForm');
    helpers.updateValue("", "age");
    helpers.hideElement("age");
    helpers.hideElement("group4");
    helpers.hideElement("confirmClinicAddress");
  }, [props.clearFormData])

  const setAge = (payload) => {
    let dateOfBirth = payload[0].target.value;
    let age = undefined;
    let today = new Date();
    let birthDate = new Date(dateOfBirth);
    let yearDiff = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();
    let dateDiff = today.getDate() - birthDate.getDate();

    if (yearDiff > 0) {
      if (monthDiff < 0) {
        age = yearDiff - 1
      } else {
        age = yearDiff
      }
    } else if (yearDiff === 0 && monthDiff > 0) {
      age = yearDiff;
    } else if (yearDiff === 0 && monthDiff === 0 && dateDiff >= 0) {
      age = yearDiff;
    } else {
      age = undefined;
    }


    if (age < 0 || age > 100 || age === undefined) {
      setAlertContent({alertMessage:"Please select valid Date Of Birth"})
      helpers.updateValue("", "age");
      helpers.hideElement("age");
    } else {
      if (age === 0) {
        helpers.updateValue('0',"hiddenAge");
        helpers.updateValue('0' + " Year(s)", "age");
      } else {
        helpers.updateValue(age,"hiddenAge");
        helpers.updateValue(age + " Year(s)", "age");
      }
      helpers.showElement("age")
    }
  }


  const createPharmaCustomer = () => {
    const fieldValues = helpers.validateAndCollectValuesForSubmit('newCustomerForm');
    let customerResponseToAgreement = 0;
    if (validate.isNotEmpty(fieldValues)) {
      if (validate.isNotEmpty(fieldValues.receiveUpdatesCheckBox[0])) {
        if (fieldValues.receiveUpdatesCheckBox[0] === "Y") {
          customerResponseToAgreement = 1;
        }
      }
      const formValidated = ValidateFormFields(fieldValues)
      if(validate.isNotEmpty(fieldValues.clinicName) && validate.isEmpty(fieldValues.confirmClinicAddress)) {
        setAlertContent({alertMessage:"Please confirm clinic address"});
        return false;
      }
      if (formValidated) {
        createCustomer({fullName: fieldValues.fullName, emailId:fieldValues.emailId, gender:fieldValues.gender[0], dateOfBirth:fieldValues.dateOfBirth, age:fieldValues.hiddenAge, address:fieldValues.address, mobile:fieldValues.mobileNumber, postalCode:fieldValues.postalCode, city:fieldValues.city, state:fieldValues.states[0], receiveUpdatesCheckBox:customerResponseToAgreement, isRegisteredDoctor:fieldValues.isRegisteredDoctor, doctorQualification:fieldValues.doctorQualification, doctorSpecialty:fieldValues.doctorSpecialty, clinicName:fieldValues.clinicName});
      }
    }
  }

  const ValidateFormFields = (fieldValues) => {
    if (validate.isNotEmpty(fieldValues.dateOfBirth)) {
      let todayDate = new Date();
      let dateStr = fieldValues.dateOfBirth.split("-");
      let selectedDate = new Date(dateStr[0], dateStr[1] - 1, dateStr[2]);
      selectedDate.setHours("23","59","59");
      if (selectedDate >= todayDate) {
        setAlertContent({alertMessage:"Please select the date of birth less than current date"});
        return false;
      }
    }
    if(!props.fromPrescription && validate.isEmpty(fieldValues.address)){
      helpers.updateSingleKeyValueIntoField("message","Please provide address to create a customer","address",false);
      return false;
    }
    if (validate.isNotEmpty(fieldValues.hiddenAge)) {
      let intAge = fieldValues.hiddenAge;
      if (intAge != null && (0 < intAge && 101 > intAge)) {
        return true;
      } else {
        setAlertContent({ alertMessage: "Please Enter Age greater than or equal to 1" });
        helpers.updateValue("", "dateOfBirth");
        return false;
      }
    }
  }

  const updateMobileNumber = () => {
    if(helpers.getHtmlElementValue("isRegisteredDoctor") != "Y"){
      helpers.hideGroup("group4")
    }else{
      helpers.showElement("group4")
    }
    if(validate.isNotEmpty(mobileNo)){
      helpers.updateValue(mobileNo, "mobileNumber", false);
    }
    if(props.fromPrescription){
      helpers.disableElement("mobileNumber");
    }
  }

  const submitOnEnter=(payload)=>{
    const [event] = payload;
    event.preventDefault();
    createPharmaCustomer();
  }

  const createCustomer = async (obj) => {
    props.onSubmit(true);
    obj["fromPage"] = props.fromPrescription?"Prescription" : "";
    return await CustomerService().createCustomer(obj).then((result) => {
      if (result && result.statusCode === "SUCCESS" && result.message === "SUCCESS") {
        if(props.fromPrescription){
          props.onCustomerCreate(result.dataObject);
          props.onSubmit(false);
          return;
        }
        props.history.push(`${props.location.pathname}?customerId=${result.dataObject.customerId}`);
        let thePopCode = window.open(`${CRM_UI}/${CUSTOMER}/${result.dataObject.customerId}`);
        if (thePopCode == null || typeof (thePopCode) == "undefined") {
          setStackedToastContent({toastMessage:"Turn off your pop-up blocker!\n\nWe try to open the url"});
        } else {
          thePopCode.focus();
          window.location.reload();
        }
      } else if (result.statusCode == 'FAILURE' && result.message == 'Online account creation failed') {
        setAlertContent({alertMessage:result.message + ",please try again"});
        props.onSubmit(false);
      } else if (result.statusCode == 'FAILURE' && result.message == 'AlreadyMerged') {
        setAlertContent({alertMessage:"Given email id is already exist with other account,Please try with other Email",});
        props.onSubmit(false);
      } else if (result.statusCode == 'FAILURE' && result.message == 'MOBILE_ALREADY_USED') {
        setAlertContent({alertMessage:"Given Mobile Number is already exist with other account,Please try with other Mobile"});
        props.onSubmit(false);
      } else {
        setAlertContent({alertMessage:result.message});
        props.onSubmit(false);
      }
    }).catch(() => {
      setAlertContent({alertMessage:"Customer Creation Failed, Please try after some time"});
      props.onSubmit(false);
      return [];
    });
  }

  const onToggleChange = (payload) => {
    const elementInfo = payload[1]
    if(elementInfo.value != "Y"){
      helpers.hideGroup("group4")
      helpers.hideGroup("confirmClinicAddress")
      helpers.updateValue("","doctorQualification")
      helpers.updateValue("","doctorSpecialty")
      helpers.updateValue("","clinicName")
      helpers.updateValue("","confirmClinicAddress")
    }else{
      helpers.showElement("group4")
    }
  }
  
  const onClinicNameChange = () => {
    helpers.hideElement("confirmClinicAddress")
    if (event.target.value.length > 0) {
      helpers.showElement("confirmClinicAddress")
    }
  }

  const observersMap = {
    'dateOfBirth': [['change', setAge]],
    'isRegisteredDoctor': [['change', onToggleChange]],
    'clinicName':[['change', onClinicNameChange]],
    'newCustomerForm': [['load', updateMobileNumber],['submit',submitOnEnter]]
  }

  return <React.Fragment>
    <DynamicForm requestUrl={`${API_URL}newCustomerForm?fromPage=${props.fromPrescription?"Prescription":""}`} requestMethod={'GET'} helpers={helpers} observers={observersMap} />
  </React.Fragment>

}

export default withFormHoc(CreateCustomerForm);