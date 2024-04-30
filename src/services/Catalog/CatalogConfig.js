import { END_POINT, REQUEST_TYPE } from "../ServiceConstants";

const CATALOG_CONFIG = {
    API: {
        GET_PRODUCT_SEARCH: {
            url: "/getProductSearch",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CATALOG_API
        },

        GET_ALTERNATE_PRODUCT_INFO: {
            url: "/product/getAlternateProducts",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CATALOG_API
        },

        GET_PRODUCT_DETAIL: {
            url: "/product/getCompleteProductInformation",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CATALOG_API
        },

        ADD_OR_MODIFY_CART: {
            url: "/addOrModifyCart",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CATALOG_API
        },

        GET_NEAR_BY_STORES: {
            url: "/product/productAvailableStores",
            method : REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CATALOG_API
        },

        PREPARE_SHOPPING_CART: {
            url: "/prepareMiniShoppingCart",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CATALOG_API
        },

        GET_LOCATION_ETA_INFO: {
            url: "/getLocationETAInfo",
            method: REQUEST_TYPE.GET,
            endPoint:END_POINT.MART_CHECKOUT
        },

        CLEAR_SHOPPING_CART: {
            url: "/clearShoppingCart",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CATALOG_API
        },
        
        GET_CART_INFO_FROM_REDIS: {
            url: "/getCartInfoFromRedis",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CATALOG_API,
        },

        GET_CART_INFO: {
            url: "/getCartInfo",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT,
        },

        NOTIFY_PRODUCT: {
            url: "/requestCustRequisitionProduct",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MY_PROFILE
        }
    }
}

export default CATALOG_CONFIG;