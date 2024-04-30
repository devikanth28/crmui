import { imageServerRequest, serverRequest, uploadFilesToServer } from "../../axios"
import EKYC_CONFIG from "./EkycConfig"

export default () => {

    function getEKycInfo(obj) {
        return serverRequest(EKYC_CONFIG.GET_EKYC_INFO,{params:obj});
    }

    function sendSMSToCustomerForKycPending(obj) {
        return serverRequest(EKYC_CONFIG.SEND_SMS_FOR_KYC_PENDING,{params:obj});
    }

    function getCustomerKYCData(obj) {
        return serverRequest(EKYC_CONFIG.GET_CUSTOMER_KYC_DATA,{params:obj});
    }

    function rejectKyc(obj){
        return serverRequest(EKYC_CONFIG.REJECT_KYC,{params:obj});
    }

    function holdKyc(obj) {
        return serverRequest(EKYC_CONFIG.HOLD_KYC,{params:obj});
    }

    function updateKycEmailId(obj) {
        return serverRequest(EKYC_CONFIG.UPDATE_KYC_EMAILID,{params:obj});
    }

    function updateCustomerInfo(obj) {
        return serverRequest(EKYC_CONFIG.UPDATE_CUSTOMER_INFO,{params:obj});
    }

    function updateKycInfo(obj) {
        return serverRequest(EKYC_CONFIG.UPDATE_KYC_INFO,obj);
    }

    function kycVerifyOrTryLater (obj) {
        return serverRequest(EKYC_CONFIG.KYC_VERIFY_OR_TRY_LATER,{params:obj});
    }

    return Object.freeze({getEKycInfo,  
        sendSMSToCustomerForKycPending,
        getCustomerKYCData,
        rejectKyc,
        holdKyc,
        updateKycEmailId,
        updateCustomerInfo,
        updateKycInfo,
        kycVerifyOrTryLater
    });
}   