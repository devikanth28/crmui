import Validate from "../../../helpers/Validate";

export const ProcessType = Object.freeze({
    NEW_SUBSCRIPTION : 'N',
    ADDON_SUBSCRIPTION : 'A',
    UPGRADE_SUBSCRIPTION : 'U',
    RENEWAL_SUBSCRIPTION : 'R',
    EDIT_MEMBER : 'E'
})

export const ValidatePhotoIdNumberAgaistType = (type, value) => {
    switch (type) {
        case 'AADHAAR_CARD': return Validate().aadhaarCardNo(value)
        case 'PAN_CARD': return Validate().panCardNo(value)
        case 'PASSPORT': return Validate().passport(value)
        default: return 'Invalid Photo Id type'
    }
}