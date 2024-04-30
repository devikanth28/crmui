import React, { useContext, useEffect, useRef, useState } from "react";
import Validate from "../../../helpers/Validate";
import { AlertContext, CustomerContext, LocalityContext } from "../../Contexts/UserContext";
import { PlanSummary } from "./orderReview/PlanSummary";
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../../Common/CommonStructure";
import { getCustomerRedirectionURL } from "../CustomerHelper";
import MembershipService from "../../../services/Membership/MembershipService";
import ButtonWithSpinner from "../../Common/ButtonWithSpinner";

const ThankyouPage = (props) => {

    const { customerId, subscription, setCustomer, customer } = useContext(CustomerContext);
    const [orderSummary, setOrderSummary] = useState(subscription.orderSummary);
    const { setIsLocalityComponentNeeded } = useContext(LocalityContext);
    const [edcLoader, setEDCLoader] = useState(false);
    const {setStackedToastContent} = useContext(AlertContext);
    const headerRef = useRef();
    const footerRef = useRef();

    useEffect(() => {
        setIsLocalityComponentNeeded(false);
    },[])

    if(Validate().isEmpty(orderSummary)){
        props.history.replace(getCustomerRedirectionURL(customerId,'medplusAdvantage'))
    }

    const redirectToSubscriptionDetails = () => {
        props.history.replace(getCustomerRedirectionURL(customerId,'medplusAdvantage'))
    };

    const checkEDCStatus = async () => {
        setEDCLoader(true);
        let response = await MembershipService().checkEDCStatus({customerId : `${customerId}`, orderId: `${orderSummary.orderId}`});
        setEDCLoader(false);
        if(response.statusCode === "SUCCESS"){
            setOrderSummary({...orderSummary, paymentStatus: response.dataObject});
            setCustomer({...customer, refreshData : true});
            if(response.dataObject === "PENDING"){
                setStackedToastContent({toastMessage : "Payment is Pending"});
            }else if(response.dataObject === "FAIL"){
                setStackedToastContent({toastMessage : "Payment Failed"});
            }else if(response.dataObject === "SUCCESS"){
                setStackedToastContent({toastMessage : "Payment Completed Successfully"});
            }
        }else{
            setStackedToastContent({toastMessage : response.message});
        }
    }

    const retryEDCPayment = async () => {
        setEDCLoader(true);
        let response = await MembershipService().retryEDCPayment({customerId : `${customerId}`, orderId: `${orderSummary.orderId}`});
        setEDCLoader(false);
        if(response.statusCode === "SUCCESS"){
            setOrderSummary({...orderSummary, paymentStatus: "PENDING"});
            setStackedToastContent({toastMessage : "Payment Created Successfully"});
        }else{
            setStackedToastContent({toastMessage : response.message});
        }
    }

    return <Wrapper>

        <HeaderComponent ref={headerRef} className="p-12 border-bottom align-items-center d-flex justify-content-between">
            Order Summary
            {orderSummary.paymentStatus === "PENDING" && <ButtonWithSpinner variant=" " showSpinner={edcLoader} disabled={edcLoader} className={"px-2 brand-secondary btn px-lg-4 me-2"} onClick={checkEDCStatus} buttonText={"Check Status"}/>}
            {orderSummary.paymentStatus === "FAIL" && <ButtonWithSpinner variant=" " showSpinner={edcLoader} disabled={edcLoader} className={"px-2 brand-secondary btn px-lg-4 me-2"} onClick={retryEDCPayment} buttonText={"Retry Payment"}/>}
        </HeaderComponent>

        <BodyComponent className="body-height" allRefs = {{headerRef, footerRef}}>
            <p className='mb-2'>{orderSummary['summaryMessage']}</p>
            <div>
                <h2 className='mb-2'>{orderSummary.planName}</h2>
                {Validate().isNotEmpty(orderSummary.multiPlanName) ? 
                <p className='mb-3 font-14 text-secondary font-weight-bold'>({orderSummary.multiPlanName})</p> : <></>}
            </div>
            <div className='pb-1 border-bottom col'>
                <h2 className='mb-2' style={{ "color": "#6C757D" }}>Subscription Code</h2>
                <h1 style={{ "color": "#11B094" }} className="fw-bold">{orderSummary['subscriptionCode']}</h1>
            </div>
            <div className='mt-2'>
                <PlanSummary cartSummary={orderSummary} thankyouPage={true} />
            </div>
        </BodyComponent>

        <FooterComponent ref={footerRef} className="p-12 border-top d-flex justify-content-end justify-content-lg-end">
            <button type="submit" className='btn btn-dark p-2' onClick={redirectToSubscriptionDetails}>View Subscription Details</button>
        </FooterComponent>

    </Wrapper>

}

export default ThankyouPage;