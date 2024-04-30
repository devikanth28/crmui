import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import { Button } from "react-bootstrap";
import Validate from "../../helpers/Validate";
import CloseIcon from '../../images/cross.svg';
import OrderService from "../../services/Order/OrderService";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import { AlertContext } from "../Contexts/UserContext";
import { UncontrolledTooltip } from "reactstrap";
import DynamicGridHeight from "../Common/DynamicGridHeight";

const EditOrderModel = (props) => {

    const [loading, isLoading] = useState(false);
    const [tableData, setTableData] = useState(undefined);
    const [orderDetails, setOrderDetails] = useState([]);
    const [editedQtyMapTemp, setEditedQtyMap] = useState({});
    const [order, setOrder] = useState({});
    const [qtyMap, setQtyMap] = useState({});
    const [productIdMap, setProductIdMap] = useState({});
    const headerRef = useRef(0);
    const { setStackedToastContent } = useContext(AlertContext);

    useEffect(() => {
        getOrderDetailsForEdit();
    }, []);

    const getOrderDetailsForEdit = async () => {
        isLoading(true);
        await OrderService().getOrderDetailsForEdit({ "orderId": props.orderId }).then((response) => {
            if ("SUCCESS" === response.statusCode && Validate().isNotEmpty(response.dataObject)) {
                setTableData(response.dataObject.dataGrid);
                setOrderDetails(response.dataObject.dataSet);
                setOrder(response.dataObject.omsOrder);
                let qtyMap = {};
                response.dataObject.dataSet.forEach((each) => {
                    qtyMap[each.sNo] = each.quantity;
                    productIdMap[each.sNo] = each.productId
                })
                setQtyMap(qtyMap);
                setEditedQtyMap(qtyMap);
            } else {
                setStackedToastContent({ toastMessage: response.message });
                toggle();
            }
        }, (err) => {
            console.log(err);
        })
        isLoading(false);
    }
    const callBackMapping = {
        'renderEditedQuantityColumn': (props) => {
            const bindQty = (e) => {
                if (Validate().isNotEmpty(e.target.value)) {
                    setEditedQtyMap({ ...editedQtyMapTemp, [props.row.sNo]: e.target.value * props.row.packSize });
                } else {
                    setEditedQtyMap({ ...editedQtyMapTemp, [props.row.sNo]: e.target.value });
                }
            }
            return <React.Fragment>
                <input id={"product_" + props.row.productId} className="editor-cell form-control p-0 text-end" type="number" min={0} max={props.row.editedQuantity / props.row.packSize} name="eQty" value={editedQtyMapTemp[props.row.sNo] > 0 ? editedQtyMapTemp[props.row.sNo] / props.row.packSize : editedQtyMapTemp[props.row.sNo]} onKeyDown={(e) => e.stopPropagation()} onChange={(e) => bindQty(e)}></input>
                <UncontrolledTooltip placement="bottom" target={"product_" + props.row.productId}>
                    proposed quantity is {qtyMap[props.row.sNo] > 0 ? qtyMap[props.row.sNo] / props.row.packSize : qtyMap[props.row.sNo]}
                </UncontrolledTooltip>
            </React.Fragment>
        }
    }

    const validateEntries = () => {
        let valuesApproved = true;
        Object.keys(qtyMap).forEach((each) => {
            if (valuesApproved && (Validate().isEmpty(editedQtyMapTemp[each]) || editedQtyMapTemp[each] < 0)) {
                setStackedToastContent({ toastMessage: "Invalid Qty for Product Id: " + productIdMap[each] });
                valuesApproved = false;
            }
            if (valuesApproved && editedQtyMapTemp[each] > qtyMap[each]) {
                setStackedToastContent({ toastMessage: "Edited Quantity Should be less than Proposed Quantity for Product Id: " + productIdMap[each] });
                valuesApproved = false;
            }
        })
        return valuesApproved;
    }

    const approveEditOrder = async () => {
        if (validateEntries()) {
            let editedProductQtyMap = {};
            let isQtyChanged = false;
            Object.keys(qtyMap).forEach((each) => {
                if (qtyMap[each] !== editedQtyMapTemp[each]) {
                    isQtyChanged = true;
                    editedProductQtyMap[each] = editedQtyMapTemp[each];
                } else { //quantity is not been modified
                    editedProductQtyMap[each] = qtyMap[each];
                }
            })
            if (!isQtyChanged) {
                setStackedToastContent({ toastMessage: "There are no Changes to Submit, Please Check" });
                return false;
            }

            isLoading(true);
            await OrderService().approveEditedOrder({ "editedQtyMap": JSON.stringify(editedProductQtyMap), "orderId": props.orderId }).then(response => {
                if (Validate().isNotEmpty(response.dataObject) && Validate().isNotEmpty(response.dataObject.editedStatus)) {
                    if ("SUCCESS" === response.dataObject.editedStatus || "success" === response.dataObject.editedStatus) {
                        setStackedToastContent({ toastMessage: "Your OrderId " + order.displayOrderId + "  Edited  Successfully" });
                        setTimeout(() => {
                            OrderService().getOrderNewDataset({ "orderId": props.orderId }).then(response => {
                                if (Validate().isNotEmpty(response.dataObject) && Validate().isNotEmpty(response.dataObject.dataSetrow)) {
                                    let temp = [...props.dataSet];
                                    props.dataSet.forEach((element, index) => {
                                        if (element.orderId === props.orderId) {
                                            temp[index] = response.dataObject.dataSetrow;
                                        }
                                    });
                                    props.setDataSet(temp);
                                    if (Validate().isNotEmpty(response.dataObject.dataSetrow.claimedBy) && response.dataObject.dataSetrow.claimedBy == 'S') {
                                        props.setClaimedDataSet(props.claimedDataSet.map(eachRecord => {
                                            if (eachRecord.orderId == props.orderId) {
                                                return response.dataObject.dataSetrow;
                                            }
                                            return eachRecord;
                                        }));
                                    }
                                }
                            }, err => {
                                console.log(err);
                            })
                        }, 1500);
                        toggle();
                        Object.keys(productIdMap).forEach((each, index) => {
                            if (orderDetails[index].productId === productIdMap[each] && orderDetails[index].editedQuantity !== editedQtyMapTemp[each]) {
                                orderDetails[index].editedQuantity = editedQtyMapTemp[each];
                                qtyMap[orderDetails[index].sNo] = editedQtyMapTemp[each];
                            }
                        });
                    } else if ("FAILURE" === response.dataObject.editedStatus) {
                        setStackedToastContent({ toastMessage: "Failed to Edit OrderId " + order.displayOrderId });
                    } else {
                        setStackedToastContent({ toastMessage: response.dataObject.editedStatus + ", Please Try Again!" });
                    }
                } else {
                    setStackedToastContent({ toastMessage: "Failed to Edit OrderId " + order.displayOrderId });
                }
            }, err => {
                console.log(err);
            })
            isLoading(false);
        }
    }

    const toggle = () => props.setOpenModal(!props.openModal);

    return (
        <React.Fragment>
            <div isOpen={(props.openModal)} className="custom-modal header">
                {!tableData && loading &&
                    <div className="body-height d-flex justify-content-center">
                        <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner"} animation="border" variant="brand" />
                    </div>
                }
                {tableData &&
                    <Wrapper className="m-0">
                        <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-1">
                            <p className="mb-0"><span className="hide-on-mobile">Edit Order - </span><strong>{order.displayOrderId}<span className="hide-on-mobile">({order.orderId})</span></strong></p>
                            <div class=" d-flex align-items-center">
                                <Button variant=" " onClick={() => toggle()} className="rounded-5 icon-hover btn-link">
                                <span className='custom-close-btn icon-hover'></span>
                                </Button>
                            </div>
                        </HeaderComponent>
                        <BodyComponent allRefs={{ headerRef }} className="body-height">
                            {tableData &&
                                <div className="card">
                                    {/* <div className="mb-3">Your order ID - <strong>{order.displayOrderId}({order.orderId})</strong></div> */}
                                    <div className="card-body p-12">
                                        <DynamicGridHeight id="edit-order-datagrid" className={'card'} metaData={tableData} dataSet={orderDetails} >
                                            <CommonDataGrid  {...tableData}
                                                dataSet={orderDetails}
                                                callBackMap={callBackMapping}
                                            />
                                        </DynamicGridHeight>
                                    </div>
                                    <div className="card-footer bg-white">
                                        <Button variant=" " className="btn-brand float-end" onClick={() => approveEditOrder()}>{loading ? <CustomSpinners spinnerText={"Submit"} className={" spinner-position"} innerClass={"invisible"} /> : "Submit"}</Button>
                                    </div>
                                </div>
                            }
                        </BodyComponent>
                    </Wrapper>
                }
            </div>
        </React.Fragment>
    )
}

export default EditOrderModel;