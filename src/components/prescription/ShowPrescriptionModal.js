import React, { useContext, useState } from "react";
import DynamicForm, { withFormHoc, TOAST_POSITION } from "@medplus/react-common-components/DynamicForm";
import Validate from "../../helpers/Validate";
import PrescriptionService from "../../services/Prescription/PrescriptionService";
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap'
import { AlertContext } from "../Contexts/UserContext";
import { API_URL } from "../../services/ServiceConstants";
import { redirectToPrescriptionCatalogPage } from "../../helpers/CommonRedirectionPages";


const ShowPrescriptionModal = ({ helpers, ...props }) => {
    const { isPrescriptionCancelled, presOrderId, customerId,  mobileNumber, currentStatus, patientName, emailId, showHealthRecord, customerName,locality } = props.requiredProps
    const validate = Validate();
    const prescriptionService = PrescriptionService();
    const { setAlertContent, setStackedToastContent } = useContext(AlertContext);
    const [isLoading,setIsLoading] = useState(false);

    const ButtonSpinners = (value,Elementid ,spinnerSize="sm" , SpinnerColour="secondary" , SpinnerClassName = "custom-button-spinner") => {
        helpers.updateSingleKeyValueIntoField("isLoading",value,Elementid);
        helpers.updateSingleKeyValueIntoField("loaderClassName",SpinnerClassName,Elementid);
        helpers.updateSingleKeyValueIntoField("loaderSize",spinnerSize,Elementid);
        helpers.updateSingleKeyValueIntoField("loaderVariant",SpinnerColour,Elementid);
    }

    let goShopping = true;

    const validateReason = (payload) => {
        const [event] = payload;
        const reason = event.target.value;
        if (validate.isNotEmpty(reason)) {
            helpers.updateValue(reason, 'comments');
            helpers.updateSingleKeyValueIntoField("message", "", "comments");
        } else {
            helpers.updateSingleKeyValueIntoField("value", "", 'comments', false);
        }
    }

  const handleFailure = ({message}) => {
    setStackedToastContent({ toastMessage: message, position: TOAST_POSITION.BOTTOM_START })
  }
  const redirectToCatalog=(customerId,locality)=>{
    redirectToPrescriptionCatalogPage({customerId:customerId,prescriptionId:presOrderId,locality:locality},handleFailure);
  }

    const cancelPrescription = () => {
        const comment = helpers.getHtmlElementValue('comments');
        if (validate.isEmpty(comment)) {
            const commentsRef = helpers.customRef("comments");
            commentsRef.focus();
            helpers.updateSingleKeyValueIntoField("message", "Please enter comment to cancel Prescription", "comments");
        } else {
            helpers.updateSingleKeyValueIntoField("message", "", "comments");
            disableButtons();
            prescriptionService.getCancellationStatus({ prescriptionOrderId: presOrderId, currentStatus: currentStatus, comments: comment[0], customerId: customerId }).then(response => {
                ButtonSpinners(true,"cancelPrescription")
                if (response.message === 'null' || response.message === null || response.message === undefined) {
                    ButtonSpinners(false,"cancelPrescription")
                    setStackedToastContent({ toastMessage: "Failed to cancel prescription" });
                } else if (response.message == 'ERROR') {
                    ButtonSpinners(false,"cancelPrescription")
                    setStackedToastContent({ toastMessage: 'status from backend : ' + response.message });
                } else {
                    ButtonSpinners(false,"cancelPrescription")
                    setStackedToastContent({ toastMessage: "Cancelled Succesfully" });
                    props.setLightBoxOpen(false);
                    props.prescriptionCancelled(presOrderId);
                }
                enableButtons();
            }).catch((error) => {
                ButtonSpinners(false,"cancelPrescription")
                enableButtons();
                console.log(error);
            })
        }
    }

    const sendAlertEmail = () => {

        ButtonSpinners(true,"sendAlertEmail")
        disableButtons();
        prescriptionService.getSentEmailStatus({ paramObject: JSON.stringify({ patientName: patientName ? patientName : 'Sir/Madam', mobile: mobileNumber, presId: presOrderId, mailId: emailId }) }).then(response => {
            if (response.statusCode === 'SUCCESS') {
                if (response.message.toLowerCase() === 'success') {
                    ButtonSpinners(false,"sendAlertEmail")
                    setStackedToastContent({ toastMessage: 'Successfully Email sent' });
                } else {
                    ButtonSpinners(false,"sendAlertEmail")
                    setStackedToastContent({ toastMessage: 'Failed to send Email' });
                }
            } else {
                ButtonSpinners(false,"sendAlertEmail")
                setStackedToastContent({ toastMessage: response.message });
            }
            enableButtons();
        }).catch((error) => {
            ButtonSpinners(false,"sendAlertEmail")
            enableButtons();
            console.log(error);
        })
    }

    const sendSms = () => {
        const selectASms = helpers.getHtmlElementValue('selectASms');
        if (validate.isEmpty(selectASms)) {
            helpers.updateSingleKeyValueIntoField("message", "Please select a sms", "selectASms");
            return
        }else{
            ButtonSpinners(true,"sendSms")
        }
        helpers.disableElement("sendSms");
        disableButtons();
        prescriptionService.getSentSmsStatus({ orderType: 'PRESCRIPTION', mobileNo: mobileNumber, prescriptionId: presOrderId, customerName: customerName, customerId: customerId, smsTemplate: selectASms[0] }).then(response => {
            if (response.statusCode == 'SUCCESS') {
                if (response.message === 'success') {
                    ButtonSpinners(false,"sendSms")
                    setStackedToastContent({ toastMessage: 'Successfully SMS sent' });
                } else {
                    ButtonSpinners(false,"sendSms")
                    setStackedToastContent({ toastMessage: 'Failed to send Eamil' });
                }
            } else {
                ButtonSpinners(false,"sendSms")
                setStackedToastContent({ toastMessage: response.message });
            }
            enableButtons();
        }).catch((error) => {
            ButtonSpinners(false,"sendSms")
            console.log(error);
            enableButtons();
        })
    }

    const shop = () => {
        if (isPrescriptionCancelled && !(currentStatus == "Cancelled" || currentStatus == "ConvertedToOMSOrder")) {
            gotoShopping(customerId,mobileNumber,locality);
        } else if (showHealthRecord == "Y") {
            goShopping = false;
            gotoShopping(customerId, mobileNumber,locality);
        }
    }

    const gotoShopping = (customerId, mobileNumber,locality) => {
        if (validate.isNotEmpty(customerId) && customerId > 0 && customerId.toString().length >= 6) {
            redirectToCatalog(customerId,locality);
        } else {
            assignCustomerData(mobileNumber).then(response => {
                if (response && response.statusCode == 'SUCCESS') {
                    checkCustomerDataByMobile(response);
                } else if (response && response.message != 'FAILURE') {
                    setAlertContent({ alertMessage: response.message })
                } else {
                    setAlertContent({ alertMessage: 'error while getting data' })
                }
                props.setLightBoxOpen(false);
            }).catch(err => {
                console.log(err);
            })
        }
    }
    const assignCustomerData = (mobileNumber) => {
        return prescriptionService.getCustomerData({ mobileNo: mobileNumber });
    }

    const checkCustomerDataByMobile = (response) => {
        const customerDataByMobile = response.dataObject;
        if (response != null || response != undefined || Validate().isNotEmpty(response)) {
            if (validate.isEmpty(customerDataByMobile)) {
                window.open("searchCustomer?mobileNo=" + mobileNumber);
            } else {
                const { customerID } = customerDataByMobile[0];
                redirectToCatalog(customerID);
            }
        } else {
            setStackedToastContent({ toastMessage: "Customer Not Existed" });
        }
    }
    const disableButtons=()=>{
        helpers.disableElement("sendSms");
        helpers.disableElement("cancelPrescription");
        helpers.disableElement("sendAlertEmail");
        setIsLoading(true);
    }

    const enableButtons=()=>{
        helpers.enableElement("sendSms");
        helpers.enableElement("cancelPrescription");
        helpers.enableElement("sendAlertEmail");
        setIsLoading(false);
    }


    const customFunctionsMappingForModal = {
        'reasons': [['select', validateReason]],
        'cancelPrescription': [['click', cancelPrescription]],
        'sendAlertEmail': [['click', sendAlertEmail]],
        'sendSms': [['click', sendSms]],
    }

    return <React.Fragment>
        <React.Fragment>
            <Card className='h-100 border-0'>
                <Card.Header className="bg-white">Customer Prescription</Card.Header>
                <Card.Body className="overflow-auto">
                    <div className="custom-border-bottom-dashed pb-2">
                        <div className="d-grid">
                            <Button role="button" aria-label="Shop Prescription Products" variant="success" size="sm" onClick={() => { shop() }} className="d-flex align-items-center justify-content-center" disabled={isLoading}>
                                <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <g id="sample-collected-icn-16" transform="translate(-101 -120)">
                                        <rect id="Rectangle_10427" data-name="Rectangle 10427" width="24" height="24" rx="3" transform="translate(101 120)" fill="none" />
                                        <g id="np_shop_4364620_000000" transform="translate(104 121.5)">
                                            <path id="Path_50643" data-name="Path 50643" d="M26.835,21.859H19.767a3.08,3.08,0,0,0-3.058,2.719l-1.086,9.237a3.079,3.079,0,0,0,3.058,3.439h9.241a3.079,3.079,0,0,0,3.058-3.439l-1.086-9.237a3.08,3.08,0,0,0-3.058-2.719Zm-7.068-1.027a4.106,4.106,0,0,0-4.077,3.626L14.6,33.695a4.105,4.105,0,0,0,4.077,4.586h9.241A4.105,4.105,0,0,0,32,33.695l-1.086-9.237a4.106,4.106,0,0,0-4.077-3.626Z" transform="translate(-14.575 -17.281)" fill="#080808" fill-rule="evenodd" />
                                            <path id="Path_50644" data-name="Path 50644" d="M37.438,7.277a3.079,3.079,0,0,0-3.079,3.079v2.052a.513.513,0,0,1-1.027,0V10.356a4.106,4.106,0,1,1,8.211,0v2.052a.513.513,0,0,1-1.027,0V10.356a3.079,3.079,0,0,0-3.079-3.079Z" transform="translate(-28.748 -6.25)" fill="#080808" fill-rule="evenodd" />
                                            <path id="Subtraction_83" data-name="Subtraction 83" d="M3.51,7.033a.693.693,0,0,1-.692-.692V4.205H.69A.689.689,0,0,1,0,3.513a.693.693,0,0,1,.692-.691H2.82V.692A.692.692,0,0,1,4.2.692l0,2.13H6.336a.692.692,0,0,1,0,1.383H4.2V6.341A.693.693,0,0,1,3.51,7.033Z" transform="translate(5.191 9)" fill="#080808" />
                                        </g>
                                    </g>
                                </svg> 
                                Shop Prescription Products
                            </Button>
                        </div>    
                    </div>
                    {<DynamicForm requestUrl={`${API_URL}getShowPrescriptionForm`} requestMethod={'GET'} helpers={helpers} observers={customFunctionsMappingForModal} />}
                </Card.Body>
            </Card>
        </React.Fragment>
    </React.Fragment>
}
export default withFormHoc(ShowPrescriptionModal);