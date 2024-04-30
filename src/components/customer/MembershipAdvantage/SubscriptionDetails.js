import React, { useContext, useEffect, useRef, useState } from 'react'
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../../Common/CommonStructure';
import DynamicGridHeight from '../../Common/DynamicGridHeight';
import CommonDataGrid, { PaymentStatus } from '@medplus/react-common-components/DataGrid';
import SubscriptionInfo from './SubscriptionInfo';
import { Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import Validate from '../../../helpers/Validate';
import OrderHelper from '../../../helpers/OrderHelper';
import dateFormat from 'dateformat';
import { Button } from 'react-bootstrap';
import CurrencyFormatter from '../../Common/CurrencyFormatter';
import { AlertContext, CustomerContext, LocalityContext, UserContext } from '../../Contexts/UserContext';
import OrderActionForms from '../../order/OrderActionForms';
import { ExistingMemberCard } from './ExistingMemberCard';
import PlanDetails from './PlanDetails';
import MembershipService from '../../../services/Membership/MembershipService';
import CustomerService from '../../../services/Customer/CustomerService';
import { RetryPayment, ShowPaymentIcon, InvoiceDownloadIcon, CancelIcon } from '@medplus/react-common-components/DataGrid';
import { capitalizeFirstLetter, fullDateTime, getGenderString } from '../../../helpers/CommonHelper';
import useRole from '../../../hooks/useRole';
import CommonConfirmationModal from '../../Common/ConfirmationModel';
import ReasonsListModal from './ReasonsListModal';
import { ProcessType } from './MembershipHelper';
import CancelReasonForm from './CancelReasonForm';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Roles } from '../../../constants/RoleConstants';
import { CustomerConstants, MEDPLUS_ADVANTAGE, PaymentModes, SubscriptionStatus, getVertical } from '../Constants/CustomerConstants';
import { getCustomerRedirectionURL } from '../CustomerHelper';
import ButtonWithSpinner from '../../Common/ButtonWithSpinner';
import { CustomSpinners, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import ScrollNavTabs from './ScrollNavTabs';
import SendPlanDetailsToCustomerBtn from '../../Common/SendPlanDetailsToCustomerBtn';
import { SubscriptionPlanBenefitType } from '../Constants/CustomerConstants';
const SubscriptionDetails = (props) => {
    const subscriptionDetailFromProps = props.subscriptionDetails;
    const headerRef = useRef();
    const footerRef = useRef();
    const tabHeaderRef = useRef()
    const tabFooterRef = useRef();

    const [isFrontDeskUser, ROLE_CRM_LAB_SUBSCRIPTION_PLAN_ADD, ROLE_CRM_MA_MEMBER_EDIT,ROLE_CRM_LAB_SUBSCRIPTION_PLAN_RENEW, ROLE_CRM_LAB_SUBSCRIPTION_PLAN_CANCEL] = useRole([Roles.ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH, Roles.ROLE_CRM_LAB_SUBSCRIPTION_PLAN_ADD, Roles.ROLE_CRM_MA_MEMBER_EDIT,Roles.ROLE_CRM_LAB_SUBSCRIPTION_PLAN_RENEW, Roles.ROLE_CRM_LAB_SUBSCRIPTION_PLAN_CANCEL]);
    const [tabId, setTabId] = useState('1');
    const validate = Validate()
    const [subscriptions, setSubscriptions] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState();
    const [customerPoints, setCustomerPoints] = useState({});
    const [couponDetails, setCouponDetails] = useState({});
    const [subscriptionDetails, setSubscriptionDetails] = useState();
    const [subscriptionsCodes, setSubscriptionCodes] = useState([]);
    const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState();
    const [allMembers, setAllMembers] = useState();
    const [currentSubs, setCurrentSubs] = useState();
    const [membershipOrder, setMembershipOrder] = useState();
    const [totalAmount, setTotalAmount] = useState();
    const { setStackedToastContent } = useContext(AlertContext);
    const [statusList, setStatus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusActiveTab, setStatusActiveTab] = useState(0);
    const [subActiveTab, setSubActiveTab] = useState(0);
    const [comboActiveTab, setComboActiveTab] = useState(0);
    const [planDetails, setPlanDetails] = useState();
    const [comboPlanMap, setComboPlanMap] = useState();
    const [comboSubscriptionsList, setComboSubscriptionsList] = useState([]);
    const [showRenewModal, setShowRenewModal] = useState(false);
    const { customerId, subscription, setSubscription, customer, setCustomer  } = useContext(CustomerContext);
    const { martLocality } = useContext(LocalityContext);
    const [isConfirmationPopOver, setConfirmationPopOver] = useState(false);
    const [cancelReasons, setCancelReasons] = useState([]);
    const [confirmationPopOver, setConfirmation] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [isSuccessPopOver, setSuccessPopOver] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState();
    const [cancelOrderTxnRefId, setCancelOrderTxnRefId] = useState(null);
    const [comboPlans, setComboPlans] = useState();
    const [toggleEdit, setToggleEdit] = useState(false);
    const [isRefundEligible, setRefundEligible] = useState(false);
    const [showCancelSubModal, setCancelSubModal] = useState(false);
    const [regionsAndCollectionCenters, setRegionsAndCollectionCenters] = useState({});
    const [ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH] = useRole([Roles.ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH]);
    const [disableActionIcons, setDisableActionIcons] = useState(false);
    const [renewPlan, setRenewPlan] = useState();
    const [showSpinnerForRenew, setShowSpinnerForRenew] = useState(false);
    const [showSpinnerForCancel, setShowSpinnerForCancel] = useState(false);
    const [loadingForOrderSummary, setLoadingForOrderSummary] = useState(false);
    const [openInfoModal, setOpenInfoModal] = useState(false);
    const [showCancelOrderBtn, setshowCancelOrderBtn] = useState(false);
    const [currentComboPlanInfo, setCurrentComboPlanInfo] = useState(false);
    const userSessionInfo = useContext(UserContext);
    const [mobileflag,setMobileflag] = useState(false);
    const [isMartLocalityServiceable,setMartLocalityServiceable] = useState(true);
    const [isOpenRemainButtons, setOpenRemainButton] = useState(false);
    const [showOrderSummary, setShowOrderSummary] = useState(false);

   
    const orderStatus = {
        "ORDER_INITIATED": "Initiated",
        "ORDER_CANCELLED": "Cancelled",
        "PAYMENT_PENDING": "Payment Pending",
        "ORDER_WITHDRAWN": "Withdrawn",
        "PAYMENT_DONE": "Payment Done"
    };
    const paymentStatus = {
        "CREATED": "Created",
        "INITIATED": "Initiated",
        "SUCCEED": "Succeed",
        "FAILED": "Failed"
    };

    useEffect(() => {
        (userSessionInfo?.vertical && userSessionInfo.vertical == "V") &&
        setMobileflag(true)

      }, [])

    useEffect(() => {
        if(validate.isNotEmpty(martLocality))
        { 
            getSubscriptions();
            setStatusActiveTab(0);
            setComboActiveTab(0);
            setSubActiveTab(0);
            setTabId("1".toString());
        }
    }, [martLocality])

    useEffect(() => {
        if (validate.isNotEmpty(currentSubs?.id)) {
            resetForCurrentSubsChange();
            getSubscriptionDetails(currentSubs.id);
        }
        else if (validate.isNotEmpty(subscriptions[0]?.id)) {
            resetForCurrentSubsChange();
            getSubscriptionDetails(subscriptions[0]?.id);
        }
        if (validate.isNotEmpty(currentSubs)) {
            getRegionsAndCollectionCenters(currentSubs.benefitType[0]);
        }
    }, [currentSubs])

    useEffect(() => {
        getPaymentDetails();
    }, [currentSubscription])

    const resetForCurrentSubsChange = () => {
        setPlanDetails({});
        setMembershipOrder({});
        setPaymentDetails({});
    }

    const getRegionsAndCollectionCenters = async (benefitType) => {
        MembershipService().getRegionsAndCollectionCenters({ benefitType: benefitType }).then(response => {
            if (validate.isNotEmpty(response) && response.statusCode == 'SUCCESS' && validate.isNotEmpty(response.dataObject)) {
                setRegionsAndCollectionCenters(response.dataObject);
                setSubscription({...subscription,regions:response.dataObject.regions});
            }
        }).catch((err) => {
            console.log(err);
        })
    }


    const getPaymentDetails = async () => {
        if (validate.isEmpty(currentSubscription) || validate.isEmpty(currentSubscription.id)) {
            return;
        }
        setLoading(true);
        await MembershipService().getPaymentDetails({ data: { "customerId": customerId, "subscriptionId": currentSubscription?.id } }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode == "SUCCESS") {
                setPaymentDetails(data.dataObject)
                if (validate.isNotEmpty(data.dataObject.paymentDetails[0]) && validate.isNotEmpty(currentSubscription?.id)) {
                    setTotalAmount(data.dataObject.paymentDetails[0].amount);
                    getOrderSummary(data.dataObject.paymentDetails[0].orderId, currentSubscription?.id)
                    setShowOrderSummary(false);
                }
            }
            else {
                setStackedToastContent({ toastMessage: "Unable to get Payment Details" });
            }
        })
        setLoading(false);
    }

    const getOrderSummary = async (orderId, subsId) => {
        setLoadingForOrderSummary(true);
        await MembershipService().getOrderSummary({ "customerId": customerId, "orderId": orderId, "subscriptionId": subsId }).then(data => {
            if (validate.isNotEmpty(data) && data.responseMessage == "SUCCESS") {
                setMembershipOrder(data);
            }
            else {
                setStackedToastContent({ toastMessage: "Unable to get Order Summary" });
            }
            setLoadingForOrderSummary(false);
        }).catch((err) => {
            console.log(err);
            setLoadingForOrderSummary(false);
        })
    }

    const getDisplayableNamesForSubscriptionStatusTabs = (statuses) => {
        // let statusWithCount = [];
        const statusWithCount = statuses.map((each) => (
            <div key={each}>
                {capitalizeFirstLetter(each.toLowerCase())}
                <span className=' ms-5 badge text-dark bg-light rounded-pill border'>{Object.keys(subscriptionDetailFromProps.comboAndPlanMap[each]).length}</span>
            </div>
            // statusWithCount.push(capitalizeFirstLetter(each.toLowerCase()) + " - " + Object.keys(subscriptionDetailFromProps.comboAndPlanMap[each]).length);
        ))
        return statusWithCount;
    }

    const getSubscriptions = async () => {
        setMartLocalityServiceable(validate.isNotEmpty(martLocality.membershipConfig))
        setLoading(true);
        if (Validate().isNotEmpty(subscriptionDetailFromProps) && Validate().isNotEmpty(subscriptionDetailFromProps.subscriptions)) {
            let status = Object.keys(subscriptionDetailFromProps.comboAndPlanMap).sort();
            setStatus(status);
            setComboPlanMap(subscriptionDetailFromProps.comboAndPlanMap);
            setSubscriptions(subscriptionDetailFromProps.subscriptions);
            setSubscriptionCodes(subscriptionDetailFromProps?.comboAndPlanMap[status[0]]?.map(obj => Object.keys(obj)[0]));
            let comboSubscriptions = Object.values(Object.entries(Object.values(subscriptionDetailFromProps.comboAndPlanMap[status[0]]))[0][1])[0]
            comboSubscriptions.sort((a, b) => a.benefitType.localeCompare(b.benefitType)).reverse();
            if (validate.isNotEmpty(comboSubscriptions[0].comboPlanId)) {
                let comboSubscriptions = Object.values(Object.entries(subscriptionDetailFromProps.comboAndPlanMap[status[0]])[0][1])[0]
                setCurrentSubs(comboSubscriptions[0]);
                setComboPlans(comboSubscriptions);
                setComboSubscriptionsList(comboSubscriptions.map(subscriptions => SubscriptionPlanBenefitType[(subscriptions.benefitType)]));

            }
            else {
                setCurrentSubs(subscriptionDetailFromProps.subscriptions.find(subscription => subscription.status == status[0]));
            }
            let subscriptionsOfCurrentStatus = subscriptionDetailFromProps.comboAndPlanMap[status[0]];
            setSelectedSubscriptions(subscriptionsOfCurrentStatus);
        }
        else {
            setStackedToastContent({ toastMessage: "No subscription present for this customer" });
        }
        setLoading(false);
    }

    const getSubscriptionDetails = async (id) => {
        setLoading(true);
        if(validate.isEmpty(id)){
            id = currentSubscription.id;
        }
        await MembershipService().getSubscriptionDetails({ params: { "subscriptionId": id, "customerId": customerId, "excludeSubscribedMembers": "N" }, data: { onlineServingPlanIds: isFrontDeskUser ? martLocality?.membershipConfig?.configuredPlanIds : martLocality?.membershipConfig?.onlineServingPlanIds } }).then(data => {
            if (data.responseMessage = "SUCCESS") {
                setAllMembers(data.members);
                setCurrentComboPlanInfo(data.comboPlanDetail? data.comboPlanDetail: null)
                setSubscriptionDetails(data.subscription);
                setCurrentSubscription(data.subscription);
                setCouponDetails(data.couponDetails);
                setCustomerPoints(data.customerPoints);
                getPlans(data.subscription?.plan.id);
            }
            else {
                setStackedToastContent({ toastMessage: `Unable to get Subscription Details for ${id}` });
            }
        })
        setLoading(false);
    }

    const getPlans = async (planId) => {
        setLoading(true);
        await MembershipService().getPlanDetailsUsingPlanId({ "planId": planId, "customerId": customerId }).then(data => {
            if (data.responseMessage == "SUCCESS") {
                setPlanDetails(data);
            }
            else {
                setStackedToastContent({ toastMessage: "Unable to get Plan Details" });
            }
        })
        setLoading(false);
    }

    const sendingPaymentLinkToCustomer = async (orderId, isRetry) => {
        // setLoading(true);
        setDisableActionIcons(true);
        await MembershipService().sendPaymentLinkToCustomer({ "orderId": orderId, "isRetry": isRetry }).then(data => {
            if (data.statusCode = "SUCCESS") {
                setStackedToastContent({ toastMessage: "Payment Link Sent to Customer Mobile" });
            }
            else {
                setStackedToastContent({ toastMessage: "Failed to send payment link." });
            }
            setDisableActionIcons(false);
        })
        // setLoading(false);
    }

    const downloadInvoice = async (orderId) => {
        // setLoading(true);
        setDisableActionIcons(true);
        await CustomerService().downloadInvoice({ "customerId": customerId, "orderId": orderId }).then(data => {
            if (data.responseMessage = "SUCCESS") {
                const file = new Blob([data], {
                    type: "application/pdf",
                });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, '_blank');
            }
            else {
                setStackedToastContent({ toastMessage: "Unable to get Invoice." });
            }
            // setLoading(false);
            setDisableActionIcons(false);
        })
    }

    const handleTabId = (tabId) => {
        setComboActiveTab(0);
        let numToString = tabId.toString();
        let selectedSubs = Object.values(selectedSubscriptions[numToString])[0];
        selectedSubs.sort((a, b) => a.benefitType.localeCompare(b.benefitType)).reverse();
        if (selectedSubs.length > 1) {
            setComboPlans(selectedSubs)
            setComboSubscriptionsList(selectedSubs.map(subscriptions => SubscriptionPlanBenefitType[(subscriptions.benefitType)]));
        }
        else
            setComboSubscriptionsList([]);
        setCurrentSubs(selectedSubs[0]);
    }

    const handleComboTab = (tabId) => {
        setLoading(true);
        let numToString = tabId.toString();
        setCurrentSubs(comboPlans[numToString]);
        setLoading(false);
    }

    const handleStatusTabId = (tabId) => {
        setLoading(true);
        let numToString = tabId.toString();
        setSubActiveTab(0);
        setComboActiveTab(0);
        let subscriptionsOfCurrentStatus = comboPlanMap[statusList[numToString]];
        setSelectedSubscriptions(subscriptionsOfCurrentStatus);
        setSubscriptionCodes(subscriptionsOfCurrentStatus?.map(obj => Object.keys(obj)[0]))
        let isComboPlan = validate.isNotEmpty(Object.entries(comboPlanMap[statusList[numToString]][0])[0][1][0].comboPlanId);
        if (isComboPlan) {
            let comboSubscriptions = Object.values(Object.entries(comboPlanMap[statusList[numToString]])[0][1])[0];
            comboSubscriptions.sort((a, b) => a.benefitType.localeCompare(b.benefitType)).reverse();
            setCurrentSubs(comboSubscriptions[0]);
            setComboPlans(comboSubscriptions);
            setComboSubscriptionsList(comboSubscriptions.map(subscriptions => SubscriptionPlanBenefitType[(subscriptions.benefitType)]));
        }
        else {
            setComboSubscriptionsList([]);
            setCurrentSubs(subscriptions.filter(subscription => subscription.status === statusList[numToString])[0]);
        }
        setLoading(false);
    }

    const orderIdClick = (orderId, amount) => {
        setTotalAmount(amount);
        getOrderSummary(orderId, currentSubscription?.id);
        setShowOrderSummary(true);
    }

    const callPlanDetails = () => {
        if (validate.isNotEmpty(planDetails)) {
            return <div className='p-12 py-0'>
                <PlanDetails planInfo={planDetails.plan} customerId={customerId} feeDataGrid={planDetails.feesDataGrid} rulesDataGrid={planDetails.rulesDataGrid} fromSubscriptionDetail={true} subscriptionsAvailable={validate.isNotEmpty(subscriptions) ? true : false} subscriptionDetails={subscriptionDetails} currentComboPlanInfo={currentComboPlanInfo}/>
            </div>
        }
    }

    const upgradePlan = () => {
        if(!isMartLocalityServiceable){
            setStackedToastContent({ toastMessage: "Medplus Advantage is not configured in your martLocality", position: TOAST_POSITION.BOTTOM_START });
            return;
        }
        setSubscription({ ...subscription, members: currentSubscription?.members ,id: currentSubs.id, processType: ProcessType.UPGRADE_SUBSCRIPTION, totalMaxAllowed: planDetails.plan.totalMaxAllowed })
        props.setIsUpgradeProcess(true);
        props.setActivePlanIdTab(planDetails.plan.upgradePlanId);
        props.setActivePlanType(planDetails?.plan.type.type);
        props.setPageName(CustomerConstants.pageType.BUY_PLAN);
    }

    const buySamePlan = () => {
        setSubscription({ ...subscription, benefitType: renewPlan.benefitType, regions: regionsAndCollectionCenters.regions, plan: { id: renewPlan.id, name: renewPlan.name }, processType: ProcessType.RENEWAL_SUBSCRIPTION, totalMaxAllowed: renewPlan.totalMaxAllowed });
        redirectToAddMemberPage();
    }

    const orderSummaryCallBackMap = {
        "renderDobComponent": (props) => {
            const { row } = props;
            return <React.Fragment>
                <div>
                    {dateFormat(row.dob, "mmm dd, yyyy")}
                </div>
            </React.Fragment>
        },
        "renderGenderComponent": (props) => {
            const { row } = props;
            return <React.Fragment> 
                <div>
                    {getGenderString(row.gender)}
                </div>
            </React.Fragment>
        },
        "renderRelationshipComponent": (props) => {
            const { row } = props;
            return <React.Fragment>
                <div>
                    {OrderHelper().getStatusWithFirstLetterCapitalized(row.relationship)}
                </div>
            </React.Fragment>
        },
        "renderAddedOnComponent": (props) => {
            const { row } = props;
            const formattedDate = new Intl.DateTimeFormat('en-US', fullDateTime).format(new Date(row.addedOn))
            return <React.Fragment>
                <div>
                    {formattedDate}
                </div>
            </React.Fragment>
        },
        "renderSubsStatusComponent": (props) => {
            const { row } = props;
            let statusCellClass = OrderHelper().getBadgeColorClassForStatus(row.subsStatus) + " badge rounded-pill";
            return <React.Fragment>
                <div className={statusCellClass}>
                    {OrderHelper().getStatusWithFirstLetterCapitalized(row.subsStatus)}
                </div>
            </React.Fragment>
        },
        "subsStatusSummary": (props) => {
            return <React.Fragment>
                <div>
                    {orderBottomSummary[0].subsStatus}
                </div>
            </React.Fragment>
        },
        "amountSummary": () => {
            return <React.Fragment>
                <div>
                    {orderBottomSummary[0].amount}
                </div>
            </React.Fragment>
        }
    }

    const orderBottomSummary = [{
        "subsStatus": "Sub Amount",
        "amount": <div className='text-end'>
            <CurrencyFormatter data={totalAmount} decimalPlaces={2} />
        </div>
    }];

    const handleCancelClick = async (orderId, txnRefId) => {
        setDisableActionIcons(true);
        try {
            const response = await CustomerService().getCancelReasons({});
            if (response && response.message=== 'SUCCESS') {
                setConfirmationPopOver(true);
                setCancelOrderId(orderId);
                setCancelOrderTxnRefId(txnRefId ? txnRefId : null);
            }
            else {
                setStackedToastContent({ toastMessage: `Unable to get cancel reasons` })
            }
            setDisableActionIcons(false);
        } catch (error) {
            console.error('Error fetching cancel reasons:', error);
        }
    };

    const handleReasonSelect = (reason) => {
        setSelectedReason(reason);
    };

    const handleConfirmation = async () => {
        const response = await CustomerService().orderCancel({ "orderId": cancelOrderId, "reason": selectedReason, "txnRefId": cancelOrderTxnRefId, "customerId": customerId });
        if (response && response.statusCode === 'SUCCESS') {
            setCustomer({...customer, refreshData:true})
            setConfirmationPopOver(false);
            setSuccessPopOver(true);
            props.resetPage();
        }
        else {
            setStackedToastContent({ toastMessage: `Unable to cancel order at this time.` })
        }
    };

    const handleSuccessClose = () => {
        setSuccessPopOver(false);
        setConfirmationPopOver(false);
    };

    const checkPaymentStatus = async (orderId) => {
        // setLoading(true);
        setDisableActionIcons(true);
        await MembershipService().checkPaymentStatus({ "customerId": customerId, "orderId": orderId }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode == "SUCCESS") {
                if (validate.isNotEmpty(data.dataObject)) {
                    setStackedToastContent({ toastMessage: `Your payment status for this order ${orderId} is ${data.dataObject}` })
                    if (data.dataObject == "FAIL") {
                        setshowCancelOrderBtn(true);
                    }
                }
                if (data.dataObject == "SUCCESS") {
                    setTimeout(() => {
                        props.resetPage();
                    }, 3000)
                }
            }
            else {
                setStackedToastContent({ toastMessage: `Unable to check Payment Status` })
            }
            setDisableActionIcons(false);
        })
        // setLoading(false);
    }

    const getPaymentCOSCPaymentMode =(coscPaymentMode)=>{
        switch (coscPaymentMode) {
            case 'CREDIT_CARD':
                return "Credit Card";
            case 'DEBIT_CARD':
                return "Debit Card";
            case 'EDC':
                return "EDC";
            case 'PAYTM_EDC':
                return "Paytm EDC";
            case 'PHONEPE':
                return "PhonePe";
            default:
                return coscPaymentMode;
            }
    }

    const paymentDetailsCallBackMap = {
        "renderOrderIdComponent": (props) => {
            const { row } = props;
            let textColorClass = "btn btn-sm btn-link w-100";
            return <React.Fragment>
                <a className={textColorClass} onClick={() => orderIdClick(row.orderId, row.amount)} id={"orderID"}>
                    {row.orderId}
                </a>
                <UncontrolledTooltip placement="top" target={"orderID"}>
                    See The Order Details Of {row.orderId}
                </UncontrolledTooltip>
            </React.Fragment>
        },

        "renderPaymentModeComponent": (props) => {
            const { row } = props;
            const paymentMode = row.paymentMode ;
            const paymentCOSCPaymentMode = getPaymentCOSCPaymentMode(row.actualPayMode);
            return <React.Fragment>
                {paymentMode ? paymentMode : "-"} {paymentMode=="Cash On delivery" && row.actualPayMode != "CASH" ? `( ${paymentCOSCPaymentMode} )`:""}
            </React.Fragment>
        },

        "renderPaymentStatusComponent": (props) => {
            const { row } = props;
            const status = paymentStatus[row.txnStatus];
            let statusCellClass = OrderHelper().getBadgeColorClassForStatus(status) + " badge rounded-pill";
            return <React.Fragment>
                <div className={statusCellClass}>
                    {status ? status : "-"}
                </div>
            </React.Fragment>
        },
        "renderOrderDateComponent": (props) => {
            const { row } = props;
            const formattedDate = new Intl.DateTimeFormat('en-US', fullDateTime).format(new Date(row.createdAt))
            return <React.Fragment>
                {row.createdAt ? formattedDate : "-"}
            </React.Fragment>
        },
        "renderTransactionDateComponent": (props) => {
            const { row } = props;
            const formattedDate = new Intl.DateTimeFormat('en-US', fullDateTime).format(new Date(row.modifiedAt))
            return <React.Fragment>
                {row.modifiedAt ? formattedDate : "-"}
                {/* {dateFormat(row.modifiedAt, "yyyy-mm-dd")} */}
            </React.Fragment>
        },
        "renderOrderStatusComponent": (props) => {
            const { row } = props;
            const status = orderStatus[row.orderStatus];
            let statusCellClass = OrderHelper().getBadgeColorClassForStatus(status) + " badge rounded-pill";
            return <React.Fragment>
                <div className={statusCellClass}>
                    {status ? status : "-"}
                </div>
            </React.Fragment>
        },
        "renderActionComponent": (props) => {
            const { row } = props;
            return <React.Fragment>
                <div className='d-flex'>
                    {(row.orderStatus == 'PAYMENT_PENDING' && row.txnStatus == 'CREATED' && row.paymentMode != PaymentModes.cod && row.actualPayMode != 'EDC') ?
                        <Button variant=" " className='icon-hover' disabled={disableActionIcons} onClick={() => sendingPaymentLinkToCustomer(row.orderId, 'N')}><ShowPaymentIcon tooltip="Send payment link" /></Button> : <></>}
                    {row.orderStatus == 'PAYMENT_PENDING' && (row.txnStatus == 'FAILED') && row.paymentMode != PaymentModes.cod && row.actualPayMode != 'EDC' ?
                        <Button variant=" " className='icon-hover' disabled={disableActionIcons} onClick={() => sendingPaymentLinkToCustomer(row.orderId, 'Y')}><RetryPayment tooltip="Send payment link" /></Button> : <></>}
                    {row.txnStatus == 'INITIATED' && row.paymentMode == PaymentModes.cod && row.actualPayMode == "EDC" ?
                        <Button variant=" " className='icon-hover' disabled={disableActionIcons} onClick={() => checkPaymentStatus(row.orderId)}><PaymentStatus /></Button> : <></>}
                    {/* {row.orderStatus == 'PAYMENT_PENDING' && row.txnStatus == 'CREATED' || (row.txnStatus == 'FAILED') ?
                        <Button variant=" " className='icon-hover' onClick={() => { cancelSubscription(true) }}><CancelIcon /></Button> : <></>} */}
                    {row.txnStatus == 'SUCCEED' ?
                        <Button variant=" " className='icon-hover' disabled={disableActionIcons} onClick={() => downloadInvoice(row.orderId)}><InvoiceDownloadIcon /></Button> : <></>}
                    {(((row.orderStatus == 'PAYMENT_PENDING' && (row.txnStatus == 'CREATED' || (row.txnStatus == "FAILED" && paymentDetails?.paymentDetails.findIndex(payment => payment.orderId == row.orderId) == paymentDetails?.paymentDetails.length - 1)))) || (showCancelOrderBtn)) ?
                        <Button variant=" " className='icon-hover' disabled={disableActionIcons} onClick={() => handleCancelClick(row.orderId, row.txnRefId)}><CancelIcon /> </Button> : <></>}
                    {/* {(((row.orderStatus == 'PAYMENT_PENDING' && (row.txnStatus == 'CREATED' || (row.txnStatus == "FAILED" && paymentDetails?.paymentDetails.findIndex(payment => payment.orderId == row.orderId) == paymentDetails?.paymentDetails.length) - 1) && row.paymentMode != PaymentModes.cod && row.actualPayMode != 'EDC')) || (showCancelOrderBtn)) ?
                        <Button variant=" " className='icon-hover' disabled={disableActionIcons} onClick={() => handleCancelClick(row.orderId)}><CancelIcon /> </Button> : <></>} */}

                    {isConfirmationPopOver && < ReasonsListModal
                        isOpen={isConfirmationPopOver}
                        setSelectedReason={setSelectedReason}
                        onSelectReason={handleReasonSelect}
                        onClose={() => setConfirmationPopOver(false)}
                        setConfirmationPopOver={setConfirmationPopOver}
                        isConfirmationPopOver={isConfirmationPopOver}
                        onSubmit={handleConfirmation}
                        selectedReason={selectedReason}
                        onReasonSelect={handleReasonSelect}

                    />}
                    {isSuccessPopOver && <CommonConfirmationModal
                        isConfirmationPopOver={isSuccessPopOver}
                        setConfirmationPopOver={setSuccessPopOver}
                        confirmationPopOver={confirmationPopOver}
                        headerText="Order Cancelled Successfully"
                        message="Your order has been canceled successfully."
                        onSubmit={handleSuccessClose}
                    />}


                    {/* {selectedSubscriptions.status == 'REFUNDED' ?
                             <Button variant="outline-dark" className='btn-sm px-3 mx-1' onClick={() => downloadMembershipCreditNote(row.orderId)}>Download Credit Note</Button> : <></>} */}
                    {/* <button data-ng-show="paymentDetail.orderStatus == 'PAYMENT_PENDING' && paymentDetail.txnStatus == 'CREATED' && hasRole('ROLE_CRM_LAB_SUBSCRIPTION_PLAN_PAYMENT') && paymentDetail.paymentMode != 'cod' && paymentDetail.actualPayMode != 'EDC'" class="btn btn-primary btn-sm" data-ng-click="sendingPaymentLinkToCustomer(paymentDetail.orderId, 'N')">Send Payment Link</button> */}
                    {/* <button data-ng-show="paymentDetail.orderStatus == 'PAYMENT_PENDING' && (paymentDetail.txnStatus == 'FAILED' && $index == paymentDetails.length - 1) && hasRole('ROLE_CRM_LAB_SUBSCRIPTION_PLAN_PAYMENT') && paymentDetail.paymentMode != 'cod' && paymentDetail.actualPayMode != 'EDC'" class="btn btn-primary btn-sm" id="retryPayment" data-ng-click="sendingPaymentLinkToCustomer(paymentDetail.orderId, 'Y')">Send Retry Payment Link</button> */}
                    {/* <button data-ng-show="paymentDetail.txnStatus == 'INITIATED' && paymentDetail.paymentMode == 'cod' && paymentDetail.actualPayMode == 'EDC'" class="btn btn-success btn-sm" data-ng-click="checkMembershipDevicePaymentStatus(paymentDetail.orderId, selectedSubscriptionId)">Check Status</button> */}
                    {/* <button data-ng-show="paymentDetail.orderStatus == 'PAYMENT_PENDING' && (paymentDetail.txnStatus == 'CREATED' || (paymentDetail.txnStatus == 'FAILED' && $index == paymentDetails.length - 1))" class="btn btn-default btn-sm" data-ng-click="openReasonForCancelOrder(paymentDetail.orderId,paymentDetail.txnRefId)">Cancel</button> */}
                    {/* <button data-ng-show="paymentDetail.txnStatus == 'SUCCEED'" class="btn btn-primary btn-sm" data-ng-click="downloadOrderInvoice(paymentDetail.orderId)"><i class="fa fa-download" aria-hidden="true"></i>Download Invoice</button> */}

                </div>
            </React.Fragment>
        }
    }

    const addMemberToSubscription = () => {
        if(!isMartLocalityServiceable){
            setStackedToastContent({ toastMessage: "Medplus Advantage is not configured in your martLocality", position: TOAST_POSITION.BOTTOM_START });
            return;
        }
        let userCollectionCenter = regionsAndCollectionCenters?.collectionCenters;
        if (ROLE_CRM_MEDPLUS_SUBSCRIPTION_CASH && validate.isEmpty(userCollectionCenter)) {
            setStackedToastContent({ toastMessage: 'Medplus operations are not available in given state.' });
            return;
        }
        setSubscription({ ...subscription, ...subscriptionDetails, regions: regionsAndCollectionCenters.regions, processType: ProcessType.ADDON_SUBSCRIPTION });
        redirectToAddMemberPage();
    }

    const redirectToAddMemberPage = () =>{
        props.history.push({pathname:getCustomerRedirectionURL(customerId, MEDPLUS_ADVANTAGE + "/addMembersToPlan"), state:{isFromPlansPage: false}})
    }

    const showAddOnButton = () => {
        if (validate.isEmpty(subscriptionDetails)) {
            return false;
        }
        let activeMembers = subscriptionDetails?.members.filter(member => ['ACTIVE', 'PENDING'].includes(member.subscriptionStatus));
        let maxAllowed = subscriptionDetails?.plan?.rules?.find((rule) => rule.name == 'MAXIMUM_TOTAL_MEMBERS').value;
        return (new Date() >= new Date(subscriptionDetails.startDate)) && (subscriptionDetails?.status == 'ACTIVE' && activeMembers.length < maxAllowed && subscriptionDetails?.benefitType == "HEALTH_CARE" && (isFrontDeskUser || ROLE_CRM_LAB_SUBSCRIPTION_PLAN_ADD));
    }

    const availableAddOnMembers = () => {
        let activeMembers = subscriptionDetails?.members.filter(member => ['ACTIVE', 'PENDING'].includes(member.subscriptionStatus));
        let maxAllowed = subscriptionDetails?.plan?.rules?.find((rule) => rule.name == 'MAXIMUM_TOTAL_MEMBERS').value;
        return maxAllowed - activeMembers.length;
    }

    const CloseButton = <Button variant="link" className="align-self-center icon-hover rounded-5" type="button" onClick={() => setShowRenewModal(!showRenewModal)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <rect fill="none" width="24" height="24" />
            <path d="M20.76,19.55l-7.58-7.56,7.56-7.56a.846.846,0,0,0-.04-1.18.822.822,0,0,0-1.13,0L12,10.81,4.44,3.24A.827.827,0,0,0,3.27,4.41l7.56,7.58L3.27,19.55a.835.835,0,0,0,1.14,1.22l.04-.04L12,13.17l7.56,7.56a.833.833,0,0,0,1.17,0h0a.821.821,0,0,0,.04-1.16A.031.031,0,0,0,20.76,19.55Z" fill="#b9b9b9" />
        </svg>
    </Button>

    const isElgibleToCancel = (subscription) => {
        let currentDate = new Date();
        if (validate.isEmpty(subscriptionDetails)) {
            return false;
        }
        if (subscription.status !== "ACTIVE") {
            return false;
        }
        if (!(currentDate >= new Date(subscription.startDate) && currentDate <= new Date(subscription.endDate))) {
            return false;
        }
        return ROLE_CRM_LAB_SUBSCRIPTION_PLAN_CANCEL;
    }

    const checkCustomerEligibilityForRefund = () => {
        setShowSpinnerForCancel(true);
        const config = { "subscriptionId": subscriptionDetails.id, "customerId": customerId, "comboPlanId": subscriptionDetails.comboPlanId ? subscriptionDetails.comboPlanId : null };
        MembershipService().checkCustomerEligibilityForRefund(config).then(res => {
            if (validate.isNotEmpty(res) && validate.isNotEmpty(res.dataObject) && validate.isNotEmpty(res.message) && "SUCCESS" == res.message) {
                setRefundEligible(res.dataObject.isRefundEligible ? res.dataObject.isRefundEligible : false);
                setCancelSubModal(true);
            } else
                setStackedToastContent({ toastMessage: res.message ? res.message : "" });
            setShowSpinnerForCancel(false);
        }).catch(err => {
            console.log("Error while trying to cancel Subscription", err);
            setShowSpinnerForCancel(false);
        })
    }

    const showRenewButton = () => {
        if (validate.isEmpty(subscriptionDetailFromProps)) {
            return false;
        }
        const activeSubscriptions = subscriptionDetailFromProps.comboAndPlanMap["ACTIVE"];
        if (validate.isEmpty(activeSubscriptions)) {
            return false;
        }
        if (validate.isEmpty(currentSubs) || validate.isEmpty(currentSubs.status) || currentSubs.status !== "ACTIVE") {
            return false;
        }
        if (validate.isEmpty(planDetails) || !(planDetails.plan.type.type === CustomerConstants.subscriptionType.INDIVIDUAL || planDetails.plan.type.type === CustomerConstants.subscriptionType.INDIVIDUAL_COMBO)) {
            return false;
        }
        if (!ROLE_CRM_LAB_SUBSCRIPTION_PLAN_RENEW) {
            return false;
        }
        return validate.isNotEmpty(subscriptionDetailFromProps.renewalAllowed) ? subscriptionDetailFromProps.renewalAllowed[currentSubs.id] : false;
    }

    const showCancelButton = () => {
        let currentDate = new Date();
        if (validate.isEmpty(subscriptionDetails)) {
            return false;
        }
        if (subscriptionDetails.status !== "ACTIVE") {
            return false;
        }
        if (!(currentDate >= new Date(subscriptionDetails.startDate) && currentDate <= new Date(subscriptionDetails.endDate))) {
            return false;
        }
        return ROLE_CRM_LAB_SUBSCRIPTION_PLAN_CANCEL;
    }

    const showUpgradeButton = () => {
        if (validate.isEmpty(currentSubscription) || validate.isEmpty(currentSubscription.upgradePlanSummary)) {
            return false;
        }
        if (subscriptionDetails.status !== "ACTIVE") {
            return false;
        }
        return validate.isEmpty(comboSubscriptionsList);
    }

    const submitCancelSubscription = async () => {
        setCancelSubModal(false);
        setToggleEdit(true);
    }

    const renew_subscription = async () => {
        if(!isMartLocalityServiceable){
            setStackedToastContent({ toastMessage: "Medplus Advantage is not configured in your martLocality", position: TOAST_POSITION.BOTTOM_START });
            return;
        }
        setShowSpinnerForRenew(true);
        let commonPlanDetails = planDetails;
        if (validate.isNotEmpty(currentSubs?.comboPlanId)) {
            commonPlanDetails = await get_alternate_plan_details(currentSubs?.comboPlanId)
        }
        setRenewPlan(commonPlanDetails.plan)
        if (commonPlanDetails?.plan?.status === "ACTIVE" && (isFrontDeskUser || commonPlanDetails?.plan?.onlineVisibility.toLowerCase() === 'yes')) {
            setShowRenewModal(true);
            setShowSpinnerForRenew(false);
        } else if ((commonPlanDetails?.plan?.type?.type === "INDIVIDUAL" || commonPlanDetails?.plan?.type?.type === "INDIVIDUAL_COMBO") && validate.isNotEmpty(commonPlanDetails?.plan?.alternateRenewalPlanId)) {
            let alternatePlanId = commonPlanDetails?.plan?.alternateRenewalPlanId;
            let response = checkAlternateRenewalPlanIdIsInMembershipConfig(alternatePlanId);
            if ("SUCCESS" != response) {
                setStackedToastContent({ toastMessage: response });
                props.setPageName(CustomerConstants.pageType.BUY_PLAN);
            } else {
                commonPlanDetails = await get_alternate_plan_details(alternatePlanId);
            }
            setRenewPlan(commonPlanDetails.plan)
            setShowSpinnerForRenew(false);
        } else {
            setStackedToastContent({ toastMessage: "Your existing plan has been discontinued, kindly select a new plan to proceed" });
            props.setPageName(CustomerConstants.pageType.BUY_PLAN);
            setShowSpinnerForRenew(false);
        }
    }

    const get_alternate_plan_details = async (alternatePlanId) => {
        let response = await MembershipService().getPlanDetails({ "planId": alternatePlanId, "customerId": customerId });
        return response;
    }

    const checkAlternateRenewalPlanIdIsInMembershipConfig = (alternateRenewalPlanId) => {
        console.log(martLocality.membershipConfig);
        if (isFrontDeskUser && !(martLocality.membershipConfig.configuredPlanIds.includes(alternateRenewalPlanId))) {
            return "Currently this plan is not available in your location. Please change the location or continue with other plans";
        }
        if (!isFrontDeskUser && !(martLocality.membershipConfig.onlineServingPlanIds.includes(alternateRenewalPlanId))) {
            return "Currently this plan is not available in your location. Please change the location or continue with other plans";
        }
        return "SUCCESS";
    }
    const displayMobileFooter = () => {
        return(
            <>{
                <div className='d-flex gap-2'>
                    {showRenewButton() && <ButtonWithSpinner disabled={showSpinnerForRenew} variant=" " className='brand-secondary px-3' showSpinner={showSpinnerForRenew} onClick={() => renew_subscription()} buttonText={`Renew ${!mobileflag ? "Subscription" : ""}`}></ButtonWithSpinner>}
                    {showCancelButton && <ButtonWithSpinner disabled={showSpinnerForCancel} variant=' ' className='px-3 btn-brand me-3' showSpinner={showSpinnerForCancel} onClick={() => { checkCustomerEligibilityForRefund() }} buttonText={`cancel ${!mobileflag ? "Subscription" : ""}`}></ButtonWithSpinner>}
                    <div onClick={()=>{setOpenRemainButton(!isOpenRemainButtons)}} className='d-flex align-items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="#000000" class="bi bi-three-dots-vertical">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                    {isOpenRemainButtons && <div class="customdropdown-position position-absolute text-secondary" style={{bottom : `${footerRef?.current.offsetHeight}px`}}>
                    {showAddOnButton() && <Button variant=' ' className='px-3 brand-secondary' onClick={() => addMemberToSubscription()}>{!mobileflag && <span>Subscribe </span>}Add On Member</Button>}
                            {showUpgradeButton() && <Button variant="" className='mx-3 btn-brand px-3 mx-1' onClick={() => upgradePlan()}>Upgrade Plan @ {currentSubscription?.upgradePlanSummary?.totalAmountToPay}</Button>}
                                    </div>
                }
                    </div>

                </div>
            }</>
        )
    }
    const conditions = [showRenewButton(), showAddOnButton(),showUpgradeButton(),showCancelButton()];

    const trueConditionsCount = conditions.filter(condition => condition).length;


    return (
        <Wrapper>
            <HeaderComponent ref={headerRef} className="d-flex justify-content-between border-bottom">
                {validate.isNotEmpty(statusList) && <ScrollNavTabs className="border-bottom-0 overflow-y-auto" tabs={getDisplayableNamesForSubscriptionStatusTabs(statusList)} onTabChange={handleStatusTabId} activeTab={statusActiveTab} setActiveTab={setStatusActiveTab} />}
                {validate.isNotEmpty(subscriptionDetailFromProps) && subscriptionDetailFromProps.subscribeNow && <Button variant=" " className={`${!mobileflag ? "mx-3 btn-sm px-3 btn-link" : "col-4  mx-1 btn-sm btn-link"}`} onClick={() => (props.setIsUpgradeProcess(false), props.setActivePlanIdTab(null), props.setActivePlanType(), props.setPageName(CustomerConstants.pageType.BUY_PLAN), setSubscription({ ...subscription, processType: ProcessType.NEW_SUBSCRIPTION }))}> {!mobileflag&&<span>Subscribe</span>} New Plan</Button>}
            </HeaderComponent>
            <BodyComponent allRefs={{ headerRef, footerRef }} className={`body-height`}loading={loading}>
                <div className={`pb-0 card h-100`}>
                    <HeaderComponent ref={tabHeaderRef}>
                        {/* <NavTabs refRequiired={true} tabs={subscriptionsCodes} onTabChange={handleTabId} activeTab={subActiveTab} setActiveTab={setSubActiveTab} className={validate.isEmpty(subscriptionsCodes) ? "border-bottom-0" : "tabs-nowrap"} /> */}
                        <ScrollNavTabs refRequiired={true} tabs={subscriptionsCodes} onTabChange={handleTabId} activeTab={subActiveTab} setActiveTab={setSubActiveTab} className={validate.isEmpty(subscriptionsCodes) ? "border-bottom-0" : "tabs-nowrap"}/>
                        {comboSubscriptionsList && <ScrollNavTabs subClassName={"sub-tabs"} className="tabs-nowrap" tabs={comboSubscriptionsList} onTabChange={handleComboTab} activeTab={comboActiveTab} setActiveTab={setComboActiveTab} />}
                    </HeaderComponent>
                    {!loading && <><BodyComponent allRefs={{"headerRef": tabHeaderRef,"footerRef": tabFooterRef}} className="subscription body-height p-0" loading={loading}>
                        <TabContent activeTab={tabId}>
                            {subscriptions.map((item, index) => (
                                <TabPane key={index} tabId={(index+1).toString()}>
                                    <SubscriptionInfo setLoading = {setLoading} subscriptionDetails={subscriptionDetails} currentSubs ={currentSubs} customerPoints={customerPoints} couponDetails={couponDetails} />
                                    {planDetails && callPlanDetails()}
                                    {validate.isNotEmpty(currentComboPlanInfo) &&
                                    <div className="p-12"><label className="pb-0 custom-fieldset font-weight-bold mb-2">{currentComboPlanInfo?.displayName}</label> - <span className="text-success"><CurrencyFormatter data={currentComboPlanInfo?.price} decimalPlaces={2} /></span> <del className="text-secondary"><CurrencyFormatter data={currentComboPlanInfo.amount} decimalPlaces={2} /></del>/Year</div>}
                                    <div className='p-12'>
                                        <label class="d-block pb-0 custom-fieldset">Added Members</label>
                                        <div className='d-lg-flex flex-lg-wrap row g-3'>
                                            {subscriptionDetails?.members?.map((member) => {
                                                return (
                                                    <div className='col-lg-4 col-12'>
                                                        <ExistingMemberCard fromSubscriptionDetail members={subscriptionDetails.members} member={{...member,...allMembers?.find(eachMember => eachMember.patientId == member.patientId)}} showCheckBox={false} showEdit={(new Date() >= new Date(subscriptionDetails.startDate)) && subscriptionDetails.status == SubscriptionStatus.active && member.subscriptionStatus === 'ACTIVE' && member.updatedCount < 3 && ROLE_CRM_MA_MEMBER_EDIT} onSuccess={() => { getSubscriptionDetails() }}/>
                                                    </div>
                                                )
                                            })}

                                        </div>
                                    </div>

                                    <div className='p-12 w-100'>
                                        <label class="d-block pb-2 custom-fieldset">Order & Payment Details</label>
                                        {validate.isNotEmpty(paymentDetails) && <div className={"card mb-3 w-100"}>
                                            <DynamicGridHeight id="order-payment" metaData={paymentDetails?.paymentDataGrid} dataSet={paymentDetails?.paymentDetails} className="block-size-100">
                                                <CommonDataGrid {...paymentDetails?.paymentDataGrid} dataSet={paymentDetails?.paymentDetails} callBackMap={paymentDetailsCallBackMap} />
                                            </DynamicGridHeight>
                                        </div>}
                                        {loadingForOrderSummary ?
                                            <div className='d-flex justify-content-center'><CustomSpinners /></div>
                                            :
                                            showOrderSummary ? <>
                                                <label class="d-block pb-2  custom-fieldset">Order Summary Of <span className='fw-bold text-warning'>{membershipOrder?.membershipOrder?.orderId}</span></label>
                                                <label className='text-primary font-14'>Created Info</label>
                                                <div class="d-flex flex-wrap planInfo mb-3 row gy-2">
                                                    <div class="col-6 col-lg-2">
                                                        <label className="font-12 text-secondary" >Created By</label>
                                                        <p className="font-14 mb-0">{membershipOrder?.membershipOrder?.createdBy ? membershipOrder?.membershipOrder?.createdBy : "-"}</p>
                                                    </div>
                                                    <div class="col-6 col-lg-2">
                                                        <label className="font-12 text-secondary">Created From</label>
                                                        <p className='font-14 mb-0'>{membershipOrder?.membershipOrder?.vertical ? getVertical(membershipOrder?.membershipOrder?.vertical) : "-"} </p>
                                                    </div>
                                                    <div class="col col-lg-8">
                                                        <label className="font-12 text-secondary">Created In</label>
                                                        <p className='font-14 mb-0'>{membershipOrder?.store?.name ? membershipOrder?.store?.name : "-"} {membershipOrder?.store?.storeId ? `(  ${membershipOrder?.store?.storeId} )` : ""} </p>
                                                    </div>
                                                </div>
                                                {validate.isNotEmpty(membershipOrder) && validate.isNotEmpty(membershipOrder.membershipOrder) && membershipOrder.membershipOrder.status == "ORDER_CANCELLED" && <><label className='text-danger font-14'>Cancelled Info</label>

                                                    <div class="d-flex flex-wrap planInfo col-12 mb-3">
                                                        <div class="col-6 col-lg-2">
                                                            <label className="font-12 text-secondary" >Cancelled By</label>
                                                            <p className="font-14 mb-0">{membershipOrder?.membershipOrder?.modifiedBy ? membershipOrder?.membershipOrder?.modifiedBy : "-"}</p>
                                                        </div>
                                                        <div class="col-6 col-lg-2">
                                                            <label className="font-12 text-secondary">Cancelled Date</label>
                                                            <p className='font-14 mb-0'>{membershipOrder?.membershipOrder?.dateModified ? dateFormat(membershipOrder?.membershipOrder?.dateModified) : "-"} </p>
                                                        </div>
                                                        <div class="col-6 col-lg-2">
                                                            <label className="font-12 text-secondary">Cancelled Reason</label>
                                                            <p className='font-14 mb-0'>{membershipOrder?.membershipOrder?.remarks ? membershipOrder?.membershipOrder?.remarks : "-"}</p>
                                                        </div>
                                                    </div></>}

                                                {validate.isNotEmpty(membershipOrder) && <div className={"card mb-3 w-100"}>
                                                    <DynamicGridHeight id="order-summary" metaData={membershipOrder?.orderSummaryDataGrid} dataSet={membershipOrder?.orderSummary} bottomSummaryRows={orderBottomSummary} className="block-size-100">
                                                        <CommonDataGrid {...membershipOrder?.orderSummaryDataGrid} dataSet={membershipOrder?.orderSummary} callBackMap={orderSummaryCallBackMap} bottomSummaryRows={orderBottomSummary} />
                                                    </DynamicGridHeight>
                                                </div>}
                                            </> : <></>}
                                    </div>
                                </TabPane>
                            ))}
                        </TabContent>
                    </BodyComponent>
                    {validate.isNotEmpty(currentComboPlanInfo) && <FooterComponent ref={tabFooterRef} className="border-top justify-content-between align-items-center d-flex">
                        <div className="p-12"><label className="pb-0 font-weight-bold">{currentComboPlanInfo?.displayName}</label> - <span className="text-success"><CurrencyFormatter data={currentComboPlanInfo?.price} decimalPlaces={2} /></span> </div>
                        {<SendPlanDetailsToCustomerBtn className={`${!mobileflag ? "" : "p-0    "} btn-link font-14`} buttonText={`${!mobileflag ? "Send Plan Details to Customer" : ""}`} planId={planDetails?.plan?.id} />}
                    </FooterComponent>}
                    
                    </>}

                </div>
                <CancelReasonForm resetPage={props.resetPage} isModalOpen={toggleEdit} setToggleEdit={setToggleEdit} />
                <Modal className="modal-dialog-centered" isOpen={showRenewModal}>
                    <ModalHeader className='p-2' close={CloseButton}>
                        Do you want to continue with same Plan?
                    </ModalHeader>
                    <ModalBody>
                        <span className='text-secondary'>Plan:</span> {renewPlan?.displayName}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant=" " className="px-4 me btn-brand" onClick={() => buySamePlan()}>
                            Yes
                        </Button>
                        <Button variant=" " className="brand-secondary px-2" onClick={() => props.setPageName(CustomerConstants.pageType.BUY_PLAN)}>
                            No
                        </Button>
                    </ModalFooter>
                </Modal>
                {openInfoModal && <div class="customdropdown-position position-absolute text-secondary" style={{bottom : `${footerRef?.current.offsetHeight}px`}}>
                                        <h6 class="text-dark font-14">Note Information</h6>
                                        <ol>
                                            <li>Can add Extra {availableAddOnMembers()} Member(s) in this Subscription</li>
                                        </ol>
                                    </div>
                }
            </BodyComponent>
            {(showRenewButton() || showCancelButton() || showAddOnButton() || showUpgradeButton() || showCancelSubModal || toggleEdit) && 
                <FooterComponent ref={footerRef} className={`p-12 border-top d-flex  gap-3 ${showAddOnButton() ? "justify-content-between" : "justify-content-end"}`}>
                    {showAddOnButton() && <div>
                        <Button variant="link link-dark" className='btn-lg mb-0 font-14' onClick={() => setOpenInfoModal(!openInfoModal)} >
                            {!mobileflag ? <span>Note <svg id="leftchevron_black_icon_18px" className={`${!openInfoModal ? "collapse-arrow rotate-up-half" : "collapse-arrow rotate-bottom"}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                        <rect id="Rectangle_4722" data-name="Rectangle 4722" width="18" height="18" fill="none" />
                                        <path id="Path_23401" data-name="Path 23401" d="M4.43.275.274,4.431A.942.942,0,0,0,1.606,5.763L5.1,2.283,8.587,5.774A.945.945,0,0,0,10.2,5.108a.936.936,0,0,0-.279-.666L5.762.275A.945.945,0,0,0,4.43.275Z" transform="translate(4.08 5.761)" fill="#6c757d" />
                                    </svg> </span>: "i"}
                            
                        </Button>
                    </div>}
                        {!(mobileflag && trueConditionsCount >= 3)  ? (<div>
                            {showRenewButton() && <ButtonWithSpinner disabled={showSpinnerForRenew} variant=" " className='brand-secondary px-3' showSpinner={showSpinnerForRenew} onClick={() => renew_subscription()} buttonText={`Renew ${!mobileflag ? "Subscription" : ""}`}></ButtonWithSpinner>}
                            {showCancelButton() && <ButtonWithSpinner disabled={showSpinnerForCancel} variant=' ' className='px-3 brand-secondary me-3' showSpinner={showSpinnerForCancel} onClick={() => { checkCustomerEligibilityForRefund() }} buttonText={`Cancel ${!mobileflag ? "Subscription" : ""}`}></ButtonWithSpinner>}
                            {showAddOnButton() && <Button variant=' ' className='px-3 btn-brand' onClick={() => addMemberToSubscription()}>{!mobileflag && <span>Subscribe </span>}Add On Member</Button>}
                            {showUpgradeButton() && <Button variant="" className='mx-3 btn-brand px-3 mx-1' onClick={() => upgradePlan()}>Upgrade Plan @ {currentSubscription?.upgradePlanSummary?.totalAmountToPay}</Button>}
                    </div>): displayMobileFooter()}
                        {showCancelSubModal && <CommonConfirmationModal small headerText={"Do you want to cancel subscription?"} isConfirmationPopOver={true} setConfirmationPopOver={setCancelSubModal} message={isRefundEligible ? "This subscription is eligible for full refund. Do you wish to proceed with cancellation?" : "This subscription is not eligible for refund. Do you wish to proceed with cancellation?"} buttonText={"Yes"} onSubmit={() => submitCancelSubscription()} />}
                        {toggleEdit && !showCancelSubModal && <CancelReasonForm setToggleEdit={setToggleEdit} isModalOpen={toggleEdit} subscription={subscriptionDetails} isRefundEligible={isRefundEligible} {...props} onSuccess={() => { getSubscriptions() }} />}
            </FooterComponent>
            }
            </Wrapper>

    )
}

export default SubscriptionDetails