import DocumentUpload from "@medplus/react-common-components/DocumentUpload";
import { ALERT_TYPE, StackedImages } from "@medplus/react-common-components/DynamicForm";
import dateFormat from "dateformat";
import { useContext, useEffect, useState } from "react";
import { TabContent, TabPane } from "reactstrap";
import Validate from "../../../../helpers/Validate";
import CheckoutService from "../../../../services/Checkout/CheckoutService";
import NavTabs from "../../../Common/NavTabs";
import { AlertContext, CustomerContext } from "../../../Contexts/UserContext";
import { PrescriptionConstants } from "../../../customer/Constants/CustomerConstants";
import HealthRecordGrid from "../Prescription/HealthRecordGrid";

const PrescriptionDetails = (props) => {
    const [tabId, setTabId] = useState("");

    const prescriptionTabs = [
        {tabId: "send-to-doctor",  tabName :"Send to Doctor"},
        {tabId: "add-new-prescription",  tabName :"Add New Prescription"}
    ];

    const tabsWithOldPrescription = [
        {tabId: "send-to-doctor",  tabName :"Send to Doctor"},
        {tabId: "add-new-prescription",  tabName :"Add New Prescription"},
        {tabId: "add-old-prescription",  tabName :"Add Old Prescription"}
    ];

    const tabsWithSendToDoctor = [
        {tabId: "send-to-doctor",  tabName :"Send to Doctor"},
        {tabId: "prescription-images",  tabName :"Prescription"}
    ]

    const tabsWithPrescImages = [
        {tabId: "prescription-images",  tabName :"Prescription"}
    ]

    const [tabs, setTabs] = useState([]);
    const [healthRecords, setHealthRecords] = useState([]);
    const [documentsTrigger, setDocumentsTrigger] = useState(false);
    const [fileSelectLoader, setFileSelectLoader] = useState(false);
    const [isEPrescSelected, setIsEPrescSelected] = useState(false);
    const [isFilesEmpty, setIsFilesEmpty] = useState(true);
    const [healthRecordId, setHealthRecordId] = useState(undefined);
    const [isEPrescriptionRequired, setIsEPrescriptionRequired] = useState(undefined);
    const [isPrescRemoved, setIsPrescRemoved] = useState(undefined);

    const checkoutService = CheckoutService();
    const validate = Validate();
    const { setAlertContent } = useContext(AlertContext);
    const { customerId } = useContext(CustomerContext);

    const handleTabId = (tabId) => {
        setTabId(tabId);
    }

    useEffect(() => {
        if(validate.isNotEmpty(healthRecordId)) {
        	setTabId("add-old-prescription");
            setTabs(tabsWithOldPrescription);
        }else if (props?.isRequiredPrescription) {
            setTabId("send-to-doctor");
            if (props?.prescImgList) {
                setTabs(tabsWithSendToDoctor)
            } else {
                if (validate.isNotEmpty(healthRecords)) {
                    setTabs(tabsWithOldPrescription);
                }
                else {
                    setTabs(prescriptionTabs);
                }
            } 
        } else if(!props?.isRequiredPrescription && props?.prescImgList){
            setTabId("prescription-images");
            setTabs(tabsWithPrescImages);
        }
    }, [healthRecords, props?.prescImgList, props?.isRequiredPrescription]);


    useEffect(() => {
        selectPreviousPrescription();
        getCheckoutInfoFromRedis();
    },[]);

    useEffect(() => {
        if (!fileSelectLoader) {
            setDocumentsTrigger(true);
        } else {
            setDocumentsTrigger(false);
        }
    }, [fileSelectLoader])

    const selectPreviousPrescription = () => {
        const config = { headers: { customerId: customerId } };
        checkoutService.getPreviousPrescriptions(config).then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.dataObject)) {
                const healthRecordsList = prepareHealthRecordData(response.dataObject.healthRecords);
                setHealthRecords(healthRecordsList);
            }
        }).catch((error) => {
            console.log("error is " + error);
        });
    }

    const getCheckoutInfoFromRedis = () => {
        checkoutService.getCheckoutInfoFromRedis({ headers: { customerId: customerId } }).then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.dataObject)) {
                if(validate.isNotEmpty(response.dataObject.healthRecordId)) {
                    setIsEPrescSelected(false);
                    props.setIsPrescriptionSectionSelected(true);
                    setHealthRecordId(response.dataObject.healthRecordId);
                }
                if(response.dataObject.isEPrescriptionRequired) {
                    setIsEPrescSelected(true);
                    props.setIsPrescriptionSectionSelected(true);
                    setIsEPrescriptionRequired(response.dataObject.isEPrescriptionRequired);
                }
                
            }
        }).catch((error) => {
            console.log("error is " + error);
        });
    }

    function prepareHealthRecordData(healthRecords) {
        if (validate.isEmpty(healthRecords)) {
            return {};
        }
        return healthRecords.map(eachHealthRecord => {
            const healthRecordObj = {
                recordId: eachHealthRecord.recordId,
                recordName: validate.isEmpty(eachHealthRecord.recordName) ? "-" : eachHealthRecord.recordName,
                doctorName: validate.isEmpty(eachHealthRecord.doctorName) ? "-" : eachHealthRecord.doctorName,
                dateCreated: dateFormat(eachHealthRecord.dateCreated, "mmm dd, yyyy HH:MM"),
            };
            healthRecordObj['RecordPrescription'] = eachHealthRecord.recordImageDetailList;
            return healthRecordObj;
        });
    }


    const uploadImage = (imageSeverResponse) => {

        const params = { imageList: JSON.stringify(imageSeverResponse) }

        const data = Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        const config = { headers: { customerId: customerId }, data };
        checkoutService.uploadPrescription(config).then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.dataObject)) {
                setIsEPrescSelected(false);
                setAlertContent({ alertMessage: "Prescription Uploaded Successfully", show: true, alertType: ALERT_TYPE.SUCCESS });
                savePrescriptionDetails({ healthRecordId: response.dataObject.healthRecordId, ePrescriptionRequired: false });
            } else {
                setAlertContent({ alertMessage: "Unable to upload Prescription", show: true, alertType: ALERT_TYPE.ERROR });
            }

        }).catch((error) => {
            console.log("error is " + error);
            setAlertContent({ alertMessage: "Unable to upload Prescription, Please try again after some time", show: true, alertType: ALERT_TYPE.ERROR });
        });
    }

    const uploadPrescription = async (files) => {
        await checkoutService.uploadFilesToImageServer(files, {}).then(response => {
            if (response.statusCode === "SUCCESS" && validate.isNotEmpty(response.response)) {
                uploadImage(response.response);
            }
            if (response.statusCode === "FAILURE") {
                setAlertContent({ alertMessage: "Unable to upload Prescription", show: true, alertType: ALERT_TYPE.ERROR });
            }
        }).catch(error => {
            console.log(error);
            setAlertContent({ alertMessage: "Server Experiencing some problem, Please try again after some time", show: true, alertType: ALERT_TYPE.ERROR });
        })
    }


    const onDocumentsUpload = async (files) => {

        if (validate.isEmpty(files)) {
            setDocumentsTrigger(false);
            return;
        }
        if (files.length > 4) {
            setAlertContent({ alertMessage: "Upload upto 4 prescriptions", show: true, alertType: ALERT_TYPE.ERROR });
            return;
        }

        for (const eachFile of files) {
            if (eachFile.type != "image/png" && eachFile.type != "image/jpg" && eachFile.type != "image/jpeg" && eachFile.type != "application/pdf" && eachFile.type != "image/gif") {
                setAlertContent({ alertMessage: "Please upload valid files", show: true, alertType: ALERT_TYPE.ERROR });
                return;
            }
        }

        await uploadPrescription(files);
    }

    const sendToDoctor = () => {
        setIsEPrescSelected(!isEPrescSelected);
        if(isEPrescSelected) {
            props.setIsPrescriptionSectionSelected(false);
            return;
        }
        savePrescriptionDetails({ healthRecordId: null, ePrescriptionRequired: true });
    }

    const savePrescriptionDetails = (prescriptionDetails) => {

        checkoutService.savePrescriptionDetails({ headers: { customerId: customerId }, params: prescriptionDetails }).then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.dataObject)) {
                setHealthRecordId(response.dataObject.healthRecordId);
                setIsEPrescriptionRequired(response.dataObject.isEPrescriptionRequired);
                props.setIsPrescriptionSectionSelected(true);
            } else {
                setAlertContent({ alertMessage: "Unable to save prescription details", show: true, alertType: ALERT_TYPE.ERROR });
            }
        }).catch((error) => {
            console.log("error is " + error);
            setAlertContent({ alertMessage: "Unable to save prescription details, Please try again after some time", show: true, alertType: ALERT_TYPE.ERROR });
        });
    }

    const removePrescAndRecordIdFromCart = () => {
        checkoutService.removePrescAndRecordIdFromCart({ headers: { customerId: customerId }, params : {removePrescription : true}}).then((response) => {
            if (validate.isNotEmpty(response) && "SUCCESS" == response.statusCode) {
                setIsPrescRemoved(true);
                props?.setPrescImgList(undefined);
            } 
        }).catch((error) => {
            console.log("error is " + error);
        });
    }

    return (

        <div className="custom-tabs-forms p-0 rounded border">
            <div className="h-100">
                <NavTabs tabs={tabs} onTabChange={handleTabId} />
                <TabContent activeTab={tabId} className="tab-content-height overflow-y-auto scroll-on-hover">
                    <TabPane tabId="send-to-doctor">
                        <div className="row g-0 p-12">
                            <div className="card col-12 col-lg-6">
                                <div className="card-body">
                                    <div className="d-flex mb-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" onClick={sendToDoctor} value={isEPrescSelected} checked={isEPrescSelected} id="SendToDoctor" />
                                        </div>
                                        <div>
                                            <label className="mb-1" for="SendToDoctor">Ask for Doctor Prescription</label>
                                            <p className="mb-0 font-12 text-secondary">A doctor will contact you during 8 AM - 11 PM to provide consulation</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        
                    </TabPane>
                    <TabPane tabId="add-new-prescription">
                        <div className="p-12">
                            <DocumentUpload fileSelectOption={true} documentScanOption={false} buttonClassName={'scan-button'}
                                imageContainerClassName={'image-container'}
                                isAppendAllowed={true}
                                resetAddedDocuments={true}
                                uploadActionInParent={false}
                                getAddedDocuments={documentsTrigger}
                                allowedFileFormats={",jpg,.png,.jpeg,.pdf,.gif"}
                                onSuccessResponse={(files) => { onDocumentsUpload(files) }}
                                onErrorResponse={(message) => { setAlertContent({ alertMessage: message, show: true, alertType: ALERT_TYPE.ERROR }); }}
                                onDeleteResponse={() => { }}
                                includeLightBox={false}
                                imageTitle={"New Prescription"}
                                loadingStatus={(isLoading) => setFileSelectLoader(isLoading)}
                                showThumbnail={isFilesEmpty}
                            />
                        </div>

                    </TabPane>

                    <TabPane tabId="add-old-prescription">
                        {validate.isNotEmpty(healthRecords) &&
                            <HealthRecordGrid setIsEPrescSelected={setIsEPrescSelected} healthRecordId={healthRecordId} healthRecordsData={healthRecords} savePrescriptionDetails={savePrescriptionDetails} />
                        }
                    </TabPane>
                    <TabPane tabId="prescription-images">
                    {validate.isNotEmpty(props?.prescImgList) && <>
                    {validate.isNotEmpty(props?.decoderComment) && <>
                                Decoder Comment is {props?.decoderComment}
                            </>
                            }
                            
                            <>
                                <div className="col-12 col-lg-2 ms-2 ms-lg-4 mt-3 mt-lg-0">
                                    <p className="mb-12">Prescription Details</p>
                                    <StackedImages stackClassName="justify-content-start pb-5 avatars w-100 h-100" includeLightBox images={props?.prescImgList} maxImages="4" />
                                </div>
                                {props?.prescStatus && !(PrescriptionConstants.PRESCRIPTION_ORDER_STATUS_DECODED == props?.prescStatus && props?.decodedCart) && !isPrescRemoved && <button onClick={removePrescAndRecordIdFromCart}>Change Prescription</button>  }
                                </>
                                </>
                            }
                    </TabPane>

                </TabContent>
            </div>
            
        </div>
    )
}

export default PrescriptionDetails;
