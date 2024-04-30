
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { CustomSpinners, TOAST_POSITION } from "@medplus/react-common-components/DynamicForm";
import Validate from "../../helpers/Validate";
import CloseIcon from '../../images/cross.svg';
import OrderService from "../../services/Order/OrderService";
import OrderDelivaryInfo from "../order/OrderDeliveryInfo";
import AggregateOrderDetails from "./AggregateOrderDetails";
import OrderStatus from "./OrderStatus";
import { gotoMartCustomerPage } from "../../helpers/CommonRedirectionPages";
import ReturnRequests from "./ReturnRequest/ReturnRequests";
import Tickets from "./Tickets";
import TrackOrder from "./TrackOrder";
import { AlertContext, DetailModelOpened } from "../Contexts/UserContext";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import OrderHelper from "../../helpers/OrderHelper";
import { DataGridComponent, DetailWrapper, FormsComponent } from "../Common/CommonModel";

const OrderDetailModal = (props) => {

    const [loading, isLoading] = useState(false);

    const [orderInfo, setOrderInfo] = useState(undefined);
    const [orderActions, setOrderActions] = useState(undefined);
    const [ordersCount, setOrdersCount] = useState(undefined);
    const [orderStatus, setOrderStatus] = useState(undefined);
    const [orderDoctorMap, setOrderDoctorMap] = useState(undefined);
    const [orderCancelReasonType, setOrderCancelReasonType] = useState(undefined);
    const [orderDisplayStatus, setOrderDisplayStatus] = useState(undefined);
    const [omsOrderReservedQty, setOmsOrderReservedQty] = useState(undefined);
    const [omsPaymentRecievedDate, setOmsPaymentRecievedDate] = useState(undefined);
    const [orderPaybackPointsMap, setOrderPaybackPointsMap] = useState(undefined);
    const [refundDetail, setRefundDetail] = useState(undefined);
    const [paymentDetail, setPaymentDetail] = useState(undefined);
    const [productIdMap, setProductIdMap] = useState(undefined);
    const [deliveryPaymentMapping, setDeliveryPaymentMapping] = useState(undefined);
    const [ePrescDisplayStatus, setEPrescDisplayStatus] = useState(undefined);
    const [refillId, setRefillId] = useState(undefined);
    const [modifiedBy, setModifiedBy] = useState(undefined);
    const [aggregateOrderDetails, setAggregateOrderDetails] = useState(undefined);
    const [shipmentStatus, setShipmentStatus] = useState(undefined);
    const [userNameIdMap, setUserNameIdMap] = useState(undefined);
    const [userNames, setUserNames] = useState(undefined);
    const [refundDeliveryCharges, setRefundDeliveryCharges] = useState(undefined);
    const [totalRefundAmount, setTotalRefundAmount] = useState(undefined);
    const [totalPBPoints, setTotalPBPoints] = useState(undefined);
    const { setStackedToastContent } = useContext(AlertContext);
    const [activeTab, setActiveTab] = useState('1');
    const [prescriptionImagesList, setPrescriptionImagesList] = useState([]);
    const headerRef = useRef(0);
    const { selectedFormsSection ,setSelectedFormsSection} = useContext(DetailModelOpened)

    const handleFailure = () => {
        setStackedToastContent({ toastMessage: "Customer is Already Opened", position: TOAST_POSITION.BOTTOM_START })
      }
    
    /* this use effect is used to get order details on model true */
    useEffect(() => {
        getOrderDetails();
    }, [props.showModal]);

    /* this use effect is used to get prescription details whenever prescription orderId changes */
    useEffect(() => {
        getPrescriptionDetails(props.prescriptionOrderId)
    },[props.prescriptionOrderId])

    const getOrderDetails = async () => {
        isLoading(true);
        await OrderService().getOrderDetails({ "orderId": props.orderId, "customerId": props.customerId }).then((response) => {
            if ("SUCCESS" === response.statusCode && Validate().isNotEmpty(response.dataObject)) {
                setOrderInfo(response.dataObject.orderInfo);
                setOrderDoctorMap(response.dataObject.orderDoctorMap);
                setOrderCancelReasonType(response.dataObject.orderCancelReasonType);
                setOrderActions(response.dataObject.orderActions);
                setOrderStatus(response.dataObject.orderStatus);
                setOrderDisplayStatus(response.dataObject.orderDisplayStatus);
                setOmsOrderReservedQty(response.dataObject.omsOrderReservedQty);
                setOmsPaymentRecievedDate(response.dataObject.omsPaymentRecievedDate);
                setOrderPaybackPointsMap(response.dataObject.orderPaybackPointsMap);
                setRefundDetail(response.dataObject.refundDetail);
                setPaymentDetail(response.dataObject.paymentDetail);
                setProductIdMap(response.dataObject.productIdMap);
                setDeliveryPaymentMapping(response.dataObject.deliveryPaymentMapping);
                setEPrescDisplayStatus(response.dataObject.ePrescDisplayStatus);
                setRefillId(response.dataObject.refillId);
                setModifiedBy(response.dataObject.modifiedBy);
                setShipmentStatus(response.dataObject.shipmentStatus);
                setUserNameIdMap(response.dataObject.userNameIdMap);
                setUserNames(response.dataObject.userNames);
                setRefundDeliveryCharges(response.dataObject.refundDeliveryCharges);
                setTotalRefundAmount(response.dataObject.totalRefundAmount);
                setTotalPBPoints(response.dataObject.totalPBPoints);
                if (Validate().isNotEmpty(response.dataObject.ordersCount)) {
                    setOrdersCount({
                        ordersCount: response.dataObject.ordersCount,
                        cardIdsList: response.dataObject.cardIdsList,
                        noOfDays: response.dataObject.noOfDays,
                        fromDate: response.dataObject.fromDate,
                        toDate: response.dataObject.toDate
                    });
                }
                if (Validate().isNotEmpty(response.dataObject.aggregateOrderDetails)) {
                    setAggregateOrderDetails({
                        aggregateOrderDetails: response.dataObject.aggregateOrderDetails,
                        storeIdNames: response.dataObject.storeIdName
                    });
                }
                if (Validate().isNotEmpty(response.dataObject.dataSetrow) && props.fromPage !== "FollowupForm") {
                    let temp = [...props.dataSet];
                    props.dataSet.forEach((element, index) => {
                        if (element.orderId === props.orderId) {
                            temp[index] = response.dataObject.dataSetrow;
                        }
                    });
                    props.setDataSet(temp);
                }
            }
        }, (err) => {
            console.log(err);
        })
        isLoading(false);
    }

    const getPrescriptionDetails = (prescriptionOrderId) => {
        OrderService().getPrescriptionDetails({ prescriptionOrderId: prescriptionOrderId }).then(res => {
            if ("SUCCESS" === res.statusCode && Validate().isNotEmpty(res.dataObject)) {
                setPrescriptionImagesList(res.dataObject.prescriptionOrder.imageList);
            }
        }, err => {
            console.log(err);
        })
    }

    const orderDisplayStatusClass = OrderHelper().getBadgeColorClassForStatus(orderDisplayStatus) + " badge rounded-pill ms-3";
    const toggle = () => props.setOpenOrderDetailModal(!props.openOrderDetailModal);

    return <React.Fragment>
        <div className="custom-modal header">
            <Wrapper className="m-0">
                <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-1">
                {orderInfo &&
                        <>
                            <p className="mb-0">Order Details for {"REDEMPTION" === orderInfo.orderType ? 'Redemption Order ID' : 'Order ID'}: <span className="font-weight-bold">{orderInfo.displayOrderId}({orderInfo.orderId})</span>
                                <span className={orderDisplayStatusClass}>{orderDisplayStatus}</span>
                            </p>
                            <div class=" d-flex align-items-center">
                                <Button variant=" " onClick={() => props.setOpenOrderDetailModal(false)} className="rounded-5 icon-hover btn-link">
                                <span className='custom-close-btn icon-hover'></span>
                                </Button>
                            </div>
                            </>}
                </HeaderComponent>
                {console.log("loading",loading)}
                <BodyComponent allRefs={{"headerRef":headerRef}} className="body-height" loading={loading}>
                    {!loading && 
                <DetailWrapper modalType={"MART"}>                   
                            <FormsComponent headerText={"Delivery & Order Information"} id={"FormsComp"} className={`${selectedFormsSection ? "border" : ''} overflow-y-auto h-100 shadow-none`}>
                            {orderInfo && !loading && <OrderDelivaryInfo {...props} ordersCount={ordersCount} prescriptionImagesList={prescriptionImagesList} orderInfo={orderInfo} orderActions={orderActions} orderDisplayStatus={orderDisplayStatus} ePrescDisplayStatus={ePrescDisplayStatus} deliveryPaymentMapping={deliveryPaymentMapping} refillId={refillId} modifiedBy={modifiedBy} orderDoctorMap={orderDoctorMap} orderCancelReasonType={orderCancelReasonType} getOrderDetails={getOrderDetails} toggle={toggle} />}
                            </FormsComponent>
                            <DataGridComponent id={"DataGridComp"} className="h-100 overflow-y-auto shadow-none">
                            {orderInfo && !loading &&
                                         <div className="h-100 crm-modal">
                                            <div className={`custom-tabs-forms mobile-compatible-tabs d-flex justify-content-between pb-0`}>
                                                <Nav tabs>
                                                    <NavItem>
                                                        <NavLink
                                                            className={'1' === activeTab ? "active" : ""}
                                                            onClick={() => setActiveTab('1')}
                                                        >
                                                            Order Status
                                                        </NavLink>
                                                    </NavItem>
                                    {!props.hideTrackOrder &&
                                     <NavItem>
                                                        <NavLink
                                                            className={'2' === activeTab ? "active" : ""}
                                                            onClick={() => setActiveTab('2')}
                                                        >
                                                            Track Order
                                                        </NavLink>
                                                    </NavItem>
                                    }
                                    {orderInfo.aggregatedOrder &&
                                                        <NavItem>
                                                            <NavLink
                                                                className={'3' === activeTab ? "active" : ""}
                                                                onClick={() => setActiveTab('3')}
                                                            >
                                                                Aggregate Order Details
                                                            </NavLink>
                                                        </NavItem>
                                                    }
                                    {!props.hideTickets &&
                                    <NavItem>
                                                        <NavLink
                                                            className={'4' === activeTab ? "active" : ""}
                                                            onClick={() => setActiveTab('4')}
                                                        >
                                                            Tickets
                                                        </NavLink>
                                                    </NavItem>
                                    }
                                    {"SD" === orderInfo.status && "D" === orderInfo.deliveryType &&
                                                        ("O" === orderInfo.paymentType || "C" === orderInfo.paymentType) &&
                                                        "REDEMPTION" !== orderInfo.orderType && "PB_ORDER" !== orderInfo.orderType && 1 === orderInfo.promotionType &&
                                                        <NavItem>
                                                            <NavLink
                                                                className={'5' === activeTab ? "active" : ""}
                                                                onClick={() => setActiveTab('5')}
                                                            >
                                                                Return Request
                                                            </NavLink>
                                                        </NavItem>
                                                    }
                                </Nav>
                                <Button variant=" " className="text-primary rounded-0 btn btn-sm btn-link"  onClick={() => { gotoMartCustomerPage({ pageToRedirect: "ticket-history", locality: orderInfo.locality, beautyCustomerId: orderInfo.beautyCustomerId, email: orderInfo.email, mobile: orderInfo.mobileNo, customerId: orderInfo.customerId, orderId: orderInfo.displayOrderId }, handleFailure) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" id="ticket_black_icon_18px" width="16" height="16" viewBox="0 0 16 16" className="me-2">
                                            <rect id="Rectangle_3652" data-name="Rectangle 3652" width="16" height="16" fill="none" />
                                            <g id="ticket" transform="translate(0.5 1.214)">
                                                <path id="Subtraction_50" data-name="Subtraction 50" d="M-2590.536-17225.637a.193.193,0,0,1-.177-.109l-2.778-2.5h-3.2a1.408,1.408,0,0,1-1.406-1.406v-3.021a3.221,3.221,0,0,0,.563-.094v3.115a.855.855,0,0,0,.844.844h3.305a.245.245,0,0,1,.173.074l2.393,2.141v-1.934a.3.3,0,0,1,.281-.281h2.5a.855.855,0,0,0,.844-.844v-5.762a.855.855,0,0,0-.844-.844h-7.059a3.254,3.254,0,0,0-.1-.562h7.163a1.408,1.408,0,0,1,1.406,1.406v5.8a1.408,1.408,0,0,1-1.406,1.406h-2.215v2.289a.276.276,0,0,1-.177.246A.127.127,0,0,1-2590.536-17225.637Zm.844-4.643h-3.729a.3.3,0,0,1-.277-.281.3.3,0,0,1,.277-.281h3.729a.305.305,0,0,1,.281.281A.305.305,0,0,1-2589.692-17230.279Zm0-1.969h-5.417a.269.269,0,0,1-.242-.281.305.305,0,0,1,.281-.281h5.378a.305.305,0,0,1,.281.281A.305.305,0,0,1-2589.692-17232.248Zm0-1.934h-5.417a.269.269,0,0,1-.242-.281.305.305,0,0,1,.281-.281h5.378a.305.305,0,0,1,.281.281A.305.305,0,0,1-2589.692-17234.182Z" transform="translate(2601.635 17239.213)" fill="#1c3ffd" />
                                                <g id="Group_33186" data-name="Group 33186" transform="translate(0 0)">
                                                    <g id="Group_33185" data-name="Group 33185" transform="translate(0 0)">
                                                        <path id="Path_50477" data-name="Path 50477" d="M231.278,346.686a3.278,3.278,0,1,1,3.278-3.278A3.282,3.282,0,0,1,231.278,346.686Zm0-6.07a2.793,2.793,0,1,0,2.792,2.793A2.8,2.8,0,0,0,231.278,340.616Z" transform="translate(-228 -340.13)" fill="#1c3ffd" />
                                                        <path id="Path_50478" data-name="Path 50478" d="M307.779,350.563a.242.242,0,0,1-.2-.1l-1.247-1.781a.243.243,0,0,1,.4-.278l1.247,1.781a.242.242,0,0,1-.06.338A.239.239,0,0,1,307.779,350.563Z" transform="translate(-304.178 -348.076)" fill="#1c3ffd" />
                                                        <path id="Path_50479" data-name="Path 50479" d="M351.326,347.918a.242.242,0,0,1-.2-.1l-1.143-1.631a.243.243,0,1,1,.4-.278l1.143,1.631a.242.242,0,0,1-.06.338A.239.239,0,0,1,351.326,347.918Z" transform="translate(-346.652 -345.648)" fill="#1c3ffd" />
                                                        <path id="Path_50480" data-name="Path 50480" d="M303.138,486.484a.24.24,0,0,1-.171-.071,1.277,1.277,0,0,0-1.8,0,.243.243,0,0,1-.343-.343,1.762,1.762,0,0,1,2.49,0,.243.243,0,0,1-.172.414Z" transform="translate(-298.787 -481.634)" fill="#1c3ffd" />
                                                    </g>
                                                </g>
                                            </g>
                                 </svg>Create Ticket</Button>
                            </div>
                            <TabContent activeTab={activeTab}>
                                                <TabPane tabId="1">
                                                    {'1' === activeTab && <OrderStatus orderInfo={orderInfo} orderStatus={orderStatus} shipmentStatus={shipmentStatus} userNameIdMap={userNameIdMap} userNames={userNames} omsOrderReservedQty={omsOrderReservedQty} refundDetail={refundDetail} paymentDetail={paymentDetail} productIdMap={productIdMap} omsPaymentRecievedDate={omsPaymentRecievedDate} orderPaybackPointsMap={orderPaybackPointsMap} refundDeliveryCharges={refundDeliveryCharges} totalRefundAmount={totalRefundAmount} totalPBPoints={totalPBPoints} />}
                                                </TabPane>
                                                <TabPane tabId="2">
                                                    {'2' === activeTab && <TrackOrder orderId={orderInfo.orderId} />}
                                                </TabPane>
                                                <TabPane tabId="3">
                                                    {'3' === activeTab && <AggregateOrderDetails aggregateOrderDetails={aggregateOrderDetails} />}
                                                </TabPane>
                                                <TabPane tabId="4">
                                                    {'4' === activeTab && <Tickets orderInfo={orderInfo} />}
                                                </TabPane>
                                                <TabPane tabId="5">
                                                    {'5' === activeTab && <ReturnRequests orderInfo={orderInfo} />}
                                                </TabPane>
                                            </TabContent>
                         				</div>}
                                         </DataGridComponent>
                    </DetailWrapper>
                    }
                </BodyComponent>
            </Wrapper>
                
    </div>
    </React.Fragment>
}

export default OrderDetailModal;