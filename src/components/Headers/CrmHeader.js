import React, { useContext, useRef, useState , useEffect } from "react";
import MedPlusLogo from '../../images/MedPlusLogo.svg'
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";
import { AlertContext, UserContext,SidebarContext } from "../Contexts/UserContext";
import { Form, Button } from "react-bootstrap";
import { CustomFilterModal } from '@medplus/react-common-components/DynamicForm';
import DeleteIcon from '../../images/delete-black-icn.svg'
import FilterIcon from '../../images/filter-icn.svg'
import Validate from "../../helpers/Validate";
import SaveSearch from "@medplus/react-common-components/SaveSearch";
import COMMON_CONFIG from "../../services/Common/CommonConfig";
import { UncontrolledTooltip } from "reactstrap";
import NotificationPopup from "./NotificationPopup";
import UserService from "../../services/Common/UserService";

const CrmHeader = (props) => {

    const [showModal, setShowModal] = useState(false);
    const userSessionInfo = useContext(UserContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const inputEl = useRef(null);
    const [notificationModal, setNotificationModal] = useState(false);
    const [userSectionColor , setUserSectionColor] = useState(sessionStorage.getItem("userColorCode"))
    const [saveWorkspaceResponse, setSaveWorkspaceResponse] = useState("");
    const {sidebarCollapsedFlag,setSidebarCollapsedFlag} = useContext(SidebarContext) ;
    
    const focusTextInput = () => {
        inputEl.current.focus();
    }

    const handleOnSearchClick = () => {
        setShowModal(false);
    }

    useEffect(() => {
        if (props.searchFormComponent && Validate().isNotEmpty(props) && Validate().isEmpty(props.location.search)) {
            if(props.mobileSearchForm && userSessionInfo?.vertical == "V") {
                props.history.push(`${props.location.pathname}/search`)
            } else {
                setShowModal(true);
            }
        } else {
            setShowModal(false);
        }
    }, [props.location.pathname,props.location.search,props.searchFormComponent]);

    useEffect(() => {
        if (showModal) {
            focusTextInput();
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[showModal]);

    useEffect(() => {
        calculatebg()
    }, [])

    useEffect(() => {
        if(Validate().isNotEmpty(saveWorkspaceResponse)){
            if ("SUCCESS" === saveWorkspaceResponse.data.statusCode) {
                getUserWorkspaceDetails();
                setStackedToastContent({toastMessage:"Your workspace saved successfully!"})
            }else {
                setStackedToastContent({toastMessage:saveWorkspaceResponse.data.message})
            }
        }
    }, [saveWorkspaceResponse])

    const getUserWorkspaceDetails = () => {
        UserService().getUserSavedSearches({}).then(data => {
            if(Validate().isNotEmpty(data) && "SUCCESS" === data.statusCode && Validate().isNotEmpty(data.dataObject)) {
                userSessionInfo.setUserSearchDetails({"userSavedSearches": data.dataObject});
            }
        })
    }

    const handleClickOutside=(event) => {
        if(inputEl.current && inputEl.current.contains(event.target)){
            setShowModal(true) 
            focusTextInput() 
        }
        else if(inputEl.current){
          setShowModal(false) 
        }
    }
 
    const togglNotificationModal = () =>{
        setNotificationModal(!notificationModal)
    }

    const getUsername = (username) => {
        let usernamesplit = username.split(' ');
        let userLetters = ''
        if(usernamesplit.length == 1) {
            userLetters = userLetters + usernamesplit[0].charAt(0)
        }
        else if(usernamesplit.length > 1) {
            userLetters = userLetters + (usernamesplit[0].charAt(0) + usernamesplit[1].charAt(0))
        }
        
        return userLetters

    }

    const calculatebg = () => {
        if(sessionStorage.getItem("userColorCode") === null) {
            let x = Math.floor((Math.random() * 6) + 1);    
            const colors = ['badge-approved', 'badge-pending', 'badge-created','badge-rejected','badge-Submitted','badge-Decoded','badge-Cancelled']
            setUserSectionColor(colors[x])
            sessionStorage.setItem("userColorCode", colors[x]);
        }
        
    }

    const SearchFormComponent = props.searchFormComponent;
    return <React.Fragment>

        <header className="bg-white d-flex justify-content-between shadow-sm position-sticky crm-header" style={{ 'top': 0, zIndex: 1030}}>

            <div className="d-flex align-items-center" style={userSessionInfo?.vertical == "V" ? {maxWidth: "calc(100% - 10.125rem)"} : {}}>
                <div className="sidebar-menu-icon me-2" onClick={()=>{setSidebarCollapsedFlag(!sidebarCollapsedFlag)}}>
                    <a href="javascript:void(0)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                            <g id="menu_black_icon_18px" transform="translate(-337.505 -105.819)">
                                <rect id="Rectangle_3300" data-name="Rectangle 3300" width="18" height="18" transform="translate(337.505 105.819)" fill="none" />
                                <g id="Group_14575" data-name="Group 14575" transform="translate(339.84 110.461)">
                                    <path id="Union_141" data-name="Union 141" d="M.469,8.716a.469.469,0,0,1,0-.939H12.862a.469.469,0,1,1,0,.939Zm0-3.889a.469.469,0,0,1,0-.939H12.862a.469.469,0,1,1,0,.939ZM.469.94a.47.47,0,0,1,0-.94H12.862a.47.47,0,0,1,0,.94Z" fill="#080808" />
                                </g>
                            </g>
                        </svg>
                    </a>
                </div>
                <div>
                    <Link to='/customer-relations/'><img src={MedPlusLogo} alt="MedPlus Logo" /></Link>
                </div>
                <span className="mx-3 vertical-line d-none d-lg-inline"></span>
                <div className="screen-title ps-2 ps-lg-0 w-100">
                    <p className="mb-0 font-14 text-brand line-height-sm">CRM</p>
                    <p className="mb-0 text-truncate">{props.screenName}</p>
                </div>
            </div>

            <div className="d-flex align-items-center gap-3">

                {props.searchFormComponent && <div ref={inputEl}> <CustomFilterModal className="custom-form-scroll"
                    bodyContent={() => { return (<div id="custom-filter-modal-container"><SearchFormComponent {...props} handleOnSearchClick={handleOnSearchClick} /></div>) }}
                    isBigPopOverRequired={true}
                    headerContent={() => {
                        return (
                            <div className="align-items-center d-flex justify-content-end" >
                               {!showModal
                                ? <React.Fragment>
                                    <Button  variant="" className="btn btn-link p-2 icon-hover" id="global-search-icon" >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                        <g id="Search_black_icon_24px" transform="translate(-48.941 -105.819)">
                                            <rect id="Rectangle_3285" data-name="Rectangle 3285" width="24" height="24" transform="translate(48.941 105.819)" fill="none"/>
                                            <path id="Path_22916" data-name="Path 22916" d="M72.711,128.457l-7.162-7.132a9.455,9.455,0,1,0-1.1,1.1l7.164,7.133a.78.78,0,1,0,1.1-1.1ZM50.5,115.262a7.853,7.853,0,1,1,7.853,7.853A7.862,7.862,0,0,1,50.5,115.262Z" fill="#000000"/>
                                        </g>
                                        </svg>
                                    </Button>
                                    <UncontrolledTooltip placement="bottom" target="global-search-icon">
                                        Search
                                    </UncontrolledTooltip>
                                    </React.Fragment> : null }
                                {showModal
                                    ? <div>
                                        <Button onClick={() => handleOnSearchClick()} variant="light" className="btn btn-link p-2 icon-hover" id="global-search-close-icon" >
                                            <img src={DeleteIcon} alt={"Delete Icon"}  height="18px" width="18px"/>
                                        </Button>
                                        <UncontrolledTooltip placement="bottom" target="global-search-close-icon">
                                            Close Search Options
                                        </UncontrolledTooltip>
                                        {/*<Button variant="light" className="position-absolute close-icn icon-hover" >
                                            <img src={FilterIcon} alt={"Filter Icon"} title="Show Search Options" />
                                        </Button>
                                        */}
                                    </div>
                                    : null}
                            </div>
                        )
                    }
                    }
                    showModal={showModal}
                />
                </div>
                }
                {props.showSaveWorkspaceModal && <span className="d-none d-lg-inline"><SaveSearch saveUserSearchConfig={COMMON_CONFIG.SAVE_USER_SEARCH} setSaveWorkspaceResponse={setSaveWorkspaceResponse} userSavedWorkspaceConfig = {userSessionInfo}/></span>}
                {/* <Dropdown>
                    <Dropdown.Toggle variant=" " id="dropdown-basic" className="custom-btn-dropdown p-0">
                        <button className="mx-3 btn btn-link p-1 icon-hover" id="settings">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path id="noun-settings-5079167-404040" d="M101.019,90a1.952,1.952,0,0,0-1.941,1.941v.717a9.791,9.791,0,0,0-1.637.677l-.506-.506a1.953,1.953,0,0,0-2.745,0L92.819,94.2a1.953,1.953,0,0,0,0,2.745l.506.506a9.789,9.789,0,0,0-.677,1.637h-.717a1.952,1.952,0,0,0-1.941,1.941v1.942a1.952,1.952,0,0,0,1.941,1.941h.717a9.781,9.781,0,0,0,.677,1.637l-.506.506a1.953,1.953,0,0,0,0,2.745l1.372,1.372a1.953,1.953,0,0,0,2.745,0l.506-.506a9.786,9.786,0,0,0,1.637.677v.717A1.952,1.952,0,0,0,101.019,114h1.942a1.952,1.952,0,0,0,1.941-1.941v-.717a9.784,9.784,0,0,0,1.637-.677l.506.506a1.953,1.953,0,0,0,2.745,0l1.372-1.372a1.953,1.953,0,0,0,0-2.745l-.506-.506a9.781,9.781,0,0,0,.677-1.637h.717a1.952,1.952,0,0,0,1.941-1.941v-1.942a1.952,1.952,0,0,0-1.941-1.941h-.713a9.792,9.792,0,0,0-.679-1.639l.5-.5a1.953,1.953,0,0,0,0-2.745l-1.372-1.372a1.953,1.953,0,0,0-2.745,0l-.5.5a9.8,9.8,0,0,0-1.639-.679v-.712A1.952,1.952,0,0,0,102.961,90Zm0,1.412h1.942a.512.512,0,0,1,.529.529v1.246h0a.706.706,0,0,0,.534.685,8.38,8.38,0,0,1,2.276.943h0a.706.706,0,0,0,.862-.106l.881-.881a.513.513,0,0,1,.749,0l1.372,1.372a.513.513,0,0,1,0,.749l-.881.881a.706.706,0,0,0-.106.862,8.378,8.378,0,0,1,.943,2.276.706.706,0,0,0,.685.534h1.246a.512.512,0,0,1,.529.529v1.942a.512.512,0,0,1-.529.529H110.8a.706.706,0,0,0-.685.535,8.381,8.381,0,0,1-.941,2.274.706.706,0,0,0,.106.862l.883.883a.513.513,0,0,1,0,.749l-1.372,1.372a.513.513,0,0,1-.749,0l-.883-.883a.706.706,0,0,0-.862-.106,8.384,8.384,0,0,1-2.274.941h0a.706.706,0,0,0-.535.685v1.25a.512.512,0,0,1-.529.529h-1.942a.512.512,0,0,1-.529-.529v-1.25h0a.706.706,0,0,0-.535-.685,8.384,8.384,0,0,1-2.274-.941h0a.706.706,0,0,0-.862.106l-.883.883a.513.513,0,0,1-.749,0L93.817,108.8a.513.513,0,0,1,0-.749l.883-.883a.706.706,0,0,0,.106-.862,8.38,8.38,0,0,1-.941-2.274.706.706,0,0,0-.685-.535h-1.25a.512.512,0,0,1-.529-.529v-1.942a.512.512,0,0,1,.529-.529h1.25a.706.706,0,0,0,.685-.535,8.382,8.382,0,0,1,.941-2.273h0a.706.706,0,0,0-.106-.862l-.883-.883a.513.513,0,0,1,0-.749l1.372-1.372a.513.513,0,0,1,.749,0l.883.883a.706.706,0,0,0,.862.107,8.38,8.38,0,0,1,2.274-.941h0a.706.706,0,0,0,.535-.685v-1.25a.512.512,0,0,1,.529-.529Zm.971,4.548a6.04,6.04,0,1,0,6.04,6.04A6.051,6.051,0,0,0,101.99,95.96Zm0,1.412A4.628,4.628,0,1,1,97.362,102,4.618,4.618,0,0,1,101.99,97.371Z" transform="translate(-89.99 -90)" fill="#3f3f3f" fill-rule="evenodd" />
                            </svg>
                        </button>
                        <UncontrolledTooltip placement="right" target="settings">
                            {"settings"}
                        </UncontrolledTooltip>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="custom-dropdown custom-dropdown-menu">
                        <Dropdown.Item className="custom-dropdown-item" href="javascript:void(0)">setting1</Dropdown.Item>
                        <Dropdown.Item className="custom-dropdown-item" href="javascript:void(0)">setting2</Dropdown.Item>
                        <Dropdown.Item className="custom-dropdown-item" href="javascript:void(0)">setting3</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="custom-dropdown-item">setting4</Dropdown.Item>
                        <Dropdown.Item className="custom-dropdown-item" disabled>setting5</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> */}

                {/* <button className="me-3 btn btn-link p-1 icon-hover" id="notification" onClick={()=>{togglNotificationModal()}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19.517" height="24" viewBox="0 0 19.517 24">
                        <path id="noun-notification-5109859-404040" d="M181.109,77.7l-1.327-1.327v-3a7.539,7.539,0,0,0-5.019-7.093V65.009a2.509,2.509,0,1,0-5.019,0V66.28a7.539,7.539,0,0,0-5.019,7.093v3L163.4,77.7a3.056,3.056,0,0,0-.9,2.175v1.3a1.963,1.963,0,0,0,1.952,1.952h3.714a4.171,4.171,0,0,0,8.186,0h3.714a1.963,1.963,0,0,0,1.952-1.952v-1.3a3.056,3.056,0,0,0-.9-2.175Zm-9.692-12.692a.836.836,0,1,1,1.673,0v.881h-1.673Zm.836,19.8a2.5,2.5,0,0,1-2.353-1.673h4.706a2.5,2.5,0,0,1-2.353,1.673Zm8.086-3.625a.279.279,0,0,1-.279.279H164.448a.279.279,0,0,1-.279-.279v-1.3a1.383,1.383,0,0,1,.413-.993l1.573-1.573a.836.836,0,0,0,.245-.591V73.373a5.855,5.855,0,1,1,11.71,0v3.346a.836.836,0,0,0,.245.591l1.573,1.573a1.383,1.383,0,0,1,.413.993Z" transform="translate(-162.496 -62.5)" fill="#3f3f3f" />
                    </svg>
                </button>
                <UncontrolledTooltip placement="bottom" target="notification">
                {"Notifications"}
            </UncontrolledTooltip>
            {notificationModal && <NotificationPopup NotificationModal={togglNotificationModal} filterModalOpen={notificationModal}/>} */}
                <Dropdown>
                    <Dropdown.Toggle variant=" " id="dropdown-basic" className="custom-btn-dropdown p-0">
                        <div className="d-flex align-items-center">
                            <div className="user-details">
                                <div className="align-items-end d-flex flex-column line-height-sm text-end">
                                    <p className="mb-0 font-weight-bold font-12 text-ellipse-name" title={userSessionInfo.userDetails ? userSessionInfo.userDetails.name : ''}>{userSessionInfo.userDetails ? userSessionInfo.userDetails.name : ''}</p>
                                    <p className="mb-0 text-secondary font-10">Emp ID: {userSessionInfo.userDetails ? userSessionInfo.userDetails.employeeId : ''}</p>
                                    <p className="mb-0 text-secondary font-10">{userSessionInfo.userDetails ? userSessionInfo.userDetails.email : ''}</p>
                                </div>
                            </div>

                            <div className={`username ${userSectionColor} ms-2` } >
                                <span>{userSessionInfo.userDetails ? getUsername(userSessionInfo.userDetails.name):''}</span>
                            </div>

                            {/* <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                                    <g id="Group_3261" data-name="Group 3261" transform="translate(-2120.376 -256.75)">
                                        <rect id="BG_Guide" data-name="BG Guide" width="35.902" height="35.902" transform="translate(2120.474 256.847)" fill="none" />
                                        <g id="Group_3261-2" data-name="Group 3261" transform="translate(2120.376 256.75)">
                                            <path id="Path_1591" data-name="Path 1591" d="M2133.354,273.206a6.678,6.678,0,1,0-6.678-6.678A6.779,6.779,0,0,0,2133.354,273.206Zm0-11.371a4.873,4.873,0,1,1-4.873,4.873A5.1,5.1,0,0,1,2133.354,261.835Z" transform="translate(-2115.354 -254.279)" fill="#404040" />
                                            <path id="Path_1592" data-name="Path 1592" d="M2138.376,256.75a18,18,0,1,0,18,18A18.053,18.053,0,0,0,2138.376,256.75Zm0,1.8a16.133,16.133,0,0,1,16.2,16.2,16.577,16.577,0,0,1-3.24,9.72,9.462,9.462,0,0,0-9.18-7.38h-7.56a9.462,9.462,0,0,0-9.18,7.38,16.579,16.579,0,0,1-3.24-9.72A16.247,16.247,0,0,1,2138.376,258.55Zm-11.16,27.72a7.453,7.453,0,0,1,7.56-7.38h7.56a7.568,7.568,0,0,1,7.56,7.38,16.078,16.078,0,0,1-22.68,0Z" transform="translate(-2120.376 -256.75)" fill="#404040" />
                                        </g>
                                    </g>
                                </svg>
                            </div> */}

                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end" className="custom-dropdown custom-dropdown-menu">
                        <Dropdown.Item className="custom-dropdown-item" href="/customer-relations/logout" onClick={()=>sessionStorage.removeItem("userColorCode")}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>


            </div>
        </header>
    </React.Fragment>

}
export default CrmHeader;