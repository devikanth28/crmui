import { serverRequest, uploadFilesToServer } from "../../axios"
import Validate from "../../helpers/Validate"
import CHECKOUT_CONFIG from "./CheckoutConfig"


export default () => {
    const validate = Validate();

    function modifyCart(obj) {
        return serverRequest(CHECKOUT_CONFIG.API.MODIFY_CART, obj)
    }

    function getCartInfo(obj) {
        return serverRequest(CHECKOUT_CONFIG.API.GET_CART_INFO, obj)
    }

    function addPatientToShoppingCart(obj) {
        return serverRequest(CHECKOUT_CONFIG.API.ADD_PATIENT_TO_SHOPPING_CART, obj)
    }

    function getPreviousPrescriptions(config) {
        return serverRequest(CHECKOUT_CONFIG.API.GET_PREVIOUS_PRESCRIPTIONS, config);
    }

    function getImageServerDetail(obj) {
        return serverRequest(CHECKOUT_CONFIG.API.GET_IMAGE_SERVER_DETAIL, { params: obj });
    }

    function uploadPrescription(config) {
        return serverRequest(CHECKOUT_CONFIG.API.UPLOAD_PRESCRIPTION, config);
    }

    async function uploadFilesToImageServer(filesToUpload, requestConfig) {
        let filesFormData = new FormData();
        for (const eachFile of filesToUpload) {
            filesFormData.append('files', eachFile);
        }
        const response = await getImageServerDetail({ imageType: "P" });
        if (validate.isNotEmpty(response) && response.message == "Success!" && validate.isNotEmpty(response.dataObject)) {
            const imageServerDetail = response.dataObject.imageServerDetail;
            const url = imageServerDetail.imageServerUrl + "/upload?token=" + imageServerDetail.accessToken + "&clientId=" + imageServerDetail.clientId + "&imageType=" + "P";
            const uploadedImageData = await uploadFilesToServer(url, filesFormData, requestConfig);
            return new Promise((resolve) => {
                uploadedImageData['imageServerDetails'] = imageServerDetail;
                return resolve(uploadedImageData);
            });
        } else {
            return new Promise((resolve) => {
                return resolve({ statusCode: 'FAILURE', msg: 'Something went wrong. Please try again!' });
            });
        }
    }

    const getPickStoreDetails = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.GET_PICK_STORE_DETAILS, config);
    }

    const setDeliveryAndPaymentDetails = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.SET_DELIVERY_AND_PAYMENT_DETAILS, config);
    }

    const addOrModifyComplimentaryItem = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.ADD_MODIFY_COMPLIMENTARY_ITEM, config);
    }

    const getLocationDeliveryDetails = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.GET_LOCATION_DELIVERY_DETAILS, config);
    }

    const getCustomerCartOrderStoreId = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.GET_CUSTOMER_CARD_ORDER_STORE_ID, config);
    }

    const savePrescriptionDetails = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.SAVE_PRESCRIPTION_DETAILS, config);
    }

    const getOrderReview = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.GET_ORDER_REVIEW, config);
    }
    
    const setPaymentDetails = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.SET_PAYMENT_DETAILS, config);
    }

    function getSwitchProducts(config) {
        return serverRequest(CHECKOUT_CONFIG.API.GET_SWITCH_PRODUCTS, config);
    }
    
    function getSwitchCartTotal(config) {
        return serverRequest(CHECKOUT_CONFIG.API.GET_SWITCH_PRODUCTS_CART_TOTAL, config);
    }

    const applyCoupon = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.APPLY_COUPON, config);
    }


    const getThankYouOrderDetails = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.GET_THANK_YOU_DETAILS, config);
    }

    const createRefilRequest = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.CREATE_REFIL_REQUEST, config);
    }

    const modifyMiniCart = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.MODIFY_SWITCH_CART_ITEMS, config);
    }

    const getMartCatalogPrescriptions = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.GET_MART_CATALOG_PRESCRIPTION, config);
    }

    const createOmsOrder = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.CREATE_OMS_ORDER, config);
    }

    const setCOData= (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.SET_CO_DATA, config);
    }

    const getCheckoutInfoFromRedis = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.GET_CHECKOUT_INFO_FROM_REDIS, config);
    }

    const removeCoupon = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.REMOVE_COUPON, config);
    }
   
    const getCOData = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.GET_CO_DATA, config);
    }

    const getHealthRecordDetails = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.GET_HEALTH_RECORD_DETAILS, config);
    }

    const removePrescAndRecordIdFromCart = (config) => {
        return serverRequest(CHECKOUT_CONFIG.API.REMOVE_PRESC_AND_RECORDID_FROM_CART, config);
    }

    return Object.freeze({
        modifyCart,
        getCartInfo,
        addPatientToShoppingCart,
        getPreviousPrescriptions,
        getImageServerDetail,
        uploadFilesToImageServer,
        uploadPrescription,
        getPickStoreDetails,
        setDeliveryAndPaymentDetails,
        getLocationDeliveryDetails,
        getCustomerCartOrderStoreId,
        savePrescriptionDetails,
        addOrModifyComplimentaryItem,
        getOrderReview,
        setPaymentDetails,
        getSwitchProducts,
        getSwitchCartTotal,
        applyCoupon,
        getThankYouOrderDetails,
        createRefilRequest,
        modifyMiniCart,
        getMartCatalogPrescriptions,
        createOmsOrder,
		setCOData,
        getCheckoutInfoFromRedis,
        removeCoupon,
        getCOData,
        getHealthRecordDetails,
        removePrescAndRecordIdFromCart
    })
}