import DynamicForm, { TOAST_POSITION, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import { format } from "date-fns";
import React, { useContext, useState } from "react";
import Validate from "../../../helpers/Validate";
import CustomerService from "../../../services/Customer/CustomerService";
import { API_URL } from "../../../services/ServiceConstants";
import { Button, Modal } from 'react-bootstrap';
import { AlertContext } from '../../Contexts/UserContext';
import ButtonWithSpinner from '../../Common/ButtonWithSpinner';
import CommonConfirmationModal from '../../Common/ConfirmationModel';
import { Wrapper, BodyComponent } from "../../Common/CommonStructure";

const BioUserForm = ({ helpers, getCustomerInfo, customerData, setShowCustomerEditForm, showCustomerEditForm }) => {

    const { customerInfo } = customerData;

    const { firstName, lastName, gender, mobileNumber, landLine, emailId, customerID, dateOfBirth, accountType, webLoginID,receiveUpdates } = customerInfo;

    const validate = Validate();
    const [loader,setLoader] = useState(false);

    const {setStackedToastContent} = useContext(AlertContext)

    const [buttonSpinner, setButtonSpinner] = useState(false);

    const [isConfirmationPopOver , setConfirmationPopOver] = useState(false);



    const updateCustomerData = async (formValues) => {
        setLoader(true);
        try {
            const config = { data: formValues };
            const response = await CustomerService().updateCustomerData(config);
            if (validate.isNotEmpty(response)) {
                setButtonSpinner(false);
                if (response.statusCode === "FAILURE") {
                    setStackedToastContent({toastMessage: response.message? response.message:"Customer Details Updation failed,please try again", position:TOAST_POSITION.BOTTOM_START})
                } else if (response.statusCode === "SUCCESS" && validate.isNotEmpty(response.dataObject) && validate.isNotEmpty(response.dataObject.customerInfo)) {
                    getCustomerInfo();
                    setStackedToastContent({toastMessage:"Customer Details Updated", position:TOAST_POSITION.BOTTOM_START })
                }
                setShowCustomerEditForm(false);
            }
            else{
                setButtonSpinner(false);
                setStackedToastContent({toastMessage: "Something Went Wrong", position:TOAST_POSITION.BOTTOM_START})
            }

        }
        catch (err) {
            setButtonSpinner(false);
            console.log("Error Occured while  updaing customer Data", err);
            setStackedToastContent({toastMessage: "Something went wrong, please try again later", position:TOAST_POSITION.BOTTOM_START})
            setLoader(false);
        }
        setLoader(false);
    }

    function calculateAge(dateOfBirth) {
        const ageDiff = new Date(Date.now() - new Date(dateOfBirth).getTime());
        return Math.abs(ageDiff.getUTCFullYear() - 1970);
    }

    const updateCustomer = () => {
        setButtonSpinner(true);
        const fieldValues = helpers.validateAndCollectValuesForSubmit('customerDetailsForm');
        if (validate.isEmpty(fieldValues)) {
            setButtonSpinner(false);
            //setStackedToastContent({toastMessage:"Customer Details Updation failed,please try again", position: TOAST_POSITION.BOTTOM_START})
        } else {
            const values = {
                ...fieldValues,
                receiveUpdates: validate.isEmpty(fieldValues.receiveUpdates) ? "0" : "1",
                accountType : accountType
            }
            if (new Date(values.dateOfBirth).getTime() > new Date().getTime()) {
                setButtonSpinner(false);
                setStackedToastContent({toastMessage: "Please select Date Of Birth and It should be Less Than or Equal to today's date", position:TOAST_POSITION.BOTTOM_START})
                return
            }
            if((validate.isNotEmpty(emailId) || validate.isNotEmpty(values.emailId)) && validate.isNotEmpty(validate.email(values.emailId))){
                setButtonSpinner(false);
                helpers.updateErrorMessage(validate.email(values.emailId),'emailId');
                return;
            }

            if(validate.isNotEmpty(values.landLine) && !/^0[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/.test(values.landLine)) {
                setButtonSpinner(false);
                return;
            }
            const maxDateOfBirth = new Date(Date.now());
            const custAge = calculateAge(values.dateOfBirth);
            if (custAge < 0 || custAge > 99) {
                setButtonSpinner(false);
                setStackedToastContent({toastMessage: `Date of birth should be ( ${(maxDateOfBirth.getUTCFullYear()) - 99} - ${maxDateOfBirth.getUTCFullYear()} ) Years Range` , position:TOAST_POSITION.BOTTOM_START})
                return
            }
            updateCustomerData(values);
        }
        setButtonSpinner(false);
    }

    const updateCustomerConfirmation = () => {
        setConfirmationPopOver(true);
    }
    
    const setCard = () => {
        if (validate.isNotEmpty(customerInfo)) {
            const fieldValues = {
                firstName,lastName,gender,mobileNumber,landLine,emailId, "customerId": customerID, "dateOfBirth": format(new Date(dateOfBirth), "yyyy-MM-dd"),accountType, "actualMobileNumber": mobileNumber,webLoginID
            };
            helpers.updateSpecificValues(fieldValues, "customerDetailsForm");
            if(receiveUpdates==="1"){
                helpers.updateValue(["Y"],"receiveUpdates");
            }  
            else{
                helpers.updateValue([null],"receiveUpdates");
          }  
        }
    }

    const closeModal = () => {
        setShowCustomerEditForm(false);
    }

    const validateLandLine = (event) => {
        let landline = event[0].target.value 
        if(validate.isNotEmpty(landline) && !/^0[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/.test(landline)) {
            helpers.updateErrorMessage("Number should start with 0 and allows Max 11 Digits Only!",'landLine')
        } else {
            helpers.updateErrorMessage("",'landLine');
        }
    }

    const observersMap = {
        'customerDetailsForm': [['load', setCard]],
        'landLine' : [['change',validateLandLine],['click',validateLandLine]]
    }

    return (
        <React.Fragment>
             <div className='custom-border-bottom-dashed'>
             {showCustomerEditForm && customerInfo && !isConfirmationPopOver && <Modal
                show={true}
                backdrop="static"
                onHide={() => { setShowCustomerEditForm(false) }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                    <Modal.Header closeButton>
                        <Modal.Title className='h6'>Edit User Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <DynamicForm requestUrl={`${API_URL}getCustomerBioForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />
                    </Modal.Body>

                <Modal.Footer className='d-flex flex-row-reverse gap-2 justify-content-center'>
                    <ButtonWithSpinner showSpinner={loader} onClick={()=>updateCustomerConfirmation()} buttonText="Update" className='px-4'/>
                    <Button variant=' ' disabled={loader} className='brand-secondary px-4' onClick = {()=> {closeModal()}} >Cancel</Button>
                </Modal.Footer>
                </Modal>}
                </div>
                {isConfirmationPopOver && <CommonConfirmationModal small headerText={"Edit Customer"} message="Are you sure, you want to update customer details?" isConfirmationPopOver={isConfirmationPopOver} setConfirmationPopOver={setConfirmationPopOver} buttonText={"Yes"} onSubmit={() => updateCustomer()} />}
        </React.Fragment>
    )
}
export default withFormHoc(BioUserForm);