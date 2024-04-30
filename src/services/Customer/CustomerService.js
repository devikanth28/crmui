import { serverRequest, getFileOrObjectFromServer } from "../../axios";
import CUSTOMER_CONFIG from "./CustomerConfig";

export default () => {
    function customerHome(obj) {
        return serverRequest(CUSTOMER_CONFIG.CUSTOMER_HOME, { params: obj });
    }

    function sendSms(obj) {
        return serverRequest(CUSTOMER_CONFIG.SEND_SMS, {params: obj});
    }

    function createCustomer(obj) {
        return serverRequest(CUSTOMER_CONFIG.CREATE_CUSTOMER, {params: obj});
    }
    
    function getCustomerMenuLinks(obj) {
        return serverRequest(CUSTOMER_CONFIG.GET_CUSTOMER_MENU_LINKS, { params: obj }, CUSTOMER_CONFIG.GET_CUSTOMER_MENU_LINKS.PATH);
    }

    function getCustomerBioEditJson() {
        return serverRequest(CUSTOMER_CONFIG.GET_CUSTOMER_BIO_EDIT_FORM, { });
    }

    function getCustomerDetailsById(customerId) {
        let obj = { "customerId": customerId };
        return serverRequest(CUSTOMER_CONFIG.GET_CUSTOMER_DETAILS_BY_ID, { params : obj});
    }

    function updateCustomerDetails(custDetails) {
        let obj = { "custDetails": custDetails };
        return serverRequest(CUSTOMER_CONFIG.UPDATE_CUSTOMER_DETAILS, { params: obj });
    }

    function getCustomerOrderHistory(obj) {
        return serverRequest(CUSTOMER_CONFIG.ORDER_HISTORY, { params: obj });
    }

    function getPrescriptionOrderDetails(obj) {
        return serverRequest(CUSTOMER_CONFIG.PRESCRIPTION_ORDER_HISTORY, { params: obj });
    }
    
    function getUserProfileInfo(config){
        return serverRequest(CUSTOMER_CONFIG.GET_USER_PROFILE_INFO,config);
    }
    
    function getImageServerDetail(){
        return serverRequest(CUSTOMER_CONFIG.GET_IMAGE_SERVER_DETAIL, { });
    }

    function getStoreInfo(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_STORE_INFO, { params: obj });
    }

    function updateStatus(config){
        return serverRequest(CUSTOMER_CONFIG.UPDATE_STATUS,config);
    }
    
    function getSubscriptions(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_SUBSCRIPTIONS,{ params: obj });
    }

    function getCustomerPointsHistory(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_CUSTOMER_POINTS_HISTORY, { params: obj });
    }

    function updateCustomerData(config){
        return serverRequest(CUSTOMER_CONFIG.UPDATE_CUSTOMER_DATA,config);
    }

    function updateShippingData(config){
        return serverRequest(CUSTOMER_CONFIG.UPDATE_SHIPPING_DATA,config);
    }
    
    function uploadFiles(config){
        return serverRequest(CUSTOMER_CONFIG.UPLOAD_FILES,config);
    }

    function getLocalityAutoSuggestions(obj) {
        return serverRequest(CUSTOMER_CONFIG.GET_LOCALITY_AUTO_SUGGESTIONS, { params: obj });
    }

    function setSelectedLocality(obj){
        return serverRequest(CUSTOMER_CONFIG.SET_SELECTED_LOCALITY, { params: obj });
    }

    function getCfpActions(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_CFP_ACTIONS, { params: obj });
    }

    function getCfpActionDetails(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_CFP_ACTION_DETAILS, { params: obj });
    }

    function saveCfpFollowUp(config){
        return serverRequest(CUSTOMER_CONFIG.SAVE_CFP_FOLLOW_UP, config);
    }

    function getStatusWiseCfpActionsCount(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_STATUS_WISE_CFP_ACTIONS_COUNT, { params: obj });
    }

    function getStateWiseCFPActionsInfo(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_STATE_WISE_CFP_ACTIONS_INFO, { params: obj });
    }

    function getRegionWiseEscalatedCfpStoresCountForState(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_STATE_ESCALATED_CFP_STORE_INFO, { params: obj });
    }

    function addCfpProductsToCart(config){
        return serverRequest(CUSTOMER_CONFIG.ADD_CFP_TO_CART, config);
    }

    function getProcurementDetails(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_PROCUREMENT_DETAILS, {params: obj});
    }
    function getRequisitionDeatls(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_REQUISITION_DETAILS,{params: obj});
    }
    function updateCustomerProcurementCommunication(obj){
        return serverRequest(CUSTOMER_CONFIG.UPDATE_CUSTOMER_PROCUREMENT_COMMUNICATION,{params:obj})
    }
    function getMembers(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_MEMBERS,{params:obj})
    }
    function generateToken(obj){
        return serverRequest(CUSTOMER_CONFIG.GENERATE_TOKEN, obj);
    }
    function sendPaymentLinkToCustomer(obj){
        return serverRequest(CUSTOMER_CONFIG.SEND_PAYMENT_LINK_TO_CUSTOMER, {params:obj})
    }
    function downloadInvoice(obj){
        return serverRequest(CUSTOMER_CONFIG.DOWNLOAD_INVOICE, {params:obj})
    }
    function downloadMembershipCreditNote(obj){
        return serverRequest(CUSTOMER_CONFIG.DOWNLOAD_MEMBERSHIP_CREDIT_NOTE, {params:obj})
    }

    function getCancelReasons(obj){
        return serverRequest(CUSTOMER_CONFIG.GET_CANCEL_REASONS, obj)
    }

    function orderCancel(obj){
        return serverRequest(CUSTOMER_CONFIG.CANCEL_ORDER, {params :obj})
    }

    function createSubscriptionOrder(obj){
        return serverRequest(MEMBERSHIP_CONFIG.CREATE_SUBSCRIPTION_ORDER, {data: obj})
    }

    function getHealthRecordHistory(obj) {
        return serverRequest(CUSTOMER_CONFIG.HEALTH_RECORD_HISTORY.GET_HEALTH_RECORD_HISTORY, { params: obj })
    }

    function updateCustomerPatient ({customerId,patientId,patientName,dateOfBirth,gender}) {
        return serverRequest(CUSTOMER_CONFIG.UPDATE_CUSTOMER_PATIENT,{data:{customerId,patientId,patientName,dateOfBirth,gender}})
    }
    
    function uploadDoctorRegistrationInfo(file) {
        const formData = new FormData();
        formData.append("file", file);
        return getFileOrObjectFromServer(CUSTOMER_CONFIG.UPLOAD_DOCTOR_REGISTRATION_FILE, formData);
    }

    function uploadCheckDetailsForDoctors(file) {
        const formData = new FormData();
        formData.append("file", file);
        return getFileOrObjectFromServer(CUSTOMER_CONFIG.UPLOAD_CHECK_DETAILS_FILE, formData);
    }

    function downloadActiveDoctors() {
        return getFileOrObjectFromServer(CUSTOMER_CONFIG.DOWNLOAD_ACTIVE_DOCTORS,{});
    }

    function updateDoctorClinicDetails(obj){
        return serverRequest(CUSTOMER_CONFIG.UPDATE_DOCTOR_CLINIC_INFO, {data: obj});
    }
    
    return Object.freeze({
        customerHome,
        getCustomerMenuLinks,
        getCustomerBioEditJson,
        getCustomerDetailsById,
        updateCustomerDetails,
        sendSms,
        createCustomer,
        getCustomerOrderHistory,
        getPrescriptionOrderDetails,
        getUserProfileInfo,
        getImageServerDetail,
        getStoreInfo,
        updateStatus,
        getSubscriptions,
        getCustomerPointsHistory,
        updateCustomerData,
        updateShippingData,
        uploadFiles,
        getLocalityAutoSuggestions,
        setSelectedLocality,
        getCfpActionDetails,
        saveCfpFollowUp,
        getCfpActions,
        getStatusWiseCfpActionsCount,
        getStateWiseCFPActionsInfo,
        getRegionWiseEscalatedCfpStoresCountForState,
        addCfpProductsToCart,
        getProcurementDetails,
        getRequisitionDeatls,
        updateCustomerProcurementCommunication,
        getMembers,
        generateToken,
        sendPaymentLinkToCustomer,
        downloadInvoice,
        downloadMembershipCreditNote,
        getCancelReasons,
        orderCancel,
        createSubscriptionOrder,
        getHealthRecordHistory,
        updateCustomerPatient,
        updateCustomerPatient,
        uploadDoctorRegistrationInfo,
        uploadCheckDetailsForDoctors,
        downloadActiveDoctors,
        updateDoctorClinicDetails
    });
}