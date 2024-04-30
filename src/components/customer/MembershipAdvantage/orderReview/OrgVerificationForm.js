import DynamicForm, { withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useContext, useEffect, useState } from "react";
import { API_URL } from "../../../../services/ServiceConstants";
import MembershipService from "../../../../services/Membership/MembershipService";
import Validate from '../../../../helpers/Validate';
import { AlertContext, CustomerContext } from "../../../Contexts/UserContext";

export default withFormHoc(({ helpers, ...props }) => {
    const { customerId } = useContext(CustomerContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const [selectedEmailDomain, setSelectedEmailDomain] = useState('');
    const [errorMsg, setErrorMsg] = useState(false);
    const [username, setUsername] = useState('');
    const [otpRequested, setOtpRequested] = useState(false);
    const [corporateEmailId, setCorporateEmailId] = useState();

    const validate = Validate();
    const membershipService = MembershipService();

    useEffect(()=> {
        getCorporateEmail();
    },[])

    const getCorporateEmail = ()=>{
            MembershipService().getCorporateEmail({"customerId": customerId, "orgId": props.organization.orgId}).then((response) => {
                if(response.statusCode=="SUCCESS" && validate.isNotEmpty(response.dataObject)){
                    if(validate.isNotEmpty(response.dataObject.corporateEmailId)){
                        setCorporateEmailId(response.dataObject.corporateEmailId)
                        hideEmailForm();
                        props.onSuccess();
                    }
                    else{
                        setCorporateEmailId(null)
                    }
                }
                else {
                    setStackedToastContent({ toastMessage: (validate.isNotEmpty(response.dataObject) && validate.isNotEmpty(response.dataObject.responseMessage)) ? response.dataObject.responseMessage : "Unable to get Corporate email." })
                }
            }).catch(err => {
                console.log(err);
                setStackedToastContent({ toastMessage: "Unable to process request" })
            })
    }

    const hideEmailForm =()=>{
        helpers.hideElement('emailDomainGroup');
        helpers.showElement("changeEmail");
        helpers.hideElement("verifyOTP");
        helpers.hideElement("requestOTP");
        setOtpRequested(true);
    }

    const handleInitialData =  () => {
        helpers.hideElement('verifiedEmail');
    }

    const validateUsername = () => {
        setErrorMsg(username.length==0);
    };
    const handleValidation = (e) =>{
        // setErrorMsg(false)
    }

    const handleEmailDomain = payload => {
        setSelectedEmailDomain(payload[0]?.target?.value ? payload[0].target.value : '');
    }

    const requestOtp = async () => {

        if(validate.isEmpty(username)){
            setStackedToastContent({toastMessage : "Please enter email"});
            return ;
        }

        if(validate.isEmpty(selectedEmailDomain)){
            setStackedToastContent({toastMessage : "Please select email domain"});
            return ;
        }

        let generateOtp = {
            customerId: customerId,
            email: `${username}@${selectedEmailDomain}`,
            orgId: props.organization.orgId,
        };

        const response = await MembershipService().generateAndSendOtpForCorporateMailAuthorization(generateOtp);
        if (validate.isNotEmpty(response) && validate.isNotEmpty(response.dataObject) && validate.isNotEmpty(response.statusCode) && "SUCCESS" == response.statusCode) {
            if (validate.isEmpty(response.dataObject.errors)) {
                if(response.dataObject.otpVerified){
                    setStackedToastContent({ toastMessage: "OTP already verified" })
                    handleOTPVerification();
                }else{
                    response.dataObject.resendOtpAllowed ? helpers.showElement("resendOTP") : helpers.hideElement("resendOTP");
                    helpers.hideElement('verifiedEmail');
                    helpers.showElement("enterOTP");
                    helpers.showElement("changeEmail");
                    helpers.showElement("verifyOTP");
                    helpers.disableElement("username");
                    helpers.disableElement("requestOTP");
                    helpers.disableElement('emailDomain');
                    setOtpRequested(true);
                    setStackedToastContent({ toastMessage: "OTP Sent Successfully" })
                }
            } else {

            }
        } else if ("FAILURE" == response?.statusCode && validate.isNotEmpty(response.message)) {
            setStackedToastContent({ toastMessage: response.message })
        }
    }

    const allowToChangeEmail = () => {
        setOtpRequested(false);
        setCorporateEmailId(null);
        helpers.showElement('emailDomainGroup');
        setUsername('');
        helpers.showElement('username');
        helpers.showElement('emailDomain');
        helpers.showElement("requestOTP");
        helpers.updateValue("", 'username', false);
        helpers.updateValue("", 'emailDomain',false);
        helpers.updateValue('', 'enterOTP',false);
        helpers.enableElement('username');
        helpers.enableElement('emailDomain');
        helpers.enableElement("requestOTP");
        helpers.hideElement("resendOTP");
        helpers.hideElement('verifiedEmail');
        helpers.hideElement("enterOTP");
        helpers.hideElement('verifyOTP');
        helpers.hideElement('changeEmail');
    }

    const verifyOTP = async () => {
        if (validate.isEmpty(helpers.getHtmlElementValue("enterOTP"))) {
            return;
        } else {
            const otp = helpers.validateAndCollectValuesForSubmit("enterOTP");
            let validateOtp = {
                customerId: customerId,
                otp: otp["enterOTP"],
                email: `${username}@${selectedEmailDomain}`
            }
            const response = await membershipService.verifyOtpForEmailAuthorization(validateOtp);
            if (validate.isNotEmpty(response)) {
                if (validate.isNotEmpty(response.statusCode) && "SUCCESS" == response.statusCode) {
                    getCorporateEmail();
                    handleOTPVerification();
                }else {
                    setStackedToastContent({ toastMessage: response.message ? response.message : "Error while validating Email Authorization" });
                }
            }
        }
    }

    const handleOTPVerification = () => {
        // helpers.updateValue(`Email id Verified towards Selected Organization : ${username}@${selectedEmailDomain}`, 'verifiedEmail');
        helpers.updateValue('', 'username', false);
        helpers.updateValue('', 'emailDomain', false);
        helpers.updateValue('', 'enterOTP', false);
        helpers.hideElement("emailDomainGroup")
        helpers.hideElement('username');
        helpers.hideElement('emailDomain');
        helpers.hideElement("resendOTP");
        helpers.hideElement("enterOTP");
        helpers.hideElement('verifyOTP');
        helpers.hideElement('requestOTP');
        helpers.showElement('changeEmail');
        // helpers.showElement('verifiedEmail');
        props.onSuccess();
    }

    const resendOTPForEmail = async () => {
        const resendOtp = {
            customerId: customerId,
            email: `${username}@${selectedEmailDomain}`,
            orgId: props.organization.orgId
        }
        const response = await membershipService.resendOtpForEmailAuth(resendOtp);
        if (validate.isNotEmpty(response) && validate.isNotEmpty(response.statusCode) && "SUCCESS" == response.statusCode) {
            response.dataObject.resendOtpAllowed ? helpers.showElement("resendOTP") : helpers.hideElement("resendOTP");
            setStackedToastContent({ toastMessage: "OTP Re-Sent Successfully" })
        } else {
            setStackedToastContent({ toastMessage: response.message ? response.message : '' });
        }
    }

    const observers = {
        'getOrgVerificationForm' : [['load', handleInitialData]],
        'emailDomain': [['select', handleEmailDomain]],
        'requestOTP': [['click', requestOtp]],
        'changeEmail': [['click', allowToChangeEmail]],
        'verifyOTP': [['click', verifyOTP]],
        'resendOTP': [['click', resendOTPForEmail]]
    }

    const emaillabel=()=>{
        return  ( 
          <React.Fragment>
            <div className="col-12 col-lg-4 pe-0">
                <div class="form-floating input-group">
                    <input disabled={otpRequested} placeholder="" aria-label="text input" htmlelementtype="INPUT" type="text" autoComplete="off" id="username" onBlur={validateUsername} value={username} onChange={(e) => {setUsername(e.target.value);setErrorMsg(false)}} onFocus={handleValidation} class={`form-control ${(errorMsg) ? "is-invalid" : ''}`}></input>
                    <label htmlFor="username">Email</label>
                    <span className="input-group-text">@</span>
                    <div className="invalid-feedback">This field is mandatory</div>
                </div>
            </div>
          </React.Fragment>) 
      }

    const customHtml = {
        'emailDomain' : [['INSERT_BEFORE', emaillabel]],
     }

    return <React.Fragment>
        <label className="d-block mb-2 custom-fieldset pb-3">Email Verification</label>
        {validate.isNotEmpty(corporateEmailId) && <div>Email id Verified towards Selected Organization: {corporateEmailId}</div>}
        <div className="mt-4"><DynamicForm requestUrl={`${API_URL}membershipOrgVericationForm?customerId=${customerId}&emailDomains=${props.organization.emailDomains}`} helpers={helpers} requestMethod={'GET'} customHtml={customHtml} observers={observers} />
        </div>
        </React.Fragment>})