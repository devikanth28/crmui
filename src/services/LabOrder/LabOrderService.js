import { imageServerRequest, serverRequest } from "../../axios";
import LAB_ORDER_CONFIG from "./LabOrderConfig";

export default () => {

    function getLabOrderInfo(data) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_INFO, {data:data});
    }
    function labOrderDetail(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_DETAILS, { params: obj });
    }
    function convertPaymentToCod(obj) {
        return serverRequest(LAB_ORDER_CONFIG.CONVERT_PAYMENT_TO_COD, { params: obj })
    }
    function rescheduleSlot(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_RESCHEDULE, { params: obj });
    }

    function assignAgent(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_ASSIGNAGENT, { params: obj });
    }

    function rescheduleandReassign(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_RESCHEDULEANDREASSIGN, { params: obj });
    }

    function getRescheduleModalData(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_ASSIGNAGENTTOLAB, { params: obj });
    }

    function requestOtpForRescheduleSlot(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_REQUESTOTP, { params: obj });
    }

    function resendOtpForRescheduleSlot(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_RESENDOTP, { params: obj });
    }

    function verifyOtpForRescheduleSlot(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_VERIFYOTP, { params: obj });
    }

    function getLabOrderRescheduleReasons(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_RESCHEDULE_REASONS, { params: obj });
    }

    function getTimeSlots(obj) {
        return serverRequest(LAB_ORDER_CONFIG.GET_TIME_SLOTS, { params: obj });
    }

    function getLabOrderReceipt(obj) {
        return serverRequest(LAB_ORDER_CONFIG.GET_LAB_ORDER_RECEIPT, { params: obj });
    }

    function retryLabOrderPayment(obj) {
        return serverRequest(LAB_ORDER_CONFIG.RETRY_LAB_ORDER_PAYMENT, { params: obj });
    }

    function checkLabOrderPaymentStatus(obj) {
        return serverRequest(LAB_ORDER_CONFIG.CHECK_ORDER_PAYMENT_STATUS, { params: obj });
    }

    function getTestProfileDetails(obj) {
        return serverRequest(LAB_ORDER_CONFIG.GET_TEST_PROFILE_DETAILS, { params: obj });
    }

    function getLabOrderHistory(obj) {
        return serverRequest(LAB_ORDER_CONFIG.GET_LAB_ORDER_HISTORY, { params: obj });
    }

    function reCollectLabOrderItems(obj) {
        return serverRequest(LAB_ORDER_CONFIG.RECOLLECT_LAB_ORDER_ITEMS, { data: obj });
    }

    function labOrderSampleCollect(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_SAMPLE_COLLECT, { params: obj })
    }

    function getVacutainerInfo(obj, data) {
        return serverRequest(LAB_ORDER_CONFIG.GET_VACUTAINERS, { params: obj });
    }

    function collectSampleFromCrm(params, data) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_ORDER_COLLECT_FROM_CRM, { params: params, data: data });
    }

    function cancelLabOrder(obj) {
        return serverRequest(LAB_ORDER_CONFIG.CANCEL_LAB_ORDER, { params: obj });

    }

    function cancelTestOrderItem(obj) {
        return serverRequest(LAB_ORDER_CONFIG.CANCEL_TEST_ORDER_ITEM, { data: obj });
    }

    function downloadLabReportForTestIds(obj) {
        return serverRequest(LAB_ORDER_CONFIG.DOWNLOAD_LAB_REPORTS_FOR_TEST_IDS, { params: obj });
    }

    function downloadLabInvoice(obj) {
        return serverRequest(LAB_ORDER_CONFIG.DOWNLOAD_LAB_INVOICE, { params: obj });
    }

    function emailLabOrderReport(obj) {
        return serverRequest(LAB_ORDER_CONFIG.EMAIL_LAB_ORDER_REPORT, { params: obj });
    }

    function collectLabOrderPaymentView(obj) {
        return serverRequest(LAB_ORDER_CONFIG.COLLECT_PAYMENT_VIEW, { params: obj });
    }

    function collectLabOrderPayment(data, obj) {
        return serverRequest(LAB_ORDER_CONFIG.COLLECT_PAYMENT, { data, params: obj });
    }

    function editSampleCollectedBarcode(data) {
        return serverRequest(LAB_ORDER_CONFIG.EDIT_SAMPLE_COLLECT_BARCODES, { data });
    }

    function getClinicalHistoryFiles(obj) {
        return serverRequest(LAB_ORDER_CONFIG.GET_CLINICAL_HISTORY_FILES, { params: obj });
    }

    function approveLabOrder(obj) {
        return serverRequest(LAB_ORDER_CONFIG.APPROVE_LAB_ORDER, { params: obj });
    }

    function deleteReferenceFile(obj) {
        return serverRequest(LAB_ORDER_CONFIG.DELETE_REFERENCE_FILE, { params: obj } );
    }

    function uploadClinicalHistoryFiles(fromData) {
        return imageServerRequest(LAB_ORDER_CONFIG.UPLOAD_CLINICAL_HISTORY_FILES, fromData);
    }

    function getLabOrderClaimedRecords(obj){
        return serverRequest(LAB_ORDER_CONFIG.GET_LAB_ORDER_CLAIMS,{params: obj});
    }

    function getLabOrderRefundsInfo(obj){
        return serverRequest(LAB_ORDER_CONFIG.GET_LAB_ORDER_REFUNDS,{params: obj});
    }

    function completeLabCodRefund(obj){
        return serverRequest(LAB_ORDER_CONFIG.COMPLETE_LAB_COD_REFUND,{params:obj});
    }

    function getUserWiseDSRData(obj) {
        return serverRequest(LAB_ORDER_CONFIG.GET_USER_WISE_DSR,{params:obj});
    }
    function sendPaymentLinkToCustomer(obj) {
        return serverRequest(LAB_ORDER_CONFIG.SEND_PAYMENT_LINK_TO_CUSTOMER, { params: obj });
    }

    function getLabTestSuggestions(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CATALOG.GET_LAB_TEST_SUGGESTIONS, obj);
    }

    function getTestServingCenters(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CATALOG.GET_TEST_SERVING_CENTERS, obj);
    }

    function addTestToCart(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.ADD_TEST_TO_CART, obj);
    }
    function removeTestFromCart(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.REMOVE_TEST_FROM_CART, obj);
    }
    
    function getLabShoppingCart(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.GET_LAB_SHOPPING_CART, obj);
    }

    function addPatientToLabShoppingCart(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.ADD_PATIENT_TO_SHOPPING_CART, obj);
    }

    function getCollectionCenters(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.GET_COLLECTION_CENTERS, obj);
    }

    function addDeliveryLocationToCart(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.ADD_DELIVERY_LOCATION_TO_CART, obj);
    }

    function getSlotDetails(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.GET_SLOT_DETAILS, obj);
    }

    function addTimeSlotToCart(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.ADD_TIME_SLOT_TO_CART, obj);
    }

    function applyCoupon(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.APPLY_COUPON, obj);
    }

    function removeCoupon(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.REMOVE_COUPON, obj);
    }

    function getTestDetailsById(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CATALOG.GET_TEST_DETAILS_BY_ID, obj);
    }

    function getPackagesIncludeThisTest(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CATALOG.GET_PACKAGES_INCLUDE_THIS_TEST, obj);
    }

    function getStaticContentForItem(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CATALOG.GET_STATIC_CONTENT_FOR_ITEM, obj);
    }

    function getCustomerHomeAddresses(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.GET_CUSTOMER_HOME_ADDRESSES, obj);
    }

    function getLabReviewCart(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.GET_LAB_ORDER_REVIEW, obj);
    }
    
    function addReportDeliveryInfo(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.ADD_REPORT_DELIVERY_INFO, obj);
    }

    function addSampleCollectionWithReferenceOrder(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.ADD_SAMPLE_COLLECTION_INFO_WITH_REFERENCE_ORDER, obj);
    }
    
    function regenerateLabOrderReports(cartId){
        return serverRequest(LAB_ORDER_CONFIG.REGENERATE_LAB_ORDER_REPORTS,{params:{cartId}});
    }

    function addSampleCollectionInfoToCart(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.ADD_SAMPLE_COLLECTION_INFO_TO_CART, obj);
    }

    function createLabOrder(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.CREATE_LAB_ORDER, obj);
    }

    function getLabOrderThankYou(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.GET_LAB_ORDER_THANK_YOU, obj);
    }

    function checkLabOrderPaymentStatus(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.CHECK_EDC_LAB_ORDER_PAYMENT_STATUS, obj);
    }

    function retryLabOrderPayment(obj) {
        return serverRequest(LAB_ORDER_CONFIG.LAB_CHECKOUT.RETRY_EDC_LAB_ORDER_PAYMENT, obj);
    }

    return Object.freeze({
        getLabOrderInfo,
        labOrderDetail,
        convertPaymentToCod,
        rescheduleSlot,
        assignAgent,
        rescheduleandReassign,
        getRescheduleModalData,
        requestOtpForRescheduleSlot,
        resendOtpForRescheduleSlot,
        verifyOtpForRescheduleSlot,
        getLabOrderRescheduleReasons,
        getTimeSlots,
        getLabOrderReceipt,
        retryLabOrderPayment,
        checkLabOrderPaymentStatus,
        getTestProfileDetails,
        reCollectLabOrderItems,
        getLabOrderHistory,
        labOrderSampleCollect,
        getVacutainerInfo,
        collectSampleFromCrm,
        cancelTestOrderItem,
        cancelLabOrder,
        downloadLabReportForTestIds,
        downloadLabInvoice,
        emailLabOrderReport,
        collectLabOrderPaymentView,
        collectLabOrderPayment,
        editSampleCollectedBarcode,
        getClinicalHistoryFiles,
        approveLabOrder,
        deleteReferenceFile,
        uploadClinicalHistoryFiles,
        getLabOrderClaimedRecords,
        getLabOrderRefundsInfo,
        completeLabCodRefund,
        getUserWiseDSRData,
        sendPaymentLinkToCustomer,
        /* lab catalog methods starts */
        getLabTestSuggestions,
        getTestServingCenters,
        getTestDetailsById,
        getPackagesIncludeThisTest,
        getStaticContentForItem,
        /* lab checkout methods starts */
        addTestToCart,
        removeTestFromCart,
        getLabShoppingCart,
        addPatientToLabShoppingCart,
        applyCoupon,
        removeCoupon,
        getCollectionCenters,
        addDeliveryLocationToCart,
        getSlotDetails,
        addTimeSlotToCart,
        getCustomerHomeAddresses,
        getLabReviewCart,
        addReportDeliveryInfo,
        addSampleCollectionWithReferenceOrder,
        regenerateLabOrderReports,
        addSampleCollectionInfoToCart,
        createLabOrder,
        getLabOrderThankYou,
        checkLabOrderPaymentStatus
    });
}