import { useState } from 'react';
import DateValidator from './DateValidator';
import AgentAppService from "../services/AgentApp/AgentAppService";
import Validate from './Validate';

const validate = Validate();

export const checkIfSelectedKyCTypeExistsInVerifiedList =(customer,kycType)=>{
  let listOfVerifiedKycCustomers = customer.verifiedKycTypes;
  if(validate.isNotEmpty(listOfVerifiedKycCustomers) && listOfVerifiedKycCustomers.length > 0){
      return listOfVerifiedKycCustomers.indexOf(kycType.kycType) === -1? false:true
  }
  return false;
}

export const checkIfCurrentDateIsBetweenGivenDates = (startDate, endDate) => {
    if(validate.isEmpty(startDate) || validate.isEmpty(endDate)){
        return null;
    }
    const startingDate = new Date(startDate).getTime();
    const endingDate = new Date(endDate).getTime();
    const currentDate = new Date().getTime();
    return (currentDate >= startingDate && currentDate <= endingDate);
   
}

export const calculateAgeForCustomer= (dob)=>{
    let birthDate = new Date(`${dob.split("/")[2]}-${dob.split("/")[1]}-${dob.split("/")[0]}`);
    var today = new Date();
    let  age = today.getFullYear() - birthDate.getFullYear();
    let  m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;

}

export const prepareKycObjectAndSaveIntoMember=(customer)=>{
  if (validate.isNotEmpty(customer.kycType)) {
      let imageInfoList = {};
      let imageFile = {};
      let kycs = {};
      let attributes = {};
      attributes['attributeName'] = customer.kycType.attributes[0].attributeName;
      attributes['attributeValue'] = customer.kycRefNo;
      kycs['kycType'] = customer.kycType.kycType;
      kycs['attributes'] = [attributes];
      if(validate.isNotEmpty(customer.imageFile)){
          imageInfoList['imagePath'] = customer.imageFile.imagePath;
          imageInfoList['thumbnailPath'] = customer.imageFile.thumbnailPath;
          imageInfoList['originalImageName'] = customer.imageFile.originalImageName;
          imageInfoList['imageServerName'] = customer.imageFile.imageServerName;
          imageFile['imageInfoList'] = [imageInfoList];
          imageFile['imageServerName'] = customer.imageFile.imageServerName;
          kycs['imageFile'] = imageFile;
      }
      customer.kycs = [kycs];
  }
  delete customer.kycType;
  delete customer.kycRefNo;
  delete customer.imageFile;
  

}
export const isUpcomingSubscription = (subscription) => {
    const subscriptionStartDate = new Date(subscription.startDate);
    const todayDate = new Date();
    return subscriptionStartDate.getTime() - todayDate.getTime() > 0;
}

export const setVerifiedKycTypeIntoMember =(members,kycTypes) => {
    
  members.map(member => {
      if(validate.isNotEmpty(member) && validate.isNotEmpty(member.verifiedKycTypes) && member.verifiedKycTypes.length > 0) {
          let listOfVerifiedKycCustomers = member.verifiedKycTypes;
          kycTypes.every(kycType=>{
              if(listOfVerifiedKycCustomers[0] === kycType.kycType){
                  member.kycType =kycType;
                  return false;
              }
              return true;
          })
          
      }
  })
  
}

export const getPlanType = (plan) => {
    switch(plan.type.type){
        case "INDIVIDUAL" : return "I";
        case "ORGANIZATION" : return "O";
        case "INDIVIDUAL_COMBO" : return "IC";
        case "ORGANIZATION_COMBO" : return "OC";
        default : return null;
    }
}

export const getGenderString=(value)=>{
    switch (value) {
       case "M":return "Male";
       case "F": return "Female";
       case "O": return "Others";
       default :return "";
    }
}

export const getDisplayableAge = (dateString) => {
    if (validate.isEmpty(dateString)) {
        return "";
    }
    let age = DateValidator().getDateDifference(dateString);
    if (age.years == 0 && age.months == 0) {
        return age.days + " day(s)";
    } else if (age.years == 0) {
        return age.months + " month(s)";
    } else {
        return age.years + " years"
    }
}

export const AddMemberCheckBox = (props)=>{

    return(
        <label className="" for={props.id}>
        <input type="checkbox" name="addMore" id={props.id} checked={props.isAddMembers} onChange={() => props.toggleAddMembers()} />
        <span className="checkmark" ></span>
        <span>
        Add Member
        </span>
    </label>
    );
}

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

export const changeDOBFormatOfsuscribedMemberIds = (members) =>{
    const dateValidator = DateValidator();
    members.map((member)=>{
        if(validate.isNotEmpty(member) && validate.isNotEmpty(member.dob)){
            member.dob = dateValidator.getDateFormat(member.dob);
        }
    })
  }
 

export const getStaticContent=(searchKey)=>{
    let content = undefined;
    let contentLoading = false;
    if(validate.isEmpty(searchKey)){
        return {contentLoading,content};
    }
    contentLoading = true
    AgentAppService().getStaticContent({searchKey:searchKey}).then(response=>{
        if(response.statusCode=="SUCCESS" && validate.isNotEmpty(response?.responseData)){
            content = response.responseData;
        }
        contentLoading = false;
    }).catch(error=>{
        console.log(error);
        contentLoading = false;
    })
    return {contentLoading,content};
}

export const parseHtmlResponse = (rawHtml, history) =>{
    try{
        if(rawHtml && rawHtml !== ""){
            let parser = new DOMParser();
            let rawHtmlData = parser.parseFromString(rawHtml, 'text/html');
            let anchorList = rawHtmlData.getElementsByTagName("a");
            // window.faqRedirect = (url) => {handleManualRedirect(url,history)};
            if(anchorList && anchorList.length){
                for(let i = 0 ; i < anchorList.length; i++){
                    let each = anchorList[i];
                    let href = each.href;
                    each.href = `javascript:void(0);`;
                    each.removeAttribute("target");
                    each.setAttribute('onclick', `faqRedirect('${`${href}`}')`);
                }
            }
            rawHtml = rawHtmlData.body.innerHTML
        }
    }catch(err){
        console.log(err);
    }
    return rawHtml;
}

export const getFileNameByType=(type)=>{
    switch(type){
        case "image/gif" :
            return "photoId.gif"
        case "image/jpeg" :
            return "photoId.jpeg"
        case "image/png" :
            return "photoId.png"
        case "application/pdf" :
            return "photoId.pdf"
        default :
            return "photoId.jpeg"
    }
}

export const getFileName = (name) => {
    let replacedNameString = undefined;
    if (name) {
        if (name.indexOf("+") != -1) {
            let nameArray = name.split("\+");
            if (nameArray.length > 1) {
                name = nameArray[0] + "+" + nameArray[1];
            }
        }
        replacedNameString = name.replace(/%/g, "percent")
            .replace(/\+/g, "-and-").replace(/&/g, "-n-")
            .replace(/[^a-zA-Z0-9.]/g, "-").replace(/-+/g, "-");
    }
    return replacedNameString;
}

export const closeChromeTab = () => {
    window.location.href="medplusagentapp://";
} 

export const reverseFormatDate = (inputDate) => {
    const parts = inputDate.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);

    // Format the date as "yyyy-MM-dd"
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const formattedDate = localDate.toISOString().split('T')[0];
    return formattedDate;
  };