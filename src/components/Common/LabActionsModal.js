import React, { useContext, useRef, useState, useEffect } from "react";
import Validate from "../../helpers/Validate";
import { Button } from "react-bootstrap";
import OrderActionForms from "../order/OrderActionForms";
import CancelOrder from "../order/CancelOrder";
import LabOrderService from "../../services/LabOrder/LabOrderService";
import { AlertContext } from "../Contexts/UserContext";
import { API_URL } from "../../services/ServiceConstants";
import LAB_ORDER_CONFIG from "../../services/LabOrder/LabOrderConfig";
import { downloadFile } from "../../helpers/LabOrderHelper";
import { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import CustomerService from "../../services/Customer/CustomerService";
import FormHelpers from "../../helpers/FormHelpers";
import Form from 'react-bootstrap/Form';

const LabActionsModal = ({ helpers, children, showActionModal, closeActionsModal, ...props }) => {

    const propsObj = props?.props?.children?.props?.children?.props;

    const showClaimButton = propsObj?.showClaimButton;
    const showUnClaimButton = propsObj?.showUnclaimButton;
    const orderType = propsObj?.fromPage;
    const customerId = propsObj?.customerId;
    const setDisableMode = propsObj?.setDisableMode;
    const disableMode = propsObj?.disableMode;
    const orderIdsInfo = propsObj?.orderIdsInfo;
    const orderTab = propsObj?.orderTab;
    const setToggleConfirmation = propsObj?.setToggleConfirmation;
    const ForceClaimClick = propsObj?.ForceClaimClick;
    const setReloadPage = propsObj?.setReloadPage;
    const onSubmitClick = propsObj?.onSubmitClick;
    const setRescheduleModalObj = propsObj?.setRescheduleModalObj;
    const setShowOrderScheduleModal = propsObj?.setShowOrderScheduleModal;
    const reloadPage = propsObj?.reloadPage;;
    const cancelItemselectedRows = propsObj?.cancelItemselectedRows;

    const customerName = propsObj?.customer?.name;
    const mobileNo = propsObj?.customer?.mobileNo;

    const orderId = propsObj?.order?.orderId;
    const displayOrderId = propsObj?.order?.displayOrderId;
    const orderButtons = propsObj?.order?.buttons;
    const orderCancelButton = propsObj?.order?.orderCancelAllowed;
    const orderApproveButton = propsObj?.order?.approveOrderButton;

    const patientInfoButtons = propsObj?.patientInfo?.buttons;
    const patientId = propsObj?.patientInfo?.patientDetailInfo?.patientId;

    const initialDataSet = propsObj?.dataSet;

    const [approveInProgress, setApproveInProgress] = useState(false);
    const [showActionForm, setShowActionForm] = useState("");
    const { setAlertContent, setStackedToastContent } = useContext(AlertContext);
    const validate = Validate();
    const footerRef = useRef();
    const labOrderService = LabOrderService();

    const [smsOptions, setSmsOptions] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [footerHeight,setFooterHeight] = useState(0);    

    let sendSmsObject = {
        'mobileNo': mobileNo,
        'prescriptionId': displayOrderId,
        'customerId': customerId,
        'customerName': customerName,
    };

    useEffect(() => {
        setSmsOptions({
            'customerNotResponding': 'Customer is not reachable/responding',
            'serviceNotAvailable': 'Service not available',
            'paymentFailed': 'Payment failed-COD Available',
            'paymentFailedCODNotAvailable': 'Payment failed-COD Not Available',
        });
    }, [])

    useEffect(() => {
        if (validate.isNotEmpty(smsOptions)) {
            helpers.addForm(FormHelpers().getSelectSmsForm(smsOptions, helpers));
        }
    }, [smsOptions])

    const sendSmsToCustomer = () => {
        if (validate.isEmpty(selectedOption)) {
            setStackedToastContent({ toastMessage: "Please select a message to send SMS" });
            return false;
        }
        sendSmsObject = { ...sendSmsObject, 'smsTemplate': selectedOption, 'orderType': orderType }
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



    const handleButtons = (key, value) => {
        switch (key) {
            case "Assign Agent":
                return <div className="px-3 py-2 sendItem" onClick={() => !disableMode && rescheduleModal(value)}><span className="font-14">{key}</span></div>
            case "Reassign Agent":
                return <div className="px-3 py-2 sendItem" onClick={() => !disableMode && rescheduleModal(value)}><span className="font-14">{key}</span></div>
            case "Reschedule":
                return <div className="px-3 py-2 sendItem" onClick={() => !disableMode && rescheduleModal(value)}><span className="font-14">{key}</span></div>
        }
    }

    const rescheduleModal = (obj) => {
        setRescheduleModalObj(obj);
        setShowOrderScheduleModal(true);
    }

    const approveOrder = async () => {
        setApproveInProgress(true);
        setDisableMode(true);
        await labOrderService.approveLabOrder({ orderId: orderId }).then((data) => {
            if (validate.isNotEmpty(data) && data.statusCode === "SUCCESS") {
                setStackedToastContent({ toastMessage: "Order Approved" });
                closeActionsModal();
                onSubmitClick(orderId);
                setReloadPage(!reloadPage);
            }
            else {
                setStackedToastContent({ toastMessage: data.message });
            }
            setDisableMode(false);
            setApproveInProgress(false);
        }).catch((err) => {
            console.log(err);
            setApproveInProgress(false);
            setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" });
            setDisableMode(false);

        })
    }

    const cancelOrderInfo = {
        title: "Do you want to cancel this order",
        orderId: `${displayOrderId}/${orderId}`,
        // scheduledSlot: rowValues.slotDate+", "+rowValues.slotTime,
        placeholder: "Please specify reason for cancellation",
        buttonText: "Yes, cancel this order"
    }

    const showReport = (dataSet, isHeaderRequired, isForMail) => {
        if (dataSet.labOrderStaus != 'D' && validate.isEmpty(cancelItemselectedRows)) {
            setAlertContent({ alertMessage: "Please select at least one test" });
            closeActionsModal();
            return;
        }
        var patientDetails = dataSet?.patientDetails?.patientDetailsSet;
        var orderItemIds = [];
        if (validate.isNotEmpty(cancelItemselectedRows)) {
            orderItemIds = patientDetails.filter((obj) => (obj.statusOrReason == 'Ready For Print' || (obj.isProfile && obj.profileStatus == 'D')) && cancelItemselectedRows.indexOf(obj.columnTestId) > -1).map(obj => obj.columnTestId);
        } 
       /*  else {
            orderItemIds = patientDetails.filter((obj) => obj.statusOrReason == 'Ready For Print').map(obj => obj.columnTestId);
        } */

        if (cancelItemselectedRows.length > 0 && orderItemIds.length != cancelItemselectedRows.length) {
            setAlertContent({ alertMessage: "Some of the selected tests are not ready for print, Please select valid tests" });
            closeActionsModal();
        } else if (orderItemIds.length == 0 && dataSet.status != 'Ready for Print') {
            setAlertContent({ alertMessage: "Reports are not yet available because the chosen test(s) are not yet ready for printing." });
            closeActionsModal();
        } else if (orderItemIds.length > 0 || (orderItemIds.length == 0 && dataSet.status == 'Ready for Print')) {
            if (isForMail)
                emailLabReportForTestIds(dataSet.orderId, orderItemIds);
            else
                downloadLabReportForTestIds(dataSet.orderId, orderItemIds, isHeaderRequired);
        }
    }

    const emailLabReportForTestIds = (orderId, orderItemIds) => {
        const orderItemIdsStr = orderItemIds.join(',');
        setDisableMode(true);
        labOrderService.emailLabOrderReport({ orderId: orderId, orderItemIds: orderItemIdsStr }).then(response => {
            setStackedToastContent({ toastMessage: "mail sent success" });
            closeActionsModal();
            setDisableMode(false);
        }).catch((err) => {
            setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" });
            closeActionsModal();
            setDisableMode(false);
        })
    }

    const downloadLabReportForTestIds = async (orderId, orderItemIds, isHeaderRequired) => {
        setDisableMode(true);
        const orderItemIdsStr = orderItemIds.join(',');
        const downloadPdfUrl = `${API_URL}${LAB_ORDER_CONFIG.DOWNLOAD_LAB_REPORTS_FOR_TEST_IDS.url}?labOrderId=${orderId}&orderItemIds=${orderItemIdsStr}&isHeaderRequired=${isHeaderRequired}`;
        const response = await downloadFile(downloadPdfUrl);
        setDisableMode(false);
        if (response && response.status && response.status === "failure") {
            setStackedToastContent(response.message);
        }
    }

    const downloadLabInvoice = async (orderId, patientId) => {
        setDisableMode(true);
        const downloadPdfUrl = `${API_URL}${LAB_ORDER_CONFIG.DOWNLOAD_LAB_INVOICE.url}?labOrderId=${orderId}&patientId=${patientId}`;
        const response = await downloadFile(downloadPdfUrl);
        setDisableMode(false);
        if (response && response.status && response.status === "failure") {
            setStackedToastContent(response.message);
        }
    }

    const handlePatientButtons = (buttonName, dataSet, patientId) => {
        switch (buttonName) {
            case "Report":
                showReport(dataSet, 'Y');
                break;
            case "Report Without Header":
                showReport(dataSet, 'N');
                break;
            case "Email":
                showReport(dataSet, 'N', true);
                break;
            case "Invoice":
                downloadLabInvoice(dataSet.orderId, patientId)
                break;
        }
    }

    useEffect(() => {
        if(validate.isNotEmpty(footerRef) && validate.isNotEmpty(footerRef.current)){
            setFooterHeight(footerRef.current.offsetHeight);
        }
        else{
            setFooterHeight(0);
        }
    }, [selectedOption]);

    return (
        <React.Fragment>
            <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ height: `calc(100% - ${footerHeight}px)` }}>
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
                {validate.isNotEmpty(patientInfoButtons) &&
                    <div className="d-flex flex-column">
                        <div className="px-3 py-2">
                            <label className="dropdown-header text-muted font-12">Download Reports</label>
                        </div>
                        <div>
                            {validate.isNotEmpty(patientInfoButtons) && patientInfoButtons.map((buttonName, index) => {
                                return (
                                    <React.Fragment>
                                        <div className='px-3 sendItem py-2' onClick={() => !disableMode && handlePatientButtons(buttonName, initialDataSet, patientId)}>
                                            <span className='font-14'>{buttonName}</span>
                                        </div>
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                }
                {validate.isNotEmpty(orderButtons) && 
                	<div  className="d-flex flex-column">
                        {Object.keys(orderButtons).map(key => {
                            return (
                                <React.Fragment>
                                        {handleButtons(key, orderButtons[key])}
                                </React.Fragment>)
                        })}
                    </div>
                }
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
                {(orderCancelButton || orderApproveButton || validate.isNotEmpty(orderButtons)) &&
                    <React.Fragment>
                        {orderCancelButton
                            ? <div className={`px-3 sendItem py-2 ${disableMode ? 'text-muted' : ''}`} onClick={() => setShowActionForm(true)}>
                                <span className='font-14'>Cancel</span>
                            </div>
                            : null
                        }
                        {orderApproveButton
                            ? <div className={`px-3 sendItem py-2 ${(approveInProgress || disableMode) ? 'text-muted' : ''}`} onClick={approveOrder}>
                                <span className='font-14'>Approve</span>
                            </div>
                            : null}
                        {validate.isNotEmpty(showActionForm) && <OrderActionForms actionFormToRender={showActionForm} orderId={orderId} setReloadPage={setReloadPage} onSubmitClick={(orderId) => { closeActionsModal(); onSubmitClick(orderId); }} setShowActionForm={(state) => { closeActionsModal(); setShowActionForm(state) }} setDisableMode={setDisableMode} disableMode={disableMode} />}
                        {showActionForm && <CancelOrder showCancelModal={showActionForm} setShowActionForm={(state) => { closeActionsModal(); setShowActionForm(state) }} setShowCancelModal={setShowActionForm} orderInfo={cancelOrderInfo} setDisableMode={setDisableMode} setReloadPage={setReloadPage} orderId={orderId} onSubmitClick={(orderId) => { closeActionsModal(); onSubmitClick(orderId); }} />}
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

export default withFormHoc(LabActionsModal);