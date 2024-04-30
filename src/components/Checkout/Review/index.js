import React, { useContext, useEffect, useRef, useState } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import Validate from "../../../helpers/Validate";
import CheckoutService from "../../../services/Checkout/CheckoutService";
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../../Common/CommonStructure";
import CurrencyFormatter from "../../Common/CurrencyFormatter";
import { AlertContext, CustomerContext, LocalityContext, UserContext } from "../../Contexts/UserContext";
import PatientCard from "../ShoppingCart/PatientInfo/PatientCard";
import DeliveryDetails from "./DeliveryDetails";
import ProductsGrid from "./ProductsGrid";
import { ALERT_TYPE, CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import { CRM_UI } from "../../../services/ServiceConstants";
import NoDataFound from "../../Common/NoDataFound";
import { TrackScrolling } from "../../order/PrepareOrderDetails";

export default (props) => {

	const [orderReview, setOrderReview] = useState(undefined);
	const [isCouponError, setCouponError] = useState();
	const [coupon, setCoupon] = useState("");
	const [loading, setLoading] = useState(true);
    const [activeTab , setActiveTab] = useState('Review_Promotions')
	const headerRef = useRef(0);
	const footerRef = useRef(0);
	const [paymentMode,setPaymentMode] = useState(undefined);
	const [addMoreBtn, setAddMoreBtn] = useState(false);

	const validate = Validate();
	const checkoutService = CheckoutService();
	const { customerId } = useContext(CustomerContext);
	const { setAlertContent, setStackedToastContent } = useContext(AlertContext);
	const { setIsLocalityComponentNeeded } = useContext(LocalityContext);
	const [iscreateOrderLoading,setIscreateOrderLoading] = useState(undefined);
    const userSessionInfo = useContext(UserContext);
	const prescriptionObj = props?.location?.state?.prescriptionObj;
	const [isCouponApplied, setIsCouponApplied] = useState(false);
	const [isCouponLoading,setIsCouponLoading] = useState(false);
	
	useEffect(() => {
		setIsLocalityComponentNeeded(false);
		checkoutService
			.getOrderReview({ headers: { customerId } })
			.then((res) => {
				if (res && "SUCCESS" === res.statusCode && res.dataObject) {
					setOrderReview(res.dataObject);
					const eachOrder = res.dataObject?.orderList[0];
					setPaymentMode(validate.isNotEmpty(eachOrder)?eachOrder['paymentType']:undefined);
				} else if (validate.isNotEmpty(res?.message)) {
					setStackedToastContent({ toastMessage: res.message });
					setCouponError(true);
				} else {
					setAlertContent({alertMessage:"Something went wrong. Please try again!" ,alertType: ALERT_TYPE.WARNING});
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	}, []);

	const applyCoupon = () => {
		if(validate.isEmpty(coupon)) {
			setStackedToastContent({ toastMessage: "Please enter valid coupon" });
			return;
		}
		setIsCouponLoading(true);
		checkoutService
			.applyCoupon({ headers: { customerId }, params: { coupon } })
			.then((res) => {
				if (res && "SUCCESS" === res.statusCode && res.dataObject) {
					setOrderReview({...orderReview, ...res.dataObject});
					setStackedToastContent({ toastMessage: coupon+" Coupon Applied Successfully" });
					setIsCouponApplied(true);
				} else if (res && validate.isNotEmpty(res.message)) {
					setStackedToastContent({ toastMessage: res.message });
					setCouponError(true);
					setIsCouponApplied(false);
				} else {
					setAlertContent({alertMessage:"Something went wrong. Please try again!" ,alertType: ALERT_TYPE.WARNING});
					setIsCouponApplied(false);
				}
				setLoading(false);
				setIsCouponLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setIsCouponLoading(false);
				setAlertContent({alertMessage:"Something went wrong. Please try again!" ,alertType: ALERT_TYPE.WARNING});
			});
	};

	const removeCoupon = () => {
			setIsCouponLoading(true);
			checkoutService.removeCoupon({headers: {customerId}, params: {coupon}}).then((res) => {
				if (res && "SUCCESS" === res.statusCode && res.dataObject) {
					setOrderReview({...orderReview, ...res.dataObject});
					setCoupon("");
					setIsCouponApplied(false);
				} else {
					setAlertContent({alertMessage:"Something went wrong. Please try again!" ,alertType: ALERT_TYPE.WARNING});
				}
				setIsCouponLoading(false);
			}).catch((error) => {
				console.log(error);
				setIsCouponLoading(false);
			})
	}

	const getDataSet = (orderItems, deliveryTime) => {
		let orderItemsDataSet = [];
		orderItems.map(eachOrderItem => {
			const orderItem = {
				isPrescriptionRequired: eachOrderItem.prescriptionRequired,
				isComplimentary: eachOrderItem.complimentaryType,
				name: eachOrderItem.productName,
				offersApplied: parseFloat(eachOrderItem.discountPercentage).toFixed(2),
				packsize: eachOrderItem.packSize,
				deliveryTIme: deliveryTime,
				reqQty: eachOrderItem.quantity / eachOrderItem.packSize,
				productDiscount : <CurrencyFormatter data={(eachOrderItem.discountPercentage*eachOrderItem.mrp*eachOrderItem.quantity)/100} decimalPlaces={2}/>,
				qtyUnits: eachOrderItem.quantity,
				mrp: <div className="text-end"><CurrencyFormatter data={eachOrderItem.mrp} decimalPlaces={2}/></div>,
				amount: <div className="text-end"><CurrencyFormatter data={eachOrderItem.price*(eachOrderItem.quantity / eachOrderItem.packSize)} decimalPlaces={2}/></div>
			}
			orderItemsDataSet.push(orderItem);
		});
		return orderItemsDataSet;
	}

	const navigateTo = (route) => {
		props.history.replace(`${CRM_UI}/customer/${customerId}/${route}`);
		return;
	}

	const handleChange = (e) => {
		e.preventDefault();
		setCouponError(false);
		if(validate.isAlphaNumericWithoutSpace(e.target.value) || validate.isEmpty(e.target.value)) {
			setCoupon(e.target.value);
		} else {
			setAlertContent({alertMessage:"Please enter a valid coupon code!" ,alertType: ALERT_TYPE.WARNING});
		}
	}

	const hadleOrderCreation=async()=>{
		if(isCouponError) {
			setAlertContent({alertMessage:"Please enter a valid coupon code!" ,alertType: ALERT_TYPE.WARNING});
			return;
		}
		if(iscreateOrderLoading){
			return;
		}
		setIscreateOrderLoading(true);
		const orderCreationResponse = await createOmsOrder();
		if (validate.isNotEmpty(orderCreationResponse) && validate.isNotEmpty(orderCreationResponse.dataObject) && "SUCCESS" == orderCreationResponse?.statusCode) {
			navigateTo(`checkout/thankyou/${orderCreationResponse.dataObject?.cartId}`);
		}else{
			setStackedToastContent({toastMessage:orderCreationResponse?.message?orderCreationResponse.message:'Failed To Create Order'});
		}
		setIscreateOrderLoading(false);
	}

	const createOmsOrder=()=>{
		return checkoutService.createOmsOrder({headers:{customerId},params:{MODE:"C" == paymentMode ? "COD" : paymentMode}});
	}

	const getDisplayTotalAmount=()=>{
		let displayString = "("
		if(orderReview.orderList.length==1){
			displayString = " "
			return displayString;
		}
		orderReview?.orderList?.map((order,index)=>{
			displayString = displayString + "Order "+(index+1);
			if(index+1==orderReview.orderList.length){
				displayString = displayString + ")";
			}else{
				displayString = displayString + " + ";
			}
		})
		return displayString;
	}

	if(!loading && !orderReview) {
		setAlertContent({alertMessage:"Please try again" ,alertType: ALERT_TYPE.WARNING});
		navigateTo('checkout/shoppingCart');
		return ;
	}

	if(!loading && !(Array.isArray(orderReview.orderList) && orderReview.orderList.length > 0)) {
		return <NoDataFound text={"Order list is empty"} />
	}

	return (
		<Wrapper>
					<HeaderComponent className={"border-bottom"} ref={headerRef}>
						<div className="d-flex align-items-center justify-content-between p-12">
							<p className="mb-0">Review &amp; Promotions</p>
						</div>
					</HeaderComponent>
					<BodyComponent allRefs={{ headerRef, footerRef }} className="body-height" loading={loading}>
						{validate.isNotEmpty(orderReview) && 
						<div className={`custom-tabs-forms tabs-nowrap custom-tabs-forms-icon border rounded h-100 h-unset`}>
							<Nav tabs className="border-bottom">
								{userSessionInfo.vertical != "V" && <NavItem>
									<NavLink className={`rounded-top d-flex`}>
										Shopping Cart
										<span className={`tick-mark px-1 ms-2`} />
									</NavLink>
								</NavItem>}
								{userSessionInfo.vertical != "V" && (prescriptionObj?.isRequiredPrescription || prescriptionObj?.prescImgList) && <NavItem>
									<NavLink className={`d-flex`}>
										Select Prescription
										<span className={`tick-mark px-1 ms-2`} />
									</NavLink>
								</NavItem>}
								{userSessionInfo.vertical != "V" && <NavItem>
									<NavLink className={`d-flex`}>
										Delivery Details
										<span className={`tick-mark px-1 ms-2`} />
									</NavLink>
								</NavItem>}
								{userSessionInfo.vertical != "V" && <NavItem>
									<NavLink className={`d-flex`}>
										Payments
										<span className={`tick-mark px-1 ms-2`} />
									</NavLink>
								</NavItem>}
								<NavItem>
									<NavLink className={`${activeTab == 'Review_Promotions' ? "active" : ""} d-flex ${userSessionInfo.vertical == "V" ? 'rounded-top' : ''}`}>
										Review & Promotions
										<span className={`tick-mark px-1 ms-2 ${activeTab == 'Review_Promotions' ? 'checked' : ''}`} />
									</NavLink>
								</NavItem>
							</Nav>
							<div id="TabContent" className="scroll-on-hover" style={{ 'height': `calc(100% - 41px)` }} onScroll={(element) => TrackScrolling(element, (activeTab) => setActiveTab(activeTab))}>
								<div className="scrolling-tabs" id="Review_Promotions">
									<div className="p-12 pb-0">
										<p className="custom-fieldset mb-2">Patient Details</p>
										<div className="row p-12 py-0">
											<div className="col-12 col-lg-4 px-0">
												<PatientCard patientInfo = {{...orderReview.patientDetails, age: orderReview.patientDetails.patientAge}} isReviewPage />
											</div>
										</div>
									</div>
									<div className="p-12 py-0 mt-4">
										<p className="custom-fieldset mb-2">Delivery Details</p>								
										<DeliveryDetails pickStoreDetails={orderReview.pickStoreDetails} shipmentOmsAddress={orderReview.orderList[0].shipmentOmsAddress}/>								
									</div>
									{orderReview.orderList.map((eachOrder, index) => {
										return <ProductsGrid omsOrder = {eachOrder} isCouponApplied = {isCouponApplied} orderSno={index + 1} orderAmount={eachOrder.orderAmount} discountTotal={eachOrder.discountTotal} orderTotal={eachOrder.orderTotal} deliveryTime={eachOrder.deliveryTime} dataSet={getDataSet(eachOrder.omsOrderItem, eachOrder.deliveryTime)} noOfOrders={orderReview?.orderList?.length} totalPBPoints ={eachOrder.totalPBPoints} />
									})}
									<div className="row g-0 p-12 text-end">
										<p className="col font-weight-bold">Total Amount to be paid<span className="text-warning ms-1">{getDisplayTotalAmount()}</span></p>
										<p className="col-4 col-sm-6 col-md-6 col-lg-4 col-xl-2 col-xxl-2 font-weight-bold p-12 py-0"><CurrencyFormatter data={orderReview.cartSummary.totalAmount} decimalPlaces={2}/></p>
									</div>
									<div className="p-12 pt-0">
										<p className="custom-fieldset mb-2">Enter Coupon</p>
										<div className="row">
											<div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3 col-xxl-3">
												<div class="form-floating">
													<input type="text" value={coupon} class="form-control" id="CouponCode" placeholder="" required="true" onChange={handleChange} disabled = {isCouponApplied}/>
													<label for="CouponCode">Enter Coupon</label>
												</div>
											</div>
											{!isCouponApplied && <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-2 col-xxl-2 mt-3 mt-lg-0 ps-xl-0">
												<button className="btn btn-sm brand-secondary px-3 w-100" style={{height: "50px"}} onClick={applyCoupon}>{isCouponLoading ? <CustomSpinners spinnerText={"Apply Coupon"} className={" spinner-position"} innerClass={"invisible"} />: "Apply Coupon"}</button>
											</div>
											}
											{isCouponApplied && <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-2 col-xxl-2 mt-3 mt-lg-0 ps-xl-0">
												<button className="btn btn-sm brand-secondary px-3 w-100" style={{height: "50px"}} onClick={removeCoupon}>{isCouponLoading ? <CustomSpinners spinnerText={"Remove Coupon"} className={" spinner-position"} innerClass={"invisible"} />: "Remove Coupon"}</button>
											</div>
											}
										</div>
									</div>
								</div>
							</div>
						</div>}
					</BodyComponent>
					<FooterComponent className="footer p-3" ref={footerRef}>
						<div className="d-flex align-items-center justify-content-between">
							<div className="d-none d-lg-block">
								<button className="btn btn-sm brand-secondary px-3" onClick={() => navigateTo('catalog')}>Add More Products</button>
							</div>
							<div onClick={()=>setAddMoreBtn(!addMoreBtn)} className='d-lg-none d-flex align-items-center pointer btn-link'>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="#000000" class="bi bi-three-dots-vertical">
									<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
								</svg>
								{addMoreBtn && <div class="customdropdown-position position-absolute text-secondary" style={{bottom : `${footerRef?.current.offsetHeight}px`}}>
										<button className="btn btn-sm brand-secondary px-3" onClick={() => navigateTo('catalog')}>Add More Products</button>
                            	</div>}
                    			</div>
							<div className="d-flex">
								<button className="btn btn-sm brand-secondary me-3 px-3" onClick={() => navigateTo('checkout/shoppingCart')}>Edit Shopping Cart</button>
                        		<button className="btn btn-sm btn-brand px-3" disabled={iscreateOrderLoading} onClick={() => hadleOrderCreation()}>{iscreateOrderLoading ? <CustomSpinners spinnerText={"Place the Order"} className={" spinner-position"} innerClass={"invisible"} />: "Place the Order"}</button>
							</div>
						</div>
					</FooterComponent>
		</Wrapper>
	);
};
