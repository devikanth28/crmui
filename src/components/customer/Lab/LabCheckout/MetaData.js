export const testDetailsGridMetaData = (showTypeColumn) => {
    const metaData = {
        "idProperty": "testDetails",
        "columns": [
            {
                "columnName": "Test Name",
                "rowDataKey": "testName",
                "resizable": true,
                "customRowRenderingFunction": {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderInfo'
                }
            },
            {
                "columnName": "Sample Type",
                "rowDataKey": "sampleType",
                "resizable": true,
                "defaultColumnValue": "-",
            },
            {
                "columnName": "Sample Transport Condition",
                "rowDataKey": "sampleTransportCondition",
                "resizable": true,
                "defaultColumnValue": "-",
            },
            {
                "columnName": "MRP",
                "rowDataKey": "mrp",
                "resizable": true,
                "cellClassName": "text-end",
                "columnSubtype": "AMOUNT",
                "columnType": "NUMBER",
                "bottomSummaryCellComponent": {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderCartTotalColumns'
                },
                "isSummaryColumnRequired": true,
            },
            {
                "columnName": "Price",
                "rowDataKey": "price",
                "resizable": true,
                "cellClassName": "text-end",
                "columnSubtype": "AMOUNT",
                "columnType": "NUMBER",
                "isSummaryColumnRequired": true,
                "bottomSummaryCellComponent": {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderGrandTotalColumns'
                },
            },
            {
                "columnName": "Actions",
                "rowDataKey": "actions",
                "resizable": true,
                "customRowRenderingFunction": {
                    type: "FUNCTION",
                    returnType: "REACT_NODE",
                    name: 'renderTestActionsColumn'
                }
            },
        ]
    };

    if (showTypeColumn) {
        metaData.columns.unshift({
            "columnName": "Type",
            "rowDataKey": "type",
            "resizable": true,
            "width": 35,
            "customRowRenderingFunction": {
                type: "FUNCTION",
                returnType: "REACT_NODE",
                name: 'renderTypeColumn'
            }
        });
    }

    return metaData;
}


export const testDetailReviewGridMetaData = {
    "idProperty": "testDetails",
    "columns": [
        {
            "columnName": "Test Name",
            "rowDataKey": "testName",
            "resizable": true,
        },
        {
            "columnName": "Sample Type",
            "rowDataKey": "sampaleTypeName",
            "resizable": true,
            "defaultColumnValue": "-",
        },
        {
            "columnName": "Sample Transport Condition",
            "rowDataKey": "sampleTransportConditionName",
            "resizable": true,
            "defaultColumnValue": "-",
        },
        {
            "columnName": "MRP",
            "rowDataKey": "mrp",
            "resizable": true,
            "cellClassName": "text-end",
            "columnSubtype": "AMOUNT",
            "columnType": "NUMBER",
            "bottomSummaryCellComponent": {
                type: "FUNCTION",
                returnType: "REACT_NODE",
                name: 'renderCartTotalColumns'
            },
            "isSummaryColumnRequired": true,
        },
        {
            "columnName": "Price",
            "rowDataKey": "price",
            "resizable": true,
            "cellClassName": "text-end",
            "columnSubtype": "AMOUNT",
            "columnType": "NUMBER",
            "isSummaryColumnRequired": true,
            "bottomSummaryCellComponent": {
                type: "FUNCTION",
                returnType: "REACT_NODE",
                name: 'renderGrandTotalColumns'
            },
        }

    ]
}