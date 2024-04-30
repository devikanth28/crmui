import React, { memo, useEffect, useState } from "react";
import MembershipService from "../../services/Membership/MembershipService";
import Validate from "../../helpers/Validate";

const ThankyouPage = (props) => {

    const validate = Validate();
    const [paymentDetails, setPaymentDetails] = useState({});
    const [cartSummary, setCartSummary] = useState({});
    const [comboPlan, setComboPlan] = useState({});

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        createSubscriptionOrder();
    }, []);

  //  const request = {"memberShipOrderRequest":[{"customerId":81672034,"planId":125,"members":[{"patientId":2591418,"customerId":81672033,"patientName":"Raghu Raghu","age":23,"gender":"M","mobile":"8106256578","email":"abc@gmail.com","status":"ACTIVE","dateOfBirth":949429800000,"dob":949429800000,"relationship":{"relationshipType":"SELF","name":"Self","createdBy":"giri","dateCreated":1635405799000},"subscribedMember":false,"stateSubName":"TG","addedDate":1704888934400,"price":100}],"collectionStoreId":"INAPHYD95005","storeId":"INTGHYD00771"}],"paymentType":"ONLINE"}
    const createSubscriptionOrder =  () => {
       MembershipService().createSubscriptionOrder({ data: request }).then(response => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.dataObject)) {
                if (validate.isNotEmpty(response.dataObject.memberOrderResponse.cartSummary)) {
                    setCartSummary(response.dataObject.memberOrderResponse.cartSummary);
                }
                setOrders(response.dataObject.memberOrderResponse.orders);
            }
       }).catch(error => {
            console.log(error);
       })
    }



    return <>
        {validate.isNotEmpty(response) &&
            <React.Fragment>
                {((validate.isNotEmpty(Object.values(orders)) && Object.values(orders)[0].order.status === "ORDER_INITIATED") ) ?
                    <div>
                        <p>Subscription order created successfully</p>
                        {response.dataObject.memberOrderResponse.cartSummary.plans[0].name}
                            <p>Subscription Code</p>
                            <div>
                                {console.log(orders)}
                                {orders[0].subscriptionCode}
                            </div>

                    </div> :
                    <div>
                    </div>
                }
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
                {cartSummary && cartSummary.totalMrp && <p>Total Amount: {parseFloat(cartSummary.totalMrp).toFixed(2)} </p>}
                {cartSummary && cartSummary.totalDisc && <p>Base Plan Discount: {parseFloat(cartSummary.totalDisc).toFixed(2)} </p>}
                {cartSummary && cartSummary.totalPrice && <p>Amount Paid :{parseFloat(cartSummary.totalPrice).toFixed(2)} </p>}
                {cartSummary && cartSummary.totalSavings && <p>Total Savings: {parseFloat(cartSummary.totalSavings).toFixed(2)}</p>}
            </React.Fragment>
        }


    </>

}

export default ThankyouPage;