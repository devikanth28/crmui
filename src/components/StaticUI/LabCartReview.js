import React, { useContext, useRef } from 'react'
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure'
import { CustomerContext, UserContext } from '../Contexts/UserContext';
import { Nav, NavItem, NavLink } from 'reactstrap';
import PatientCard from '../Checkout/ShoppingCart/PatientInfo/PatientCard';
import LabTests from './LabTests';
import DeliveryDetails from '../Checkout/Review/DeliveryDetails';
import { getCustomerRedirectionURL } from '../customer/CustomerHelper';

const LabCartReview=(props)=> {
    const headerRef = useRef(0);
    const userSessionInfo = useContext(UserContext);
    const footerRef = useRef(0);
    const  {customerId}  = useContext(CustomerContext);
  return (
    <React.Fragment>
        <Wrapper>
        <HeaderComponent className={"border-bottom"} ref={headerRef}>
          <div className="p-12">
            <p className='mb-0'>Lab Shopping Cart Review</p>
          </div>
        </HeaderComponent>
        <BodyComponent allRefs={{ headerRef, footerRef }} className={`body-height`} >
        <div className={`custom-tabs-forms h-100 h-unset mobile-compatible-tabs custom-tabs-forms-icon border rounded`}>
        <Nav tabs className="border-bottom">
        {userSessionInfo.vertical != "V" && <div className='nav nav-tabs'>
        <NavItem>
                <NavLink
                  className={` d-flex`} >
                  Patient Details
                  <span className={`tick-mark px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={` d-flex`} >
                  Test Details
                  <span className={`tick-mark px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={` d-flex`} >
                  Delivery Details
                  <span className={`tick-mark px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={` d-flex`}>
                  Time Slots
                  <span className={`tick-mark px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={` d-flex`}>
                  Delivery Type
                  <span className={`tick-mark px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={` d-flex`}>
                  Coupon
                  <span className={`tick-mark px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={` d-flex`}>
                  Payment
                  <span className={`tick-mark px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
              </div>}
              <NavItem>
                <NavLink
                  className={` active d-flex`}>
                  Review
                  <span className={`tick-mark checked px-1 ms-2`}></span>
                </NavLink>
              </NavItem>
            </Nav>
            <div id="TabContent" className="scroll-on-hover" style={{ 'height': `calc(100% - 41px)` }} >
                <div className='p-12'>
                <p className="custom-fieldset mb-2">Patient Details</p>
                <div className="row p-12 py-0">
					<div className="col-12 col-lg-4 px-0">
						<PatientCard patientInfo = {{patientName:"siddu",gender:"M",doctorName:"siddartha",patientId:"123",age:22}} isReviewPage />
					</div>
				</div>
                </div>
                <div className='p-12 pb-0'>
                <p className="custom-fieldset mb-2">Delivery Details</p>
                <DeliveryDetails  shipmentOmsAddress = {{firstName: "John",addressLine1: "123 Main Street",addressLine2: "Apt 4B",city: "Example City",state: "Example State",pinCode: "12345",shippingMobileNo: "555-555-5555"}}/>

                </div>
                <div className='p-12'>
                    <LabTests review="true"/>
                </div>
                <div className='p-12'>
                <label className="custom-fieldset mb-2">Collection Details</label>
                <div>
                  <p className='text-secondary font-14 mb-1'>Colection type</p>
                  <p className=''>Home Sample Collection</p>
                </div>
                <div>
                  <p className='mb-1 text-secondary font-14'>Scheduled Slot</p>
                  <p className='font-weight-bold'>February 29,2024 [10:00 AM - 11:00 AM]</p>
                </div>
                <p className='mb-1 text-secondary font-14'>Address</p>
                <p className='font-weight-bold mb-0'>PRAGATHI NAGAR LAB SAMPLE COLLECTION CENTRE [INTGHYD95146]</p>
                <p className='font-14 mb-2 text-secondary'>Plot No 1257, G-2, G-3, Sy. No 165, 166, 167, 178, 179, Pragathi Nagar, JNTU, KPHB, Balanagar Mandal, Rangareddy-Cir1 Dist, HYDERABAD, TELANGANA, 6300532055.</p>
                </div>
            </div>
            </div>
        </BodyComponent>
        <FooterComponent className="footer p-3" ref={footerRef}>
          <div className="d-flex align-items-center justify-content-end">
            <div>
            <button className="btn brand-secondary me-3 px-3" onClick={() => { props.history.push(getCustomerRedirectionURL(customerId, "labcart")) }}>Edit Shopping Cart</button>
            <button className="btn btn-brand px-3">Place the Order</button>
            </div>
          </div>
        </FooterComponent>
        </Wrapper>
    </React.Fragment>
  )
}

export default LabCartReview