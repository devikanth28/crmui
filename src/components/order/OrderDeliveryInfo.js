import React, { useContext, useEffect, useRef, useState } from 'react'
import edit_icon from '../../images/edit_icon.svg';
import dateFormat from 'dateformat';
import { Form, Button, ModalTitle } from 'react-bootstrap';
import add_icon from '../../images/add-icn-16.svg';
import Validate from '../../helpers/Validate';
import SendSmsToCustomer from '../../helpers/SendSmsToCustomer';
import OrderService from '../../services/Order/OrderService';
import OrderActionForms from './OrderActionForms';
import { OpenIcon, ViewIcon } from "@medplus/react-common-components/DataGrid";
import { StackedImages, TOAST_POSITION } from "@medplus/react-common-components/DynamicForm";
import imageLoader from "../../images/image-load.gif";
import OrderHelper from '../../helpers/OrderHelper';
import { CRM_UI } from '../../services/ServiceConstants';
import CustomerDetails from '../customer/CustomerDetails';
import { ModalBody, ModalHeader, UncontrolledTooltip } from "reactstrap";
import { AlertContext } from '../Contexts/UserContext';
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import MartOrderCancelForm from './MartOrderCancelForm';
import { gotoMartCustomerPage } from '../../helpers/CommonRedirectionPages';
import { Modal } from "react-bootstrap";
import CustomerService from '../../services/Customer/CustomerService';
import { DetailModelOpened } from '../Contexts/UserContext';

