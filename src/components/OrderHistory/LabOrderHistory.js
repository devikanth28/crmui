import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import React, { useContext, useEffect, useState } from "react";
import Validate from "../../helpers/Validate";
import LabOrderService from "../../services/LabOrder/LabOrderService";
import { BodyComponent } from "../Common/CommonStructure";
import { AlertContext, CustomerContext } from '../Contexts/UserContext';
import dateFormat from 'dateformat';
import LabOrderDetailModal from '../labOrders/labOrderModal/LabOrderDetailModal';
import ButtonWithSpinner from '../Common/ButtonWithSpinner';
import OrderHelper from '../../helpers/OrderHelper';

const LabOrderHistory = props => {

    const [dataGrid, setDataGrid] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const [labOrders, setLabOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showLabOrderInfo, setShowLabOrderInfo] = useState(false);
    const [labOrder, setLabOrder] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [openOrderDetailModal, setOpenOrderDetailModal] = useState(false);
    const { setStackedToastContent } = useContext(AlertContext);
    const validate = Validate();
    const [disableMode, setDisableMode] = useState(false);
    const [disableSendPaymentLinkBtn, setDisableSendPaymentLinkBtn] = useState(false);

    const { customerId } = useContext(CustomerContext)

    useEffect(() => {
        getLabOrderHistory();
    }, [props.fromDate, props.toDate]);

    const defaultCriteria = {
        minLimit: 0,
        limit: 10,
        fromDate: Validate().isNotEmpty(props.fromDate) ? props.fromDate : dateFormat(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 'yyyy-mm-dd 00:00:00'),
        toDate: Validate().isNotEmpty(props.toDate) ? props.toDate : dateFormat(new Date(), 'yyyy-mm-dd 23:59:59'),
        customerId: customerId,
    }

    const displayLabOrderInfo = (orderId) => {
        setShowLabOrderInfo(true);
        var index = labOrders.map(labOrder => labOrder.displayOrderId).indexOf(orderId);
        setSelectedOrderId(orderId);
        setOpenOrderDetailModal(true);
        setLabOrder(labOrders[index]);
    }

    const reOrder = () => {
        /* need to call Re-Order Lab Modal based on flag */
        props.handleReOrderModal(true)
    }

    const sendPaymentLink = async (orderId, displayOrderId) => {
        setDisableSendPaymentLinkBtn(true);
        await LabOrderService().sendPaymentLinkToCustomer({ orderId: orderId, customerId: customerId, displayOrderId: displayOrderId }).then(res => {
            //console.log((validate.isNotEmpty(res) && validate.isNotEmpty(res.dataObject) && validate.isNotEmpty(res.statusCode) && "SUCCESS" == res.statusCode) ? res.dataObject : "Unable to process request, Please try again!")
            setStackedToastContent({ toastMessage: (validate.isNotEmpty(res) && validate.isNotEmpty(res.dataObject) && validate.isNotEmpty(res.statusCode) && "SUCCESS" == res.statusCode) ? res.dataObject : "Unable to process request, Please try again!" });
            setDisableSendPaymentLinkBtn(false);
        }).catch(function (error) {
            console.log(error);
            setDisableSendPaymentLinkBtn(false);
            setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" })
        })
    }

    const renderActionColumn = (props) => {
        const { row } = props;
        return (
            <React.Fragment>
                {/* {row?.actionColumn?.ViewButton && row?.displayOrderId && <span style={{ "cursor": "pointer", "color": "blue", "text-decoration": "underline" }} onClick = {() => displayLabOrderInfo(row.displayOrderId)} >{row.actionColumn.ViewButton} | </span> } */}
                {row?.actionColumn?.ReOrderButton && <a className="btn btn-sm btn-link w-100 text-start" onClick={reOrder} href="javascript:void(0)" rel="noopener" aria-label={row.customerId} role="link" title="View Order details" id={row.displayableId}>{row.actionColumn.ReOrderButton} </a>}
                {row?.actionColumn?.SendPaymentLinkButton && <ButtonWithSpinner variant=" " showSpinner={disableSendPaymentLinkBtn} className={`${"px-2 btn btn-link"}`} onClick={() => sendPaymentLink(row.orderId, row.displayOrderId)} buttonText={row.actionColumn.SendPaymentLinkButton} />}
            </React.Fragment>
        )
    }

    const callBackMapping = {
        "renderActionColumn": renderActionColumn,

        "status":(props)=>{
            const {row} = props;
            let statusCellClass = OrderHelper().getBadgeColorClassForStatus(row.status) + " badge rounded-pill";
            return <React.Fragment>
                <div className={statusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(row.status)}</div>
            </React.Fragment>
        },

        "renderOrderIdColumn": (props) => {
            const { row } = props;
            return <React.Fragment>
                <a className="btn btn-sm btn-link w-100 text-start" onClick={() => displayLabOrderInfo(row.displayOrderId)} href="javascript:void(0)" rel="noopener" aria-label={row.customerId} role="link" title="View Order details" id={row.displayableId}>{row.displayOrderId}</a>
            </React.Fragment>
        },
        "dateCreated": (props) => {
            const { row } = props;
            return <React.Fragment>
                <span>{dateFormat(row.dateCreated.dateCreated, 'yyyy-mm-dd 23:59:59')}</span>
            </React.Fragment>
        },
    }

    const remoteDataFunction = async ({ startIndex, limit, sortColumns, filters }) => {

    }

    const getLabOrderHistory = async () => {
        props.setDisableMode(true);
        setLoading(true);
        await LabOrderService().getLabOrderHistory(defaultCriteria).then(res => {
            if (validate.isNotEmpty(res) && validate.isNotEmpty(res.dataObject) && validate.isNotEmpty(res.statusCode) && "SUCCESS" == res.statusCode) {
                setDataGrid(res.dataObject.dataGrid);
                setDataSet(res.dataObject.dataSet);
                setLabOrders(res.dataObject.labOrderSearch.labOrders);
            }
            else {
                setStackedToastContent({ toastMessage: res.message })
            }
            setLoading(false);
            props.setDisableMode(false);
        }).catch(function (error) {
            console.log(error);
            setLoading(false);
            setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" })
            props.setDisableMode(false);
        })
    }

    return (
        <React.Fragment>
            <BodyComponent loading={loading} className="body-height h-100" >
                {!loading && dataGrid && 
                    <div className='card h-100'>
                        <CommonDataGrid {...dataGrid} dataSet={dataSet}
                            selectedRows={selectedRows}
                            onRowSelectionCallback={setSelectedRows}
                            callBackMap={callBackMapping}
                            remoteDataFunction={remoteDataFunction}
                        />
                    </div>
                }
                {openOrderDetailModal && <LabOrderDetailModal orderId={selectedOrderId} setSelectedOrderId={setSelectedOrderId} showOrderDeatilsModal={openOrderDetailModal} setShowOrderDeatilsModal={setOpenOrderDetailModal} customerId={customerId} disableMode={disableMode} setDisableMode={setDisableMode} handleOrderDetailsModal={() => setOpenOrderDetailModal(!openOrderDetailModal)} />}
            </BodyComponent>
        </React.Fragment>
    )
}

export default LabOrderHistory;