import React,{useState} from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import NavTabs from "../Common/NavTabs";
import DeliveryDetailsForm from "./DeliveryDetailsForm";
import StoreGrid from "./StoreGrid";

const SelectDelivery = (props) => {
    const [tabId, setTabId] = useState('1')
    const handleTabId = (tabId) => {
        let numToString = tabId.toString();
        setTabId(numToString)
    }

    const tabs=[
        "Home Delivery",
        "Store Pick Up"
    ];
    return (
        <React.Fragment>
            <div className="custom-tabs-forms custom-tabs-forms-icon border rounded">
                {/* <Nav tabs className="border-bottom">
                    <NavItem>
                        <NavLink
                            className="active rounded-top">
                            Home Delivery
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink>
                            Store Pick Up
                        </NavLink>
                    </NavItem>
                </Nav> */}
                <NavTabs tabs={tabs} onTabChange={handleTabId}/>
                <TabContent  activeTab={tabId}>
                    <TabPane tabId="1">
                        <div className="p-12 col-9">
                            <DeliveryDetailsForm></DeliveryDetailsForm>

                        </div>
                    </TabPane>
                    <TabPane tabId="2">
                        <StoreGrid></StoreGrid>

                    </TabPane>
                </TabContent>
            </div>
        </React.Fragment>
    )
}
export default SelectDelivery