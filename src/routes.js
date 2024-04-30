import React from 'react';
import Loadable from 'react-loadable';
import { Route } from 'react-router';
import { Switch } from 'react-router-dom';
import AgentAppRoute from './components/AgentApp/AgentAppRoute.js';
import CrmCustomerRoute from './components/CommonRoute/CrmCustomerRoute';
import TestAuth from './components/TestAuth';
import CustomerSearchForm from './components/customer/CustomerSearchForm';
import ShutterOrderSearchForm from './components/order/ShutterOrderSearchForm';
import { AGENT_UI, CRM_UI } from './services/ServiceConstants';

const Loading = <div className="load-chunks-bar" style={{ top: '4px' }}>
    <div className="bar"></div>
</div>

const Home = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */ './components/Home'),
    loading: () => Loading,
    modules: ['order']
});

const CustomerSearch = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */ './components/customer/CustomerDashboard'),
    loading: () => Loading,
    modules: ['customer']
});

const BioHome = Loadable({
    loader: () => import(/* webpackChunkName: "BioHome" */ './components/customer/Bio/BioHome'),
    loading: () => Loading,
    modules: ['customer']
});

const PrescriptionOrderSearch = Loadable({
    loader: () => import(/* webpackChunkName: "Prescription" */ './components/prescription/PrescriptionDashboard'),
    loading: () => Loading,
    modules: ['prescription']
});

const OrderSearchResult = Loadable({
    loader: () => import(/* webpackChunkName: "Order" */ './components/order/OrderSearchResult'),
    loading: () => Loading,
    modules: ['order']
});

const CustomerBio = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerBio" */ './components/customer/CustomerBio'),
    loading: () => Loading,
    modules: ['customer']
});

const CrmRoute = Loadable({
    loader: () => import(/* webpackChunkName: "crmRoute" */ './components/CommonRoute/CrmRoute'),
    loading: () => Loading,
    modules: ['routes']
});

const OrderSearchForm = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */ './components/order/OrderSearchForm'),
    loading: () => Loading,
    modules: ['order']
});

const LabOrderSearchForm = Loadable({
    loader: () => import(/* webpackChunkName: "LabOrderSearch" */ './components/labOrders/LabOrderSearchForm'),
    loading: () => Loading
})
const MobileLabOrderSearchForm = Loadable({
    loader: () => import(/* webpackChunkName: "LabOrderSearch" */ './components/labOrders/MobileLabOrderSearchForm'),
    loading: () => Loading
})
const PrescriptionOrderSearchForm = Loadable({
    loader: () => import(/* webpackChunkName: "Prescription" */ './components/prescription/PrescriptionOrderSearchForm'),
    loading: () => Loading,
    modules: ['prescriptionOrder']
});

const LabOrderSearchDashboard = Loadable({
    loader: () => import(/* webpackChunkName: "LabOrderDashboard" */ './components/labOrders/LabOrderSearchResults'),
    loading: () => Loading,
    modules: ['labOrder']
});

const MWalletRefund = Loadable({
    loader: () => import(/* webpackChunkName: "Wallet" */ './components/MWallet/MWalletRefund'),
    loading: () => Loading,
    modules: ['mwallet']
});

const ShutterSearchResult = Loadable({
    loader: () => import(/* webpackChunkName: "Order" */ './components/order/ShutterSearchResult.js'),
    loading: () => Loading,
    modules: ['order']
});

const CustomerProcurementSearchResult = Loadable({
    loader: () => import(/* webpackChunkName: "Order" */ './components/order/CustomerProcurementSearchResult.js'),
    loading: () => Loading,
    modules: ['order']
});

const MWalletRefundInfo = Loadable({
    loader: () => import(/* webpackChunkName: "Wallet" */ './components/MWallet/MWalletRefundInfo'),
    loading: () => Loading,
    modules: ['mwallet']
});
const RefillSearch = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */ './components/Refill/RefillSearch'),
    loading: () => Loading,
    modules: ['Refill']
});

const RefillSearchResult = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */ './components/Refill/RefillSearchResult'),
    loading: () => Loading,
    modules: ['Refill']
});

const CustomerOrderHistory = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerOrderHistory" */ './components/customer/CustomerOrderHistory'),
    loading: () => Loading,
    modules: ['customer']
});
const FollowUp = Loadable({
    loader: () => import(/* webpackChunkName: "followUp" */ './components/customer/FollowUp'),
    loading: () => Loading
});
const FollowupSearchResult = Loadable({
    loader: () => import(/* webpackChunkName: "followUp" */ './components/customer/FollowupSearchResult'),
    loading: () => Loading,
    modules: ['customer']
});

