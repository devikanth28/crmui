import React, { useContext, useState } from "react";
import CustomerRoute from "./components/customer/CustomerRoute";
import Loadable from "react-loadable";
import { AlertContext, CustomerContext, LocalityContext, ShoppingCartContext } from "./components/Contexts/UserContext";
import { Route, Switch } from "react-router-dom";
import CustomerBioHeader from "./components/Headers/CustomerHeaderComponents/CustomerBioHeader";
import { ProSidebarProvider } from "react-pro-sidebar";
import CustomerMenuNavTab from "./components/NavBars/CustomerMenuNavTab";
import Loading from "./components/Common/Loading";
import { useWindowSize } from "./hooks/useWindowSize";
import { CRM_UI } from "./services/ServiceConstants";
import { CUSTOMER, LAB_ORDER } from "./components/customer/Constants/CustomerConstants";
import LabOrderRoutes from "./routes/LabOrderRoutes";

const BioHome = Loadable({
    loader: () => import(/* webpackChunkName: "customer-bio" */ './components/customer/Bio/BioHome'),
    loading: () => Loading,
    modules: ['bio']
});

const Catalog = Loadable({
    loader: () => import(/* webpackChunkName: "customer-catalog" */ './components/Catalog'),
    loading: () => Loading,
    modules: ['catalog']
});

const AddMembersToPlan = Loadable({
    loader: () => import(/* webpackChunkName: "customer-medplusAdvantage" */ './components/customer/MembershipAdvantage/AddMembersToPlan'),
    loading: () => Loading,
    modules: ['medplusAdvantage']
});

const SubscriptionDetails = Loadable({
    loader: () => import(/* webpackChunkName: "SubscriptionDetails" */ './components/customer/MembershipAdvantage/SubscriptionDetails'),
    loading: () => Loading,
    modules: ['AgentApp']
});

const CustomerMARoutes = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerMARoutes" */ './CustomerMARoutes'),
    loading: () => Loading,
    modules: ['CustomerMARoutes']
});

const MartCheckoutRoutes = Loadable({
    loader: () => import(/* webpackChunkName: "MartCheckout" */ './routes/MartCheckoutRoutes'),
    loading: () => Loading,
    modules: ['MartCheckout']
});

const MobileLocationSearch = Loadable({
    loader: () => import(/* webpackChunkName: "customer-catalog" */ './components/AgentApp/LocationSearch/ConfigureLocation'),
    loading: () => Loading,
    modules: ['catalog']
});

const HealthRecordsHistory = Loadable({
    loader: () => import(/* webpackChunkName: "health-record-history" */ './components/customer/HealthRecordsHistory/HealthRecordsHistory'),
    loading: () => Loading,
    modules: ['health-record-history']
});

const HealthRecordsHistorySearchForm = Loadable({
    loader: () => import(/* webpackChunkName: "health-record-history" */ './components/customer/HealthRecordsHistory/HealthRecordHistorySearchForm'),
    loading: () => Loading,
    modules: ['health-record-history-search-form']
});

const CommunicationSearchForm = Loadable({
    loader: () => import(/* webpackChunkName: "health-record-history" */ './components/customer/CommunicationSearch'),
    loading: () => Loading,
    modules: ['communication-search-form']
});

const HealthRecordComponent =   Loadable({
    loader: () => import(/* webpackChunkName: "health-record-history" */ './components/healthRecord/HealthRecord'),
    loading: () => Loading,
    modules: ['health-record-history']
});

const CustomerFollowUp = Loadable({
    loader: () => import(/* webpackChunkName: "customer-follow-up" */ './components/customer/CustomerFollowUp'),
    loading: () => Loading,
    modules: ['customer-follow-up']
});

const CatalogIntermediateComponent =  Loadable({
    loader: () => import(/* webpackChunkName: "helpers" */ './helpers/CatalogIntermediateComponent'),
    loading: () => Loading,
    modules: ['helpers']
});

const CustomerLabCart = Loadable({
    loader: () => import(/* webpackChunkName: "Customer" */ './components/StaticUI/CustomerLabCart'),
    loading: () => Loading,
    modules: ['CustomerLabCart']

})

const CustomerLabCartReview = Loadable({
    loader: () => import(/* webpackChunkName: "Customer" */ './components/StaticUI/LabCartReview'),
    loading: () => Loading,
    modules: ['CustomerLabCart']

})

const LabCatalogSearch = Loadable({
    loader:()=> import(/* webpackChunkName: "Customer" */ './components/StaticUI/LabCatalogSearch'),
    loading:()=>Loading,
    modules: ['CustomerLabCart']
    
})

const CustomerCommunication = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerBio" */ './components/customer/CustomerCommunication'),
    loading: () => Loading,
    modules: ['customer-communication']
});

const CommunicationResult = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerBio" */ './components/customer/CommunicationResult'),
    loading: () => Loading,
    modules: ['customer-communication']
});

const CustomerOrderHistory = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerOrderHistory" */ './components/customer/CustomerOrderHistory'),
    loading: () => Loading,
    modules: ['CustomerOrderHistory']
});

const LabCatalog = Loadable({
    loader: () => import(/* webpackChunkName: "LabCatalog" */ './components/customer/Lab/LabCatalog/LabCatalog'),
    loading: () => Loading,
    modules: ['LabCatalog']

}) 

const CustomerOrderHistorySearchForm = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerOrderHistory" */ './components/customer/CustomerOrderHistorySearchForm'),
    loading: () => Loading,
    modules: ['LabCatalog']

})

const MobileViewSearchForm = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerOrderHistory" */ './components/Common/MobileViewSearchForm'),
    loading: () => Loading,
    modules: ['LabCatalog']

})

