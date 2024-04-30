import { REQUEST_TYPE } from "../ServiceConstants"
const MEMBERSHIP_CONFIG = {
    EXCEL:{

        SAVE_MEMBERSHIP_INFO: {
            url: './uploadSubscriptionFile',
            method: REQUEST_TYPE.POST,
            contentType: "multipart/form-data",
    
        },DOWNLOAD_MEMBERSHIP_INFO:{
            url: './downloadSubscriptionFile',
            method: REQUEST_TYPE.GET,
            responseType:'blob'
        },DOWNLOAD_SUBSCRIPTION_RESPONSES:{
            url: './downloadSubscriptionResponses',
            method: REQUEST_TYPE.POST,
            responseType:'blob'
        }
    },
    SUBSCRIPTION : {
        CHECK_CUSTOMER_ELIGIBLE_FOR_REFUND: {
            url: "checkCustomerEligibilityForRefund",
            method: REQUEST_TYPE.GET
        }, GET_CANCEL_REASONS: {
            url: "getSubscriptionCancelReasons",
            method: REQUEST_TYPE.GET
        }, UPDATE_SUBSCRIPTION: {
            url: "updateSubscription",
            method: REQUEST_TYPE.POST
        },
        CHECK_PAYMENT_STATUS: {
            url: "checkDevicePaymentStatus",
            method: REQUEST_TYPE.POST
        }
    },
    PLAN:{
        GET_PLANS:{
            url: 'getPlanDetails',
            method: REQUEST_TYPE.POST,
        },
        
        GET_MEMBERSHIP_SUBSCRIPTION_MASTER_DATA:{
            url: 'getMembershipSubscriptionMasterData',
            method: REQUEST_TYPE.GET,
        },
        GET_ORG_WITH_EMAIL_DOMAIN:{
            url: 'getOrganizationWithEmailDomain',
            method: REQUEST_TYPE.GET, 
        },
        GET_PLANS_RELATED_TO_ORG:{
            url: 'getPlansRelatedToOrg',
            method: REQUEST_TYPE.GET, 
        },
        GET_PLAN_DETAILS:{
            url: 'getPlanDetailsUsingPlanId',
            method: REQUEST_TYPE.GET, 
        },
        SEND_PLAN_DETAILS:{
            url: 'sendPlanDetails',
            method: REQUEST_TYPE.GET
        },
        GET_PAYMENT_DETAILS: {
            url: "/getPaymentDetails",
            method: REQUEST_TYPE.POST
        },
        GET_ORDER_SUMMARY: {
            url: "/getOrderDetailsByOrderId",
            method: REQUEST_TYPE.GET
        },
        GET_PLAN_DETAILS_USING_PLAN_ID: {
            url: "/getPlanDetailsUsingPlanId",
            method: REQUEST_TYPE.GET
        },
        DOWNLOAD_MEMBERSHIP_CREDIT_NOTE:{
            url: "/downloadMembershipCreditNote",
            method: REQUEST_TYPE.POST
        },
        GET_SUBSCRIPTION_DETAILS: {
            url: "getSubscriptionDetails",
            method: REQUEST_TYPE.POST
        },
        SEND_PAYMENT_LINK_TO_CUSTOMER: {
            url: "sendingPaymentLinkToCustomer",
            method: REQUEST_TYPE.POST
        }, GET_REGIONS_AND_COLLECTION_CENTERS: {
            url: "regions-and-collectionCenters" ,
            method: REQUEST_TYPE.GET  
       }, GENERATE_OTP_CORPORATE_MAIL_AUTH : {
            url: "generateOtpForCorporateMail",
            method: REQUEST_TYPE.GET
        },VERIFY_OTP_FOR_EMAIL_AUTH:{
            url: "validateOtpForCorporateMail",
            method: REQUEST_TYPE.POST
        },RESEND_OTP_FOR_EMAIL_AUTH: {
            url: "resendOtpForEmail",
            method: REQUEST_TYPE.GET
        },REGISTER_ORG_REQ: {
            url: "registerOrgReq",
            method: REQUEST_TYPE.POST
        }, GET_CORPORATE_EMAIL: {
            url: "getCorporateEmail",
            method: REQUEST_TYPE.GET
        }
    },
    MEMBER:{
        GET_MEMBERS: {
            url: './getMembers',
            method: REQUEST_TYPE.GET,
        },REMOVE_MEMBER: {
            url: '/removeMember',
            method: REQUEST_TYPE.GET
        },SAVE_MEMBERS: {
            url: '/saveMemebers',
            method: REQUEST_TYPE.POST
        }
    },
    CHECKOUT: {
        REQUEST_OTP : {
            url:'./requestMembershipOtp',
            method: REQUEST_TYPE.POST
        },
        VALIDATE_OTP : {
            url:'./validateMembershipOtp',
            method: REQUEST_TYPE.POST
        },
        GET_CART_SUMMARY:{
            url:'./subscription-order-summary',
            method: REQUEST_TYPE.POST
        },
        CREATE_SUBSCRIPTION_ORDER : {
            url:'./subscription-order',
            method: REQUEST_TYPE.POST
        },
        GET_UPGRADE_CART_SUMMARY: {
            url:'./upgrade-subscription-summary',
            method: REQUEST_TYPE.POST
        },
        UPGRADE_SUBSCRIPTION_ORDER: {
            url:'./upgrade-subscription-order',
            method: REQUEST_TYPE.POST
        },
        CHECK_EDC_STATUS: {
            url:'./edc-payment-status',
            method: REQUEST_TYPE.POST
        },
        RETRY_EDC_PAYMENT: {
            url:'./retry-edc-payment',
            method: REQUEST_TYPE.POST
        }
    },
}
export default MEMBERSHIP_CONFIG;