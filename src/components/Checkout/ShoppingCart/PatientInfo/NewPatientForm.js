import React, { useState } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import Validate from '../../../../helpers/Validate';
import dateFormat from 'dateformat';
import { shallowEqual } from '../../../../helpers/HelperMethods';

const NewPatientForm = (props) => {
    const { helpers } = props;
    const validate = Validate();
    const patientInfo = props?.patientInfo;
    const isEdit = props?.isEdit;
    const isAddNew = props?.isAddNew;
    const isLabs = props?.isLabs;
    const [initialPatientInfo,setInitialPatientInfo] = useState(undefined);

    const options = [
        {
            "htmlElementType": "OPTION",
            "id": "male",
            "label": "Male",
            "name": "",
            "value": "M",
            "className": null,
            "readOnly": false,
            "disabled": false,
            "autofocus": false,
            "required": false,
            "style": null,
            "attributes": null,
            "message": null,
            "htmlActions": null,
            "elementSize": null,
            "defaultValue": null,
            "helperText": null,
            "labelClassName": null,
            "displayValue": "Male",
            "selected": false,
            "hidden": false
        },
        {
            "htmlElementType": "OPTION",
            "id": "Female",
            "label": "Female",
            "name": "",
            "value": "F",
            "className": null,
            "readOnly": false,
            "disabled": false,
            "autofocus": false,
            "required": false,
            "style": null,
            "attributes": null,
            "message": null,
            "htmlActions": null,
            "elementSize": null,
            "defaultValue": null,
            "helperText": null,
            "labelClassName": null,
            "displayValue": "Female",
            "selected": false,
            "hidden": false
        },
        {
            "htmlElementType": "OPTION",
            "id": "Others",
            "label": "Others",
            "name": "",
            "value": "O",
            "className": null,
            "readOnly": false,
            "disabled": false,
            "autofocus": false,
            "required": false,
            "style": null,
            "attributes": null,
            "message": null,
            "htmlActions": null,
            "elementSize": null,
            "defaultValue": null,
            "helperText": null,
            "labelClassName": null,
            "displayValue": "Others",
            "selected": false,
            "hidden": false
        }
    ]

    const updateInitialValues = () => {
        if (validate.isNotEmpty(patientInfo)) {
            let dob = dateFormat(patientInfo?.dateOfBirth, "yyyy-mm-dd");
            const editPatientInfo = {patientName:patientInfo?.patientName, gender:patientInfo?.gender, dateOfBirth: dob, age: patientInfo?.age, doctorName: patientInfo?.doctorName};
            setInitialPatientInfo(editPatientInfo);
            helpers.updateValue(editPatientInfo.patientName, 'patientName');
            helpers.updateValue(editPatientInfo.gender, 'gender');
            helpers.updateValue(dob, 'dateOfBirth');
            helpers.updateValue(editPatientInfo.age, 'age');
            helpers.updateValue(editPatientInfo.doctorName, 'doctorName');
        }
    }

    let obj = {
        "htmlElementType": "FORM",
        "id": "CatalogDynamicForm",
        "label": null,
        "name": null,
        "value": null,
        "className": null,
        "readOnly": false,
        "disabled": false,
        "autofocus": false,
        "required": false,
        "style": null,
        "attributes": null,
        "message": null,
        "htmlActions": null,
        "elementSize": null,
        "defaultValue": null,
        "helperText": null,
        "labelClassName": null,
        "htmlGroups": [
            {
                "htmlElementType": "ELEMENTGROUP",
                "id": "group1",
                "label": null,
                "name": null,
                "value": null,
                "className": "row g-3",
                "readOnly": false,
                "disabled": false,
                "autofocus": false,
                "required": false,
                "style": null,
                "attributes": null,
                "message": null,
                "htmlActions": null,
                "elementSize": null,
                "defaultValue": null,
                "helperText": null,
                "labelClassName": null,
                "groups": null,
                "groupElements": [
                    {
                        "htmlElementType": "INPUT",
                        "id": "patientName",
                        "label": "Patient Name",
                        "name": null,
                        "value": null,
                        "className": null,
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": true,
                        "style": null,
                        "attributes": { 'autocomplete': 'off' },
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "helperText": null,
                        "labelClassName": "col-12",
                        "type": "text",
                        "placeholder": null,
                        "hidden": false,
                        "regex":"^[a-zA-Z][a-zA-Z ]*$",
                        "minLength":3,
                        "maxLength":30
                    },
                    {
                        "htmlElementType": "RADIO",
                        "id": "gender",
                        "label": "Gender",
                        "name": null,
                        "value": null,
                        "className": "col-12",
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": true,
                        "style": null,
                        "attributes": null,
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "defaultValue": "N",
                        "helperText": null,
                        "labelClassName": "d-flex text-muted mb-0 font-12",
                        "values": options,
                        "hidden": false
                    },
                    {
                        "htmlElementType": "INPUT",
                        "id": "dateOfBirth",
                        "label": "Date Of Birth",
                        "name": null,
                        "value": null,
                        "className": null,
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": false,
                        "style": null,
                        "attributes": null,
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "helperText": null,
                        "labelClassName": "col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6",
                        "type": "date",
                        "placeholder": null,
                        "hidden": false,
                        "max": `${dateFormat(new Date(),'yyyy-mm-dd')}`
                    },                    
                    {
                        "htmlElementType": "INPUT",
                        "id": "age",
                        "label": "Enter Age",
                        "name": null,
                        "value": null,
                        "className": null,
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": false,
                        "style": null,
                        "attributes": null,
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "helperText": null,
                        "labelClassName": "col-12 col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5",
                        "type": "text",
                        "placeholder": null,
                        "hidden": false,
                    },
                    {
                        "htmlElementType": "INPUT",
                        "id": "doctorName",
                        "label": "Doctor Name",
                        "name": null,
                        "value": null,
                        "className": null,
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": true,
                        "style": null,
                        "attributes": null,
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "helperText": null,
                        "labelClassName": "col-12",
                        "type": "text",
                        "placeholder": null,
                        "hidden": false,
                        "regex":"^[a-zA-Z][a-zA-Z ]*$",
                        "minLength":3,
                        "maxLength": 30
                    },

                ]
            }
        ]
    }


    const validateAge = (collectedPatientInfo) => {
        if(validate.isNotEmpty(collectedPatientInfo) && validate.isNotEmpty(collectedPatientInfo.age)){
            if (collectedPatientInfo.age < 0 || collectedPatientInfo.age >= 100 || collectedPatientInfo.age === undefined) {
                helpers.updateErrorMessage("Please select age from 0-99 years", "age");
                return;
            }
            return collectedPatientInfo.age;
        }
        else if (validate.isNotEmpty(collectedPatientInfo) && validate.isNotEmpty(collectedPatientInfo.dateOfBirth)) {
            let age = undefined;
            let today = new Date();
            let birthDate = new Date(collectedPatientInfo.dateOfBirth);
            let yearDiff = today.getFullYear() - birthDate.getFullYear();
            let monthDiff = today.getMonth() - birthDate.getMonth();
            let dateDiff = today.getDate() - birthDate.getDate();
            if (yearDiff > 0) {
                if (monthDiff < 0) {
                    age = yearDiff - 1
                } else {
                    age = yearDiff
                }
            } else if (yearDiff === 0 && monthDiff > 0) {
                age = yearDiff;
            } else if (yearDiff === 0 && monthDiff === 0 && dateDiff >= 0) {
                age = yearDiff;
            } else {
                age = undefined;
            }
            if (age < 0 || age >= 100 || age === undefined) {
                helpers.updateErrorMessage("Please select age from 0-99 years", "dateOfBirth");
                return;
            }
            helpers.updateSingleKeyValueIntoField('value', age, 'age');
            return age;
        }
    }

    const orDiv = () => {
        return(
            <div className='col-12 col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xxl-1 text-center'>
                <p className='font-weight-bold mb-0 pt-3'>
                    OR
                </p>
            </div>
        );
    }

    const handleAgeAndDobBlur= (isFromAge) =>{
        let requiredFiledId = isFromAge ? 'age' : 'dateOfBirth';
        let errorMessageId = 'age' == requiredFiledId ? 'dateOfBirth' : 'age';
        let age = helpers.getHtmlElementValue('age');
        let dob = helpers.getHtmlElementValue('dateOfBirth');
        if((validate.isEmpty(age) || age == 0) && validate.isEmpty(dob)){
            helpers.updateErrorMessage('Either age or date of birth is required', requiredFiledId);
            helpers.clearErrorMessageForField(errorMessageId);
        }else{
            helpers.updateSingleKeyValueIntoField('required', false, (validate.isEmpty(age) || age == 0) ? 'age' : 'dateOfBirth', false);
            helpers.clearErrorMessageForField(validate.isEmpty(age)?'age':'dateOfBirth');
        }
    }

    const observersMap = {
        'CatalogDynamicForm': [['load', updateInitialValues]],
        'age' : [['blur', ()=>{handleAgeAndDobBlur(true)}]],
        'dateOfBirth' : [['blur', ()=>{handleAgeAndDobBlur(false)}]]
    }

    const customHtml = {
        "dateOfBirth" : [['INSERT_AFTER' , orDiv]]
    }

    const handleSavePatient = () => {
        handleAgeAndDobBlur(false);
        const validatedPatientInfo = helpers.validateAndCollectValuesForSubmit("CatalogDynamicForm");
        if (validate.isEmpty(validatedPatientInfo)) {
            return
        }
        if(helpers.deepEqual(initialPatientInfo,validatedPatientInfo)){
            props.setStackedToastContent({ toastMessage: "patient saved successfully" })
            props.setOpenAddPatientflag(!props.openAddPatientflag);
            return;
        }
        const age = validateAge(validatedPatientInfo);
        if(validate.isEmpty(age) && validate.isEmpty(validatedPatientInfo['dateOfBirth'])){
            return;
        }
        if (isEdit) {
            props?.handleEdit({...patientInfo, ...validatedPatientInfo , "age": validate.isEmpty(age) ? null : age , 'dateOfBirth': validate.isEmpty(validatedPatientInfo['dateOfBirth'])? null : validatedPatientInfo['dateOfBirth'] });
        } else if (isAddNew) {
            props?.addNewPatient({"age" : age, ...validatedPatientInfo });
        }
        props.setOpenAddPatientflag(!props.openAddPatientflag);
    }

    const CloseButton = <button type="button" className="btn btn-link align-self-center icon-hover rounded-5" onClick={() => props.setOpenAddPatientflag(!props.openAddPatientflag)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <rect fill="none" width="24" height="24" />
                            <path d="M20.76,19.55l-7.58-7.56,7.56-7.56a.846.846,0,0,0-.04-1.18.822.822,0,0,0-1.13,0L12,10.81,4.44,3.24A.827.827,0,0,0,3.27,4.41l7.56,7.58L3.27,19.55a.835.835,0,0,0,1.14,1.22l.04-.04L12,13.17l7.56,7.56a.833.833,0,0,0,1.17,0h0a.821.821,0,0,0,.04-1.16A.031.031,0,0,0,20.76,19.55Z" fill="#b9b9b9" />
                            </svg>
                        </button>
    return (
        <Modal className='modal-dialog-centered' isOpen={props.openAddPatientflag} >
            <ModalHeader className='justify-content-between align-items-center border-bottom d-flex px-3 py-2' close={CloseButton}>
                Select Patient
            </ModalHeader>
            <ModalBody>
                <React.Fragment>
                    <DynamicForm formJson={obj} helpers={helpers} observers={observersMap} customHtml={customHtml}></DynamicForm>
                </React.Fragment>
            </ModalBody>
            <ModalFooter className='justify-content-center'>
                    <button className='btn btn-outline-brand btn-sm pe-3'>Clear</button>
                    <button className='btn btn-sm btn-brand' onClick={handleSavePatient}>Save & Continue</button>
            </ModalFooter>
        </Modal>
    )
}

export default withFormHoc(NewPatientForm)