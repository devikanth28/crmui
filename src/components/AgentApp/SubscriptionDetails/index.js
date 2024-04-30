import { useContext, useEffect, useRef, useState } from "react";
import Validate from "../../../helpers/Validate";
import AgentAppService from "../../../services/AgentApp/AgentAppService";
import SubscriptionInfo from "../../AgentApp/SubscriptionDetails/SubscriptionInfo";
import { BodyComponent, FooterComponent, Wrapper } from "../../Common/CommonStructure";
import SubscriptionMemberDetailComponent from "../MemberRegistration/SubscriptionMemberDetailComponent";
import { AGENT_UI } from "../../../services/ServiceConstants";
import { SubscriptionBenefitType } from "../../../constants/AgentAppConstants";
import { checkIfCurrentDateIsBetweenGivenDates } from "../../../helpers/AgentAppHelper";
import DynamicGridHeight from "../../Common/DynamicGridHeight";
import CommonDataGrid, { RetryPayment } from "@medplus/react-common-components/DataGrid";
import DataGridHelper from "../../../helpers/DataGridHelper";
import OrderHelper from "../../../helpers/OrderHelper";
import CurrencyFormatter from "../../Common/CurrencyFormatter";
import { AlertContext } from "../../Contexts/UserContext";

const SubscriptionDetails = (props) => {

    const [selectedSubscription, setSelectedSubscription] = useState(undefined);
    const [members, setMembers] = useState(undefined);
    const footerRef = useRef();
    const subscriptionId = props?.match?.params?.subscriptionId;
    const agentAppService = AgentAppService();
    const validate = Validate();
    const ref = useRef(null);
    const {setToastContent} = useContext(AlertContext);
    const [paymentList,setPaymentList] = useState([]);

    const orderPaymentDetails=DataGridHelper().getOrderPaymentDetailsDataGridObj();

    useEffect(() => {
        getSubscriptions();
        getPaymentDetails();
    }, []);

    if(validate.isEmpty(subscriptionId)){
        props.history.replace(`${AGENT_UI}/customerInfo`);
    }

    const getSubscriptions = () => {
        agentAppService.getSubscriptions().then((response) => {
            if (validate.isNotEmpty(response) && validate.isNotEmpty(response.responseData)) {
                response.responseData.map(eachSubscription => {
                    if (subscriptionId == eachSubscription.id) {
                        setSelectedSubscription(eachSubscription);
                        setMembers(eachSubscription.members);
                    }
                })

            }
        }).catch(error => {
            console.log(error);
        });
    }

    const getPaymentDetails = () => {
        agentAppService.getPaymentDetails({subscriptionId:subscriptionId}).then((response) => {
            if (validate.isNotEmpty(response) && validate.isNotEmpty(response.responseData)) {
                setPaymentList(response.responseData);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const getOrderStatusBadge=(props)=>{
        return <p className={`${OrderHelper().getBadgeColorClassForStatus(props?.row?.orderStatus)} badge rounded-pill mb-2`}>{OrderHelper().getStatusWithFirstLetterCapitalized(props?.row?.orderStatus)}</p>
    }

    const getPaymentStatusBadge=(props)=>{
        return <p className={`${OrderHelper().getBadgeColorClassForStatus(props?.row?.paymentStatus)} badge rounded-pill mb-2`}>{OrderHelper().getStatusWithFirstLetterCapitalized(props?.row?.paymentStatus)}</p>
    }

    const getAmountFormat=(props)=>{
        return <CurrencyFormatter data={props?.row?.amount} />
    }

    const handleRetryPayment=(txnRefId)=>{
        if(validate.isEmpty(txnRefId)){
            setToastContent({toastMessage:"Coudn't find txRefId try again"});
            return;
        }
        props?.history?.push(`${AGENT_UI}/retryPayment/${txnRefId}`);
    }

    const getActions=(props)=>{
        return props?.row?.isRetryPayment?<RetryPayment handleOnClick={() => handleRetryPayment(props?.row?.txnRefId)}/>:<>-</>
    }

    const orderSummaryCallBackMap = {
        "orderStatus" : getOrderStatusBadge,
        "paymentStatus" : getPaymentStatusBadge,
        "amount" : getAmountFormat,
        "action" : getActions
    }

    const checkIfAllMembersAreActive=(members)=>{
        let isActive = true;
        members.every(member=>{
            if(validate.isEmpty(member.subscriptionStatus) || member.subscriptionStatus !== "ACTIVE"){
                isActive= false;
                return isActive;
            }
            return isActive;
        })
        return isActive;
    }

    if(validate.isEmpty(subscriptionId)){
        props.history.goBack();
    }

    return <>
    <Wrapper>
    <BodyComponent className={"body-height"} allRefs={{footerRef}}>
        {validate.isNotEmpty(selectedSubscription) && <SubscriptionInfo subscriptionInfo={selectedSubscription} />}
        {validate.isNotEmpty(members) && members.map((eachMember, index) => {
            return <div className={`${members.length !== index ? "mb-3" :""}`}>
            <SubscriptionMemberDetailComponent member={eachMember} restrictEdit restrictDelete ref={ref} {...props}/>
            </div>
        })
        }
        {validate.isNotEmpty(paymentList) && <div>
                <label class="d-block pb-2 pt-3 custom-fieldset">{`Order & Payment Details (${subscriptionId})`}</label>
                <div className='card mb-3 me-0'>
                    <DynamicGridHeight id="order-payment" metaData={orderPaymentDetails} dataSet={[...paymentList]} className="block-size-100">
                        <CommonDataGrid {...orderPaymentDetails} dataSet={[...paymentList]} callBackMap={orderSummaryCallBackMap} />
                    </DynamicGridHeight>
                </div>
            </div>}
    </BodyComponent>
    <FooterComponent ref={footerRef} className="p-12 border-top d-flex justify-content-end justify-content-lg-end">
    {validate.isNotEmpty(selectedSubscription) && validate.isNotEmpty(members) && (selectedSubscription.benefitType == SubscriptionBenefitType.HEALTHCARE) && (( selectedSubscription.status === "ACTIVE" && checkIfAllMembersAreActive(selectedSubscription.members) && ( (selectedSubscription.members.length < selectedSubscription.plan.totalMaxAllowed)) && checkIfCurrentDateIsBetweenGivenDates(selectedSubscription.startDate,selectedSubscription.endDate))) &&  <button role="button" aria-label="Proceed To Verification" type="button" class="px-2 btn-brand btn px-lg-4 me-2" onClick={() => {props.history.push(`${AGENT_UI}/addmembers/${selectedSubscription.id}`)}}>Add Members</button>}
    {validate.isNotEmpty(selectedSubscription?.renewalAllowed) && selectedSubscription.renewalAllowed  && <button role="button" aria-label="Proceed To Verification" type="button" class="px-2 btn-brand btn px-lg-4 " onClick={() => {props.history.push(`${AGENT_UI}/planList`)}}>Renew Plan</button>}
    </FooterComponent>
    </Wrapper>
    </>
}

export default SubscriptionDetails;