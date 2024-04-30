import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useEffect, useState } from 'react';
import { photoIdInputMaxLength } from '../../../../constants/AgentAppConstants';
import { calculateAgeForCustomer, checkIfSelectedKyCTypeExistsInVerifiedList, getDisplayableAge, getGenderString, reverseFormatDate } from '../../../../helpers/AgentAppHelper';
import DateValidator from '../../../../helpers/DateValidator';
import Validate from '../../../../helpers/Validate';
import { MA_API_URL } from '../../../../services/ServiceConstants';
import UploadPhotoProof from '../../common/UploadPhotoProof';
import Checkbox from '../../common/checkBox';

const MemberForm = React.forwardRef(({helpers, ref,...props }) => {

    const initialMember = { 'patientName': '', 'dob': '', 'gender': '', 'relationship': '', 'kycType': '', 'kycRefNo': '', 'kycDocPath': '', 'mobile': '' };
    const validate = Validate();
    const dateValidator = DateValidator();
    const [errorMsg, setErrorMsg] = useState({});
    const [customer, setCustomer] = useState(props.member ? props.member : initialMember);
    const [selectedFile, setselectedFile] = useState(props.selectedFile ? props.selectedFile : undefined);
    const [imagePath, setImagePath] = useState(props.imagePath ? props.imagePath : undefined);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [progressLoader, setProgressLoader] = useState(false);
    const [showDocumentUpload, setShowDocumentUpload] = useState(false)
    const [percentageCompleted, setPercentCompleted] = useState(0);

    useEffect(() => {
        setCustomer(props.member);
        setselectedFile(props.selectedFile);
        setImagePath(props.imagePath);
    }, [props.member])

    useEffect(() => {
        if (validateTheMember(customer)) {
            setIsSaveDisabled(false);
        } else {
            setIsSaveDisabled(true);
        }

    }, [customer, selectedFile]);

    const handleUploadFile = (file, uploadedImageObject) => {
        setselectedFile(file);
        setImagePath(uploadedImageObject);
        let customerObj = { ...customer };
        customerObj.imageFile = uploadedImageObject;
        setCustomer(customerObj);
    }

    const validateTheMember = (member) => {
        if (validate.name(member.patientName)) {
            return false;
        }
        if (dateValidator.validateDate(member.dob)) {
            return false;
        }
        if (validate.isEmpty(member.gender)) {
            return false;
        }
        if (validate.isEmpty(member.relationship)) {
            return false;
        }
        if (props.addPhotoIdForSubscribedMember && validate.isEmpty(member.kycType)) {
            return false
        }
        if (validate.isNotEmpty(member.kycType)) {
            if (!checkIfSelectedKyCTypeExistsInVerifiedList(props.member, customer.kycType) && validatePhotoIdNumber(member.kycRefNo)) {
            return false;
        }
        }

        return true;
    }

    const handleInputChange = (event) => {
        let feildName = event.target.id;
        let errMsg = validateInputs(event);
        if (errMsg) {
            let errMessage = { ...errorMsg, [feildName]: errMsg }
           setErrorMsg(errMessage);
            helpers.updateErrorMessage(errMsg,feildName);
        } else {
            let errMessage = { ...errorMsg, [feildName]: '' }
           setErrorMsg(errMessage);
            helpers.updateErrorMessage("",feildName);
        }
    }

    const validatePhotoIdNumber = (value) => {
        if (validate.isEmpty(customer.kycType)) {
            return "Select photo ID";
        }
        switch (customer.kycType.kycType) {
            case "AADHAAR_CARD": return validateAadhaarCardNo(value);
            case "PAN_CARD": return validate.panCardNo(value);
            case "DRIVING_LICENSE": return validate.drivingLicense(value);
            case "PASSPORT": return validate.passport(value);
            case "PENSION_PASSBOOK": return validate.pensionPassbook(value);
            case "NPR_SMART_CARD": return validate.nprSmartCard(value);
            case "VOTER_ID": return validate.voterId(value);
            default: return validate.isEmpty(value);
        }

    }
    const validateAadhaarCardNo = (aadhaarCardNo) => {
        var errorMsg;
        if (validate.isEmpty(aadhaarCardNo) || !validate.isNumeric(aadhaarCardNo)) {
            errorMsg = "Please enter a valid Aadhaar card number.";
        } else if (aadhaarCardNo.trim().length != 12) {
            errorMsg = "Aadhaar card number must be 12 digits.";
        } else {
            errorMsg = undefined;
        }
        return errorMsg;
    }



    const validateInputs = (e) => {
        if (e.target.id.indexOf('newMemberName') > -1) {
            return validate.name(e.target.value, "Name", 30);
        } else if (e.target.id.indexOf('dobNewMember') > -1) {
            return dateValidator.validateDate(e.target.value);
        } else if (e.target.id.indexOf('newMemberPhotoIDNumber') > -1) {
            return validatePhotoIdNumber(e.target.value);
        } else if (e.target.id.indexOf('mobileNumberNewMember') > -1) {
            return validate.mobileNumber(e.target.value);
        }
    }
    const handleOnChange = (payload) => {
        const event = payload[0]
        handleInputChange(event);
        let maxLength = event.target.maxLength;
        if (maxLength && event.target.value.length > maxLength) {
            return;
        } else if (event.target.id == "newMemberName" && validate.isNotEmpty(event.target.value) && !validate.isAlphaWithSpace(event.target.value)) {
            return;
        } else {
            let customerStateObject = { ...customer };

            if (event.target.id === 'newMemberName') {
                customerStateObject.patientName = event.target.value;
            }
            if (event.target.id === 'dobNewMember') {
                customerStateObject.dob = event.target.value;
            }
            if (event.target.id === 'mobileNumberNewMember') {
                customerStateObject.mobile = event.target.value;
            }
            checkIfFormIsPartiallyFilled(customerStateObject);
            setCustomer(customerStateObject);
        }
    }

    const checkIfFormIsPartiallyFilled = (member) => {
        let isPartiallyFilled = false;
        if (validate.isNotEmpty(member.patientName)) {
            isPartiallyFilled = true;
        } else if (validate.isNotEmpty(member.dob)) {
            isPartiallyFilled = true;
        } else if (validate.isNotEmpty(member.gender)) {
            isPartiallyFilled = true;
        } else if (validate.isNotEmpty(member.relationship)) {
            isPartiallyFilled = true;
        } else if (validate.isNotEmpty(member.kycType)) {
            isPartiallyFilled = true;
        }
        if (isPartiallyFilled) {
            props.setIsFormEdit(true);
        } else {
            props.setIsFormEdit(false);
        }


    }

    const validateMember = () => {
        if (validate.name(customer.patientName)) {
            let errMessage = { ...errorMsg, 'newMemberName': `please enter valid name` }
            setErrorMsg(errMessage);
            helpers.updateErrorMessage(`please enter valid name`,'newMemberName');
            return false;
        }
        if (dateValidator.validateDate(customer.dob)) {
            let errMessage = { ...errorMsg, 'dobNewMember': dateValidator.validateDate(customer.dob) }
            setErrorMsg(errMessage);
            helpers.updateErrorMessage(dateValidator.validateDate(customer.dob),'dobNewMember');
            return false;
        }
        if (validate.isEmpty(customer.gender)) {
            helpers.updateErrorMessage("Please select gender", 'gender');
            return false;
        }
        if (validate.isEmpty(customer.relationship)) {
            helpers.updateErrorMessage("Please select relationship", 'relationship');
            return false;
        }
        if (validate.isNotEmpty(customer.kycType)) {
            if (!checkIfSelectedKyCTypeExistsInVerifiedList(props.member, customer.kycType) && validatePhotoIdNumber(customer.kycRefNo)) {
                let errMessage = { ...errorMsg, 'newMemberPhotoIDNumber': `please enter valid ${customer.kycType.kycName}` }
            setErrorMsg(errMessage);
                helpers.updateErrorMessage(`please enter valid ${customer.kycType.kycName}`, 'newMemberPhotoIDNumber');
            return false;

        }
    }

        return true;
    }

    const setGenderIntoCustomer = (value) => {
        let memberObject = { ...customer };
        memberObject.gender = value;
        setCustomer(memberObject);
       props.setIsFormEdit(true);
    }

    const setRelation = (value) => {
        let memberObject = { ...customer };
        memberObject.relationship = value;
        setCustomer(memberObject);
        props.setIsFormEdit(true);

    }


    const updateKycType = (kycType) => {
        let memberObject = { ...customer };
        if (validate.isEmpty(kycType) || (validate.isNotEmpty(memberObject.kycType) && memberObject.kycType.kycType !== kycType.kycType)) {
            memberObject.kycRefNo = '';
            setselectedFile(undefined);
            setImagePath(undefined);
            let customerObj = { ...customer };
            customerObj.imageFile = undefined;
            setCustomer(customerObj);
            let errorMessage = { ...errorMsg, ['newMemberPhotoIDNumber']: '' }
            setErrorMsg(errorMessage);
            if(validate.isNotEmpty(helpers)){
                helpers.updateErrorMessage("", 'newMemberPhotoIDNumber');
            }
        }
        memberObject.kycType = kycType;
        setCustomer(memberObject);
    }


    const saveMember = () => {
        if (!validateMember()) {
            return;
        }
        //calculate the age based on year entered and save in customer.age value
        let memberObject = { ...customer };
        let age = calculateAgeForCustomer(memberObject.dob);
        memberObject.age = age;
        props.saveCustomer(memberObject, props.index, selectedFile, imagePath);
        props.setIsFormEdit(false);
        helpers.resetForm("addMembersToAddOn")
        setShowDocumentUpload(false)
        helpers.hideElement("newMemberPhotoIDNumber")
        helpers.updateValue('NONE','newMemberPhotoIDType',false);

    }


    const removeCustomer = () => {
        props.removeCustomer(helpers);
        props.setIsFormEdit(false);

    }

    const handleInputDateChange = (payload) => {
        const date = payload[0].target.value
        let customerStateObject = { ...customer };
        let feildName = "dobNewMember"
        if (date) {
            const formattedDate = formatDate(date);
            let errMsg = dateValidator.validateDate(formattedDate);
            if (errMsg) {
                let errMessage = { ...errorMsg, [feildName]: errMsg }
                setErrorMsg(errMessage);
                helpers.updateErrorMessage(errMsg,feildName);
            } else {
                let errMessage = { ...errorMsg, [feildName]: '' }
                setErrorMsg(errMessage);
                helpers.updateErrorMessage("",feildName);
            }
            customerStateObject.dob = formattedDate
        }else{
            let errMessage = { ...errorMsg, [feildName]: "Invalid date" }
            setErrorMsg(errMessage);
            helpers.updateErrorMessage("Invalid date", feildName);
            customerStateObject.dob = date
        }
        checkIfFormIsPartiallyFilled(customerStateObject);
        setCustomer(customerStateObject);

    }

    const handleInputPhotoIdChange = (payload) =>{
        const event = payload[0]
        let errMsg = validateInputs(event);
        if (errMsg) {
            let errMessage = { ...errorMsg, ["newMemberPhotoIDNumber"]: errMsg }
           setErrorMsg(errMessage);
            helpers.updateErrorMessage(errMsg,"newMemberPhotoIDNumber");
        }else {
            let errMessage = { ...errorMsg, ["newMemberPhotoIDNumber"]: '' }
           setErrorMsg(errMessage);
            helpers.updateErrorMessage("","newMemberPhotoIDNumber");
        }
        let maxLength = event.target.maxLength;
        if (maxLength && event.target.value.length > maxLength) {
            return;
        }else{
            let customerStateObject = { ...customer };
            if (event.target.id === 'newMemberPhotoIDNumber') {
                if (validate.isEmpty(event.target.value)) {
                    customerStateObject.kycRefNo = '';
                } else if (customerStateObject.kycType.kycType === "AADHAAR_CARD" && validate.isNumeric(event.target.value)) {
                    customerStateObject.kycRefNo = event.target.value;
                } else if (customerStateObject.kycType.kycType !== "AADHAAR_CARD" && validate.isAlphaNumericWithSpace(event.target.value)) {
                    customerStateObject.kycRefNo = event.target.value;
            }
            }
            checkIfFormIsPartiallyFilled(customerStateObject);
            setCustomer(customerStateObject);
            if(validate.isEmpty(errMsg) && photoIdInputMaxLength[customerStateObject.kycType.kycType] === event.target.value.length){
                setShowDocumentUpload(true)
            }else{
                setShowDocumentUpload(false)
            }
        }
    }

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        if (isNaN(date.getTime())) {
          return "Invalid Date";
        }
    
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    }

    const updateValues = () => {
        helpers.showElement("newMemberPhotoIDType")
        helpers.hideElement("newMemberPhotoIDNumber")
        setVerifiedToPhotoId(customer.verifiedKycTypes)
        let formValues = {}
        if(validate.isNotEmpty(customer.kycType) && (customer.verifiedKycTypes && customer.verifiedKycTypes.length > 0)){
            formValues = { ...formValues, "newMemberPhotoIDType": customer.kycType.kycType }
        }
        if(validate.isNotEmpty(customer.kycRefNo) && validate.isNotEmpty(customer.kycType.kycType)){
            formValues = {...formValues , "newMemberPhotoIDType": customer.kycType.kycType}
            const maxLength = validate.isNotEmpty(customer.kycType) && validate.isNotEmpty(photoIdInputMaxLength[customer.kycType.kycType]) ? photoIdInputMaxLength[customer.kycType.kycType] : 16
            helpers.updateSingleKeyValueIntoField("maxLength",maxLength, "newMemberPhotoIDNumber");
            helpers.showElement("newMemberPhotoIDNumber")
        }
        if(validate.isNotEmpty(customer.patientName)){
            formValues = {...formValues , "newMemberName": customer.patientName}
        }
        if(validate.isNotEmpty(customer.gender)){
            formValues = {...formValues , "newMemberGender": customer.gender}
        }
        if(validate.isNotEmpty(customer.dob)){
            formValues = {...formValues , "dobNewMember": reverseFormatDate(customer.dob)}
        }
        if(validate.isNotEmpty(customer.relationship)){
            formValues = {...formValues , "relationship":  customer.relationship.name}
        }
        helpers.updateSpecificValues(formValues, "addMembersToPlan");
    }
    const handleChange = (payload) =>{
        const event = payload[0]
        setGenderIntoCustomer(event.target.value)
     }


     const handleChangeRelation = (payload) =>{
        const event = payload[0]
        props.relations && props.relations.map((relation) =>{
            if (relation.relationshipType !== "SELF") {
               if( relation.name === event.target.value){
                setRelation(relation)
               }
            }

        })
     }

     const enableAndValidatePhotoId = (payload) =>{
        const event = payload[0]
        if(event.target.value!=="NONE"){
            props.kycTypes && props.kycTypes.map((kycType) =>{
                if(event.target.value === kycType.kycType){
                    updateKycType(kycType);
                    const maxLength = validate.isNotEmpty(kycType) && validate.isNotEmpty(photoIdInputMaxLength[kycType.kycType]) ? photoIdInputMaxLength[kycType.kycType] : 16
                    helpers.updateSingleKeyValueIntoField("maxLength",maxLength, "newMemberPhotoIDNumber");
                    if(checkIfSelectedKyCTypeExistsInVerifiedList(customer, kycType)){
                        setVerifiedToPhotoId(customer.verifiedKycTypes)
                        helpers.hideElement("newMemberPhotoIDNumber");
                        setShowDocumentUpload(false)
                    }else{
                        helpers.showElement("newMemberPhotoIDNumber");
                    }
    
                }
            })
            
        }else{
            updateKycType('')
            setShowDocumentUpload(false)
            helpers.hideElement("newMemberPhotoIDNumber");
        }
        setShowDocumentUpload(false)
        helpers.updateValue('','newMemberPhotoIDNumber',false);
    }

    const observersMap = {
        'addMembersToAddOn': [['load', updateValues]],
        'newMemberName':[['change',handleOnChange]],
        'dobNewMember': [['change',handleInputDateChange]],
        'newMemberGender': [['click', handleChange]],
        'relationship': [['click',handleChangeRelation]],
        'newMemberPhotoIDType': [['click', enableAndValidatePhotoId]],
        'newMemberPhotoIDNumber' : [['change', (payload)=>{handleInputPhotoIdChange(payload)}]],
        
        
    }

    const updateValuesForRenewal = () => {
        helpers.hideElement("newMemberName");
        helpers.hideElement("dobNewMember");
        helpers.hideElement("relationship");
        helpers.hideElement("newMemberPhotoIDNumber");
        helpers.hideElement("newMemberGender");
        helpers.hideElement("newMemberGender");
        let formValues = {}
        if(validate.isNotEmpty(customer.kycRefNo) && validate.isNotEmpty(customer.kycType.kycType)){
            formValues = {...formValues , "newMemberPhotoIDType": customer.kycType.kycType}
            const maxLength = validate.isNotEmpty(customer.kycType) && validate.isNotEmpty(photoIdInputMaxLength[customer.kycType.kycType]) ? photoIdInputMaxLength[customer.kycType.kycType] : 16
            helpers.updateSingleKeyValueIntoField("maxLength",maxLength, "newMemberPhotoIDNumber");
            helpers.showElement("newMemberPhotoIDNumber")
        }
        helpers.updateSpecificValues(formValues, "addMembersToAddOn");
    }

    const renewalObserversMap = {
        'addMembersToAddOn': [['load', updateValuesForRenewal]],
        'newMemberPhotoIDType': [['click', enableAndValidatePhotoId]],
        'newMemberPhotoIDNumber' : [['change', (payload)=>{handleInputPhotoIdChange(payload)}]],
        
        
    }
    const showPhotoIdProof = () => {
            if(validate.isNotEmpty(props.member.kycType) && (props.member.verifiedKycTypes && props.member.verifiedKycTypes.length > 0)){
                return (
                    <div className="col-lg-5 col-12 my-3">
                        <label htmlFor='photoIDType' className='d-block my-0 small text-secondary'>Photo ID Type</label>
                        <p className="font-14  mb-0">
                            {props.member.kycType.kycName}&nbsp;(<span className="text-success">verified</span>)
                        </p>
                    </div>
                )
            }else{
                return(
                    showDocumentUpload ?
                    <div className='mt-3'><UploadPhotoProof kycType={customer.kycType} updateKycType={updateKycType} kycTypes={props.kycTypes} topCustomer={customer} selectedFile={selectedFile} handleImagePathAndFile={handleUploadFile} setBackDropLoader={props.setBackDropLoader} progressLoader={progressLoader} percentageCompleted={percentageCompleted} setProgressLoader={setProgressLoader} setPercentCompleted={setPercentCompleted} errorMsg={errorMsg && errorMsg["photoIDNumber"] ? errorMsg["photoIDNumber"] : ""} kycRefNo={customer.kycRefNo} handleOnChange={handleInputPhotoIdChange} id="photoIDNumber" {...props}/></div>: <></>
                )
            }
    }

    const setVerifiedToPhotoId = (verifiedKycTypes) => {
        const photoIdElement = helpers.getHtmlElement("newMemberPhotoIDType");
        photoIdElement.values.map(option => {
            if (verifiedKycTypes && verifiedKycTypes.indexOf(option.value) != -1) {
                if (!option.verified) {
                    option.actualDisplayValue = option.displayValue;
                    option.displayValue = `${option.displayValue} (verified)`;
                    option.verified = true;
                }
            }
            else {
                if (option.verified) {
                    option.verified = false;
                    option.displayValue = option.actualDisplayValue;
                }
            }
        })
    }


    return <React.Fragment>
        <div className={`card border card-hover p-12 ${props.className ? props.className:""}`} onClick={props.editSelectionOfCustomer}>
            <div className="h-100">
                <div>
                    {props.source == 'existingPatient' &&<div class="form-check d-flex"> <Checkbox id={props.member.patientId} name="PatientSelect" value="PatientDetails" checked={true} onChange={removeCustomer} /></div>}
                    {!props.addPhotoIdForSubscribedMember && <>
                    <DynamicForm requestUrl={`${MA_API_URL}/addMembersToPlan`} helpers={helpers} requestMethod={'GET'} observers={observersMap} headers={props.headers} />
                    {showDocumentUpload ? <div className='mt-3'><UploadPhotoProof kycType={customer.kycType} updateKycType={updateKycType} kycTypes={props.kycTypes} topCustomer={customer} selectedFile={selectedFile} handleImagePathAndFile={handleUploadFile} setBackDropLoader={props.setBackDropLoader} progressLoader={progressLoader} percentageCompleted={percentageCompleted} setProgressLoader={setProgressLoader} setPercentCompleted={setPercentCompleted} errorMsg={errorMsg && errorMsg["photoIDNumber"] ? errorMsg["photoIDNumber"] : ""} kycRefNo={customer.kycRefNo} handleOnChange={handleInputPhotoIdChange} id="photoIDNumber" {...props}/></div>: <></>
                    }
                    {/* {showPhotoIdProof()} */}
                    </>}

                    {props.addPhotoIdForSubscribedMember &&<div className="flex-fill">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-row">
                                <div className="flex-column">
                                    <p className="font-14  mb-0">
                                        {props.member.patientName}
                                    </p>
                                    {(props.member.dob && props.member.gender) ? <p className="font-12 text-secondary">
                                        {getDisplayableAge(props.member.dob)} / {getGenderString(props.member.gender)}
                                    </p> :
                                        (props.member.gender) ? <p className="font-12 text-secondary">
                                            {getGenderString(props.member.gender)}
                                        </p> : <></>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex flex-wrap justify-content-between">
                                {props.member.relationship && <div className="d-flex flex-column content-width">
                                    <span className="font-12 text-secondary">Relationship</span>
                                    <span className="font-14">{props.member.relationship.name}</span>
                                </div>}
                            </div>
                        </div>
                        <div className='my-3'><DynamicForm requestUrl={`${MA_API_URL}/addMembersToPlan`} helpers={helpers} requestMethod={'GET'} observers={renewalObserversMap} headers={props.headers} /></div>
                        {showDocumentUpload ?<UploadPhotoProof kycType={customer.kycType} updateKycType={updateKycType} kycTypes={props.kycTypes} topCustomer={customer} selectedFile={selectedFile} handleImagePathAndFile={handleUploadFile} setBackDropLoader={props.setBackDropLoader} progressLoader={progressLoader} percentageCompleted={percentageCompleted} setProgressLoader={setProgressLoader} setPercentCompleted={setPercentCompleted} errorMsg={errorMsg && errorMsg["photoIDNumber"] ? errorMsg["photoIDNumber"] : ""} kycRefNo={customer.kycRefNo} handleOnChange={handleInputPhotoIdChange} id="photoIDNumber" /> : <></>}
                    </div>
                    }

                </div>
                <div class="mt-3 d-flex flex-row-reverse gap-3 justify-content-center">
                    <button type="button" disabled={isSaveDisabled || progressLoader} className="btn btn-block btn-brand rounded-border" onClick={saveMember}> Save</button>
                    <button type="button" className="btn btn-block brand-secondary rounded-border" onClick={removeCustomer}> Cancel</button>
                </div>
            </div>

        </div>

    </React.Fragment>

});

export default withFormHoc(MemberForm);