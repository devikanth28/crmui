import React, { useState, useContext,useMemo, useEffect } from "react";
import { UserContext, SidebarContext, AlertContext, CustomerContext } from "../Contexts/UserContext";
import {
    Sidebar,
    SubMenu,
    Menu,
    MenuItem,
    useProSidebar
} from "react-pro-sidebar";

import LeftArrow from '../../images/leftArrow_icon.svg'
import RightArrow from '../../images/rightArrow_icon.svg'
import TopArrow from '../../images/TopArrow_icon.svg'
import BottomArrow from '../../images/bottomArrow_icon.svg'
import { InputGroup } from "react-bootstrap";
import SearchIcon from '../../images/Search_icon.svg'
import SearchwithOutBorder_Icon from '../../images/SearchwithOutBorder_icon.svg'
import { Button } from "react-bootstrap";
import InputWithOutFlotingPoint from "../Common/InputWithoutFloating";
import Validate from "../../helpers/Validate";
import PrescriptionIcon from '../../images/prescriptions-icn.svg'
import CustomersIcon from '../../images/customers-icn.svg'
import SavedWorkspaceIcon from '../../images/saved-workspace-icn.svg'
import ShutterIcon from '../../images/shutter-app-icn.svg'
import FollowUpIcon from '../../images/followup-icn.svg'
import PlaceHolderIcon from '../../images/PlaceholderImage.svg'
import MembershipIcon from '../../images/membership-icn.svg'
import WalletIcon from '../../images/wallet-icn.svg'
import StoreLocatorIcon from '../../images/store-locator-icn.svg'
import RefillOrdersIcon from '../../images/refill-orders-icn.svg'
import CustomerChangeIcon from '../../images/customer-change-request-icn.svg'
import DoctorPrescriptionIcon from '../../images/doctor-prescriptions-icn.svg'
import OrdersIcon from '../../images/orders-icn-24.svg'
import KYCSearchIcon from '../../images/e-kyc-search-icn.svg'
import ProfileBioIcn from '../../images/profile-bio-icn.svg'
import Catalog from '../../images/catalog-icn.svg';
import Communication from '../../images/communication-icn.svg';
import OrderHistory from '../../images/order-history.svg';
import HealthRecordHistory from '../../images/health-record-history-icn.svg'
import PointsWallet from '../../images/points-wallet-icn.svg'
import { API_URL, CRM_UI } from "../../services/ServiceConstants";
import CommonDataGrid,{DeleteIcon} from '@medplus/react-common-components/DataGrid';
import { useCallback } from "react";
import UserService from "../../services/Common/UserService";
import { TOAST_POSITION } from "@medplus/react-common-components/DynamicForm";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";



