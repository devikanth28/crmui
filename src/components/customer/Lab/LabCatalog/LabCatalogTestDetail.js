import React, { useContext, useEffect, useRef, useState } from 'react'
import { TabContent, TabPane } from 'reactstrap';
import NavTabs from '../../../Common/NavTabs';
import { BodyComponent, HeaderComponent } from '../../../Common/CommonStructure';
import Validate from '../../../../helpers/Validate';
import LabOrderService from '../../../../services/LabOrder/LabOrderService';
import { AlertContext, CustomerContext, LocalityContext, ShoppingCartContext } from '../../../Contexts/UserContext';
import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import { isResponseSuccess } from '../../../../helpers/CommonHelper';
import TestServingCenters from './TestServingCenters';
import LabCartActionButton from './LabCartActionButton';
import EachPackageTestCard from './EachPackageTestCard';
import TestDetailSummary from './TestDetailSummary';
import { getCustomerRedirectionURL } from '../../CustomerHelper';
import { MEDPLUS_ADVANTAGE } from '../../Constants/CustomerConstants';
import useRole from '../../../../hooks/useRole';
import { Roles } from '../../../../constants/RoleConstants';

function LabCatalogTestDetail(props) {
    const validate = Validate();
    const headerRef = useRef();
    const [testDetails, setTestDetails] = useState({});
    const [tabId, setTabId] = useState(1);
    const { customerId, customer } = useContext(CustomerContext);
    const [isLabOrderCreate, isFrontOfficeOrderCreate] = useRole([Roles.ROLE_CRM_LAB_ORDER_CREATE, Roles.ROLE_CRM_LAB_FRONT_OFFICE_ORDER_CREATE]);
    const testId = props.testId;
    const { setStackedToastContent } = useContext(AlertContext);
    const isTestAddedToCart = props.isTestAddedToCart;
    const [packagesIncludedThisTest, setPackagesIncludedThisTest] = useState([]);
    const [testStaticContent, setTestStaticContent] = useState({});
    const [tabContent, setTabContent] = useState({});
    const [loading, setLoading] = useState(false);
    const [testServingCenters, setTestServingCenters] = useState([]);
    const { labLocality, martLocality } = useContext(LocalityContext);
    const { setLabShoppingCart } = useContext(ShoppingCartContext);

    useEffect(() => {
        getTestDetailsById(testId);
        getStaticContentForItem(testId);
        
    }, [testId]);

    useEffect(() => {
        setTabContentsAndGetTabs();
    }, [packagesIncludedThisTest, testStaticContent, testDetails]);

    const handleTabId = (tabId) => {
        setTabId(tabId)
    }

    const setTabContentsAndGetTabs = () => {
        let tabContent = {};
        if (validate.isNotEmpty(packagesIncludedThisTest)) {
            tabContent["Packages"] = packagesIncludedThisTest;
        }
        if (validate.isNotEmpty(testStaticContent) && validate.isNotEmpty(testStaticContent.DESC)) {
            tabContent["Overview of Test"] = testStaticContent.DESC;
        }
        if (validate.isNotEmpty(testDetails) && validate.isNotEmpty(testDetails.parameters)) {
            tabContent["Parameters"] = testDetails.parameters;
        }
        if (validate.isNotEmpty(testStaticContent) && validate.isNotEmpty(testStaticContent.FAQ)) {
            tabContent["FAQ"] = testStaticContent.FAQ;
        }
        if (validate.isNotEmpty(testDetails) && validate.isNotEmpty(testDetails.tests)) {
            tabContent["Tests Included"] = testDetails.tests;
        }
        if (validate.isNotEmpty(testDetails) && validate.isNotEmpty(testDetails.specialInstructions)) {
            tabContent["Special Instructions"] = testDetails.specialInstructions;
        }
        if (validate.isNotEmpty(testDetails) && validate.isNotEmpty(testDetails.description)) {
            tabContent["Description"] = testDetails.description;
        }
        setTabContent(tabContent);
        setTabId(1)
    }

    const getEachTabContent = (type, content) => {
        switch (type) {
            case "Packages": return (content.map((eachPackageTest, index) => (
                <div className='col-lg-4 col-12'>
                    <EachPackageTestCard addToCartLoading={props.addToCartLoading} setAddToCartLoading={props.setAddToCartLoading} key={index} eachPackageTest={eachPackageTest} setCartSummary={props.setCartSummary} {...props} />
                </div>
            ))
            );
            case "Parameters": return (
                <ul className='list-group'>
                    {content.map((item) => (
                        <li className='list-group-item p-1'>
                            {item}
                        </li>
                    ))}
                </ul>
            );
            case "Tests Included": return (<>
                <h6>Includes {content.length} tests ({testDetails.noOfParameters} parameters)</h6>
                <ul className='list-group'>
                    {content.map((item) => (
                        <li className='list-group-item p-1'>
                            {item.name} <small className='text-secondary'>(Includes {item.noOfParameters} parameters)</small>
                        </li>
                    ))}
                </ul>
            </>
            )
            default: return (
                <div dangerouslySetInnerHTML={{ __html: content }} />
            );
        }
    }

    const getNearByServingStoresList = (testCode) => {
        if (!testCode) {
            return;
        }
        const config = { headers: { customerId: customerId }, params: { testCode: testCode, customerId: customerId } }
        LabOrderService().getTestServingCenters(config).then((response) => {
            if (isResponseSuccess(response)) {
                setTestServingCenters(response.dataObject ? response.dataObject : []);
            } else {
                console.log("Error: " + response?.message);
                setTestServingCenters([]);
            }
        }).catch((e) => {
            setStackedToastContent({ toastMessage: "unable to get near by serving stores" });
            console.log(e);
        })
    }

    const getTestDetailsById = (testId) => {
        if (!testId) {
            return
        }
        setTabContent({});
        setLoading(true);
        const config = { headers: { customerId: customerId }, params: { testId: testId, customerId: customerId } }
        LabOrderService().getTestDetailsById(config).then((response) => {
            if (isResponseSuccess(response) && response.dataObject) {
                setTestDetails(response.dataObject);
                getPackagesIncludeThisTest(response.dataObject.id);
                getNearByServingStoresList(testId);
            } else {
                setStackedToastContent({ toastMessage: "Details of the test are not available" });
            }
            setLoading(false);
        }).catch((e) => {
            setStackedToastContent({ toastMessage: "unable to get test details" });
            console.log(e);
            setLoading(false);
        })
    }

    const getPackagesIncludeThisTest = (testCode) => {
        const config = { headers: { customerId: customerId }, params: { testCode: testCode, customerId: customerId, noOfTests: 10 } }
        LabOrderService().getPackagesIncludeThisTest(config).then((response) => {
            if (isResponseSuccess(response) && response.dataObject) {
                setPackagesIncludedThisTest(response.dataObject.testSummaryList);
            } else {
                setPackagesIncludedThisTest([]);
                setStackedToastContent({ toastMessage: response && response.message ? response.message : "unable to get Packages Include This Test" });
            }
        }).catch((e) => {
            setStackedToastContent({ toastMessage: "unable to get Packages Include This Test" });
            console.log(e);
        })
    }

    const getStaticContentForItem = (testId) => {
        if (!testId) {
            return;
        }
        const config = { headers: { customerId: customerId }, params: { contentType: "ALL", itemId: `LAB_${testId}`, customerId: customerId } }
        LabOrderService().getStaticContentForItem(config).then((response) => {
            if (isResponseSuccess(response) && response.dataObject) {
                setTestStaticContent(response.dataObject.result);
            } else {
                setTestStaticContent({});
            }
        }).catch((e) => {
            setStackedToastContent({ toastMessage: "unable to get static content for test" });
            console.log(e);
        })
    }

    return (
        <React.Fragment>
            {loading ? <div className="d-flex justify-content-center align-items-center h-100 p-4">
                <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText={"Please be patient while we prepare your data for loading!"} />
            </div> :
                validate.isNotEmpty(testDetails) && <>
                <div className="h-100 border rounded">

                    <HeaderComponent ref={headerRef} className="d-flex flex-column flex-lg-row align-items-lg-center align-items-start gap-3 gap-lg-0 justify-content-between border-bottom p-12">
                        <div className="col">
                            <p className="mb-0 font-weight-bold text-truncate-2" id='productNametooltip'>{testDetails.name}</p>
                        </div>
                    </HeaderComponent>
                    <BodyComponent allRefs={{"headerRef": headerRef }}  className='p-12 body-height' loading={loading}>
                        <TestDetailSummary testDetails={testDetails} />
                        <div className="my-3 d-flex flex-column flex-lg-row gap-2">
                            {(isLabOrderCreate || isFrontOfficeOrderCreate) && (!(validate.isEmpty(labLocality) || validate.isEmpty(martLocality) || validate.isEmpty(labLocality.collectionCenterId)) &&
                                validate.isNotEmpty(testServingCenters)) && <TestServingCenters customerId={customerId} testCode={testDetails.code} testName={testDetails.name} testServingCenters={testServingCenters} />
                            }
                            {((validate.isNotEmpty(testDetails.mrp) && testDetails.mrp > 0 && testDetails.available && isLabOrderCreate) && !isTestAddedToCart) && <LabCartActionButton addToCartLoading={props.addToCartLoading} setAddToCartLoading={props.setAddToCartLoading} testCode={testDetails.code} removeBtn={"remove Test"} removeBtnClass="col-12 me-2 p-0 col-lg-4 btn-success btn-sm btn btn-primary mt-2 mt-lg-0" removeBtnStyle={{ height: "55px" }} testDetails={testDetails} isaddedToCart={isTestAddedToCart} handleCallback={(response) => { setLabShoppingCart(response?.responseData?.shoppingCart); props.setCartSummary(response?.responseData?.shoppingCart) }} addBtn={"Book Test"} addBtnClass="col-12 me-2 p-0 col-lg-2 btn-success btn-sm btn btn-primary mt-2 mt-lg-0" addBtnStyle={{ height: "55px" }} />}
                            <div>
                            {validate.isNotEmpty(customer) && validate.isNotEmpty(testDetails?.subscriptionPlanPrice) && customer.subscribedHealthCareSubscriptionId == null && <button type="button" class="col-12 btn btn-sm btn btn-sm brand-secondary px-4 py-3 mt-2 mt-lg-0" onClick={() => { props.history.push(getCustomerRedirectionURL(customerId, MEDPLUS_ADVANTAGE)) }}>Become a Member @ {testDetails.subscriptionPlanPrice}</button>}
                            </div>
                        </div>
                        {validate.isNotEmpty(tabContent) && <>
                            <label class="d-block py-0 font-weight-bold custom-fieldset mb-1">Test Information</label>
                            <div className={`custom-tabs-forms mobile-compatible-tabs d-flex pb-0 card`}>
                                <NavTabs tabs={Object.keys(tabContent)} onTabChange={handleTabId} activeTabId={tabId} />
                                <TabContent activeTab={tabId}>
                                    {validate.isNotEmpty(tabContent) && Object.entries(tabContent).map(([eachKey, eachValue], index) => {
                                        return (
                                            <TabPane tabId={index + 1}>
                                                <div className='p-12 row g-3'>
                                                    {getEachTabContent(eachKey, eachValue)}
                                                </div>
                                            </TabPane>
                                        )
                                    })}
                                </TabContent>
                            </div>

                        </>}
                    </BodyComponent>
                </div>
                </>}
        </React.Fragment>
    )
}

export default LabCatalogTestDetail;