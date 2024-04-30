
import React, { useContext, useState } from "react";
import Validate from "../../../../helpers/Validate";
import CommonConfirmationModal from "../../../Common/ConfirmationModel";
import NewPatientForm from "./NewPatientForm";
import { UncontrolledTooltip } from "reactstrap";
import { AlertContext } from "../../../Contexts/UserContext";

const PatientCard=(props)=>{
    const patientInfo = props.patientInfo;
    const validate=Validate();
    const { setStackedToastContent } = useContext(AlertContext)
    if(validate.isEmpty(patientInfo) && validate.isEmpty(patientInfo?.patientId)){
        return <></>
    }

    const [showConfirmationModal,setShowConfirmationModal] = useState(false)
    const [showEditPatientModal,setShowEditPatientModal] = useState(false);

    const handleRemove=async(e)=>{
        e.stopPropagation();
        setShowConfirmationModal(true);
    }

    const editPatientCard=(e)=>{
        //e.stopPropagation();
        setShowEditPatientModal(true);
    }
    
    const getDisplayGender=(gender)=>{
        switch (gender){
            case "M":
                return "Male";
            case "F":
                return "Female";
            default:
                return "Others";
        }
    }

    const handlePatientSelection = (e) => {
        if(props?.isLabs && (validate.isEmpty(patientInfo.patientName) || validate.isEmpty(patientInfo.gender) || validate.isEmpty(patientInfo.age) || validate.isEmpty(patientInfo.doctorName))){
            setStackedToastContent({ toastMessage: "Patient details are mandatory!" });
            setShowEditPatientModal(!showEditPatientModal);
            return;
        } else {
            props.setSelectedPatientInfo(patientInfo);
            props.setSelectedPatientId(patientInfo?.patientId);
        }
    }

    return(
        !props.isReviewPage ? <React.Fragment>
            <div className="card card-hover-effects h-100 pointer" onClick={(e)=>{handlePatientSelection(e)}}>
				<div className="card-body">
                <div className="d-flex">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" value="" id="flexCheckDefault" checked={validate.isNotEmpty(patientInfo?.patientId) && props?.selectedPatientId == patientInfo?.patientId} />
                    </div>
                    <div className="d-flex justify-content-between w-100">
                        <div>
                            <p className="mb-0">{patientInfo?.patientName}{`${validate.isNotEmpty(patientInfo?.relationship?.name)?" ("+patientInfo?.relationship.name+")":""}`}{props?.isLabs && patientInfo.benefits?.indexOf("HEALTH_CARE") > -1 && patientInfo.subscribedMember && <span className="badge bg-info" style={{ verticalAlign: "super" }}>MA Participant</span>}</p>
                            <p className="mb-0 font-12 text-secondary mt-1">{patientInfo?.age ? `${patientInfo.age} Yrs / ` : ``}{patientInfo?.patientName ? `${getDisplayGender(patientInfo?.gender)}` : ``} {validate.isNotEmpty(patientInfo.doctorName) && <span className="mx-2">|</span>} {validate.isNotEmpty(patientInfo.doctorName) ? `Dr ${patientInfo?.doctorName}` : ''}</p>
                        </div>
                        {!(props.subscribedMemberIds && props.subscribedMemberIds.includes(patientInfo.patientId)) && <div className="d-flex ms-3">
                            <div>
                                <button className="btn btn-sm icon-hover btn-link" id={`edit_patient_${patientInfo?.patientId}`} onClick={(e) => editPatientCard(e)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                        <g id="edit_black_icon_24px" transform="translate(-180.258 0)">
                                            <rect id="Rectangle_12685" data-name="Rectangle 12685" width="18" height="18" rx="3" transform="translate(180.258 0)" fill="none"></rect>
                                            <g id="Group_34715" data-name="Group 34715" transform="translate(180.258 0)">
                                                <path id="Union_201" data-name="Union 201" d="M2.458,16.175A2.461,2.461,0,0,1,0,13.716V4.034a2.462,2.462,0,0,1,2.458-2.46H5.576a.537.537,0,0,1,0,1.075H2.456A1.393,1.393,0,0,0,1.073,4.037v9.679a1.394,1.394,0,0,0,1.38,1.39h9.679a1.392,1.392,0,0,0,1.391-1.39V10.6a.536.536,0,1,1,1.073,0v3.119a2.462,2.462,0,0,1-2.459,2.459Zm2.786-3.35a.943.943,0,0,1-.559-.491,1.141,1.141,0,0,1-.087-.79l.618-2.466a.635.635,0,0,1,.132-.269L12.6.649a1.859,1.859,0,0,1,2.821,0,2.468,2.468,0,0,1,0,3.173L8.191,11.979a.52.52,0,0,1-.247.153l-2.173.689-.279.041A.856.856,0,0,1,5.243,12.825Zm.978-3.3-.534,2.041,1.8-.549.021-.007L13.639,4.09l.057-.064-1.3-1.463Zm7.185-8.069-.239.241,1.291,1.454.192-.173.008-.008a1.147,1.147,0,0,0-.006-1.463.88.88,0,0,0-.648-.3A.867.867,0,0,0,13.406,1.459Z" transform="translate(1 1)" fill="#1c3ffd"></path>
                                            </g>
                                        </g>
                                    </svg>
                                </button>
                                <UncontrolledTooltip placement="bottom" target={`edit_patient_${patientInfo?.patientId}`}>
                                    Edit
                                </UncontrolledTooltip>
                            </div>
                            {(validate.isEmpty(patientInfo.relationship) || (validate.isNotEmpty(patientInfo.relationship) && patientInfo.relationship.relationshipType != 'SELF')) && <div>
                                <button className="btn btn-sm icon-hover btn-link" id={`delete_patient_${patientInfo?.patientId}`} onClick={(e) => handleRemove(e)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                        <g id="delete_black_icon_24px" transform="translate(-180.258 -281.937)">
                                            <rect id="Rectangle_12684" data-name="Rectangle 12684" width="18" height="18" rx="3" transform="translate(180.258 281.937)" fill="none"></rect>
                                            <g id="Group_34714" data-name="Group 34714" transform="translate(181.918 282.937)">
                                                <path id="Union_200" data-name="Union 200" d="M4.1,16a2.272,2.272,0,0,1-2.228-2.3V3.2H.536a.549.549,0,0,1,0-1.1H4.421V1.95A1.95,1.95,0,0,1,4.97.575,1.863,1.863,0,0,1,6.309,0H8.686a1.923,1.923,0,0,1,1.889,1.951V2.1H14.12a.549.549,0,0,1,0,1.1h-1V13.7A2.273,2.273,0,0,1,10.895,16ZM2.933,13.7A1.189,1.189,0,0,0,4.1,14.9h6.795a1.19,1.19,0,0,0,1.168-1.2V3.2H2.933ZM5.484,1.951l0,.153H9.514V1.951A.842.842,0,0,0,8.686,1.1H6.307A.846.846,0,0,0,5.484,1.951ZM9.843,13.643a.57.57,0,0,1-.538-.6V6.524a.567.567,0,0,1,.538-.548h.02a.566.566,0,0,1,.56.546v6.571a.568.568,0,0,1-.561.552Zm-2.368,0a.571.571,0,0,1-.538-.6V6.521a.559.559,0,1,1,1.118,0v6.571a.568.568,0,0,1-.56.552Zm-2.366,0a.571.571,0,0,1-.539-.6V6.521a.559.559,0,1,1,1.118,0v6.571a.568.568,0,0,1-.561.552Z" transform="translate(0 0)" fill="#e71c37">
                                                </path>
                                            </g>
                                        </g>
                                    </svg>
                                </button>
                                <UncontrolledTooltip placement="bottom" target={`delete_patient_${patientInfo?.patientId}`}>
                                    Delete
                                </UncontrolledTooltip>
                            </div>}
                        </div>}
                    </div>
                </div>
                </div>
            </div>
            {showConfirmationModal && <CommonConfirmationModal headerText={"Remove Patient"} isConfirmationPopOver={showConfirmationModal} setConfirmationPopOver={setShowConfirmationModal} message={`Are you sure to delete the patient ${patientInfo?.patientName}`} buttonText={"Remove"} onSubmit={() => props?.handleRemove(patientInfo)} />}
            {showEditPatientModal && <NewPatientForm openAddPatientflag={showEditPatientModal} setOpenAddPatientflag={(flag) => { setShowEditPatientModal(flag) }} patientInfo={patientInfo} handleEdit={(patient) => { props?.handleEdit(patient) }} isEdit={true} isLabs={props?.isLabs} setStackedToastContent = {setStackedToastContent}/>}
        </React.Fragment>
        : <React.Fragment>
            <div className="card card-hover-effects">
				<div className="card-body">
                    <p className="mb-0 font-weight-bold">{patientInfo?.patientName && patientInfo.patientName}</p>
                    <p className="mb-0 font-12 text-secondary mt-1">{patientInfo?.age ? `${patientInfo.age} Yrs / ` : ``}{patientInfo?.patientName ? `${getDisplayGender(patientInfo?.gender)}` : ``} {patientInfo?.doctorName ? <><span className="mx-2">|</span> Dr {patientInfo?.doctorName}</> : ``}</p>
				</div>
            </div>                            
        </React.Fragment>
    )
}
export default PatientCard