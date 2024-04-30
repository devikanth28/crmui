import CATALOG_CONFIG from "./CatalogConfig";
import { serverRequest, uploadFilesToServer } from "../../axios";
import Validate from "../../helpers/Validate";

export default function CatalogService() {

function getProductSearch(config, requestConfig) {
    return serverRequest({...CATALOG_CONFIG.API.GET_PRODUCT_SEARCH, ...requestConfig}, config);
}

function getAlternateProductsInfo(config) {
    return serverRequest(CATALOG_CONFIG.API.GET_ALTERNATE_PRODUCT_INFO, config);
}

function getProductDetail(config) {
    return serverRequest(CATALOG_CONFIG.API.GET_PRODUCT_DETAIL, config);
}

function addOrModifyProductToCart(config) {
    return serverRequest(CATALOG_CONFIG.API.ADD_OR_MODIFY_CART, config);
}

function getNearByStores(config) {
    return serverRequest(CATALOG_CONFIG.API.GET_NEAR_BY_STORES, config);
}

function getShoppingCart(config) {
    return serverRequest(CATALOG_CONFIG.API.PREPARE_SHOPPING_CART, config);
}   

function getLocationETAInfo(config) {
    return serverRequest(CATALOG_CONFIG.API.GET_LOCATION_ETA_INFO, config);
}

function clearShoppingCart(config) {
    return serverRequest(CATALOG_CONFIG.API.CLEAR_SHOPPING_CART, config);
}

function getCartInfoFromRedis(config) {
    return serverRequest(CATALOG_CONFIG.API.GET_CART_INFO_FROM_REDIS, config);
}

function getCartInfo(config) {
    return serverRequest(CATALOG_CONFIG.API.GET_CART_INFO, config);
}

function productNotifyMe(config) {
    return serverRequest(CATALOG_CONFIG.API.NOTIFY_PRODUCT, config);
}
return Object.freeze({
    getProductSearch,
    getAlternateProductsInfo,
    getProductDetail,
    addOrModifyProductToCart,
    getNearByStores,
    getShoppingCart,
    getLocationETAInfo,
    clearShoppingCart,
    getCartInfoFromRedis,
    getCartInfo,
    productNotifyMe
});

}