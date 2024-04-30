import CommonDataGrid from "@medplus/react-common-components/DataGrid"
import React, { useContext, useEffect, useRef, useState } from "react"
import PrescriptionService from "../../services/Prescription/PrescriptionService"
import Validate from "../../helpers/Validate"
import { SidebarContext } from "../Contexts/UserContext"
import NoDataFound from "../Common/NoDataFound"
import OrderHelper from "../../helpers/OrderHelper"
import DynamicGridHeight from "../Common/DynamicGridHeight"
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm"

export default ({setStackedToastContent,...props}) => {
    const validate = Validate();

    const headerRef = useRef(null);
    const { setSidebarCollapsedFlag } = useContext(SidebarContext);  
    const [loading, setLoading] = useState(true);
    const [noPrescDataFound, setNoPrescDataFound] = useState(false);
    const [omsDataGrid, setOmsDataGrid] = useState({});
    const [currentOmsOrders, setCurrentOmsOrders] = useState([]);
    const [recentOmsOrders, setRecentOmsOrders] = useState([]);
    const [previousOmsOrders, setPreviousOmsOrders] = useState([]);
    const [prescDataGrid, setPrescDataGrid] = useState({});
    const [prescDataSet, setPrescDataSet] = useState({});

    useEffect(()=>{
        PrescriptionService().getAssociatedOrders({ recordId: props.recordId, prescriptionOrderId: props.prescriptionOrderId ?? "", customerId: props.customerId }).then(res => {
            setLoading(true);
            if (validate.isNotEmpty(res) && validate.isNotEmpty(res.statusCode) && "SUCCESS" == res.statusCode) {
                if (validate.isEmpty(res.dataObject)) {
                    setNoPrescDataFound(true);
                } else {
                    setPrescDataGrid(res.dataObject.PRESCRIPTION_DATAGRID ? res.dataObject.PRESCRIPTION_DATAGRID : {});
                    setPrescDataSet(res.dataObject.PRESCRIPTION_DATASET ? res.dataObject.PRESCRIPTION_DATASET : {});
                    setOmsDataGrid(res.dataObject.OMS_DATAGRID ? res.dataObject.OMS_DATAGRID : {});
                    if(validate.isNotEmpty(res.dataObject.OMS_DATASET)){
                        setCurrentOmsOrders(validate.isNotEmpty(res.dataObject.OMS_DATASET.CURRENT_OMS_ORDERS) ? res.dataObject.OMS_DATASET.CURRENT_OMS_ORDERS : []);
                        setRecentOmsOrders(validate.isNotEmpty(res.dataObject.OMS_DATASET.RECENT_OMS_ORDERS) ? res.dataObject.OMS_DATASET.RECENT_OMS_ORDERS : []);
                        setPreviousOmsOrders(validate.isNotEmpty(res.dataObject.OMS_DATASET.PREVIOUS_OMS_ORDERS) ? res.dataObject.OMS_DATASET.PREVIOUS_OMS_ORDERS : []);
                    }
                    setNoPrescDataFound(false);
                }
                setLoading(false);
            } else {
                setNoPrescDataFound(true);
                setLoading(false);
                validate.isNotEmpty(res.message) ? setStackedToastContent({ toastMessage: res.message }) : setStackedToastContent({ toastMessage: "Something went wrong" });
            }
        }).catch(error => {
            console.log("Error Occured while fetching Associated Orders : ", error);
            setLoading(false);
        })
    },[props.recordId]);
   

    function renderOrderIdColumn(orderInfo) {
        return <React.Fragment>
            <a className='pb-5 mb-4' style={{ height: "0px", width: "0px" }} target={props.customerId} onClick={() => {setSidebarCollapsedFlag(true); props.setMartOrderInfo(orderInfo.row); props.setOpenOrderDetailModal(true) }}>{orderInfo.row.displayOrderId}</a>
        </React.Fragment>
    }

    function renderStatusColumn(props) {
        let statusCellClass = OrderHelper().getBadgeColorClassForStatus(props.row.status) + " badge rounded-pill";
        return <React.Fragment>
            <div className={statusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.status)}</div>
        </React.Fragment>
    }

    const callBackMapping = {
        "renderDisplayOrderIdColumn": renderOrderIdColumn,
        "renderStatusColumn": renderStatusColumn,
    }

    const getLatestOMSOrders = ({startIndex,limit}) =>{
        let endIndex = validate.isNotEmpty(currentOmsOrders) ? startIndex + limit < currentOmsOrders.length ? startIndex+limit : currentOmsOrders.length : startIndex + limit < recentOmsOrders.length ? startIndex+limit : recentOmsOrders.length;
        const dataSet = validate.isNotEmpty(currentOmsOrders) ? currentOmsOrders.slice(startIndex,endIndex) : recentOmsOrders.slice(startIndex,endIndex);
        return { dataSet: dataSet, totalRowsCount:validate.isNotEmpty(currentOmsOrders) ? currentOmsOrders.length : recentOmsOrders.length , status: true }
    }

    const getPrescriptionOrders = ({startIndex,limit,totalRecords}) =>{
        const endIndex = startIndex + limit < prescDataSet.length ? startIndex+limit : prescDataSet.length;
        return { dataSet: prescDataSet.slice(startIndex,endIndex), totalRowsCount: totalRecords , status: true }
    }
    const getPreviousOMSOrders = ({startIndex,limit}) =>{
       const endIndex = startIndex + limit < previousOmsOrders.length ? startIndex+limit : previousOmsOrders.length;
        return { dataSet: previousOmsOrders.slice(startIndex,endIndex), totalRowsCount: previousOmsOrders.length, status: true }
    }

    return (
        <React.Fragment>
            <div className={`h-100`}>
                {loading ? <div className="d-flex justify-content-center h-100">
                    <CustomSpinners outerClassName={"align-items-center d-flex flex-column custom-spinner"} spinnerText={"Please wait while loading Assocaited Orders"} animation="border" variant="brand" />
                </div> : <React.Fragment>
                    {noPrescDataFound && <NoDataFound text={'No Orders Found'} />}
                    {omsDataGrid && (validate.isNotEmpty(currentOmsOrders) || validate.isNotEmpty(recentOmsOrders)) && <div className="mb-3">
                        <label className="custom-fieldset mb-2">{validate.isNotEmpty(currentOmsOrders) ? 'Current Orders' : 'Recent Orders'}</label>
                        <DynamicGridHeight id="current-orders" className="card scroll-grid-on-hover" metaData={omsDataGrid} dataSet={validate.isNotEmpty(currentOmsOrders) ? currentOmsOrders : recentOmsOrders}>
                            <CommonDataGrid {...omsDataGrid}
                                dataSet={validate.isNotEmpty(currentOmsOrders) ? currentOmsOrders.slice(0, 10) : recentOmsOrders.slice(0, 10)}
                                callBackMap={callBackMapping}
                                remoteDataFunction={getLatestOMSOrders}
                            />
                        </DynamicGridHeight>
                    </div>}
                    {omsDataGrid && validate.isNotEmpty(previousOmsOrders) && <div className="mb-3">
                        <label className="custom-fieldset mb-2">Other Orders</label>
                        <DynamicGridHeight id="previous-orders" className="card scroll-grid-on-hover" dataSet={previousOmsOrders} metaData={omsDataGrid}>
                            <CommonDataGrid {...omsDataGrid}
                                dataSet={previousOmsOrders.slice(0, 10)}
                                callBackMap={callBackMapping}
                                remoteDataFunction={getPreviousOMSOrders}
                            />
                        </DynamicGridHeight>
                    </div>}
                    {validate.isNotEmpty(prescDataGrid) && validate.isNotEmpty(prescDataSet) && <div>
                        <label className="custom-fieldset mb-2">Prescription Orders</label>
                        <DynamicGridHeight id="prescription-orders" className="card scroll-grid-on-hover" dataSet={prescDataSet} metaData={prescDataGrid}>
                            <CommonDataGrid {...prescDataGrid}
                                dataSet={prescDataSet.slice(0, 10)}
                                callBackMap={callBackMapping}
                                remoteDataFunction={getPrescriptionOrders}
                            />
                        </DynamicGridHeight>
                    </div>}
                </React.Fragment>}
            </div>
        </React.Fragment>
    )

}