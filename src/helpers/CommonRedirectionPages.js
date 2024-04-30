import axios from 'axios';
import { CUSTOMER } from '../components/customer/Constants/CustomerConstants';
import db from '../Database/index';
import { CRM_UI } from '../services/ServiceConstants';
import Validate from './Validate';
import qs from 'qs';

export const openCustomerPage = (url, customerId) => {
    const newTab = window.open(url, customerId);
    setTimeout(() => {
        newTab.location.reload();
    }, 200);
}


export const redirectCustomerPage = ({ customerId, webLoginId, locality, isMergedFlag, mobile, customerType, firstName, lastName }, handleFailure) => {
    firstName = firstName?.replace("%", " ");
    lastName = lastName?.replace("%", " ");
    var pharmaId = db.getValue("Id_" + customerId);
    let url = "";
    if (pharmaId == null || pharmaId == '') {
        if (db.getValue("Id_" + webLoginId) == null || db.getValue("pharmaId_" + webLoginId) == '') {
            if (customerType == 'ECOM') {
               /*  if (isMergedFlag == "true")
                    db.setValue("Id_" + customerId, customerId);
                else
                    db.setValue("Id_" + webLoginId, webLoginId); */
                url = `${CRM_UI}/${CUSTOMER}/${customerId}/bio?locality=${locality}`;
            } else if (customerType == 'POS') {
                //db.setValue("Id_" + customerId, customerId);
                url = `${CRM_UI}/${CUSTOMER}/${customerId}/bio?locality=${locality}`;
            }
        } else {
            url = `${CRM_UI}/${CUSTOMER}/${customerId}/bio?locality=${locality}`;
        }
    }
    openCustomerPage(url, pharmaId);
}

export const gotoRecordCommunication = ({ customerId, webLoginId, isMergedFlag, mobile, customerType, firstName, lastName }, handleFailure) => {

    firstName = firstName?.replace("%", " ");
    lastName = lastName?.replace("%", " ");
    let pageToRedirect = 'Bio';
    let url;
    if (Validate().isNotEmpty(customerId) && Validate().isNotEmpty(webLoginId)) {
        pageToRedirect = 'Communication';
    }
    if (customerType === "ECOM") {
        /* if (isMergedFlag) {
            db.setValue("Id_" + webLoginId, webLoginId);
        } else {
            db.setValue("Id_" + customerId, customerId);
        } */
        url = "/crm/mart-customer.crm?beautyCustomerId=" + customerId + "&customerId=" + webLoginId + "&mobile=" + mobile + "&customerType=" + customerType + "&mergeStatus=" + isMergedFlag + "&fName=" + firstName + "&lName=" + lastName + "#/" + pageToRedirect;
    } else if (customerType === "POS") {
        //db.setValue("Id_" + customerId, customerId);

        url = "/crm/mart-customer.crm?beautyCustomerId=" + webLoginId + "&customerId=" + customerId + "&mobile=" + mobile + "&customerType=" + customerType + "&mergeStatus=" + isMergedFlag + "&fName=" + firstName + "&lName=" + lastName + "#/" + pageToRedirect;
    }
    openCustomerPage(url, customerId);
}

export const open = (verb, url, data, target) => {
    var form = document.createElement("form");
    form.action = url;
    form.method = verb;
    form.target = target || "_self";
    if (data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var input = document.createElement("textarea");
                input.name = key;
                input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
                form.appendChild(input);
            }
        }
    }
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

export const updateStatus = ({ customerId, orderId, communicationId , nextContactTime, message, completeReason}, handleFailure) => {
    let customerType;
    if (isNaN(customerId)) {
        customerType = 'ECOM';
        open("POST", "/crm/mart-customer.crm#/FollowUp", {
            beautyCustomerId: customerId,
            customerType: customerType,
            communicationId: communicationId,
            followUpFlag: 'completeCall',
            orderId: orderId
        }, customerId);
    } else {
        customerType = 'POS';
        let url;
        url = (`${CRM_UI}/customer/${customerId}/customerFollowUp?orderId=` + orderId + "&communicationId=" + communicationId + "&nextContactTime=" + nextContactTime + "&message=" + message + "&completeReason=" + completeReason) ;
        openCustomerPage(url); 
    }
}

export const existedCustomerData = ({ customerId }, handleFailure) => {
	let url;
    /* if (Validate().isEmpty(pharmaId)) {
        db.setValue("Id_" + customerId, customerId);
    } */
    url = (`${CRM_UI}/customer/${customerId}/bio`);
    openCustomerPage(url, customerId);
}

export const redirectToShoppingCart = ({ customerId, prescriptionId, recordId, locality, fromPage }) => {
    // existedCustomerData({customerId:customerId});
    let url = "/crm/mart-customer.crm?customerId=" + customerId + "&prescriptionId=" + prescriptionId + "&recordId=" + recordId + "&locality=" + locality + "&fromPage=" + fromPage + "#/show-switch";
    openCustomerPage(url, customerId);
}

export const redirectToPrescriptionCatalogPage = ({ customerId, prescriptionId }, handleFailure) => {
    // existedCustomerData({customerId: customerId});
    let url = `${CRM_UI}/${CUSTOMER}/${customerId}/${prescriptionId}/catalogPrescription`;
    openCustomerPage(url, customerId);
}

