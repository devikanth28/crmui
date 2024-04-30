import CommonDataGrid,{CancelIcon,CustomPopOver,SampleCollectedIcon} from '@medplus/react-common-components/DataGrid';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getLabStausBadgeColourClass } from '../../helpers/LabOrderHelper';
import OrderHelper from '../../helpers/OrderHelper';
import Validate from '../../helpers/Validate';
import LabOrderService from '../../services/LabOrder/LabOrderService';
import CommonConfirmationModal from '../Common/ConfirmationModel';
import DynamicGridHeight from '../Common/DynamicGridHeight';
import { AlertContext } from '../Contexts/UserContext';
import CancelOrder from '../order/CancelOrder';
import OrderActionForms from '../order/OrderActionForms';
import CancelProfileItemsModal from './labOrderModal/CancelProfileItemsModal';
import RefundOrderTabs from './labOrderModal/RefundOrderTabs';
import CheckItemStatusModal from '../Common/CheckItemStatusModal';
import LabOrderFreeTestCoupon from './LabOrderFreeTestCoupon';
import { flattenColumnsList } from '../../helpers/CommonHelper';
import CurrencyFormatter from '../Common/CurrencyFormatter';

const LabOrderTabs = (props) => {

    const validate = Validate();
    const labOrderService = LabOrderService();

    const initialDataGrid = props.dataGrid;
    const initialDataSet = props.dataSet;

    const freeTestGridRef = useRef(null);
    const gridRef =useRef(null)
    const tabRef=useRef(null);

    const [cancelProfileItemsFlag, setCancelProfileItemsFlag] = useState(false);
    const [statusOrReasonModal, setStatusOrReasonModal] = useState(false);
    const [statusOrReasonModalObj, setStatusOrReasonModalObj] = useState(false);
    const [checkStatusMap, setCheckStatusMap] = useState([])
    const [cancelProfileItemsObj, setCancelProfileItemsObj] = useState({});
    const [showActionForm, setShowActionForm] = useState(undefined);
    const [cancelOrderIds, setCancelOrderIds] = useState(undefined);
    const [selectCancelAllItemsOption, setSelectCancelAllItemsOption] = useState(false);
    const [columnTestIds, setColumnTestIds] = useState([]);
    const [selectAllDisabled, setSelectAllDisabled] = useState(false);
    const [showConfirmationModal,setConfirmationModal] = useState(false);
    const [recollectItemParams,setRecollectItemParams] = useState(null);
    const [confirmationModalProps,setConfirmationModalProps] = useState({message:"",onSubmit:null,headerText:""});
    const { setAlertContent, setStackedToastContent } = useContext(AlertContext);
    const [showCancelItems, setShowCancelItems] = useState(false);
    const [isShowCancelDisabled, setShowCancelDisabled] = useState(undefined);
    const [freeTestSet, setFreeTestSet] = useState([]);
    const [freeTestSummaryRows, setFreeTestSummaryRows] = useState([]);
    const [cancelProfileItemsData, setCancelProfileItemsData] = useState(undefined);
    const [cancelProfileItemselectedRows, setCancelProfileItemselectedRows] = useState([]);
    const [selectCancelAllProfileItemsOption, setSelectCancelAllProfileItemsOption] = useState(false);
    const [selectAllTestDisable,setSelectAllTestDisable] = useState(false);
    const [closePopOver, setClosePopOver] = useState(false);
    const departmentValues =["Clinical Pathology","Profile Parameters","Serology","Microbiology"]
    const formValues=["blood","urine"]
    const[scrolled,setScrolled]=useState(false);
    
    const handleClosePopOver = () => {
        setClosePopOver(true); 
    }   

  useEffect(()=>{
    if(validate.isNotEmpty(gridRef ) && validate.isNotEmpty(gridRef .current)){
        gridRef .current?.element.addEventListener('scroll', handleClosePopOver);
    }
    
    return () => {
        if (validate.isNotEmpty(gridRef ?.current?.element)){
            gridRef ?.current?.element.removeEventListener('scroll', handleClosePopOver);
        }
    }
});

const handlePositionChange = () => {
    setScrolled(!scrolled)
    if(validate.isNotEmpty(tabRef ) && validate.isNotEmpty(tabRef.current)){
        const { top } = tabRef?.current?.getBoundingClientRect();
        if (top !== tabRef.current.lastTop) {
          setClosePopOver(true); 
        } else {
          setClosePopOver(false);
        }
        tabRef.current.lastTop = top;

    }
};
useEffect(() => {
    handlePositionChange();
    window.addEventListener('scroll', handlePositionChange);
    return () => {
      window.removeEventListener('scroll', handlePositionChange);
    };
  },[scrolled]);


    useEffect(() => {
        if (Validate().isNotEmpty(initialDataSet.patientDetails.patientDetailsSet)) {
            Object.values(initialDataSet.patientDetails.patientDetailsSet).map((value) => {
                if (Validate().isNotEmpty(value.columnTestId) && !columnTestIds.includes(value.columnTestId)) {
                    columnTestIds.push(value.columnTestId);
                }
                if (value.isCheckBoxDisabled) {
                    setSelectAllDisabled(true);
                }
            })
        }

        if (Validate().isNotEmpty(initialDataSet.freeTestOrdersSet)) {
            const freeTestSet = [];
            initialDataSet.freeTestOrdersSet.map((item, index) => {
                if (Validate().isNotEmpty(item['couponCode']) && validate.isNotEmpty(item.freeTests)) {
                    freeTestSet.push(item);
                }
            })
            setFreeTestSet(freeTestSet.filter(eachTest => validate.isNotEmpty(eachTest) && validate.isNotEmpty(eachTest.freeTests)));
        } else {
            setFreeTestSet([]);
        }

    }, [initialDataSet])

    useEffect(() => {
        let cancelItems = [];
        if (selectCancelAllItemsOption) {
            columnTestIds.forEach((value) => {
                if (Validate().isNotEmpty(value) && !cancelItems.includes(value)) {
                    cancelItems.push(value);
                }
            })
        }
        props.setCancelItemselectedRows(cancelItems);
    }, [selectCancelAllItemsOption])

    useEffect(() => {
        if(validate.isNotEmpty(cancelProfileItemsObj)){
            getTestProfileTest(cancelProfileItemsObj);
        }
    },[cancelProfileItemsObj]);



    const orderStatusCallBack = {
        "orderStatus": (props) => {
            const { row } = props;
            return <React.Fragment>
                {validate.isNotEmpty(row?.statusInfo?.status) ?
                    <React.Fragment>
                        <span className={`${getLabStausBadgeColourClass(row?.statusInfo?.status)} badge rounded-pill me-2`}>{row?.statusInfo?.status}</span>
                        <span>{row?.statusInfo?.agentInfo}</span>
                        <span> {row?.statusInfo?.remarks}</span>
                    </React.Fragment>
                    : "--"
                }
            </React.Fragment>
        }
    }

    let productsSummary = [];
    let patientData = props.dataSet.patientDetails;
    if (validate.isNotEmpty(patientData.totalDiscount) && patientData.totalDiscount > 0) {
        productsSummary.push({
            "mrp": "Total Discount",
            "actionInfo": Math.floor(patientData.totalDiscount*100)/100
        })
    }
    if (validate.isNotEmpty(patientData.pointsEarned) && patientData.pointsEarned > 0) {
        productsSummary.push({
            "mrp": "Points Earned",
            "actionInfo": patientData.pointsEarned
        })
    }

    if (validate.isNotEmpty(patientData.reportDeliveryAmountOff) && patientData.reportDeliveryAmountOff != 0 && patientData.reportDeliveryAmountOff > 0) {
        productsSummary.push({
            "mrp": "Report Delivery AmountOff",
            "actionInfo": patientData.reportDeliveryAmountOff.toFixed(2)
        })
    }
    else {
        if (validate.isNotEmpty(patientData.reportPrintCharges)) {
            productsSummary.push({
                "mrp": "Report Delivery Charges",
                "actionInfo": Math.abs(patientData.reportPrintCharges.toFixed(2))
            })
        }
        if ((validate.isNotEmpty(patientData.reportDeliveryCharges) && patientData.reportDeliveryCharges > 0) || validate.isNotEmpty(patientData.reportDeliveryChargesDiscountCouponCode)) {
            productsSummary.push({
                "mrp": "Report Delivery Charges",
                "totalPrice": (patientData.totalReportDeliveryCharges && Math.abs(patientData.totalReportDeliveryCharges) != Math.abs(patientData.reportDeliveryCharges)) ? patientData.totalReportDeliveryCharges.toFixed(2) : null,
                "actionInfo": patientData.reportDeliveryCharges == 0 ? "FREE" : Math.abs(patientData.reportDeliveryCharges.toFixed(2))
            })
        }
    }

    if ((validate.isNotEmpty(patientData.collectionCharges) && patientData.collectionCharges > 0) || validate.isNotEmpty(patientData.collectionChargesDiscountCouponCode)) {
        productsSummary.push({
            "mrp": "Collection Charges",
            "totalPrice": (patientData.totalCollectionCharges && patientData.totalCollectionCharges != patientData.collectionCharges) ? patientData.totalCollectionCharges.toFixed(2) : null,
            "actionInfo": patientData.collectionCharges == 0 ? "FREE" : patientData.collectionCharges.toFixed(2)
        })
    }

    if (validate.isNotEmpty(patientData.appliedMdxPoints) && patientData.appliedMdxPoints > 0) {
        productsSummary.push({
            "mrp": "Applied MDx Points Value",
            "actionInfo": patientData.appliedMdxPointsValue.toFixed(2)
        },
            {
                "mrp": "Applied MDx Points",
                "actionInfo": patientData.appliedMdxPoints
            })
    }

    if (validate.isNotEmpty(patientData.netPayble)) {
        productsSummary.push({
            "mrp": "Net Payable",
            "actionInfo": patientData.netPayble.toFixed(2)
        })
    }
    if (validate.isNotEmpty(patientData.totalAmount)) {
        productsSummary.push({
            "mrp": "Total Amount",
            "actionInfo": patientData.totalAmount.toFixed(2)
        })
    }
    if (validate.isNotEmpty(props.cancelItemselectedRows)) {
        productsSummary.push({
            "isCheckBoxDisabled": initialDataSet.patientDetails.cancelItemsButton ? true : false
        })
    } 

    const paymentDetailsCallBack = {
        "amountFlag": (props) => {
            const { row } = props;
            return <React.Fragment>
                <div className='text-end'><CurrencyFormatter data={row?.amount} decimalPlaces={2} /></div>
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

    const getTestProfileItems = (props) => {
        console.log("Propsgetprofiletest", props)
        setCancelProfileItemsObj(props);
        //setCancelProfileItemsFlag(true);
    }

    console.log("cancelProfileItemsObj",cancelProfileItemsObj)

    const recollectItemSample = (props) => {
        setRecollectItemParams({
            labOrderId: props.orderId,
            labId: props.storeId,
            orderItemIds: props.orderItemId
        });
        setConfirmationModal(true);
        setConfirmationModalProps({message:`Are You Sure You Want to ReCollect the Item?`,onSubmit:recollectItem,headerText:"Recollect Item"})
    }

    const recollectItem = (recollectItemParams) => {
        props.setDisableMode(true);
        labOrderService.reCollectLabOrderItems(recollectItemParams).then((data) => {
            if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                setStackedToastContent({ toastMessage: data.dataObject });
                props.setReloadPage(true);
                if(validate.isNotEmpty(props.onSubmitClick)){
                    props.onSubmitClick(recollectItemParams.labOrderId);
                }
            } else {
                setStackedToastContent({ toastMessage: data.message });
            }
            props.setDisableMode(false);
        }).catch((err) => {
            setStackedToastContent({ toastMessage: "Exception Occurred While recollecting Order" });
            props.setReloadPage(!props.reloadPage);
            console.log(err)
            props.setDisableMode(false);
        });
    }

    const handleActionInfo = (key, value) => {
        switch (key) {
            case "Recollect":
                recollectItemSample(value)
                break;
            case "CancelProfileItems":
                getTestProfileItems(value);
                break;
            default:
                break;
        }
    }

    const handleCheckboxSelect = (columnTestId) => {
        if (validate.isNotEmpty(props.cancelItemselectedRows) && props.cancelItemselectedRows.indexOf(columnTestId) != -1) {
            let newArrays = props.cancelItemselectedRows.filter((id) => id !== columnTestId)
            props.setCancelItemselectedRows(newArrays);
        } else if (validate.isNotEmpty(props.cancelItemselectedRows)) {
            props.setCancelItemselectedRows([...props.cancelItemselectedRows, columnTestId]);
        } else {
            props.setCancelItemselectedRows([columnTestId]);
        }
    }

    const handleProfileCheckboxSelect = (columnTestId) => {
        if (validate.isNotEmpty(cancelProfileItemselectedRows) && cancelProfileItemselectedRows.indexOf(columnTestId) != -1) {
            let newArrays = cancelProfileItemselectedRows.filter((id) => id !== columnTestId)
            setCancelProfileItemselectedRows(newArrays);
        } else if (validate.isNotEmpty(cancelProfileItemselectedRows)) {
            setCancelProfileItemselectedRows([...cancelProfileItemselectedRows, columnTestId]);
        } else {
            setCancelProfileItemselectedRows([columnTestId]);
        }
    }

    const handleHeaderProfileCheckboxSelect = (event) => {
        console.log(event);
        if(event.target.checked){
            // row.orderItemId;
            let columnIds = cancelProfileItemsData?.dataSet?.testProfileSet.map((row)=>row.orderItemId);
            setCancelProfileItemselectedRows(columnIds ? columnIds : []);
        } else {
            setCancelProfileItemselectedRows([]);
        }
    }

    console.log("cancelProfileItemsData", cancelProfileItemsData)

   
    const statusOrReasonConfirmationModal = (itemStatusMap) => {
        
        let checkStatusDataset = [];
            Object.keys(itemStatusMap).map((eachObj, index) => {
                checkStatusDataset.push({ testName: eachObj, status: itemStatusMap[eachObj].status, departmentName: itemStatusMap[eachObj].departmentName, formName: itemStatusMap[eachObj].formName, rowIndex:index})
                setCheckStatusMap(checkStatusDataset)
                
                
    })
};

    const getBulletedDescription = (description) => {
        return (
            <React.Fragment>
                {validate.isNotEmpty(description) &&
                    <ol className="mb-0 ps-3">
                        {description.map((eachDescription, index) => ((validate.isNotEmpty(eachDescription)) && <li key={index}>{eachDescription}</li>))}
                    </ol>
                }
            </React.Fragment>
        );
    }

    const columnsLength = useMemo(() => {
        if (initialDataGrid.patientDetailsGrid?.columns) {
            const columns = flattenColumnsList(initialDataGrid.patientDetailsGrid?.columns);
            return columns.length;
        } else {
            return 0;
        }

    }, [initialDataGrid.patientDetailsGrid])

    const popoverPosition = (idx) => {
        if (idx == columnsLength-1 || idx == columnsLength - 2) {
            return "left"
        }
        else
            return "right"
    }

    const patientDetailsCallBack = {
        "testName": (props) => {
            const { row } = props;
            return <React.Fragment>
                <div>{row.testOrProfileName} {validate.isNotEmpty(row.testNameCoupanApplied) && <strong> (Coupon applied)</strong>}</div>

            </React.Fragment>
        },
        "statusReason": (props) => {
            const { row } = props;
            console.log(row)
            return <React.Fragment>{validate.isNotEmpty(row.itemStatusMap) ?
                <a className="btn btn-sm btn-link w-100" href="javascript:void(0)" rel="noopener" aria-label={row.statusOrReason} role="link" title={`${row.statusOrReason}`} onClick={() => { if(!props.disableMode){setStatusOrReasonModal(true); setStatusOrReasonModalObj({ headerText: row.testOrProfileName, htmlMessage: statusOrReasonConfirmationModal(row.itemStatusMap) }) }}}>{row.statusOrReason}</a> : row.statusOrReason }
            </React.Fragment>
        },
        "actionInfo": (props) => {
            const { row } = props;
            return <React.Fragment>
                {row.action ? Object.keys(row.action).map(key => {
                    return <div onClick={() => !props.disableMode && handleActionInfo(key, row.action[key])} > {key === "Recollect" ? <SampleCollectedIcon  tooltip="Re Collect"/> : <CancelIcon tooltip ="Cancel profile items"/>}</div>
                }) : '-'
                }
            </React.Fragment>
        },
        "checkboxStatusHeader": (prop) => {
            return <React.Fragment>
                {!selectAllDisabled ? <input type={'checkbox'} checked={columnTestIds.length === props.cancelItemselectedRows.length} onChange={() => {setSelectCancelAllItemsOption(!selectCancelAllItemsOption); setShowActionForm(undefined)}} />
                    : <input type={'checkbox'} style={{ "background": "gray" }} disabled />}
            </React.Fragment>
        },
        "checkboxStatus": (prop) => {
            const { row } = prop
            return <React.Fragment>
                {row.isCheckBoxDisabled ? <input type={'checkbox'} style={{ "background": "gray" }} disabled /> :
                    <input type={'checkbox'} checked={props.cancelItemselectedRows && props.cancelItemselectedRows.indexOf(row.columnTestId) > -1} onChange={() => {handleCheckboxSelect(row.columnTestId); setShowActionForm(undefined)}} />}
            </React.Fragment>
        },
        "prices": (props) => {
            const { row } = props;
            return validate.isNotEmpty(row.actionInfo) && <div className='text-end'> {(row.mrp == "Applied MDx Points" || row.mrp == "Points Earned") ? row.actionInfo + " pts" : row.totalPrice ? <React.Fragment><del className='small'><CurrencyFormatter data={row.totalPrice} decimalPlaces={-1} /></del> {row.actionInfo == "FREE" ? row.actionInfo : <CurrencyFormatter data={row.actionInfo} decimalPlaces={-1} />}</React.Fragment> : <React.Fragment>{row.actionInfo == "FREE" ? row.actionInfo : <CurrencyFormatter data={row.actionInfo} decimalPlaces={-1} />}</React.Fragment>} </div>
        },
        "cancelItemsButton": (props) => {
            const {row} = props;
            setShowCancelDisabled(props.disableMode)
             {row.isCheckBoxDisabled ? setShowCancelItems(true) :setShowCancelItems(false)}
        },
        "mrp": (props) => {
            const { row } = props;
            return validate.isNotEmpty(row.mrp) && <div className='text-end'><CurrencyFormatter data={row.mrp} decimalPlaces={2} /></div> 
        },
        "price": (props) => {
            const { row } = props;
            return validate.isNotEmpty(row.price) && <div className='text-end'><CurrencyFormatter data={row.price} decimalPlaces={2} /></div> 
        },
        "Department":(props)=>{
            return <React.Fragment>
                {(validate.isNotEmpty(props.row.itemStatusMap) && getDepartmentsFromItemStatusMap(props.row.itemStatusMap).length >1) ?
                <>
                        <p id={props.column.key + props.row.columnTestId} className='text-truncate pointer'>{props.row.department}...</p>
                        <CustomPopOver target={props.column.key + props.row.columnTestId} value={getBulletedDescription(getDepartmentsFromItemStatusMap(props.row.itemStatusMap))} closePopOver={closePopOver} setClosePopOver={setClosePopOver} headerText={"Department"} placement={popoverPosition(props.column.idx)} />
                    </> : props.row.department}
            </React.Fragment>
      
          },
          "form":(props)=>{
            return <React.Fragment>
                {(validate.isNotEmpty(props.row.itemStatusMap) && getFormsFromItemStatusMap(props.row.itemStatusMap).length >1 ) ? <>
                    <p id={props.column.key + props.row.columnTestId} className='text-truncate pointer'>{props.row.form}...</p>
                    <CustomPopOver target={props.column.key + props.row.columnTestId} value={getBulletedDescription(getFormsFromItemStatusMap(props.row.itemStatusMap))} closePopOver={closePopOver} setClosePopOver={setClosePopOver} headerText={"Form"} placement={popoverPosition(props.column.idx)} />
                </> : props.row.form}
            </React.Fragment>
      
          },
    }

    const getDepartmentsFromItemStatusMap = (itemStatusMap) => {
        let departments = [];
        Object.keys(itemStatusMap).map((eachObj, index) => {
            if (validate.isEmpty(departments) || !departments.includes(itemStatusMap[eachObj].departmentName)) {
                departments.push(itemStatusMap[eachObj].departmentName);
            }
        })
        return departments;
        
    }
    const getFormsFromItemStatusMap = (itemStatusMap) => {
        let forms = [];
        Object.keys(itemStatusMap).map((eachObj, index) => {
            if (validate.isEmpty(forms) || !forms.includes(itemStatusMap[eachObj].formName)) {
                forms.push(itemStatusMap[eachObj].formName);
            }
        })
        return forms;
    }
    const viewActionModal = (name, userId, barcode, dateTime, rejectedReason) => {
        const message = `<div class="d-flex flex-wrap">
                        ${barcode ? `<div class="col-3">
                        <div class="form-floating">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="barcode" value=${barcode} />
                <label for="barcode">Bar Code ID</label>
                        </div>
                </div>`: ""} 
                ${name ? `<div class="col-3">
                <div class="form-floating">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="sampleStatus" value=${name} />
                <label for="sampleStatus">Sample Status</label>
                </div>
                </div>`: ""}
                ${userId ? `<div class="col-3">
                <div class="form-floating">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="userid" value=${userId} />
                <label for="userid">User ID</label>
                </div>
                </div>` : ""}
                ${dateTime ? `<div class="col-3">
                <div class="form-floating">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="datetime" value='${dateTime}' />
                <label for="datetime">Date Time</label>
                </div>
                </div>` : ""}
     </div> <br/> ${validate.isNotEmpty(rejectedReason) ? `Reason for Rejection - <Strong>${rejectedReason.rejectedReasonType}</Strong><br/> Rejection Remarks - <Strong>${rejectedReason.rejectedReason}</Strong>` : ''}`
        setStatusOrReasonModalObj({ headerText: `Sample Barcode`, htmlMessage: message })
        setStatusOrReasonModal(true);
    }

    const handleCancelItems = () => {
        var patientDetails = initialDataSet?.patientDetails?.patientDetailsSet;
        var orderItemIds = []
        if (validate.isNotEmpty(props.cancelItemselectedRows)) {
            orderItemIds = patientDetails.filter((obj) => ((!obj.isProfile && obj.statusOrReason !== 'Ready For Print') || (obj.isProfile && obj.profileStatus != 'D')) && props.cancelItemselectedRows.indexOf(obj.columnTestId) > -1).map(obj => obj.columnTestId);
        }
        if (props.cancelItemselectedRows.length == 0) {
            setAlertContent({ alertMessage: "Please select valid tests" });
        } else if (props.cancelItemselectedRows.length > 0 && orderItemIds.length != props.cancelItemselectedRows.length || initialDataSet.status == "Ready for Print") {
            setAlertContent({ alertMessage: "Some of the selected tests are ready for print, Please select valid tests" });
            return false;
        }
        else if (orderItemIds.length > 0) {
            setCancelOrderIds(orderItemIds);
            setShowActionForm("labCancelForm");
        }
    }

    const collectedSamplesCallBack = {
        "status": (props) => {
            const { row } = props;
            let badgeClass = "";
            switch(row?.barcodeStatus?.name){
                case "Accepted":
                    badgeClass = "badge-Decoded";
                    break;
                case "Rejected":
                    badgeClass = "badge-rejected";
                    break;
                default:
                    badgeClass = "";
            }
            return <React.Fragment>
                {row.barcodeStatus.name ? <div className={`${badgeClass} badge rounded-pill`} onClick={() => !props.disableMode && viewActionModal(row.barcodeStatus.name, validate.isNotEmpty(row.barcodeStatus.accessionBy)?row.barcodeStatus.accessionBy:row.barcodeStatus.rejectedBy, row.barcodeStatus.barcode,validate.isNotEmpty(row.barcodeStatus.displayAccessionDate)?row.barcodeStatus.displayAccessionDate:row.barcodeStatus.displayRejectedDate, row.barcodeStatus.rejectedReason)} style={{ "cursor": "pointer"}}>{row.barcodeStatus.name}</div> : "--"}
            </React.Fragment>
        },
        "capColors": (props) => {
            const { row } = props;
            let vacutainerColors = row?.vacutainerColors?.split("_")
            return vacutainerColors?.map((color) => {
                let colorCode
                if (validate.isNotEmpty(initialDataSet.colorCodes)) {
                    Object.keys(initialDataSet?.colorCodes).forEach(function (key) {
                        if (key == color) {
                            colorCode = initialDataSet.colorCodes[key];
                        }
                    });
                } else {
                    colorCode = color
                }
                return <React.Fragment><span className="mx-3" style={{ "display": "inline-block", "width": "12px", "height": "12px", "borderRadius": "50%", "background": colorCode }}></span> {color} </React.Fragment>
            });
        },
    }
    const orderInfo={
        title: "Do you want to cancel this test",
        orderId: `${initialDataSet.displayOrderId}/${initialDataSet.orderId}`,
        placeholder: "Please specify reason for cancellation",
        buttonText: "Submit"
    }

    const cancelItemsInfo ={
        title : cancelProfileItemsObj?.profileName,
        buttonText:"Yes, Cancel This Items"
    }


console.log("cancelItemsInfo",cancelItemsInfo)


    const checkboxAction = {
        "checkboxActionHeader": (props) => {
            return <React.Fragment>
                {!selectAllTestDisable ? <input type={'checkbox'} checked={cancelProfileItemsData?.dataSet?.testProfileSet?.length === cancelProfileItemselectedRows.length} onChange={(event) => {setSelectCancelAllProfileItemsOption(!selectCancelAllProfileItemsOption); setShowActionForm(undefined);handleHeaderProfileCheckboxSelect(event)}} /> :""
                    // <input type={'checkbox'} style={{ "background": "gray" }} disabled />
                    }
            </React.Fragment>
        },
        "checkboxAction": (props) => {
            const { row } = props
            return <React.Fragment>
                {row.checkbox ? <input type={'checkbox'} checked={cancelProfileItemselectedRows && cancelProfileItemselectedRows.indexOf(row.orderItemId) != -1} onChange={() => { handleProfileCheckboxSelect(row.orderItemId); setShowActionForm(undefined) }} /> :"" }
            </React.Fragment>
        },
        "Status" : (props) =>{
            const { row } = props;
            
            return <React.Fragment>
                {row.status ? <span className={`${getLabStausBadgeColourClass(row.status)} badge rounded-pill`}>{row.status}</span>:<div className='text-center'>-</div>}
            </React.Fragment>
        }
    }

    const getTestProfileTest = (orderDetails) => {
        // setInitialLoading(true);
        console.log("orderDetails",orderDetails)
        let obj = {
            orderId: orderDetails.orderId,
            profileId: orderDetails.profileId
        }
        props.setDisableMode(true);
        labOrderService.getTestProfileDetails(obj).then((data) => {
            if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                setCancelProfileItemsData(data.dataObject);
                Object.values(data.dataObject.dataSet?.testProfileSet).map((value) => {
                    if (!value.checkbox) {
                        setSelectAllTestDisable(true);
                    }
                })
                setCancelProfileItemsFlag(true);
            }
            else{
                setStackedToastContent({toastMessage:data.message})
            }
            // setInitialLoading(false);
            props.setDisableMode(false);
        }).catch((err) => {
            console.log(err)
            // setInitialLoading(false);
            props.setDisableMode(false);
            setStackedToastContent({toastMessage:data.message})
        });
    }

    const onCancelMOdelClose = () =>{
        setCancelProfileItemsObj(undefined);
        setCancelProfileItemsFlag(false);
        setSelectAllTestDisable(false);
        setCancelProfileItemselectedRows([]);
    }
    return (
        <React.Fragment>
            <div ref={tabRef} className='overflow-y-auto'>
                        <div className='p-12'>
            {validate.isNotEmpty(initialDataGrid.orderStatusDetailsGrid) && validate.isNotEmpty(initialDataSet.orderStatusDetailsSet) &&
                <React.Fragment>  
                                                
                <p className="custom-fieldset mb-1"> Order Status</p>
                    <DynamicGridHeight dataSet={initialDataSet.orderStatusDetailsSet} gridMaxRows={initialDataSet.orderStatusDetailsSet.length}  metaData={initialDataGrid.orderStatusDetailsGrid} id="order-status-details-set" className="card scroll-grid-on-hover">
                         <CommonDataGrid {...initialDataGrid.orderStatusDetailsGrid} dataSet={[...initialDataSet.orderStatusDetailsSet]} callBackMap={orderStatusCallBack} />
                    </DynamicGridHeight>
                       
                </React.Fragment>
            }
            {validate.isNotEmpty(initialDataGrid.patientDetailsGrid) && validate.isNotEmpty(initialDataSet.patientDetails.patientDetailsSet) && <React.Fragment>
              
                <p className="custom-fieldset mt-3 mb-1"> Test Details </p>
                <React.Fragment>
                    <div className="row g-3 m-0">
                        <div className="col-12 card p-0 mt-0">
                        	<DynamicGridHeight dataSet={initialDataSet.patientDetails.patientDetailsSet} gridMaxRows={initialDataSet.patientDetails.patientDetailsSet.length}  metaData={initialDataGrid.patientDetailsGrid} id="patient-details-set" className="scroll-grid-on-hover" bottomSummaryRows={productsSummary}>
                                <CommonDataGrid ref={gridRef} {...initialDataGrid.patientDetailsGrid} dataSet={[...initialDataSet.patientDetails.patientDetailsSet]}
                                    callBackMap={patientDetailsCallBack}
                                    selectedRows={props.cancelItemselectedRows}
                                    onRowSelectionCallback={props.setCancelItemselectedRows}
                                    bottomSummaryRows={productsSummary}
                                />
                                       
                         </DynamicGridHeight>
                            {/* <div>
                                {validate.isNotEmpty(showActionForm) && <OrderActionForms cancelProfileTests cancelOrderIds={cancelOrderIds} actionFormToRender={showActionForm} orderId={initialDataSet.orderId} setReloadPage={props.setReloadPage} reloadPage={props.reloadPage} onSubmitClick={props.onSubmitClick} setShowActionForm={setShowActionForm} setDisableMode={props.setDisableMode} disableMode={props.disableMode}/>}
                            </div> */}
                            {showCancelItems && 
                                     <div className='d-flex justify-content-end'>
                                            <button className="rounded-1 btn btn-sm brand-secondary bg-transparent card-footer p-1 m-1" disabled={validate.isNotEmpty(showActionForm) || isShowCancelDisabled } onClick={() => handleCancelItems()}>Cancel Items</button>
                                        </div>}
                            {validate.isNotEmpty(showActionForm) && <CancelOrder cancelProfileTests showCancelModal={showActionForm} cancelOrderIds={cancelOrderIds} orderId={initialDataSet.orderId} setReloadPage={props.setReloadPage} reloadPage={props.reloadPage} onSubmitClick={props.onSubmitClick} setShowCancelModal={setShowActionForm} setShowActionForm={setShowActionForm} setDisableMode={props.setDisableMode} disableMode={props.disableMode} orderInfo={orderInfo}/>}
                        </div>
                    </div>
                </React.Fragment>
            </React.Fragment>}
            {validate.isNotEmpty(initialDataGrid.paymentDetailsGrid) && validate.isNotEmpty(initialDataSet.paymentDetailsSet) && <React.Fragment>               
            <p class="custom-fieldset mt-3 mb-1">  Payment Details</p>
            <DynamicGridHeight dataSet={initialDataSet.paymentDetailsSet} gridMaxRows={initialDataSet.paymentDetailsSet.length} metaData={initialDataGrid.paymentDetailsGrid} id="payment-details-grid" className="card scroll-grid-on-hover">
                    <CommonDataGrid {...initialDataGrid.paymentDetailsGrid} dataSet={[...initialDataSet.paymentDetailsSet]}
                        callBackMap={paymentDetailsCallBack}
                    />
                </DynamicGridHeight>
            </React.Fragment>}
            {validate.isNotEmpty(initialDataGrid.collectedSamplesGrid) && validate.isNotEmpty(initialDataSet.collectedSamplesSet) && <React.Fragment>
              <p className="custom-fieldset mt-3 mb-1">Collected Samples</p>
              <DynamicGridHeight dataSet={initialDataSet.collectedSamplesSet} gridMaxRows={initialDataSet.collectedSamplesSet.length} metaData={initialDataGrid.collectedSamplesGrid} id="collected-sample-grid" className="card scroll-grid-on-hover">
                    <CommonDataGrid {...initialDataGrid.collectedSamplesGrid} dataSet={[...initialDataSet.collectedSamplesSet]}
                        callBackMap={collectedSamplesCallBack}
                    />
               </DynamicGridHeight>
            </React.Fragment>}
            {validate.isNotEmpty(initialDataGrid.couponDetailsGrid) && validate.isNotEmpty(initialDataSet.couponOrderSet) && <React.Fragment>
                <p className="custom-fieldset mt-3 mb-1">  Coupon - Complimentary Doctor Consultation</p>
               <DynamicGridHeight dataSet={initialDataSet.couponOrderSet} gridMaxRows={initialDataSet.couponOrderSet.length} metaData={initialDataGrid.couponDetailsGrid} id="coupon-details-grid" className="card scroll-grid-on-hover">
               <CommonDataGrid {...initialDataGrid.couponDetailsGrid} dataSet={[...initialDataSet.couponOrderSet]}
                   callBackMap={() => { }}
               />
               </DynamicGridHeight>
            </React.Fragment>}
                    {validate.isNotEmpty(initialDataGrid.freeTestOrdersGrid) && validate.isNotEmpty(freeTestSet) && <React.Fragment>
                        <p className="custom-fieldset mt-3 mb-1"> Coupon - Complimentary Tests</p>
                        {<div ref={freeTestGridRef}>{freeTestSet.map(freeTest => <LabOrderFreeTestCoupon freeTestCoupon={freeTest} dataGrid={initialDataGrid.freeTestOrdersGrid} ref={freeTestGridRef}/>)}</div>}
                    </React.Fragment>}
            {validate.isNotEmpty(initialDataSet.refundInfoSet) &&
                <RefundOrderTabs dataGrid={initialDataGrid} dataSet={initialDataSet} setDisableMode = {props.setDisableMode} disableMode = {props.disableMode}/>
            }
            {/* {cancelProfileItemsFlag && <CancelProfileItemsModal setReloadPage={props.setReloadPage} reloadPage={props.reloadPage} orderId={initialDataSet.orderId} setCancelProfileItemsFlag={setCancelProfileItemsFlag} cancelProfileItemsFlag={cancelProfileItemsFlag} data={cancelProfileItemsObj} setDisableMode = {props.setDisableMode} disableMode = {props.disableMode} onSubmitClick={props.onSubmitClick} displayOrderId={initialDataSet.displayOrderId}></CancelProfileItemsModal>} */}
            {cancelProfileItemsFlag && <CancelOrder onlyTestCancellation cancelProfileTests setShowActionForm={setShowActionForm} setShowCancelModal={onCancelMOdelClose} checkboxAction={checkboxAction} setCancelItemselectedRows={setCancelProfileItemselectedRows} dataGrid={cancelProfileItemsData?.dataGrid} testProfileSet={cancelProfileItemsData ? [...cancelProfileItemsData?.dataSet?.testProfileSet] : []} showCancelModal={cancelProfileItemsFlag} reloadPage={props.reloadPage} setReloadPage={props.setReloadPage} onSubmitClick={props.onSubmitClick} disableMode={props.disableMode} orderInfo={orderInfo} cancelItemsInfo={ cancelItemsInfo} setDisableMode = {props.setDisableMode} orderId={initialDataSet.orderId} cancelOrderIds={cancelProfileItemselectedRows}/>}
            {showConfirmationModal && <CommonConfirmationModal headerText={confirmationModalProps.headerText} isConfirmationPopOver={showConfirmationModal} setConfirmationPopOver={setConfirmationModal} message={confirmationModalProps.message} buttonText={"Submit"} onSubmit={()=>confirmationModalProps.onSubmit(recollectItemParams)} />}
			{/* {statusOrReasonModal && <CommonConfirmationModal headerText={statusOrReasonModalObj.headerText} message={statusOrReasonModalObj.htmlMessage} setConfirmationPopOver={setStatusOrReasonModal} isConfirmationPopOver={statusOrReasonModal} small rawHtml onSubmit={()=>{}}/>} */}
            {statusOrReasonModal && <CheckItemStatusModal headerText={statusOrReasonModalObj.headerText} setConfirmationPopOver={setStatusOrReasonModal} isConfirmationPopOver={statusOrReasonModal} checkStatusDataset={checkStatusMap} message={statusOrReasonModalObj.htmlMessage}/>}
                        </div>
                    </div> 
        </React.Fragment >
    );
}

export default LabOrderTabs;
