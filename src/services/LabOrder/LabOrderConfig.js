import { END_POINT, REQUEST_TYPE } from "../ServiceConstants";

const LAB_ORDER_CONFIG = {

    LAB_ORDER_INFO: {
        url: "/getLabOrderInfo",
        method: REQUEST_TYPE.POST
    },
    LAB_ORDER_DETAILS: {
        url: '/labOrderDetail',
        method: REQUEST_TYPE.POST
    },
    CONVERT_PAYMENT_TO_COD: {
        url: "/convertPaymentToCod",
        method: REQUEST_TYPE.POST
    },

    LAB_ORDER_RESCHEDULE: {
        url: "/rescheduleSlot",
        method: REQUEST_TYPE.POST
    },

    LAB_ORDER_ASSIGNAGENT: {
        url: "/assignAgent",
        method: REQUEST_TYPE.POST
    },

    LAB_ORDER_RESCHEDULEANDREASSIGN: {
        url: "/reScheduleAndAssignAgent",
        method: REQUEST_TYPE.POST
    },

    LAB_ORDER_ASSIGNAGENTTOLAB: {
        url: "/assignAgentToLab",
        method: REQUEST_TYPE.GET
    },

    LAB_ORDER_REQUESTOTP: {
        url: "/sendRescheduleSlotOTP",
        method: REQUEST_TYPE.POST
    },

    LAB_ORDER_RESENDOTP: {
        url: "/resendRescheduleSlotOTP",
        method: REQUEST_TYPE.POST
    },

    LAB_ORDER_VERIFYOTP: {
        url: "/verifyRescheduleSlotOTP",
        method: REQUEST_TYPE.POST
    },

    LAB_ORDER_RESCHEDULE_REASONS: {
        url: "/getLabOrderRescheduleReasons",
        method: REQUEST_TYPE.GET
    },

    GET_TIME_SLOTS: {
        url: "/getTimeSlots",
        method: REQUEST_TYPE.GET
    },

    GET_LAB_ORDER_RECEIPT: {
        url: "get-laborder-receipt-pdf",
        method: REQUEST_TYPE.POST
    },

    RETRY_LAB_ORDER_PAYMENT: {
        url: "/retryLabOrderPayment",
        method: REQUEST_TYPE.POST
    },

    CHECK_ORDER_PAYMENT_STATUS: {
        url: "/checkLabOrderPaymentStatus",
        method: REQUEST_TYPE.POST
    },

    GET_TEST_PROFILE_DETAILS: {
        url: "/getTestProfileDetails",
        method: REQUEST_TYPE.GET
    },
    RECOLLECT_LAB_ORDER_ITEMS: {
        url: "/reCollectLabOrderItems",
        method: REQUEST_TYPE.POST
    },
    GET_LAB_ORDER_HISTORY: {
        url: "/labOrderHistory",
        method: REQUEST_TYPE.GET
    },
    LAB_ORDER_SAMPLE_COLLECT: {
        url: "/forceSampleCollect",
        method: REQUEST_TYPE.GET
    },
    GET_VACUTAINERS: {
        url: "/getVacutainers",
        method: REQUEST_TYPE.POST
    },
    LAB_ORDER_COLLECT_FROM_CRM: {
        url: "/collectSampleFromCrm",
        method: REQUEST_TYPE.POST
    },
    CANCEL_TEST_ORDER_ITEM: {
        url: "/cancelTestOrderItem",
        method: REQUEST_TYPE.POST
    },
    CANCEL_LAB_ORDER: {
        url: "/cancelLabOrder",
        method: REQUEST_TYPE.POST
    },
    DOWNLOAD_LAB_REPORTS_FOR_TEST_IDS: {
        url: "downloadLabReportForTestIds",
        method: REQUEST_TYPE.POST
    },
    GET_LAB_ORDER_HISTORY: {
        url: "/labOrderHistory",
        method: REQUEST_TYPE.GET
    },
    DOWNLOAD_LAB_INVOICE: {
        url: "downloadLabInvoice",
        method: REQUEST_TYPE.POST
    },
    EMAIL_LAB_ORDER_REPORT: {
        url: "/emailLabOrderReportForTestIdsToCustomer",
        method: REQUEST_TYPE.POST
    },
    COLLECT_PAYMENT_VIEW: {
        url: "/collectLabOrderPaymentView",
        method: REQUEST_TYPE.GET
    },
    COLLECT_PAYMENT: {
        url: "/collectLabOrderPayment",
        method: REQUEST_TYPE.POST
    },
    EDIT_SAMPLE_COLLECT_BARCODES: {
        url: "/editSampleCollectedBarcode",
        method: REQUEST_TYPE.POST
    },
    GET_CLINICAL_HISTORY_FILES: {
        url: "/getClinicalHistoryFiles",
        method: REQUEST_TYPE.GET
    },
    APPROVE_LAB_ORDER: {
        url: "/approveLabOrder",
        method: REQUEST_TYPE.POST
    },
    DELETE_REFERENCE_FILE:{
        url: "/deleteReferenceFile",
        method: REQUEST_TYPE.DELETE
    },
    UPLOAD_CLINICAL_HISTORY_FILES: {
        url: "uploadClinicalHistoryFiles",
        method: REQUEST_TYPE.POST
    },
    GET_LAB_ORDER_CLAIMS: {
        url: "getLabOrderClaimedRecords",
        method: REQUEST_TYPE.GET
    },
    GET_LAB_ORDER_REFUNDS: {
        url: "getLabOrderRefundInfo",
        method: REQUEST_TYPE.GET
    },
    COMPLETE_LAB_COD_REFUND: {
        url: "completeLabCodRefund",
        method:REQUEST_TYPE.GET
    },
    GET_LAB_ORDER_DSR: {
        url: "printLabDsr",
        method:REQUEST_TYPE.POST
    },
    GET_USER_WISE_DSR: {
        url: "getUserwiseDsr",
        method:REQUEST_TYPE.POST
    }, DOWNLOAD_USER_DSR_REPORT: {
        url: "printUserDsr",
        method:REQUEST_TYPE.POST
    }, SEND_PAYMENT_LINK_TO_CUSTOMER: {
        url: "send-payment-link-to-customer",
        method: REQUEST_TYPE.POST
    },
    LAB_CATALOG: {
        GET_LAB_TEST_SUGGESTIONS: {
            url: "/get-lab-test-suggestions",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.LAB_CATALOG
        },
        GET_TEST_SERVING_CENTERS: {
            url: "/get-test-serving-centers",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CATALOG
        },
        GET_TEST_DETAILS_BY_ID: {
            url: "/get-test-details-by-id",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.LAB_CATALOG
        },
        GET_PACKAGES_INCLUDE_THIS_TEST: {
            url: "/get-packages-include-test",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CATALOG
        },
        
    GET_STATIC_CONTENT_FOR_ITEM: {
        url: "/get-static-content-for-item",
        method: REQUEST_TYPE.GET,
        endPoint: END_POINT.MART_COMMON
    },
    },REGENERATE_LAB_ORDER_REPORTS : {
        url: "regenerateLabOrderReports",
        method:REQUEST_TYPE.GET
    },
    LAB_CHECKOUT:{
        ADD_TEST_TO_CART: {
            url: "/add-test-to-cart",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        REMOVE_TEST_FROM_CART: {
            url: "/remove-test-from-cart",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
         GET_LAB_SHOPPING_CART: {
            url: "/get-lab-shopping-cart",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        ADD_PATIENT_TO_SHOPPING_CART: {
            url: "/add-patient-to-shopping-cart",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        GET_COLLECTION_CENTERS: {
            url: "/get-collection-centers",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        ADD_DELIVERY_LOCATION_TO_CART: {
            url: "/add-delivery-location-to-cart",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        GET_SLOT_DETAILS: {
            url: "/get-slot-details",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        ADD_TIME_SLOT_TO_CART: {
            url: "/add-time-slot-to-cart",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        APPLY_COUPON: {
            url: "/apply-coupon-code",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        REMOVE_COUPON: {
            url: "/remove-coupon-code",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        ADD_REPORT_DELIVERY_INFO: {
            url: "/add-report-delivery-info",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        GET_CUSTOMER_HOME_ADDRESSES: {
            url: "/get-customer-home-addresses",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        GET_LAB_ORDER_REVIEW: {
            url: "/get-lab-order-review",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        ADD_REPORT_DELIVERY_INFO: {
            url: "/add-report-delivery-info",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        ADD_SAMPLE_COLLECTION_INFO_WITH_REFERENCE_ORDER: {
            url: "/add-sample-collection-info-with-reference-order",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        ADD_SAMPLE_COLLECTION_INFO_TO_CART: {
            url: "/add-sample-collection-info-to-cart",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        CREATE_LAB_ORDER: {
            url: "/create-lab-order",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.CUSTOMER
        },
        GET_LAB_ORDER_THANK_YOU: {
            url: "/get-lab-order-thank-you-response",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.LAB_CHECKOUT
        },
        CHECK_EDC_LAB_ORDER_PAYMENT_STATUS: {
            url: "/check-lab-order-payment-status",
            method: REQUEST_TYPE.POST,
        },
        RETRY_EDC_LAB_ORDER_PAYMENT: {
            url: "/retry-lab-order-payment",
            method: REQUEST_TYPE.POST,
        }
    },
}
export default LAB_ORDER_CONFIG;