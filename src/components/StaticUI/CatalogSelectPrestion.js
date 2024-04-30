import React,{useState} from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import DocumentUpload from "@medplus/react-common-components/DocumentUpload"
import NavTabs from "../Common/NavTabs";
import HealthRecordGrid from "./HealthRecordGrid";


const CatalogSelectPrescription = () => {
    const [tabId, setTabId] = useState('1')
    const tabs=[
        "Send to Doctor",
        "Add New Prescription",
        "Add Old Prescription"
    ];


    const handleTabId = (tabId) => {
        let numToString = tabId.toString();
        setTabId(numToString)
    }
    return (
        <React.Fragment>
            <div className="p-12">
                <p className="custom-fieldset mb-2">Select Prescription</p>
                <div className="border rounded border-bottom-0">
                    <div className="custom-tabs-forms h-100 p-0 rounded">
                        {/* <Nav tabs className="border-bottom">
                            <NavItem>
                                <NavLink
                                    className="active rounded-top">
                                    Send to Doctor
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink>
                                    Add New Prescription
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink>
                                    Add Old Prescription
                                </NavLink>
                            </NavItem> */}
                        {/* </Nav> */}
                        <NavTabs tabs={tabs} onTabChange={handleTabId}/>
                        <TabContent activeTab={tabId}>
                            <TabPane tabId="1">
                                <div className="p-12">
                                    <div className="card w-50">
                                        <div className="card-body">
                                            <div className="d-flex mb-3">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value="" id="SendToDoctor" />
                                                </div>
                                                <div>
                                                    <p className="mb-1">Ask for Doctor Prescription</p>
                                                    <p className="mb-0 font-12 text-secondary">A doctor will contact you during 8 AM - 11 PM to provide consulation</p>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <button className="btn btn-sm btn-brand">Send to Doctor</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tabId="2">
                                <div className="p-12">
                                    <DocumentUpload onErrorResponse={() => { }} onSuccessResponse={() => {  }} onDeleteResponse={() => { }} fileSelectOption={true} documentScanOption={true} />
                                </div>
                                
                            </TabPane>
                            <TabPane tabId="3">
                                <HealthRecordGrid></HealthRecordGrid>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CatalogSelectPrescription