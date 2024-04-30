import React, { useContext, useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Validate from '../../../helpers/Validate';
import LabOrderService from '../../../services/LabOrder/LabOrderService';
import { AlertContext, DetailModelOpened } from '../../Contexts/UserContext';
import edit_icon from '../../../images/edit_icon.svg';
import {UncontrolledTooltip} from 'reactstrap';
import useRole from '../../../hooks/useRole';
import { Roles } from '../../../constants/RoleConstants';
import { redirectCustomerPage } from '../../../helpers/CommonRedirectionPages';
const LabOrderDeliveryInfo = ({setShowEditPatientModal,...props}) => {

    const validate = Validate();
    const [hasNonMemberEditRole] = useRole([Roles.ROLE_CRM_NON_MA_MEMBER_EDIT])
    const initialDataSet = props.dataSet;
    const labOrderService = LabOrderService();
    const { setAlertContent, setStackedToastContent } = useContext(AlertContext);
    const footerRef = useRef();
    const [footerHeight, setFooterFooterHeight] = useState(0);
    const { selectedFormsSection, setSelectedFormsSection } = useContext(DetailModelOpened)


    // const approveOrder = async () => {
    //     setApproveInProgress(true);
    //     props.setDisableMode(true);
    //     await labOrderService.approveLabOrder({ orderId: props.order.orderId }).then((data) => {
    //         if (Validate().isNotEmpty(data) && data.statusCode === "SUCCESS") {
    //             setStackedToastContent({ toastMessage: "Order Approved" });
    //             props.onSubmitClick(props.order.orderId);
    //             props.setReloadPage(!props.reloadPage);
    //         }
    //         else {
    //             setStackedToastContent({ toastMessage: data.message });
    //         }
    //         props.setDisableMode(false);
    //         setApproveInProgress(false);
    //     }).catch((err) => {
    //         console.log(err);
    //         setApproveInProgress(false);
    //         setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" });
    //         props.setDisableMode(false);

    //     })
    // }

    // const rescheduleModal = (obj) => {
    //     setRescheduleModalObj(obj);
    //     setShowOrderScheduleModal(true);
    // }

    // const handleButtons = (key, value) => {
    //     switch (key) {
    //         case "Assign Agent":
    //             return <button className='btn btn-brand ms-3' onClick={() => !props.disableMode && rescheduleModal(value)}>{key}</button>
    //         case "Reassign Agent":
    //             return <button className='btn btn-brand ms-3' onClick={() => !props.disableMode && rescheduleModal(value)}>{key}</button>
    //         case "Reschedule":
    //             return <button className='rounded-1  ms-3 px-3 brand-secondary btn' onClick={() => !props.disableMode && rescheduleModal(value)}>{key}</button>
    //     }
    // }



    const convertPaymentToCod = (orderId) => {
        if (validate.isNotEmpty(orderId)) {
            props.setDisableMode(true)
            labOrderService.convertPaymentToCod({ "orderId": orderId }).then(data => {
                if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                    setStackedToastContent({ toastMessage: "Order payment mode converted to COD, Please pay the cash." });
                    props.setOrderStatus('C');
                    props.setReloadPage(!props.reloadPage);
                } else {
                    setStackedToastContent({ toastMessage: data.message });
                }
                props.setDisableMode(false)
            }).catch((err) => {
                console.log(err)
                setStackedToastContent({ toastMessage: "unexpected error while converting order into COD" });
                props.setDisableMode(false)
            });
        }
    }
    // const canceOrderInfo={
    //         title: "Do you want to cancel this order",
    //         orderId: `${props.order.displayOrderId}/${props.order.orderId}`,
    //         // scheduledSlot: rowValues.slotDate+", "+rowValues.slotTime,
    //         placeholder: "Please specify reason for cancellation",
    //         buttonText: "Yes cancel this order"
    // }

    useEffect(() => {
        setFooterFooterHeight(footerRef.current?.offsetHeight)
    }, [props.order])

    const viewCustomer = (customerId) => {
        const obj = {
            customerId: customerId,
            customerType: "POS",
            isMergedFlag: false
          }
          redirectCustomerPage(obj);
    }
    return (
        <React.Fragment>
            <div className='card border-0' style={{ "max-height": "100%" }}>
                <div className='p-2 border-bottom align-items-center'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h4 className='fs-6 mb-0'>Delivery & Order Information</h4>
                        <button type="button" id="formsCloseIcon" className="rounded-5 icon-hover btn btn-link hide-on-mobile" onClick={() => { setSelectedFormsSection(!selectedFormsSection) }}>
                            <svg id="notification-icn" xmlns="http://www.w3.org/2000/svg" width="16" height="15.956" viewBox="0 0 16 15.956">
                                <circle id="Ellipse_1160" data-name="Ellipse 1160" cx="4" cy="4" r="4" transform="translate(4 4.001)" fill="#ebebeb" opacity="0" />
                                <path id="noun-down-scale-3676807-404040" d="M48.682,57.011,44.722,61a1,1,0,0,1-.575.224A.82.82,0,0,1,43.572,61a.772.772,0,0,1,0-1.118l3.96-3.96-2.267.192a.8.8,0,0,1-.128-1.6l4.471-.415a.78.78,0,0,1,.862.862l-.415,4.471a.8.8,0,0,1-.8.734h-.064a.794.794,0,0,1-.734-.862Zm9.262-11.529-3.96,3.992.224-2.3a.8.8,0,0,0-1.6-.128L52.2,51.518a.794.794,0,0,0,.224.639.77.77,0,0,0,.575.224h.064l4.471-.415a.8.8,0,1,0-.128-1.6l-2.267.224,3.96-3.96a.772.772,0,0,0,0-1.118.841.841,0,0,0-1.15-.032Z" transform="translate(-43.333 -45.271)" fill="#3f3f3f" />
                            </svg>
                            <UncontrolledTooltip placement="bottom" target="formsCloseIcon">
                                Hide Delivery & Order Information
                            </UncontrolledTooltip>
                        </button>
                        <button type="button" id="formsCloseIcon" className="rounded-5 icon-hover btn btn-link forms-toggle-button" onClick={() => { setSelectedFormsSection(!selectedFormsSection) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                <g id="topchevron_black_icon_18px" transform="translate(-762 -868.477)">
                                    <rect id="Rectangle_4722" data-name="Rectangle 4722" width="18" height="18" transform="translate(762 868.477)" fill="none" />
                                    <path id="Path_23401" data-name="Path 23401" d="M60.371,465.782l-4.156,4.156a.942.942,0,0,0,1.332,1.332l3.49-3.48,3.491,3.491a.945.945,0,0,0,1.611-.666.936.936,0,0,0-.279-.666L61.7,465.782A.945.945,0,0,0,60.371,465.782Z" transform="translate(710.138 408.731)" fill="#080808" />
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto scroll-on-hover" style={{ "height": `calc(100% - ${footerHeight}px)` }}>
                    <div className='p-12'>
                        <div>
                            <div className='d-flex justify-content-between'>
                                <p className='text-secondary font-12 mb-2'>Customer Details</p>
                            </div>
                            <div className="mb-3 custom-border-bottom-dashed">
                                {(validate.isNotEmpty(props.customer) && validate.isNotEmpty(props.customer.name)) ? <h6 className='mb-0 font-14'>{props.customer.name}</h6> : null}

                                {/* <h6 className='font-14 mb-0'>{props.customer.name}</h6> */}
                                <address>
                                    <div className='text-secondary font-12'>{(validate.isNotEmpty(props.customer) && validate.isNotEmpty(props.customer.addressLine1)) && <small>{props.customer.addressLine1}<br /></small>}
                                        {(validate.isNotEmpty(props.customer) && validate.isNotEmpty(props.customer.addressLine2)) && <small>{props.customer.addressLine2}<br /></small>}
                                        {(validate.isNotEmpty(props.customerId)) ? 'Customer Id :' : ''} {(validate.isNotEmpty(props.customerId)) ? <a href="javascript:void(0);" onClick={() => viewCustomer(props.customerId)} title="Go to Customer" className='text-decoration-none'> {props.customerId} </a> : ''}
                                        {(validate.isNotEmpty(props.customer) && validate.isNotEmpty(props.customer.mobileNo)) ? 'Ph.no :' : ''} {(validate.isNotEmpty(props.customer) && validate.isNotEmpty(props.customer.mobileNo)) ? <a href="javascript:void(0);" onClick={() => window.open(`tel:+91${props.customer.mobileNo}`)} title="Call to Customer" className='text-decoration-none'> {props.customer.mobileNo} </a> : ''}
                                        {(validate.isNotEmpty(props.customer) && validate.isNotEmpty(props.customer.mobileNo)) && (validate.isNotEmpty(props.customer) && validate.isNotEmpty(props.customer.email)) ? <><span className='mx-2'>|</span><span>Email :</span></> : (validate.isNotEmpty(props.customer) && validate.isNotEmpty(props.customer.email)) ? 'Email :' : ''} {(validate.isNotEmpty(props.customer) && validate.isNotEmpty(props.customer.email)) ? <a href="javascript:void(0);" onClick={() => window.open(`mailto:${props.customer.email}`)} title={`Send an email to ${props.customer.email}`} className="text-decoration-none">{props.customer.email} </a> : ''}</div>
                                </address>
                            </div>
                            <div className='custom-border-bottom-dashed mb-3'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                    <p className='text-secondary font-12 mb-2'>Patient Details</p>
                                    {hasNonMemberEditRole && <Button variant=' ' className='btn-sm rounded-5 icon-hover btn-link' id="editDetailsButton" onClick={() => {setShowEditPatientModal(true)}}><img src={edit_icon} alt="edit patient details" /></Button>}
                                    </div>
                                <div className='d-flex justify-content-between pb-3'>
                                    <h6 className='mb-0 font-14'>{(validate.isNotEmpty(props.patientInfo) && validate.isNotEmpty(props.patientInfo.patientDetailInfo) && validate.isNotEmpty(props.patientInfo.patientDetailInfo.patientName)) ? props.patientInfo.patientDetailInfo.patientName : null}</h6>
                                    <p className='font-14 fw-normal mb-0'>Age {(validate.isNotEmpty(props.patientInfo) && validate.isNotEmpty(props.patientInfo.patientDetailInfo) && validate.isNotEmpty(props.patientInfo.patientDetailInfo.patientAge)) ? props.patientInfo.patientDetailInfo.patientAge : null} / {(validate.isNotEmpty(props.patientInfo) && validate.isNotEmpty(props.patientInfo.patientDetailInfo) && validate.isNotEmpty(props.patientInfo.patientDetailInfo.patientGender)) ? props.patientInfo.patientDetailInfo.patientGender : null}</p>
                                </div>

                            </div>
                            <div className="custom-border-bottom-dashed pb-3 mb-3">
                                {props.patientInfo?.convertToCodRequired && <button className="btn brand-secondary mt-3" onClick={() => !props.disableMode && convertPaymentToCod(initialDataSet.orderId)}>Convert to COD</button>}
                                {/* {props.patientInfo?.buttons.map((buttonName) => {
                            return <React.Fragment><button className="btn btn-sm btn-link" onClick={() => !props.disableMode && handlePatientButtons(buttonName, initialDataSet, props.patientInfo.patientDetailInfo.patientId)}> {buttonName} </button> </React.Fragment>
                        })} */}
                            </div>
                            {/* <div className='pb-3'>
                                <SendSmsToCustomer orderType={props.fromPage} customerId={props.customerId} displayOrderId={props.order.displayOrderId} customerName={props.customer.name} mobileNo={props.customer.mobileNo} setDisableMode={props.setDisableMode} disableMode={props.disableMode} />
                            </div> */}
                        </div>

                        <div className='d-flex justify-content-between'>
                            <p className='text-secondary mb-0 font-12'>Order Status</p>
                            <p className='text-secondary mb-0 font-12 '>Order Date</p>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <span className='font-14 mb-1'>
                                {validate.isNotEmpty(props.order) && validate.isNotEmpty(props.order.status) ? props.order.status : null}
                            </span>
                            <p className='font-14 mb-1'>{(validate.isNotEmpty(props.order) && validate.isNotEmpty(props.order.orderDate)) ? props.order.orderDate : null}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            {(validate.isNotEmpty(props.order) && validate.isNotEmpty(props.order.displayOrderId)) && <div>
                                <small className='text-secondary font-12'>Display Order ID (Order ID)</small>
                                <p className='font-14'>{props.order.displayOrderId} ({props.order.orderId})</p>
                            </div>
                            }
                            {(validate.isNotEmpty(props.order) && validate.isNotEmpty(props.order.cartId)) && <div>
                                <small className='text-secondary font-12'>Cart ID</small>
                                <p className='font-14'>{props.order.cartId}</p>
                            </div>}

                        </div>
                        <div className='d-flex justify-content-between'>
                            {(validate.isNotEmpty(props.order) && validate.isNotEmpty(props.order.storeID)) && <div>
                                <small className='text-secondary font-12'>Store Details</small>
                                <p className='font-14'>{props.order.storeID} ({props.order.storeName})</p>
                            </div>}
                            {(validate.isNotEmpty(props.order) && validate.isNotEmpty(props.order.appliedCoupon)) && <div>
                                <small className='text-secondary font-12'>Applied Coupon</small>
                                <p className='font-14 text-end '>{props.order.appliedCoupon}</p>
                            </div>}
                        </div>
                        <div className='d-flex justify-content-between'>
                            {(validate.isNotEmpty(props.order) && validate.isNotEmpty(props.order.deliveryType)) && <div>
                                <small className='text-secondary font-12'>Report Delivery Type</small>
                                <p className='font-14'>{props.order.deliveryType}</p>
                            </div>}
                            {(validate.isNotEmpty(props.order) && validate.isNotEmpty(props.order.visitType)) && <div>
                                <small className='text-secondary font-12'>Visit Type</small>
                                <p className='font-14'>{props.order.visitType.toLowerCase()}</p>
                            </div>}
                        </div>
                        <div className='d-flex justify-content-between'>
                            {(validate.isNotEmpty(props.order) && validate.isNotEmpty(props.order.registrationId)) && <div>
                                <small className='text-secondary font-12'>Registration Id</small>
                                <p className='font-14'>{props.order.registrationId}</p>
                            </div>}
                        </div>
                        <React.Fragment>
                            {validate.isNotEmpty(props.collectionCenter) && <React.Fragment><small className='text-secondary font-12'>Collection Center Details</small>
                                <h6 className='font-14 mb-0'> {props.collectionCenter.name}</h6>
                                <address className="mb-0">
                                    <small className='text-secondary font-14'>{props.collectionCenter.address}, {props.collectionCenter.city}, {props.collectionCenter.state}<br /> Ph.no - <a href="javascript:void(0);" onClick={() => !props.disableMode && window.open(`tel:+91${props.collectionCenter.phone}`)} title="Call to Store" className='text-decoration-none'>{props.collectionCenter.phone} </a> </small>
                                </address>
                                {/* <p className='font-12'>{props.collectionCenter.address}</p>
                            <p className='font-12'>{props.collectionCenter.city}</p>
                            <p className='font-12'>{props.collectionCenter.state}</p>
                            <p className='font-12'>{props.collectionCenter.phone}</p>
                            */}
                            </React.Fragment>
                            }
                        </React.Fragment>
                    </div>
                </div>
                {/* {(props.order.orderCancelAllowed || props.order.approveOrderButton || validate.isNotEmpty(props.order.buttons)) && <React.Fragment>
                        <div className="d-flex footer justify-content-end p-12" ref={footerRef}>
                        {props.order.orderCancelAllowed
                            ? <Button className="rounded-1  px-3 brand-secondary " variant=' ' disabled ={props.disableMode} onClick={() =>  setShowActionForm("labCancelForm")}>
                                Cancel
                            </Button>
                            : null}
                        {props.order.approveOrderButton
                            ? approveInProgress ? <Button className="text-primary flex-grow-1 pointer mb-0 p-1" disabled><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...</Button>
                                : <Button variant="success" className='ms-2' disabled={approveInProgress ? 'disabled' : '' || props.disableMode } onClick={approveOrder}>Approve</Button>
                            : null}
                        {validate.isNotEmpty(props.order.buttons) && Object.keys(props.order.buttons).map(key => {
                            return handleButtons(key, props.order.buttons[key])
                        })} */}
                {/* {validate.isNotEmpty(showActionForm) && <OrderActionForms actionFormToRender={showActionForm} orderId={props.order.orderId} setReloadPage={props.setReloadPage} onSubmitClick={props.onSubmitClick} setShowActionForm={setShowActionForm} setDisableMode = {props.setDisableMode} disableMode = {props.disableMode} />} */}
                {/* {showActionForm && <CancelOrder showCancelModal={showActionForm} setShowActionForm={setShowActionForm} setShowCancelModal={setShowActionForm} orderInfo={canceOrderInfo} setDisableMode={props.setDisableMode} setReloadPage={props.setReloadPage} orderId={props.order.orderId} onSubmitClick={props.onSubmitClick} />}
                        </div>
                    </React.Fragment>
                    } */}
            </div>
            {/* {showOrderScheduleModal && <LabOrderRescheduleModal value={rescheduleModalObj} showOrderScheduleModal={showOrderScheduleModal} setShowOrderScheduleModal={props.setShowOrderScheduleModal} setDisableMode={props.setDisableMode} disableMode={props.disableMode} onSubmitClick={props.onSubmitClick} setReloadPage={props.setReloadPage} reloadPage={props.reloadPage} from="deliveryInfo" />} */}
        </React.Fragment>
    )
}

export default LabOrderDeliveryInfo