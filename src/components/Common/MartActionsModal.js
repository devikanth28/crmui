import React, { useContext, useRef, useState, useEffect } from "react";
import Validate from "../../helpers/Validate";
import { Button } from "react-bootstrap";
import { AlertContext } from "../Contexts/UserContext";
import { CustomSpinners, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import CustomerService from "../../services/Customer/CustomerService";
import FormHelpers from "../../helpers/FormHelpers";
import Form from 'react-bootstrap/Form';
import OrderService from "../../services/Order/OrderService";
import MartOrderCancelForm from "../order/MartOrderCancelForm";
import OrderActionForms from "../order/OrderActionForms";

const MartActionsModal = ({ helpers, children, showActionModal, closeActionsModal, ...props }) => {

    const propsObj = props?.props?.children?.props;

    const orderInfo = propsObj?.orderInfo;
    const orderCancelReasonType = propsObj?.orderCancelReasonType;
    const orderActions = propsObj?.orderActions;
    const shipmentOmsAddress = orderInfo.shipmentOmsAddress;
    const refillId = propsObj?.refillId;
    const modifiedBy = propsObj?.modifiedBy;
    const showClaimButton = propsObj?.showClaimButton;
    const showUnClaimButton = propsObj?.showUnclaimButton;
    const getOrderDetails = propsObj?.getOrderDetails;
    const disableMode = propsObj?.disableMode;
    const setDisableMode = propsObj?.setDisableMode;
    const orderIdsInfo = propsObj?.orderIdsInfo;
    const setToggleConfirmation = propsObj?.setToggleConfirmation;
    const ForceClaimClick = propsObj?.ForceClaimClick;

    const customerId = orderInfo?.customerId;
    const displayOrderId = orderInfo?.displayOrderId;

    const [action, setAction] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [smsOptions, setSmsOptions] = useState({});
    const [updateDetailsForm, setUpdateDetailsForm] = useState(false);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [orderActionsForm, setOrderActionsForm] = useState(false);
    const [showActionForm, setShowActionForm] = useState("");
    const [footerHeight,setFooterHeight] = useState(0);

    const footerRef = useRef();

    const { setStackedToastContent } = useContext(AlertContext);
    const validate = Validate();

    let atleastOneOrderAction = false;
    let orderActionsCount = 0;
    let customerName = "";
    let mobileNo = "";

    if (Validate().isNotEmpty(shipmentOmsAddress.firstName)) {
        customerName = shipmentOmsAddress.firstName;
    } else {
        customerName = orderInfo.custName;
    }
    if (Validate().isNotEmpty(shipmentOmsAddress.shippingMobileNo)) {
        mobileNo = shipmentOmsAddress.shippingMobileNo;
    } else {
        mobileNo = orderInfo.mobileNo;
    }

    let sendSmsObject = {
        'mobileNo': mobileNo,
        'prescriptionId': displayOrderId,
        'customerId': customerId,
        'customerName': customerName,
    };

    useEffect(() => {
        setSmsOptions({
            'Corona19': 'Corona_19',
            'customerNotResponding': 'Customer is not reachable/responding',
            'prescrNotValid': 'Prescription not valid/available',
            'wrongLocation': 'Wrong Pincode/Location',
            'serviceNotAvailable': 'Service not available',
            'orderCannotProcessed': 'Order cannot be processed',
            'paymentFailed': 'Payment failed-COD Available',
            'omsOrderEdited': 'Products Not Available(Edited)',
            'paymentFailedCODNotAvailable': 'Payment failed-COD Not Available',
            'multipleOrder': 'Multiple Order'
        });
        if (Validate().isNotEmpty(refillId)) {
            setSmsOptions({ ...smsOptions, 'refillOrderCustomerNotResponding': 'Refill-Customer is not reachable/responding' });
        }
    }, [])

    useEffect(() => {
        if (validate.isNotEmpty(smsOptions)) {
            helpers.addForm(FormHelpers().getSelectSmsForm(smsOptions, helpers));
        }
    }, [smsOptions]);

    const sendSmsToCustomer = () => {
        if (validate.isEmpty(selectedOption)) {
            setStackedToastContent({ toastMessage: "Please select a message to send SMS" });
            return false;
        }
        sendSmsObject = { ...sendSmsObject, 'smsTemplate': selectedOption, 'orderType': orderInfo.orderType }
        sendSms(sendSmsObject);
    }

    const sendSms = async (sendSmsObject) => {
        if (validate.isNotEmpty(sendSmsObject)) {
            const data = await CustomerService().sendSms(sendSmsObject).then(data => {
                if (data && data.statusCode === "SUCCESS") {
                    setStackedToastContent({ toastMessage: "SMS sent successfully!" });
                    helpers.updateValue(null, "smsSelected", false);
                    closeActionsModal();
                } else {
                    setStackedToastContent({ toastMessage: "error while sending sms, please try again" });
                }
            }).catch((err) => {
                console.log(err)
            });
            return data;
        }
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
            closeActionsModal();
            return false;
        }
        const requestParameters = {
            'refillId': refillId,
            'modifiedBy': modifiedBy,
        };
        OrderService().unsubscribeRefillOrder(requestParameters).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setStackedToastContent({ toastMessage: "Refill order Unsubscribed Successfully!" });
                getOrderDetails();
                closeActionForms();
                closeActionsModal();
            } else {
                setStackedToastContent({ toastMessage: "Unable to unsubscribe refill order, Please try again" });
                closeActionsModal();
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
            setStackedToastContent({ toastMessage: "Empty Order Id" });
            closeActionsModal();
            return false;
        }
        const requestParameters = {
            'orderId': orderInfo.orderId,
            'cartId': orderInfo.cartId,
        };
        OrderService().convertToCod(requestParameters).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setStackedToastContent({ toastMessage: "Payment type converted to COD Successfully!" });
                getOrderDetails();
                closeActionForms();
                closeActionsModal();
            } else {
                setStackedToastContent({ toastMessage: "Unable to update payment type, Please try again" });
                closeActionsModal();
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
            setStackedToastContent({ toastMessage: "Empty Order Id" });
            closeActionsModal();
            return false;
        }
        const requestParameters = {
            'orderId': orderInfo.orderId,
            'orderType': orderInfo.orderType,
        };
        OrderService().approveWebOrder(requestParameters).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setStackedToastContent({ toastMessage: "Order approved Successfully!" })
                getOrderDetails();
                closeActionForms();
                closeActionsModal();
            } else {
                setStackedToastContent({ toastMessage: "Unable to approve order, Please try again" });
                closeActionsModal();
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
            'customerName': customerName
        };
        OrderService().requestEPrescription(requestParameters).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setStackedToastContent({ toastMessage: "Requested e-prescription successfully!" })
                getOrderDetails();
                closeActionForms();
                closeActionsModal();
            } else {
                setStackedToastContent({ toastMessage: "Unable to request e-prescription, Please try again" });
                closeActionsModal();
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
            setStackedToastContent({ toastMessage: "Empty Cart Id" });
            closeActionsModal();
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
                getOrderDetails();
                closeActionForms();
                closeActionsModal();
            } else {
                setStackedToastContent({ toastMessage: "Unable to send payment link, Please try again" });
                closeActionsModal();
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
                setStackedToastContent({ toastMessage: "Store detail Sent to customer successfully" });
                closeActionsModal();
            } else {
                setStackedToastContent({ toastMessage: "There was a problem sending store details." });
                closeActionsModal();
            }
            setActionInProgress(false);
        }, (err) => {
            console.log(err);
            setActionInProgress(false);
        })
    }

    useEffect(() => {
        if (validate.isNotEmpty(footerRef) && validate.isNotEmpty(footerRef.current)) {
            setFooterHeight(footerRef.current.offsetHeight);
        }
        else {
            setFooterHeight(0);
        }
    }, [selectedOption]);

    return (
        <React.Fragment>
            <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ height: `calc(100% - ${footerHeight}px)` }}>
                {(orderActions.showSendSmsOption || atleastOneOrderAction || validate.isNotEmpty(showActionForm)) ? <React.Fragment>
                    {orderActions.showSendSmsOption
                        ? <React.Fragment>
                            <div className="d-flex flex-column">
                                <div className="px-3 py-2">
                                    <label className="dropdown-header text-muted font-12">Select SMS</label>
                                </div>
                                {smsOptions && Object.entries(smsOptions).map(([key, value]) => {
                                    return (
                                        <React.Fragment>
                                            <div className='px-3 sendItem py-2' onClick={() => setSelectedOption(key)}>
                                                <Form.Check
                                                    type={"radio"}
                                                    id={`${key}`}
                                                    label={`${value}`}
                                                    name="SendSmsOptions"
                                                    className='font-14 mb-0'
                                                    style={{ paddingTop: "2px" }}
                                                    checked={selectedOption == key}
                                                />
                                            </div>
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </React.Fragment>
                        : null
                    }
                    {(orderActions.showSendSmsOption || atleastOneOrderAction) &&
                        <React.Fragment>
                            {showClaimButton ?
                                <div className="px-3 py-2 sendItem" onClick={() => { validate.isEmpty(orderIdsInfo?.[orderTab]?.claimedBy) ? setToggleConfirmation(true) : ForceClaimClick() }}>
                                    <span className='font-14'>Claim Order</span>
                                </div>
                                : null}
                            {showUnClaimButton ?
                                <div className="px-3 py-2 sendItem" onClick={() => { setToggleConfirmation(true) }}>
                                    <span className='font-14'>Unclaim Order</span>
                                </div>
                                : null}
                        </React.Fragment>
                    }
                    {atleastOneOrderAction
                        ? orderActionsCount >= 4
                            ? <div className="d-flex flex-column">
                                <div className='d-flex flex-column'>
                                    {orderActions.showSendToDoctorOption
                                        ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={sendSmsToDoctor}>
                                            <span className='font-14'>{actionInProgress && action === "sendSmsToDoctor" ? <CustomSpinners spinnerText={"Send Payment Link"} className={" spinner-position"} innerClass={"invisible"} /> : "Send to Doctor"}</span>
                                        </div>
                                        : null}
                                    {orderActions.showSendPaymentLinkOption
                                        ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={sendRetryPaymentLink}>
                                            <span className='font-14'>{actionInProgress && action === "sendRetryPaymentLink" ? <CustomSpinners spinnerText={"Send Payment Link"} className={" spinner-position"} innerClass={"invisible"} /> : "Send Payment Link"}</span>
                                        </div>
                                        : null}

                                    {orderActions.showUnsubscribeOption
                                        ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={unsubscribeRefillOrder}>
                                            <span className='font-14'>{actionInProgress && action === "unsubscribeRefillOrder" ? <CustomSpinners spinnerText={"Unsubscribe Refill"} className={" spinner-position"} innerClass={"invisible"} /> : "Unsubscribe Refill"}</span>
                                        </div>
                                        : null}
                                    {orderActions.showRescheduleOption
                                        ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("reScheduleForm")}>
                                            <span className='font-14'>Reschedule</span>
                                        </div>
                                        : null}

                                    {orderActions.showConvertToCodOption
                                        ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={convertToCod}>
                                            <span className='font-14'>{actionInProgress && action === "convertToCod" ? <CustomSpinners spinnerText={"Convert To COD"} className={" spinner-position"} innerClass={"invisible"} /> : "Convert To COD"}</span>
                                        </div>
                                        : null}

                                    {orderActions.showRequestCancelOrderOption
                                        ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("requestCancelForm")}>
                                            <span className='font-14'>Request Cancel</span>
                                        </div>
                                        : null}

                                    {orderInfo.deliveryType === "S"
                                        ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={(e) => { setActionInProgress(true), sendStoreDetails(e) }}>
                                            <span className='font-14'>Send Store Details To Customer</span>
                                        </div>
                                        : null}
                                    {orderActions.showCancelOption
                                        ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("cancelForm")}>
                                            <span className='font-14'>Cancel</span>
                                        </div>
                                        : null}
                                    {orderActions.showApproveOption
                                        ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={approveOrder}>
                                            <span className='font-14'>{actionInProgress && action === "approveOrder" ? <CustomSpinners spinnerText={"Approve"} className={" spinner-position"} innerClass={"invisible"} /> : "Approve"}</span>
                                        </div>
                                        : null}
                                </div>
                            </div>
                            : <div className='d-flex flex-column'>
                                {orderActions.showSendToDoctorOption
                                    ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={sendSmsToDoctor}>
                                        <span className='font-14'>{actionInProgress && action === "sendSmsToDoctor" ? <CustomSpinners spinnerText={"Send Payment Link"} className={" spinner-position"} innerClass={"invisible"} /> : "Send to Doctor"}</span>
                                    </div>
                                    : null}
                                {orderActions.showSendPaymentLinkOption
                                    ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={sendRetryPaymentLink}>
                                        <span className='font-14'>{actionInProgress && action === "sendRetryPaymentLink" ? <CustomSpinners spinnerText={"Send Payment Link"} className={" spinner-position"} innerClass={"invisible"} /> : "Send Payment Link"}</span>
                                    </div>
                                    : null}

                                {orderActions.showUnsubscribeOption
                                    ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={unsubscribeRefillOrder}>
                                        <span className='font-14'>{actionInProgress && action === "unsubscribeRefillOrder" ? <CustomSpinners spinnerText={"Unsubscribe Refill"} className={" spinner-position"} innerClass={"invisible"} /> : "Unsubscribe Refill"}</span>
                                    </div>
                                    : null}
                                {orderActions.showRescheduleOption
                                    ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("reScheduleForm")}>
                                        <span className='font-14'>Reschedule</span>
                                    </div>
                                    : null}

                                {orderActions.showConvertToCodOption
                                    ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={convertToCod}>
                                        <span className='font-14'>{actionInProgress && action === "convertToCod" ? <CustomSpinners spinnerText={"Convert To COD"} className={" spinner-position"} innerClass={"invisible"} /> : "Convert To COD"}</span>
                                    </div>
                                    : null}

                                {orderActions.showRequestCancelOrderOption
                                    ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("requestCancelForm")}>
                                        <span className='font-14'>Request Cancel</span>
                                    </div>
                                    : null}
                                {orderInfo.deliveryType === "S"
                                    ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={(e) => { setActionInProgress(true), sendStoreDetails(e) }}>
                                        <span className='font-14'>Send Store Details To Customer</span>
                                    </div>
                                    : null}

                                {orderActions.showCancelOption
                                    ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={() => getActionForm("cancelForm")}>
                                        <span className='font-14'>Cancel</span>
                                    </div>
                                    : null}
                                {orderActions.showApproveOption
                                    ? <div className='px-3 sendItem py-2' disabled={actionInProgress ? 'disabled' : ''} onClick={approveOrder}>
                                        <span className='font-14'>{actionInProgress && action === "approveOrder" ? <CustomSpinners spinnerText={"Approve"} className={" spinner-position"} innerClass={"invisible"} /> : "Approve"}</span>
                                    </div>
                                    : null}
                            </div>
                        : null
                    }
                    {validate.isNotEmpty(showActionForm) && orderActionsForm
                        ? showActionForm === "cancelForm" || showActionForm === "requestCancelForm" || showActionForm === "reScheduleForm"
                            ? <div className='mt-3'>
                                <MartOrderCancelForm showCancelModal={orderActionsForm} setShowCancelModal={(showCancelModal) => { closeActionsModal(); setOrderActionsForm(showCancelModal); }} setActionInProgress={setActionInProgress} actionFormToRender={showActionForm} orderCancelReasonType={orderCancelReasonType} orderInfo={orderInfo} mobileNo={mobileNo} getOrderDetails={getOrderDetails} closeActionForms={closeActionForms} setDisableMode={setDisableMode} disableMode={disableMode} title={showActionForm === "cancelForm" ? "Do you want to cancel this order" : showActionForm === "requestCancelForm" ? "Do you want to request cancel for this order" : showActionForm === "reScheduleForm" ? "Do you want to reschedule this order" : null} />
                            </div>
                            : <div className='mt-3'>
                                <OrderActionForms setActionInProgress={setActionInProgress} actionFormToRender={showActionForm} orderCancelReasonType={orderCancelReasonType} orderInfo={orderInfo} mobileNo={mobileNo} getOrderDetails={getOrderDetails} closeActionForms={closeActionForms} setDisableMode={setDisableMode} disableMode={disableMode} />
                            </div>
                        : null
                    }
                </React.Fragment>
                    : <React.Fragment>
                        <p className="text-center text-muted font-12 mt-3">No Actions to Perform</p>
                    </React.Fragment>
                }
            </div>
            <div ref={footerRef}>
                {validate.isNotEmpty(selectedOption) && 
                    <div className="d-flex justify-content-end border-top p-2">
                        <Button type="button" variant="dark" className="mx-3" onClick={sendSmsToCustomer}>Submit</Button>
                    </div>
                }
            </div>
        </React.Fragment>
    );
};

export default withFormHoc(MartActionsModal);