const CustomerHeader = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerOrderHistory" */ './components/Headers/CustomerHeaderComponents/CustomerHeader'),
    loading: () => Loading,
    modules: ['Headers']
});

const CustomerFollowUp = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerBio" */ './components/customer/CustomerFollowUp.js'),
    loading: () => Loading,
    modules: ['customer']
});

const CustomerCommunication = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerBio" */ './components/customer/CustomerCommunication'),
    loading: () => Loading,
    modules: ['customer']
});

const CommunicationDisplay = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerBio" */ './components/order/CommunicationDisplay'),
    loading: () => Loading,
    modules: ['customer']
});

const Communication = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerBio" */ './components/customer/Communication'),
    loading: () => Loading,
    modules: ['customer']
});

const CommunicationSearch = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerBio" */ './components/customer/CommunicationSearch'),
    loading: () => Loading,
    modules: ['customer']
});

const CommunicationResult = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerBio" */ './components/customer/CommunicationResult'),
    loading: () => Loading,
    modules: ['customer']
});

const StoreLocator = Loadable({
    loader: () => import(/* webpackChunkName: "Store" */ './components/StoreLocator/StoreLocator'),
    loading: () => Loading,
    modules: ['store']
});

const OrderDashboard = Loadable({
    loader: ()=> import(/* webpackChunkName: "OrderDashboard" */ './components/OrderDashboard/OrderDashboard'),
    loading: () => Loading,
    modules: ['Common']
});

const AccessDenied = Loadable({
    loader: () => import(/* webpackChunkName: "AccessDenied" */ './components/ErrorComponents/AccessDenied'),
    loading: () => Loading,
    modules:['Common']
});

const PrescriptionOrderDashboard = Loadable({
    loader: ()=> import(/* webpackChunkName: "PrescriptionOrderDashboard" */ './components/OrderDashboard/PrescriptionOrderDashboard'),
    loading: () => Loading,
    modules: ['Common']
});

const LabOrderDashboard = Loadable({
    loader: ()=> import(/* webpackChunkName: "LabOrderDashboard" */ './components/OrderDashboard/LabOrderDashboard'),
    loading: () => Loading,
    modules: ['Common']
});

const CustomerChangeRequestResult = Loadable({
    loader: () => import(/* webpackChunkName: "followUp" */ './components/customer/CustomerChangeRequestResult'),
    loading: () => Loading,
    modules: ['customer']
});

const LabOrderRefundSearchForm = Loadable({
    loader: ()=> import( /* webpackChunkName: "LabOrderRefundSearch" */ './components/labOrders/labOrderRefunds/LabOrderRefundSearchForm'),
    loading: () => Loading,
    modules: ['labOrder']
});

const LocalitySearchComponent = Loadable({
    loader: ()=> import( /* webpackChunkName: "LabOrderRefundSearch" */ './components/StoreLocator/LocalitySearchComponent'),
    loading: () => Loading,
    modules: ['store']
});

const LabOrderRefundDashboard = Loadable({
    loader: ()=> import( /* webpackChunkName: "LabOrderRefundSearch" */ './components/labOrders/labOrderRefunds/LabOrderRefundSearchResults'),
    loading: () => Loading,
    modules: ['labOrder']
});

const ProposedOrdersDashboardSearchForm = Loadable({
    loader: ()=> import(/* webpackChunkName: "ApproveProposedOrdersSearchForm" */ './components/order/ProposedOrders/ApproveProposedOrdersSearchForm'),
    loading: () => Loading,
    modules: ['order']
});

const ProposedOrdersDashboard= Loadable({
    loader: ()=> import(/* webpackChunkName: "ProposedOrdersDashboard" */ './components/order/ProposedOrders/ProposedOrdersDashboard'),
    loading: () => Loading,
    modules: ['order']
});

const LabsSaleReportDashboard = Loadable({
    loader: ()=> import(/* webpackChunkName: "LabsSaleReportDashboard" */ './components/LabReports/LabsSaleReportDashboard'),
    loading: () => Loading,
    modules: ['Common']
});

