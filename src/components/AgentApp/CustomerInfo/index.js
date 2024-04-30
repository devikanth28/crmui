import { useContext, useEffect, useState } from "react";
import AgentAppService from "../../../services/AgentApp/AgentAppService";
import CustomerCard from "../CustomerCard"
import Validate from "../../../helpers/Validate";
import { BodyComponent, Wrapper } from '../../Common/CommonStructure'
import NoDataFound from "../Customer/NoDataFound";
import { AGENT_UI } from "../../../services/ServiceConstants";
import { AgentAppContext } from "../../Contexts/UserContext";
import SubscriptionCard from "../SubscriptionDetails/SubscriptionCard";

export default (props)=>{
    const validate = Validate();
    const [customerInfo, setCustomerInfo] = useState({});
    const { tpaTokenId } = useContext(AgentAppContext);
    const agentAppService = AgentAppService(tpaTokenId);
    const [subscriptions,setSubscriptions] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [upcomingSubscriptionsList,setUpcomingSubscriptionsList] = useState([]);
    const [isBuyPlan, setIsBuyPlan] = useState(false);
    const [isImageRequired, setIsImageRequired] = useState(false);

    useEffect(()=>{
        getCustomerInfo();
        getSubscriptions();
    },[])

    const getCustomerInfo = () => {
        agentAppService.getCustomerInfo().then((res) => {
            if(res?.statusCode === "SUCCESS" && validate.isNotEmpty(res?.responseData)) {
                setCustomerInfo(res.responseData);
            }
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setIsLoading(false);
        })
    }

    const redirectToPlanList=()=>{
        props.history.push(`${AGENT_UI}/planList`);
    }

    const isUpcomingSubscription = (subscription) => {
        const subscriptionStartDate = new Date(subscription.startDate);
        const todayDate = new Date();
        return subscriptionStartDate.getTime() - todayDate.getTime() > 0;
    }

    const checkIfCustomerEligibleToBuyPlan = (subscriptions) => {
        let benefitTypes = {};
        subscriptions.map((eachSubscription) => {
            benefitTypes[eachSubscription.benefitType]=true;
        });
        if(Object.keys(benefitTypes).length==2) {
            setIsBuyPlan(false);
        }else{
            setIsBuyPlan(true);
        }
    }

    const getSubscriptions = () => {
        setIsLoading(true);
        agentAppService.getSubscriptions().then((response) => {
            if(response?.responseData) {
                setIsLoading(false);
                let subscriptions = response.responseData;
                let subscriptionsList = [];
                let upcomingSubscriptionsList = [];
                let currentSubscriptionsList = [];
                if( subscriptions.length > 1 ) {
                    subscriptions.map((eachSubscription) => {
                        if (isUpcomingSubscription(eachSubscription)) {
                            upcomingSubscriptionsList.push(eachSubscription);
                        } else {
                            currentSubscriptionsList.push(eachSubscription);
                        }
                    });
                    subscriptionsList = [...currentSubscriptionsList, ...upcomingSubscriptionsList];
                } else {
                    subscriptionsList = [...subscriptions];
                }
                checkIfCustomerEligibleToBuyPlan(subscriptionsList);
                setUpcomingSubscriptionsList(upcomingSubscriptionsList);
                setSubscriptions(subscriptionsList);
            }else{
                setIsImageRequired(true);
                setIsBuyPlan(true);
            }
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        });
    }

    const redirectToSubscriptionDetailsPage = (subscriptionId) => {
        props.history.push(`${AGENT_UI}/subscriptionDetails/`+subscriptionId);
    }

    return <div>
        <Wrapper>
            <BodyComponent loading={isLoading} className={"body-height"}>
                <CustomerCard customer={customerInfo}/>

                {validate.isNotEmpty(subscriptions) && subscriptions.map(eachSubscription => {
                    return(
                        <div className="mb-3">
                        <SubscriptionCard subscriptionInfo={{ planName: eachSubscription.plan.name, status: eachSubscription.status, subscriptionCode: eachSubscription.subscriptionCode, exipryDate: eachSubscription.endDate, startDate : eachSubscription.startDate }} handleRedirect={() => redirectToSubscriptionDetailsPage(eachSubscription.id)}  view = {upcomingSubscriptionsList.find(upcomingSubscription => {return upcomingSubscription.id == eachSubscription.id}) ? "UPCOMING" : "CURRENT"} />
                        </div>
                    ) 
                })}
                {!isLoading && isBuyPlan && <NoDataFound callBack={()=>{redirectToPlanList()}} message={"No Active MedPlus Advantage Plan Found"} buttonName={"Buy New Plan"} isImageRequired = {isImageRequired}/>}

            </BodyComponent>
        </Wrapper>
    </div>
}