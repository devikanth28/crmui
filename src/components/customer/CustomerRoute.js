import { Route } from "react-router-dom";
import { AlertContext, CustomerContext, LocalityContext } from "../Contexts/UserContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";



const CustomerRoute = ({ component: Component, ...rest }) => {

    const { setCustomer, customerId, customer } = useContext(CustomerContext);
    const customerHeaderRef = useRef();

    const [alertContent, setAlertContent] = useState({});
    const [toastContent, setToastContent] = useState([]);
    const [stackedToastContent, setStackedToastContent] = useState([]);
    
    return (
        <Route {...rest} render={(props) => (
            <React.Fragment>
                <Component customerHeaderRef={customerHeaderRef} {...rest} {...props} />
            </React.Fragment>
        )} />
    )
}

export default CustomerRoute;