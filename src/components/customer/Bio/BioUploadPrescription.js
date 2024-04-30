import DynamicForm, { ImageLightBox, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useEffect, useState } from 'react';
import Validate from "../../../helpers/Validate";
import CustomerService from '../../../services/Customer/CustomerService';
import { API_URL } from "../../../services/ServiceConstants";
import DocumentUpload from "@medplus/react-common-components/DocumentUpload";
import FileSelect from '../../Common/FileSelect';


const BioUploadPrescription = ({ helpers, formData, customerInfo }) => {

  const [prescriptionFiles, setPrescriptionFiles] = useState(null);

  const [documentsTrigger, setDocumentsTrigger] = useState(false);
const [uploadLoader,setUploadLoader] = useState(false);
const [alertContent, setAlertContent] = useState({ message: undefined, show: true, alertType: undefined });
const [activeIndex, setActiveIndex] = useState(0);
const [uploadedFiles, setUploadedFiles] = useState([]);



  const validate = Validate();

  useEffect(() => {
    setPrescriptionFiles(helpers.getHtmlElementValue("uploadPrescriptionImages"));
  }, [formData])

  useEffect(() => {
    if (validate.isNotEmpty(prescriptionFiles)) {
      helpers.showElement("uploadImages");
      helpers.showElement("isWhatsAppImages");
    }
    else {
      helpers.hideElement("uploadImages");
      helpers.hideElement("isWhatsAppImages");
    }
  }, [prescriptionFiles])

  const validateSelectedFiles = () => {
    const prescriptionImages=helpers.getHtmlElementValue("uploadPrescriptionImages");
    if(validate.isNotEmpty(prescriptionImages)){
      for(let element of prescriptionImages){
        const fileName = element.name;
        if (fileName.split('.').pop() !== "jpg" && fileName.split('.').pop() !== "png" && fileName.split('.').pop() !== "pdf" && fileName.split('.').pop() !== "jpeg") {
          alert("Only JPG, JPEG, PNG and PDF files are accepted");
          setPrescriptionFiles(null);
          helpers.resetForm("customerPrescriptionForm");
          return ;
        }
      }
    }
  }

  const fileTabs = () => {
    return (
      <React.Fragment>
        <ui>
          {prescriptionFiles  && prescriptionFiles.map(file => {
            return (<li style={{ listStyle: 'none' }}>{file.name}<span onClick={() => { helpers.removeFile("uploadPrescriptionImages", file.name) }}><span className='p-3'>X</span></span></li>);
          })}
        </ui> 
      </React.Fragment>
    );
  }

  const injectHtml = {
    'uploadPrescriptionImages': [['INSERT_AFTER', fileTabs]]
  }

  const uploadSelectedFiles = async (healthImages) => {
    try {
      const values = {
        healthRecordImages: JSON.stringify(healthImages),
        mobile: customerInfo.mobileNumber,
        customerId: customerInfo.customerID,
        emailId: customerInfo.emailId,
        isWhatsAppImages: validate.isNotEmpty(helpers.getHtmlElementValue("isWhatsAppImages")) ? "true" : "false"
      }
      const customerId = customerInfo.customerID;
      const config = { headers: { customerId }, data: values };
      const response = await CustomerService().uploadFiles(config);
      if (validate.isNotEmpty(response.message)) {
        alert(response.message);
        if (response.statusCode === "SUCCESS") {
          helpers.resetForm("customerPrescriptionForm");
        }
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  const getImageServerDetails = async () => {
    try {
      const response = await CustomerService().getImageServerDetail();
      if (response.statusCode === "SUCCESS" && validate.isNotEmpty(response) && validate.isNotEmpty(response.dataObject) && validate.isNotEmpty(response.dataObject.imageServer)) {
        return response.dataObject.imageServer;
      }
      else {
        alert("Unable to upload prescription images,Please try again");
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const uploadToImageServer = async () => {
    try {
      const imageServerDetail = await getImageServerDetails();
      const responseData = await helpers.uploadToImageServer("uploadPrescriptionImages", imageServerDetail, "P", "W");
      if (validate.isEmpty(responseData.data.response)) {
        alert("Unable to upload prescription images,Please try again");
      }
      else {
        await uploadSelectedFiles(responseData.data.response);
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  const observersMap = {
    'uploadImages': [['click', uploadToImageServer]],
     'uploadPrescriptionImages':[['change',validateSelectedFiles]]
    
  }

  return (<React.Fragment>
     
         </React.Fragment>
  )
}

export default withFormHoc(BioUploadPrescription); 