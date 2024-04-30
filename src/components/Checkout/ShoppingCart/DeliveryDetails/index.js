import { forwardRef, useContext, useEffect, useState } from "react";
import { TabContent, TabPane } from "reactstrap";
import Validate from "../../../../helpers/Validate";
import CheckoutService from "../../../../services/Checkout/CheckoutService";
import NavTabs from "../../../Common/NavTabs";
import { CustomerContext } from "../../../Contexts/UserContext";
import { getCustomerRedirectionURL } from "../../../customer/CustomerHelper";
import HomeDelivery from "../DeliveryDetails/HomeDelivery/index";
import StorePick from "../DeliveryDetails/StorePick/index";

const DeliveryDetails = forwardRef((props,ref) => {
    const [tabId, setTabId] = useState(undefined);
    const { customerId } = useContext(CustomerContext);
    const checkoutService = CheckoutService();
    const [isDeliveryDetailsLoading, setIsDeliveryDetailsLoading] = useState(false);
    const [tabs, setTabs] = useState([]);
    const validate = Validate();
   
   const [cfpStoreId, setCfpStoreId] = useState(undefined);
    const handleTabId = (tabId) => {
        let numToString = tabId.toString();
        setTabId(numToString)
        props.setActiveDeliveryTab(tabId);
        props.setPaymentType(undefined);
    }

    useEffect(() => {
        if(validate.isNotEmpty(props?.cfpStoreId)) {
            setCfpStoreId(props?.cfpStoreId);
        }
        getLocationDeliveryDetails();
    },[props?.cfpStoreId])

    const getLocationDeliveryDetails = () => {
        setIsDeliveryDetailsLoading(true);
        checkoutService.getLocationDeliveryDetails({ headers: { customerId: customerId } }).then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode === "SUCCESS" && response.dataObject) {
                if(!response.dataObject.isHomeDeliveryAllowed && !response.dataObject.isStorePickUpAllowed) {
                    props.history.push(getCustomerRedirectionURL(customerId, "catalog")) 
                }
                let tabs = [];
                if (response.dataObject.isHomeDeliveryAllowed) {
                    tabs.push("Home Delivery");
                }

                if (response.dataObject.isStorePickUpAllowed) {
                    tabs.push("Store Pick Up");
                }

                if(response.dataObject.isHomeDeliveryAllowed && validate.isEmpty(props?.cfpStoreId)) {
                    setTabId('1');
                    props.setActiveDeliveryTab(1);
                } else {
                    setTabId('2');
                    props.setActiveDeliveryTab(2);
                }
                setTabs(tabs);
            }
            setIsDeliveryDetailsLoading(false);
        }).catch((error) => {
            setIsDeliveryDetailsLoading(false);
            console.log(error);
        })
    }

    return (
        <>
            {isDeliveryDetailsLoading && <>Delivery Details Loading</>}
            {!isDeliveryDetailsLoading &&
                <>
                    <div className="custom-tabs-forms custom-tabs-forms-icon border rounded mobile-compatible-tabs">
                        <NavTabs tabs={tabs} onTabChange={handleTabId} />
                        <TabContent activeTab={tabId} className="tab-content-height overflow-y-auto scroll-on-hover">
                            <TabPane tabId="1">
                                <div className="p-12 col-12 col-lg-9">
                                    <HomeDelivery ref={ref} {...props} />
                                </div>
                            </TabPane>
                            <TabPane tabId="2">
                                <StorePick {...props} cfpStoreId = {props?.cfpStoreId}/>
                            </TabPane>
                        </TabContent>
                    </div>
                </>
            }
        </>
    )
});

export default DeliveryDetails;
