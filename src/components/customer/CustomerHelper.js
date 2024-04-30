import { matchPath } from "react-router";
import { CRM_UI } from "../../services/ServiceConstants";
import { CUSTOMER } from "./Constants/CustomerConstants";
import Validate from "../../helpers/Validate";

const getMatchPath = () => {

    const match = matchPath(window.location.pathname, {
        path: `${CRM_UI}/${CUSTOMER}/:customerId/*`,
        exact: true,
        strict: false
    });

    return match;
}

export const getCustomerRedirectionURL = (customerId, uri) => `${CRM_UI}/${CUSTOMER}/${getMatchPath()?.params?.customerId}/${uri}`;

export const setRegexForTypes = (helpers, type, id) => {
    if(type == 'AADHAAR_CARD'){
        helpers.updateSingleKeyValueIntoField("regex", "^[0-9]+$", id);
        helpers.updateSingleKeyValueIntoField("maxLength", 12, id);
    } else if(type == 'PAN_CARD'){
        helpers.updateSingleKeyValueIntoField("maxLength", 10, id);
        helpers.updateSingleKeyValueIntoField("regex", "", id);
    } else if(type == 'PASSPORT'){
        helpers.updateSingleKeyValueIntoField("maxLength", 8, id);
        helpers.updateSingleKeyValueIntoField("regex", "", id);
    } else {
        helpers.updateSingleKeyValueIntoField("regex", "", id);
        helpers.updateSingleKeyValueIntoField("maxLength", 16, id);
    }
    helpers.updateErrorMessage("", id);
}

export const setRegexForOtpForm = (helpers, id, maxLength) => {
    helpers.updateSingleKeyValueIntoField("regex", "^[0-9]+$", id);
    if(Validate().isNotEmpty(maxLength)) {
        helpers.updateSingleKeyValueIntoField("maxLength", maxLength, id);
    }
}

export const isValidPhotoIdFiles = (files) =>{

    if(!files){
        return false;
    }

    for (const eachFile of files) {
        if (eachFile.type != "image/png" && eachFile.type != "image/jpg" && eachFile.type != "image/jpeg" && eachFile.type != "application/pdf") {
            return false;
        }
    }
    return true;
}
