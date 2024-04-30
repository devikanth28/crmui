import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import React, { useContext, useEffect, useRef, useState } from "react";
import {  UncontrolledTooltip } from "reactstrap";
import OrderHelper from '../../helpers/OrderHelper';
import Validate from "../../helpers/Validate";
import CloseIcon from '../../images/cross.svg';
import LabOrderService from '../../services/LabOrder/LabOrderService';
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import DynamicGridHeight from '../Common/DynamicGridHeight';
import { AlertContext, DetailModelOpened } from "../Contexts/UserContext";
import PaymentModeOptions from "./labOrderModal/PaymentModeOptions";
import { DataGridComponent, DetailWrapper, FormsComponent } from '../Common/CommonModel';
import { Button } from 'react-bootstrap';
import { getGenderString } from '../../helpers/CommonHelper';
import CurrencyFormatter from '../Common/CurrencyFormatter';



const CollectPaymentsModal = (props) => {

    const validate = Validate();
    const headerRef = useRef(0);
    const {setAlertContent,setStackedToastContent} = useContext(AlertContext);
    const { selectedFormsSection, setSelectedFormsSection } = useContext(DetailModelOpened);
 
    const [initialLoading, setInitialLoading] = useState(true);
    const [modalData, setModalData] = useState({});
    const [paymentOption, setPaymentOption] = useState("CASH");
    const [submitState, setSubmitState] = useState(true);
    const [retryState, setRetryState] = useState(false);
    const [statusState, setStatusState] = useState(false);
    const [paymentMode, setPaymentMode] = useState(true);
    const labOrderService = LabOrderService();

    useEffect(() => {
        getModalData(props.value.orderId);
    }, [statusState,retryState]);

    const getModalData = async (orderId) => {
        setInitialLoading(true);
        let obj = {
            orderId: orderId,
        }
        props.setDisableMode(true);
        await labOrderService.collectLabOrderPaymentView(obj).then(data => {
            if (data && data.statusCode === 'SUCCESS' && Validate().isNotEmpty(data.dataObject)) {
                setModalData(data.dataObject);
                if(data.dataObject.dataSet.isPaymentPending){
                    setSubmitState(false);
                    setStatusState(true);
                }
            }
            else{
                setStackedToastContent({toastMessage:data.message});
            }
            setInitialLoading(false);
            props.setDisableMode(false);
        }).catch((err) => {
            console.log(err);
            setInitialLoading(false);
            setStackedToastContent({toastMessage:"Unable to process, Please try again!"});
            props.setDisableMode(false);
        });
    }

    const acknowledgeSubmit = (orderId) => {
        props.setDisableMode(true);
        labOrderService.collectLabOrderPayment({ "orderId": orderId}, {"paymentMode": "" }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode === "SUCCESS") {
                props.setShowCollectPaymentsModal(!props.showCollectPaymentsModal);
                props.onSubmitClick(orderId);
            }
            else{
                setStackedToastContent({toastMessage:data.message})
            }
            props.setDisableMode(false);

        }).catch((err) => {
            console.log(err);
            props.setDisableMode(false);
            setStackedToastContent({toastMessage:"Unable to process, Please try again!"})
        });

    }

    const handleStatusCheck = () => {
        let orderId = props.value.orderId;
        props.setDisableMode(true);
        labOrderService.checkLabOrderPaymentStatus({ "orderId": orderId }).then(data => {
            if (data?.statusCode == "SUCCESS") {
                if (data?.dataObject == "SUCCESS") {
                    setStackedToastContent({toastMessage:"Payment Completed Successfully"});
                    if(validate.isNotEmpty(props.onSubmitClick)){
                        props.onSubmitClick(props.value.orderId);
                    }
                    props.setShowCollectPaymentsModal(!props.showCollectPaymentsModal);
                    setPaymentMode(false);
                }
                else if (data?.dataObject == "PENDING") {
                    setStackedToastContent({toastMessage:"Payment Pending"});
                }
                else if (data?.dataObject == "FAILURE") {
                    setStackedToastContent({toastMessage:"Payment Failed"});
                    setSubmitState(false);
                    setRetryState(true);
                    setStatusState(false);
                }
            }
            else if (data?.dataObject == "FAILURE") {
                setStackedToastContent({toastMessage:data?.message});
            }
            props.setDisableMode(false);
        }).catch((err) => {
            setStackedToastContent({toastMessage:"Unable to process your Request"});
            props.setDisableMode(false);
        });

    }

    const collectPaymentsGrid = () => {
        const collectPaymentDataGrid = modalData?.dataGrids?.collectPayment;
        const collectPaymentDataSet = modalData?.dataSet?.collectedPaymentSet;
        return (
            <React.Fragment>
                {validate.isNotEmpty(collectPaymentDataSet) &&
                    <DynamicGridHeight dataSet={collectPaymentDataSet} metaData={collectPaymentDataGrid} id="collect-payment-dataset" className="card mb-3 scroll-grid-on-hover">
                        <CommonDataGrid {...collectPaymentDataGrid} dataSet={[...collectPaymentDataSet]} />
                   </DynamicGridHeight>
                }
            </React.Fragment>
        )
    }

    const acknowledgePatients = () => {
        const dataSet = modalData?.dataSet;
        const acknowledgePatientDataGrid = modalData?.dataGrids?.acknowledgePatient;
        const acknowledgePatientDataSet = modalData?.dataSet?.acknowledgementPatientData;
        if (validate.isEmpty(dataSet)) {
            return <React.Fragment></React.Fragment>
        }
        return (
            <DetailWrapper>
                <FormsComponent headerText={"Delivery & Order Information"} id={"FormsComp"} className={`${selectedFormsSection ? "border" : ''} overflow-y-auto h-100 shadow-none`}>
                    <div className="card border-0" style={{maxHeight:"100%"}}>
                        <div className='p-2 border-bottom d-flex justify-content-between align-items-center'>
                            <div>
                                <h4 className="fs-6">Delivery &amp; Order Information</h4>
                                <p className="small mb-0">Booked time slot - <span className="text-success fw-bold">  {dataSet.bookedSlotDate}, {dataSet.bookedSlotTime}</span></p>
                            </div>
                            <div>
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
                        <div className='overflow-y-auto'>
                            <div className="p-12 mb-0">
                                <p className="text-secondary font-12 mb-2">Doctor &amp; Patient Details</p>
                                <div className='pb-3'>
                                    <label class="font-12 text-secondary mb-1">Doctor Name</label>
                                    <h6 className="mb-0 font-14">{dataSet.patientInfo.drName}</h6>
                                </div>
                                <div className='custom-border-bottom-dashed mb-3'>
                                    <label class="font-12 text-secondary mb-1">Patient Name</label>
                                    <h6 className="font-14 mb-0">{dataSet.patientInfo.patientName}</h6>
                                    <p className="font-14">{dataSet.patientInfo.patientAge} / { getGenderString(dataSet.patientInfo.gender)}</p>
                                </div>

                                {/* <div className="p-3 custom-border-bottom-dashed mb-3">
                            <p className="small  text-secondary mb-2">Patient Details </p>
                            <p className="font-weight-bold mb-0"> {dataSet.patientInfo.patientName}</p>
                            <p className="small  mb-0">/{dataSet.patientInfo.gender}</p>
                        </div> */}
                                {/* <div className="px-3">
                            <p className="text-secondary small mb-2">Doctor Details</p>
                            <h6 className="mb-2 font-14">{dataSet.patientInfo.drName}</h6>
                        </div> */}
                                <div>
                                    <p className="text-secondary font-12 mb-2">Payment Details</p>
                                    <div className="d-flex justify-content-between">
                                        {validate.isNotEmpty(dataSet.totalAmount) &&
                                            <React.Fragment>
                                                <p className="text-secondary  mb-0 font-14">Total Amount </p> <h6 className="mb-0 font-14 fw-bold"><CurrencyFormatter data={dataSet.totalAmount} decimalPlaces={-1} /></h6>
                                            </React.Fragment>}
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        {validate.isNotEmpty(dataSet.amountPaid) &&
                                            <React.Fragment>
                                                <p className="text-secondary  mb-0 font-14">Amount Paid </p> <h6 className="mb-0 font-14 fw-bold"><CurrencyFormatter data={dataSet.amountPaid} decimalPlaces={-1} /></h6>
                                            </React.Fragment>}
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        {validate.isNotEmpty(dataSet.balanceAmount) &&
                                            <React.Fragment>
                                                <p className="text-secondary mb-0 font-14">Balance Amount </p> <h6 className="mb-0 font-14 fw-bold"><CurrencyFormatter data={dataSet.balanceAmount} decimalPlaces={-1} /></h6>
                                            </React.Fragment>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FormsComponent>
                <DataGridComponent id={"DataGridComp"} className="h-100 overflow-y-auto shadow-none">
                    <div class="card border-0">
                        <div className='overflow-y-auto'>
                            <div className='p-12'>
                                <p class="custom-fieldset mb-1">
                                    Test Details
                                </p>
                                {collectPaymentsGrid()}
                                {validate.isNotEmpty(acknowledgePatientDataSet) &&
                                    <React.Fragment>
                                        <p class="custom-fieldset mb-1">
                                            Payment Details
                                        </p>
                                        <div>
                                            <DynamicGridHeight dataSet={acknowledgePatientDataSet} metaData={acknowledgePatientDataGrid} id="acknowledge-patient-dataset" className="card mb-3 scroll-grid-on-hover">
                                                <CommonDataGrid {...acknowledgePatientDataGrid} dataSet={[...acknowledgePatientDataSet]}
                                                    callBackMap={paymentDetailsCallBack} />
                                            </DynamicGridHeight>

                                        </div>
                                        <div className="text-end mt-3">
                                            <Button className="btn btn-danger" disabled={props.disableMode} onClick={() => acknowledgeSubmit(props.value.orderId)}> Submit</Button>
                                        </div>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                </DataGridComponent>
            </DetailWrapper>
        )
    }

    const submitButton = (paymentDetails) => {
        if(props.disableMode){
            return
        }
        const dataSet = modalData.dataSet
        setPaymentOption(paymentDetails.mode);
        let data = { orderId: props.value.orderId, cartId: dataSet.cartId };
        let param = {};

        if (paymentDetails.mode === "CASH" && dataSet.roundedValue != 0) {
            data = { ...data, labOrderPaymentDetail: [{ ...paymentDetails, mode: "cash", orderId: props.value.orderId }, { ...paymentDetails, amount: -1*dataSet.roundedValue, mode: "Rounding", orderId: props.value.orderId }] };
            param = { paymentMode: "CASH" };
        }
        if (paymentDetails.mode === "CASH" && dataSet.roundedValue === 0) {
            data = { ...data, labOrderPaymentDetail: [{ ...paymentDetails, mode: "cash", orderId: props.value.orderId }] };
            param = { paymentMode: "CASH" }
        }
        if (paymentDetails.mode === "CC") {
            data = { ...data, labOrderPaymentDetail: [{ ...paymentDetails, mode: "CC", orderId: props.value.orderId, txnNumber: paymentDetails.transactionId }] };
            param = { paymentMode: "CC" }
        }
        if (paymentDetails.mode === "EDC") {
            data = { ...data, labOrderPaymentDetail: [{ ...paymentDetails, amount: dataSet.netCashToBeCollected, cartId: dataSet.cartId, gateWayAmount: dataSet.netCashToBeCollected, gateWayId: "PAYTM_EDC_GATEWAY", orderId: props.value.orderId }] };
            param = { paymentMode: "EDC" }
        }
        props.setDisableMode(true);
        labOrderService.collectLabOrderPayment(data, param).then(data => {
            if (data && data.statusCode === 'SUCCESS' && Validate().isNotEmpty(data.dataObject)) {
                setStackedToastContent({toastMessage:"Payment Successful"})
                props.setShowCollectPaymentsModal(!props.showCollectPaymentsModal);
                if(validate.isNotEmpty(props.onSubmitClick)){
                    props.onSubmitClick(props.value.orderId);
                }
            }
            else if (data && data.statusCode == 'FAILURE') {
                setStackedToastContent({toastMessage:"Failure"})
                setSubmitState(false);
                setRetryState(true);
                setStatusState(false);
            }
            else if (data && data.statusCode == 'SUCCESS') {
                setStackedToastContent({toastMessage:"Success"});
                setSubmitState(false);
                setRetryState(false);
                setStatusState(true);
                if(validate.isNotEmpty(props.onSubmitClick)){
                    props.onSubmitClick(props.value.orderId);
                }
            }
            props.setDisableMode(false);
        }).catch((err) => {
            console.log(err);
            setStackedToastContent({toastMessage:"Unable to process request, Please try again!"})
            props.setDisableMode(false);
        });
    }

    const paymentDetailsCallBack = {
        "amountFlag": (props) => {
            const { row } = props;
            return <React.Fragment>
                <div><CurrencyFormatter data={row?.amount} decimalPlaces={-1} /></div>
            </React.Fragment>
        },
        "statusFlag": (props) => {
            const { row } = props;
            let cellClass = OrderHelper().getBadgeColorClassForStatus(row.status) + " badge rounded-pill"
            return <React.Fragment>
                <p className={cellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(row.status)}</p>
            </React.Fragment>
        },
    }

    const collectPayments = () => {
        const dataSet = modalData?.dataSet;
        return (
            <DetailWrapper>
                <FormsComponent headerText={"Delivery & Order Information"} id={"FormsComp"} className={`${selectedFormsSection ? "border" : ''} overflow-y-auto h-100 shadow-none`}>
                        <div className="card border-0" style={{maxHeight:"100%"}}>
                            <div className='p-2 border-bottom d-flex justify-content-between align-items-center'>
                                <div>
                                    <h4 className="fs-6">Delivery &amp; Order Information</h4>
                                    <p className="small mb-0">Booked time slot - <span className="text-success fw-bold">{dataSet.bookedSlotDate}, {dataSet.bookedSlotTime}</span></p>
                                </div>
                                <div>
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
                            <div className='overflow-y-auto scroll-on-hover'>
                                <div className="p-12 custom-border-bottom-dashed mb-0">
                                    <p className="text-secondary font-12 mb-2">Doctor &amp; Patient Details</p>
                                    <div className='pb-3'>
                                        <label class="font-12 text-secondary mb-1">Doctor Name</label>
                                        <h6 className="mb-0 font-14">{dataSet.patientInfo.drName}</h6>
                                    </div>
                                    <div>
                                        <label class="font-12 text-secondary mb-1">Patient Name</label>
                                        <h6 className="font-14 mb-0">{dataSet.patientInfo.patientName}</h6>
                                        <p className="font-14  mb-0">{dataSet.patientInfo.patientAge} / {dataSet.patientInfo.gender}</p>
                                    </div>
                                </div>
                                <div className="p-12">
                                    <p className="text-secondary font-12 mb-2">Payment Details</p>
                                    {validate.isNotEmpty(dataSet.totalOrderAmount) && dataSet.totalOrderAmount > 0 &&
                                        <div className="d-flex justify-content-between">
                                            <p className="text-secondary  mb-0 font-14">Total Order Amount </p> <h6 className="mb-0 font-14"><CurrencyFormatter data={dataSet.totalOrderAmount} decimalPlaces={2} /></h6>
                                        </div>}

                                    {/* {validate.isNotEmpty(dataSet.appliedMdxPoints) &&
                                        <div className="d-flex justify-content-between">
                                            <p className="text-secondary  mb-0 font-14">Applied MDx Points </p> <h6 className="mb-0 font-14">{(dataSet.appliedMdxPoints)} </h6></div>} */}

                                {validate.isNotEmpty(dataSet.appliedMdxPoints) &&
                                    <div className="d-flex justify-content-between">
                                        <p className="text-secondary  mb-0 font-14">Applied MDx Points </p> <h6 className="mb-0 font-14">{(dataSet.appliedMdxPoints)} </h6></div>}

                                {validate.isNotEmpty(dataSet.appliedMdxPointsValue) &&
                                    <div className="d-flex justify-content-between">
                                        <p className="text-secondary  mb-0 font-14">Applied MDx Points Value </p> <h6 className="mb-0 font-14"><CurrencyFormatter data={dataSet.appliedMdxPointsValue} decimalPlaces={-1} /></h6></div>}

                                    {validate.isNotEmpty(dataSet.roundedValue) &&
                                        <div className="d-flex justify-content-between">
                                            <p className="text-secondary  mb-0 font-14">Rounded Value </p> <h6 className="mb-0 font-14"><CurrencyFormatter data={paymentOption == "CASH" ? dataSet.roundedValue : 0} decimalPlaces={-1} /></h6>
                                        </div>}

                                    <div className="d-flex justify-content-between">
                                        <p className="text-secondary  mb-0 font-14">Need To Collect Amount </p> <h6 className="mb-0 font-14"><CurrencyFormatter data={paymentOption == 'CASH' ? dataSet.needToCollectAmount : dataSet.netCashToBeCollected} decimalPlaces={2} /></h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormsComponent>
                    <DataGridComponent id={"DataGridComp"} className="h-100 overflow-y-auto shadow-none">
                        <div class="card border-0">
                            <div className='overflow-y-auto'>
                                <div className='p-12'>
                                <p class="custom-fieldset mb-1">
                                    Test Details
                                </p>
                                {collectPaymentsGrid()}                        
                                {paymentMode && <PaymentModeOptions handleReturn={submitButton} neededToCollect={dataSet.needToCollectAmount} roundedValue={dataSet.roundedValue} /* receivedAmount totalReceivedAmount */ edcDevices={modalData.dataSet.edcDevices} collectPayment submitState={submitState} retryState={retryState} statusState={statusState} setSubmitState={setSubmitState} setRetryState={setRetryState} setStatusState={setStatusState} orderId={props.value.orderId} setPaymentMode={setPaymentMode} handleStatusCheck={handleStatusCheck} isEDCRequired setDisableMode={props.setDisableMode} disableMode={props.disableMode} setPaymentOption={setPaymentOption} />} 
                                </div>
                            </div>                       
                        </div>
                    </DataGridComponent>
            </DetailWrapper>

        )
    }
    const toggle = () => props.setShowCollectPaymentsModal(!props.showCollectPaymentsModal);

    return(
        <React.Fragment>
            <div className="custom-modal">
                <Wrapper className="m-0">
                    <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-lg-3 px-2 py-1">
                        {props.flag == "collect" ? <React.Fragment> <p className='mb-0 text-truncate' style={{maxWidth: "90%"}}><span className='hide-on-mobile'>Make Payment for </span>Order Id - <strong>{props.value.orderId}</strong></p> </React.Fragment> : <React.Fragment><p className='mb-0 text-truncate' style={{maxWidth: "90%"}}><span className='hide-on-mobile'>Acknowledge Patient for </span>Order Id - <strong>{props.value.orderId}</strong></p> </React.Fragment>}
                        <div className=" d-flex align-items-center">
                            <Button variant=" " disabled={props.disableMode} onClick={toggle} className="rounded-5 icon-hover btn-link">
                            <span className='custom-close-btn icon-hover'></span>
                            </Button>
                        </div>
                    </HeaderComponent>
                    <BodyComponent loading={initialLoading} allRefs={{ headerRef }} className="body-height pe-1" >
                        {(!initialLoading && validate.isNotEmpty(modalData)) && <div className={`h-100`}>
                            {props.flag == "collect" ? collectPayments() : acknowledgePatients()}
                        </div>
                        }
                    </BodyComponent>
                </Wrapper>
            </div>
        </React.Fragment>
    )
}

export default CollectPaymentsModal;