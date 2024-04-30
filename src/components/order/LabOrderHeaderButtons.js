import React, { useContext, useRef, useState } from "react";
import SendSmsToCustomer from "../../helpers/SendSmsToCustomer";
import Validate from "../../helpers/Validate";
import { Button } from "react-bootstrap";
import OrderActionForms from "./OrderActionForms";
import CancelOrder from "./CancelOrder";
import LabOrderService from "../../services/LabOrder/LabOrderService";
import { AlertContext } from "../Contexts/UserContext";
import Dropdown from 'react-bootstrap/Dropdown';
import { API_URL } from "../../services/ServiceConstants";
import LAB_ORDER_CONFIG from "../../services/LabOrder/LabOrderConfig";
import { downloadFile } from "../../helpers/LabOrderHelper";
import useRole from "../../hooks/useRole";
import { Roles } from "../../constants/RoleConstants";

const LabOrderHeaderButtons = (props) => {
    // const [rescheduleModalObj, setRescheduleModalObj] = useState({});
    // const [showOrderScheduleModal, setShowOrderScheduleModal] = useState(false);
    //const [hasLabOrderRegenerateRole] = useRole([Roles.ROLE_CRM_LAB_ORDER_REGENERATE]);
    const [approveInProgress, setApproveInProgress] = useState(false);
    const [showActionForm, setShowActionForm] = useState("");
    const { setAlertContent, setStackedToastContent } = useContext(AlertContext);
    const [patientInfoButtons, setPatientInfoButtons] = useState(false);
    const initialDataSet = props.dataSet;
    const validate = Validate();
    const footerRef = useRef();
    const labOrderService = LabOrderService();

    const handleButtons = (key, value) => {
        switch (key) {
            case "Assign Agent":
                return <div className="separator-end"><Button variant="outline-dark" className='btn-sm px-3' onClick={() => !props.disableMode && rescheduleModal(value)}>{key}</Button></div>
            case "Reassign Agent":
                return <div className="separator-end"><Button variant="outline-dark" className='btn-sm px-3' onClick={() => !props.disableMode && rescheduleModal(value)}>{key}</Button></div>
            case "Reschedule":
                return <div className="separator-end"><Button variant="outline-dark" className='btn-sm px-3' onClick={() => !props.disableMode && rescheduleModal(value)}>{key}</Button></div>
        }
    }

    const rescheduleModal = (obj) => {
        console.log(obj);
        props.setRescheduleModalObj(obj);
        props.setShowOrderScheduleModal(true);
    }

    const approveOrder = async () => {
        setApproveInProgress(true);
        props.setDisableMode(true);
        await labOrderService.approveLabOrder({ orderId: props.order.orderId }).then((data) => {
            if (Validate().isNotEmpty(data) && data.statusCode === "SUCCESS") {
                setStackedToastContent({ toastMessage: "Order Approved" });
                props.onSubmitClick(props.order.orderId);
                props.setReloadPage(!props.reloadPage);
            }
            else {
                setStackedToastContent({ toastMessage: data.message });
            }
            props.setDisableMode(false);
            setApproveInProgress(false);
        }).catch((err) => {
            console.log(err);
            setApproveInProgress(false);
            setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" });
            props.setDisableMode(false);

        })
    }

    const cancelOrderInfo = {
        title: "Do you want to cancel this order",
        orderId: `${props.order?.displayOrderId} (${props.order?.orderId})`,
        // scheduledSlot: rowValues.slotDate+", "+rowValues.slotTime,
        placeholder: "Please specify reason for cancellation",
        buttonText: "Yes, cancel this order"
    }

    const showReport = (dataSet, isHeaderRequired, isForMail) => {
        if (dataSet.labOrderStaus != 'D' && validate.isEmpty(props.cancelItemselectedRows)) {
            setAlertContent({ alertMessage: "Please select at least one test" });
            return;
        }
        var patientDetails = dataSet?.patientDetails?.patientDetailsSet;
        var orderItemIds = []
        if (validate.isNotEmpty(props.cancelItemselectedRows)) {
            orderItemIds = patientDetails.filter((obj) => (obj.statusOrReason == 'Ready For Print' || (obj.isProfile && obj.profileStatus == 'D')) && props.cancelItemselectedRows.indexOf(obj.columnTestId) > -1).map(obj => obj.columnTestId);
        } 
        /* else {
            orderItemIds = patientDetails.filter((obj) => obj.statusOrReason == 'Ready For Print').map(obj => obj.columnTestId);
        } */

        if (props.cancelItemselectedRows.length > 0 && orderItemIds.length != props.cancelItemselectedRows.length) {
            setAlertContent({ alertMessage: "Some of the selected tests are not ready for print, Please select valid tests" });
        } else if (orderItemIds.length == 0 && dataSet.status != 'Ready for Print') {
            setAlertContent({ alertMessage: "Reports are not yet available because the chosen test(s) are not yet ready for printing." });
        } else if (orderItemIds.length > 0 || (orderItemIds.length == 0 && dataSet.status == 'Ready for Print')) {
            if (isForMail)
                emailLabReportForTestIds(dataSet.orderId, orderItemIds);
            else
                downloadLabReportForTestIds(dataSet.orderId, orderItemIds, isHeaderRequired);
        }
    }

    const emailLabReportForTestIds = (orderId, orderItemIds) => {
        const orderItemIdsStr = orderItemIds.join(',');
        props.setDisableMode(true);
        labOrderService.emailLabOrderReport({ orderId: orderId, orderItemIds: orderItemIdsStr }).then(response => {
            setStackedToastContent({ toastMessage: "mail sent success" })
            props.setDisableMode(false);
        }).catch((err) => {
            setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" })
            props.setDisableMode(false);
        })
    }

    const downloadLabReportForTestIds = async (orderId, orderItemIds, isHeaderRequired) => {
        props.setDisableMode(true);
        const orderItemIdsStr = orderItemIds.join(',');
        const downloadPdfUrl = `${API_URL}${LAB_ORDER_CONFIG.DOWNLOAD_LAB_REPORTS_FOR_TEST_IDS.url}?labOrderId=${orderId}&orderItemIds=${orderItemIdsStr}&isHeaderRequired=${isHeaderRequired}`;
        const response = await downloadFile(downloadPdfUrl);
        props.setDisableMode(false);
        if (response && response.status && response.status === "failure") {
            setStackedToastContent(response.message);
        }
    }

    const downloadLabInvoice = async (orderId, patientId) => {
        props.setDisableMode(true);
        const downloadPdfUrl = `${API_URL}${LAB_ORDER_CONFIG.DOWNLOAD_LAB_INVOICE.url}?labOrderId=${orderId}&patientId=${patientId}`;
        const response = await downloadFile(downloadPdfUrl);
        props.setDisableMode(false);
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
            case "Regenerate Reports":
                regenerateReports();
                break;
        }
    }

    const regenerateReports = async() => {
        try {
            let response = await labOrderService.regenerateLabOrderReports(props.order.cartId);
            if(validate.isNotEmpty(response) && validate.isNotEmpty(response.statusCode) && response.statusCode == 'SUCCESS'){
                setToastContent({toastMessage:"Report regeneration successful"});
            } else {
                setToastContent({toastMessage:response.message?response.message: "Unable to regenerate reports"})
            }
        } catch (error) {
            console.log("Error:",error);
            setToastContent({toastMessage:"Unable to regenerate reports"})
        }
    }

    return <React.Fragment>
        <div className='d-flex gap-2'>
            <div className='d-flex justify-content-between gap-2'>
                {props.showClaimButton ? <div className="separator-end">
                        <Button variant="outline-dark" size="sm" onClick={() => { Validate().isEmpty(props.orderIdsInfo[props.orderTab].claimedBy) ? props.setToggleConfirmation(true) : props.ForceClaimClick() }}>
                            {/* <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g id="claim-icn-24" transform="translate(-367 -484)"><g id="claim-icn-32" transform="translate(370 488)"><g id="Group_34320" data-name="Group 34320" transform="translate(0)"><path id="Subtraction_118" data-name="Subtraction 118" d="M8.664,10.58H1.247A1.207,1.207,0,0,1,0,9.389v-8.2A1.207,1.207,0,0,1,1.247,0H13.431a1.207,1.207,0,0,1,1.247,1.191V3.935a4.975,4.975,0,0,0-.831-.164V1.192a.4.4,0,0,0-.416-.361H1.247a.4.4,0,0,0-.416.361v8.2a.366.366,0,0,0,.416.36H8.413a4.956,4.956,0,0,0,.251.829Z" transform="translate(0 2.076)" fill="#080808"></path><path id="Path_51583" data-name="Path 51583" d="M46.073,27.51H41.2V25.294c0-.387.387-.692.941-.692h2.991c.526,0,.941.305.941.692Zm-4.044-.831h3.213V25.433H42.031Z" transform="translate(-36.298 -24.602)" fill="#080808"></path><path id="Path_51584" data-name="Path 51584" d="M34.867,69.516a.982.982,0,0,1-.969-.969V67.3h1.967v1.246A.97.97,0,0,1,34.867,69.516Zm-.138-1.385v.415a.131.131,0,0,0,.138.138.155.155,0,0,0,.167-.138v-.415Z" transform="translate(-31.018 -55.477)" fill="#080808"></path></g><g id="Group_34319" data-name="Group 34319" transform="translate(9.139 6.646)"><path id="Path_51586" data-name="Path 51586" d="M41.379,41.394l-1.7,1.7c-.021.021-.021.041-.041.062a.021.021,0,0,1-.021.021.063.063,0,0,1-.021.041v.269a.063.063,0,0,0,.021.041.021.021,0,0,0,.021.021c0,.021.021.041.041.062l1.678,1.678a.388.388,0,0,0,.539,0,.329.329,0,0,0,.1-.248.382.382,0,0,0-.1-.248l-1.057-1.078h2.714a.373.373,0,0,0,0-.746H40.841L41.9,41.911a.329.329,0,0,0,.1-.248.382.382,0,0,0-.1-.248A.348.348,0,0,0,41.379,41.394Z" transform="translate(-37.286 -38.72)" fill="#080808"></path><path id="Ellipse_1237" data-name="Ellipse 1237" d="M3.181-1.25A4.427,4.427,0,0,1,7.611,3.181,4.427,4.427,0,0,1,3.181,7.611,4.427,4.427,0,0,1-1.25,3.181,4.427,4.427,0,0,1,3.181-1.25Zm0,8.219A3.789,3.789,0,0,0,6.969,3.181,3.789,3.789,0,0,0,3.181-.608,3.789,3.789,0,0,0-.608,3.181,3.789,3.789,0,0,0,3.181,6.969Z" transform="translate(1.25 1.25)" fill="#080808"></path></g></g></g></svg> */}
                            Claim Order
                        </Button>
                    </div> : props.showUnclaimButton ?
                    <div className="separator-end">
                        <Button variant="outline-dark" size="sm" onClick={() => { props.setToggleConfirmation(true) }}>
                            {/* <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g id="unclaim-icn-24" transform="translate(-367 -484)"><g id="unclaim-icn-32" transform="translate(370 488)"><g id="Group_34320" data-name="Group 34320" transform="translate(0)"><path id="Subtraction_118" data-name="Subtraction 118" d="M8.664,10.58H1.247A1.207,1.207,0,0,1,0,9.389v-8.2A1.207,1.207,0,0,1,1.247,0H13.431a1.207,1.207,0,0,1,1.247,1.191V3.935a4.975,4.975,0,0,0-.831-.164V1.192a.4.4,0,0,0-.416-.361L1.247.833a.4.4,0,0,0-.416.36v8.2a.366.366,0,0,0,.416.36H8.413a4.956,4.956,0,0,0,.251.829Z" transform="translate(0 2.076)" fill="#080808"></path><path id="Path_51583" data-name="Path 51583" d="M46.073,27.51H41.2V25.294c0-.387.387-.692.941-.692h2.991c.526,0,.941.305.941.692Zm-4.044-.831h3.213V25.433H42.031Z" transform="translate(-36.298 -24.602)" fill="#080808"></path><path id="Path_51584" data-name="Path 51584" d="M34.867,69.516a.982.982,0,0,1-.969-.969V67.3h1.967v1.246A.97.97,0,0,1,34.867,69.516Zm-.138-1.385v.415a.131.131,0,0,0,.138.138.155.155,0,0,0,.167-.138v-.415Z" transform="translate(-31.018 -55.477)" fill="#080808"></path></g><g id="Group_34319" data-name="Group 34319" transform="translate(9.139 6.646)"><path id="Path_51586" data-name="Path 51586" d="M42.146,41.394l1.7,1.7c.021.021.021.041.041.062a.021.021,0,0,0,.021.021.063.063,0,0,0,.021.041v.269a.063.063,0,0,1-.021.041.021.021,0,0,1-.021.021c0,.021-.021.041-.041.062L42.167,45.29a.388.388,0,0,1-.539,0,.329.329,0,0,1-.1-.248.382.382,0,0,1,.1-.248l1.057-1.079H39.97a.373.373,0,1,1,0-.746h2.714l-1.057-1.057a.329.329,0,0,1-.1-.248.382.382,0,0,1,.1-.248.348.348,0,0,1,.519-.02Z" transform="translate(-37.286 -38.72)" fill="#080808"></path><path id="Ellipse_1237" data-name="Ellipse 1237" d="M3.181-1.25A4.427,4.427,0,0,1,7.611,3.181,4.427,4.427,0,0,1,3.181,7.611,4.427,4.427,0,0,1-1.25,3.181,4.427,4.427,0,0,1,3.181-1.25Zm0,8.219A3.789,3.789,0,0,0,6.969,3.181,3.789,3.789,0,0,0,3.181-.608,3.789,3.789,0,0,0-.608,3.181,3.789,3.789,0,0,0,3.181,6.969Z" transform="translate(1.25 1.25)" fill="#080808"></path></g></g></g></svg> */}
                            Unclaim Order
                        </Button>
                    </div> 
                : null}
                <div className="separator-end"><SendSmsToCustomer orderType={props.fromPage} customerId={props.customerId} displayOrderId={props.order?.displayOrderId} customerName={props.customer?.name} mobileNo={props.customer?.mobileNo} setDisableMode={props.setDisableMode} disableMode={props.disableMode} /></div>
                {validate.isNotEmpty(props.order?.buttons) && Object.keys(props.order?.buttons).map(key => {
                    return handleButtons(key, props.order?.buttons[key])
                })}
                {validate.isNotEmpty(props.patientInfo?.buttons) &&
                    <div className="separator-end">
                        <Dropdown className="custom-dropdown">
                            <Dropdown.Toggle  variant="outline-dark" className='btn-sm'>
                                Download Reports
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                { props.patientInfo?.buttons.map((buttonName, index) => {
                                    if(buttonName == "Regenerate Reports"){
                                        return (<>
                                            <hr/>
                                            <h6 class="dropdown-header">Generation</h6>
                                            <Dropdown.Item className={`${index !== props.patientInfo?.buttons.length - 1 ? "border-bottom" : ''}`} onClick={() => !props.disableMode && handlePatientButtons(buttonName)}> {buttonName} </Dropdown.Item>
                                        </>
                                        )
                                    } else 
                                        return <Dropdown.Item className={`${index !== props.patientInfo?.buttons.length - 1 ? "border-bottom" : ''}`} onClick={() => !props.disableMode && handlePatientButtons(buttonName, initialDataSet, props.patientInfo.patientDetailInfo.patientId)}> {buttonName} </Dropdown.Item>
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                }
                {(props.order?.orderCancelAllowed || props.order?.approveOrderButton || validate.isNotEmpty(props.order?.buttons)) && 
                    <React.Fragment>
                       {props.order?.orderCancelAllowed
                            ? <div className="separator-end"><Button className="rounded-1 btn-sm px-3 brand-secondary " variant=' ' disabled={props.disableMode} onClick={() => setShowActionForm(true)}>
                                Cancel
                            </Button></div>
                            : null}
                        {props.order?.approveOrderButton
                            ? approveInProgress ? <Button variant=" " className="btn-sm flex-grow-1 pointer mb-0 p-1" disabled><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...</Button>
                                : <div className="separator-end"><Button variant="success" className="btn-sm px-3" disabled={approveInProgress ? 'disabled' : '' || props.disableMode} onClick={approveOrder}>Approve</Button></div>
                            : null}
                        {validate.isNotEmpty(showActionForm) && <OrderActionForms actionFormToRender={showActionForm} orderId={props.order.orderId} setReloadPage={props.setReloadPage} onSubmitClick={props.onSubmitClick} setShowActionForm={setShowActionForm} setDisableMode={props.setDisableMode} disableMode={props.disableMode} />}
                        {showActionForm && <CancelOrder showCancelModal={showActionForm} setShowActionForm={setShowActionForm} setShowCancelModal={setShowActionForm} orderInfo={cancelOrderInfo} setDisableMode={props.setDisableMode} setReloadPage={props.setReloadPage} orderId={props.order.orderId} onSubmitClick={props.onSubmitClick} />}
                    </React.Fragment>
                }
            </div>
        </div>
    </React.Fragment>
}

export default LabOrderHeaderButtons;