import Database from "../../Database";
import { serverRequest } from "../../axios";
import { persistKey, tokenId } from "../../constants/AgentAppConstants";
import AGENT_APP_CONFIG from "./AgentAppConfig";

export default (tpaTokenId = Database.getValue(persistKey + tokenId)) => {

    const config = {headers : {'Authorization' : `Bearer ${tpaTokenId}`}}

    const setMATokenData = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.SET_HEADER_INFO, {...config, data: obj});
    };

    const getHeaderInfo = () => {
        return serverRequest(AGENT_APP_CONFIG.GET_HEADER_INFO, config);
    };

    const getCustomerInfo = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.GET_CUSTOMER_INFO, {...config, params: obj});
    };

	const getSubscriptionDetails = (obj) => {
		return serverRequest(AGENT_APP_CONFIG.GET_MEMBERSHIP_INFO, {...config, params: obj });
	};
    const getSubscriptionDetail = (obj) => {
		return serverRequest(AGENT_APP_CONFIG.GET_SUBSCRIPTION_DETAIL, {...config, params: obj });
	};
    const getPlansList = () => {
        return serverRequest(AGENT_APP_CONFIG.GET_PLANS_LIST, {...config});
    }
    const getPlanDetails = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.GET_PLAN_DETAILS, {...config, params: obj });
    }
    const getStaticContent = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.GET_STATIC_CONTENT, {...config, params: obj });
    }
    const requestOtpToVerifyMemberDetails = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.REQUEST_OTP_TO_VERFIY_MEMBER_DETAILS, {...config, data: obj });
    }
    function getMembers(obj) {
        return serverRequest(AGENT_APP_CONFIG.GET_MEMBERS, {...config,params: obj});
    }
    function saveMembers(obj) {
        return serverRequest(AGENT_APP_CONFIG.SAVE_MEMBERS, {...config,data: obj});
    }
    function getSubscriptions(obj) {
        return serverRequest(AGENT_APP_CONFIG.GET_SUBSCRIPTIONS, {...config,params: obj});
    }

    const deleteMember = (obj) =>{
        return serverRequest(AGENT_APP_CONFIG.DELETE_MEMBER, {...config, data: obj })
    }

    const sendPlanToCustomer = (obj) =>{
        return serverRequest(AGENT_APP_CONFIG.SEND_PLAN_TO_CUSTOMER, {...config, params: obj })
    }

    const getCartSummary = () => {
        return serverRequest(AGENT_APP_CONFIG.GET_CART_SUMMARY, { ...config })
    }
    const getPaymentListDetails =() =>{
        return serverRequest(AGENT_APP_CONFIG.GET_PAYMENTLIST_DETAILS,{...config});
    }

    const validateOtp = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.VALIDATE_OTP, { ...config, data: obj });
    }

    const getImageServerDetails=()=>{
        return serverRequest(AGENT_APP_CONFIG.GET_IMAGE_SERVER_DETAILS, {...config});
    }

    const searchCustomer=(obj)=>{
        return serverRequest(AGENT_APP_CONFIG.SEARCH_CUSTOMER,{...config,params: obj});
    }

    const createCustomerByAgent=(obj)=>{
        return serverRequest(AGENT_APP_CONFIG.CREATE_CUSTOMER_BY_AGENT,{...config,data: obj});
    }
    
    const getSubscriptionOrder = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.GET_SUBSCRIPTION_ORDER, { ...config, data: obj });
    }

    const createSubscriptionOrder = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.CREATE_SUBSCRIPTION_ORDER, {...config, params : obj})
    }

    const checkPaymentStatus = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.CHECK_PAYMENT_STATUS, {...config, params : obj})
    }

    const getStoreLocalities = (obj,requestConfig) =>{
        return serverRequest({...AGENT_APP_CONFIG.GET_STORE_LOCATIONS,...requestConfig}, {...config, params:obj});
    }
    const setLocality = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.SET_LOCALITY, {...config, params : obj})
    }

    const createQrRequest = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.QR.CREATE_QR_REQUEST, {...config, data: obj});
    }
    const setLocalityByCollectionCenterId = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.SET_LOCALITY_BY_COLLECTION_CENTER, {...config, params : obj})
    }
    const checkQrTxStatus = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.QR.CHECK_QR_TXN_STATUS, {...config, data : obj})
    }

    const getThankYouResponse = () => {
        return serverRequest(AGENT_APP_CONFIG.GET_THANK_YOU_RESPONSE, config)
    }

    const getPaymentDetails = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.GET_PAYMENT_DETAILS, {...config, params : obj})
    }

    const getRetryPaymentInfo = (obj) => {
        return serverRequest(AGENT_APP_CONFIG.GET_RETRY_PAYMENT_INFO, {...config, params : obj})
    }
    
    return Object.freeze({
        setMATokenData,
        getHeaderInfo,
        getCustomerInfo,
        getSubscriptionDetails,
        getPlansList,
        getPlanDetails,
        getStaticContent,
        requestOtpToVerifyMemberDetails,
        getMembers,
        saveMembers,
        getSubscriptions,
        deleteMember,
        sendPlanToCustomer,
        getImageServerDetails,
        getCartSummary,
        validateOtp,
        getPaymentListDetails,
        getSubscriptionOrder,
        getSubscriptionDetail,
        createSubscriptionOrder,
        checkPaymentStatus,
        searchCustomer,
        createCustomerByAgent,
        getStoreLocalities,
        setLocality,
        createQrRequest,
        setLocalityByCollectionCenterId,
        checkQrTxStatus,
        getThankYouResponse,
        getPaymentDetails,
        getRetryPaymentInfo
    });
}