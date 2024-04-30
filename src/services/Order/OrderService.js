import { serverRequest, uploadFilesToServer } from "../../axios";
import Validate from "../../helpers/Validate";
import ORDER_CONFIG from "./OrderConfig";

export default () => {

    function getOrders(obj) {
        return serverRequest(ORDER_CONFIG.GET_ORDERS, {params: obj});
    }

    function getOrderDetailsForEdit(obj) {
        return serverRequest(ORDER_CONFIG.GET_ORDER_DETAILS_EDIT, {params: obj});
    }

    function approveEditedOrder(obj) {
        return serverRequest(ORDER_CONFIG.APPROVE_EDIT_ORDER, {params: obj});
    }

    function getOrderDetails(obj) {
        return serverRequest(ORDER_CONFIG.GET_ORDER_DETAILS, {params: obj});
    }

    function getOrderDispatchDetails(obj) {
        return serverRequest(ORDER_CONFIG.GET_ORDER_DISPATCH_DETAILS, {params: obj});
    }

    function getOrderTicketDetails(obj) {
        return serverRequest(ORDER_CONFIG.GET_ORDER_TICKET_DETAILS, {params: obj});
    }

    function getCustomerReturnRequests(obj) {
        return serverRequest(ORDER_CONFIG.GET_CUSTOMER_RETURN_REQUESTS, {params: obj});
    }

    function getReturnRequestDetail(obj) {
        return serverRequest(ORDER_CONFIG.GET_RETURN_REQUEST_DETAIL, {params: obj});
    }

    function getReturnRequestForOrder(obj) {
        return serverRequest(ORDER_CONFIG.GET_RETURN_REQUEST_FOR_ORDER, {params: obj});
    }

    function createReturnRequest(config) {
        return serverRequest(ORDER_CONFIG.CREATE_RETURN_REQUEST, config);
    }

    function getImageServerDetails(obj) {
        return serverRequest(ORDER_CONFIG.GET_IMAGE_SERVER_DETAILS, {params: obj});
    }

    async function uploadFilesToImageServer(filesToUpload, imageType, requestConfig,requestFrom) {
        let filesFormData = new FormData();
        for (const eachFile of filesToUpload) {
            filesFormData.append('files', eachFile);
        }
        const response = await getImageServerDetails({ imageType: imageType });
        if (Validate().isNotEmpty(response) && response.statusCode === "SUCCESS" && Validate().isNotEmpty(response.dataObject)) {
            const imageServerDetail = response.dataObject.imageServer;
            const updatedImageType = requestFrom == "Bio_KYC" ? 'P': imageType;
            const url = imageServerDetail.imageServerUrl + "/upload?token=" + imageServerDetail.accessToken + "&clientId=" + imageServerDetail.clientId + "&imageType=" + updatedImageType;
            const uploadedImageData = await uploadFilesToServer(url, filesFormData, requestConfig);
            return new Promise((resolve) => {
                uploadedImageData['imageServerDetails'] = imageServerDetail;
                return resolve(uploadedImageData);
            });
        } else {
            return new Promise((resolve) => {
                return resolve({ statusCode: 'FAILURE', message: 'Something went wrong. Please try again!' });
            });
        }
    }

    function sendRetryPaymentLink(obj) {
        return serverRequest(ORDER_CONFIG.SEND_RETRY_PAYMENT_LINK, {params: obj});
    }

    function requestEPrescription(obj) {
        return serverRequest(ORDER_CONFIG.REQUEST_E_PRESCRIPTION, {params: obj});
    }

    function getProducts(obj) {
        return serverRequest(ORDER_CONFIG.GET_PRODUCT_SUGGESTIONS, {params: obj});
    }

    function approveWebOrder(obj) {
        return serverRequest(ORDER_CONFIG.APPROVE_WEB_ORDER, {params: obj});
    }

    function cancelWebOrder(obj) {
        return serverRequest(ORDER_CONFIG.CANCEL_WEB_ORDER, {params: obj});
    }

    function convertToCod(obj) {
        return serverRequest(ORDER_CONFIG.UPDATE_PAYMENT_TYPE, {params: obj});
    }

    function requestCancelOrder(obj) {
        return serverRequest(ORDER_CONFIG.REQUEST_CANCEL_ORDER, {params: obj});
    }

    function addPatientDetails(obj) {
        return serverRequest(ORDER_CONFIG.ADD_PATIENT_DETAILS, {params: obj});
    }

    function updateOrderShippingAddress(obj) {
        return serverRequest(ORDER_CONFIG.UPDATE_ORDER_SHIPPING_ADDRESS, {params: obj});
    }

    function unsubscribeRefillOrder(obj) {
        return serverRequest(ORDER_CONFIG.UNSUBSCRIBE_REFILL_ORDER, {params: obj});
    }

    function rescheduleDelivery(obj) {
        return serverRequest(ORDER_CONFIG.RESCHEDULE_DELIVERY, {params: obj});
    }

    function getPrescriptionDetails(obj) {
        return serverRequest(ORDER_CONFIG.GET_PRESCRIPTION_DETAILS, {params: obj});
    }

    function prescriptionUploadForEditOrder(config) {
        return serverRequest(ORDER_CONFIG.UPLOAD_PRESCRIPTION_FOR_EDIT_ORDER, config);
    }

    function getOrderNewDataset(obj) {
        return serverRequest(ORDER_CONFIG.GET_ORDER_NEW_DATASET, {params: obj});
    }

    function getMartOrdersCount(obj,type) {
        if(type == "mart"){
            return serverRequest(ORDER_CONFIG.GET_MART_ORDER_DASHBOARD_DATASET,{params: obj});
        }
        else if(type == "prescription"){
            return serverRequest(ORDER_CONFIG.GET_PRESCRIPTION_ORDER_DASHBOARD_DATASET,{params: obj})
        }
    }

    function getLabOrdersCount(obj) {
        return serverRequest(ORDER_CONFIG.GET_LAB_ORDER_DASHBOARD_DATASET,{params: obj});
    }

    function claimOrUnclaimOrder(obj){
        return serverRequest(ORDER_CONFIG.CLAIM_OR_UNCLAIM_ORDER,{params: obj});
    } 

    function getMartClaimedOrders(obj){
        return serverRequest(ORDER_CONFIG.GET_MART_CLAIMED_ORDER,{params: obj});
    }

    function getApprovedProposedOrders(obj) {
        return serverRequest(ORDER_CONFIG.GET_APPROVED_PROPOSED_ORDERS, {params: obj});
    }

    function getProductsInProposedOrder(obj){
        return serverRequest(ORDER_CONFIG.GET_PRODUCTS_IN_PROPOSED_ORDERS, {params: obj});
    }

    function withdrawProductInProposedOrder(orderId){
        return serverRequest(ORDER_CONFIG.WITHDRAW_PRODUCT_IN_PROPOSED_ORDER, {params: orderId});
    }

    function approveProductInProposedOrder(obj){
        return serverRequest(ORDER_CONFIG.APPROVE_PRODUCT_IN_PROPOSED_ORDER, {params: obj});

    }

    function createBankDeposit(obj){
        return serverRequest(ORDER_CONFIG.CREATE_BANK_DEPOSIT, {params: obj});
    }
    
    function sendPaymentLinkForMartOrder(obj){
        return serverRequest(ORDER_CONFIG.SEND_PAYMENT_LINK_FOR_MART_ORDER, {params: obj});
    }

    return Object.freeze({
        getOrders,
        getOrderDetailsForEdit,
        approveEditedOrder,
        getOrderDetails,
        getOrderDispatchDetails,
        getOrderTicketDetails,
        getCustomerReturnRequests,
        getReturnRequestDetail,
        getReturnRequestForOrder,
        createReturnRequest,
        getImageServerDetails,
        uploadFilesToImageServer,
        sendRetryPaymentLink,
        requestEPrescription,
        getProducts,
        approveWebOrder,
        cancelWebOrder,
        convertToCod,
        requestCancelOrder,
        addPatientDetails,
        updateOrderShippingAddress,
        unsubscribeRefillOrder,
        rescheduleDelivery,
        getPrescriptionDetails,
        prescriptionUploadForEditOrder,
        getOrderNewDataset,
        getMartOrdersCount,
        getLabOrdersCount,
        claimOrUnclaimOrder,
        getMartClaimedOrders,
        getApprovedProposedOrders,
        getProductsInProposedOrder,
        withdrawProductInProposedOrder,
        approveProductInProposedOrder,
        createBankDeposit,
        sendPaymentLinkForMartOrder
    }); 
}
