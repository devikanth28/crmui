
import qs from 'qs';
import React, { useEffect, useRef, useState, useContext } from 'react';
import Validate from "../../helpers/Validate";
import OrderService from '../../services/Order/OrderService';
import { BodyComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure';
import { MART_ORDER_DASHBOARD_ORDER_SEQUENCE } from './Constants';
import OrderCountBadges from './OrderCountBadges';
import OrderDashboardBarGraph from './OrderDashboardBarGraph';
import LabOrderDashboardForm from './LabOrderDashboardForm';
import { AlertContext, UserContext } from "../Contexts/UserContext";
import dateFormat from 'dateformat';
import NoDataFound from '../Common/NoDataFound';

function OrderDashboard(props) {
    const orderService = OrderService();
    const [orderCount, setOrderCount] = useState({});
    const [loading, setLoading] = useState(true);
    const headerRef = useRef(null);
    const validate = Validate();
    const [fdate, setFdate] = useState("");
    const [tdate, setTdate] = useState("");
    const [hubid, setHubid] = useState("");
    const [collectionCenterId, setCollectionCenterId] = useState("");
    const [hubStoreName, setHubStoreName] = useState("");
    const [collectionCenterName, setCollectionCenterName] = useState("");
    const [dateDiff, setDateDiff] = useState(0);
    const { setStackedToastContent } = useContext(AlertContext);
    const [noDataFound, setNoDataFound] = useState(false);
    const userSessionInfo = useContext(UserContext);

    useEffect(() => {
        let params = {};
        getOrderDashboardData(params, null, null);

    }, []);

    const getOrderDashboardData = async (params, hubStoreName, collectionCenterName) => {
        setLoading(true);
        if (validate.isNotEmpty(hubStoreName)) {
            setHubStoreName(hubStoreName);
        } else {
            setHubStoreName("");
        }
        if (validate.isNotEmpty(collectionCenterName)) {
            setCollectionCenterName(collectionCenterName);
        } else {
            setCollectionCenterName("");
        }
        const data = await getData(params);
        if (validate.isNotEmpty(data)) {
            setOrderCount(data.ordersCount);
            setFdate(data.fromDate);
            setTdate(data.toDate);
            setHubid(data.hubId);
            setCollectionCenterId(data.collectionCenterId);
            setLoading(false);
            if (validate.isNotEmpty(data.fromDate) && validate.isNotEmpty(data.toDate)) {
                let difference = new Date(data.toDate).getTime() - new Date(data.fromDate).getTime();
                setDateDiff(difference / (1000 * 60 * 60 * 24) + 1);
            }
            setNoDataFound(false);
        }
        const valuesArray = Object.values(data.ordersCount);
        if (valuesArray.every((value) => value === 0)) {
            setNoDataFound(true);
        }

    }

    const getData = async (params) => {
        const data = await orderService.getLabOrdersCount(params);
        if (data && data.statusCode === "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
            return data.dataObject;
        } else if (Validate().isNotEmpty(data.message)) {
            setStackedToastContent({ toastMessage: data.message })
        }
    }

    const handleOrderStatusClick = (statusKey) => {
        let finalorderSearchCriteria = {
            status: statusKey
        };
        if (validate.isNotEmpty(hubid)) {
            finalorderSearchCriteria.hubId = hubid
        }
        if (validate.isNotEmpty(collectionCenterId)) {
            finalorderSearchCriteria.collectionCenterId = collectionCenterId
        }
        if (validate.isNotEmpty(fdate)) {
            finalorderSearchCriteria.fromDate = dateFormat(fdate, "yyyy-mm-dd") + " 00:00:00";
        }
        if (validate.isNotEmpty(tdate)) {
            finalorderSearchCriteria.toDate = dateFormat(tdate, "yyyy-mm-dd") + " 23:59:59";
        }
        if (validate.isNotEmpty(userSessionInfo.roles) && (userSessionInfo.roles.includes("ROLE_CRM_CC_LAB_ORDER_SEARCH") || userSessionInfo.roles.includes("ROLE_CRM_LAB_ORDER_SEARCH")))
            props.history.push(`/customer-relations/ui/labOrder/searchResults?${qs.stringify(finalorderSearchCriteria)}`);
        else
            setStackedToastContent({ toastMessage: "You don't have permissions to access this page." });
    }

    return (
        <React.Fragment>
            <Wrapper showHeader={false}>
                <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                    <p className="mb-0">Lab Order Dashboard</p>
                </HeaderComponent>
                <BodyComponent loading={loading} allRefs={{ headerRef }} className="overflow-hidden body-height">
                    {!loading && <div className={'h-100'}>
                        <div className='row g-3 h-100'>
                            <div className='col-12 col-xl-4 col-xxl-4 h-100'>
                                {validate.isNotEmpty(orderCount) && dateDiff > 0 && <OrderCountBadges orderCount={orderCount} orderSequence={MART_ORDER_DASHBOARD_ORDER_SEQUENCE.lab} dateDifferences={dateDiff} handleOrderStatusClick={handleOrderStatusClick} />}
                            </div>
                            <div className='col-8 h-100 d-none d-lg-none d-xl-flex d-xxl-flex'>
                                <div className='card h-100 w-100'>
                                    <div className='h-100 overflow-y-auto p-12 scroll-on-hover'>
                                        {validate.isNotEmpty(fdate) && validate.isNotEmpty(tdate) && <LabOrderDashboardForm orderCount={orderCount} setOrderCount={(countvalues) => { setOrderCount({ countvalues }) }} getOrderDashboardData={getOrderDashboardData} fromDate={fdate} toDate={tdate} hubStoreName={hubStoreName} collectionCenterName={collectionCenterName} type="lab" noDataFoundFlag={noDataFound} setNoDataFound={setNoDataFound} />}
                                        {noDataFound == false ? <OrderDashboardBarGraph orderCount={orderCount} type="lab" />
                                            :
                                            <><div class='card mt-3 ' style={{ 'height': 'calc(100% - 156px)' }}><NoDataFound text="No records found based on the given criteria. Try with other details!" /></div></>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                </BodyComponent>
            </Wrapper>
        </React.Fragment>
    )
}

export default OrderDashboard;