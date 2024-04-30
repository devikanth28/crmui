import React, { useEffect, useRef, useState } from "react";
import CustomerCommunication from "./CustomerCommunication";
// import { Nav, NavItem, NavLink, TabContent } from "react-bootstrap";

import CommunicationSearch from "./CommunicationSearch";
import NavTabs from "../Common/NavTabs";
import { TabContent, TabPane } from "reactstrap";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import CommunicationResult from "./CommunicationResult";
import Validate from "../../helpers/Validate";

const Communication=({...props})=>{

    const [loadForm,setLoadForm]= useState(<CustomerCommunication/>);
    const [tabId, setTabId] = useState('1')
    const headerRef = useRef();
    const tabs = ["Display Communication", "Record Communication"];

    useEffect(()=>{
      if(Validate().isNotEmpty(props.location.search))
        setTabId("1");
    },[props.location.search])
  
    const handleTabId = (tabId) => {
      let numToString = tabId.toString();
      setTabId(numToString)
  }

    return(
<Wrapper>
  <HeaderComponent ref={headerRef}>
  <div className={`custom-tabs-forms d-flex pb-0 mobile-compatible-tabs`}>
        <NavTabs activeTabId={tabId} tabs={tabs} onTabChange={handleTabId}/>
</div>
  </HeaderComponent>
  <BodyComponent allRefs={{headerRef}} className="body-height">
        <TabContent activeTab={tabId}> 
            <TabPane tabId="1">
              {/* <CommunicationSearch/> */}
              <CommunicationResult tabId={tabId} {...props}/>

            </TabPane>
            <TabPane tabId="2">
              <CustomerCommunication/>
            </TabPane>
        </TabContent>
  </BodyComponent>
</Wrapper>
    )
}

export default Communication;