import DynamicForm, { CustomSpinners, withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useContext, useEffect, useState } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { API_URL, REQUEST_TYPE } from '../../../services/ServiceConstants';
import { Button } from 'react-bootstrap';
import MembershipService from "../../../services/Membership/MembershipService";
import { AlertContext, CustomerContext } from "../../Contexts/UserContext";
import Validate from "../../../helpers/Validate";
import { setRegexForOtpForm } from "../CustomerHelper";
const CancelReasonForm = ({helpers, isModalOpen, ...props}) => {

    const {customerId,  customer, setCustomer} = useContext(CustomerContext);
    const {setStackedToastContent} = useContext(AlertContext);
    const validate = Validate();
    const [otpSent,setOtpSent] = useState(false); 
    const [otpVerified,setOtpVerified] = useState(false);
    const [resendOtp,setResendOtp] = useState(false);
    const [selectedReason,setSelectedReason] = useState('');
    const [resendLoading,setResendLoading] = useState(false);
    const [requestOtpLoading,setRequestOtpLoading] = useState(false);
    const [cancelSubscritpionLoading,setCancelSubscriptionLoading] = useState(false);
    const [resendOtpTimer, setResendOtpTimer] = useState(30);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        let intervalId;
        if (isTimerRunning) {
        helpers.disableElement("resendOTP")
          intervalId = setInterval(() => {
            setResendOtpTimer(prevTimer => {
              if (prevTimer === 0) {
                clearInterval(intervalId);
                setIsTimerRunning(false);
                helpers.enableElement("resendOTP");
                return 30;
              } else {
                return prevTimer - 1;
              }
            });
          }, 1000);
        }
    
        return () => {
          clearInterval(intervalId);
        };
      }, [isTimerRunning]);

    const resetForm = () => {
        setOtpSent(false);
        setResendOtp(false);
        setOtpVerified(false);
        setResendLoading(false);
        setRequestOtpLoading(false);
        setCancelSubscriptionLoading(false);
        helpers.hideElement('enterOTP')
    }

    const handleReason = (payload) => {
            resetForm();
            setSelectedReason(payload[0].target.value ? payload[0].target.value : '');
    }

        const requestOtp = async (otpType) => {
            setRequestOtpLoading('GENERATE' == otpType ? true : false);
            setResendLoading('RESEND' == otpType ? true : false);
            if(validate.isEmpty(selectedReason)){
                helpers.updateErrorMessage("Please select a Reason","reason");
                setRequestOtpLoading(false);
                return;
            }else{
                let generateOtp = {
                    customerId : customerId,
                    otpType : otpType,
                    members : props.subscription.members,
                    subscriptionId : props.subscription.id
                };
                let response = await MembershipService().requestMembershipOtp(generateOtp, "C");
                if(validate.isNotEmpty(response) && validate.isNotEmpty(response.message) && "SUCCESS" == response.message){
                    setResendOtpTimer(30);
                    setIsTimerRunning(true);
                    helpers.showElement("enterOTP");
                    setOtpSent(true);
                    if(validate.isNotEmpty(response.dataObject)){
                        setOtpVerified(response.dataObject.otpVerified);
                        setResendOtp(response.dataObject.resendOtpAllowed);
                        setStackedToastContent({ toastMessage: "OTP send successfully" });
                    }
                } else if (validate.isNotEmpty(response.message) && "FAILURE" == response.statusCode) {
                    setStackedToastContent({ toastMessage: response.message });
                }
            }
            setResendLoading(false);
            setRequestOtpLoading(false);
        }

        const cancelSubscription = async() => {
                const otpValueMap = helpers.validateAndCollectValuesForSubmit("enterOTP");
                if(validate.isEmpty(otpValueMap)){
                    return;
                }
                setCancelSubscriptionLoading(true);
                let validateOtp = {
                    customerId : customerId,
                    process : 'C',
                    subscriptionId : props.subscription.id,
                    otpValue: otpValueMap["enterOTP"]
                }
                let response = await MembershipService().validateMembershipOtp(validateOtp, 'C');
                if(response.statusCode === "SUCCESS"){
                    setOtpVerified(true);
                    const status = "ACTIVE" == props.subscription.status ? (props.isRefundEligible ? "R" : "I"): "A";
                   // reason: (status === "A" ? $scope.reasonObj.activateReason : $scope.reasonObj.cancelReason)
                    let config = {status: status,customerId:customerId,comboPlanId:props.subscription.comboPlanId, subId: props.subscription.id, reason: selectedReason[0]};

                    MembershipService().updateSubscription(config).then(res=> {
                        if(validate.isNotEmpty(res) && validate.isNotEmpty(res.statusCode) && "SUCCESS" == res.statusCode){
                            props.onSuccess();
                            setCustomer({...customer, refreshData:true})
                            helpers.hideElement("getCancelReason");
                            props.resetPage();
                            props.setToggleEdit(false);
                            setStackedToastContent({toastMessage:"Subscription cancelled successfully"});
                        }else if(validate.isNotEmpty(res.message) && "SUCCESS" != res.statusCode){
                            setStackedToastContent({toastMessage:res.message});
                        }
                    })
                }else{ 
                    setStackedToastContent({toastMessage: response.message})
                }
                setCancelSubscriptionLoading(false);
            }
        
        const onFormLoad = () => {
            setRegexForOtpForm(helpers, "enterOTP");
        }
        
       
    const observersMap = {
        "reason" : [['select', handleReason]],
        "getCancelReason" : [['load', ()=> onFormLoad()]],
        
    }
  return (
      <Modal className={"modal-dialog-centered modal-lg"} isOpen={isModalOpen}>
          
          {<ModalHeader className='d-flex justify-content-between modal-header p-2' close={<Button variant="link" className="align-self-center icon-hover rounded-5" type="button" onClick={() => props.setToggleEdit(!isModalOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <rect fill="none" width="24" height="24" />
                  <path d="M20.76,19.55l-7.58-7.56,7.56-7.56a.846.846,0,0,0-.04-1.18.822.822,0,0,0-1.13,0L12,10.81,4.44,3.24A.827.827,0,0,0,3.27,4.41l7.56,7.58L3.27,19.55a.835.835,0,0,0,1.14,1.22l.04-.04L12,13.17l7.56,7.56a.833.833,0,0,0,1.17,0h0a.821.821,0,0,0,.04-1.16A.031.031,0,0,0,20.76,19.55Z" fill="#b9b9b9" />
              </svg>
          </Button>}>
           Cancel Reason
          </ModalHeader>}
          <ModalBody className='p-2'>
              <DynamicForm requestMethod={REQUEST_TYPE.GET} requestUrl={`${API_URL}getSubscriptionCancelReasons`} helpers={helpers} observers={observersMap} />
          </ModalBody>
          <ModalFooter className="justify-content-center p-2">
              <div>
                  <Button variant=" " size="sm" className="px-4 me-3 brand-secondary" onClick={() => props.setToggleEdit(!isModalOpen)}> Close </Button>
                  {!otpSent && <Button size="sm" variant=" " className="px-4 me-3 btn-brand" disabled={requestOtpLoading} onClick={() => {requestOtp("GENERATE")}} >{ requestOtpLoading? <CustomSpinners spinnerText={"Request Otp for Cancellation"} className={" spinner-position"} innerClass={"invisible"} />: 'Request Otp for Cancellation'} </Button>}
                  {otpSent && <Button size="sm" variant=" " className="px-4 me-3 btn-brand" onClick={(e) => { cancelSubscription(e) }} >{cancelSubscritpionLoading? <CustomSpinners spinnerText={"Cancel Subscription"} className={" spinner-position"} innerClass={"invisible"} />: 'Cancel Subscription'} </Button>}
                  {!isTimerRunning && otpSent && resendOtp && <Button size="sm" variant=" " className="px-4 me-3 btn-brand" disabled={resendLoading} onClick={() => { requestOtp("RESEND") }} >{resendLoading? <CustomSpinners spinnerText={"Resend Otp"} className={" spinner-position"} innerClass={"invisible"} />: 'Resend Otp'}</Button>}
                  {isTimerRunning && <span>Resend OTP in {resendOtpTimer} seconds</span>}

              </div>
          </ModalFooter>
      </Modal>
  )
}

export default withFormHoc(CancelReasonForm);