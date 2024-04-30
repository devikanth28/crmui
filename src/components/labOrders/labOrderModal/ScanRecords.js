import DocumentUpload from '@medplus/react-common-components/DocumentUpload';
import React from "react";
import Validate from "../../../helpers/Validate";


const ScanRecords = (props) => {

    const setUploadedFiles = (files) => {
        props.setScannedFiles(files)
    }

    const setErrorMessage = (msg) => {
        if (Validate().isNotEmpty(msg)) {
            props.setAlertContent({alertMessage:msg});
        }
    }

    const setLoading = (response) =>{
        props.setDisableUploadReset(response);
    }
 
    return <DocumentUpload
        autoScanInit={true}
        buttonClassName={'scan-button'}
        buttonName={'Upload'}
        imageContainerClassName={'image-container'}
        documentScanOption={true}
        isAppendAllowed={false}
        uploadActionInParent={false}
        showResetButton={false}
        onSuccessResponse={(file) => { setUploadedFiles(file) }}
        onErrorResponse={(message) => { setErrorMessage(message) }}
        onDeleteResponse={() => { }}
        includeLightBox={true}
        scannerOutputType={'png'}  
        resetAddedDocuments={props.resetAddedDocuments} 
        getAddedDocuments={props.getAddedDocuments}
        loadingStatus ={(response) => {setLoading(response)}}
         />
}
export default ScanRecords