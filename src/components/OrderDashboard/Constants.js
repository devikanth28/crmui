export const MART_ORDER_DASHBOARD_ORDER_SEQUENCE = {
    
    "mart":{
        "created": {
            "color": "#A7B2F8",
            "displayName": "Created",
            "className":"badge-width badge-created",
            "statusKey" : "I",
            "BarGraphLabelName":'CRT'
        },
        "approved": {
            "color": "#ADDDD4",
            "displayName": "Approved",
            "className":"badge-width badge-approved",
            "statusKey": "A",
            "BarGraphLabelName":'APP'
        },
        "edited": {
            "color": "#F5D0B7",
            "displayName": "Edited",
            "className":"badge-width badge-pending",
            "statusKey": "E",
            "BarGraphLabelName":'EDT'
        },
        "canceled": {
            "color": "#FF9F9F",
            "displayName": "Cancelled",
            "className":"badge-width badge-Cancelled",
            "statusKey": "C",
            "BarGraphLabelName":'CAN'
        },
        "receivedAtStore": {
            "color": "#A7CCF8",
            "displayName": "Received At Store",
            "className":"badge-width badge-Submitted",
            "statusKey": "T",
            "BarGraphLabelName":'RAS'
        },
        "invoiced": {
            "color": "#ADDDD4",
            "displayName": "Invoiced",
            "className":"badge-width badge-approved",
            "statusKey": "D",
            "BarGraphLabelName":'INV'
        },
        "orderDelivered": {
            "color": "#7FE2D0",
            "displayName": "Delivered",
            "className":"badge-width badge-Decoded",
            "statusKey": "SD",
            "BarGraphLabelName":'ODD'
        },
        "toApproved": {
            "color": "#A7B2F8",
            "displayName": "TO Approved",
            "className":"badge-width badge-created",
            "statusKey": "M",
            "BarGraphLabelName":'TOA'
        },
        "prescAwaited": {
            "color": "#F5D0B7",
            "displayName": "Prescription Awaited",
            "className":"badge-width badge-pending",
            "statusKey": "PI",
            "BarGraphLabelName":'PAW'
        },
        "seperator": {
            "color": "#F4F4F4",
            "displayName": "Shipment"
        },
        "shipmentApproved": {
            "color": "#ADDDD4",
            "displayName": "Approved",
            "className":"badge-width badge-approved",
            "statusKey": "SA",
            "BarGraphLabelName":'SAPP'
        },
        "shipmentRejected": {
            "color": "#E9A8B0",
            "displayName": "Rejected",
            "className":"badge-width badge-rejected",
            "statusKey": "SR",
            "BarGraphLabelName":'REJ'
        },
        "shipmentReturned": {
            "color": "#F5D0B7",
            "displayName": "Returned",
            "className":"badge-width badge-pending",
            "statusKey": "SW",
            "BarGraphLabelName":'SRTN'
        },
    },

    "prescription":{
        "created":{
            "color": "#A7B2F8",
            "displayName":"Created",
            "className":"badge-width badge-created",
            "statusKey": "created",
            "BarGraphLabelName":'CRT'
        },
        "partiallyDecoded":{
            "color": "#F7F8A7",
            "displayName" : "Partially Decoded",
            "className":"badge-width badge-PartiallyDecoded",
            "statusKey": "partiallyDecoded",
            "BarGraphLabelName":'PRD'
        },
        "decoded":{
            "color": "#7FE3D0",
            "displayName" : "Decoded",
            "className":"badge-width badge-Decoded",
            "statusKey": "decoded",
            "BarGraphLabelName":'DCD'
        },
        "convertedToOMSOrder":{
            "color":"#A7CCF8",
            "displayName":"Converted To OMSOrder",
            "className":"badge-width badge-Submitted",
            "statusKey": "convertedToOms",
            "BarGraphLabelName":'CMO'
        },
        "canceled":{
            "color": "#FF9F9F",
            "displayName": "Cancelled",
            "className":"badge-width badge-Cancelled",
            "statusKey": "cancelled",
            "BarGraphLabelName":'CAN'
        },
        "pending":{
            "color":"#F5D0B7",
            "displayName":"Pending",
            "className":"badge-width badge-pending",
            "statusKey": "pending",
            "BarGraphLabelName":'PND'
        },
    },

    "lab":{
        "Created":{
            "color": "#A7B2F8",
            "displayName":"Created",
            "className":"badge-width badge-created", 
            "statusKey": "I",
            "BarGraphLabelName":'CRT'
        },
        "Approved": {
            "color": "#ADDDD4",
            "displayName": "Approved",
            "className":"badge-width badge-approved",
            "statusKey": "A",
            "BarGraphLabelName":'APP'
        },
        "AssignedToCollectionCenter": {
            "color": "#F5D0B7",
            "displayName": "Assigned To Collection Center",
            "className":"badge-width badge-pending",
            "statusKey": "E",
            "BarGraphLabelName":'ACC'
        },
        "PatientAcknowledged": {
            "color": "#F5D0B7",
            "displayName": "Patient Acknowledged",
            "className":"badge-width badge-pending",
            "statusKey": "K",
            "BarGraphLabelName":'PAC'
        },
        "Canceled": {
            "color": "#FF9F9F",
            "displayName": "Cancelled",
            "className":"badge-width badge-Cancelled",
            "statusKey": "C",
            "BarGraphLabelName":'CAN'
        },
        "AssignedToAgent": {
            "color": "#F5D0B7",
            "displayName": "Assigned To Agent",
            "className":"badge-width badge-pending",
            "statusKey": "G",
            "BarGraphLabelName":'AAG'
        },
        "SampleCollected": {
            "color": "#7FE3D0",
            "displayName": "Sample Collected",
            "className":"badge-width badge-Decoded",
            "statusKey": "S",
            "BarGraphLabelName":'SCD'
        },
        "UnableToCollect": {
            "color": "#E9A8B0",
            "displayName": "Unable To Collect",
            "className":"badge-width badge-rejected",
            "statusKey": "U",
            "BarGraphLabelName":'UCL'
        },
        "SampleAccepted": {
            "color": "#7FE3D0",
            "displayName": "Sample Accepted",
            "className":"badge-width badge-Decoded",
            "statusKey": "T",
            "BarGraphLabelName":'SAP'
        },
        "SampleRejected": {
            "color": "#E9A8B0",
            "displayName": "Sample Rejected",
            "className":"badge-width badge-rejected",
            "statusKey": "R",
            "BarGraphLabelName":'SRJ'
        },
        "Processing": {
            "color": "#7FE3D0",
            "displayName": "Processing",
            "className":"badge-width badge-Decoded",
            "statusKey": "P",
            "BarGraphLabelName":'PRO'
        },
        "ReadyForPrint": {
            "color": "#A7B2F8",
            "displayName": "Ready For Print",
            "className":"badge-width badge-created",
            "statusKey": "D",
            "BarGraphLabelName":'RFP'
        },

    },

    "cfp":{
        "created": {
            "color": "#A7B2F8",
            "displayName": "Pending",
            "className":"badge-width badge-created",
            "statusKey" : "C",
            "BarGraphLabelName":'PND'
        },
        "followUps": {
            "color": "#F5D0B7",
            "displayName": "Follow Ups",
            "className":"badge-width badge-pending",
            "statusKey": "P",
            "BarGraphLabelName":'FUP'
        },
        "forceclosed": {
            "color": "#FF9F9F",
            "displayName": "Closed",
            "className":"badge-width badge-Cancelled",
            "statusKey": "F",
            "BarGraphLabelName":'CLS'
        },
        "withdrawn": {
            "color": "#E9A8B0",
            "displayName": "Withdrawn",
            "className":"badge-width badge-rejected",
            "statusKey": "W",
            "BarGraphLabelName":'WDR'
        },
        "completed": {
            "color": "#7FE2D0",
            "displayName": "Sales Done",
            "className":"badge-width badge-approved",
            "statusKey": "D",
            "BarGraphLabelName":'SLD'
        }
    }
};