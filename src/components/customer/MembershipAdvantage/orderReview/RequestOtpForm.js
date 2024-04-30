import DynamicForm, { withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useContext } from "react";
import { API_URL } from "../../../../services/ServiceConstants";
import MembershipService from "../../../../services/Membership/MembershipService";
import { ProcessType } from "../MembershipHelper";
import Validate from "../../../../helpers/Validate";
import { AlertContext } from "../../../Contexts/UserContext";

export default withFormHoc(({helpers, ...props}) => {

    const {setStackedToastContent} = useContext(AlertContext);

    const requestOtp = async () => {
        helpers.disableElement("requestOtp");
        let generateOtp = {
            customerId : props.customerId,
            otpType : "GENERATE",
            members : props.members,
            subscriptionId : props.subscriptionId
        };
        let processType = props.processType;
        if([ProcessType.NEW_SUBSCRIPTION , ProcessType.RENEWAL_SUBSCRIPTION].includes(props.processType)){
            processType = 'N'
        } 
        let response = await MembershipService().requestMembershipOtp(generateOtp, processType);
        if(Validate().isNotEmpty(response) && response.statusCode == 'SUCCESS') {
            if(props.setOtpRequested){
                props.setOtpRequested(true);
            }
            if(props.setIsTimerRunning){
                props.setIsTimerRunning(true);
            }
            helpers.disableElement("mobileNumber");
        } else {
            setStackedToastContent({toastMessage: response?.message ? response.message : "Unable to send Otp"})
        }
    }

    const observers = {
        'requestOtp' : [['click', requestOtp]]
    }

    return  <React.Fragment>
                <DynamicForm requestUrl={`${API_URL}membershipRequestOtpForm?customerId=${props.customerId}`} helpers={helpers} requestMethod={'GET'} observers={observers} />
            </React.Fragment>
})