import { useCallback, useContext, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { UncontrolledTooltip } from "reactstrap";
import SendSmsToCustomer from "../../helpers/SendSmsToCustomer";
import Validate from "../../helpers/Validate";
import PrescriptionService from "../../services/Prescription/PrescriptionService";
import { BodyComponent, FooterComponent } from "../Common/CommonStructure";
import { AlertContext } from "../Contexts/UserContext";
import { HeaderComponent } from "./CommonStructure";



const HealthRecordImage = (props) => {
    const validate = Validate();
    const headerLeftChildRef = useRef(null);
    const footerLeftChildRef = useRef(undefined);
    const imageContainerRef = useRef(null);


    const [scaleFactor, setScaleFactor] = useState(1);
    const [isVertical, setIsVertical] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: "0px", height: "0px" });
    const selectedImagePath = props?.selectedImagePath;
    const prescriptionService = PrescriptionService();
    const { setStackedToastContent } = useContext(AlertContext);
    const [rotate, setRotate] = useState(0);
    const [activeThumbnail, setActiveThumbnail] = useState(0);

    const sendAlertEmail = () => {
        prescriptionService.getSentEmailStatus({ paramObject: JSON.stringify({ patientName: props?.healthRecordInfo.patientName ? props?.healthRecordInfo.patientName : 'Sir/Madam', mobile: props?.healthRecordInfo.mobileNo, presId: props?.prescriptionId, mailId: props?.healthRecordInfo.emailId }) }).then(response => {
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

    const ComputeTransition = () => {
        return {
            transform: `translate3d(${0}rem,${0}rem,0rem) scale3d(${scaleFactor},${scaleFactor},1) rotate(${rotate}deg)`,
        };
    }

    const renderThumbNailImages = () => {
        return <>
            <div className="d-flex gap-2 justify-content-center overflow-x-auto">
                {props?.thumbNailImagesList.map((imagePath, index) => (<div key={index} className="d-flex justify-content-center image-slide-container" onClick={() => { props?.setSelectedImagePath(props?.imagesList[index]) }}>
                    <img src={imagePath} alt={`Image ${index + 1}`} onClick={() => { setActiveThumbnail(index) }} className={`card ${activeThumbnail === index ? `active-thumbnail` : ''}`} />
                </div>
                ))}
            </div>

        </>
    }

    const calculateImageDimensions = useCallback(() => {
        if (!isVertical) {
            setImageDimensions({ width: `${imageContainerRef?.current?.offsetWidth - 24}px`, height: `${imageContainerRef?.current?.offsetHeight - 24}px` });
        }
        else {
            setImageDimensions({ width: `${imageContainerRef?.current?.offsetHeight - 24}px`, height: `${imageContainerRef?.current?.offsetWidth - 24}px` });
        }
    }, [imageContainerRef, isVertical]);

    return <>
        <div className="col-12 h-100">
            <HeaderComponent ref={headerLeftChildRef} className="d-flex justify-content-between align-items-center">
                <div className='border-end'></div>
                {/* {type == 'p' && (validate.isNotEmpty(claimedDataSet) && claimedDataSet.findIndex(obj => obj.prescriptionOrderId == currentPrescriptionId) !== -1) && !(healthRecordInfo.prescriptionStatus === 'Cancelled' || healthRecordInfo.prescriptionStatus === 'Converted To Oms') && ( */}
                {props?.isFromPrescriptionDashboard && props?.type == 'p' && !(props?.healthRecordInfo.prescriptionStatus === 'Cancelled' || props?.healthRecordInfo.prescriptionStatus === 'Converted To Oms') && (
                    <div className="d-flex custom-border-end me-auto">
                        <SendSmsToCustomer orderType="PRESCRIPTION" customerName={props?.healthRecordInfo.customerName} mobileNo={props?.healthRecordInfo.mobileNo} customerId={props?.healthRecordInfo.customerId} displayOrderId={props?.prescriptionId} />
                        {validate.isNotEmpty(props?.healthRecordInfo.emailId) && <Button size="sm" variant="outline-dark mx-2" onClick={() => sendAlertEmail()}>Email Alert</Button>}
                        <span className="border-end"></span>
                        {validate.isNotEmpty(props?.healthRecordInfo.prescriptionStatus) && <Button size="sm" className="brand-secondary ms-2" variant="" onClick={() => props?.setOpenModal(true)}>Cancel Prescription</Button>}
                    </div>
                )}
                {/* expand button */}
                <div className="d-flex custom-border-end ms-auto">
                    <Button id="expand-icn" size="sm" variant='link' className="icon-hover" onClick={() => (props?.setLightBoxOpen(true))}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g id="scale-up-icn-24" transform="translate(-101 -120)">
                                <rect id="Rectangle_10427" data-name="Rectangle 10427" width="24" height="24" rx="3" transform="translate(101 120)" fill="none" />
                                <path id="scale-up-icn" d="M44.321,64.682a1.043,1.043,0,0,1-.294-.839l.546-5.875A1.067,1.067,0,0,1,45.706,57a1.043,1.043,0,0,1,.965,1.133l-.294,2.98,5.2-5.2A1.039,1.039,0,1,1,53.05,57.38l-5.162,5.246,2.98-.294a1.052,1.052,0,1,1,.168,2.1l-5.875.546h-.084a1.206,1.206,0,0,1-.755-.294Zm19.557-20.69L58,44.537a1.043,1.043,0,0,0-.965,1.133,1.067,1.067,0,0,0,1.133.965l2.98-.294-5.2,5.246a1.054,1.054,0,0,0,1.511,1.469l5.2-5.2-.294,2.98a1.043,1.043,0,0,0,.965,1.133h.084A1.052,1.052,0,0,0,64.466,51l.546-5.875a1.043,1.043,0,0,0-.294-.839,1.094,1.094,0,0,0-.839-.294Z" transform="translate(58.481 77.517)" fill="#6c757d" />
                            </g>
                        </svg>
                    </Button>
                    <UncontrolledTooltip placement="bottom" target="expand-icn">
                        Full Screen
                    </UncontrolledTooltip>
                    {/* Left Rotate */}
                    <Button id="left-rotate" size="sm" variant='link' className="icon-hover" onClick={() => { setRotate((rotate - 90) % 360); setIsVertical(!isVertical) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g id="rotate-left-icn-24" transform="translate(-101 -120)">
                                <rect id="Rectangle_10427" data-name="Rectangle 10427" width="24" height="24" rx="3" transform="translate(101 120)" fill="none" />
                                <g id="rotate-left-icn" transform="translate(103.608 142) rotate(-90)">
                                    <path id="Subtraction_95" data-name="Subtraction 95" d="M-6779.356-18076.006a4.719,4.719,0,0,1-3.359-1.393,4.707,4.707,0,0,1-1.389-3.359,4.7,4.7,0,0,1,1.389-3.355,4.732,4.732,0,0,1,3.327-1.393h.032a4.755,4.755,0,0,1,2.374.641,4.71,4.71,0,0,1,1.739,1.738,4.748,4.748,0,0,1,.635,2.369,4.722,4.722,0,0,1-1.389,3.359A4.72,4.72,0,0,1-6779.356-18076.006Zm0-7.5a2.754,2.754,0,0,0-1.947.8,2.751,2.751,0,0,0-.8,1.943,2.733,2.733,0,0,0,.8,1.947,2.754,2.754,0,0,0,1.947.8,2.731,2.731,0,0,0,1.942-.8,2.733,2.733,0,0,0,.8-1.947,2.751,2.751,0,0,0-.8-1.943A2.731,2.731,0,0,0-6779.356-18083.5Z" transform="translate(6784.356 18090.752)" fill="#6c757d" />
                                    <path id="Subtraction_96" data-name="Subtraction 96" d="M-6765.254-18062.213a1.012,1.012,0,0,1-.238-.029,1.039,1.039,0,0,1-.635-.463,1.007,1.007,0,0,1-.1-.762,1.04,1.04,0,0,1,.476-.609,7.7,7.7,0,0,0,3.172-3.57,7.7,7.7,0,0,0,.472-4.75,7.734,7.734,0,0,0-2.4-4.125l-.417-.373v2.654a1.035,1.035,0,0,1-.254.7,1.019,1.019,0,0,1-.653.354.622.622,0,0,1-.085,0,1.014,1.014,0,0,1-.682-.262,1.016,1.016,0,0,1-.327-.744v-4.062a2.238,2.238,0,0,1,.663-1.592,2.232,2.232,0,0,1,1.588-.658h4.034a1.055,1.055,0,0,1,.681.254,1.051,1.051,0,0,1,.349.654,1.008,1.008,0,0,1-.259.766.985.985,0,0,1-.739.328h-3.118l.495.439a9.647,9.647,0,0,1,3.063,5.178,9.668,9.668,0,0,1-.562,5.994,9.671,9.671,0,0,1-3.984,4.523A1.02,1.02,0,0,1-6765.254-18062.213Z" transform="translate(6779.358 18080.75)" fill="#6c757d" />
                                </g>
                            </g>
                        </svg>
                    </Button>
                    <UncontrolledTooltip placement="bottom" target="left-rotate">
                        Rotate Left
                    </UncontrolledTooltip>
                    {/* Right Rotate  */}
                    <Button id="right-rotate" size="sm" variant='link' className="icon-hover" onClick={() => { setRotate((rotate + 90) % 360); setIsVertical(!isVertical) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g id="rotate-left-icn-24" transform="translate(-101 -120)">
                                <rect id="Rectangle_10427" data-name="Rectangle 10427" width="24" height="24" rx="3" transform="translate(101 120)" fill="none" />
                                <g id="rotate-right-icn" transform="translate(104 142) rotate(-90)">
                                    <path id="Subtraction_94" data-name="Subtraction 94" d="M-6820.541-18077.219h-.032a4.7,4.7,0,0,1-3.327-1.389,4.721,4.721,0,0,1-1.389-3.359,4.707,4.707,0,0,1,1.389-3.354,4.718,4.718,0,0,1,3.359-1.395,4.719,4.719,0,0,1,3.359,1.395,4.707,4.707,0,0,1,1.389,3.354,4.763,4.763,0,0,1-.636,2.379,4.812,4.812,0,0,1-1.738,1.738A4.78,4.78,0,0,1-6820.541-18077.219Zm0-7.494a2.731,2.731,0,0,0-1.942.8,2.732,2.732,0,0,0-.808,1.943,2.731,2.731,0,0,0,.808,1.947,2.727,2.727,0,0,0,1.942.8,2.727,2.727,0,0,0,1.943-.8,2.731,2.731,0,0,0,.808-1.947,2.732,2.732,0,0,0-.808-1.943A2.732,2.732,0,0,0-6820.541-18084.713Z" transform="translate(6825.539 18090.752)" fill="#6c757d" />
                                    <path id="Subtraction_93" data-name="Subtraction 93" d="M-6803.033-18062.215h-4.034a2.248,2.248,0,0,1-1.593-.662,2.23,2.23,0,0,1-.658-1.588v-4.062a1,1,0,0,1,.327-.744,1,1,0,0,1,.676-.258h.091a1.06,1.06,0,0,1,.653.354,1.036,1.036,0,0,1,.254.7v2.65l.417-.373a7.692,7.692,0,0,0,2.4-4.123,7.682,7.682,0,0,0-.472-4.748,7.679,7.679,0,0,0-3.167-3.57l0,0a1.021,1.021,0,0,1-.477-.609,1.016,1.016,0,0,1,.1-.762,1.02,1.02,0,0,1,.635-.459.994.994,0,0,1,.236-.029,1.064,1.064,0,0,1,.544.152,9.684,9.684,0,0,1,3.979,4.52,9.681,9.681,0,0,1,.563,5.994,9.664,9.664,0,0,1-3.063,5.182l-.495.436H-6803a1,1,0,0,1,.74.328,1.018,1.018,0,0,1,.258.766,1.062,1.062,0,0,1-.354.654A1.021,1.021,0,0,1-6803.033-18062.215Z" transform="translate(6821.75 18080.75)" fill="#6c757d" />
                                </g>
                            </g>
                        </svg>
                    </Button>
                    <UncontrolledTooltip placement="bottom" target="right-rotate">
                        Rotate Right
                    </UncontrolledTooltip>
                    {/* Search Minimize icon */}
                    <Button id="zoom-out" size="sm" variant='link' className="icon-hover" disabled={scaleFactor <= 1} onClick={() => { setScaleFactor(scaleFactor - 1) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g id="zoomout_white_icon_24" transform="translate(-180.258 -387.452)">
                                <rect id="Rectangle_3299" data-name="Rectangle 3299" width="24" height="24" rx="3" transform="translate(180.258 387.452)" fill="none" />
                                <path id="Union_184" data-name="Union 184" d="M-6657.677-17671.09l-6.7-6.705a7.668,7.668,0,0,1-4.68,1.6,7.689,7.689,0,0,1-7.681-7.682,7.688,7.688,0,0,1,7.681-7.676,7.687,7.687,0,0,1,7.677,7.676,7.686,7.686,0,0,1-1.6,4.686l6.7,6.7a.993.993,0,0,1,0,1.4.983.983,0,0,1-.7.293A.98.98,0,0,1-6657.677-17671.09Zm-17.09-12.783a5.709,5.709,0,0,0,5.706,5.705,5.708,5.708,0,0,0,5.7-5.705,5.708,5.708,0,0,0-5.7-5.7A5.709,5.709,0,0,0-6674.767-17683.873Zm1.967.99a.989.989,0,0,1-.981-.99.988.988,0,0,1,.985-.984c1.528-.01,2.638-.018,3.783-.018,1.017,0,2.047,0,3.681.018a.986.986,0,0,1,.986.984.987.987,0,0,1-.986.99c-1.621.014-2.793.023-3.983.023C-6670.331-17682.859-6671.37-17682.869-6672.8-17682.883Z" transform="translate(6858.625 18080.625)" fill="#6c757d" />
                            </g>
                        </svg>
                    </Button>
                    <UncontrolledTooltip placement="bottom" target="zoom-out">
                        Zoom Out
                    </UncontrolledTooltip>
                    {/* Search maximize Icon */}
                    <Button id="zoom-in" size="sm" variant='link' className="icon-hover" disabled={scaleFactor >= 5} onClick={() => { setScaleFactor(scaleFactor + 1) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g id="zoomin_white_icon_24" transform="translate(-180.258 -387.452)">
                                <rect id="Rectangle_3299" data-name="Rectangle 3299" width="24" height="24" rx="3" transform="translate(180.258 387.452)" fill="none" />
                                <path id="Union_185" data-name="Union 185" d="M-6697.642-17670.877l-6.624-6.625a7.815,7.815,0,0,1-4.671,1.559,7.813,7.813,0,0,1-7.806-7.8,7.812,7.812,0,0,1,7.806-7.8,7.808,7.808,0,0,1,7.8,7.8,7.784,7.784,0,0,1-1.559,4.67l6.629,6.629a1.118,1.118,0,0,1,0,1.572,1.127,1.127,0,0,1-.791.328A1.109,1.109,0,0,1-6697.642-17670.877Zm-16.876-12.871a5.587,5.587,0,0,0,5.581,5.58,5.584,5.584,0,0,0,5.577-5.58,5.583,5.583,0,0,0-5.577-5.576A5.587,5.587,0,0,0-6714.518-17683.748Zm4.466,3.734v-2.619h-2.615a1.113,1.113,0,0,1-1.114-1.115,1.11,1.11,0,0,1,1.114-1.109h2.615v-2.621a1.115,1.115,0,0,1,1.115-1.109,1.111,1.111,0,0,1,1.11,1.109v2.621h2.62a1.113,1.113,0,0,1,1.114,1.109,1.116,1.116,0,0,1-1.114,1.115h-2.62v2.619a1.111,1.111,0,0,1-1.11,1.109A1.115,1.115,0,0,1-6710.051-17680.014Z" transform="translate(6898.5 18080.5)" fill="#6c757d" />
                            </g>
                        </svg>
                    </Button>
                    <UncontrolledTooltip placement="bottom" target="zoom-in">
                        Zoom In
                    </UncontrolledTooltip>
                </div>
            </HeaderComponent>
            {validate.isNotEmpty(selectedImagePath) &&
                <BodyComponent className="body-height p-0 scroll-on-hover" allRefs={{ "headerRef": headerLeftChildRef, "footerRef": footerLeftChildRef }}>
                    <div ref={imageContainerRef} onLoad={() => calculateImageDimensions()} className="w-100 h-100 d-flex justify-content-center align-items-center">
                        {selectedImagePath.endsWith(".pdf")
                            ? <iframe src={selectedImagePath} width={imageDimensions.width} height={imageDimensions.height} type="application/pdf" style={ComputeTransition()} />
                            : <img src={selectedImagePath} className="mw-100" height={imageDimensions.height} alt="Image Not found" style={ComputeTransition()} />
                        }
                    </div>
                </BodyComponent>}
            <FooterComponent ref={footerLeftChildRef}>
                {renderThumbNailImages()}
            </FooterComponent>
        </div>

    </>

}

export default HealthRecordImage;