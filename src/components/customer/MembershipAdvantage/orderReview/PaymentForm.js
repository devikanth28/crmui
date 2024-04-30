import DynamicForm, { withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useContext, useEffect, useRef, useState } from "react";
import { API_URL } from "../../../../services/ServiceConstants";
import Validate from "../../../../helpers/Validate";
import { Roles } from "../../../../constants/RoleConstants";
import useRole from "../../../../hooks/useRole";
import { LocalityContext } from "../../../Contexts/UserContext";

export default withFormHoc(({helpers, ...props}) => {

    const [showAmount, setShowAmout] = useState(false);
    const [paymentType,setPaymentType] = useState('');
    const validate = Validate();
    const paymentFormRef = useRef(null);
    const [isFrontOfficeOrderCreate] = useRole([Roles.ROLE_CRM_LAB_FRONT_OFFICE_ORDER_CREATE]);
    const { labLocality } = useContext(LocalityContext);

    const totalAmount = validate.isNotEmpty(props.cartSummary) && validate.isNotEmpty(props.cartSummary.totalAmount) ? parseFloat(props.cartSummary.totalAmount).toFixed(2) : validate.isNotEmpty(props.cartSummary.totalPrice) ? parseFloat(props.cartSummary.totalPrice).toFixed(2) : 0.0;

    useEffect(()=>{
        if(validate.isNotEmpty(paymentType)){
            paymentFormRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    },[paymentType])

    const changePayment = (event) => {
        
        let paymentType = event[1].value;
        props.setAmount(totalAmount);
        props.setCardNumber("");
        props.setCardDeviceId("");
        props.setCardTxnNumber("");
        props.setPaymentType(paymentType);
        if(paymentType === "ONLINE"){
            setShowAmout(false);
            helpers.hideElement("cardGroup");
        }else if(paymentType === "CREDIT_CARD") {
            helpers.showElement("cardGroup");
        }else if(paymentType === "PAYTM_EDC") {
            setShowAmout(false);
            helpers.hideElement("cardGroup");
        }else if(paymentType === "CASH") {
            setShowAmout(true);
            helpers.hideElement("cardGroup");
        }
        setPaymentType(paymentType);
    }

    const changeCollectionCenter = (event) => {
        let collectionCenter = event[1].value[0];
        props.selectCollectionCenter(collectionCenter);
    }

    const changeCardNumber = (event) => {
        let cardNumber = event[0].target.value;
        props.setCardNumber(cardNumber);
    }
    
    const changeDeviceId = (event) => {
        let deviceId = event[0].target.value;
        props.setCardDeviceId(deviceId);
    }

    const changeTransactionNumber = (event) => {
        let cardTxnNumber = event[0].target.value;
        props.setCardTxnNumber(cardTxnNumber);
    }

    const updateInitialValues = () => {
        if(props.isFromLabs != "Y"){
            helpers.updateValue(props.paymentType, "paymentType");
            return;
        }
        let options = [];
        if(isFrontOfficeOrderCreate && !props.isTPDcenter) {
            options.push(helpers.createOption("cash", "Cash", "CASH"));
            options.push(helpers.createOption("creditCard", "Card", "CREDIT_CARD"));
            options.push(helpers.createOption("paytmEDC", "Paytm EDC", "PAYTM_EDC"));
        } else {
            if(labLocality?.onlinePaymentAllowed === "Y") {
                options.push(helpers.createOption("online", "Online", "ONLINE"));
            }
            if(props?.cartInfo?.codAllowed && !props.isTPDcenter) {
                options.push(helpers.createOption("cash", "Cash", "CASH"));
            }
        }
        helpers.updateSingleKeyValueIntoField("values",options,"paymentType");
    }

    const observers = {
        'membershipPaymentForm': [['load', updateInitialValues]],
        'collectionCenter' : [['select',changeCollectionCenter ]],
        'paymentType' : [['change', changePayment]],
        'cardNumber' : [['change', changeCardNumber]],
        'deviceId' : [['change', changeDeviceId]],
        'transactionNumber' : [['change', changeTransactionNumber]]
    }

    return  <React.Fragment>
            <div ref={paymentFormRef}>
                <DynamicForm requestUrl={`${API_URL}membershipPaymentForm?isFromLabs=${props.isFromLabs === "Y" ? props.isFromLabs : undefined}`} helpers={helpers} requestMethod={'GET'} observers={observers} />
                {showAmount && <div className={`font-weight-bold ${paymentType == 'CREDIT_CARD' ? "m-2" : ""}`}>Amount to be collected : {totalAmount}</div>}
            </div>
            </React.Fragment>
})