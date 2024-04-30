import { serverRequest } from "../../axios";
import REFILL_ORDER_CONFIG from "./RefillConfig";

export default () => {

    function getRefillInfo(obj) {
        return serverRequest(REFILL_ORDER_CONFIG.GET_REFILL_INFO, {params: obj});
    }

    function getRefillOrderInfo(obj) {
        return serverRequest(REFILL_ORDER_CONFIG.GET_REFILL_ORDER_INFO, {params: obj});
    }

    function updateRefillInterval(obj) {
        return serverRequest(REFILL_ORDER_CONFIG.UPDATE_REFILL_INTERVAL, {params: obj});
    }

    function removeRefillItem(obj) {
        return serverRequest(REFILL_ORDER_CONFIG.REMOVE_REFILL_ITEM, {params: obj});
    }

    function updateQuantity(obj) {
        return serverRequest(REFILL_ORDER_CONFIG.UPDATE_PRODUCT_QUANTITY, {params: obj});
    }

    return Object.freeze({
        getRefillInfo,
        getRefillOrderInfo,
        updateRefillInterval,
        removeRefillItem,
        updateQuantity
    });
}