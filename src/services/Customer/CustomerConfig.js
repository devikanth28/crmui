import { END_POINT, REQUEST_TYPE } from "../ServiceConstants";

const CUSTOMER_CONFIG = {

    CUSTOMER_HOME: {
        url: '/searchCustomer',
        method: REQUEST_TYPE.GET
    }, SEND_SMS: {
        url: '/sendSms',
        method: REQUEST_TYPE.POST
    }, CREATE_CUSTOMER: {
        url: '/create-offline-account',
        method: REQUEST_TYPE.POST
    }, GET_CUSTOMER_MENU_LINKS: {
        url: "/getCustomerMenuLinks",
        method: REQUEST_TYPE.GET
    }, GET_CUSTOMER_BIO_EDIT_FORM: {
        url: "/getCustomerBioEditJson",
        method: REQUEST_TYPE.GET
    }, GET_CUSTOMER_DETAILS_BY_ID: {
        url: "/getCustomerDetailsById",
        method: REQUEST_TYPE.GET
    }, UPDATE_CUSTOMER_DETAILS: {
        url: "/updateCustomerDetails",
        method: REQUEST_TYPE.POST
    }, ORDER_HISTORY: {
        url: "/getCustomerOrderHistory",
        method: REQUEST_TYPE.GET
    }, PRESCRIPTION_ORDER_HISTORY: {
        url: "/getPrescriptionOrderDetails",
        method: REQUEST_TYPE.GET
    },
    GET_USER_PROFILE_INFO: {
        url: "/userProfileInfo",
        method: REQUEST_TYPE.GET,
        endPoint: END_POINT.CUSTOMER
    },
    GET_IMAGE_SERVER_DETAIL: {
        url: "getImageServer",
        method: REQUEST_TYPE.POST
    },
    GET_STORE_INFO: {
        url: "sendStoreDetailsToCustomer",
        method: REQUEST_TYPE.POST
    },
    UPDATE_STATUS: {
        url: "/updateStatus",
        method: REQUEST_TYPE.POST,
       endPoint: END_POINT.CUSTOMER
    },
    GET_SUBSCRIPTIONS: {
        url: "getSubscriptions",
        method: REQUEST_TYPE.GET
    },
    GET_SUBSCRIPTION_DETAILS: {
        url: "getSubscriptionDetails",
        method: REQUEST_TYPE.POST
    },

    GET_CUSTOMER_POINTS_HISTORY: {
        url: "getCustomerPointsHistory",
        method: REQUEST_TYPE.GET
    },
    UPDATE_CUSTOMER_DATA: {
        url: "updateCustomer",
        method: REQUEST_TYPE.POST,
    },
    UPDATE_SHIPPING_DATA: {
        url: "updateCustomerShippingAddress",
        method: REQUEST_TYPE.POST
    },
    UPLOAD_FILES: {
        url: "/uploadPrescription",
        method: REQUEST_TYPE.POST,
        //endPoint: END_POINT.CUSTOMER
    },
    GET_LOCALITY_AUTO_SUGGESTIONS: {
        url: "/getLocalityAutoSuggestions",
        method: REQUEST_TYPE.GET,
        endPoint: END_POINT.MART_COMMON
    },
    SET_SELECTED_LOCALITY: {
        url: "/setLocality",
        method: REQUEST_TYPE.GET,
        endPoint: END_POINT.MART_COMMON,
    },
    GET_CFP_ACTIONS: {
        url: "/getCfpActions",
        method: REQUEST_TYPE.GET,
    },
    GET_CFP_ACTION_DETAILS: {
        url: "/getCustomerFuturePurchaseActionDetails",
        method: REQUEST_TYPE.GET,
    },
    SAVE_CFP_FOLLOW_UP: {
        url: "/saveCustomerFuturePurchaseFollowup",
        method: REQUEST_TYPE.POST,
    },
    GET_STATUS_WISE_CFP_ACTIONS_COUNT: {
        url: "/getStatusWiseCFPActionsCountInfo",
        method: REQUEST_TYPE.GET,
    },
    GET_STATE_WISE_CFP_ACTIONS_INFO: {
        url: "/getStateWiseCFPActionsInfo",
        method: REQUEST_TYPE.GET,
    },
    GET_STATE_ESCALATED_CFP_STORE_INFO: {
        url: "/getRegionWiseEscalatedCfpStoresCountForState",
        method: REQUEST_TYPE.GET,
    },
    ADD_CFP_TO_CART: {
        url: "/addCfpProductsToCart",
        method: REQUEST_TYPE.POST,
    },
    GET_PROCUREMENT_DETAILS: {
        url: "/customerProcurement",
        method: REQUEST_TYPE.GET,
    },
    GET_REQUISITION_DETAILS: {
        url: "/getProcurement",
        method: REQUEST_TYPE.GET,
    },
    UPDATE_CUSTOMER_PROCUREMENT_COMMUNICATION: {
        url: "/update_customer_communication",
        method: REQUEST_TYPE.GET
    },
    GET_MEMBERS: {
        url: "/getMembers",
        method: REQUEST_TYPE.GET
    },
    SEND_PAYMENT_LINK_TO_CUSTOMER: {
        url: "/sendingPaymentLinkToCustomer",
        method: REQUEST_TYPE.POST
    },
    GENERATE_TOKEN: {
        url: "/generateToken",
        method: REQUEST_TYPE.GET
    },
    DOWNLOAD_INVOICE:{
        url: "/downloadMembershipOrderInvoice",
        method: REQUEST_TYPE.POST,
        responseType:'blob'
    },
    DOWNLOAD_MEMBERSHIP_CREDIT_NOTE:{
        url: "/downloadMembershipCreditNote",
        method: REQUEST_TYPE.POST,
        responseType:'blob'
    },
    GET_CANCEL_REASONS:{
        url: "/getOrderCancelReasons",
        method: REQUEST_TYPE.GET
    },

    CANCEL_ORDER:{
        url: "/cancelOrder",
        method: REQUEST_TYPE.GET
    },

    CREATE_SUBSCRIPTION_ORDER:{
        url:'./createSubscriptionOrder',
        method: REQUEST_TYPE.POST
    },
    HEALTH_RECORD_HISTORY: { 
        GET_HEALTH_RECORD_HISTORY: {
            url: './health-record-history',
            method: REQUEST_TYPE.GET
        }
    },
    UPDATE_CUSTOMER_PATIENT: {
        url: "updatePatientDetails",
        method:REQUEST_TYPE.POST
    },UPLOAD_DOCTOR_REGISTRATION_FILE: {
        url: "uploadDoctorsRegistartionFile",
        method:REQUEST_TYPE.POST,
        contentType: "multipart/form-data",
        responseType:'blob'
    },UPLOAD_CHECK_DETAILS_FILE: {
        url: "checkRegisteredDoctorDetails",
        method:REQUEST_TYPE.POST,
        contentType: "multipart/form-data",
        responseType:'blob'
    },DOWNLOAD_ACTIVE_DOCTORS:{
        url: "downloadRegisteredDoctorDetails",
        method: REQUEST_TYPE.GET,
        responseType:'blob'
    },
    UPDATE_DOCTOR_CLINIC_INFO: {
        url: "/updateRegisteredDoctorInfo",
        method: REQUEST_TYPE.POST,
    },





}
export default CUSTOMER_CONFIG;