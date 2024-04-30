import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { StackedImages } from "@medplus/react-common-components/DynamicForm";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Validate from "../../../helpers/Validate";
import CommonConfirmationModal from "../../Common/ConfirmationModel";
import AddNewMember from "./AddNewMember";
import { getAge, getGenderString } from "../../../helpers/CommonHelper";
import MembershipService from "../../../services/Membership/MembershipService";
import { AlertContext, CustomerContext, LocalityContext } from "../../Contexts/UserContext";
import MemberDetails from "./MemberDetails";
import dateFormat from 'dateformat';
import { getDateInYMDFormat } from "../../../helpers/HelperMethods";



export const ExistingMemberCard = (props)=>{
    const {setSelectedMembers,selectedMembers,onRemoveMember,members,memberIndex,fromSubscriptionDetail} = props;
    const validate = Validate();
    const {setStackedToastContent} = useContext(AlertContext);
    const [isChecked,setIsChecked] = useState(false);
    const [toggleConfirmation,setToggleConfirmation] = useState(false);
    const [toggleEdit,setToggleEdit] = useState(false);
    const [returnMemberData,setReturnMemberData] = useState(false);
    const [confirmationModalData,setConfirmationModalData] = useState({message:"",onSuccess:{}});
    const [editMember, setEditMember] = useState();
    const [member,setMember] = useState(props.member);
    const [otpRequested, setOtpRequested] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const { subscription } = useContext(CustomerContext);
    const { martLocality } = useContext(LocalityContext);

    useEffect(()=>{
        if(validate.isNotEmpty(editMember)){
            setIsOtpVerified(false);
            setOtpRequested(false);
            updateEditMemberDetails();
        }
    },[editMember]);

     useEffect(() =>{
        setMember(props.member);
     },[props.member])

    const updateEditMemberDetails = async () => {
        setMember(editMember);
        members[memberIndex] = editMember;
        if(fromSubscriptionDetail) {
            await saveMember(editMember);
        } else {
            setIsChecked(true);
            selectEditMembers(editMember);  
        }
        setToggleEdit(false);
        setReturnMemberData(false);
    }

    const saveMember = async (member) => {
        MembershipService().saveMemebers([member]).then( response => {
            if(validate.isNotEmpty(response)){
                if(response.statusCode == 'SUCCESS'){
                    setStackedToastContent({toastMessage:"SUCCESS"});
                    if(props.onSuccess){
                        props.onSuccess();
                    }
                } else {
                    setStackedToastContent({toastMessage: validate.isNotEmpty(response.message)? response.message : "Unable to save member"})
                }
            }
        }).catch(err => {
            setStackedToastContent({toastMessage: "Unable to save member"});
        })
    }

    const deleteMemberCard = (e)=>{
        e.stopPropagation();
        confirmationModalData.message = "Are you sure, you want to remove member ?";
        setToggleConfirmation(true);
    }
    const editMemberCard =(e)=>{
        e.stopPropagation();
        if(validate.isNotEmpty(props.onEditMember)){
            props.onEditMember(member);
            return;
        }
        setEditMember(undefined);
        setToggleEdit(true);

    }

    const selectEditMembers = (member) => {
        if(!props.showCheckBox)
            return;
        let members = selectedMembers.filter((selectedMember)=>selectedMember.patientId!=member.patientId);
        setSelectedMembers([...members,member]);
    }
    const onSelectMember = () => {
        if (props.validateMemberDetails) {
            props.validateMemberDetails(member);
        }
        if(!props.showCheckBox)
            return;
        if(validate.isEmpty(selectedMembers) || validate.isEmpty(selectedMembers.filter((selectedMember)=>selectedMember.patientId == member.patientId))){
            setSelectedMembers([...selectedMembers,member])
        } else {
            setSelectedMembers(selectedMembers.filter((selectedMember)=>selectedMember.patientId!=member.patientId))
        }
    }

    return(
        <React.Fragment>

            {validate.isNotEmpty(member) && <div className="card border card-hover" onClick={()=>{onSelectMember();}}>
                <div className="h-100 p-12">
                    <div className="d-flex">
                        {props.showCheckBox && <div class="form-check d-flex">
                            <input class="form-check-input pointer"  checked={selectedMembers.some(value => value.patientId == member.patientId)} type="checkbox" value="" id="flexCheckDefault" />
                            </div>
                        }
                        <div className="flex-fill">
                        {member.subscribedMember &&
                            <span className="badge px-2 badge-approved rounded-5 mb-2 ">Subscribed</span>
                        }
                        {(props.fromSubscriptionDetail && member.subscriptionStatus && member.subscriptionStatus == "PENDING") &&
                            <span className="badge px-2 badge-pending rounded-5 mb-2 ">{member.subscriptionStatus}</span>
                        }
                        {(props.fromSubscriptionDetail && member.subscriptionStatus && member.subscriptionStatus == "CANCELLED") &&
                            <span className="badge px-2 badge-rejected rounded-5 mb-2 ">cancelled</span>
                        }
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-row">
                                    <div className="flex-column">
                                        <p className="font-14  mb-0">
                                            {member.patientName}
                                        </p>
                                        <p className="font-12 text-secondary">
                                            {validate.isNotEmpty( getAge(member.dob)) ? getAge(member.dob) < 1 ? 0 : getAge(member.dob) : '-'} Yrs / {getGenderString(member.gender)}
                                        </p>
                                    </div>
                                </div>
                        <div className="d-flex">
                        {props.showEdit ? <div>
                            <Button variant="link" className="icon-hover" title="edit" onClick={editMemberCard}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                        <g id="edit_black_icon_24px" transform="translate(-180.258 0)">
                                            <rect id="Rectangle_12685" data-name="Rectangle 12685" width="18" height="18" rx="3" transform="translate(180.258 0)" fill="none"/>
                                            <g id="Group_34715" data-name="Group 34715" transform="translate(180.258 0)">
                                            <path id="Union_201" data-name="Union 201" d="M2.458,16.175A2.461,2.461,0,0,1,0,13.716V4.034a2.462,2.462,0,0,1,2.458-2.46H5.576a.537.537,0,0,1,0,1.075H2.456A1.393,1.393,0,0,0,1.073,4.037v9.679a1.394,1.394,0,0,0,1.38,1.39h9.679a1.392,1.392,0,0,0,1.391-1.39V10.6a.536.536,0,1,1,1.073,0v3.119a2.462,2.462,0,0,1-2.459,2.459Zm2.786-3.35a.943.943,0,0,1-.559-.491,1.141,1.141,0,0,1-.087-.79l.618-2.466a.635.635,0,0,1,.132-.269L12.6.649a1.859,1.859,0,0,1,2.821,0,2.468,2.468,0,0,1,0,3.173L8.191,11.979a.52.52,0,0,1-.247.153l-2.173.689-.279.041A.856.856,0,0,1,5.243,12.825Zm.978-3.3-.534,2.041,1.8-.549.021-.007L13.639,4.09l.057-.064-1.3-1.463Zm7.185-8.069-.239.241,1.291,1.454.192-.173.008-.008a1.147,1.147,0,0,0-.006-1.463.88.88,0,0,0-.648-.3A.867.867,0,0,0,13.406,1.459Z" transform="translate(1 1)" fill="#1c3ffd"/>
                                            </g>
                                        </g>
                                    </svg>
                                </Button>
                                    </div> : <div>
                                            <Button variant="link" className="icon-hover" title="view"  onClick={() => setToggleEdit(true)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" version="1.1" viewBox="0 0 1200 1200">
                                                    <path d="m1156.9 591.21c-59.977-225.66-336.39-377.24-556.93-377.24-221.69 0-509.84 154.92-568.93 377.24l-2.3281 8.7852 2.3281 8.7852c59.09 222.32 347.25 377.24 568.93 377.24 220.55 0 496.96-151.59 556.93-377.24l2.3281-8.7852zm-556.93 326.35c-193.77 0-443.87-129.96-500.28-317.57 56.414-187.61 306.52-317.57 500.28-317.57 188.18 0 432.06 129.96 488.28 317.57-56.223 187.61-300.1 317.57-488.28 317.57zm3-520.94c-115.64 0-209.38 93.742-209.38 209.38s93.742 209.38 209.38 209.38 209.38-93.73 209.38-209.38-93.73-209.38-209.38-209.38z" fill="#1c3ffd" />
                                                </svg>
                                        </Button>
                                    </div>}
                                    
                            {props.showRemove && <div>
                            <Button variant="link" className="icon-hover" onClick={deleteMemberCard}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                        <g id="delete_black_icon_24px" transform="translate(-180.258 -281.937)">
                                            <rect id="Rectangle_12684" data-name="Rectangle 12684" width="18" height="18" rx="3" transform="translate(180.258 281.937)" fill="none"/>
                                            <g id="Group_34714" data-name="Group 34714" transform="translate(181.918 282.937)">
                                            <path id="Union_200" data-name="Union 200" d="M4.1,16a2.272,2.272,0,0,1-2.228-2.3V3.2H.536a.549.549,0,0,1,0-1.1H4.421V1.95A1.95,1.95,0,0,1,4.97.575,1.863,1.863,0,0,1,6.309,0H8.686a1.923,1.923,0,0,1,1.889,1.951V2.1H14.12a.549.549,0,0,1,0,1.1h-1V13.7A2.273,2.273,0,0,1,10.895,16ZM2.933,13.7A1.189,1.189,0,0,0,4.1,14.9h6.795a1.19,1.19,0,0,0,1.168-1.2V3.2H2.933ZM5.484,1.951l0,.153H9.514V1.951A.842.842,0,0,0,8.686,1.1H6.307A.846.846,0,0,0,5.484,1.951ZM9.843,13.643a.57.57,0,0,1-.538-.6V6.524a.567.567,0,0,1,.538-.548h.02a.566.566,0,0,1,.56.546v6.571a.568.568,0,0,1-.561.552Zm-2.368,0a.571.571,0,0,1-.538-.6V6.521a.559.559,0,1,1,1.118,0v6.571a.568.568,0,0,1-.56.552Zm-2.366,0a.571.571,0,0,1-.539-.6V6.521a.559.559,0,1,1,1.118,0v6.571a.568.568,0,0,1-.561.552Z" transform="translate(0 0)" fill="#e71c37"/>
                                            </g>
                                        </g>
                                    </svg>
                            </Button>
                                
                            </div>}
                        </div>
                        
                    </div>
                        <div>
                            <div className="d-flex flex-wrap row gy-2 gx-1">
                                    {validate.isNotEmpty(member.relationship) && <div className=" col-lg-4 content-width">
                                        <label className="font-12 text-secondary">Relationship</label>
                                        <p className="font-14 mb-0">{member.relationship.name}</p>
                                    </div>}
                                    {validate.isNotEmpty(member.dob) && <div className="col-lg-4 content-width">
                                        <label className="font-12 text-secondary">Date of Birth</label>
                                        <p className="font-14 mb-0">{getDateInYMDFormat(member.dob)}</p>
                                    </div>}
                                    {validate.isNotEmpty(member.modifiedBy) && <div className="col-lg-4 content-width">
                                        <label className="font-12 text-secondary">Modified By</label>
                                        <p className="font-14 mb-0">{member.modifiedBy}</p>
                                    </div>}
                                    {validate.isNotEmpty(member.dateModified) && <div className="col-lg-4 content-width">
                                        <label className="font-12 text-secondary">Modified on</label>
                                        <p className="font-14 mb-0">{dateFormat(member.dateModified,'mmm d, yyyy')}</p>
                                    </div>}
                                    {validate.isNotEmpty(member.dateCreated) && <div className="col-lg-4 content-width">
                                        <label className="font-12 text-secondary">Added on</label>
                                        <p className="font-14 mb-0">{dateFormat(member.dateCreated,'mmm d, yyyy')}</p>
                                    </div>}
                                    {validate.isNotEmpty(member.kycs) && validate.isNotEmpty(member.kycs[0].attributes) && <div className="col-lg-4 content-width">
                                            <label className="font-12 text-secondary">ID number</label>
                                            <p className="font-14 mb-0">{member.kycs[0].attributes[0].attributeValue}</p>
                                    </div>}                                
                                    {validate.isNotEmpty(member.kycs) && validate.isNotEmpty(member.kycs[0].attributes) && <div className="col-lg-4 content-width">
                                        <label className="font-12 text-secondary">Photo ID Type</label>
                                        <p className="font-14 mb-0">{subscription.kycTypes.filter((each) => { return each.kycType == member.kycs[0].kycType })[0].kycName}</p>
                                    </div> }
                                     { validate.isNotEmpty(member.kycs) && validate.isNotEmpty(member.kycs[0]) && validate.isNotEmpty(member.kycs[0].imageFile) &&
                                     <div className="col-lg-4 content-width align-items-center d-flex p-2">
                                        <StackedImages includeLightBox images={member.kycs[0].imageFile.imageInfoList} maxImages="4" />
                                    </div>}
                                </div>
                            </div>
                        </div>
                        </div>
                </div>
                </div>}

            <CommonConfirmationModal  isConfirmationPopOver = {toggleConfirmation} setConfirmationPopOver = {setToggleConfirmation} message={confirmationModalData.message} buttonText={"Yes"} onSubmit={() => onRemoveMember(member)}/>
            {toggleEdit && <Modal className={"modal-dialog-centered modal-lg"} isOpen={toggleEdit}>
                {<ModalHeader className='d-flex justify-content-between modal-header p-2' close={<Button variant="link" className="align-self-center icon-hover rounded-5" type="button" onClick={() => { setOtpRequested(false); setToggleEdit(!toggleEdit) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <rect fill="none" width="24" height="24" />
                        <path d="M20.76,19.55l-7.58-7.56,7.56-7.56a.846.846,0,0,0-.04-1.18.822.822,0,0,0-1.13,0L12,10.81,4.44,3.24A.827.827,0,0,0,3.27,4.41l7.56,7.58L3.27,19.55a.835.835,0,0,0,1.14,1.22l.04-.04L12,13.17l7.56,7.56a.833.833,0,0,0,1.17,0h0a.821.821,0,0,0,.04-1.16A.031.031,0,0,0,20.76,19.55Z" fill="#b9b9b9" />
                    </svg>
                </Button>}>
                    {props.showEdit ? "Edit Member" : "View Member"}
                </ModalHeader>}
                <ModalBody className={props.showEdit ? 'p-0' : 'p-12'}>
                    {props.showEdit && <AddNewMember editMember={member} setEditMember={setEditMember} membershipMasterData={props.membershipMasterData} fromSubscriptionDetail={props.fromSubscriptionDetail} returnMemberData={returnMemberData} setReturnMemberData={setReturnMemberData} members={members} setOtpRequested={setOtpRequested} otpRequested={otpRequested} isOtpVerified={isOtpVerified} setIsOtpVerified={setIsOtpVerified} />}
                    {!props.showEdit && <MemberDetails member={member} />}
                </ModalBody>
                <ModalFooter className={`p-2 d-flex ${(props.showEdit && fromSubscriptionDetail) ? " justify-content-between" : "justify-content-center"}`}>
                    {props.showEdit && fromSubscriptionDetail && <div >
                        <h6 class="text-dark font-14">Note Information</h6>
                        <ol className="font-14 mb-0 ps-3"><li>Active member details can updated only thrice</li></ol>
                    </div>}
                    <div>
                        <Button variant=" " className="px-4 me-3 brand-secondary" onClick={() => { setOtpRequested(false); setToggleEdit(!toggleEdit) }}>
                            Close
                        </Button>
                        {(props.showEdit && !otpRequested) && <Button variant=" " className="px-4 me-3 btn-brand" onClick={(e) => { setReturnMemberData(true) }}>
                            Update Member
                        </Button>}
                    </div>
                </ModalFooter>
            </Modal>}

        </React.Fragment>

    )
}