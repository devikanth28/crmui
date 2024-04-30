import React, { useContext, useState } from 'react'
import dateFormat from 'dateformat';
import OrderHelper from '../../../helpers/OrderHelper';
import { Button } from 'react-bootstrap';
import { UncontrolledTooltip } from 'reactstrap';
import { SubscriptionStatus, dateFormatWIthTime, dateFormatWIthoutTime } from '../Constants/CustomerConstants';
import CustomerService from '../../../services/Customer/CustomerService';
import { CustomerContext } from '../../Contexts/UserContext';
import Validate from '../../../helpers/Validate';
import { fullDateTime } from '../../../helpers/CommonHelper';
const SubscriptionInfo = (props) => {
    const subscriptionDetails = props.subscriptionDetails;
    const statusCellClass = OrderHelper().getBadgeColorClassForStatus(subscriptionDetails?.status) + " badge rounded-pill";
    const { customerId} = useContext(CustomerContext);
    const {couponDetails, customerPoints} = props;
    const [disableMode,setDisableMode] = useState(false);

    const downloadMembershipCreditNote = async (subscriptionId) => {
        setDisableMode(true);
        await CustomerService().downloadMembershipCreditNote({ "customerId": customerId, "subscriptionId": subscriptionId }).then(data => {
            if (data.responseMessage = "SUCCESS") {
                const file = new Blob([data], {
                    type: "application/pdf",
                });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, '_blank');
            }
            setDisableMode(false);
        })
    }

    const couponOrPointsAvailable = () => {
        return couponAvailable() || customerPointsAvailable();
    }

    const couponAvailable = () => {
        return (Validate().isNotEmpty(couponDetails) && Validate().isNotEmpty(couponDetails.coupon));
    }

    const customerPointsAvailable = () => {
        return Validate().isNotEmpty(customerPoints) && Validate().isNotEmpty(customerPoints.credited) && customerPoints.credited > 0
    }

    return (
        <React.Fragment>

            <div className='p-12 pb-0'>
                <div class="d-flex flex-wrap planInfo row gy-2">
                    <div class="col-6 col-lg-2">
                            <label className="font-12 text-secondary" >Code</label>
                            <p className="font-14 mb-0">{subscriptionDetails?.subscriptionCode}</p>
                    </div>
                    {subscriptionDetails?.startDate && <div class="col-6 col-lg-2">
                        <label className="font-12 text-secondary">Start Date</label>
                        <p className='font-14 mb-0'>{dateFormat(subscriptionDetails?.startDate, dateFormatWIthoutTime)} </p>
                    </div>}
                    {subscriptionDetails?.endDate && <div class="col-6 col-lg-2">
                        <label className="font-12 text-secondary">End Date</label>
                        <p className='font-14 mb-0'>{dateFormat(subscriptionDetails?.endDate, dateFormatWIthoutTime)} </p>
                    </div>}
                    {subscriptionDetails?.dateCreated && <div class="col-6 col-lg-2">
                        <label className="font-12 text-secondary">Subscription Created On</label>
                        <p className='font-14 mb-0'>{new Intl.DateTimeFormat('en-US', fullDateTime).format(new Date(subscriptionDetails?.dateCreated))}</p>
                    </div>}
                    <div class="col-6 col-lg-1">
                        <p className='pt-1 mb-0 font-12 text-secondary'>Status</p>
                        <p className={statusCellClass}>
                            {OrderHelper().getStatusWithFirstLetterCapitalized(subscriptionDetails?.status)}
                        </p>
                    </div>
                    {(subscriptionDetails?.status == 'REFUNDED') ?
                    <div className='col-2'>
                        <label className='text-secondary font-12' >Membership Credit Note</label>
                        <Button id="downloadCreditNote" variant=' ' className='icon-hover btn-link pt-0' disabled={disableMode}  onClick={()=>{downloadMembershipCreditNote(props.currentSubs.id)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                                <g id="download-black-icn-16" transform="translate(-180.258 -387.452)">
                                    <rect id="Rectangle_3299" data-name="Rectangle 3299" width="16" height="16" rx="3" transform="translate(180.258 387.452)" fill="none"/>
                                    <g id="download-icn" transform="translate(180.135 386.725)">
                                    <path id="Union_212" data-name="Union 212" d="M18167.857-4873.223a.479.479,0,0,1,.475-.483l1.684-.018a.479.479,0,0,1,.061,0,.513.513,0,0,1,.162-.045h.047a2.264,2.264,0,0,0,1.221-.406,1.374,1.374,0,0,0,.594-1.149,1.837,1.837,0,0,0-.42-1.145l-.027-.037a1.764,1.764,0,0,0-1.49-.743h-.17a.131.131,0,0,1-.041,0,.449.449,0,0,1-.365-.173l0-.009a.433.433,0,0,1-.092-.424,2.636,2.636,0,0,0,.1-.716,2.733,2.733,0,0,0-2.7-2.759,2.73,2.73,0,0,0-2.7,2.759v.169a.5.5,0,0,1-.2.415.527.527,0,0,1-.295.091.52.52,0,0,1-.17-.032,2.779,2.779,0,0,0-1.053-.2,2.374,2.374,0,0,0-2.508,2.2,2.6,2.6,0,0,0,.281,1.218,1.749,1.749,0,0,0,1.482.908h.01s.01,0,.014,0a.326.326,0,0,0,.064.009.494.494,0,0,1,.082.018.41.41,0,0,1,.076,0h1.984a.492.492,0,0,1,.488.492.485.485,0,0,1-.488.484h-1.984a.557.557,0,0,1-.178-.032c-.018,0-.041,0-.059,0a1,1,0,0,1-.164-.009l-.014,0a2.821,2.821,0,0,1-2.564-3.061,3.335,3.335,0,0,1,3.477-3.165,2.93,2.93,0,0,1,.629.059l.133.023.018-.128a3.759,3.759,0,0,1,1.24-2.257,3.614,3.614,0,0,1,2.391-.913,3.7,3.7,0,0,1,3.676,3.722,1.4,1.4,0,0,1-.014.242l-.018.124.117.022a2.761,2.761,0,0,1,1.793,1.1l.006,0a2.749,2.749,0,0,1,.629,1.733,2.616,2.616,0,0,1-2.715,2.518l-.027,0-.021.009a.069.069,0,0,1-.033,0,.493.493,0,0,1-.086-.008.451.451,0,0,1-.164.031l-1.684.018A.493.493,0,0,1,18167.857-4873.223Z" transform="translate(-18157.877 4884.498)"/>
                                    <path id="Subtraction_89" data-name="Subtraction 89" d="M1294.667-8062.738a.446.446,0,0,1-.314-.117l-1.93-1.608a.482.482,0,0,1-.172-.324.5.5,0,0,1,.115-.363.486.486,0,0,1,.369-.174.5.5,0,0,1,.318.117l1.126.948v-4.9a.489.489,0,0,1,.488-.488.489.489,0,0,1,.488.488v5.917a.489.489,0,0,1-.28.444A.481.481,0,0,1,1294.667-8062.738Z" transform="translate(-1286.507 8077.946)"/>
                                    <path id="Subtraction_88" data-name="Subtraction 88" d="M1292.733-8067.1a.472.472,0,0,1-.373-.174.473.473,0,0,1-.107-.354.493.493,0,0,1,.178-.333l1.93-1.578a.47.47,0,0,1,.3-.111.5.5,0,0,1,.383.182.473.473,0,0,1,.109.349.494.494,0,0,1-.18.336l-1.946,1.566A.482.482,0,0,1,1292.733-8067.1Z" transform="translate(-1284.572 8082.307)"/>
                                    </g>
                                </g>
                            </svg>
                        </Button>
                        <UncontrolledTooltip placement="bottom" target="downloadCreditNote" >
                            Download The Membership Credit Note
                        </UncontrolledTooltip>
                    </div> : <></> }
                </div>
            </div>
            {subscriptionDetails && (subscriptionDetails.status == SubscriptionStatus.active || subscriptionDetails.status == SubscriptionStatus.refunded)  && (couponOrPointsAvailable()
                ?   <React.Fragment>
                        {couponAvailable() && <CouponDetails coupon={couponDetails.coupon} />}
                        {customerPointsAvailable() && <CustomerPointsDetails customerPoints={customerPoints} />}
                    </React.Fragment>
                :   <div class="p-12 pt-0">
                        <div class="bg-warning-subtle card p-12 font-14">
                            No coupon/points issued for the subscribed plan.
                        </div>
                    </div>)
            }
        </React.Fragment>
    )
}

const CouponDetails = ({coupon}) => {

    return  <div class="p-12 pt-0">
                <label class="d-block pb-0 custom-fieldset mb-2">Coupon Details</label>
                <div className='d-flex flex-wrap planInfo'>
                    <div class="col-6 col-lg-2 planItem">
                        <label className="font-12 text-secondary">Coupon Code</label>
                        <p className="font-14 mb-0">{coupon.couponCode}</p>
                    </div>
                    <div class="col-6 col-lg-2 planItem">
                        <label className="font-12 text-secondary">Maximum usage limit</label>
                        <p className="font-14 mb-0">{coupon.customerLimit}</p>
                    </div>
                    <div class="col-6 col-lg-2 planItem">
                        <label className="font-12 text-secondary">Coupon issue date time</label>
                        <p className="font-14 mb-0">{coupon.fromDate}</p>
                    </div>
                    <div class="col-6 col-lg-2 planItem">
                        <label className="font-12 text-secondary">Coupon expiry date time</label>
                        <p className="font-14 mb-0">{coupon.toDate}</p>
                    </div>
                </div>
            </div>
}

const CustomerPointsDetails = ({customerPoints}) => {

    return  <div class="p-12 pt-0">
                <label class="d-block pb-0 custom-fieldset">Customer Points</label>
                <div className='d-flex flex-wrap planInfo'>
                    <div class="col-6 col-lg-2 planItem">
                        <label className="font-12 text-secondary">Issued MDx Points</label>
                        <p className="font-14 mb-0">{customerPoints.credited}</p>
                    </div>
                </div>
            </div>

}

export default SubscriptionInfo