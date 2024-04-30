import CommonDataGrid, { SelectEditor } from "@medplus/react-common-components/DataGrid";
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import React, { createRef, useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Validate from "../../../helpers/Validate";
import OrderService from "../../../services/Order/OrderService";
import { AlertContext } from "../../Contexts/UserContext";
import AddWrongProductsForm from "./AddWrongProductsForm";
import ExistedReturnRequests from "./ExistedReturnRequests";
import DynamicGridHeight from "../../Common/DynamicGridHeight";


const ReturnRequests = (props) => {
    const [existedReturnRequestsLoading, setExistedReturnRequestsLoading] = useState(false);
    const [existedReturnRequestsSet, setExistedReturnRequestsSet] = useState(undefined);
    const [returnRequestForOrderloading, setReturnRequestForOrderloading] = useState(false);
    const [returnRequestForOrderSet, setReturnRequestForOrderSet] = useState(undefined);
    const [returnRequestForOrderGrid, setReturnRequestForOrderGrid] = useState(undefined);

    const [reasonTypes, setReasonTypes] = useState(undefined);
    const [productNameMap, setProductNameMap] = useState({});
    const [custStateCode, setCustStateCode] = useState(undefined);
    const [createdTicketNos, setCreatedTicketNos] = useState(undefined);
    const [returnRequestForOrderResponseEmpty, setReturnRequestForOrderResponseEmpty] = useState(false);


    const [editedRows, setEditedRows] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const selectFiles = useRef([]);
    const [returnProductImages, setReturnProductImages] = useState({});
    const [isWrongProduct, setWrongProduct] = useState(false);
    const [wrongProducts, setWrongProducts] = useState({});
    const { setStackedToastContent } = useContext(AlertContext);

    useEffect(() => {
        getCustomerReturnRequests({ displayOrderId: props.orderInfo.displayOrderId });
    }, [])

    const onSelectRow = (selectedRows) => {
        setSelectedRows(selectedRows);
        setWrongProductFlag(selectedRows);
    }

    const setWrongProductFlag = (selectedRows, indexToBeExcluded) => {
        setWrongProduct(false);
        selectedRows.every((each) => {
            if (each !== indexToBeExcluded && editedRows[each] && "W" === editedRows[each].reason) {
                setWrongProduct(true);
                return false;
            }
            return true;
        })
    }
    const getCustomerReturnRequests = (obj) => {
        setExistedReturnRequestsLoading(true);
        OrderService().getCustomerReturnRequests(obj).then(response => {
            if ("SUCCESS" === response.statusCode && Validate().isNotEmpty(response.dataObject)) {
                setReasonTypes(response.dataObject.reasonTypes);
                if (Validate().isNotEmpty(response.dataObject.customerReturnResponse)) {
                    setExistedReturnRequestsSet(getExistedReturnRequestsSet(response.dataObject.customerReturnResponse.customerReturnRequests, response.dataObject.reasonTypes));
                }
                setExistedReturnRequestsLoading(false);
            }
        }, error => {
            console.log(error);
        })

    }

    function getExistedReturnRequestsSet(returnRequests, reasonTypes) {
        let dataSet = [];
        returnRequests.forEach(customerReturnRequest => {
            dataSet.push({
                "requestId": customerReturnRequest.requestId,
                "requestFrom": Validate().isNotEmpty(customerReturnRequest.vertical) ? customerReturnRequest.vertical : '--',
                "processType": Validate().isNotEmpty(customerReturnRequest.processType) ? customerReturnRequest.processType : '--',
                "reason": Validate().isNotEmpty(customerReturnRequest.reasonType) ? reasonTypes[customerReturnRequest.reasonType] : '--',
                "comments": Validate().isNotEmpty(customerReturnRequest.comments) ? customerReturnRequest.comments : '--',

            });
        })
        return dataSet;
    }

    const getReturnRequestForOrder = (props) => {
        setReturnRequestForOrderloading(true);
        OrderService().getReturnRequestForOrder({ orderId: props.orderInfo.displayOrderId, customerId: props.orderInfo.customerId }).then(res => {
            if ("SUCCESS" === res.statusCode && Validate().isNotEmpty(res.dataObject)) {
                setReturnRequestForOrderGrid(res.dataObject.dataGrid);
                setReturnRequestForOrderSet(res.dataObject.dataSet);
                res.dataObject.dataSet && res.dataObject.dataSet.forEach((item) => {
                    selectFiles[item.rowIndex] = createRef();
                    item['action'] = "R";
                })
                setProductNameMap(res.dataObject.productNameMap);
                setCustStateCode(res.dataObject.custStateCode);
                setReturnRequestForOrderResponseEmpty(false);
            }else{
                setReturnRequestForOrderResponseEmpty(true);
            }
            setReturnRequestForOrderloading(false);

        }, err => {
            console.log(err);
        })
    }

    const callBackMapping = {
        "renderReturnQuantityColumn": (props) => {
            const bindValue = (e) => {
                props.onRowChange({ ...props.row, [props.column.key]: e.target.value }, true)
            }

            return <React.Fragment>
                <input type="number" min={0} max={props.row.orderedQty} name="returnQty" value={props.row.returnQty} onKeyDown={(e) => e.stopPropagation()} onChange={(e) => bindValue(e)}></input>
            </React.Fragment>
        },
        "renderReasonColumn": (props) => {
            const onValueChange = (value) => {
                props.onRowChange({ ...props.row, [props.column.key]: value }, true);
                if (selectedRows.includes(props.row.rowIndex) && "W" === value) {
                    setWrongProduct(true);
                } else {
                    setWrongProductFlag(selectedRows, props.row.rowIndex);
                }
            }
            return <SelectEditor selectedValue={props.row.reason} onValueChange={onValueChange} itemsMap={{ "": "select reason", ...reasonTypes }} />
        },
        "renderImageColumn": (props) => {
            const clickAddImage = (e) => {
                e.preventDefault();
                selectFiles[props.row.rowIndex].current.click();
            }
            const uploadFiles = (event) => {
                var files = event.target.files;
                var numberOfFiles = files.length;
                if (numberOfFiles > 1) {
                    setStackedToastContent({toastMessage:"You can not upload more then 1 images!"})
                    return false;
                }
                for (var i = 0; i < numberOfFiles; i++) {
                    if (files[i].type !== "image/jpeg" && files[i].type !== "image/png") {
                        setStackedToastContent({toastMessage:"Only JPG, JPEG and PNG types are accepted"})
                        return false;
                    }
                }
                setReturnProductImages({ ...returnProductImages, [props.row.productId]: files[0] });
            }
            const removeReturnRequestImageFile = () => {
                let errorMap = { ...returnProductImages };
                delete errorMap[props.row.productId];
                setReturnProductImages(errorMap)
            }
            return <React.Fragment>
                <input type="file" id={`file_${props.row.productId}`} name="returnProductImages" accept="image/*,application/pdf" ref={selectFiles[props.row.rowIndex]} onClick={(e) => e.target.value = null} onChange={event => uploadFiles(event)} hidden />
                <button type="button" onClick={event => clickAddImage(event)}>Upload</button>
                {returnProductImages && returnProductImages[props.row.productId] && <span>{returnProductImages[props.row.productId].name} <button onClick={() => removeReturnRequestImageFile()}>X</button></span>}

            </React.Fragment>
        },
        "renderActionColumn": (props) => {
            return <React.Fragment><input type="radio" defaultChecked value="R" name={`Return and Refund ${props.row.rowIndex}`} /><label>Return and Refund</label></React.Fragment>
        }
    }

    const onEdit = (props) => {
        setEditedRows({ ...editedRows, [props.row.rowIndex]: props.row });
        return { status: "SUCCESS", data: props.row }
    }
    var returnProcessType = {};
    returnProcessType["X"] = "RETURN_AND_REPLACEMENT";
    returnProcessType["R"] = "RETURN_AND_REFUND";

    const validateDetails = (selectedEditedRows) => {
        let errMsg = "";
        let validDetails = false;
        {
            Validate().isEmpty(selectedEditedRows)
                ? errMsg = "Selected rows have not been modified to submit"
                : validDetails = selectedEditedRows.every((each) => {
                    var rQty = parseInt(each.returnQty);
                    var dQty = parseInt(each.deliveredQty);
                    var oQty = parseInt(each.orderedQty);
                    var reason = each.reason;
                    if (Validate().isEmpty(reason)) {
                        errMsg = "Please select Reason for: " + productNameMap[each.productId];
                        return false;
                    }
                    if(isNaN(rQty)){
                        errMsg = "Return quantity is Empty for: " + productNameMap[each.productId];
                        return false;
                    }
                    if (Validate().isEmpty(rQty) || rQty === 0) {
                        errMsg = "Return quantity should be greater than 0 for: " + productNameMap[each.productId];
                        return false;
                    }
                    if (reason === "O" && (rQty !== dQty)) {
                        if (Validate().isEmpty(dQty) || dQty === "0") {
                            errMsg = "Delivery quantity should be greater than 0 for " + productNameMap[each.productId];
                            return false;
                        } else if (rQty !== dQty) {
                            errMsg = "Delivered and Return quantity should be same for: " + productNameMap[each.productId];
                            return false;
                        }
                    }
                    if (rQty > oQty) {
                        errMsg = "Return quantity should be less than or equal to Ordered quantity for: " + productNameMap[each.productId];
                        return false;
                    }
                    return true;
                });
        }
        return { "errMsg": errMsg, "validDetails": validDetails };
    }

    const submitReturnRequest = async () => {
        if (isWrongProduct && Object.keys(wrongProducts).length === 0) {
            setStackedToastContent({toastMessage:"Please enter wrong product details"})
            return false;
        }
        if (Validate().isEmpty(selectedRows)) {
            setStackedToastContent({toastMessage:"Select products to create Return ticket"})
            return false;
        }
        let selectedEditedRows = Object.values(editedRows).filter((each) => selectedRows.includes(each.rowIndex));
        let errMap = validateDetails(selectedEditedRows);
        if (!errMap.validDetails) {
            setStackedToastContent({toastMessage:errMap.errMsg})
            return;
        } else {
            var ticketsList = [];
            var productImageMap = {};
            var description = "data:text/html,";
            description += " <ul>";
            var reasonMap = {};
            selectedEditedRows.forEach((each) => {
                var desc = "<li>";
                desc += each.productId + '&nbsp; ';
                desc += productNameMap[each.productId] + '&nbsp; ';
                desc += 'Pack Size:' + each.packSize + '&nbsp; ';
                desc += 'Ordered Qty(in units):' + each.orderedQty * each.packSize + ' &nbsp; ';
                desc += 'Delivered Qty(in units):' + each.deliveredQty * each.packSize + ' &nbsp; ';
                desc += 'Returned Qty(in units):' + each.returnQty * each.packSize + ' &nbsp; ';
                desc += 'User Expectation:' + returnProcessType[each.action] + '&nbsp; ';
                desc += '<b>' + reasonTypes[each.reason] + '</b>';
                desc += "</li>";
                if (Validate().isEmpty(reasonMap[each.reason])) {
                    reasonMap[each.reason] = description + desc;
                } else {
                    reasonMap[each.reason] = reasonMap[each.reason] + "," + desc;
                }
                productImageMap[each.productId] = {};
            });

            if (Object.keys(returnProductImages) > 0) {
                await OrderService().uploadFilesToImageServer(Object.values(returnProductImages), "T", {}).then(response => {
                    if (Validate().isNotEmpty(response) && Validate().isNotEmpty(response.imageServerDetails) && Validate().isNotEmpty(response.response)) {
                        var fileNameImageUrlMap = {};
                        response.response.forEach((eachItem) => {
                            if (eachItem.imagePath !== "") {
                                var imageUrl = response.imageServerDetails.imageServerUrl + "/" + eachItem.imagePath;
                                fileNameImageUrlMap[eachItem.originalImageName] = imageUrl;
                            }
                        })
                        Object.keys(returnProductImages).forEach((each) => {
                            if (returnProductImages[each].name in fileNameImageUrlMap) {
                                var tempObj = {};
                                tempObj["fileName"] = returnProductImages[each].name;
                                tempObj["imageUrl"] = fileNameImageUrlMap[returnProductImages[each].name];
                                productImageMap[each] = tempObj
                            }

                        })
                    }
                }, err => {
                    console.log(err)
                }).catch(function (error) {
                    console.log(error);
                });

            }
            if (isWrongProduct && Object.keys(wrongProducts).length > 0 && Object.keys(reasonMap).length > 0 && reasonMap["W"] !== undefined) {
                var wrongProductsHtml = "<li><b>Wrong Product Details</b><ul>";
                Object.keys(wrongProducts).forEach((each) => {
                    wrongProductsHtml += '<li>' + each + '&nbsp;&nbsp; ' + wrongProducts[each].packSize + '(Pack Size)&nbsp; ' + wrongProducts[each].qtyInUnits + '(Quantity in units)</li>';
                })
                wrongProductsHtml += "</ul></li>";
                reasonMap["W"] += wrongProductsHtml;
            }
            Object.keys(reasonMap).forEach((eachReason) => {
                var message = reasonMap[eachReason];
                var splitedStr = reasonMap[eachReason].split("<ul><li>")[1];
                var productId = splitedStr.split("&nbsp")[0];
                if (Validate().isNotEmpty(productImageMap[productId])) {
                    message += "<li><a href='" + productImageMap[productId]['imageUrl'] + "'>" + productImageMap[productId]['fileName'] + "</a></li>";
                }
                let custName = Validate().isNotEmpty(props.orderInfo.patientName) ? props.orderInfo.patientName : props.orderInfo.custName
                var ticketObject = {};
                ticketObject["name"] = custName;
                ticketObject["customerName"] = custName;
                ticketObject["customerId"] = props.orderInfo.customerId;
                ticketObject["email"] = props.orderInfo.email;
                ticketObject["phone"] = props.orderInfo.mobileNo;
                ticketObject["message"] = message + "</ul>";
                ticketObject["problemType"] = "Exchange";
                ticketObject["subProblemType"] = reasonTypes[eachReason];
                ticketObject["subject"] = "Reg: Exchange, " + reasonTypes[eachReason] + ", OrderId: " + props.orderInfo.displayOrderId;
                ticketObject["orderId"] = props.orderInfo.displayOrderId;
                ticketObject["source"] = "CRM";
                ticketObject["vertical"] = "Pharmacy";
                ticketObject["state"] = custStateCode;

                ticketsList.push(ticketObject);

            })
            if (window.confirm("Do You Want To Submit Return Request Details?")) {
                OrderService().createReturnRequest({data: ticketsList}).then(response => {
                    if ("SUCCESS" === response.statusCode) {
                        setCreatedTicketNos(response.dataObject.ticketNumbers);
                    } else if (Validate().isNotEmpty(response.message)) {
                        setStackedToastContent({toastMessage:response.message})
                    }
                }, err => {
                    console.log(err);
                })
            }

        }

    }

    return (
        <React.Fragment>
            {!existedReturnRequestsSet && (!returnRequestForOrderloading ?
                (returnRequestForOrderGrid && !createdTicketNos && <React.Fragment>
                    <DynamicGridHeight metaData={returnRequestForOrderGrid} dataSet={returnRequestForOrderSet} className="card scroll-grid-on-hover m-2">
                    <CommonDataGrid {...returnRequestForOrderGrid}
                        dataSet={returnRequestForOrderSet}
                        callBackMap={callBackMapping}
                        onEdit={onEdit}
                        selectedRows={selectedRows}
                        onRowSelectionCallback={onSelectRow} />
                    {isWrongProduct && <React.Fragment><br/><AddWrongProductsForm productsLength={returnRequestForOrderSet.length} wrongProducts={wrongProducts} setWrongProducts={setWrongProducts} /></React.Fragment>}
                    </DynamicGridHeight>
                    <span class="d-flex justify-content-end p-1"><Button variant="" className="btn btn-brand" disabled={Validate().isEmpty(selectedRows)} onClick={() => submitReturnRequest(props)}>Submit</Button></span></React.Fragment>) 
                    : null)}

            {!existedReturnRequestsLoading ?
                (existedReturnRequestsSet ?
                    <ExistedReturnRequests existedReturnRequestsSet={existedReturnRequestsSet} /> :
                    (!returnRequestForOrderGrid && <Button variant = "" className="brand-secondary m-3" onClick={() => getReturnRequestForOrder(props)}>{returnRequestForOrderloading ? <CustomSpinners spinnerText={"Create New Ticket"} className={"spinner-position"} innerClass={"invisible"}/> : 'Create Return Ticket'}</Button>))
                : null}

            {createdTicketNos &&
                <p className="p-3 text-center">Request Submitted Successfully and Your Ticket Number is: <span class='text-primary'>{createdTicketNos}</span></p>}
            {returnRequestForOrderResponseEmpty &&
                <p className="p-3 text-center">Not able to get Customer Return Request details. Try after some time!</p>}
        </React.Fragment>
    )
}
export default ReturnRequests;