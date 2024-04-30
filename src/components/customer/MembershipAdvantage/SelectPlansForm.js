import DynamicForm, { TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm"
import { ProcessType } from "./MembershipHelper";
import React, { useContext } from "react";
import { AlertContext, CustomerContext } from "../../Contexts/UserContext";
import { API_URL } from "../../../services/ServiceConstants";
import MembershipService from "../../../services/Membership/MembershipService";
import Validate from "../../../helpers/Validate";
import OrgReqModal from "./OrgReqModal";

const SelectPlansForm = ({ helpers, ...props}) => {

    const validate = Validate();
    const { setStackedToastContent } = useContext(AlertContext);
    const { subscription } = useContext(CustomerContext);
    const membershipService = MembershipService();

    const handleChangePlan = (type) => {
        props.setPlans([]);
        props.setPlanInfo({});
        props.setShowPlanInfo(false);
        props.setNoPlansFound(false);
        props.setContent(undefined);
        props.setOrganizations([]);
        props.setSelectedOrg({});
        const planType = type;
        props.setSelectedPlanType(validate.isNotEmpty(planType) ? type: "INDIVIDUAL");
        if (validate.isNotEmpty(planType)) {
            if ("INDIVIDUAL" == planType || "INDIVIDUAL_COMBO" == planType) {
                props.getPlans(planType);
                props.setShowOrgRegisterForm(false);
                helpers.hideElement('organization');
                helpers.hideElement("group2");
            }
            else {
                helpers.showElement('organization');
                helpers.showElement("group2");
                helpers.updateValue('',"organization");
                props.setShowOrgRegisterForm(true);
                membershipService.getOrgsWithEmailDomain().then(res => {
                    if (validate.isNotEmpty(res && "SUCCESS" == res.responseMessage)) {
                        if (validate.isNotEmpty(res.organizations) && res.organizations.length > 0) {
                            props.setOrganizations(res.organizations);
                        }
                    }
                    else {
                        setStackedToastContent({ toastMessage: res.responseMessage, position: TOAST_POSITION.BOTTOM_START })
                    }
                }).catch(err => {
                    console.log("Error occured while fetching Organizations", err);
                })
            }
        }
    }

    const changeOrganization=(organisationValue)=>{
        props.getPlansRelatedToOrg(organisationValue);
    }

    const displayPlanTypes = ()=>{
        props.setShowOrgRegisterForm(false);
        if(subscription.processType == ProcessType.UPGRADE_SUBSCRIPTION){
            let allValues = helpers.getHtmlElementProperty('planType','values');
            let selectedValue = helpers.getHtmlElementProperty('planType','value');
            const filteredOption = allValues.find(option=> option.value==selectedValue) 
            helpers.addOptions('planType', [filteredOption], true);
        }
        else{
            helpers.updateValue('INDIVIDUAL','planType');
        }
    }

    const observersMap = {
        'getSelectPlanForm' : [['load', (e)=> displayPlanTypes()] ],
        'planType': [['change', (payload) => (handleChangePlan(payload[1].value),(e) => handleChangePlan(e))]],
        'organization' : [['select', (e)=> changeOrganization(e[0].target.value[0])]]
    }
    const handleOrgReqModal = () => {
        props.setOrgReqModal(true);
    }

    const addCompany=()=>{
        return  ( <>
            {props.showOrgRegisterForm &&  <div className="mt-2">
                <span className="font-14 text-secondary mb-0 px-3"> Didn't Find Your Company, Click <a onClick={() => { handleOrgReqModal() }} class='primary'>Here</a> To Request</span>
            </div>}
        </>
        ) 
    }

    const customHtml = {
        'group2' : [['INSERT_AFTER', addCompany]],
     }

    return (
        <React.Fragment>
            <DynamicForm requestMethod={'GET'} requestUrl={`${API_URL}getSelectPlanForm`} helpers={helpers} observers={observersMap} customHtml={customHtml}/>
            {props.openOrgReqModal && <OrgReqModal isModalOpen={true} setOrgReqModal={props.setOrgReqModal} />}
        </React.Fragment>
    )
}
export default withFormHoc(SelectPlansForm)