import React, { useContext, useEffect, useState } from "react";
import { ALERT_TYPE, CustomSpinners } from '@medplus/react-common-components/DynamicForm';

import UserService from "../../../services/Common/UserService";
import Validate from "../../../helpers/Validate";
import { AlertContext } from "../../Contexts/UserContext";
import { TOAST_POSITION } from "@medplus/react-common-components/DynamicForm";
import DocumentUpload from "@medplus/react-common-components/DocumentUpload";
import OrderService from "../../../services/Order/OrderService";
import { Button, Card, CardBody, CardFooter, CardHeader, FloatingLabel, Form, FormGroup } from "react-bootstrap";
import { Input } from "reactstrap";
import ButtonWithSpinner from "../../Common/ButtonWithSpinner";
import { ValidatePhotoIdNumberAgaistType } from "../MembershipAdvantage/MembershipHelper";
import { isValidPhotoIdFiles } from "../CustomerHelper";


const ChangeMobileNum = props => {
    const [selectedValue, setSelectedValue] = useState("existing");
    const [mobileNo, setMobileNo] = useState("");
    const [otpValue, setOtpValue] = useState("");
    const [isCurrentMobileNumVerified, setIsCurrentMobileNumVerified] = useState(false);
    const [documentType, setDocumentType] = useState("");
    const [documentId, setDocumentId] = useState("");
    const [documentsTrigger, setDocumentsTrigger] = useState(false);
    const [uploadLoader, setUploadLoader] = useState(false);
    const [imageServerDetails, setImageServerDetails] = useState([]);
    const [isKycVerified, setKycVerified] = useState(false);
    const validate = Validate();
    const { setStackedToastContent } = useContext(AlertContext);
    const [showUplaod, setShowUpload] = useState(false);
    const [showKycForm,setShowKycForm] = useState(false);
    const [showResendOTP,setShowResendOTP] = useState(false);
    const [existingOtpSent,setExistingOtpSent] = useState(false);
    const [newOtpSent,setNewOtpSent] = useState(false);
    const [newNumberOtpValue,setNewNumberOtpValue] = useState('');
    const [existingNumberOtpValue,setExistingNumberOtpValue] = useState(''); 
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [otpVerifySpinner, setOtpVerifySpinner] = useState(false);
    const [resetDocuments,setResetDocuments] = useState(false);
    const [isDocumentLoading, setIsDocumentLoading] = useState(false)

    const kycTypeEnum = { 'A': 'AADHAAR_CARD', 'P': 'PAN_CARD', 'O': 'PASSPORT' };


    const customerInfo = props.customerData?.customerInfo;
    const { firstName, lastName, gender, mobileNumber, landLine, emailId, customerID, dateOfBirth, accountType, webLoginID, receiveUpdates } = customerInfo;
    const updatedMobileNo = localStorage.getItem(`${customerID}updatedMobileNo`);
    useEffect(() => {
        setDocumentsTrigger(uploadLoader);
    }, [uploadLoader]);

    useEffect(()=>{
        setResetDocuments(false);
    }, [isDocumentLoading])

    useEffect(() => {
        validateDocId();
    }, [documentId]);

    useEffect(() => {
        if (validate.isNotEmpty(mobileNo)) {
            localStorage.setItem(`${customerID}updatedMobileNo`, mobileNo);
            setMobileNo("");
        }
    }, [isCurrentMobileNumVerified]);

    const validateMobileNum = async (isResend) => {
        setButtonSpinner(true);
        if (validate.isEmpty(mobileNo) && (("existing" == selectedValue && isCurrentMobileNumVerified) || ("kyc" == selectedValue))) {
            setButtonSpinner(false);
            setStackedToastContent({ toastMessage: "Please enter valid Mobile Number", position: TOAST_POSITION.BOTTOM_START });
            return;
        }
        if (validate.isNotEmpty(mobileNo) && validate.isNotEmpty(updatedMobileNo) && mobileNo == updatedMobileNo && (("existing" == selectedValue) || "kyc" == selectedValue)) {
            setButtonSpinner(false);
            setStackedToastContent({ toastMessage: "Please enter different Mobile Number", position: TOAST_POSITION.BOTTOM_START });
            return;
        }
        else {
            await checkMobileNumber(mobileNo, isResend);
        }
    }

    const checkMobileNumber = async (mobileNum, isResend) => {
        const config = { params: { "number": mobileNum } };
        await UserService().checkMobileNumber(config).then(res => {
            if (res && res.statusCode && "SUCCESS" == res.statusCode) {
                setButtonSpinner(false);
                handleSendOtp(isResend)
            } else {
                setButtonSpinner(false);
                setStackedToastContent({ toastMessage: "Customer is Already Exists with this mobile number,Please give another", position: TOAST_POSITION.BOTTOM_START })
            }
        }).catch(err => {
            setButtonSpinner(false);
            console.log(err);
        })
    }
    const handleSendOtp = (isForResend) => {
        let config = {};
        if (selectedValue == "existing") {
            config = { headers: { customerId: customerInfo?.customerID }, params: { "isForResend": isForResend, "newMobileNumber": (updatedMobileNo && validate.isEmpty(mobileNo)) ? updatedMobileNo : mobileNo } };
        }
        else if (selectedValue == "new" || (selectedValue == "kyc" && isKycVerified)) {
            config = { headers: { customerId: customerInfo?.customerID }, params: { "isForResend": isForResend, "newMobileNumber": mobileNo } };
        }
        setButtonSpinner(true);
        UserService().sendOtpToMobile(config).then(res => {
            if (validate.isNotEmpty(res)) {
                setButtonSpinner(false);
                if (validate.isNotEmpty(res.statusCode)) {
                    if('existing' == selectedValue || 'kyc' == selectedValue){
                        setExistingOtpSent("SUCCESS" == res.statusCode);
                    } 
                    if('new' == selectedValue) {
                        setNewOtpSent("SUCCESS" == res.statusCode);
                    }
                    setShowResendOTP("SUCCESS" == res.statusCode);
                }
                if (validate.isNotEmpty(res.message)){
                    setStackedToastContent({ toastMessage: res.message, position: TOAST_POSITION.BOTTOM_START });
                }
            }
            else{
                setButtonSpinner(false);
                setStackedToastContent({toastMessage: "Something Went Wrong", position:TOAST_POSITION.BOTTOM_START})
            }
        }).catch(error => {
            if('existing' == selectedValue || 'kyc' == selectedValue){
                setExistingOtpSent(false);
            } 
            if('new' == selectedValue) {
                setNewOtpSent(false);
            }
            setButtonSpinner(false);
            setStackedToastContent({ toastMessage: "Unable to send OTP at this time, please try again later.", position: TOAST_POSITION.BOTTOM_START })
            console.log("Error in sending OTP to mobile number : ", error);
        })
    }

    const verifyOtp = () => {
        if (validate.isEmpty('new' == selectedValue ? newNumberOtpValue : existingNumberOtpValue)) {
            setStackedToastContent({ toastMessage: "Empty Otp Value", position: TOAST_POSITION.BOTTOM_START });
            return;
        }
        setOtpVerifySpinner(true);
        const config = { headers: { customerId: customerInfo?.customerID }, params: { "otpValue": 'new' == selectedValue ? newNumberOtpValue : existingNumberOtpValue ,"newMobileNumber" : (updatedMobileNo && validate.isEmpty(mobileNo))? updatedMobileNo :mobileNo} };
        UserService().verifyOtp(config).then(res => {    
            if (validate.isNotEmpty(res)) {
                if (validate.isNotEmpty(res.statusCode)) {
                    if ("SUCCESS" == res.statusCode) {
                        setOtpValue("");
                        if('existing' == selectedValue  || 'kyc' == selectedValue){
                            setExistingOtpSent(false);
                            setExistingNumberOtpValue("")
                        } 
                        if('new' == selectedValue) {
                            setNewOtpSent(false);
                            setNewNumberOtpValue("")
                        }
                        setIsCurrentMobileNumVerified("existing" == selectedValue ? !isCurrentMobileNumVerified : false);
                        setExistingNumberOtpValue('');
                        setShowResendOTP(false);
                    } else {
                        if('existing' == selectedValue || 'kyc' == selectedValue){
                            setExistingOtpSent(true);
                        } 
                        if('new' == selectedValue) {
                            setNewOtpSent(true);
                        }
                        setIsCurrentMobileNumVerified(false);
                    }
                }
                if (validate.isNotEmpty(res.message)) {
                    setStackedToastContent({ toastMessage: res.message, position: TOAST_POSITION.BOTTOM_START });
                }
                if ("SUCCESS" == res.statusCode && selectedValue && ("existing" == selectedValue || "kyc" == selectedValue) && validate.isNotEmpty(mobileNo)) {
                    updateCustomer(mobileNo);
                }

            }
            setOtpVerifySpinner(false);
        }).catch(error => {
            setOtpVerifySpinner(false);
            setStackedToastContent({ toastMessage: "Unable to verify OTP at this moment, please try again later.", position: TOAST_POSITION.BOTTOM_START })
            console.log("Error in sending OTP to mobile number : ", error);
        })
    }

    const updateCustomer = mobileNo => {
        const obj = {
            accountType: accountType,
            customerID: customerInfo.customerID,
            mobileNumber: mobileNo,
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            webLoginID: webLoginID,
            landLine: landLine,
            emailId: emailId,
            customerId: customerID,
            dateOfBirth: dateOfBirth?.slice(0, dateOfBirth.indexOf("T")),
            receiveUpdates: receiveUpdates,
            actualMobileNumber: mobileNumber
        }
        const config = { headers: { customerID }, data: obj };
        localStorage.setItem(`${customerID}updatedMobileNo`, mobileNo);
        setButtonSpinner(true);
        UserService().updateCustomer(config).then(res => {
            if (validate.isNotEmpty(res)) {
                setButtonSpinner(false);
                if (res.statusCode === "FAILURE") {
                    setStackedToastContent({ toastMessage: "Customer Details Updation failed,please try again", position: TOAST_POSITION.BOTTOM_START })
                } else if (res.statusCode === "SUCCESS" && validate.isNotEmpty(res.dataObject) && validate.isNotEmpty(res.dataObject.customerInfo)) {
                    props.getCustomerInfo();
                    if ("kyc" == selectedValue) {
                        setShowKycForm(true);
                    }
                    setStackedToastContent({ toastMessage: "Customer Details Updated", position: TOAST_POSITION.BOTTOM_START });
                }
                setShowCustomerEditForm(false);
            }
            else{
                setButtonSpinner(false);
                setStackedToastContent({toastMessage: "Something Went Wrong", position:TOAST_POSITION.BOTTOM_START})
            }
        }).catch(error => {
            setButtonSpinner(false);
            console.log(error);
        })
    }

    const handleOptionChange = (e) => {
        setResetDocuments(true);
        setDocumentType(e.target.value);
    }

    const onDocumentsUpload = async (files) => {
        if(!isValidPhotoIdFiles(files)){
            setStackedToastContent({ toastMessage: "Please upload valid file(s)" });
            setUploadLoader(false);
            return;
        }
        setDocumentsTrigger(false);
        await uploadKycDocument(files);
    }

    const uploadKycDocument = async files => {
        //setResetDocuments(false);
        if (validate.isEmpty(files)) {
            setUploadLoader(false);
            setImageServerDetails([]);
            setStackedToastContent({ toastMessage: "Please select a file" });
            return
        }
        let fileSize = Math.round((files[0].size / 1024));
        if (validate.isEmpty(files)) {
            setUploadLoader(false);
            setImageServerDetails([]);
            setStackedToastContent({ toastMessage: "Please select a file" });
            return
        }

        if (validate.isEmpty(documentType)) {
            setStackedToastContent({ toastMessage: "All Fields Are Mandatory For Uploading Kyc Document", position: TOAST_POSITION.BOTTOM_START });
            return;
        }
        if (validate.isEmpty(documentId)) {
            setStackedToastContent({ toastMessage: "Please Provide valid Document Id", position: TOAST_POSITION.BOTTOM_START });
            return;
        }
        else {
            if (validate.isNotEmpty(files) && files.length == 1 && fileSize > 2048) {
                setStackedToastContent({ toastMessage: "Please select a file upto 2MB Only", position: TOAST_POSITION.BOTTOM_START });
                return;
            }
            else {
                await OrderService().uploadFilesToImageServer(files, 'M', {}, "Bio_KYC").then(response => {
                    if (response.statusCode === "SUCCESS" && response.response) {
                        setImageServerDetails(response.response[0]);
                        setUploadLoader(false);
                        verifyKycDoc();
                        setResetDocuments(true);
                    }
                    if (response.statusCode === "FAILURE") {
                        setStackedToastContent({ toastMessage: response.message, position: TOAST_POSITION.BOTTOM_START });
                        setUploadLoader(false);
                    }
                    setUploadLoader(false);
                }).catch(error => {
                    console.log(error);
                    setStackedToastContent({ toastMessage: "Server Experiencing some problem", position: TOAST_POSITION.BOTTOM_START });
                    setUploadLoader(false);
                })
            }
        }
    }

    const verifyKycDoc = () => {
        let imageInfoList = {
            "imageServerName": imageServerDetails.imageServerName,
            "imageInfoList": [{
                'imageServerName': imageServerDetails.imageServerName, 'imageType': "MOBILE_KYC_IMAGE", "imagePath": imageServerDetails.imagePath,
                "originalImageName": imageServerDetails.originalImageName, "thumbnailPath": imageServerDetails.thumbnailPath
            }]
        };
        let imageData = { 'imageFile': imageInfoList }
        let partyKyc = {
            "partyId": customerID, "kycType": kycTypeEnum[documentType],
            "partyType": 'CUSTOMER', "kycStatus": 'PENDING', "RefNo": documentId, imageData
        }
        const formData = new FormData();
        formData.append("partyKyc", JSON.stringify(partyKyc));
        const config = { params: { "refNo": documentId }, data: formData }

        UserService().verifyKycDoc(config).then(res => {
            if (validate.isNotEmpty(res)) {
                if ("SUCCESS" == res.statusCode) {
                    setKycVerified(true);
                    setShowKycForm(false);
                    setStackedToastContent({ toastMessage: "File saved and verified successfully", position: TOAST_POSITION.BOTTOM_START });
                }
                else {
                    setShowKycForm(true);
                    setKycVerified(false);
                    setStackedToastContent({ toastMessage: "Unable to verify document, Try after some time!", position: TOAST_POSITION.BOTTOM_START });
                }
            }
        }).catch(err => {
            console.log("Error while uploading Kyc Document", err);
            setKycVerified(false);
            setShowKycForm(true);
        })
    }

    const validateDocId = () => {
        let pattern = '';
        switch (documentType) {
            case "A":
                pattern = new RegExp(/^\d{12}$/);
                break;
            case "P":
                pattern = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
                break;
            case "O":
                pattern = new RegExp(/^[0-9A-Z]{8}$/);
                break;
            default:
                break;
        }
        if (pattern) {
            if (!pattern.test(documentId)) {
                setShowUpload(false);
                return;
            }
            else {
                setStackedToastContent({ toastMessage: "" });
                setShowUpload(true);
            }
        }
    }

    const handleOnChange = (e) => {
        if(documentType == 'A' && (e.target.value == "" || validate.isNumeric(e.target.value))) {
           setDocumentId(e.target.value);
        }
    }

    return (
        <React.Fragment>
            <Card>
                <CardHeader className="bg-white">
                    <div className="row g-3">
                        <div className="col-12 col-lg-6">
                            <FormGroup check className="d-flex">
                                <Input type="radio" id="withExistingNum" className="me-2" name="selectTab" value="existing" checked={"existing" == selectedValue} onChange={(e) => { setSelectedValue(e.target.value); setShowKycForm(false) }} />
                                <label htmlFor="withExistingNum">With Existing Mobile Number</label>
                            </FormGroup>
                        </div>
                        {/*  <div className="col">
                                <FormGroup check>
                                    <Input type="radio" id="withNewNum" className="me-2" name="selectTab" value="new" checked={"new" == selectedValue} onChange={(e) => {setSelectedValue(e.target.value);setIsCurrentMobileNumVerified(false);setShowKycForm(false);setShowResendOTP(newOtpSent)}}/>
                                    <label htmlFor="withNewNum">With New Mobile Number</label>
                                </FormGroup>
                            </div> */}
                        <div className="col-12 col-lg-6">
                            <FormGroup check className="d-flex">
                                <Input type="radio" id="customerKyc" className="me-2" name="selectTab" value="kyc" checked={"kyc" == selectedValue} onChange={(e) => { setSelectedValue(e.target.value); setShowKycForm(true); }} />
                                <label htmlFor="customerKyc">With Customer KYC</label>
                            </FormGroup>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="p-12">
                    {selectedValue == "existing" && !isCurrentMobileNumVerified &&
                        <div className={`row g-3 ${selectedValue == "existing" ? "fade-in-animation" : ""}`}>
                            <div className="col-12 col-lg-6">
                                <FloatingLabel label="Verify Existing Mobile Number" controlId="existingNumber">
                                    <Form.Control type="text" size="sm" readOnly="readonly" value={updatedMobileNo ? updatedMobileNo : props.customerData?.customerInfo?.mobileNumber} aria-hidden="true" tabindex="-1" placeholder='Enter Mobile Number' maxLength={10} onChange={(e) => { (e.target.value == "" || validate.isNumeric(e.target.value)) ? setMobileNo(e.target.value): "" }} />
                                </FloatingLabel>
                                <div className="d-flex justify-content-between gap-2 flex-row-reverse mt-3">
                                       {/*  {!showResendOTP &&<Button variant=" " className='btn-outline-success py-2' onClick={() => handleSendOtp("N")}>
                                            <span className="visible">Send OTP</span>
                                        </Button>} */}

                                      {!showResendOTP &&  <ButtonWithSpinner showSpinner={buttonSpinner} disabled={buttonSpinner} className={'btn-outline-success py-2'} onClick={() => handleSendOtp("N")} buttonText={'Send OTP'}></ButtonWithSpinner> }

                                      {showResendOTP &&  <ButtonWithSpinner showSpinner={buttonSpinner} disabled={buttonSpinner} className={'px-4'} onClick={() => handleSendOtp("Y")} buttonText={'Resend OTP'}></ButtonWithSpinner> }

                                       {/*  {showResendOTP && <Button variant="link" className="px-4" onClick={() => handleSendOtp("Y")}>
                                            <span className="visible">Resend OTP</span>
                                        </Button>} */}

                                        
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <FloatingLabel label="Enter OTP" controlId="verifyOtp">
                                        <Form.Control type="text" disabled={!existingOtpSent} maxLength={5} value={existingNumberOtpValue} onChange={(e) => (e.target.value == "" || validate.isNumeric(e.target.value)) ? setExistingNumberOtpValue(e.target.value): ""} aria-hidden="true" placeholder='Enter OTP' />
                                    </FloatingLabel>
                                    <div className="d-flex flex-row-reverse mt-3">
                                        {/* <Button disabled={!existingOtpSent} variant=" " className='btn-outline-success px-4 py-2' onClick={() => verifyOtp()}>
                                            <span className="visible">Verify</span>
                                        </Button> */}
                                     <ButtonWithSpinner showSpinner={otpVerifySpinner} disabled={!existingOtpSent} className={'btn-outline-success px-4 py-2'} onClick={() => verifyOtp()} buttonText={'Verify'}></ButtonWithSpinner> 

                                    </div>
                            </div>
                        </div>
                    }
                    {(selectedValue == "new" || (("kyc" == selectedValue && isKycVerified && !showKycForm)) || (isCurrentMobileNumVerified && "kyc" != selectedValue)) &&
                        <div className={`${selectedValue == "new" ? "fade-in-animation" : ""}`}>
                            {selectedValue == "existing" && <p>Current Mobile Number : {updatedMobileNo ? updatedMobileNo : customerInfo?.mobileNumber} </p>}
                            <div className="row g-3">
                                <div className="col-12 col-lg-6">
                                    <FloatingLabel label="Enter New Mobile Number" controlId="newNumber">
                                        <Form.Control type="text" value={mobileNo} onChange={(e) => {(e.target.value == "" || validate.isNumeric(e.target.value)) ? setMobileNo(e.target.value) :"" }} aria-hidden="true" tabindex="-1" placeholder='Enter Mobile Number' maxLength={10} />
                                    </FloatingLabel>
                                    <div className="d-flex justify-content-between gap-2 flex-row-reverse mt-3">
                                           {/*  {!showResendOTP&&<Button variant=" " className='btn-outline-success py-2' onClick={() => {validateMobileNum("N");}}>
                                                <span className="visible">Send OTP</span>
                                            </Button>} */}

                                        {!showResendOTP &&  <ButtonWithSpinner showSpinner={buttonSpinner} disabled={buttonSpinner} className={'btn-outline-success py-2'} onClick={() => {validateMobileNum("N");}} buttonText={'Send OTP'}></ButtonWithSpinner> }

                                            {/* {showResendOTP && <Button variant="link" className="px-4" onClick={() => {validateMobileNum("Y")}}>
                                                <span className="visible">Resend OTP</span>
                                            </Button>} */}
                                        {  showResendOTP &&  <ButtonWithSpinner showSpinner={buttonSpinner} disabled={buttonSpinner} className={'px-4'} onClick={() => {validateMobileNum("Y")}} buttonText={'Resend OTP'}></ButtonWithSpinner> }

                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <FloatingLabel label="Enter OTP" controlId="verifyOtp">
                                            <Form.Control type="text" disabled={!existingOtpSent} maxLength={5} value={existingNumberOtpValue} onChange={(e) => (e.target.value == "" || validate.isNumeric(e.target.value)) ? setExistingNumberOtpValue(e.target.value) :""} aria-hidden="true" placeholder='Enter OTP' />
                                       </FloatingLabel>
                                        <div className="d-flex flex-row-reverse mt-3">
                                            {/* <Button variant=" " disabled={!newOtpSent} className='btn-outline-success px-4 py-2' onClick={() => verifyOtp()}>
                                                <span className="visible">Verify</span>
                                            </Button> */}
                                          <ButtonWithSpinner showSpinner={otpVerifySpinner} disabled={!existingOtpSent} className={'btn-outline-success px-4 py-2'} onClick={() => verifyOtp()} buttonText={'Verify'}></ButtonWithSpinner> 

                                        </div>
                                </div>
                            </div>
                        </div>
                    }
                    {"kyc" == selectedValue && showKycForm &&
                        <div className={`row g-3 ${selectedValue == "kyc" ? "fade-in-animation" : ""}`}>
                            <div className="col-12">
                                <h4 className="h6 custom-fieldset mb-2 text-start">Document Type</h4>
                                <div className="d-flex">
                                    <div className="d-flex gap-3 flex-wrap">

                                        <FormGroup check>
                                            <Input type="radio" name="documentType" id="aadharCard" className="me-2" value="A" checked={"A" == documentType} onChange={(e) => { handleOptionChange(e); setDocumentId("") }} />
                                            <label htmlFor="aadharCard">Aadhar Card</label>
                                        </FormGroup>


                                        <FormGroup check>
                                            <Input type="radio" name="documentType" id="panCard" className="me-2" value="P" checked={"P" == documentType} onChange={(e) => { handleOptionChange(e); setDocumentId("") }} />
                                            <label htmlFor="panCard">Pan Card</label>
                                        </FormGroup>


                                        <FormGroup check>
                                            <Input type="radio" name="documentType" id="passport" className="me-2" value="O" checked={"O" == documentType} onChange={(e) => { handleOptionChange(e); setDocumentId("") }} />
                                            <label htmlFor="passport">Passport</label>
                                        </FormGroup>

                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-4">
                                <h6 className="h6 custom-fieldset mb-12 text-start">Document Details</h6>
                                <div className="row w-100">
                                    <div className="col-12 col-lg-3 d-flex">
                                        <div className="d-flex flex-column">
                                            <DocumentUpload
                                                fileSelectOption={true}
                                                documentScanOption={false}
                                                buttonClassName={'scan-button'}
                                                imageContainerClassName={'image-container'}
                                                isAppendAllowed={false}
                                                resetAddedDocuments={resetDocuments}
                                                uploadActionInParent={false}
                                                getAddedDocuments={documentsTrigger}
                                                allowedFileFormats={".jpg,.jpeg,.png,.pdf"}
                                                onSuccessResponse={(files) => { onDocumentsUpload(files) }}
                                                onErrorResponse={(message) => { setStackedToastContent({ toastMessage: message, position: TOAST_POSITION.BOTTOM_START }) }}
                                                includeLightBox={false}
                                                imageTitle={"KYC Upload Details"}
                                                singleFileUpload={true}
                                                loadingStatus={(isloading)=>{setIsDocumentLoading(isloading)}}
                                            />
                                        </div>
                                    </div>
                                    {validate.isNotEmpty(documentType) &&
                                        <div className="col-12 col-lg-9 d-flex mt-4">
                                            <FloatingLabel className="w-100" label="Enter Document ID">
                                                {"A" == documentType && <Form.Control type="text" className={(!showUplaod && validate.isNotEmpty(documentId)) ? 'border-danger':''} placeholder='Enter Document ID' maxLength={12} value={documentId} onChange={(e) => handleOnChange(e) }/>}
                                                {"P" == documentType && <Form.Control type="text" className={(!showUplaod && validate.isNotEmpty(documentId)) ? 'border-danger':''} placeholder='Enter Document ID' maxLength={10} value={documentId} onChange={(e) => { setDocumentId(e.target.value) }} />}
                                                {"O" == documentType && <Form.Control type="text" className={(!showUplaod && validate.isNotEmpty(documentId)) ? 'border-danger':''} placeholder='Enter Document ID' maxLength={8} value={documentId} onChange={(e) => { setDocumentId(e.target.value) }} />}
                                                {/* {"" == documentType && <Form.Control type="text" placeholder='Enter Document ID' value={documentId} onChange={(e) => { setDocumentId(e.target.value) }} />} */}
                                                {(!showUplaod && validate.isNotEmpty(documentId)) && <span className="text-danger small">Invalid ID. Please provide valid document ID!</span>}
                                            </FloatingLabel>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </CardBody>
                {selectedValue == "kyc" && showKycForm &&
                    <CardFooter className="bg-white d-flex justify-content-between align-items-center flex-column flex-lg-row">
                        <div className="align-self-start align-self-lg-center text-secondary d-flex gap-2 font-12 m-2">
                            <p>Note : </p>
                            <div className="d-flex flex-column">
                                <p className="mb-0">1. Image Size can be upto 2MB</p>
                                <p className="mb-0">2. Photo ID number should be capitals</p>
                            </div>
                        </div>
                        <div className="align-self-end align-self-lg-center">
                            {<Button variant="brand" disabled={uploadLoader || !showUplaod} className='px-4' onClick={() => { setUploadLoader(true);setDocumentsTrigger(true); }} >
                                {uploadLoader ? <CustomSpinners spinnerText={"Upload Document"} className={"spinner-position"} /> : "Upload Document"}
                            </Button>}
                        </div>
                    </CardFooter>
                }
            </Card>
        </React.Fragment >
    )
}

export default ChangeMobileNum;
