import { CustomSpinners, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TabContent, TabPane } from 'reactstrap';
import { changeDOBFormatOfsuscribedMemberIds, checkIfSelectedKyCTypeExistsInVerifiedList, prepareKycObjectAndSaveIntoMember, setVerifiedKycTypeIntoMember, useMembers } from '../../../../helpers/AgentAppHelper';
import DateValidator from '../../../../helpers/DateValidator';
import Validate from '../../../../helpers/Validate';
import AgentAppService from '../../../../services/AgentApp/AgentAppService';
import { AGENT_UI } from '../../../../services/ServiceConstants';
import { BodyComponent, FooterComponent, Wrapper } from '../../../Common/CommonStructure';
import NavTabs from '../../common/NavTabs';
import { AgentAppContext, AlertContext } from '../../../Contexts/UserContext';
import SubscriptionMemberDetailComponent from '../SubscriptionMemberDetailComponent';
import AddNewMemberDetailComponent from './AddNewMemberDetail';

const AddMembersToSubscription = (props) => {

    const validate=Validate();
    const { tpaTokenId } = useContext(AgentAppContext);
    const agentAppService = AgentAppService(tpaTokenId);
    const dateValidator = DateValidator();
    const [kycTypes,setKycTypes] =useState(undefined);
    const [relations,setRelations]=useState(undefined);
    const [activeTab,setActiveTab]=useState('2');
    const [initialLoader,setInititalLoader] =useState(true);
    const [backDropLoader,setBackDropLoader]=useState(false);
    const [subcribedMemberIds , setSubcribedMemberIds] = useState([])
    const [currentMembers,setCurrentMembers] = useState(props.existingMembersCount);
    const maxMembers = props.plan.totalMaxAllowed;  
    const [hideFooter,setHideFooter]=useState(false);
    const [membersWithoutPhotoId, setMembersWithoutPhotoId] = useState([])
    const [tabId, setTabId] = useState('1')
    const headerRef = useRef();
    const footerRef = useRef();
    const { setToastContent } = useContext(AlertContext);
    const subscription = props.subscription;
    const [members,setMembers,selectedMemberIds,setSelectedMemberIds,selectedMembers,setSelectedMembers,newMembers,setNewMembers,
        newMembersImagePathList,setNewMembersImagePathList,newMembersFileList,setNewMembersFileList,existingMembersFileList,setExistingMembersFileList,
        existingMembersImagePath,setExistingMembersImagePath,newMembersErrorList,setNewMembersErrorList,existingMembersErrorMap,setExistingMembersErrorMap,
        addNewMember,removeNewCustomer,removeSelectedCustomer,setSelectedMembersIntoState,removeErrorFromSelectedMembers,removeErrorFromNewMemberList,
        currentEditMember,setCurrentEditMember,isFormEdit,setIsFormEdit
    ] = useMembers({});

    
    const handleTabId = (tabId) => {
        let numToString = tabId.toString();
        setTabId(numToString)
        if(numToString == '2'){
            handleAddNewDetails()
        } if (numToString == '1') {
            setHideFooter(false)
            setActiveTab('1')
        }
    }
    const tabs = [
        "Existing Members",
        "Add New Members",
    ]

    useEffect( ()=>{
        if(validate.isEmpty(subscription) || validate.isEmpty(subscription.id)){
            props.handleCancel();
        } 
        setInititalLoader(true);
        agentAppService.getMembers({subcriptionId:subscription.id,subscribedMembers:true}).then(data=>{
            if(data && "SUCCESS" == data.statusCode && validate.isNotEmpty(data.responseData)){
                if (validate.isNotEmpty(data.responseData.members)) {
                    let members = [...data.responseData.members]
                    changeDOBFormatOfsuscribedMemberIds(members)
                    setVerifiedKycTypeIntoMember(members, data.responseData.kycTypes);
                    setMembers(members);
                   let membersWithoutPhotoId = []
                   members.map(each => {
                       if (validate.isEmpty(each.verifiedKycTypes)) {
                           membersWithoutPhotoId.push(each.patientId)
                       }
                   })
                   setMembersWithoutPhotoId(membersWithoutPhotoId)
                   setActiveTab('1');
               }
                if (validate.isNotEmpty(data.responseData.suscribedMemberIds))
                    setSubcribedMemberIds(data.responseData.suscribedMemberIds)
                if (validate.isNotEmpty(data.responseData.kycTypes))
                    setKycTypes(data.responseData.kycTypes);
                if(validate.isNotEmpty(data.responseData.relations))
                    setRelations(data.responseData.relations);
               
            } else if(data && data.message && "NO_MEMBERS_FOUND" == data.message){
                if (validate.isNotEmpty(data.responseData.kycTypes))
                    setKycTypes(data.responseData.kycTypes);
                if (validate.isNotEmpty(data.responseData.relations))
                    setRelations(data.responseData.relations);
               
            }else{ 
                props.handleCancel();
            }
            setInititalLoader(false);
        });
    },[]);

    useEffect(()=>{
        let totalMembers =props.existingMembersCount;
        if(selectedMemberIds && selectedMemberIds.length > 0){
            totalMembers = totalMembers+selectedMemberIds.length;
        }
        if(newMembers && newMembers.length > 0){
            totalMembers= totalMembers+newMembers.length;
        }
        setCurrentMembers(totalMembers);

    },[selectedMemberIds,newMembers]);

    const checkAndSetMembersInState=(members,selectedMembers)=>{
        let selectedMembersList = [];
        selectedMembers.forEach(memberId=>{
            members.every(member=>{
                if(memberId == member.patientId){
                    selectedMembersList.push(member);
                    return false;
                }
                return true;
            });
        });
        setSelectedMembers(selectedMembersList);
    }

    const register=async ()=>{
        
        if(isFormEdit){
            setToastContent({toastMessage:`Please save or cancel pending member details`});
            return;
        }
        if(currentMembers <= props.existingMembersCount){
            setToastContent({toastMessage:"Please add or select members", position : TOAST_POSITION.BOTTOM_START});
            return;
        }
        if(validate.isNotEmpty(existingMembersErrorMap) || validate.isNotEmpty(newMembersErrorList)){
            return;
        }
        setBackDropLoader(true);
        let selectedMembersList =[]
        if(selectedMembers && selectedMembers.length > 0  ){
            selectedMembersList=JSON.parse(JSON.stringify(selectedMembers));//used for deep copy the state member list to change the format of date
        }
        let newMembersList =[]
        if(newMembers && newMembers.length > 0){
            newMembersList = JSON.parse(JSON.stringify(newMembers));
        }
        let allCustomers =[];
        
        if(selectedMembersList){
            allCustomers=[...allCustomers,...selectedMembersList];
        }
        if(newMembersList){
            allCustomers=[...allCustomers,...newMembersList];
        }
        allCustomers.map(customer=>{
            if(validate.isNotEmpty(customer.dob)){
                customer.dob=dateValidator.getDateObject(customer.dob);
            }
            if(validate.isNotEmpty(customer.kycType) && !checkIfSelectedKyCTypeExistsInVerifiedList(customer,customer.kycType)){
                prepareKycObjectAndSaveIntoMember(customer);
            }else{
                customer.kycs= null;
            }
        })
        
        let object={};
        object['planId']=subscription.plan.id;
        object['members']=allCustomers;
        object['subscriptionId']=subscription.id;
        saveMembers(object,"A");
    }

    const saveMembers=(object,processType)=>{
        agentAppService.saveMembers(object).then(data=>{
            if("SUCCESS" == data.statusCode){
                let members = data.responseData;
                let memberIds = [];
                if(members){
                    members.map(each=>{
                        if("SUCCESS" == each.status){
                            memberIds.push(each.member.patientId);
                        }
                    })
                }
                props.history.push(`${AGENT_UI}/orderReview/${processType}`)
            }else{
                if(validate.isNotEmpty(data.responseData)){
                    if("MEMBERS_ERROR" === data.message){
                        const keys = Object.keys(data.responseData);
                        let selectedMembersErrorMap = {};
                        let newMembersErrorList={};
                        keys.map(index =>{
                            if(selectedMemberIds && index < selectedMemberIds.length){
                                selectedMembersErrorMap[index]= data.responseData[index][0];
                            }
                            if((selectedMemberIds && index >= selectedMemberIds.length) || (!selectedMemberIds && index >= 0)){
                                let length = (selectedMemberIds)?selectedMemberIds.length:0;
                                if(index-length >= 0)
                                    newMembersErrorList[index-length]=data.responseData[index][0];
                            }
                        })
                        setNewMembersErrorList(newMembersErrorList);
                        setExistingMembersErrorMap(selectedMembersErrorMap)
                    }
                    if ("PLAN_SUBSCRIPTION_ERROR" == data.message) {
                        setToastContent({ toastMessage: data.responseData[0] });
                    }
                    if("MEMBER_EXCEPTION" == data.message){
                        setToastContent({ toastMessage:data.responseData });
                    }
                  setBackDropLoader(false);
                }else{
                    setToastContent({ toastMessage:'Unable to save details' });
                    setBackDropLoader(false);
                }
            }
        })

    }

    const handleAddNewDetails =()=>{
        if(maxMembers < 0 || (currentMembers < maxMembers) || (validate.isNotEmpty(newMembers) && newMembers.length > 0)){
            setActiveTab('2');
        }else{
            setToastContent({ toastMessage:"maximum members selected"});
        }
    }

    const deleteMember = (mId) =>{
        if(validate.isNotEmpty(mId)){
            agentAppService.deleteMember({memberId:mId,subscriptionId:subscription.id}).then(data=>{
                if(data && "SUCCESS" === data.statusCode){
                    let membersList =[...data.responseData];
                    if(validate.isNotEmpty(selectedMemberIds))
                        removeSelectedCustomer({"patientId":mId});
                    changeDOBFormatOfsuscribedMemberIds(membersList)
                    setVerifiedKycTypeIntoMember(membersList,kycTypes);
                    setMembers(membersList);
                    setActiveTab('1');
                    setToastContent({ toastMessage:"Member deleted successfully"});
                }else{
                    setToastContent({ toastMessage: data.message});
                }
            }).catch( error =>{
                console.log(error)
                setToastContent({ toastMessage: "Unable to delete member"});
            })
        }
    }

    if(initialLoader){
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
            <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand"/>
        </div>
        );
    }

    return <Wrapper>
        <BodyComponent className="body-height" allRefs={{ headerRef, footerRef }}>
        {backDropLoader?
                    <CustomSpinners spinnerText={"Add Members"} className={" page-loader"} innerClass={"invisible"} />
                    : ''}
            {validate.isNotEmpty(members) && members.length > 0 && <div className='card'>
                <NavTabs tabs={tabs} onTabChange={handleTabId} />
                <TabContent activeTab={tabId} className="p-12">
                    <TabPane tabId="1">
                        <div className='d-lg-flex flex-lg-wrap g-3'>
                            {(activeTab === '1') && members.map((member, index) => {
                                return(
                                    <div className={members.length !== index+1 ? 'mb-3':""}><SubscriptionMemberDetailComponent showCheckBox membersWithoutPhotoId={membersWithoutPhotoId} currentEditMember={currentEditMember} setCurrentEditMember={setCurrentEditMember} subcribedMemberIds={subcribedMemberIds} removeErrorFromSelectedMembers={removeErrorFromSelectedMembers} errorIndex={selectedMemberIds ? selectedMemberIds.indexOf(member.patientId) : undefined} errorInfo={(selectedMemberIds && selectedMemberIds.indexOf(member.patientId) > -1) && existingMembersErrorMap ? existingMembersErrorMap[selectedMemberIds.indexOf(member.patientId)] : undefined} currentMembers={currentMembers} maxMembers={maxMembers} setBackDropLoader={setBackDropLoader} existingMembersFileList={existingMembersFileList} existingMembersImagePath={existingMembersImagePath} relations={relations} member={member} isSelected={(selectedMemberIds && selectedMemberIds.indexOf(member.patientId) > -1)} removeSelectedCustomer={removeSelectedCustomer} setSelectedMembersIntoState={setSelectedMembersIntoState} kycTypes={kycTypes} index={index} deleteMember={deleteMember} setIsFormEdit={setIsFormEdit} headers={props.headers} /></div>
                                ) 
                            })}
                        </div>
                    </TabPane>
                    <TabPane tabId="2">
                    {(activeTab === '2') && <AddNewMemberDetailComponent removeErrorFromNewMemberList={removeErrorFromNewMemberList} errorMap={newMembersErrorList} currentMembers= {currentMembers} maxMembers={maxMembers} newMembersFileList={newMembersFileList} newMembersImagePathList={newMembersImagePathList} relations={relations} kycTypes={kycTypes} setHideFooter={setHideFooter} hideFooter={hideFooter} newMembers={newMembers} addNewCustomer={addNewMember} removeCustomer={removeNewCustomer} setIsFormEdit={setIsFormEdit} headers={props.headers}/>}
                    </TabPane>
                </TabContent>
            </div>}
            {(validate.isEmpty(members) || members.length == 0) && <AddNewMemberDetailComponent removeErrorFromNewMemberList={removeErrorFromNewMemberList} errorMap={newMembersErrorList} currentMembers= {currentMembers} maxMembers={maxMembers} newMembersFileList={newMembersFileList} newMembersImagePathList={newMembersImagePathList} relations={relations} kycTypes={kycTypes} setHideFooter={setHideFooter} hideFooter={hideFooter} newMembers={newMembers} addNewCustomer={addNewMember} removeCustomer={removeNewCustomer} setIsFormEdit={setIsFormEdit}  headers={props.headers} />}
        </BodyComponent>
        {!hideFooter && <FooterComponent ref={footerRef} className="p-12 border-top d-flex justify-content-end justify-content-lg-end">
            <button role="button" aria-label='Cancel' type="button" class="px-2 brand-secondary btn px-lg-4 me-2" onClick={() => { props.handleCancel() }}>Cancel</button>
            <button role="button" aria-label="Proceed To Verification" type="button" class="px-2 btn-brand btn px-lg-4 " onClick={register}>Proceed To Verification</button>
        </FooterComponent>}
    </Wrapper>
}

export default AddMembersToSubscription;
