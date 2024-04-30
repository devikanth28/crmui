import { REQUEST_TYPE } from "../ServiceConstants"

const PRESCRIPTION_CONFIG = {

    PRESCRIPTION_HOME: {
        url: '/getPrescriptionInfo',
        method: REQUEST_TYPE.GET
    }, CANCELLATION_REASON: {
        url: '/cancelPrescriptionOrder',
        method: REQUEST_TYPE.POST
    }, SEND_EMAIL: {
        url: '/sendEmail',
        method: REQUEST_TYPE.POST
    }, SEND_SMS: {
        url: '/sendSms',
        method: REQUEST_TYPE.POST
    }, GET_CUSTOMER_DATA: {
        url: '/searchCustomerData',
        method: REQUEST_TYPE.POST
    }, GET_PRESCRIPTION_META_INFO: {
        url: '/getPrescriptionMetaInfo',
        method: REQUEST_TYPE.GET
    }, GET_CREATED_STATUS_META_INFO: {
        url: '/getCreatedStatusMetaInfo',
        method: REQUEST_TYPE.GET
    },GET_PRESCRIPTION_DETAILS: {
        url: '/getPrescriptionDetails',
        method: REQUEST_TYPE.GET
    },GET_PRESCRIPTION_CLAIMED_ORDERS: {
        url: '/getPrescriptionClaimedOrders',
        method: REQUEST_TYPE.GET
    },GET_DECODED_INFO: {
        url:'/getDecodedInformation',
        method: REQUEST_TYPE.GET
    },GET_HEALTH_RECORD: {
        url:'/fetchHealthRecord',
        method: REQUEST_TYPE.GET
    },GET_ASSOCIATE_ORDERS: {
        url: '/getHealthRecordAssociatedOrders',
        method: REQUEST_TYPE.POST
    }

}
export default PRESCRIPTION_CONFIG