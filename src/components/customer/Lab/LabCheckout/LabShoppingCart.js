import React, { useContext, useEffect, useRef, useState } from 'react'
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../../../Common/CommonStructure'
import { Nav, NavItem, NavLink } from 'reactstrap';
import { ALERT_TYPE, CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import { TrackScrolling } from '../../../order/PrepareOrderDetails';
import { AlertContext, CustomerContext, LocalityContext, ShoppingCartContext } from '../../../Contexts/UserContext';
import PatientInfo from '../../../Checkout/ShoppingCart/PatientInfo';
import { getCustomerRedirectionURL } from '../../CustomerHelper';
import LabOrderService from '../../../../services/LabOrder/LabOrderService';
import Validate from '../../../../helpers/Validate';
import LabSampleCollection from './LabSampleCollection';
import { Roles } from '../../../../constants/RoleConstants';
import useRole from '../../../../hooks/useRole';
import { CollectionType, LAB_ORDER } from '../../Constants/CustomerConstants';
import { isResponseSuccess } from '../../../../helpers/CommonHelper';
import LabTestGrid from './LabTestGrid';
import CurrencyFormatter from '../../../Common/CurrencyFormatter';
import { prepareRequestFrom } from '../../../../helpers/HelperMethods';

const LabShoppingCart = (props) => {

  const headerRef = useRef(0);
  const footerRef = useRef(0);

  const validate = Validate();
  const labOrderService = LabOrderService();
  const { setToastContent, setStackedToastContent } = useContext(AlertContext);
  const isAgentReferenceOrder = validate.isNotEmpty(props?.match?.params?.labOrderId) ? true : false;
  const { customerId } = useContext(CustomerContext);
  const { labLocality, setIsLocalityComponentNeeded } = useContext(LocalityContext);
  const { labShoppingCart, setLabShoppingCart } = useContext(ShoppingCartContext);
  const [isPathlabAgent, isFrontOfficeOrderCreate] = useRole([Roles.ROLE_CRM_PHLEBOTOMIST_PATHLAB_AGENT, Roles.ROLE_CRM_LAB_FRONT_OFFICE_ORDER_CREATE]);
  const [activeTab, setActiveTab] = useState('PatientDetails');
  const [testSummaryRows, setTestSummaryRows] = useState(undefined);
  const [testDataset, setTestDataSet] = useState(undefined);
  const [collectionType, setCollectionType] = useState(CollectionType.BOTH);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [initialLoader, setInitialLoader] = useState(true);
  const [showTimeSlotsNav, setShowTimeSlotsNav] = useState(false);
  const [showreportDeliveryNav, setShowReportDeliveryNav] = useState(false);
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(undefined);
  const [cartSummary, setCartSummary] = useState(undefined);
  const [isValidPatient, setIsValidPatient] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [customerAddressFormData, setCustomerAddressFormData] = useState({});
  const [reportDeliveryType, setReportDeliveryType] = useState('E');
  const [selectedSlotInfo, setSelectedSlotInfo] = useState({});
  const [isGenderRestricted, setIsGenderRestricted] = useState(undefined);
  const [isDuplicateItem, setIsDuplicateItem] = useState(undefined);
  const [isProfile, setIsProfile] = useState(undefined);
  const [visitType, setVisitType] = useState();

  useEffect(() => {
    setIsLocalityComponentNeeded(false);
    getCustomerLabShoppingCart();
  }, [labLocality]);

  useEffect(() => {
    if (isAgentReferenceOrder && isValidPatient) {
      addSampleCollectionWithReferenceOrder(props?.match?.params?.labOrderId);
    }
  }, [isValidPatient])

  const getCustomerLabShoppingCart = () => {
    const requestFrom = prepareRequestFrom(isPathlabAgent, isFrontOfficeOrderCreate);
    const config = { headers: { customerId: customerId }, params: { customerId: customerId, requestFrom: requestFrom } }
    setInitialLoader(true);
    labOrderService.getLabShoppingCart(config).then(response => {
      if (isResponseSuccess(response) && validate.isNotEmpty(response.responseData) && validate.isNotEmpty(response.responseData.shoppingCart)) {
        populateShoppingCartData(response.responseData);
      } else {
        setStackedToastContent({ toastMessage: response?.message ? response.message : "something went wrong" });
        if (props.history) {
          setTimeout(() => {
            props.history.push(getCustomerRedirectionURL(customerId, LAB_ORDER))
          }, 3000);
        }
      }
      setInitialLoader(false);
    }).catch((e) => {
      console.log(e);
      setStackedToastContent({ toastMessage: "something went wrong" });
      setInitialLoader(false);
    });
  }

  const addSampleCollectionWithReferenceOrder = (labOrderId) => {
    const config = { headers: { customerId: customerId }, params: { customerId: customerId, referenceOrderId: labOrderId } }
    labOrderService.addSampleCollectionWithReferenceOrder(config).then((response) => {
      if (!isResponseSuccess(response)) {
        setStackedToastContent({ toastMessage: "Unable to add sample collection with reference order" });
      }
    }).catch((e) => {
      console.log(e);
      setStackedToastContent({ toastMessage: "something went wrong" });
    });
  }

  const populateShoppingCartData = (responseData) => {
    setLabShoppingCart(responseData.shoppingCart);
    setSelectedPatientInfo(responseData.shoppingCart.patientInfo);
    setTestDataSet(responseData.shoppingCart.shoppingCartItems);
    displayDeliveryDetails(responseData.shoppingCart);
    prepareTestSummaryRows(responseData.cartSummary);
    setCustomerAddressFormData(responseData.shoppingCart.reportDeliveryInfo?.reportDeliveryAddress);
    setReportDeliveryType(responseData.shoppingCart.reportDeliveryInfo?.reportDeliveryType === "EMAIL" ? 'E' : 'H');
    setIsGenderRestricted(responseData.shoppingCart.shoppingCartItems.some(eachTest => eachTest.genderRestricted));
    setIsDuplicateItem(responseData.shoppingCart.shoppingCartItems.some(eachTest => eachTest.duplicateItem));
    setIsProfile(responseData.shoppingCart.shoppingCartItems.some(eachTest => eachTest.profile));
  }

  const prepareTestSummaryRows = (cartSummary) => {
    let obj = [
      { "mrp": "Cart Total", "price": <CurrencyFormatter data={cartSummary.totalPrice} decimalPlaces={2} /> },
      ...(validate.isNotEmpty(cartSummary.totalDiscount) && cartSummary.totalDiscount > 0 ? [{ "mrp": "Discount Amount", "price": <CurrencyFormatter data={cartSummary.totalDiscount} decimalPlaces={2} /> }] : []),
      ...(validate.isNotEmpty(cartSummary.collectionCharges) && cartSummary.collectionCharges > 0 ? [{ "mrp": "Sample Collection Charges", "price": <CurrencyFormatter data={cartSummary.collectionCharges} decimalPlaces={2} /> }] : []),
      ...(validate.isNotEmpty(cartSummary.reportDeliveryCharges) && cartSummary.reportDeliveryCharges > 0 ? [{ "mrp": "Report Delivery Charges", "price": <CurrencyFormatter data={cartSummary.reportDeliveryCharges} decimalPlaces={2} /> }] : []),
      ...(cartSummary.applyMdxPointsPayment && validate.isNotEmpty(cartSummary.applicableMdxPoints) > 0 ? [{ "mrp": `Applied MDx Points Value`, "price": <div><CurrencyFormatter data={cartSummary.applicableMdxPointsWorth} decimalPlaces={2} /> ({cartSummary.applicableMdxPoints} pts)</div> }] : []),
      { "mrp": "Grand Total", "price": <CurrencyFormatter data={cartSummary.totalAmount} decimalPlaces={2} /> }
    ];

    setCartSummary(cartSummary);
    setTestSummaryRows(obj);
  }

  const displayDeliveryDetails = (shoppingCart) => {
    let type = "";
    if (shoppingCart.homeSampleCollectionAllowed == 'FULLY_ALLOWED') {
      if (isPathlabAgent) {
        type = CollectionType.HOME_COLLECTION;
      } else {
        type = CollectionType.BOTH;
      }
    } else if (shoppingCart.homeSampleCollectionAllowed == 'PARTIALLY_ALLOWED' || shoppingCart.homeSampleCollectionAllowed == 'NOT_ALLOWED') {
      type = CollectionType.WALK_IN;
    }

    if (isFrontOfficeOrderCreate) {
      type = CollectionType.WALK_IN;
    }
    setCollectionType(type);
  }
  

  const jumpToTab = (tabId) => {
    document.getElementById(tabId).scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const redirectToReviewPage = () => {
    if(isGenderRestricted) {
      setStackedToastContent({ toastMessage: "Gender Restricted. Please Remove test or change patient to specific gender."});
      return;
    }
    if(isDuplicateItem) {
      setStackedToastContent({ toastMessage: "This test is already a part of a package/s in this cart. Kindly remove to proceed."});
      return;
    }
    if (validate.isEmpty(selectedPatientInfo) || validate.isEmpty(selectedPatientInfo.patientId)) {
      setStackedToastContent({ toastMessage: "Patient selection is mandatory."});
      return;
    }
    if (visitType == 1) {
      if (validate.isEmpty(customerAddressFormData)) {
        setStackedToastContent({ toastMessage: "Address details are mandatory"});
        return;
      }
    } else if (visitType == 2) {
      if (validate.isEmpty(selectedStoreId)) {
        setStackedToastContent({ toastMessage: "Please Select the Store"});
        return;
      }
    }
    if (validate.isEmpty(selectedSlotInfo)) {
      setStackedToastContent({ toastMessage: "Please select time slot"});
      return;
    }
    props.history.push(getCustomerRedirectionURL(customerId, LAB_ORDER + "/review"));
  }

  const calculateTotalDiscount = () => {
    let totalDiscount = 0;
    if (cartSummary.totalDiscount > 0) {
      totalDiscount += cartSummary.totalDiscount;
    }
    if (cartSummary.applicableMdxPointsWorth > 0) {
      totalDiscount += cartSummary.applicableMdxPointsWorth;
    }
    return totalDiscount;
  }

  return (
    <React.Fragment>
      <Wrapper>
        <HeaderComponent className={"border-bottom"} ref={headerRef}>
          <div className="p-12">
            <p className='mb-0'>Lab Shopping Cart</p>
          </div>
        </HeaderComponent>
        {initialLoader ? <div className="d-flex justify-content-center align-items-center h-100 p-4">
          <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText={"Please be patient while we prepare your data for loading!"} />
        </div> : (validate.isNotEmpty(labShoppingCart) && validate.isNotEmpty(testDataset)) &&
        <>
          <BodyComponent allRefs={{ headerRef, footerRef }} className={`body-height`} >
            <div className={`custom-tabs-forms mobile-compatible-tabs  h-100 h-unset custom-tabs-forms-icon border rounded-0`}>
              <Nav tabs className="border-bottom">
                <NavItem>
                  <NavLink
                    className={`${activeTab == 'PatientDetails' ? 'active ' : ''} d-flex`} onClick={() => jumpToTab("PatientDetails")}>
                    Patient Details
                    <span className={`${activeTab == 'PatientDetails' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={`${activeTab == 'TestDetails' ? 'active ' : ''} d-flex`} onClick={() => jumpToTab("TestDetails")}>
                    Test Details
                    <span className={`${activeTab == 'TestDetails' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                  </NavLink>
                </NavItem>
                {isValidPatient && <NavItem>
                  <NavLink
                    className={`${activeTab == 'DeliveryDetails' ? 'active ' : ''} d-flex`} onClick={() => jumpToTab("DeliveryDetails")}>
                    Delivery Details
                    <span className={`${activeTab == 'DeliveryDetails' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                  </NavLink>
                </NavItem>}
                {showTimeSlotsNav && <NavItem>
                  <NavLink
                    className={`${activeTab == 'timeSlots' ? 'active ' : ''} d-flex`} onClick={() => jumpToTab("timeSlots")}>
                    Time Slots
                    <span className={`${activeTab == 'timeSlots' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                  </NavLink>
                </NavItem>}
                {showreportDeliveryNav && <NavItem>
                  <NavLink
                    className={`${activeTab == 'deliveryType' ? 'active ' : ''} d-flex`} onClick={() => jumpToTab("deliveryType")}>
                    Delivery Type
                    <span className={`${activeTab == 'deliveryType' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                  </NavLink>
                </NavItem>}
              </Nav>
              <div id="TabContent" className="overflow-x-auto tab-content-height" style={{ 'height': `calc(100% - 41px)` }} onScroll={(element) => TrackScrolling(element, (activeTab) => setActiveTab(activeTab))}>
                <div id="PatientDetails" className="scrolling-tabs">
                  <PatientInfo setIsValidPatient={setIsValidPatient} populateShoppingCartData={populateShoppingCartData} selectedPatientId={selectedPatientInfo?.patientId} isLabs />
                </div>
                {testDataset && <LabTestGrid showTypeColumn={isGenderRestricted || isDuplicateItem || isProfile} testDataset={testDataset} testSummaryRows={testSummaryRows} addToCartLoading={addToCartLoading} setAddToCartLoading={setAddToCartLoading} setTestDataSet={setTestDataSet} getCustomerLabShoppingCart={getCustomerLabShoppingCart} history={props.history} />}
                {isValidPatient && <LabSampleCollection selectedPatientId={selectedPatientInfo?.patientId} setVisitType={setVisitType} jumpToTab={jumpToTab} testSummaryRows={testSummaryRows} prepareTestSummaryRows={prepareTestSummaryRows} collectionType={collectionType} showTimeSlotsNav={showTimeSlotsNav} setShowTimeSlotsNav={setShowTimeSlotsNav} showreportDeliveryNav={showreportDeliveryNav} setShowReportDeliveryNav={setShowReportDeliveryNav} testDataset={testDataset} isAgentReferenceOrder={isAgentReferenceOrder} reportDeliveryType={reportDeliveryType} setReportDeliveryType={setReportDeliveryType} customerAddressFormData={customerAddressFormData} setCustomerAddressFormData={setCustomerAddressFormData} selectedStoreId={selectedStoreId} setSelectedStoreId={setSelectedStoreId} selectedSlotInfo={selectedSlotInfo} setSelectedSlotInfo={setSelectedSlotInfo} />}
              </div>
            </div>
          </BodyComponent>
          <FooterComponent className="footer" ref={footerRef}>
            <div class="p-12 d-flex justify-content-end font-14 align-items-center" bis_skin_checked="1">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex flex-column flex-lg-row justify-content-end align-itens-stretch align-items-lg-center">
                {(cartSummary.totalDiscount > 0 || (cartSummary.applyMdxPointsPayment && cartSummary.applicableMdxPoints > 0)) && <> <div className="d-flex justify-content-between justify-content-lg-end flex-lg-row">
                  <p class="text-secondary text-end mb-0 align-self-lg-center  font-normal">Total Discount: </p>
                  <p class="font-weight-bold text-end mb-0 ms-2"><CurrencyFormatter data={calculateTotalDiscount()} decimalPlaces={2} /></p>
                </div>
                  <span class="mx-3 text-secondary hide-on-mobile">|</span> </>}
                {cartSummary.totalAmount >= 0 && <div className="d-flex justify-content-between justify-content-lg-end flex-lg-row">
                  <p class="text-secondary text-end mb-0 align-self-lg-center  font-normal">Grand Total: </p>
                  <p class="font-weight-bold text-end ms-2 mb-0"><CurrencyFormatter data={cartSummary.totalAmount} decimalPlaces={2} /></p>
                </div>}
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end border-top p-12">
              <button className="btn brand-secondary me-3 px-3" onClick={() => { props.history.push(getCustomerRedirectionURL(customerId, LAB_ORDER)) }} >Continue Shopping</button>
              <button className="btn btn-brand px-3" disabled={isGenderRestricted || isDuplicateItem} onClick={() => redirectToReviewPage()} >Review &amp; Place the Order</button>
            </div>
          </FooterComponent>
        </>}
      </Wrapper>
    </React.Fragment>
  )
}

export default LabShoppingCart