import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import React, { useContext, useEffect, useRef, useState } from "react";
import Validate from "../../../helpers/Validate";
import CloseIcon from '../../../images/cross.svg';
import LabOrderService from '../../../services/LabOrder/LabOrderService';
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../../Common/CommonStructure";
import { AlertContext } from "../../Contexts/UserContext";
import ScanRecords from './ScanRecords';
import CommonConfirmationModal from '../../Common/ConfirmationModel';
import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import { Button } from 'react-bootstrap';

const HealthRecordModal = (props) => {

    const validate = Validate();
    const headerRef = useRef(0);
    const footerRef = useRef(0);
    const {setAlertContent,setStackedToastContent} = useContext(AlertContext);
    const [initialLoading, setInitialLoading] = useState(true);
    const [previousReportFiles, setPreviousReportFiles] = useState(undefined);
    const [dataGrid, setDataGrid] = useState(undefined);
    const [scannedFiles, setScannedFiles] = useState(undefined);
    const [reload, setReload] = useState(false);
    const [showConfirmationModal,setConfirmationModal] = useState(false);
    const [fileId,setFileId] = useState(null);
    const [confirmationModalProps,setConfirmationModalProps] = useState({message:"",onSubmit:null,headerText:""});
    const [resetAddedDocuments,setResetAddedDocuments] = useState(false);
    const [getAddedDocuments,setAddedDocuments] = useState(false);
    const [disableUploadReset, setDisableUploadReset] = useState(true);
    const [isUploadFiles, setIsUploadFiles] = useState(false);

    useEffect(() => {
        props.setDisableMode(true)
        setInitialLoading(true);
        LabOrderService().getClinicalHistoryFiles({ "labOrderId": props.scanModalObj.orderId, "customerId": props.scanModalObj.customerId, "patientId": props.scanModalObj.patientId }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode === "SUCCESS") {
                setPreviousReportFiles(data.dataObject.dataSet);
                setDataGrid(data.dataObject.dataGrid);
                setInitialLoading(false);
            } else {
                setInitialLoading(false);
                setStackedToastContent({toastMessage:data.message});

            }
            props.setDisableMode(false);
        }).catch((err) => {
            console.log(err);
            setInitialLoading(false);
            setStackedToastContent({toastMessage:"Unable to process request, Please try again!"});
            props.setDisableMode(false);
        })
    }, [reload])

    useEffect(() => {
        if (validate.isNotEmpty(scannedFiles)) {
            uploadScannedFiles()
        }else{
            if(getAddedDocuments){
                setStackedToastContent({toastMessage: "No Files to upload. Please scan to get files"})
                setAddedDocuments(false);
            }
        }
    }, [scannedFiles])

    const deleteExistingReport = async (fileId) => {
        props.setDisableMode(true);
        if(validate.isEmpty(fileId)){
            return null;
        }
        await LabOrderService().deleteReferenceFile({ 'fileId': fileId }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode == "SUCCESS") {
                let temp = previousReportFiles.filter(eachFile => {
                    return eachFile.fileId != fileId;
                })
                setPreviousReportFiles(temp);
            }
            else{
                setStackedToastContent({toastMessage:data.message}); 
            }
            props.setDisableMode(false);
        }).catch(err => {
            setStackedToastContent({toastMessage:"Failed to Delete File."});
            console.log(err);
            props.setDisableMode(false);
        })
    }

    const setPropsToModal=(fileId,fileName)=>{
        setFileId(fileId);
        setConfirmationModal(true);
        setConfirmationModalProps({message:`Are you sure you want to delete ${fileName}?`,onSubmit:deleteExistingReport,headerText:"Delete File"})
    }

    const callBackMapping = {
        "renderfileColumn": (props) => {
            const { row } = props;
            return <div className='d-flex'>
                <div onClick={() => !props.disableMode && window.open(row.url)} style={{ "cursor": "pointer", "color": "blue", "text-decoration": "underline" }}>{row.name}</div>
                <Button color='link' onClick={() => !props.disableMode && setPropsToModal(row.fileId,row.name)} className="rounded-5 icon-hover">
                    <img src={CloseIcon} alt="Delete Icon" title="close" />
                </Button>
            </div>
        },
        "renderagentInfoColumn": (props) => {
            const { row } = props;
            return <React.Fragment>
                <div>{row.createdByName} - {row.createdBy}</div>
            </React.Fragment>
        }
    }

    const toggle = () => props.setScanModal(!props.scanModal);

    const uploadScannedFiles = async() => {
        setIsUploadFiles(true);
        let labOrderId = props.scanModalObj.orderId;
        let formData = new FormData();
        formData.append('labOrderId', labOrderId)

        for (let index = 0; index < scannedFiles.length; index++) {
            formData.append('clinicalHistoryFiles', scannedFiles[index], 'clinicalHistoryFile_' + labOrderId.toString() + '_' + (index + 1) + '.png');
        }
        props.setDisableMode(true);
        await LabOrderService().uploadClinicalHistoryFiles(formData).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode == "SUCCESS") {
                setStackedToastContent({toastMessage: "Files uploaded successfully"})
                setScannedFiles(undefined);
                setReload(!reload);
            }
            else{
                setStackedToastContent({toastMessage:data.message})
            }
            props.setDisableMode(false);
            setIsUploadFiles(false);
        }).catch(err => {
            setStackedToastContent({toastMessage:"Unable to process request, Please try again!"})
            console.log(err);
            props.setDisableMode(false);
            setIsUploadFiles(false);
        })
        setAddedDocuments(false);

    }

    return <div className="custom-modal">
        {/* <div className="custom_gridContainer_fullwidth_forms">
            <div className="forms"> */}
            <Wrapper className="m-0">
                <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                    <p className="mb-0"> Patient Clinical History </p>
                    <div class=" d-flex align-items-center">
                        <Button variant=' ' onClick={toggle} className="rounded-5 icon-hover btn-link">
                        <span className='custom-close-btn icon-hover'></span>
                        </Button>
                    </div>
                </HeaderComponent>
                <BodyComponent loading={initialLoading} allRefs={{ headerRef ,footerRef}} className="body-height" >
                    {!initialLoading && <div className={`h-100`}>
                        <div className="col-12">
                            <ScanRecords  resetAddedDocuments={resetAddedDocuments} setDisableUploadReset={setDisableUploadReset} getAddedDocuments={getAddedDocuments} setScannedFiles={setScannedFiles} setAlertContent = {setAlertContent} setDisableMode = {props.setDisableMode} disableMode = {props.disableMode}/>
                            {validate.isNotEmpty(previousReportFiles) && <React.Fragment>
                                <div className='scroll-grid-on-hover' style={{ height: "100vh" }}>
                                    <CommonDataGrid {...dataGrid} dataSet={[...previousReportFiles]}
                                        callBackMap={callBackMapping}
                                    />
                                </div>
                            </React.Fragment>}
                        </div>
                    </div>}
                    {showConfirmationModal && <CommonConfirmationModal headerText={confirmationModalProps.headerText} isConfirmationPopOver={showConfirmationModal} setConfirmationPopOver={setConfirmationModal} message={confirmationModalProps.message} buttonText={"Ok"} onSubmit={()=>confirmationModalProps.onSubmit(fileId)} />}
                </BodyComponent>
                <FooterComponent ref={footerRef}>
                <div className='border-top px-3 py-2 d-flex flex-row-reverse'>
                    <button  className='btn btn-danger ms-3' onClick={()=>setAddedDocuments(true)} disabled={disableUploadReset}>{isUploadFiles ? <CustomSpinners spinnerText={"Upload"} className={" spinner-position"} innerClass={"invisible"}/> : "Upload"}</button>
                    <button className='btn brand-secondary btn' onClick={() => setResetAddedDocuments(true)} disabled={disableUploadReset}>Reset</button>
                </div>
                </FooterComponent>
                </Wrapper>
            </div>
}
export default HealthRecordModal;