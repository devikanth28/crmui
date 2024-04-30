import React, { useContext, useEffect, useState } from "react";
import AgentAppService from "../../services/AgentApp/AgentAppService";
import Validate from "../../helpers/Validate";
import { AgentAppContext } from "../Contexts/UserContext";
const ThankyouPage = (props) => {

    const { tpaTokenId } = useContext(AgentAppContext);
    const maForAgentAppService = AgentAppService(tpaTokenId);
    const validate = Validate();
    const [orderDetails, setOrderDetails] = useState({});
    const [subscriptionDetails, setSubscriptionDetails] = useState({});
    const [paymentDetails, setPaymentDetails] = useState({});
    const [cartSummary, setCartSummary] = useState({});
    const [comboPlan, setComboPlan] = useState({});
    const [isPaymentDone, setIsPaymentDone] = useState(false);
    const {orderIdsList} = props.location.state;
    useEffect(() => {
        getSubscriptionOrder();
    }, []);

    const getSubscriptionOrder = () => {
        maForAgentAppService.getSubscriptionOrder({ orderIdsList }).then(response => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.responseData)) {
                let orderDetails = {};
                let subscriptionDetails = {};
                Object.keys(response.responseData).map((eachSubId) => {
                    if (validate.isNotEmpty(response.responseData[eachSubId].orderDetails)) {
                        orderDetails[eachSubId] = response.responseData[eachSubId].orderDetails;
                    }
                    if (validate.isNotEmpty(response.responseData[eachSubId].subscriptionDetails)) {
                        subscriptionDetails[eachSubId] = response.responseData[eachSubId].subscriptionDetails;
                    }
                })
                setOrderDetails(orderDetails);
                setSubscriptionDetails(subscriptionDetails);
                if (validate.isNotEmpty(response.responseData.paymentDetails)) {
                    setPaymentDetails(response.responseData.paymentDetails);
                }
                if (validate.isNotEmpty(response.responseData.cartSummary)) {
                    setCartSummary(response.responseData.cartSummary);
                }
                if (validate.isNotEmpty(response.responseData.comboPlan)) {
                    setComboPlan(response.responseData.comboPlan);
                }
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const checkPaymentStatus = () => {
        maForAgentAppService.checkPaymentStatus({ 'orderId' : orderIdsList[0] }).then(response => {
            if(validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.message) && response.message === "SUCCESS") {
                setIsPaymentDone(true);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const getSubscriptionNames = () => {
        let subscriptionNames = "";
        Object.keys(subscriptionDetails).map((eachSubId, index) => {
            subscriptionNames += validate.isNotEmpty(subscriptionDetails[eachSubId].plan) && validate.isNotEmpty(subscriptionDetails[eachSubId].plan.name) ? subscriptionDetails[eachSubId].plan.name : "NA";
            if (index != Object.keys(subscriptionDetails).length - 1) {
                subscriptionNames += " + "
            }
        });
        return subscriptionNames;
    }

    const getSubscriptionCodes = () => {
        let subscriptionCodes = "";
        Object.keys(subscriptionDetails).map((eachSubId, index) => {
            subscriptionCodes += validate.isNotEmpty(subscriptionDetails[eachSubId].subscriptionCode) ? subscriptionDetails[eachSubId].subscriptionCode : "NA";
            if (index != Object.keys(subscriptionDetails).length - 1) {
                subscriptionCodes += " + "
            }
        });
        return subscriptionCodes;
    }

    return <>
        {validate.isNotEmpty(orderDetails) && validate.isNotEmpty(subscriptionDetails) &&
            <React.Fragment>
                {((validate.isNotEmpty(Object.values(orderDetails)) && Object.values(orderDetails)[0].order.status === "PAYMENT_DONE") || isPaymentDone) ?
                    <div>
                        <p>Thank You..! <br />
                            You have been subscribed to  </p>
                    </div> :
                    <div>
                        <p>Awaiting Payment</p><button onClick={checkPaymentStatus}>Check status</button>
                        {validate.isNotEmpty(subscriptionDetails) && Object.keys(subscriptionDetails).length > 0 && <>
                            <p>Your Subscription  will be confirmed once payment is successful</p>
                        </>}
                    </div>
                }
                {comboPlan && comboPlan.name && <h4> {comboPlan.name}</h4>}
                <p>{getSubscriptionNames()}</p>
                <p>Subscription Code</p>
                <h5>{getSubscriptionCodes()}</h5>
                <hr />
                {cartSummary.totalMembers && <p>No. of Members {cartSummary.totalMembers}</p>}
                {validate.isNotEmpty(cartSummary.plans) && cartSummary.plans.length > 1 ?

                    <div><p>Base Plan Charges (Primary Member)</p>
                        {cartSummary.plans.map(eachPlan => {
                            { <p>{eachPlan.displayName}</p> }
                            { <p>{eachPlan.amount}</p> }
                        })

                        }
                    </div> :
                    <div>
                        {cartSummary.primaryFee && cartSummary.primaryFee > 0 &&
                            <div>
                                <p>Base Plan Charges (Primary Member)</p>
                                {parseFloat(cartSummary.primaryFee).toFixed(2)}
                            </div>
                        }

                    </div>
                }
                {paymentDetails && paymentDetails.paymentMode && <p>Payment Type: {paymentDetails.paymentMode} </p>}
                {cartSummary && cartSummary.totalMrp && <p>Total Amount: {parseFloat(cartSummary.totalMrp).toFixed(2)} </p>}
                {cartSummary && cartSummary.totalDisc && <p>Base Plan Discount: {parseFloat(cartSummary.totalDisc).toFixed(2)} </p>}
                {cartSummary && cartSummary.totalPrice && <p>Amount Paid :{parseFloat(cartSummary.totalPrice).toFixed(2)} </p>}
                {cartSummary && cartSummary.totalSavings && <p>Total Savings: {parseFloat(cartSummary.totalSavings).toFixed(2)}</p>}
            </React.Fragment>
        }


    </>

}

export default ThankyouPage;