import { TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useState } from 'react'
import { gotoMartCustomerPage } from '../../helpers/CommonRedirectionPages';
import Validate from '../../helpers/Validate';
import CustomerService from '../../services/Customer/CustomerService';
import { AlertContext } from '../Contexts/UserContext';

const CustomerDetails = (props) => {

    const { setStackedToastContent ,setAlertContent} = useContext(AlertContext);

    const handleFailure = () => {
        setStackedToastContent({ toastMessage: "Customer is Already Opened", position: TOAST_POSITION.BOTTOM_START })
    }

    const { customerId, mobileNumber, customerName, emailId, dob, gender } = props;
    const validate = Validate();
    const [customer, setcustomer] = useState({ customerId: customerId, fullName: customerName, mobile: mobileNumber, emailId: emailId, dob: dob, gender: gender });
    if (validate.isEmpty(customerId)) {
        return <React.Fragment>

        </React.Fragment>
    }
    useEffect(() => {
        if (validate.isEmpty(mobileNumber) || validate.isEmpty(customerName)) {
            CustomerService().getCustomerDetailsById(customerId).then(response => {
                if (validate.isNotEmpty(response.dataObject[0])) {
                    setcustomer(response.dataObject[0]);
                }
            }).catch(err => {
                setAlertContent({ alertMessage: "Error while getting prescription meta info" })
                console.log(err)
            });
        }
    }, [])
    return (
        <React.Fragment>
            {validate.isNotEmpty(customer.customerId) ? <div className={`${Validate().isNotEmpty(props.needRule) && props.needRule == true ? 'custom-border-bottom-dashed' : ""} mb-3`}>
                <p className='align-items-center d-flex font-12 mb-2 text-secondary'>Customer Details</p>
                <div className='d-flex justify-content-between'>
                    {validate.isNotEmpty(customer.fullName) && <div>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>Name </p>
                        <div className='d-flex align-items-center gap-2'>
                            <h6 className='font-14 mb-0'>{customer.fullName}</h6>
                            {props?.hasSubscribedMedplusAdvantage && <div>
                                <span id="Approved" class="badge-approved badge rounded-pill">MA Member</span>
                            </div>}
                        </div>                        
                    </div>}                    
                </div>
                <div className='row g-3 my-2'>
                    {validate.isNotEmpty(customer.dateOfBirth) && <div className='col'>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>DOB </p>
                        <h6 className='font-14'>{new Date(customer.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</h6>
                    </div>}
                    {validate.isNotEmpty(customer.dob) && <div className='col'>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>DOB </p>
                        <h6 className='font-14'>{new Date(customer.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</h6>
                    </div>}
                    {validate.isNotEmpty(customer.gender) && (customer.gender=="F" || customer.gender=="M") &&<div className='col'>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>Gender </p>
                        <h6 className='font-14'>{customer.gender=="F" ? <>Female</>: customer.gender=="M" ?<>Male</>:<></>}</h6>
                    </div>}
                </div>

                <small className='text-secondary font-14'><span> Customer ID - <a onClick={() => gotoMartCustomerPage({ customerId: customer.customerId, mobile: customer.mobile }, handleFailure)} className='text-decoration-none' href="javascript:void(0)" rel="noopener">{customer.customerId}</a></span>
                    <span> <span className='px-2'> | </span> Ph.No - <a href="tel:+"{...customer.mobile} title="Contact Customer" className='text-decoration-none'>{customer.mobile} </a></span> {Validate().isNotEmpty(customer.emailId) ? <p> Email: <a href="javascript:void(0)" onClick={() => window.open(`mailto:${customer.emailId}`)} title={`Send an email to ${customer.emailId}`} className="text-decoration-none">{customer.emailId}</a></p> : null} </small></div> : <div></div>}

            </React.Fragment>
    )
}

export default CustomerDetails;
