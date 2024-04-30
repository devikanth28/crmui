import { AGENT_APP_SERVICES_API, QR_API, REQUEST_TYPE } from "../ServiceConstants";


const AGENT_APP_CONFIG = {

	SET_HEADER_INFO: {
		url: AGENT_APP_SERVICES_API + "/setMATokenData",
		method: REQUEST_TYPE.POST,
	},

	GET_HEADER_INFO: {
		url: AGENT_APP_SERVICES_API + "/getHeaderInfo",
		method: REQUEST_TYPE.GET,
	},

	GET_CUSTOMER_INFO: {
		url: AGENT_APP_SERVICES_API + "/getCustomerInfo",
		method: REQUEST_TYPE.GET,
	},

	GET_MEMBERSHIP_INFO: {
		url: AGENT_APP_SERVICES_API + "/getSubscriptionDetails",
		method: REQUEST_TYPE.GET,
	},
	GET_PLANS_LIST: {
		url:AGENT_APP_SERVICES_API+"/getPlansList",
		method:REQUEST_TYPE.GET
	},
	GET_PLAN_DETAILS: {
		url: AGENT_APP_SERVICES_API + "/getPlanDetails",
		method: REQUEST_TYPE.GET,
	},
	GET_STATIC_CONTENT: {
		url: AGENT_APP_SERVICES_API + "/getStaticContent",
		method: REQUEST_TYPE.GET,
	},
	REQUEST_OTP_TO_VERFIY_MEMBER_DETAILS: {
		url: AGENT_APP_SERVICES_API + "/sendOtpToVerifyPatientInfo",
		method: REQUEST_TYPE.POST,
	},
	GET_MEMBERS: {
		url: AGENT_APP_SERVICES_API+ '/getMembers',
		method: REQUEST_TYPE.GET
	},
	SAVE_MEMBERS: {
		url: AGENT_APP_SERVICES_API+ '/saveMembers',
		method: REQUEST_TYPE.POST
	},
	GET_SUBSCRIPTIONS: {
		url: AGENT_APP_SERVICES_API+ '/getSubscriptions',
		method: REQUEST_TYPE.GET
	},
	DELETE_MEMBER: {
		url: AGENT_APP_SERVICES_API+ '/deleteMember',
		method: REQUEST_TYPE.POST
	},
	SEND_PLAN_TO_CUSTOMER: {
		url: AGENT_APP_SERVICES_API+ '/sendPlanDetails',
		method: REQUEST_TYPE.GET
	},
	GET_CART_SUMMARY: {
		url: AGENT_APP_SERVICES_API+'/getCartSummary',
		method: REQUEST_TYPE.GET
	},
	GET_PAYMENTLIST_DETAILS: {
		url: AGENT_APP_SERVICES_API+'/getPaymentListDetails',
		method: REQUEST_TYPE.GET
	},
	VALIDATE_OTP: {
		url: AGENT_APP_SERVICES_API+'/validateOtp',
		method: REQUEST_TYPE.POST
	},
	GET_IMAGE_SERVER_DETAILS : {
		url : AGENT_APP_SERVICES_API+'/getImageServer',
		method: REQUEST_TYPE.GET
	},
	GET_SUBSCRIPTION_ORDER: {
		url: AGENT_APP_SERVICES_API+'/getSubscriptionOrder',
		method: REQUEST_TYPE.POST
	},
	GET_SUBSCRIPTION_DETAIL : {
		url: AGENT_APP_SERVICES_API + "/getSubscriptionDetail",
		method: REQUEST_TYPE.GET,
	},
	CREATE_SUBSCRIPTION_ORDER : {
		 url: AGENT_APP_SERVICES_API + "/createOrder",
		 method: REQUEST_TYPE.POST,
	},
	CHECK_PAYMENT_STATUS : {
		url: AGENT_APP_SERVICES_API + "/checkDevicePaymentStatus",
		method: REQUEST_TYPE.GET,
	},
	SEARCH_CUSTOMER: {
		url: AGENT_APP_SERVICES_API + "/searchCustomer",
		method: REQUEST_TYPE.GET
	},
	CREATE_CUSTOMER_BY_AGENT: {
		url: AGENT_APP_SERVICES_API + "/createCustomer",
		method: REQUEST_TYPE.POST
	},
	GET_STORE_LOCATIONS: {
		url: AGENT_APP_SERVICES_API + "/getLocalitySuggestions",
		method: REQUEST_TYPE.GET
	},
	SET_LOCALITY: {
		url: AGENT_APP_SERVICES_API + "/setLocality",
		method: REQUEST_TYPE.POST
	},
	SET_LOCALITY_BY_COLLECTION_CENTER: {
		url: AGENT_APP_SERVICES_API + "/setLocalityByCollectionCenterId",
		method: REQUEST_TYPE.GET,
	},
	QR : {
		CREATE_QR_REQUEST: {
			url: QR_API + "/createQrRequest",
			method: REQUEST_TYPE.POST,
		},
		CHECK_QR_TXN_STATUS: {
			url: QR_API + "/checkQrTxStatus",
			method: REQUEST_TYPE.POST,
		}
	},
	GET_THANK_YOU_RESPONSE: {
		url: AGENT_APP_SERVICES_API + "/getMAThankyou",
		method: REQUEST_TYPE.GET,
	},
	GET_PAYMENT_DETAILS: {
		url: AGENT_APP_SERVICES_API + "/getPaymentDetails",
		method: REQUEST_TYPE.GET,
	},
	GET_RETRY_PAYMENT_INFO: {
		url: AGENT_APP_SERVICES_API + "/getRetryPaymentInfo",
		method: REQUEST_TYPE.GET,
	},
};
export default AGENT_APP_CONFIG;
