import React, { useContext, useEffect, useState } from "react";
import CustomerService from "../../services/Customer/CustomerService";
import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import { BodyComponent } from "../Common/CommonStructure";
import Validate from "../../helpers/Validate";
import PrescriptionLightBox from "./PrescriptionLightBox";
import dateFormat from 'dateformat';
import { CustomerContext } from "../Contexts/UserContext";
import { Button} from 'react-bootstrap';
import { UncontrolledTooltip } from 'reactstrap';
import PrepareOrderDetails from "../order/PrepareOrderDetails";
import OrderHelper from "../../helpers/OrderHelper";
const OrderHistory = (props) => {

    const { customerId } = useContext(CustomerContext);

    const handelModelToggle = props.handleSetOpenReorderModal;
    const defaultCriteria = {
        minLimit: 0,
        limit: 10,
        fromDate: Validate().isNotEmpty(props.fromDate) ? props.fromDate : dateFormat(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 'yyyy-mm-dd 00:00:00'),
        toDate: Validate().isNotEmpty(props.toDate) ? props.toDate : dateFormat(new Date(), 'yyyy-mm-dd 23:59:59'),
        customerId: customerId
    }

    const customerService = CustomerService();
    const [loading, setLoading] = useState(true);
    const [dataGrid, setDataGrid] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLightBoxOpen, setLightBoxOpen] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [openOrderDetailModal, setOpenOrderDetailModal] = useState(false);

    useEffect(() => {
        getCustomerOrderHistory();
    }, [props.fromDate, props.toDate]);

    const getCustomerOrderHistory = () => {
        setLoading(true);
        customerService.getCustomerOrderHistory(defaultCriteria).then((response) => {
            if (response.statusCode === "SUCCESS") {
                setDataGrid(response.dataObject.dataGrid);
                setDataSet(response.dataObject.dataSet);
            }
        }).catch(err => {
            console.log(err);
            setLoading(false);
        })
        setLoading(false);
    }

    const remoteDataFunction = async ({ startIndex, limit, sortColumns, filters }) => {

    }

    const openModal = (eachOrder) => {
        switch(eachOrder.name){
            case "Prescription ID" : {
                setSelectedId(eachOrder.displayableId);
                setLightBoxOpen(true);
                break;
            }
            case "Order ID": {
                setSelectedId(eachOrder.orderId);
                setOpenOrderDetailModal(true);
            }

        }
    }

    const callBackMapping = {
        "orderId": (props) => {
            const { row } = props;
            return <React.Fragment>
                {/* <small>{row.displayableOrderId.name} :</small>&nbsp; */}
                <a className="btn btn-sm btn-link w-100 text-start" onClick={() => openModal(row.displayableOrderId)} href="javascript:void(0)" rel="noopener" aria-label={row.customerId} role="link" title="View Order details" id={row.displayableOrderId.displayableId}>{row.displayableOrderId.displayableId}{row?.displayableOrderId?.orderId && row.displayableOrderId.orderId}</a>
                {/* <span style={{ "cursor": "pointer", "color": "blue"}} onClick={() => openModal(row.displayableOrderId)}>{row.displayableOrderId.displayableId}</span> &nbsp;
                {row?.displayableOrderId?.orderId && <span style={{ "cursor": "pointer", "color": "blue", "text-decoration": "underline" }}>{row.displayableOrderId.orderId}</span>} */}

            </React.Fragment>
        },
        "status":(props) => {
            const {row} =props;
            console.log(row.status);
            let statusCellClass = OrderHelper().getBadgeColorClassForStatus(row.status) + " badge rounded-pill";
        return <React.Fragment>
            <div className={statusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(row.status)}</div>
        </React.Fragment>
        },
        "dateCreated": (props) => {
            const { row } = props;
            return <React.Fragment>
                <span>{dateFormat(row.dateCreated.dateCreated, 'yyyy-mm-dd 23:59:59')}</span> &nbsp;
                <small>{row?.dateCreated?.modifiedName && row.dateCreated.modifiedName}</small>&nbsp;
                <span>{row?.dateCreated?.modifiedDate && row.dateCreated.modifiedDate}</span> &nbsp;

            </React.Fragment>
        },
        "action": (props) => {
            const { row } = props;
            if (row?.actionColumn?.firstButton == "--" && row?.actionColumn?.secondButton == "--") {
                return <React.Fragment>
                    <span>--</span> &nbsp;
                </React.Fragment>
            }
            return <React.Fragment>
                {row?.actionColumn?.firstButton && <Button id="track-order" variant=' ' className='btn-link icon-hover p-1 mx-1' onClick={() => { alert("hello") }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <g id="track-status-icn-16" transform="translate(-180.258 -387.452)">
                            <rect id="Rectangle_3299" data-name="Rectangle 3299" width="16" height="16" rx="3" transform="translate(180.258 387.452)" fill="none" />
                            <g id="track-status-icn" transform="translate(177.052 384.245)">
                                <path id="Path_52083" data-name="Path 52083" d="M42.707,18.107a.4.4,0,0,1,.4-.4,4.133,4.133,0,0,1,4.134,4.134.4.4,0,1,1-.8,0,3.334,3.334,0,0,0-3.334-3.334A.4.4,0,0,1,42.707,18.107Z" transform="translate(-32.7 -10.9)" fill="#080808" fill-rule="evenodd" />
                                <path id="Path_52084" data-name="Path 52084" d="M55.207,60.841a1.467,1.467,0,0,1,1.467-1.466h2.133a1.467,1.467,0,0,1,1.467,1.466v2.134a1.467,1.467,0,0,1-1.467,1.466H56.674a1.467,1.467,0,0,1-1.467-1.466Zm1.467-.666a.667.667,0,0,0-.667.666v2.134a.667.667,0,0,0,.667.666h2.133a.667.667,0,0,0,.667-.666V60.841a.667.667,0,0,0-.667-.666Z" transform="translate(-43.6 -47.234)" fill="#080808" fill-rule="evenodd" />
                                <path id="Path_52085" data-name="Path 52085" d="M67.707,68.107a.4.4,0,0,1,.4-.4h1.067a.4.4,0,0,1,0,.8H68.107A.4.4,0,0,1,67.707,68.107Z" transform="translate(-54.5 -54.5)" fill="#080808" fill-rule="evenodd" />
                                <path id="Path_52086" data-name="Path 52086" d="M13.943,51.043a.4.4,0,0,1,.4.4,3.333,3.333,0,0,0,3.333,3.333.4.4,0,1,1,0,.8,4.133,4.133,0,0,1-4.133-4.133A.4.4,0,0,1,13.943,51.043Z" transform="translate(-7.269 -39.969)" fill="#080808" fill-rule="evenodd" />
                                <path id="Path_52087" data-name="Path 52087" d="M7.207,6.007a1.2,1.2,0,0,0-1.2,1.2,1.061,1.061,0,0,0,.095.367,3.9,3.9,0,0,0,.279.537,10.262,10.262,0,0,0,.756,1.057.087.087,0,0,0,.142,0,10.337,10.337,0,0,0,.756-1.057,3.9,3.9,0,0,0,.279-.537,1.057,1.057,0,0,0,.094-.367,1.2,1.2,0,0,0-1.2-1.2Zm-2,1.2a2,2,0,1,1,4,0,1.814,1.814,0,0,1-.153.668,4.709,4.709,0,0,1-.336.651A11.062,11.062,0,0,1,7.9,9.67a.887.887,0,0,1-1.388,0A11.065,11.065,0,0,1,5.7,8.526a4.655,4.655,0,0,1-.336-.651,1.815,1.815,0,0,1-.153-.668Z" fill="#080808" fill-rule="evenodd" />
                            </g>
                        </g>
                    </svg>
                    </Button>}
                    <UncontrolledTooltip placement='bottom' target="track-order">
                                            Track Order
                                        </UncontrolledTooltip>
                {row?.actionColumn?.secondButton  && <span style={{ "cursor": "pointer", "color": "blue", "text-decoration": "underline" }} onClick={()=>{handelModelToggle(true)}}>reorder</span>}
            </React.Fragment>
        }
    }

    return (
        <React.Fragment>
            <BodyComponent className="body-height h-100" loading={loading}>
                {!loading && dataGrid && !openOrderDetailModal && 
                    <div className="card h-100">
                        <CommonDataGrid {...dataGrid} dataSet={dataSet} remoteDataFunction={remoteDataFunction} selectedRows={selectedRows} onRowSelectionCallback={setSelectedRows} callBackMap={callBackMapping} />
                    </div>
                }
                {openOrderDetailModal && <PrepareOrderDetails orderId={selectedId} setDataSet={setDataSet} dataSet={dataSet} openOrderDetailModal={openOrderDetailModal} setOpenOrderDetailModal={setOpenOrderDetailModal} customerId={defaultCriteria.customerId}/>}
                {isLightBoxOpen && <PrescriptionLightBox selectedId={selectedId} isLightBoxOpen={isLightBoxOpen} setLightBoxOpen={setLightBoxOpen}/>}
            </BodyComponent>
        </React.Fragment>
    )

}

export default OrderHistory;