const CfpSearchResult = Loadable({
    loader: () => import(/* webpackChunkName: "Cfp" */ './components/customer/Cfp/CfpInfo/CfpSearchResult'),
    loading: () => Loading,
    modules: ['customer']
});

const CfpSearchForm = Loadable({
    loader: () => import(/* webpackChunkName: "Cfp" */ './components/customer/Cfp/CfpInfo/CfpSearchForm'),
    loading: () => Loading,
    modules: ['customer']
})

const CfpDashboard = Loadable({
    loader: () => import(/* webpackChunkName: "Cfp" */ './components/customer/Cfp/CfpDashboard'),
    loading: () => Loading,
    modules: ['customer']
})

const RegisteredDoctors = Loadable({
    loader: () => import(/* webpackChunkName: "Cfp" */ './components/DoctorRegistration/DoctorRegistration.js'),
    loading: () => Loading,
    modules: ['customer']
})

const LabsUserDSRDashboard = Loadable({
    loader: ()=> import(/* webpackChunkName: "LabsUserDSRDashboard" */ './components/LabReports/LabsUserDSRDashboard'),
    loading: () => Loading,
    modules: ['Common']
});

const MembershipHome = Loadable({
    loader: ()=> import( /* webpackChunkName: "MembershipHome" */ './components/membership/MembershipHome'),
    loading: () => Loading,
    modules: ['membership']
});

const EkycSearchForm = Loadable({
    loader: () => import(/* webpackChunkName: "EkycDashBoard" */ './components/Ekyc/ekycSearchForm'),
    loading: () => Loading,
    modules: ['ekyc']
});

const EkycSearchResults = Loadable ({
    loader: () => import(/* webpackChunkName: "EkycDashBoard" */ './components/Ekyc/ekycSearchResults'),
    loading: () => Loading,
    modules: ['ekyc']
})


const CollectionCenterLabOrderSearchForm = Loadable({
    loader: ()=> import( /* webpackChunkName: "LabOrderDashboard" */ './components/labOrders/CollectionCenterLabOrderSearchForm'),
    loading: () => Loading,
    modules: ['Common']
});

const LabBankDepositDashboard =  Loadable({
    loader: () => import(/* webpackChunkName: "LabBankDepositDashboard" */ './components/LabReports/LabBankDeposit'),
    loading : () => Loading,
    modules: ['Common']
});

const LedgerSearch = Loadable({
    loader: ()=> import(/* webpackChunkName: "LedgerSearch" */ './components/LabReports/LedgerSearch'),
    loading: () => Loading,
    modules: ['Common']
});

const LedgerSearchResult = Loadable({
    loader: () => import(/* webpackChunkName: "LedgerSearchDashboard" */ './components/LabReports/LedgerSearchResult'),
    loading: () => Loading,
    modules: ['Common']
});
const SearchCustomerProcurement = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerProcurementDashboard" */ './components/customer/CustomersProcurememntSearchForm'),
    loading: () => Loading,
    modules: ['Common']
});
const CustomerProcurementDetails = Loadable({
    loader: () => import(/* webpackChunkName: "CustomerProcurementDashboard" */ './components/customer/CustomersProcurementDetails'),
    loading: () => Loading,
    modules: ['Common']
});

const HealthRecordComponent =   Loadable({
    loader: () => import(/* webpackChunkName: "HealthRecord" */ './components/healthRecord/HealthRecord'),
    loading: () => Loading,
    modules: ['healthRecord']
});

const MobileViewSearchFormComponent =   Loadable({
    loader: () => import(/* webpackChunkName: "HealthRecord" */ './components/Common/MobileViewSearchForm'),
    loading: () => Loading,
    modules: ['healthRecord']
});

const SubscriptionFaq = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */ './components/AgentApp/SubscriptionFaq.js'),
    loading: () => Loading,
    modules: ['AgentApp']
});

const SubscriptionTnc = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */ './components/AgentApp/SubscriptionTnC.js'),
    loading: () => Loading,
    modules: ['AgentApp']
});

