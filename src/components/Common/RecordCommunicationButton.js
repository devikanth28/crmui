import React from 'react'
import db from '../../Database/index';
import Validate from "../../../src/helpers/Validate";

export const RecordCommunicationButton = (props) => {
    return (
            <button class='btn btn-primary' onClick={() => { gotoRecordCommunication({ ...props }) }}>Record</button>
    )
}

const gotoRecordCommunication = (props) => {

    let { customerId, orderId, locality, beautyCustomerId, mobile, isMergedFlag, webLoginId, customerType, firstName, lastName, buttonText } = props;
    firstName = firstName && firstName.replace("%", " ");
    lastName = firstName && lastName.replace("%", " ");
    var pageToRedirect = 'Communication';
    var obj = {customerId, orderId, locality, beautyCustomerId, mobile, isMergedFlag, webLoginId, customerType, firstName, lastName, buttonText};
        
        let filteredObj={}
        var url = "/mart-customer.crm"+"?";
        for (var key in obj) {
            if (obj[key] && Validate().isNotEmpty(obj[key])) {
                url=url+key+"="+obj[key]+"&"
                Object.assign(filteredObj,{[key]: obj[key]})
            }
        }
        window.open(url.slice(0,-1)+"#/"+pageToRedirect,customerId);
     
}




