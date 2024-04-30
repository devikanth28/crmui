import DynamicForm, { CustomSpinners, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Validate from '../../../helpers/Validate';
import { useTimer } from '../../../hooks/useTimer';
import AgentAppService from '../../../services/AgentApp/AgentAppService';
import { AGENT_UI, MA_API_URL } from '../../../services/ServiceConstants';
import { BodyComponent, HeaderComponent, Wrapper } from '../../Common/CommonStructure';
import { AgentAppContext, AlertContext } from '../../Contexts/UserContext';
import { CartSummary } from './CartSummary';

const index = ({ helpers, ...props }) => {
    const { tpaTokenId } = useContext(AgentAppContext);
    const maForAgentAppService = AgentAppService(tpaTokenId);
    const validate = Validate();
    const { setToastContent } = useContext(AlertContext);
    const { processType } = props.match.params;
    const mobileNumber = props.match.params.mobileNumber;
    const [cartSummary, setCartSummary] = useState({});
    const [edcInfo, setEDCInfo] = useState(undefined);
    const [isThirdPartyAgent, setIsThirdPartyAgent] = useState(undefined);
    const [timerDiff, setTimerDiff, setTimer, clearTimer] = useTimer();
    const [resendOtpTimer, setResendOtpTime] = useState('');
    const [resendOtpAllowed, setResendOtpAllowed] = useState(false);
    const [backDropLoader, setDropDownLoader] = useState(false)
    const [verifyOtpLoader, setveriFyOtpLoader] = useState(false)
    const headerRef = useRef();
    const footerRef = useRef();

    useEffect(() => {
        if (validate.isEmpty(processType) || ("N" != processType && "A" != processType)) {
            return;
        }
        requestOtpToVerifyMemberDetails(null, "GENERATE");
        getCartSummary();
    }, []);

    useEffect(() => {
        if (timerDiff <= 0) {
            setResendOtpTime('');
        } else {
            let diff = timerDiff / 1000;
            let diffInMinutes = parseInt(diff / 60);
            let diffInSeconds = parseInt(Math.floor(diff) % 60);
            if (diffInMinutes < 10) {
                diffInMinutes = `0${diffInMinutes}`;
            }
            if (diffInSeconds < 10) {
                diffInSeconds = `0${diffInSeconds}`;
            }
            setResendOtpTime(`${diffInMinutes}:${diffInSeconds}`);
        }

    }, [timerDiff])

    useEffect(() => {
        if (validate.isEmpty(resendOtpTimer)) {
            helpers.showElement("resendOTP");

        } else {
            helpers.hideElement("resendOTP");
        }
    }, [resendOtpTimer])

    const handleTimer = () => {
        let currentDate = new Date();
        const otpExpiryTimer = 30;
        currentDate.setSeconds(currentDate.getSeconds() + otpExpiryTimer);
        setTimer(currentDate.getTime());
    }

    const requestOtpToVerifyMemberDetails = (payload, otpType) => {
        if ("RESEND" == otpType) {
            const [event] = payload;
            event.preventDefault();
        }
        setDropDownLoader(true)
        helpers.disableElement("resendOTP")
        helpers.updateSingleKeyValueIntoField("label", null,"resendOTP")
        maForAgentAppService.requestOtpToVerifyMemberDetails({ processType: processType, otpType: otpType }).then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.responseData)) {
                setToastContent({ toastMessage: "Otp sent to customer mobile" });
                if(response.responseData.resendOtpAllowed) {
                    helpers.showElement("resendOTP");
                    handleTimer();
                }
            }
            if (validate.isNotEmpty(response) && response.statusCode == "FAILURE" && validate.isNotEmpty(response.message)) {
                setToastContent({ toastMessage: response.message });
                if(!response.responseData.resendOtpAllowed) {
                    helpers.hideElement("resendOTP");
                }
            }
            setResendOtpAllowed(response.responseData.resendOtpAllowed);
            setDropDownLoader(false)
            helpers.enableElement("resendOTP")
            helpers.updateSingleKeyValueIntoField("label", "Resend OTP","resendOTP")
        }).catch(error => {
            console.log(error);
            setToastContent({ toastMessage: "Unable to resend OTP.Please try again!" });
            setDropDownLoader(false)
            helpers.enableElement("resendOTP")
            helpers.updateSingleKeyValueIntoField("label", "Resend OTP","resendOTP")
        });
    }



    const validateOtp = (payload) => {
        const [event] = payload;
        event.preventDefault();
        let fieldValues = helpers.collectValuesForSubmit("customerOtpVerificationForm");
        if (validate.isEmpty(fieldValues) || validate.isEmpty(fieldValues.otpValue)) {
            return false;
        }
        helpers.disableElement("verifyOTP")
        setveriFyOtpLoader(true)
        helpers.updateSingleKeyValueIntoField("label", null,"verifyOTP")
        maForAgentAppService.validateOtp({ processType: processType, otp: fieldValues.otpValue }).then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS") {
                redirectToPaymentPage();
            }

            if (validate.isNotEmpty(response) && response.statusCode == "FAILURE" && validate.isNotEmpty(response.message)) {
                setToastContent({ toastMessage: response.message });
                helpers.enableElement("verifyOTP")
                setveriFyOtpLoader(false)
                helpers.updateSingleKeyValueIntoField("label", "Verify OTP","verifyOTP")
            }
        }).catch(error => {
            console.log(error);
            setToastContent({ toastMessage: "Failed to validate OTP. Please try again..!" });
            helpers.enableElement("verifyOTP")
            setveriFyOtpLoader(false)
            helpers.updateSingleKeyValueIntoField("label", "Verify OTP","verifyOTP")
        });

    }

    const resendOTP = (payload) => {
        requestOtpToVerifyMemberDetails(payload, "RESEND");
    }

    const getCartSummary = () => {
        maForAgentAppService.getCartSummary().then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.responseData)) {
                if (validate.isNotEmpty(response.responseData.cartSummary)) {
                    setCartSummary(response.responseData.cartSummary);
                }
                setEDCInfo(response.responseData.edcDevices);
                setIsThirdPartyAgent(response.responseData.isThirdPartyAgent);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const redirectToPaymentPage = () => {
        let paymentInfo = {
            isThirdPartyAgent: isThirdPartyAgent,
            edcInfo: edcInfo,
            cartSummary: cartSummary
        }
        props.history.replace({ pathname: `${AGENT_UI}/maPayment`, state: { paymentInfo } });
    }

    const observersMap = {
        'resendOTP': [['click', (payload) => resendOTP(payload)]],
        'verifyOTP': [['click', (payload) => validateOtp(payload)]]
    }

    const insertTimer = () => {

        return (
            <React.Fragment>
                {validate.isNotEmpty(cartSummary) && validate.isNotEmpty(resendOtpTimer) && <p title={"Resend OTP in " + resendOtpTimer} className="mb-0 text-secondary">{`Resend in ${resendOtpTimer}`}</p>}
            </React.Fragment>
        );
    }

    const customLoaderForResend = () => {
        return(
            <>
            {backDropLoader && <CustomSpinners spinnerText={"submit"} className={" spinner-position"} innerClass={"invisible"} />}
            </>
        )
    }

    const customLoaderForVerify = () => {
        return(
            <>
            {verifyOtpLoader && <CustomSpinners spinnerText={"submit"} className={" spinner-position"} innerClass={"invisible"} />}
            </>
        )
    }

    const customHtmlMap = {
        'verifyOTP': [['INSERT_BEFORE', insertTimer], ['INSERT_IN' , customLoaderForVerify]],
        'resendOTP': [['INSERT_IN' , customLoaderForResend]],
    }



    return (
        <>
            <Wrapper>
                <HeaderComponent ref={headerRef} className="p-12 border-bottom">
                    Order Review
                </HeaderComponent>
                <BodyComponent className="body-height" allRefs={{ headerRef, footerRef }}>

                    {validate.isNotEmpty(cartSummary) && <DynamicForm requestUrl={`${MA_API_URL}/customerOtpVerificationForm`} helpers={helpers} customHtml={customHtmlMap} requestMethod={'GET'} observers={observersMap} headers={props.headers} />}
                    {validate.isNotEmpty(cartSummary) && <CartSummary title={true} cartSummary={cartSummary} />}
                </BodyComponent>
            </Wrapper>
        </>
    )
}

export default withFormHoc(index)