import qs from 'qs';
import OrderService from '../services/Order/OrderService';
import Validate from './Validate';

export const getNotNullCriteria = (obj) => {
    let finalSearchCriteria = obj;
    Object.entries(finalSearchCriteria).forEach(([key, value]) => {
        if (Validate().isEmpty(value))
            delete finalSearchCriteria[key];
    });
    let finalString = qs.stringify(finalSearchCriteria);
    return finalString;
}

export const getDateInYMDFormat = (date) => {
    let formatDate = new Date(date);
    if(Validate().isEmpty(date)){
        formatDate = new Date();
    }
    const year = formatDate.getFullYear();
    const month = String(formatDate.getMonth() + 1).padStart(2, '0');
    const day = String(formatDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const RECORD_TYPE = {
    "MART_ORDER":"M",
    "LAB_ORDER":"L",
    "FOLLOWUP_ORDER":"F",
    "PRESCRIPTION_ORDER":"P",
    "OPTIVAL_ORDER":"O"
}

export const ERROR_CODE = {
    "ALREADY_CLAIMED":"AC",
    "ALREADY_UNCLAIMED":"AU",
    "LIMIT_EXCEEDED":"LE"
}

export const claimOrders = (recordIds, dataSet, claimedDataSet, rowDataKey) => {
    const claimObject = {};
    let claimedTemp = [...claimedDataSet];
    let temp = [...dataSet].map(element => {
        if (recordIds.includes(element[rowDataKey])) {
            element.claimedBy = "S";
            element.processedClaimAction = true;
            claimedTemp.push(element);
        }
        return element;
    });
    claimObject['claimedDataSet'] = [...claimedTemp];
    claimObject['dataset'] = temp;
    claimObject['toastMessage'] = "Claimed Successfully";
    return claimObject;
}

export const unclaimOrders = (recordIds, dataSet, claimedDataSet, rowDataKey) => {
    const claimObject = {};
    const temp = dataSet.map(element => {
        if (recordIds.includes(element[rowDataKey])) {
            element.claimedBy = undefined;
            element.processedClaimAction = false;
        }
        return element;
    });
    claimObject['dataset'] = temp;
    let claimedTemp = claimedDataSet.filter(element => {
        return !recordIds.includes(element[rowDataKey]);
    });
    claimObject['claimedDataSet'] = claimedTemp;
    claimObject['toastMessage'] = "Unclaimed Successfully";
    return claimObject;
}

export const processOrderClaimedAlready = (recordId, dataSet, rowDataKey) => {
    const temp = dataSet.map(element => {
        if(element[rowDataKey] === recordId){
            element.claimedBy = "O";
        }
        return element;
    })
    return temp;
}

export const unclaimClaimedOrder = async (recordId, recordType, onSuccess) => {
    let unclaimObject = {
        recordId: recordId,
        recordType: recordType,
        claimStatus: 'U',
    };
    await OrderService().claimOrUnclaimOrder(unclaimObject)
        .then((data) => {
            if (data.statusCode == "SUCCESS") {
                onSuccess ? onSuccess(recordId) : null;
            }
        })
        .catch((error) => {
            console.log('Claim request failed:', error);
        });
}

export default function debounce(a, b, c) { var d, e; return function () { function h() { d = null, c || (e = a.apply(f, g)) } var f = this, g = arguments; return clearTimeout(d), d = setTimeout(h, b), c && !d && (e = a.apply(f, g)), e } };

export const prepareRequestFrom = (isPathlabAgent, isFrontOfficer) => {
    let requestFrom = 'C';
    if(isFrontOfficer) {
        requestFrom = 'L';
    } else if(isPathlabAgent) {
        requestFrom = 'A';
    }
    return requestFrom;
}