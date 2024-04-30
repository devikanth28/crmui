import React, { useEffect, useState } from 'react';
import CustomerService from '../../services/Customer/CustomerService';
import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';

const CustomerBioEditForm = ({helpers, ...props }) => {
    
    const [customerBioEditJson, setCustomerBioEditJson] = useState(null);
    let customerDetails = props.customerDetails ? props.customerDetails : null;
    customerDetails.oldMobileNumber = customerDetails ? customerDetails.mobile : null;

    useEffect(() => {
        getCustomerBioEditJson();
    }, []);
    
    const setCustomerDataInForm = (customerDetails) => {
        helpers.updateValue(customerDetails.firstName, "firstName");
        helpers.updateValue(customerDetails.lastName, "lastName");
        helpers.updateValue(customerDetails.emailId, "emailId");
        helpers.updateValue(customerDetails.gender, "gender");
        helpers.updateValue(customerDetails.dateOfBirth, "dateOfBirth");
        helpers.updateValue(customerDetails.age, "age");
        helpers.updateValue(customerDetails.mobile, "mobile");
        helpers.updateValue(customerDetails.landLineNo, "landLineNo");
        helpers.updateValue(customerDetails.shippingAddress, "address");
        helpers.updateValue(customerDetails.receiveUpdates, "receiveUpdates");
    }

    const updateCustomerDetails = () => {
        const customerFormData = helpers.validateAndCollectValuesForSubmit("customerBioEdit");
        if (!customerFormData) {
            return
        }
        customerDetails = { ...customerDetails, ...customerFormData };
        customerDetails.receiveUpdates = customerDetails.receiveUpdates[0];
        CustomerService().updateCustomerDetails(JSON.stringify(customerDetails)).then((response) => {
            if (response && response.statusCode == "SUCCESS") {
                alert(response.message);
                props.setCustomerDetails(customerDetails);
            }
            else {
                alert(response.message);
            }
            props.setShowCustomerForm(false);
        }).catch(() => {
            alert("Something went wrong");
        });
    }

    const observersMap = {
        "updateCustomerDetails": [['click', updateCustomerDetails]],
    }

    


    const getCustomerBioEditJson = () => {
        CustomerService().getCustomerBioEditJson().then((response) => {
            if (response && response.statusCode == "SUCCESS" && response.dataObject) {
                setCustomerBioEditJson(response.dataObject);
                setCustomerDataInForm(props.customerDetails);
            } else {
                alert("something went wrong");
                props.setShowCustomerForm(false);
            }
        }).catch(() => {
            alert("something went wrong");
            props.setShowCustomerForm(false);
        })
    };
   
    return (
        <>
            <button className='btn btn-secondary' onClick={() => { props.setShowCustomerForm(false); }}>Back</button>
            {customerBioEditJson && <DynamicForm formJson={customerBioEditJson} helpers={helpers} observers={observersMap} />}
        </>
    );
}
export default withFormHoc(CustomerBioEditForm);