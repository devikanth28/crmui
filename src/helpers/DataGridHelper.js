import { useContext } from 'react';
import { UserContext } from '../components/Contexts/UserContext';
import Validate from './Validate';

const DataGridHelper = () => {
    const userSessionInfo = useContext(UserContext);

    const getStatusDashboard = () => {
        let statusDashboard = {
            "idProperty": "rowIndex",
            "columns": [
                {
                    "columnName": "Status",
                    "rowDataKey": "Status",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'renderStatusDashboardStatusColumn'
                    }
                },
                {
                    "columnName": "Date",
                    "rowDataKey": "SysTime",
                    "resizable": true,
                    "columnType": "DATE",
                    "dateFormatStr": "NORMAL_DATE_WITH_24_TIME"
                },
                {
                    "columnName": "User",
                    "rowDataKey": "UserId",
                    "resizable": true,
                    "cellClassName":"border-end-0"
                }
            ],
        };
        return statusDashboard;
    }

    const getShipmentStatusDashboard = () => {
        let shipmentDashboard = {
            "idProperty": "rowIndex",
            "columns": [
                {
                    "columnName": "Shipment Type",
                    "rowDataKey": "shipmentType",
                    "resizable": true
                },
                {
                    "columnName": "Status",
                    "rowDataKey": "Status",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'renderShipmentDashboardStatusColumn'
                    }
                },
                {
                    "columnName": "Date",
                    "rowDataKey": "DateCreated",
                    "resizable": true
                },
                {
                    "columnName": "User",
                    "rowDataKey": "UserId",
                    "resizable": true,
                    "cellClassName":"border-end-0"
                }
            ],
            "groupBy": "shipmentTypeId"
        };
        return shipmentDashboard;
    }

    const getLocationDashboard = () => {
        let locationDashboard = {
            "idProperty": "latLng",
            "columns": [
                {
                    "columnName": "Latitude Longitude",
                    "rowDataKey": "latLng",
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'renderLocationLatlongColumn'
                    },
                    "resizable": true
                },
                {
                    "columnName": "Config ID",
                    "rowDataKey": "locationConfigId",
                    "resizable": true
                },
                {
                    "columnName": "Hub ID",
                    "rowDataKey": "hubStoreId",
                    "resizable": true
                },
                {
                    "columnName": "Warehouse ID",
                    "rowDataKey": "storeId",
                    "resizable": true
                },
                {
                    "columnName": "Pickstore ID",
                    "rowDataKey": "pickStoreId",
                    "resizable": true,
                    "cellClassName":"border-end-0"
                }
            ],
        };
        return locationDashboard;
    }

    const getProductsDashboard = (orderInfo) => {
        let productsDashboardColumns = [
            {
                "columnName": "Type",
                "rowDataKey": "productType",
                "resizable": true,
                "customRowRenderingFunction": {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderProductTypeColumn'
                },
                "defaultColumnValue": "-"
            },
            {
                "columnName": "Product ID",
                "rowDataKey": "productId",
                "resizable": true
            },
            {
                "columnName": "Product Name",
                "rowDataKey": "productName",
                "resizable": true
            },
            {
                "columnName": "Pack Size",
                "rowDataKey": "packSize",
                "resizable": true
            }
        ];
        if (Validate().isNotEmpty(orderInfo.status) && orderInfo.status === "E") {
            productsDashboardColumns.push({
                "columnName": "Edit Quantity",
                "rowDataKey": "editedQuantity",
                "resizable": true
            })
        }
        productsDashboardColumns.push({
            "columnName": "Status",
            "rowDataKey": "productDisplayStatus",
            "resizable": true,
            "customRowRenderingFunction": {
                type: "FUNCTION",
                returnType: "REACT_NODE",
                name: 'renderProductDashboardStatusColumn'
            }
        })
        switch (orderInfo.orderType) {
            case "REDEMPTION":
                productsDashboardColumns.push({
                    "columnName": "Points (per unit)",
                    "rowDataKey": "redemptionPoints",
                    "resizable": true
                })
                break;

            case "PB_ORDER":
                productsDashboardColumns.push({
                    "columnName": "Special Price",
                    "rowDataKey": "paybackIncludedPrice",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'renderProductDashboardSpecialPriceColumn'
                    }
                })
                break;

            default:
                productsDashboardColumns.push({
                    "columnName": "MRP (per unit)",
                    "rowDataKey": "productMrp",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'renderProductDashboardMrpColumn'
                    }
                })
                break;
        }
        productsDashboardColumns.push(
            {
                "columnName": "Quantity (in units)",
                "rowDataKey": "quantity",
                "isFrozen": userSessionInfo.vertical != "V",
                "frozenColumnPosition": "RIGHT",
                "isSummaryColumnRequired": true
            },
            {
                "columnName": "Total",
                "rowDataKey": "productTotal",
                "customRowRenderingFunction": {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderProductDashboardTotalColumn'
                },
                "bottomSummaryCellComponent" : {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderProductDashboardTotalSummaryColumns'
                },
                "cellClassName": "text-end", 
                "isFrozen": userSessionInfo.vertical != "V",
                "frozenColumnPosition": "RIGHT",
                "isSummaryColumnRequired": true,
                "cellClassName":"border-end-0"
            }
        )
        let productsDashboard = {
            "idProperty": "rowIndex",
            "columns": productsDashboardColumns,
        };
        return productsDashboard;
    }

    const getReservedQuantityDashboard = () => {
        let reservedQuantityDashboard = {
            "idProperty": "productId",
            "columns": [
                {
                    "columnName": "Product ID",
                    "rowDataKey": "productId",
                    "resizable": true
                },
                {
                    "columnName": "Ordered Quantity",
                    "rowDataKey": "orderedQuantity",
                    "resizable": true
                },
                {
                    "columnName": "Reserved Quantity",
                    "rowDataKey": "reservedQuantity",
                    "resizable": true,
                    "cellClassName":"border-end-0"
                }
            ],
        };
        return reservedQuantityDashboard;
    }

    const getPaymentDashboard = () => {
        let paymentDashboard = {
            "idProperty": "rowIndex",
            "columns": [{
                "columnName": "Settlement Type",
                "rowDataKey": "settlementType",
                "resizable": true
            },
            {
                "columnName": "Transaction No",
                "rowDataKey": "txNo",
                "resizable": true
            },
            {
                "columnName": "Mode",
                "rowDataKey": "mode",
                "resizable": true
            },
            {
                "columnName": "Payment Gateway",
                "rowDataKey": "gatewayId",
                "resizable": true
            },
            {
                "columnName": "Status",
                "rowDataKey": "status",
                "resizable": true,
                "customRowRenderingFunction": {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderPaymentDashboardStatusColumn'
                }
            },
            {
                "columnName": "Payment Date",
                "rowDataKey": "paymentDate",
                "resizable": true,
                "columnType": "DATE",
                "dateFormatStr": "NORMAL_DATE_WITH_24_TIME",
                "isFrozen": userSessionInfo.vertical != "V",
                "frozenColumnPosition": "RIGHT",
                "isSummaryColumnRequired": true
            },
            {
                "columnName": "Amount",
                "rowDataKey": "amount",
                "resizable": true,
                "customRowRenderingFunction": {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderPaymentDashboardAmountColumn'
                },
                "bottomSummaryCellComponent" : {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderPaymentDashboardAmountSummaryColumns'
                },
                "isFrozen": userSessionInfo.vertical != "V",
                "frozenColumnPosition": "RIGHT",
                "isSummaryColumnRequired": true,
                "cellClassName":"border-end-0"
            }],
        };
        return paymentDashboard;
    }

    const getRefundPaymentDashboard = () => {
        let refundPaymentDashboard = {
            "idProperty": "rowIndex",
            "columns": [{
                "columnName": "Settlement Type",
                "rowDataKey": "settlementType",
                "resizable": true
            },
            {
                "columnName": "Transaction No",
                "rowDataKey": "txNo",
                "resizable": true
            },
            {
                "columnName": "Mode",
                "rowDataKey": "mode",
                "resizable": true
            },
            {
                "columnName": "Payment Gateway",
                "rowDataKey": "gatewayId",
                "resizable": true
            },
            {
                "columnName": "Status",
                "rowDataKey": "status",
                "resizable": true,
                "customRowRenderingFunction": {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderRefundPaymentDashboardStatusColumn'
                }
            },
            {
                "columnName": "Payment Date",
                "rowDataKey": "paymentDate",
                "resizable": true,
                "columnType": "DATE",
                "dateFormatStr": "NORMAL_DATE_WITH_24_TIME",
                "isFrozen": userSessionInfo.vertical != "V",
                "frozenColumnPosition": "RIGHT",
                "isSummaryColumnRequired": true
            },
            {
                "columnName": "Amount",
                "rowDataKey": "amount",
                "resizable": true,
                "customRowRenderingFunction": {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderRefundPaymentDashboardAmountColumn'
                },
                "bottomSummaryCellComponent" : {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderRefundPaymentDashboardAmountSummaryColumns'
                },
                "isFrozen": userSessionInfo.vertical != "V",
                "frozenColumnPosition": "RIGHT",
                "isSummaryColumnRequired": true,
                "cellClassName":"border-end-0"
            }],
        };
        return refundPaymentDashboard;
    }

    const getRefundDashboard = (orderInfo) => {
        let refundDashboardColumns = [
            {
                "columnName": "Product Name",
                "rowDataKey": "productName",
                "resizable": true
            },
            {
                "columnName": "Refund Quantity",
                "rowDataKey": "refundQuantity",
                "resizable": true
            },
            {
                "columnName": "Refund Reason",
                "rowDataKey": "refundReason",
                "resizable": true
            }
        ];
        if (orderInfo.orderType === "PB_ORDER") {
            refundDashboardColumns.push(
                {
                    "columnName": "Special Price",
                    "rowDataKey": "specialPrice",
                    "resizable": true,
                    "isFrozen": userSessionInfo.vertical != "V",
                    "frozenColumnPosition": "RIGHT",
                    "isSummaryColumnRequired": true
                },
                {
                    "columnName": "Amount",
                    "rowDataKey": "refundAmount",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'renderRefundDashboardAmountColumn'
                    },
                    "bottomSummaryCellComponent" : {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'renderRefundDashboardAmountSummaryColumns'
                    },
                    "isFrozen": userSessionInfo.vertical != "V",
                    "frozenColumnPosition": "RIGHT",
                    "isSummaryColumnRequired": true,
                    "cellClassName":"border-end-0"
                }
            )
        } else {
            refundDashboardColumns.push(
                {
                    "columnName": "MRP",
                    "rowDataKey": "mrp",
                    "resizable": true,
                    "cellClassName": "text-end",
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'renderRefundDashboardMrpColumn'
                    }
                },
                {
                    "columnName": "Rate",
                    "rowDataKey": "rate",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'renderRefundDashboardRateColumn'
                    },
                    "cellClassName": "text-end",
                    "isFrozen": userSessionInfo.vertical != "V",
                    "frozenColumnPosition": "RIGHT",
                    "isSummaryColumnRequired": true
                },
                {
                    "columnName": "Amount",
                    "rowDataKey": "refundAmount",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'renderRefundDashboardAmountColumn'
                    },
                    "bottomSummaryCellComponent" : {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'renderRefundDashboardAmountSummaryColumns'
                    },
                    "cellClassName": "text-end",
                    "isFrozen": userSessionInfo.vertical != "V",
                    "frozenColumnPosition": "RIGHT",
                    "isSummaryColumnRequired": true,
                    "cellClassName":"border-end-0"
                }
            )
        }
        let refundDashboard = {
            "idProperty": "rowIndex",
            "columns": refundDashboardColumns,
        };
        return refundDashboard;
    }

    const getCheckStatusDataGridObj = () => {
        let checkStatusDataGridObj = {
            "idProperty": "rowIndex",
            "columns": [
                {
                    "columnName": "Test Name",
                    "rowDataKey": "testName",
                    "resizable": true,
                },
                {
                    "columnName": "Status",
                    "rowDataKey": "status",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'status'
                    }
                },
                {
                    "columnName": "Department",
                    "rowDataKey": "departmentName",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'departmentName'
                    }
                },
                {
                    "columnName": "Form",
                    "rowDataKey": "formName",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'formName'
                    }
                },
            ],
        };
        return checkStatusDataGridObj;
    }

    const getScriptionFeesDataGridObj = () => {
        let fees = {
            "idProperty": "rowIndex",
            "columns": [
                {
                    "columnName": "Name",
                    "rowDataKey": "name",
                    "resizable": true,
                },
                {
                    "columnName": "Age Rule",
                    "rowDataKey": "ageRule",
                    "resizable": true,
                },
                {
                    "columnName": "MRP",
                    "rowDataKey": "mrp",
                    "resizable": true,
                    "cellClassName" :"text-end"
                },
                {
                    "columnName": "Price",
                    "rowDataKey": "price",
                    "resizable": true,
                    "cellClassName" :"text-end"
                },
            ],
        }
        return fees
    }

    const getScriptionRulesDataGridObj = () => {
        let rules = {
            "idProperty": "rowIndex",
            "columns": [
                {
                    "columnName": "Members",
                    "rowDataKey": "members",
                    "resizable": true,
                },
                {
                    "columnName": "Value",
                    "rowDataKey": "value",
                    "resizable": true,
                },
            ],
        }
        return rules;
    }

    const getOrderPaymentDetailsDataGridObj = () => {
        let paymentDetails = {
            "idProperty": "rowIndex",
            "columns": [
                {
                    "columnName": "Order ID",
                    "rowDataKey": "orderId",
                    "resizable": false,
                },
                {
                    "columnName": "Amount",
                    "rowDataKey": "amount",
                    "resizable": true,
                    "cellClassName" :"text-end",
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'amount'
                    }
                },
                {
                    "columnName": "Payment Mode",
                    "rowDataKey": "paymentMode",
                    "resizable": false,
                },
                {
                    "columnName": "Payment Status",
                    "rowDataKey": "paymentStatus",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'paymentStatus'
                    }
                },
                {
                    "columnName": "Order Date",
                    "rowDataKey": "orderDate",
                    "resizable": true,
                    "dateFormatStr": "NORMAL_DATE"
                },
                {
                    "columnName": "Order Status",
                    "rowDataKey": "orderStatus",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'orderStatus'
                    }
                },
                {
                    "columnName": "Action",
                    "rowDataKey": "action",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        type: "FUNCTION",
                        returnType: "REACT_NODE",
                        name: 'action'
                    }
                }
            ],
        }
        return paymentDetails;
    }
    
    const ReviewProductList = () => {
        const products = {
            "idProperty": "rowIndex",
            "columns" : [
                {
                    "columnName": "Type",
                    "rowDataKey": "type",
                    "resizable": true,
                    "width": 20,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderTypeColumn"
                    },
                },
                {
                    "columnName" : "Name",
                    "rowDataKey": "name",
                    "resizable": true,
                },
                {
                    "columnName" : "Offers Applied (%)",
                    "rowDataKey": "offersApplied",
                    "resizable": true,
                },
                {
                    "columnName" : "Packsize (Units/pack)",
                    "rowDataKey": "packsize",
                    "resizable": true,
                },
                {
                    "columnName" : "Delivery Time",
                    "rowDataKey": "deliveryTIme",
                    "resizable": true,
                },
                {
                    "columnName" : "Required Quantity Packs",
                    "rowDataKey": "reqQty",
                    "resizable": true,
                },
                {
                    "columnName" : "Quantity Units",
                    "rowDataKey": "qtyUnits",
                    "resizable": true,
                },
                {
                    "columnName" : "Product Discount",
                    "rowDataKey": "productDiscount",
                    "resizable": true,
                },
                {
                    "columnName" : "MRP",
                    "rowDataKey": "mrp",
                    "resizable": true,
                    "isSummaryColumnRequired": true,
                    "isFrozen": userSessionInfo.vertical != "V",
                    "frozenColumnPosition": "RIGHT"
                },
                {
                    "columnName": "Amount",
                    "rowDataKey": "amount",
                    "resizable": true,
                    "isSummaryColumnRequired": true,
                    "isFrozen": userSessionInfo.vertical != "V",
                    "frozenColumnPosition": "RIGHT",
                }
            ]}
            return products;
        }
    
    const getShoppingCartDataGrid=()=>{
            let shoppingCartColumns = [
                {
                    "columnName": "Type",
                    "rowDataKey": "type",
                    "resizable": true,
                    "width": 20,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderTypeColumn"
                    },
                },
                {
                    "columnName": "Name",
                    "rowDataKey": "productName",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "openProductDetails"
                    },
                },
                {
                    "columnName": "Availability",
                    "rowDataKey": "outOfStock",
                    "resizable": true,
                    "cellClassName": "text-center",
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderOutOfStockColumn"
                    },
                },
                {
                    "columnName": "Offers Applied",
                    "rowDataKey": "offers",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderOffers"
                    }
                },
                {
                    "columnName": "Packsize",
                    "rowDataKey": "packSize",
                    "resizable": true
                },
                {
                    "columnName": "Delivery Time",
                    "rowDataKey": "deliveryTime",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderDeliveryColumn"
                    }
                },
                {
                    "columnName": "Packs",
                    "rowDataKey": "packs",
                    "isEditable" : true,
                    "columnHeaderIcon":"EDIT_ICON",
                    "cellEditor" : {
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "packEditor"
                    },
                    "resizable": true,
                    "editorOptions": {
                        "editOnFocus" : true
                    },
                    "defaultColumnEditorProps":{
                        "pattern":"^[0-9]+$",
                        "maxlength":2,
                    }
                },
                {
                    "columnName": "Units",
                    "rowDataKey": "units",
                    "columnType" : "NUMBER",
                    "resizable": true,
                },
                {
                    "columnName": "MRP",
                    "rowDataKey": "mrp",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderMrpColumn"
                    }
                },
                {
                    "columnName": "Amount",
                    "rowDataKey": "amount",
                    "resizable": true,
                    "isSummaryColumnRequired": true,
                    "isFrozen": userSessionInfo.vertical != "V",
                    "frozenColumnPosition": "RIGHT",
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderAmountColumn"
                    },
                },
                {
                    "columnName": "Actions",
                    "rowDataKey": "action",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderActionColumn"
                    },
                    "isFrozen": userSessionInfo.vertical != "V",
                    "frozenColumnPosition": "RIGHT",
                    "isSummaryColumnRequired": true,
                }
            ];
            let shoppingCartGrid = {
                "idProperty": "productId",
                "columns": shoppingCartColumns,
            };
            return shoppingCartGrid;
        }
    
        const getComplimentaryDataGrid=()=>{
            let complimentaryColumns = [
                {
                    "columnName": "Name",
                    "rowDataKey": "productName",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "openProductDetails"
                    }
                },
                {
                    "columnName": "Packsize",
                    "rowDataKey": "packSize",
                    "resizable": true
                },
                {
                    "columnName": "Quantity",
                    "rowDataKey": "units",
                    "resizable": true,
                },
                {
                    "columnName": "MRP",
                    "rowDataKey": "mrp",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderMrpColumn"
                    }
                },
                {
                    "columnName": "Amount",
                    "rowDataKey": "amount",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderAmount"
                    },
                },
                {
                    "columnName": "Discount Price",
                    "rowDataKey": "discountPrice",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderDiscountPrice"
                    },
                },
                {
                    "columnName": "Actions",
                    "rowDataKey": "action",
                    "resizable": true,
                    "isFrozen": userSessionInfo.vertical != "V",
                    "frozenColumnPosition": "RIGHT",
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderActionColumn"
                    }
                }
            ];
            let complimentaryDataGrid = {
                "idProperty": "rowIndex",
                "columns": complimentaryColumns,
            };
            return complimentaryDataGrid;
        }


        const getRecommendedDataGrid=()=>{
            let recommendedColumns = [
                {
                    "columnName": "Name",
                    "rowDataKey": "productName",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "openProductDetails"
                    }
                },
                {
                    "columnName": "Packsize",
                    "rowDataKey": "packSize",
                    "resizable": true
                },
                {
                    "columnName": "Delivery Time",
                    "rowDataKey": "deliveryTime",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderDeliveryColumn"
                    }
                },
                {
                    "columnName": "Packs",
                    "rowDataKey": "packs",
                    "resizable": true,
                },
                {
                    "columnName": "Quantity",
                    "rowDataKey": "units",
                    "resizable": true,
                },
                {
                    "columnName": "MRP",
                    "rowDataKey": "mrp",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderMrpColumn"
                    }
                },
                {
                    "columnName": "Amount",
                    "rowDataKey": "amount",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderAmount"
                    }
                },
                {
                    "columnName": "Actions",
                    "rowDataKey": "action",
                    "resizable": true,
                    "isFrozen": userSessionInfo.vertical != "V",
                    "frozenColumnPosition": "RIGHT",
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderActionColumn"
                    }
                }
            ];
            let recommendedDataGrid = {
                "idProperty": "rowIndex",
                "columns": recommendedColumns,
            };
            return recommendedDataGrid;
        }
        
        const RiteMedInvoice = () => {
            let products={
                "idProperty": "rowIndex",
                "columns": [

                    {
                        "columnName" : "Invoice ID",
                        "rowDataKey": "invoiceId",
                        "resizable": true,
                        "showFilter": true,
                        "customRowRenderingFunction":{
                            "type": "FUNCTION",
                            "returnType": "REACT_NODE",
                            "name": "renderInvoiceId"
                        }
                    },
                    {
                        "columnName" : "Date",
                        "rowDataKey": "dateCreated",
                        "defaultColumnValue" : "-",
                        "resizable": true,
                    },
                    {
                        "columnName" : "Store",
                        "rowDataKey": "storeAddr",
                        "resizable": true,
                        "showFilter": true
                    },
                    {
                        "columnName" : "Promotion Type",
                        "rowDataKey": "promotionType",
                        "resizable": true,
                    },
                    {
                        "columnName" : "Amount",
                        "rowDataKey": "amount",
                        "resizable": true,
                    },
                    {
                        "columnName" : "Actions",
                        "rowDataKey": "StoreActions",
                        "resizable": true,
                        "cellClassName" : "actions-column border-end-0",
                        "customRowRenderingFunction":{
                            "type": "FUNCTION",
                            "returnType": "REACT_NODE",
                            "name": "renderActionColumn"
                        },
                    },
                
                ]
            }
            return products
        }

         const StoreList=()=>{
            let stores={
                "idProperty": "rowIndex",
                "columns" : [
                    {
                        "columnName" : "Name",
                        "rowDataKey": "storeName",
                        "resizable": true,
                        "showFilter": true
                    },
                    {
                        "columnName" : "Address",
                        "rowDataKey": "address",
                        "resizable": true,
                        "showFilter": true
                    },
                    {
                        "columnName" : "Phone Number",
                        "rowDataKey": "phoneNumber",
                        "resizable": true,
                    },
                    {
                        "columnName" : "Actions",
                        "rowDataKey": "StoreActions",
                        "resizable": true,
                        "cellClassName" : "actions-column border-end-0",
                        "customRowRenderingFunction":{
                            "type": "FUNCTION",
                            "returnType": "REACT_NODE",
                            "name": "renderActionColumn"
                        },
                    },
                ],
                "initialFilters": {
                    "storeName": {
                        "value": null,
                        "selectedOperator": "CONTAINS_STRING",
                        "filterType": "STRING",
                        "operatorsList": [
                            "CONTAINS_STRING"
                        ],
                    },
                    "address": {
                        "value": null,
                        "selectedOperator": "CONTAINS_STRING",
                        "filterType": "STRING",
                        "operatorsList": [
                            "CONTAINS_STRING"
                        ],
                    }
                }
            }
                return stores;
            }

            const HealthRecordList=()=>{
                let Records={
                    "idProperty": null,
                    "columns" : [
                        {
                            "columnName" : "Name",
                            "rowDataKey": "recordName",
                            "resizable": true,
                            "defaultColumnValue" : "-",
                        },
                        {
                            "columnName" : "Prescription",
                            "rowDataKey": "RecordPrescription",
                            "resizable": true,
                            "defaultColumnValue" : "-",
                            "customRowRenderingFunction":{
                                "type": "FUNCTION",
                                "returnType": "REACT_NODE",
                                "name": "renderPresImageColumn"
                            },
                        },
                        {
                            "columnName" : "Doctor Name",
                            "rowDataKey": "doctorName",
                            "defaultColumnValue" : "-",
                            "resizable": true,
                        },
                        {
                            "columnName" : "Uploaded Date",
                            "rowDataKey": "dateCreated",
                            "defaultColumnValue" : "-",
                            "resizable": true,
                        },
                        {
                            "columnName" : "Actions",
                            "rowDataKey": "RecordActions",
                            "resizable": true,
                            "cellClassName" : "actions-column border-end-0",
                            "customRowRenderingFunction":{
                                "type": "FUNCTION",
                                "returnType": "REACT_NODE",
                                "name": "renderActionColumn"
                            },
                        },
                    ]
                }
                return Records;
            }

    const productAlternatives=()=>{
        let productDetails ={
            "idProperty": "productId",
            "columns" : [
                {
                    "columnName": "Name",
                    "rowDataKey": "productName",
                    "resizable": true,
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderProductNameColumn"
                    }
                },
                {
                    "columnName": "Manufacturer",
                    "rowDataKey": "manufacturer",
                    "resizable": true,
                },
                {
                    "columnName": "Form",
                    "rowDataKey": "auditForm",
                    "resizable": true,
                },
                {
                    "columnName": "Pack Size",
                    "rowDataKey": "packSize",
                    "resizable": true,
                },
                {
                    "columnName": "MRP",
                    "rowDataKey": "packSizeMrp",
                    "resizable": true,
                    "cellClassName" : "text-end",
                    "columnSubtype" : "AMOUNT",
                    "columnType" : "NUMBER"
                },
                {
                    "columnName": "Difference",
                    "rowDataKey": "price",
                    "resizable": true,
                    "cellClassName" : "border-end-0",
                    "customRowRenderingFunction":{
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderStatusColumn"
                    }
                }
            ],
            "paginationInfo" : {
                "loadOnScroll" : true,
                "limit": 10,
                "initialPageNumber": 1
            }
        }
        return productDetails;
    }

    const getSwitchCartDataGrid=()=>{
        let switchProductColumns = [
            {
                "columnName": "Requested Product Name",
                "rowDataKey": "requestedProductName",
                "resizable": true,
                "customRowRenderingFunction":{
                    "type": "FUNCTION",
                    "returnType": "REACT_NODE",
                    "name": "openRequestedProductDetails"
                },
            },
            {
                "columnName": "Manufacturer",
                "rowDataKey": "requestedManufacturer",
                "resizable": true
            },
            {
                "columnName": "Units",
                "rowDataKey": "requestedUnits",
                "columnType" : "NUMBER",
                "resizable": true,
            },
            {
                "columnName": "Packs Size",
                "rowDataKey": "requestedPackSize",
                "isEditable" : true,
                "resizable": true,
            },
            {
                "columnName": "MRP",
                "rowDataKey": "requestedMrp",
                "resizable": true,
            },
            {
                "columnName": "",
                "rowDataKey": "arrowIcon",
                "resizable": true,
                "cellClassName": "d-flex justify-content-center align-items-center",
                "customRowRenderingFunction":{
                    "type": "FUNCTION",
                    "returnType": "REACT_NODE",
                    "name": "renderArrowIcon"
                },
            },
            {
                "columnName": "Actions",
                "rowDataKey": "action",
                "resizable": true,
                "customheaderFunction":{
                    "type": "FUNCTION",
                    "returnType": "REACT_NODE",
                    "name": "renderActionHeader"
                },
                "customRowRenderingFunction":{
                    "type": "FUNCTION",
                    "returnType": "REACT_NODE",
                    "name": "renderActionColumn"
                },
            },
            {
                "columnName": "Switch Product Name",
                "rowDataKey": "switchProductName",
                "resizable": true,
                "customRowRenderingFunction":{
                    "type": "FUNCTION",
                    "returnType": "REACT_NODE",
                    "name": "openSwitchProductDetails"
                },
                "cellClassName" : "row-popup-opened",
                "headerCellClassName" : "row-popup-opened"
            },
            {
                "columnName": "Manufacturer",
                "rowDataKey": "switchManufacturer",
                "resizable": true,
                "cellClassName" : "row-popup-opened",
                "headerCellClassName" : "row-popup-opened"
            },
            {
                "columnName": "Units",
                "rowDataKey": "switchUnits",
                "columnType" : "NUMBER",
                "resizable": true,
                "cellClassName" : "row-popup-opened",
                "headerCellClassName" : "row-popup-opened"
            },
            {
                "columnName": "Packs Size",
                "rowDataKey": "switchPackSize",
                "isEditable" : true,
                "resizable": true,
                "cellClassName" : "row-popup-opened",
                "headerCellClassName" : "row-popup-opened"
            },
            {
                "columnName": "MRP",
                "rowDataKey": "switchMrp",
                "resizable": true,
                "cellClassName" : "row-popup-opened",
                "headerCellClassName" : "row-popup-opened"
            }
        ];
        let switchProductGrid = {
            "idProperty": "productId",
            "columns": switchProductColumns,
        };
        return switchProductGrid;
    }
    



    const checkGridSpecificationsForVertical = (vertical, dataGridObject) => {
        if (vertical != "V") {
            return dataGridObject;
        }
    
        const handleMobileViewColumns = (columnsList) => {
            if (Validate().isEmpty(columnsList)) {
                return [];
            }
            
            return columnsList.map((eachColumn) => {
                if (Validate().isEmpty(eachColumn.columnName) || eachColumn.columnName === "" || eachColumn.columnName === " " || eachColumn.columnName === "checkBox") {
                    return eachColumn;
                }
                
                let modifiedColumn = {
                    ...eachColumn,
                    isFrozen: false,
                    resizable: false,
                    showColumnMenu: false,
                    customColumnVisibilityOption: false,
                };
                
                if (Validate().isNotEmpty(eachColumn.childColumns)) {
                    modifiedColumn = {
                        ...modifiedColumn,
                        childColumns: handleMobileViewColumns(eachColumn.childColumns)
                    };
                }
                
                return modifiedColumn;
            });
        };
    
        let mobileCompatibleGridObject = {
            ...dataGridObject,
            columns: handleMobileViewColumns(dataGridObject.columns),
            enableCustomColumnVisibleOption: false,
            controlCustomColumnOptions: false,
            idProperty: null
        };
    
        if (dataGridObject.paginationInfo) {
            mobileCompatibleGridObject = {
                ...mobileCompatibleGridObject,
                paginationInfo: {
                    ...dataGridObject.paginationInfo,
                    isPaginationRequired: false,
                    loadOnScroll: true
                },
            };
        }
    
        return mobileCompatibleGridObject;
    };

    return Object.freeze({
        getStatusDashboard,
        getShipmentStatusDashboard,
        getLocationDashboard,
        getProductsDashboard,
        getReservedQuantityDashboard,
        getPaymentDashboard,
        getRefundPaymentDashboard,
        getRefundDashboard,
        ReviewProductList,
        getShoppingCartDataGrid,
        getComplimentaryDataGrid,
        getRecommendedDataGrid,
        StoreList,
        HealthRecordList,
        productAlternatives,
        getSwitchCartDataGrid,
        RiteMedInvoice,
        getCheckStatusDataGridObj,
        getScriptionFeesDataGridObj,
        getScriptionRulesDataGridObj,
        getOrderPaymentDetailsDataGridObj,
        checkGridSpecificationsForVertical
    });

}

export default DataGridHelper;
