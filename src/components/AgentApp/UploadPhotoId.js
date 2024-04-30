import React, { useContext, useMemo, useState } from 'react'
import Validate from '../../helpers/Validate';
import { photoIdInputMaxLength } from '../../constants/AgentAppConstants';
import AgentAppService from '../../services/AgentApp/AgentAppService';
import defaultKycImage from '../../images/cross.svg';
import { AgentAppContext } from '../Contexts/UserContext';


const UploadPhotoId = (props) => {
    const validate = Validate();
    const { tpaTokenId } = useContext(AgentAppContext);
    const agentAppService = AgentAppService(tpaTokenId);
    const maxSize = 3000000;

    const handleFileChange = (event) => {
        if(validate.isEmpty(props.kycType) || validate.isEmpty(props.kycRefNo)){
            props.setAlertData({message:"please select photoId and enter photoId number before uploading",type:'danger'});
            props.handleImagePathAndFile(undefined,undefined);
            return;
        }
        const file = event.target.files[0];
        if(file){
            if(file.type != "image/png" && file.type!= "image/jpg" && file.type != "image/jpeg"){
                props.setAlertData({message : "Only JPG, JPEG and PNG types are accepted !", type : "danger" })
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

    return <React.Fragment>
        <div className='card upload-photo-id-card h6 mt-2'>
            <div className="card-body p-2">
                <div className="align-items-strech">
                   <BackGroundImage src={imageUrl} />
                    <div className="photo-id-container pt-2">
                    <div className="form-group has-float-label mb-3 px-3">
                        <label id={props.id}><sup className="text-danger"> *</sup></label>
                        <input name={props.id} id={props.id} maxLength={validate.isNotEmpty(props.kycType) && validate.isNotEmpty(photoIdInputMaxLength[props.kycType.kycType]) ? photoIdInputMaxLength[props.kycType.kycType] : "16"} placeholder="Photo ID Number" type="text" autoComplete="off" className={`form-control ${(validate.isNotEmpty(props.errorMsg) && validate.isNotEmpty(props.errorMsg)) ? "is-invalid" : ''}`} onChange={(e) => props.handleOnChange(e)} value={props.kycRefNo} />
                        <div className="invalid-feedback" >{props.errorMsg ? props.errorMsg : ''}</div>
                        {!props.progressLoader && <div class="mt-2 border p-1" style={{ color: 'blue' }}>
                            <label htmlFor={props.labelName ? props.labelName : "file-select"} className="custom-file-label" style={{ color: 'blue' }}>
                                {props.selectedFile ? `Change Photo` : 'Upload Photo'}
                            </label>
                            <input type="file" id={props.labelName ? props.labelName : "file-select"} onChange={e => handleFileChange(e)} className="form-control" style={{ display: 'none' }} onClick={(event) => { event.target.value = null }} />
                        </div>}
                    </div>
                   </div>
                </div>
            </div>
        </div>
        <small className="text-secondary">Supported Files: jpeg/jpg/png, Size upto 4MB</small>

    </React.Fragment>
  
}

export  const  BackGroundImage = (props) => {
    const source = useMemo(()=>{
        return props.src;
    },[props.src])
    return (
        <React.Fragment>
            {source?
           <div className="bg-gray-light border rounded thumbnail-container" >
            <img className='img-fluid' src={source} />
            </div> : <></>}
          </React.Fragment>
    )
};
export default UploadPhotoId