export const redirectToCatalogIntermediateComponent = ({ pageToRedirect, customerId, prescriptionId, cfpStoreId, recordId, cfpLocality, latLong}) => {
    let criteria  = {
        prescriptionId : prescriptionId,
        cfpStoreId : cfpStoreId,
        recordId : recordId,
        pageToRedirect : pageToRedirect,
        cfpLocality : cfpLocality,
        martLocality : latLong
    }
    let url = `${CRM_UI}/${CUSTOMER}/${customerId}/catalogIntermediateComponent?${qs.stringify(criteria)}`;
    openCustomerPage(url, customerId);
}

export const gotoMartCustomerPage = ({ customerId, orderId, locality, hubStoreId, pageToRedirect, beautyCustomerId, mobile, mergeStatus, webLoginId, customerType, firstName, lastName, email, isFromCfpDashboard, cfpStoreId }, handleFailure) => {
    if (Validate().isEmpty(pageToRedirect)) {
        var pageToRedirect = 'Bio';
    }
    firstName = firstName && firstName.replace("%", " ");
    lastName = firstName && lastName.replace("%", " ");
    var obj = { customerId, orderId, locality, beautyCustomerId, mobile, mergeStatus, webLoginId, customerType, firstName, lastName, hubStoreId, email, isFromCfpDashboard, cfpStoreId };
    if ((Validate().isNotEmpty(customerId) || Validate().isNotEmpty(webLoginId) || Validate().isNotEmpty(beautyCustomerId))) {
        /* if (Validate().isNotEmpty(customerId)) {
            db.setValue("Id_" + customerId, customerId)
        } else if (Validate().isNotEmpty(webLoginId)) {
            db.setValue("Id_" + webLoginId, webLoginId)
        } else {
            db.setValue("Id_" + beautyCustomerId, beautyCustomerId)
        } */
        if (Validate().isEmpty(mergeStatus)) {
            if (customerId != null && customerId !== undefined && parseInt(customerId) > 0 && beautyCustomerId != null && beautyCustomerId !== undefined && beautyCustomerId.length > 0) {
                mergeStatus = true;
            }
            if (customerId != null && customerId !== undefined && parseInt(customerId) > 0 && (beautyCustomerId == null || beautyCustomerId === undefined || beautyCustomerId === '')) {
                mergeStatus = false;
            }
        }
        if (Validate().isEmpty(customerType)) {
            customerType = "ECOM";
            if (customerId != null && customerId !== undefined && parseInt(customerId) > 0 && (beautyCustomerId == null || beautyCustomerId === undefined || beautyCustomerId === '')) {
                customerType = "POS";
            }
        }

        var url = "/crm/mart-customer.crm?";
        for (var key in obj) {
            if (obj[key] && Validate().isNotEmpty(obj[key])) {
                url = url + key + "=" + obj[key] + "&"
            }
        }
        url = url.slice(0, -1) + "#/" + pageToRedirect;
        if ("Communication" === pageToRedirect) {
            if(Validate().isNotEmpty(orderId)){
                url = `${CRM_UI}/${CUSTOMER}/${customerId}/searchCommunication?orderId=${orderId}`;
            } else {
                url = `${CRM_UI}/${CUSTOMER}/${customerId}/recordCommunication`;
            }
        }
        //url = `${CRM_UI}/${CUSTOMER}/${customerId}/bio?locality=${locality}`;
        if("Catalog" === pageToRedirect) {
            url = `${CRM_UI}/${CUSTOMER}/${customerId}/${Validate().isNotEmpty(locality)?`catalogIntermediateComponent?${qs.stringify({martLocality:locality})}`:`${pageToRedirect}`}`;
        }
        let queryParams = {}; //if needed please prepare the query params
        if(["Bio", "healthRecordHistory"].includes(pageToRedirect)){
            if(Validate().isNotEmpty(queryParams)){
                let queryParamsString = '';
                for (var key in queryParams) {
                    if (queryParams[key] && Validate().isNotEmpty(queryParams[key])) {
                        queryParamsString = queryParamsString + key + "=" + queryParams[key] + "&"
                    }
                }
                url = `${CRM_UI}/${CUSTOMER}/${customerId}/${pageToRedirect}?${queryParamsString}`;
            } else {
                url = `${CRM_UI}/${CUSTOMER}/${customerId}/${pageToRedirect}`;
            }
        }
		openCustomerPage(url, customerId)
    }
}
export const gotoTicketHistoryPage = ({ customerId, orderId, locality, hubStoreId, pageToRedirect, beautyCustomerId, mobile, mergeStatus, webLoginId, customerType, firstName, lastName, email }, handleFailure) => {
    firstName = firstName && firstName.replace("%", " ");
    lastName = firstName && lastName.replace("%", " ");
    var pharmaId = db.getValue("Id_" + customerId);
    /* if (Validate().isNotEmpty(customerId)) {
        db.setValue("Id_" + customerId, customerId)
    } else if (Validate().isNotEmpty(webLoginId)) {
        db.setValue("Id_" + webLoginId, webLoginId)
    } else {
        db.setValue("Id_" + beautyCustomerId, beautyCustomerId)
    } */

    open("POST", "/crm/mart-customer.crm#/" + pageToRedirect, {
        orderId: orderId,
        locality: locality,
        mobile: mobile,
        beautyCustomerId: beautyCustomerId,
        customerId: customerId,
        customerType: customerType,
        email: email,
        mergeStatus: mergeStatus
    }, customerId);
}

export const makeOutBoundCall = (outBoundUrl) => {
    axios({
        method: 'GET',
        url: outBoundUrl,
        contentType: "application/x-www-form-urlencoded",
        crossDomain: true,
    }).then((response) => {
        if (response.status == 200)
            console.log("success")
        else
            console.log("failure")
    }).catch(err => {
        console.log("error =>" + err)
    });
}
