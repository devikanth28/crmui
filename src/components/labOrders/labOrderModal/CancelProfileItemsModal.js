import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import React, { useContext, useEffect, useRef, useState } from "react";
import Validate from "../../../helpers/Validate";
import CloseIcon from '../../../images/cross.svg';
import LabOrderService from '../../../services/LabOrder/LabOrderService';
import { BodyComponent, HeaderComponent } from '../../Common/CommonStructure';
import { AlertContext } from '../../Contexts/UserContext';
import CancelOrder from '../../order/CancelOrder';
import OrderActionForms from '../../order/OrderActionForms';
import DynamicGridHeight from '../../Common/DynamicGridHeight';
import { Button } from 'react-bootstrap';

const CancelProfileItemsModal = (props) => {

    const validate = Validate();
    const headerRef = useRef(0);
    const labOrderService = LabOrderService();
    const [cancelItemselectedRows, setCancelItemselectedRows] = useState([]);
    const [cancelProfileItemsData, setCancelProfileItemsData] = useState(undefined);
    const [initialLoading, setInitialLoading] = useState(true);
    const [showActionForm, setShowActionForm] = useState("");
    const [selectCancelAllProfileItemsOption, setSelectCancelAllProfileItemsOption] = useState(false);
    const [columnProfileItems, setColumnProfileItems] = useState([]);
    const [selectAllDisabled, setSelectAllDisabled] = useState(false);
    const { setStackedToastContent } = useContext(AlertContext);

    useEffect(() => {
        getTestProfileItems(props.data);
    }, [props.data])

    useEffect(() => {
        if (Validate().isNotEmpty(cancelProfileItemsData) && Validate().isNotEmpty(cancelProfileItemsData.dataSet.testProfileSet)) {
            Object.values(cancelProfileItemsData.dataSet.testProfileSet).map((value) => {
                if (Validate().isNotEmpty(value.orderItemId) && !columnProfileItems.includes(value.orderItemId)) {
                    columnProfileItems.push(value.orderItemId);
                }
                if (!value.checkbox) {
                    setSelectAllDisabled(true);
                }
            })
        }
    }, [cancelProfileItemsData])

    useEffect(() => {
        let cancelProfileItems = [];
        if (selectCancelAllProfileItemsOption) {
            columnProfileItems.forEach((value) => {
                if (Validate().isNotEmpty(value) && !cancelProfileItems.includes(value)) {
                    cancelProfileItems.push(value);
                }
            })
        }
        setCancelItemselectedRows(cancelProfileItems);
    }, [selectCancelAllProfileItemsOption])

    const getTestProfileItems = (orderDetails) => {
        setInitialLoading(true);
        let obj = {
            orderId: orderDetails.orderId,
            profileId: orderDetails.profileId
        }
        props.setDisableMode(true);
        labOrderService.getTestProfileDetails(obj).then((data) => {
            if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                setCancelProfileItemsData(data.dataObject);
            }
            else{
                setStackedToastContent({toastMessage:data.message})
            }
            setInitialLoading(false);
            props.setDisableMode(false);
        }).catch((err) => {
            console.log(err)
            setInitialLoading(false);
            props.setDisableMode(false);
            setStackedToastContent({toastMessage:data.message})
        });
    }

    const toggle = () => props.setCancelProfileItemsFlag(!props.cancelProfileItemsFlag);

    const checkboxAction = {
        "checkboxActionHeader": (props) => {
            return <React.Fragment>
                {!selectAllDisabled ? <input type={'checkbox'} checked={columnProfileItems.length === cancelItemselectedRows.length} onChange={() => {setSelectCancelAllProfileItemsOption(!selectCancelAllProfileItemsOption); setShowActionForm(undefined)}} /> :
                    <input type={'checkbox'} style={{ "background": "gray" }} disabled />}
            </React.Fragment>
        },
        "checkboxAction": (props) => {
            const { row } = props
            return <React.Fragment>
                {row.checkbox ? <input type={'checkbox'} checked={cancelItemselectedRows && cancelItemselectedRows.indexOf(row.orderItemId) != -1} onChange={() => { handleCheckboxSelect(row.orderItemId); setShowActionForm(undefined) }} /> :
                    <input type={'checkbox'} style={{ "background": "gray" }} disabled />}
            </React.Fragment>
        }
    }

    const handleCheckboxSelect = (columnTestId) => {
        if (validate.isNotEmpty(cancelItemselectedRows) && cancelItemselectedRows.indexOf(columnTestId) != -1) {
            let newArrays = cancelItemselectedRows.filter((id) => id !== columnTestId)
            setCancelItemselectedRows(newArrays);
        } else if (validate.isNotEmpty(cancelItemselectedRows)) {
            setCancelItemselectedRows([...cancelItemselectedRows, columnTestId]);
        } else {
            setCancelItemselectedRows([columnTestId]);
        }
    }
    const canceOrderInfo={
        title: "Do you want to cancel this profile items",
        orderId: `${props.displayOrderId}/${props.orderId}`,
        placeholder: "Please specify reason for cancellation",
        buttonText: "Yes Cancel this profile items"
}
    return <React.Fragment><div className="height100vh custom-modal">
        <div className="custom_gridContainer_fullwidth_forms">
            <div className="forms">
                <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                    Order Details for OrderId: {props.orderId}
                    <div class="d-flex align-items-center">
                        <Button variant=" " disabled={props.disableMode} onClick={toggle} className="rounded-5 icon-hover btn-link">
                        <span className='custom-close-btn icon-hover'></span>
                        </Button>
                    </div>
                </HeaderComponent>
                <BodyComponent loading={initialLoading} allRefs={{ headerRef }} className="height100vh" >
                    {(!initialLoading && validate.isNotEmpty(cancelProfileItemsData) && validate.isNotEmpty(cancelProfileItemsData.dataSet) && validate.isNotEmpty(cancelProfileItemsData.dataSet.testProfileSet)) && <div /* className={`h-100`} */>
                        <div className="mb-3 p-1" >
                            <div>Profile :{cancelProfileItemsData.dataSet.profileName}</div>
                            <DynamicGridHeight metaData={cancelProfileItemsData.dataGrid} dataSet={[...cancelProfileItemsData.dataSet.testProfileSet]} className="card"> 
                            <CommonDataGrid {...cancelProfileItemsData.dataGrid} dataSet={[...cancelProfileItemsData.dataSet.testProfileSet]}
                                callBackMap={checkboxAction}
                                selectedRows={cancelItemselectedRows}
                                onRowSelectionCallback={setCancelItemselectedRows} 
                            />
                            </DynamicGridHeight>
                            
                            {validate.isNotEmpty(cancelItemselectedRows) && <button className="btn btn-sm brand-secondary mt-3 float-end"  disabled={validate.isNotEmpty(showActionForm) || props.disableMode } onClick={() => { setShowActionForm("labCancelForm") }}>Cancel Items</button>}
                            {/* {validate.isNotEmpty(showActionForm) && <OrderActionForms cancelProfileTests onlyTestCancellation cancelOrderIds={cancelItemselectedRows} actionFormToRender={showActionForm} orderId={props.orderId} reloadPage={props.reloadPage} setReloadPage={props.setReloadPage} onSubmitClick={props.onSubmitClick} setShowActionForm={setShowActionForm} setDisableMode={props.setDisableMode} disableMode={props.disableMode}/>} */}
                            {validate.isNotEmpty(showActionForm) && <CancelOrder cancelProfileTests onlyTestCancellation cancelOrderIds={cancelItemselectedRows} showCancelModal={showActionForm} setShowCancelModal={setShowActionForm} orderId={props.orderId} reloadPage={props.reloadPage} setReloadPage={props.setReloadPage} onSubmitClick={props.onSubmitClick} setShowActionForm={setShowActionForm} setDisableMode={props.setDisableMode} disableMode={props.disableMode} orderInfo ={canceOrderInfo}/>}
                        </div>
                    </div>
                    }
                </BodyComponent>
            </div>
        </div>
    </div>
    </React.Fragment>
}
export default CancelProfileItemsModal;