import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { getDisplayableAge, getGenderString } from '../../../helpers/AgentAppHelper';
import Validate from '../../../helpers/Validate';
import Checkbox from '../common/checkBox';
import MemberForm from './AddMembers/MemberForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const SubscriptionMemberDetailComponent = React.forwardRef((props,ref) => {

  const validate=Validate();
  const [alertData, setAlertData] = useState({});
  const currentEditMember=props.currentEditMember;
  const [openConfirmationModel, setOpenConfirmationModel] = useState(false);
  const suscribedMemberIds = props.subcribedMemberIds ? props.subcribedMemberIds: []
  const membersWithoutPhotoId = props.membersWithoutPhotoId ? props.membersWithoutPhotoId : []
  
  const editCustomerSelection = ()=>{
    props.setIsFormEdit(true);
     props.setCurrentEditMember(props.member.patientId);

 }


 const toggleDeleteConfirmationModel = () => {
  setOpenConfirmationModel(!openConfirmationModel);
}

const deleteMember = ()=>{
    props.deleteMember(props.member.patientId);
    toggleDeleteConfirmationModel()
}


const validateTheCustomer=(customer)=>{
  if(validate.name(customer.patientName)){
      return false;
  }
  if(validate.isEmpty(customer.dob)){
      return false;
  }
  if(validate.isEmpty(customer.gender)){
      return false;
  }
  if(validate.isEmpty(customer.relationship)){
      return false;
  } 
 
  
  return true;
}

const saveCustomer=(customer,index,file,imagePath)=>{
  if(props.errorInfo){
      props.removeErrorFromSelectedMembers(props.errorIndex,false);
  }
  props.setSelectedMembersIntoState(customer,index,file,imagePath);
  props.setCurrentEditMember(undefined);
}

const editSelectionOfCustomer=()=>{
  if(props.isSelected){
      if(props.errorInfo){
          props.removeErrorFromSelectedMembers(props.errorIndex,true);

      }
      props.removeSelectedCustomer(props.member);
  }else{
      if(props.maxMembers <=  0  || (props.maxMembers > props.currentMembers)){
          if(validateTheCustomer(props.member)){
              saveCustomer(props.member,props.index);
              props.setIsFormEdit(false);
          }else{
              props.setIsFormEdit(true);
              props.setCurrentEditMember(props.member.patientId);
          }
      }else{
          setAlertData({message:`maximum members allowed are ${props.maxMembers} please unselect one member to select this member`,type:'danger'})
      }
     
  }
}

const removeCurrentEditMember=(helpers)=>{
  props.setCurrentEditMember(undefined);
}

