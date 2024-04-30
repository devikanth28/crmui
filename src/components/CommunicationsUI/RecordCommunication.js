import React, { useRef } from "react";
import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import { Button } from "react-bootstrap";

const RecordCommunication = ({ helpers, ...props }) => {

    const headerRef = useRef(null);
    const footerRef = useRef(null);

    let obj = {
        "htmlElementType": "FORM",
        "id": "recordCommunication",
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
                "groupElements": [
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
                        "labelClassName": "col-12 col-sm-12 col-md-12 col-lg-10 col-xl-8 col-xxl-6",
                        "type": "text",
                        "placeholder": null,
                        "hidden": false
                    },                                                                            
                ]
            },
            {
                "htmlElementType": "ELEMENTGROUP",
                "id": "group2",
                "label": null,
                "name": null,
                "value": null,
                "className": "row g-3 mt-1",
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
                "groupElements": [
                    {
                        "htmlElementType": "RADIO",
                        "id": "orderTypes",
                        "label": "Select Order Type",
                        "labelClassName": "d-block small text-secondary",
                        "name": null,
                        "className": null,
                        "values": [
                            {
                                "name": "orderTypeValues",
                                "displayValue" : "Mart",
                                "id": "mart",
                                "value": "MART",
                            },
                            {
                                "name": "orderTypeValues",
                                "displayValue" : "Optical",
                                "id": "optical",
                                "value": "OPTICAL",
                            },
                            {
                                "name": "orderTypeValues",
                                "displayValue" : "Lab",
                                "id": "lab",
                                "value": "LAB",
                            },
                            {
                                "name": "orderTypeValues",
                                "displayValue" : "Prescription",
                                "id": "prescription",
                                "value": "PRESCRIPTION",
                            }
                        ],
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
                        "type": "radio",
                        "placeholder": null,
                        "hidden": false
                    }
                ]
            },
            {
                "htmlElementType": "ELEMENTGROUP",
                "id": "group3",
                "label": null,
                "name": null,
                "value": null,
                "className": "row g-3 mt-1",
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
                "groupElements": [
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
                        "dataListClassName": "col-12 col-sm-12 col-md-12 col-lg-5 col-xl-4 col-xxl-3",
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
                        "dataListClassName": "col-12 col-sm-12 col-md-12 col-lg-5 col-xl-4 col-xxl-3",
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
                    },
                ]
            },
            {
                "htmlElementType": "ELEMENTGROUP",
                "id": "group4",
                "label": null,
                "name": null,
                "value": null,
                "className": "row g-3 mt-1",
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
                "groupElements": [
                    {
                        "htmlElementType": "RADIO",
                        "id": "modeOfContact",
                        "label": "Mode Of Contact",
                        "labelClassName": "d-block small text-secondary",
                        "name": null,
                        "className": null,
                        "values": [
                            {
                                "name": "modeOfContactValues",
                                "displayValue" : "Call In",
                                "id": "callIn",
                                "value": "callIn",
                            },
                            {
                                "name": "modeOfContactValues",
                                "displayValue" : "Call Out",
                                "id": "callOut",
                                "value": "callOut",
                            },
                            {
                                "name": "modeOfContactValues",
                                "displayValue" : "Mail In",
                                "id": "mailIn",
                                "value": "mailIn",
                            },
                            {
                                "name": "modeOfContactValues",
                                "displayValue" : "Mail Out",
                                "id": "mailOut",
                                "value": "mailOut",
                            },
                            {
                                "name": "modeOfContactValues",
                                "displayValue" : "Message In",
                                "id": "messageIn",
                                "value": "messageIn",
                            },
                            {
                                "name": "modeOfContactValues",
                                "displayValue" : "Message Out",
                                "id": "messageOut",
                                "value": "messageOut",
                            }
                        ],
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
                        "type": "radio",
                        "placeholder": null,
                        "hidden": false
                    }
                ]
            },
            {
                "htmlElementType": "ELEMENTGROUP",
                "id": "group5",
                "label": null,
                "name": null,
                "value": null,
                "className": "row g-3 mt-1",
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
                "groupElements": [
                    {
                        "htmlElementType": "TEXTAREA",
                        "id": "message",
                        "label": "Enter Message",
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
                        "labelClassName": "col-12 col-sm-12 col-md-12 col-lg-10 col-xl-8 col-xxl-6",
                        "type": "text",
                        "placeholder": null,
                        "hidden": false
                    }
                ]
            }
        ],
        "notes": null,
        "atleastOneFieldRequired": false,
        "submitDisabled": true,
        "hidden": false
    };

    return (
        <Wrapper>
            <HeaderComponent ref={headerRef} className="custom-tabs-forms py-2 px-3">
                Record Communication
            </HeaderComponent>
            <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height">
                <DynamicForm formJson={obj} helpers={helpers} />
            </BodyComponent>
            <FooterComponent ref={footerRef}>
                <div className="footer py-2 px-3 d-flex flex-row-reverse align-items-center">
                    <Button variant="brand" className="ms-2 px-4">Submit</Button>
                    <Button variant=" " className="brand-secondary px-4">Reset</Button>
                </div>
            </FooterComponent>
        </Wrapper>
    );
};

export default withFormHoc(RecordCommunication);