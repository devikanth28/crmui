import React, { useRef, useState } from 'react';
import { ProSidebarProvider } from "react-pro-sidebar";
import { Route } from 'react-router-dom';
import { AlertContext, LocalityContext } from '../Contexts/UserContext';
import CustomerHeader from '../Headers/CustomerHeaderComponents/CustomerHeader';
import CustomerMenuNavTab from "../NavBars/CustomerMenuNavTab";

const CrmCustomerRoute = ({ component: Component, ...rest }) => {

    const customerHeaderRef = useRef();

    const [alertContent, setAlertContent] = useState({});
    const [toastContent, setToastContent] = useState([]);
    const [stackedToastContent, setStackedToastContent] = useState([]);
    const [martLocality,setMartLocality] = useState({});

    return (
        <Route {...rest} render={(props) => (
            <React.Fragment>
                <AlertContext.Provider value={{ alertContent, setAlertContent, toastContent, setToastContent, stackedToastContent, setStackedToastContent }}>
                  <LocalityContext.Provider value={{ martLocality,setMartLocality }}>
                        <CustomerHeader {...props} />
                    <section className="d-flex">
                        <ProSidebarProvider>
                            <CustomerMenuNavTab {...props} />
                        </ProSidebarProvider>
                        <div className='flex-grow-1'>
                            <Component customerHeaderRef={customerHeaderRef} {...props} {...rest} />
                        </div>
                    </section>
                     </LocalityContext.Provider>
                </AlertContext.Provider>
            </React.Fragment>
        )} />

    )
}

export default CrmCustomerRoute;