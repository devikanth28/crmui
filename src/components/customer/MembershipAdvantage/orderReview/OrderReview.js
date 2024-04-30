import { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../../../Common/CommonStructure';
import PaymentForm from './PaymentForm';
import RequestOtpForm from './RequestOtpForm';
import VerifyOtpForm from './VerifyOtpForm';
import Validate from '../../../../helpers/Validate';
import EdcDevicesForm from './EdcDevicesForm';
import { AlertContext, CustomerContext, LocalityContext } from '../../../Contexts/UserContext';
import { PlanSummary } from './PlanSummary';
import useRole from '../../../../hooks/useRole';
import { Roles } from '../../../../constants/RoleConstants';
import MembershipService from '../../../../services/Membership/MembershipService';
import { CRM_UI } from '../../../../services/ServiceConstants';
import { ProcessType } from '../MembershipHelper';
import ButtonWithSpinner from '../../../Common/ButtonWithSpinner';

export default withFormHoc(({helpers, ...props}) => {

    const validate = Validate();

    const [hasRoleSubscriptionCash, hasRoleLabSubscriptionPlanAdd] = useRole([Roles.ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH, Roles.ROLE_CRM_LAB_SUBSCRIPTION_PLAN_ADD]);

    const {subscription, customer, customerId, setSubscription, setCustomer} = useContext(CustomerContext);
    if(validate.isEmpty(subscription)){
        props.history.replace(`${CRM_UI}/customer/${customerId}/medplusAdvantage`);
    }

    const cartSummary =  subscription.cartSummary;
    const subscriptions = subscription.subscriptions;
    const subscriptionId = subscription.id;
    const planId = subscription.plan.id;
    const planName = subscription.plan.name;
    const planType = subscription.plan.type;
    const benefitType = subscription.benefitType;
    const isUpgrade = subscription.processType === ProcessType.UPGRADE_SUBSCRIPTION;
    const isAddOn = subscription.processType === ProcessType.ADDON_SUBSCRIPTION;
    const renewalSubscription = subscription.renewalSubscription;
    const renewalBenefit = subscription.renewalBenefit;

    const {setStackedToastContent} = useContext(AlertContext);
    const {martLocality,setIsLocalityComponentNeeded} = useContext(LocalityContext);
    const [otpRequested, setOtpRequested] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [selectedCollectionCenterId, setSelectedCollectionCenterId] = useState("");
    const [paymentType, setPaymentType] = useState(hasRoleLabSubscriptionPlanAdd ? "ONLINE" : "");
    const [selectedEdcDevice, setSelectedEdcDevice] = useState("");
    const [amount, setAmount] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardDeviceId, setCardDeviceId] = useState("");
    const [cardTxnNumber, setCardTxnNumber] = useState("");
    
    const [buySubscriptionSpinner, setBuySubscriptionSpinner] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const headerRef = useRef();
    const footerRef = useRef();

    const selectCollectionCenter = (collectionCenterId) => {
        setSelectedCollectionCenterId(collectionCenterId);
    }

    useEffect(() => {
        setIsLocalityComponentNeeded(false);
    },[])

    const disableSubmitButton = () => {
        if(!otpRequested){
            return true;
        }
        if(!isOtpVerified){
            return true;
        }
        if(hasRoleSubscriptionCash){
            if(validate.isEmpty(paymentType)){
                return true;
            }
            if(hasRoleSubscriptionCash && validate.isEmpty(selectedCollectionCenterId)){
                return true;
            }
            if(paymentType === "ONLINE"){

            }else if(paymentType === "CREDIT_CARD"){
                if(validate.isEmpty(cardNumber)){
                    return true;
                }
                if(validate.isEmpty(cardDeviceId)){
                    return true;
                }
                if(validate.isEmpty(cardTxnNumber)){
                    return true;
                }
                if(validate.isEmpty(amount)){
                    return true;
                }
                if(parseFloat(amount).toFixed(2) !== parseFloat(cartSummary.totalPrice).toFixed(2)){
                    return true;
                }
            }else if(paymentType === "PAYTM_EDC"){
                if(validate.isEmpty(selectedEdcDevice)){
                    return true;
                }
            }else if(paymentType === "CASH"){
                if(validate.isEmpty(amount)){
                    return true;
                }
                if(parseFloat(amount).toFixed(2) !== parseFloat(cartSummary.totalPrice).toFixed(2)){
                    return true;
                }
            }
        }
        return false;
    }

    const submitSubscriptionOrder = async () => {
        setBuySubscriptionSpinner(true)
        let polygonPlanIds = martLocality.membershipConfig.onlineServingPlanIds;
        if(hasRoleSubscriptionCash){
            polygonPlanIds = martLocality.membershipConfig.configuredPlanIds;
        }

        if((planType == "INDIVIDUAL" || planType == "INDIVIDUAL_COMBO") && Validate().isNotEmpty(polygonPlanIds) && !(polygonPlanIds.includes(parseInt(planId)))) {
			setStackedToastContent({toastMessage: "This plan is not available in your locality"});
			return false;
		}
		
		if((planType == "INDIVIDUAL" || planType == "INDIVIDUAL_COMBO") && (Validate().isEmpty(martLocality) || Validate().isEmpty(martLocality.membershipConfig)))   {
            setStackedToastContent({toastMessage: "Medplus Advantage not available in your locality"});
			return false;
		}

        if(!validateRoleSubscriptionCashParams()){
            return false;
        }

        let memberShipOrderRequests = [];

        subscriptions.map(eachSubscription => {
            let memberShipOrderRequest = {
                customerId: customerId,
                planId: eachSubscription.plan.id,
                members: eachSubscription.members,
                subscriptionId:eachSubscription.id,
                collectionStoreId:selectedCollectionCenterId
            };
            
            if (subscriptionId && !renewalSubscription) {
                memberShipOrderRequest.subscriptionId = subscriptionId;
            }

            if(validate.isNotEmpty(eachSubscription.comboPlanId)) {
                memberShipOrderRequest.comboPlanId = eachSubscription.comboPlanId;
            }
            setStoreInfoToMembershipOrderRequest(eachSubscription.benefitType, memberShipOrderRequest);
            memberShipOrderRequests.push(memberShipOrderRequest);
        })

        let orderRequestInfo = {};
		orderRequestInfo.memberShipOrderRequest = memberShipOrderRequests;
        setPaymentDetails(orderRequestInfo);
        let response = await MembershipService().createSubscriptionOrder(orderRequestInfo);
        if(response.statusCode === "SUCCESS" && validate.isNotEmpty(response.dataObject)){
            let {orders, cartSummary} = response.dataObject;
            setSubscription({orderSummary : prepareOrderSummary(cartSummary, orders)});
            setCustomer({...customer, refreshData : true});
            props.history.replace(`${CRM_UI}/customer/${customerId}/medplusAdvantage/maThankYou`);
        }else{
            setStackedToastContent({toastMessage: response.message});
        }
        setBuySubscriptionSpinner(false);
    }

    const upgradeSubscriptionOrder = async () => {
        let polygonPlanIds = martLocality.membershipConfig.onlineServingPlanIds;
        if(hasRoleSubscriptionCash){
            polygonPlanIds = martLocality.membershipConfig.configuredPlanIds;
        }
        let memberShipUpgradeOrderRequest = {};
        if (isUpgrade && validate.isNotEmpty(subscriptionId) && !renewalSubscription) {
			memberShipUpgradeOrderRequest.subscriptionId = subscriptionId;
		}
        setStoreInfoToMembershipOrderRequest(benefitType, memberShipUpgradeOrderRequest);
        if(!validateRoleSubscriptionCashParams()){
            return false;
        }
        setPaymentDetails(memberShipUpgradeOrderRequest);
        setBuySubscriptionSpinner(true);
        let response = await MembershipService().upgradeSubscriptionOrder({memberShipUpgradeOrderRequest, polygonPlanIds});
        if(validate.isNotEmpty(response.dataObject)){
            if(response.dataObject.status === "SUCCESS" && validate.isNotEmpty(response.dataObject)){
                let {orders, cartSummary} = response.dataObject;
                setSubscription({orderSummary : prepareOrderSummary(cartSummary, orders)});
                setCustomer({...customer, refreshData : true});
                props.history.replace(`${CRM_UI}/customer/${customerId}/medplusAdvantage/maThankYou`);
            }
            else if(response.dataObject.status === "ERROR" && validate.isNotEmpty(response.dataObject)){
                setStackedToastContent({toastMessage: response.dataObject.errors[0]});
                setBuySubscriptionSpinner(false);
            }
            else{
                setStackedToastContent({toastMessage: response.message? response.message: "Unable to process the request."});
                setBuySubscriptionSpinner(false);
            }
    }
    else{
        setStackedToastContent({toastMessage: "Unable to process the request."});
    }
    }

    const prepareOrderSummary = (summary, orders) => {
        let orderSummary = {};
        orderSummary['totalMembers'] = summary.totalMembers;
        orderSummary['primaryFee'] = validate.isNotEmpty(cartSummary.primaryFee) ? parseFloat(cartSummary.primaryFee).toFixed(2) : 0.0;
        orderSummary['addOnFees'] = validate.isNotEmpty(cartSummary.addOnFees) ? [...cartSummary.addOnFees] : [];
        orderSummary['additionalRenewalDisc'] = validate.isNotEmpty(cartSummary.additionalRenewalDisc) ? parseFloat(cartSummary.additionalRenewalDisc).toFixed(2) : 0.0;
        orderSummary['totalDisc'] = validate.isNotEmpty(cartSummary.totalDisc) ? parseFloat(cartSummary.totalDisc).toFixed(2) : 0.0;
        orderSummary['totalPrice'] = validate.isNotEmpty(cartSummary.totalPrice) ? parseFloat(cartSummary.totalPrice).toFixed(2) : 0.0;
        orderSummary['plans'] = validate.isNotEmpty(summary.plans) ? [...summary.plans] : [];
        orderSummary['paymentType'] = paymentType;
        if(orderSummary['paymentType'] === "PAYTM_EDC"){
            orderSummary['paymentStatus'] = "PENDING";
        }
        orderSummary["orderId"] = orders[0].order.orderId;
        let summaryMessage = '';
        if(isUpgrade){
            if(paymentType === "ONLINE"){
                summaryMessage = 'Membership Upgrade order created successfully';
            }else {
                summaryMessage = 'You are successfully upgraded to';
            }
        }else if(isAddOn){
            summaryMessage = 'New member/s has been added to your';
        }else {
            if(paymentType === "ONLINE"){
                summaryMessage = 'Membership Subscription order created successfully';
            }else {
                summaryMessage = 'You are successfully subscribed to';
            }
        }
        orderSummary['summaryMessage'] = summaryMessage;
        orderSummary['planName'] = planName;
        if(orderSummary.plans.length > 1){
            orderSummary['multiPlanName'] = '';
            orderSummary.plans.map((eachPlan, index) => {
                if(index + 1 === orderSummary.plans.length){
                    orderSummary.multiPlanName = `${orderSummary.multiPlanName} ${eachPlan.displayName} `;
                }else{
                    orderSummary.multiPlanName = `${orderSummary.multiPlanName} ${eachPlan.displayName} + `
                }
            })
        }
        orderSummary['subscriptionCode'] = ''; 
        orders.map((eachOrder, index) => {
            if(index + 1 === orders.length){
                orderSummary.subscriptionCode = `${orderSummary.subscriptionCode} ${eachOrder.subscriptionCode} `;
            }else {
                orderSummary.subscriptionCode = `${orderSummary.subscriptionCode} ${eachOrder.subscriptionCode}  / `;
            }
        })
        return orderSummary;
    }

    const setStoreInfoToMembershipOrderRequest = (benefitType, memberShipOrderRequest) => {
        if (hasRoleSubscriptionCash) {
            memberShipOrderRequest.collectionStoreId = selectedCollectionCenterId;
        }

        if(benefitType === "PHARMACY") {
            if((planType == "INDIVIDUAL" || planType == "INDIVIDUAL_COMBO")){
                if(hasRoleSubscriptionCash && validate.isNotEmpty(selectedCollectionCenterId)) {
                    memberShipOrderRequest.storeId = martLocality.membershipConfig.optivalStoreId;
                }
                if(validate.isNotEmpty(martLocality.membershipConfig.optivalStoreId) && (subscription.isUpgrade || subscription.subId || subscription.renewalSub) && !(hasRoleSubscriptionCash)) {
                    memberShipOrderRequest.storeId = martLocality.membershipConfig.optivalStoreId;
                }
            }
        } else {
            if(hasRoleSubscriptionCash && validate.isNotEmpty(selectedCollectionCenterId)) {
                memberShipOrderRequest.storeId = selectedCollectionCenterId;
            }
            if((planType == "INDIVIDUAL" || planType == "INDIVIDUAL_COMBO") && validate.isNotEmpty(martLocality) && validate.isNotEmpty(martLocality.membershipConfig) && validate.isNotEmpty(martLocality.membershipConfig.medplusStoreId) && (subscription.isUpgrade || !subscription.subId || subscription.renewalSub) && !(hasRoleSubscriptionCash)) {
                memberShipOrderRequest.storeId = martLocality.membershipConfig.medplusStoreId;
            }
        }
    }

    const validateRoleSubscriptionCashParams = () => {
        if(hasRoleSubscriptionCash && validate.isEmpty(selectedCollectionCenterId)){
            setBuySubscriptionSpinner(false);
            setStackedToastContent({toastMessage : "Please Select Collection Center."});
			return false;
		}

		if(hasRoleSubscriptionCash && validate.isEmpty(paymentType)){
            setBuySubscriptionSpinner(false);
            setStackedToastContent({toastMessage : "Please Select Payment Type."});
			return false;
		}

		if(hasRoleSubscriptionCash && paymentType != 'ONLINE' && paymentType != 'PAYTM_EDC' && validate.isEmpty(amount)){
            setStackedToastContent({toastMessage : "Please Enter amount."});
			return false;
		}
        return true;
    }


    const setPaymentDetails = (orderRequest) => {
        if (paymentType === 'ONLINE') {
			orderRequest.paymentType = 'ONLINE';
		} else if (paymentType === 'PAYTM_EDC') {
			orderRequest.paymentType = 'DEVICE';
			orderRequest.paymentDetails = {
				deviceId: selectedEdcDevice,
				gatewayId: 'PAYTM_EDC_GATEWAY'
			};
		} else {
			orderRequest.paymentType = 'CASH';
			orderRequest.paymentDetails = {
				actualPayMode: paymentType,
				gatewayAmount: amount
			};
			if (paymentType == "CREDIT_CARD") {
				orderRequest.paymentDetails.transactionId = cardTxnNumber;
				orderRequest.paymentDetails.cardNumber = cardNumber;
				orderRequest.paymentDetails.deviceId = cardDeviceId;
			}
		}
    }

    return  <React.Fragment>
                <Wrapper>
                    <HeaderComponent ref= {headerRef} className="p-12 border-bottom">
                        Order Review
                    </HeaderComponent>
                    <BodyComponent className="body-height" allRefs = {{headerRef, footerRef}}>
                        <RequestOtpForm setIsTimerRunning={setIsTimerRunning} setOtpRequested={setOtpRequested} customerId={customerId} members={subscription.members} processType={subscription.processType} />
                        {otpRequested && <VerifyOtpForm setIsTimerRunning={setIsTimerRunning} isTimerRunning={isTimerRunning} setIsOtpVerified={setIsOtpVerified} customerId={customerId} members={subscription.members} processType={subscription.processType} />}
                        {isOtpVerified &&   <React.Fragment>
                                                <PlanSummary cartSummary = {cartSummary} />
                                                {hasRoleSubscriptionCash && <PaymentForm
                                                    cartSummary = {cartSummary} 
                                                    setPaymentType={setPaymentType} 
                                                    selectCollectionCenter={selectCollectionCenter} 
                                                    setAmount={setAmount}
                                                    setCardNumber={setCardNumber}
                                                    setCardDeviceId={setCardDeviceId}
                                                    setCardTxnNumber={setCardTxnNumber} />}
                                            </React.Fragment>
                        }
                        {(validate.isNotEmpty(selectedCollectionCenterId) && paymentType === "PAYTM_EDC") &&  <EdcDevicesForm key={selectedCollectionCenterId} collectionCenterId={selectedCollectionCenterId} setSelectedEdcDevice={setSelectedEdcDevice} />}
                    </BodyComponent>
                    <FooterComponent ref={footerRef} className="p-12 border-top d-flex justify-content-center justify-content-lg-end">
                        <button role="button" arila-label="back" type="button" class="px-2 brand-secondary btn px-lg-4 me-2" onClick={() => props.history.goBack()}>Back</button>
                        <ButtonWithSpinner showSpinner={buySubscriptionSpinner} className="px-2 btn-brand btn px-lg-4" disabled={disableSubmitButton()} onClick={() => isUpgrade ? upgradeSubscriptionOrder() : submitSubscriptionOrder()} buttonText="Buy Subscription"/>
                    </FooterComponent>
                </Wrapper>
            </React.Fragment>
})