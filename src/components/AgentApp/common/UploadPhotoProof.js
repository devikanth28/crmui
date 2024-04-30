import DocumentUpload from "@medplus/react-common-components/DocumentUpload";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Validate from '../../../helpers/Validate';
import { ALERT_TYPE } from '@medplus/react-common-components/DynamicForm';
import AgentAppService from '../../../services/AgentApp/AgentAppService';
import { AgentAppContext, AlertContext } from '../../Contexts/UserContext';
import { uploadFilesToServer } from "../../../axios";
import { getFileName, getFileNameByType } from "../../../helpers/AgentAppHelper";



const UploadPhotoProof = ({kycTypes, updateKycType, topCustomer, ...props}) => {
const {setAlertContent, setToastContent } = useContext(AlertContext);
const validate = Validate();
const { tpaTokenId } = useContext(AgentAppContext);
const agentAppService = AgentAppService(tpaTokenId);
const [fileSelectLoader,setFileSelectLoader] = useState(false);
const [documentTrigger,setDocumentTrigger] = useState(false);

const maxSize = 3000000;

    useEffect(()=>{
        if(!fileSelectLoader){
            setDocumentTrigger(true);
        } else{
            setDocumentTrigger(false);
        }
    },[fileSelectLoader])

    const handleFileChange = (files) => {
        if(validate.isEmpty(files)){
            setDocumentTrigger(false);
            return;
        }
        if(validate.isEmpty(props.kycType) || validate.isEmpty(props.kycRefNo)){
            setToastContent({toastMessage:"please select photoId and enter photoId number before uploading"});
            props.handleImagePathAndFile(undefined, undefined);
            return;
        }
        const file =files[0];
        if(file){
            if(file.type != "image/png" && file.type!= "image/jpg" && file.type != "image/jpeg"){
                setToastContent({toastMessage:"Only JPG, JPEG and PNG types are accepted !"});
                props.handleImagePathAndFile(undefined,undefined);
                 return;
            }
            if(file.type != "application/pdf" && file.size > maxSize){
                props.setBackDropLoader(true)
                const quality = parseFloat(2200000 / file.size).toFixed(2) ;
                resize(file,quality);
                return;
            }else{
                uploadImageToServer(file);
            }  
        }
    };

    const resize= (file, quality) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            var dataUrl = event.target.result;
            var image = new Image();
            image.src = dataUrl;
            image.onload = () => {
                var resizedDataUrl = resizeImage(image, quality);
                saveBlob(resizedDataUrl);
            }
        }
    }

    const resizeImage = (image, quality) => {
        quality = parseFloat(quality);
        var canvas = document.createElement('canvas');
        var width = image.width;
        var height = image.height;
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
        return canvas.toDataURL("image/jpeg", quality);
    }

    const saveBlob = (dataURI) => {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], {type: mimeString});
        let file =blob;
        if(!window.cordova){
            file = new File([blob], `${props.kycRefNo}_ID.jpeg`, {type: mimeString});
        }
        props.setBackDropLoader(false);
       uploadImageToServer(file);
       
    }

    const getFileUrl = ( file ) =>{
        let url_to_file;
        if(file.type !="application/pdf")
            url_to_file=URL.createObjectURL(file);
        else
            url_to_file="PDFFILE";
        return url_to_file;

    }

    const uploadImageToServer =(file)=>{
        props.setPercentCompleted(0);
        const config = {
            onUploadProgress: (progressEvent) =>{
                let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
                props.setPercentCompleted(percentCompleted);
                }
            }
        props.setProgressLoader(true);
        uploadImagesForPhotoId([file],config).then(data => {
            if ("SUCCESS" == data.statusCode && data.response) {
                let imageObject = data.response[0];
                props.handleImagePathAndFile(file,imageObject);
                props.setProgressLoader(false)
            } else {
                props.setProgressLoader(false);
                setToastContent({ toastMessage: "unable to upload images"});
                return;
            }
        }).catch(err=>{
            props.setProgressLoader(false);
            setToastContent({ toastMessage: "unable to upload images"});
            return;

        })

    }

    const  uploadImagesForPhotoId=async (obj,config)=>{
        var images = new FormData();
            obj.map(file => {
                if(file && file.name){
                    images.append('files', file,getFileName(file.name));
                }else{
                    images.append('files', file,getFileNameByType(file.type));
                }
              
               
            });
            let response = null
            try {
                const data = await agentAppService.getImageServerDetails();
                if (data && "SUCCESS" === data.statusCode) {
                    response = data;
                } else {
                    setToastContent({ toastMessage: "Unable to get Image Server Details" });
                }
            } catch (err) {
                console.log(err)
                setToastContent({ toastMessage: "Unable to get Image Server Details" });
            }
       
        return UploadImagesToImageServer(response.responseData,images,config) 
        }

    const UploadImagesToImageServer = async (imageServerDetails, images, config) => {
        const url = imageServerDetails.imageServerUrl + "/upload?token="
            + imageServerDetails.accessToken + "&clientId=" + imageServerDetails.clientId
            + "&imageType=P&vertical=A";
        return await uploadFilesToServer(url, images, config)

    }

    

    const imageUrl = useMemo(()=>{
        if(props.selectedFile){
            return getFileUrl(props.selectedFile);
        }else{
            return "";
        }

    },[props.selectedFile])


  return (
      <React.Fragment>
          <div className="d-flex justify-content-between">
              <div>
                <label className="custom-fieldset mb-1 w-100">Upload Photo ID</label>
                  <DocumentUpload
                      fileSelectOption={true}
                      documentScanOption={false}
                      singleFileUpload= {true}
                      buttonClassName={'scan-button'}
                      imageContainerClassName={'image-container'}
                      isAppendAllowed={false}
                      resetAddedDocuments={true}
                      uploadActionInParent={false}
                      buttonName="Upload"
                      getAddedDocuments={documentTrigger}
                      onSuccessResponse={ (files) =>{handleFileChange(files)}}
                      onErrorResponse={(message) => { setAlertContent({ message: message, show: true, alertType: ALERT_TYPE.ERROR }) }}
                      allowedFileFormats={".png,.jpg,.jpeg"}
                      removedFileResponse={(file) => {props.handleImagePathAndFile(undefined, undefined);}}
                      includeLightBox={false}
                      imageTitle={"Photo ID Proof"}
                      loadingStatus={(isLoading)=>setFileSelectLoader(isLoading)}
                  />
              </div>
          </div>
      </React.Fragment>
  )
}

export default UploadPhotoProof