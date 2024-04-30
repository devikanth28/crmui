import { Badges } from "@medplus/react-common-components/DataGrid";
import DynamicForm, { ImageLightBox, TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm";
import dateFormat from 'dateformat';
import qs from 'qs';
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button, ModalTitle } from "react-bootstrap";
// import { Modal } from "react-bootstrap";
import { Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import AnimationHelpers from "../../helpers/AnimationHelpers";
import { redirectToCatalogIntermediateComponent, redirectToPrescriptionCatalogPage, redirectToShoppingCart } from "../../helpers/CommonRedirectionPages";
import CustomerIdLink from '../../helpers/CustomerIdLink';
import Validate from "../../helpers/Validate";
import PrevIcon from '../../images/leftArrow_icon.svg';
import NextIcon from '../../images/rightArrow_icon.svg';
import HealthRecordService from "../../services/HeathRecord/HealthRecordService";
import PrescriptionService from "../../services/Prescription/PrescriptionService";
import { API_URL, CRM_UI } from "../../services/ServiceConstants";
import ShoppingCartService from "../../services/ShoppingCart/ShoppingCartService";
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import HealthRecordImage from "../Common/HealthRecordImage";
import { AlertContext, SidebarContext } from "../Contexts/UserContext";
import CreateCustomerForm from "../customer/CreateCustomerForm";
import PrescriptionAssociatedOrders from "../healthRecord/PrescriptionAssociatedOrders";
import PrepareOrderDetails from "../order/PrepareOrderDetails";
import DecodedInformation from "./DecodedInformation";

const HealthRecord = ({ helpers, ...props }) => {
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const headerRightChildRef = useRef(null);
    const footerRightChildRef = useRef(undefined);
    const imageContainerRef = useRef(null);

    const [activeTab, setActiveTab] = useState(2);
    const [rotate, setRotate] = useState(0);
    const [isVertical, setIsVertical] = useState(false);
    const [scaleFactor, setScaleFactor] = useState(1);
    const [activeThumbnail, setActiveThumbnail] = useState(0);
    const [imageDimensions, setImageDimensions] = useState({ width: "0px", height: "0px" });

    const [healthRecordInfo, setHealthRecordInfo] = useState({});
    const validate = Validate();
    const healthRecordService = HealthRecordService();
    const { setStackedToastContent, setAlertContent } = useContext(AlertContext);
    // const recordIdWithType = props.match ? props.match.params.id : props.recordId;
    const recordIdWithType = props?.match?.params?.id? props.match.params.id : props.id;
    const [type, prescriptionId] = recordIdWithType.split("_");
    const healthRecordLocality = qs.parse(props?.location?.search, { ignoreQueryPrefix: true });
    const [imagesList, setImagesList] = useState([]);
    const [checkedProducts, setCheckedProducts] = useState([]);
    const [thumbNailImagesList, setThumbNailImagesList] = useState([]);
    const [selectedImagePath, setSelectedImagePath] = useState("");
    const prescriptionService = PrescriptionService();
    const [martOrderInfo, setMartOrderInfo] = useState({});
    const [openOrderDetailModal, setOpenOrderDetailModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLightBoxOpen, setLightBoxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalClaimedRecordsAnimation, setTotalClaimedRecordsAnimation] = useState(false);
    const [productsCount, setProdutsCount] = useState(0);
    const [noDataFoundMessage, setNoDataFoundMessage] = useState("");
    const [currentPrescriptionId, setCurrentPrescriptionOrderId] = useState(prescriptionId);
    const [claimedDataSet, setClaimedDataSet] = useState([]);
    const [currentPrescriptionInfo, setCurrentPrescriptionInfo] = useState({});
    const [showCreateCustomerForm, setShowCreateCustomerForm] = useState(false);
    const [clearCustomerForm, setClearCustomerForm] = useState(false);
    const { setSidebarCollapsedFlag } = useContext(SidebarContext);
    const [omsClaimedDataSet, setOmsClaimedDataSet] = useState([]); 


    const ComputeTransition = () => {
        return {
            transform: `translate3d(${0}rem,${0}rem,0rem) scale3d(${scaleFactor},${scaleFactor},1) rotate(${rotate}deg)`,
        };
    }

    useEffect(() => {
        setTotalClaimedRecordsAnimation(true);
        if (validateTypeAndRecordId(type, prescriptionId)) {
            getData(recordIdWithType);
        }
    }, [recordIdWithType, currentPrescriptionId])

    useEffect(() => {
        let index = claimedDataSet?.findIndex(obj => obj.prescriptionOrderId === currentPrescriptionId);
        setCurrentPrescriptionInfo(claimedDataSet ? claimedDataSet[index] : {});
    }, [claimedDataSet])

    const ButtonSpinners = (value, Elementid, spinnerSize = "sm", SpinnerColour = "secondary", SpinnerClassName = "custom-button-spinner") => {
        helpers.updateSingleKeyValueIntoField("isLoading", value, Elementid);
        helpers.updateSingleKeyValueIntoField("loaderClassName", SpinnerClassName, Elementid);
        helpers.updateSingleKeyValueIntoField("loaderSize", spinnerSize, Elementid);
        helpers.updateSingleKeyValueIntoField("loaderVariant", SpinnerColour, Elementid);
    }

    const validateTypeAndRecordId = (type, prescriptionId) => {
        if (!(type === "p" || type === "h")) {
            setStackedToastContent({ toastMessage: "Invalid type.", delayTime :1500 });
            return false;
        }
        if (isNaN(prescriptionId)) {
            setStackedToastContent({ toastMessage: "Invalid prescriptionId." , delayTime :1500 });
            return false;
        }
        return true;
    }
    const getData = async (prescriptionId) => {
        setIsLoading(true);
        setCheckedProducts([]);
        let healthRecordData = await getHealthRecordData(prescriptionId);
        if (validate.isNotEmpty(healthRecordData)) {
            setHealthRecordInfo(healthRecordData);
            setImagePathsAndThumbNailPaths(healthRecordData.imageList);
        }
        if (type == "p") {
            let claimedRecordsData = await getClaimedRecordsData();
            if (validate.isNotEmpty(claimedRecordsData)) {
                setClaimedDataSet(claimedRecordsData);
            }
        }
        setIsLoading(false);
    }

    const getClaimedRecordsData = async () => {
        return await prescriptionService.getPrescriptionClaimedOrders().then(data => {
            if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                let fetchedDataSet = data.dataObject.dataSet ? data.dataObject.dataSet : [];
                return fetchedDataSet;
            } else if (data && data.statusCode == "FAILURE" && data.message == "FAILURE") {
                setAlertContent({ alertMessage: "Error while fetching data" });
                return [];
            } else {
                return [];
            }
        }).catch((err) => {
            setAlertContent({ alertMessage: "Error while fetching data" });
            console.log(err);
            return {};
        });


    }

    const setImagePathsAndThumbNailPaths = (imagesList) => {
        if (validate.isNotEmpty(imagesList)) {
            const imagePathsList = imagesList.map(image => image.imagePath);
            setImagesList(imagePathsList);
            const thumbNailPathsLsit = imagesList.map(image => image.thumbnailPath);
            setThumbNailImagesList(thumbNailPathsLsit);
            setSelectedImagePath(imagePathsList[0]);
        }

    }

    const getHealthRecordData = async (prescriptionId) => {

        return await healthRecordService.getHealthRecordDetails(prescriptionId).then((data) => {
            if (data && data.statusCode === "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                return data.dataObject;
            } else {
                validate.isNotEmpty(data.message) ? setStackedToastContent({ toastMessage: data.message }) : setStackedToastContent({ toastMessage: "Something went wrong" });
                type === 'p' ? setNoDataFoundMessage(`No Data Found For the Prescription -${currentPrescriptionId}`) : setNoDataFoundMessage(`No Data Found For the Health Record -${prescriptionId}`);
                return {};
            }
        }).catch(() => {
            console.log("Error Occured");
            return {};
        });
    }

    const validateAndDisplayData = (data) => {
        if (validate.isNotEmpty(data)) {
            return data;
        }
        return "--";
    }
    const displayStatusInformation = () => {
        return <React.Fragment>
            <label className="custom-fieldset">Status Information</label>
            <div className="row">
                {validate.isNotEmpty(healthRecordInfo.createdBy) && <div className="col-6">
                    <p className="mb-0 mt-2 text-secondary font-12">Created By</p>
                    <p className="mb-0">{healthRecordInfo.createdBy}</p>
                </div>}
                {validate.isNotEmpty(healthRecordInfo.dateCreated) && <div className="col-6">
                    <p className="mb-0 mt-2 text-secondary font-12">Created Date</p>
                    <p className="mb-0">{dateFormat(healthRecordInfo.dateCreated, "mmm d, yyyy HH:MM")}</p>

                </div>}
                {validate.isNotEmpty(healthRecordInfo.decodedBy) && <div className="col-6">
                    <p className="mb-0 mt-2 text-secondary font-12">Decoded By</p>
                    <p className="mb-0">{healthRecordInfo.decodedBy}</p>
                </div>}
                {validate.isNotEmpty(healthRecordInfo.decodedDate) && <div className="col-6">
                    <p className="mb-0 mt-2 text-secondary font-12">Decoded Date</p>
                    <p className="mb-0">{dateFormat(healthRecordInfo.decodedDate, "mmm d, yyyy HH:MM")}</p>
                </div>}
                {type == "p" && (<React.Fragment> {validate.isNotEmpty(healthRecordInfo.cancelledBy) && <div className="col-6">
                    <p className="mb-0 mt-2 text-secondary font-12">Cancelled By</p>
                    <p className="mb-0">{healthRecordInfo.cancelledBy}</p>
                </div>}
                    {validate.isNotEmpty(healthRecordInfo.cancelledDate) && <div className="col-6">
                        <p className="mb-0 mt-2 text-secondary font-12">Cancelled Date</p>
                        <p className="mb-0">{dateFormat(healthRecordInfo.cancelledDate, "mmm d, yyyy HH:MM")}</p>
                    </div>}
                    {validate.isNotEmpty(healthRecordInfo.partiallyDecodedBy) && <div className="col-6">
                        <p className="mb-0 mt-2 text-secondary font-12">Partially Decoded By</p>
                        <p className="mb-0">{healthRecordInfo.partiallyDecodedBy}</p>
                    </div>}
                    {validate.isNotEmpty(healthRecordInfo.partiallyDecodedDate) && <div className="col-6">
                        <p className="mb-0 mt-2 text-secondary font-12">Partially Decoded Date</p>
                        <p className="mb-0">{dateFormat(healthRecordInfo.partiallyDecodedDate, "mmm d, yyyy HH:MM")}</p>
                    </div>}
                    {validate.isNotEmpty(healthRecordInfo.convertedToOmsOrderBy) && <div className="col-6">
                        <p className="mb-0 mt-2 text-secondary font-12">Converted to OMS</p>
                        <p className="mb-0">{healthRecordInfo.convertedToOmsOrderBy}</p>
                    </div>}
                    {validate.isNotEmpty(healthRecordInfo.convertedToOmsOrderDate) && <div className="col-6">
                        <p className="mb-0 mt-2 text-secondary font-12">Converted Date</p>
                        <p className="mb-0">{dateFormat(healthRecordInfo.convertedToOmsOrderDate, "mmm d, yyyy HH:MM")}</p>
                    </div>}
                </React.Fragment>)}
            </div>
        </React.Fragment>
    }

    const viewCustomerLink = (customerId) => {
        if (customerId != 0 && customerId > 0 && validate.isNotEmpty(customerId)) {
            return <React.Fragment>
                <CustomerIdLink anchorClassName={"text-decoration-none"} customerId={customerId} className={"d-flex align-items-center h-100"} />
            </React.Fragment>
        } else {
            return <React.Fragment>
                <span className='text-center'>-</span>
            </React.Fragment>
        }
    }

    const renderThumbNailImages = () => {
        return <React.Fragment>
            <div className="d-flex gap-2 justify-content-center">
                {thumbNailImagesList.map((imagePath, index) => (<div key={index} className="d-flex justify-content-center image-slide-container" onClick={() => { setSelectedImagePath(imagesList[index]) }}>
                    <img src={imagePath} alt={`Image ${index + 1}`} onClick={() => { setActiveThumbnail(index) }} className={`card ${activeThumbnail === index ? `active-thumbnail` : ''}`} />
                </div>
                ))}
            </div>

        </React.Fragment>
    }

    const sendAlertEmail = () => {
        prescriptionService.getSentEmailStatus({ paramObject: JSON.stringify({ patientName: healthRecordInfo.patientName ? healthRecordInfo.patientName : 'Sir/Madam', mobile: healthRecordInfo.mobileNo, presId: prescriptionId, mailId: healthRecordInfo.emailId }) }).then(response => {
            if (response.statusCode === 'SUCCESS') {
                if (response.message.toLowerCase() === 'success') {
                    setStackedToastContent({ toastMessage: 'Successfully Email sent' });
                } else {
                    setStackedToastContent({ toastMessage: 'Failed to send Email' });
                }
            } else {
                setStackedToastContent({ toastMessage: response.message });
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleMartOrderDetails = value => {
        setMartOrderInfo(value);
    }

    const handleOpenOrderDetailModal = (flag) => {
        setOpenOrderDetailModal(flag);
        setSidebarCollapsedFlag(flag);
    }   

    const validateReason = (payload) => {
        const [event] = payload;
        const reason = event.target.value;
        if (validate.isNotEmpty(reason)) {
            helpers.updateValue(reason, 'comments');
            helpers.updateSingleKeyValueIntoField("message", "", "comments");
        } else {
            helpers.updateSingleKeyValueIntoField("value", "", 'comments', false);
        }
    }

    const cancelPrescription = () => {
        const comment = helpers.getHtmlElementValue('comments');
        if (validate.isEmpty(comment)) {
            const commentsRef = helpers.customRef("comments");
            commentsRef.focus();
            helpers.updateSingleKeyValueIntoField("message", "Please enter comment to cancel Prescription", "comments");
        } else {
            helpers.updateSingleKeyValueIntoField("message", "", "comments");
            helpers.disableElement("cancelPrescription");
            prescriptionService.getCancellationStatus({ prescriptionOrderId: prescriptionId, currentStatus: healthRecordInfo.prescriptionStatus, comments: comment[0], customerId: healthRecordInfo.customerId }).then(response => {
                ButtonSpinners(true, "cancelPrescription")
                if (response.message === 'null' || response.message === null || response.message === undefined) {
                    ButtonSpinners(false, "cancelPrescription")
                    setStackedToastContent({ toastMessage: "Failed to cancel prescription" });
                } else if (response.message == 'ERROR') {
                    ButtonSpinners(false, "cancelPrescription")
                    setStackedToastContent({ toastMessage: 'status from backend : ' + response.message });
                } else {
                    ButtonSpinners(false, "cancelPrescription")
                    setCheckedProducts([]);
                    setStackedToastContent({ toastMessage: "Cancelled Succesfully" });
                    getData(`p_${currentPrescriptionId}`);
                }
                helpers.enableElement("cancelPrescription");
                setOpenModal(false);
            }).catch((error) => {
                ButtonSpinners(false, "cancelPrescription");
                helpers.enableElement("cancelPrescription");
                console.log(error);
            })
        }
    }
    const handleOnClickPrevious = () => {
        let index = claimedDataSet.findIndex(obj => obj.prescriptionOrderId === currentPrescriptionId);
        if (index !== -1) {
            setCurrentPrescriptionOrderId(claimedDataSet[index - 1].prescriptionOrderId);
            props.history.push(`${CRM_UI}/healthrecord/p_${claimedDataSet[index - 1].prescriptionOrderId}`);
        }
    }

    const handleOnClickNext = () => {
        let index = claimedDataSet.findIndex(obj => obj.prescriptionOrderId === currentPrescriptionId);
        if (index !== -1) {
            setCurrentPrescriptionOrderId(claimedDataSet[index + 1].prescriptionOrderId);
            props.history.push(`${CRM_UI}/healthrecord/p_${claimedDataSet[index + 1].prescriptionOrderId}`);
        }
    }

    const onClose = () => {
        helpers.resetForm("cancellationForm");
        setOpenModal(false);
    }
    const observersMap = {
        'reasons': [['select', validateReason]],
        'cancelPrescription': [['click', cancelPrescription]],
        'closeModal' : [['click', onClose]]
    }

    const handleFailure = ({ message }) => {
        setStackedToastContent({ toastMessage: message, position: TOAST_POSITION.BOTTOM_START })
    }

    const addProductsToCart = () => {
        if(validate.isNotEmpty(healthRecordInfo) && validate.isNotEmpty(healthRecordInfo.healthRecordStatus) && "I" == healthRecordInfo.healthRecordStatus){
            setStackedToastContent({toastMessage : "This HealthRecordId is InActive, Please check with customer"})
            return;
        }
        let paramObj = { customerId: healthRecordInfo.customerId, latLong: currentPrescriptionInfo ? currentPrescriptionInfo.showPrescriptionActions.locality : healthRecordInfo.latLong ? healthRecordInfo.latLong : undefined, products: checkedProducts }
        if (type == 'p') {
            paramObj['prescriptionId'] = currentPrescriptionId;
        } else if (type == 'h') {
            paramObj['recordId'] = currentPrescriptionId;
        }
        ShoppingCartService().addProductsToCart({ customerId: healthRecordInfo.customerId, latLong: currentPrescriptionInfo ? currentPrescriptionInfo.showPrescriptionActions.locality : healthRecordInfo.latLong ? healthRecordInfo.latLong : undefined, recordId: type == "h" ? healthRecordInfo.recordId : null, products: checkedProducts, prescriptionId: type == "p" ? currentPrescriptionId : null }).then((data) => {
            if (data && data.statusCode === "SUCCESS") {
                if (type == 'p')
                    redirectToCatalogIntermediateComponent({pageToRedirect : "checkout/showSwitchProducts", customerId: healthRecordInfo.customerId, prescriptionId: currentPrescriptionId, cfpStoreId: null, recordId: null, cfpLocality : null, latLong: healthRecordInfo.latLong })
                    //redirectToShoppingCart({ customerId: healthRecordInfo.customerId, prescriptionId: currentPrescriptionId, recordId: "", locality: healthRecordInfo?.latLong ? healthRecordInfo.latLong : "", cart: true, fromPage:"Prescription" }, handleFailure)
                else if (type == 'h')
                    redirectToCatalogIntermediateComponent({pageToRedirect : "checkout/showSwitchProducts", customerId: healthRecordInfo.customerId, prescriptionId: null, cfpStoreId: null, recordId: currentPrescriptionId, cfpLocality : null, latLong: healthRecordInfo.latLong  })
                   // redirectToShoppingCart({ customerId: healthRecordInfo.customerId, prescriptionId: "", recordId: currentPrescriptionId, locality: healthRecordLocality?.latLong ? healthRecordLocality.latLong : "" , cart: true, fromPage:"Prescription" }, handleFailure)
            } else
                setStackedToastContent({ toastMessage: data.message, position: TOAST_POSITION.BOTTOM_START })

        }).catch(() => {
            setIsLoading(false);
            console.log("Error Occured");
        });
    }

    const shopMoreProducts = () => {
        if(validate.isNotEmpty(healthRecordInfo) && validate.isNotEmpty(healthRecordInfo.healthRecordStatus) && "I" == healthRecordInfo.healthRecordStatus){
            setStackedToastContent({toastMessage : "This HealthRecordId is InActive, Please check with customer"})
            return;
        }
            const latLong = healthRecordInfo.latLong;
            ShoppingCartService().addProductsToCart({ customerId: healthRecordInfo.customerId, latLong: currentPrescriptionInfo ? currentPrescriptionInfo.showPrescriptionActions.locality : healthRecordInfo.latLong ? healthRecordInfo.latLong : undefined, recordId: type == "h" ? healthRecordInfo.recordId : null, products: checkedProducts, prescriptionId: type == "p" ? currentPrescriptionId : null }).then((data) => {
                if (data && data.statusCode === "SUCCESS") {
                    // setStackedToastContent({ toastMessage: "Products Added to Cart", position: TOAST_POSITION.BOTTOM_START })
                    if (type == 'p')
                        redirectToCatalogIntermediateComponent({pageToRedirect : "catalog", customerId: healthRecordInfo.customerId, prescriptionId: currentPrescriptionId, cfpStoreId: null, recordId: null, cfpLocality : null, latLong})
                      else if (type == 'h')
                        redirectToCatalogIntermediateComponent({pageToRedirect : "catalog", customerId: healthRecordInfo.customerId, prescriptionId: null, cfpStoreId: null, recordId: currentPrescriptionId, cfpLocality : null, latLong  })

                        // redirectToPrescriptionCatalogPage({ customerId: healthRecordInfo.customerId, recordId: currentPrescriptionId, prescriptionId: "", locality: healthRecordLocality?.latLong ? healthRecordLocality.latLong : "", catalog: true }, handleFailure)
                } else
                    setStackedToastContent({ toastMessage: data.message, position: TOAST_POSITION.BOTTOM_START })
                if (type == 'p')
                    redirectToCatalogIntermediateComponent({pageToRedirect: "catalog", customerId: healthRecordInfo.customerId, prescriptionId: currentPrescriptionId, cfpStoreId: null, cfpLocality : null, latLong  })
                else if (type == 'h')
                    redirectToCatalogIntermediateComponent({pageToRedirect : "catalog", customerId: healthRecordInfo.customerId, prescriptionId: null, cfpStoreId: null, recordId: currentPrescriptionId, cfpLocality : null, latLong  })
                // redirectToPrescriptionCatalogPage({ customerId: healthRecordInfo.customerId, recordId: currentPrescriptionId, prescriptionId: "", locality: healthRecordInfo?.latLong ? healthRecordInfo.latLong : "", catalog: true }, handleFailure)
            }).catch(() => {
                setIsLoading(false);
                console.log("Error Occured");
            });
        }
        
    const handleCustomerCreate = () => {
        setIsLoading(true);
        setShowCreateCustomerForm(false);

        getData(recordIdWithType);
        setIsLoading(false);
    }

    const calculateImageDimensions = useCallback(() => {
        if (!isVertical) {
            setImageDimensions({ width: `${imageContainerRef?.current?.offsetWidth - 24}px`, height: `${imageContainerRef?.current?.offsetHeight - 24}px` });
        }
        else {
            setImageDimensions({ width: `${imageContainerRef?.current?.offsetHeight - 24}px`, height: `${imageContainerRef?.current?.offsetWidth - 24}px` });
        }
    }, [imageContainerRef, isVertical]);

    const displayStatusBadge = (status) => {
        let showingStatus = status;
        let badgeColour = '';
        switch (status) {
            case 'Created':
                badgeColour = 'badge-created'
                break
            case 'Converted To Oms':
                showingStatus = 'Converted to OMS';
                badgeColour = 'badge-Submitted';
                break
            case 'Decoded':
                badgeColour = 'badge-Decoded';
                break
            case 'Pending':
                badgeColour = 'badge-pending';
                break
            case 'Cancelled':
                badgeColour = 'badge-Cancelled';
                break
            case "Partially Decoded":
                showingStatus = 'Partially Decoded';
                badgeColour = 'badge-PartiallyDecoded';
        }
        return <React.Fragment>
            <Badges className={badgeColour} text={showingStatus} />
        </React.Fragment>
    }
    const CloseButton = <Button variant="" className="btn-close icon-hover" type="button" onClick={() => onClose()}></Button>
    const processClaimAction = (recordId, orderIdsList, row) => {
        let claimObject = {};
        if(validate.isEmpty(orderIdsList)){
           orderIdsList.push(recordId);
       }
       else if(validate.isNotEmpty(orderIdsList) && orderIdsList.indexOf(recordId) == -1){
           orderIdsList.length = 0;
           orderIdsList.push(recordId);
       }
        if (validate.isEmpty(row.claimedBy) || row.claimedBy == "O") {
            row.claimedBy = "S";
            row.processedClaimAction = true;
            claimObject['toastMessage'] = "Claimed Successfully"
        } else {
            row.claimedBy = undefined;
            row.processedClaimAction = false;
            claimObject['toastMessage'] = "Unclaimed Successfully"
        }
        claimObject['claimedDataSet'] = row;
       setOmsClaimedDataSet(claimObject.claimedDataSet);
       setStackedToastContent({ toastMessage: (orderIdsList.length == 1 ? ("Order ID(s) " + orderIdsList + " ") : ("Order ID(s) ")) + claimObject.toastMessage });
   }

//    const goBack =()=>{
//     const recordId = prescriptionId;
//     console.log(prescriptionId);
//     localStorage.setItem('recordId', prescriptionId);
//     props.history.goBack(recordId)
//    }

    return (<React.Fragment>
        <Wrapper className="m-0">
            {(showCreateCustomerForm || isLoading) ? <React.Fragment></React.Fragment> :
                <HeaderComponent ref={headerRef} className="border-bottom p-12">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                        {props.needBackButton &&
                            <Button variant=" " onClick={() => (props.setHighlightRow ? props.setHighlightRow(true): null, props.setOpenHealthRecordModal(false))} className="rounded-5 icon-hover btn-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 36 36">
                                <g id="leftarrow_black_icon_36px" transform="translate(0 -0.003)">
                                    <rect id="BG_Guide" data-name="BG Guide" width="36" height="36" transform="translate(0 0.003)" fill="none"/>
                                    <path id="Path_22927" data-name="Path 22927" d="M64.191,319.236a1.372,1.372,0,0,0-.9.357L49.343,332.652a1.406,1.406,0,0,0,0,1.968L63.3,347.5a1.418,1.418,0,0,0,1.968-.178,1.4,1.4,0,0,0,0-1.968L54.173,334.977H83.51a1.431,1.431,0,0,0,0-2.862H54.173L65.442,321.74a1.271,1.271,0,0,0,.537-1.073,2.549,2.549,0,0,0-.357-1.074A8.079,8.079,0,0,0,64.191,319.236Z" transform="translate(-48.941 -315.233)" fill="#080808"/>
                                </g>
                                </svg>
                            </Button>
                        }
                            <p className="mb-0 ms-2">
                                {type == 'p' ? <span className="text-secondary">Prescription ID - </span> : <span className="text-secondary"> Health Record ID- </span>}
                                <span className="fw-medium">{currentPrescriptionId}</span>
                            </p>
                            {validate.isNotEmpty(healthRecordInfo.patientName) &&
                                <React.Fragment>
                                    <div className="border-end mx-2"></div>
                                    <p className="mb-0 p-12"><span className="text-secondary">Patient  - </span><span className="mb-0 fw-medium">
                                        {healthRecordInfo.patientName}</span>
                                        {validate.isNotEmpty(healthRecordInfo.patientAge) && healthRecordInfo.patientAge > 0 && <span className="mb-0 fw-medium">, {healthRecordInfo.patientAge}yrs</span>}
                                    </p>
                                </React.Fragment>}
                            {type == 'p' && validate.isNotEmpty(healthRecordInfo) && validate.isNotEmpty(healthRecordInfo.prescriptionStatus) && <span className="ms-3"> {displayStatusBadge(healthRecordInfo.prescriptionStatus)}</span>}
                        </div>
                        <div className="d-flex justify-content-end">
                            {type == 'p' && validate.isNotEmpty(claimedDataSet) && claimedDataSet.findIndex(obj => obj.prescriptionOrderId == currentPrescriptionId) !== -1 && <div>
                                <Button variant="link" size="sm" className="text-dark" onClick={() => handleOnClickPrevious()} disabled={claimedDataSet.findIndex(obj => obj.prescriptionOrderId == currentPrescriptionId) <= 0 || isLoading}>
                                    <img src={PrevIcon} alt="Previous" className="align-text-top me-1"/>
                                    Previous
                                </Button>
                                <Button variant="link" size="sm" className="text-dark" onClick={() => handleOnClickNext()} disabled={claimedDataSet.findIndex(obj => obj.prescriptionOrderId == currentPrescriptionId) == claimedDataSet.length - 1 || isLoading}>
                                    Next
                                    <img src={NextIcon} alt="Next" className="align-text-top ms-1"/>
                                </Button>
                            </div>}
                            {/* <Button variant=" " onClick={toggle} className="rounded-5 icon-hover btn-link p-0">
                            <img src={CloseIcon} alt="Close Icon" title="close" />
                        </Button>*/}
                        </div>
                    </div>
                </HeaderComponent>}
            {!showCreateCustomerForm && <BodyComponent allRefs={{ headerRef, footerRef }} loading={isLoading} className="body-height p-0">
                {!isLoading && validate.isEmpty(healthRecordInfo) && validate.isNotEmpty(noDataFoundMessage) && <div className="d-flex justify-content-center align-items-center h-100"><p className="mb-0">{noDataFoundMessage}</p></div>}
                {!isLoading && validate.isNotEmpty(healthRecordInfo) &&
                    <div className={`row mx-0 h-100`}>
                        <div className="col-12 col-lg-6 h-100 border-end">
                        <HealthRecordImage isFromPrescriptionDashboard type = {type} healthRecordInfo = {healthRecordInfo} setOpenModal = {setOpenModal} setSelectedImagePath={setSelectedImagePath} selectedImagePath={selectedImagePath} thumbNailImagesList={thumbNailImagesList} imagesList={imagesList} setLightBoxOpen={setLightBoxOpen} />
                        </div>
                        <div className="col-12 col-lg-6 mt-3 mt-lg-0 h-100 p-0">
                            <HeaderComponent ref={headerRightChildRef}>
                                <div class="custom-tabs-forms d-flex justify-content-between pb-0 mobile-compatible-tabs">
                                    <Nav tabs>
                                        <NavItem>
                                            <NavLink
                                                className={`${activeTab == 2 ? "active " : ""}`}
                                                onClick={() => setActiveTab(2)}
                                            >
                                                {type == 'p' ? "Prescription Details" : "Health Record Details"}
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={`${activeTab == 1 ? "active" : ""}`}
                                                onClick={() => setActiveTab(1)}>
                                                Decoded Information
                                                <span className="ms-3 position-relative bg-light">
                                                    <Badges className={AnimationHelpers().getBadgeAnimation("badge text-dark bg-light", totalClaimedRecordsAnimation, setTotalClaimedRecordsAnimation)} text={productsCount} tooltip="Number of Products" id={"productsCount"} />
                                                </span>
                                            </NavLink>
                                        </NavItem>
                                        {(validate.isNotEmpty(healthRecordInfo.customerId) && healthRecordInfo.customerId != 0) &&
                                            <NavItem>
                                                <NavLink
                                                    className={`${activeTab == 3 ? "active " : ""}`}
                                                    onClick={() => setActiveTab(3)}
                                                >
                                                    Associated Orders
                                                </NavLink>
                                            </NavItem>}
                                    </Nav>
                                </div>
                            </HeaderComponent>
                            <BodyComponent allRefs={{ "headerRef": headerRightChildRef, "footerRef": footerRightChildRef }} className={`body-height scroll-on-hover`}>
                                <TabContent className="h-100" activeTab={activeTab}>
                                    <TabPane className="h-100" tabId={1}>
                                        <div className="h-100">
                                            <label className="custom-fieldset mb-2">Products List</label>
                                            {/* Grid Comes inside the container here */}
                                            <div className="overflow-y-auto scroll-grid-on-hover" style={{ 'height': 'calc(100% - 40px' }}>
                                                <div className="card h-100">
                                                    <div className='card-body p-0'>
                                                        <DecodedInformation healthRecordInfo={healthRecordInfo} customerExists={(validate.isNotEmpty(healthRecordInfo.customerId) && healthRecordInfo.customerId != 0)} type={type} recordType={healthRecordInfo.recordType} recordId={healthRecordInfo.recordId} prescriptionIsClaimed={validate.isNotEmpty(claimedDataSet) && claimedDataSet.findIndex(obj => obj.prescriptionOrderId == currentPrescriptionId) !== -1} setProdutsCount={setProdutsCount} checkedProducts={checkedProducts} setCheckedProducts={setCheckedProducts} setAlertContent={setAlertContent} />
                                                    </div>
                                                    {(validate.isNotEmpty(healthRecordInfo.customerId) && healthRecordInfo.customerId != 0) &&
                                                        <div className="card-footer p-0 bg-body">
                                                            <div className="d-flex p-12 gap-2 justify-content-end">
                                                                <div className="d-flex justify-content-end">
                                                                    <Button variant="" size="sm brand-secondary" onClick={() => { shopMoreProducts(); }}>Shop More Products</Button>
                                                                </div>
                                                                <div className="d-flex justify-content-end">
                                                                    <Button variant="success" size="sm" disabled={validate.isEmpty(checkedProducts)} onClick={() => { addProductsToCart(); }}>Add Products to Cart</Button>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                </div>
                                            </div>

                                        </div>
                                    </TabPane>
                                    <TabPane className="h-100" tabId={2}>
                                        {(validate.isNotEmpty(healthRecordInfo.customerId) && healthRecordInfo.customerId != 0) ?
                                            <div>
                                                <React.Fragment>
                                                    <label className="custom-fieldset">Customer Information</label>
                                                    <div className="row mb-3">
                                                        <div className="col-6">
                                                            <p className="mb-0 mt-2 text-secondary font-12">Customer ID</p>
                                                            <p className="mb-0 font-14">{viewCustomerLink(healthRecordInfo.customerId)}</p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-0 mt-2 text-secondary font-12">Customer Name</p>
                                                            <p className="mb-0 font-14">{`${validateAndDisplayData(healthRecordInfo.customerName)}`}</p>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            </div>
                                            : <div className="h-100">
                                                <p className="text-secondary font-12">This Customer does not have Personal Information. Update the Details below.</p>
                                                <div>
                                                    <CreateCustomerForm fromPrescription onCustomerCreate={handleCustomerCreate} {...props} fieldValues={{ "mobileNo": healthRecordInfo.mobileNo }} clearFormData={clearCustomerForm} />
                                                </div>
                                            </div>
                                        }
                                        {type == "h" && <React.Fragment>
                                            <label className="custom-fieldset">Health Record Information</label>
                                            <div className="row mb-3">
                                                <div className="col-6">
                                                    <p className="mb-0 mt-2 text-secondary font-12">Record Name</p>
                                                    <p className="mb-0 font-14">{`${validateAndDisplayData(healthRecordInfo.recordName)}`}</p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0 mt-2 text-secondary font-12">Record Type</p>
                                                    <p className="mb-0 font-14">{`${validateAndDisplayData(healthRecordInfo.recordType)}`}</p>
                                                </div>
                                            </div>
                                        </React.Fragment>}
                                        {(validate.isNotEmpty(healthRecordInfo.patientName) || validate.isNotEmpty(healthRecordInfo.doctorName)) && <label className="custom-fieldset">Patient &amp; Doctor Details</label>}
                                        {(validate.isNotEmpty(healthRecordInfo.patientName) || validate.isNotEmpty(healthRecordInfo.doctorName)) && <div className="row mb-3">
                                            <div className="col-6">
                                                <p className="mb-0 mt-2 text-secondary font-12">Patient Info</p>
                                                <p className="mb-0">{validateAndDisplayData(healthRecordInfo.patientName)}</p>
                                                {validate.isNotEmpty(healthRecordInfo.patientAge) && healthRecordInfo.patientAge > 0 && <p className="mb-0 font-14">{`Age - ${healthRecordInfo.patientAge}`} years.</p>}
                                            </div>
                                            <div className="col-6">
                                                <p className="mb-0 mt-2 text-secondary font-12">Doctor Name</p>
                                                <p className="mb-0">{validateAndDisplayData(healthRecordInfo.doctorName)}</p>
                                            </div>
                                        </div>}
                                        {validate.isNotEmpty(healthRecordInfo) && validate.isNotEmpty(healthRecordInfo.customerId) && healthRecordInfo.customerId != 0 && displayStatusInformation()}
                                    </TabPane>
                                    <TabPane className="h-100" tabId={3}>
                                        {validate.isNotEmpty(healthRecordInfo) && validate.isNotEmpty(healthRecordInfo.customerId) && healthRecordInfo.customerId != 0 && <PrescriptionAssociatedOrders recordId={healthRecordInfo.recordId} prescriptionOrderId={healthRecordInfo.prescriptionOrderId} customerId={healthRecordInfo.customerId} setMartOrderInfo={handleMartOrderDetails} setOpenOrderDetailModal={handleOpenOrderDetailModal} setStackedToastContent={setStackedToastContent} />}
                                    </TabPane>
                                </TabContent>
                            </BodyComponent>
                            {!(validate.isNotEmpty(healthRecordInfo.customerId) && healthRecordInfo.customerId != 0) && activeTab==2 &&
                                <FooterComponent ref={footerRightChildRef}>
                                    <div className='border-top px-3 py-2 d-flex flex-row-reverse'>
                                        <button form='newCustomerForm' className='btn btn-danger ms-3' >Create New Customer</button>
                                        <button className='btn brand-secondary btn' onClick={() => setClearCustomerForm(!clearCustomerForm)}>Clear</button>
                                    </div>
                                </FooterComponent>}
                        </div>
                    </div>}
                {validate.isNotEmpty(martOrderInfo) && openOrderDetailModal && <PrepareOrderDetails {...props} row={martOrderInfo} orderId={martOrderInfo.orderId} cartId={martOrderInfo.cartId} customerId={martOrderInfo.customerId} prescriptionOrderId={martOrderInfo.prescriptionOrderId} openOrderDetailModal={openOrderDetailModal} setOpenOrderDetailModal={handleOpenOrderDetailModal} processClaimAction={processClaimAction} claimedDataSet={omsClaimedDataSet} setClaimedDataSet={setOmsClaimedDataSet} fromPage={"healthRecord"}/>}
                {openModal == true && <Modal
                    isOpen={openModal}
                    backdrop="static"
                    aria-labelledby="contained-modal-title-vcenter"
                   className="modal-dialog-centered modal-lg"
                >   <ModalHeader className="p-12" close={CloseButton}>
                       <ModalTitle className="h6">Do you want cancel prescription</ModalTitle> 
                    </ModalHeader>
                    <ModalBody className="p-0">
                    <div className="ps-1">
                            <div class="form-floating">
                                <input type="text" readonly class="form-control-plaintext form-control-sm" id="prescriptionId" value={prescriptionId} />
                                <label for="prescriptionId">Prescription ID</label>
                            </div>
                        </div>
                        {<DynamicForm requestUrl={`${API_URL}getPrescriptionCancellationForm`} requestMethod={'GET'} helpers={helpers} observers={observersMap} />}
                    </ModalBody>
                </Modal>
                }
                {imagesList && isLightBoxOpen &&
                    <ImageLightBox imageIndex={activeIndex} prescImages={imagesList}
                        mainSrc={imagesList[activeIndex]}
                        nextSrc={imagesList[(activeIndex + 1) % imagesList.length]}
                        prevSrc={imagesList[(activeIndex + imagesList.length - 1) % imagesList.length]}
                        imageTitle={"Prescription Details"}
                        onCloseRequest={() => { setLightBoxOpen(false); setActiveIndex(0); }}
                        onMovePrevRequest={() => setActiveIndex((activeIndex + imagesList.length - 1) % imagesList.length)}
                        onMoveNextRequest={() => setActiveIndex((activeIndex + 1) % imagesList.length)}
                    />
                }
            </BodyComponent>}
        </Wrapper>
    </React.Fragment>
    )
}
export default withFormHoc(HealthRecord);