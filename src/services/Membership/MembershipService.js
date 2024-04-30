import { Form } from "react-bootstrap";
import { imageServerRequest, serverRequest } from "../../axios";
import MEMBERSHIP_CONFIG from "./MembershipConfig";


export default () => {
    function uploadMembershipInfo(file) {
        const formData = new FormData();
        formData.append("file", file);
        return imageServerRequest(MEMBERSHIP_CONFIG.EXCEL.SAVE_MEMBERSHIP_INFO, formData);
    }

    function downloadMembershipInfo(obj) {
        return serverRequest(MEMBERSHIP_CONFIG.EXCEL.DOWNLOAD_MEMBERSHIP_INFO, {params: obj});
    }

    function downloadSubscriptionResponses(obj) {
        return serverRequest(MEMBERSHIP_CONFIG.EXCEL.DOWNLOAD_SUBSCRIPTION_RESPONSES,{data: obj} );
    }

    function getPlans (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GET_PLANS, {data:obj});
    }

    function getMembershipSubscriptionMasterData (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GET_MEMBERSHIP_SUBSCRIPTION_MASTER_DATA, {data:obj});
    }

    function getOrgsWithEmailDomain (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GET_ORG_WITH_EMAIL_DOMAIN, {data:obj});
    }

    function getPlansRelatedToOrg (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GET_PLANS_RELATED_TO_ORG, {params:obj});
    }

    function getPlanDetails (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GET_PLAN_DETAILS, {params:obj});

    }
    
     function getMembers(obj) {
        return serverRequest(MEMBERSHIP_CONFIG.MEMBER.GET_MEMBERS,{params: obj});
    }

    function removeMember({patientId,customerId}){
        return serverRequest(MEMBERSHIP_CONFIG.MEMBER.REMOVE_MEMBER,{params:{patientId:patientId,customerId:customerId}});
    }

    function saveMemebers(obj) {
        return serverRequest(MEMBERSHIP_CONFIG.MEMBER.SAVE_MEMBERS,{data: obj});
    }
    function createSubscriptionOrder(obj){
        return serverRequest(MEMBERSHIP_CONFIG.CHECKOUT.CREATE_SUBSCRIPTION_ORDER, {data: obj})
    }

    function upgradeSubscriptionOrder(obj){
        return serverRequest(MEMBERSHIP_CONFIG.CHECKOUT.UPGRADE_SUBSCRIPTION_ORDER, {data: obj})
    }

    function sendPlanDetails(obj){
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.SEND_PLAN_DETAILS, obj)
    }

    function getPaymentDetails(config){
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GET_PAYMENT_DETAILS, config)
    }

    function getOrderSummary(obj){
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GET_ORDER_SUMMARY, {params:obj})
    }

    function getPlanDetailsUsingPlanId(obj){
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GET_PLAN_DETAILS_USING_PLAN_ID,{params:obj})
    }

    function sendPaymentLinkToCustomer(obj){
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.SEND_PAYMENT_LINK_TO_CUSTOMER, {params:obj})
    }

    function downloadMembershipCreditNote(obj){
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.DOWNLOAD_MEMBERSHIP_CREDIT_NOTE, {params:obj})
    }

    function getSubscriptionDetails(obj){
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GET_SUBSCRIPTION_DETAILS,{ params: obj.params, data: obj.data.onlineServingPlanIds });
    }

    function requestMembershipOtp(membershipAuthRequest, process) {
        return serverRequest(MEMBERSHIP_CONFIG.CHECKOUT.REQUEST_OTP, {data: membershipAuthRequest, params : {process}})
    }

    function validateMembershipOtp(membershipAuthRequest, process) {
        return serverRequest(MEMBERSHIP_CONFIG.CHECKOUT.VALIDATE_OTP, {data: membershipAuthRequest, params : {process}});
    }

    function getSubscriptionCartSummary(obj) {
        return serverRequest(MEMBERSHIP_CONFIG.CHECKOUT.GET_CART_SUMMARY, {data: obj});
    }

    function getUpgradeSubscriptionCartSummary(obj) {
        return serverRequest(MEMBERSHIP_CONFIG.CHECKOUT.GET_UPGRADE_CART_SUMMARY, {data: obj});
    }

    function checkCustomerEligibilityForRefund (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.SUBSCRIPTION.CHECK_CUSTOMER_ELIGIBLE_FOR_REFUND, {params:obj})
    }

    function getSubscriptionCancelReasons (obj){
        return serverRequest(MEMBERSHIP_CONFIG.SUBSCRIPTION.GET_CANCEL_REASONS, {})
    }

    function updateSubscription (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.SUBSCRIPTION.UPDATE_SUBSCRIPTION, {data:obj})
    }

    function getRegionsAndCollectionCenters (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GET_REGIONS_AND_COLLECTION_CENTERS, {params:obj})
    }

    function generateAndSendOtpForCorporateMailAuthorization (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GENERATE_OTP_CORPORATE_MAIL_AUTH, {params: obj})
    }

    function verifyOtpForEmailAuthorization (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.VERIFY_OTP_FOR_EMAIL_AUTH, {data:obj});
    }

    function resendOtpForEmailAuth(obj) {
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.RESEND_OTP_FOR_EMAIL_AUTH, {params:obj});
    }

    function checkPaymentStatus (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.SUBSCRIPTION.CHECK_PAYMENT_STATUS, {params:obj})
    }

    function registerOrgReq (obj) {
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.REGISTER_ORG_REQ, {data: obj})
    }

    function checkEDCStatus(obj) {
        return serverRequest(MEMBERSHIP_CONFIG.CHECKOUT.CHECK_EDC_STATUS, {data: obj})
    }

    function retryEDCPayment(obj) {
        return serverRequest(MEMBERSHIP_CONFIG.CHECKOUT.RETRY_EDC_PAYMENT, {data: obj})
    }
    function getCorporateEmail(obj) {
        return serverRequest(MEMBERSHIP_CONFIG.PLAN.GET_CORPORATE_EMAIL, {params: obj})
    }
    
    return Object.freeze({
        uploadMembershipInfo,
        downloadMembershipInfo,
        downloadSubscriptionResponses,
        getPlans,
        getMembershipSubscriptionMasterData,
        getOrgsWithEmailDomain,
        getPlansRelatedToOrg,
        getPlanDetails,
        getMembers,
        removeMember,
        saveMemebers,
        sendPlanDetails,
        createSubscriptionOrder,
        upgradeSubscriptionOrder,
        requestMembershipOtp,
        validateMembershipOtp,
        getPaymentDetails,
        getOrderSummary,
        getPlanDetailsUsingPlanId,
        sendPaymentLinkToCustomer,
        downloadMembershipCreditNote,
        getSubscriptionDetails,
        getSubscriptionCartSummary,
        getUpgradeSubscriptionCartSummary,
        checkCustomerEligibilityForRefund,
        getSubscriptionCancelReasons,
        updateSubscription,
        getRegionsAndCollectionCenters,
        generateAndSendOtpForCorporateMailAuthorization,
        verifyOtpForEmailAuthorization,
        resendOtpForEmailAuth,
        checkPaymentStatus,
        registerOrgReq,
        checkEDCStatus,
        retryEDCPayment,
        getCorporateEmail
    });
}