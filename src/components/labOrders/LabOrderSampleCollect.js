import CommonDataGrid, { SearchIcon } from '@medplus/react-common-components/DataGrid';
import DynamicForm, { CustomSpinners, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useRef, useState } from "react";
import { Input, UncontrolledTooltip } from "reactstrap";
import Validate from "../../helpers/Validate";
import CloseIcon from '../../images/cross.svg';
import DynamicGridHeight from '../Common/DynamicGridHeight';
import LabOrderService from "../../services/LabOrder/LabOrderService";
import { BodyComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure';
import { AlertContext, DetailModelOpened, UserContext } from "../Contexts/UserContext";
import PaymentModeOptions from './labOrderModal/PaymentModeOptions';
import { DataGridComponent, DetailWrapper, FormsComponent } from '../Common/CommonModel';
import { Button } from 'react-bootstrap';
import { getGenderString } from '../../helpers/CommonHelper';
import CurrencyFormatter from '../Common/CurrencyFormatter';


const LabOrderSampleCollect = ({ helpers, ...props }) => {

    const validate = Validate();
    const headerRef = useRef(0);
    const userSessionInfo = useContext(UserContext);
    const { setAlertContent, setStackedToastContent } = useContext(AlertContext);
    const { selectedFormsSection, setSelectedFormsSection } = useContext(DetailModelOpened);
    const labOrderService = LabOrderService();

    const [initialLoading, setInitialLoading] = useState(true);
    const [modalData, setModalData] = useState(undefined);
    const [vacutainersInfo, setVacutainersInfo] = useState(undefined);
    const [cancelItemselectedRows, setCancelItemselectedRows] = useState([]);
    const [showCollectionData, setShowCollectionData] = useState(false);
    const [agentId, setAgentId] = useState();
    const [collectionCenterAgentId, setCollectionCenterAgentId] = useState();
    const [totalReceivingAmount, setTotalReceivingAmount] = useState();
    const [disableBarcode, setDisableBarcode] = useState(false);
    const [disableFindVacutainers, setDisableFindVacutainers] = useState(false);
    const [displayVacutainerButton, setDisplayVacutainerButton] = useState(false);
    const [selectAllDisabled, setSelectAllDisabled] = useState(false);
    const [selectCancelAllItemsOption, setSelectCancelAllItemsOption] = useState(false);
    const [triggerSelectedAll, setTriggerSelectedAll] = useState(false);
    const [paymentOption, setPaymentOption] = useState('CASH');
    const [isLoading, setIsLoading] = useState(false);
    const [isSampleReCollectedTestCode, setIsSampleReCollectedTestCode] = useState({});
 
    useEffect(() => {
        getSampleCollectModalData(props.value.orderId);
    }, []);

    useEffect(() => {
        let checkedItems = [];
        if (selectCancelAllItemsOption) {
            modalData.sampleData.forEach((sample) => {
                if (Validate().isNotEmpty(sample) && Validate().isNotEmpty(sample.testCode)) {
                    checkedItems.push(sample.testCode);
                }
            })
            setCancelItemselectedRows(checkedItems);
        } else if (triggerSelectedAll) {
            let selectedItems = cancelItemselectedRows;
            setCancelItemselectedRows(selectedItems);
            setTriggerSelectedAll(false);
        } else if (!selectCancelAllItemsOption) {
            setCancelItemselectedRows(checkedItems);
        }

    }, [selectCancelAllItemsOption])

    const toggle = () => props.setShowSampleCollectModal(!props.showSampleCollectModal);

    const getSampleCollectModalData = async (orderId) => {
        setInitialLoading(true);
        const obj = {
            orderId: orderId
        }
        props.setDisableMode(true);
        await labOrderService.labOrderSampleCollect(obj).then(data => {
            if (data && data.statusCode == 'SUCCESS' && validate.isNotEmpty(data.dataObject)) {
                setModalData(data.dataObject);
                if (data.dataObject.sampleCollectModalMap && data.dataObject.sampleCollectModalMap.agentId) {
                    setAgentId(data.dataObject.sampleCollectModalMap.agentId);
                }
                checkForSelectAllOption(data.dataObject);
                if (validate.isNotEmpty(data.dataObject.isSampleReCollectedTestCode)) {
                    setIsSampleReCollectedTestCode(data.dataObject.isSampleReCollectedTestCode);
                }
            }
            else {
                setStackedToastContent({ toastMessage: data.message })
            }
            setInitialLoading(false);
            props.setDisableMode(false);
        }).catch(error => {
            setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" });
            setInitialLoading(false);
            props.setDisableMode(false)
        });
    }

    const checkForSelectAllOption = (data) => {
        if (validate.isNotEmpty(data.sampleData)) {
            Object.values(data.sampleData).forEach((sample) => {
                if (data?.statusList && data.statusList.includes(sample.status)) {
                    setSelectAllDisabled(true);
                    return;
                }
            })
        }
    }

    const formatDate = () => {
        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const getTimeStringForToday = () => {
        let date = new Date();
        let seconds = date.getSeconds() + "";
        let minutes = date.getMinutes() + "";
        let hours = date.getHours() + "";
        hours = (hours.length == 1 ? 0 + hours : hours);
        seconds = (seconds.length == 1 ? 0 + seconds : seconds);
        minutes = (minutes.length == 1 ? 0 + minutes : minutes);
        return hours + ":" + minutes + ":" + seconds;
    }

    // let productsSummary = [];
    // if (validate.isNotEmpty(cancelItemselectedRows) && displayVacutainerButton) {
    //     productsSummary.push({
    //         "checkBox": <Button className="w-100 brand-secondary btn btn-secondary btn-sm mb-3" onClick={() => getVacutainerInfo(true)} disabled={ disableFindVacutainers}>
    //              {isLoading ? <CustomSpinners spinnerText={"Find Vacutainer"} className={"top-0 spinner-border-sm mt-1"} innerClass={"invisible"} /> : "Find Vacutainers"}
    //         </Button>
    //     })
    // }

    // let addVacutainer = [];
    // addVacutainer.push({
    //     "vacutainerName": <Button className="w-100 brand-secondary btn btn-secondary btn-sm mb-3" disabled={props.disableMode} onClick={() => { setShowCollectionData(true); setDisableBarcode(true); }}>
    //         Add Vacutainers
    //     </Button>
    // })


    const prepareModalData = (data) => {
        const sampleCollectData = data.sampleCollectModalMap;
        const labOrder = sampleCollectData.labOrder;
        const labOrderPatient = labOrder.labOrderPatients[0];
        sampleCollectData.neededToCollect = labOrder.netCashToBeCollected - sampleCollectData.receivedAmount == 0 ? 0 : sampleCollectData.neededToCollect;
        return <React.Fragment>
            <div className="card border-0">
                <div className="p-2 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="fs-6">Delivery &amp; Order Information</h4>
                        <p className="small mb-0">Order booked time slot : <span className="text-success">{sampleCollectData.bookedSlotDate}, {sampleCollectData.bookedSlotTime}</span></p>
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
                <div className="p-3 custom-border-bottom-dashed mb-3">
                    <p className="font-12  text-secondary mb-2">Patient Details </p>
                    <p className="font-weight-bold mb-0"> {labOrderPatient.customerPatient.patientName}</p>
                    <p className="small  mb-0">{labOrderPatient.customerPatient.age} yrs / {getGenderString(labOrderPatient.customerPatient.gender)}</p>
                </div>
                <div className="px-3">
                    <p className="text-secondary font-12 mb-2">Doctor Details</p>
                    <h6 className="mb-2 font-14">{labOrderPatient.customerPatient.doctorName}</h6>
                </div>
                <div className="border-top p-3">
                    <p className="text-secondary font-12 mb-2">Payment Details</p>
                    {validate.isNotEmpty(labOrder.deliveryTypeAmountOff) && labOrder.deliveryTypeAmountOff != 0 && (labOrder.deliveryTypeAmountOff > 0 ?
                        <div className="d-flex justify-content-between">
                            <p className="text-secondary  mb-2 font-14">ReportDelivery AmountOff </p> <h6 className="mb-2 font-14"><CurrencyFormatter data={labOrder.deliveryTypeAmountOff} decimalPlaces={2} /></h6></div>
                        : <div className="d-flex justify-content-between">
                            <p className="text-secondary  mb-2 font-14">ReportDelivery Charges </p><h6 className="mb-2 font-14"><CurrencyFormatter data={labOrder.deliveryTypeAmountOff} decimalPlaces={-1} /></h6></div>
                    )}
                    {validate.isNotEmpty(labOrder.collectionCharges) && labOrder.collectionCharges > 0 &&
                        <div className="d-flex justify-content-between">
                            <p className="text-secondary  mb-2 font-14">Collection Charges </p>  <h6 className="mb-2 font-14"><CurrencyFormatter data={labOrder.collectionCharges} decimalPlaces={2} /></h6></div>

                    }

                    {validate.isNotEmpty(labOrder.totalAmount) && labOrder.totalAmount > 0 &&
                        <div className="d-flex justify-content-between">
                            <p className="text-secondary  mb-2 font-14">Total Order Amount </p> <h6 className="mb-2 font-14"><CurrencyFormatter data={labOrder.totalAmount} decimalPlaces={2} /></h6>
                        </div>}

                    {validate.isNotEmpty(labOrder.mdxPointsWorth) &&
                        <div className="d-flex justify-content-between">
                            <p className="text-secondary  mb-2 font-14">Applied MDx Points Value </p> <h6 className="mb-2 font-14"><CurrencyFormatter data={labOrder.mdxPointsWorth} decimalPlaces={2} /></h6></div>}

                    {validate.isNotEmpty(labOrder.mdxPointsRedeemed) &&
                        <div className="d-flex justify-content-between">
                            <p className="text-secondary  mb-2 font-14">Applied MDx Points </p> <h6 className="mb-2 font-14"><CurrencyFormatter data={labOrder.mdxPointsRedeemed} decimalPlaces={-1} /></h6></div>}

                    {validate.isNotEmpty(labOrder.netCashToBeCollected) &&
                        <div className="d-flex justify-content-between">
                            <p className="text-secondary  mb-2 font-14">Net Payable </p> <h6 className="mb-2 font-14"><CurrencyFormatter data={labOrder.netCashToBeCollected} decimalPlaces={2} /></h6>
                        </div>}

                    {validate.isNotEmpty(sampleCollectData.amountPaid) && sampleCollectData.amountPaid > 0 &&
                        <div className="d-flex justify-content-between">
                            <p className="text-secondary  mb-2 font-14">ReceivedAmount</p> <h6 className="mb-2 font-14"><CurrencyFormatter data={sampleCollectData.amountPaid} decimalPlaces={2} /></h6>
                        </div>}
                    {validate.isNotEmpty(labOrder.roundedValue) &&
                        <div className="d-flex justify-content-between">
                            <p className="text-secondary  mb-2 font-14">Rounded Value </p> <h6 className="mb-2 font-14"><CurrencyFormatter data={paymentOption == "CASH" ? labOrder.roundedValue : 0} decimalPlaces={-1} /></h6>
                        </div>}

                    <div className="d-flex justify-content-between">
                        <p className="text-secondary  mb-2 font-14">Need To Collect Amount </p> <h6 className="mb-2 font-14"><CurrencyFormatter data={paymentOption == 'CASH' ? sampleCollectData.neededToCollect : labOrder.totalAmount} decimalPlaces={2} /></h6>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }

    const handleCheckboxSelect = (columnTestId) => {
        if (validate.isNotEmpty(cancelItemselectedRows) && cancelItemselectedRows.indexOf(columnTestId) != -1) {
            setTriggerSelectedAll(true);
            setSelectCancelAllItemsOption(false);
            let newArrays = cancelItemselectedRows.filter((id) => id !== columnTestId)
            setCancelItemselectedRows(newArrays);
        } else if (validate.isNotEmpty(cancelItemselectedRows)) {
            setCancelItemselectedRows([...cancelItemselectedRows, columnTestId]);
        } else {
            setCancelItemselectedRows([columnTestId]);
        }
        setShowCollectionData(false);
        setDisableBarcode(false);
        setVacutainersInfo(undefined);
    }

    const callBackMapping = {
        'name': (props) => {
            const { row } = props;
            return <React.Fragment>
                {row.testName} & {row.sampaleTypeName} {' '}
                {isSampleReCollectedTestCode[row.testCode] ? <span className='badge bg-success text-white'>RC</span> : <></>}
            </React.Fragment>
        },
        'status': (props) => {
            const { row } = props;
            return <React.Fragment>
                {Object.keys(modalData.sampleCollectModalMap.testOrderStatuses).map(key => {
                    if (key === row.status)
                        return modalData.sampleCollectModalMap.testOrderStatuses[key]
                })}
            </React.Fragment>
        },
        'checkboxStatusHeader': (props) => {
            return <React.Fragment>
                {!selectAllDisabled ? <input type={'checkbox'} checked={cancelItemselectedRows.length === modalData.sampleData.length} onClick={() => { setSelectCancelAllItemsOption(!selectCancelAllItemsOption); setDisplayVacutainerButton(true); setDisableFindVacutainers(false); setVacutainersInfo(undefined) }} />
                    : <input type={'checkbox'} style={{ "background": "gray" }} disabled />}
            </React.Fragment>
        },
        'checkBox': (props) => {
            const { row } = props;
            return <React.Fragment>
                {modalData.statusList.includes(row.status) ? <input type={'checkbox'} style={{ "background": "gray" }} disabled />
                    : <input type={'checkbox'} checked={cancelItemselectedRows && cancelItemselectedRows.length > 0 && cancelItemselectedRows.indexOf(row.testCode) > -1} onChange={() => { handleCheckboxSelect(row.testCode); setDisplayVacutainerButton(true); setDisableFindVacutainers(false) }} />
                }
            </React.Fragment>
        },
        'sampleAction': (props) => {
            const { row } = props;
            return modalData.statusList.includes(row.status) ? '---' : <a href="javascript:void(0);" onClick={() => { if (!props.disableMode) { setCancelItemselectedRows([row.testCode]); getVacutainerInfo(false, row.testCode) } }}> <SearchIcon tooltip="Find Vacutainer" /></a>

        },
        'reportDeliveryTime': (props) => {
            return (validate.isNotEmpty(props.row.reportDeliveryTime) && props.row.reportDeliveryTime > 0) ? props.row.reportDeliveryTime : "--"
        }
    }


    const getVacutainerInfo = async (getInfoForSelectedItems, inidividualTestCode) => {
        setIsLoading(true);
        props.setDisableMode(true);
        const obj = {
            processingLab: props.value.storeId,
            orderId: props.value.orderId,
            selectedSamples: getInfoForSelectedItems ? cancelItemselectedRows.toString() : inidividualTestCode.toString()
        }
        props.setDisableMode(true);
        await labOrderService.getVacutainerInfo(obj).then((data) => {
            if (data && data.statusCode == 'SUCCESS' && data.dataObject) {
                setDisableFindVacutainers(getInfoForSelectedItems);
                setVacutainersInfo(data.dataObject);
            }
            else {
                setStackedToastContent({ toastMessage: data.message });
            }
            props.setDisableMode(false);

        }).catch(error => {
            console.log(error);
            setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" });
            props.setDisableMode(false);
        });
        setIsLoading(false);
    }

    const handleReturn = (paymentDetails) => {
        setTotalReceivingAmount(paymentDetails.amount);
        const sampleCollectData = modalData.sampleCollectModalMap;
        const labOrder = sampleCollectData.labOrder;
        submitSampleCollection(sampleCollectData, labOrder, paymentDetails);
    }

    const handleEditBarcodes = async () => {
        setDisableBarcode(true);
        const labOrder = modalData.sampleCollectModalMap.labOrder;
        let changedBarcodeInfo = [];
        let barcodes = {};
        for (let sample of modalData.collectedVacutainer.sampleParameterDetails) {
            if (validate.isNotEmpty(sample.previousBarcode)) {
                if (!validateEditedVacutainers(sample, sample.previousBarcode, barcodes)) {
                    return;
                }
                const temp = { barcode: sample.previousBarcode, previousBarcode: sample.barcode }
                changedBarcodeInfo.push(temp);
                barcodes[temp.barcode] = {
                    'vacutainerName': sample.vacutainerName,
                    'vacutainerColors': sample.vacutainerColors,
                    'sampleTypeName': sample.sampleTypeName
                };
            }
        }
        let labSampleCollectionInfo = {
            labOrder: { orderId: labOrder.orderId },
            collectionCenterId: labOrder.collectionCenterStoreId,
            vacutainerSampleInfo: { sampleParameterDetails: changedBarcodeInfo },
        }
        if (changedBarcodeInfo && changedBarcodeInfo.length > 0) {
            props.setDisableMode(true);
            await labOrderService.editSampleCollectedBarcode(labSampleCollectionInfo).then(data => {
                if (data && data.statusCode == 'SUCCESS') {
                    props.onSubmitClick(labSampleCollectionInfo.labOrder.orderId)
                    setStackedToastContent({ toastMessage: "Successfully Updated Barcodes" });
                    props.setShowSampleCollectModal(false);
                }
                if (data && data.statusCode == 'FAILURE') {
                    setStackedToastContent({ toastMessage: data.message });
                }
                props.setDisableMode(false);
            }).catch(err => {
                setStackedToastContent({ toastMessage: "unable to process" });
                props.setDisableMode(false);
            });
        } else {
            setStackedToastContent({ toastMessage: "No barcode is modified" });
            setDisableBarcode(false);
        }
    }

    const validateEditedVacutainers = (sample, barcode, barcodeInfo) => {
        if (validate.isEmpty(barcode)) {
            setStackedToastContent({ toastMessage: "Invalid Barcode For: " + sample.sampleTypeName });
            return false
        } else if (barcode.trim().length < 8) {
            setStackedToastContent({ toastMessage: "Verify the barcode number. It should not be less than 8 characters." });
            return false;
        } else if (!validate.isNumeric(barcode)) {
            setStackedToastContent({ toastMessage: "Barcode Should Contain Only Numbers For: " + sample.sampleTypeName });
            return false
        } else if (barcode == 0) {
            setStackedToastContent({ toastMessage: "Invalid Barcode For: " + sample.sampleTypeName });
            return false
        } else if (barcodeInfo[barcode] && (barcodeInfo[barcode].vacutainerName != sample.vacutainerName
            || barcodeInfo[barcode].vacutainerColors != sample.vacutainerColors
            || barcodeInfo[barcode].sampleTypeName != sample.sampleTypeName)) {
            setStackedToastContent({ toastMessage: "Duplicate Barcode " + barcode + " Entered For " + barcodeInfo[barcode].sampleTypeName + " And " + sample.sampleTypeName });
            return false
        } else if (sample.barcode == barcode) {
            setStackedToastContent({ toastMessage: "No Barcode is Changed" });
            return false
        }
        return true;
    }

    const submitSampleCollection = async (sampleCollectData, labOrder, paymentDetails) => {
        let selectedAgent = '';
        if (validate.isNotEmpty(agentId) || labOrder.visitType == 'LAB') {
            if (validate.isNotEmpty(labOrder.visitType) && labOrder.visitType == 'HOME') {
                selectedAgent = agentId;
            }
            if (validate.isNotEmpty(labOrder.visitType) && validate.isNotEmpty(sampleCollectData.loginUserType) && labOrder.visitType == 'LAB') {
                if (sampleCollectData.loginUserType == 'CRM_USER') {
                    if (!collectionCenterAgentId) {
                        setStackedToastContent({ toastMessage: "Select Collection Center Agent" });
                        return;
                    }
                    selectedAgent = collectionCenterAgentId;
                }
            }
            if (validatePaymentForm(labOrder)) {
                var templabOrder = {};
                var patients = [];
                let eachPatient = {};
                let testList = [];
                eachPatient.patientId = labOrder.labOrderPatients[0].patientId;
                templabOrder.orderId = labOrder.orderId;
                templabOrder.visitType = labOrder.visitType;
                templabOrder.collectionCenterStoreId = labOrder.collectionCenterStoreId;
                for (let sampleCode of cancelItemselectedRows) {
                    modalData.sampleData.map(sample => {
                        if (sampleCode == sample.testCode && sample.status != "S") {
                            let test = {}
                            test = sample;
                            test.action = 'S';
                            testList.push(test);
                        }
                    });
                    eachPatient.labOrderItems = testList;
                }
                patients.push(eachPatient);
                templabOrder.labOrderPatients = patients;
                let selectedDate = formatDate() + ' ' + getTimeStringForToday();
                if ((totalReceivingAmount > 0 || labOrder.roundedValue + sampleCollectData.neededToCollect != 0) && labOrder.paymentType == 'COSC') {
                    var paymentList = [];
                    if (validate.isNotEmpty(paymentDetails)) {
                        if (paymentDetails.mode == "CASH") {
                            var paymentMap = {};
                            if (paymentDetails.amount > 0) {
                                paymentMap.mode = "cash";
                                paymentMap.orderId = labOrder.orderId;
                                paymentMap.dateString = selectedDate;
                                paymentMap.cardNumber = "";
                                paymentMap.txnNumber = "";
                                paymentMap.deviceId = "";
                                paymentMap.amount = paymentDetails.amount;
                                paymentList.push(paymentMap);
                            }
                            if (Math.abs(labOrder.roundedValue) > 0) {
                                var roundedPaymentMap = {};
                                roundedPaymentMap.mode = "Rounding";
                                roundedPaymentMap.orderId = labOrder.orderId;
                                roundedPaymentMap.dateString = selectedDate;
                                roundedPaymentMap.cardNumber = "";
                                roundedPaymentMap.txnNumber = "";
                                roundedPaymentMap.deviceId = "";
                                roundedPaymentMap.amount = -labOrder.roundedValue;
                                paymentList.push(roundedPaymentMap);
                            }
                        } else if (paymentDetails.mode == "CC") {
                            var paymentMap = {};
                            paymentMap.mode = "CC";
                            paymentMap.orderId = labOrder.orderId;
                            paymentMap.dateString = selectedDate;
                            paymentMap.cardNumber = paymentDetails.cardNo;
                            paymentMap.txnNumber = paymentDetails.transactionId;
                            paymentMap.deviceId = paymentDetails.deviceId;
                            paymentMap.amount = paymentDetails.amount;
                            paymentList.push(paymentMap);
                        } else if (paymentDetails.mode == "BOTH") {
                            var cashPaymentMap = {};
                            var creditPaymentMap = {};

                            cashPaymentMap.mode = "cash";
                            cashPaymentMap.orderId = labOrder.orderId;
                            cashPaymentMap.dateString = selectedDate;
                            cashPaymentMap.cardNumber = "";
                            cashPaymentMap.txnNumber = "";
                            cashPaymentMap.deviceId = "";
                            cashPaymentMap.amount = paymentDetails.amount;
                            paymentList.push(cashPaymentMap);

                            creditPaymentMap.mode = "CC";
                            creditPaymentMap.orderId = labOrder.orderId;
                            creditPaymentMap.dateString = selectedDate;
                            creditPaymentMap.cardNumber = paymentDetails.cardNo;
                            creditPaymentMap.txnNumber = paymentDetails.transactionId;
                            creditPaymentMap.deviceId = paymentDetails.deviceId;
                            creditPaymentMap.amount = paymentDetails.amount;
                            paymentList.push(creditPaymentMap);
                        }
                    }
                    templabOrder.labOrderPaymentDetail = paymentList;
                } else {
                    console.log("needto collect amount 0");
                }
                if (validateVacutainers(vacutainersInfo.vacutainerDataSet.sampleParameterDetails)) {
                    const labSampleCollectionInfo = {
                        'labOrder': templabOrder,
                        'vacutainerSampleInfo': { sampleParameterDetails: vacutainersInfo.vacutainerDataSet.sampleParameterDetails },
                        'sampleCollectedDate': new Date(formatDate() + "T" + getTimeStringForToday() + ".000Z")
                    }
                    const obj = {
                        loginUserTypeFlag: sampleCollectData.loginUserType,
                        selectedCenterAgent: selectedAgent
                    }
                    if (obj.selectedCenterAgent === "Select Agent") {
                        setStackedToastContent({ toastMessage: "Select Agent" });
                        return;
                    }
                    props.setDisableMode(true);
                    await labOrderService.collectSampleFromCrm(obj, labSampleCollectionInfo).then(data => {
                        if (data && data.statusCode == 'SUCCESS') {
                            props.onSubmitClick(templabOrder.orderId);
                            setStackedToastContent({ toastMessage: "Sample Collected Successfully" })
                            props.setShowSampleCollectModal(!props.showSampleCollectModal);
                        } else {
                            setStackedToastContent({ toastMessage: data.message });
                        }
                        props.setDisableMode(false);
                    }).catch((err) => {
                        setStackedToastContent({ toastMessage: "Something went wrong" })
                        props.setDisableMode(false);
                    });

                }

            } /* if (labOrder.paymentType && labOrder.paymentType == 'COSC') {
                if ((data.neededToCollect <= 0 || data.neededToCollect + data.orderRoundedVal == 0) && validate.isEmpty(paymentDetails)) {
                        return false
                }
                return true;
            } */
        } else {
            if (validate.isNotEmpty(labOrder.visitType) && labOrder.visitType == 'LAB' && sampleCollectData.loginType == "CRM_USER") {
                setStackedToastContent({ toastMessage: "Select Collection Center" });
            } else {
                setStackedToastContent({ toastMessage: "Select Agent" });
            }
        }
    }

    const validateVacutainers = (vacutainers) => {
        if (vacutainers && vacutainers != null) {
            for (var i = 0; i < vacutainers.length; i++) {
                if (validate.isEmpty(vacutainers[i].barcode)) {
                    setStackedToastContent({ toastMessage: "Barcode is required for:" + vacutainers[i].sampleTypeName });
                    return false;
                }
                else if (validate.isNotEmpty(vacutainers[i].barcode) && vacutainers[i].barcode.trim().length < 8) {
                    setStackedToastContent({ toastMessage: "Verify the barcode number. It should not be less than 8 characters and contains only numbers." });
                    return false;
                }
                else if (!validate.isNumeric(vacutainers[i].barcode)) {
                    setStackedToastContent({ toastMessage: "Barcode Should Contain Only Numbers For: " + vacutainers[i].sampleTypeName });
                    return false
                }
            }
        }
        return true;
    }

    const validatePaymentForm = (labOrder) => {

        if (labOrder.status == 'K') {
            if (validate.isNotEmpty(formatDate(new Date()))) {
                return true;
            } else {
                setStackedToastContent({ toastMessage: "Select Sample Collection Date" });
                return false;
            }
        }
        return true;
    }



    const collectedSamplesCallBack = {
        "vacutainerName": (props) => {
            const { row } = props;
            let showRC = false;
            return <React.Fragment>
                {row.vacutainerName}{' '}
                {Object.keys(isSampleReCollectedTestCode).forEach(function (sampleCollected) {
                    if (isSampleReCollectedTestCode[sampleCollected] && Object.keys(row.testParameters).includes(sampleCollected)) {
                        showRC = true;
                    }
                })}
                {showRC ? <> <span className='badge bg-success text-white'>RC</span></> : <></>}
            </React.Fragment>
        },
        "capColors": (props) => {
            const { row } = props;
            let vacutainerColors = row?.vacutainerColors?.split("_")
            return vacutainerColors?.map((color) => {
                let colorCode
                if (validate.isNotEmpty(modalData?.sampleCollectModalMap?.colorCodes)) {
                    Object.keys(modalData.sampleCollectModalMap.colorCodes).forEach(function (key) {
                        if (key == color) {
                            colorCode = modalData.sampleCollectModalMap.colorCodes[key];
                        }
                    });
                } else {
                    colorCode = color
                }
                return <React.Fragment><span className="me-2" style={{ "display": "inline-block", "width": "12px", "height": "12px", "borderRadius": "50%", "background": colorCode }}></span> <span className="me-3">{color}</span> </React.Fragment>
            });
        },
        "enterBarcodeId": (props) => {
            const { row, onRowChange, isCellSelected } = props;
            const handleBarcode = (e) => {
                onRowChange({ ...row, "barcode": e.target.value }, true);

            }

            const clearBarCode = (e) => {
                onRowChange({ ...row, "barcode": null }, true);
            }
            return <div style={{ display: 'flex' }}>
                <Input type='text' tabIndex={isCellSelected ? 0 : -1} placeholder='Scan/Enter Barcode Id' maxLength={9} disabled={disableBarcode} onChange={e => { handleBarcode(e) }} value={row.barcode ? row.barcode : ''} />
                <a href='javascript:void(0);' className='me-2' onClick={() => { clearBarCode(); setDisableBarcode(false); setShowCollectionData(false); }} >
                    <img src={CloseIcon} alt="Close Icon" title="close" />
                </a>
            </div>
        },
        "editBarcodeId": (props) => {
            const { row, onRowChange, isCellSelected } = props;
            const handleBarcode = (e) => {
                onRowChange({ ...row, "previousBarcode": e.target.value }, true);

            }

            const clearBarCode = (e) => {
                onRowChange({ ...row, "previousBarcode": null }, true);
            }

            return validate.isNotEmpty(row.status) && row.status === "ORDER_STATUS_SAMPLE_COLLECTED" ? <div style={{ display: 'flex' }}>
                <Input type='text' tabIndex={isCellSelected ? 0 : -1} placeholder='Scan/Enter Changed Barcode Id' maxLength={9} disabled={disableBarcode} onChange={handleBarcode} value={row.previousBarcode ? row.previousBarcode : ''} />
                <a href='javascript:void(0);' onClick={() => { clearBarCode(); setDisableBarcode(false); }} className="me-2">
                    <img src={CloseIcon} alt="Close Icon" title="close" />
                </a>
            </div> : <div className='px-2'>---</div>

        }
    }
    const handleAgent = (payload) => {
        const sampleCollectData = modalData.sampleCollectModalMap;
        const labOrder = sampleCollectData.labOrder;
        if (labOrder.visitType == 'LAB')
            setCollectionCenterAgentId(payload[0].target.value)
        if (labOrder.visitType == 'HOME')
            setAgentId(payload[0].target.value);
    }


    const initialFormLoad = () => {
        const sampleCollectData = modalData.sampleCollectModalMap;
        const labOrder = sampleCollectData.labOrder;
        if (!validateVacutainers(vacutainersInfo.vacutainerDataSet.sampleParameterDetails)) {
            return;
        }
        let agentOptions = [];
        if (labOrder.visitType == "LAB") {
            helpers.updateValue(labOrder.collectionCenterStoreId, "collectionCenter");
            helpers.updateSingleKeyValueIntoField("readOnly", true, "collectionCenter");
            helpers.showElement("collectionCenter");
            if (validate.isNotEmpty(sampleCollectData.collectionCenterAgents)) {
                sampleCollectData.collectionCenterAgents.map(agent => {
                    agentOptions.push(helpers.createOption(agent.userId, agent.name, agent.userId))
                    if (agent.userId == userSessionInfo.userDetails.userId) {
                        setCollectionCenterAgentId(agent.userId);
                        helpers.updateValue(agent.userId, "agentDropDown");
                    }
                })
            }
            if (sampleCollectData.loginUserType !== "CRM_USER")
                helpers.updateSingleKeyValueIntoField("disabled", true, "agentDropDown");
        }
        if (labOrder.visitType == "HOME" && validate.isNotEmpty(sampleCollectData.agents)) {
            sampleCollectData.agents.map(agent => {
                if (agent.status == 'A') {
                    agentOptions.push(helpers.createOption(agent.agentId, agent.name, agent.agentId))
                    if (sampleCollectData.agentId && agent.agentId == sampleCollectData.agentId)
                        helpers.updateValue(agent.agentId, "agentDropDown");
                }
            })
        }
        helpers.updateSingleKeyValueIntoField("values", agentOptions, "agentDropDown");
        helpers.updateValue(formatDate(), "sampleCollectionDate");
        helpers.updateSingleKeyValueIntoField("disabled", true, "sampleCollectionDate");
        helpers.showElement("sampleCollectionDate");
    }

    const collectionData = (data) => {
        if (validate.isEmpty(vacutainersInfo) || !validateVacutainers(vacutainersInfo.vacutainerDataSet.sampleParameterDetails)) {
            setShowCollectionData(false);
        }
        const sampleCollectData = data.sampleCollectModalMap;
        const labOrder = sampleCollectData.labOrder;
        return <React.Fragment>
            {labOrder.status !== 'K' && labOrder.paymentType && labOrder.paymentType == "COSC" && validate.isNotEmpty(sampleCollectData.neededToCollect) && sampleCollectData.neededToCollect > 0 && <PaymentModeOptions handleReturn={handleReturn} neededToCollect={sampleCollectData.neededToCollect} roundedValue={labOrder.roundedValue} receivedAmount={sampleCollectData.receivedAmount} setPaymentOption={setPaymentOption} submitState disableMode={props.disableMode} setDisableMode={props.setDisableMode} />}
        </React.Fragment>
    }

    const observersMap = {
        'sampleCollectModalForm': [['load', initialFormLoad]],
        'agentDropDown': [['change', handleAgent]]
    }

    const onEdit = ({ updatedRows }) => {
        setModalData({
            ...modalData,
            collectedVacutainer: {
                ...modalData.collectedVacutainer,
                sampleParameterDetails: updatedRows
            }
        })
        return {}
    }

    const onEditVacunatorInformation = ({ updatedRows }) => {
        setVacutainersInfo({
            ...vacutainersInfo,
            vacutainerDataSet: {
                ...vacutainersInfo.vacutainerDataSet,
                sampleParameterDetails: updatedRows
            }
        })
        return {}
    }

    const markAsSubmitted = (data) => {
        const sampleCollectData = data.sampleCollectModalMap;
        const labOrder = sampleCollectData.labOrder;
        return <React.Fragment>
            {((labOrder.status === 'K' || (labOrder.paymentType && labOrder.paymentType == "PAY_ONLINE")) || (validate.isEmpty(sampleCollectData.neededToCollect) || sampleCollectData.neededToCollect <= 0)) && <div className='card-footer mt-3 bg-transparent text-end px-2'>
                <button type="button" class="btn btn-brand btn-sm" disabled={props.disableMode} onClick={() => submitSampleCollection(sampleCollectData, labOrder)}> Submit</button>
            </div>}
        </React.Fragment>
    }

    return <div className="custom-modal">
        <Wrapper className="m-0">
            <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                <p className="mb-0 text-truncate" style={{maxWidth: "90%"}}> <span className='hide-on-mobile'>Sample Collect For Order ID:</span> <span className="fw-bold">{props.value.displayOrderId} ({props.value.orderId})</span>
                </p>
                <div className=" d-flex align-items-center">
                    <Button variant=" " disabled={props.disableMode} onClick={toggle} className="btn-link icon-hover">
                        <span className='custom-close-btn icon-hover'/>
                    </Button>
                </div>
            </HeaderComponent>
            <BodyComponent loading={initialLoading} allRefs={{ headerRef }} className="body-height" >
                {(!initialLoading && validate.isNotEmpty(modalData)) && <div className='h-100'>
                    <React.Fragment>
                        <DetailWrapper>
                            <FormsComponent headerText={"Delivery & Order Information"} id={"FormsComp"} className={`${selectedFormsSection ? "border" : ''} overflow-y-auto h-100 shadow-none`}>
                                {prepareModalData(modalData)}
                            </FormsComponent>
                            <DataGridComponent id={"DataGridComp"} className="h-100 overflow-y-auto shadow-none">
                                <div className="card border-0 p-2 h-100 overflow-auto pb-0">
                                    <div className='card-body px-0 pt-0'>
                                        {modalData.sampleDataGrid && <React.Fragment>
                                            <p className="custom-fieldset ps-1">Sample Information</p>
                                            <div className='card'>
                                                <div className='card-body p-0'>
                                                    <DynamicGridHeight dataSet={modalData.sampleData} metaData={modalData.sampleDataGrid} id="sample-datagrid" className="scroll-grid-on-hover">
                                                        <CommonDataGrid {...modalData.sampleDataGrid} dataSet={modalData.sampleData}
                                                            callBackMap={callBackMapping} onRowSelectionCallback={setCancelItemselectedRows} selectedRows={cancelItemselectedRows} />
                                                    </DynamicGridHeight>
                                                </div>
                                                {validate.isNotEmpty(cancelItemselectedRows) && displayVacutainerButton && <div className='card-footer bg-transparent p-2 text-end'>
                                                    <button className="brand-secondary btn btn-sm" onClick={() => getVacutainerInfo(true)} disabled={props.disableMode || disableFindVacutainers}>
                                                        {isLoading ? <CustomSpinners spinnerText={"Find Vacutainer"} className={"top-0 spinner-border-sm mt-1 custom-button-spinner"} innerClass={"invisible"} /> : "Find Vacutainers"}
                                                    </button>
                                                </div>}
                                            </div>
                                            {vacutainersInfo && validate.isNotEmpty(vacutainersInfo.vacutainerGrid) &&
                                                <React.Fragment>
                                                    <p className="custom-fieldset ps-1 mt-3 mb-2">Add Vacutainers</p>
                                                    <div className='card'>
                                                        <div className='card-body p-0'>
                                                            <DynamicGridHeight dataSet={vacutainersInfo.vacutainerDataSet.sampleParameterDetails} metaData={modalData.sampleDataGrid} id="vacutainer-dataset" className="scroll-grid-on-hover">
                                                                <CommonDataGrid {...vacutainersInfo.vacutainerGrid} dataSet={vacutainersInfo.vacutainerDataSet.sampleParameterDetails} onEdit={onEditVacunatorInformation} callBackMap={collectedSamplesCallBack} />
                                                            </DynamicGridHeight>
                                                        </div>
                                                        <div className='card-footer bg-transparent p-2 text-end'>
                                                            <button className="btn btn-success btn-sm" disabled={props.disableMode} onClick={() => { setShowCollectionData(true); setDisableBarcode(true); }}>
                                                                Add Vacutainers
                                                            </button>
                                                        </div>
                                                    </div>

                                                </React.Fragment>
                                            }
                                            {modalData.collectedVacutainerGrid && validate.isNotEmpty(modalData.collectedVacutainer) && <React.Fragment>
                                                <p className="custom-fieldset ps-1 mt-3 mb-2">Vacutainers Information</p>
                                                <div className='card'>
                                                    <div className='card-body p-0'>
                                                        <DynamicGridHeight dataSet={modalData.collectedVacutainer.sampleParameterDetails} metaData={modalData.collectedVacutainerGrid} id="collected-vacutainer-dataset" className="scroll-grid-on-hover">
                                                            <CommonDataGrid {...modalData.collectedVacutainerGrid} dataSet={modalData.collectedVacutainer.sampleParameterDetails}
                                                                callBackMap={collectedSamplesCallBack} onEdit={onEdit} />
                                                        </DynamicGridHeight>
                                                    </div>
                                                    {validate.isNotEmpty(modalData.collectedVacutainer) && <div className='card-footer bg-transparent p-0 text-end'>
                                                        <button className={validate.isEmpty(modalData.collectedVacutainer) ? 'd-none' : 'btn m-2 btn-sm btn-brand'} variant=" " disabled={props.disableMode} onClick={handleEditBarcodes}>Submit</button>
                                                    </div>}
                                                </div>
                                            </React.Fragment>
                                            }
                                            {showCollectionData && <DynamicForm requestUrl={'/customer-relations/getSampleCollectForm'} helpers={helpers} requestMethod={'GET'} observers={observersMap} />}

                                        </React.Fragment>
                                        }
                                    </div>
                                    {(showCollectionData && modalData) && collectionData(modalData)}
                                    {(showCollectionData && modalData) &&
                                        markAsSubmitted(modalData)
                                    }
                                </div>
                            </DataGridComponent>
                        </DetailWrapper>
                    </React.Fragment>
                </div>
                }

            </BodyComponent>
        </Wrapper>
    </div>
}

export default withFormHoc(LabOrderSampleCollect);