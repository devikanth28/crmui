import React, { useRef ,useState,useEffect} from "react";
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import { Input, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import CatalogPatientCard from "./CatalogPatientCard";
import CatalogSelectPrescription from "./CatalogSelectPrestion";
import SelectDelivery from "./SelectDelivery";
import { TrackScrolling } from "../order/PrepareOrderDetails";
import CatalogProductsgrid from "./CatalogProductsgrid";
import CartComplimentaryGrid from "./CartComplimentaryGrid";
import AddNewPatientModel from "./AddNewPatientModel";
import CatalogDeliveryDetails from "./CatalogDeliveryDetails";

const CatalogCheckout = () => {
    const headerRef = useRef(0);
    const footerRef = useRef(0)

    const [activeTab , setActiveTab] = useState('ShoppingCart')
    const [openAddPatientflag,setOpenAddPatientflag]=useState(false);
    const [showReviewpage, setShowReviewpage] = useState(false);
    const [editReviewpage, setEditReviewpage] = useState(false);

    useEffect(() => {
        if(showReviewpage){
            window.location.href = "#ReviewandProceed";
            setActiveTab("ReviewandProceed");
        }
        else if(editReviewpage){
            setActiveTab("ShoppingCart");
        }
    }, [showReviewpage, editReviewpage]);

    return (
        <React.Fragment>
            <Wrapper>
                <HeaderComponent className={"border-bottom"} ref={headerRef}>
                    <div className="d-flex align-items-center justify-content-between p-12">
                        <p className="mb-0">Search Catalogue</p>
                        <button type="button" className="btn btn-sm link-success btn-link border-0">
                            <svg className="align-text-top me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <g id="Group_28287" data-name="Group 28287" transform="translate(-1135.314)">
                                    <path id="Path_47170" data-name="Path 47170" d="M38,30a8,8,0,1,0,8,8A8.007,8.007,0,0,0,38,30Zm0,14.905A6.905,6.905,0,1,1,44.905,38,6.915,6.915,0,0,1,38,44.905Z" transform="translate(1105.314 -30)" fill="#11b094" />
                                    <path id="Path_47171" data-name="Path 47171" d="M5.975.164a.539.539,0,0,0-.775,0L3.078,2.286.939.164a.539.539,0,0,0-.775,0,.539.539,0,0,0,0,.775L2.3,3.061.181,5.2a.539.539,0,0,0,0,.775.562.562,0,0,0,.387.152.562.562,0,0,0,.387-.152L3.078,3.836,5.217,5.975a.571.571,0,0,0,.775,0,.539.539,0,0,0,0-.775L3.853,3.061,5.992.922A.534.534,0,0,0,5.975.164Z" transform="translate(1143.302 3.66) rotate(45)" fill="#11b094" />
                                </g>
                            </svg>
                            Add My Online Cart
                        </button>
                    </div>
                </HeaderComponent>
                <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height">
                    <div className="custom-tabs-forms h-100 custom-tabs-forms-icon border rounded">
                        <Nav tabs className="border-bottom">
                            <NavItem>
                                <NavLink
                                    className={`${activeTab  == 'ShoppingCart' ? 'active rounded-top': 'rounded-top'} d-flex` }>
                                    Shopping Cart
                                    <span className={`${activeTab  == 'ShoppingCart' ? 'tick-mark checked': "tick-mark"} px-1 ms-2`}></span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={`${activeTab == 'SelectPrescription' ? "active" : ''} d-flex` }>
                                    Select Prescription
                                    <span className={`${activeTab  == 'SelectPrescription' ? 'tick-mark checked': "tick-mark"} px-1 ms-2`}></span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={`${activeTab == 'DeliveryDetails' ? "active" : ''} d-flex` }>
                                    Delivery Details
                                    <span className={`${activeTab  == 'DeliveryDetails' ? 'tick-mark checked': "tick-mark"} px-1 ms-2`}></span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={`${activeTab == 'Payments' ? "active" : ''} d-flex` }>
                                    Payments
                                    <span className={`${activeTab  == 'Payments' ? 'tick-mark checked': "tick-mark"} px-1 ms-2`}></span>
                                </NavLink>
                            </NavItem>
                            {<NavItem>
                                <NavLink className={`${activeTab == 'ReviewandProceed' ? "active" : ''} d-flex` }>
                                    Review & Promotions
                                    <span className={`${activeTab  == 'ReviewandProceed' ? 'tick-mark checked': "tick-mark"} px-1 ms-2`}></span>
                                </NavLink>
                            </NavItem>}
                        </Nav>
                       <div id="TabContent" className="scroll-on-hover" style={{'height':`calc(100% - 41px)`}} onScroll={(element) => TrackScrolling(element, (activeTab) => setActiveTab(activeTab))}>
                            {!showReviewpage &&<div>
                                <div id="ShoppingCart" className="scrolling-tabs p-12">
                                <div className="mb-4">
                                    <p className="custom-fieldset mb-2">Choose a Delivery Speed</p>
                                    <div className="row g-0">
                                        <div className="col-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="deliverySpeed" id="multipleDelivery" value="multiple" />
                                                <label className="form-check-label" for="multipleDelivery">Multiple Shipments</label>
                                            </div>
                                            <p className="mb-0 ps-4 font-12 text-secondary mt-2">3 item(s) will be Delivery by Jan 24, 2024. Remaining products will be Delivery by Jan 25, 2024.</p>
                                        </div>
                                        <div className="col-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="deliverySpeed" id="singleDelivery" value="single" />
                                                <label className="form-check-label" for="singleDelivery">Single Shipment</label>
                                            </div>
                                            <p className="mb-0 ps-4 font-12 text-secondary mt-2">Get all your products -- Delivery by Jan 25, 2024</p>

                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="custom-fieldset mb-2">Select Patient</p>
                                    <div className="border p-12 rounded">
                                        <div className="d-flex gap-3 flex-wrap">
                                            {[0, 1, 2, 3, 4].map((key) => {
                                                return <CatalogPatientCard />
                                            })}

                                        </div>
                                        <div className="mt-3">
                                            <button type="button" class="btn btn-sm brand-secondary" onClick={()=>{setOpenAddPatientflag(!openAddPatientflag)}}>Add New Patient</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <CatalogProductsgrid/>
                            </div>
                            <div>
                                <CartComplimentaryGrid/>
                            </div>
                            <div className="scrolling-tabs" id="SelectPrescription">
                                <CatalogSelectPrescription />
                            </div>
                            <div className="scrolling-tabs" id="DeliveryDetails">
                                <div className="p-12">
                                    <p className="custom-fieldset mb-2">Select Delivery Type</p>
                                    <SelectDelivery />
                                </div>
                            </div>
                            <div className="scrolling-tabs" id="Payments">
                                <div className="p-12">
                                    <p className="custom-fieldset mb-2">Select Payment Type</p>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="payment" id="COD" value="option1" />
                                        <label class="form-check-label" for="COD">COD</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="payment" id="Online" value="option2" />
                                        <label class="form-check-label" for="Online">Online</label>
                                    </div>
                                </div>
                            </div>
                            </div>
                            }
                           {(editReviewpage || showReviewpage) && <div className="scrolling-tabs" id="ReviewandProceed">
                                <div className="p-12">
                                    <p className="custom-fieldset mb-2">Select Patient</p>
                                    <CatalogPatientCard inReview={true}/>
                                </div>
                               <CatalogDeliveryDetails order={1}/>
                               <CatalogProductsgrid></CatalogProductsgrid>
                               <CatalogDeliveryDetails order={2}/>
                               <CatalogProductsgrid></CatalogProductsgrid>
                                <div className="p-12">
                                    <p className="custom-fieldset mb-2">Enter Coupon</p>
                                    <div className="row">
                                        <div className="col-3">
                                            <div class="form-floating mb-3">
                                                <input type="email" class="form-control" id="CouponCode" placeholder="" />
                                                <label for="CouponCode">Enter Coupon</label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>

                            </div>}
                        </div>
                    </div>
                    {openAddPatientflag && <AddNewPatientModel openAddPatientflag={openAddPatientflag} setOpenAddPatientflag={setOpenAddPatientflag}></AddNewPatientModel>}
                </BodyComponent>
                <FooterComponent className="footer p-3" ref={footerRef}>
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <button className="btn btn-sm brand-secondary px-3">Add More Products</button>
                        </div>
                        {!showReviewpage && <div>
                            <button className="btn btn-sm brand-secondary me-3 px-3">Continue Shopping</button>
                            <button className="btn btn-sm btn-brand px-3 " onClick={()=>{setShowReviewpage(!showReviewpage);setEditReviewpage(false)}}>Review &amp; Place the Order</button>
                        </div>}
                        {showReviewpage && <div>
                            <button className="btn btn-sm brand-secondary me-3 px-3" onClick={()=>{setShowReviewpage(!showReviewpage);setEditReviewpage(true)}}>Edit Shopping Cart</button>
                            <button className="btn btn-sm btn-brand px-3 " >Place the Order</button>
                        </div>}
                    </div>
                </FooterComponent>
            </Wrapper>
        </React.Fragment>
    )
}
export default CatalogCheckout