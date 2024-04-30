import { useContext, useEffect, useRef, useState } from "react";
import Validate from "../../../helpers/Validate";
import AgentAppService from "../../../services/AgentApp/AgentAppService";
import { AGENT_UI } from "../../../services/ServiceConstants";
import { BodyComponent, FooterComponent, Wrapper } from "../../Common/CommonStructure";
import { AgentAppContext } from "../../Contexts/UserContext";
import { CartSummary } from "../OrderReview/CartSummary";

export default (props) => {

	const {tpaTokenId} = useContext(AgentAppContext);
	const agentAppService = AgentAppService(tpaTokenId);
    const [subscriptionOrderResponse,setSubscriptionOrderResponse] = useState(undefined);
    const [cartSummary,setCartSummary] = useState(undefined);
	const validate = Validate();
	const footerRef = useRef();

	useEffect(() => {
        getSubscriptionOrder();
    }, []);

	const getSubscriptionOrder = () => {
        agentAppService.getThankYouResponse().then(response => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.responseData)) {
                setSubscriptionOrderResponse(response.responseData)
                if (validate.isNotEmpty(response.responseData.cartSummary)) {
                    setCartSummary(response.responseData.cartSummary);
                }
            }else{
				props.history.replace(`${AGENT_UI}/searchCustomer`)
			}
        }).catch(error => {
            console.log(error);
        })
    }

    const redirectToSubscriptionDetails=()=>{
        props.history.replace(`${AGENT_UI}/customerInfo`)
    }

    const handleClick=()=>{
        props.history.replace(`${AGENT_UI}/searchCustomer`)
    }

    return (
		<Wrapper>
			<BodyComponent className="body-height" allRefs={{footerRef}}>
				<p className="mb-2">Subscription Order Created Succesfully</p>
				{validate.isNotEmpty(subscriptionOrderResponse) && <>
					<h5 className="mb-3">{subscriptionOrderResponse?.planName}</h5>

				<div className="pb-1 border-bottom col-lg-4">
					<p className="mb-2" style={{ color: "#6C757D" }}>
						Subscription Code
					</p>
					<h5 style={{ color: "#11B094" }}>{subscriptionOrderResponse?.code}</h5>
				</div>
				<div className="mt-2">
					{validate.isNotEmpty(cartSummary) && <CartSummary title={true} cartSummary={cartSummary} amountPaid/>}
				</div>
				{/* <div className="p-12 p-12 d-flex justify-content-center justify-content-lg-start">
					<button className="btn brand-secondary px-lg-4 me-2" onClick={handleClick}>
						Sell More
					</button>
					<button className="btn btn-dark px-lg-4" onClick={redirectToSubscriptionDetails}>
						View Subscription
					</button>
				</div> */}
				</>}
			</BodyComponent>
			<FooterComponent ref={footerRef} className="p-12 border-top d-flex justify-content-end justify-content-lg-end">
			<button className="btn brand-secondary px-lg-4 me-2" onClick={handleClick}>
						Sell More
					</button>
					<button className="btn btn-dark px-lg-4" onClick={redirectToSubscriptionDetails}>
						View Subscription
					</button>
			</FooterComponent>
		</Wrapper>
	);
}
