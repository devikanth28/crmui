import React, { useEffect, useState, useContext, useRef, useCallback, useMemo } from "react";
import { Button } from "react-bootstrap";
import { AlertContext, DetailModelOpened } from '../Contexts/UserContext';
import { TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import { Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import Validate from "../../helpers/Validate";
import CloseIcon from '../../images/cross.svg';
import CommunicationIcon from '../../images/linkIcon.svg'
import OrderService from "../../services/Order/OrderService";
import OrderDelivaryInfo from "../order/OrderDeliveryInfo";
import AggregateOrderDetails from "./AggregateOrderDetails";
import OrderStatus from "./OrderStatus";
import { gotoMartCustomerPage, gotoTicketHistoryPage } from "../../helpers/CommonRedirectionPages";
import ReturnRequests from "./ReturnRequest/ReturnRequests";
import Tickets from "./Tickets";
import TrackOrder from "./TrackOrder";
import OrderHelper from "../../helpers/OrderHelper";
import DetailModal from "../Common/DetailModal";
import CommonConfirmationModal from "../Common/ConfirmationModel";
import { ERROR_CODE, RECORD_TYPE } from "../../helpers/HelperMethods";
import CommunicationDisplay from "./CommunicationDisplay";
import { DataGridComponent, DetailWrapper, FormsComponent, HeaderComponent } from "../Common/CommonModel";
import OrderSearchButtons from "./HeaderButtons";
import PrepareGridForPrescription from "./PrepareGridForPrescription";

export const TrackScrolling = (element, setActiveTab) => {
    const tabs = element.target.querySelectorAll("div.scrolling-tabs");
    for (let i = 0; i < tabs.length; i++) {
        //Checking the top distance of parent and each tab with respective to the viewport
        //If the difference between these two top values is between 16px to -16px, tab is considered to be visible
        if (element.target.getBoundingClientRect()['top'] - tabs[i].getBoundingClientRect()['top'] <= 16 && element.target.getBoundingClientRect()['top'] - tabs[i].getBoundingClientRect()['top'] >= -16) {
            setActiveTab(tabs[i].id);
            break;
        }
    }
}

const PrepareOrderDetails = (props) => {

    const [loading, isLoading] = useState(false);
    const [orderInfo, setOrderInfo] = useState(undefined);
    const [cartOrderIds, setCartOrderIds] = useState([]);
    const [toggleConfirmation, setToggleConfirmation] = useState(false);
    const [forceClaimMessage, setForceClaimMessage] = useState(null);
    const [prescriptionImagesList, setPrescriptionImagesList] = useState([]);
    const [orderTab, setOrderTab] = useState(props.orderId);
    const [orderIdsInfo, setOrderIdsInfo] = useState({});
    const [orderInfoResponse, setOrderInfoResponse] = useState({});
    const [showClaimButton, setShowClaimButton] = useState(false);
    const [showUnclaimButton, setShowUnclaimButton] = useState(false);

    const orderIdsInfoMemo = useMemo(() => orderIdsInfo, [orderIdsInfo]);
    const { setStackedToastContent } = useContext(AlertContext);

    useEffect(() => {
        if (orderTab in orderIdsInfoMemo) {
            displayOrderDetails(orderTab);
        } else {
            getOrderDetails(orderTab);
        }
        if (props.allowedOrdersClaimRight && props.fromPage !== "FollowupForm" && Validate().isNotEmpty(orderIdsInfo[orderTab]) && orderIdsInfo[orderTab].orderDisplayStatus!="Cancelled") {
            if ((Validate().isEmpty(orderIdsInfo[orderTab].dataSetrow.claimedBy) || orderIdsInfo[orderTab].dataSetrow.claimedBy == "O")) {
                setShowClaimButton(true);
                setShowUnclaimButton(false);
            } else {
                setShowUnclaimButton(true);
                setShowClaimButton(false);
            }
        }
        else {
            setShowUnclaimButton(false);
            setShowClaimButton(false);
        }
    }, [props.showModal, cartOrderIds, orderTab, orderIdsInfo, orderIdsInfoMemo]);

    /* this use effect is used to get prescription/cart details whenever prescription orderId/cartId changes */
    useEffect(() => {
        getPrescriptionDetails(props.prescriptionOrderId);
    }, [props.prescriptionOrderId])

    const getOrderDetails = async (orderId) => {

        isLoading(true);
        await OrderService().getOrderDetails({ "orderId": orderId ? orderId : orderTab, "customerId": props.customerId, "cartId": props.cartId }).then((response) => {
            if ("SUCCESS" === response.statusCode && Validate().isNotEmpty(response.dataObject)) {
                setOrderIdsInfo({ ...orderIdsInfo, [response.dataObject.orderInfo?.orderId ? response.dataObject.orderInfo?.orderId.toString() : orderTab]: response.dataObject });
                setOrderInfoResponseIntoState(response.dataObject);
            } else {
                props.setOpenOrderDetailModal(false);
                setStackedToastContent({ toastMessage: "Something went wrong, Please Try Again!", position: TOAST_POSITION.BOTTOM_START })
            }
        }, (err) => {
            props.setOpenOrderDetailModal(false);
            setStackedToastContent({ toastMessage: "Something went wrong, Please Try Again!", position: TOAST_POSITION.BOTTOM_START })
            console.log(err);
        })
        isLoading(false);
    }

    const setOrderInfoResponseIntoState = (orderInfoResponse) => {
        setOrderInfo(orderInfoResponse.orderInfo);
        if (Validate().isNotEmpty(orderInfoResponse.cartOrderIds)) {
            setCartOrderIds(orderInfoResponse.cartOrderIds);
        }
        setOrderInfoResponse(orderInfoResponse);
        if (Validate().isNotEmpty(orderInfoResponse.dataSetrow) && props.fromPage !== "FollowupForm") {
            if(Validate().isNotEmpty(props.dataSet)){
                let temp = [...props.dataSet];
                props.dataSet.forEach((element, index) => {
                    if (element.orderId === orderTab) {
                        temp[index] = orderInfoResponse.dataSetrow;
                    }
                });
                props.setDataSet(temp);
            }
           if(Validate().isNotEmpty(props.claimedDataSet)){
            if (Validate().isNotEmpty(orderInfoResponse.dataSetrow.claimedBy) && orderInfoResponse.dataSetrow.claimedBy == 'S') {
                props.setClaimedDataSet(props.claimedDataSet.map(eachRecord => {
                    if (eachRecord.orderId == orderTab) {
                        return orderInfoResponse.dataSetrow;
                    }
                    return eachRecord;
                }));
            } else {
                if(Validate().isNotEmpty(props.claimedDataSet)){
                    let filteredClaimedSet = props.claimedDataSet?.filter(eachRecord => {
                        return eachRecord.orderId != orderTab;
                    })
                    props.setClaimedDataSet(filteredClaimedSet);
                    props.setTotalClaimedRecords(filteredClaimedSet.length);
                }
            }
           }
           
        }

    }

    const displayOrderDetails = (orderId) => {
        setOrderInfoResponseIntoState(orderIdsInfo[orderId])
    }

    const getPrescriptionDetails = (prescriptionOrderId) => {
        OrderService().getPrescriptionDetails({ prescriptionOrderId: prescriptionOrderId }).then(response => {
            if ("SUCCESS" === response.statusCode && Validate().isNotEmpty(response.dataObject)) {
                setPrescriptionImagesList(response.dataObject.prescriptionOrder.imageList);
            }
        }, error => {
            console.log(error);
        })
    }

    const claimOrder = (forceClaimFlag) => {
        let claimObject = {
            recordIds: orderIdsInfo[orderTab].dataSetrow.orderId,
            recordType: RECORD_TYPE.MART_ORDER,
            claimStatus: "C",
            forceClaimFlag: forceClaimFlag,
        };
        isLoading(true);
        OrderService().claimOrUnclaimOrder(claimObject)
            .then((data) => {
                if (data.statusCode == "SUCCESS") {
                    if("healthRecord" == props.fromPage)
                        orderIdsInfo[orderTab].dataSetrow.claimedBy = 'S';
                    else
                        props.row['claimedBy'] = orderIdsInfo[orderTab].dataSetrow.claimedBy;
                    setForceClaimMessage(null);
                    props.processClaimAction(claimObject.recordIds, [claimObject.recordIds], props.row);
                    setShowUnclaimButton(true);
                    setShowClaimButton(false);
                }
                else if (data.statusCode == "FAILURE") {
                    if (Validate().isNotEmpty(data.dataObject.errorCode)) {
                        if (data.dataObject.errorCode == ERROR_CODE.ALREADY_CLAIMED) {
                            setForceClaimMessage(data.message);
                            setToggleConfirmation(true);
                        } else {
                            setStackedToastContent({ toastMessage: data.message })
                        }
                    }
                }
                isLoading(false)
            })
            .catch((error) => {
                isLoading(false);
                console.log('Claim request failed:', error);
            });
    }

    const unclaimOrderOnClick = () => {
        let claimObject = {
            recordIds: orderIdsInfo[orderTab].dataSetrow.orderId,
            recordType: RECORD_TYPE.MART_ORDER,
            claimStatus: "U",
        };
        isLoading(true);
        OrderService().claimOrUnclaimOrder(claimObject)
            .then((data) => {
                if (data.statusCode == "SUCCESS") {
                    if("healthRecord" == props.fromPage)
                        orderIdsInfo[orderTab].dataSetrow.claimedBy = undefined;
                    else
                        props.row['claimedBy'] = orderIdsInfo[orderTab].dataSetrow.claimedBy;
                    setForceClaimMessage(null);
                    props.processClaimAction(claimObject.recordIds, [claimObject.recordIds], props.row);
                }
                else if (data.statusCode == "FAILURE") {
                    setStackedToastContent({ toastMessage: data.message, position: TOAST_POSITION.BOTTOM_START })
                    if (Validate().isNotEmpty(data.dataObject.errorCode) && data.dataObject.errorCode == ERROR_CODE.ALREADY_UNCLAIMED) {
                        orderIdsInfo[orderTab].dataSetrow.claimedBy = undefined;
                    } else if (Validate().isNotEmpty(data.dataObject.errorCode) && data.dataObject.errorCode == ERROR_CODE.ALREADY_CLAIMED) {
                        orderIdsInfo[orderTab].dataSetrow.claimedBy = "O";
                    }
                }
                setShowUnclaimButton(false)
                setShowClaimButton(true);
                isLoading(false);
            })
            .catch((error) => {
                isLoading(false);
                console.log('Claim request failed:', error);
            });
    }

    const ForceClaimClick = () => {
        if ((orderIdsInfo[orderTab].dataSetrow.claimedBy == "O") || "healthRecord" == props.fromPage) {
            claimOrder(false);
        }
    }

    const orderDisplayStatusClass = OrderHelper().getBadgeColorClassForStatus(orderInfoResponse.orderDisplayStatus) + " badge rounded-pill";
    const toggle = () => props.setOpenOrderDetailModal(!props.openOrderDetailModal);

    const handleFailure = () => {
        setStackedToastContent({ toastMessage: "Customer is Already Opened", position: TOAST_POSITION.BOTTOM_START })
    }

    const singleOrder = () => {
        return (
            <div className="align-items-center border-bottom d-flex justify-content-between px-2 px-lg-3 py-1">
                <p className="d-flex align-items-center flex-wrap mb-0" style={{maxWidth: "90%"}}><span className="hide-on-mobile">Details for Order ID - </span><span className="fw-bold text-truncate me-3 ms-1">{orderInfo.displayOrderId}<span className="hide-on-mobile"> ({orderInfo.orderId}) </span></span><span className={orderDisplayStatusClass}>{orderInfoResponse.orderDisplayStatus}</span>
                </p>
                <div className=" d-flex align-items-center">
                    <Button variant=" " onClick={() => props.setOpenOrderDetailModal(false)} className="rounded-5 icon-hover btn-link">
                    <span className='custom-close-btn icon-hover'></span>
                    </Button>
                </div>
            </div>
        )
    }

    const multipleOrders = () => {
        return (
            <div className="align-items-center border-bottom d-flex justify-content-between px-2 px-lg-3 py-1">
                <p className="d-flex align-items-center flex-wrap mb-0" style={{maxWidth: "90%"}}><span className="hide-on-mobile">Details for Cart ID - </span><span className="fw-bold text-truncate me-3">{orderInfo.cartId}</span><span className={orderDisplayStatusClass}>{orderInfoResponse.orderDisplayStatus}</span>
                </p>
                <div className=" d-flex align-items-center">
                    <Button variant=" " onClick={() => props.setOpenOrderDetailModal(false)} className="rounded-5 icon-hover btn-link">
                    <span className='custom-close-btn icon-hover'></span>
                    </Button>
                </div>
            </div>
        )
    }
    const headerPart = useCallback(() => {
        if (orderInfo) {
            return (
                <React.Fragment>
                    {cartOrderIds.length > 1 ? 
                        <React.Fragment>
                            {multipleOrders()}
                            <div className="custom-tabs-forms mobile-compatible-tabs pb-0">
                                <Nav tabs>
                                    {
                                        cartOrderIds.map((value, index) => {
                                            return <NavItem>
                                                <NavLink className={`${value == orderTab ? "active" : ""}`} onClick={() => { setOrderTab(value); }}>
                                                    {`Order ${index + 1} - ` + value}
                                                </NavLink>
                                            </NavItem>
                                        })
                                    }
                                </Nav>
                            </div>
                        </React.Fragment> : singleOrder()}                    
                </React.Fragment>
            )
        }
    }, [cartOrderIds, orderInfo, orderDisplayStatusClass])


    const cartTabs = () => {
        return (
            <React.Fragment>               
                {cartOrderIds.length > 1 ?
                    <TabContent activeTab={orderTab} className="h-100 py-2">
                        {
                            cartOrderIds.map((value, index) => {
                                return <TabPane tabId={value} className="h-100">
                                    {value == orderTab && !loading &&
                                        <div className={`h-100`}>
                                            <div className={`h-100`}>
                                                <DetailInfo  {...props} showClaimButton={showClaimButton} showUnclaimButton={showUnclaimButton} toggle={toggle} ForceClaimClick={ForceClaimClick} setToggleConfirmation={setToggleConfirmation} orderInfoResponse={orderInfoResponse} orderInfo={orderInfo} orderIdsInfo={orderIdsInfo} orderTab={orderTab}
                                                    getOrderDetails={getOrderDetails} prescriptionImagesList={prescriptionImagesList}
                                                />
                                            </div>
                                        </div>
                                    }
                                </TabPane>
                            })
                        }
                    </TabContent> : <div className={`h-100`}>

                        {!loading && <DetailInfo  {...props} toggle={toggle} orderInfoResponse={orderInfoResponse} orderInfo={orderInfo} ForceClaimClick={ForceClaimClick} setToggleConfirmation={setToggleConfirmation} showClaimButton={showClaimButton} showUnclaimButton={showUnclaimButton} orderIdsInfo={orderIdsInfo} orderTab={orderTab}
                            getOrderDetails={getOrderDetails} prescriptionImagesList={prescriptionImagesList}
                        />}
                    </div>
                }
            </React.Fragment>
        )
    }

    const bodyPart = () => {
        if (orderInfo) {
            return (
                <React.Fragment>
                    {cartTabs()}
                </React.Fragment>
            )
        }
    }

    const forceClaimSubmit = () => {
        claimOrder(true);
    }


    return <React.Fragment>
        {<DetailModal {...props} loading={loading} headerPart={headerPart} headerVisibility={true} bodyPart={bodyPart} bodyVisibility={true} bodyHeightClass={"pe-1"}/>}
        {toggleConfirmation && <CommonConfirmationModal justcenter={true} isConfirmationPopOver={true} setConfirmationPopOver={setToggleConfirmation} onSubmit={() => Validate().isNotEmpty(forceClaimMessage) ? forceClaimSubmit() : Validate().isEmpty(orderIdsInfo[orderTab].dataSetrow.claimedBy) ? claimOrder(false) : unclaimOrderOnClick()} buttonText={`Yes, ${Validate().isEmpty(orderIdsInfo[orderTab].dataSetrow.claimedBy) ? "Claim this order" : orderIdsInfo[orderTab].dataSetrow.claimedBy == "O" ? "Claim this order" : "UnClaim this order"}`} message={Validate().isNotEmpty(forceClaimMessage) ? forceClaimMessage + ", Do you Want to Force Claim this Order: " +orderIdsInfo[orderTab].dataSetrow.displayOrderId +" "+ "("+orderIdsInfo[orderTab].dataSetrow.orderId +")" : Validate().isEmpty(orderIdsInfo[orderTab].dataSetrow.claimedBy) ? "Are you sure to Claim the Order " + orderIdsInfo[orderTab].dataSetrow.displayOrderId +" "+ "("+orderIdsInfo[orderTab].dataSetrow.orderId +")" : "Are you sure to Unclaim the Order " + orderIdsInfo[orderTab].dataSetrow.displayOrderId +" "+ "("+orderIdsInfo[orderTab].dataSetrow.orderId +")"} headerText={<div className="d-flex">{orderIdsInfo[orderTab].dataSetrow.claimedBy == "S" ? "Unclaim " : "Claim "} Confirmation</div>} />}
    </React.Fragment>
}

export default PrepareOrderDetails;



const DetailInfo = (props) => {

    const tabsRef = useRef();
    const scrollContainerRef = useRef();
    const [activeTab, setActiveTab] = useState('orderStatus');
    const [action, setAction] = useState("");
    const [actionInProgress, setActionInProgress] = useState(false);
    const { setStackedToastContent } = useContext(AlertContext);
    const { selectedFormsSection ,setSelectedFormsSection} = useContext(DetailModelOpened)

    const handleFailure = () => {
        setStackedToastContent({ toastMessage: "Customer is already opened", position: TOAST_POSITION.BOTTOM_START })
    }

    const { ordersCount, orderActions, orderDisplayStatus, ePrescDisplayStatus,
        deliveryPaymentMapping, orderDoctorMap, refillId, modifiedBy, orderCancelReasonType, cartOrderIds,
        orderStatus, aggregateOrderDetails, shipmentStatus, userNameIdMap, userNames, omsOrderReservedQty,
        refundDetail, paymentDetail, productIdMap, omsPaymentRecievedDate, orderPaybackPointsMap,
        refundDeliveryCharges, totalRefundAmount, totalPBPoints, storeIdName, cardIdsList, noOfDays,
        fromDate, toDate

    } = props.orderInfoResponse;

    const orderIdsInfo = props.orderIdsInfo;
    const orderTab = props.orderTab;
    const prescriptionImagesList = props.prescriptionImagesList;
    const orderInfo = props.orderInfo;
    const getOrderDetails = props.getOrderDetails;
    const toggle = props.toggle;


    const displayProductDetails = () => {
        return (
            <React.Fragment>
                <PrepareGridForPrescription orderInfo={orderInfo} />
            </React.Fragment>
        );
    }

    return <React.Fragment>
        <DetailWrapper  modalType={"MART"}>
            {(Validate().isNotEmpty(orderIdsInfo[orderTab]) && orderIdsInfo[orderTab].orderDisplayStatus!="Cancelled") ?<HeaderComponent id={"HeaderComp"}>
                <OrderSearchButtons {...props}
                    ordersCount={Validate().isNotEmpty(ordersCount) ? {
                        ordersCount: ordersCount,
                        cardIdsList: cardIdsList,
                        noOfDays: noOfDays,
                        fromDate: fromDate,
                        toDate: toDate
                    } : null} prescriptionImagesList={prescriptionImagesList} orderTab={orderTab} orderIdsInfo={orderIdsInfo} orderInfo={orderInfo} orderActions={orderActions} orderDisplayStatus={orderDisplayStatus}
                    ePrescDisplayStatus={ePrescDisplayStatus} deliveryPaymentMapping={deliveryPaymentMapping} refillId={refillId} modifiedBy={modifiedBy} orderDoctorMap={orderDoctorMap} orderCancelReasonType={orderCancelReasonType} getOrderDetails={getOrderDetails} toggle={toggle} cartOrderIds={cartOrderIds} />
            </HeaderComponent>:<></>}
            <FormsComponent headerText={"Delivery & Order Information"} id={"FormsComp"} className={`${selectedFormsSection ? "border" : ''} overflow-y-auto h-100 shadow-none`}>
                <OrderDelivaryInfo {...props}
                    ordersCount={Validate().isNotEmpty(ordersCount) ? {
                        cardIdsList: cardIdsList,
                        noOfDays: noOfDays,
                        fromDate: fromDate,
                        toDate: toDate
                    } : null} prescriptionImagesList={prescriptionImagesList} orderInfo={orderInfo} orderActions={orderActions} orderDisplayStatus={orderDisplayStatus}
                    ePrescDisplayStatus={ePrescDisplayStatus} deliveryPaymentMapping={deliveryPaymentMapping} refillId={refillId} modifiedBy={modifiedBy} orderDoctorMap={orderDoctorMap} orderCancelReasonType={orderCancelReasonType} getOrderDetails={getOrderDetails} toggle={toggle} cartOrderIds={cartOrderIds} forms={Validate().isNotEmpty(orderInfo) ? true : false} displayProductDetails={displayProductDetails} />

            </FormsComponent>
            <DataGridComponent id={"DataGridComp"} className="h-100 overflow-y-auto shadow-none">
                <div className="crm-modal h-100">
                    <div className={`custom-tabs-forms mobile-compatible-tabs d-flex justify-content-between pb-0`} ref={tabsRef}>
                        <Nav tabs className={`${cartOrderIds.length > 1 ? "sub-tabs" : ''}`}>
                            <NavItem>
                                <NavLink
                                    className={'orderStatus' === activeTab ? "active" : ""}
                                    onClick={() => setActiveTab('orderStatus')}
                                    style={{ 'border-top-left-radius': '0.375rem' }}
                                    href="#orderStatus"
                                >
                                    Order Status
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={'trackOrder' === activeTab ? "active" : ""}
                                    onClick={() => setActiveTab('trackOrder')}
                                    href="#trackOrder"
                                >
                                    Track Order
                                </NavLink>
                            </NavItem>
                            {orderInfo.aggregatedOrder &&
                                <NavItem>
                                    <NavLink
                                        className={'aggregateOrderDetails' === activeTab ? "active" : ""}
                                        onClick={() => setActiveTab('aggregateOrderDetails')}
                                        href="#aggregateOrderDetails"
                                    >
                                        Aggregate Order Details
                                    </NavLink>
                                </NavItem>
                            }
                            <NavItem>
                                <NavLink
                                    className={'tickets' === activeTab ? "active" : ""}
                                    onClick={() => setActiveTab('tickets')}
                                    href="#tickets"
                                >
                                    Tickets
                                </NavLink>
                            </NavItem>
                            {"SD" === orderInfo.status && "D" === orderInfo.deliveryType &&
                                ("O" === orderInfo.paymentType || "C" === orderInfo.paymentType) &&
                                "REDEMPTION" !== orderInfo.orderType && "PB_ORDER" !== orderInfo.orderType && 1 === orderInfo.promotionType &&
                                <NavItem>
                                    <NavLink
                                        className={'returnRequests' === activeTab ? "active" : ""}
                                        onClick={() => setActiveTab('returnRequests')}
                                        href="#returnRequests"
                                    >
                                        Return Request
                                    </NavLink>
                                </NavItem>
                            }
                            <NavItem>
                                <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                                    <NavLink
                                        className={`${'communicationDisplay' === activeTab ? "active" : ""} pe-lg-0`}
                                        onClick={() => setActiveTab('communicationDisplay')}
                                        href="#communicationDisplay"
                                        // style={{ 'padding-right': 0 }}
                                    >
                                        Communications
                                    </NavLink>

                                    <NavLink
                                        id="openCommunications"
                                        className={`${'communicationDisplay' === activeTab ? "active" : ""} hide-on-mobile `}
                                        onClick={() => gotoMartCustomerPage({ pageToRedirect: "Communication", customerId: orderInfo.customerId, locality: orderInfo.latLong, beautyCustomerId: orderInfo.beautyCustomerId, mobile: orderInfo.mobileNo, hubStoreId: orderInfo.hubStoreId }, handleFailure)}>
                                        <img src={CommunicationIcon} alt="Open Communications" />
                                        <UncontrolledTooltip placement="bottom" target={"openCommunications"}>
                                            Open Communication
                                        </UncontrolledTooltip>
                                    </NavLink>

                                </div>

                            </NavItem>
                        </Nav>
                        <Button variant="" className="text-primary rounded-0 btn btn-sm btn-link hide-on-mobile" onClick={() => { gotoTicketHistoryPage({ pageToRedirect: "ticket-history", locality: orderInfo.locality, beautyCustomerId: orderInfo.beautyCustomerId, email: orderInfo.email, mobile: orderInfo.mobileNo, customerId: orderInfo.customerId, orderId: orderInfo.displayOrderId }, handleFailure) }}>
                            Create Ticket</Button>
                    </div>
                    <div   id="OrderSearchModel"  ref={scrollContainerRef} onScroll={(element) => TrackScrolling(element, (activeTab) => setActiveTab(activeTab))} className="scroll-on-hover position-relative" style={{ "height": `calc(100% - ${tabsRef.current?.offsetHeight}px)`, "overflow-y": "auto" }}>
                        <div className="scrolling-tabs mh-unset" id="orderStatus" style={{ minHeight: "100%" }}>
                            <div className="card border-0 mh-unset" style={{ minHeight: `calc(${scrollContainerRef?.current?.offsetHeight}px - 24px)` }}>
                                {<OrderStatus orderInfo={orderInfo} orderStatus={orderStatus} shipmentStatus={shipmentStatus}
                                    userNameIdMap={userNameIdMap} userNames={userNames} omsOrderReservedQty={omsOrderReservedQty}
                                    refundDetail={refundDetail} paymentDetail={paymentDetail} productIdMap={productIdMap}
                                    omsPaymentRecievedDate={omsPaymentRecievedDate} orderPaybackPointsMap={orderPaybackPointsMap}
                                    refundDeliveryCharges={refundDeliveryCharges} totalRefundAmount={totalRefundAmount} totalPBPoints={totalPBPoints} />}
                            </div>
                        </div>
                        <div className="scrolling-tabs p-12 mh-unset" id="trackOrder" style={{ minHeight: "100%" }}>
                            <div className="card border-0 mh-unset" style={{ minHeight: `calc(${scrollContainerRef?.current?.offsetHeight}px - 24px)` }}>
                                {<TrackOrder containerHeight={scrollContainerRef?.current?.offsetHeight - 24} orderId={orderInfo.orderId} />}
                            </div>
                        </div>
                        {Validate().isNotEmpty(aggregateOrderDetails) &&
                            <div className="scrolling-tabs p-2 mh-unset" id="aggregateOrderDetails" style={{ minHeight: "100%" }}>
                                <div className="card border-0 mh-unset" style={{ minHeight: `calc(${scrollContainerRef?.current?.offsetHeight}px - 24px)` }}>
                                    <AggregateOrderDetails aggregateOrderDetails={aggregateOrderDetails ? {
                                        aggregateOrderDetails: aggregateOrderDetails,
                                        storeIdNames: storeIdName
                                    } : {}} />
                                </div>
                            </div>}
                        <div className="scrolling-tabs p-12 mh-unset" id="tickets" style={{ minHeight: "100%" }}>
                            <div className="card border-0 mh-unset" style={{ minHeight: `calc(${scrollContainerRef?.current?.offsetHeight}px - 24px)` }}>
                                {<Tickets containerHeight={scrollContainerRef?.current?.offsetHeight - 24} orderInfo={orderInfo} />}
                            </div>
                        </div>
                        {"SD" === orderInfo.status && "D" === orderInfo.deliveryType &&
                            ("O" === orderInfo.paymentType || "C" === orderInfo.paymentType) &&
                            "REDEMPTION" !== orderInfo.orderType && "PB_ORDER" !== orderInfo.orderType && 1 === orderInfo.promotionType &&
                            <div className="scrolling-tabs p-12 mh-unset" id="returnRequests" style={{ minHeight: "100%" }}>
                                <div className="card border-0 mh-unset" style={{ minHeight: `calc(${scrollContainerRef?.current?.offsetHeight}px - 24px)` }}>
                                    {<ReturnRequests orderInfo={orderInfo} />}
                                </div>
                            </div>}
                        <div className="scrolling-tabs p-12 mh-unset mb-5 mb-lg-0" id="communicationDisplay" style={{ minHeight: "100%" }}>
                            <div className="card mh-unset" style={{ minHeight: `calc(${scrollContainerRef?.current?.offsetHeight}px - 24px)` }}>
                                {<CommunicationDisplay containerHeight={scrollContainerRef?.current?.offsetHeight - 24} displayOrderId={orderInfo.displayOrderId} orderId={orderInfo.orderId} orderType={"M"} customerId={props.customerId} />}
                            </div>
                        </div>
                    </div>
                </div>
            </DataGridComponent>
        </DetailWrapper>
    </React.Fragment>
}

