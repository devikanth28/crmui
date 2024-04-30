import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import React, { useEffect, useState } from "react";
import Validate from "../../helpers/Validate";
import OrderService from "../../services/Order/OrderService";
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import DynamicGridHeight from "../Common/DynamicGridHeight";
const TrackOrder = (props) => {

    const [trackOrderDataGrid, setTrackOrderDataGrid] = useState(undefined);
    const [trackOrderDataSet, setTrackOrderDataSet] = useState([]);
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        getOrderDispatchDetails();
    }, []);

    const getOrderDispatchDetails = () => {
        isLoading(true);
        OrderService().getOrderDispatchDetails({ "orderId": props.orderId }).then((response) => {
            if ("SUCCESS" === response.statusCode && Validate().isNotEmpty(response.dataObject)) {
                setTrackOrderDataGrid(response.dataObject.dataGrid);
                setTrackOrderDataSet(response.dataObject.dataSet);
            }
            isLoading(false);
        }, err => {
            console.log(err);
        })
    }

    return <React.Fragment>
        {loading ? <div className="d-flex justify-content-center">
                    <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner"} animation="border" variant="brand" />
                </div> : 
            <div className="card scroll-grid-on-hover max100vh" style={{height: `${props.containerHeight}px`}}>
                <CommonDataGrid
                    {...trackOrderDataGrid}
                    dataSet={trackOrderDataSet}
                    defaultExpandedGroupIds ={['APPROVAL','PROCESSING','DISPATCH','DELIVERY']}
                     /></div>}
    </React.Fragment>
}

export default TrackOrder;