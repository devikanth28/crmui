import React, { useContext, useState } from 'react'
import OrderService from '../../services/Order/OrderService';
import { AlertContext } from '../Contexts/UserContext';
import Validate from '../../helpers/Validate';
import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import { Form, Button } from 'react-bootstrap';
import MartOrderCancelForm from './MartOrderCancelForm';
import OrderActionForms from './OrderActionForms';
import SendSmsToCustomer from '../../helpers/SendSmsToCustomer';
import CustomerService from '../../services/Customer/CustomerService';

const OrderSearchButtons = (props) => {
    const orderInfo = props.orderInfo;
    const orderCancelReasonType = props.orderCancelReasonType;
    const orderActions = props.orderActions;
    const shipmentOmsAddress = orderInfo.shipmentOmsAddress;
    const refillId = props.refillId;
    const modifiedBy = props.modifiedBy;
    const [action, setAction] = useState("");
    const [showActionForm, setShowActionForm] = useState("");
    const [updateDetailsForm, setUpdateDetailsForm] = useState(false);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [orderActionsForm, setOrderActionsForm] = useState(false);
    const { setStackedToastContent } = useContext(AlertContext);

    let atleastOneOrderAction = false;
    let orderActionsCount = 0;
    let custName = "";
    let mobileNo = "";
    if (Validate().isNotEmpty(shipmentOmsAddress.firstName)) {
        custName = shipmentOmsAddress.firstName;
    } else {
        custName = orderInfo.custName;
    }
    if (Validate().isNotEmpty(shipmentOmsAddress.shippingMobileNo)) {
        mobileNo = shipmentOmsAddress.shippingMobileNo;
    } else {
        mobileNo = orderInfo.mobileNo;
    }


    Object.entries(orderActions).forEach(([key, value]) => {
        if (value && (key !== "showAddPatientOption" && key !== "showEditAddressOption" && key !== "showEditPatientOption" && key !== "showSendSmsOption")) {
            orderActionsCount = orderActionsCount + 1;
            atleastOneOrderAction = true;
            return
        }
    });


    const unsubscribeRefillOrder = () => {
        setAction("unsubscribeRefillOrder");
        setActionInProgress(true);
        if (Validate().isEmpty(refillId)) {
            setStackedToastContent({ toastMessage: "Empty Refill Id" })
            setActionInProgress(false);
            return false;
        }
        const requestParameters = {
            'refillId': refillId,
            'modifiedBy': modifiedBy,
        };
        OrderService().unsubscribeRefillOrder(requestParameters).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setStackedToastContent({ toastMessage: "Refill order Unsubscribed Successfully!" });
                props.getOrderDetails();
                closeActionForms();
            } else {
                setStackedToastContent({ toastMessage: "Unable to unsubscribe refill order, Please try again" })
            }
        }, (err) => {
            console.log(err);
        })
        setActionInProgress(false);
    }


    const closeActionForms = () => {
        getActionForm();
    }

    const getActionForm = (actionFormToRender) => {
        if (showActionForm === actionFormToRender) {
            setShowActionForm("");
            setUpdateDetailsForm(false);
            setOrderActionsForm(false);
        } else {
            if (['addPatientDetailsForm', 'editOrderDetailsForm'].includes(actionFormToRender)) {
                setShowActionForm(actionFormToRender);
                setUpdateDetailsForm(true);
                setOrderActionsForm(false);
            } else {
                setShowActionForm(actionFormToRender);
                setUpdateDetailsForm(false);
                setOrderActionsForm(true);
            }
        }
    }



    const convertToCod = () => {
        setAction("convertToCod");
        setActionInProgress(true);
        if (Validate().isEmpty(orderInfo.orderId)) {
            setStackedToastContent({ toastMessage: "Empty Order Id" })
            return false;
        }
        const requestParameters = {
            'orderId': orderInfo.orderId,
            'cartId': orderInfo.cartId,
        };
        OrderService().convertToCod(requestParameters).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setStackedToastContent({ toastMessage: "Payment type converted to COD Successfully!" });
                props.getOrderDetails();
                closeActionForms()
            } else {
                setStackedToastContent({ toastMessage: "Unable to update payment type, Please try again" })
            }
        }, (err) => {
            console.log(err);
        })
        setTimeout(() => {
            setActionInProgress(false);
        }, 1000)
    }

    const approveOrder = () => {
        setAction("approveOrder");
        setActionInProgress(true);
        if (Validate().isEmpty(orderInfo.orderId)) {
            setStackedToastContent({ toastMessage: "Empty Order Id" })
            return false;
        }
        const requestParameters = {
            'orderId': orderInfo.orderId,
            'orderType': orderInfo.orderType,
        };
        OrderService().approveWebOrder(requestParameters).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setStackedToastContent({ toastMessage: "Order approved Successfully!" })
                props.getOrderDetails();
                closeActionForms()
            } else {
                setStackedToastContent({ toastMessage: "Unable to approve order, Please try again" })
            }
        }, (err) => {
            console.log(err);
        })
        setActionInProgress(false);
    }

    const sendSmsToDoctor = () => {
        setAction("sendSmsToDoctor");
        setActionInProgress(true);
        const requestParameters = {
            'cartId': orderInfo.cartId,
            'orderId': orderInfo.orderId,
            'mobileNo': mobileNo,
            'orderAmount': orderInfo.orderAmount,
            'customerId': orderInfo.customerId,
            'status': orderInfo.status,
            'customerName': custName
        };
        OrderService().requestEPrescription(requestParameters).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setStackedToastContent({ toastMessage: "Requested e-prescription successfully!" })
                props.getOrderDetails();
                closeActionForms();
            } else {
                setStackedToastContent({ toastMessage: "Unable to request e-prescription, Please try again" })
            }
        }, (err) => {
            console.log(err);
        })
        setActionInProgress(false);
    }

    const sendRetryPaymentLink = () => {
        setAction("sendRetryPaymentLink");
        setActionInProgress(true);
        if (Validate().isEmpty(orderInfo.cartId)) {
            setStackedToastContent({ toastMessage: "Empty Cart Id" })
            return false;
        }
        const requestParameters = {
            'cartId': orderInfo.cartId,
            'mobileNo': mobileNo,
            'displayOrderId': orderInfo.displayOrderId,
            'emailId': orderInfo.email,
            'orderId': orderInfo.orderId,
            'status': orderInfo.status,
            'paymentType': orderInfo.paymentType
        };
        OrderService().sendRetryPaymentLink(requestParameters).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setStackedToastContent({ toastMessage: "Payment link sent successfully!" })
                props.getOrderDetails();
                closeActionForms();
            } else {
                setStackedToastContent({ toastMessage: "Unable to send payment link, Please try again" })
            }
        }, (err) => {
            console.log(err);
        })
        setActionInProgress(false);
    }
    
     const sendPaymentLinkToCustomer = () =>{
        setAction("sendPaymentLinkToCustomer")
        setActionInProgress(true);
        if(Validate().isEmpty(orderInfo.cartId)){
            setToastContent({toastMessage: "Cart ID is empty"})
            return false;
        }
        OrderService().sendPaymentLinkForMartOrder({'orderId': orderInfo.orderId}).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setToastContent({ toastMessage: "Payment link sent successfully!" })
                props.getOrderDetails();
                closeActionForms();
            } else {
                setToastContent({ toastMessage: response.message? response.message : "Unable to send payment link, Please try again" })
            }
        }, (err) => {
            console.log(err);
        })
        setActionInProgress(false);
    }
    
    const sendStoreDetails = () => {
        setActionInProgress(true);
        const sendStoreInfoParams = {
            'mobileNo': orderInfo.mobileNo,
            'storeId': orderInfo.pickStoreId,
        };
        CustomerService().getStoreInfo(sendStoreInfoParams).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setStackedToastContent({ toastMessage: "Store detail sent to customer successfully" })
            } else {
                setStackedToastContent({ toastMessage: "There was a problem sending store details." })
            }
            setActionInProgress(false);
        }, (err) => {
            console.log(err);
            setActionInProgress(false);
        })
    }

    return ( 
        <React.Fragment>
            <div className='d-flex gap-2'>
                    {(orderActions.showSendSmsOption || atleastOneOrderAction) && <div className='d-flex justify-content-between gap-2' style={{'padding-bottom':'0.75rem'}}>
                        {props.showClaimButton && <div className='separator-end'>
                            <Button variant="outline-dark" size="sm" onClick={() => { Validate().isEmpty(props.orderIdsInfo[props.orderTab].dataSetrow.claimedBy) ? props.setToggleConfirmation(true) : props.ForceClaimClick() }} >
                            Claim Order</Button>
                        </div>}
                        {props.showUnclaimButton && <div className='separator-end'>
                            <Button variant="outline-dark" size="sm" onClick={() => { props.setToggleConfirmation(true) }}>
                                Unclaim Order</Button>    
                        </div>}                        
                        {orderActions.showSendSmsOption ?
                                <div className='separator-end'>
                                    <SendSmsToCustomer orderType="MART" customerName={custName} refillId={refillId} mobileNo={mobileNo} customerId={orderInfo.customerId} displayOrderId={orderInfo.displayOrderId} />
                                </div>
                            : null
                        }
                        {atleastOneOrderAction
                            ? orderActionsCount >= 4
                                ? <React.Fragment>
                                        {orderActions.showSendToDoctorOption ? <div className='separator-end'><Button variant="outline-dark" className="btn-sm px-3" disabled={actionInProgress ? 'disabled' : ''} onClick={sendSmsToDoctor}>{actionInProgress && action === "sendSmsToDoctor" ? <CustomSpinners spinnerText={"Send Payment Link"} className={" spinner-position"} innerClass={"invisible"} /> : "Send to Doctor"}</Button></div> : ""}
                                        {/* {orderActions.showSendPaymentLinkOption ? <div className='separator-end'><Button variant="outline-dark" className="btn-sm px-3" disabled={actionInProgress ? 'disabled' : ''} onClick={sendRetryPaymentLink}>{actionInProgress && action === "sendRetryPaymentLink" ? <CustomSpinners spinnerText={"Send Payment Link"} className={" spinner-position"} innerClass={"invisible"} /> : "Send Payment Link"}</Button></div> : ""} */}
                                		{orderActions.showSendPaymentLinkOption ? <div className='separator-end'><Button variant="outline-dark" className="btn-sm px-3" disabled={actionInProgress ? 'disabled' : ''} onClick={sendPaymentLinkToCustomer}>{actionInProgress && action === "sendPaymentLinkToCustomer" ? <CustomSpinners spinnerText={"Send Payment Link"} className={" spinner-position"} innerClass={"invisible"} /> : "Send Payment Link"}</Button></div> : ""}
                                        
                                        {orderActions.showUnsubscribeOption
                                            ? <div className='separator-end'><Button variant=" " className="brand-secondary btn-sm" disabled={actionInProgress ? 'disabled' : ''} onClick={unsubscribeRefillOrder}>{actionInProgress && action === "unsubscribeRefillOrder" ? <CustomSpinners spinnerText={"Unsubscribe Refill"} className={" spinner-position"} innerClass={"invisible"} /> : "Unsubscribe Refill"}</Button></div>
                                            : null}
                                        {orderActions.showRescheduleOption
                                            ? <div className='separator-end'><Button variant="outline-dark" className="btn-sm px-3" disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("reScheduleForm")}>
                                                Reschedule
                                            </Button></div>
                                            : null}

                                        {orderActions.showConvertToCodOption
                                            ? <div className='separator-end'><Button variant="outline-dark" className="btn-sm" disabled={actionInProgress ? 'disabled' : ''} onClick={convertToCod}>
                                                {actionInProgress && action === "convertToCod" ? <CustomSpinners spinnerText={"Convert To COD"} className={" spinner-position"} innerClass={"invisible"} /> : "Convert To COD"}
                                            </Button></div> : null}
                                                                                
                                        {orderActions.showRequestCancelOrderOption
                                            ? <div className='separator-end'><Button className="btn-sm px-3" variant="outline-dark" disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("requestCancelForm")}>
                                                Request Cancel
                                            </Button></div>
                                            : null}
                                        
                                        {orderInfo.deliveryType === "S" ? <div className='separator-end'><Button className="btn-sm px-3" variant='outline-dark' disabled={actionInProgress ? 'disabled' : ''} onClick={(e) => { setActionInProgress(true), sendStoreDetails(e) }}>
                                                Send Store Details To Customer
                                            </Button></div> : null}
                                        {orderActions.showCancelOption
                                            ? <div className='separator-end'><Button className="btn-sm px-3 brand-secondary" variant=' ' disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("cancelForm")}>
                                                Cancel
                                            </Button></div>
                                            : null}
                                        {orderActions.showApproveOption ?
                                            <div className='separator-end'><Button variant="success" className="btn-sm px-3" disabled={actionInProgress ? 'disabled' : ''} onClick={approveOrder}>{actionInProgress && action === "approveOrder" ? <CustomSpinners spinnerText={"Approve"} className={" spinner-position"} innerClass={"invisible"} /> : "Approve"}</Button></div> : null}
                                   
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    {orderActions.showSendToDoctorOption ? <div className='separator-end'><Button variant="outline-dark" className="btn-sm px-3" disabled={actionInProgress ? 'disabled' : ''} onClick={sendSmsToDoctor}>{actionInProgress && action === "sendSmsToDoctor" ? <CustomSpinners spinnerText={"Send Payment Link"} className={" spinner-position"} innerClass={"invisible"} /> : "Send to Doctor"}</Button></div> : ""}
                                    {/* {orderActions.showSendPaymentLinkOption ? <div className='separator-end'><Button variant="outline-dark" className="btn-sm px-3" disabled={actionInProgress ? 'disabled' : ''} onClick={sendRetryPaymentLink}>{actionInProgress && action === "sendRetryPaymentLink" ? <CustomSpinners spinnerText={"Send Payment Link"} className={" spinner-position"} innerClass={"invisible"} /> : "Send Payment Link"}</Button></div> : ""} */}
                                	{orderActions.showSendPaymentLinkOption ? <div className='separator-end'><Button variant="outline-dark" className="btn-sm px-3" disabled={actionInProgress ? 'disabled' : ''} onClick={sendPaymentLinkToCustomer}>{actionInProgress && action === "sendPaymentLinkToCustomer" ? <CustomSpinners spinnerText={"Send Payment Link"} className={" spinner-position"} innerClass={"invisible"} /> : "Send Payment Link"}</Button></div> : ""}
                                    {orderActions.showUnsubscribeOption
                                        ? <div className='separator-end'><Button variant="outline-dark" className="btn-sm px-3" disabled={actionInProgress ? 'disabled' : ''} onClick={unsubscribeRefillOrder}>{actionInProgress && action === "unsubscribeRefillOrder" ? <CustomSpinners spinnerText={"Unsubscribe Refill"} className={" spinner-position"} innerClass={"invisible"} /> : "Unsubscribe Refill"}</Button></div>
                                        : null}
                                    {orderActions.showRescheduleOption
                                        ? <div className='separator-end'><Button className="btn-sm px-3" variant="outline-dark" disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("reScheduleForm")}>
                                            Reschedule
                                        </Button></div>
                                        : null}
                                    {orderActions.showConvertToCodOption ? <div className='separator-end'><Button variant="outline-dark" className=" px-3 btn-sm" disabled={actionInProgress ? 'disabled' : ''} onClick={convertToCod}>
                                        {actionInProgress && action === "convertToCod" ? <CustomSpinners spinnerText={"Convert To COD"} className={" spinner-position"} innerClass={"invisible"} /> : "Convert To COD"}</Button></div> : null}
                                    {orderActions.showRequestCancelOrderOption
                                        ? <div className='separator-end'><Button className="btn-sm px-3" variant="outline-dark" disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("requestCancelForm")}>
                                            Request Cancel
                                        </Button></div>
                                        : null}
                                        {orderInfo.deliveryType === "S" ? <div className='separator-end'><Button className="btn-sm px-3" variant='outline-dark' disabled={actionInProgress ? 'disabled' : ''} onClick={(e) => { setActionInProgress(true), sendStoreDetails(e) }}>
                                                Send Store Details To Customer
                                            </Button></div> :null}
                                    {orderActions.showCancelOption
                                        ? <div className='separator-end'><Button className="btn-sm px-3 brand-secondary" variant=' ' disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("cancelForm")}>
                                            Cancel
                                        </Button></div>
                                        : null}
                                    {orderActions.showApproveOption ?
                                        <div className='separator-end'><Button variant="success" className="btn-sm" disabled={actionInProgress ? 'disabled' : ''} onClick={approveOrder}>{actionInProgress && action === "approveOrder" ? <CustomSpinners spinnerText={"Approve"} className={" spinner-position"} innerClass={"invisible"} /> : "Approve"}</Button></div> : null}
                                </React.Fragment>
                            : null
                        }
                    </div>}

                </div>
            <div>
            </div>

            {Validate().isNotEmpty(showActionForm) && orderActionsForm
                ? showActionForm === "cancelForm" || showActionForm === "requestCancelForm" || showActionForm === "reScheduleForm"
                    ? <div className='mt-3'>
                        <MartOrderCancelForm showCancelModal={orderActionsForm} setShowCancelModal={setOrderActionsForm} setActionInProgress={setActionInProgress} actionFormToRender={showActionForm} orderCancelReasonType={orderCancelReasonType} orderInfo={orderInfo} mobileNo={mobileNo} getOrderDetails={props.getOrderDetails} closeActionForms={closeActionForms} setDisableMode={props.setDisableMode} disableMode={props.disableMode} title={showActionForm === "cancelForm" ? "Do you want to cancel this order" : showActionForm === "requestCancelForm" ? "Do you want to request cancel for this order" : showActionForm === "reScheduleForm" ? "Do you want to reschedule this order" : null} />
                    </div>
                    : <div className='mt-3'>
                        <OrderActionForms setActionInProgress={setActionInProgress} actionFormToRender={showActionForm} orderCancelReasonType={orderCancelReasonType} orderInfo={orderInfo} mobileNo={mobileNo} getOrderDetails={props.getOrderDetails} closeActionForms={closeActionForms} setDisableMode={props.setDisableMode} disableMode={props.disableMode} />
                    </div>
                : null
            }
        </React.Fragment>
    )
}
export default OrderSearchButtons