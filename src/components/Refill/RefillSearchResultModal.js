import React, { useContext, useEffect, useRef, useState } from "react";
import CommonDataGrid ,{DeleteIcon} from "@medplus/react-common-components/DataGrid";
import RefillService from "../../services/Refill/RefillService";
import Validate from "../../../src/helpers/Validate";
import { Button } from "react-bootstrap";
import CloseIcon from '../../images/cross.svg';
import { AlertContext } from '../Contexts/UserContext';
import { ALERT_TYPE} from '@medplus/react-common-components/DynamicForm';
import CommonConfirmationModal from "../Common/ConfirmationModel";
import DetailModal from "../Common/DetailModal";
import NoDataFound from "../Common/NoDataFound";
import Form from 'react-bootstrap/Form';
import CustomerDetails from "../customer/CustomerDetails";
import DisabledCell from "../Common/DisabledCell";
import CurrencyFormatter from "../Common/CurrencyFormatter";

const RefillSearchResultModal = (props) => {
 
    const [gridData, setGridData] = useState(undefined);

    const [refillStatus , setRefillStatus] = useState("A");
    const [loading, isLoading] = useState(true);
    const [dataSet, setDataSet] = useState([]);
    const [checked,setChecked] = useState(undefined);
    const [defaultchecked,setdefaultChecked] = useState(undefined);
    const { setAlertContent } = useContext(AlertContext);
    const [oldRefillInterval, setOldRefillInterval] = useState();
    const [refillInterval,setRefillInterval] = useState(undefined);
    const [productID,setProductID] = useState(undefined); 
    const [refillSummary, setRefillSummary] = useState();
    const [showConfirmationModal , setConfirmationModal] = useState(false)
    const [confirmationModalProps,setConfirmationModalProps] = useState({message:"",onSubmit:null,headerText:""});
    const [UpdateIntervalButton,changeUpdateIntervalButton] = useState(true);

    const refillService = RefillService();
    const validate = Validate();

    useEffect(() => {
        getRefillOrderIfo();
    }, []);

    const setValueForRadioElement=(interval)=>{
        switch (interval) {
            case 30:
                setChecked(1);
                setdefaultChecked(1)
                break;
            case 45:
                setChecked(2);
                setdefaultChecked(2)
                break;
            case 60:
                setChecked(3);
                setdefaultChecked(3)
                break;
            default:
                break;
        }
    }

    const getRefillOrderIfo = async () => {
        let obj = {}
        obj["refillId"] = props.refillId
        obj["customerId"] = props.customerId
        let amountArray=[]
        let totalAmount=0
        isLoading(true);
        const data = await refillService.getRefillOrderInfo(obj).then(data => {
            if (data && data.statusCode === "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                setGridData(data.dataObject.dataGrid);
                let dataSet = [...data.dataObject.dataSet];
                setDataSet(dataSet);
                let refillStatus = dataSet.some(data => data.refillItemStatus === "A") ? "A" : "I";
                setRefillStatus(refillStatus);
                dataSet.forEach((dataSet) => {
                    if(dataSet.refillItemStatus === refillStatus){
                        amountArray.push(dataSet.amount)
                    }
                })
                totalAmount = amountArray.reduce((adder, currentValue) =>
                    adder + currentValue, totalAmount
                );
                let finalRefillSummary={
                    "quantity": "Total Amount ",
                    "amount": parseFloat(totalAmount).toFixed(2)
                }
                setRefillSummary(finalRefillSummary);
                setRefillInterval(data.dataObject.refillInterval);
                setValueForRadioElement(data.dataObject.refillInterval);
                setOldRefillInterval(data.dataObject.refillInterval);
            } else {
                showAlert("error while fetching data","failure")
            }
        }).catch((err) => {
            showAlert("something went wrong","failure")
        });
        isLoading(false);
        return data;
    }

    const showAlert = (message, status) => {
        if(status == 'success') {
            setAlertContent({alertMessage:message,alertType: ALERT_TYPE.SUCCESS})
        } else{
            setAlertContent({alertMessage:message,alertType: ALERT_TYPE.ERROR})
        }
    }

    const updateRefillInterval = () => {
        let obj = {}
        obj["refillId"] = props.refillId;
        obj["interval"] = refillInterval;
        if (refillInterval && oldRefillInterval != refillInterval) {
                refillService.updateRefillInterval(obj).then((response) => {
                    if ("SUCCESS" === response.statusCode && validate.isNotEmpty(response.dataObject)) {
                        setOldRefillInterval(refillInterval);
                        showAlert("Delivery Interval Updated Successfully","success");
                        setdefaultChecked(checked)
                        setOldRefillInterval(refillInterval);
                    }
                    else {
                        showAlert("Unable to Update Delivery Interval ,Please Try Again","Failure");
                    }
                }).catch(()=>{
                    showAlert("There was some error at server side","Failure");
                })
        }
    }

    const updateInterval = () =>{
        if( validate.isNotEmpty(refillInterval) && oldRefillInterval!=refillInterval){
            setConfirmationModal(!showConfirmationModal);
            setConfirmationModalProps({message:`Do you want to Update Delivery Interval to ${refillInterval} Days`,headerText:"Refill Item",onSubmit:updateRefillInterval})  
        }
    }

    const setValueForChecked=(e)=>{
        let number = checked;
        let interval = refillInterval;
        switch (e.target.id) {
            case 'inline-optionsRadios1':
                number = 1;
                interval = 30;
                break;
            case 'inline-optionsRadios2':
                number = 2;
                interval = 45;
                break;
            case 'inline-optionsRadios3':
                number = 3;
                interval = 60;
                break;
            default:
                break;
        }
        setRefillInterval(interval);
        setChecked(number);
        if(oldRefillInterval==interval || validate.isEmpty(interval)){
            changeUpdateIntervalButton(true);
        }else{
            changeUpdateIntervalButton(false);
        }
    }


    const getDeliveryIntervalComponent = (props) => {
        return (
            <React.Fragment>
                <div className="custom-border-bottom-dashed p-12">
                    <p class="text-secondary font-12 mb-1">Delivery Interval</p>
                    <h6>I want to repeat every</h6>
                    <div key={`inline-radio`} className="mb-2" onClick={e=>setValueForChecked(e)}>
                        <Form.Check
                            inline
                            label="30 Days"
                            name="reason"
                            type={"radio"}
                            checked = {1==checked}
                            disabled = {1==defaultchecked}
                            id={`inline-optionsRadios1`}
                        />
                        <Form.Check
                            inline
                            label="45 days"
                            name="reason"
                            type={"radio"}
                            checked={2==checked}
                            disabled = {2==defaultchecked}
                            id={`inline-optionsRadios2`}
                        />
                        <Form.Check
                            inline
                            name="reason"
                            label="60 Days"
                            type={"radio"}
                            checked={3==checked}
                            disabled = {3==defaultchecked}
                            id={`inline-optionsRadios3`}
                        />
                    </div>
                </div>
                <div className="m-2 text-end">
                        <Button variant=" " className="brand-secondary" size="sm"  disabled={UpdateIntervalButton || refillStatus === "I"} onClick={updateInterval} >Update Interval</Button>
                        <Button variant="brand" className="ms-3" size="sm" disabled= {refillStatus === "I"} onClick={()=>{props.unsubscribeRefill(props.refillId)}} >Unsubscribe Refill</Button>
                </div>



                {/* <div id="deliveryInterval">
                    <input type="radio" id="optionsRadios1" name="reason" value="30" /> 30 Days&nbsp;
                    <input type="radio" id="optionsRadios2" name="reason" value="45" checked={true} /> 45 days&nbsp;
                    <input type="radio" id="optionsRadios3" name="reason" value="60" /> 60 Days&nbsp;
                </div>&nbsp; */}
            </React.Fragment>
        )
    }


   

    const removeRefillItem=(productID)=>{
            refillService.removeRefillItem({"refillId":props.refillId,"productId":productID}).then((response) => {
                if ("SUCCESS" === response.statusCode) {
                    showAlert("Refill Item removed successfully.","success");
                    if(validate.isEmpty(response.dataObject)) {
                        setRefillStatus("I");
                    }
                    const updatedDataSet = dataSet.map(refillItem => {
                        if(refillItem.productId === productID) {
                            refillItem.refillItemStatus = "I";
                            let {amount} = refillSummary; 
                            amount = parseFloat(parseFloat(amount)-refillItem.amount).toFixed(2);
                            setRefillSummary({...refillSummary,"amount":amount});
                        }
                        return refillItem;
                    });
                    setDataSet(updatedDataSet);
                }
                else {
                    showAlert("Unable to Remove Product ,Please Try Again","failure");
                }
            }).catch(()=>{
                showAlert("There was some error at server side","failure");
            })
    }

    const onClickRemoveProduct=(id, name)=>{
        if(validate.isNotEmpty(id)){
            setConfirmationModal(!showConfirmationModal);
            setProductID(id);
            setConfirmationModalProps({message:`Do you want to remove Refill Item: ${id} - ${name} ?`,headerText:"Product ID",onSubmit:removeRefillItem})
        }
    }

    const renderActionColumn=(props)=>{
        return <React.Fragment>
                    {props.row.refillItemStatus === "A" 
                        ? <DeleteIcon handleOnClick={(e) => { onClickRemoveProduct(props.row.productId,props.row.productName)}}/> 
                        : <DisabledCell cellId={props.row['productId']} showComponent={<DeleteIcon isDisabled/>} cellTooltip="Inactive Item"/>}
              </React.Fragment>
    }
    const renderMrpColumn=(props)=>{
        return <React.Fragment>
                <CurrencyFormatter data={props.row.mrp} decimalPlaces={2} />
             </React.Fragment>
    }

    const renderAmountColumn=(props)=>{
        return <React.Fragment>
                <CurrencyFormatter data={props.row.amount} decimalPlaces={2} />
             </React.Fragment>
    }

    const renderQuantityColumn=(props)=>{
        const onRowChange = props.onRowChange;
        const row = props.row;
        const column = props.column;
        const handleOnChange = (e) => {
            if(e.target.pattern  && e.target.value && !e.target.value.match(e.target.pattern)) {
                return;
            }
            if(e.target.maxlength && e.target.value && (e.target.value.length > e.target.maxlength)) {
                return;
            }
            onRowChange({...row,[column.key] : e.target.value});
        }

        const isDisabled = props.row.refillItemStatus === "I";
        
        return <input className={`editor-cell  ${isDisabled ? "bg-dark-subtle" : ''}`} type="number" onChange={handleOnChange} value={props.row.quantity} disabled= {isDisabled}/>
    }

    const setRowClassName=(rowData)=>{
        if(rowData.refillItemStatus === "I"){
            return "bg-body-secondary text-body-tertiary";
        }
    }
    
    const callBackMap = {
        "renderActionColumn": renderActionColumn,
        "renderMrpColumn": renderMrpColumn,
        "renderAmountColumn": renderAmountColumn,
        "renderQuantityColumn": renderQuantityColumn,
        "rowClassName": setRowClassName,
    }

    const onEdit=({row,column,updatedRowIndex})=>{
        refillService.updateQuantity({refillId:props.refillId,productId:row.productId,quantity:row.quantity}).then(response=>{
            if(response.statusCode=="SUCCESS" && response.message == "SUCCESS"){
                showAlert("Quantity updated succedfully","success");
                getRefillOrderIfo();
            }else{
                showAlert("Failed to update quantity");
            }
        }).catch(err=>{
            console.log(err);
            showAlert("There was some error at server side","Failure");
        })
        return {}
    }


    const headerPart = () => {
        return (
            <React.Fragment>
                <div class="align-items-center border-bottom d-flex justify-content-between px-2 px-lg-3 py-1">
                <p className="mb-0">Details for Refill ID - <span className="fw-bold">{props.refillId}</span></p>
                <div class=" d-flex align-items-center">
                    <Button variant=" " onClick={() => {
                        props.setShowModal(false); setTimeout(() => {
                            props.setSelectedrefiilId(undefined);
                        }, 2000)
                    }} className="rounded-5 icon-hover btn-link">
                    <span className='custom-close-btn icon-hover'></span>
                    </Button>
                 </div>
                 </div>
            </React.Fragment>
        )
    }

    const bodyPart = () => {
    	if(!loading){
        	return (
            	<React.Fragment>
                	<div className="row gx-3 h-100">
                    	<div className="border col-4 overflow-auto rounded-2 refill-content-height">
                        	<div className="custom-border-bottom-dashed p-12 pb-0">
                               <CustomerDetails customerId={props.customerId} needRule={false}/>
                            </div>
                            <div>
                              {getDeliveryIntervalComponent(props)}
                            </div>
                       </div>
                    <div className="col-8 pe-0 h-100">
                        <div className="border rounded-2 p-12 overflow-auto h-100">
                            <p className="custom-fieldset mb-1">Refil Details</p>
                            <div style={{width: `calc((100vw - 19.437rem) - 339.33px - 1rem)`,height:`calc(100% - 2.25rem)`}}>
                                {gridData ?
                                    <div className="card h-100">
                                        <div className="card-body h-100 p-0">
                                            <CommonDataGrid
                                                {...gridData}
                                                dataSet={dataSet}
                                                callBackMap={callBackMap}
                                                bottomSummaryRows={[{...refillSummary,'amount':'\u20B9'+refillSummary.amount}]}
                                                onEdit={onEdit}
                                            />
                                        </div>
                                    </div>
                                    : <NoDataFound text="No Data Found" />}
                            </div>
                        </div>
                    </div>
                    </div>
                </React.Fragment>
            )
        }
    }


     return <React.Fragment>
        <DetailModal {...props} loading={loading} headerPart={headerPart} headerVisibility={true} bodyPart={bodyPart} bodyVisibility={true} bodyClassName="h-100 mx-2" />
        {showConfirmationModal && <CommonConfirmationModal headerText={confirmationModalProps.headerText} isConfirmationPopOver={showConfirmationModal} setConfirmationPopOver={setConfirmationModal} message={confirmationModalProps.message} buttonText={"Submit"} onSubmit={()=>confirmationModalProps.onSubmit(productID)} />}
        {/* <Wrapper className={props.showModal ? "m-0":""} showHeader={true}>
             <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                 <p className="mb-0">Refill Details for Refill Id: {props.refillId}</p>
                 <div class=" d-flex align-items-center">
                     <Button variant="light" onClick={() => props.setShowModal(false)} className="rounded-5 icon-hover">
                         <img src={CloseIcon} alt="Close Icon" title="close" />
                     </Button>
                 </div>
             </HeaderComponent>
             <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height" >
                 {!loading && <div className={'h-50'}>
                     {gridData ?
                         <CommonDataGrid
                             {...gridData}
                             dataSet={dataSet}
                             callBackMap={callBackMap}
                             bottomSummaryRows={refillSummary}
                         /> : <p>...Loading...</p>}
                 </div>}
                 {dataSet && !loading && getDeliveryIntervalComponent()}
                 {showConfirmationModal && <CommonConfirmationModal headerText={"Refill Item"} isConfirmationPopOver={showConfirmationModal} setConfirmationPopOver={setConfirmationModal} message={`Do you want to Update Delivery Interval to `} buttonText={"Submit"} onSubmit={()=>updateRefillInterval(props)} />}
             </BodyComponent>
         </Wrapper> */}
     </React.Fragment> 
}

export default RefillSearchResultModal;