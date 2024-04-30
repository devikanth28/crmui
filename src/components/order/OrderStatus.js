import React, { useContext, useState } from 'react';
import CommonDataGrid, { Badges, BackOrder, PrescriptionRequired } from "@medplus/react-common-components/DataGrid";
import Validate from '../../helpers/Validate';
import OrderHelper from '../../helpers/OrderHelper';
import DataGridHelper from '../../helpers/DataGridHelper';
import { Card, CardBody, Collapse } from "reactstrap";
import { Button, Form } from "react-bootstrap";
import dateFormat from 'dateformat';
import LatLongLocation from '../Common/LatLongLocation';
import { ComplimentaryIcon, CouponIcon } from '../../helpers/TypeIcons';
import DynamicGridHeight from '../Common/DynamicGridHeight';
import { UserContext } from '../Contexts/UserContext';
import CurrencyFormatter from '../Common/CurrencyFormatter';
const OrderStatus = (props) => {
 
    const orderInfo = props.orderInfo;
    const orderStatus = props.orderStatus;
    const shipmentStatus = props.shipmentStatus;
    const userNameIdMap = props.userNameIdMap;
    const userNames = props.userNames;
    const omsOrderItem = orderInfo.omsOrderItem;
    const omsOrderReservedQty = props.omsOrderReservedQty;
    const refundDetail = props.refundDetail;
    const paymentDetail = props.paymentDetail;
    const productIdMap = props.productIdMap;
    const omsPaymentRecievedDate = props.omsPaymentRecievedDate;
    const orderPaybackPointsMap = props.orderPaybackPointsMap;
    const refundDeliveryCharges = props.refundDeliveryCharges;
    const totalRefundAmount = props.totalRefundAmount;
    const totalPBPoints = props.totalPBPoints;
    const [collapsedId, setCollpasedId] = useState(0)

    const userSessionInfo = useContext(UserContext);

    let statusDashboard = DataGridHelper().getStatusDashboard();
    let statusDataset = [];
    Object.values(orderStatus).forEach((each, index) => {
        statusDataset.push({
            "rowIndex": index,
            "Status": OrderHelper().getOrderDisplayStatus(each.Status),
            "SysTime": each.SysTime,
            "UserId": Validate().isNotEmpty(userNameIdMap) && Validate().isNotEmpty(userNameIdMap[each.UserId]) ? userNameIdMap[each.UserId] + "(" + each.UserId + ")" : each.UserId
        })
    });

    let shipmentStatusDashboard = DataGridHelper().getShipmentStatusDashboard();
    let shipmentStatusDataset = [];
    Object.values(shipmentStatus).forEach((each, index) => {
        let userId = each.CreatedBy;
        if (Validate().isEmpty(userId)) {
            userId = "-";
        } else {
            userId = Validate().isNotEmpty(userNames) && Validate().isNotEmpty(userNames[each.CreatedBy])
                ? userNames[each.CreatedBy]
                : Validate().isNotEmpty(userNameIdMap) && Validate().isNotEmpty(userNameIdMap[each.CreatedBy])
                    ? userNameIdMap[each.CreatedBy] + "(" + each.CreatedBy + ")"
                    : each.CreatedBy
        }

        let shipmentType = "";
        if (each.ShipmentTypeId === 0)
            shipmentType = "Internal";
        if (each.ShipmentTypeId === 1)
            shipmentType = "External";

        shipmentStatusDataset.push({
            "rowIndex": index,
            "Status": OrderHelper().getShipmentDisplayStatus(each.Status),
            "DateCreated": each.DateCreated,
            "UserId": userId,
            "shipmentType": shipmentType
        })
    });

    let locationDashboard = DataGridHelper().getLocationDashboard();
    let locationDataset = [];
    locationDataset.push({
        "latLng": Validate().isNotEmpty(orderInfo.latLng) ? orderInfo.latLng : "-",
        "locationConfigId": Validate().isNotEmpty(orderInfo.locationConfigId) ? orderInfo.locationConfigId : "-",
        "hubStoreId": Validate().isNotEmpty(orderInfo.hubStoreId) ? orderInfo.hubStoreId : "-",
        "storeId": Validate().isNotEmpty(orderInfo.storeId) ? orderInfo.storeId : "-",
        "pickStoreId": Validate().isNotEmpty(orderInfo.pickStoreId) ? orderInfo.pickStoreId : "-"
    })

    let productsDashboard = DataGridHelper().getProductsDashboard(orderInfo);
    let productsDataset = [];
    let productsSummary = [];
    let subTotal = 0;
    Object.values(omsOrderItem).forEach((each, index) => {
        let rowItem = {
            "rowIndex": index,
            "productId": each.productId,
            "productName": each.productName,
            "packSize": each.packSize,
            "productDisplayStatus": OrderHelper().getProductDisplayStatus(each.itemStatus, orderInfo.status),
            "quantity": each.quantity,
        };

        if (orderInfo.status === "E") {
            let editedQuantity = each.itemStatus === "E" ? each.editedQuantity : "-";
            rowItem = { ...rowItem, "editedQuantity": editedQuantity };
        }

        let productTotal = 0;
        switch (orderInfo.orderType) {
            case "REDEMPTION":
                rowItem = { ...rowItem, "redemptionPoints": each.redemptionPoints };
                productTotal = each.quantity * each.redemptionPoints;
                break;

            case "PB_ORDER":
                let paybackIncludedPrice = Validate().isNotEmpty(each.mrp) ? each.mrp - each.pbPointsValue : each.price - each.pbPointsValue;
                rowItem = { ...rowItem, "paybackIncludedPrice": `${paybackIncludedPrice.toFixed(2)} + ${each.pbPoints} Pts` };
                productTotal = (paybackIncludedPrice*each.quantity).toFixed(2) + " + " + (each.quantity * each.pbPoints) + " Pts";
                break;

            default:
                let productMrp = Validate().isNotEmpty(each.mrp) ? each.mrp : each.price;
                rowItem = { ...rowItem, "productMrp": productMrp };
                productTotal = (each.quantity * productMrp).toFixed(2);
                break;
        }
        rowItem = { ...rowItem, "productTotal": productTotal };

        let calculatedTotal = 0;
        if (Validate().isNotEmpty(each.mrp)) {
            calculatedTotal = each.quantity * each.mrp;
        } else {
            calculatedTotal = each.quantity * each.price;
        }
        subTotal = subTotal + calculatedTotal;
        productsDataset.push(rowItem)
    });

    if (orderInfo.orderType === "PB_ORDER" && Validate().isNotEmpty(orderInfo.totalRedeemPBPoints)) {
        productsSummary.push({
            "quantity": "Total Redeemed PayBack Points",
            "productTotal": Math.floor(orderInfo.totalRedeemPBPoints) + " Pts"
        });
    } else if (orderInfo.orderType !== "PB_ORDER") {
        productsSummary.push({
            "quantity": "Sub Amount",
            "productTotal": subTotal.toFixed(2)
        }, {
            "quantity": "Delivery Charges",
            "productTotal": orderInfo.totalServiceCharges
        });
    }

    if (orderInfo.orderType !== "REDEMPTION" && orderInfo.orderType !== "PB_ORDER") {
        if (Validate().isNotEmpty(orderInfo.discountTotal) && orderInfo.discountTotal > 0) {
            productsSummary.push({
                "quantity": "Discount Amount",
                "productTotal": orderInfo.discountTotal.toFixed(2)
            });
        }
        if (Validate().isNotEmpty(orderInfo.totalPBPoints) && orderInfo.totalPBPoints > 0 && (orderInfo.status === "D" || orderInfo.status === "SD")) {
            productsSummary.push({
                "quantity": "PayBack Points Earned",
                "productTotal": Math.floor(orderInfo.totalPBPoints)
            });
        }
        if (Validate().isNotEmpty(orderInfo.totalPBPoints) && orderInfo.totalPBPoints > 0 && !(orderInfo.status === "D" || orderInfo.status === "SD")) {
            productsSummary.push({
                "quantity": "PayBack Points to be Credited",
                "productTotal": Math.floor(orderInfo.totalPBPoints)
            });
        }
        if (Validate().isNotEmpty(orderInfo.totalPoints) && orderInfo.totalPoints > 0) {
            productsSummary.push({
                "quantity": "Earned Points",
                "productTotal": orderInfo.totalPoints
            });
        }
        if (Validate().isNotEmpty(orderInfo.medplusCashAmount) && orderInfo.medplusCashAmount > 0) {
            productsSummary.push({
                "quantity": "MedplusCash Amount",
                "productTotal": orderInfo.medplusCashAmount
            });
        }
        if (Validate().isNotEmpty(orderInfo.paymentGatewayAmount) && orderInfo.paymentGatewayAmount > 0) {
            productsSummary.push({
                "quantity": "Online Payment",
                "productTotal": orderInfo.paymentGatewayAmount
            });
        }
    }else{
        if (Validate().isNotEmpty(orderInfo.discountTotal) && orderInfo.discountTotal > 0) {
            productsSummary.push({
                "quantity": "Discount Amount",
                "productTotal": orderInfo.discountTotal.toFixed(2)
            });
        }
    }

    

    if (orderInfo.orderType === "REDEMPTION") {
        productsSummary.push({
            "quantity": "Total Redeemed Points",
            "productTotal": orderInfo.totalRedeemPoints
        });
    } else if (orderInfo.orderType === "PB_ORDER") {
        productsSummary.push({
            "quantity": "Total Amount",
            "productTotal": orderInfo.amountPaid.toFixed(2) + " + " + orderInfo.totalRedeemPBPoints + " Pts"
        });
    } else {
        productsSummary.push({
            "quantity": "Total Amount",
            "productTotal": orderInfo.orderAmount.toFixed(2)
        });
    }

    let reservedQuantityDashboard = DataGridHelper().getReservedQuantityDashboard();
    let reservedQuantityDataset = [];
    Object.values(omsOrderReservedQty).forEach((each) => {
        reservedQuantityDataset.push({
            "productId": each.productId,
            "orderedQuantity": each.orderedQuantity,
            "reservedQuantity": each.reservedQuantity
        })
    })

    let paymentDashboard = DataGridHelper().getPaymentDashboard();
    let paymentDataset = [];
    let paymentSummary = [];
    let settlementId = "";

    let refundPaymentDashboard = DataGridHelper().getRefundPaymentDashboard();
    let refundPaymentDataset = [];
    let refundPaymentSummary = [];
    let refundSettlementId = "";

    const preparePaymentDashboard = (eachPaymentDetail, omsPaymentRecievedDate, targetDetails) => {
        if (Validate().isNotEmpty(eachPaymentDetail)) {
            if (targetDetails === "paymentDetails") {
                settlementId = Validate().isNotEmpty(eachPaymentDetail.settlementId) ? eachPaymentDetail.settlementId : "";
            } else {
                refundSettlementId = Validate().isNotEmpty(eachPaymentDetail.settlementId) ? eachPaymentDetail.settlementId : "";
            }
            let payBackPointsString = "";
            let paymentAmountString = "";
            let orderType = eachPaymentDetail.orderType;
            if (Validate().isNotEmpty(eachPaymentDetail.paymentList) && eachPaymentDetail.isPaymentAndRefundDone) {
                Object.values(eachPaymentDetail.paymentList).forEach((paymentObj, index) => {
                    let rowItem = {};
                    rowItem = { "rowIndex": index };
                    if (Validate().isNotEmpty(eachPaymentDetail.childRefId)) {
                        rowItem = { ...rowItem, "settlementType": eachPaymentDetail.settlementType + "(" + eachPaymentDetail.childRefId + ")" }
                    } else {
                        rowItem = { ...rowItem, "settlementType": eachPaymentDetail.settlementType }
                    }
                    rowItem = { ...rowItem, "txNo": Validate().isNotEmpty(paymentObj.txNo) ? paymentObj.txNo : "NA" };
                    rowItem = { ...rowItem, "mode": OrderHelper().getPaymentMode(paymentObj.mode) }
                    rowItem = { ...rowItem, "gatewayId": Validate().isNotEmpty(paymentObj.gatewayId) ? OrderHelper().getStatusWithFirstLetterCapitalized(paymentObj.gatewayId) : "NA" }
                    rowItem = { ...rowItem, "status": eachPaymentDetail.status };
                    let dateObject = Validate().isNotEmpty(eachPaymentDetail.dateCreated) ? new Date(eachPaymentDetail.dateCreated).toDateString() : "-";
                    let timeObject = Validate().isNotEmpty(eachPaymentDetail.dateCreated) ? new Date(eachPaymentDetail.dateCreated).toLocaleTimeString() : "-";
                    rowItem = { ...rowItem, "paymentDate": dateObject + " " + timeObject }
                    if (orderType === "PB_ORDER") {
                        if (OrderHelper().getPaymentMode(paymentObj.mode) === "Medplus Payback Points") {
                            payBackPointsString = (paymentObj.amount) + " Pts";
                        } else {
                            paymentAmountString = (paymentObj.amount).toFixed(2);
                        }
                    }
                    rowItem = { ...rowItem, "amount": (OrderHelper().getPaymentMode(paymentObj.mode) !== "Medplus Payback Points") ? (paymentObj.amount).toFixed(2) : (paymentObj.amount) + " Pts" }
                    targetDetails === "paymentDetails" ? paymentDataset.push(rowItem) : refundPaymentDataset.push(rowItem);
                });
                if (orderType === "PB_ORDER") {
                    targetDetails === "paymentDetails"
                        ? paymentSummary.push({
                            "paymentDate": "Total Settlement Amount",
                            "amount": paymentAmountString + ((Validate().isNotEmpty(paymentAmountString) && Validate().isNotEmpty(payBackPointsString)) ? " + " : "") + payBackPointsString
                        })
                        : refundPaymentSummary.push({
                            "paymentDate": "Total Settlement Amount",
                            "amount": paymentAmountString + ((Validate().isNotEmpty(paymentAmountString) && Validate().isNotEmpty(payBackPointsString)) ? " + " : "") + payBackPointsString
                        })
                } else {
                    targetDetails === "paymentDetails"
                        ? paymentSummary.push({
                            "paymentDate": "Total Settlement Amount",
                            "amount": eachPaymentDetail.totalAmount.toFixed(2)
                        })
                        : refundPaymentSummary.push({
                            "paymentDate": "Total Settlement Amount",
                            "amount": eachPaymentDetail.totalAmount.toFixed(2)
                        })
                }
            } else {
                let rowItem = {};
                rowItem = {
                    "settlementType": eachPaymentDetail.settlementType,
                    "txNo": "-",
                    "mode": OrderHelper().getPaymentMode(eachPaymentDetail.settlementSubType),
                    "gatewayId": Validate().isNotEmpty(eachPaymentDetail.gatewayId) ? eachPaymentDetail.gatewayId : "NA"
                }
                if (eachPaymentDetail.isPaymentAndRefundDone) {
                    rowItem = { ...rowItem, "status": eachPaymentDetail.status }
                } else {
                    rowItem = { ...rowItem, "status": "PENDING" }
                }
                let dateObject = Validate().isNotEmpty(eachPaymentDetail.dateCreated) ? new Date(eachPaymentDetail.dateCreated).toDateString() : "-";
                let timeObject = Validate().isNotEmpty(eachPaymentDetail.dateCreated) ? new Date(eachPaymentDetail.dateCreated).toLocaleTimeString() : "-";
                rowItem = {
                    ...rowItem,
                    "paymentDate": dateObject + " " + timeObject,
                    "amount": eachPaymentDetail.totalAmount
                }
                targetDetails === "paymentDetails" ? paymentDataset.push(rowItem) : refundPaymentDataset.push(rowItem);
                targetDetails === "paymentDetails"
                    ? paymentSummary.push({
                        "paymentDate": "Total Settlement Amount",
                        "amount": eachPaymentDetail.totalAmount.toFixed(2)
                    })
                    : refundPaymentSummary.push({
                        "paymentDate": "Total Settlement Amount",
                        "amount": eachPaymentDetail.totalAmount.toFixed(2)
                    })
            }
        }
    }

    if (Validate().isNotEmpty(paymentDetail)) {
        Object.values(paymentDetail).forEach((eachPaymentDetail, index) => {
            if (Validate().isNotEmpty(eachPaymentDetail) && eachPaymentDetail.settlementType !== "REFUND") {
                orderInfo.orderType === "PB_ORDER"
                    ? eachPaymentDetail = { ...eachPaymentDetail, "orderType": "PB_ORDER" }
                    : eachPaymentDetail = { ...eachPaymentDetail, "orderType": "" }
                eachPaymentDetail = { ...eachPaymentDetail, "isPaymentAndRefundDone": true };
                preparePaymentDashboard(eachPaymentDetail, omsPaymentRecievedDate, "paymentDetails");
            }
        });
    }
    const handleCollpased = (id) => {
        if (collapsedId === id) {
            setCollpasedId(4)
        }
        else {
            setCollpasedId(id)
        }
    }
    let refundDashboard = DataGridHelper().getRefundDashboard(orderInfo);
    let refundDataset = {};
    let refundSummary = {};

    if (Validate().isNotEmpty(refundDetail) && Validate().isNotEmpty(refundDetail.refunds)) {
        Object.values(refundDetail.refunds).forEach((eachRefundDetail, index) => {
            if (Validate().isNotEmpty(paymentDetail)) {
                Object.values(paymentDetail).forEach((eachPaymentDetail, index) => {
                    if (Validate().isNotEmpty(eachPaymentDetail) && eachPaymentDetail.settlementType === "REFUND" && eachPaymentDetail.childRefId === eachRefundDetail.refundId) {
                        orderInfo.orderType === "PB_ORDER"
                            ? eachPaymentDetail = { ...eachPaymentDetail, "orderType": "PB_ORDER" }
                            : eachPaymentDetail = { ...eachPaymentDetail, "orderType": "" }
                        if (eachPaymentDetail.status !== "REFUND_DONE") {
                            eachPaymentDetail = { ...eachPaymentDetail, "isPaymentAndRefundDone": false };
                        } else {
                            eachPaymentDetail = { ...eachPaymentDetail, "isPaymentAndRefundDone": true };
                        }
                        preparePaymentDashboard(eachPaymentDetail, "", "refundPaymentDetails");
                    }
                });
            }

            let eachRefundId = "";
            let eachRefundDataset = [];
            let eachRefundSummary = [];
            if (Validate().isNotEmpty(eachRefundDetail.refundItems)) {
                eachRefundId = eachRefundDetail.refundId;
                Object.values(eachRefundDetail.refundItems).forEach((eachRefundItem, index) => {
                    let rowItem = {};
                    rowItem = {
                        "rowIndex": index,
                        "productName": productIdMap[eachRefundItem.productId],
                        "refundQuantity": eachRefundItem.refundQuantity,
                        "refundReason": eachRefundDetail.refundReason
                    }
                    if (orderInfo.orderType === "PB_ORDER") {
                        let specialPrice = orderPaybackPointsMap[eachRefundItem.productId].specialPrice;
                        let quantity = orderPaybackPointsMap[eachRefundItem.productId].quantity;
                        let paybackPoints = orderPaybackPointsMap[eachRefundItem.productId].paybackPoints;
                        rowItem = {
                            ...rowItem,
                            "specialPrice": specialPrice.toFixed(2) + " + " + paybackPoints + " Pts",
                            "refundAmount": (specialPrice * quantity).toFixed(2) + " + " + (paybackPoints * quantity) + " Pts"
                        }
                    } else {
                        rowItem = {
                            ...rowItem,
                            "mrp": eachRefundItem.mrp,
                            "rate": eachRefundItem.rate,
                            "refundAmount": eachRefundItem.refundItemAmount
                        }
                    }
                    eachRefundDataset.push(rowItem);
                })
            }

            if (orderInfo.orderType === "PB_ORDER") {
                eachRefundSummary.push(
                    {
                        "specialPrice": "Delivery Charges",
                        "refundAmount": refundDeliveryCharges.toFixed(2)
                    },
                    {
                        "specialPrice": "Total Refund Amount",
                        "refundAmount": totalRefundAmount.toFixed(2) + " + " + totalPBPoints + " Pts"
                    }
                )
            } else {
                eachRefundSummary.push(
                    {
                        "rate": "Delivery Charges",
                        "refundAmount": eachRefundDetail.serviceTotal.toFixed(2)
                    },
                    {
                        "rate": "Total Refund Amount",
                        "refundAmount": eachRefundDetail.totalRefund.toFixed(2)
                    }
                )
            }
            refundDataset = { ...refundDataset, [eachRefundId]: eachRefundDataset };
            refundSummary = { ...refundSummary, [eachRefundId]: eachRefundSummary }
        });
    }

    const callBackMapping = {
        'renderStatusDashboardStatusColumn': (props) => {
            let cellClass = OrderHelper().getBadgeColorClassForStatus(props.row.Status) + " badge rounded-pill"
            return <React.Fragment>
                <p className={cellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.Status)}</p>
            </React.Fragment>
        },

        'renderShipmentDashboardStatusColumn': (props) => {
            let cellClass = OrderHelper().getBadgeColorClassForStatus(props.row.Status) + " badge rounded-pill"
            return <React.Fragment>
                <p className={cellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.Status)}</p>
            </React.Fragment>
        },

        'renderLocationLatlongColumn': (props) => {
            return <React.Fragment>
                <LatLongLocation {...props}/>
            </React.Fragment>
        },

        'renderProductTypeColumn': (props) => {
            let isBackOrder = Validate().isNotEmpty(omsOrderItem[props.row.rowIndex]) ? omsOrderItem[props.row.rowIndex].isBackOrder === "Y" : false;
            let isPrescriptionRequired = Validate().isNotEmpty(omsOrderItem[props.row.rowIndex]) ? omsOrderItem[props.row.rowIndex].isRequiredPrescription === "Y" : false;
            let isComplimentaryProduct = Validate().isNotEmpty(omsOrderItem[props.row.rowIndex]) ? omsOrderItem[props.row.rowIndex].complimentaryProduct : false;
            let isCouponCodeApplied = Validate().isNotEmpty(omsOrderItem[props.row.rowIndex]) ? Validate().isNotEmpty(omsOrderItem[props.row.rowIndex].couponCode) : false;

            return <React.Fragment>
                {!isBackOrder && !isPrescriptionRequired && !isComplimentaryProduct && !isCouponCodeApplied
                    ? <div style={{ display: "flex", justifyContent: "center" }}>-</div>
                    : <div style={{ display: "flex", justifyContent: "center" }}>
                        {isBackOrder && <BackOrder id={`backOrderBadge_${props.row.rowIndex}`} />}
                        {isPrescriptionRequired && <PrescriptionRequired id={`prescriptionRequiredBadge_${props.row.rowIndex}`} />}
                        {isComplimentaryProduct && <ComplimentaryIcon id={`complimentaryProduct_${props.row.rowIndex}`} />}
                        {isCouponCodeApplied && <CouponIcon id={`couponCode_${props.row.rowIndex}`} />}
                    </div>
                }
            </React.Fragment>
        },

        'renderProductDashboardStatusColumn': (props) => {
            let cellClass = OrderHelper().getBadgeColorClassForStatus(props.row.productDisplayStatus) + " badge rounded-pill"
            return <React.Fragment>
                <p className={cellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.productDisplayStatus)}</p>
            </React.Fragment>
        },

        'renderProductDashboardSpecialPriceColumn': (props) => {
            return <React.Fragment>
                <div className="text-end">
                    <CurrencyFormatter data={props.row.paybackIncludedPrice} decimalPlaces={-1} />
                </div>
            </React.Fragment>
        },

        'renderProductDashboardMrpColumn': (props) => {
            return <React.Fragment>
                <div className="text-end">
                <CurrencyFormatter data={props.row.productMrp} decimalPlaces={-1} />
                </div>
            </React.Fragment>
        },

        'renderProductDashboardTotalColumn': (props) => {
            return <React.Fragment>
                <div className="text-end">
                <CurrencyFormatter data={props.row.productTotal} decimalPlaces={-1} />
                </div>
            </React.Fragment>
        },

        'renderProductDashboardTotalSummaryColumns': (props) => {
            return props.row.quantity.toLowerCase().indexOf("points") != -1
            ? <React.Fragment>
                 <div className="text-end">
                    {props.row[props.column.key]}
                 </div>
            </React.Fragment>
            : <React.Fragment>
                <div className="text-end">
                    <React.Fragment>
                        {"Delivery Charges" == props?.row?.quantity && orderInfo?.orderSerivceCharge?.[0]?.serviceCharge > 0 && orderInfo.orderSerivceCharge[0].serviceCharge > props.row[props.column.key] ?
                                <React.Fragment><del><CurrencyFormatter data={orderInfo.orderSerivceCharge[0].serviceCharge} decimalPlaces={-1} /></del> {props.row[props.column.key] == 0 ? "FREE" : <CurrencyFormatter data={props.row[props.column.key]} decimalPlaces={-1} />} </React.Fragment>
                                : <React.Fragment>{props.row[props.column.key] == 0 ? "FREE" : <CurrencyFormatter data={props.row[props.column.key]} decimalPlaces={-1} />}</React.Fragment>
                        }
                    </React.Fragment>
                </div>
            </React.Fragment>
        },

        'renderPaymentDashboardStatusColumn': (props) => {
            let cellClass = OrderHelper().getBadgeColorClassForStatus(props.row.status) + " badge rounded-pill"
            return <React.Fragment>
                <p className={cellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.status)}</p>
            </React.Fragment>
        },

        'renderPaymentDashboardAmountColumn': (props) => {
            return props.row.amount.toString().toLowerCase().indexOf("pts") != -1 
                ? <React.Fragment>
                    <div className="text-end">
                        {props.row.amount}
                    </div>
                </React.Fragment>
                : <React.Fragment>
                    <div className="text-end">
                    <CurrencyFormatter data={props.row.amount} decimalPlaces={-1} />
                    </div>
                </React.Fragment>
        },

        'renderPaymentDashboardAmountSummaryColumns': (props) => {
            return <React.Fragment>
                <div className="text-end">
                <CurrencyFormatter data={props.row[props.column.key]} decimalPlaces={-1} />
                </div>
            </React.Fragment>
        },

        'renderRefundPaymentDashboardStatusColumn': (props) => {
            let cellClass = OrderHelper().getBadgeColorClassForStatus(props.row.status) + " badge rounded-pill"
            return <React.Fragment>
                <p className={cellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.status)}</p>
            </React.Fragment>
        },

        'renderRefundPaymentDashboardAmountColumn': (props) => {
            return <React.Fragment>
                <div className="text-end">
                    <CurrencyFormatter data={props.row.amount} decimalPlaces={-1} />
                </div>
            </React.Fragment>
        },

        'renderRefundPaymentDashboardAmountSummaryColumns': (props) => {
            return <React.Fragment>
                <div className="text-end">
                    <CurrencyFormatter data={props.row[props.column.key]} decimalPlaces={-1} />
                </div>
            </React.Fragment>
        },

        'renderRefundDashboardMrpColumn': (props) => {
            return <React.Fragment>
                <div className="text-end">
                    <CurrencyFormatter data={props.row.mrp} decimalPlaces={-1} />
                </div>
            </React.Fragment>
        },

        'renderRefundDashboardRateColumn': (props) => {
            return <React.Fragment>
                <div className="text-end">
                    <CurrencyFormatter data={props.row.rate} decimalPlaces={-1} />
                </div>
            </React.Fragment>
        },

        'renderRefundDashboardAmountColumn': (props) => {
            return <React.Fragment>
                <div className="text-end">
                    <CurrencyFormatter data={props.row.refundAmount} decimalPlaces={-1} />
                </div>
            </React.Fragment>
        },

        'renderRefundDashboardAmountSummaryColumns': (props) => {
            return <React.Fragment>
                <div className="text-end">
                    <CurrencyFormatter data={props.row[props.column.key]} decimalPlaces={-1} />
                </div>
            </React.Fragment>
        }
    }

    return (

        <div className="p-12 m-0">
            {!props.hideOrderStatusDetails &&
                Validate().isNotEmpty(statusDataset)
                ? <div className={'col-12 mb-3'}>
                    <p className=" custom-fieldset mb-1">Order Status Details</p>
                        <DynamicGridHeight dataSet={statusDataset} metaData={statusDashboard} id="status-dataset" className="card scroll-grid-on-hover">
                            <CommonDataGrid
                            {...DataGridHelper().checkGridSpecificationsForVertical(userSessionInfo?.vertical, statusDashboard)}
                            dataSet={statusDataset}
                            callBackMap={callBackMapping}
                        />
                        </DynamicGridHeight>
                </div>
                : null
            }
            {
                Validate().isNotEmpty(shipmentStatusDataset)
                    ? <div className="col-12">
                        <p className="custom-fieldset mb-1">Shipment Status Details</p>
                        <div>
                            <DynamicGridHeight dataSet={shipmentStatusDataset} metaData={shipmentStatusDashboard} id="shipment-status-dataset" className="card scroll-grid-on-hover">
                            <CommonDataGrid
                                {...DataGridHelper().checkGridSpecificationsForVertical(userSessionInfo?.vertical, shipmentStatusDashboard)}
                                dataSet={shipmentStatusDataset}
                                callBackMap={callBackMapping}
                                defaultExpandedGroupIds ={['Internal','External']}
                            />
                            </DynamicGridHeight>
                        </div>
                    </div>
                    : null
            }
            {!props.hideOrderLocationDetails &&
                Validate().isNotEmpty(locationDataset)
                ? <div>
                    <div className="col-12">
                        <p className="custom-fieldset mt-3 mb-1">Order Location Details</p>
                        <div>
                            <DynamicGridHeight dataSet={locationDataset} metaData={locationDashboard} id="location-dataset" className="card scroll-grid-on-hover">
                            <CommonDataGrid
                                {...DataGridHelper().checkGridSpecificationsForVertical(userSessionInfo?.vertical, locationDashboard)}
                                dataSet={locationDataset}
                                callBackMap={callBackMapping}
                            />
                            </DynamicGridHeight>
                        </div>
                    </div>
                </div>
                : null
            }
            {
                Validate().isNotEmpty(productsDataset)
                    ? <div>
                        <div className="col-12">
                            <p className="custom-fieldset mt-3 mb-1">Order Items Details</p>
                            <div>
                                <DynamicGridHeight dataSet={productsDataset} gridMaxRows={productsDataset.length} metaData={productsDashboard} id="product-dataset" className="card scroll-grid-on-hover" bottomSummaryRows={productsSummary}>
                                <CommonDataGrid
                                    {...DataGridHelper().checkGridSpecificationsForVertical(userSessionInfo?.vertical, productsDashboard)}
                                    dataSet={productsDataset}
                                    callBackMap={callBackMapping}
                                    bottomSummaryRows={productsSummary}
                                />
                                </DynamicGridHeight> 
                            </div>
                        </div>
                    </div>
                    : null
            }
            {
                Validate().isNotEmpty(reservedQuantityDataset)
                    ? <div>
                        <div className="col-12">
                            <p className="custom-fieldset mt-3 mb-1">Reserved Quantity Details</p>
                            <div>
                                <DynamicGridHeight dataSet={reservedQuantityDataset} metaData={reservedQuantityDashboard} id="reserved-dataset-quantity" className="card scroll-grid-on-hover">
                                <CommonDataGrid
                                    {...DataGridHelper().checkGridSpecificationsForVertical(userSessionInfo?.vertical, reservedQuantityDashboard)}
                                    dataSet={reservedQuantityDataset}
                                />
                                </DynamicGridHeight>
                            </div>
                        </div>
                    </div>
                    : null
            }
            {Validate().isNotEmpty(paymentDataset) && Validate().isNotEmpty(settlementId)
                ? <div>

                    <div className="col-12">
                        <p className="custom-fieldset mt-3 mb-1">Settlement Id {settlementId}</p>
                        <div>
                            <DynamicGridHeight dataSet={paymentDataset} metaData={paymentDashboard} bottomSummaryRows={paymentSummary} id="payment-dataset" className="card scroll-grid-on-hover">
                            <CommonDataGrid
                                {...DataGridHelper().checkGridSpecificationsForVertical(userSessionInfo?.vertical, paymentDashboard)}
                                dataSet={paymentDataset}
                                callBackMap={callBackMapping}
                                bottomSummaryRows={paymentSummary}
                            />
                            </DynamicGridHeight>
                        </div>
                    </div>
                </div>
                : null
            }
            {
                Validate().isNotEmpty(refundPaymentDataset) || Validate().isNotEmpty(refundDataset)
                    ? <React.Fragment>
                        <p className='custom-fieldset my-3'>Refund Details</p>
                    <div className='journal-details'>
                        {Validate().isNotEmpty(refundPaymentDataset) ? <Form.Group className='mb-3'>
                            <div className={`row gx-2 vocher-details ${'#' + collapsedId === '#' + 1 ? 'bg-info-light':''}`}>
                                <div className='col-2 bg-white mt-0'>
                                    <div class="form-floating"><input aria-label="text input" type="text" readonly="" id="settlement Id" class="form-control-plaintext" value={refundSettlementId} />
                                        <label for="settlementId">Settlement Id</label>
                                    </div>
                                </div>
                                <div className='col-2 bg-white mt-0'>
                                    <div class="form-floating"><input aria-label="text input" type="text" readonly="" id="status" class="form-control-plaintext" value={OrderHelper().getStatusWithFirstLetterCapitalized(refundPaymentDataset[0].status)} />
                                        <label for="status">{"status"}</label>
                                    </div>
                                </div>
                                <div className='col-2 bg-white mt-0'>
                                    <div class="form-floating"><input aria-label="text input" type="text" readonly="" id="Date" class="form-control-plaintext" value={dateFormat(refundPaymentDataset[0].paymentDate, "mmm dd, yyyy")} />
                                        <label for="Date">{"Date"}</label>
                                    </div>
                                </div>
                                <div className="col text-end pointer align-self-end my-0 py-3" id={"#" + 1} onClick={() => { handleCollpased(1) }} >
                                    <svg id={"#" + 1} className={`${collapsedId === 1 ? "collapse-arrow rotate-up-half" : "collapse-arrow rotate-bottom"}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                        <rect id="Rectangle_4722" data-name="Rectangle 4722" width="18" height="18" fill="none" />
                                        <path id="Path_23401" data-name="Path 23401" d="M4.43.275.274,4.431A.942.942,0,0,0,1.606,5.763L5.1,2.283,8.587,5.774A.945.945,0,0,0,10.2,5.108a.936.936,0,0,0-.279-.666L5.762.275A.945.945,0,0,0,4.43.275Z" transform="translate(4.08 5.761)" fill="#6c757d" />
                                    </svg>
                                </div>
                                <Collapse isOpen={'#' + collapsedId === '#' + 1} id={'#' + 1} className="px-0">
                                    <Card>
                                        <CardBody className='p-0'>
                                            <DynamicGridHeight dataSet={refundPaymentDataset} metaData={refundPaymentDashboard} id="refund-payment" className="scroll-grid-on-hover" bottomSummaryRows={refundPaymentSummary}>
                                            <CommonDataGrid
                                                {...DataGridHelper().checkGridSpecificationsForVertical(userSessionInfo?.vertical, refundPaymentDashboard)}
                                                dataSet={refundPaymentDataset}
                                                callBackMap={callBackMapping}
                                                bottomSummaryRows={refundPaymentSummary}
                                            />
                                            </DynamicGridHeight>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                            </div>
                        </Form.Group> : null}
                        {
                            Validate().isNotEmpty(refundDataset)
                                ? Object.entries(refundDataset).map((eachRefundInfo,index) => {
                                    let eachRefundId = eachRefundInfo[0];
                                    return <Form.Group>
                                        <div className={`row gx-2 vocher-details ${'#' + collapsedId === '#' + eachRefundId ? 'bg-info-light' :""} `}>
                                            <div className='col-2 bg-white mt-0'>
                                                <div class="form-floating"><input aria-label="text input" type="text" readonly="" id="refund Id" class="form-control-plaintext" value={eachRefundId} />
                                                    <label for="refund Id">Refund Id</label>
                                                </div>
                                            </div>
                                            <div className='col-2 bg-white mt-0'>
                                                <div class="form-floating"><input aria-label="text input" type="text" readonly="" id="Total Amount" class="form-control-plaintext" value={"Rs "+refundSummary[eachRefundId][1].refundAmount} />
                                                    <label for="Total Amount">{"Total Amount"}</label>
                                                </div>
                                            </div>

                                            <div className="col text-end pointer align-self-end my-0 py-3" id={"#" + eachRefundId} onClick={() => { handleCollpased(eachRefundId) }} >
                                                <svg id={"#" + 2} className={`${collapsedId === 2 ? "collapse-arrow rotate-up-half" : "collapse-arrow rotate-bottom"}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                    <rect id="Rectangle_4722" data-name="Rectangle 4722" width="18" height="18" fill="none" />
                                                    <path id="Path_23401" data-name="Path 23401" d="M4.43.275.274,4.431A.942.942,0,0,0,1.606,5.763L5.1,2.283,8.587,5.774A.945.945,0,0,0,10.2,5.108a.936.936,0,0,0-.279-.666L5.762.275A.945.945,0,0,0,4.43.275Z" transform="translate(4.08 5.761)" fill="#6c757d" />
                                                </svg>
                                            </div>
                                            <Collapse isOpen={'#' + collapsedId === '#' + eachRefundId} id={'#' + eachRefundId} className="px-0">
                                                <Card>
                                                    <CardBody className='p-0'>
                                                        <DynamicGridHeight dataSet={refundDataset[eachRefundId]} metaData={refundDashboard} id="refund-dataset" className="scroll-grid-on-hover" bottomSummaryRows={refundSummary[eachRefundId]}>
                                                        <CommonDataGrid
                                                            {...DataGridHelper().checkGridSpecificationsForVertical(userSessionInfo?.vertical, refundDashboard)}
                                                            dataSet={refundDataset[eachRefundId]}
                                                            callBackMap={callBackMapping}
                                                            bottomSummaryRows={refundSummary[eachRefundId]}
                                                        />
                                                        </DynamicGridHeight>
                                                    </CardBody>
                                                </Card>
                                            </Collapse>
                                        </div>
                                        {index !=  Object.entries(refundDataset).length-1 && <hr className='my-0'/>}
                                    </Form.Group>
                                })

                                : null
                        }
                    </div>
                    </React.Fragment>
                    : null
            }
        </div>

    )

}

export default OrderStatus;