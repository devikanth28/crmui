import React, { useContext, useEffect, useRef, useState } from 'react';
import { isResponseSuccess } from '../../../../helpers/CommonHelper';
import LabOrderService from '../../../../services/LabOrder/LabOrderService';
import { AlertContext, CustomerContext, LocalityContext, UserContext } from '../../../Contexts/UserContext';
import PatientCard from '../../../Checkout/ShoppingCart/PatientInfo/PatientCard';
import SampleCollectionDetails from './SampleCollectionDetails';
import Validate from '../../../../helpers/Validate';
import LabApplyCoupon from './LabApplyCoupon';
import LabTestGrid from './LabTestGrid';
import DeliveryDetails from '../../../Checkout/Review/DeliveryDetails';
import { BodyComponent, Wrapper } from '../../../Common/CommonStructure';
import { HeaderComponent } from '../../../Common/CommonStructure';
import { FooterComponent } from '../../../Common/CommonStructure';
import { getCustomerRedirectionURL } from '../../CustomerHelper';
import { LAB_ORDER } from '../../Constants/CustomerConstants';
import { Nav, NavItem, NavLink } from 'reactstrap';
import PaymentForm from '../../MembershipAdvantage/orderReview/PaymentForm';
import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import { Roles } from '../../../../constants/RoleConstants';
import useRole from '../../../../hooks/useRole';
import EdcDevicesForm from '../../MembershipAdvantage/orderReview/EdcDevicesForm';
import ButtonWithSpinner from '../../../Common/ButtonWithSpinner';
import { CRM_UI } from '../../../../services/ServiceConstants';
import MdxPoints from './MdxPoints';
import CurrencyFormatter from '../../../Common/CurrencyFormatter';

