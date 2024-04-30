import React, { useContext, useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, FormGroup } from "react-bootstrap";
import Validate from "../../../helpers/Validate";
import { AlertContext, CustomerContext, LocalityContext } from "../../Contexts/UserContext";
import DocumentUpload from "@medplus/react-common-components/DocumentUpload";
import { ALERT_TYPE, CustomSpinners, TOAST_POSITION } from "@medplus/react-common-components/DynamicForm";
import OrderService from "../../../services/Order/OrderService";
import UserService from "../../../services/Common/UserService";
import ChangeMobileNum from "./ChangeMobileNum";
import { Input } from "reactstrap";
import { isValidPhotoIdFiles } from "../CustomerHelper";

const BioDashBoard = ({ customerData, getCustomerInfo }) => {

    const [documentsTrigger, setDocumentsTrigger] = useState(false);
    const [uploadLoader,setUploadLoader] = useState(false);
    const validate = Validate();
    const {setStackedToastContent} = useContext(AlertContext);
    const [alertContent, setAlertContent] = useState({ message: undefined, show: true, alertType: undefined });
    const [isWhatsAppImages, setIsWhatsappImages] = useState(false);
    const [files,setFiles] = useState([]);
    const {martLocality} = useContext(LocalityContext);
    const [resetDocuments,setResetDocuments] = useState(false);
    const [isDocumentLoading, setIsDocumentLoading] = useState(false)
    const {tokenId} = useContext(CustomerContext);
 
    useEffect(() => {
        setDocumentsTrigger(uploadLoader);
      }, [uploadLoader]);

      useEffect(()=>{
        setResetDocuments(false);
    }, [isDocumentLoading])

    const onDocumentsUpload = async (files) => {
        if(!isValidPhotoIdFiles(files)){
            setUploadLoader(false);
            setStackedToastContent({ toastMessage: "Please upload valid file(s)" });
            return;
        }
        setDocumentsTrigger(false);
        await uploadPrescription(files);
    }

    const uploadPrescription = async (files) => {
        setResetDocuments(false);
        if (validate.isEmpty(files)) {
            setUploadLoader(false);
            setStackedToastContent({ toastMessage: "Please select a file", position: TOAST_POSITION.BOTTOM_START })
        }else{
            if(files.length > 0){
                for (const each of files) {
                    const uploadedFileSize = Math.round(each.size / 1024);
                    if (uploadedFileSize > 4096) {
                        setStackedToastContent({ toastMessage: "Please select a file upto 4MB", position: TOAST_POSITION.BOTTOM_START })
                        setUploadLoader(false);
                        return;
                    }
                }
            }
            if(files.length > 4 ){
                setStackedToastContent({ toastMessage: "Max allowed files is 4", position: TOAST_POSITION.BOTTOM_START });
                setUploadLoader(false);
                return;
            }
            else {
                await OrderService().uploadFilesToImageServer(files, 'P', {}).then(response => {
                    if (response.statusCode === "SUCCESS" && response.response) {
                        setUploadLoader(false);
                        setFiles(files)
                        if(validate.isNotEmpty(response.response))
                            uploadPrescriptionFile(response.response);
                        setResetDocuments(true);
                    }
                    if (response.statusCode === "FAILURE") {
                        setStackedToastContent({ toastMessage: response.message, position: TOAST_POSITION.BOTTOM_START })
                        /* setAlertContent({ message: response.message, show: true, alertType: ALERT_TYPE.ERROR }); */
                        setUploadLoader(false);
                    }
                    setUploadLoader(false);
                }).catch(error => {
                    console.log(error);
                    setStackedToastContent({ toastMessage: "Server Experiencing some problem", position: TOAST_POSITION.BOTTOM_START })
                    /* setAlertContent({ message: "Server Experiencing some problem", show: true, alertType: ALERT_TYPE.ERROR }); */
                    setUploadLoader(false);
                })
            }
        }
    }

    const uploadPrescriptionFile = (imageServerDetails) => {
        const formData = new FormData();
        formData.append("healthRecordImages", JSON.stringify(imageServerDetails));
        formData.append("customerId", customerData?.customerInfo?.customerID);
        formData.append("mobile", customerData?.customerInfo?.mobileNumber);
        formData.append("emailId", customerData?.customerInfo?.emailId);
        formData.append("latlong", martLocality?.locality?.locationLatLong);
        formData.append("isWhatsAppImages", isWhatsAppImages);
        formData.append("tokenId" , tokenId);
        const config = {headers:{customerId:customerData?.customerInfo?.customerID},data:formData}
        UserService().uploadPrescription(config).then(res => {
            if (validate.isNotEmpty(res)) {
                if (validate.isNotEmpty(res.statusCode) && "SUCCESS" == res.statusCode) {
                    setStackedToastContent({ toastMessage: res.message?res.message :"File saved and verified successfully", position: TOAST_POSITION.BOTTOM_START });
                }
                else {
                    setStackedToastContent({ toastMessage:res.message?res.message : "Unable to create prescription order, Try after some time!", position: TOAST_POSITION.BOTTOM_START });
                }
            }
        }).catch(err => {
            console.log("Error occured while uploading prescription ", err);
            setStackedToastContent({ toastMessage: "Something went wrong, Try after some time!", position: TOAST_POSITION.BOTTOM_START });
        })
    }

    return (
        <React.Fragment>        
                <div className="custom-model-filter-container">
                    <div>
                        <h4 className="h6 custom-fieldset mb-2">Dashboard</h4>
                        <div className="row g-2">
                            <div className="col-12 col-lg-6">
                                <Card className="h-100">
                                    <CardHeader className="bg-white">
                                        Points history
                                    </CardHeader>
                                    <CardBody className="row text-center">
                                        <div className="col">
                                            {validate.isNotEmpty(customerData.balancePoints) && <React.Fragment>
                                                <p className="mb-0 text-secondary">Loyalty Points</p>
                                                <p className="mb-0">{customerData.balancePoints}</p>
                                            </React.Fragment>}
                                        </div>
                                        <div className="col">
                                            {validate.isNotEmpty(customerData.paybackPoints) && <React.Fragment>
                                                <p className="mb-0 text-secondary">Payback Points</p>
                                                <p className="mb-0">{customerData.paybackPoints.toFixed(2)}</p>
                                            </React.Fragment>}
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Card className="h-100">
                                    <CardHeader className="bg-white">
                                        Order history
                                    </CardHeader>
                                    <CardBody className="row text-center">
                                        {validate.isNotEmpty(customerData?.customerInfo) && <React.Fragment>
                                            <div className="col">
                                                {"KYNZO" === customerData.customerInfo?.customerType && <p className="mb-0 text-secondary">Total Kynzo Orders</p>}
                                                {"KYNZO" !== customerData.customerInfo?.customerType && <p className="mb-0 text-secondary">Total Mart Orders</p>}
                                                <p className="mb-0">{customerData.totalOrders}</p>
                                            </div>

                                            {customerData.totalOrders > 0 && <div className="col">
                                                {"KYNZO" === customerData.customerInfo.customerType && <p className="mb-0 text-secondary">Recent Kynzo Order ID</p>}
                                                {"KYNZO" !== customerData.customerInfo.customerType && <p className="mb-0 text-secondary">Recent Mart Order ID</p>}
                                                {validate.isNotEmpty(customerData.recentOrderId) && <p className="mb-0">{customerData.recentOrderId}</p>}
                                            </div>}
                                        </React.Fragment>}
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h4 className="h6 custom-fieldset mb-2">Change Mobile Number Verification</h4>
                        <ChangeMobileNum customerData={customerData} getCustomerInfo={getCustomerInfo} />
                    </div>

                    <div className="mt-4">                       
                        <div className="d-flex align-items-baseline gap-5">
                            <h4 className="h6 custom-fieldset mb-2">Create Prescription Order</h4>                            
                        </div>
                        <Card>
                            <CardHeader className="bg-white">
                                <FormGroup check>
                                    <Input type="checkbox" id="whatsAppImagesCheck" className="me-2" value="A" checked={isWhatsAppImages} onChange={(e) => { setIsWhatsappImages(!isWhatsAppImages); setResetDocuments(true) }} />
                                    <label htmlFor="whatsAppImagesCheck">WhatsApp Images</label>
                                </FormGroup>
                            </CardHeader>
                            <CardBody className="p-12">
                                <div className="d-flex gap-3">                            
                                    <div className="d-flex flex-column justify-content-start">
                                        <DocumentUpload
                                            fileSelectOption={true}
                                            documentScanOption={false}
                                            buttonClassName={'scan-button'}
                                            imageContainerClassName={'image-container'}
                                            isAppendAllowed={true}
                                            resetAddedDocuments={resetDocuments}
                                            uploadActionInParent={false}
                                            getAddedDocuments={documentsTrigger}
                                            allowedFileFormats={".jpg,.jpeg,.png,.pdf"}
                                            onSuccessResponse={(files) => { onDocumentsUpload(files) }}
                                            onErrorResponse={(message) => { setAlertContent({ message: message, show: true, alertType: ALERT_TYPE.ERROR }) }}
                                            includeLightBox={false}
                                            imageTitle={"Prescription Upload Details"}
                                            loadingStatus={(isloading)=>{setIsDocumentLoading(isloading)}}
                                        />                                                                                                                
                                     </div>
                                </div>
                            </CardBody>
                            <CardFooter className="bg-white d-flex justify-content-between align-items-center flex-column flex-lg-row">
                                <div className="text-secondary d-flex align-self-start align-self-lg-center gap-2 font-12 m-2">
                                    <p className="mb-0">Note: </p>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0">1. Image Size must be upto 4MB per image</p>
                                        <p className="mb-0">2. Maximum 4 files are allowed to upload</p>
                                    </div>
                                </div>
                                <div className=" align-self-end align-self-lg-center">
                                    <Button variant="brand" disabled={uploadLoader} className='px-4' onClick={() => { setUploadLoader(true); setDocumentsTrigger(true) }} >
                                        {uploadLoader ? <CustomSpinners spinnerText={"Upload"} className={"spinner-position"} /> : "Upload"}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>                        
                    </div>
                </div>            
        </React.Fragment>
    )
}

export default BioDashBoard;