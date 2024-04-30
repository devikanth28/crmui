
export const REQUEST_TYPE = {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

export const END_POINT = {
    MY_PROFILE: '/my-profile-api',
    DOCTOR_CONSULTATION: '/doctor-consultation-api',
    MART_CHECKOUT:'/mart-checkout-api',
    MART_CATALOG_API:'/mart-catalog-api',
    MEDPLUS_SUBSCRIPTION:'/medplusSubscription',
    LAB_CHECKOUT:'/labcheckout-api/checkout',
    LAB_CATALOG:'/labcatalog-api',
    PAYBACK_API:'/payback-api',
    CUSTOMER:'/customer-auth',
    MART_COMMON:'/mart-common-api',
    TOKEN:'/token'
};

export const CONTENT_TYPE = {
    JSON: 'application/json; charset=utf-8'
};

export const API_URL = '/customer-relations/';

export const CRM_UI = '/customer-relations/ui'

export const AGENT_UI = CRM_UI + '/agent'

const DIAGNOSTICS_API = "diagnostics-api/";

const AGENT_APP_API = "agent-app-api/";

export const QR_API = DIAGNOSTICS_API + "rest/qr";

export const AGENT_APP_SERVICES_API = AGENT_APP_API + "aas";

export const MA_API_URL = API_URL + AGENT_APP_SERVICES_API;