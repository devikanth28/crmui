import { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';


const NavTabs = ({ tabs, onTabChange}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const toggleTab = (tab, tabId) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      onTabChange(tabId)
    }
  };


  return (
    <div className="custom-tabs-forms mobile-compatible-tabs pb-0">
       <Nav tabs>
  {tabs.map((eachTab, index) => (
    <NavItem key={index}>
      <NavLink
        className={eachTab === activeTab ? 'active' : ''}
        onClick={() => toggleTab(eachTab, index + 1)}
        style={{ 
          borderTopLeftRadius: index === 0 ? '0.375rem' : '0' 
        }}
        // href={`#${eachTab}`}
      >
        {eachTab}
      </NavLink>
    </NavItem>
  ))}
</Nav>
    </div>
  );
};

export default NavTabs;
