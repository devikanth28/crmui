import { useContext, useEffect, useState } from "react";
import Validate from "../../helpers/Validate";
import AgentAppService from "../../services/AgentApp/AgentAppService";
import { AgentAppContext } from "../Contexts/UserContext";
import MemberInfo from "./MemberInfo";
import PlanInfo from "./PlanInfo";
import { AGENT_UI } from "../../services/ServiceConstants";
import { Wrapper } from "../Common/CommonStructure";
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";

const OrderReview = (props) => {

    const { tpaTokenId } = useContext(AgentAppContext);

    const [cartSummary, setCartSummary] = useState({});
    const [planInfo, setPlanInfo] = useState({});
    const [edcInfo, setEDCInfo] = useState(undefined);
    const [isThirdPartyAgent, setIsThirdPartyAgent] = useState(undefined);
    const [isReviewLoading, setIsReviewLoading] = useState(true);
    const [members,setMembers] = useState(undefined);

    const agentAppService = AgentAppService(tpaTokenId);
    const validate = Validate();

    useEffect(() => {
        getCartSummary();
    }, []);

    const getCartSummary = () => {
        agentAppService.getCartSummary().then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.responseData)) {
                if(validate.isNotEmpty(response.responseData.cartSummary)) {
                    setCartSummary(response.responseData.cartSummary);
                }
                if(validate.isNotEmpty(response.responseData.planInfo)) {
                    setPlanInfo(response.responseData.planInfo);
                }
                setEDCInfo(response.responseData.edcDevices);
                setIsThirdPartyAgent(response.responseData.isThirdPartyAgent);
                setIsReviewLoading(false);
                setMembers(response.responseData.memberInfo);
            }
        }).catch(error => {
            console.log(error);
            setIsReviewLoading(false);
        });
    }

    if (isReviewLoading) {
        return (<Wrapper>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" />
            </div>
        </Wrapper>);
    }

    const redirectToPaymentPage = () => {
        let paymentInfo = {
            isThirdPartyAgent : isThirdPartyAgent,
            edcInfo : edcInfo,
            totalPrice : cartSummary.totalPrice
        }
        props.history.push({pathname:`${AGENT_UI}/maPayment`,state:{paymentInfo}});
   }

    return <>
        <p>
            Order Review
        </p>
        <PlanInfo planDetails={planInfo}/>
        <hr></hr>
        {validate.isNotEmpty(members) && <MemberInfo members = {members}/>}
        <hr></hr>
        {validate.isNotEmpty(cartSummary) &&
            <div>
                <p>Total Members :  {cartSummary.totalMembers} </p>
                {validate.isNotEmpty(cartSummary.plans) && cartSummary.plans.length > 1 ?
                    <p> Base Plan Charges (Primary Member) :
                        {cartSummary.plans.map(eachPlan => {
                            return (
                                <div>
                                    <p>  {eachPlan.displayName} </p>
                                    <p> {eachPlan.amount}</p>
                                </div>
                            )
                            
                        })
                        }
                    </p>
                    : <p>
                        {validate.isNotEmpty(cartSummary.primaryFee) && parseFloat(cartSummary.primaryFee) > 0 &&
                            <p> Base Plan Charges (Primary Member): {parseFloat(cartSummary.primaryFee).toFixed(2)}</p>
                        }
                    </p>
                }
                {validate.isNotEmpty(cartSummary.addOnFees) && 
                    <div>Additional Member Charges: 
                    {cartSummary.addOnFees.map(eachAddOnFee => {
                        return (
                            <div>
                                <p>Age Group {eachAddOnFee.displayName} ({eachAddOnFee.noOfMembers})
                                    ₹ {parseFloat(eachAddOnFee.totalAddOnfee).toFixed(2)}</p>
                            </div>
                        )
                    })}
                    </div>
                }

                {validate.isNotEmpty(cartSummary.totalMrp) && cartSummary.totalMrp > 0 && <p>Total Amount :  {parseFloat(cartSummary.totalMrp).toFixed(2)} </p>}
                {validate.isNotEmpty(cartSummary.totalDisc) && cartSummary.totalDisc > 0 && <p>Base Plan Discount :  {parseFloat(cartSummary.totalDisc).toFixed(2)} </p>}
                {validate.isNotEmpty(cartSummary.totalPrice) && cartSummary.totalPrice >0 && <p>Total Amount to be Paid :  {parseFloat(cartSummary.totalPrice).toFixed(2)} </p>}
                {validate.isNotEmpty(cartSummary.totalSavings) && cartSummary.totalSavings>0 && <p>Total Savings :  {parseFloat(cartSummary.totalSavings).toFixed(2)} </p>}
                <button onClick={redirectToPaymentPage}>Proceed</button>
            </div>
        }

        
   </>
}

export default OrderReview;