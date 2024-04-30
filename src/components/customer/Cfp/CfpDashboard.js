
import qs from 'qs';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { getDateInYMDFormat } from '../../../helpers/HelperMethods';
import Validate from '../../../helpers/Validate';
import CustomerService from '../../../services/Customer/CustomerService';
import { BodyComponent, HeaderComponent, Wrapper } from '../../Common/CommonStructure';
import NoDataFound from '../../Common/NoDataFound';
import { AlertContext } from '../../Contexts/UserContext';
import { MART_ORDER_DASHBOARD_ORDER_SEQUENCE } from '../../OrderDashboard/Constants';
import OrderCountBadges from '../../OrderDashboard/OrderCountBadges';
import OrderDashboardBarGraph from '../../OrderDashboard/OrderDashboardBarGraph';
import CfpActionsStatusCountForm from './CfpActionsStatusCountForm';
import CfpStateWiseStoreInfoDashboard from './CfpStateWiseStoreInfoDashboard';

function CfpDashboard(props) {

    const [loading, setLoading] = useState(false);
    const [activeTabId,setActiveTabId] = useState(1)
    const headerRef = useRef(null);
    const validate = Validate();
    const { setStackedToastContent } = useContext(AlertContext);
    const [cfpActionsCount, setCfpActionsCount] = useState({});
    const [requestedDateRange, setRequestedDateRange] = useState({fromDate: getDateInYMDFormat(), toDate: getDateInYMDFormat()})
    const [dateDifference, setDateDifference] = useState(1);
    const [noDataFound, setNoDataFound] = useState(false);

    useEffect(() => {
        getStatusWiseCfpActionsCount();
    }, []);

    const getStatusWiseCfpActionsCount = async (fromDate, toDate) => {
        setLoading(true);
        if(validate.isNotEmpty(fromDate) && validate.isNotEmpty(toDate)){
            setRequestedDateRange({fromDate: fromDate, toDate: toDate});
            let difference = new Date(toDate).getTime() - new Date(fromDate).getTime();
            setDateDifference(difference / (1000 * 60 * 60 * 24) + 1);
        }
        await CustomerService().getStatusWiseCfpActionsCount({ fromDate: fromDate ? fromDate : getDateInYMDFormat(), toDate: toDate ? toDate : getDateInYMDFormat() }).then(data => {
            if (data && data.statusCode === "SUCCESS" && validate.isNotEmpty(data.dataObject) && validate.isNotEmpty(data.dataObject.statusWiseActionsCount)) {
                setCfpActionsCount(data.dataObject.statusWiseActionsCount);
                setNoDataFound(false);
                const valuesArray = Object.values(data.dataObject.statusWiseActionsCount);
                if (valuesArray.every((value) => value === 0)) {
                    setNoDataFound(true);
                }
            } else {
                setStackedToastContent({ toastMessage: "Error while fetching data, Please Try Again!" });
            }
        }).catch((err) => {
            setStackedToastContent({ toastMessage: "Something went wrong, Please Try Again!" });
        });
        setLoading(false);
    }

    const handleOrderStatusClick = (statusKey) => {
        let finalorderSearchCriteria = {
            status: statusKey
        };
        if(validate.isNotEmpty(requestedDateRange.fromDate) && validate.isNotEmpty(requestedDateRange.toDate)){
            finalorderSearchCriteria.fromDate = requestedDateRange.fromDate;
            finalorderSearchCriteria.toDate = requestedDateRange.toDate;
            props.history.push(`/customer-relations/ui/cfpSearch?${qs.stringify(finalorderSearchCriteria)}`);
        }
    }

    return (
        <React.Fragment>
            <Wrapper showHeader={false}>
                <HeaderComponent ref={headerRef} className="custom-tabs-forms p-0">
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={activeTabId==1? "active" : ""}
                            onClick={() => setActiveTabId(1)}>
                            Dashboard
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={activeTabId==2? "active" : ""}
                            onClick={() => setActiveTabId(2)}>
                           Escalations
                        </NavLink>
                    </NavItem>
                </Nav>
                </HeaderComponent>
                <BodyComponent allRefs={{ headerRef }} className={activeTabId == 1 ? "overflow-hidden body-height":"body-height"}>
                    <TabContent activeTab={activeTabId} className={loading ? " " : "h-100"}>
                        {<TabPane className={loading ? " " : "h-100"} tabId={1}>
                            <div className={'h-100'}>
                                <div className='row g-3 h-100'>
                                    <div className='col-12 col-xl-4 col-xxl-4 h-100'>
                                        {validate.isNotEmpty(cfpActionsCount) && dateDifference > 0 && <OrderCountBadges orderCount={cfpActionsCount} type={"cfp"} orderSequence={MART_ORDER_DASHBOARD_ORDER_SEQUENCE.cfp} dateDifferences={dateDifference} handleOrderStatusClick={handleOrderStatusClick} />}
                                    </div>
                                    <div className='col-8 h-100 d-none d-lg-none d-xl-flex d-xxl-flex'>
                                        <div className='card h-100 w-100'>
                                            <div className='h-100 overflow-y-auto p-12 scroll-on-hover'>
                                                <div className='custom-model-filter-container'><CfpActionsStatusCountForm loading={loading} requestStatusWiseCFPActionsCountInfo={getStatusWiseCfpActionsCount} /></div>
                                                {(validate.isNotEmpty(cfpActionsCount) && noDataFound == false)
                                                ? <OrderDashboardBarGraph orderCount={cfpActionsCount} type="cfp" />
                                                : (noDataFound == true && !loading) ? <><div class='card mt-3' style={{height:'calc(100% - 106px'}}><NoDataFound text="No records found based on the given criteria. Try with other details!"/></div></> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className='row'>
                                    <div className='col-4'>
                                        
                                    </div>
                                    <div className='col-8'>
                                        <div className='card'>
                                            <div className='card-body'>
                                               
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </TabPane>}
                        {<TabPane className={loading ? " " : "h-100"} tabId={2}>
                            <CfpStateWiseStoreInfoDashboard activeTabId={activeTabId} {...props}/>
                        </TabPane>}
                    </TabContent>
                </BodyComponent>
            </Wrapper>
        </React.Fragment>
    )
}

export default CfpDashboard;