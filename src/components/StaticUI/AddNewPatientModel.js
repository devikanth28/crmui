import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';

const AddNewPatientModel=(props)=>{
  const {helpers}=props;
  let obj={
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
                    "attributes": null,
                    "message": null,
                    "htmlActions": null,
                    "elementSize": null,
                    "helperText": null,
                    "labelClassName": "col-12",
                    "type": "text",
                    "placeholder": null,
                    "hidden": false
                  },
                  {
                    "htmlElementType": "RADIO",
                    "id": "Gender",
                    "label": "Gender",
                    "name": null,
                    "value": null,
                    "className": "col-12",
                    "readOnly": false,
                    "disabled": false,
                    "autofocus": false,
                    "required": false,
                    "style": null,
                    "attributes": null,
                    "message": null,
                    "htmlActions": null,
                    "elementSize": null,
                    "defaultValue": "N",
                    "helperText": null,
                    "labelClassName": "d-flex text-muted mb-0 font-12",
                    "values": [
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
                    ],
                    "hidden": false
                },
                {
                  "htmlElementType": "INPUT",
                  "id": "dateOfBirth",
                  "label": "Date OF Birth",
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
                  "type": "date",
                  "placeholder": null,
                  "hidden": false
                },
                  {
                    "htmlElementType": "INPUT",
                    "id": "DoctorName",
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
                    "hidden": false
                  },

                ]
            }
        ]
  }

  const CloseButton = <Button variant="link" className="align-self-center icon-hover rounded-5 bg-white" type="button" onClick={() => props.setOpenAddPatientflag(!props.openAddPatientflag)}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <rect fill="none" width="24" height="24" />
      <path d="M20.76,19.55l-7.58-7.56,7.56-7.56a.846.846,0,0,0-.04-1.18.822.822,0,0,0-1.13,0L12,10.81,4.44,3.24A.827.827,0,0,0,3.27,4.41l7.56,7.58L3.27,19.55a.835.835,0,0,0,1.14,1.22l.04-.04L12,13.17l7.56,7.56a.833.833,0,0,0,1.17,0h0a.821.821,0,0,0,.04-1.16A.031.031,0,0,0,20.76,19.55Z" fill="#b9b9b9" />
    </svg>
  </Button>
  return (
    <Modal className='modal-dialog-centered' isOpen={props.openAddPatientflag} >
      <ModalHeader className='align-items-center border-bottom d-flex px-3 py-2' close={CloseButton}>
        Select Patient
      </ModalHeader>
      <ModalBody>
        <React.Fragment>
          <DynamicForm formJson={obj} helpers={helpers}></DynamicForm>
        </React.Fragment>
      </ModalBody>
      <ModalFooter>
        <React.Fragment>
          <button className='btn btn-sm btn-outline-brand'>Save & Continue</button>
        </React.Fragment>
      </ModalFooter>
    </Modal>
  )
}

export default withFormHoc(AddNewPatientModel)