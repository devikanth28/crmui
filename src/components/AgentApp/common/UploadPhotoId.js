import React, { useContext, useMemo } from 'react'
import  DynamicForm,{ withFormHoc, ALERT_TYPE, CustomAlert, CustomToast, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import { MA_API_URL } from '../../../services/ServiceConstants';
import { checkIfSelectedKyCTypeExistsInVerifiedList } from '../../../helpers/AgentAppHelper';
import { AgentAppContext, AlertContext } from '../../Contexts/UserContext';
import Validate from '../../../helpers/Validate';
import AgentAppService from '../../../services/AgentApp/AgentAppService';
import { photoIdInputMaxLength } from '../../../constants/AgentAppConstants';



const UploadPhotoId = ({helpers, kycTypes, updateKycType, topCustomer, ...props}) => {
const {setToastContent } = useContext(AlertContext);
const validate = Validate();
const { tpaTokenId } = useContext(AgentAppContext);
const agentAppService = AgentAppService(tpaTokenId);
const kycType=topCustomer.kycType
const maxSize = 3000000;

    const enableAndValidatePhotoId = (payload) =>{
        const event = payload[0]
        if(event.target.value!=="NONE"){
            kycTypes && kycTypes.map((kycType) =>{
                if(event.target.value === kycType.kycType){
                    updateKycType(kycType, helpers);
                    const maxLength = validate.isNotEmpty(kycType) && validate.isNotEmpty(photoIdInputMaxLength[kycType.kycType]) ? photoIdInputMaxLength[kycType.kycType] : 16
                    helpers.updateSingleKeyValueIntoField("maxLength",maxLength, "photoIDNumber");
                    if(checkIfSelectedKyCTypeExistsInVerifiedList(topCustomer, kycType)){
                        helpers.hideElement("photoIDNumber");
                        helpers.hideElement("photoId");
                    }else{
                        helpers.showElement("photoIDNumber");
                        helpers.showElement("photoId");
                    }
    
                }
            })
            
        }else{
            updateKycType('')
            helpers.hideElement("photoIDNumber");
            helpers.hideElement("photoId");
        }
        helpers.updateValue('','photoIDNumber',false);
    }

    const updateValues = () => {
        helpers.hideElement("photoIDNumber");
        helpers.hideElement("photoId");
        helpers.disableElement("photoId")
    }

    const handleFileChange = (payload) => {
        const [event,htmlElement] = payload;
        const currentFile = event.target.files[0];
        if(validate.isEmpty(props.kycType) || validate.isEmpty(props.kycRefNo)){
            setToastContent({toastMessage:"please select photoId and enter photoId number before uploading"});
            props.handleImagePathAndFile(undefined, undefined);
            setTimeout(()=> {
                let files = [...event.target.files];
                files = files.filter(file => file.name != currentFile.name);
                htmlElement.value = files;
            },1000)
            return;
        }
        if(currentFile){
            if(currentFile.type != "image/png" && file.type!= "image/jpg" && file.type != "image/jpeg"){
                setToastContent({toastMessage:"Only JPG, JPEG and PNG types are accepted !"});
                props.handleImagePathAndFile(undefined,undefined);
                 return;
            }
            if(currentFile.type != "application/pdf" && currentFile.size > maxSize){
                props.setBackDropLoader(true)
                const quality = parseFloat(2200000 / currentFile.size).toFixed(2) ;
                resize(currentFile,quality);
                return;
            }else{
                uploadImageToServer(currentFile);
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
        agentAppService.uploadImagesForPhotoId([file],config).then(data => {
            if ("SUCCESS" == data.statusCode && data.response) {
                let imageObject = data.response[0];
                props.handleImagePathAndFile(file,imageObject);
                props.setProgressLoader(false)
            } else {
                props.setProgressLoader(false);
                props.setAlertData({ message: "unable to upload images", type: 'danger' });
            }
        }).catch(err=>{
            props.setProgressLoader(false);
            props.setAlertData({ message: "unable to upload images", type: 'danger' });

        })

    }

    const imageUrl = useMemo(()=>{
        if(props.selectedFile){
            return getFileUrl(props.selectedFile);
        }else{
            return "";
        }

    },[props.selectedFile])

    const fileUploadObserversMap = {
        'photoIdUploadForm': [['load', updateValues]],
        'photoIDType': [['click', enableAndValidatePhotoId]],
        'photoIDNumber' : [['change', (payload)=>{props.handleOnChange(payload,helpers)}]],
        'photoId' : [['change',handleFileChange ]]
    
    
     }
  return (
    <React.Fragment>
        <DynamicForm requestUrl={`${MA_API_URL}/photoIdUploadForm`} helpers={helpers} observers={fileUploadObserversMap} requestMethod={'GET'} headers={props.headers}/>
    </React.Fragment>
  )
}

export default withFormHoc(UploadPhotoId)