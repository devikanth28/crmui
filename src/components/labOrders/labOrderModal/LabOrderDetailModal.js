import React, { useContext, useEffect, useRef, useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { getLabStausBadgeColourClass } from "../../../helpers/LabOrderHelper";
import Validate from "../../../helpers/Validate";
import CloseIcon from '../../../images/cross.svg';
import LabOrderService from "../../../services/LabOrder/LabOrderService";
import { BodyComponent, HeaderComponent, Wrapper } from "../../Common/CommonStructure";
import { AlertContext } from "../../Contexts/UserContext";
import LabOrderModal from "./LabOrderModal";
import { Claim, Unclaim } from "@medplus/react-common-components/DataGrid";
import OrderService from "../../../services/Order/OrderService";
import { ERROR_CODE, RECORD_TYPE } from "../../../helpers/HelperMethods";
import CommonConfirmationModal from "../../Common/ConfirmationModel";
import { TOAST_POSITION } from "@medplus/react-common-components/DynamicForm";
import { Button } from "react-bootstrap";

export default (props) => {
    const headerRef = useRef(0);


    const validate = Validate();

    const [dataGrid, setDataGrid] = useState(undefined);
    const [dataSet, setDataSet] = useState(undefined);
    const [cartOrderIds,setCartOrderIds] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [reloadPage, setReloadPage] = useState(false);
    const [orderStatus, setOrderStatus] = useState(undefined);
    const [orderTab,setOrderTab] = useState(props.orderId);
    const [orderIdsInfo,setOrderIdsInfo] = useState({});
    const [toggleConfirmation, setToggleConfirmation] = useState(false);
    const [forceClaimMessage, setForceClaimMessage] = useState(null);
    const {setAlertContent, setStackedToastContent} = useContext(AlertContext);
    const [showClaimButton, setShowClaimButton] = useState(false);
    const [showUnclaimButton, setShowUnclaimButton] = useState(false);

    useEffect(() => {
        if (orderTab in orderIdsInfo) {
            setDataSet(orderIdsInfo[orderTab]);
        } else {
            labOrderDetail(orderTab);
        }
    //     {Validate().isNotEmpty(orderIdsInfo[orderTab]) && (Validate().isNotEmpty(orderIdsInfo[orderTab].status) && orderIdsInfo[orderTab].status != "Cancelled") ? 
    //  {Validate().isNotEmpty(orderIdsInfo[orderTab]) ? ((Validate().isEmpty(orderIdsInfo[orderTab].claimedBy) || orderIdsInfo[orderTab].claimedBy=="O"  )?
        if (props.fromPage !== "FollowupForm" && Validate().isNotEmpty(orderIdsInfo[orderTab]) && orderIdsInfo[orderTab].status!="Cancelled" && props.allowedLabOrderClaimRight == true) {
            if ((Validate().isEmpty(orderIdsInfo[orderTab].claimedBy) || orderIdsInfo[orderTab].claimedBy == "O")) {
                setShowClaimButton(true);
                setShowUnclaimButton(false);
            } else {
                setShowUnclaimButton(true);
                setShowClaimButton(false);
            }
        }
        else {
            setShowUnclaimButton(false);
            setShowClaimButton(false);
        }
    }, [orderTab, orderIdsInfo]);

    useEffect(() => {
        let timeOutId ;
        if(reloadPage) {
           timeOutId =  setTimeout(() => {
                labOrderDetail(orderTab);
            },500)
        }
        return () => {
            if(timeOutId) {
                clearTimeout(timeOutId);
            }
        }
    }, [reloadPage]);

    const labOrderDetail = (orderId) => {
        setInitialLoading(true);
        props.setDisableMode(true);
        LabOrderService().labOrderDetail({ "orderId": orderId, status: orderStatus }).then((response) => {
            if ("SUCCESS" === response.statusCode && validate.isNotEmpty(response.dataObject) && validate.isNotEmpty(response.dataObject.dataGrids) && validate.isNotEmpty(response.dataObject.dataSet)) {
                props.setSelectedOrderId(orderId);
                setDataGrid(response.dataObject.dataGrids);
                setDataSet(response.dataObject.dataSet);
                setOrderIdsInfo({...orderIdsInfo, [orderId]:response.dataObject.dataSet});
                if(validate.isNotEmpty(response.dataObject.dataSet.cartOrderIds)){
                    setCartOrderIds(response.dataObject.dataSet.cartOrderIds);
                    setOrderTab(response.dataObject.dataSet.orderId);
                }
            }
            else if(response.statusCode === "FAILURE"){
                setStackedToastContent({toastMessage:response.message})
            }
            setInitialLoading(false);
            props.setDisableMode(false)
            setReloadPage(false);
        }).catch(err => {
            console.log(err);
            setStackedToastContent({toastMessage:"something went wrong"})
            setInitialLoading(false);
            props.setDisableMode(false)
            setReloadPage(false);
        })
    }

    const toggle = () => {
        props.handleOrderDetailsModal(!props.showOrderDeatilsModal);
    }


    const claimOrder=(forceClaimFlag)=>{
            let claimObject = {
                recordIds: orderIdsInfo[orderTab].orderId,
                recordType: RECORD_TYPE.LAB_ORDER,
                claimStatus: "C",
                forceClaimFlag:forceClaimFlag,
              };
              OrderService().claimOrUnclaimOrder(claimObject)
                    .then((data) => {
                        if(data.statusCode == "SUCCESS"){
                        setForceClaimMessage(null);
                        props.processClaimAction(claimObject.recordIds, [claimObject.recordIds])
                        const orderInfo = orderIdsInfo[orderTab];
                        setOrderIdsInfo({...orderIdsInfo,[orderTab] : {
                            ...orderInfo,
                            claimedBy:"S"
                        }});
                        props.onSubmitClick(claimObject.recordIds);
                        setShowUnclaimButton(true);
                        setShowClaimButton(false);
                      }
                        if(data.statusCode == "FAILURE"){
                            if(Validate().isNotEmpty(data.dataObject.errorCode)){
                                if(data.dataObject.errorCode == ERROR_CODE.ALREADY_CLAIMED){
                                    setForceClaimMessage(data.message);
                                    setToggleConfirmation(true);
                                    setForceClaimMessage(data.message);
                                    setToggleConfirmation(true);
                                } else {
                                    setStackedToastContent({toastMessage:data.message})
                                }
                            }
                        }
                    })
                .catch((error) => {
                  console.log('Claim request failed:', error);
                });
        }
    
        const unclaimOrderOnClick =()=> {
            let claimObject = {
                recordIds: orderIdsInfo[orderTab].orderId,
                recordType: RECORD_TYPE.LAB_ORDER,
                claimStatus: "U",
              };
              OrderService().claimOrUnclaimOrder(claimObject)
                  .then((data) => {
                      if(data.statusCode == "SUCCESS"){
                        const orderInfo = orderIdsInfo[orderTab];
                        setOrderIdsInfo({...orderIdsInfo,[orderTab] : {
                            ...orderInfo,
                            claimedBy:undefined
                        }})
                        setForceClaimMessage(null);
                        props.processClaimAction(claimObject.recordIds, [claimObject.recordIds]);
                        props.onSubmitClick(claimObject.recordIds);
                      }
                      else if(data.statusCode == "FAILURE"){
                        setStackedToastContent({ toastMessage: data.message, position: TOAST_POSITION.BOTTOM_START })
                        if(Validate().isNotEmpty(data.dataObject.errorCode) && data.dataObject.errorCode == ERROR_CODE.ALREADY_UNCLAIMED){
                            orderIdsInfo[orderTab].claimedBy = undefined;
                        } else if (Validate().isNotEmpty(data.dataObject.errorCode) && data.dataObject.errorCode == ERROR_CODE.ALREADY_CLAIMED){
                            orderIdsInfo[orderTab].claimedBy = "O";
                        }
                      }
                      setShowUnclaimButton(false)
                      setShowClaimButton(true);
                  })
              .catch((error) => {
                console.log('Claim request failed:', error);
              });
        }

        const ForceClaimClick =()=>{
            if (orderIdsInfo[orderTab].claimedBy=="O"){
                claimOrder(false);
            }
        }

    const prepareLabOrderHeader = () => {
        if (validate.isNotEmpty(cartOrderIds)) {
            return <div className="align-items-center d-flex justify-content-between px-lg-3 px-2 py-1 border-bottom">
                {cartOrderIds.length > 1 ? <React.Fragment>
                    <p className="d-flex align-items-center mb-0 flex-wrap" style={{maxWidth: "90%"}}>
                        <span className="hide-on-mobile ms-2">Details for Cart ID - </span> 
                        <span className="fw-bold text-truncate me-3 ms-1">{dataSet.orderInformation.CartId}</span>
                        <span className={`${getLabStausBadgeColourClass(dataSet.status)} badge rounded-pill`}>{dataSet.status}</span>
                        </p>
                    <div class=" d-flex align-items-center">
                        <Button variant=" " onClick={toggle} className="rounded-5 icon-hover btn-link">
                        <span className='custom-close-btn icon-hover'></span>
                        </Button>
                    </div>
                </React.Fragment> : <React.Fragment>
                    <p className="d-flex align-items-center mb-0 flex-wrap" style={{maxWidth: "90%"}}> 
                        <span className="hide-on-mobile">Details for Order ID -</span> 
                        <span class="fw-bold text-truncate me-3 ms-1">{dataSet.displayOrderId}({dataSet.orderId})</span>
                        <span className={`${getLabStausBadgeColourClass(dataSet.status)} badge rounded-pill`}>{dataSet.status}</span>
                        </p>
                    <div className="d-flex align-items-center">
                        <Button variant=" " onClick={toggle} className="rounded-5 icon-hover btn-link">
                        <span className='custom-close-btn icon-hover'></span>
                        </Button>
                    </div>
                </React.Fragment>}</div>
        }
    }

    const prepareCartTabsHeader = () => {
        return(
            <React.Fragment>
                {cartOrderIds.length  > 1 ?
                <div className="custom-tabs-forms mobile-compatible-tabs pb-0 border-bottom">
                    <Nav tabs>
                        {
                            cartOrderIds.map((value, index) => {
                                return <NavItem>
                                    <NavLink className={`${value === orderTab ? "active" : ""}`} onClick={() => {setOrderTab(value)}}>
                                        {`Order ${index+1} - ` + value}
                                    </NavLink>
                                </NavItem>
                            })
                        }
                    </Nav>
                </div>:""}
            </React.Fragment>
        );
    }

    const prepareCartTabs = () =>{
        return (
            <React.Fragment>                
                {cartOrderIds.length > 1 ? 
                <TabContent activeTab={orderTab} className="h-100">
                    {
                        cartOrderIds.map((value, index) => {
                            return <TabPane tabId={value} className="h-100">
                                {value === orderTab &&
                                    <div className={`h-100`}>
                                        <LabOrderModal hideHeaderButtons={props.hideHeaderButtons} fromPage={"LAB"} orderIdsInfo={orderIdsInfo} orderTab={orderTab} setToggleConfirmation={setToggleConfirmation} ForceClaimClick={ForceClaimClick} dataGrid={dataGrid} dataSet={dataSet} showClaimButton={showClaimButton} showUnclaimButton={showUnclaimButton} handleLabOrderCancel={props.handleLabOrderCancel}  setReloadPage={setReloadPage} reloadPage={reloadPage} setOrderStatus={setOrderStatus} onSubmitClick={props.onSubmitClick} setDisableMode = {props.setDisableMode} disableMode = {props.disableMode}/>
                                    </div>
                                }
                            </TabPane>
                        })
                    }
                </TabContent> : 
                     <div className={`h-100`}>
                     <LabOrderModal fromPage={"LAB"} hideHeaderButtons={props.hideHeaderButtons} orderIdsInfo={orderIdsInfo} orderTab={orderTab} setToggleConfirmation={setToggleConfirmation} ForceClaimClick={ForceClaimClick} dataGrid={dataGrid} dataSet={dataSet} showClaimButton={showClaimButton} showUnclaimButton={showUnclaimButton} handleLabOrderCancel={props.handleLabOrderCancel}  setReloadPage={setReloadPage} reloadPage={reloadPage} setOrderStatus={setOrderStatus} onSubmitClick={props.onSubmitClick} setDisableMode = {props.setDisableMode} disableMode = {props.disableMode}/>
                 </div> }
            </React.Fragment>
        )
    }

    const forceClaimSubmit=()=>{
        claimOrder(true);
    }

    return <React.Fragment>
        <div className="custom-modal header">
            <Wrapper className="m-0">
                {validate.isNotEmpty(dataSet) && validate.isNotEmpty(cartOrderIds) &&
                <HeaderComponent ref={headerRef} className="d-flex flex-column">
                    {prepareLabOrderHeader()}
                    {(!initialLoading && validate.isNotEmpty(dataSet)) && validate.isNotEmpty(cartOrderIds) && prepareCartTabsHeader()}
                </HeaderComponent>}
                <BodyComponent loading={initialLoading} allRefs={{ headerRef }} className={`body-height pe-1 ${props.bodyHeightClass ? props.bodyHeightClass : ""}`} >
                    {(!initialLoading && validate.isNotEmpty(dataSet)) && validate.isNotEmpty(cartOrderIds) && prepareCartTabs()}
                </BodyComponent>
            </Wrapper>
        </div>
        {toggleConfirmation && <CommonConfirmationModal justcenter={true} isConfirmationPopOver={true} setConfirmationPopOver={setToggleConfirmation} onSubmit={() => Validate().isNotEmpty(forceClaimMessage) ? forceClaimSubmit() : Validate().isEmpty(orderIdsInfo[orderTab].claimedBy) ? claimOrder(false) : unclaimOrderOnClick()} buttonText={`Yes, ${Validate().isEmpty(orderIdsInfo[orderTab].claimedBy) ? "Claim":"UnClaim"} This Order`} message={Validate().isNotEmpty(forceClaimMessage) ? forceClaimMessage +", Do you Want to Force Claim the Order "+ orderIdsInfo[orderTab].orderId : Validate().isEmpty(orderIdsInfo[orderTab].claimedBy) ? "Are you sure to Claim the Order "+ orderIdsInfo[orderTab].orderId : "Are you sure to Unclaim the Order " + orderIdsInfo[orderTab].orderId}   headerText={<div className="d-flex">{orderIdsInfo[orderTab].claimedBy=="S" ? "Unclaim " : "Claim "} Confirmation</div>} /> }
    </React.Fragment>
} 