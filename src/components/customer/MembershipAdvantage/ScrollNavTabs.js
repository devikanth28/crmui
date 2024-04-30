import React, { useEffect, useRef, useState } from 'react'
import { Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import Validate from '../../../helpers/Validate';
const ScrollNavTabs = ({ tabs, className,onTabChange, refRequiired, subClassName, activeTab, setActiveTab }) => {
    const tabsContainerRef = useRef();
    const [scrollPosition, setScrollPosition]= useState(0);
    const validate = Validate()
    useEffect(() => {
        if (tabsContainerRef.current) {
            const containerWidth = tabsContainerRef.current?.children[0]?.offsetWidth;
            const containerWidthLeft = tabsContainerRef.current?.children[0]?.offsetLeft;
            const allTabs = tabsContainerRef.current?.children[0]?.children;
    
            const selectedElement = allTabs[activeTab + 1];
            const selectedElementTabWidth = allTabs[activeTab + 1]?.offsetWidth + 16;
    
            let scrollTemp = scrollPosition;
            scrollTemp = selectedElementTabWidth;
    
            setTimeout(() => {
                if (selectedElement?.offsetLeft < containerWidth) {
                    tabsContainerRef.current.children[0].scrollLeft -= scrollTemp;
                } else if (selectedElement?.offsetLeft + selectedElement?.offsetWidth > containerWidthLeft + containerWidth) {
                    tabsContainerRef.current.children[0].scrollLeft += scrollTemp;
                }
            })
    
            setScrollPosition(scrollTemp);
        }
    
    }, [activeTab]);
    

    const toggleTab = (tabId) => {
        if (activeTab !== tabId) {
            setActiveTab(tabId);
            onTabChange(tabId);
        }
    };

    
    return (
        <>
            {validate.isNotEmpty(tabs) &&
                <div className={`${className ? className : ""} custom-tabs-forms d-flex pb-0 mobile-compatible-tabs`} ref={refRequiired && tabsContainerRef}>
                    <Nav tabs style={{"scroll-behavior": "smooth"}} className={subClassName}>
                        {tabs.map((eachTab, index) => (
                            <NavItem key={index}>
                                <NavLink key={index}
                                    className={index === activeTab ? 'active' : ''}
                                    onClick={() => {
                                        toggleTab(index)
                                        }}
                                    style={{
                                        borderTopLeftRadius: index === 0 ? '0.375rem' : '0'
                                    }}
                                >
                                    {eachTab}
                                </NavLink>
                            </NavItem>
                        ))}
                    </Nav>
                </div>
            }
        </>
    );
}

export default ScrollNavTabs;