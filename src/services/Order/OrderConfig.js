import { REQUEST_TYPE } from "../ServiceConstants";

const ORDER_CONFIG = {

    GET_ORDERS: {
        url: "/getOrdersInfo",
        method: REQUEST_TYPE.GET
    },
    GET_ORDER_DETAILS_EDIT: {
        url: "/searchOrderForEdit",
        method: REQUEST_TYPE.POST
    },
    APPROVE_EDIT_ORDER: {
        url: "/editOrderApproval",
        method: REQUEST_TYPE.POST
    },
    GET_ORDER_DETAILS: {
        url: "/getOrderDetails",
        method: REQUEST_TYPE.POST
    },
    GET_ORDER_DISPATCH_DETAILS: {

        url: "/getOrderDispatchDetails",
        method: REQUEST_TYPE.GET
    },
    GET_ORDER_TICKET_DETAILS: {
        url: "/getOrderTicketDetails",
        method: REQUEST_TYPE.GET
    },
    GET_CUSTOMER_RETURN_REQUESTS: {
        url: "/getCustomerReturnRequests",
        method: REQUEST_TYPE.GET
    },
    GET_RETURN_REQUEST_DETAIL: {
        url: "/getReturnRequestDetail",
        method: REQUEST_TYPE.GET
    },
    GET_RETURN_REQUEST_FOR_ORDER: {

        url: "/getReturnRequestForOrder",
        method: REQUEST_TYPE.GET
    },
    CREATE_RETURN_REQUEST: {
        url: "/generateNewTicket",

        method: REQUEST_TYPE.POST
    },
    GET_IMAGE_SERVER_DETAILS: {
        url: "/getImageServer",

        method: REQUEST_TYPE.POST
    },
    SEND_RETRY_PAYMENT_LINK: {
        url: "/retryPaymentLink",
        method: REQUEST_TYPE.POST
    },
    REQUEST_E_PRESCRIPTION: {
        url: "/requestEPrescription",
        method: REQUEST_TYPE.POST
    },
    GET_PRODUCT_SUGGESTIONS: {
        url: "/getProducts",
        method: REQUEST_TYPE.GET
    },
    APPROVE_WEB_ORDER: {
        url: "/approveWebOrder",
        method: REQUEST_TYPE.POST
    },
    CANCEL_WEB_ORDER: {
        url: "/cancelWebOrder",
        method: REQUEST_TYPE.POST
    },
    UPDATE_PAYMENT_TYPE: {
        url: "/updatePaymentType",
        method: REQUEST_TYPE.POST
    },
    REQUEST_CANCEL_ORDER: {
        url: "/requestCancelWebOrder",
        method: REQUEST_TYPE.POST
    },
    ADD_PATIENT_DETAILS: {
        url: "/addPatientDetails",
        method: REQUEST_TYPE.POST
    },
    UPDATE_ORDER_SHIPPING_ADDRESS: {
        url: "/updateOrderShippingAddress",
        method: REQUEST_TYPE.POST
    },
    UNSUBSCRIBE_REFILL_ORDER: {
        url: "/unsubscribeRefill",
        method: REQUEST_TYPE.POST
    },
    RESCHEDULE_DELIVERY: {
        url: "/resheduleForDelivery",
        method: REQUEST_TYPE.POST
    },
    GET_PRESCRIPTION_DETAILS: {
        url: "/getPrescriptionDetails",
        method: REQUEST_TYPE.POST
    },
    UPLOAD_PRESCRIPTION_FOR_EDIT_ORDER: {
        url: "/prescriptionUploadForEditOrder",
        method: REQUEST_TYPE.POST
    },
    GET_ORDER_NEW_DATASET: {
        url: "/getOrderNewDataset",
        method: REQUEST_TYPE.GET
    },
    GET_MART_ORDER_DASHBOARD_DATASET: {
        url: "/getMartOrdersCount",
        method: REQUEST_TYPE.GET
    },
    GET_LAB_ORDER_DASHBOARD_DATASET: {
        url: "/getLabOrderCount",
        method: REQUEST_TYPE.GET
    },
    GET_PRESCRIPTION_ORDER_DASHBOARD_DATASET: {
        url: "/getPrescriptionOrderCount",
        method: REQUEST_TYPE.GET
    },CLAIM_OR_UNCLAIM_ORDER: {
        url:"/claimAndUnclaimAnOrder",
        method: REQUEST_TYPE.POST
    },
    GET_MART_CLAIMED_ORDER: {
        url: "/getMartClaimedOrders",
        method: REQUEST_TYPE.GET
    },
    GET_APPROVED_PROPOSED_ORDERS: {
        url: "/searchEditableOrders",
        method: REQUEST_TYPE.POST
    },
    GET_PRODUCTS_IN_PROPOSED_ORDERS: {
        url: "/searchOrder",
        method: REQUEST_TYPE.GET
    },
    WITHDRAW_PRODUCT_IN_PROPOSED_ORDER: {
        url: "/proposeEditCancel",
        method: REQUEST_TYPE.GET
    },
    APPROVE_PRODUCT_IN_PROPOSED_ORDER: {
        url:"/proposeEditApproval",
        method: REQUEST_TYPE.POST
    },
    CREATE_BANK_DEPOSIT: {
        url:"/create-bank-deposits",
        method: REQUEST_TYPE.POST
    } ,
    SEND_PAYMENT_LINK_FOR_MART_ORDER: {
        url: "/sendPaymentLinkForMartOrder",
        method: REQUEST_TYPE.POST
    }
    
}
export default ORDER_CONFIG;

