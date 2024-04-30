import React, { useContext, useEffect, useState } from 'react';
import CustomerService from '../../services/Customer/CustomerService';
import { UserContext } from '../Contexts/UserContext';
import CustomerBioEditForm from './CustomerBioEditForm';

const CustomerBio = (props) => {

    const [showCustomerForm, setShowCustomerForm] = useState(false);
    const [customerDetails, setCustomerDetails] = useState(null);
    const userSessionInfo = useContext(UserContext);

    useEffect(() => {
        if (props.match.params.customerId) {
            getCustomerDetailsById(props.match.params.customerId);
        } else {
            alert("wrong parametrs");
        }
    }, [props.match.params.customerId]);

    const getCustomerDetailsById = (customerId) => {
        CustomerService().getCustomerDetailsById(customerId).then((response) => {
            if (response && response.statusCode == "SUCCESS" && response.dataObject) {
                setCustomerDetails(response.dataObject[0]);
            } else if (response && response.message) {
                alert(response.message);
            } else {
                alert("Something went wrong");
            }
        }).catch((e) => {
            alert("Something went wrong");
        })
    }
    return (
        <>
            { customerDetails && <div>
                <h1>Bio home page</h1>
                {JSON.stringify(customerDetails)}
                {true && <button className='btn btn-primary' onClick={() => setShowCustomerForm(true)}>Edit customer</button>}
                {showCustomerForm && <CustomerBioEditForm customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} setShowCustomerForm={setShowCustomerForm} />}
            </div> }
        </>
    );
}

export default CustomerBio;