const DisplayCommunicationSearchForm =  Loadable({
    loader: () => import(/* webpackChunkName: "StaticUI" */ './components/CommunicationsUI/DisplayCommunicationSearchForm'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const Routes = (props) => {

    const path = props?.match?.path;
	const { customerId } = useContext(CustomerContext);

    return (
        <Switch>
            <CustomerRoute exact path={`${path}`} component={BioHome} {...props}/>
            <CustomerRoute exact path={`${path}/bio`} component={BioHome} {...props}/>
            <CustomerRoute exact path={`${path}/catalog/:productId?`} component={Catalog} {...props} />
            <CustomerRoute exact path={`${path}/catalog/prescription/:prescriptionId?`} component={Catalog} {...props} />
            <CustomerRoute exact path={`${CRM_UI}/${CUSTOMER}/${customerId}/catalogIntermediateComponent`} component={CatalogIntermediateComponent} />
            <CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/locationSearch`} component={MobileLocationSearch} {...props} />
			<CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/healthRecordHistory`} component={HealthRecordsHistory} {...props} />
			<CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/healthRecordHistory/search`} mobileSearchFormComponent={HealthRecordsHistorySearchForm} component={MobileViewSearchForm} {...props} />
            <CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/healthRecordHistory/:id`} component={HealthRecordComponent} {...props} />
            <CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/customerFollowUp`} component={CustomerFollowUp} {...props} />
            <CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/labCart`} component={CustomerLabCart} {...props} />
            <CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/labCart/review`} component={CustomerLabCartReview} {...props} />
            <CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/labCatalogSearch`} component={LabCatalogSearch} {...props} />

			<CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/labCatalog`} component={LabCatalog} {...props} />
            <CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/searchCommunication`} component={CommunicationResult} {...props} />
            <CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/searchCommunication/search`} showSaveWorkspaceModal={true} screenName={"Communications"} mobileSearchFormComponent={CommunicationSearchForm} component={MobileViewSearchForm} />
            <CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/recordCommunication`} component={CustomerCommunication} {...props} />
            <CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/orderHistory`} screenName={"Order History"} routePath={"orderHistory"} component={CustomerOrderHistory} {...props} />
            <CustomerRoute exact path={`${CRM_UI}/customer/${customerId}/orderHistory/search`} screenName={"Order History"} routePath={"orderHistory"} mobileSearchFormComponent={CustomerOrderHistorySearchForm} component={MobileViewSearchForm} {...props} />
            <Route path={`${path}/checkout`} render={(props) => <MartCheckoutRoutes {...props} Loading={Loading} />} />
            <Route path={`${path}/medplusAdvantage`} render={(props) => <CustomerMARoutes {...props} routePath={"membership"} />} />
            <Route path={`${path}/${LAB_ORDER}`} render={(props) => <LabOrderRoutes {...props} routePath={"labOrder123"}  />} />
        </Switch>

    )
}


const CustomerRoutes = (props) => {

    const [martLocality, setMartLocality] = useState({});
    const [labLocality, setLabLocality] = useState({});
    const [customer, setCustomer] = useState({});
    const [customerId, setCustomerId] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [subscription, setSubscription] = useState({});
    const [shoppingCart, setShoppingCart] = useState([]);
    const [isOnlineCartAdded,setisOnlineCartAdded] = useState(false);
    const [storeSearchText, setStoreSearchText] = useState("");
    const [isLocalityComponentNeeded, setIsLocalityComponentNeeded] = useState(true);
    const [reloadLocality,setReloadLocality]=useState(false);
    const [redisCart, setRedisCart] = useState([])
    const [productId, setProductId] = useState(null)
    const [labShoppingCart,setLabShoppingCart] = useState(null);

    const [,windowHeight] = useWindowSize();

    const [alertContent, setAlertContent] = useState({});
    const [toastContent, setToastContent] = useState([]);
    const [stackedToastContent, setStackedToastContent] = useState([]);

    const path = props?.location?.pathname;
    let searchComponent = null;

    switch (path){
        case `${CRM_UI}/customer/${customerId}/healthRecordHistory` : searchComponent = HealthRecordsHistorySearchForm
                                                                      break;
        case `${CRM_UI}/customer/${customerId}/searchCommunication` : searchComponent = CommunicationSearchForm
                                                                      break;
    }
  
    return (
        <div className="crm-customer-app" style={{'--dynamic-viewport-height' : `${windowHeight}px`}}>
            <ShoppingCartContext.Provider value={{productId, setProductId, shoppingCart, setShoppingCart, isOnlineCartAdded, setisOnlineCartAdded, redisCart,  setRedisCart,labShoppingCart,setLabShoppingCart}}>
                <LocalityContext.Provider value={{ martLocality, setMartLocality, labLocality, setLabLocality, storeSearchText, setStoreSearchText, isLocalityComponentNeeded, setIsLocalityComponentNeeded,reloadLocality,setReloadLocality }}>
                    <CustomerContext.Provider value={{ customer, setCustomer, customerId, setCustomerId, tokenId, setTokenId, subscription, setSubscription }} >
                    <AlertContext.Provider value={{ alertContent, setAlertContent, toastContent, setToastContent, stackedToastContent, setStackedToastContent }}>
                        <CustomerBioHeader searchFormComponent={searchComponent} {...props} />
                        <section className="d-flex mobile-responsive crm-customer-flow">
                            <ProSidebarProvider>
                                <CustomerMenuNavTab {...props} />
                            </ProSidebarProvider>
                            <div className='flex-grow-1'>
                                <Routes {...props} />
                            </div>
                        </section>
                        </AlertContext.Provider>
                    </CustomerContext.Provider>
                </LocalityContext.Provider>
            </ShoppingCartContext.Provider>
        </div>
    )
}

export default CustomerRoutes;