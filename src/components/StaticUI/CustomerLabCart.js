import React, { useContext, useEffect, useRef, useState } from 'react'
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure'
import { Input, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { TrackScrolling } from '../order/PrepareOrderDetails';
import DynamicGridHeight from '../Common/DynamicGridHeight';
import CommonDataGrid, { DeleteIcon } from '@medplus/react-common-components/DataGrid';
import { CustomerContext } from '../Contexts/UserContext';
import PaymentForm from '../customer/MembershipAdvantage/orderReview/PaymentForm';
import PatientInfo from '../Checkout/ShoppingCart/PatientInfo';
import CatalogTimeSlotsMoule from './LabSchedule';
import NavTabs from '../Common/NavTabs';
import LabHomeDelivery from './LabHomeDelivery';
import { getCustomerRedirectionURL } from '../customer/CustomerHelper';
import LabOrderService from '../../services/LabOrder/LabOrderService';
import Validate from '../../helpers/Validate';

const CustomerLabCart = (props) => {

  const headerRef = useRef(0);
  const footerRef = useRef(0);
  const [activeTab, setActiveTab] = useState('PatientDetails');
  const [tabId, setTabId] = useState("1");
  let testSummaryRows = [{ "mrp": "Cart Total", "price": "1200.00" }, { "mrp": "Grand Total", "price": "1200.00" }];
  const tabs=["Home Delivery","Walkin Center "]
  const  {customerId}  = useContext(CustomerContext);
  const labOrderService = LabOrderService();
  const [testDataset, setTestDataSet] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [loader, setLoader] = useState(true);
  const validate = Validate();

  useEffect(() => {
    getCustomerLabShoppingCart();
  },[]);

  const getCustomerLabShoppingCart = () => {
    const config = { headers: { customerId: customerId }, params: { customerId: customerId } }
    labOrderService.getLabShoppingCart(config).then(response => {
      if(validate.isNotEmpty(response) && validate.isNotEmpty(response.statusCode) && response.statusCode == "SUCCESS") {
        if(validate.isNotEmpty(response.responseData) && validate.isNotEmpty(response.responseData.shoppingCart)) {
          setTestDataSet(response.responseData.shoppingCart?.labCollectionItems);
          setSelectedPatientId(response.responseData.shoppingCart?.patientInfo?.patientId);
        } else {
          setTestDataSet([]);
        }
      }
      setLoader(false);
    }).catch((e) => {
      console.log(e);
      setLoader(false)
    });
  }

  const helper = () => {

    const testMetaData = () => {
      let data = {
        "idProperty": "testDetails",
        "columns": [
          {
            "columnName": "Test Name",
            "rowDataKey": "testName",
            "resizable": true,
          },
          {
            "columnName": "Sample Type",
            "rowDataKey": "sampleType",
            "resizable": true,
            "defaultColumnValue": "-",
          },
          {
            "columnName": "Sample Transport Condition",
            "rowDataKey": "sampleTransportCondition",
            "resizable": true,
            "defaultColumnValue": "-",
          },
          {
            "columnName": "MRP",
            "rowDataKey": "mrp",
            "resizable": true,
            "cellClassName": "text-end",
            "columnSubtype": "AMOUNT",
            "columnType": "NUMBER",
            "bottomSummaryCellComponent": {
              type: "FUNCTION",
              returnType: "REACT_NODE",
              name: 'renderCartTotalColumns'
            },
            "isSummaryColumnRequired": true,
          },
          {
            "columnName": "Price",
            "rowDataKey": "price",
            "resizable": true,
            "cellClassName": "text-end",
            "columnSubtype": "AMOUNT",
            "columnType": "NUMBER",
            "isSummaryColumnRequired": true,
            "bottomSummaryCellComponent": {
              type: "FUNCTION",
              returnType: "REACT_NODE",
              name: 'renderGrandTotalColumns'
            },
          },
          {
            "columnName": "Actions",
            "rowDataKey": "actions",
            "resizable": true,
            "customRowRenderingFunction": {
              type: "FUNCTION",
              returnType: "REACT_NODE",
              name: 'renderTestActionsColumn'
            }
          },

        ]
      }
      return data;

    }

    const centersMetaData = () => {
      let centers = {
        "idProperty": "centers",
        "columns": [
          {
            "columnName": "Address",
            "rowDataKey": "centerAddress",
            "resizable": false,
          },
          {
            "columnName": "Action",
            "rowDataKey": "action",
            "resizable": true,
            "customRowRenderingFunction": {
              type: "FUNCTION",
              returnType: "REACT_NODE",
              name: 'renderCentersActionColumn'
            }
          },

        ]
      }
      return centers;
    }
    return Object.freeze({
      testMetaData,
      centersMetaData
    })
  }
  const metaData = helper().testMetaData();
  const centerMetadata = helper().centersMetaData();

  const centersData = [
    {
      "action": '',
      "centerAddress": "PRAGATHI NAGAR LAB SAMPLE COLLECTION CENTRE [INTGHYD95146] Plot No 1257, G-2, G-3, Sy. No 165, 166, 167, 178, 179, Pragathi Nagar, JNTU, KPHB, Balanagar Mandal, Rangareddy-Cir1 Dist ph. 6300532055"
    },
    {
      "action": '',
      "centerAddress": "PRAGATHI NAGAR LAB SAMPLE COLLECTION CENTRE [INTGHYD95146] Plot No 1257, G-2, G-3, Sy. No 165, 166, 167, 178, 179, Pragathi Nagar, JNTU, KPHB, Balanagar Mandal, Rangareddy-Cir1 Dist ph. 6300532055"
    }
  ]

  const callBackMapping = {
    'renderCentersActionColumn': renderCentersActionColumn,
    'renderTestActionsColumn': renderTestActionsColumn,
    'renderCartTotalColumns': renderCartTotalColumns,
    'renderGrandTotalColumns': renderGrandTotalColumns
  }

  function renderCentersActionColumn(props) {
    return <Input type="radio" className="" />

  }
  function renderTestActionsColumn(props) {
    return <React.Fragment>
      <DeleteIcon/>
    </React.Fragment>

  }
  function renderCartTotalColumns(props) {
    return <React.Fragment>
      <p className='text-end font-weight-bold'>{props.row[props.column.key]}</p>
    </React.Fragment>

  }
  function renderGrandTotalColumns(props) {
    return <React.Fragment>
      <p className='text-end font-weight-bold'><span className='rupee'>&#x20B9;</span>{props.row[props.column.key]}</p>
    </React.Fragment>

  }
  const jumpToTab = (tabId) => {
    document.getElementById(tabId).scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleTabId = (tabId) => {
    let numToString = tabId.toString();
    setTabId(numToString)
  }



  return (
    <React.Fragment>
      <Wrapper>
        <HeaderComponent className={"border-bottom"} ref={headerRef}>
          <div className="p-12">
            <p className='mb-0'>Lab Shopping Cart</p>
          </div>
        </HeaderComponent>
        <BodyComponent allRefs={{ headerRef, footerRef }} className={`body-height`}>
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
              <NavItem>
                <NavLink
                  className={`${activeTab == 'DeliveryDetails' ? 'active ' : ''} d-flex`} onClick={() => jumpToTab("DeliveryDetails")}>
                  Delivery Details
                  <span className={`${activeTab == 'DeliveryDetails' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={`${activeTab == 'timeSlots' ? 'active ' : ''} d-flex`} onClick={() => jumpToTab("timeSlots")}>
                  Time Slots
                  <span className={`${activeTab == 'timeSlots' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={`${activeTab == 'deliveryType' ? 'active ' : ''} d-flex`} onClick={() => jumpToTab("deliveryType")}>
                  Delivery Type
                  <span className={`${activeTab == 'deliveryType' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={`${activeTab == 'coupon' ? 'active ' : ''} d-flex`} onClick={() => jumpToTab("coupon")}>
                  Coupon
                  <span className={`${activeTab == 'coupon' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={`${activeTab == 'payment' ? 'active ' : ''} d-flex`} onClick={() => jumpToTab("payment")}>
                  Payment
                  <span className={`${activeTab == 'payment' ? 'tick-mark checked' : "tick-mark"} px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
            </Nav>
            <div id="TabContent" className="overflow-x-auto" style={{ 'height': `calc(100% - 41px)` }} onScroll={(element) => TrackScrolling(element, (activeTab) => setActiveTab(activeTab))}>
              <div id="PatientDetails" className="scrolling-tabs">
                {!loader && <PatientInfo selectedPatientId={selectedPatientId} isLabs/>}
              </div>
              <div id="TestDetails" className="scrolling-tabs p-12">
                <label class="d-block pb-0 font-weight-bold custom-fieldset mb-2">
                  Test Details
                </label>
                <div className='pb-0'>
                  <div className={` card me-0 `}>
                    <DynamicGridHeight id="tests" metaData={metaData} dataSet={[...testDataset]}>
                      <CommonDataGrid {...metaData} dataSet={[...testDataset]} bottomSummaryRows={testSummaryRows} callBackMap={callBackMapping} />
                    </DynamicGridHeight>
                  </div>
                </div>
              </div>

              <div id='DeliveryDetails' className='scrolling-tabs p-12'>
              <label class="d-block pb-0 font-weight-bold custom-fieldset mb-2">
              Delivery Details
                </label>
                <div className="custom-tabs-forms custom-tabs-forms-icon border rounded mobile-compatible-tabs">
                  <NavTabs tabs={tabs} onTabChange={handleTabId} />
                  <TabContent activeTab={tabId} className="tab-content-height overflow-y-auto scroll-on-hover">
                    <TabPane tabId="1">
                      <div className="p-12 col-12 col-lg-9">
                         <LabHomeDelivery/>
                      </div>
                    </TabPane>
                    <TabPane tabId="2">
                      <div className='p-12'>
                        <p>All Tests Available Centers</p>
                        <div className={` card me-0 `}>
                          <DynamicGridHeight id="centers" metaData={centerMetadata} dataSet={[...centersData]}>
                            <CommonDataGrid {...centerMetadata} dataSet={[...centersData]} callBackMap={callBackMapping} />
                          </DynamicGridHeight>
                        </div>

                      </div>
                    </TabPane>
                  </TabContent>
                </div>
              </div>

              <div id='timeSlots' className='scrolling-tabs p-12'>
                <label className='d-block pb-0 font-weight-bold custom-fieldset mb-2'>Select Walk-In Time Slot</label>
                <div className='card'>
                  <CatalogTimeSlotsMoule />
                </div>
              </div>

              <div id='deliveryType' className='scrolling-tabs p-12'>
                <label className='d-block pb-0 font-weight-bold custom-fieldset mb-2'>Select Report Delivery Type</label>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="delivery" id="delivery" value="option1" />
                  <label class="form-check-label" for="delivery">Home Delivery</label>
                </div>

              </div>

              <div id='coupon' className='scrolling-tabs p-12'>
                <label className='d-block pb-0 font-weight-bold custom-fieldset mb-2'> Apply Coupon Code</label>
                <div className="row">
                  <div className="col-12 col-lg-4">
                    <div class="form-floating">
                      <input type="email" class="form-control" id="CouponCode" placeholder="" />
                      <label for="CouponCode">Enter Coupon</label>
                    </div>
                  </div>
                  <div className='col-12 mt-2 col-lg-2 mt-lg-0'>
                    <button className="btn brand-secondary btn-sm py-2 " style={{ height: "50px" }}>Apply Coupon</button>
                  </div>
                  <div>
                  </div>

                </div>
              </div>

              <div id='payment' className='scrolling-tabs p-12' style={{ minHeight: "100%" }}>
                <PaymentForm />
              </div>

            </div>

          </div>
        </BodyComponent>

        <FooterComponent className="footer p-3" ref={footerRef}>
          <div className="d-flex align-items-center justify-content-end">
            <button className="btn brand-secondary me-3 px-3">Continue Shopping</button>
            <button className="btn btn-brand px-3" onClick={()=>{props.history.push(getCustomerRedirectionURL(customerId, "labcart/review"))}} >Review &amp; Place the Order</button>

          </div>
        </FooterComponent>
      </Wrapper>
    </React.Fragment>
  )
}

export default CustomerLabCart