import { serverRequest } from "../../axios";
import COMMON_CONFIG from "./CommonConfig";

const UserService =  () => {
    const getUserSessionDetails = (config) => {
        return serverRequest(COMMON_CONFIG.USER_SESSION_DETAILS,config);
    }
    const getUserSavedSearches = (config) => {
        return serverRequest(COMMON_CONFIG.GET_USER_SAVED_SEARCHES,config);
    }
    const inactivateUserSearch = (config) => {
        return serverRequest(COMMON_CONFIG.INACTIVATE_USER_SEARCH,{ params: config });
    }
    function testAuth (config) {
         return serverRequest(COMMON_CONFIG.TEST_AUTH,config);
    }
    const getInsertCommunicationLog = (obj) => {
        return serverRequest(COMMON_CONFIG.INSERT_COMMUNICATION_LOG ,  {params: obj});
    }
    const validateOrderId = (obj) => {
        return serverRequest(COMMON_CONFIG.VALIDATE_ORDER_ID, {params: obj});
    }
    const updateCallAttendedStatus=(obj)=>{
        return serverRequest(COMMON_CONFIG.UPDATE_CALL_ATTENDED_STATUS, {params: obj});
    }
    const getCommunicationLogDetails=(obj)=>{
        return serverRequest(COMMON_CONFIG.GET_COMMUNICATION_LOG_DETAILS, {params: obj});
    }
    const getFollowUpMetaInfo=(obj)=>{
        return serverRequest(COMMON_CONFIG.GET_FOLLOWUP_META_INFO, {params: obj});
    }
    const getFollowupClaimedOrders=()=>{
        return serverRequest(COMMON_CONFIG.FOLLOWUP_CLAIMED_ORDERS,{params: null});
    }
    function customerHeaderData (obj) {
        return serverRequest(COMMON_CONFIG.CUSTOMER_HEADER_DATA, obj);
    }
    function getClaimedRecordsCount (obj) {
        return serverRequest(COMMON_CONFIG.GET_CLAIMED_RECORDS_COUNT,{params: obj});
    }
    function searchCustomerRequest (obj) {
        return serverRequest(COMMON_CONFIG.GET_CUSTOMER_REQUEST,{params: obj});
    }
    function approveCustomerChangeRequest (obj) {
        return serverRequest(COMMON_CONFIG.APPROVE_CUSTOMER_CHANGE_REQUEST,{params: obj});
    }
    function rejectCustomerChangeRequest (obj) {
        return serverRequest(COMMON_CONFIG.REJECT_CUSTOMER_CHANGE_REQUEST,{params: obj});
    }
    function sendSmsToCustomerForChangeRequest (obj) {
        return serverRequest(COMMON_CONFIG.SEND_SMS_FOR_CHANGE_REQUEST,{params: obj});
    }
    function getLedgers (obj) {
        return serverRequest(COMMON_CONFIG.GET_LEDGERS,{params: obj});
    }

    function getToken (obj) {
        return serverRequest(COMMON_CONFIG.GET_TOKEN,obj);
    }

    function sendOtpToMobile(obj){
        return serverRequest(COMMON_CONFIG.SEND_OTP_TO_MOBILE, obj);
    }

    function verifyOtp(obj){
        return serverRequest(COMMON_CONFIG.VERIFY_OTP, obj);
    }

    function updateCustomer(obj) {
        return serverRequest(COMMON_CONFIG.UPDATE_CUSTOMER, obj);
    }

    function verifyKycDoc(obj) {
        return serverRequest(COMMON_CONFIG.VERIFY_KYC_DOC, obj);
    }

    function uploadPrescription (obj) {
        return serverRequest(COMMON_CONFIG.UPLOAD_PRESCRIPTION,obj);
    }

    function setLocality(obj) {
        return serverRequest(COMMON_CONFIG.SET_LOCALITY,obj)
    }

    function validateToken(obj) {
        return serverRequest(COMMON_CONFIG.VALIDATE_TOKEN,obj)
    }

    function checkMobileNumber(obj) {
        return serverRequest(COMMON_CONFIG.CHECK_MOBILE_NUM, obj);
    }
    
    return Object.freeze({
        getUserSessionDetails,
        getUserSavedSearches,
        inactivateUserSearch,
        testAuth,
        customerHeaderData,
        getInsertCommunicationLog,
        validateOrderId,
        updateCallAttendedStatus,
        getCommunicationLogDetails,
        getFollowupClaimedOrders,
        getFollowUpMetaInfo,
        getClaimedRecordsCount,
        searchCustomerRequest,
        approveCustomerChangeRequest,
        rejectCustomerChangeRequest,
        sendSmsToCustomerForChangeRequest,
        getLedgers,
        getToken,
        sendOtpToMobile,
        verifyOtp,
        updateCustomer,
        verifyKycDoc,
        uploadPrescription,
        setLocality,
        validateToken,
        checkMobileNumber
    });
}

export default UserService;
