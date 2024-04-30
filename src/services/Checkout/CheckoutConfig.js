import { END_POINT, REQUEST_TYPE } from "../ServiceConstants";


const CHECKOUT_CONFIG = {
    API: {
        MODIFY_CART: {
            url: "/modifyCart",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT
        },
        GET_CART_INFO: {
            url: "/getCartInfo",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT
        },
        ADD_PATIENT_TO_SHOPPING_CART: {
            url: "/addPatientToShoppingCart",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT
        },

        GET_PREVIOUS_PRESCRIPTIONS: {
            url: "/getCheckoutPrescriptionOptions",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT
        },

        GET_IMAGE_SERVER_DETAIL: {
            url: "/getImageServerDetail",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MY_PROFILE
        },

        UPLOAD_PRESCRIPTION: {
            url: "/uploadHealthRecord",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT,
        },

        GET_PICK_STORE_DETAILS: {
            url: "/getPickStoreDetails",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT,
        },

        SET_DELIVERY_AND_PAYMENT_DETAILS: {
            url: "/setDeliveryAndPaymentDetails",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT,
        },

        GET_LOCATION_DELIVERY_DETAILS: {
            url: "/getLocationDeliveryDetails",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT,
        },

        GET_CUSTOMER_CARD_ORDER_STORE_ID: {
            url: "/getCustomerCartOrderStoreId",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT,
        },

        SAVE_PRESCRIPTION_DETAILS: {
            url: "/setPrescriptionDetails",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        ADD_MODIFY_COMPLIMENTARY_ITEM: {
            url: "/addOrModifyComplimentaryItem",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        GET_ORDER_REVIEW: {
            url: "/getOrderReviewDetails",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        SET_PAYMENT_DETAILS: {
            url: "/setPaymentDetails",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        GET_SWITCH_PRODUCTS: {
            url: "/getSwitchProducts",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT
        },
        GET_SWITCH_PRODUCTS_CART_TOTAL: {
            url: "/getSwitchCartTotal",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT
        },
        APPLY_COUPON: {
            url: "/applyCoupon",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        GET_THANK_YOU_DETAILS: {
            url: "/getOrderDetails",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        CREATE_REFIL_REQUEST: {
            url: "/createRefillRequest",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        MODIFY_SWITCH_CART_ITEMS:{
            url: "/modifySwitchCartItems",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT
        },
        GET_MART_CATALOG_PRESCRIPTION: {
            url:"/getPrescriptionDetails",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MY_PROFILE,
        },
        CREATE_OMS_ORDER: {
            url:"/createOrder",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        SET_CO_DATA: {
            url:"/setCOData",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        GET_CHECKOUT_INFO_FROM_REDIS: {
            url:"/getCheckoutInfoFromRedis",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        REMOVE_COUPON: {
           url: "/removeCoupon",
           method: REQUEST_TYPE.POST,
           endPoint: END_POINT.MART_CHECKOUT,
        },
        GET_CO_DATA: {
            url: "/getCOData",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        GET_HEALTH_RECORD_DETAILS: {
            url: "/getHealthRecordDetails",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT,
        },
        REMOVE_PRESC_AND_RECORDID_FROM_CART: {
            url: "/removePrescAndRecordIdFromCart",
            method: REQUEST_TYPE.GET,
            endPoint: END_POINT.MART_CHECKOUT,
        }
    }
}
export default CHECKOUT_CONFIG