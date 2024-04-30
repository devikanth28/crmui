import { useState } from "react";
import Validate from "../../../../helpers/Validate";


export const useMembers = (props) => {


    const [members,setMembers] = useState(undefined);

    const [selectedMemberIds,setSelectedMemberIds]=useState(undefined);

    const [selectedMembers,setSelectedMembers]=useState(undefined); 

    const [newMembers,setNewMembers] =useState(undefined);

    const [newMembersImagePathList,setNewMembersImagePathList]=useState([]); 
   
    const [newMembersFileList,setNewMembersFileList]=useState([]);
   
    const [existingMembersFileList,setExistingMembersFileList]=useState({});
   
    const [existingMembersImagePath,setExistingMembersImagePath]=useState({});
    
    const [newMembersErrorList,setNewMembersErrorList]=useState({});
    
    const [existingMembersErrorMap,setExistingMembersErrorMap]=useState({});

    const [currentEditMember,setCurrentEditMember]= useState(undefined);
   
    const [isFormEdit,setIsFormEdit] = useState(false);

    const validate = Validate();



    const addNewMember=(member,index,file,imagePath)=>{
        let membersList =[];
        let imagePathList=[];
        let imagefileList=[];
        if(newMembers){
            membersList=[...newMembers];
            imagePathList=[...newMembersImagePathList];
            imagefileList=[...newMembersFileList];
        }
        if(index < 0){
            membersList.push(member);
            imagePathList.push(imagePath);
            imagefileList.push(file);
        }else{
            membersList[index]=member;
            imagePathList[index]=imagePath;
            imagefileList[index]=file;
        }
       
        setNewMembersFileList(imagefileList);
        setNewMembersImagePathList(imagePathList);
        setNewMembers(membersList);
    }


    const removeNewCustomer=(index)=>{
        let memberList=[...newMembers];
        let imagePathList=[...newMembersImagePathList];
        let imagefileList=[...newMembersFileList];
        memberList.splice(index,1);
        imagePathList.splice(index,1);
        imagefileList.splice(index,1);
        setNewMembers(memberList);
        setNewMembersFileList(imagefileList);
        setNewMembersImagePathList(imagePathList);
    }


    const removeSelectedCustomer=(customer)=>{
        let indexToRemove =selectedMemberIds.indexOf(customer.patientId);
        if(indexToRemove >= 0){
            let selectMemberIdsFromState = [...selectedMemberIds];
            let selectMembersFromState=[...selectedMembers];
            selectMembersFromState.splice(indexToRemove,1);
            selectMemberIdsFromState.splice(indexToRemove,1);
            setSelectedMembers(selectMembersFromState);
            setSelectedMemberIds(selectMemberIdsFromState);
           
        }
    }

    const setSelectedMembersIntoState =(customer,index,file,imagePath)=>{
        let selectedMembersFromState = [];
        if(selectedMembers){
            selectedMembersFromState=[...selectedMembers]
        }
        let selectedMemberIdsFromState =[];
        if(selectedMemberIds)
            selectedMemberIdsFromState =[...selectedMemberIds];
        let indexOfCustomer = selectedMemberIdsFromState.indexOf(customer.patientId);
        if(indexOfCustomer === -1){
            selectedMembersFromState.push(customer);
            selectedMemberIdsFromState.push(customer.patientId);
        }else{
            selectedMembersFromState[indexOfCustomer]=customer;
        }
        let membersFromState=[...members];
        membersFromState[index]=customer;
        if(file){
            let imagefileListMap = {...existingMembersFileList};
            let existingImagePathList={...existingMembersImagePath};
            imagefileListMap[customer.patientId]=file;
            existingImagePathList[customer.patientId]=imagePath;
            setExistingMembersFileList(imagefileListMap);
            setExistingMembersImagePath(existingMembersImagePath);
        }
        setMembers(membersFromState);
        setSelectedMembers(selectedMembersFromState);
        setSelectedMemberIds(selectedMemberIdsFromState);
       
       
    }

    const removeErrorFromSelectedMembers=(index,isRemove)=>{
        if(validate.isNotEmpty(existingMembersErrorMap)){
            let errorMap = {...existingMembersErrorMap};
             delete errorMap[index];
             let tempMap ={};
           if(isRemove && validate.isNotEmpty(errorMap) && Object.keys(errorMap).length > 0){
               Object.keys(errorMap).forEach(item=>{
                   if(item < index){
                       tempMap[item]=errorMap[item];
                   }else if(item > index){
                    tempMap[item-1]=errorMap[item];
                   }
               })
           }
           if(isRemove){
            setExistingMembersErrorMap(tempMap);
           }else{
            setExistingMembersErrorMap(errorMap);
           }
             
        }
    }

    const removeErrorFromNewMemberList =(index,isRemove)=>{
        if(validate.isNotEmpty(newMembersErrorList)){
            let errorMap = {...newMembersErrorList};
             delete errorMap[index];
             let tempMap ={};
           if(isRemove && validate.isNotEmpty(errorMap) && Object.keys(errorMap).length > 0){
               Object.keys(errorMap).forEach(item=>{
                   if(item < index){
                       tempMap[item]=errorMap[item];
                   }else if(item > index){
                    tempMap[item-1]=errorMap[item];
                   }
               })
           }
           if(isRemove)
                setNewMembersErrorList(tempMap);
            else
                setNewMembersErrorList(errorMap);
        }

    }



    return [members,setMembers,selectedMemberIds,setSelectedMemberIds,selectedMembers,setSelectedMembers,newMembers,setNewMembers,
            newMembersImagePathList,setNewMembersImagePathList,newMembersFileList,setNewMembersFileList,existingMembersFileList,setExistingMembersFileList,
            existingMembersImagePath,setExistingMembersImagePath,newMembersErrorList,setNewMembersErrorList,existingMembersErrorMap,setExistingMembersErrorMap,
            addNewMember,removeNewCustomer,removeSelectedCustomer,setSelectedMembersIntoState,removeErrorFromSelectedMembers,removeErrorFromNewMemberList,
            currentEditMember,setCurrentEditMember,isFormEdit,setIsFormEdit
        ]
}