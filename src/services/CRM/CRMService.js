import CRM_CONFIG from "./CRMConfig";
import { serverRequest } from "../../axios";

export default function CRMService() {

function getMWalletRefundInfo(obj) {
    return serverRequest(CRM_CONFIG.API.MWALLET.GET_MWALLET_REFUND_INFO, {params:obj});
}

function getStoresInfo(obj) {
    return serverRequest(CRM_CONFIG.API.STORE_LOCATOR.GET_STORES_INFO, {params:obj});
}

function getStoreLocalities(obj,config) {
    return serverRequest({...CRM_CONFIG.API.STORE_LOCATOR.GET_STORE_LOCATIONS,...config}, {params:obj});
}

function getStoreLocalityInfo(obj) {
    return serverRequest(CRM_CONFIG.API.STORE_LOCATOR.GET_STORE_LOCALITY_INFO, {params:obj});
}

return Object.freeze({
    getMWalletRefundInfo,
    getStoresInfo,
    getStoreLocalities,
    getStoreLocalityInfo
});

}