import React, { useEffect, useMemo, useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import Validate from '../../helpers/Validate';

/*** 
 * activeTabId is for the default active tab on first render
 * 
 * 
 * while sending the list of objects as tabs, it should have properties 'tabId' and 'tabName'
 * 
 * **/

const NavTabs = ({ tabs, onTabChange, activeTabId, className }) => {
  const validate = Validate();
  const [activeTab, setActiveTab] = useState("");
  
  const [tabsList, setTabList] = useState(tabs);
  const tabsType = useMemo(() =>  typeof tabsList[0], [tabsList]);

  useEffect(() => {
    if(!(validate.isNotEmpty(tabsList) && validate.isNotEmpty(tabs) && tabsList.every((val, index) => val === tabs[index]))){
      setTabList(tabs);
    }
  }, [tabs]);

  useEffect(() => {
    if (validate.isNotEmpty(tabsList)) {
      if (validate.isNotEmpty(activeTabId)) {
        switch (tabsType) {
          case "string":
            setActiveTab(tabsList[activeTabId - 1]);
            onTabChange(activeTabId);
            break;
          case "object":
            setActiveTab(tabsList.filter((eachTab) => eachTab.tabId == activeTabId)[0]);
            onTabChange(activeTabId);
            break;
        }
      }
      else {
        setActiveTab(tabsList[0]);
        switch (tabsType) {
          case "string":
            onTabChange(1);
            break;
          case "object":
            onTabChange(tabsList[0].tabId);
            break;
        }
      }
    }
  }, [tabsList]);

  const toggleTab = (tab, tabId) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      switch (tabsType) {
        case "string":
          onTabChange(tabId);
          break;
        case "object":
          onTabChange(tab.tabId);
          break;
      }
    }
  };


  return (
    <Nav tabs className={`border-bottom ${validate.isNotEmpty(className) ? className : ''}`}>
      {validate.isNotEmpty(tabsList) && tabsList.map((eachTab, index) => (
        <NavItem key={index}>
          <NavLink
            className={eachTab === activeTab ? 'active' : ''}
            onClick={() => toggleTab(eachTab, index + 1)}
            style={{
              borderTopLeftRadius: index === 0 ? '0.375rem' : '0'
            }}
          >
            {tabsType == "string" ? eachTab : eachTab?.tabName}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  );
};

export default NavTabs;