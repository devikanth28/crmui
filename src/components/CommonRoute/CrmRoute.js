import React ,{ useState } from 'react';
import {  Route } from 'react-router-dom';
import { ProSidebarProvider } from "react-pro-sidebar";
import CrmHeader from "../Headers/CrmHeader"
import { AlertContext } from '../Contexts/UserContext';
import NavTab from "../NavBars/NavTab";
import { useWindowSize } from '../../hooks/useWindowSize';

const CrmRoute = ({ component: Component, ...rest }) => {
    const [alertContent, setAlertContent] = useState({});
    const [toastContent, setToastContent] = useState([]);
    const [stackedToastContent, setStackedToastContent] = useState({});

    const [,windowHeight] = useWindowSize();

    return (        
        <Route {...rest} render={(props) => (
            <React.Fragment>
                <AlertContext.Provider value={{ alertContent, setAlertContent, toastContent, setToastContent, stackedToastContent, setStackedToastContent }}>
                    <div className='crm-app' style={{'--dynamic-viewport-height' : `${windowHeight}px`}}>
                        <CrmHeader {...props} {...rest} />
                        <section className="custom_grid_parent mobile-responsive crm-flow">
                            <ProSidebarProvider>
                                <NavTab {...props} />
                            </ProSidebarProvider>
                            <div>
                                <Component {...props} {...rest} />
                            </div>
                        </section>
                    </div>
                </AlertContext.Provider>
            </React.Fragment>
           )} />
    )
}

export default CrmRoute;