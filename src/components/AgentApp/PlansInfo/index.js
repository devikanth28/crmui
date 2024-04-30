import { useContext, useEffect, useRef, useState } from 'react';
import { TabContent, TabPane } from "reactstrap";
import Validate from '../../../helpers/Validate';
import AgentAppService from '../../../services/AgentApp/AgentAppService';
import { AGENT_UI } from '../../../services/ServiceConstants';
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../../Common/CommonStructure';
import { AgentAppContext, AlertContext } from '../../Contexts/UserContext';
import NoDataFound from '../Customer/NoDataFound';
import FeesAndRules from '../SubscriptionDetails/FeesAndRules';
import NavTabs from '../common/NavTabs';
import PlanContent from './PlanContent';
import OrderHelper from '../../../helpers/OrderHelper';
import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';

const MedplusAdvantageSubscription = (props) => {
    const headerRef = useRef();
    const tabHeaderRef = useRef();
    const footerRef = useRef();
    const [tabId, setTabId] = useState('1');
    const [tabList,setTabList] = useState([]);
    const [planDetail,setPlanDetails] = useState(undefined);
    const { tpaTokenId } = useContext(AgentAppContext);
    const agentAppService = AgentAppService(tpaTokenId);
    const validate = Validate();
    const [renewalAllowed,setRenewalAllowed] = useState(false);
    const [isComboPlan,setIsComboPlan] = useState(false);
    const [loading,setLoading] = useState(false);
    const [planDetailsNotFound, setPlanDetailsNotFound] = useState(false);
    const {planId} = props.match.params;
    const [isEligibleToPurchase,setIsEligibleToPurchase] = useState(false);
    const { setToastContent  } = useContext(AlertContext);
    const [backDropLoader, setBackDropLoader] = useState(false)
    useEffect(() => {
        getPlanDetails();
    }, [])

    const getPlanDetails = () => {
        setLoading(true);
        agentAppService.getPlanDetails({planId:planId}).then(response => {
            if (validate.isNotEmpty(response) && "SUCCESS" == response?.statusCode) {
                setLoading(false);
                if (validate.isNotEmpty(response.responseData) && validate.isNotEmpty(response.responseData.plan)) {
                    let plan = response.responseData.plan;
                    setPlanDetails(plan);
                    setIsEligibleToPurchase(response.responseData?.isEligibleToPurchasePlan);
                    setRenewalAllowed(response.responseData?.renewalAllowed);
                    if(validate.isNotEmpty(plan.associatedPlanIds) && validate.isNotEmpty(plan.associatedPlans)){
                        setTabList(Object.values(plan.associatedPlans).map((eachPlan)=>{
                            return eachPlan?.name;
                        }))
                        setIsComboPlan(true);
                    }else{
                        setIsComboPlan(false);
                        setTabList([plan?.name]);
                    }
                }else{
                    setPlanDetailsNotFound(true);
                }
            }

        }).catch(error => {
            console.log(error);
            setLoading(false);
        })
    }

    const sendPlanToCustomer = () =>{
        if(validate.isEmpty(planId)){
            setToastContent({toastMessage:"empty planId"});
            return;
        }
        setBackDropLoader(true)
        agentAppService.sendPlanToCustomer({planId:planId}).then(response=>{
            if (validate.isNotEmpty(response) && "SUCCESS" == response?.statusCode) {
                setToastContent({toastMessage:"plan details sent to customer...!"});
            }else{
                setToastContent({toastMessage:"failed to send plan details...!"});
            }
            setBackDropLoader(false)
        }).catch(error=>{
            setBackDropLoader(false)
            setToastContent({toastMessage:"unabled to send plan details...!"});
            console.log(error);
        })
    }

    const redirectToAddMembers=()=>{
        props.history.push(`${AGENT_UI}/subscriptionMembers/${planId}`);
    }

    const getRulesData=(eachPlan)=>{
        let rulesData = [];
        eachPlan?.rules?.map(eachRule=>{
            if(validate.isNotEmpty(eachRule) && eachRule?.status=="ACTIVE"){
                rulesData.push({"members": eachRule?.name,"value": eachRule?.value})
            }
        })
        return rulesData;
    }

    const getFeesDataSet=(eachPlan)=>{
        let feesData = [];
        eachPlan?.fees?.map(eachFee=>{
            if(validate.isNotEmpty(eachFee) && validate.isNotEmpty(eachFee.ageRule) && validate.isNotEmpty(eachFee.ageRule.attributes)){
                feesData.push(getMinMaxAgeString(eachFee));
            }else{
                feesData.push({"name": eachFee['type']?.name,
                "ageRule": "-",
                "mrp": `₹${eachFee['mrp']}`,
                "price": `₹${eachFee['price']}`})
            }
        })
        return feesData;
    }
    const getMinMaxAgeString=(eachFee)=>{
        let ageRule = '-';
        if(validate.isNotEmpty(eachFee.ageRule.name) && eachFee.ageRule?.status=="ACTIVE"){
            ageRule = eachFee['ageRule'].name
        }
        return {
            "name": eachFee['type']?.name,
            "ageRule": ageRule,
            "mrp": `₹${eachFee['mrp']}`,
            "price": `₹${eachFee['price']}`
        }
    }

    const redirectToPlansList=()=>{
        props.history.push(`${AGENT_UI}/plansList`);
    }

    const getPlanDetailsHtml = (eachPlan) => {
        return (<div>
            <PlanContent planInfo={eachPlan} {...props} />
            <div class="col my-3">
                <label for="onlineVisibility" className='font-12 text-secondary'>Description</label>
                <p class="mb-0 text-wrap font-14">{eachPlan?.shortDesc}</p>
            </div>
            <FeesAndRules fees={getFeesDataSet(eachPlan)} rules={getRulesData(eachPlan)} isOpen/>
        </div>);
    }

    const handleTabId = (tabId) => {
        let numToString = tabId.toString();
        setTabId(numToString)
    }
    return (
        <div>
            {(validate.isNotEmpty(planDetail) || loading) && 
            <Wrapper>
                {!loading && <HeaderComponent ref={headerRef} className="border-bottom p-12">
                    {!isEligibleToPurchase && <div>
                        <p className={`${OrderHelper().getBadgeColorClassForStatus("already subscribed")} badge rounded-pill mb-2`}>{OrderHelper().getStatusWithFirstLetterCapitalized("already Subscribed")}</p>
                    </div>}
                    {planDetail?.name}
                    {validate.isNotEmpty(planDetail?.associatedPlanIds) && <div>
                        <p class="mb-0 font-14 mt-2">MRP<del className="mx-2 text-secondary">{planDetail?.amount}.00</del>{'₹' + planDetail?.price}</p>
                    </div>
                    }
                </HeaderComponent>}
                <BodyComponent allRefs={{ "headerRef": headerRef,"footerRef": footerRef }} className="body-height" loading={loading}>
                    {!planDetailsNotFound && validate.isNotEmpty(planDetail) && !isComboPlan && getPlanDetailsHtml(planDetail)}
                    {!planDetailsNotFound && validate.isNotEmpty(planDetail) && isComboPlan &&
                        <div className={`custom-tabs-forms d-flex pb-0 card mobile-compatible-tabs h-100`}>
                            <HeaderComponent ref={tabHeaderRef}>
                                <NavTabs tabs={tabList} onTabChange={handleTabId}/>
                            </HeaderComponent>
                            <BodyComponent allRefs={{ "headerRef": tabHeaderRef }} loading={loading} className="subscription body-height">
                                <TabContent activeTab={tabId}>
                                    <TabPane tabId={'1'} >
                                        {isComboPlan && getPlanDetailsHtml(planDetail.associatedPlans['PHARMACY'])}
                                    </TabPane>
                                    <TabPane tabId={'2'}>
                                        {isComboPlan && getPlanDetailsHtml(planDetail.associatedPlans['HEALTH_CARE'])}
                                    </TabPane>
                                </TabContent>
                            </BodyComponent>
                        </div>}
                </BodyComponent>
                <FooterComponent ref={footerRef} className="p-12 border-top d-flex justify-content-end justify-content-lg-end">
                    <button role="button" aria-label='send plan details to customer' type="button" class="px-2 brand-secondary btn px-lg-4 me-2" disabled={backDropLoader} onClick={() => { sendPlanToCustomer() }}>{backDropLoader ? <CustomSpinners spinnerText={"Send Plan Details"} className={" spinner-position"} innerClass={"invisible"} />: "Send Plan Details"}</button>
                    {isEligibleToPurchase && <button role="button" aria-label="Buy Pharmacy" type="button" class="px-2 btn-brand btn px-lg-4 " onClick={() => { redirectToAddMembers() }}>{renewalAllowed?'Renew Plan':'Buy Plan'}</button>}
                </FooterComponent>
            </Wrapper>}
            {validate.isEmpty(planDetail) && planDetailsNotFound && <NoDataFound callBack={redirectToPlansList} message={"Plan details Not found"} buttonName={"Go To Plans"} isImageRequired />}
        </div>
    )
}

export default MedplusAdvantageSubscription