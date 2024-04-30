import React, { useRef } from "react";
import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import { Button, Form } from "react-bootstrap";

const InsuranceCommunication = ({ helpers, ...props }) => {

    const headerRef = useRef(null);
    const footerRef = useRef(null);

    let obj = {
        "htmlElementType": "FORM",
        "id": "insuranceCommunication",
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
        "htmlGroups": [
            {
                "htmlElementType": "ELEMENTGROUP",
                "id": "inscuranceForm",
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
                "groups": [
                        {
                            "htmlElementType": "ELEMENTGROUP",
                            "id": "group1",
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
                            "groups" : null,
                            "groupElements" : [
                                {
                                    "htmlElementType": "RADIO",
                                    "id": "radioElement",
                                    "label": "Did you inform the Customer about Happy Family Health Plan?",
                                    "labelClassName": "d-block small text-secondary",
                                    "name": null,
                                    "className": null,
                                    "values": [
                                        {
                                            "name": "radioValues",
                                            "displayValue" : "Yes",
                                            "id": "yes",
                                            "value": "Y",
                                            "optionClassName": "mx-0"
                                        },
                                        {
                                            "name": "radioValues",
                                            "displayValue" : "No",
                                            "id": "no",
                                            "value": "N",
                                            "optionClassName": "mx-0"
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
                            "id": "group2",
                            "label": "Choose A Reason",
                            "labelClassName": "custom-fieldset font-weight-bold mt-4",
                            "name": null,
                            "value": null,
                            "className": "row g-3 mt-2",
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
                            "groups" : null,
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
                                    "dataListClassName": "col-12 col-sm-12 col-md-12 col-lg-5 col-xl-4 col-xxl-4",
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
                                    "dataListClassName": "col-12 col-sm-12 col-md-12 col-lg-5 col-xl-4 col-xxl-4",
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
                        }
                ],
                "groupElements": null
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
                Insurance Communication
            </HeaderComponent>
            <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height">
                <DynamicForm formJson={obj} helpers={helpers}/>
            </BodyComponent>
            <FooterComponent ref={footerRef}>
                <div className="footer py-2 px-3 d-flex flex-row-reverse align-items-center">
                    <Button variant="brand" className="ms-2 px-4">Submit</Button>
                </div>
            </FooterComponent>
        </Wrapper>
    );
};

export default withFormHoc(InsuranceCommunication);