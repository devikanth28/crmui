import React, { useContext, useState } from 'react';
import LabOrderService from '../../../../services/LabOrder/LabOrderService';
import { AlertContext, CustomerContext } from '../../../Contexts/UserContext';
import { isResponseSuccess } from '../../../../helpers/CommonHelper';
import ButtonWithSpinner from '../../../Common/ButtonWithSpinner';
import Validate from '../../../../helpers/Validate';

function LabApplyCoupon(props) {
    const [couponCode, setCouponCode] = useState(props.appliedCoupon ? props.appliedCoupon : null);
    const { customerId } = useContext(CustomerContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const [loading, setLoading] = useState(false);

    const applyCoupon = async () => {
        if (!couponCode) {
            return
        }
        setLoading(true);
        const config = { headers: { customerId: customerId }, params: { couponCode: couponCode, customerId: customerId } }
        await LabOrderService().applyCoupon(config).then((response) => {
            setLoading(false);
            if (isResponseSuccess(response) && response.responseData) {
                props.handleCouponAction(response.responseData);
                setStackedToastContent({ toastMessage: "Coupon applied successfully!"});
            } else {
                setStackedToastContent({ toastMessage: response?.message ? response.message : "Unable to apply coupon!"});
            }
        }).catch((error) => {
            setLoading(false);
            setStackedToastContent({ toastMessage: "Unable to apply coupon!" })
            console.log(error);
        });
    }

    const removeCoupon = async () => {
        setLoading(true);
        const config = { headers: { customerId: customerId }, params: { customerId: customerId } }
        await LabOrderService().removeCoupon(config).then((response) => {
            setLoading(false);
            if (isResponseSuccess(response) && response.responseData) {
                props.handleCouponAction(response.responseData);
                setCouponCode("");
                setStackedToastContent({ toastMessage: "Coupon removed successfully!"});
            } else {
                setStackedToastContent({ toastMessage: response?.message ? response.message : "Unable to remove coupon!"});
            }
        }).catch((error) => {
            setLoading(false);
            setStackedToastContent({ toastMessage: "Unable to remove coupon!" })
            console.log(error);
        });
    }

    return (
        <div id='coupon' className='scrolling-tabs p-12'>
            <label className='d-block pb-0 font-weight-bold custom-fieldset mb-2'> Apply Coupon Code</label>
            <div className="row">
                <div className="col-12 col-lg-4">
                    <div class="form-floating">
                        <input autoComplete='off' type="email" class="form-control" id="CouponCode" onChange={(e) => setCouponCode(e.target.value)} value={couponCode} placeholder="" />
                        <label for="CouponCode">Enter Coupon</label>
                    </div>
                </div>
                <div className='col-12 mt-2 col-lg-2 mt-lg-0'>
                    {props.appliedCoupon ?
                        <ButtonWithSpinner variant=" " style={{ height: "50px" }} disabled={Validate().isEmpty(couponCode)} showSpinner={loading} className={`btn brand-secondary btn-sm py-2`} onClick={removeCoupon} buttonText={"Remove Coupon"}></ButtonWithSpinner>
                        :
                        <ButtonWithSpinner variant=" " style={{ height: "50px" }} showSpinner={loading} disabled={Validate().isEmpty(couponCode)} className={`btn brand-secondary btn-sm py-2`} onClick={applyCoupon} buttonText={"Apply Coupon"}></ButtonWithSpinner>}
                </div>
                <div>
                </div>

            </div>
        </div>
    );
}

export default LabApplyCoupon;