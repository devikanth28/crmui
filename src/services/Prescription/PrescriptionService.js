import { serverRequest } from "../../axios";
import PRESCRIPTION_CONFIG from "./prescriptionConfig";

export default () => {
    function getPrescriptionInfo(obj) {
        return serverRequest(PRESCRIPTION_CONFIG.PRESCRIPTION_HOME, {params: obj});
    }

    function getCancellationStatus(obj) {
        return serverRequest(PRESCRIPTION_CONFIG.CANCELLATION_REASON, {params: obj});
    }

    function getSentEmailStatus(obj) {
        return serverRequest(PRESCRIPTION_CONFIG.SEND_EMAIL, {params: obj});
    }

    function getSentSmsStatus(obj) {
        return serverRequest(PRESCRIPTION_CONFIG.SEND_SMS, {params: obj});
    }

    function getCustomerData(obj) {
        return serverRequest(PRESCRIPTION_CONFIG.GET_CUSTOMER_DATA, {params: obj});
    }

    function getPrescriptionMetaInfo(obj) {
        return serverRequest(PRESCRIPTION_CONFIG.GET_PRESCRIPTION_META_INFO, {params: obj});
    }

    function getCreatedStatusMetaInfo(obj) {
        return serverRequest(PRESCRIPTION_CONFIG.GET_CREATED_STATUS_META_INFO, {params: obj});
    }
    function getPrescriptionDetails(obj){
        return serverRequest(PRESCRIPTION_CONFIG.GET_PRESCRIPTION_DETAILS, {params: obj});
    }
    function getPrescriptionClaimedOrders(obj){
        return serverRequest(PRESCRIPTION_CONFIG.GET_PRESCRIPTION_CLAIMED_ORDERS, {params: obj});
    }
    function getDecodedInformation(obj){
        return serverRequest(PRESCRIPTION_CONFIG.GET_DECODED_INFO, {params: obj});
    }
    function getHealthRecord(obj){
        return serverRequest(PRESCRIPTION_CONFIG.GET_HEALTH_RECORD, {params: obj});
    }
    function getAssociatedOrders(obj){
        return serverRequest(PRESCRIPTION_CONFIG.GET_ASSOCIATE_ORDERS, {params: obj});
    }

    return Object.freeze({
        getPrescriptionInfo,
        getCancellationStatus,
        getSentEmailStatus,
        getSentSmsStatus,
        getCustomerData,
        getPrescriptionMetaInfo,
        getCreatedStatusMetaInfo,
        getPrescriptionDetails,
        getPrescriptionClaimedOrders,
        getDecodedInformation,
        getHealthRecord,
        getAssociatedOrders
    });
}