const NavTab = (props) => {

    const { customerId} = useContext(CustomerContext);
    const { sidebarCollapsedFlag, setSidebarCollapsedFlag } = useContext(SidebarContext);
    const { collapsed, collapseSidebar } = useProSidebar();
    const [selectedMenu, setSelectedMenu] = useState(props.location.pathname);
    const [searchValue, setSearchValue] = useState('');
    const [isGettingBySearch, setGettingBySearch] = useState(false);
    const [menuBarItems,setMenuBarItems] = useState([]);
    const [savedSearches,setSavedSearches] = useState([]);
    const [transitDashboardUrl, setTransitDashboardUrl] = useState([]);
    const [workspaceDeleteModal,setWorkspaceDeleteModal] = useState(false);
    const [workspace,setWorkspace]=useState()

    const userSessionInfo = useContext(UserContext);
    const { setStackedToastContent } = useContext(AlertContext);

    const {customer} = useContext(CustomerContext);

    useEffect(() => {
        setMenuBarItems(props.isCustomerNavBar ? props.navLinks : userSessionInfo.NavLinks);
        setSavedSearches(userSessionInfo.userSavedSearches);
        setTransitDashboardUrl(userSessionInfo.transitDashboardUrl);
    },[props.isCustomerNavBar,props.navLinks,userSessionInfo]);

    useEffect(() => {
        collapseSidebar(sidebarCollapsedFlag);
        setSelectedMenu(props.location.pathname);
    },[props.location.pathname, sidebarCollapsedFlag])

    const CloseButton = <Button variant="" className="btn-close icon-hover" type="button" onClick={()=>setWorkspaceDeleteModal(!workspaceDeleteModal)}></Button>

    const deleteSelectedWorkspace = () => {
        UserService().inactivateUserSearch({"workspaceName" : workspace.title}).then(data => {
            if(Validate().isNotEmpty(data) && "SUCCESS" === data.statusCode) {
                setStackedToastContent({ toastMessage: workspace.title+" Workspace deleted successfully", position: TOAST_POSITION.BOTTOM_START });
                updateSavedSearches(workspace);
            } else {
                setStackedToastContent({ toastMessage: "Unable to delete workspace. Please try after some time", position: TOAST_POSITION.BOTTOM_START });
            }
        })
        
    }



    const updateSavedSearches = (workspace) => {
        let userSavedSearches = userSessionInfo.userSavedSearches;
        const filteredSearches = Object.keys(userSavedSearches).filter((key) => {
            const userSearch = userSavedSearches[key];
            if(userSearch.status == "A" && workspace.title == userSearch.title){
                return false;
            } 
            return true;
        }).map(key => userSavedSearches[key]);
        userSessionInfo.setUserSearchDetails({"userSavedSearches": filteredSearches});
    }

    const validate = Validate();
    const setSearchedMenuItems = event => {
        if (event === "close") {
            setSearchValue('');
            setGettingBySearch(false);
        } else {
            setSearchValue(event.target.value ? event.target.value.toLowerCase():'');
            setGettingBySearch(event.target.value ? true : false)
            
        }
    }

    const sidebarOperation = () => {
        setSidebarCollapsedFlag(!collapsed);
        collapseSidebar(!collapsed)
    }

    const handleOnClickMenu = (e, menuItem, isCustomMenu) => {
        if (e.type !== 'contextmenu') {
            e.preventDefault();
        }
        if(isCustomMenu){
            window.location.href = menuItem.url;
        }else{
       		if (menuItem.displayName === "Shipments - Lab Samples") {
                menuItem.url = "";
                window.open(transitDashboardUrl + "?type=crm");
            }
			if (menuItem.displayName === "Home Collection Agent Tracker") {
                menuItem.url = "";
                window.open(transitDashboardUrl + "?type=agent_supervisor");
            }
            if(menuItem.displayName === "Compliance Details"){
                menuItem.url = "";
                window.open(transitDashboardUrl + "?type=bmw");
            }
            if (selectedMenu !== menuItem.url && menuItem.redirectionType === "L") {
                let url = props.location.pathname;
                if (menuItem.url.includes("/crm")) {
                    props.history.push(`${menuItem.url}`);
                    return;    
                } else {
                    if(props.isCustomerNavBar){
                        props.history.push(`${props.customerPrefix}${menuItem.url}`)
                        return;
                    }
                    props.history.push(`${menuItem.url}`);
                    return;
                }
            }
            if(menuItem.redirectionType === "R") {
                if(props.isCustomerNavBar){
                    window.open(getOldCRMCustomerRedirectionUrl(menuItem.url), customerId);
                } else{
                    window.open(`${menuItem.url}`);
                }
            }
        }
    }

    const getOldCRMCustomerRedirectionUrl = (url)=>{
        if(url.includes("#") && validate.isNotEmpty(customer)){
            url = url.split("#");
            url[0] = url[0]+"?customerId="+customer.customerID;
            url = url.join("#");
            return url;
        } 
        return url;
    }

    const renderIcon = (param) => {
        switch (param) {
            case 'Prescriptions':
                return PrescriptionIcon;

            case 'Customer':
                return CustomersIcon;

            case 'Follow-up':
                return FollowUpIcon;

            case 'Membership':
                return MembershipIcon;

            case 'M-Wallet Refund':
                return WalletIcon;

            case 'Doctor E-Prescriptions':
                return DoctorPrescriptionIcon;

            case 'Customer Change Request':
                return CustomerChangeIcon;

            case 'Refill Requests':
                return RefillOrdersIcon;

            case 'Store Locater':
                return StoreLocatorIcon;

            case 'Orders':
            case 'Lab Collection Center':
                return OrdersIcon;

            case 'Customer E-KYC':
                return KYCSearchIcon;

            case 'Shutter Dashboard':
                return ShutterIcon;

            case 'Bio':
                return ProfileBioIcn;
            
            case 'Catalog':
                return Catalog;

            case 'Communication':
                return Communication;
            
            case 'Order History':
                return OrderHistory;
            
            case 'Health Record History':
                return HealthRecordHistory;

            case 'Points/Wallet':
                return PointsWallet

            default:
                return PlaceHolderIcon
        }
    }

    const getAllSubLinks = (subLinks) => {
        let allSubLinks = [];
        if(validate.isNotEmpty(subLinks)) {
            subLinks.forEach(subLink => {
                allSubLinks.push(...getAllSubLinks(subLink.subLinks));
                allSubLinks.push(subLink);
            })
        }
        return allSubLinks;
    }


    const getAllDisplayNames = (item) => {
        let allDisplayNames = [];
        if(validate.isNotEmpty(item)) {
            if(validate.isNotEmpty(item.subLinks)) {
                item.subLinks.forEach(link => {
                    allDisplayNames.push(...getAllDisplayNames(link))
                });
            } else {
                allDisplayNames.push(item.displayName.toLowerCase());
            }
        }
        return allDisplayNames;
    }

    const prepareSearchMap = (searchMap, value) => {
        let allDisplayNames = [...getAllDisplayNames(value)];
        searchMap[value.id] = allDisplayNames.join(" ");
        if(value.subLinks) {
            value.subLinks.map(value => {
                prepareSearchMap(searchMap,value);
            })
        }

    } 
    const searchMap = useMemo(() => {
        if(Validate().isEmpty(menuBarItems)) {
            return {};
        }
        let searchMap = {};

        menuBarItems.map(value => {
            prepareSearchMap(searchMap,value);

        })

        return searchMap;

    },[menuBarItems]) 


    const filteredSavedSearches = useMemo(() => {
        if(!searchValue) {
            return savedSearches;
        }
        if(!savedSearches) {
            return savedSearches;
        }
        return savedSearches.filter(search => search.title.toLowerCase().includes(searchValue.toLowerCase()));
    },[savedSearches,searchValue]) 


    const filterItem = (item) => {
        let searchItem = searchMap[item.id];
        return !searchValue  || ((validate.isNotEmpty(item.subLinks) && searchItem.includes(searchValue)) || (validate.isEmpty(item.subLinks) && item.displayName.toLowerCase().includes(searchValue)));

    }


    const getNavLinks = useCallback((items,level) => {

        if(validate.isEmpty(items) ){
            return <React.Fragment></React.Fragment>
        }

        return <React.Fragment>
            {items.filter(item => filterItem(item)).map(item => {
                    let allSubLinks = [];
                    if(validate.isNotEmpty(item.subLinks)) {
                        allSubLinks.push(...getAllSubLinks(item.subLinks));
                    }
                        
                   return  validate.isNotEmpty(item.subLinks) ? 
                    <SubMenu label={item.displayName}
                    defaultOpen={isGettingBySearch || allSubLinks.find(value => value.url == selectedMenu)}
                    style = {level >= 3 ? {padding:`0rem 0.5rem 0rem ${(level - 2) + 0.5}rem`} : {padding: `0rem 0.5rem`}}
                    level={level}
                    >
                        {getNavLinks(item.subLinks, level+1)}
                    </SubMenu> 
                :
                    <MenuItem
                    active={isActiveLink(selectedMenu, item.url)}
                    href={item.url}
                    title={item.displayName}
                    onClick={(e) => {
                        handleOnClickMenu(e,item, false);
                    }}
                    style = {level >= 3 ? {padding:`0rem 0.5rem 0rem ${(level - 2) + 0.5}rem`} : {padding: `0rem 0.5rem`}}
                    >
                        {item.displayName}
                    </MenuItem>
            })}
        </React.Fragment>


    },[isGettingBySearch,selectedMenu,filterItem]);

    const isActiveLink = (selectedMenu, linkUrl) => {
        return props.isCustomerNavBar ? selectedMenu.includes(linkUrl) : selectedMenu === linkUrl;
    }

    return (
        <React.Fragment>


            <Sidebar transitionDuration={500} className="sidebar shadow-sm sidebar-mobile" style={validate.isNotEmpty(props.style) ? {...props.style} : {}}>

                <header className={`d-flex justify-content-center ${collapsed ? 'me-3' : ''}`}>
                    {collapsed && <button className="btn btn-link p-2 me-3" onClick={() => sidebarOperation()}>
                        <img src={SearchIcon} alt="Seach Icon" />
                    </button>}
                    {!collapsed && <div className="p-2 search-bar" >
                        <InputGroup size={"sm"}>
                            <InputGroup.Text>
                                <img src={SearchwithOutBorder_Icon} alt="Search Icon" />
                            </InputGroup.Text>
                            <InputWithOutFlotingPoint type="text" size="sm" placeholder="Filter Menu" value={searchValue} onChange={setSearchedMenuItems} clearSearchText={() => { setSearchedMenuItems("close") }} />
                        </InputGroup>
                    </div>}
                </header>

                <Menu iconShape="circle" renderExpandIcon={({ open }) => <span>{open ? <img src={TopArrow} alt="Top Arrow" /> : <img src={BottomArrow} alt="Bottom Arrow" />}</span>}>
                    {
                        validate.isNotEmpty(filteredSavedSearches)
                            ? <SubMenu label="Saved Workspace"
                                defaultOpen={isGettingBySearch || filteredSavedSearches.find(eachSearch => eachSearch.url == selectedMenu)}
                                style={{padding:'0rem 0.5rem'}}
                                icon={<img src={SavedWorkspaceIcon} alt="saved searches" 
                                />
                                }>
                                {filteredSavedSearches.map(eachSearch => (  
                                    <React.Fragment>  
                                    <div className="position-relative">                               
                                    <MenuItem
                                        active={isActiveLink(selectedMenu, eachSearch.url)}
                                        onClick={(e) => {
                                            handleOnClickMenu(e , eachSearch, true);
                                        }}
                                        style={{padding:'0rem 0.5rem', width: 'calc(100% - 2rem)'}}>
                                        <span title={eachSearch.title}> {eachSearch.title}</span> 
                                    </MenuItem>                          
                                    <DeleteIcon tooltip="Delete Workspace" handleOnClick={() => {setWorkspace(eachSearch);setWorkspaceDeleteModal(!workspaceDeleteModal)}}/>
                                    </div>
                                    </React.Fragment>
                                )
                                )}
                            </SubMenu>
                            : null
                    }
                    
                    {validate.isNotEmpty(menuBarItems) && menuBarItems.filter(item => filterItem(item)).map((value) => {
                        let allSubLinks = [];
                        if(validate.isNotEmpty(value.subLinks)) {
                            allSubLinks.push(...getAllSubLinks(value.subLinks));
                        }
                        return <React.Fragment>
                                {validate.isNotEmpty(value.subLinks) ?
                                <SubMenu label={value.displayName}
                                    defaultOpen={isGettingBySearch || allSubLinks.find(value => value.url == selectedMenu)}
                                    style={{padding:'0rem 0.5rem'}}
                                    title={value.displayName}
                                    icon={<img src={renderIcon(value.displayName)} alt={value.displayName} />}>                                        
                                        {getNavLinks(value.subLinks,2)}                                        
                                </SubMenu> :
                                <MenuItem
                                    icon={<img src={renderIcon(value.displayName)} alt={value.displayName} />}
                                    active={isActiveLink(selectedMenu, value.url)}
                                    style={{padding:'0rem 0.5rem'}}
                                    href={value.url}
                                    title={value.displayName}
                                    onClick={(e) => {
                                        handleOnClickMenu(e,value, false);
                                    }}>
                                    {value.displayName}
                                </MenuItem>
                            }
                        </React.Fragment>
                    })}
                </Menu>
        <Modal className='modal-dialog-centered' isOpen={workspaceDeleteModal}>
            <ModalHeader className='d-flex justify-content-between align-items-center border-bottom px-3 py-2' close={CloseButton} >
            Delete selected workspace
            </ModalHeader>
            <ModalBody className='p-12'>
                {"Do you want to delete selected workspace - "+ workspace?.title}        
            </ModalBody>
            <ModalFooter>
                <button className="btn brand-secondary" onClick={()=>setWorkspaceDeleteModal(!workspaceDeleteModal)}>close</button>
                <button className="btn btn-brand" onClick={()=>{deleteSelectedWorkspace();setWorkspaceDeleteModal(!workspaceDeleteModal)}}>Yes, Delete Workspace</button>
            </ModalFooter>
        </Modal>
                <footer>
                    <Button variant="" className="menufooter" onClick={() => sidebarOperation()}>
                        <img src={!collapsed ? LeftArrow : RightArrow} className="btn-link icon-hover" alt={!collapsed ? "Left Arrow" : "Right Arrow"} />
                    </Button>
                </footer>
            </Sidebar>
        </React.Fragment >
    )
}

export default NavTab;
