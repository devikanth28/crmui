import { useContext } from "react";
import { AlertContext } from "../components/Contexts/UserContext";
import dateFormat from 'dateformat';
import Validate from "./Validate";

const validate = Validate();


export const getLabStausBadgeColourClass = (status) => {
    let extractedStatus = status;
    if(status && status.includes("[")){
        extractedStatus = status.split("[")[0]
    }
    switch (extractedStatus.trim()) {
        case "Created":
            return "badge-created";
        case "Approved":
            return "badge-approved";
        case "Cancelled":
            return "badge-Cancelled";
        case "Assigned To Agent":
            return "badge-pending";
        case "Sample Collected":
            return "badge-Decoded";
        case "Sample Accepted":
            return "badge-Decoded";
        case "Sample Rejected":
            return "badge-rejected";
        case "Processing":
            return "badge-Decoded";
        case "Ready for Print":
            return "badge-created";
        case "Unable to Collect":
            return "badge-rejected";
        case "Assigned to Collection Center":
            return "badge-pending";
        case "Patient Acknowledged":
            return "badge-pending";
        default:
            return "badge-created";
    }
}

export const downloadFile = async (url) => {
    const response = await fetch(url,{
        method:"POST",
        headers:{
            'X-Requested-With':'XMLHttpRequest'
        }
    }).then(resp => {
        if (resp && (resp.status == 500)) {
            throw "Unable to download"
        }
        return resp.arrayBuffer()
    }).then(resp => {
        const file = new Blob([resp], { type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        console.log("fileURL :" + fileURL);
        window.open(fileURL, '_blank');
    }).catch((error) => {
        return {status:"failure",message:"Unable to download file"}
    }
    );
    return response;
}

export const getSavedWorkspaceForLabOrder = (params,helpers) => {
    let formValues = { ...params, fromDate: dateFormat(params.fromDate, 'yyyy-mm-dd'), toDate: dateFormat(params.toDate, 'yyyy-mm-dd')};
  if(validate.isNotEmpty(params)){
      let dateRange = [];
      if (validate.isNotEmpty(params.fromDate)) {
          dateRange.push(params.fromDate);
      }
      if (validate.isNotEmpty(params.toDate)) {
          dateRange.push(params.toDate)
      }
      formValues = {...formValues, "dateRange": dateRange}

      if(validate.isNotEmpty(params.customerId)){
          formValues = {...formValues , "customerId": params.customerId}
      }
      if(validate.isNotEmpty(params.orderId)){
          formValues = {...formValues , "orderId": params.orderId}
      }
      if(validate.isNotEmpty(params.mobileNo)){
        formValues = {...formValues , "mobileNo" : params.mobileNo}
      }
      if(validate.isNotEmpty(params.cartId)){
        formValues = {...formValues , "cartId" : params.cartId}
      }
      if(validate.isNotEmpty(params.couponCode)){
        formValues = {...formValues , "couponCode" : params.couponCode}
      }
      if(validate.isNotEmpty(params.pscRegistrationId)){
        formValues = {...formValues , "pscRegistrationId" : params.pscRegistrationId}
      }
      if(validate.isNotEmpty(params.visitType)){
        formValues = {...formValues , "visitType" : params.visitType}
      }
      if(validate.isNotEmpty(params.paymentType)){
        formValues = {...formValues , "paymentType" : params.paymentType}
        if(params.paymentType == "O"){
          helpers.showElement("gatewayStatus");
        }
      }
      if(validate.isNotEmpty(deliveryType)){
        formValues = {...formValues , "deliveryType" : params.deliveryType}
      }
      let status = []
      if(validate.isNotEmpty(params.status)){
        status.push(params.status)
        formValues = {...formValues , "status" : status}
      }
      let labAgentIds = []
      if(validate.isNotEmpty(params.labAgentId)){
        labAgentIds.push(params.labAgentId)
        formValues = {...formValues , "labAgentId" : labAgentIds}
      }
      let collectionCenterIds = []
      if(validate.isNotEmpty(params.collectionCenterId)){
        collectionCenterIds.push(params.collectionCenterId)
        formValues = {...formValues , "collectionCenterId" : collectionCenterIds  }
      }
      let hubIds = []
      if(validate.isNotEmpty(params.hubId)){
        hubIds.push(params.hubId)
        formValues = {...formValues , "hubId" : hubIds}
      }
      if (validate.isNotEmpty(params.departmentIds)) {
          formValues = { ...formValues, "departmentIds": params.departmentIds.split(",") }
      }
      if (validate.isNotEmpty(params.formIds)) {
          formValues = { ...formValues, "formIds": params.formIds.split(",") }
      }
      helpers.updateSpecificValues(formValues, "FollowUp");
  }
}