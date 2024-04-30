import React, { useEffect, useState, useRef, useContext } from 'react';
import Validate from '../../../helpers/Validate';
import LabOrderTabs from '../LabOrderTabs';
import LabOrderDeliveryInfo from './LabOrderDeliveryInfo';
import { Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledTooltip } from 'reactstrap';
import { Button } from 'react-bootstrap';
import CommunicationDisplay from '../../order/CommunicationDisplay';
import { gotoMartCustomerPage } from '../../../helpers/CommonRedirectionPages';
import { AlertContext } from '../../Contexts/UserContext';
import { TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import { TrackScrolling } from '../../order/PrepareOrderDetails';
import LabOrderHeaderButtons from '../../order/LabOrderHeaderButtons';
import CommunicationIcon from '../../../images/linkIcon.svg'
import { DataGridComponent, DetailWrapper, FormsComponent, HeaderComponent } from '../../Common/CommonModel';
import { DetailModelOpened } from '../../Contexts/UserContext';
import LabOrderRescheduleModal from '../labOrderRescheduleModal/LabOrderRescheduleModal';
import EditPatientModal from '../../Common/EditPatientModal';

const LabOrderModal = (props) => {
    const validate = Validate();
    const tabsRef = useRef();
    const scrollContainerRef = useRef();

    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState(undefined);
    const [collectionCenterDetails, setCollectionCenterDetails] = useState(undefined);
    const [deliveryInformation, setDeliveryInformation] = useState(undefined);
    const [patientInfo, setPatientInfo] = useState(undefined);
    const [cancelItemselectedRows, setCancelItemselectedRows] = useState([]);
    const [activeTab, setActiveTab] = useState('orderStatus');
    const { setStackedToastContent } = useContext(AlertContext);
    const [rescheduleModalObj, setRescheduleModalObj] = useState({});
    const [showOrderScheduleModal, setShowOrderScheduleModal] = useState(false);
    const { selectedFormsSection } = useContext(DetailModelOpened);
    const [showEditPatientModal,setShowEditPatientModal] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        if (props.fromPage == "LAB") {
            prepareLabOrderDetails(props.dataSet)
        }
        setIsLoading(false)
    }, [props.dataSet])

    const prepareLabOrderDetails = (dataSet) => {
        if (validate.isNotEmpty(dataSet)) {
            if (validate.isNotEmpty(dataSet.orderInformation)) {
                setOrder({
                    displayOrderId: dataSet.orderInformation.DisplayOrderId,
                    orderId: dataSet.orderInformation.OrderId,
                    storeID: dataSet.storeId,
                    storeName: dataSet.storeName,
                    status: dataSet.orderInformation.orderStatus,
                    deliveryType: dataSet.orderInformation.ReportDeliveyType,
                    visitType: dataSet.orderInformation.VisitType,
                    cartId: dataSet.orderInformation.CartId,
                    orderDate: dataSet.orderInformation.OrderDate,
                    orderCancelAllowed: dataSet.orderInformation.orderCancelAllowed,
                    buttons: dataSet.orderInformation.buttons,
                    approveOrderButton: dataSet.orderInformation.approveOrderButton,
                    appliedCoupon: validate.isNotEmpty(dataSet.orderInformation.AppliedCoupon) ? dataSet.orderInformation.AppliedCoupon.toString() : "",
                    registrationId: dataSet.orderInformation.RegistrationId
                })
            } else {
                setOrder({
                    displayOrderId: dataSet.displayOrderId,
                    orderId: dataSet.orderId,
                    storeID: dataSet.storeId,
                    storeName: dataSet.storeName,
                })

            }
            if (validate.isNotEmpty(dataSet.collectionCenterDetails)) {
                setCollectionCenterDetails({
                    name: dataSet.collectionCenterDetails.Name,
                    address: dataSet.collectionCenterDetails.Address,
                    city: dataSet.collectionCenterDetails.city,
                    state: dataSet.collectionCenterDetails.state,
                    phone: dataSet.collectionCenterDetails.mobileNumber
                })

            }

            if (validate.isNotEmpty(dataSet.deliveyInformation)) {
                let addLine1 = '';
                let addLine2 = '';
                if (validate.isNotEmpty(dataSet.deliveyInformation.addressLine))
                    addLine1 = `${dataSet.deliveyInformation.addressLine}`
                if (validate.isNotEmpty(dataSet.deliveyInformation.city) && validate.isNotEmpty(dataSet.deliveyInformation.state) && validate.isNotEmpty(dataSet.deliveyInformation.pincode))
                    addLine2 = `${dataSet.deliveyInformation.city}, ${dataSet.deliveyInformation.state}, ${dataSet.deliveyInformation.pincode}`
                setDeliveryInformation({
                    name: dataSet.deliveyInformation.firstAndLastName,
                    addressLine1: addLine1,
                    addressLine2: addLine2,
                    mobileNo: dataSet.deliveyInformation.mobileNo,
                    email: dataSet.deliveyInformation.email
                })
            }

            if (validate.isNotEmpty(dataSet.patientDetails)) {
                setPatientInfo(dataSet.patientDetails)
            }
        }

    }

    const handleFailure = () => {
        setStackedToastContent({ toastMessage: "Customer is Already Opened", position: TOAST_POSITION.BOTTOM_START })
    }

    const onSuccessOfPatientUpdation = () => {
        props.onSubmitClick(order.orderId);
        props.setReloadPage(!props.reloadPage);
    }

    const LabOrderHeaderButton = () => {
        return <React.Fragment>
            <LabOrderHeaderButtons {...props} setRescheduleModalObj={setRescheduleModalObj} setShowOrderScheduleModal={setShowOrderScheduleModal} fromPage={props.fromPage} order={order} dataSet={props.dataSet} collectionCenter={collectionCenterDetails} patientInfo={patientInfo} customer={deliveryInformation} handleLabOrderCancel={props.handleLabOrderCancel} setReloadPage={props.setReloadPage} reloadPage={props.reloadPage} setOrderStatus={props.setOrderStatus} cancelItemselectedRows={cancelItemselectedRows} setCancelItemselectedRows={setCancelItemselectedRows} onSubmitClick={props.onSubmitClick} setDisableMode={props.setDisableMode} disableMode={props.disableMode}></LabOrderHeaderButtons>
            </React.Fragment>
    }

    return (
        <React.Fragment>
            {showOrderScheduleModal && <LabOrderRescheduleModal value={rescheduleModalObj} showOrderScheduleModal={showOrderScheduleModal} setShowOrderScheduleModal={setShowOrderScheduleModal} setDisableMode={props.setDisableMode} disableMode={props.disableMode} onSubmitClick={props.onSubmitClick} setReloadPage={props.setReloadPage} reloadPage={props.reloadPage} from="deliveryInfo" />}
            {showEditPatientModal && <EditPatientModal setShowEditPatientModal={setShowEditPatientModal} showEditPatientModal={showEditPatientModal} patientInfo={patientInfo.customerPatient} onSuccessOfPatientUpdation={onSuccessOfPatientUpdation}/>}
            <DetailWrapper modalType={"LAB"}>
            <HeaderComponent id={"HeaderComp"} style={{'padding-bottom':'0.75rem'}}>
            {!props.hideHeaderButtons && LabOrderHeaderButton()}
            </HeaderComponent>
                    <FormsComponent headerText={"Delivery & Order Information"} id={"FormsComp"} className={`${selectedFormsSection ? "border" : ''} overflow-y-auto h-100 shadow-none`}>
                        <LabOrderDeliveryInfo {...props} rescheduleModalObj={rescheduleModalObj} customerId={props?.dataSet?.customerId} setShowOrderScheduleModal={setShowOrderScheduleModal} showOrderScheduleModal={showOrderScheduleModal} fromPage={props.fromPage} order={order} dataSet={props.dataSet} collectionCenter={collectionCenterDetails} patientInfo={patientInfo} customer={deliveryInformation} handleLabOrderCancel={props.handleLabOrderCancel} setReloadPage={props.setReloadPage} reloadPage={props.reloadPage} setOrderStatus={props.setOrderStatus} cancelItemselectedRows={cancelItemselectedRows} setCancelItemselectedRows={setCancelItemselectedRows} onSubmitClick={props.onSubmitClick} setDisableMode={props.setDisableMode} disableMode={props.disableMode} setShowEditPatientModal={setShowEditPatientModal}/>
                    </FormsComponent>
                    <DataGridComponent id={"DataGridComp"} className="h-100 overflow-y-auto shadow-none">
                        {/* <div className="border rounded crm-modal" style={{ "max-height": `100%`, "overflow-y": "auto" }}> */}
                        <div className=" rounded crm-modal h-100" >
                            <div className={`custom-tabs-forms mobile-compatible-tabs d-flex justify-content-between pb-0`} ref={tabsRef}>
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={'orderStatus' === activeTab ? "active" : ""}
                                            onClick={() => setActiveTab('orderStatus')}
                                            href='#orderStatus'
                                        >
                                            Order Status
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                    <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                                        <NavLink
                                            className={'communications' === activeTab ? "active" : ""}
                                            onClick={() => setActiveTab('communications')}
                                            href='#communications'
                                        >
                                            Communications
                                        </NavLink>
                                        <NavLink
                                        id="openCommunications"
                                        className={`hide-on-mobile ${"communicationDisplay" === activeTab ? "active" : ""}`}
                                        onClick={() => gotoMartCustomerPage({ pageToRedirect: "Communication", customerId: props?.dataSet?.customerId, locality: null, beautyCustomerId: props?.dataSet?.customerId, mobile: props?.dataSet?.deliveryInformation?.mobileNo }, handleFailure)}>
                                        <img src={CommunicationIcon} alt="Open Communications" />
                                        <UncontrolledTooltip placement="bottom" target={"openCommunications"}>
                                            Open Communication
                                        </UncontrolledTooltip>
                                    </NavLink>
                                    </div>
                                    </NavItem>
                                </Nav>
                                <Button variant=" " className="text-primary rounded-0 btn btn-sm btn-link hide-on-mobile" onClick={() => { gotoMartCustomerPage({ pageToRedirect: "ticket-history", locality: null, beautyCustomerId: props?.dataSet?.customerId, email: props?.dataSet?.deliveryInformation?.email, mobile: props?.dataSet?.deliveryInformation?.mobileNo, customerId: props?.dataSet?.customerId, orderId: props?.dataSet?.displayOrderId }, handleFailure) }}>
                                   Create Ticket</Button>
                            </div>
                            <div id="OrderSearchModel" ref={scrollContainerRef} onScroll={(element) => TrackScrolling(element, (activeTab) => setActiveTab(activeTab))} className="scroll-on-hover" style={{ "height": `calc(100% - ${tabsRef.current?.offsetHeight}px)`, "overflow-y": "auto" }}>
                                <div className='scrolling-tabs mh-unset' id="orderStatus" style={{ minHeight: "100%" }}>
                                    <div className="card border-0 mh-unset" style={{ minHeight: `calc(${scrollContainerRef?.current?.offsetHeight}px - 24px)` }}>
                                        <LabOrderTabs setReloadPage={props.setReloadPage} reloadPage={props.reloadPage} dataSet={props.dataSet} dataGrid={props.dataGrid} cancelItemselectedRows={cancelItemselectedRows} setCancelItemselectedRows={setCancelItemselectedRows} onSubmitClick={props.onSubmitClick} setDisableMode={props.setDisableMode} disableMode={props.disableMode} />
                                    </div>
                                </div>
                                <div className="scrolling-tabs p-12 mh-unset" id="communications" style={{ minHeight: "100%" }}>
                                    <div className="card mh-unset" style={{ minHeight: `calc(${scrollContainerRef?.current?.offsetHeight}px - 24px)` }}>
                                        <CommunicationDisplay containerHeight={scrollContainerRef?.current?.offsetHeight - 24} orderId={props.dataSet.orderId} displayOrderId={props.dataSet.displayOrderId} orderType={"L"} customerId={props.dataSet.customerId} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        </DataGridComponent>
        </DetailWrapper>

        </React.Fragment>
    )
}
export default LabOrderModal;
