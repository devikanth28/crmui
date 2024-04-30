import React, { useContext, useEffect, useRef, useState } from "react";
import EkycService from "../../services/Ekyc/EkycService";
import DocumentUpload from "@medplus/react-common-components/DocumentUpload"
import Validate from "../../helpers/Validate";
import { AlertContext } from "../Contexts/UserContext";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import { Button, ModalTitle } from "react-bootstrap";
import CloseIcon from '../../images/cross.svg';
import CustomerDetails from "../customer/CustomerDetails";
import edit_icon from '../../images/edit_icon.svg';
import { Modal, ModalBody, ModalFooter, ModalHeader, UncontrolledTooltip } from "reactstrap";
import DynamicForm, { ALERT_TYPE, CustomSpinners, StackedImages, withFormHoc } from "@medplus/react-common-components/DynamicForm";
import OrderService from "../../services/Order/OrderService"
import { API_URL, REQUEST_TYPE } from "../../services/ServiceConstants";
import imageLoader from "../../images/image-load.gif";


const EKycModal = ({ helpers, ...props }) => {
    const validate = Validate();
    const ekycService = EkycService();
    const headerRef = useRef(0);
    const { setStackedToastContent, setAlertContent } = useContext(AlertContext);
    const [loading, setLoading] = useState(false);
    const [updateButtonLoader, setUpdateButtonLoader] = useState(false);
    const [modalData, setModalData] = useState();
    const [actionInProgress, setActionInProgress] = useState(false);
    const [editCustomerForm, setEditCustomerForm] = useState(false);
    const [editKycForm, setEditKycForm] = useState(false);
    const [isUploadLoader, setUploadLoader] = useState(false);
    const [documentsTrigger, setDocumentsTrigger] = useState(false);
    const [inputEmail, setInputEmail] = useState(modalData?.customerKYCDetails[0]?.email);
    const [inputPan, setInputPan] = useState();
    const [reload, setReload] = useState(true);
    const CloseButton = <Button variant="" className="btn-close icon-hover" type="button" onClick={() => { setEditKycForm(false); setEditCustomerForm(false) }}></Button>
    const [headerText, setHeaderText] = useState();
    const [buttonText, setButtonText] = useState();


    useEffect(() => {
        setDocumentsTrigger(isUploadLoader);
    }, [isUploadLoader]);

    useEffect(() => {
        setLoading(true);
        getKycModalData();
    }, [reload])

    const getKycModalData = async () => {
        setActionInProgress(true);
        ekycService.getCustomerKYCData({ customerId: props.customerId }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                setModalData(data.dataObject);
                setInputEmail(data.dataObject?.customerKYCDetails[0]?.email)
                setInputPan(data.dataObject?.customerKYCDetails[0]?.panNo)
            } else {
                setStackedToastContent({ toastMessage: data.message });
                setEditKycForm(false);
            }
            setLoading(false);
        }).catch(e => {
            console.log(e);
            setStackedToastContent({ toastMessage: "Unable to open Modal" });
            setEditKycForm(false);
        })
        setActionInProgress(false);
    }

    const toggle = () => {
        props.setSelectedKycId(modalData.customerKYCDetails[0].kycId);
        props.setShowKycModal(false);
        setTimeout(()=>props.setSelectedKycId(false),2000);
    }

    const getActionForm = (value, editType) => {
        if (editType == "editCustomer") {
            setEditCustomerForm(true);
            setHeaderText("Edit Customer Details");
            setButtonText("Update");
        }
        else if (editType == "editKyc") {
            setEditKycForm(true);
            setInputEmail(modalData.customerKYCDetails[0]?.email)
            setInputPan(modalData.customerKYCDetails[0]?.panNo)
            setHeaderText("Edit KYC Details");
            setButtonText("Update");
        }
    }

    const onDocumentsUpload = (files) => {
        if (validate.isNotEmpty(files)) {
            OrderService().uploadFilesToImageServer(files, "K", {}).then((response) => {
                if (validate.isNotEmpty(response) && validate.isNotEmpty(response.response)) {
                    submitKYC(response.response)
                }
            }).catch(e => {
                console.log(e);
                setStackedToastContent({ toastMessage: "Something went wrong, Please Try Again!" });
            })
        } else {
            submitKYC([]);
        }

    }

    const documentFileUpload = () => {
        return <React.Fragment>
            <div className="col-4">
                <DocumentUpload
                    singleFileUpload={true}
                    fileSelectOption={true}
                    documentScanOption={false}
                    buttonClassName={'scan-button'}
                    imageContainerClassName={'image-container'}
                    isAppendAllowed={false}
                    resetAddedDocuments={true}
                    uploadActionInParent={false}
                    getAddedDocuments={documentsTrigger}
                    allowedFileFormats={".jpg,.jpeg,.png"}
                    onSuccessResponse={(files) => { onDocumentsUpload(files) }}
                    onErrorResponse={(message) => { setAlertContent({ message: message, show: true, alertType: ALERT_TYPE.ERROR }) }}
                    onDeleteResponse={() => { }}
                    includeLightBox={true}
                    imageTitle={"KYC Details"}
                />
            </div>
        </React.Fragment>
    }

    const submitKYC = (imageInfoList) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        const customerForm = {};
        customerForm["customerId"] = modalData.customerKYCDetails[0].customerId;
        customerForm["panCardNo"] = inputPan;
        if(validate.isEmpty(inputPan)){
            setStackedToastContent({ toastMessage: "Please Enter Pan number." });
            setUploadLoader(false);
            setUpdateButtonLoader(false);
            return;
        }
        if (!panRegex.test(inputPan)) {
            setStackedToastContent({ toastMessage: "Invalid pan card number." });
            setUploadLoader(false);
            setUpdateButtonLoader(false);
            return;
        }
        customerForm["kycId"] = modalData.customerKYCDetails[0].kycId;
        if (validate.isNotEmpty(imageInfoList)) {
            customerForm["imageInfoList"] = JSON.stringify(imageInfoList);
        }
        if (validate.isEmpty(modalData.customerKYCDetails[0].kycDocumentsInfo) && validate.isNotEmpty(customerForm["panCardNo"]) && validate.isEmpty(imageInfoList)) {
            setStackedToastContent({ toastMessage: "Please upload image to submit" });
            setUploadLoader(false);
            setUpdateButtonLoader(false);
            return;
        }
        ekycService.updateKycInfo({ data: customerForm }).then((data) => {
            if (validate.isNotEmpty(data)) {
                if (data.statusCode == 'SUCCESS') {
                    setStackedToastContent({ toastMessage: data.message })
                    setUpdateButtonLoader(false);
                    setEditKycForm(false);
                    props.onSubmitClick(modalData.customerKYCDetails[0].customerId);
                    props.setShowKycModal(false);
                } else {
                    setUpdateButtonLoader(false);
                    setStackedToastContent({ toastMessage: data.message })
                }
            } else {
                setStackedToastContent({ toastMessage: "Unable to porcess" });
            }
            setUpdateButtonLoader(false);
        }).catch(e => {
            console.log(e);
            setStackedToastContent({ toastMessage: "Unable to porcess" });
        })
        setUploadLoader(false);
    }

    const updateCustomerValues = () => {
        helpers.resetForm('kycCustomerForm');
        if (validate.isNotEmpty(modalData.customerInfo)) {
            if (validate.isNotEmpty(modalData.customerInfo.dob)) {
                helpers.updateValue(modalData.customerInfo.dob, 'dob')
            }
            if (validate.isNotEmpty(modalData.customerInfo.gender)) {
                helpers.updateValue(modalData.customerInfo.gender, 'gender')
            }
            if (validate.isNotEmpty(modalData.customerInfo.fName)) {
                helpers.updateValue(modalData.customerInfo.fName + " " + modalData.customerInfo.lName, 'fullName')
            }
        }
    }

    const bindEnter = (payload)=> {
        const [event] = payload;
        if(event.key == 'Enter'){
           event.preventDefault();
        }
    }

    const customerObserversMap = {
        'kycCustomerForm': [['load', updateCustomerValues],['keydown' , bindEnter]],
    }

    const onCustomerEditSubmit = () => {
        const formData = helpers.validateAndCollectValuesForSubmit('kycCustomerForm');
        let namePattern = /^[A-Za-z\s]*$/;
        if(validate.isEmpty(formData)){
            setUpdateButtonLoader(false);
            return;
        }
        if (validate.isEmpty(formData.fullName) || !namePattern.test(formData.fullName)) {
            setStackedToastContent({ toastMessage: "Enter Valid Name" });
            setUpdateButtonLoader(false);
            return;
        }
        ekycService.updateCustomerInfo({ customerId: modalData.customerKYCDetails[0].customerId, fullName: formData.fullName, dob: formData.dob, gender: formData.gender[0] }).then(data => {
            if (validate.isNotEmpty(data)) {
                if (data.statusCode == 'SUCCESS') {
                    setStackedToastContent({ toastMessage: data.message });
                    setUpdateButtonLoader(false);
                    setEditCustomerForm(false);
                    props.onSubmitClick(props.customerId);
                    setReload(!reload);
                } else {
                    setUpdateButtonLoader(false);
                    setStackedToastContent({ toastMessage: data.message });
                }
            }
            setUpdateButtonLoader(false);
        }).catch(e => {
            console.log(e);
            setStackedToastContent({ toastMessage: "Unable to process" })
        })
    }

    const kycHold = async (status) => {
        await ekycService.holdKyc({ customerId: modalData.customerKYCDetails[0].customerId, status: status }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode == 'SUCCESS') {
                setStackedToastContent({ toastMessage: "Kyc rejected successfully" });
                props.setShowKycModal(false);
                props.onSubmitClick(modalData.customerKYCDetails[0].customerId);
            } else {
                setStackedToastContent({ toastMessage: data.message });
            }
        }).catch(e => {
            console.log(e);
            setStackedToastContent({ toastMessage: "Failed to reject Kyc" });
        })
    }

    const kycReject = async () => {
        await ekycService.rejectKyc({ customerId: modalData.customerKYCDetails[0].customerId, mobileNo: modalData.customerKYCDetails[0].mobileNo }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode == 'SUCCESS') {
                setStackedToastContent({ toastMessage: "Kyc rejected successfully" });
                props.setShowKycModal(false);
                props.onSubmitClick(modalData.customerKYCDetails[0].customerId);
            } else {
                setStackedToastContent({ toastMessage: data.message });
            }
        }).catch(e => {
            console.log(e);
            setStackedToastContent({ toastMessage: "Failed to reject Kyc" });
        })
    }

    const kycTryLater = async () => {
        await ekycService.kycVerifyOrTryLater({ customerId: modalData.customerKYCDetails[0].customerId, status: 'P' }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode == 'SUCCESS') {
                setStackedToastContent({ toastMessage: "Kyc Made to Try later" });
                props.setShowKycModal(false);
                props.onSubmitClick(modalData.customerKYCDetails[0].customerId);
            } else {
                setStackedToastContent({ toastMessage: data.message });
            }
        }).catch(e => {
            console.log(e);
            setStackedToastContent({ toastMessage: "Failed to Make kyc Try Later" });
        })
    }

    const handleVerifyButton = async () => {
        if (modalData.customerKYCDetails[0].status == "HOLD") {
            await kycHold('D');
        }
        else if (modalData.customerKYCDetails[0].verifyStatus === 'I' || modalData.customerKYCDetails[0].verifyStatus === 'P') {
            await kycVerify();
        }
    }

    const kycVerify = async () => {
        await ekycService.kycVerifyOrTryLater({ customerId: modalData.customerKYCDetails[0].customerId, status: 'V' }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode == 'SUCCESS') {
                setStackedToastContent({ toastMessage: "Kyc Verified successfully" });
                props.setShowKycModal(false);
                props.onSubmitClick(modalData.customerKYCDetails[0].customerId);
            } else {
                setStackedToastContent({ toastMessage: data.message });
            }
        }).catch(e => {
            console.log(e);
            setStackedToastContent({ toastMessage: "Failed to verified Kyc" });
        })
    }

    const updateEmail = async () => {
        let emailId = inputEmail;
        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (validate.isEmpty(emailId) || !emailPattern.test(emailId)) {
            setStackedToastContent({ toastMessage: "Enter Valid EmailId" });
            setUpdateButtonLoader(false);
            return;
        }
        ekycService.updateKycEmailId({ customerId: modalData.customerKYCDetails[0].customerId, emailId: emailId }).then(data => {
            if (validate.isNotEmpty(data)) {
                if (data.statusCode == 'SUCCESS') {
                    modalData.customerKYCDetails[0].email = emailId;
                    setStackedToastContent({ toastMessage: "Email updated successfully" })
                    props.onSubmitClick(modalData.customerKYCDetails[0].customerId);
                } else {
                    setStackedToastContent({ toastMessage: data.message })
                }
            } else {
                setStackedToastContent({ toastMessage: "Failed to reject Kyc" })
            }
            setEditKycForm(false);
            setUpdateButtonLoader(false);
        }).catch(e => {
            console.log(e)
            setStackedToastContent({ toastMessage: "Failed to reject Kyc" });
        })
    }

    return <React.Fragment>
        <div className="custom-modal header">
            <Wrapper className="m-0 h-100">
                <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-1">
                    Customer KYC Details
                    <div class=" d-flex align-items-center">
                        <Button variant=" " onClick={toggle} className="rounded-5 icon-hover btn-link">
                        <span className='custom-close-btn icon-hover'></span>
                        </Button>
                    </div>
                </HeaderComponent>
                <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height" >
                    {!loading && <div class="row g-0 h-100">
                        <div className="col-4 h-100">
                            <div class="card" style={{ "max-height": "100%" }}>
                                {modalData && validate.isNotEmpty(modalData.customerInfo) ? <>
                                    <div className='p-12 border-bottom d-flex justify-content-between align-items-center'>
                                        <h4 className="fs-6 mb-0">Customer Information</h4>
                                    </div>
                                    {validate.isNotEmpty(modalData.customerInfo) ?
                                        <div className="p-12 align-items-center border-bottom">
                                            <CustomerDetails customerId={modalData.customerKYCDetails[0].customerId} mobileNumber={modalData.customerKYCDetails[0].mobileNo} dob={modalData.customerInfo.dob} gender={modalData.customerInfo.gender} emailId={modalData.customerKYCDetails[0].email} customerName={modalData.customerInfo.fName + " " + modalData.customerInfo.lName} />
                                            {modalData.customerKYCDetails[0].isPanVerified!="Y" &&  <React.Fragment>
                                                <Button variant='' disabled={actionInProgress ? 'disabled' : ''} className='btn-sm rounded-5 icon-hover btn-link me-2 position-absolute end-0' style={{"top":"3rem"}} id="editCustomerDetailsButton" onClick={() => getActionForm(modalData, "editCustomer")}><img src={edit_icon} alt="edit order details" /></Button>
                                                <UncontrolledTooltip placement="bottom" target="editCustomerDetailsButton">
                                                    {"Edit Customer Info"}
                                                </UncontrolledTooltip>
                                            </React.Fragment>}
                                        </div>
                                        : <h6 className="h-100">Customer Information Not Found</h6>}
                                </>
                                    : null}
                                <div className="p-12 border-bottom d-flex justify-content-between align-items-center">
                                    <h4 className="fs-6 mb-0">KYC Information</h4>
                                </div>
                                {validate.isNotEmpty(modalData?.customerKYCDetails[0]) ?
                                    <div className="p-12">
                                        <React.Fragment>
                                            {validate.isNotEmpty(modalData.customerKYCDetails[0].customerId) ? <div className={`${Validate().isNotEmpty(props.needRule) && props.needRule == true ? 'custom-border-bottom-dashed' : ""}`}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="w-100">
                                                        {validate.isNotEmpty(modalData.customerKYCDetails[0].email) && modalData.customerKYCDetails[0].status == "PENDING" && <div>
                                                            <p className='align-items-center d-flex font-12 mb-0 text-secondary'>Email </p>
                                                            <h6 className='font-14'>{modalData.customerKYCDetails[0].email}</h6>
                                                        </div>}
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            {validate.isNotEmpty(modalData.customerKYCDetails[0].panNo) ?
                                                                <div className="mb-5">
                                                                    <p className='align-items-center d-flex font-12 mb-0 text-secondary'>PAN Number</p>
                                                                    <h6 className='mb-0 font-14'>{modalData.customerKYCDetails[0].panNo}</h6>
                                                                </div> : <></>}
                                                            {(validate.isNotEmpty(modalData.customerKYCDetails[0].kycDocumentsInfo)) &&
                                                                <div className="align-self-stretch" >
                                                                    <p className='text-secondary small mb-0'>KYC Document</p>
                                                                    <StackedImages includeLightBox defaultImage={imageLoader} images={modalData.customerKYCDetails[0].kycDocumentsInfo} maxImages="4" />
                                                                </div>}
                                                        </div>
                                                        {validate.isEmpty(modalData.customerKYCDetails[0].kycDocumentsInfo) && <div>
                                                            <>Kyc Documents not Found.</>
                                                        </div>
                                                        }
                                                    </div>
                                                    {(modalData.customerKYCDetails[0]?.isPanVerified != "Y" && modalData.customerKYCDetails[0]?.status != "HOLD") && <React.Fragment>
                                                        <Button variant='' disabled={actionInProgress ? 'disabled' : ''} className='btn-sm rounded-5 icon-hover btn-link' id="editKycDetailsButton" onClick={() => getActionForm(modalData, "editKyc")}><img src={edit_icon} alt="edit order details" /></Button>
                                                        <UncontrolledTooltip placement="bottom" target="editKycDetailsButton">
                                                            {"Edit KYC Details"}
                                                        </UncontrolledTooltip>
                                                    </React.Fragment>}
                                                </div>
                                                <div className="d-flex justify-content-end gap-4">
                                                    {validate.isNotEmpty(modalData.customerKYCDetails[0]) && modalData.customerKYCDetails[0].isPanVerified != "Y" && modalData.customerKYCDetails[0].status == "COMPLETED" && (modalData.customerKYCDetails[0].verifyStatus == "I" || modalData.customerKYCDetails[0].verifyStatus == "P") && <div>
                                                        <Button variant=" " className='btn rounded-1 brand-secondary' id="kycReject" onClick={() => kycHold("H")}>KYC Reject</Button>
                                                    </div>
                                                    }
                                                    {validate.isNotEmpty(modalData.customerKYCDetails[0]) && validate.isNotEmpty(modalData.customerKYCDetails[0].panNo) && modalData.customerKYCDetails[0].isPanVerified != "Y" && modalData.customerKYCDetails[0].status == "COMPLETED" && modalData.customerKYCDetails[0].verifyStatus == "V" && <div>
                                                        <Button variant=" " className='btn rounded-1 brand-secondary' id="panReject" onClick={() => kycReject()}>PAN Reject</Button>
                                                    </div>
                                                    }
                                                    {validate.isNotEmpty(modalData.customerKYCDetails[0]) && modalData.customerKYCDetails[0].isPanVerified != "Y" && modalData.customerKYCDetails[0].status == "COMPLETED" && modalData.customerKYCDetails[0].verifyStatus == "I" && <div>
                                                        <Button variant=" " className='btn rounded-1 brand-secondary' id="kycReject" onClick={() => kycTryLater()}>Try Later</Button>
                                                    </div>
                                                    }
                                                    {validate.isNotEmpty(modalData.customerKYCDetails[0]) && modalData.customerKYCDetails[0].isPanVerified != "Y" && (modalData.customerKYCDetails[0].verifyStatus == "I" || modalData.customerKYCDetails[0].verifyStatus == "P") && <div>
                                                        <Button variant=" " className='btn rounded-1 brand-secondary' id="kycReject" onClick={() => handleVerifyButton()}>Verify</Button>
                                                    </div>
                                                    }
                                                </div>
                                            </div> : <></>}
                                        </React.Fragment>
                                    </div>
                                    : <h6>KYC Information Not Found</h6>}
                            </div>
                        </div>
                        {editCustomerForm &&
                            <Modal className={"modal-dialog-centered modal-lg"} isOpen={editCustomerForm}>
                                {headerText && <ModalHeader className='p-12' close={CloseButton}>
                                    <ModalTitle className="h6">{headerText}</ModalTitle>
                                </ModalHeader>}
                                <ModalBody className='p-12 align-items-center'>
                                    <DynamicForm requestUrl={API_URL + "kycCustomerForm"} headers={{ "x-requested-with": "XMLHttpRequest" }} requestMethod={REQUEST_TYPE.GET} helpers={helpers} observers={customerObserversMap} />
                                </ModalBody>
                                <ModalFooter className="justify-content-center p-2">
                                    <div>
                                        <Button variant=" " size="sm" className="px-4 me-3 brand-secondary" onClick={() => setEditCustomerForm(!editCustomerForm)}>
                                            Close
                                        </Button>
                                        <Button variant="brand" size="sm" className="px-4" onClick={() => { setUpdateButtonLoader(true); onCustomerEditSubmit() }}>
                                            {!updateButtonLoader ? buttonText : <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant=" " />}
                                        </Button>
                                    </div>
                                </ModalFooter>
                            </Modal>
                        }
                        {editKycForm &&
                            <Modal className={"modal-dialog-centered modal-lg"} isOpen={editKycForm}>
                                {headerText && <ModalHeader className='p-12' close={CloseButton}>
                                    <ModalTitle className="h6">{headerText}</ModalTitle>
                                </ModalHeader>}
                                <ModalBody className='p-12 align-items-center'>
                                    <div className="row g-2">
                                        {modalData.customerKYCDetails[0].email && modalData.customerKYCDetails[0].status == "PENDING" && (
                                            <div className="col-4">
                                                <div className="form-floating">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="email"
                                                        value={inputEmail}
                                                        onChange={(e) => { setInputEmail(e.target.value) }}
                                                    />
                                                    <label htmlFor="email">Email</label>
                                                </div>
                                            </div>
                                        )}

                                        {modalData.customerKYCDetails[0]?.status !== "PENDING" && (
                                            <div className="col-4">
                                                <div className="form-floating">
                                                    <input
                                                        maxLength="10"
                                                        type="text"
                                                        className="form-control"
                                                        id="panNo"
                                                        pattern="[A-Z]{5}[0-9]{4}[A-Z]"
                                                        value={inputPan}
                                                        onChange={(e) => { setInputPan(e.target.value) }}
                                                    />
                                                    <label htmlFor="panNo">Pan No.</label>
                                                </div>
                                            </div>
                                        )}
                                        {modalData.customerKYCDetails[0]?.status != "PENDING" && documentFileUpload()}

                                    </div>
                                </ModalBody>
                                <ModalFooter className="justify-content-center p-2">
                                    <div>
                                        <Button variant=" " size="sm" className="px-4 me-3 brand-secondary" onClick={() => setEditKycForm(!editKycForm)}>
                                            Close
                                        </Button>
                                        <Button variant="primary" size="sm" className="px-4" onClick={() => { setUpdateButtonLoader(true); (modalData.customerKYCDetails[0].email && modalData.customerKYCDetails[0].status == "PENDING") ? updateEmail() : setUploadLoader(true) }}>
                                            {!updateButtonLoader ? buttonText : <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant=" " />}
                                        </Button>
                                    </div>
                                </ModalFooter>
                            </Modal>}
                    </div>}
                </BodyComponent>
            </Wrapper>
        </div>
    </React.Fragment>
}

export default withFormHoc(EKycModal);