import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import PlanFeeAndRules from "./PlanFeesAndRules";
import { toCamelCase } from "../../../helpers/CommonHelper";
import { AlertContext, CustomerContext, LocalityContext, UserContext } from "../../Contexts/UserContext";
import Validate from "../../../helpers/Validate";
import { Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import CurrencyFormatter from "../../Common/CurrencyFormatter";
import SendPlanDetailsToCustomerBtn from "../../Common/SendPlanDetailsToCustomerBtn";
import { Button } from 'react-bootstrap';
import OrgVerificationForm from "./orderReview/OrgVerificationForm";
import { ProcessType } from "./MembershipHelper";
import { CustomerConstants, MEDPLUS_ADVANTAGE, SubscriptionPlanBenefitType } from "../Constants/CustomerConstants";
import { getCustomerRedirectionURL } from "../CustomerHelper";
import useRole from "../../../hooks/useRole";
import { Roles } from "../../../constants/RoleConstants";
import MembershipService from "../../../services/Membership/MembershipService";
const PlanDetails = ({...props}) => {
    const validate = Validate();
    const [isFrontDeskUser] = useRole([Roles.ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH]);
    const { martLocality } = useContext(LocalityContext);
    const planInfo = validate.isNotEmpty(props.planInfo.associatedPlans) ? Object.values(props.planInfo.associatedPlans) : [props.planInfo]
    const { customerId, subscription, setSubscription } = useContext(CustomerContext);
    const loyaltyTypes = subscription.loyaltyTypes;
    const [comboPlanTab, setComboPlanTab] = useState('1');
    const [emailVerified,setEmailVerified] = useState(false);
    const { setStackedToastContent } = useContext(AlertContext);
    const [subscribedMsg,setSubscribedMsg] = useState('');
    const [ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH] = useRole([Roles.ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH]);
    const [ROLE_CRM_LAB_SUBSCRIPTION_PLAN_ADD] = useRole([Roles.ROLE_CRM_LAB_SUBSCRIPTION_PLAN_ADD]);
    const subscriptionDetails = props.subscriptionDetails;
    const [mobileflag,setMobileflag] = useState(false);
    const userSessionInfo = useContext(UserContext);
    
    useEffect(()=> {
        if(!props.isUpgradeProcess)
            setSubscribedMsg(!props.fromSubscriptionDetail && !props.isEligibleToPurchasePlan ? `You have already Subscribed to Medplus Advantage ${"HEALTH_CARE" == props.planInfo.benefitType ? 'HealthCare' : 'Pharmacy'} Plan` : '' )
    	setComboPlanTab("1");
    },[props.planInfo || props.selectedOrg])

    useLayoutEffect(() => {
        (userSessionInfo?.vertical && userSessionInfo.vertical == "V") &&
        setMobileflag(true)
      }, [])

    const buyPlan = () => {
        let userCollectionCenter = subscription.collectionCenters;
        if(ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH && validate.isEmpty(userCollectionCenter)){
            setStackedToastContent({toastMessage: 'Medplus operations are not available in given state.'});
            return;
        }
        setSubscription({ ...subscription,benefitType:props.planInfo.benefitType, plan: {id:props.planInfo.id,name:props.planInfo.name,type:props.planInfo.type},processType: props.isUpgradeProcess? ProcessType.UPGRADE_SUBSCRIPTION: ProcessType.NEW_SUBSCRIPTION, totalMaxAllowed: props.planInfo.totalMaxAllowed });
        props.history.push({pathname:getCustomerRedirectionURL(customerId, MEDPLUS_ADVANTAGE+"/addMembersToPlan"), state:{isFromPlansPage: true}})
    }

    /* const sendPlanDetailsToCustomer = () => {
        MembershipService().sendPlanDetails({ params: { "customerId": customerId, "planId": props.planInfo.id } }).then(res => {
            if (Validate().isNotEmpty(res) && "SUCCESS" == res.message && "SUCCESS" == res.statusCode) {
                setStackedToastContent({ toastMessage: "Plan Details Sent to Customer Mobile" });
            }
            else if (Validate().isNotEmpty(res) && "FAILURE" == res.statusCode && Validate().isNotEmpty(res.message)) {
                setStackedToastContent({ toastMessage: res.message });
            }
        }).catch(err => {
            console.log("Error occured while ending plan Details", err);
        })
    }; */

    const getUpgradeCartSummary = async () => {
        if (subscription?.processType != ProcessType.UPGRADE_SUBSCRIPTION) {
            return
        }
            let requestBody = {
                "subscriptionId": subscription.id.toString(),
                "polygonPlanIds": isFrontDeskUser? martLocality?.membershipConfig.configuredPlanIds : martLocality.membershipConfig.onlineServingPlanIds
            }
            MembershipService().getUpgradeSubscriptionCartSummary(requestBody).then((response) => {
                    if (validate.isNotEmpty(response) && validate.isNotEmpty(response.statusCode) && response.statusCode == 'SUCCESS' && validate.isNotEmpty(response.dataObject)) {
                        setSubscription({ ...subscription,benefitType:props.planInfo.benefitType,plan: {id:props.planInfo.id,name:props.planInfo.name,type:props.planInfo.type}, cartSummary: response.dataObject.cartSummary });
                        props.history.push(getCustomerRedirectionURL(customerId, 'medplusAdvantage/maOrderReview'));
                    }
                    else {
                        setStackedToastContent({ toastMessage: response.message ? response.message : "Unable to process request" })
                    }
            }).catch(err => {
                console.log(err);
                setStackedToastContent({ toastMessage: "Unable to process request" })
            })
        
    }


    const getLoyalityType = str => {
        const loyalityType = str.split("_").map(each => {
            return toCamelCase(each);
        }).join(' ');
        return loyalityType;
    }

    const handleEmailResponse = () => {
        setEmailVerified(true);
    }

    const allowToBuyPlan = () => {
        if (ROLE_CRM_LAB_SUBSCRIPTION_PLAN_ADD || ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH) {
            if (props.isEligibleToPurchasePlan || props.isUpgradeProcess) {
                return true;
            }
            else {
                return false;
            }
        } else {
            return false;
        }
    }

    return (
        <React.Fragment>
            {!props.subscriptionsAvailable && validate.isNotEmpty(planInfo) && Object.values(planInfo).length == 2 && 
                <div className="tabs-nowrap custom-tabs-forms row pb-0">
                    <Nav tabs className="sub-tabs">
                        {
                              Object.values(planInfo).map((plan, index) => {
                                return <NavItem>
                                    {
                                        <NavLink className={`${index + 1 == comboPlanTab ? "active" : ""}`} onClick={() => { setComboPlanTab(index + 1) }} >
                                            {SubscriptionPlanBenefitType[plan.benefitType]}
                                        </NavLink>
                                    }
                                </NavItem>
                            })
                        }
                    </Nav>
                </div>
            }
            <TabContent activeTab={comboPlanTab} style={{ "height": "calc(100% - 33px)" }}>
                {
                    Object.values(planInfo).map((plan, index) => {
                        return <TabPane tabId={comboPlanTab} className="h-100">
                            <React.Fragment>{index + 1 == comboPlanTab &&
                                <div className="mb-3">
                                    <div className={`h-100`}>
                                        {validate.isNotEmpty(plan) && <div>
                                           <div className="align-items-center d-flex justify-content-between position-relative"> <label class="d-block pb-0 custom-fieldset">Plan Information</label><div className="btn-link px-2 rounded">
                                                {mobileflag && !validate.isNotEmpty(props.currentComboPlanInfo) && !validate.isNotEmpty(props.planInfo.associatedPlans) &&  <span class="tooltiptext"  onAnimationEnd={(e) => e.target.remove()}>Send Plan Details to Customer</span>}
                                            {!validate.isNotEmpty(props.currentComboPlanInfo) && !validate.isNotEmpty(props.planInfo.associatedPlans) && <div>
                                                {<SendPlanDetailsToCustomerBtn className={`${!mobileflag ? "" : "p-0    "} btn-link font-14`} buttonText={`${!mobileflag ? "Send Plan Details to Customer" : ""}`} planId={plan.id} />}

                                            </div>}
                                                </div></div>
                                            <div class="d-flex flex-wrap planInfo gap-lg-2 row gy-2">
                                                <div class="col-12 col-lg-2 planItem">
                                                    <label className="font-12 text-secondary">Display Name</label>
                                                    <p className="font-14 mb-0">{plan.displayName}</p>
                                                </div>
                                                {validate.isNotEmpty(loyaltyTypes) && <div class="col-6 col-lg-2 planItem">
                                                    <label className="font-12 text-secondary">Loyality Type</label>
                                                    <p className="font-14 mb-0">{getLoyalityType(loyaltyTypes[plan.loyalityCode])}</p>
                                                </div>}
                                                {validate.isNotEmpty(plan.type) && validate.isNotEmpty(plan.type.name) && <div class="col-6 col-lg-2 planItem">
                                                    <label className="font-12 text-secondary">Plan Type</label>
                                                    <p className="font-14 mb-0">{plan.type.name} ({SubscriptionPlanBenefitType[plan.benefitType]})</p>
                                                </div>}
                                                {validate.isNotEmpty(subscriptionDetails) && validate.isNotEmpty(subscriptionDetails.corporateEmail) && <div class="col-6 col-lg-2 planItem">
                                                    <label className="font-12 text-secondary">Corporate Email</label>
                                                    <p className="font-14 mb-0">{subscriptionDetails.corporateEmail}</p>
                                                </div>}
                                                <div class="col-6 col-lg-2 planItem">
                                                    <label className="font-12 text-secondary">Price</label>
                                                    <p className="font-14 mb-0"><CurrencyFormatter data={plan.price} decimalPlaces={2} /></p>
                                                </div>
                                                <div class="col-6 col-lg-2 planItem">
                                                    <label className="font-12 text-secondary">Tenure</label>
                                                    <p className="font-14 mb-0">{plan.tenureDays} Days</p>
                                                </div>
                                                <div class="col-6 col-lg-2 planItem">
                                                    <label className="font-12 text-secondary">Renewal</label>
                                                    <p className="font-14 mb-0">{plan.renewalDays} Days</p>
                                                </div>
                                                {validate.isNotEmpty(plan.renewalDaysPostExpiry) && plan.renewalDaysPostExpiry > 0 && <div class="col-6 col-lg-2 planItem">
                                                    <label className="font-12 text-secondary">Renewal Post Expiry</label>
                                                    <p className="font-14 mb-0">{plan.renewalDaysPostExpiry} Days</p>
                                                </div>}

                                                {validate.isNotEmpty(plan.coolingPeriod) && <div class="col-6 col-lg-2 planItem">
                                                    <label className="font-12 text-secondary">Cooling Period</label>
                                                    <p className="font-14 mb-0">{toCamelCase(plan.coolingPeriod)}</p>
                                                </div>}
                                                {validate.isNotEmpty(plan.onlineVisibility) && <div class="col-6 col-lg-2 planItem">
                                                    <label className="font-12 text-secondary">Online Visibility</label>
                                                    <p className="font-14 mb-0">{toCamelCase(plan.onlineVisibility)}</p>
                                                </div>}
                                            </div>
                                            <div className="d-flex flex-wrap mt-3 align-items-center justify-content-between">
                                                <div className="col">
                                                    <label className="font-12 text-secondary">Description</label>
                                                    <p className="font-14 mb-0">{plan.shortDesc}</p>
                                                </div>
                                                
                                            </div>
                                            <PlanFeeAndRules plan={plan} feesDataset={plan.fees} rulesDataset={plan.rules} feesDataGrid={props.feeDataGrid} rulesDataGrid={props.rulesDataGrid} />
                                            {(((props.buyPlan && allowToBuyPlan() && (CustomerConstants.subscriptionType.ORGANIZATION != props.planInfo.type.type && CustomerConstants.subscriptionType.ORGANIZATION_COMBO != props.planInfo.type.type) && validate.isEmpty(subscribedMsg))) || (emailVerified)) && 
                                            <div className="border-top bottom-0 d-flex justify-content-center justify-content-lg-end p-12 position-absolute start-0 w-100">
                                                {/*{props.sendPlanDetailButton && <SendPlanDetailsToCustomerBtn buttonText="Send Plan Details to Customer" planId={plan.id} />}*/}
                                                {/* {(props.buyPlan || validate.isNotEmpty(plan.upgradePlanId)) ? <Button variant="danger" className="px-3" onClick={() => { buyPlan() }}></Button> : ("allowToSubscribe" == props.from && validate.isNotEmpty(plan.upgradePlanId) )? <p>{`You have already Subscribed to Medplus Advantage ${'HEALTH_CARE' == plan.benefitType ? 'HealthCare' : 'Pharmacy'} Plan` }</p>  : <></>} */}
                                                {/* {!props.isUpgradeProcess && validate.isNotEmpty(subscribedMsg) && <>{subscribedMsg}</>} */}
                                                {(props.buyPlan && allowToBuyPlan() && (CustomerConstants.subscriptionType.ORGANIZATION != props.planInfo.type.type && CustomerConstants.subscriptionType.ORGANIZATION_COMBO != props.planInfo.type.type) && validate.isEmpty(subscribedMsg)) && <Button variant=" " className="px-3 btn-brand" onClick={() => {!props.isUpgradeProcess ? buyPlan() : getUpgradeCartSummary() }}> {props.isUpgradeProcess ? "Upgrade Plan" : "Buy Plan"}</Button> }
                                                {(emailVerified) && <Button variant=" " className="px-3 btn-brand" onClick={() => { buyPlan() }}>Add Members To Plan</Button>}


                                            </div>
                    }

                                        </div>}
                                    </div>
                                </div>}
                            </React.Fragment>
                        </TabPane>
                    })
                }
            </TabContent>
           {validate.isNotEmpty(props.selectedOrg) && allowToBuyPlan() && (CustomerConstants.subscriptionType.ORGANIZATION == props.planInfo.type.type || CustomerConstants.subscriptionType.ORGANIZATION_COMBO == props.planInfo.type.type) && <OrgVerificationForm organization = {props.selectedOrg} customerId = {props.customerId} {...props} onSuccess = {handleEmailResponse}/>}
        </React.Fragment>
    )
}
export default PlanDetails;