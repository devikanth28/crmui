import { serverRequest } from "../../axios"
import SHOPPING_CART_CONFIG from "./ShoppingCartConfig"

export default () => {

    function addProductsToCart ({customerId,latLong,recordId,products,prescriptionId}) {
        return serverRequest(SHOPPING_CART_CONFIG.ADD_PRODUCTS_TO_CART,{params:{customerId,latLong,recordId,prescriptionId},data:{products}});
    }

    return Object.freeze({
        addProductsToCart
    })
}