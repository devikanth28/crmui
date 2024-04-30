import React, { useEffect ,useState, useRef, useContext} from "react";
import OrderService from "../../../services/Order/OrderService";
import Validate from "../../../helpers/Validate";
import { Button } from "react-bootstrap";
import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import CloseIcon from '../../../images/cross.svg'
import { BodyComponent, Wrapper, FooterComponent, HeaderComponent } from '../../Common/CommonStructure';
import { AlertContext, UserContext } from "../../Contexts/UserContext";
import { TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import SendSmsToCustomer from '../../../helpers/SendSmsToCustomer';
import CustomerDetails from '../../customer/CustomerDetails';
import DynamicGridHeight from '../../Common/DynamicGridHeight';
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";


const HandleGridForProposalOrder = (props) => {
    const validate = Validate();
    const [dataSet,setDataSet] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});
    const [dataGrid,setGridData] = useState([]);
    const footerRef = useRef(null);
    const headerRef = useRef(null)
    const [editedQtyMapTemp, setEditedQtyMap] = useState({});
    const [qtyMap, setQtyMap] = useState({});
    const [productIdMap, setProductIdMap] = useState({});
    const { setStackedToastContent } = useContext(AlertContext);
    const [loading, isLoading] = useState(false);
    const [onApproveLoader , setOnApproveLoader] = useState(false);
    const [onWithdrawLoader, setOnWithDrawLoader] = useState(false);
    const [approveClicked,isApproveClicked] = useState(false);
    const [withdrawClicked,isWithdrawClicked] = useState(false);
    const userSessionInfo = useContext(UserContext);

    useEffect(() => {
        getProductsForProposedOrder(props.orderId);
      },[props.orderId]);
    
    const getProductsForProposedOrder = async (orderId) => {
        isLoading(true);
        if (validate.isNotEmpty(orderId)) {
            const data = await OrderService().getProductsInProposedOrder({ orderId: orderId })
            if (validate.isNotEmpty(data) && data.statusCode === "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                setGridData(data.dataObject.dataGrid)
                setDataSet(data.dataObject.dataSet[0]);
                setOrderDetails(data.dataObject.dataSet[1]);
                  let qtyMap = {};
                  data.dataObject.dataSet[0].forEach((product,index) => {
                    qtyMap[product.sno] = product.editedQuantity;
                    productIdMap[product.sno] = product.productId;
                  })
            setQtyMap(qtyMap);
            setEditedQtyMap(qtyMap);
        } else {
            setStackedToastContent({toastMessage:data.message, position: TOAST_POSITION.BOTTOM_START});
        }
    }
    isLoading(false);
    }

    const renderQuantityColumn = (props) => {
        const onRowChange = props.onRowChange;
        const row = props.row;
        const column = props.column;
        const handleOnChange = (e) => {
            //const productIndex = dataSet.findIndex((product) => product.productId === props.row.productId);
            setEditedQtyMap({ ...editedQtyMapTemp, [props.row.sno]: e.target.value });
            onRowChange({...row,[column.key] : e.target.value});
        };
        return <React.Fragment>
            <input
                id={"product_"+props.row.productId}
                className="editor-cell form-control"
                type="number"
                onChange={handleOnChange}
                pattern="[0-9]*"
                onKeyDown={(e) => e.stopPropagation()}
                defaultValue={props.row.editedQuantity}               
            />
            </React.Fragment>
    }

    const callBackMapping = {
        "renderQuantityColumn": renderQuantityColumn
    }


    const handleOnClickWithdraw = async () => {
        setOnWithDrawLoader(true);
        isWithdrawClicked(true);
        await OrderService().withdrawProductInProposedOrder({orderId :props.orderId}).then((data) => {
        if (validate.isNotEmpty(data) && data.statusCode == "SUCCESS" && data.message == "SUCCESS") {
            setStackedToastContent({toastMessage : "Your Order "+ props.displayOrderId +" Cancelled Successfully."})
            props.setOpenOrderDetailModal(false);
            props.getUpdatedData();
        }  
       else{
            setStackedToastContent({toastMessage : "failed to Cancel Order "+props.displayOrderId})
            props.getUpdatedData();
        } 
        }).catch((err) => {
            setStackedToastContent({toastMessage : "failed to Cancel Order "+props.displayOrderId})
            console.log(err)
        })
        setOnWithDrawLoader(false);
        isWithdrawClicked(false);
    };

    const validateEntries = () => {
        let valuesApproved = true;
        Object.keys(qtyMap).forEach((each) => {
            if (valuesApproved && (Validate().isEmpty(editedQtyMapTemp[each]) || editedQtyMapTemp[each] < 0 || ! validate.isNumeric(editedQtyMapTemp[each]) || !validate.containsNoRepeatedZeroes(editedQtyMapTemp[each]))) {
                setStackedToastContent({toastMessage:"Invalid Qty for Product Id: " + productIdMap[each], position: TOAST_POSITION.BOTTOM_START});
                valuesApproved = false;
                
            }
            if (valuesApproved && editedQtyMapTemp[each] > qtyMap[each]) {
                setStackedToastContent({toastMessage:"Edited Quantity Should be less than Proposed Quantity for Product Id: " + productIdMap[each], position: TOAST_POSITION.BOTTOM_START});
                valuesApproved = false;
            }
        })
        return valuesApproved;
    }

    const handleOnClickApprove = async() => {
        setOnApproveLoader(true);
        isApproveClicked(true);
        if (validateEntries()) {
            const stringifiedEditedQtyMap = Object.fromEntries(
                Object.keys(editedQtyMapTemp).map(key => [key, editedQtyMapTemp[key].toString()])
              );
              
        await OrderService().approveProductInProposedOrder  ({ "reqParamMap": JSON.stringify(stringifiedEditedQtyMap), "orderId": props.orderId }).then((data) => {
            if(validate.isNotEmpty(data) && data.statusCode === "SUCCESS" && data.message == "success"){
                setStackedToastContent({toastMessage:"Your Order " + props.displayOrderId + " approved  Successfully"});
                props.setOpenOrderDetailModal(false);
                props.getUpdatedData();
            }
           else{
                setStackedToastContent({toastMessage:"failed to approve order "+props.displayOrderId});
                props.getUpdatedData();
            }
        }).catch((err) => {
            console.log(err);
            setStackedToastContent({toastMessage:"failed to approve order "+props.displayOrderId});
        })
        }
        setOnApproveLoader(false);
        isApproveClicked(false);
    };
    return <React.Fragment>
                <div className="custom-modal header">
                <Wrapper className="m-0">
                {!loading && <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-1">
                    {props.displayOrderId !== props.orderId ? 
                    <p className="mb-0">Your Order number: <span className="fw-bold">{props.displayOrderId}/{props.orderId}</span></p>
                    : <p className="mb-0">Your Order number: <span className="fw-bold">{props.displayOrderId}</span></p>}
                    <div class=" d-flex align-items-center">
                                <Button variant=" " onClick={() => props.setOpenOrderDetailModal(false)} className="rounded-5 icon-hover btn-link">
                                <span className='custom-close-btn icon-hover'></span>
                                </Button>
                    </div>
                </HeaderComponent>}
                <BodyComponent  loading={loading} allRefs={{ headerRef, footerRef }} className={'body-height'} >
                {!loading && <React.Fragment>
               <div class="row g-3">
                    <div class="col-4">
                        <div className='card'>
                        <div className='border-bottom d-flex justify-content-between p-12'>
                            <h4 className="mb-0 fs-6">Order Information</h4>
                            <h4 className="mb-0 fs-6">{orderDetails?.deliveryType}</h4>
                        </div>
                        <div className="p-12">
                         <div class="custom-border-bottom-dashed  mb-3">
                        <CustomerDetails customerId={props.proposedOrderObject.customerId} mobileNumber={props.proposedOrderObject.mobileNo} customerName={props.proposedOrderObject.custName} />
                        </div>
                        {userSessionInfo.roles && !(userSessionInfo.roles.includes("ROLE_CRM_MEDI_ASSISIT")) && (orderDetails.status == "I" || orderDetails.status == "A" || orderDetails.status == "E") && orderDetails.orderType !== "KYNZOORDER" &&                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                            dataSet.isRefill == true ? <SendSmsToCustomer orderType="CRM_WITH_REFILL" customerName={props.proposedOrderObject.customerName} mobileNo={props.proposedOrderObject.mobileNo} customerId={props.proposedOrderObject.customerId} displayOrderId={props.displayOrderId} />
                            : <SendSmsToCustomer orderType="CRM" customerName={props.proposedOrderObject.customerName} mobileNo={props.proposedOrderObject.mobileNo} customerId={props.proposedOrderObject.customerId} displayOrderId={props.displayOrderId} />
                        }
                        </div>
                        </div>
                        </div>
                        <div className="col-8" style={{"max-height":"100%"}}>
                        <div class="card p-2">
                        <p class="custom-fieldset mb-1 ps-1">
                         Change Edited Quantity
                         </p>
                            {validate.isNotEmpty(dataSet) && 
                            <DynamicGridHeight dataSet={dataSet} metaData={dataGrid} className="card ">
                              <CommonDataGrid {...dataGrid} dataSet={dataSet} callBackMap={callBackMapping}/>
                             </DynamicGridHeight>}
                            </div>
                        </div>
                        </div>
                </React.Fragment>}
                </BodyComponent>
                {userSessionInfo.roles && userSessionInfo.roles.includes("ROLE_CRM_PROPOSED_ORDER_APPROVE") && <FooterComponent ref={footerRef} className="d-flex footer justify-content-end px-3 py-2">
                <Button variant=" " className="brand-secondary me-3" size="sm" disabled={withdrawClicked} onClick={() => { handleOnClickWithdraw() }}>{onWithdrawLoader ? <CustomSpinners spinnerText={"Withdraw"} className={" spinner-position"} innerClass={"invisible"}/>:"Withdraw"}</Button>
                   
                        { validate.isEmpty(orderDetails.couponCode) && orderDetails.orderType !== "PB_ORDER" && <Button variant="danger" size="sm" disabled={approveClicked} onClick={() => { handleOnClickApprove() }}>{onApproveLoader ? <CustomSpinners spinnerText={"Approve Proposed Edits"} className={" spinner-position"} innerClass={"invisible"}/>:"Approve Proposed Edits"}</Button>}
                       
                </FooterComponent>}
            </Wrapper>
        </div> 
    </React.Fragment>
}

export default HandleGridForProposalOrder;