import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useState } from "react";
import { Button } from "reactstrap";
import Validate from "../../../helpers/Validate";
import LabOrderService from "../../../services/LabOrder/LabOrderService";
import { AlertContext } from '../../Contexts/UserContext';

const paymentModal=({helpers,...props})=>{
    const validate = Validate();
    const amountPattern = /^([0-9]*[\.]{0,1}[0-9]{0,2})$/;


    const [paymentOption, setPaymentOption] = useState("CASH");
    const [paymentDetails, setPaymentDetails] = useState({ amount:'', transactionId: '', deviceId: '', cardNo: ''});
    const {setAlertContent,setStackedToastContent} = useContext(AlertContext);

    const handleReturn = () => {
        if (paymentOption == 'CASH' && validate.isNotEmpty(paymentDetails) && validateCashAmount()) {
            props.handleReturn({ ...paymentDetails, mode: paymentOption })
        } else if (paymentOption == 'CC' && validateCCDetails()) {
            props.handleReturn({ ...paymentDetails, mode: paymentOption })
        } else if (paymentOption == "EDC" && validateEdcAmount(paymentDetails)) {
            props.handleReturn({ ...paymentDetails, mode: paymentOption })
        }
    }

    const handleRetry=()=>{
        props.setRetryState(false);
        props.setSubmitState(true); 
    }

    const validateEdcAmount = (paymentDetails) => {
        if(validate.isEmpty(paymentDetails.deviceId) ){
            setStackedToastContent({toastMessage:"Please select device"});
            return false;
        }
        return true
    }
    const validateCashAmount = () => {
        var totalAmount = props.neededToCollect;
        if (!(validate.isNumeric(paymentDetails.amount) && amountPattern.test(paymentDetails.amount) && paymentDetails.amount > 0)) {
            setStackedToastContent({toastMessage:"Enter Valid CashAmount"});
            return false;
        }
        if (!((paymentDetails.amount >= totalAmount && paymentDetails.amount + props.receivedAmount <= totalAmount) || paymentDetails.amount == totalAmount)) {
            setStackedToastContent({toastMessage:"Cash Amount should be equals to Need To Collect Amount"});
            return false;
        }
        return true;
    }

    const validateCCDetails = () => {
        var cardNumPattern = /^[0-9]{1,16}$/;
        var txnNumPattern = /^([a-zA-Z0-9]{1,20})$/;
        var deviceIdPattern = /^[0-9]{1,50}$/;
        if (!(validate.isNotEmpty(paymentDetails.amount) && amountPattern.test(paymentDetails.amount) && paymentDetails.amount > 0)) {
            setStackedToastContent({toastMessage:"Enter Valid CreditAmount"});
            return false
        }
        if (!((paymentDetails.amount >= props.neededToCollect - props.roundedValue  && (paymentDetails.amount + props.receivedAmount <= props.neededToCollect - props.roundedValue )) || (paymentDetails.amount == props.neededToCollect - props.roundedValue ))) {
            setStackedToastContent({toastMessage:"Credit Amount should be equals to Need To Collect Amount"});
            return false;
        }
        if (!(validate.isNumeric(paymentDetails.transactionId) && txnNumPattern.test(paymentDetails.transactionId))) {
            setStackedToastContent({toastMessage:"Enter Valid TransactionId"});
            return false;
        }       
        if (!(validate.isNumeric(paymentDetails.cardNo) && cardNumPattern.test(paymentDetails.cardNo))){
            setStackedToastContent({toastMessage:"Enter Valid CardNo"});
            return false;
        }
        if (!(validate.isNumeric(paymentDetails.deviceId) && deviceIdPattern.test(paymentDetails.deviceId))) {
            setStackedToastContent({toastMessage:"Enter Valid DeviceId"});
            return false;
        } 
        return true;
    }

    const intialPaymentForm = () =>{
        helpers.showElement("cashGroup");
        let devices = [];
        if(props.isEDCRequired){
            const edcOption = helpers.createOption("EDC","Paytm EDC", "EDC");
            helpers.addOption("paymentRadio",edcOption,false);
            helpers.showElement("EDC")
        }

        if(validate.isNotEmpty(props.edcDevices)){
            props.edcDevices.map(device =>{
                devices.push(helpers.createOption(device["deviceId"],device["deviceId"],device["deviceId"]));
            })
            helpers.updateSingleKeyValueIntoField("values",devices,"paytmEDC");
        }

        if(props.retryState || props.statusState){
            helpers.disableElement("paytmEDC");
            helpers.disableElement("paymentRadio");
            helpers.updateValue("EDC","paymentRadio");
            helpers.updateValue(paymentDetails.deviceId,"paytmEDC")
            helpers.hideElement("cashGroup");
            helpers.showElement("edcGroup");
        }
        if(props.retryState){
            helpers.showElement("retry");
        }
        if(props.statusState){
            helpers.showElement("statusCheck");
        }
        if(props.submitState){
            helpers.showElement("submit");
        }
    }

    const handlePaymentOption = (payload) => {
        let option = payload[0].target.value;
        setPaymentOption(option);
        props.setPaymentOption ? props.setPaymentOption(option) : null;
        switch(option){
            case "CASH" : {
                helpers.showElement("cashGroup");
                helpers.hideElement("creditGroup");
                helpers.hideElement("edcGroup"); 
                break;
            }
            case "CC" : { 
                helpers.showElement("creditGroup");
                helpers.hideElement("cashGroup");
                helpers.hideElement("edcGroup");
                break;
            }
            case "EDC" : {
                helpers.showElement("edcGroup");
                helpers.hideElement("cashGroup");
                helpers.hideElement("creditGroup");
                break;
            }
            
        }
    }
    

    const paymentObserverMap = {
        'paymentForm' : [['load',intialPaymentForm]],
        'cashAmount' : [['change',(payload)=>setPaymentDetails({...paymentDetails,amount : payload[0].target.value})]],
        'creditAmount' : [['change',(payload)=>setPaymentDetails({...paymentDetails,amount : payload[0].target.value})]],
        'transactionID' : [['change',(payload)=>setPaymentDetails({...paymentDetails,transactionId : payload[0].target.value})]],
        'cardNo' : [['change',(payload)=>setPaymentDetails({...paymentDetails,cardNo : payload[0].target.value})]],
        'deviceID' : [['change',(payload)=>setPaymentDetails({...paymentDetails,deviceId : payload[0].target.value})]],
        'paytmEDC' : [['change',(payload)=>setPaymentDetails({...paymentDetails,deviceId : payload[0].target.value})]],
        'paymentRadio': [['change',handlePaymentOption]],
        'submit' : [['click',handleReturn]],
        'retry' : [['click',handleRetry]],
        'statusCheck' : [['click',props.handleStatusCheck]]
    }


    return <React.Fragment>
        <p className='custom-fieldset mt-3'>Payment Methods</p>
        <div>
            <div className='p-2'>       
                <DynamicForm requestUrl={'/customer-relations/getPaymentForm'} helpers={helpers} requestMethod={'GET'} observers={paymentObserverMap}/>
            </div>
        </div>

    </React.Fragment>
}

export default withFormHoc(paymentModal);
