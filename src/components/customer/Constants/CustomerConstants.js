export const CustomerConstants = {
    subscriptionType: {
        INDIVIDUAL: "INDIVIDUAL",
        INDIVIDUAL_COMBO: "INDIVIDUAL_COMBO",
        ORGANIZATION: "ORGANIZATION",
        ORGANIZATION_COMBO: "ORGANIZATION_COMBO"
    },
    pageType: {
        SUBSCRIPTION_DETAIL: "SUBSCRIPTION_DETAIL",
        BUY_PLAN: "BUY_PLAN"
    }
}
export const SubscriptionPlanBenefitType = {
    "HEALTH_CARE": "Health Care",
    "PHARMACY": "Pharmacy"
}
export const dateFormatWIthoutTime = "mmm dd, yyyy";

export const dateFormatWIthTime = "mmm dd, yyyy HH:mm:ss";

export const SubscriptionStatus = {
    "active": "ACTIVE",
    "refunded": "REFUNDED"
}

export const CUSTOMER = 'customer'

export const MEDPLUS_ADVANTAGE = 'medplusAdvantage'

export const LAB_ORDER = 'labOrder'

export const getVertical =(vertical)=>{
    if(vertical=="WEB")
        return "Web"
    if(vertical=="DIAGNOSTIC_CENTER")
        return "Diagnostic Center"
    if(vertical=="CRM")
        return "Crm"
    if(vertical=="MOBILE") 
        return "Mobile"
    if(vertical=="POS")
        return "Pos"
}

export const PaymentModes = {
    "cod": "Cash On delivery"
}

export const CollectionType = {
    BOTH : "B",
    WALK_IN : "W",
    HOME_COLLECTION : "H"
}

export const PrescriptionTypeConstants = {
    SEND_TO_DOCTOR : "D",
    ADD_NEW_PRESCRIPTION: "N",
    ADD_OLD_PRESCRIPTION: "O"
}

export const PrescriptionConstants = {
    PRESCRIPTION_ORDER_CONVERTED_TO_OMS : "D",
    PRESCRIPTION_ORDER_CANCEL : "C",
    PRESCRIPTION_ORDER_STATUS_DECODED : "T",
    PRESCRIPTION_CREATED: "I"
}