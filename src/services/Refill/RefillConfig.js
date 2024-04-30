import { REQUEST_TYPE } from "../ServiceConstants";

const REFILL_ORDER_CONFIG = {

    GET_REFILL_INFO: {
        url: "/getRefillInfo",
        method: REQUEST_TYPE.GET
    },

    GET_REFILL_ORDER_INFO: {
        url: "/getRefillOrderInfo",
        method: REQUEST_TYPE.POST
    },

    UPDATE_REFILL_INTERVAL:{
        url: "/updateRefillInterval",
        method: REQUEST_TYPE.POST
    },

    REMOVE_REFILL_ITEM:{
        url: "/removeRefillItem",
        method: REQUEST_TYPE.POST
    },

    UPDATE_PRODUCT_QUANTITY:{
        url: "/updateProductQuantity",
        method: REQUEST_TYPE.POST 
    }

}
export default REFILL_ORDER_CONFIG;