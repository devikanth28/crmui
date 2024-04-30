import React, { useRef, useState } from "react";
import { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import OrderHistory from "./OrderHistory";
import { Nav, NavItem, NavLink, Tab, Tabs } from "reactstrap";
import LabOrderHistory from "../OrderHistory/LabOrderHistory";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import ReorderModel from "../StaticUI/ReorderModel";
import CustomerOrderHistorySearchForm from "./CustomerOrderHistorySearchForm";
import RiteMedInvoices from "../OrderHistory/RiteMedInvoices";

const CustomerOrderHistory = ({ helpers, formData, ...props }) => {

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [activeTab, setActiveTab] = useState("orderHistory");
    const [disableMode, setDisableMode] = useState(false);
    const headerRef = useRef()
    const [openReorderModal, setOpenReorderModal] = useState(false);  
    const [isLabReOrderModal, setLabReOrderModal] = useState(false);  

    return (
        <React.Fragment>
            {!openReorderModal && <Wrapper>

                {/* This component needs to be sent as prop to customer bio header */}
                    {/* <CustomerOrderHistorySearchForm fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} /> */}
                {/* ************** */}

                <HeaderComponent ref={headerRef} className="align-items-center d-flex justify-content-between">
                    <div className={"custom-tabs-forms tabs-nowrap pb-0 d-flex justify-content-between w-100"}>
                        <Nav tabs>
                            <NavItem>
                                <NavLink className={`${"orderHistory" == activeTab ? "active" : ""}`} onClick={() => setActiveTab("orderHistory")}>
                                    Order History
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={`${"riteMedInvoices" == activeTab ? "active" : ""}`} onClick={() => setActiveTab("riteMedInvoices")}>
                                    Ritemed Invoices
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={`${"futurePurchases" == activeTab ? "active" : ""}`} onClick={() => setActiveTab("futurePurchases")}>
                                    Future Purchase
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={`${"lab" == activeTab ? "active" : ""}`} onClick={() => setActiveTab("lab")}>
                                    Lab
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={`${"optical" == activeTab ? "active" : ""}`} onClick={() => setActiveTab("optical")}>
                                    Optical
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={`${"recentPurchases" == activeTab ? "active" : ""}`} onClick={() => setActiveTab("recentPurchases")}>
                                    Recent Purchase
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={`${"serviceOrder" == activeTab ? "active" : ""}`} onClick={() => setActiveTab("serviceOrder")}>
                                    Service Order
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>
                </HeaderComponent>
                <BodyComponent allRefs={{ headerRef }} className="body-height p-0">
                    {activeTab == "orderHistory" && <OrderHistory fromDate={fromDate} toDate={toDate} openReorderModal={openReorderModal} handleSetOpenReorderModal={(value) => setOpenReorderModal(value)} />}
                    {activeTab === "lab" && <LabOrderHistory fromDate={fromDate} toDate={toDate} setDisableMode={setDisableMode} handleReOrderModal={(value) => setLabReOrderModal(value)}/>}
                    {activeTab === "riteMedInvoices" && <RiteMedInvoices/>}
                </BodyComponent>
                {openReorderModal && <ReorderModel handleSetOpenReorderModal={(value) => setOpenReorderModal(value)} orderInfo={true} />}
                {isLabReOrderModal && <ReorderModel handleSetOpenReorderModal={(value)=>setLabReOrderModal(value)}/>}
            </Wrapper>}
        </React.Fragment>
    )
}

export default withFormHoc(CustomerOrderHistory);