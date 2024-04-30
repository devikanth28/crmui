import React, { useContext, useEffect, useState } from 'react';
import CustomerService from '../../services/Customer/CustomerService';
import { AlertContext } from '../Contexts/UserContext';
import NavTab from './NavTab';
import { CRM_UI } from '../../services/ServiceConstants';

const CustomerMenuNavTab = (props) => {

    const [navLinks, setNavLinks] = useState(null);
    const { setStackedToastContent } = useContext(AlertContext);

    useEffect(() => {
        getCustomerMenuLinks();
    }, []);

    const getCustomerMenuLinks = () => {
        CustomerService().getCustomerMenuLinks({"navView" :"CRM_CUSTOMER"}).then((response) => { 
            if (response && response.statusCode == "SUCCESS" && response.dataObject) {
                setNavLinks(response.dataObject);
            }
        }).catch(() => {
            setStackedToastContent({toastMessage:"something went wrong"})
        });
    }

    return (
        <React.Fragment>
            {navLinks && <NavTab isCustomerNavBar={true} customerPrefix={`${CRM_UI}/customer/${props.match.params.customerId}`} navLinks={navLinks} {...props} />}
        </React.Fragment>
    );
}

export default CustomerMenuNavTab;