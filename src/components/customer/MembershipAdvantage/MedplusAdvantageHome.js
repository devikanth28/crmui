import DynamicForm, { CustomSpinners, TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Roles } from "../../../constants/RoleConstants";
import Validate from "../../../helpers/Validate";
import useRole from "../../../hooks/useRole";
import MembershipService from "../../../services/Membership/MembershipService";
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../../Common/CommonStructure";
import { AlertContext, CustomerContext, LocalityContext, UserContext } from "../../Contexts/UserContext";
import PlanDetails from "./PlanDetails";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import SubscriptionDetails from "./SubscriptionDetails";
import CustomerService from "../../../services/Customer/CustomerService";
import { Button } from 'react-bootstrap';
import { CustomerConstants } from "../Constants/CustomerConstants";
import OrgReqModal from "./OrgReqModal";
import { API_URL } from "../../../services/ServiceConstants";
import NoDataFound from "../../Common/NoDataFound";
import { ProcessType } from "./MembershipHelper";
import CurrencyFormatter from "../../Common/CurrencyFormatter";
import SendPlanDetailsToCustomerBtn from "../../Common/SendPlanDetailsToCustomerBtn";
import SelectPlansForm from "./SelectPlansForm";

const MedplusAdvantageHome = ({ helpers, ...props}) => {
    const headerRef = useRef();
    const footerRef = useRef();
    const subHeaderRef = useRef();
    const validate = Validate();

    const membershipService = MembershipService();
    const [isFrontDeskUser] = useRole([Roles.ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH]);
    const { martLocality } = useContext(LocalityContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const { customerId, subscription, setSubscription } = useContext(CustomerContext);
    const [selectedPlanType, setSelectedPlanType] = useState(CustomerConstants.subscriptionType.INDIVIDUAL);
    const [plans, setPlans] = useState([]);
    const [content, setContent] = useState();
    const [planTab, setPlanTab] = useState('1');
    const [planInfo, setPlanInfo] = useState({});
    const [feeDataGrid, setFeeDataGrid] = useState({});
    const [rulesDataGrid, setRulesDataGrid] = useState({});
    const [showPlanInfo, setShowPlanInfo] = useState(false);
    const [isEligibleTopurchasePlan, setIsEligibleToPurchasePlan] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [subscriptionDetails, setSubscriptionDetails] = useState();
    const [pageName, setPageName] = useState(props.location?.state?.isFromPlansPage ? CustomerConstants.pageType.BUY_PLAN : "");
    const [activePlanType, setActivePlanType] = useState()
    const [activePlanIdTab, setActivePlanIdTab] = useState(null);
    const [isUpgradeProcess, setIsUpgradeProcess] = useState(false);
    const [selectedOrg,setSelectedOrg] = useState({});
    const [openOrgReqModal, setOrgReqModal] = useState(false);
    const [noPlansFound, setNoPlansFound] = useState(false);
    const [isMartLocalityServiceable,setMartLocalityServiceable] = useState(true);
    const [mobileflag,setMobileflag] = useState(false);
    const userSessionInfo = useContext(UserContext);
    const [showOrgRegisterForm, setShowOrgRegisterForm] = useState(false);

    useEffect(() => {
        if (validate.isNotEmpty(martLocality) && pageName == CustomerConstants.pageType.BUY_PLAN) {
            if(validate.isNotEmpty(selectedPlanType)){
                if(selectedPlanType == CustomerConstants.subscriptionType.INDIVIDUAL || selectedPlanType == CustomerConstants.subscriptionType.INDIVIDUAL_COMBO)
                getPlans(selectedPlanType);
                else{
                    getPlansRelatedToOrg(selectedOrg.orgId);
                }
            }
            //setSelectedPlanType("INDIVIDUAL")
        }
    }, [martLocality, pageName]);

    useEffect(() => {
        (userSessionInfo?.vertical && userSessionInfo.vertical == "V") &&
        setMobileflag(true)
      }, [])


    useEffect(() => {
        getMembershipSubscriptionMasterData();
        getSubscriptions();
    }, []);

    useEffect(() => {
        if(validate.isNotEmpty(planInfo))
            getRegionsAndCollectionCenters(validate.isNotEmpty(planInfo.benefitType)? planInfo.benefitType[0]:'');
    },[planInfo]);

    const resetPage = () => {
        setSubscriptionDetails();
        setSubscription();
        setSelectedPlanType(CustomerConstants.subscriptionType.INDIVIDUAL);
        setPlans([]);
        setNoPlansFound(false);
        setContent();
        setPlanTab("1");
        setPlanInfo({});
        setFeeDataGrid({});
        setRulesDataGrid({});
        setShowPlanInfo(false);
        setIsEligibleToPurchasePlan(false);
        setOrganizations([]);
        setSubscriptionDetails();
        setPageName(CustomerConstants.pageType.SUBSCRIPTION_DETAIL);
        setActivePlanType();
        setActivePlanIdTab(null);
        setIsUpgradeProcess(false);
        
        getMembershipSubscriptionMasterData();
        getSubscriptions();
    }

    const getRegionsAndCollectionCenters = async (benefitType) => {
        MembershipService().getRegionsAndCollectionCenters({benefitType: benefitType}).then(response => {
            if(validate.isNotEmpty(response) && response.statusCode == 'SUCCESS' && validate.isNotEmpty(response.dataObject)){
                setSubscription({...subscription,regions:response.dataObject.regions,collectionCenters:response.dataObject.collectionCenters})
            }
        }).catch((err) => {
            console.log(err);
        })
    }



    const getSubscriptions = async () => {
        await CustomerService().getSubscriptions({ "customerId": customerId, requestFrom: "SubscriptionDetails" }).then(data => {
            if (data.message == "SUCCESS") {
                setSubscriptionDetails(data.dataObject);
                if(!props.location?.state?.isFromPlansPage){
                    if (data.dataObject.subscriptions.length != 0) {
                        setPageName(CustomerConstants.pageType.SUBSCRIPTION_DETAIL);
                    } else {
                        setPageName(CustomerConstants.pageType.BUY_PLAN);
                    }
                }
            }
        })
    }

    const getPlanType = (type) => {
        return CustomerConstants.subscriptionType[type];
        /* switch (type) {
            case CustomerConstants.subscriptionType.INDIVIDUAL: return "INDIVIDUAL";
            case CustomerConstants.subscriptionType.INDIVIDUAL_COMBO: return "INDIVIDUAL_COMBO";
            case CustomerConstants.subscriptionType.ORGANIZATION: return "ORGANIZATION";
            case CustomerConstants.subscriptionType.ORGANIZATION_COMBO: return "ORGANIZATION_COMBO";
            default: return "";
        } */
    }

    const getPlans = (planType) => {
        let planSearchCriteria = {};
        planSearchCriteria["planType"] = planType;
        setMartLocalityServiceable(validate.isNotEmpty(martLocality.membershipConfig))
        if (validate.isEmpty(martLocality) || validate.isEmpty(martLocality.membershipConfig)) {
            //({ toastMessage: "Medplus Advantage is not configured in your martLocality", position: TOAST_POSITION.BOTTOM_START })
            setPlans([]);
            setNoPlansFound(true);
            return;
        }
        if (isFrontDeskUser) {
            planSearchCriteria["planIds"] = martLocality.membershipConfig.configuredPlanIds;
            if (isUpgradeProcess && validate.isNotEmpty(activePlanIdTab)) {
                if (planSearchCriteria["planIds"].includes(activePlanIdTab))
                    planSearchCriteria["planIds"] = [activePlanIdTab];
                else
                    setStackedToastContent({ toastMessage: "Plan to be Upgraded is not in this location.", position: TOAST_POSITION.BOTTOM_START })
            }
        }
        else
            planSearchCriteria["planIds"] = martLocality.membershipConfig.onlineServingPlanIds;
        if (isUpgradeProcess && validate.isNotEmpty(activePlanIdTab)) {
            if (planSearchCriteria["planIds"].includes(activePlanIdTab))
                planSearchCriteria["planIds"] = [activePlanIdTab];
            else
                setStackedToastContent({ toastMessage: "Plan to be Upgraded is not in this location.", position: TOAST_POSITION.BOTTOM_START })
        }
        let thirdPartyAgentPlanIds = (validate.isNotEmpty(martLocality) && validate.isNotEmpty(martLocality.membershipConfig) && validate.isNotEmpty(martLocality.membershipConfig.thirdPartyAgentPlanIds)) ? martLocality.membershipConfig.thirdPartyAgentPlanIds : [];
        planSearchCriteria.planIds = null?.filter(planId => !thirdPartyAgentPlanIds.includes(planId))
        membershipService.getPlans(planSearchCriteria).then(res => {
            if (validate.isNotEmpty(res.dataObject) && "SUCCESS" == res.statusCode) {
                if (!activePlanIdTab) {
                    setPlans(validate.isNotEmpty(res.dataObject.planDetails) ? res.dataObject.planDetails : []);
                    setNoPlansFound(validate.isEmpty(res.dataObject.planDetails));
                } else {
                    let plans = res.dataObject.planDetails;
                    let activePlanIdObj = plans.find(each => each.id == activePlanIdTab);
                    if (activePlanIdObj) {
                        const activePlanIdObjIndex = plans.indexOf(activePlanIdObj);
                        plans.splice(activePlanIdObjIndex, 1);
                        plans.unshift(activePlanIdObj);
                    }
                    setPlans(validate.isNotEmpty(plans) ? plans : []);
                    setNoPlansFound(validate.isEmpty(plans));
                }
                setPlanTab('1');
                displayPlanDetails(res.dataObject.planDetails[0].id);
            }
            else {
                setStackedToastContent({ toastMessage: res.dataObject.responseMessage, position: TOAST_POSITION.BOTTOM_START })
            }
        }).catch(err => {
            console.log("Error occured while fetching plans", err);
        });
    }

    const getMembershipSubscriptionMasterData = () => {
        membershipService.getMembershipSubscriptionMasterData().then(res => {
            if (validate.isNotEmpty(res) && "SUCCESS" == res.statusCode) {
                if (validate.isNotEmpty(res.dataObject)) {
                    setSubscription({ loyaltyTypes: validate.isNotEmpty(res.dataObject.loyaltyTypes) ? res.dataObject.loyaltyTypes : {}, kycTypes: validate.isNotEmpty(res.dataObject.kycTypes) ? res.dataObject.kycTypes : {}, relations: validate.isNotEmpty(res.dataObject.relations) ? res.dataObject.relations : {} })
                }
            }
        }).catch(err => {
            console.log("Error : ", err);
        })
    }

    const displayPlanDetails = (planId) => {
        if (validate.isNotEmpty(planId)) {
            const config = { "planId": planId, "customerId": customerId }
            membershipService.getPlanDetails(config).then(res => {
                if (validate.isNotEmpty(res) && validate.isNotEmpty(res.plan)) {
                    setPlanInfo(res.plan);
                    setShowPlanInfo(true);
                    setFeeDataGrid(res.feesDataGrid);
                    setRulesDataGrid(res.rulesDataGrid);
                    setIsEligibleToPurchasePlan(res.isEligibleToPurchasePlan);
                }
            }).catch(err => {
                console.log("Error occurred while fetching planInfo", err);
            })
        }
    }

    const getPlansRelatedToOrg = orgId => {
        if (orgId == "none") {
            setPlans([]);
            setContent(undefined);
            displayPlanDetails(null);
            return
        }
        setSelectedOrg(organizations.find(org=> org.orgId == orgId));
        setPlanTab("1");
        if (validate.isNotEmpty(orgId)) {
            const config = { "orgId": orgId, planType: "ORGANIZATION" == getPlanType(selectedPlanType) ? "O" : "OC" }
            membershipService.getPlansRelatedToOrg(config).then(res => {
                if (validate.isNotEmpty(res) && validate.isNotEmpty(res.responseMessage) && "SUCCESS" == res.responseMessage) {
                    if(validate.isNotEmpty(res.plans)){
                        setPlans(validate.isNotEmpty(res.plans) && res.plans.length > 0 ? res.plans : []);
                        setContent(validate.isNotEmpty(res.content) ? res.content : undefined);
                        displayPlanDetails(res.plans[0].id);
                        setNoPlansFound(false);
                    }
                    else{
                        setNoPlansFound(true);
                    }
                } else {
                    setStackedToastContent({ toastMessage: "Unable to get organisation plans", position: TOAST_POSITION.BOTTOM_START })
                    setPlans([]);
                    setContent(undefined);
                    displayPlanDetails(null);
                }
            }).catch(err => {
                console.log("Error : ", err);
            })
        }
    }
    
    const displayPlanTabs = () => {
        return (
            <React.Fragment>
                <HeaderComponent ref={subHeaderRef}>
                <div className="tabs-nowrap custom-tabs-forms mb-1 row mx-0 py-0 mobile-compatible-tabs">
                    <Nav tabs>
                        {
                            plans.map((plan, index) => {
                                return <NavItem>
                                    {
                                        <NavLink className={`${index + 1 == planTab ? "active" : ""}`} onClick={() => { setPlanTab(index + 1); displayPlanDetails(plan.id) }} >
                                            {plan.displayName}
                                        </NavLink>
                                    }
                                </NavItem>
                            })
                        }
                    </Nav>
                </div>
                </HeaderComponent>
                <BodyComponent  className="body-height pt-0" allRefs={{ "headerRef": subHeaderRef,"footerRef": footerRef }}>
                    <TabContent activeTab={planTab}   > 
                        {
                            plans.map((plan, index) => {
                                return <TabPane tabId={planTab} className="">
                                    <React.Fragment>{index + 1 == planTab &&
                                            <div className={``}>
                                                {validate.isNotEmpty(martLocality) && showPlanInfo && <PlanDetails {...props} isUpgradeProcess={isUpgradeProcess} planInfo={planInfo} feeDataGrid={feeDataGrid} rulesDataGrid={rulesDataGrid} buyPlan={isUpgradeProcess || isEligibleTopurchasePlan} {...props} sendPlanDetailButton={true} from={"allowToSubscribe"} selectedOrg={selectedOrg} isEligibleToPurchasePlan={isEligibleTopurchasePlan} />}
                                            </div>
                                        }
                                    </React.Fragment>
                                </TabPane>
                            })
                        }
                    </TabContent>


                </BodyComponent>
                                {validate.isNotEmpty(planInfo.associatedPlans) && <FooterComponent ref={footerRef} className="border-top justify-content-between align-items-center d-flex">
                                <div className="p-12"><label className="pb-0 font-weight-bold">{planInfo.name}</label> - <span className="text-success"><CurrencyFormatter data={planInfo.price} decimalPlaces={2} /></span> </div>
                                {<SendPlanDetailsToCustomerBtn className={`${!mobileflag ? "" : "p-0    "} btn-link font-14`} buttonText={`${!mobileflag ? "Send Plan Details to Customer" : ""}`} planId={planInfo.id} />}
                            </FooterComponent>}
            </React.Fragment>)
    }       

    return (
        <>
            {pageName == CustomerConstants.pageType.SUBSCRIPTION_DETAIL && subscriptionDetails && <SubscriptionDetails resetPage={resetPage} setIsUpgradeProcess={setIsUpgradeProcess} setActivePlanType={setActivePlanType} setActivePlanIdTab={setActivePlanIdTab} setPageName={setPageName} subscriptionDetails={subscriptionDetails} {...props} />}
            <>
                {pageName == CustomerConstants.pageType.BUY_PLAN &&
                    <Wrapper className="position-relative">
                        <HeaderComponent ref={headerRef} className="border-bottom  d-flex justify-content-between align-items-center px-3 py-2">
                            <div className="d-flex align-items-center">
                                <p className="mb-0 pe-3">{mobileflag && !isEligibleTopurchasePlan && validate.isNotEmpty(plans) && <p className="mb-0"><span className="badge-approved px-2 py-1 rounded-5 font-10 mb-0">Subscribed</span></p>}MedPlus Advantage Subscription</p>
                                {!mobileflag && !isEligibleTopurchasePlan && validate.isNotEmpty(plans) && <span className="badge-approved px-2 py-1 rounded-5 ">Subscribed</span>}
                            </div>
                            {validate.isNotEmpty(subscriptionDetails) && subscriptionDetails.subscriptions && subscriptionDetails.subscriptions.length > 0 && <Button variant=" " className='btn-link font-14' onClick={() => setPageName(CustomerConstants.pageType.SUBSCRIPTION_DETAIL)}>{!mobileflag ? "My Subscriptions" : <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <g id="subscription-membership-icn-32" transform="translate(4713 -20425)">
                                    <rect id="Rectangle_12075" data-name="Rectangle 12075" width="24" height="24" rx="4" transform="translate(-4713 20425)" fill="none" />
                                    <g id="subscription-membership-icn" transform="translate(-4710.6 20426.438)">
                                        <path id="Path_52363" data-name="Path 52363" d="M38.883,30.475l-.551,1.833,1.357-1.017h0a1.14,1.14,0,0,1,1.366,0l1.355,1.016-.551-1.831h0a1.132,1.132,0,0,1,.381-1.215l1.111-.89H42.157a1.134,1.134,0,0,1-1.044-.689L40.37,25.95l-.743,1.735a1.136,1.136,0,0,1-1.044.689H37.391l1.113.891h0a1.131,1.131,0,0,1,.379,1.212Z" transform="translate(-30.77 -21.048)" fill="#11b094" />
                                        <path id="Path_52364" data-name="Path 52364" d="M11.1,26.377H26.852a1.726,1.726,0,0,0,1.723-1.723V6.93a1.726,1.726,0,0,0-1.723-1.723H11.1A1.726,1.726,0,0,0,9.375,6.93V24.653A1.726,1.726,0,0,0,11.1,26.377ZM26.113,21.7a.738.738,0,0,1-.738.738H15.529a.738.738,0,0,1,0-1.477h9.846a.738.738,0,0,1,.738.738ZM13.951,11.814a1.124,1.124,0,0,1,1.072-.759h1.94l.968-2.26h0a1.136,1.136,0,0,1,2.088,0l.968,2.261h1.94a1.136,1.136,0,0,1,.711,2.022l-1.694,1.355.782,2.6a1.136,1.136,0,0,1-1.77,1.236l-1.982-1.486-1.981,1.485a1.136,1.136,0,0,1-1.77-1.234l.782-2.6-1.693-1.354a1.126,1.126,0,0,1-.362-1.264Zm-.883,9.147a.738.738,0,1,1-.738.738.738.738,0,0,1,.738-.738Z" transform="translate(-9.375 -5.207)" fill="#11b094" />
                                    </g>
                                </g>
                            </svg></span>}</Button>}
                            {mobileflag && <span class="tooltiptext" onAnimationEnd={(e) => e.target.remove()}>My Subscriptions</span>}
                        </HeaderComponent>
                        <div className="body-height"  style={{ height: `calc(100% - ${headerRef?.current?.offsetHeight+63}px)` }}>
                        <SelectPlansForm setPlans={setPlans} showOrgRegisterForm={showOrgRegisterForm} openOrgReqModal={openOrgReqModal} setPlanInfo={setPlanInfo} setShowPlanInfo={setShowPlanInfo} setContent={setContent} setOrganizations={setOrganizations} setSelectedOrg={setSelectedOrg} setSelectedPlanType={setSelectedPlanType} getPlans={getPlans} setShowOrgRegisterForm={setShowOrgRegisterForm} getPlansRelatedToOrg={getPlansRelatedToOrg} setOrgReqModal={setOrgReqModal} setNoPlansFound={setNoPlansFound}/>
                                {(noPlansFound || (!isMartLocalityServiceable && validate.isEmpty(organizations) )) && <div className="body-height">
                                    <NoDataFound text={!isMartLocalityServiceable ? "Medplus Advantage is not configured in your martLocality" : noPlansFound ? "No Plans found" : ""} />
                                </div>}

                                {validate.isNotEmpty(martLocality) && validate.isNotEmpty(plans) && <div className=' border rounded-1' style={{ height: `calc(100% - ${(subHeaderRef?.current?.offsetHeight ||0)+12}px)` }}>
                                    <div className="h-100">
                                    {displayPlanTabs()}

                                    </div>
                                </div>}
                                

                            </div>
                    </Wrapper>}</>
                    {validate.isEmpty(pageName) && <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column max-height-center"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText='Please be patient while we prepare your data for loading!' />}
        </>
    )
}

export default withFormHoc(MedplusAdvantageHome);