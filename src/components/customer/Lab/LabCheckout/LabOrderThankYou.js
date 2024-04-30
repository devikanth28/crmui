import React, { useContext, useEffect, useRef, useState } from 'react'
import { BodyComponent, HeaderComponent, Wrapper } from '../../../Common/CommonStructure';
import { CustomerContext, LocalityContext, ShoppingCartContext } from '../../../Contexts/UserContext';
import LabOrderService from '../../../../services/LabOrder/LabOrderService';
import { isResponseSuccess } from '../../../../helpers/CommonHelper';
import Validate from '../../../../helpers/Validate';
import dateFormat from "dateformat";
import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import LabTestGrid from './LabTestGrid';
import { LAB_ORDER } from '../../Constants/CustomerConstants';
import { getCustomerRedirectionURL } from '../../CustomerHelper';
import CurrencyFormatter from '../../../Common/CurrencyFormatter';
import DisplayThankYouOrder from '../../../Checkout/ThankYou/DisplayThankYouOrder';

const LabOrderThankYou = (props) => {
    const headerRef = useRef();
    const { customerId } = useContext(CustomerContext);
    const { lablocality, setIsLocalityComponentNeeded } = useContext(LocalityContext);
    const { setLabShoppingCart } = useContext(ShoppingCartContext)
    const labOrderService = LabOrderService();
    const validate = Validate();
    const [patientInfo, setPatientInfo] = useState(undefined);
    const [labWalkInAddress, setLabWalkInAddress] = useState(undefined);
    const [homeCollectionAddress, setHomeCollectionAddress] = useState(undefined);
    const [timeSlot, setTimeSlot] = useState(undefined);
    const [initialLoader, setInitialLoader] = useState(true);
    const [cartSummary, setCartSummary] = useState(undefined);
    const [paymentType, setPaymentType] = useState(undefined);
    const [noOfTests, setNoOfTests] = useState(undefined);
    const [testDataset, setTestDataset] = useState([]);
    const [orderInfo, setOrderInfo] = useState([]);

    useEffect(() => {
        setIsLocalityComponentNeeded(false);
        getLabOrderThankYou();
    }, [lablocality]);

    const getLabOrderThankYou = () => {
        setInitialLoader(true);
        const config = { headers: { customerId: customerId }, params: { customerId: customerId } }
        labOrderService.getLabOrderThankYou(config).then((response) => {
            if (isResponseSuccess(response) && validate.isNotEmpty(response.responseData)) {
                setPatientInfo(response.responseData.patientDetails);
                prepareSampleCollectionAddress(response.responseData);
                prepareTimeSlot(response.responseData);
                setCartSummary(response.responseData.cartSummary);
                setPaymentType(response.responseData.paymentType);
                setTestDataset(response.responseData.homeLabOrderItems ? response.responseData.homeLabOrderItems : response.responseData.walkInLabOrderItems);
                setOrderInfo(response.responseData.homeLabOrders ? response.responseData.homeLabOrders[0] : response.responseData.walkInLabOrders[0])
                setLabShoppingCart({});
            } else {
                props.history.push(getCustomerRedirectionURL(customerId, LAB_ORDER))
            }
            setInitialLoader(false);
        }).catch((error) => {
            console.log(error);
            setInitialLoader(false);
        })
    }

    const prepareTimeSlot = (response) => {
        let labOrderList = validate.isNotEmpty(response.homeLabOrders) ? response.homeLabOrders : validate.isNotEmpty(response.walkInLabOrders) ? response.walkInLabOrders : undefined;
        let latestTimeSlot = labOrderList?.map((eachOrder, index) => {
            if (index == 0) {
                return eachOrder?.latestLabOrderSlotDetail;
            }
        });
        setNoOfTests(labOrderList.length)
        setTimeSlot(latestTimeSlot);
    }

    const prepareSampleCollectionAddress = (response) => {
        if (validate.isNotEmpty(response?.homeAddress)) {
            setHomeCollectionAddress(response?.homeAddress);
        }
        if (validate.isNotEmpty(response?.labAddress)) {
            setLabWalkInAddress(response?.labAddress);
        }
    }

    const getDisplayGender = (gender) => {
        switch (gender) {
            case "M":
                return "Male";
            case "F":
                return "Female";
            default:
                return "Others";
        }
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

    return (
        <Wrapper>
            <HeaderComponent className={"border-bottom"} ref={headerRef}>
                <p className="mb-2 m-2 my-2">Order Summary</p>
            </HeaderComponent>
            {initialLoader ? <div className="d-flex justify-content-center align-items-center h-100 p-4">
                <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText={"Please be patient while we prepare your data for loading!"} />
            </div> :
                <BodyComponent allRefs={{ headerRef }} className="p-12">
                    <div className='d-flex justify-content-center'>
                        <div className="col-12 col-lg-9">
                            <div className="card">
                                <div className="row card-body p-12">
                                    <h1 className="text-center text-success"><u>Thank You..!</u></h1>
                                    <div className='p-12'>
                                        <DisplayThankYouOrder orderInfo={orderInfo} isLabs/>
                                    </div>
                                    <div>
                                        {patientInfo && <div class="col-12 px-0 pb-3">
                                            <div class="card p-12">
                                                <div class="body">
                                                    <div class="row mx-0 px-0">
                                                        <div class="col-6 px-0">
                                                            <small class="mb-2 d-block text-secondary font-12">Patient Info</small>
                                                            <p class="h6 font-weight-normal font-14 mb-1">Name: &nbsp; {patientInfo.patientName}</p>
                                                            <p class="font-weight-normal d-block font-14 mb-0">Age / Gender: &nbsp;{patientInfo?.age ? `${patientInfo.age} Yrs / ` : ``}{patientInfo?.patientName ? `${getDisplayGender(patientInfo?.gender)}` : ``}</p>
                                                        </div>
                                                        <div class="col-6 px-0">
                                                            <small class="d-block text-secondary mb-1 font-12 ">Doctor Info</small>
                                                            <p class="font-weight-normal font-14">Doctor Name: &nbsp; Dr {validate.isNotEmpty(patientInfo.doctorName) ? patientInfo?.doctorName : 'Self'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        <div class="col mr-3">
                                            <div class="d-flex flex-wrap w-100 gap-3">
                                                <div class="patient-addresses col-lg-6 col-12">
                                                    <div class="card p-12">
                                                        <h6 class="legend-title font-12">Scheduled Slot &amp; Collection Details</h6>
                                                        <div class="d-flex">
                                                            <div class="each-address w-100">
                                                                {timeSlot && <div class="col px-0 mb-3">
                                                                    <small class="d-block text-secondary font-14">Scheduled Slot</small>
                                                                    <p class="font-weight-normal font-12">
                                                                        {` ${dateFormat(timeSlot[0]?.displayDate, "mmm dd,yyyy")}(${timeSlot[0]?.labTimeSlot?.name}) `}
                                                                    </p>
                                                                </div>}
                                                                {labWalkInAddress && <div class="">
                                                                    <small class="d-block text-secondary mt-2 font-14">Collection Center Details</small>
                                                                    <p class="font-weight-bold mb-1 font-12">{labWalkInAddress.name}</p>
                                                                    <address class="no-select p-0 rounded-0">
                                                                        <small class="d-flex w-75">{labWalkInAddress.address}</small>
                                                                        <p class="d-block mt-3">
                                                                            <a class="text-primary btn btn-sm btn-link ml-n2" aria-label="click to Call" role="link" href="tel:+916300532081" title="Click to Call">
                                                                                <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                                                                    <g transform="translate(-180.438 -213.832)"><rect width="24" height="24" transform="translate(180.438 213.832)" fill="none">
                                                                                    </rect>
                                                                                        <g transform="translate(182.199 215.78)"><g transform="translate(0 1.429)"><path d="M185.394,217.171a2.043,2.043,0,0,0-.705.124,3.87,3.87,0,0,0-.728.361l-.369.26a3.029,3.029,0,0,0-.264.236,3.822,3.822,0,0,0-.979,1.742c-.771,2.889,1.118,7.237,4.7,10.82,3,3,6.621,4.87,9.442,4.87a5.349,5.349,0,0,0,1.377-.171,3.8,3.8,0,0,0,1.738-.975,2.837,2.837,0,0,0,.265-.3l.262-.374a3.9,3.9,0,0,0,.334-.689,2.167,2.167,0,0,0-.821-2.518l-2.625-1.833a2.261,2.261,0,0,0-3.063.546l-.509.731-.126-.089a24.713,24.713,0,0,1-5.47-5.468l-.089-.127.732-.51a2.2,2.2,0,0,0,.545-3.063l-1.832-2.624A2.229,2.229,0,0,0,185.394,217.171Zm11.1,17.253c-2.524,0-5.828-1.735-8.623-4.53-3.246-3.247-5.057-7.237-4.4-9.7a2.668,2.668,0,0,1,.678-1.22,1.807,1.807,0,0,1,.135-.126l.318-.225a2.535,2.535,0,0,1,.493-.24,1.03,1.03,0,0,1,1.162.4l1.831,2.622a1.042,1.042,0,0,1-.257,1.449l-1.193.833a.576.576,0,0,0-.16.783,24.809,24.809,0,0,0,6.813,6.815.585.585,0,0,0,.785-.16l.833-1.195a1.071,1.071,0,0,1,1.447-.257l2.624,1.833a1.006,1.006,0,0,1,.4,1.163l-.007.017a2.439,2.439,0,0,1-.206.435l-.223.321a1.537,1.537,0,0,1-.156.173,2.649,2.649,0,0,1-1.219.677A4.167,4.167,0,0,1,196.492,234.424Z" transform="translate(-182.178 -217.171)" fill="#343a40"></path></g>
                                                                                            <g transform="translate(9.963)"><path d="M192.615,215.757a.58.58,0,0,0-.034,1.158,9.141,9.141,0,0,1,8.548,8.546.589.589,0,0,0,.621.543.579.579,0,0,0,.537-.615,10.284,10.284,0,0,0-3-6.636h0a10.28,10.28,0,0,0-6.634-3Z" transform="translate(-192.036 -215.757)" fill="#343a40"></path></g><g transform="translate(8.736 3.129)"><path d="M191.427,218.853a.611.611,0,0,0-.6.544.58.58,0,0,0,.145.419.572.572,0,0,0,.4.2h0a6.708,6.708,0,0,1,6.274,6.275.589.589,0,0,0,.621.541h0a.578.578,0,0,0,.536-.613,7.869,7.869,0,0,0-7.362-7.36Z" transform="translate(-190.822 -218.853)" fill="#343a40"></path></g></g></g></svg>{labWalkInAddress.phoneNumber}</a><a rel="noopener" class="text-primary ml-3 btn btn-sm btn-link" href="http://maps.google.com/?saddr=17.472083,78.428701&amp;daddr=17.44693270,78.36425780" target="_blank" aria-label="Get Directions" role="link" title="Get Directions"><svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><g transform="translate(-336.335 -141.914)"><rect fill="none" width="18" height="18" transform="translate(336.335 141.914)"></rect><g transform="translate(336.335 141.914)"><path fill="#404040" d="M348.655,145.064a9,9,0,1,0,9,9A9.011,9.011,0,0,0,348.655,145.064Zm0,17.01a8.01,8.01,0,1,1,8.01-8.01A8.019,8.019,0,0,1,348.655,162.074Z" transform="translate(-339.655 -145.064)"></path><g transform="translate(3.732 4.602)"><path fill="#404040" d="M351.815,150.1a.985.985,0,0,0-.451.11l-7.087,3.642a.99.99,0,0,0,.242,1.847l2.985.649a.137.137,0,0,1,.1.077l1.272,2.777a.99.99,0,0,0,1.856-.158l2.045-7.7a.991.991,0,0,0-.337-1.023h0A.985.985,0,0,0,351.815,150.1Zm-2.108,8.3a.135.135,0,0,1-.124-.08l-1.3-2.841-3.053-.664a.137.137,0,0,1-.034-.256l6.256-3.216a.136.136,0,0,1,.148.015.138.138,0,0,1,.047.143l-1.8,6.8a.137.137,0,0,1-.121.1Z" transform="translate(-343.741 -150.104)"></path></g></g></g></svg>Get Directions</a></p></address>
                                                                </div>}
                                                                {homeCollectionAddress && <div class="">
                                                                    <small class="d-block text-secondary mt-2 font-14">Home Sample Collection Details</small>
                                                                    <p class="font-weight-bold mb-1 font-12">{homeCollectionAddress.firstName}</p>
                                                                    <address class="no-select p-0 rounded-0">
                                                                        <small class="d-flex w-75">{(homeCollectionAddress.addressLine1 ? homeCollectionAddress.addressLine1 + ", " : "") + (homeCollectionAddress.addressLine2 ? homeCollectionAddress.addressLine2 + ", " : "") + (homeCollectionAddress.city ? homeCollectionAddress.city + ", " : "") + (homeCollectionAddress.state ? homeCollectionAddress.state + ", " : "") + (homeCollectionAddress.pinCode ? homeCollectionAddress.pinCode + ", " : "") + (homeCollectionAddress.mobileNo ? homeCollectionAddress.mobileNo : "")}</small>
                                                                    </address>
                                                                </div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {cartSummary && <div class="col px-0">
                                                    <div class="p-12 card order-summary discounted-model">
                                                        <h5 class="legend-title font-12">Order Summary</h5>
                                                        <div>
                                                            <div className='align-items-center d-flex justify-content-between'>
                                                                <p className='font-14 mb-0'>Cart MRP Total</p>
                                                                <p className='mb-1 font-14'>
                                                                    <strong class="rupee">₹</strong>{cartSummary.totalPrice}</p>
                                                            </div>

                                                            <div className='font-14 mb-2 d-flex justify-content-between align-items-center'>
                                                                <p className='font-14 mb-0'>Payment Type</p>
                                                                <p className='font-14 mb-1'>{paymentType}</p>
                                                            </div>
                                                            <hr class="solid" />
                                                            <div className='d-flex justify-content-between align-items-center mb-1'>
                                                                <p className='font-14 mb-0'>No.of Tests</p>
                                                                <span className='font-14 mb-0'>{noOfTests}</span></div>
                                                            <div className='d-flex justify-content-between align-items-center'>
                                                                <p className='mb-1 font-14'>Amount to be Paid</p>
                                                                <p className='mb-0 font-14'>
                                                                    <strong class="rupee">₹</strong>{cartSummary.totalAmount}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                    {testDataset && <LabTestGrid testDataset={testDataset} testSummaryRows={getTestSummaryRows()} isReviewPage />}
                                </div>
                            </div>
                        </div>
                    </div>
                </BodyComponent>}
        </Wrapper>
    )
}

export default LabOrderThankYou