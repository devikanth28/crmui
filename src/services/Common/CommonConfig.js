import { API_URL, END_POINT, REQUEST_TYPE } from "../ServiceConstants";

const COMMON_CONFIG = {

    USER_SESSION_DETAILS: {
        url: "/get-session-details",
        method:REQUEST_TYPE.GET
    },
    GET_USER_SAVED_SEARCHES: {
        url: "getUserSavedSearches",
        method:REQUEST_TYPE.GET
    },
    SAVE_USER_SEARCH: {
        url: `${API_URL}saveUserSearch`,
        method:REQUEST_TYPE.POST
    },
    INACTIVATE_USER_SEARCH: {
        url: `inactivateUserSearch`,
        method:REQUEST_TYPE.POST
    },
    TEST_AUTH : {
        url: "/testController",
       //url: "/getAddressAndCommunities",
       method:REQUEST_TYPE.GET,
      // endPoint:END_POINT.CUSTOMER,
   },
    INSERT_COMMUNICATION_LOG: {
        url: "/insertcommunicationLog",
        method: REQUEST_TYPE.POST

    },
    VALIDATE_ORDER_ID: {
        url: "/validateOrderIdToInsertInCommLog",
        method: REQUEST_TYPE.POST

    },
    UPDATE_CALL_ATTENDED_STATUS: {
        url: "/updateCallAttendedStatus",
        method: REQUEST_TYPE.POST

    },
    FOLLOWUP_CLAIMED_ORDERS: {
        url: "/getFollowupClaimedOrders",
        method: REQUEST_TYPE.GET,
    },
    GET_COMMUNICATION_LOG_DETAILS: {
        url: "/getCommunicationLogDetails",
        method: REQUEST_TYPE.GET
    },
    GET_FOLLOWUP_META_INFO: {
        url: "/getFollowUpMetaInfo",
        method: REQUEST_TYPE.GET
    },
    CUSTOMER_HEADER_DATA : {
    url: "/getCustomerHeaderData",
       method:REQUEST_TYPE.GET,
       endPoint:END_POINT.CUSTOMER, 
   },
   GET_CLAIMED_RECORDS_COUNT : {
    url: "/getClaimedRecordsCount",
       method:REQUEST_TYPE.GET
   },
   GET_CUSTOMER_REQUEST : {
    url: "/searchCustomerRequest",
    method:REQUEST_TYPE.GET
   },
   APPROVE_CUSTOMER_CHANGE_REQUEST : {
    url: "/approveCustomerchangeRequest",
    method: REQUEST_TYPE.GET
   },
   REJECT_CUSTOMER_CHANGE_REQUEST : {
    url: "/rejectCustomerchangeRequest",
    method: REQUEST_TYPE.GET
   },
   SEND_SMS_FOR_CHANGE_REQUEST:{
    url: "/sendSMSToNotRespondingCustomer",
    method: REQUEST_TYPE.GET 
   },
   GET_LEDGERS:{
    url: "/getLedgers",
    method: REQUEST_TYPE.GET
   },
   GET_TOKEN:{
    url: "/generateToken",
    method: REQUEST_TYPE.GET
   },
   SEND_OTP_TO_MOBILE:{
    url:"/sendOtpForMobileNumber",
    method:REQUEST_TYPE.POST
   },
   VERIFY_OTP:{
    url:"/verifyOtpForMobileNumber",
    method:REQUEST_TYPE.POST
   },
   UPDATE_CUSTOMER:{
    url:"/updateCustomer",
    method:REQUEST_TYPE.POST
   },
   VERIFY_KYC_DOC:{
    url:"/verifyMobileKycDocument",
    method:REQUEST_TYPE.POST
   },
   UPLOAD_PRESCRIPTION:{
    url:"/uploadPrescription",
    method:REQUEST_TYPE.POST,
    endPoint:END_POINT.CUSTOMER
   },
   SET_LOCALITY:{
    url:"/setLocality",
    method:REQUEST_TYPE.GET,
    endPoint:END_POINT.MART_COMMON
   },
   VALIDATE_TOKEN:{
    url:"/validateToken",
    method:REQUEST_TYPE.POST,
    endPoint:END_POINT.MART_COMMON
   },
   CHECK_MOBILE_NUM:{
    url:"checkMobileNumber",
    method:REQUEST_TYPE.POST,
   }
}
export default COMMON_CONFIG;