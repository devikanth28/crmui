import React, { useContext, useEffect, useState } from "react";
import NavTabs from "../../../Common/NavTabs";
import { TabContent, TabPane } from "reactstrap";
import LabOrderService from "../../../../services/LabOrder/LabOrderService";
import Validate from "../../../../helpers/Validate";
import { AlertContext, CustomerContext } from "../../../Contexts/UserContext";
import { isResponseSuccess } from "../../../../helpers/CommonHelper";
import LabOrderTimeSlots from "./LabOrderTimeSlots";
import { CollectionType } from "../../Constants/CustomerConstants";
import LabReportDelivery from "./LabReportDelivery";
import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import { prepareRequestFrom } from "../../../../helpers/HelperMethods";
import useRole from "../../../../hooks/useRole";
import { Roles } from "../../../../constants/RoleConstants";
import StoreDetails from "../../../Common/StoreDetails";
import LabHomeDelivery from "./LabHomeDelivery";

const LabSampleCollection = (props) => {

    const labOrderService = LabOrderService();
    const validate = Validate();
    const { customerId } = useContext(CustomerContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const [isPathlabAgent, isFrontOfficeOrderCreate] = useRole([Roles.ROLE_CRM_PHLEBOTOMIST_PATHLAB_AGENT, Roles.ROLE_CRM_LAB_FRONT_OFFICE_ORDER_CREATE]);
    const [fullTestAvailableCenters, setFullTestAvailableCenters] = useState([]);
    const [partialTestAvailableCenters, setPartialTestAvailableCenters] = useState([]);
    const [centersLoader, setCentersLoader] = useState(true);
    const [tabId, setTabId] = useState(props.collectionType === CollectionType.WALK_IN ? 2 : 1);
    
    var tabsList = [];
    if (props.collectionType === CollectionType.HOME_COLLECTION) {
        tabsList.push("Home Delivery");
    } else if (props.collectionType === CollectionType.WALK_IN) {
        tabsList.push("Walkin Center");
    } else {
        tabsList.push("Home Delivery");
        tabsList.push("Walkin Center");
    }
    
    useEffect(() => {
        resetStates();
        if (prepareVisitType(tabId, props.collectionType) == 1 ) {
            getCustomerHomeAddresses();
            validateCustomerAddressFormData();
        } else {
            getCollectionCenters();
        }
    }, [tabId, props.selectedPatientId]);

    const prepareVisitType = (tabId, type) => {
        let visitType = type === CollectionType.BOTH ? (tabId == 1 ? 1 : 2) : (type === CollectionType.WALK_IN ? 2 : 1);
        props.setVisitType(visitType);
        return visitType;
    }

    const getCustomerHomeAddresses = () => {
        const config = { headers: { customerId: customerId }, params: { customerId: customerId } }
        labOrderService.getCustomerHomeAddresses(config).then((response) => {
            if (isResponseSuccess(response)) {
                console.log(response.responseData);
            } else {
                setStackedToastContent({ toastMessage: response?.message ? response.message : "something went wrong" });
            }
        }).catch((error) => {
            console.log(error);
            setStackedToastContent({ toastMessage: "Unable to get addresses!" });
        });
    }

    const getCollectionCenters = () => {
        setCentersLoader(true);
        const requestFrom = prepareRequestFrom(isPathlabAgent, isFrontOfficeOrderCreate);
        const config = { headers: { customerId: customerId }, params: { customerId: customerId, requestFrom: requestFrom } }
        labOrderService.getCollectionCenters(config).then((response) => {
            if (isResponseSuccess(response) && validate.isNotEmpty(response.responseData)) {
                setFullTestAvailableCenters(response.responseData.pathLabStoreInfo)
                setPartialTestAvailableCenters(response.responseData.partialPathLabStoresInfo);
            } else {
                setStackedToastContent({ toastMessage: response?.message ? response.message : "something went wrong" });
            }
            setCentersLoader(false);
        }).catch((error) => {
            console.log(error);
            setStackedToastContent({ toastMessage: "Unable to get collection centers!" });
            setCentersLoader(false);
        });
    }

    const addDeliveryLocationToCart = (storeId, deliveryDetails) => {
        props.setShowTimeSlotsNav(false);
        const config = { headers: { customerId: customerId }, params: { customerId: customerId, homeOrLab: prepareVisitType(tabId, props.collectionType), selectedCollectionCenterId: storeId, firstName: deliveryDetails?.firstName, addressLine1: deliveryDetails?.addressLine1, mobileNo: deliveryDetails?.mobileNo } }
        labOrderService.addDeliveryLocationToCart(config).then((response) => {
            if (isResponseSuccess(response)) {
                props.setSelectedStoreId(storeId);
                props.setShowTimeSlotsNav(true);
            } else {
                setStackedToastContent({ toastMessage: response?.message ? response.message : "something went wrong" });
                props.setShowTimeSlotsNav(false);
            }
        }).catch((error) => {
            console.log(error);
            props.setShowTimeSlotsNav(false);
            setStackedToastContent({ toastMessage: "Unable to add delivery address to cart!" });
        });
    }

    const addReportDeliveryAddress = (deliveryType, deliveryDetails) => {
        if (validate.isEmpty(deliveryDetails) && deliveryType == 'H') {
            return;
        }
        const config = {
            headers: { customerId: customerId }, params: {
                customerId: customerId, reportDeliveryType: deliveryType,
                reportAddress: deliveryDetails && { firstName: deliveryDetails.firstName, addressLine1: deliveryDetails.addressLine1, addressLine2: deliveryDetails.addressLine2, city: deliveryDetails.city, state: deliveryDetails.state, pincode: deliveryDetails.pincode, mobileNo: deliveryDetails?.mobileNo }
            }
        }
        labOrderService.addReportDeliveryInfo(config).then((response) => {
            if (isResponseSuccess(response)) {
                props.prepareTestSummaryRows(response.responseData.cartSummary);
                getLabReviewCart(false);
            } else {
                setStackedToastContent({ toastMessage: response?.message ? response.message : "something went wrong" });
            }
        }).catch((error) => {
            console.log(error);
            setStackedToastContent({ toastMessage: "Unable to add report delivery to cart!" });
        });
    }

    const getLabReviewCart = (mdxFlag) => {
        const config = { headers: { customerId: customerId }, params: { customerId: customerId, applyMdxPointsPayment: mdxFlag } }
        labOrderService.getLabReviewCart(config).then((response) => {
            if (isResponseSuccess(response) && validate.isNotEmpty(response.responseData)) {
                props.prepareTestSummaryRows(response.responseData.cartSummary);
            }
        }).catch((e) => {
            console.log(e);
            setStackedToastContent({ toastMessage: response?.message ? response.message : "something went wrong" });
        });
    }

    const validateCustomerAddressFormData = () => {
        if (validate.isEmpty(props.customerAddressFormData) || validate.isEmpty(props.customerAddressFormData.firstName) || validate.isEmpty(props.customerAddressFormData.addressLine1) || validate.isEmpty(props.customerAddressFormData.mobileNo)) {
            props.setShowTimeSlotsNav(false);
            return;
        }
        addDeliveryLocationToCart(undefined, props.customerAddressFormData);
    }

    const handleTabId = (tabId) => {
        setTabId(tabId);
        resetStates();
    }

    const resetStates = () => {
        props.setShowTimeSlotsNav(false);
        props.setShowReportDeliveryNav(false);
        props.setReportDeliveryType('E');
        props.setSelectedStoreId('');
    }

    return (
        <>
            {props.collectionType && <div id='DeliveryDetails' className='scrolling-tabs p-12'>
                <label class="d-block pb-0 font-weight-bold custom-fieldset mb-2">
                    Delivery Details
                </label>
                <div className="custom-tabs-forms custom-tabs-forms-icon border rounded mobile-compatible-tabs">
                    <NavTabs tabs={tabsList} onTabChange={handleTabId} />
                    <TabContent activeTab={tabId} className="tab-content-height overflow-y-auto scroll-on-hover">
                        {((props.collectionType == CollectionType.HOME_COLLECTION || props.collectionType == CollectionType.BOTH)) && <TabPane tabId={1}>
                            <div className="p-12 col-12 col-lg-9">
                                <LabHomeDelivery setShowTimeSlotsNav={props.setShowTimeSlotsNav} customerAddressFormData={props.customerAddressFormData} handleCallBack={addDeliveryLocationToCart} setCustomerAddressFormData={props.setCustomerAddressFormData} reportDeliveryType={props.reportDeliveryType} addReportDeliveryAddress={addReportDeliveryAddress} tabId={prepareVisitType(tabId, props.collectionType)} />
                            </div>
                        </TabPane>}
                        {(props.collectionType == CollectionType.WALK_IN || props.collectionType == CollectionType.BOTH) &&
                            <TabPane tabId={tabsList.length > 1 ? 2 : 1}>
                                {centersLoader ? <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
                                    <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner"} animation="border" variant="brand" spinnerText={"Loading collection centers."} />
                                </div> :
                                    <div className='p-12'>
                                        <p className="custom-fieldset mb-2">All Tests Available Centers</p>
                                        {validate.isNotEmpty(fullTestAvailableCenters) ?
                                            <StoreDetails stores={fullTestAvailableCenters} handleStores={addDeliveryLocationToCart} selectedStoreId={props.selectedStoreId} tabId={tabId} />
                                            :
                                            <div className={` card me-0 d-flex justify-content-center`} style={{ "minHeight": "10rem" }}>
                                                <div className="bg-info-light card p-12 text-center">
                                                    <p className="mb-0">
                                                        Nearby Available Walk-In Collection Centers are not available for this locality
                                                    </p>
                                                </div>
                                            </div>}
                                        <p className="mt-3 mb-2 custom-fieldset">Partial Tests Available Centers</p>
                                        {
                                            validate.isNotEmpty(partialTestAvailableCenters) ?
                                                <StoreDetails stores={partialTestAvailableCenters} handleStores={addDeliveryLocationToCart} selectedStoreId={props.selectedStoreId} tabId={tabId} />
                                                :
                                                <div className={` card me-0 d-flex justify-content-center`} style={{ "minHeight": "10rem" }}>
                                                    <div className="bg-info-light card p-12 text-center m-3">
                                                        <p className="mb-0">Nearby Partial Tests Available Walk-In Collection Centers are not available for this locality.</p>
                                                    </div>
                                                </div>
                                        }
                                    </div>}
                            </TabPane>}
                    </TabContent>
                </div>
            </div>}
            {props.showTimeSlotsNav && <LabOrderTimeSlots jumpToTab={props.jumpToTab} selectedSlotInfo={props.selectedSlotInfo} setSelectedSlotInfo={props.setSelectedSlotInfo} visitType={prepareVisitType(tabId, props.collectionType)} collectionType={props.collectionType} isAgentReferenceOrder={props.isAgentReferenceOrder} setShowReportDeliveryNav={props.setShowReportDeliveryNav} />}
            {props.showreportDeliveryNav && <LabReportDelivery jumpToTab={props.jumpToTab} customerAddressFormData={props.customerAddressFormData} setCustomerAddressFormData={props.setCustomerAddressFormData} addReportDeliveryAddress={addReportDeliveryAddress} tabId={prepareVisitType(tabId, props.collectionType)} reportDeliveryType={props.reportDeliveryType} setReportDeliveryType={props.setReportDeliveryType} />}
        </>
    )
}

export default LabSampleCollection;