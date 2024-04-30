import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import React, { useState } from "react";
import Validate from "../../../helpers/Validate";
import OrderService from "../../../services/Order/OrderService";


const ExistedReturnRequests = ({ existedReturnRequestsSet, ...props }) => {


    const [returnRequesTrackInfo, setReturnRequestTrackInfo] = useState(undefined);

    const [returnRequestItems, setReturnRequestItems] = useState(undefined);


    const existedReturnRequestsGrid = {

        "idProperty": "requestId",
        "columns": [
            {
                "columnName": "Request Id",
                "rowDataKey": "requestId",
                "customRowRenderingFunction": { name: "renderRequestIdColumn", returnType: "REACT_NODE", type: "FUNCTION" }
            },
            {
                "columnName": "Request From",
                "rowDataKey": "requestFrom"
            },
            {
                "columnName": "Process Type",
                "rowDataKey": "processType"
            },
            {
                "columnName": "Reason",
                "rowDataKey": "reason"
            },
            {
                "columnName": "Comments",
                "rowDataKey": "comments"
            }
        ]
    }

    const returnRequestItemsGrid = {
        "idProperty": "productName",
        "columns": [
            /*  {
                 "columnName": "S.No",
                 "rowDataKey": "sNo",
             }, */
            {
                "columnName": "Product Name",
                "rowDataKey": "productName"
            },
            {
                "columnName": "Pack Size",
                "rowDataKey": "packSize"
            },
            {
                "columnName": "Ordered Qty (In Units)",
                "rowDataKey": "orderedQty"
            },
            {
                "columnName": "Delivered Qty (In Units)",
                "rowDataKey": "deliveredQty"
            },
            {
                "columnName": "Return Qty (In Units)",
                "rowDataKey": "returnQty"
            },
            {
                "columnName": "Picking Qty (In Units)",
                "rowDataKey": "pickingQty"
            },
            {
                "columnName": "Image Url",
                "rowDataKey": "imageUrl"
            }]
    }

    const returnRequestTrackInfoGrid = {
        "idProperty": "requestId",
        "columns": [
            {
                "columnName": "Status",
                "rowDataKey": "status",
            },
            {
                "columnName": "Changed by user",
                "rowDataKey": "createdBy"
            },
            {
                "columnName": "Date Created",
                "rowDataKey": "dateCreated",
                "columnType": "DATE",
                "dateFormatStr": "ISO_DATE_24_TIME",

            }
        ]
    }

    const callBackMapping = {
        "renderRequestIdColumn": (props) => {
            const getReturnRequestDetail = () => {
                OrderService().getReturnRequestDetail({ requestId: props.row.requestId }).then(res => {
                    if ("SUCCESS" === res.statusCode && Validate().isNotEmpty(res.dataObject)) {
                        setReturnRequestItems(res.dataObject.customerReturnRequest.customerReturnRequestItems);
                        setReturnRequestTrackInfo(res.dataObject.customerReturnStatuTrackInfo);
                    }
                }, err => {
                    console.log(err);
                })

            }


            return <React.Fragment>
                <a href="javascript:void(0)" onClick={() => getReturnRequestDetail()}>{props.row.requestId}</a>
            </React.Fragment>;
        }
    }
    return <React.Fragment> <div className="row m-0 p-12">
        <div className="card rounded-0 mb-3 px-0"  style={{"height":"25vh"}}>
        <CommonDataGrid  {...existedReturnRequestsGrid}
            dataSet={existedReturnRequestsSet}
            callBackMap={callBackMapping} />
        </div>

        {returnRequestItems && <React.Fragment><p className="custom-fieldset mb-2 px-0">Return Request Details</p> 
        <div className="card rounded-0 mb-3 px-0" style={{"height":"25vh"}}>
            
            <CommonDataGrid  {...returnRequestItemsGrid}
            dataSet={returnRequestItems}
            callBackMap={callBackMapping} />
            </div> 
            </React.Fragment>}

        {returnRequesTrackInfo &&<React.Fragment> <p className="custom-fieldset mb-2 px-0">Return Shipment Track Info</p> <div className="card rounded-0 px-0" style={{"height":"25vh"}}>
           
            <CommonDataGrid  {...returnRequestTrackInfoGrid}
            dataSet={returnRequesTrackInfo}
            callBackMap={callBackMapping} />
            </div>
            </React.Fragment>}
    </div> </React.Fragment>
}
export default ExistedReturnRequests;