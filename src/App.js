import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Routes from './routes';
import { SidebarContext, UserContext, DetailModelOpened } from './components/Contexts/UserContext';
import '@medplus/react-common-components/CommonCss'
import UserService from "./services/Common/UserService";
import Validate from "./helpers/Validate";
import { AGENT_UI } from "./services/ServiceConstants";
import UserBrowserInfo from '@medplus/react-common-components/UserBrowserInfo';

const history = createBrowserHistory();



const App = () => {

    const [userSessionDetails,setUserSessionDetails] = useState({});
    const [userSearchDetails,setUserSearchDetails] = useState({});
    const [sidebarCollapsedFlag,setSidebarCollapsedFlag] = useState(false);
    const [selectedFormsSection,setSelectedFormsSection] = useState(true);
    const [userBrowserDetails, setUserBrowserDetails] = useState({areBrowserDetailsFetched : false});

    useEffect(() => {
        if (userSessionDetails && userSessionDetails?.vertical == "V") {
            setSidebarCollapsedFlag(true)
        }
    }, [userSessionDetails])

    useEffect(()=>{
        if(history?.location?.pathname?.indexOf(`${AGENT_UI}`)!==-1){
            return;
        }
        UserService().getUserSessionDetails({}).then(data => {
            if(Validate().isNotEmpty(data) && "SUCCESS" === data.statusCode && Validate().isNotEmpty(data.dataObject)) {
                setUserSessionDetails(data.dataObject);
            } else {
                setUserSessionDetails({});
            }
        })

        UserService().getUserSavedSearches({}).then(data => {
            if(Validate().isNotEmpty(data) && "SUCCESS" === data.statusCode && Validate().isNotEmpty(data.dataObject)) {
                setUserSearchDetails({"userSavedSearches": data.dataObject});
            } else {
                setUserSearchDetails({});
            }
        })

        if(!userBrowserDetails.areBrowserDetailsFetched){
            const {isValidBrowser, errorMessage} = UserBrowserInfo({});
            setUserBrowserDetails({isValidBrowser, browserErrorMessage:errorMessage, areBrowserDetailsFetched : true});
        }
    },[]);

    return <React.Fragment>
        <Router history={history}>
            <UserContext.Provider value = {{...userSessionDetails, ...userSearchDetails, setUserSearchDetails, ...userBrowserDetails}}>
                <SidebarContext.Provider value={{sidebarCollapsedFlag,setSidebarCollapsedFlag}}>
                <DetailModelOpened.Provider value={{selectedFormsSection , setSelectedFormsSection}}>
                    <Routes/>
                </DetailModelOpened.Provider>
                </SidebarContext.Provider>
            </UserContext.Provider>
        </Router>
    </React.Fragment>
}

export default App;
