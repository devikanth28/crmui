import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Validate from "../../helpers/Validate";
import CancelBotton from '../../images/cross.svg';
import { AGENT_UI } from "../../services/ServiceConstants";
import { AgentAppContext } from "../Contexts/UserContext";
import { closeChromeTab } from "../../helpers/AgentAppHelper";

const CommonAgentAppHeader = (props) => {
    const [isSearchHeader, setIsSearchHeader] = useState(false);
    const inputRef = useRef(null);

    const { isThirdPartyAgent,setLocationSearchText } = useContext(AgentAppContext);

    useEffect(() => {
        if (props.location.pathname === `${AGENT_UI}/configureLocation`) {
            setIsSearchHeader(true);
        }
        else {
            setIsSearchHeader(false);
        }
    }, [props.location]);

    const handleClick = () => {
        props.history.push(`${AGENT_UI}/configureLocation`);
    }

    const ClearSearch = () => {        
        if (Validate().isNotEmpty(inputRef.current)) {
            inputRef.current.value = "";
            setLocationSearchText("");
        }
    }

    const BackPageRedirection = () => {
        if(props?.goToCollectionCenter || !props.isHeaderSynced){
            closeChromeTab();
        }else if(props?.onBackRedirectTo){
            props.history.replace(`${AGENT_UI}/${props.onBackRedirectTo}`);
        }else{
            props.history.goBack();
        }
    }

    return (
        <React.Fragment>
            <header className="bg-white d-flex justify-content-between shadow-sm position-sticky crm-header p-2" style={{ 'top': 0, zIndex: 1030 }}>
                <div>
                    <Button variant="link" className="icon-hover me-2" title="Back" onClick={BackPageRedirection}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                            <g id="leftarrow_black_icon_18px" transform="translate(-48.941 -316.765)">
                                <rect id="BG_Guide" data-name="BG Guide" width="18" height="18" transform="translate(48.941 316.765)" fill="none" />
                                <path id="Path_22927" data-name="Path 22927" d="M56.566,319.236a.686.686,0,0,0-.448.178l-6.977,6.53a.7.7,0,0,0,0,.984l6.977,6.44a.709.709,0,0,0,.984-.089.7.7,0,0,0,0-.984l-5.546-5.188H66.226a.716.716,0,0,0,0-1.431H51.557l5.635-5.188a.635.635,0,0,0,.269-.536,1.275,1.275,0,0,0-.179-.537A4.04,4.04,0,0,0,56.566,319.236Z" transform="translate(0 -0.471)" fill="#080808" />
                            </g>
                        </svg>
                    </Button>
                </div>
                {!isSearchHeader ?
                    <div className="d-flex align-items-center justify-content-between w-100">
                        <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center">
                                <Link to='#'>
                                    <span >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 44 44">
                                            <g id="Group_1420" data-name="Group 1420" transform="translate(-40 -18)">
                                                <path id="Path_2501" data-name="Path 2501" d="M8,0H36a8,8,0,0,1,8,8V36a8,8,0,0,1-8,8H8a8,8,0,0,1-8-8V8A8,8,0,0,1,8,0Z" transform="translate(40 18)" fill="#c4161c" />
                                                <path id="Path_2502" data-name="Path 2502" d="M4,0H18.249a4,4,0,0,1,4,4V18.249a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" transform="translate(50.876 28.876)" fill="#fff" />
                                                <path id="Union_9" data-name="Union 9" d="M6.795,18.124v-6.8H0V6.8h6.8V0h4.533V6.8h6.8v4.528h-6.8v6.8Z" transform="translate(52.937 30.937)" fill="#08ce73" />
                                            </g>
                                        </svg>
                                    </span>
                                </Link>
                                <span className="mx-3 vertical-line d-none d-lg-inline"></span>
                                <div className="screen-title ps-2 ps-lg-0">
                                    <p className="mb-0 font-14 text-brand line-height-sm">{props.headerTitle}</p>
                                    <p className="mb-0">{props.screenName ? props.screenName : 'Agent App'}</p>
                                </div>
                            </div>
                        </div>
                        {(props.isLocationRequired && isThirdPartyAgent) && <Button variant="link" className="icon-hover">
                            <span onClick={handleClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 36 36">
                                    <g id="location_black_icon_36px" transform="translate(0)">
                                        <rect id="Rectangle_3286" data-name="Rectangle 3286" width="36" height="36" transform="translate(0)" fill="none" />
                                        <g id="Group_14535" data-name="Group 14535" transform="translate(4.99 0)">
                                            <path id="Union_130" data-name="Union 130" d="M1.481,18.636A12.907,12.907,0,0,1,3.526,3.74,12.66,12.66,0,0,1,12.868,0h.361a12.629,12.629,0,0,1,9.266,3.74,12.91,12.91,0,0,1,2.042,14.9C20.713,25.911,12.977,36,12.977,36S5.3,25.911,1.481,18.636ZM5.221,5.355A10.558,10.558,0,0,0,3.554,17.547a137.1,137.1,0,0,0,9.43,14.527,134.059,134.059,0,0,0,9.482-14.527A10.564,10.564,0,0,0,20.8,5.355,10.14,10.14,0,0,0,13.229,2.34h-.361A10.112,10.112,0,0,0,5.221,5.355Zm1.645,7.12a6.143,6.143,0,1,1,6.143,6.143A6.145,6.145,0,0,1,6.866,12.475Zm2.338,0a3.8,3.8,0,1,0,3.8-3.8A3.808,3.808,0,0,0,9.2,12.475Z" transform="translate(0)" fill="#080808" />
                                        </g>
                                    </g>
                                </svg>
                            </span>
                        </Button>}
                    </div>
                    : <div className="d-flex align-items-center gap-3 w-100">                                                    
                        <div className="w-100">
                            <Form.Group className="position-relative" controlId="exampleForm.ControlInput1">
                                <Form.Control className="border-dark" ref={inputRef} type="text" placeholder="Type your area name / pincode"
                                 onChange = {(event) => {
                                        const text = event.target.value
                                        if(text.length < 3){
                                            setLocationSearchText("");
                                        } else{
                                            setLocationSearchText(text);
                                        }
                                    }
                                 } autoComplete="off"/>
                                <div style={{ position: 'absolute', top: '2px', right: '8px' }}>
                                    <Button variant="link" className="icon-hover" onClick={ClearSearch}>
                                        <img src={CancelBotton} alt="Close" aria-label="Clear Search" />
                                    </Button>
                                </div>
                            </Form.Group>
                        </div>                        
                    </div>}
            </header>
        </React.Fragment>
    );
};

export default CommonAgentAppHeader;