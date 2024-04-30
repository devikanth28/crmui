import DocumentUpload from "@medplus/react-common-components/DocumentUpload";
import { ALERT_TYPE, CustomAlert, CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import React, {useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Validate from '../../helpers/Validate';
import MembershipService from "../../services/Membership/MembershipService";
import { downloadFileInBrowser } from "../../helpers/CommonHelper";
import { HeaderComponent, BodyComponent, FooterComponent, Wrapper } from "../Common/CommonStructure";
import { useRef } from "react";
import MembershipExcelDownload from "./MembershipExcelDownload";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Roles } from "../../constants/RoleConstants";
import AccessDenied from "../ErrorComponents/AccessDenied";
import UserService from "../../services/Common/UserService";

const MembershipHome = () => {
    const membershipService = MembershipService();
    const validate = Validate();
    const SERVER_EXPERIENCING_SOME_PROBLEM = "Server experiencing some problem";

    const [alertContent, setAlertContent] = useState({ message: undefined, show: true, alertType: undefined });
    const [subscriptionResponses, setSubscripionResponses] = useState([]);
    const [isUploadLoader, setUploadLoader] = useState(false);
    const [isDownloadLoader, setDownloadLoader] = useState(false);
    const [documentsTrigger, setDocumentsTrigger] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [isInfoModelOpen, setInfoModelOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [isAccessDenied, setIsAccessDenied] = useState(false);

    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const [activeTab, setActiveTab] = useState('');

    let timeoutId;

    useEffect(() => {
        if (isUploadLoader || isDownloadLoader) {
            setDocumentsTrigger(true);
        }
    }, [isUploadLoader || isDownloadLoader])

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
                    setActiveTab(data.dataObject.userDetails.roles.includes(Roles.ROLE_SUBSCRIPTION_BULK_UPLOAD) && (data.dataObject.userDetails.roles.includes(Roles.ROLE_CRM_UPLOAD_SUBSCRIPTIONS) ? 'upload' : data.dataObject.userDetails.roles.includes(Roles.ROLE_CRM_DOWNLOAD_SUBSCRIPTIONS) ? 'download' : ''));
                    setIsAccessDenied(!data.dataObject.userDetails.roles.includes(Roles.ROLE_SUBSCRIPTION_BULK_UPLOAD) || (!data.dataObject.userDetails.roles.includes(Roles.ROLE_CRM_DOWNLOAD_SUBSCRIPTIONS) && !data.dataObject.userDetails.roles.includes(Roles.ROLE_CRM_UPLOAD_SUBSCRIPTIONS)));
                } else {
                    setRoles([]);
                }
            } else {
                setRoles([]);
            }
        })
    },[]);

    const onDocumentsUpload = (files) => {
        uploadMembershipInfo(files);
        setDocumentsTrigger(false);
    }

    const downloadMembershipTemplate = (event) => {
        window.open('../Templates/sample-corporate-upload-file.xlsx');
        event.preventDefault();
    }

    const uploadMembershipInfo = (files) => {
        if(isUploadLoader && !isDownloadLoader){
            if (validate.isEmpty(files)) {
                setAlertContent({ message: "Please select a file", show: true, alertType: ALERT_TYPE.ERROR });
                setSubscripionResponses([]);
                setUploadLoader(false);
            } else {
                membershipService.uploadMembershipInfo(files[0]).then(response => {
                    if (response.statusCode === "SUCCESS" && response.message && response.dataObject) {
                        setAlertContent({ message: response.message + "Please download responses for the details.", show: true, alertType: ALERT_TYPE.SUCCESS });
                        setSubscripionResponses(validate.isNotEmpty(response.dataObject) ? response.dataObject : []);
                    }
                    if (response.statusCode === "FAILURE") {
                        setAlertContent({ message: response.message, show: true, alertType: ALERT_TYPE.ERROR });
                    }
                    setUploadLoader(false);
                }).catch(error => {
                    console.log(error);
                    setAlertContent({ message: SERVER_EXPERIENCING_SOME_PROBLEM, show: true, alertType: ALERT_TYPE.ERROR });
                    setIsReset(true);
                    setUploadLoader(false);
                })
            }
    }
    };

    const downloadSubscriptionResponses = () => {
        membershipService.downloadSubscriptionResponses(subscriptionResponses).then(response => {
            downloadFileInBrowser(response, "corporate-membership-responses.xls");
            setDownloadLoader(false);
        }).catch(error => {
            console.log(error);
            setAlertContent({ message: SERVER_EXPERIENCING_SOME_PROBLEM, show: true, alertType: ALERT_TYPE.ERROR });
            setDownloadLoader(false);
        })
    }

    const getMembershipExcelUpload = (activeTab) => {

        if (activeTab === "upload") {
            return (
                <React.Fragment>
                    <div className="d-flex justify-content-between p-12">
                        <div>
                            <label className="custom-fieldset mb-1 w-100 mb-2">Subscription Excel Upload</label>
                            <DocumentUpload
                                fileSelectOption={true}
                                documentScanOption={false}
                                buttonClassName={'scan-button'}
                                imageContainerClassName={'image-container'}
                                isAppendAllowed={false}
                                resetAddedDocuments={true}
                                uploadActionInParent={false}
                                getAddedDocuments={documentsTrigger}
                                allowedFileFormats={".xls,.xlsx"}
                                onSuccessResponse={(files) => { onDocumentsUpload(files) }}
                                onErrorResponse={(message) => { setAlertContent({ message: message, show: true, alertType: ALERT_TYPE.ERROR }) }}
                                onDeleteResponse={() => { }}
                                includeLightBox={false}
                                imageTitle={"Membership Details"}
                            />
                        </div>
                        <div className="d-flex align-items-start">
                            <Button variant='link link-primary' size="sm" className='me-3' onClick={downloadMembershipTemplate} >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                    <g id="download_black_icon_16px" transform="translate(-180.258 -387.452)">
                                        <rect id="Rectangle_3299" data-name="Rectangle 3299" width="16" height="16" rx="3" transform="translate(180.258 387.452)" fill="none" />
                                        <g id="Group_14573" data-name="Group 14573" transform="translate(182.258 388.452)">
                                            <path id="Union_132" data-name="Union 132" d="M.439,14a.439.439,0,0,1,0-.877H12A.439.439,0,0,1,12,14Zm5.753-2.6-.139-.028a.421.421,0,0,1-.141-.094L3.069,8.435a.438.438,0,0,1,.62-.62L5.783,9.91V.438a.438.438,0,0,1,.877,0V9.91L8.754,7.816a.438.438,0,0,1,.62.619L6.531,11.278a.423.423,0,0,1-.141.094l-.138.028-.031.006Z" transform="translate(0 0)" fill="#343a40" />
                                        </g>
                                    </g>
                                </svg>
                                Membership Template
                            </Button>
                        </div>
                    </div>
                </React.Fragment>
            );
        }

    }

    const getFooterContent = (activeTab) => {
        if (activeTab === "upload") {
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
                        <Button variant="brand" disabled={isUploadLoader} className='px-4' onClick={() => { setUploadLoader(true) }} >
                            {isUploadLoader ? <CustomSpinners spinnerText={"Upload"} className={"spinner-position"} /> : "Upload"}
                        </Button>
                        {validate.isNotEmpty(subscriptionResponses) &&
                            <Button variant="brand" disabled={isDownloadLoader} className='px-4 ms-3' onClick={() => { setDownloadLoader(true); downloadSubscriptionResponses(); }} >
                                {isDownloadLoader ? <CustomSpinners spinnerText={"DownloadResponses"} className={"spinner-position"} /> : "Download Responses"}
                            </Button>
                        }
                    </div>
                </React.Fragment>
            );
        }

        else if (activeTab === "download") {
            return (
                <React.Fragment></React.Fragment>
            );
        }
    }

    const resetUploadForm = ()  => {
        setInfoModelOpen(false);
        setSubscripionResponses([]);
        setAlertContent({ message: undefined, show: true, alertType: undefined });
        setUploadLoader(false);
        setDownloadLoader(false);
    }

    return (
        <React.Fragment>
            {
                alertContent && alertContent.message && alertContent.show && (
                    <div className="header">
                        <CustomAlert alertType={alertContent.alertType} isDismissibleRequired={true} isAutohide={true} delayTime={3000} isShow={alertContent.show} isTransition={true} onClose={() => setAlertContent({ ...alertContent, show: false })} alertMessage={() => { return (alertContent.message) }} />
                    </div>
                )
            }
            <Wrapper showHeader={false}>
                {isAccessDenied ? <AccessDenied /> :
                    <React.Fragment>
                        <HeaderComponent ref={headerRef} className="custom-tabs-forms p-0">
                            <Nav tabs>
                                <NavItem>
                                    {validate.isNotEmpty(roles) && roles.includes(Roles.ROLE_CRM_UPLOAD_SUBSCRIPTIONS) && <NavLink active={activeTab == 'upload'} onClick={() => {setActiveTab('upload');resetUploadForm()}}>
                                        Upload Subscriptions
                                    </NavLink>}
                                </NavItem>
                                <NavItem>
                                    {validate.isNotEmpty(roles) && roles.includes(Roles.ROLE_CRM_DOWNLOAD_SUBSCRIPTIONS) && <NavLink active={activeTab == 'download'} onClick={() => setActiveTab('download')}>
                                        Download Subscriptions
                                    </NavLink>}
                                </NavItem>
                            </Nav>
                        </HeaderComponent>
                        <BodyComponent allRefs={{ headerRef, footerRef }}>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="upload">
                                    {validate.isNotEmpty(roles) && roles.includes(Roles.ROLE_CRM_UPLOAD_SUBSCRIPTIONS) && 'upload' == activeTab && getMembershipExcelUpload("upload")}
                                </TabPane>
                                <TabPane tabId="download">
                                    {validate.isNotEmpty(roles) && roles.includes(Roles.ROLE_CRM_DOWNLOAD_SUBSCRIPTIONS) && 'download' == activeTab &&  <MembershipExcelDownload headerRef={headerRef}/>}
                                </TabPane>
                            </TabContent>

                        </BodyComponent>
                        {validate.isNotEmpty(roles) && roles.includes(Roles.ROLE_CRM_UPLOAD_SUBSCRIPTIONS) && isInfoModelOpen && "upload" == activeTab && <div class="customdropdown-position position-absolute text-secondary">
                            <h6 class="text-dark font-14">Note Information</h6>
                            <ol>
                                <li> The excel sheet should contain the columns with headers Plan Id, Corporate Id, State Code, Health Care Subscription Code, Corporate Email Id, Contact Number, Personal Email Id, Member Full Name, Date Of Birth, Gender, Photo Id Type, Photo Id Number, Relationship, Pharmacy Subscription Code in any order.</li>
                                <li> The new subscription requests and add on subscription requests are differentiated by the subscription code. For add on subscription, Health Care Subscription Code is mandatory.</li>
                                <li> New subscription request members are identified by corporate email id and and Add On Subscription request members are identified by Health Care Subscription Code.</li>
                                <li> Only Organization Plans are allowed.</li>
                                <li> The columns headers are case sensitive and have to be exact.</li>
                                <li> Provide Date Of Birth in the format dd/MM/yyyy.</li>
                                <li> Relationship should have values Self, Spouse, Parents, Children or Siblings.</li>
                                <li> Gender can have values M, F or O.</li>
                                <li> Photo Id Type should have values Aadhar Card, Passport or Pan Card.</li>
                            </ol>
                        </div>}
                        <FooterComponent ref={footerRef} className={activeTab === "upload" ? "footer px-3 py-2  d-flex justify-content-between" : ""}>
                            {validate.isNotEmpty(roles) && roles.includes(Roles.ROLE_CRM_UPLOAD_SUBSCRIPTIONS) && getFooterContent(activeTab)}
                        </FooterComponent>
                    </React.Fragment>
                }
            </Wrapper>
        </React.Fragment>
    )
}

export default MembershipHome;