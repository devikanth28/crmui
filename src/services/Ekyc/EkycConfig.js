import { REQUEST_TYPE } from "../ServiceConstants";

const EKYC_CONFIG = {

    GET_EKYC_INFO : {
        url: "/getEKycInfo",
        method: REQUEST_TYPE.GET
    },
    SEND_SMS_FOR_KYC_PENDING : {
        url: "/sendSMSToCustomerForKycPending",
        method: REQUEST_TYPE.GET
    },
    GET_CUSTOMER_KYC_DATA : {
        url: "/getCustomerKYCData",
        method: REQUEST_TYPE.GET
    },
    REJECT_KYC : {
        url: "/kycReject",
        method: REQUEST_TYPE.GET
    },
    HOLD_KYC : {
        url: "/kycHold",
        method: REQUEST_TYPE.GET
    },
    UPDATE_KYC_EMAILID : {
        url : "/updateKycEmailId",
        method: REQUEST_TYPE.GET
    },
    UPDATE_CUSTOMER_INFO : {
        url: "/updateCustomerInfo",
        method: REQUEST_TYPE.GET
    },
    UPDATE_KYC_INFO : {
        url: "/updateKyc",
        method: REQUEST_TYPE.POST
    },
    KYC_VERIFY_OR_TRY_LATER : {
        url: "/kycVerifyOrTryLater",
        method:REQUEST_TYPE.GET
    },
    GET_IMAGE_SERVER: {
        url: "/get-image-server",
        method:REQUEST_TYPE.GET
    }
}

export default EKYC_CONFIG;