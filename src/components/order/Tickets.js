import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import React, { useEffect, useState } from "react";
import OrderHelper from "../../helpers/OrderHelper";
import Validate from "../../helpers/Validate";
import OrderService from "../../services/Order/OrderService";
import NoDataFound from "../Common/NoDataFound";
import DynamicGridHeight from "../Common/DynamicGridHeight";

const Tickets = (props) => {
    const [loading, isLoading] = useState(true);
    const [ticktesDataGrid, setTicketsDataGrid] = useState(undefined);
    const [ticketsDataSet, setTicketsDataSet] = useState(undefined);
    const [ticketsUrl, setTicketsUrl] = useState(undefined);

    useEffect(() => {
        getOrderTicketDetails();
    }, []);

    const getOrderTicketDetails = () => {
        isLoading(true);
        OrderService().getOrderTicketDetails({ orderId: props.orderInfo.displayOrderId, customerId: props.orderInfo.customerId }).then(response => {
            if ("SUCCESS" === response.statusCode && Validate().isNotEmpty(response.dataObject)) {
                setTicketsDataGrid(response.dataObject.dataGrid);
                setTicketsDataSet(response.dataObject.dataSet);
                setTicketsUrl(response.dataObject.ticketsUrl);
            }
        }, err => {
            console.log(err);
        })
        isLoading(false);
    }

    const callBackMapping = {
        'renderticketNumberColumn': (props) => {
            return <a href={ticketsUrl + "?id=" + props.row.ticketId} rel="noreferrer" target={props.row.customerId}>{props.row.ticketNumber}</a>
        },

        'renderStatusColumn': (props) => {
            let statusCellClass = OrderHelper().getBadgeColorClassForStatus(props.row.status) + " badge rounded-pill";
            return <React.Fragment>
                <div className={statusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.status)}</div>
            </React.Fragment>
        }
    }

    return <React.Fragment>{
        loading ? <h4>Loading.....</h4> :
            ticktesDataGrid ? 
            <DynamicGridHeight metaData={ticktesDataGrid} dataSet={ticketsDataSet} className="card scroll-grid-on-hover">
                <CommonDataGrid {...ticktesDataGrid}
                    dataSet={ticketsDataSet} callBackMap={callBackMapping} />
            </DynamicGridHeight>
            : <div className="h-unset" style={{height: `${props.containerHeight}px`}}>
                <NoDataFound text="There are no tickets created yet!" />
                </div>
    }
    </React.Fragment>
}

export default Tickets;