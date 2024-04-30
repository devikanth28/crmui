import { useContext, useEffect, useState } from "react";
import AgentAppService from "../../../services/AgentApp/AgentAppService";
import Validate from "../../../helpers/Validate";
import EachPlanCard from "../EachPlanCard";
import { BodyComponent, Wrapper } from '../../Common/CommonStructure'
import NoDataFound from "../Customer/NoDataFound";
import { AgentAppContext } from "../../Contexts/UserContext";
import { AGENT_UI } from "../../../services/ServiceConstants";

export default (props)=>{
    const validate = Validate();
    const [plans, setPlans] = useState(undefined);
    const [NoPlansFound, setNoPlansFound] = useState(undefined);
    const { tpaTokenId } = useContext(AgentAppContext);
    const agentAppService = AgentAppService(tpaTokenId);
    const [isPlansloading,setIsPlansloading] = useState(false);
    useEffect(()=>{
        getPlansList();
    },[])
    const getPlansList = () => {
        setIsPlansloading(true);
        agentAppService.getPlansList().then(data => {
          if (validate.isNotEmpty(data) && validate.isNotEmpty(data.responseData) && "SUCCESS" == data.statusCode) {
            setNoPlansFound(false);
            setPlans(Object.values(data.responseData));
          }else{
            setNoPlansFound(true);
          }
          setIsPlansloading(false);
        }).catch(error => {
          setNoPlansFound(false)
          setIsPlansloading(false);
          console.log("Error while fetching home page plans", error);
        })
      }

      const redirectToPlanDetails =(planId)=>{
        props.history.push(`${AGENT_UI}/plansInfo/${planId}`);
    }

    return <div>
        <Wrapper>
            <BodyComponent loading={isPlansloading} className={"body-height"}>
                {NoPlansFound && <NoDataFound message={"No Plans found"} {...props} isImageRequired/>}
                {validate.isNotEmpty(plans) && plans.map(eachPlan => {
                    return <EachPlanCard plan={eachPlan} handleRedirect={(planId)=>{redirectToPlanDetails(planId)}}/>
                })}
            </BodyComponent>
        </Wrapper>
    </div>
}