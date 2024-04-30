import DocumentUpload from "@medplus/react-common-components/DocumentUpload"
import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import Validate from '../../helpers/Validate';
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";

const FileSelect = (props) => {

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadFilesAction, setUploadFilesAction] = useState(false);
    const [fileTypeNotSupported, setFileTypeNotSupported] = useState(false);

    useEffect(() => {
        if (Validate().isNotEmpty(selectedFiles)) {
            let validFiles = true;
            Object.values(selectedFiles).forEach((value) => {
                if(value.type !== "application/pdf" && !(value.type).includes("image")){
                    setFileTypeNotSupported(true);
                    validFiles = false;
                }else{
                    setFileTypeNotSupported(false);
                }
            })
            if(validFiles){
                props.setUploadedFiles(selectedFiles);
            }
        }
    }, [uploadFilesAction]);

    const uploadFiles = () => {
        setUploadFilesAction(true);
    }

    return (
        <React.Fragment>
            <div className='card border-0'>
                <h6 className='p-12 card-header bg-white'>Edit Prescription</h6>
                {
                    props.filesLength >= 12
                        ? <p className="d-flex justify-content-center mt-3">No more prescriptions allowed for upload</p>
                        : <React.Fragment>
                            <div className='p-12 custom-border-bottom-dashed'>
                                <DocumentUpload getAddedDocuments={uploadFilesAction} onErrorResponse={() => { }} onSuccessResponse={(files) => { setSelectedFiles(files); setUploadFilesAction(false) }} onDeleteResponse={() => { }} fileSelectOption={true} />
                            </div>
                            <Button variant="brand" className="mt-3 mx-3" onClick={uploadFiles} >{props.isLoading?<CustomSpinners spinnerText={"Upload Files"} className={" spinner-position"} innerClass={"invisible"}/>:"Upload"}</Button>
                        </React.Fragment>
                }
                {
                    (props.filesLength+selectedFiles.length) > 12
                    ? <p className="d-flex justify-content-center p-3"><strong>Maximum prescription files should not be beyond 12. Please select accordingly!</strong></p>
                    : fileTypeNotSupported
                    ? <p className="d-flex justify-content-center p-3 text-danger"><strong>File type Not supported. Only PDF, JPG, GIF and PNG types are allowed!</strong></p>
                    : null
                }
            </div>
        </React.Fragment>
    )
}

export default FileSelect;