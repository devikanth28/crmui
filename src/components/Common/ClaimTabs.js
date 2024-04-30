import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { BodyComponent, FooterComponent, HeaderComponent } from "./CommonStructure";
import { Badges} from "@medplus/react-common-components/DataGrid";
import React,{useState ,useEffect, useMemo} from "react";
import Validate from "../../helpers/Validate";
import NoteIcons from "./NoteIcons";
import UserService from "../../services/Common/UserService";
import AnimationHelpers from "../../helpers/AnimationHelpers";
import { Button } from "react-bootstrap";

const ClaimTabs=(props)=>{

    const validate = Validate();
    const headerRef = validate.isEmpty(props.headerRef)?null:props.headerRef;
    const footerRef = validate.isEmpty(props.footerRef)?null:props.footerRef;
    const [isInfoModelOpen,setInfoModelOpen] = useState(false);

    const allowedLabOrdersClaimRight = useMemo(() => {
        if(validate.isNotEmpty(props.allowedOrderClaimRight)){
            if(!props.allowedOrderClaimRight){
                props.setActiveTabId(2);
            }
            return props.allowedOrderClaimRight;
        }else{
            return true;
        }
    }, [props.allowedOrderClaimRight]);

    useEffect(() => {
        if(allowedLabOrdersClaimRight){
            if(!props.location) {
                return;
            }
            const searchParams = new URLSearchParams(props.location.search);
            if(typeof props.claimedCount == "undefined" && props.activeTabId == 2 && !searchParams.has("activeClaimedTab")){
                getInitialClaimedCount();
            }
            if (props.activeTabId == 1) {
                searchParams.append("activeClaimedTab", true);
            }else{
                searchParams.delete("activeClaimedTab");
            }
            props.history.replace({ search: searchParams.toString() });
        }
    }, [props.activeTabId])
    
    const getInitialClaimedCount = async () => {
        await UserService().getClaimedRecordsCount({"refDocType":props.recordType}).then(data => {
            if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject.totalClaimedRecords)) {
                props.setTotalClaimedRecords(data.dataObject.totalClaimedRecords);
            }
        }).catch((err) => {
            console.log(err)
        });
    }
    
	const getDisplayCount = (count) => {
        if (count > 99) {
            return 99;
        } else {
            return count;
        }
    }


    const getToolTipForBadge = (value) => {
        return "Total Claimed: " + convertNumberToAmount(String(validate.isNotEmpty(value) ? value : 0));
    }

    const getToolTipForUnClaimedBadge = (value) => {
        return "Total UnClaimed: " + convertNumberToAmount(String(validate.isNotEmpty(value) ? value : 0));
    }

    const convertNumberToAmount = (num) => {
        return validate.isNotEmpty(num) ? convertAmountFormatToNumber(num).toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : num;
    }

    const convertAmountFormatToNumber = (amount) => {
        return validate.isNotEmpty(amount) ? Number(amount.replace(/[^0-9]/g, '')) : "";
    }
    
    const getTextForBadge =(value)=>{
        return (<React.Fragment>
            {getDisplayCount(validate.isNotEmpty(value)?value:0)}
            {(validate.isNotEmpty(value)?value:0)> 99 && <sup className="text-success">+</sup>}
        </React.Fragment>);
    }

    const instruction =(height) => {
        return (
        <div class="customdropdown-position position-absolute text-secondary" style={{bottom : `${height}px`}}>
            <h6 class="text-dark font-14">Note Information</h6>
            {<ol>
                <li>It is possible for users to force claim orders</li>
                <li>A maximum of 10 orders can be claimed</li>
                <li>Claimed orders will be active for a maximum of 30 minutes</li>
                <li>Cancelled orders will be unclaimed automatically</li>
            </ol>}
        </div>
        
        )
    }
    return(
        <React.Fragment>
            <HeaderComponent ref={headerRef} className="custom-tabs-forms p-0">
            <div className="d-flex justify-content-between align-items-center mobile-compatible-tabs">
                <Nav tabs>
                    {(allowedLabOrdersClaimRight) ? <NavItem>
                        <NavLink
                            className={props.activeTabId==1? "active" : ""}
                            onClick={() => props.setActiveTabId(1)}>
                            {props.tabOneHeaderContent?props.tabOneHeaderContent:"My Claimed List"}
                            <span className="ms-5 position-relative bg-light">
                                <Badges className={AnimationHelpers().getBadgeAnimation("badge text-dark bg-light", props.totalClaimedRecordsAnimation, props.setTotalClaimedRecordsAnimation)} text={getTextForBadge(props.claimedCount)} tooltip={getToolTipForBadge(props.claimedCount)} id={"ClaimedRecords"} />
                                {/* <Badges className={"badge text-dark bg-light"} text={} /> */}
                            </span>
                        </NavLink>
                    </NavItem> : null}
                    <NavItem>
                        <NavLink
                            className={props.activeTabId==2? "active" : ""}
                            onClick={() => props.setActiveTabId(2)}>
                            {props.tabTwoHeaderContent?props.tabTwoHeaderContent:"Search Results"}
                            <span className="ms-5 position-relative bg-light">
                                <Badges className={AnimationHelpers().getBadgeAnimation("badge text-dark bg-light", props.totalRecordsAnimation, props.setTotalRecordsAnimation)} text={getTextForBadge(props.totalRecords)} tooltip={getToolTipForUnClaimedBadge(props.totalRecords - props.claimedCount)} id={"unClaimed"}/>
                            </span>
                        </NavLink>
                    </NavItem>
                </Nav>
                {/* {(props.activeTabId == "2" && props.selectedRecordsLength) ? <div className="me-3" onClick={()=>{props.claimedSet("claim")}}>
                    <Button variant="link" size="sm" className="text-success">
                        <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g id="claim-icn-24" transform="translate(-367 -484)"><g id="claim-icn-32" transform="translate(370 488)"><g id="Group_34320" data-name="Group 34320" transform="translate(0)"><path id="Subtraction_118" data-name="Subtraction 118" d="M8.664,10.58H1.247A1.207,1.207,0,0,1,0,9.389v-8.2A1.207,1.207,0,0,1,1.247,0H13.431a1.207,1.207,0,0,1,1.247,1.191V3.935a4.975,4.975,0,0,0-.831-.164V1.192a.4.4,0,0,0-.416-.361H1.247a.4.4,0,0,0-.416.361v8.2a.366.366,0,0,0,.416.36H8.413a4.956,4.956,0,0,0,.251.829Z" transform="translate(0 2.076)" fill="#080808"></path><path id="Path_51583" data-name="Path 51583" d="M46.073,27.51H41.2V25.294c0-.387.387-.692.941-.692h2.991c.526,0,.941.305.941.692Zm-4.044-.831h3.213V25.433H42.031Z" transform="translate(-36.298 -24.602)" fill="#080808"></path><path id="Path_51584" data-name="Path 51584" d="M34.867,69.516a.982.982,0,0,1-.969-.969V67.3h1.967v1.246A.97.97,0,0,1,34.867,69.516Zm-.138-1.385v.415a.131.131,0,0,0,.138.138.155.155,0,0,0,.167-.138v-.415Z" transform="translate(-31.018 -55.477)" fill="#080808"></path></g><g id="Group_34319" data-name="Group 34319" transform="translate(9.139 6.646)"><path id="Path_51586" data-name="Path 51586" d="M41.379,41.394l-1.7,1.7c-.021.021-.021.041-.041.062a.021.021,0,0,1-.021.021.063.063,0,0,1-.021.041v.269a.063.063,0,0,0,.021.041.021.021,0,0,0,.021.021c0,.021.021.041.041.062l1.678,1.678a.388.388,0,0,0,.539,0,.329.329,0,0,0,.1-.248.382.382,0,0,0-.1-.248l-1.057-1.078h2.714a.373.373,0,0,0,0-.746H40.841L41.9,41.911a.329.329,0,0,0,.1-.248.382.382,0,0,0-.1-.248A.348.348,0,0,0,41.379,41.394Z" transform="translate(-37.286 -38.72)" fill="#080808"></path><path id="Ellipse_1237" data-name="Ellipse 1237" d="M3.181-1.25A4.427,4.427,0,0,1,7.611,3.181,4.427,4.427,0,0,1,3.181,7.611,4.427,4.427,0,0,1-1.25,3.181,4.427,4.427,0,0,1,3.181-1.25Zm0,8.219A3.789,3.789,0,0,0,6.969,3.181,3.789,3.789,0,0,0,3.181-.608,3.789,3.789,0,0,0-.608,3.181,3.789,3.789,0,0,0,3.181,6.969Z" transform="translate(1.25 1.25)" fill="#080808"></path></g></g></g></svg>
                        Claim Selected ({props.selectedRecordsLength})</Button>
                </div>:null}
                {(props.activeTabId == "1" && props.selectedRecordsLength) ? <div className="me-3" onClick={()=>{props.claimedSet("unclaim")}}>
                    <Button  variant="link" size="sm" className="text-danger">
                        <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g id="unclaim-icn-24" transform="translate(-367 -484)"><g id="unclaim-icn-32" transform="translate(370 488)"><g id="Group_34320" data-name="Group 34320" transform="translate(0)"><path id="Subtraction_118" data-name="Subtraction 118" d="M8.664,10.58H1.247A1.207,1.207,0,0,1,0,9.389v-8.2A1.207,1.207,0,0,1,1.247,0H13.431a1.207,1.207,0,0,1,1.247,1.191V3.935a4.975,4.975,0,0,0-.831-.164V1.192a.4.4,0,0,0-.416-.361L1.247.833a.4.4,0,0,0-.416.36v8.2a.366.366,0,0,0,.416.36H8.413a4.956,4.956,0,0,0,.251.829Z" transform="translate(0 2.076)" fill="#080808"></path><path id="Path_51583" data-name="Path 51583" d="M46.073,27.51H41.2V25.294c0-.387.387-.692.941-.692h2.991c.526,0,.941.305.941.692Zm-4.044-.831h3.213V25.433H42.031Z" transform="translate(-36.298 -24.602)" fill="#080808"></path><path id="Path_51584" data-name="Path 51584" d="M34.867,69.516a.982.982,0,0,1-.969-.969V67.3h1.967v1.246A.97.97,0,0,1,34.867,69.516Zm-.138-1.385v.415a.131.131,0,0,0,.138.138.155.155,0,0,0,.167-.138v-.415Z" transform="translate(-31.018 -55.477)" fill="#080808"></path></g><g id="Group_34319" data-name="Group 34319" transform="translate(9.139 6.646)"><path id="Path_51586" data-name="Path 51586" d="M42.146,41.394l1.7,1.7c.021.021.021.041.041.062a.021.021,0,0,0,.021.021.063.063,0,0,0,.021.041v.269a.063.063,0,0,1-.021.041.021.021,0,0,1-.021.021c0,.021-.021.041-.041.062L42.167,45.29a.388.388,0,0,1-.539,0,.329.329,0,0,1-.1-.248.382.382,0,0,1,.1-.248l1.057-1.079H39.97a.373.373,0,1,1,0-.746h2.714l-1.057-1.057a.329.329,0,0,1-.1-.248.382.382,0,0,1,.1-.248.348.348,0,0,1,.519-.02Z" transform="translate(-37.286 -38.72)" fill="#080808"></path><path id="Ellipse_1237" data-name="Ellipse 1237" d="M3.181-1.25A4.427,4.427,0,0,1,7.611,3.181,4.427,4.427,0,0,1,3.181,7.611,4.427,4.427,0,0,1-1.25,3.181,4.427,4.427,0,0,1,3.181-1.25Zm0,8.219A3.789,3.789,0,0,0,6.969,3.181,3.789,3.789,0,0,0,3.181-.608,3.789,3.789,0,0,0-.608,3.181,3.789,3.789,0,0,0,3.181,6.969Z" transform="translate(1.25 1.25)" fill="#080808"></path></g></g></g></svg>
                        Unclaim Selected ({props.selectedRecordsLength})</Button>
                </div>:null} */}
                </div>
            </HeaderComponent>
            <BodyComponent loading={props.loading} allRefs={{ headerRef,footerRef }} className="body-height" >
                <TabContent activeTab={props.activeTabId} className={props.loading ? " " : "h-100"}>
                    {(allowedLabOrdersClaimRight) ? <TabPane className={props.loading ? " " : "h-100"} tabId={1}>
                        { props.activeTabId == "1" ? props.children : null}
                    </TabPane> : null}
                    {<TabPane className={props.loading ? " " : "h-100"} tabId={2}>
                        { props.activeTabId == "2" ? props.children : null}
                    </TabPane>}
                </TabContent>
               
            </BodyComponent>
            {allowedLabOrdersClaimRight ? <FooterComponent ref={footerRef} className="footer px-3 py-2">
                <React.Fragment>
                    {isInfoModelOpen && instruction(footerRef?.current.offsetHeight)}
                    <button type="button" className="btn btn-link link-dark font-12" onClick={() => { setInfoModelOpen(!isInfoModelOpen) }}>
                        Note <NoteIcons aria-hidden="true" modalOpen={!isInfoModelOpen} />
                    </button> 
                </React.Fragment>
            </FooterComponent> : null}
        </React.Fragment>
    )
}

export default ClaimTabs;
