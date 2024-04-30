import DocumentUpload from "@medplus/react-common-components/DocumentUpload";
import DynamicForm, { ALERT_TYPE, CustomAlert, CustomSpinners, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useState } from 'react';
import { Button, CloseButton } from 'react-bootstrap';
import Validate from '../../helpers/Validate';
import { HeaderComponent, BodyComponent, FooterComponent, Wrapper } from "../Common/CommonStructure";
import { useRef } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Roles } from "../../constants/RoleConstants";
import AccessDenied from "../ErrorComponents/AccessDenied";
import UserService from "../../services/Common/UserService";
import CustomerService from "../../services/Customer/CustomerService";
import { downloadFileInBrowser } from "../../helpers/CommonHelper";
import Dropdown from 'react-bootstrap/Dropdown';
import DownloadIcon from "../../images/download-icn-16.svg"
import FormHelpers from "../../helpers/FormHelpers";
import { AlertContext } from "../Contexts/UserContext";

const DoctorRegistration = ({ helpers, ...props }) => {
    const customerService = CustomerService();
    const validate = Validate();
    const SERVER_EXPERIENCING_SOME_PROBLEM = "Server experiencing some problem";

    const { setToastContent } = useContext(AlertContext)
    const [isUploadLoader, setUploadLoader] = useState(false);
    const [documentsTrigger, setDocumentsTrigger] = useState(false);
    const [registrationExcelWithError, setRegistrationExcelWithError] = useState({});
    const [isErrorExcelFile, setIsErrorExcelFile] = useState(false);
    const [checkDetailsExcelFile, setCheckDetailsExcelFile] = useState({});
    const [isCheckDetailsExcelFile, setIsCheckDetailsExcelFile] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [isInfoModelOpen, setInfoModelOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [isAccessDenied, setIsAccessDenied] = useState(false);
    const [uploadFor, setUploadFor] = useState("checkDetails");

    const headerRef = useRef(null);
    const footerRef = useRef(null);

    let timeoutId;

    useEffect(() => {
        if (isReset) {
            timeoutId = setTimeout(() => {
                setIsReset(false);
            }, 500);
        }
        return () => {
            setIsReset(false);
            clearTimeout(timeoutId);
        };
    }, [isReset]);

    useEffect(() => {
        UserService().getUserSessionDetails({}).then(data => {
            if (Validate().isNotEmpty(data) && "SUCCESS" === data.statusCode && Validate().isNotEmpty(data.dataObject)) {
                if (Validate().isNotEmpty(data.dataObject.userDetails) && Validate().isNotEmpty(data.dataObject.userDetails.roles)) {
                    setRoles(data.dataObject.userDetails.roles);
                    setIsAccessDenied(!data.dataObject.userDetails.roles.includes(Roles.ROLE_CRM_REGISTERED_DOCTOR_BULK));
                } else {
                    setRoles([]);
                }
            } else {
                setRoles([]);
            }
        })
    }, []);

    const onDocumentsUpload = (files) => {
        switch (uploadFor) {
            case "regDoc": uploadDoctorRegistrationInfo(files); break;
            case "checkDetails": uploadCheckDetails(files); break;
        }
        setDocumentsTrigger(false);
    }

    const downloadDoctorRegistrationTemplate = (event) => {
        window.open('/customer-relations/Templates/doctor-registration-template.xlsx');
        event.preventDefault();
    }

    const downloadCheckDetailsTemplate = (event) => {
        window.open('/customer-relations/Templates/doctor-check-details-template.xlsx');
        event.preventDefault();
    }

    const downloadRegistrationExcelWithError = (event) => {
        setIsErrorExcelFile(false);
        resetUploadForm();
        setIsReset(true);
        downloadFileInBrowser(registrationExcelWithError, "doctor-registration-reponse.xlsx");
        event.preventDefault();
    }

    const downloadCheckDoctorDetailsExcel = (event) => {
        setIsCheckDetailsExcelFile(false);
        setIsReset(true);
        resetUploadForm();
        downloadFileInBrowser(checkDetailsExcelFile, "check-details-reponse.xlsx");
        event.preventDefault();
    }

    const downloadActiveDoctors = () => {
        resetUploadForm();
        customerService.downloadActiveDoctors().then(response => {
            const contentType = validate.isNotEmpty(response.headers) ? response.headers['content-type'] : '';
            if (contentType === 'application/ms-excel') {
                downloadFileInBrowser(new Blob([response.data], { type: contentType }), "active-doctors-responses.xls");
            }
            if (response.statusCode === "SUCCESS" && response.message) {
                setToastContent({ toastMessage: response.message, show: true });
            }
            if (response.statusCode === "FAILURE") {
                setToastContent({ toastMessage: response.message, show: true });
            }
        }).catch(error => {
            setToastContent({ toastMessage: SERVER_EXPERIENCING_SOME_PROBLEM, show: true });
        })
    }


    const uploadDoctorRegistrationInfo = async (files) => {
        setUploadLoader(true);
        setRegistrationExcelWithError({});
        setCheckDetailsExcelFile({});
        setIsErrorExcelFile(false)
        setIsCheckDetailsExcelFile(false);
        if (validate.isEmpty(files)) {
            setToastContent({ toastMessage: "Please select a file", show: true });
            setUploadLoader(false);
        } else {
            customerService.uploadDoctorRegistrationInfo(files[0], uploadFor).then(response => {
                const contentType = validate.isNotEmpty(response.headers) ? response.headers['content-type'] : '';
                if (contentType === 'application/ms-excel') {
                    setRegistrationExcelWithError(new Blob([response.data], { type: contentType }));
                    setIsErrorExcelFile(true);
                    setToastContent({ toastMessage: "Doctor Registration failed, for more Info download error excel", show: true });
                }
                if (response.statusCode === "SUCCESS" && response.message) {
                    setIsReset(true);
                    setToastContent({ toastMessage: response.message, show: true });
                    resetUploadForm();
                }
                if (response.statusCode === "FAILURE") {
                    setToastContent({ toastMessage: response.message, show: true });
                }
                setUploadLoader(false);
            }).catch(error => {
                setToastContent({ toastMessage: SERVER_EXPERIENCING_SOME_PROBLEM, show: true });
                setIsReset(true);
                setUploadLoader(false);
            })
        }
    };

    const uploadCheckDetails = async (files) => {
        setUploadLoader(true);
        if (validate.isEmpty(files)) {
            setToastContent({ toastMessage: "Please select a file", show: true });
            setUploadLoader(false);
        } else {
            customerService.uploadCheckDetailsForDoctors(files[0], uploadFor).then(response => {
                const contentType = validate.isNotEmpty(response.headers) ? response.headers['content-type'] : '';
                if (contentType === 'application/ms-excel') {
                    setCheckDetailsExcelFile(new Blob([response.data], { type: contentType }));
                    setToastContent({ toastMessage: "Download Excel to check details", show: true });
                    setIsCheckDetailsExcelFile(true);
                }
                if (response.statusCode === "SUCCESS" && response.message) {
                    setToastContent({ toastMessage: response.message, show: true });
                    resetUploadForm();
                }
                if (response.statusCode === "FAILURE") {
                    setToastContent({ toastMessage: response.message, show: true });
                }
                setUploadLoader(false);
            }).catch(error => {
                setToastContent({ toastMessage: SERVER_EXPERIENCING_SOME_PROBLEM, show: true });
                setUploadLoader(false);
            })
            setIsReset(true);
            setDocumentsTrigger(false);
        }
    };

    const onRadioButtonChange = (value) => {
        setUploadFor(value);
        setIsReset(true);
        setRegistrationExcelWithError({});
        setCheckDetailsExcelFile({});
        setIsErrorExcelFile(false)
        setIsCheckDetailsExcelFile(false);
    }

    const observersMap = {
        'uploadFor': [['change', (payload) => onRadioButtonChange(payload[1].value)]],
    }

    const onFileChange = (response) => {
        if (response === true) {
            setRegistrationExcelWithError({});
            setCheckDetailsExcelFile({});
            setIsErrorExcelFile(false)
            setIsCheckDetailsExcelFile(false);
        }
    }

    const onFileRemoved = () => {
        setIsErrorExcelFile(false)
        setIsCheckDetailsExcelFile(false);
    }

    const getDoctorRegistrationUpload = () => {
        return (
            <React.Fragment>
                <div className="mb-4">
                    <DynamicForm formJson={FormHelpers().getDoctorRegistrationForm(helpers)} helpers={helpers} observers={observersMap} />
                </div>
                <div className="d-flex flex-column">
                    <div>
                        {"regDoc" == uploadFor && <label className="custom-fieldset mb-1 w-100 mb-2">Register Doctor</label>}
                        {"checkDetails" == uploadFor && <label className="custom-fieldset mb-1 w-100 mb-2">Check Details</label>}
                        <DocumentUpload
                            fileSelectOption={true}
                            documentScanOption={false}
                            buttonClassName={'scan-button'}
                            imageContainerClassName={'image-container'}
                            isAppendAllowed={false}
                            resetAddedDocuments={isReset}
                            getAddedDocuments={documentsTrigger}
                            previousFilesHistoryDeleteAction={false}
                            allowedFileFormats={".xls,.xlsx"}
                            loadingStatus={(response) => { onFileChange(response) }}
                            onSuccessResponse={(files) => { onDocumentsUpload(files) }}
                            onErrorResponse={(message) => { setToastContent({ toastMessage: message, isShow: true }) }}
                            removedFileResponse={() => { onFileRemoved() }}
                            includeLightBox={false}
                            imageTitle={"Doctor Registration Details"}
                        />
                    </div>
                    {isErrorExcelFile && "regDoc" == uploadFor && (<span>
                        <Button variant='me-2 btn btn-link btn-sm mt-3 link-danger' size="sm" className='me-2' onClick={downloadRegistrationExcelWithError} >
                            <img src={DownloadIcon} className="me-2" alt={"Download Icon"} />
                            Doctor Registration Error
                        </Button>
                    </span>)}
                    {isCheckDetailsExcelFile && "checkDetails" == uploadFor && (<span>
                        <Button variant='me-2 btn btn-link btn-sm mt-3' size="sm" className='me-2' onClick={downloadCheckDoctorDetailsExcel} >
                            <img src={DownloadIcon} className="me-2" alt={"Download Icon"} />
                            Check details response
                        </Button>
                    </span>)}
                </div>
            </React.Fragment>
        );
    }

    const getFooterContent = () => {
        return (
            <React.Fragment>
                <div className='d-flex justify-content-start'>
                    <Button variant='link link-dark' className='btn-lg font-12' onClick={() => { setInfoModelOpen(!isInfoModelOpen) }}>
                        Note
                        <svg id="leftchevron_black_icon_18px" className={`${isInfoModelOpen ? "collapse-arrow rotate-bottom" : "collapse-arrow rotate-up-half"}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                            <rect id="Rectangle_4722" data-name="Rectangle 4722" width="18" height="18" fill="none" />
                            <path id="Path_23401" data-name="Path 23401" d="M4.43.275.274,4.431A.942.942,0,0,0,1.606,5.763L5.1,2.283,8.587,5.774A.945.945,0,0,0,10.2,5.108a.936.936,0,0,0-.279-.666L5.762.275A.945.945,0,0,0,4.43.275Z" transform="translate(4.08 5.761)" fill="#6c757d" />
                        </svg>
                    </Button>
                </div>
                <div className='d-flex justify-content-between'>
                    <Button variant="brand" disabled={isUploadLoader} className='px-4' onClick={() => { setDocumentsTrigger(true); }} >
                        {isUploadLoader ? <CustomSpinners spinnerText={"Upload"} className={"spinner-position"} /> : "Upload"}
                    </Button>
                </div>
            </React.Fragment>
        );
    }


    const resetUploadForm = () => {
        setInfoModelOpen(false);
        setUploadLoader(false);
    }

    return (
        <React.Fragment>
            <Wrapper showHeader={false}>
                {isAccessDenied ? <AccessDenied /> :
                    <React.Fragment>
                        <HeaderComponent ref={headerRef} className="custom-tabs-forms p-12 d-flex justify-content-between align-items-end">
                            <p className="mb-0">Registered Doctors</p>
                            <Dropdown>
                                <Dropdown.Toggle variant=" " id="dropdown-basic" disabled={false} className="border-0 btn-sm dropdown-carret-margin link-dark">
                                    <img aria-hidden="true" src={DownloadIcon} className="me-2 align-text-bottom" alt={"Download Icon"} />
                                    Download
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='custom-dropdown custom-dropdown-menu'>
                                    <h6 class="dropdown-header font-12 text-secondary mb-0">Templates</h6>
                                    <Dropdown.Item className="custom-dropdown-item" onClick={downloadCheckDetailsTemplate}>Check Details Template</Dropdown.Item>
                                    <Dropdown.Item className="custom-dropdown-item" onClick={downloadDoctorRegistrationTemplate}>Doctor Registration Template</Dropdown.Item>
                                    <hr />
                                    <h6 class="dropdown-header font-12 text-secondary mb-0-header">List of Doctors</h6>
                                    <Dropdown.Item className="custom-dropdown-item" onClick={downloadActiveDoctors}>Active Doctors</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </HeaderComponent>
                        <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height">
                            <TabContent>
                                <TabPane>
                                    {validate.isNotEmpty(roles) && roles.includes(Roles.ROLE_CRM_REGISTERED_DOCTOR_BULK) && getDoctorRegistrationUpload()}
                                </TabPane>
                            </TabContent>
                        </BodyComponent>
                        {validate.isNotEmpty(roles) && roles.includes(Roles.ROLE_CRM_REGISTERED_DOCTOR_BULK) && isInfoModelOpen && <div class="customdropdown-position position-absolute text-secondary">
                            <h6 class="text-dark font-14">Note Information</h6>
                            <ol>
                                <h6 class="text-dark font-12">Check Details</h6>
                                <li> Upload file will have only 1 column: Mobile Number</li>
                                <li> Only 10-digit numerical value will be accepted as Mobile Number.</li>
                            </ol>
                            <ol>
                                <h6 class="text-dark font-12">Register Doctor</h6>
                                <li> The excel sheet should contain the columns with headers Mobile Number, Name, Gender, Date of Birth, Is Registered Doctor, Doctor Specialization, Doctor Qualification, Clinic Name, Clinic Address, Clinic City, Clinic State, Clinic Pin Code.</li>
                                <li> Mobile number should be a 10-digit numeric value.</li>
                                <li> Gender should be entered as M for Male, F for Female and O for Others.</li>
                                <li> Date Of Birth is expected in format dd/mm/yyyy.</li>
                                <li> Is Registered Doctor can have the values Y or N.</li>
                                <li> If customer is registered as doctor, and clinic name is entered, then clinic address, state, city and pin code is mandatory. </li>
                            </ol>
                        </div>}
                        <FooterComponent ref={footerRef} className="footer px-3 py-2  d-flex justify-content-between">
                            {validate.isNotEmpty(roles) && roles.includes(Roles.ROLE_CRM_REGISTERED_DOCTOR_BULK) && getFooterContent()}
                        </FooterComponent>
                    </React.Fragment>
                }
            </Wrapper>
        </React.Fragment>
    )
}

export default withFormHoc(DoctorRegistration);