function handleCardClick(restrictEdit, restrictDelete) {
    if (!(suscribedMemberIds.includes(props.member.patientId)) && !restrictEdit && !restrictDelete) {
        editCustomerSelection();
    }
  }

  return <React.Fragment>
    {currentEditMember && (currentEditMember === props.member.patientId) && <MemberForm editCustomerSelection={editCustomerSelection()} ref={ref} setBackDropLoader={props.setBackDropLoader} selectedFile={(props.existingMembersFileList) ? props.existingMembersFileList[props.member.patientId] : undefined} imagePath={props.existingMembersImagePath ? props.existingMembersImagePath[props.member.patientId] : undefined} setAlertData={setAlertData} source={'existingPatient'} member={props.member} index={props.index} saveCustomer={saveCustomer} removeCustomer={removeCurrentEditMember} relations={props.relations} kycTypes={props.kycTypes} addPhotoIdForSubscribedMember={suscribedMemberIds.includes(props.member.patientId) && membersWithoutPhotoId.includes(props.member.patientId)} setIsFormEdit={props.setIsFormEdit} headers={props.headers}/>}
    {(validate.isEmpty(currentEditMember) || (currentEditMember !== props.member.patientId)) && 
             <div className="card border card-hover p-12" onClick={() => handleCardClick(props.restrictEdit, props.restrictDelete)}>
                <div className="h-100">
                    <div className="d-flex">
                        {props.showCheckBox && <div class="form-check d-flex">
                        <Checkbox checked={props.isSelected} id={props.member.patientId} name="PatientSelect" value="PatientDetails"  onChange={editSelectionOfCustomer} />
                            </div>
                        }
                        <div className="flex-fill">
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-row">
                                    <div className="flex-column">
                                        <p className="font-14  mb-0">
                                        {props.member.patientName}
                                        </p>
                                       {(props.member.dob && props.member.gender) ? <p className="font-12 text-secondary">
                                       {getDisplayableAge(props.member.dob)} / {getGenderString(props.member.gender)}
                                        </p> :
                                        (props.member.gender) ?<p className="font-12 text-secondary">
                                         {getGenderString(props.member.gender)}
                                         </p>: <></>}
                                    </div>
                                </div>

                              <div className="d-flex">
                                  {(suscribedMemberIds.includes(props.member.patientId)) ?
                                      membersWithoutPhotoId.includes(props.member.patientId) ?
                                      <Button variant="link" className="icon-hover"onClick={() => editCustomerSelection(props.member.patientId)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                                                <g id="photo-id-icn-16" transform="translate(-180.258 -387.452)">
                                                 <rect id="Rectangle_3299" data-name="Rectangle 3299" width="16" height="16" rx="3" transform="translate(180.258 387.452)" fill="none"/>
                                                <path id="photo-id-icn" d="M2,4.907V2.313A.312.312,0,0,1,2.313,2H4.907a.313.313,0,0,1,0,.625H2.625V4.907a.313.313,0,0,1-.625,0ZM13.688,2H11.093a.313.313,0,0,0,0,.625h2.282V4.907a.313.313,0,0,0,.625,0V2.313A.312.312,0,0,0,13.688,2Zm0,8.78a.312.312,0,0,0-.312.313v2.282H11.093a.313.313,0,0,0,0,.625h2.595A.312.312,0,0,0,14,13.688V11.093a.312.312,0,0,0-.312-.312Zm-8.78,2.595H2.625V11.093a.313.313,0,0,0-.625,0v2.595A.312.312,0,0,0,2.313,14H4.907a.313.313,0,0,0,0-.625Zm-.054-1.743a.242.242,0,0,0,.242.242H10.9a.242.242,0,0,0,.242-.242V10.026A1.815,1.815,0,0,0,9.332,8.211H6.669a1.815,1.815,0,0,0-1.815,1.815ZM8,7.635A1.755,1.755,0,1,0,6.246,5.88,1.757,1.757,0,0,0,8,7.635Z" transform="translate(180.258 387.452)" fill="#1c3ffd"/>
                                                </g>
                                                </svg>
                                    </Button> : <></>
                                      : !props.restrictEdit && <div>
                                          <Button variant="link" className="icon-hover" onClick={() => editCustomerSelection(props.member.patientId)}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                  <g id="edit_black_icon_24px" transform="translate(-180.258 0)">
                                                      <rect id="Rectangle_12685" data-name="Rectangle 12685" width="18" height="18" rx="3" transform="translate(180.258 0)" fill="none" />
                                                      <g id="Group_34715" data-name="Group 34715" transform="translate(180.258 0)">
                                                          <path id="Union_201" data-name="Union 201" d="M2.458,16.175A2.461,2.461,0,0,1,0,13.716V4.034a2.462,2.462,0,0,1,2.458-2.46H5.576a.537.537,0,0,1,0,1.075H2.456A1.393,1.393,0,0,0,1.073,4.037v9.679a1.394,1.394,0,0,0,1.38,1.39h9.679a1.392,1.392,0,0,0,1.391-1.39V10.6a.536.536,0,1,1,1.073,0v3.119a2.462,2.462,0,0,1-2.459,2.459Zm2.786-3.35a.943.943,0,0,1-.559-.491,1.141,1.141,0,0,1-.087-.79l.618-2.466a.635.635,0,0,1,.132-.269L12.6.649a1.859,1.859,0,0,1,2.821,0,2.468,2.468,0,0,1,0,3.173L8.191,11.979a.52.52,0,0,1-.247.153l-2.173.689-.279.041A.856.856,0,0,1,5.243,12.825Zm.978-3.3-.534,2.041,1.8-.549.021-.007L13.639,4.09l.057-.064-1.3-1.463Zm7.185-8.069-.239.241,1.291,1.454.192-.173.008-.008a1.147,1.147,0,0,0-.006-1.463.88.88,0,0,0-.648-.3A.867.867,0,0,0,13.406,1.459Z" transform="translate(1 1)" fill="#1c3ffd" />
                                                      </g>
                                                  </g>
                                              </svg>
                                          </Button>
                                      </div>}
                                  <div>
                                      {!(suscribedMemberIds.includes(props.member.patientId)) && !props.restrictDelete && <Button variant="link" className="icon-hover" onClick={(e) => toggleDeleteConfirmationModel(e)}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                              <g id="delete_black_icon_24px" transform="translate(-180.258 -281.937)">
                                                  <rect id="Rectangle_12684" data-name="Rectangle 12684" width="18" height="18" rx="3" transform="translate(180.258 281.937)" fill="none" />
                                                  <g id="Group_34714" data-name="Group 34714" transform="translate(181.918 282.937)">
                                                      <path id="Union_200" data-name="Union 200" d="M4.1,16a2.272,2.272,0,0,1-2.228-2.3V3.2H.536a.549.549,0,0,1,0-1.1H4.421V1.95A1.95,1.95,0,0,1,4.97.575,1.863,1.863,0,0,1,6.309,0H8.686a1.923,1.923,0,0,1,1.889,1.951V2.1H14.12a.549.549,0,0,1,0,1.1h-1V13.7A2.273,2.273,0,0,1,10.895,16ZM2.933,13.7A1.189,1.189,0,0,0,4.1,14.9h6.795a1.19,1.19,0,0,0,1.168-1.2V3.2H2.933ZM5.484,1.951l0,.153H9.514V1.951A.842.842,0,0,0,8.686,1.1H6.307A.846.846,0,0,0,5.484,1.951ZM9.843,13.643a.57.57,0,0,1-.538-.6V6.524a.567.567,0,0,1,.538-.548h.02a.566.566,0,0,1,.56.546v6.571a.568.568,0,0,1-.561.552Zm-2.368,0a.571.571,0,0,1-.538-.6V6.521a.559.559,0,1,1,1.118,0v6.571a.568.568,0,0,1-.56.552Zm-2.366,0a.571.571,0,0,1-.539-.6V6.521a.559.559,0,1,1,1.118,0v6.571a.568.568,0,0,1-.561.552Z" transform="translate(0 0)" fill="#e71c37" />
                                                  </g>
                                              </g>
                                          </svg>
                                      </Button>}

                                  </div>
                              </div>

                          </div>
                          <div>
                              <div className="d-flex flex-wrap justify-content-between">
                                  {props.member.relationship && <div className="d-flex flex-column content-width">
                                      <span className="font-12 text-secondary">Relationship</span>
                                      <span className="font-14">{props.member.relationship.name}</span>
                                  </div>}
                                  {props.member.kycType && <div className="d-flex flex-column content-width">
                                      <span className="font-12 text-secondary">Photo ID Type</span>
                                      <span className="font-14">{props.member.kycType.kycName}</span>
                                  </div>}
                                  {props.member.kycRefNo && <div className="d-flex flex-column content-width">
                                      <span className="font-12 text-secondary">ID number</span>
                                      <span className="font-14">{props.member.kycRefNo}</span>
                                  </div>}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              {props.errorInfo && <div className="ml-2 text-danger" >{props.errorInfo}</div>}
          </div>}
            <DeleteConfirmationModal isOpen={openConfirmationModel} toggle = {toggleDeleteConfirmationModel} onDelete ={deleteMember}/>
  </React.Fragment>
})

export default SubscriptionMemberDetailComponent
