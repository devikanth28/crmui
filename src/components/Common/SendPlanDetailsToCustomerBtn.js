import React, { useContext, useState } from 'react';
import MembershipService from '../../services/Membership/MembershipService';
import Validate from '../../helpers/Validate';
import { AlertContext, CustomerContext } from '../Contexts/UserContext';
import ButtonWithSpinner from './ButtonWithSpinner';

function SendPlanDetailsToCustomerBtn(props) {

    const { setStackedToastContent } = useContext(AlertContext);
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const { customerId } = useContext(CustomerContext);



    const sendPlanDetailsToCustomer = () => {
        setButtonSpinner(true);
        MembershipService().sendPlanDetails({ params: { "customerId": customerId, "planId": props.planId } }).then(res => {
            if (Validate().isNotEmpty(res) && "SUCCESS" == res.message && "SUCCESS" == res.statusCode) {
                setStackedToastContent({ toastMessage: "Plan Details Sent to Customer Mobile" });
                setButtonSpinner(false);
            }
            else if (Validate().isNotEmpty(res) && "FAILURE" == res.statusCode && Validate().isNotEmpty(res.message)) {
                setStackedToastContent({ toastMessage: res.message });
                setButtonSpinner(false);
            }
        }).catch(err => {
            console.log("Error occured while ending plan Details", err);
        })
    };
    return (<React.Fragment>
        <div>
        <svg id="sendPlanDetails" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="#0d6efd">
            <g id="sendmsg-fill-icn-16" transform="translate(-180.258 -387.452)">
                <rect id="Rectangle_3299" data-name="Rectangle 3299" width="16" height="16" rx="3" transform="translate(180.258 387.452)" fill="none" />
                <path id="sendmsg-fill-icn" d="M26.981,23.411a.277.277,0,0,0-.4-.382l-4.96,4.22L19,26.236a.637.637,0,0,1-.074-1.156L29.8,18.988a.536.536,0,0,1,.788.522l-.954,9.944a.658.658,0,0,1-.9.549L25.55,28.77l-2,1.875a.517.517,0,0,1-.87-.382V28.791Z" transform="translate(163.662 370.528) " />
            </g>
        </svg>
    <ButtonWithSpinner variant=" " showSpinner={buttonSpinner} disabled={props.disableButton} className={`${props.className ? props.className : "px-2 btn px-lg-4 me-2"}`} onClick={sendPlanDetailsToCustomer} buttonText={props.buttonText}></ButtonWithSpinner>

        </div>
    </React.Fragment>
    );
}

export default SendPlanDetailsToCustomerBtn;