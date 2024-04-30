import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { getDisplayableAge, getGenderString } from "../../../../helpers/AgentAppHelper";
import Validate from "../../../../helpers/Validate";
import Checkbox from "../../common/checkBox";
import MemberForm from "./MemberForm";




const AddNewMemberDetailComponent=(props)=>{
    const initialCustomer={'patientName':'','dob':'','gender':'','relationship':'','kycType':'','kycRefNo':'','kycDocPath':'','mobile':''};
    let newMembers= props.newMembers;
    const [customer,setCustomer]=useState({...initialCustomer});
    const [selectedFile,setselectedFile]=useState(undefined);
    const [imagePath,setImagePath]=useState(undefined);
    const [alertData, setAlertData] = useState({});
    const [backDropLoader,setBackDropLoader]=useState(false);
    const [currentEditIndex,setCurrentEditIndex]= useState(-1);

    const addCustomer=(customer,index,file,imagePath)=>{
        props.addNewCustomer(customer,index,file,imagePath);
        setCustomer({...initialCustomer});
        setselectedFile(undefined);
        setImagePath(undefined);
        setCurrentEditIndex(-1);
        if(props.errorMap && props.errorMap[index]){
            props.removeErrorFromNewMemberList(index,false);
        }
    }

    const removeCustomer=(index)=>{
        props.removeCustomer(index);
        if(props.errorMap && props.errorMap[index]){
            props.removeErrorFromNewMemberList(index,true);
        }
    }

    const editCustomer = (member,index)=>{
        setselectedFile(props.newMembersFileList[index]);
        setImagePath(props.newMembersImagePathList[index]);
        setCustomer(member);
       
        setCurrentEditIndex(index);
    }
   
     const resetCustomer=(helpers)=>{
         setCustomer({...initialCustomer});
         setselectedFile(undefined);
         setImagePath(undefined);
         setCurrentEditIndex(-1);
         helpers.resetForm("addMembersToAddOn");
         helpers.updateValue('NONE','newMemberPhotoIDType',false);
     }
     
    const subscriptValue=(n) => {
        const values = ["st","nd","rd"]
        const index = (((n+90)%100-10)%10-1)
        if(index > 2) {
            return "th"
        } else{
            return values[index]
        }
    }

    
    return <React.Fragment>
        <div className="row">
            <div className="col">
                {newMembers && newMembers.map((member, index) => {
                    if(currentEditIndex === index){
                        return <MemberForm kycTypes={props.kycTypes} relations={props.relations} selectedFile={selectedFile} imagePath={imagePath} setBackDropLoader={setBackDropLoader} index={currentEditIndex} source={'newMember'} member={customer} saveCustomer={addCustomer} removeCustomer={resetCustomer} setIsFormEdit={props.setIsFormEdit} headers={props.headers} className={index !== newMembers.length - 1 && "mb-3"}/>
                    }
                    return <React.Fragment>

                        <div className={`card border card-hover p-12 ${index !== newMembers.length - 1  ? "mb-3" :""}`}>
                            <div className="h-100">
                                <div className="d-flex">
                                    <div class="form-check d-flex">
                                        <Checkbox checked id={index} name="PatientSelect" value={index} />
                                    </div>
                                    <div className="flex-fill">
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                <div className="flex-column">
                                                    <p className="font-14  mb-0">
                                                        {member.patientName}
                                                    </p>
                                                    {member.dob ? <p className="font-12 text-secondary">
                                                        {getDisplayableAge(member.dob)} / {getGenderString(member.gender)}
                                                    </p> : <></>}

                                                </div>
                                            </div>

                                            <div className="d-flex">
                                                <div>
                                                    <Button variant="link" className="icon-hover" onClick={() => editCustomer(member, index)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                            <g id="edit_black_icon_24px" transform="translate(-180.258 0)">
                                                                <rect id="Rectangle_12685" data-name="Rectangle 12685" width="18" height="18" rx="3" transform="translate(180.258 0)" fill="none" />
                                                                <g id="Group_34715" data-name="Group 34715" transform="translate(180.258 0)">
                                                                    <path id="Union_201" data-name="Union 201" d="M2.458,16.175A2.461,2.461,0,0,1,0,13.716V4.034a2.462,2.462,0,0,1,2.458-2.46H5.576a.537.537,0,0,1,0,1.075H2.456A1.393,1.393,0,0,0,1.073,4.037v9.679a1.394,1.394,0,0,0,1.38,1.39h9.679a1.392,1.392,0,0,0,1.391-1.39V10.6a.536.536,0,1,1,1.073,0v3.119a2.462,2.462,0,0,1-2.459,2.459Zm2.786-3.35a.943.943,0,0,1-.559-.491,1.141,1.141,0,0,1-.087-.79l.618-2.466a.635.635,0,0,1,.132-.269L12.6.649a1.859,1.859,0,0,1,2.821,0,2.468,2.468,0,0,1,0,3.173L8.191,11.979a.52.52,0,0,1-.247.153l-2.173.689-.279.041A.856.856,0,0,1,5.243,12.825Zm.978-3.3-.534,2.041,1.8-.549.021-.007L13.639,4.09l.057-.064-1.3-1.463Zm7.185-8.069-.239.241,1.291,1.454.192-.173.008-.008a1.147,1.147,0,0,0-.006-1.463.88.88,0,0,0-.648-.3A.867.867,0,0,0,13.406,1.459Z" transform="translate(1 1)" fill="#1c3ffd" />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button variant="link" className="icon-hover" onClick={() => removeCustomer(index)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                            <g id="delete_black_icon_24px" transform="translate(-180.258 -281.937)">
                                                                <rect id="Rectangle_12684" data-name="Rectangle 12684" width="18" height="18" rx="3" transform="translate(180.258 281.937)" fill="none" />
                                                                <g id="Group_34714" data-name="Group 34714" transform="translate(181.918 282.937)">
                                                                    <path id="Union_200" data-name="Union 200" d="M4.1,16a2.272,2.272,0,0,1-2.228-2.3V3.2H.536a.549.549,0,0,1,0-1.1H4.421V1.95A1.95,1.95,0,0,1,4.97.575,1.863,1.863,0,0,1,6.309,0H8.686a1.923,1.923,0,0,1,1.889,1.951V2.1H14.12a.549.549,0,0,1,0,1.1h-1V13.7A2.273,2.273,0,0,1,10.895,16ZM2.933,13.7A1.189,1.189,0,0,0,4.1,14.9h6.795a1.19,1.19,0,0,0,1.168-1.2V3.2H2.933ZM5.484,1.951l0,.153H9.514V1.951A.842.842,0,0,0,8.686,1.1H6.307A.846.846,0,0,0,5.484,1.951ZM9.843,13.643a.57.57,0,0,1-.538-.6V6.524a.567.567,0,0,1,.538-.548h.02a.566.566,0,0,1,.56.546v6.571a.568.568,0,0,1-.561.552Zm-2.368,0a.571.571,0,0,1-.538-.6V6.521a.559.559,0,1,1,1.118,0v6.571a.568.568,0,0,1-.56.552Zm-2.366,0a.571.571,0,0,1-.539-.6V6.521a.559.559,0,1,1,1.118,0v6.571a.568.568,0,0,1-.561.552Z" transform="translate(0 0)" fill="#e71c37" />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </Button>

                                                </div>
                                            </div>

                                        </div>
                                        <div>
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <div className="d-flex flex-column content-width">
                                                    <span className="font-12 text-secondary">Relationship</span>
                                                    <span className="font-14">{member.relationship.name}</span>
                                                </div>
                                                {Validate().isNotEmpty(member.kycType) && Validate().isNotEmpty(member.kycRefNo) &&<div className="d-flex flex-column content-width">
                                                    <span className="font-12 text-secondary">ID number</span>
                                                    <span className="font-14"> {member.kycRefNo}</span>
                                                </div>}
                                                {Validate().isNotEmpty(member.kycType) && <div className="d-flex flex-column content-width">
                                                    <span className="font-12 text-secondary">Photo ID Type</span>
                                                    <span className="font-14"> {member.kycType.kycName}</span>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {(props.errorMap && props.errorMap[index]) && <div className="ml-2 text-danger" >{props.errorMap[index]}</div>}
                            </div>
                        </div>

                    </React.Fragment>
                })}
                  {currentEditIndex === -1 && (newMembers && newMembers.length > 0) &&  ((props.maxMembers < 0) || (props.maxMembers > props.currentMembers)) && <p className="text-secondary mb-1 mt-3"> Adding <strong>{(newMembers && newMembers.length > 0 ) ? (newMembers.length+1) : 1}</strong> <sup>{(newMembers && newMembers.length > 0 ) ? subscriptValue(newMembers.length+1) : subscriptValue(1)}</sup>  Member Details</p>}
                {currentEditIndex === -1 && ((props.maxMembers < 0) || (props.maxMembers > props.currentMembers)) &&<MemberForm isAutoFocusRequired={(!newMembers || newMembers.length == 0)?true:false}  kycTypes={props.kycTypes} relations={props.relations} selectedFile={selectedFile} imagePath={imagePath} setBackDropLoader={setBackDropLoader} setAlertData={setAlertData} index={-1} source={'newMember'} member={customer} saveCustomer={addCustomer} removeCustomer={resetCustomer} setIsFormEdit={props.setIsFormEdit} headers={props.headers}/>}

            </div>
        </div>
        
                   
    </React.Fragment>
}

export default AddNewMemberDetailComponent;