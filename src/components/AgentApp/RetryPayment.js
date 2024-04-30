import { useContext, useEffect, useState } from "react";
import AgentAppService from "../../services/AgentApp/AgentAppService";
import MAPayment from "./OrderReview/MAPayment";
import Validate from "../../helpers/Validate";
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import { AGENT_UI } from "../../services/ServiceConstants";
import { AgentAppContext } from "../Contexts/UserContext";

export default (props)=>{

    const validate = Validate();
    const txnRefId = props.match.params?.txnRefId;
    const [cartSummary,setCartSummary] = useState(undefined);
    const [isLoading,setIsLoading] = useState(false);
    const {tpaTokenId} = useContext(AgentAppContext);

    if(validate.isEmpty(txnRefId)){
        props.history.replace(`${AGENT_UI}/customerInfo`);
    }

    const agentAppService = AgentAppService(tpaTokenId);
    useEffect(()=>{
        getRetryPaymentInfo();
    },[])

    const getRetryPaymentInfo = () => {
        setIsLoading(true);
        agentAppService.getRetryPaymentInfo({ "txnRefId": txnRefId }).then(response => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.responseData)) {
                if (validate.isNotEmpty(response.responseData.cartSummary)) {
                    setCartSummary(response.responseData.cartSummary);
                }
            } else {
                props.history.replace(`${AGENT_UI}/customerInfo`)
            }
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }

    return (
        <div>
            {isLoading && <div className="d-flex justify-content-center align-items-center h-100 position-absolute w-100 z-1">
                <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText={"Please be patient while we prepare your data for loading!"} />
            </div>
            }
            {validate.isNotEmpty(cartSummary) && validate.isNotEmpty(txnRefId) && <MAPayment paymentInfo={{ "cartSummary": cartSummary }} isRetryPayment txnRefId={txnRefId} {...props}/>}
        </div>
    )
}