const OrderDelivaryInfo = (props) => {

    const orderInfo = props.orderInfo;
    const ordersCount = props.ordersCount;
    const orderDoctorMap = props.orderDoctorMap;
    const orderCancelReasonType = props.orderCancelReasonType;
    const orderActions = props.orderActions;
    const orderDisplayStatus = props.orderDisplayStatus;
    const deliveryPaymentMapping = props.deliveryPaymentMapping;
    const ePrescDisplayStatus = props.ePrescDisplayStatus;
    const shipmentOmsAddress = orderInfo.shipmentOmsAddress;
    const refillId = props.refillId;
    const modifiedBy = props.modifiedBy;
    const [showActionForm, setShowActionForm] = useState("");
    const [updateDetailsForm, setUpdateDetailsForm] = useState(false);
    const [orderActionsForm, setOrderActionsForm] = useState(false);
    const [action, setAction] = useState("");
    const [actionInProgress, setActionInProgress] = useState(false);
    const { setStackedToastContent } = useContext(AlertContext);
    const { selectedFormsSection, setSelectedFormsSection } = useContext(DetailModelOpened)
    const footerRef = useRef();
    const [footerHeight, setFooterFooterHeight] = useState(0);
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
    let ageType = "";
    let patientGender = "";
    if (Validate().isNotEmpty(orderInfo.ageType)) {
        switch (orderInfo.ageType) {
            case "M":
                ageType = "Months"
                break;

            case "D":
                ageType = "Days"
                break;

            default:
                ageType = "Years"
                break;
        }
    } else {
        ageType = "Days"
    }
    if (Validate().isNotEmpty(orderInfo.patientGender)) {
        switch (orderInfo.patientGender) {
            case "F":
                patientGender = "Female"
                break;

            default:
                patientGender = "Male"
                break;
        }
    }
    useEffect(() => {
        setFooterFooterHeight(footerRef.current?.offsetHeight)
    }, [orderActions])
    let atleastOneOrderAction = false;
    let orderActionsCount = 0;
    Object.entries(orderActions).forEach(([key, value]) => {
        if (value && (key !== "showAddPatientOption" && key !== "showEditAddressOption" && key !== "showEditPatientOption" && key !== "showSendSmsOption")) {
            orderActionsCount = orderActionsCount + 1;
            atleastOneOrderAction = true;
            return
        }
    });

    let orderActionsClassName = 'd-flex align-items-center justify-content-between footer p-12 gap-2';
    if (orderActionsCount == 1) {
        orderActionsClassName = 'd-flex align-items-center justify-content-end footer p-12'
    }

    const handleFailure = () => {
        setStackedToastContent({ toastMessage: "Customer is Already Opened", position: TOAST_POSITION.BOTTOM_START })
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

    const closeActionForms = () => {
        getActionForm();
    }

    const getCustomerRecentOrders = () => {
        props.toggle();
        props.history.push(`${CRM_UI}/orderSearch?customerId=${orderInfo.customerId}&fromDate=${ordersCount.fromDate} 00:00:00&toDate=${ordersCount.toDate} 23:59:59&cartId=${ordersCount.cardIdsList}`);
    }
    const CloseButton = <Button variant="" className="btn-close icon-hover" type="button" onClick={() => setUpdateDetailsForm(!updateDetailsForm)}></Button>



    let orderDisplayStatusClass = OrderHelper().getBadgeColorClassForStatus(orderDisplayStatus) + " badge rounded-pill";
    return (
        <React.Fragment>
            <div className='card border-0' style={{ "max-height": "100%" }}>
                <div className='p-2 border-bottom align-items-center'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h4 className={`fs-6 mb-0`}>Delivery & Order Information</h4>
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
                    {props.cartOrderIds && props.cartOrderIds.length > 1 ? <p className='mb-0 font-12'>Display Order ID - <span className='fw-bold'>{orderInfo.displayOrderId}</span></p> : null}
                    {(Validate().isNotEmpty(orderInfo) && Validate().isNotEmpty(orderInfo.omsOrderAttributes) && Validate().isNotEmpty(orderInfo.omsOrderAttributes[0].attributesMap) && (orderInfo.omsOrderAttributes[0].attributesMap["Without Otp"] || orderInfo.omsOrderAttributes[0].attributesMap["With Otp"])) &&
                        <div> <small className='font-12 text-secondary'>Delivery Note</small> <p className='font-12 mb-0'>{orderInfo.deliveryType === "S" ? "Invoiced" : "Order delivered"} {orderInfo.omsOrderAttributes[0].attributesMap["Without Otp"] ? <><strong className='text-brand'>Without OTP </strong> - <span>{orderInfo.omsOrderAttributes[0].attributesMap["Without Otp"]}</span></> : <strong className='text-success'>With OTP</strong>}</p></div>
                    }
                    {Validate().isNotEmpty(orderInfo.expectedDeliveryDate) && <p className="mb-0 font-12">Expected Delivery Date - <span className='text-success fw-bold'>{dateFormat(orderInfo.expectedDeliveryDate, "mmm d, yyyy")}</span></p>}
                </div>
                <div className="overflow-y-auto scroll-on-hover" style={{ "height": `calc(100% - ${footerHeight}px)` }}>
                    <div className='p-12'>
                        {
                            ordersCount
                                ? <div className='custom-border-bottom-dashed mb-3'>
                                    <div className='alert alert-info p-2 text-sm'>
                                        <p className='mb-0 d-flex align-items-center'>In the last {ordersCount.noOfDays} days, {ordersCount.ordersCount} orders have been created
                                            <OpenIcon id={`order_${orderInfo.orderId}`} handleOnClick={getCustomerRecentOrders} tooltip="View Orders" />
                                        </p>
                                    </div>
                                </div>
                                : null
                        }
                        {/* <div className='d-flex justify-content-between'>
                    <p className='text-secondary small mb-2 d-flex align-items-center'>{orderInfo.deliveryType === "D" ? "Address Details" : "Customer Details"}</p>
                    <div className=''>
                        {orderActions.showAddPatientOption
                            ? <React.Fragment>
                                <Button variant="link" disabled={actionInProgress ? 'disabled' : ''} className='me-2 icon-hover rounded-5' id="addDetailsButton" onClick={() => getActionForm("addPatientDetailsForm")}><img src={add_icon} alt="add patient Details" /></Button>
                                    <UncontrolledTooltip placement="bottom" target="addDetailsButton">
                                         {"Add Patient Details"}
                                    </UncontrolledTooltip>
                              </React.Fragment>
                            : null}
                        {orderActions.showEditPatientOption || orderActions.showEditAddressOption
                            ? <React.Fragment>
                                <Button variant=' ' disabled={actionInProgress ? 'disabled' : ''} className='btn-sm rounded-5 icon-hover btn-link' id="editDetailsButton" onClick={() => getActionForm("editOrderDetailsForm")}><img src={edit_icon} alt="edit order details" /></Button>
                                    <UncontrolledTooltip placement="bottom" target="editDetailsButton">
                                        {"Edit Patient And Address Details"}
                                    </UncontrolledTooltip>
                              </React.Fragment>
                            : null}
                    </div>
                </div> */}
                        <div className='mb-3'>
                            {/* <h6 className='mb-0 font-12'>{custName}</h6> */}
                            {

                                orderInfo.deliveryType === "D"
                                    ? <CustomerDetails customerId={orderInfo.customerId} mobileNumber={orderInfo.mobileNo} emailId={orderInfo.email} customerName={orderInfo.custName} needRule={ordersCount || !updateDetailsForm ? true : false} />
                                    : null
                            }
                            {/* <address className='custom-border-bottom-dashed pb-3'>
                        {
                            Validate().isNotEmpty(shipmentOmsAddress.addressLine1) && (!updateDetailsForm || showActionForm === 'addPatientDetailsForm')
                                ? <small className='text-secondary font-12'>{shipmentOmsAddress.addressLine2.split(",")[0]} <br />{shipmentOmsAddress.addressLine1}, {shipmentOmsAddress.addressLine2.split(",")[1]}, {shipmentOmsAddress.city.charAt(0) + shipmentOmsAddress.city.slice(1).toLowerCase()} - {shipmentOmsAddress.pinCode}<br /></small>
                                : null
                        }
                        {
                            orderInfo.communityDropOff && (!updateDetailsForm || showActionForm === 'addPatientDetailsForm')
                                ? <small className='text-secondary'><strong>Community Drop Point: </strong> {orderInfo.communityDropPoint}<br /></small>
                                : null
                        }
                        {
                            orderInfo.deliveryType === "D"
                            ? <small className='text-secondary font-12'><span>Ph.No - <a href="tel:+"{...mobileNo} title="Contact Customer" className='text-decoration-none'>{mobileNo} </a></span> </small>
                            : <small className='text-secondary font-12'><span> Customer ID - <a className='text-decoration-none'>{orderInfo.customerId}</a></span> <span> <span className='px-2'> | </span> Ph.No - <a href="tel:+"{...orderInfo.mobileNo} title="Contact Us" className='text-decoration-none'>{orderInfo.mobileNo} </a></span> {Validate().isNotEmpty(orderInfo.email) ? <p className='mb-0'> Email: <a href="mailto:"{...orderInfo.email} title='Feel free to wright us' classname="text-decoration-none">{orderInfo.email}</a></p> : null} </small>
                        }
                    </address> */}

                        </div>
                        {Validate().isNotEmpty(showActionForm) && updateDetailsForm ?
                            <Modal
                                show={true}
                                backdrop="static"
                                onHide={() => { closeActionForms() }}
                                size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                            >
                                <div className='custom-border-bottom-dashed'>
                                    <ModalHeader className="p-12" close={CloseButton}>
                                        <ModalTitle className='h6'>{showActionForm === 'editOrderDetailsForm' ? orderInfo.deliveryType === "S" ? 'Edit Doctor & Patient Details' : 'Edit Doctor, Patient & Address Details' : 'Add Patient Details'}</ModalTitle>
                                    </ModalHeader>
                                    <ModalBody className='p-0'>
                                        <OrderActionForms setActionInProgress={setActionInProgress} actionFormToRender={showActionForm} orderCancelReasonType={orderCancelReasonType} orderInfo={orderInfo} mobileNo={mobileNo} getOrderDetails={props.getOrderDetails} closeActionForms={closeActionForms} setDisableMode={props.setDisableMode} disableMode={props.disableMode} />
                                    </ModalBody>
                                </div>
                            </Modal>
                            : null
                        }
                        {/* {
                    Validate().isNotEmpty(orderInfo.patientName) && !updateDetailsForm
                        ? <div className='custom-border-bottom-dashed my-3'>
                            <p className='text-secondary small mb-2'>Patient Details</p>
                            {Validate().isNotEmpty(orderInfo.patientAge) ? <h6 className='mb-0 font-12'>{orderInfo.patientName}</h6> : null}
                            {Validate().isNotEmpty(orderInfo.patientAge) ? <p className='font-12 fw-normal'>Age - {orderInfo.patientAge} {ageType} / {patientGender}</p> : null}
                        </div>
                        : null
                }
                {
                    Validate().isNotEmpty(orderInfo.doctorName) && !updateDetailsForm
                        ? <React.Fragment>
                            <div className='d-flex justify-content-between custom-border-bottom-dashed pb-3'>
                                <div>
                                    <p className='text-secondary small mb-2'>Doctor Details</p>
                                    <h6 className='mb-2 font-12'>{orderInfo.doctorName}</h6>
                                </div>
                                {
                                    Validate().isNotEmpty(props.prescriptionImagesList)
                                        ? <div className='pointer prescriptionImages'>
                                            <p className='text-secondary small mb-0'>Prescription Images</p>
                                            <StackedImages includeLightBox defaultImage={imageLoader} images={props.prescriptionImagesList} maxImages="4" />
                                        </div>
                                        : null
                                }
                            </div>
                        </React.Fragment>
                        : null
                } */}
                        {

                            (Validate().isNotEmpty(orderInfo.patientName) && !updateDetailsForm) && (Validate().isNotEmpty(orderInfo.doctorName) && !updateDetailsForm) ?
                                <React.Fragment>
                                    <div className='custom-border-bottom-dashed mb-3'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <p className='text-secondary font-12 mb-2'>Doctor & Patient Details</p>
                                            {orderActions.showEditPatientOption || orderActions.showEditAddressOption
                                                ? <React.Fragment>
                                                    <Button variant=' ' disabled={actionInProgress ? 'disabled' : ''} className='btn-sm rounded-5 icon-hover btn-link' id="editDetailsButton" onClick={() => getActionForm("editOrderDetailsForm")}><img src={edit_icon} alt="edit order details" /></Button>
                                                    <UncontrolledTooltip placement="bottom" target="editDetailsButton">
                                                        {orderActions.showEditAddressOption ? "Edit Doctor, Patient And Address Details" : "Edit Doctor & Patient Details"}
                                                    </UncontrolledTooltip>
                                                </React.Fragment>
                                                : null}
                                        </div>
                                        <div className='d-flex justify-content-between pb-3'>
                                            <div>
                                                <label className='font-12 text-secondary mb-1'>Doctor Name</label>
                                                <h6 className='mb-0 font-14'>Dr. {orderInfo.doctorName}</h6>
                                            </div>
                                            {
                                                Validate().isNotEmpty(props.prescriptionImagesList)
                                                    ? <div className='pointer'>
                                                        <StackedImages forms={props.forms} displayForms={props.displayProductDetails} tooltip="View Prescriptions" includeLightBox defaultImage={imageLoader} images={props.prescriptionImagesList} maxImages="4" />
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <p className='text-secondary font-12 mb-1'>Patient Name</p>
                                            {orderActions.showAddPatientOption
                                                ? <React.Fragment>
                                                    <Button variant="link" disabled={actionInProgress ? 'disabled' : ''} className='icon-hover rounded-5' id="addDetailsButton" onClick={() => getActionForm("addPatientDetailsForm")}><img src={add_icon} alt="add patient Details" /></Button>
                                                    <UncontrolledTooltip placement="bottom" target="addDetailsButton">
                                                        {"Add Patient Details"}
                                                    </UncontrolledTooltip>
                                                </React.Fragment>
                                                : null}
                                        </div>
                                        {Validate().isNotEmpty(orderInfo.patientName) ? <h6 className='mb-0 font-14'>{orderInfo.patientName}</h6> : null}
                                        {Validate().isNotEmpty(orderInfo.patientAge) ? <p className='font-14'>Age - {orderInfo.patientAge} {ageType} / {patientGender}</p> : null}
                                    </div>

                                </React.Fragment> : Validate().isNotEmpty(orderInfo.patientName) && !updateDetailsForm
                                    ? <div className='custom-border-bottom-dashed my-3 pb-3'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <p className='text-secondary font-12 mb-1'>Patient Name</p>
                                        </div>
                                        <div className={ Validate().isNotEmpty(props.prescriptionImagesList) ? 'd-flex justify-content-between align-items-center':''}>
                                            <div>
                                                {Validate().isNotEmpty(orderInfo.patientAge) ? <h6 className='mb-0 font-14'>{orderInfo.patientName}</h6> : null}
                                                {Validate().isNotEmpty(orderInfo.patientAge) ? <p className='mb-0 font-14'>Age - {orderInfo.patientAge} {ageType} / {patientGender}</p> : null}
                                            </div>
                                            {
                                                Validate().isNotEmpty(props.prescriptionImagesList)
                                                    ? <div className='pointer'> <StackedImages tooltip="View Prescriptions" includeLightBox defaultImage={imageLoader} images={props.prescriptionImagesList} maxImages="4" /></div>
                                                    : null
                                            }
                                        </div>
                                       
                                        
                                    </div>
                                    : Validate().isNotEmpty(orderInfo.doctorName) && !updateDetailsForm
                                        ? <React.Fragment>
                                            <div className='d-flex justify-content-between custom-border-bottom-dashed pb-3'>
                                                <div>
                                                    <p className='text-secondary small mb-2'>Doctor Details</p>
                                                    <h6 className='mb-2 font-12'>{orderInfo.doctorName}</h6>
                                                </div>
                                                {
                                                    Validate().isNotEmpty(props.prescriptionImagesList)
                                                        ? <div className='pointer'>
                                                            <StackedImages tooltip="View Prescriptions" includeLightBox defaultImage={imageLoader} images={props.prescriptionImagesList} maxImages="4" />
                                                        </div>
                                                        : null
                                                }
                                            </div>
                                        </React.Fragment>
                                        : null
                        }
                        <div className='justify-content-between d-flex'><p className='text-secondary font-12 mb-2 d-flex align-items-center'>{orderInfo.deliveryType === "D" ? "Address Details" : "Customer Details"}</p>
                            {orderActions.showAddPatientOption
                                ? <React.Fragment>
                                    <Button variant="link" disabled={actionInProgress ? 'disabled' : ''} className='icon-hover rounded-5' id="addDetailsButton" onClick={() => getActionForm("addPatientDetailsForm")}><img src={add_icon} alt="add patient Details" /></Button>
                                    <UncontrolledTooltip placement="bottom" target="addDetailsButton">
                                        {"Add Patient Details"}
                                    </UncontrolledTooltip>
                                </React.Fragment>
                                : null}</div>
                        <address className='custom-border-bottom-dashed pb-3 mb-0'>
                            <h6 className='mb-0 font-14'>{custName}</h6>
                            {
                                Validate().isNotEmpty(shipmentOmsAddress.addressLine1) && (!updateDetailsForm || showActionForm === 'addPatientDetailsForm')
                                    ? <small className='text-secondary font-12'>{shipmentOmsAddress.addressLine2.split(",")[0]} <br />{shipmentOmsAddress.addressLine1}, {shipmentOmsAddress.addressLine2.split(",")[1]}, {shipmentOmsAddress.city.charAt(0) + shipmentOmsAddress.city.slice(1).toLowerCase()} - {shipmentOmsAddress.pinCode}<br /></small>
                                    : null
                            }
                            {
                                orderInfo.communityDropOff && (!updateDetailsForm || showActionForm === 'addPatientDetailsForm')
                                    ? <small className='text-secondary'><strong>Community Drop Point: </strong> {orderInfo.communityDropPoint}<br /></small>
                                    : null
                            }
                            {
                                orderInfo.deliveryType === "D"
                                    ? <small className='text-secondary font-12'><span>Ph.No - <a href="tel:+"{...mobileNo} title="Call to Customer" className='text-decoration-none'>{mobileNo} </a></span> </small>
                                    : <small className='text-secondary font-12'><span> Customer ID - <a onClick={() => gotoMartCustomerPage({ customerId: orderInfo.customerId, mobile: mobileNo }, handleFailure)} className='text-decoration-none' href="javascript:void(0)" rel="noopener">{orderInfo.customerId}</a></span> <span> <span className='px-2'> | </span> Ph.No - <a href="tel:+"{...orderInfo.mobileNo} title="Call to Customer" className='text-decoration-none'>{orderInfo.mobileNo} </a></span> {Validate().isNotEmpty(orderInfo.email) ? <p className='mb-0'> Email: <a href="javascript:void(0)" onClick={() => window.open(`mailto:${orderInfo.email}`)} title={`Send an email to ${orderInfo.email}`} className="text-decoration-none">{orderInfo.email}</a></p> : null} </small>
                            }
                        </address>
                    </div>
                    <div className={`${Validate().isNotEmpty(orderInfo.remarks) ? ' py-0' : 'pt-3'} p-12`}>
                        <div className={`pb-3 ${Validate().isNotEmpty(orderInfo.remarks) ? 'custom-border-bottom-dashed' : ""}`}>
                            <div className='d-flex justify-content-between'>
                                <p className='text-secondary mb-0 font-12'>Order Status</p>
                                <p className='text-secondary mb-0 font-12'>Order Date</p>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                                <span className={orderDisplayStatusClass} size="sm" >
                                    {orderDisplayStatus}
                                </span>
                                <p className='font-12 mb-1'>{dateFormat(orderInfo.dateCreated, "mmm d, yyyy")}</p>
                            </div>
                            <div className={`d-flex justify-content-between flex-wrap gap-2 ${atleastOneOrderAction ? "" : " pb-0"}`}>
                                
                            <div><small className='text-secondary font-12'>Store ID</small><p className='text-black font-12 mb-0'>{orderInfo.storeId}</p></div>
                            {orderInfo.storeName &&<div><small className='text-secondary font-12'>Store Name</small><p className='text-black font-12 mb-0'>{orderInfo.storeName}</p></div>}
                                {
                                    
                                        
                                         orderInfo.deliveryType === "D"
                                            ? orderInfo.communityDropOff
                                                ? <div><small className='text-secondary font-12'>Delivery Type </small><p className='text-black font-12 mb-0'>Community Drop</p></div>
                                                : <div><small className='text-secondary font-12'>Delivery Type</small> <p className='text-black font-12 mb-0'>Home Delivery</p></div>
                                        : (orderInfo.deliveryType === "S" && orderInfo.pickStoreId && orderInfo.pickStoreName) ?
                                            <div>
                                                <small className='text-secondary font-12'>Delivery Type </small>
                                                <p className='text-black font-12 mb-0'>Store Pick - {orderInfo.pickStoreId}</p>
                                                <div className='small text-secondary mt-2'>{orderInfo.pickStoreName}</div>
                                            </div>
                                            : null
                                }
                                {
                                    Validate().isNotEmpty(ePrescDisplayStatus)
                                        ? <div><small className='text-secondary font-12'> E Presc Status</small> <p className='text-black font-12 mb-0'>{ePrescDisplayStatus}</p></div>
                                        : null
                                }
                                {
                                    Validate().isNotEmpty(orderDoctorMap.comment)
                                        ? <div><small className='text-secondary font-12'>Doctor Comment</small> <p className='text-black font-12 mb-0'>{orderDoctorMap.comment}</p></div>
                                        : null
                                }
                                {
                                    Validate().isNotEmpty(orderInfo.customerCouponCode)
                                        ? <div><small className='text-secondary font-12'> Applied Coupon</small> <p className='text-success font-14 mb-0'>{orderInfo.customerCouponCode}</p></div>
                                        : Validate().isNotEmpty(orderInfo.couponCode)
                                            ? <div><small className='text-secondary font-12'> Applied Coupon</small> <p className='text-success font-14 mb-0'>{orderInfo.couponCode}</p></div>
                                            : null
                                }
                                {
                                    orderInfo.orderType === "REDEMPTION"
                                        ? <div> <small className='text-secondary font-12'> Delivery Time </small><p className='text-black font-12 mb-0'>{orderInfo.deliveryTime}</p></div>
                                        : null
                                }
                                {
                                    orderInfo.status === "SW" && Validate().isNotEmpty(deliveryPaymentMapping) && Validate().isNotEmpty(deliveryPaymentMapping.ResheduleTime)
                                        ? <div> <small className='text-secondary font-12'>Reschedule Time</small> <p className='text-black font-12 mb-0'>{deliveryPaymentMapping.ResheduleTime}</p></div>
                                        : null
                                }
                            </div>
                            
                                
                            {props.orderInfoResponse?.orderInfo?.cancellationRequested =="Y" && props.orderInfoResponse?.orderInfo?.status == "M" &&  <div className='border-top mt-3 pt-3 d-flex'>
                                <p className='text-body-secondary col-2'>Note :</p> <p className='font-12 m-1 text-brand col-10'>Currently this order is processing, cancellation request will be completed once the order reaches to store.</p>
                            </div>}

                            {/* {Validate().isNotEmpty(showActionForm) && orderActionsForm
                    ? <div className='mt-3'>
                        <OrderActionForms setActionInProgress={setActionInProgress} actionFormToRender={showActionForm} orderCancelReasonType={orderCancelReasonType} orderInfo={orderInfo} mobileNo={mobileNo} getOrderDetails={props.getOrderDetails} closeActionForms={closeActionForms} setDisableMode={props.setDisableMode} disableMode={props.disableMode}/>
                    </div>
                    : null
                } */}
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
                        </div>
                    </div>
                    {
                        (orderInfo.status === "C" && (orderInfo.cancellationRequestedReason || orderInfo.remarks))             
                            ?
                            <React.Fragment>
                                <div className='p-12 pb-0'>
                                    <h4 className='fs-6'>Remarks</h4>
                                    <p className='font-12'>{Validate().isNotEmpty(orderInfo.cancellationRequestedReason) ? orderInfo.cancellationRequestedReason == "Others" ? `${orderInfo.cancellationRequestedReason} : ${orderInfo.remarks}` : `${orderInfo.cancellationRequestedReason}` : `${orderInfo.remarks}`}</p>
                                </div>
                            </React.Fragment>
                            : null
                    }
                    {(Validate().isNotEmpty(orderInfo) && Validate().isNotEmpty(orderInfo.omsOrderAttributes) && Validate().isNotEmpty(orderInfo.omsOrderAttributes[0].attributesMap) && (orderInfo.omsOrderAttributes[0].attributesMap["Without Otp"] || orderInfo.omsOrderAttributes[0].attributesMap["With Otp"])) &&
                        <div className='p-12'> <small className='font-12 text-secondary'>Delivery Note</small> <p className='font-12'>{orderInfo.deliveryType === "S" ? "Invoiced" : "Order delivered"} {orderInfo.omsOrderAttributes[0].attributesMap["Without Otp"] ? <><strong>Without OTP </strong> - <span>{orderInfo.omsOrderAttributes[0].attributesMap["Without Otp"]}</span></> : <strong>With OTP</strong>}</p></div>
                    }
                </div>
            </div>

        </React.Fragment>
    )
}

export default OrderDelivaryInfo;
