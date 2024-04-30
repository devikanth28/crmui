import { useContext, useEffect, useRef, useState } from "react";
import MembershipService from "../../../services/Membership/MembershipService";
import Validate from "../../../helpers/Validate";
import { TabContent, TabPane } from "reactstrap";
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../../Common/CommonStructure";
import DynamicForm, { StackedImages, TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm";
import DocumentUpload from "@medplus/react-common-components/DocumentUpload";
import NavTabs from "../../Common/NavTabs";
import { getDateInYMDFormat } from "../../../helpers/HelperMethods";
import { API_URL } from "../../../services/ServiceConstants";
import { AlertContext, CustomerContext, LocalityContext } from "../../Contexts/UserContext";
import AddNewMember from "./AddNewMember";
import OrderService from "../../../services/Order/OrderService";
import { ExistingMemberCard } from "./ExistingMemberCard";
import { getAge } from "../../../helpers/CommonHelper";
import { ProcessType, ValidatePhotoIdNumberAgaistType } from "./MembershipHelper";
import { getCustomerRedirectionURL, isValidPhotoIdFiles, setRegexForTypes } from "../CustomerHelper";
import { MEDPLUS_ADVANTAGE } from "../Constants/CustomerConstants";
import { Roles } from "../../../constants/RoleConstants";
import useRole from "../../../hooks/useRole";
import ButtonWithSpinner from "../../Common/ButtonWithSpinner";

const AddMembersToPlan = ({ helpers, ...props }) => {
    const [isFrontDeskUser] = useRole([Roles.ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH]);
    const headerRef = useRef();
    const footerRef = useRef();
    const validate = Validate();
    const { customerId,customer, subscription, setSubscription } = useContext(CustomerContext);
    const { martLocality, setIsLocalityComponentNeeded } = useContext(LocalityContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const [tabId, setTabId] = useState('1')
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [newMembers, setNewMembers] = useState([]);
    const [imageFile, setImageFile] = useState({});
    const [loading, setLoading] = useState(false);
    const [subscribedMemberIds,setSubscribedMemberIds] = useState([]);
    let kycInfo = { kycType: "", attributes: [{ attributeName: "", attributeValue: "" }] };
    const [documentTrigger, setDocumentTrigger] = useState(false);
    const [proceedToVerificationLoader, setProceedToVerificationLoader] = useState(false);
    const [showMemberCard,setShowMemberCard] = useState(false);
    const [resetAddedDocuments,setResetAddedDocuments] = useState(false);
    const [isDocumentLoading, setIsDocumentLoading] = useState(false)
    const isFromPlansPage =  props.location?.state?.isFromPlansPage;


    useEffect(()=>{
        setResetAddedDocuments(false);
    }, [isDocumentLoading])

    if (validate.isEmpty(subscription) || validate.isEmpty(subscription.plan)) {
        props.history.push(getCustomerRedirectionURL(customerId,MEDPLUS_ADVANTAGE));
    }

    const regions = subscription.regions;

    useEffect(() => {
        setIsLocalityComponentNeeded(false);
        if (validate.isNotEmpty(customerId)) {
            getMembersForCustomer();
        }
    }, [customerId]);
    
    const handleTabId = (tabId) => {
        setTabId(tabId.toString())
    }

    const tabs = [ "Existing Members", "Add New Members" ];

    const getMembersForCustomer = () => {
        setLoading(true);
        MembershipService().getMembers({ customerId: customerId, subscriptionId: validate.isNotEmpty(subscription) ? subscription.id : "", benefitType: (validate.isEmpty(subscription) || subscription.benefitType != 'PHARMACY') ? 'H' : 'P' }).then((res) => {
            if (res.statusCode == 'SUCCESS' && validate.isNotEmpty(res.dataObject)) {
                setSubscribedMemberIds(res.dataObject.suscribedMemberIds ? res.dataObject.suscribedMemberIds : []);
                if (validate.isNotEmpty(res.dataObject.members)) {
                    setMembers(res.dataObject.members.map((member,index) => {
                        if(index == 0 && validate.isNotEmpty(res.dataObject.suscribedMemberIds) && res.dataObject.suscribedMemberIds.includes(member.patientId) && validate.isNotEmpty(member.email)&& validate.isNotEmpty(member.kycs)){
                            setShowMemberCard(true);
                        }
                        return member
                    }))
                }
            } else {
                setStackedToastContent({ toastMessage: res.message });
            }
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setStackedToastContent({ toastMessage: "Unable to get Member Details" })
            setLoading(false);
        })
    }

    const prepareSelfMember = () => {
        if (ProcessType.ADDON_SUBSCRIPTION === subscription.processType) {
            onProceedToVerification();
            return;
        }
        let formData = helpers.validateAndCollectValuesForSubmit('addMembersToPlan', false, true, true);
        if (validate.isEmpty(formData) || validate.isEmpty(members[0])) {
            return;
        }
        if((validate.isNotEmpty(customer.emailId) || validate.isNotEmpty(formData.emailId)) && validate.isNotEmpty(validate.email(formData.emailId))){
            helpers.updateErrorMessage(validate.email(formData.emailId),'emailId');
            return;
        }
        if (validate.isNotEmpty(validate.name(formData.customerName, "Patient Name"))) {
            setStackedToastContent({ toastMessage: validate.name(formData.customerName, "Patient Name") })
            return;
        }
        if (validate.isEmpty(getAge(formData.yearOfBirth)) || getAge(formData.yearOfBirth) < 1) {
            setStackedToastContent({ toastMessage: "Inavlid Date of Birth for " + formData.customerName });
            return;
        }
        const maxDateOfBirth = new Date(Date.now());
        const custAge = getAge(formData.yearOfBirth);
        if (custAge < 0 || custAge > 99) {
            setStackedToastContent({toastMessage: `Date of birth should be ( ${(maxDateOfBirth.getUTCFullYear()) - 99} - ${maxDateOfBirth.getUTCFullYear()} ) Years Range` , position:TOAST_POSITION.BOTTOM_START})
            return
        }
        if (validate.isNotEmpty(formData.emailId) && validate.isNotEmpty(validate.email(formData.emailId))) {
            setStackedToastContent({ toastMessage: validate.email(formData.emailId) })
            return;
        }
        let newMember = members[0];
        newMember.patientName = formData.customerName;
        newMember.dob = formData.yearOfBirth;
        newMember.age = getAge(formData.yearOfBirth);
        newMember.email = formData.emailId;
        if (validate.isEmpty(subscription.id)) {
            let state = Object.keys(regions).filter(subCode => regions[subCode] === formData.state)
            if (validate.isNotEmpty(state)) {
                newMember.stateSubName = state[0];
            }
        }
        newMember.gender = formData.gender;
        if (validate.isNotEmpty(formData.photoIDType)) {
            if (!members[0].verifiedKycTypes?.includes(formData.photoIDType) && ValidatePhotoIdNumberAgaistType(formData.photoIDType, formData.photoIDNumber)) {
                setStackedToastContent({ toastMessage: ValidatePhotoIdNumberAgaistType(formData.photoIDType, formData.photoIDNumber) });
                return;
            }
            members[0].kycs?.map((eachKyc) => {
                if(eachKyc.kycType == formData.photoIDType) {
                    kycInfo = { ...kycInfo, kycType: formData.photoIDType, attributes: [{ attributeName: "RefNo", attributeValue: eachKyc.attributes[0].attributeValue }] };
                    newMember.kycs = [kycInfo];
                }
            });
        } else {
            newMember.kycs = [];
        }

        members[0] = newMember;
        onProceedToVerification();
    }

    const removeMember = (member) => {
        MembershipService().removeMember({ patientId: member.patientId, customerId: member.customerId }).then(response => {
            if (validate.isNotEmpty(response) && validate.isNotEmpty(response.statusCode) && response.statusCode == 'SUCCESS') {
                setStackedToastContent({ toastMessage: response.message });
                setSelectedMembers(selectedMembers.filter(eachMember => eachMember.patientId != member.patientId));
                getMembersForCustomer();
            } else {
                setStackedToastContent({ toastMessage: response.message ? response.message : "Unable to delete members, please try again" });
            }
        }).catch(err => {
            setStackedToastContent({ toastMessage: "Unable to delete members, please try again" })
            console.log(err);
        })
    }

    const onDocumentUpload = (file) => {
        if (validate.isEmpty(file)) {
            helpers.updateSingleKeyValueIntoField('required',false,'photoIDType')
            prepareSelfMember();
            setDocumentTrigger(false);
            return;
        }
        if(!isValidPhotoIdFiles(file)){
            setStackedToastContent({ toastMessage: "Please upload valid file(s)" });
            return;
        }
        OrderService().uploadFilesToImageServer(file, 'P', {}).then(response => {
            if (response.statusCode === "SUCCESS" && response.response) {
                if (validate.isNotEmpty(response.response)) {
                    kycInfo.imageFile = {};
                    
                    kycInfo.imageFile.imageServerName = response.response[0].imageServerName;
                    kycInfo.imageFile.imageInfoList = response.response;
                    setResetAddedDocuments(true);
                    helpers.updateSingleKeyValueIntoField('required',true,'photoIDType')
                }
            }
            if (response.statusCode === "FAILURE") {
                setStackedToastContent({ toastMessage: response.message });
            }
            prepareSelfMember();
            setDocumentTrigger(false);
        }).catch(error => {
            console.log(error);
            setStackedToastContent({ toastMessage: "Server Experiencing some problem" });
            setDocumentTrigger(false);
        })
    }

    const validateMemberDetails = (member) => {
        if(validate.isEmpty(member) || validate.isEmpty(member.patientName)) {
            setStackedToastContent({toastMessage: "Member name is required"});
            return false;
        }
        if(validate.isEmpty(member.dob) || validate.isEmpty(member.age)) {
            setStackedToastContent({toastMessage: "Date of Birth is required for " + member.patientName});
            return false;
        }
        if(validate.isEmpty(member.gender)) {
            setStackedToastContent({toastMessage: "Gender is required for " + member.patientName});
            return false;
        }
        if(validate.isEmpty(member.relationship)) {
            setStackedToastContent({toastMessage: "Relationship is required for " + member.patientName});
            return false;
        }
        return true;
    }

    const onProceedToVerification = () => {
        if(ProcessType.ADDON_SUBSCRIPTION === subscription.processType && (validate.isEmpty(selectedMembers) && validate.isEmpty(newMembers))){
            setStackedToastContent({ toastMessage: "Please select members to proceed" })
            return;
        }
        let totalSelectedMembers = [members[0], ...selectedMembers, ...newMembers];
        for (let member of totalSelectedMembers) {
            if(!validateMemberDetails(member)) {
                return;
            }
        }
        if(totalSelectedMembers.length > subscription?.totalMaxAllowed) {
            setStackedToastContent({ toastMessage: `A max. of ${subscription?.totalMaxAllowed} members only can be added to this plan.`})
            return;
        }
        let tempSubscription = {};
        tempSubscription.members = totalSelectedMembers;
        if (subscription.processType === ProcessType.ADDON_SUBSCRIPTION) {
            tempSubscription.members = [...selectedMembers, ...newMembers];
        }
        tempSubscription.customerId = customerId;
        tempSubscription.benefitType = subscription.benefitType;
        tempSubscription.plan = subscription.plan;
        tempSubscription.id = subscription.id;
        getCartSummary(tempSubscription);
    }

    const getCartSummary = async (newSubscription) => {
        setProceedToVerificationLoader(true);
        if (subscription.processType == ProcessType.UPGRADE_SUBSCRIPTION) {
            let requestBody = {
                "subscriptionId": subscription.id.toString(),
                "polygonPlanIds": isFrontDeskUser? martLocality?.membershipConfig.configuredPlanIds : martLocality.membershipConfig.onlineServingPlanIds
            }
            MembershipService().getUpgradeSubscriptionCartSummary(requestBody).then((response) => {
                if (validate.isNotEmpty(response) && validate.isNotEmpty(response.statusCode)) {
                    if (response.statusCode == 'SUCCESS' && validate.isNotEmpty(response.dataObject)) {
                        setSubscription({ ...subscription, members: newSubscription.members,subscriptions:response.dataObject.subscriptions, cartSummary: response.dataObject.cartSummary });
                        props.history.push(getCustomerRedirectionURL(customerId, 'medplusAdvantage/maOrderReview'));
                    }
                    if (response.statusCode == "FAILURE") {
                        setStackedToastContent({ toastMessage: response.message ? response.message : "Unable to process request" })
                    }

                }
                setProceedToVerificationLoader(false);
            }).catch(err => {
                console.log(err);
                setStackedToastContent({ toastMessage: "Unable to process request" })
                setProceedToVerificationLoader(false);
            })
        }
        else {
            MembershipService().getSubscriptionCartSummary(newSubscription).then((response) => {
                if (validate.isNotEmpty(response) && validate.isNotEmpty(response.statusCode)) {
                    if (response.statusCode == 'SUCCESS' && validate.isNotEmpty(response.dataObject)) {
                        setSubscription({ ...subscription, members: newSubscription.members, subscriptions:response.dataObject.cartSummary.subscriptions, cartSummary: response.dataObject.cartSummary.cartSummary });
                        props.history.push(getCustomerRedirectionURL(customerId, 'medplusAdvantage/maOrderReview'));
                    }
                    if (response.statusCode == "FAILURE") {
                        setStackedToastContent({ toastMessage: response.message ? response.message : "Unable to process request" })
                    }

                }
                setProceedToVerificationLoader(false);
            }).catch(err => {
                console.log(err);
                setStackedToastContent({ toastMessage: "Unable to process request" })
                setProceedToVerificationLoader(false);
            })
        }
    }

    const onFormLoad = () => {
        let photoIdTypes = [];
        if (validate.isNotEmpty(subscription) && validate.isNotEmpty(subscription.kycTypes)) {
            subscription.kycTypes.map((type) => {
                photoIdTypes.push(helpers.createOption(type.kycName, validate.isNotEmpty(members[0].verifiedKycTypes) && members[0].verifiedKycTypes.includes(type.kycType) ? type.kycName + ' (verified)' : type.kycName, type.kycType));
            });
            photoIdTypes.push(helpers.createOption('none','None',''));
        }
        helpers.hideElement("photoIDNumber");
        helpers.updateSingleKeyValueIntoField("values", photoIdTypes, "photoIDType");
        helpers.updateValue('','photoIDType',false);
        let formValues = {}
        if (validate.isNotEmpty(members[0].patientName)) {
            formValues = { ...formValues, "customerName": members[0].patientName }
        }
        if (validate.isNotEmpty(members[0].gender)) {
            formValues = { ...formValues, "gender": members[0].gender }
        }
        if (validate.isNotEmpty(members[0].dob)) {
            formValues = { ...formValues, "yearOfBirth": getDateInYMDFormat(members[0].dob) }
        }
        if (validate.isNotEmpty(martLocality) && validate.isNotEmpty(martLocality.state) && validate.isNotEmpty(regions)) {
            let state = Object.keys(regions).filter(subCode => regions[subCode] === martLocality.state)
            if (validate.isNotEmpty(state))
                formValues = { ...formValues, "state": martLocality.state }
        }
        if (validate.isNotEmpty(members[0].email)) {
            formValues = { ...formValues, "emailId": members[0].email }
        }
        if (validate.isNotEmpty(members[0].kycs)) {
            formValues = { ...formValues, "photoIDType": members[0].kycs[0].kycType }
            setRegexForTypes(helpers, members[0].kycs[0].kycType, "photoIDNumber");
        }
        if (validate.isNotEmpty(members[0].kycs) && validate.isNotEmpty(members[0].kycs[0].attributes)) {
            formValues = { ...formValues, "photoIDNumber": members[0].kycs[0].attributes[0].attributeValue }
        }
        if (validate.isNotEmpty(members[0].kycs) && validate.isNotEmpty(members[0].kycs[0]) && validate.isNotEmpty(members[0].kycs[0].imageFile)) {
            setImageFile(members[0].kycs[0].imageFile);
        }
        helpers.updateSpecificValues(formValues, "addMembersToPlan");
        if (validate.isNotEmpty(subscribedMemberIds) && subscribedMemberIds.includes(members[0].patientId)) {
            helpers.disableElement("customerName");
            if (validate.isNotEmpty(members[0].kycs)) {
                helpers.disableElement("photoIDNumber");
                helpers.disableElement("photoIDType");
            }
            helpers.disableElement("emailId");
            helpers.disableElement("yearOfBirth");
            helpers.disableElement("gender");
        }
    }
    const onPhotoIdTypeChange = (event) => {
        let photoIDType = event[0].target.value
        setResetAddedDocuments(true);
        if(validate.isEmpty(photoIDType)){
            helpers.hideElement("photoIDNumber");
            helpers.updateErrorMessage("",'photoIDType');
            setImageFile(undefined);
            return;
        }
        helpers.updateErrorMessage("",'photoIDNumber');
        if(members[0]?.verifiedKycTypes?.includes(photoIDType)){
            members[0].kycs.map((eachKyc) => {
                if(eachKyc.kycType == photoIDType) {
                    helpers.updateValue(eachKyc.attributes[0].attributeValue, "photoIDNumber",false);
                }
            });
        } else {
            helpers.updateValue("", "photoIDNumber",false);
        }
        if(validate.isEmpty(photoIDType) || members[0]?.verifiedKycTypes?.includes(photoIDType)) {
            helpers.hideElement("photoIDNumber");
        } else {
            helpers.showElement("photoIDNumber");
        }
        helpers.updateValue(photoIDType, "photoIDType");
        kycInfo = { ...kycInfo, kycType: photoIDType };
        if (validate.isNotEmpty(members[0]) && validate.isNotEmpty(members[0].kycs)) {
            let kyc = members[0].kycs.filter((type) => type.kycType == photoIDType);
            if (validate.isNotEmpty(kyc) && validate.isNotEmpty(kyc[0].attributes)) {
                helpers.updateValue(kyc[0].attributes[0].attributeValue, "photoIDNumber");
                if (validate.isNotEmpty(kyc[0].imageFile)) {
                    setImageFile(kyc[0].imageFile)
                } else {
                    setImageFile(undefined);
                }
            }
            else
                helpers.updateValue(undefined, "photoIDNumber",false);
        }
        setRegexForTypes(helpers, photoIDType, "photoIDNumber");
    }

    const onPhotoIdNumberChange = (event) => {
        let photoIDNumber = helpers.getHtmlElementValue('photoIDNumber');
        let photoIDType = helpers.getHtmlElementValue('photoIDType')
        if(validate.isNotEmpty(ValidatePhotoIdNumberAgaistType(photoIDType,photoIDNumber))){
            helpers.updateErrorMessage(ValidatePhotoIdNumberAgaistType(photoIDType,photoIDNumber),'photoIDNumber');
        } else {
            helpers.updateErrorMessage("",'photoIDNumber');
        }
    }

    const observersMap = {
        'addMembersToPlan': [['load', onFormLoad]],
        'photoIDType': [['change', onPhotoIdTypeChange]],
        'photoIDNumber': [['change',onPhotoIdNumberChange],['click',onPhotoIdNumberChange]]
    }

    let isMembersAlreadyExists = false;
    members.every((member) => {
        if (Validate().isEmpty(member.relationship) || member.relationship.relationshipType != 'SELF') {
            isMembersAlreadyExists = true;
            return false;
        }
        return true;
    })

    const onSubmit=() => {
        if(showMemberCard){
            let state = Object.keys(regions).filter(subCode => regions[subCode] === martLocality.state)
            if (validate.isNotEmpty(state)) {
                members[0].stateSubName = state[0];
            } else {
                setStackedToastContent({toastMessage:"Medplus Advantage is not configured in your martLocality"})
                return;
            }
            members[0].kycs = [];
            onProceedToVerification();
        } else {
            setDocumentTrigger(true);
        }

    }
    return (
        <Wrapper>
            <HeaderComponent ref={headerRef} className="p-12 border-bottom">
                {"Add Member(s) to " + subscription?.plan?.name}
            </HeaderComponent>

            {<BodyComponent className="body-height" allRefs={{ headerRef, footerRef }} loading={loading || validate.isEmpty(members)}>
                {!loading && validate.isNotEmpty(members) &&  <div> 
                    {!showMemberCard && <><DynamicForm requestUrl={`${API_URL}addMembersToPlan`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />
                    <div className="d-flex">
                        {<div className={(validate.isNotEmpty(members[0].kycs) && members[0]?.verifiedKycTypes?.includes(helpers.getHtmlElementValue('photoIDType'))) || (validate.isEmpty(helpers.getHtmlElementValue('photoIDType'))) ? "d-none" : "d-flex flex-column col-3"}>
                            <DocumentUpload
                                fileSelectOption={true}
                                documentScanOption={false}
                                buttonClassName={'scan-button'}
                                imageContainerClassName={'image-container'}
                                isAppendAllowed={false}
                                resetAddedDocuments={resetAddedDocuments}
                                uploadActionInParent={false}
                                getAddedDocuments={documentTrigger}
                                allowedFileFormats={".jpg,.jpeg,.png,.pdf"}
                                onSuccessResponse={(files) => { onDocumentUpload(files) }}
                                onErrorResponse={(message) => {(setDocumentTrigger(false), setStackedToastContent({ toastMessage: message })) }}
                                includeLightBox={false}
                                imageTitle={"KYC Upload Details"}
                                singleFileUpload={true}
                                loadingStatus={(isloading)=>{setIsDocumentLoading(isloading)}}
                            />
                        </div>}
                        {validate.isNotEmpty(imageFile) &&
                            <div>
                                <StackedImages includeLightBox images={imageFile.imageInfoList} maxImages="4" />
                            </div>}
                    </div></>}
                    {showMemberCard && <><h6 className="h6 custom-fieldset mb-2 text-start">Primary Member Details</h6> <div className="col-lg-4"><ExistingMemberCard member={members[0]} isSelfMember /></div></>}
                    {
                        validate.isNotEmpty(subscription) && subscription.benefitType != 'PHARMACY' &&  <div className={`custom-tabs-forms d-flex pb-0 card mobile-compatible-tabs mt-3`}>

                        <div><NavTabs tabs={isMembersAlreadyExists ? tabs : ["Add New Members"]} onTabChange={handleTabId} />
                               <TabContent activeTab={tabId}>
                                   {isMembersAlreadyExists && <TabPane tabId="1">
                                       <div className='d-lg-flex flex-lg-wrap row p-12 g-3'>
                                           {members.map((member, memberIndex) => {
                                               if (validate.isEmpty(member.relationship) || member.relationship.relationshipType != 'SELF') {
                                                   return (
                                                       <div className='col-lg-4 col'>
                                                           <ExistingMemberCard showCheckBox={!member.subscribedMember && (validate.isEmpty(member.benefits) || (validate.isNotEmpty(subscription) && validate.isNotEmpty(member.benefits) && !member.benefits.includes(subscription.benefitType)))} member={member} setSelectedMembers={setSelectedMembers} selectedMembers={selectedMembers} onRemoveMember={removeMember} editMemberIndex={memberIndex} members={members} showEdit={!subscribedMemberIds.includes(member.patientId)} showRemove={!subscribedMemberIds.includes(member.patientId)} validateMemberDetails={validateMemberDetails}/>
                                                       </div>
                                                   )
                                               }
                                           })}
                                       </div>
   
                                   </TabPane>}
                                   <TabPane tabId={isMembersAlreadyExists ? "2" : "1"}>
                                       <AddNewMember setMembers={setNewMembers} members={newMembers} />
                                   </TabPane>
                               </TabContent></div>
                       </div>
                    }
                    
                </div>}

            </BodyComponent>}
            <FooterComponent ref={footerRef} className="p-12 border-top d-flex justify-content-center justify-content-lg-end">
                <button role="button" aria-label="go back" type="button" className="px-2 brand-secondary btn px-lg-4 me-2" onClick={() => {  props.history.push({pathname:getCustomerRedirectionURL(customerId, MEDPLUS_ADVANTAGE), state:{isFromPlansPage: isFromPlansPage}}) }}>Back</button>
                <ButtonWithSpinner aria-label="Proceed To Verification" buttonText="Proceed To Verification" className="px-2 btn-brand btn px-lg-4 " showSpinner={proceedToVerificationLoader} disabled={proceedToVerificationLoader} onClick={() => {onSubmit()}}/>
            </FooterComponent>
        </Wrapper>
    )
}

export default withFormHoc(AddMembersToPlan)