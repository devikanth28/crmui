import DynamicForm, { withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useContext, useEffect, useState } from "react";
import { API_URL } from "../../../../services/ServiceConstants";
import MembershipService from "../../../../services/Membership/MembershipService";
import { AlertContext } from "../../../Contexts/UserContext";
import { ProcessType } from "../MembershipHelper";
import { setRegexForOtpForm } from "../../CustomerHelper";

export default withFormHoc(({helpers, ...props}) => {

    const [resendOtpTimer, setResendOtpTimer] = useState(30);
    const {setStackedToastContent} = useContext(AlertContext);

    useEffect(() => {
        let intervalId;
        if (props.isTimerRunning) {
        helpers.disableElement("resendOTP")
          intervalId = setInterval(() => {
            setResendOtpTimer(prevTimer => {
              if (prevTimer === 0) {
                clearInterval(intervalId);
                if(props.setIsTimerRunning){
                  props.setIsTimerRunning(false);
              }
                helpers.showElement("resendOTP");
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
      }, [props.isTimerRunning]);

    const verifyOTP = async () => {
        const otpValueMap = helpers.validateAndCollectValuesForSubmit("enterOTP");
        if(!otpValueMap || !otpValueMap["enterOTP"]){
            return
        }
        let processType = props.processType;
        if([ProcessType.NEW_SUBSCRIPTION , ProcessType.RENEWAL_SUBSCRIPTION].includes(props.processType)){
            processType = 'N'
        }
        let validateOtp = {
            customerId : props.customerId,
            process : processType,
            subscriptionId : props.subscriptionId,
            otpValue: otpValueMap["enterOTP"]
        }
        helpers.disableElement('verifyOTP');
        let response = await MembershipService().validateMembershipOtp(validateOtp, processType);
        if(response.statusCode === "SUCCESS"){
            props.setIsOtpVerified(true);
            if(props.setIsTimerRunning){
              props.setIsTimerRunning(false);
          }
            helpers.disableElement("enterOTP");
            helpers.disableElement("verifyOTP");
            helpers.disableElement("resendOTP");
        }else{ 
            setStackedToastContent({toastMessage: response.message})
            helpers.enableElement('verifyOTP');
        }
    }

    const resendOTP = async () => {
        let resendOtp = {
            customerId : props.customerId,
            process : props.processType,
            otpType : "RESEND",
            members : props.members,
            subscriptionId : props.subscriptionId
        };
        let response = await MembershipService().requestMembershipOtp(resendOtp, props.processType);
        if(response.statusCode === "SUCCESS"){
            setStackedToastContent({toastMessage: "OTP Resend successfully"})
            setResendOtpTimer(30);
            if(props.setIsTimerRunning){
              props.setIsTimerRunning(true);
          }
            helpers.customRef("enterOTP").focus()
        }else{ 
            setStackedToastContent({toastMessage: response.message})
        }
        helpers.enableElement('resendOTP');
    }

    const onFormLoad =()=>{
      if(props.isTimerRunning)
        // helpers.hideElement("resendOTP")
      helpers.customRef("enterOTP").focus();
      setRegexForOtpForm(helpers, "enterOTP");
    }

    const resendOTPTimer = () => {
      return props.isTimerRunning && <div className="font-weight-bold">Resend OTP in <span className="text-warning">{resendOtpTimer}</span> seconds</div>
    }

    const submitOnEnter=(payload)=>{
      const [event] = payload;
      event.preventDefault(); 
      verifyOTP();
    }

    const observers = {
      'verifyOTP' : [['click', verifyOTP]],
      'resendOTP' : [['click', resendOTP]],
      'membershipOtpVerificationForm' : [['load', ()=> onFormLoad()], ['submit', submitOnEnter]],
    }

    const customHtml = {
      'resendOTP':[['INSERT_AFTER' , resendOTPTimer]]
    } 

    return  <React.Fragment>
                <DynamicForm requestUrl={`${API_URL}membershipOTPVerificationForm`} helpers={helpers} requestMethod={'GET'} observers={observers} customHtml={customHtml}/>
                 
            </React.Fragment>
})