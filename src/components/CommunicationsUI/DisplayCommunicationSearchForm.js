import DynamicForm, { withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { UserContext } from "../Contexts/UserContext";
import { CRM_UI } from "../../services/ServiceConstants";
import qs from 'qs';

const DisplayCommunicationSearchForm = ({helpers, ...props}) => {

    const userSessionInfo = useContext(UserContext);
    const params = props?.urlParams ? props.urlParams : qs.parse(props.location.search, { ignoreQueryPrefix: true });

    useEffect(() => {
        if(userSessionInfo?.vertical && userSessionInfo.vertical == "V"){                    
            props.history.push({
                          pathname: `${CRM_UI}/displayCommunication/search`,
                          state: { urlParams: params }
                        });                     
        }
        else
            null 
      }, [])

    let obj = {
        "htmlElementType": "FORM",
        "id": "displayCommunication",
        "label": null,
        "name": null,
        "value": null,
        "className": null,
        "readOnly": false,
        "disabled": false,
        "autofocus": false,
        "required": false,
        "style": null,
        "attributes": null,
        "message": null,
        "htmlActions": null,
        "elementSize": null,
        "defaultValue": null,
        "helperText": null,
        "labelClassName": null,
        "htmlGroups": [
            {
                "htmlElementType": "ELEMENTGROUP",
                "id": "recordForm",
                "label": "Search Communications",
                "labelClassName": "font-weight-bold custom-fieldset mb-2",
                "name": null,
                "value": null,
                "className": "custom-form-elements",
                "readOnly": false,
                "disabled": false,
                "autofocus": false,
                "required": false,
                "style": null,
                "attributes": null,
                "message": null,
                "htmlActions": null,
                "elementSize": null,
                "defaultValue": null,
                "helperText": null,
                "groups": [
                    {
                        "htmlElementType": "ELEMENTGROUP",
                        "id": "group1",
                        "label": null,
                        "name": null,
                        "value": null,
                        "className": "row g-3",
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": false,
                        "style": null,
                        "attributes": null,
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "defaultValue": null,
                        "helperText": null,
                        "labelClassName": null,
                        "groups": null,
                        "groupElements" : [
                            {
                                "htmlElementType": "DATERANGE",
                                "id": "dateRange",
                                "label": "Select Date Range",
                                "name": null,
                                "value": null,
                                "className": null,
                                "readOnly": false,
                                "disabled": false,
                                "autofocus": false,
                                "required": true,
                                "style": null,
                                "attributes": null,
                                "message": null,
                                "htmlActions": null,
                                "elementSize": null,
                                "defaultValue": 1,
                                "helperText": "30 Days is the Maximum Range",
                                "labelClassName": "col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6",
                                "type": "date",
                                "placeholder": null,
                                "hidden": false
                            },
                            {
                                "htmlElementType": "INPUT",
                                "id": "orderId",
                                "label": "Enter Order ID",
                                "name": null,
                                "value": null,
                                "className": null,
                                "readOnly": false,
                                "disabled": false,
                                "autofocus": false,
                                "required": true,
                                "style": null,
                                "attributes": null,
                                "message": null,
                                "htmlActions": null,
                                "elementSize": null,
                                "defaultValue": null,
                                "helperText": null,
                                "labelClassName": "col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6",
                                "type": "text",
                                "placeholder": null,
                                "hidden": false
                            }
                        ]
                    },
                    {
                        "htmlElementType": "ELEMENTGROUP",
                        "id": "group2",
                        "label": null,
                        "name": null,
                        "value": null,
                        "className": "row g-3 pt-3",
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": false,
                        "style": null,
                        "attributes": null,
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "defaultValue": null,
                        "helperText": null,
                        "labelClassName": null,
                        "groups": null,
                        "groupElements" : [
                            {
                                "htmlElementType": "DATALIST",
                                "id": "reasonType",
                                "label": "Reason Type",
                                "name": null,
                                "value": null,
                                "onInputChangeEnable": true,
                                "className": null,
                                "readOnly": false,
                                "disabled": false,
                                "autofocus": false,
                                "required": true,
                                "style": null,
                                "attributes": null,
                                "message": null,
                                "htmlActions": null,
                                "elementSize": null,
                                "defaultValue": null,
                                "helperText": null,
                                "dataListClassName": "col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6",
                                "regex": null,
                                "minLength": null,
                                "maxLength": 30,
                                "min": null,
                                "max": null,
                                "placeholder": null,
                                "hidden": false,
                                "values": [
                                    {
                                        "displayValue" : "Select Type",
                                        "optionId" : "selectType",
                                        "value" : "TYPE"
                                    },
                                    {
                                        "displayValue" : "Stores",
                                        "optionId" : "Stores",
                                        "value" : "Stores"
                                    },
                                    {
                                        "displayValue" : "Medicines",
                                        "optionId" : "Medicines",
                                        "value" : "Medicines"
                                    },
                                    {
                                        "displayValue" : "Order",
                                        "optionId" : "Order",
                                        "value" : "Order"
                                    },
                                    {
                                        "displayValue" : "Compialns",
                                        "optionId" : "Compialns",
                                        "value" : "Compialns"
                                    },
                                    {
                                        "displayValue" : "Lab",
                                        "optionId" : "Lab",
                                        "value" : "Lab"
                                    },
                                    {
                                        "displayValue" : "Bio Updation",
                                        "optionId" : "BioUpdation",
                                        "value" : "BioUpdation"
                                    },
                                    {
                                        "displayValue" : "Redemption",
                                        "optionId" : "Redemption",
                                        "value" : "Redemption"
                                    },
                                    {
                                        "displayValue" : "Promotions",
                                        "optionId" : "Promotions",
                                        "value" : "Promotions"
                                    },
                                    {
                                        "displayValue" : "Proactive",
                                        "optionId" : "Proactive",
                                        "value" : "Proactive"
                                    },
                                    {
                                        "displayValue" : "Appreciation",
                                        "optionId" : "Appreciation",
                                        "value" : "Appreciation"
                                    },
                                    {
                                        "displayValue" : "MwalletRefund",
                                        "optionId" : "MwalletRefund",
                                        "value" : "MwalletRefund"
                                    },
                                ]
                            },
                            {
                                "htmlElementType": "DATALIST",
                                "id": "selectReason",
                                "label": "Select Reason",
                                "name": null,
                                "value": null,
                                "onInputChangeEnable": true,
                                "className": null,
                                "readOnly": false,
                                "disabled": false,
                                "autofocus": false,
                                "required": true,
                                "style": null,
                                "attributes": null,
                                "message": null,
                                "htmlActions": null,
                                "elementSize": null,
                                "defaultValue": null,
                                "helperText": null,
                                "dataListClassName": "col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6",
                                "regex": null,
                                "minLength": null,
                                "maxLength": 30,
                                "min": null,
                                "max": null,
                                "placeholder": null,
                                "hidden": false,
                                "values": [
                                    {
                                        "displayValue" : "Select Reason",
                                        "optionId" : "selectReason",
                                        "value" : "REASON"
                                    },
                                    {
                                        "displayValue" : "Timings",
                                        "optionId" : "Timings",
                                        "value" : "Timings"
                                    },
                                    {
                                        "displayValue" : "Locations",
                                        "optionId" : "Locations",
                                        "value" : "Locations"
                                    },
                                    {
                                        "displayValue" : "Suggestions",
                                        "optionId" : "Suggestions",
                                        "value" : "Suggestions"
                                    },
                                    {
                                        "displayValue" : "Sale Order",
                                        "optionId" : "saleOrder",
                                        "value" : "saleOrder"
                                    },
                                    {
                                        "displayValue" : "Edit Order",
                                        "optionId" : "editOrder",
                                        "value" : "editOrder"
                                    },
                                    {
                                        "displayValue" : "Cancel Order",
                                        "optionId" : "cancelOrder",
                                        "value" : "cancelOrder"
                                    },
                                    {
                                        "displayValue" : "Gift Complains",
                                        "optionId" : "giftComplains",
                                        "value" : "giftComplains"
                                    },
                                    {
                                        "displayValue" : "Store Staff",
                                        "optionId" : "storeStaff",
                                        "value" : "storeStaff"
                                    },
                                    {
                                        "displayValue" : "Order Delivery",
                                        "optionId" : "orderDelivery",
                                        "value" : "orderDelivery"
                                    },
                                    {
                                        "displayValue" : "Document Verification",
                                        "optionId" : "documentVerification",
                                        "value" : "documentVerification"
                                    },
                                    {
                                        "displayValue" : "Others",
                                        "optionId" : "others",
                                        "value" : "others"
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        "htmlElementType": "ELEMENTGROUP",
                        "id": "group3",
                        "label": null,
                        "name": null,
                        "value": null,
                        "className": "row g-3 pt-3",
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": false,
                        "style": null,
                        "attributes": null,
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "defaultValue": null,
                        "helperText": null,
                        "labelClassName": null,
                        "groups": null,
                        "groupElements" : [
                            {
                                "htmlElementType": "CHECKBOX",
                                "id": "messageToggle",
                                "label": "Message Out Only",
                                "labelClassName": "font-weight-bold",
                                "switchType" : true,
                                "name": "messageToggle",
                                "values": [
                                    {
                                        "name": "messageToggleValue",
                                        "displayValue" : "Message Out Only",
                                        "id": "messageOutOnly",
                                        "value": "MESSAGE_OUT_ONLY",
                                    }
                                ],
                                "className": null,
                                "readOnly": false,
                                "disabled": false,
                                "autofocus": false,
                                "required": true,
                                "style": null,
                                "attributes": null,
                                "message": null,
                                "htmlActions": null,
                                "elementSize": null,
                                "defaultValue": 1,
                                "helperText": null,
                                "type": "date",
                                "placeholder": null,
                                "hidden": false
                            }                            
                        ]
                    }
                ],                
                "groupElements": null,
            },
            {
                "htmlElementType": "ELEMENTGROUP",
                "id": "footerContainer",
                "label": null,
                "name": null,
                "value": null,
                "className": "border-top d-flex justify-content-end p-2",
                "readOnly": false,
                "disabled": false,
                "autofocus": false,
                "required": false,
                "style": null,
                "attributes": null,
                "message": null,
                "htmlActions": null,
                "elementSize": null,
                "defaultValue": null,
                "helperText": null,
                "labelClassName": null,
                "groups": null,
                "groupElements": null
                    
            }
        ],
        "notes": null,
        "atleastOneFieldRequired": false,
        "submitDisabled": true,
        "hidden": false
    };

    const footerButtons = () => {
        return (
            <React.Fragment>                
                <div className="d-flex flex-row-reverse align-items-center">
                    <Button variant="dark" className="ms-2 px-4">Search</Button>
                    <Button variant=" " className="brand-secondary px-4">Reset</Button>
                </div>
            </React.Fragment>
        );
    }

    const customHtml = {
        'footerContainer': [['INSERT_IN', footerButtons]]
    }

    return(
        <React.Fragment>
            <DynamicForm formJson={obj} helpers={helpers} customHtml={customHtml} />
        </React.Fragment>
    );
};

export default withFormHoc(DisplayCommunicationSearchForm);