function LabReview(props) {
    const { customerId } = useContext(CustomerContext);
    const userSessionInfo = useContext(UserContext);
    const [isFrontOfficeOrderCreate] = useRole([Roles.ROLE_CRM_LAB_FRONT_OFFICE_ORDER_CREATE]);
    const { setStackedToastContent } = useContext(AlertContext);
    const { setIsLocalityComponentNeeded } = useContext(LocalityContext);
    const { labLocality } = useContext(LocalityContext);
    const validate = Validate();
    const headerRef = useRef(0);
    const footerRef = useRef(0);
    const labOrderService = LabOrderService();
    const [orderReview, setOrderReview] = useState({});
    const [cartSummary, setCartSummary] = useState("");
    const [testDataset, setTestDataset] = useState([]);
    const [initialLoader, setInitialLoader] = useState(true);
    const [paymentType, setPaymentType] = useState("");
    const [selectedCollectionCenterId, setSelectedCollectionCenterId] = useState("");
    const [selectedEdcDevice, setSelectedEdcDevice] = useState("");
    const [amount, setAmount] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardDeviceId, setCardDeviceId] = useState("");
    const [cardTxnNumber, setCardTxnNumber] = useState("");
    const [labOrderSpinner, setLabOrderSpinner] = useState(false);
    const [isTPDcenter, setIsTPDcenter] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paymentGatewayStatus, setPaymentGatewayStatus] = useState("");
    const [labCartInfo, setLabCartInfo] = useState(undefined);
    const [mdxFlag, setMdxFlag] = useState(false);
    const [labOrders, setLabOrders] = useState([]);

    useEffect(() => {
        setIsLocalityComponentNeeded(false);
        getLabReviewCart(mdxFlag);
    }, [labLocality]);

    const getLabReviewCart = (mdxFlag) => {
        const config = { headers: { customerId: customerId }, params: { customerId: customerId, applyMdxPointsPayment: mdxFlag } }
        LabOrderService().getLabReviewCart(config).then((response) => {
            if (isResponseSuccess(response) && validate.isNotEmpty(response.responseData)) {
                setOrderReview(response.responseData);
                setCartSummary(response.responseData.cartSummary);
                setLabOrders(validate.isNotEmpty(response.responseData?.homeLabOrders) ? response.responseData?.homeLabOrders[0] : validate.isNotEmpty(response.responseData?.walkInLabOrders) ? response.responseData?.walkInLabOrders[0] : []);
                setTestDataset(response.responseData.homeLabOrderItems ? response.responseData.homeLabOrderItems : response.responseData.walkInLabOrderItems);
                if (validate.isNotEmpty(response.responseData?.labAddress)) {
                    setSelectedCollectionCenterId(response.responseData?.labAddress?.storeId);
                    if (response.responseData?.labAddress?.categoryId === 7) {
                        setIsTPDcenter(true);
                    }
                }
                setMdxFlag(response.responseData.cartSummary?.applyMdxPointsPayment);
            } else {
                setStackedToastContent({ toastMessage: response?.message ? response.message : "Unable to get lab review" });
                props.history.push(getCustomerRedirectionURL(customerId, LAB_ORDER))
            }
            setInitialLoader(false);
        }).catch((e) => {
            console.log(e);
            setInitialLoader(false);
        });
    }

    const getTestSummaryRows = () => {
        let summaryRows = [
            { "mrp": "Cart Total", "price": <CurrencyFormatter data={cartSummary.totalPrice} decimalPlaces={2} /> },
            ...(validate.isNotEmpty(cartSummary.totalDiscount) && cartSummary.totalDiscount > 0 ? [{ "mrp": "Discount Amount", "price": <CurrencyFormatter data={cartSummary.totalDiscount} decimalPlaces={2} /> }] : []),
            ...(validate.isNotEmpty(cartSummary.collectionCharges) && cartSummary.collectionCharges > 0 ? [{ "mrp": "Sample Collection Charges", "price": <CurrencyFormatter data={cartSummary.collectionCharges} decimalPlaces={2} /> }] : []),
            ...(validate.isNotEmpty(cartSummary.reportDeliveryCharges) && cartSummary.reportDeliveryCharges > 0 ? [{ "mrp": "Report Delivery Charges", "price": <CurrencyFormatter data={cartSummary.reportDeliveryCharges} decimalPlaces={2} /> }] : []),
            ...(cartSummary.applyMdxPointsPayment && validate.isNotEmpty(cartSummary.applicableMdxPoints) > 0 ? [{ "mrp": `Applied MDx Points Value`, "price": <div><CurrencyFormatter data={cartSummary.applicableMdxPointsWorth} decimalPlaces={2} /> ({cartSummary.applicableMdxPoints} pts)</div> }] : []),
            { "mrp": "Grand Total", "price": <CurrencyFormatter data={cartSummary.totalAmount} decimalPlaces={2} /> }
        ];
        return summaryRows;
    }

    const disableSubmitButton = () => {
        if (cartSummary && cartSummary?.totalAmount == 0) {
            return false;
        }
        if (isFrontOfficeOrderCreate && isTPDcenter) {
            return true;
        }
        if (validate.isEmpty(paymentType)) {
            return true;
        }
        if (isFrontOfficeOrderCreate && validate.isEmpty(selectedCollectionCenterId)) {
            return true;
        }
        if (paymentType === "CREDIT_CARD") {
            if (validate.isEmpty(cardNumber)) {
                return true;
            }
            if (validate.isEmpty(cardDeviceId)) {
                return true;
            }
            if (validate.isEmpty(cardTxnNumber)) {
                return true;
            }
            if (validate.isEmpty(amount)) {
                return true;
            }
            if (parseFloat(amount).toFixed(2) !== parseFloat(cartSummary.totalAmount).toFixed(2)) {
                return true;
            }
        } else if (paymentType === "PAYTM_EDC") {
            if (validate.isEmpty(selectedEdcDevice)) {
                return true;
            }
        } else if (paymentType === "CASH") {
            if (validate.isEmpty(amount)) {
                return true;
            }
            if (parseFloat(amount).toFixed(2) !== parseFloat(cartSummary.totalAmount).toFixed(2)) {
                return true;
            }
        }
        return false;
    }

    const preparePaymentType = () => {
        let type = undefined;
        let needToCollectAmount = labOrders?.netCashToBeCollected + labOrders?.roundedValue;
        let orderRoundedVal = labOrders?.roundedValue;
        let grandTotal = labOrders?.totalAmount;
        if (isFrontOfficeOrderCreate) {
            switch (paymentType) {
                case "CASH":
                    type = (grandTotal > 0 && needToCollectAmount == 0 && Math.abs(orderRoundedVal) == 0) ? "O" : "C";
                    break;
                case "CREDIT_CARD":
                case "PAYTM_EDC":
                    type = "C";
                    break;
            }
        } else {
            type = (paymentType === "ONLINE") ? "O" : ((grandTotal > 0 && needToCollectAmount == 0 && Math.abs(orderRoundedVal) == 0) ? "O" : "C");
        }
        return type;
    }

    const prepareLabOrderPaymentDetails = () => {
        let paymentsList = [];
        let orderPaymentDetails = { mode: "cash", cardNumber: "", txnNumber: "", deviceId: "", amount: "" };
        switch (paymentType) {
            case "CASH": {
                orderPaymentDetails.amount = amount;
                orderPaymentDetails.mode = "cash";
                if (orderPaymentDetails.amount > 0) {
                    paymentsList.push(orderPaymentDetails);
                }
                let orderRoundedVal = labOrders?.roundedValue.toFixed(2);
                if (Math.abs(orderRoundedVal) > 0) {
                    let roundedPaymentMap = {};
                    roundedPaymentMap.mode = "Rounding";
                    roundedPaymentMap.cardNumber = "";
                    roundedPaymentMap.txnNumber = "";
                    roundedPaymentMap.deviceId = "";
                    roundedPaymentMap.amount -= Number(orderRoundedVal);
                    paymentsList.push(roundedPaymentMap);
                }
                break;
            }
            case "CREDIT_CARD": {
                orderPaymentDetails.amount = amount;
                orderPaymentDetails.cardNumber = cardNumber;
                orderPaymentDetails.txnNumber = cardTxnNumber;
                orderPaymentDetails.deviceId = cardDeviceId;
                orderPaymentDetails.mode = "CC";
                paymentsList.push(orderPaymentDetails);
                break;
            }
            case "PAYTM_EDC": {
                orderPaymentDetails.amount = amount;
                orderPaymentDetails.cardNumber = cardNumber;
                orderPaymentDetails.txnNumber = cardTxnNumber;
                orderPaymentDetails.deviceId = selectedEdcDevice;
                orderPaymentDetails.gateWayId = "PAYTM_EDC_GATEWAY";
                orderPaymentDetails.mode = "EDC";
                paymentsList.push(orderPaymentDetails);
                break;
            }
        }
        return JSON.stringify(paymentsList);
    }

    const submitLabOrder = () => {
        setLabOrderSpinner(true);
        const config = { headers: { customerId: customerId }, data: { customerId: customerId, "paymentType": preparePaymentType(), "labOrderPaymentDetails": prepareLabOrderPaymentDetails() } };
        labOrderService.createLabOrder(config).then((response) => {
            if (isResponseSuccess(response) && validate.isNotEmpty(response.dataObject)) {
                setStackedToastContent({ toastMessage: response?.message ? response.message : "Lab order created successfully" });
                setLabCartInfo(response.dataObject.labCartInfo);
                if (validate.isEmpty(response.dataObject.paymentResponse)) {
                    props.history?.replace({ pathname: `${CRM_UI}/customer/${customerId}/labOrder/thankYou` });
                } else {
                    if (isFrontOfficeOrderCreate && response.dataObject.labCartInfo.paymentType == "COSC") {
                        prepareEdcResponse(response.dataObject.paymentResponse);
                    } else {
                        setPaymentGatewayStatus("");
                        setPaymentStatus("");
                    }
                }
            } else {
                setStackedToastContent({ toastMessage: response?.message ? response.message : "Unable to create lab order" });
            }
            setLabOrderSpinner(false);
        }).catch((e) => {
            setStackedToastContent({ toastMessage: response?.message ? response.message : "Something went wrong" });
            console.log(e);
            setLabOrderSpinner(false);
        })
    }

    const prepareEdcResponse = (paymentResponse) => {
        if (paymentResponse.status == "ACCEPTED_SUCCESS") {
            setPaymentStatus("Payment Pending");
            setPaymentGatewayStatus("PENDING");
        } else {
            setPaymentStatus("Payment Failed");
            setPaymentGatewayStatus("FAILURE");
        }
    }

    const checkLabOrderPaymentStatus = (cartId) => {
        const config = { headers: { customerId: customerId }, params: { customerId: customerId, cartId: cartId } };
        labOrderService.checkLabOrderPaymentStatus(config).then((response) => {
            if (isResponseSuccess(response) && validate.isNotEmpty(response.dataObject)) {
                setPaymentGatewayStatus(response.dataObject?.paymentStatus?.status)
                if (response.dataObject.paymentStatus?.status == "SUCCESS") {
                    setPaymentStatus("Payment Done");
                    setStackedToastContent({ toastMessage: "Payment Done" });
                    props.history?.replace({ pathname: `${CRM_UI}/customer/${customerId}/labOrder/thankYou` });
                } else if (response.dataObject.paymentStatus?.status == "FAILURE") {
                    setPaymentStatus("Payment Failed");
                    setStackedToastContent({ toastMessage: "Payment Failed" });
                } else {
                    setPaymentStatus("Payment Pending");
                    setStackedToastContent({ toastMessage: "Payment Pending" });
                }
                setPaymentGatewayStatus(response.dataObject.status);
            }
        }).catch((error) => {
            setStackedToastContent({ toastMessage: response?.message ? response.message : "Something went wrong" });
            console.log(error);
        })
    }

    const retryLabOrderPayment = (cartId) => {
        const config = { headers: { customerId: customerId }, params: { customerId: customerId, cartId: cartId } };
        labOrderService.retryLabOrderPayment(config).then((response) => {
            if (isResponseSuccess(response) && validate.isNotEmpty(response.dataObject)) {
                let paymentResponse = response.dataObject;
                if (validate.isNotEmpty(paymentResponse) && paymentResponse.status == "ACCEPTED_SUCCESS") {
                    setPaymentStatus("Payment Pending");
                    setPaymentGatewayStatus("PENDING")
                } else {
                    setStackedToastContent({ toastMessage: "Payment Failed" });
                }
            }
        }).catch((error) => {
            setStackedToastContent({ toastMessage: response?.message ? response.message : "Something went wrong" });
            console.log(error);
        })
    }

    const handleMdxUsageClick = (isChecked) => {
        setInitialLoader(true);
        getLabReviewCart(isChecked);
    }

    const calculateTotalDiscount = () => {
        let totalDiscount = 0;
        if (cartSummary.totalDiscount > 0) {
            totalDiscount += cartSummary.totalDiscount;
        }
        if (cartSummary.applicableMdxPointsWorth > 0) {
            totalDiscount += cartSummary.applicableMdxPointsWorth;
        }
        return totalDiscount;
    }

    return (
        <React.Fragment>
            <Wrapper>
                <HeaderComponent className={"border-bottom"} ref={headerRef}>
                    <div className="p-12">
                        <p className='mb-0'>Lab Shopping Cart Review</p>
                    </div>
                </HeaderComponent>
                {initialLoader ? <div className="d-flex justify-content-center align-items-center h-100 p-4">
                    <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText={"Please be patient while we prepare your data for loading!"} />
                </div> : validate.isNotEmpty(orderReview) && <>
                    <BodyComponent allRefs={{ headerRef, footerRef }} className={`body-height`} >
                        <div className={`custom-tabs-forms h-100 h-unset mobile-compatible-tabs custom-tabs-forms-icon border rounded`}>
                            <Nav tabs className="border-bottom">
                                {userSessionInfo.vertical != "V" && <div className='nav nav-tabs'>
                                    <NavItem>
                                        <NavLink className={` d-flex`} >Patient Details <span className={`tick-mark px-1 ms-2`}></span></NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={` d-flex`} >Test Details<span className={`tick-mark px-1 ms-2`}></span></NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={` d-flex`} >Delivery Details<span className={`tick-mark px-1 ms-2`}></span></NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={` d-flex`}>Time Slots<span className={`tick-mark px-1 ms-2`}></span></NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={` d-flex`}>Delivery Type<span className={`tick-mark px-1 ms-2`}></span></NavLink>
                                    </NavItem>
                                </div>}
                                <NavItem>
                                    <NavLink className={` active d-flex`}>Review & Promotions<span className={`tick-mark checked px-1 ms-2`}></span></NavLink>
                                </NavItem>
                            </Nav>
                            {Validate().isNotEmpty(orderReview) && <>
                                <div id="TabContent" className="scroll-on-hover" style={{ 'height': `calc(100% - 41px)` }} >
                                    <div className="scrolling-tabs" id="Review_Promotions">
                                        <div className="p-12 pb-0">
                                            <p className="custom-fieldset mb-2">Patient Details</p>
                                            <div className="row p-12 py-0">
                                                <div className="col-12 col-lg-4 px-0">
                                                    <PatientCard patientInfo={{ ...orderReview.patientDetails, age: orderReview.patientDetails.age }} isReviewPage />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 px-0">
                                            <div className='p-12 pb-0'>
                                                <p className="custom-fieldset mb-2">Delivery Details</p>
                                                <DeliveryDetails shipmentOmsAddress={orderReview?.homeAddress ? { ...orderReview.homeAddress, pinCode: orderReview.homeAddress.pincode, shippingMobileNo: orderReview.homeAddress.mobileNo } : orderReview?.labAddress ? { ...orderReview.labAddress, addressLine1: orderReview.labAddress.address, shippingMobileNo: orderReview.labAddress.phoneNumber } : null} />
                                            </div>
                                        </div>
                                        {testDataset && <LabTestGrid testDataset={testDataset} testSummaryRows={getTestSummaryRows()} isReviewPage />}
                                        <SampleCollectionDetails homeAddress={orderReview.homeAddress} labAddress={orderReview.labAddress} slotDetails={orderReview.walkInLabOrderItems ? orderReview.walkInLabOrderItems[0].labOrderItemSlot : orderReview.homeLabOrderItems[0].labOrderItemSlot} />
                                        <LabApplyCoupon appliedCoupon={orderReview.couponApplied} handleCouponAction={(responseData) => { testcartInfoInState(responseData) }} />
                                        {cartSummary && (validate.isNotEmpty(cartSummary.customerMdxPoints) && cartSummary.customerMdxPoints > 0) && (validate.isNotEmpty(cartSummary.applicableMdxPointsWorth) && parseFloat(cartSummary.applicableMdxPointsWorth) > 0) && <MdxPoints handleMdxUsageClick={handleMdxUsageClick} mdxFlag={mdxFlag} cartSummary={cartSummary} />}
                                        {cartSummary?.totalAmount > 0 && <div id='payment' className='scrolling-tabs p-12' style={{ minHeight: "100%" }}>
                                            <PaymentForm cartSummary={orderReview?.cartSummary} setPaymentType={setPaymentType}
                                                setAmount={setAmount}
                                                setCardNumber={setCardNumber}
                                                setCardDeviceId={setCardDeviceId}
                                                setCardTxnNumber={setCardTxnNumber}
                                                isFromLabs={"Y"} cartInfo={orderReview?.labCartInfo} isTPDcenter={isTPDcenter} />
                                        </div>}
                                        {(validate.isNotEmpty(selectedCollectionCenterId) && paymentType === "PAYTM_EDC") && <EdcDevicesForm key={selectedCollectionCenterId} collectionCenterId={selectedCollectionCenterId} setSelectedEdcDevice={setSelectedEdcDevice} />}
                                        {(validate.isNotEmpty(paymentType) && paymentType === "PAYTM_EDC" && validate.isNotEmpty(paymentGatewayStatus)) && <>
                                            <span class="margin-right:10px">Payment Status: <strong>{paymentStatus}</strong></span>
                                            {paymentGatewayStatus == 'PENDING' && <button className="btn brand-secondary me-3 px-3" onClick={() => checkLabOrderPaymentStatus(labCartInfo.cartId)}>Check Payment Status</button>}
                                            {paymentGatewayStatus == 'FAILURE' && <button className="btn brand-secondary me-3 px-3" onClick={() => retryLabOrderPayment(labCartInfo.cartId)}>Retry Payment</button>}
                                        </>}
                                    </div>
                                </div>
                            </>}
                        </div>
                    </BodyComponent>
                    <FooterComponent className="footer" ref={footerRef}>
                        <div class="p-3 d-flex justify-content-end font-14 align-items-center" bis_skin_checked="1">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex flex-column flex-lg-row justify-content-end align-itens-stretch align-items-lg-center">
                                {(cartSummary.totalDiscount > 0 || (cartSummary.applyMdxPointsPayment && cartSummary.applicableMdxPoints > 0)) && <> <div className="d-flex justify-content-between justify-content-lg-end flex-lg-row">
                                    <p class="text-secondary text-end mb-0 align-self-lg-center  font-normal">Total Discount: </p>
                                    <p class="font-weight-bold text-end mb-0 ms-3"><CurrencyFormatter data={calculateTotalDiscount()} decimalPlaces={2} /></p>
                                </div>
                                    <span class="mx-3 text-secondary hide-on-mobile">|</span> </>}
                                {cartSummary.totalAmount >= 0 && <div className="d-flex justify-content-between justify-content-lg-end flex-lg-row">
                                    <p class="text-secondary text-end mb-0 align-self-lg-center  font-normal">Grand Total: </p>
                                    <p class="font-weight-bold text-end ms-3 mb-0"><CurrencyFormatter data={cartSummary.totalAmount} decimalPlaces={2} /></p>
                                </div>}
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-end border-top p-12">
                            <div>
                                <button className="btn brand-secondary me-3 px-3" onClick={() => { props.history.push(getCustomerRedirectionURL(customerId, `${LAB_ORDER}/labcart`)) }}>Edit Shopping Cart</button>
                                <ButtonWithSpinner showSpinner={labOrderSpinner} className="px-2 btn-brand btn px-lg-4" disabled={disableSubmitButton()} onClick={() => submitLabOrder()} buttonText="Place the Order" />
                            </div>
                        </div>
                    </FooterComponent>
                </>}
            </Wrapper>
        </React.Fragment>
    );
}

export default LabReview;