export const persistKey = 'agent-app:';

export const tokenId = 'tokenId';

export const customerId = 'customerId';

export const SubscriptionBenefitType = {
    PHARMA: 'PHARMACY',
    HEALTHCARE: 'HEALTH_CARE',
}

export const getBenefitTypeKey = (benifitType)=>{
    switch(benifitType){
        case SubscriptionBenefitType.PHARMA : return "P";
        case SubscriptionBenefitType.HEALTHCARE : return "H";
        default : return "C";
    }
}

export const  photoIdInputMaxLength = {
    "AADHAAR_CARD" : 12,
    "DRIVING_LICENSE" : 16,
    "PAN_CARD" : 10,
    "PASSPORT" : 8,
    "PENSION_PASSBOOK" : 12,
    "NPR_SMART_CARD" : 16,
    "VOTER_ID" : 10
}