const subscriptionMembers = Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/MemberRegistration'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const OrderReview = Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/OrderReview/index'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const MAThankyou = Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/Thankyou'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const AddMembers = Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/MemberRegistration/AddMembers'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const MAPayment = Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/OrderReview/MAPayment'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const RetryPayment = Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/RetryPayment.js'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const PlansInfo = Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/PlansInfo'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const SearchCustomerAgentApp = Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/Customer/SearchCustomer'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const CreateCustomerAgentApp = Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/Customer/CreateCustomer'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const PlanList = Loadable({
    loader: () => import(/* webpackChunkName: "CreateCustomer" */ './components/AgentApp/PlanList'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const CustomerInfo = Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/CustomerInfo'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const SearchLocation = Loadable({
    loader: () => import(/* webpackChunkName: "SearchLocation" */ './components/AgentApp/LocationSearch'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const configureLocation =  Loadable({
    loader: () => import(/* webpackChunkName: "SearchLocation" */ './components/AgentApp/LocationSearch/ConfigureLocation'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const MedPlusAdvnatage =  Loadable({
    loader: () => import(/* webpackChunkName: "MedPlusAdvnatage" */ './components/AgentApp/MedplusAdvantage'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const QR =  Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/OrderReview/QR'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const MASubscriptionDetails =  Loadable({
    loader: () => import(/* webpackChunkName: "AgentApp" */ './components/AgentApp/SubscriptionDetails'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const CrmCustomerRoutes = Loadable({
    loader: () => import(/* webpackChunkName: "Customer" */ './CustomerRoutes'),
    loading: () => Loading,
    modules: ['Customer']
});

const RecordCommunication =  Loadable({
    loader: () => import(/* webpackChunkName: "StaticUI" */ './components/CommunicationsUI/RecordCommunication'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const DisplayCommunication =  Loadable({
    loader: () => import(/* webpackChunkName: "StaticUI" */ './components/CommunicationsUI/DisplayCommunication'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const DisplayCommunicationSearchForm =  Loadable({
    loader: () => import(/* webpackChunkName: "StaticUI" */ './components/CommunicationsUI/DisplayCommunicationSearchForm'),
    loading: () => Loading,
    modules: ['AgentApp']
})

const InsuranceCommunication =  Loadable({
    loader: () => import(/* webpackChunkName: "StaticUI" */ './components/CommunicationsUI/InsuranceCommunication'),
    loading: () => Loading,
    modules: ['AgentApp']
})

export default () => (
    <Switch>
        <CrmRoute exact path={`/customer-relations`}  component={Home} screenName={"Home"} routePath={"home"} />
        <CrmRoute exact path={`${CRM_UI}/shutterSearchResult`} showSaveWorkspaceModal={true} screenName={"Mart Order Search"} searchFormComponent={ShutterOrderSearchForm} component={ShutterSearchResult} routePath={"shutterSearchResult"}/>
        <CrmRoute exact path={`${CRM_UI}/prescriptionOrderSearch`} showSaveWorkspaceModal={true} screenName={"Prescription Order Search"} searchFormComponent={PrescriptionOrderSearchForm} component={PrescriptionOrderSearch} routePath={"prescriptionOrderSearch"} />
        
        <CrmRoute exact path={`${CRM_UI}/orderSearch`} showSaveWorkspaceModal={true} screenName={"Orders / Mart / Search"} searchFormComponent={OrderSearchForm} component={OrderSearchResult} routePath={"orderSearchResult"} />
        <CrmRoute exact path={`${CRM_UI}/orderSearch/search`} showSaveWorkspaceModal={true} screenName={"Orders / Mart / Search"} mobileSearchFormComponent={OrderSearchForm} component={MobileViewSearchFormComponent} />
        
        <CrmRoute exact path={`${CRM_UI}/searchCustomer`} screenName={"Customer / Customer Search"} mobileSearchForm searchFormComponent={CustomerSearchForm} routePath={"customerSearch"} component={CustomerSearch} />
        <CrmRoute exact path={`${CRM_UI}/searchCustomer/search`} screenName={"Customer / Customer Search"}  routePath={"customerSearchForm"} mobileSearchFormComponent={CustomerSearchForm} component={MobileViewSearchFormComponent} />
        
        <CrmRoute exact path={`${CRM_UI}/testAuth/:customerId`} screenName={"Tes Auth"} routePath={"testAuth"} component={TestAuth} />
        <Route exact path={`${CRM_UI}/customerHeader`} component={CustomerHeader} routePath = {"customerHeader"} />

        <CrmCustomerRoute exact path={`${CRM_UI}/bio/:customerId`} routePath={"bio"} component={CustomerBio} />  

        {/******Communication Routes **************************** */}
        <CrmRoute exact path={`${CRM_UI}/recordCommunication`} showSaveWorkspaceModal={true} screenName={"Communications"} component={RecordCommunication} routePath={"orderSearchResult"} />
        <CrmRoute exact path={`${CRM_UI}/displayCommunication`} showSaveWorkspaceModal={true} screenName={"Communications"} searchFormComponent={DisplayCommunicationSearchForm} component={DisplayCommunication} routePath={"communications"} />
        <CrmRoute exact path={`${CRM_UI}/displayCommunication/search`} showSaveWorkspaceModal={true} screenName={"Communications"} mobileSearchFormComponent={DisplayCommunicationSearchForm} component={MobileViewSearchFormComponent} />
        <CrmRoute exact path={`${CRM_UI}/insuranceCommunication`} showSaveWorkspaceModal={true} screenName={"Communications"} component={InsuranceCommunication} routePath={"orderSearchResult"} />
        {/************************** **************************** */}  

        <CrmRoute exact path={`${CRM_UI}/labOrder/searchResults`} showSaveWorkspaceModal={true} screenName={"Orders / Lab / Search"} mobileSearchForm searchFormComponent={LabOrderSearchForm} openModel={true} component={LabOrderSearchDashboard} routePath={"labOrderSearchDashboard"} />
        <CrmRoute exact path={`${CRM_UI}/labOrder/searchResults/search`} showSaveWorkspaceModal={false} screenName={"Orders / Lab / Search"} mobileSearchFormComponent={LabOrderSearchForm} component={MobileViewSearchFormComponent} routePath={"labOrderSearchForm"}  /> 
               
        <CrmRoute exact path={`${CRM_UI}/mWalletRefund`} routePath={"mWalletRefund"} component={MWalletRefund} />
        <CrmRoute exact path={`${CRM_UI}/findMWalletRefund`} openModel={true} screenName={"MWallet Refund"} routePath={"findMWalletRefund"} searchFormComponent={MWalletRefund} component={MWalletRefundInfo} />
        {/* <CrmRoute exact path={`${CRM_UI}/orderHistory`} screenName={"Order History"} routePath={"orderHistory"} component={CustomerOrderHistory} /> */}
        <CrmRoute exact path={`${CRM_UI}/refillSearch`} showSaveWorkspaceModal={true} screenName={"Refill Search"} searchFormComponent={RefillSearch} openModel={true} component={RefillSearchResult} routePath={"refillSearchResult"} />
        <CrmCustomerRoute exact path={`${CRM_UI}/customerCommunication`} routePath={"customerCommunication"} component={CustomerCommunication} />
        {/* <CrmCustomerRoute exact path={`${CRM_UI}/customerFollowUp`} routePath={"CustomerFollowUp"} component={CustomerFollowUp} {...props} /> */}
        <CrmCustomerRoute exact path={`${CRM_UI}/communication`} routePath ={"communication"} component={Communication} />
        <CrmCustomerRoute exact path={`${CRM_UI}/communicationResult`} searchFormComponent={CommunicationSearch} routePath ={"communicationResult"} component={CommunicationDisplay} />
		<CrmRoute exact path = {`${CRM_UI}/storeLocator`}  searchFormComponent={LocalitySearchComponent} screenName={"Store Locator"} routePath = {"storeLocator"} component = {StoreLocator} />
        <CrmCustomerRoute exact path={`${CRM_UI}/bioHome/:customerId`} screenName={"Bio Home"}  routePath={"bioHome"}  component={BioHome}/>   
        <CrmRoute exact path={`${CRM_UI}/followup`} showSaveWorkspaceModal={true} screenName={"Follow Up"} searchFormComponent={FollowUp} openModel={true} component = {FollowupSearchResult} routePath = {"followupSearchResult"}/>  
	    <CrmRoute exact path = {`${CRM_UI}/orderDashboard`} screenName={"Orders / Mart"} routePath = {"orderDashboard"} component = {OrderDashboard} /> 
        <CrmRoute exact path = {`/customer-relations/accessDenied`}  routePath = {"accessDenied"} component = {AccessDenied} />             
        <CrmRoute exact path = {`${CRM_UI}/prescriptionOrderDashboard`} screenName={"Prescription Order Dashboard"} routePath = {"prescriptionOrderDashboard"} component = {PrescriptionOrderDashboard} />
        <CrmRoute exact path = {`${CRM_UI}/labOrderDashboard`}  screenName={"Orders / Lab "} routePath = {"LabOrderDashboard"} component = {LabOrderDashboard} /> 

        <CrmRoute exact path = {`${CRM_UI}/labOrder/refundSearchResults`} mobileSearchForm screenName={"Orders / Lab / Refund"} routePath ={"refundSearchResults"} searchFormComponent={LabOrderRefundSearchForm} openModel={true} component={LabOrderRefundDashboard}/>
        <CrmRoute exact path = {`${CRM_UI}/labOrder/refundSearchResults/search`} screenName={"Orders / Lab / Refund"} routePath ={"refundSearchResultsForm"} mobileSearchFormComponent={LabOrderRefundSearchForm} component={MobileViewSearchFormComponent}/>   

        <CrmRoute exact path={`${CRM_UI}/labsSaleReportSearch`} screenName={"Orders / Lab"} routePath={"labsSaleReportSearch"} component={LabsSaleReportDashboard} />

        <CrmRoute exact path = {`${CRM_UI}/proposedOrdersDashboard`} mobileSearchForm screenName={"Orders / Mart"} searchFormComponent={ProposedOrdersDashboardSearchForm} routePath = {"proposedOrdersDashboard"} component = {ProposedOrdersDashboard} /> 
        <CrmRoute exact path = {`${CRM_UI}/proposedOrdersDashboard/search`} screenName={"Orders / Mart"} mobileSearchFormComponent={ProposedOrdersDashboardSearchForm} routePath = {"proposedOrdersDashboard"} component = {MobileViewSearchFormComponent} /> 

        <CrmRoute exact path={`${CRM_UI}/customerChangeRequest`} showSaveWorkspaceModal={true} screenName={"Customer Change Request"}  openModel={false} component = {CustomerChangeRequestResult} routePath = {"customerChangeRequestResult"}/>  
        <CrmRoute exact path={`${CRM_UI}/ledgerSearch`} screenName={"Ledger Search"} routePath={"ledgerSearch"} component={LedgerSearchResult} searchFormComponent={LedgerSearch}/>

        <CrmRoute exact path={`${CRM_UI}/cfpSearch`} mobileSearchForm screenName={"CFP Information"} searchFormComponent={CfpSearchForm} component={CfpSearchResult} routePath={"cfpSearchResult"} />
        <CrmRoute exact path={`${CRM_UI}/cfpSearch/search`} screenName={"CFP Information"} mobileSearchFormComponent={CfpSearchForm} component={MobileViewSearchFormComponent} routePath={"cfpSearchResultForm"} />

        <CrmRoute exact path={`${CRM_UI}/cfpDashboard`} screenName={"CFP Dashboard"} component={CfpDashboard} routePath={"cfpDashboard"} />
        <CrmRoute exact path={`${CRM_UI}/labsUserDSRSearch`} screenName={"Orders / Lab"} routePath={"labsUserDSRSearch"} component={LabsUserDSRDashboard} />
        <CrmRoute exact path = {`${CRM_UI}/membershipDashboard`}  screenName={"Membership Dashboard"} routePath ={"membershipDashboard"}  component={MembershipHome}/>  
        <CrmRoute exact path = {`${CRM_UI}/registeredDoctors`}  screenName={"Registered Doctors"} routePath ={"registeredDoctors"}  component={RegisteredDoctors}/>
        <CrmRoute exact path ={`${CRM_UI}/labCollectionCenterDashboard`} screenName={'Collection Center Lab Order Search'} searchFormComponent={CollectionCenterLabOrderSearchForm} component={LabOrderSearchDashboard} openModel={true}  showSaveWorkspaceModal={true} routePath = {"labCollectionCenterDashboard"} />
        <CrmRoute exact path = {`${CRM_UI}/ekycSearch`} screenName={"Customer EKYC Dashboard"} routePath = {"customerEKYCDashboard"} searchFormComponent={EkycSearchForm} openModel={true} component={EkycSearchResults}/> 
        <CrmRoute exact path={`${CRM_UI}/labBankDeposit`} screenName={"Orders / Lab"} routePath={"labBankDeposit"} component={LabBankDepositDashboard} />


        <CrmRoute exact path ={`${CRM_UI}/customerProcurement`} mobileSearchForm showSaveWorkspaceModal={false} screenName={"Search Customers Procurement"} searchFormComponent={SearchCustomerProcurement} openModel={true} routePath={"customerProcurementDetails"} component={CustomerProcurementDetails}/>
        <CrmRoute exact path ={`${CRM_UI}/customerProcurement/search`} screenName={"Search Customers Procurement"} routePath={"customerProcurementDetailsSearch"} mobileSearchFormComponent={SearchCustomerProcurement} component={MobileViewSearchFormComponent}/>
        <CrmRoute exact path = {`${CRM_UI}/healthrecord/:id`} showSaveWorkspaceModal={false} screenName ={"Prescription / Health Record"} component={HealthRecordComponent} routePath={"HealthRecordComponent"} />


        {/* MAForAgentApp routes start */}
        <Route exact path={`${AGENT_UI}/medplusAdvantage/:tpaTokenId/:userId/:isThirdPartyAgent/:collectionStoreId?`} component={MedPlusAdvnatage} routePath = {"MedPlusAdvnatage"} screenName={'Subscription Details'}/>
        <AgentAppRoute exact path={`${AGENT_UI}/subscription/faq/:planId?`} component={SubscriptionFaq} routePath={"faq"}/>
        <AgentAppRoute exact path={`${AGENT_UI}/subscription/tnc/:planId?`} component={SubscriptionTnc} routePath={"tnc"}/>
        <AgentAppRoute exact path={`${AGENT_UI}/orderReview/:processType`} component={OrderReview} routePath = {"orderReview"} screenName={'Order Review'}/>
        <AgentAppRoute exact path={`${AGENT_UI}/maThankyou`} component={MAThankyou} routePath = {"thankYouPage"} headerText={"ThankYou"} screenName={'Thank You'} onBackRedirectTo={'searchCustomer'}/>
        <AgentAppRoute exact path = {`${AGENT_UI}/maPayment`} component={MAPayment} routePath={"payment"} screenName={'Payment'}/>
        <AgentAppRoute exact path = {`${AGENT_UI}/retryPayment/:txnRefId`} component={RetryPayment} routePath={"retryPayment"} screenName={'Retry Payment'}/>

        <AgentAppRoute exact screenName="Add Members" path= {`${AGENT_UI}/subscriptionMembers/:planId`} component={subscriptionMembers} routePath = {"subscriptionMembers"}/>
        <AgentAppRoute exact screenName="Add Members" path={`${AGENT_UI}/addmembers/:subscriptionId`} component={AddMembers} routePath = {"addmembers"}/>
        <AgentAppRoute exact screenName="Search Location" path={`${AGENT_UI}/searchLocation`} component={SearchLocation} routePath={"searchLocation"} isLocationRequired goToCollectionCenter/>
        <AgentAppRoute exact screenName="Search Location" path={`${AGENT_UI}/configureLocation`} component={configureLocation} configureLocation routePath={"configureLocation"} isLocationRequired/>
        <AgentAppRoute exact path = {`${AGENT_UI}/plansInfo/:planId`} component={PlansInfo} routePath={"plansInfo"} screenName={'Plan Details'} isLocationRequired/>
        <AgentAppRoute exact path = {`${AGENT_UI}/searchCustomer`} component={SearchCustomerAgentApp} routePath={"searchCustomer"} screenName={'Search Customer'} isLocationRequired/>
        <AgentAppRoute exact path = {`${AGENT_UI}/createCustomer`} component={CreateCustomerAgentApp} routePath={"createCustomer"} screenName={'Create Customer'} isLocationRequired onBackRedirectTo={'searchCustomer'}/>
        <AgentAppRoute exact path = {`${AGENT_UI}/planList`} component={PlanList} routePath={"planList"} screenName={'Plans'} isLocationRequired/>
        <AgentAppRoute exact path = {`${AGENT_UI}/customerInfo`} component={CustomerInfo} routePath={"customerInfo"} screenName={'Customer Details'} isLocationRequired onBackRedirectTo={'searchCustomer'}/>
        <AgentAppRoute exact path = {`${AGENT_UI}/qr`} component={QR} routePath={"qr"}  screenName={'QR'} onBackRedirectTo={'customerInfo'}/>
        <AgentAppRoute exact path = {`${AGENT_UI}/subscriptionDetails/:subscriptionId`} component={MASubscriptionDetails} routePath={"subscriptionDetails"} screenName={'Subscription Details'}/>

        {/* MAForAgentApp routes end */}

        {/* Crm Customer Dashboard nested routes start here*/ }
        <Route path={`${CRM_UI}/customer/:customerId`} render= {(props) => <CrmCustomerRoutes {...props} routePath = {"customer"} />} />
        {/* Crm Customer Dashboard nested routes end here*/ }

   </Switch>
);