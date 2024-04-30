import DynamicForm, { StackedImages, TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useContext, useEffect, useState } from "react"
import { API_URL, REQUEST_TYPE } from "../../../services/ServiceConstants";
import Validate from "../../../helpers/Validate";
import DocumentUpload from "@medplus/react-common-components/DocumentUpload";
import { AlertContext, CustomerContext } from "../../Contexts/UserContext";
import { getDateInYMDFormat } from "../../../helpers/HelperMethods";
import { ExistingMemberCard } from "./ExistingMemberCard";
import OrderService from "../../../services/Order/OrderService";
import { getAge } from "../../../helpers/CommonHelper";
import { ProcessType, ValidatePhotoIdNumberAgaistType } from "./MembershipHelper";
import { Button } from "react-bootstrap";
import VerifyOtpForm from "./orderReview/VerifyOtpForm";
import MembershipService from "../../../services/Membership/MembershipService";
import { Input } from "reactstrap";
import dateFormat from 'dateformat';
import { isValidPhotoIdFiles, setRegexForTypes } from "../CustomerHelper";


const AddNewMember = ({helpers,...props}) => {
    const {members,setMembers,editMember,setEditMember,returnMemberData,setReturnMemberData,otpRequested,setOtpRequested,isOtpVerified,setIsOtpVerified} = props;
    const validate = Validate();
    const { setStackedToastContent } = useContext(AlertContext);
    const {subscription,customerId,customer} = useContext(CustomerContext);
    const [documentTrigger,setDocumentTrigger] = useState(false);
    const [resetAddedDocuments,setResetAddedDocuments] = useState(false);
    const [isDocumentLoading, setIsDocumentLoading] = useState(false)
    const [member,setMember] = useState(helpers.cloneState(editMember));
    const [images,setImages] = useState([]);
    let kycInfo = {kycType:"",attributes:[{attributeName:"",attributeValue:""}]};

    useEffect(()=>{
        setResetAddedDocuments(false);
    }, [isDocumentLoading])

    useEffect (() => {
        if(validate.isNotEmpty(member))
            onFormLoad();
    },[member])

    useEffect(()=> {
        if(returnMemberData){
            setDocumentTrigger(true);
        }
    },[returnMemberData])

    useEffect(() => {
        setReturnMemberData? setReturnMemberData(isOtpVerified):'';
        if(isOtpVerified){
            setEditMember(member);
            helpers.resetForm("addMembersToAddOn",false,true,true,true);
            helpers.hideElement("newMemberPhotoIDNumber");
            setResetAddedDocuments(true);
        }
    },[isOtpVerified])

    const onFormLoad = () => {
        helpers.resetForm("addMembersToAddOn",false,true,true,true);
        setResetAddedDocuments(false);
        let relationOptions = [];
        let randomNumberForIdSuffix = Math.random();
        if (validate.isNotEmpty(subscription) && validate.isNotEmpty(subscription.relations)) {
            subscription.relations.map((relation) => {
                if(!props.fromSubscriptionDetail) {
                    if(relation.relationshipType !== 'SELF')
                        relationOptions.push(helpers.createOption(relation.name+"_"+randomNumberForIdSuffix, relation.name, relation.relationshipType));
                } else {
                    relationOptions.push(helpers.createOption(relation.name+"_"+randomNumberForIdSuffix, relation.name, relation.relationshipType));
                }
            })
            helpers.updateSingleKeyValueIntoField("values", relationOptions, "relationship");
        }

        let photoIdTypes = [];
        if (validate.isNotEmpty(subscription) && validate.isNotEmpty(subscription.kycTypes)) {
            subscription.kycTypes.map((type) => {
                photoIdTypes.push(helpers.createOption(type.kycName+" newMember_"+randomNumberForIdSuffix, (validate.isNotEmpty(member) && validate.isNotEmpty(member.verifiedKycTypes) && member.verifiedKycTypes.includes(type.kycType)) ? type.kycName + ' (verified)' : type.kycName, type.kycType));
            })
            photoIdTypes.push(helpers.createOption('none_'+randomNumberForIdSuffix,'None',''));
        }
        helpers.updateSingleKeyValueIntoField("values", photoIdTypes, "newMemberPhotoIDType");
        helpers.updateValue('','newMemberPhotoIDType',false);
        if (validate.isNotEmpty(member)) {
            let formValues = {}
            if (validate.isNotEmpty(member.patientName)) {
                formValues = { ...formValues, "newMemberName": member.patientName }
            }
            if(validate.isNotEmpty(member.email)) {
                formValues = {...formValues, 'emailId': member.email}
                helpers.showElement('emailId');
            }
            if (validate.isNotEmpty(member.gender)) {
                formValues = { ...formValues, "newMemberGender": member.gender }
            }
            if (validate.isNotEmpty(member.dob)) {
                formValues = { ...formValues, "dobNewMember": getDateInYMDFormat(member.dob) }
            }
            if(validate.isNotEmpty(member.stateSubName) && validate.isNotEmpty(subscription.regions)) {
                formValues = {...formValues,"state": subscription.regions[member.stateSubName]}
                helpers.showElement('state');
            }
            if(validate.isNotEmpty(member.relationship) && validate.isNotEmpty(member.relationship.relationshipType)){
                formValues = { ...formValues,"relationship": member.relationship.relationshipType}
                if(props.fromSubscriptionDetail)
                    helpers.disableElement('relationship');
            }
            if (validate.isNotEmpty(member.kycs)) {
                formValues = { ...formValues, "newMemberPhotoIDType": member.kycs[0].kycType }
                setRegexForTypes(helpers, member.kycs[0].kycType, "newMemberPhotoIDNumber");
            }
            if (validate.isNotEmpty(member.kycs) && validate.isNotEmpty(member.kycs[0].attributes)) {
                formValues = { ...formValues, "newMemberPhotoIDNumber": member.kycs[0].attributes[0].attributeValue }
            }
            if (validate.isNotEmpty(member.memberUniqueId)) {
                formValues = { ...formValues, "memberUniqueId": member.memberUniqueId }
            }
            if(validate.isNotEmpty(formValues)){
                helpers.updateSpecificValues(formValues, "addMembersToPlan");
            }
            if(props.viewMember){
                helpers.disableElement("newMemberName");
                helpers.disableElement("newMemberGender");
                helpers.disableElement("dobNewMember");
                helpers.disableElement("relationship");
                helpers.disableElement("newMemberPhotoIDNumber");
                helpers.disableElement("addMembersToPlan");
                helpers.updateSingleKeyValueIntoField("required",false,"newMemberPhotoIDNumber",false);
            }
            if(validate.isNotEmpty(member.kycs) && validate.isNotEmpty(member.kycs[0]) && validate.isNotEmpty(member.kycs[0].imageFile)){
                setImages(member.kycs[0].imageFile.imageInfoList);
            }
        }
    }
    const saveMember = () =>{
        let formValues = helpers.validateAndCollectValuesForSubmit("addMembersToAddOn",false,true,true);
        if(validate.isEmpty(formValues)){
            setReturnMemberData ? setReturnMemberData(false) : ''
            return ;
        }
        prepareMemberFromFormData(formValues);
    }

    const prepareMemberFromFormData = async (formData) => {
        if(validate.isNotEmpty(validate.name(formData.newMemberName,"Patient Name"))){
            setStackedToastContent({toastMessage:validate.name(formData.newMemberName,"Patient Name")})
            setReturnMemberData ? setReturnMemberData(false) : ''
            return;
        }
        if(validate.isEmpty(getAge(formData.dobNewMember)) ){
            setStackedToastContent({toastMessage: "Inavlid Date of Birth for " + formData.newMemberName });
            setReturnMemberData ? setReturnMemberData(false) : ''
            return;
        }
        if(validate.isNotEmpty(formData.emailId) && validate.isNotEmpty(validate.email(formData.emailId))){
            setStackedToastContent({toastMessage:validate.email(formData.email)});
            setReturnMemberData ? setReturnMemberData(false) : ''
            return;
        }
        const maxDateOfBirth = new Date(Date.now());
        const custAge = getAge(formData.dobNewMember);
        if (custAge < 0 || custAge > 150) {
            setReturnMemberData ? setReturnMemberData(false) : ''
            setStackedToastContent({toastMessage: `Date of birth should be ( ${(maxDateOfBirth.getUTCFullYear()) - 150} - ${maxDateOfBirth.getUTCFullYear()} ) Years Range` , position:TOAST_POSITION.BOTTOM_START})
            return
        }
        let newMember = validate.isNotEmpty(editMember)? helpers.cloneState(editMember):{};
        if(props.fromSubscriptionDetail){
            let isMemberInfoNotModified = formData.relationship == newMember.relationship.relationshipType && formData.emailId == newMember.email && formData.newMemberName == newMember.patientName &&
            newMember.gender == formData.newMemberGender && newMember.dob == formData.dobNewMember;
            if(isMemberInfoNotModified && validate.isEmpty(kycInfo.imageFile)){
                setStackedToastContent({toastMessage:'No Data Has Been Changed'});
                setReturnMemberData ? setReturnMemberData(false) : ''
                return;
            }
        }
        newMember.patientName = formData.newMemberName;
        newMember.dob = formData.dobNewMember;
        newMember.age = getAge(formData.dobNewMember);
        newMember.relationship = {};
        newMember.relationship = subscription.relations.filter((relation) => relation.relationshipType == formData.relationship)[0];
        newMember.gender = formData.newMemberGender;
        newMember.email = validate.isNotEmpty(formData.emailId)?formData.emailId:editMember?.email;
        if (validate.isNotEmpty(formData.newMemberPhotoIDType)) {
            if(!member.verifiedKycTypes.includes(formData.newMemberPhotoIDType) && ValidatePhotoIdNumberAgaistType(formData.newMemberPhotoIDType,formData.newMemberPhotoIDNumber)){
                setStackedToastContent({toastMessage:ValidatePhotoIdNumberAgaistType(formData.newMemberPhotoIDType,formData.newMemberPhotoIDNumber)});
                setReturnMemberData ? setReturnMemberData(false) : ''
                return;
            }
            member.kycs.map((eachKyc) => {
                if(eachKyc.kycType == formData.newMemberPhotoIDType) {
                    kycInfo = { ...kycInfo, kycType: formData.newMemberPhotoIDType, attributes: [{ attributeName: "RefNo", attributeValue: eachKyc.attributes[0].attributeValue }] };
                    newMember.kycs = [kycInfo];
                }
            })
        } else {
            newMember.kycs = [];
        }
        newMember.memberUniqueId = formData.memberUniqueId;
        if(validate.isEmpty(editMember)){
            if(validate.isEmpty(newMember.memberUniqueId)) {
                newMember.memberUniqueId = Math.random() * 1000000;
                setMembers([...members, newMember]);
            } else {
                let temp = members.map((eachMember) => {
                    if(eachMember.memberUniqueId == newMember.memberUniqueId) {
                        eachMember = newMember;
                    }
                    return eachMember;
                });
                setMembers(temp);
            }
        } else {
            if(props.fromSubscriptionDetail){
                if(!verifyAnyChangeInMemberData(newMember,formData)){
                    setStackedToastContent({toastMessage:"No Data Has Been Changed"})
                    setReturnMemberData(false);
                    return;
                }
                await requestEditMemberOtp(newMember);
                setMember(newMember);
                return;
            } else {
                setEditMember(newMember);
            }
        }
        helpers.resetForm("addMembersToAddOn",false,true,true,true);
        helpers.hideElement("newMemberPhotoIDNumber");
        setResetAddedDocuments(true);
    }

    const onPhotoTypeChange = (event) => {
        let photoIDType = event[0].target.value
        setResetAddedDocuments(true);
        if(validate.isEmpty(photoIDType)){
            helpers.hideElement("newMemberPhotoIDNumber");
            helpers.updateValue(undefined, "newMemberPhotoIDNumber",false);
            helpers.updateErrorMessage("",'newMemberPhotoIDType');
            setImages(undefined);
            return;
        }
        helpers.updateErrorMessage("",'newMemberPhotoIDNumber');
        helpers.updateValue(undefined, "newMemberPhotoIDNumber",false);
        if(validate.isEmpty(photoIDType) || member?.verifiedKycTypes?.includes(photoIDType)) {
            helpers.hideElement("newMemberPhotoIDNumber");
        } else {
            helpers.showElement("newMemberPhotoIDNumber");
        }
        if(validate.isNotEmpty(member) && validate.isNotEmpty(member.kycs)){
            kycInfo = {...kycInfo,kycType:photoIDType};
            let kyc = member.kycs.filter((type)=> type.kycType == photoIDType);
            if(validate.isNotEmpty(kyc) && validate.isNotEmpty(kyc[0].attributes))
                helpers.updateValue(kyc[0].attributes[0].attributeValue,"newMemberPhotoIDNumber");
            else
                helpers.updateValue(undefined,"newMemberPhotoIDNumber",false);

            if(validate.isNotEmpty(kyc) && validate.isNotEmpty(kyc[0].imageFile)){
                setImages(kyc[0].imageFile.imageInfoList);
            } else {
                setImages([]);
            }
        }
        setRegexForTypes(helpers, photoIDType, "newMemberPhotoIDNumber");
    }

    const verifyAnyChangeInMemberData = (member,formData) => {
        if(validate.isEmpty(member) || validate.isEmpty(editMember)){
            return false;
        }
        let newKycs = member.kycs;
        let exsitingKycs = editMember.kycs;
        let isMemberInfoModified = (member.relationship.relationshipType != editMember.relationship.relationshipType) || (member.email != editMember.email) || (member.patientName != editMember.patientName) ||
        (member.gender != editMember.gender) || (dateFormat(member.dob,'yyyy-mm-dd') != dateFormat(editMember.dob,'yyyy-mm-dd')) || (validate.isNotEmpty(newKycs) && validate.isEmpty(exsitingKycs));
        if(validate.isNotEmpty(newKycs) && validate.isNotEmpty(exsitingKycs)) {
            let existingkyc = exsitingKycs.filter((kyc) => kyc.kycType == formData.newMemberPhotoIDType);
            if(validate.isEmpty(existingkyc)){
                return true;
            } else {
                let attribute = {}
                if(validate.isNotEmpty(existingkyc[0].attributes)){
                    attribute = existingkyc[0].attributes.filter((attribute) => attribute.attributeName == 'RefNo');
                }
                if(validate.isNotEmpty(attribute)){
                    isMemberInfoModified = isMemberInfoModified || attribute[0].attributeValue != formData.newMemberPhotoIDNumber;
                }
                if(validate.isNotEmpty(kycInfo.imageFile)){
                    return true;
                }
            }
        }
        return isMemberInfoModified;
    }

    const onDocumentUpload = (file) => {
        if(validate.isEmpty(file)){
            helpers.updateSingleKeyValueIntoField('required',false,'newMemberPhotoIDType')
            saveMember();
            setDocumentTrigger(false);
            return;
        }

        if(!isValidPhotoIdFiles(file)){
            setStackedToastContent({ toastMessage: "Please upload valid file(s)" });
            return;
        }

        OrderService().uploadFilesToImageServer(file, 'P', {}).then(response => {
            if (response.statusCode === "SUCCESS" && response.response) {
                if(validate.isNotEmpty(response.response)){
                    kycInfo.imageFile = {};
                    kycInfo.imageFile.imageInfoList = response.response;
                    kycInfo.imageFile.imageServerName = response.response[0].imageServerName;
                    helpers.updateSingleKeyValueIntoField('required',true,'newMemberPhotoIDType')
                }

            }
            if (response.statusCode === "FAILURE") {
                setStackedToastContent({ toastMessage: response.message});
            }
            saveMember();
        
        }).catch(error => {
            console.log(error);
            setStackedToastContent({ toastMessage: "Server Experiencing some problem" });
        })
        setDocumentTrigger(false);
    }
    const onEdit = (member) => {
        setMember(member);
    }
    const onRemoveMember = (member) => {
        setMembers(members.filter(mem => mem !== member));
    }

    const requestEditMemberOtp = async (member) => {
        let generateOtp = {
            customerId : customerId,
            otpType : "GENERATE",
            members : [member],
        };
        let processType = ProcessType.EDIT_MEMBER;
        let response = await MembershipService().requestMembershipOtp(generateOtp, processType);
        if(response.statusCode == 'SUCCESS'){
            setOtpRequested(true);
            setStackedToastContent({toastMessage:"OTP sent successfully"});
        } else {
            setStackedToastContent({toastMessage: response?.message ? response?.message : 'Unable to send OTP'});
            setReturnMemberData ? setReturnMemberData(false):''
        }
        setDocumentTrigger(false);
    }

    const onPhotoIdNumberChange = (event) => {
        let photoIDNumber = helpers.getHtmlElementValue('newMemberPhotoIDNumber');
        let photoIDType = helpers.getHtmlElementValue('newMemberPhotoIDType')
        if(validate.isNotEmpty(ValidatePhotoIdNumberAgaistType(photoIDType,photoIDNumber))){
            helpers.updateErrorMessage(ValidatePhotoIdNumberAgaistType(photoIDType,photoIDNumber),'newMemberPhotoIDNumber');
        } else {
            helpers.updateErrorMessage("",'newMemberPhotoIDNumber');
        }
    }

    const observersMap = {
        "addMembersToAddOn":[['load',onFormLoad]],
        "newMemberPhotoIDType":[['change',onPhotoTypeChange]],
        'newMemberPhotoIDNumber' : [['change',onPhotoIdNumberChange],['click',onPhotoIdNumberChange]]
    }

    return <React.Fragment>
            <DynamicForm requestMethod={REQUEST_TYPE.GET} requestUrl={`${API_URL}addNewMemberOrEditMember`} helpers={helpers} observers={observersMap}/>
            <div className="p-12 d-flex">
                <div className={(validate.isEmpty(helpers.getHtmlElementValue('newMemberPhotoIDType')) || member?.verifiedKycTypes?.includes(helpers.getHtmlElementValue('newMemberPhotoIDType'))) ? 'd-none' : "col-5"}>
                 {!props.viewMember && <DocumentUpload
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
                      onErrorResponse={(message) => { setStackedToastContent({ toastMessage: message }) }}
                      includeLightBox={false}
                      imageTitle={"KYC Upload Details"}
                      singleFileUpload={true}
                      loadingStatus={(isloading)=>{setIsDocumentLoading(isloading)}}
                  />}
                </div>
                <div>
                  {validate.isNotEmpty(images) && <StackedImages images={images} includeLightBox/>}
                  </div>
            </div>
        {(validate.isNotEmpty(props.fromSubscriptionDetail) && props.fromSubscriptionDetail) && <div>
            {otpRequested && <div className='form-floating col-4 mb-3'>
                <Input aria-label="text input" disabled type="text" id="Mobile No" class="form-control-plaintext" value={customer.mobileNumber} />
                <label for="OrderId">Mobile No</label>
            </div>}
            {otpRequested && <VerifyOtpForm setIsOtpVerified={setIsOtpVerified} customerId={customerId} members={[member]} processType={ProcessType.EDIT_MEMBER} />}
            {otpRequested && <Button variant=" " size="sm" className="px-4 me-3 brand-secondary" onClick={() => {setOtpRequested(false);setReturnMemberData(false)}}>
                            Cancel OTP
            </Button>}
        </div>}
        <div className="p-12">

        {validate.isEmpty(editMember) && !props.viewMember && <Button variant="brand" role="button" aria-label='Save Member' type="button" class="px-2  px-lg-4 me-2 text-end" onClick={()=>setDocumentTrigger(true)}>Save Member</Button>}
            {validate.isNotEmpty(members) && validate.isEmpty(editMember) && <div className='d-lg-flex flex-lg-wrap row p-12 g-3'>
                    {members.map((member)=>{
                        if(validate.isEmpty(member.relationship) || member.relationship.relationshipType != 'SELF'){
                            return(
                                <div className='col-lg-4 col'>
                                    <ExistingMemberCard showCheckBox={false} member={member} onEditMember={(member)=>onEdit(member)} onRemoveMember={onRemoveMember} showEdit={true} showRemove={true}/>
                                </div>
                            )
                        }
                    })}
            </div>}
        </div>
    </React.Fragment>
}
export default withFormHoc(AddNewMember);