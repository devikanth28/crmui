import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import React, { useMemo } from "react";
import Validate from "../../helpers/Validate";
import DynamicGridHeight from "../Common/DynamicGridHeight";

const AggregateOrderDetails = (props) => {
    let aggregateOrderDetails = props.aggregateOrderDetails.aggregateOrderDetails;

    let storeIdNames = props.aggregateOrderDetails.storeIdNames;
    let dataGrid = {
        "idProperty": "rowIndex",
        "columns": [
            {
                "columnName": "Store Id",
                "rowDataKey": "storeId",
                "resizable": true
            },
            {
                "columnName": "Product Id",
                "rowDataKey": "productId",
                "resizable": true
            },
            {
                "columnName": "Name ",
                "rowDataKey": "name",
                "resizable": true
            },
            {
                "columnName": "Quantity",
                "rowDataKey": "qty",
                "resizable": true
            },
            {
                "columnName": "TOID",
                "rowDataKey": "toId",
                "resizable": true
            },
            {
                "columnName": "Status",
                "rowDataKey": "status",
                "resizable": true
            },
            {
                "columnName": "Remarks",
                "rowDataKey": "remarks",
                "resizable": true
            }
        ],
        "groupBy": "storeId"
    }

    let dataSet = [];
    let defaulExpandedGroupIds = [];

    Object.keys(aggregateOrderDetails).forEach(each => {
        let storeWiseDetails = aggregateOrderDetails[each];
        storeWiseDetails.forEach(b => {
            let storeIdName =  each + "[" + storeIdNames[each].name + "]";
            defaulExpandedGroupIds.push(storeIdName);
            dataSet.push({
                "storeId":storeIdName,
                "productId": Validate().isNotEmpty(b.productId) ? b.productId : '',
                "name": Validate().isNotEmpty(b.productName) ? b.productName : '',
                "qty": Validate().isNotEmpty(b.quantity) ? b.quantity : '',
                "toId": Validate().isNotEmpty(b.aggregateToId) && b.aggregateToId !== 0 ? b.aggregateToId : '--',
                "status": 'CREATED' === b.aggregateItemStatus ? '--' : b.aggregateItemStatus,
                "remarks": Validate().isNotEmpty(b.aggregateRemarks) ? b.aggregateRemarks : '--'

            });
        });
    });


    const defaulExpandedGroupIdsMemo = useMemo(() => {
        return defaulExpandedGroupIds;
    },[aggregateOrderDetails])



    return <React.Fragment>
        <div>
            {Validate().isNotEmpty(dataSet) && 
                <DynamicGridHeight metaData={dataGrid} dataSet={dataSet} className="card scroll-grid-on-hover">
                    <CommonDataGrid {...dataGrid} dataSet={dataSet} defaultExpandedGroupIds={defaulExpandedGroupIdsMemo} />
                </DynamicGridHeight>
            }
        </div>
    </React.Fragment>

}
export default AggregateOrderDetails;