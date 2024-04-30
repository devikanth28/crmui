import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import Database from "../../Database";
import { customerId, persistKey, tokenId } from "../../constants/AgentAppConstants";
import { useWindowSize } from "../../hooks/useWindowSize";
import { AgentAppContext, AlertContext } from "../Contexts/UserContext";
import AgentAppHeader from "../Headers/AgentAppHeader";
import CloseChromeTab from "./common/CloseChromeTab";

const AgentAppRoute = ({ component: Component, ...rest }) => {

    const [custId, setCustomerIdInContext] = useState(Database.getValue(persistKey + customerId));
    const [tpaTokenId, setTpaTokenIdInContext] = useState(Database.getValue(persistKey + tokenId));
    const [isHeaderLoading, setIsHeaderLoading] = useState(true);
    const [isHeaderSynced, setIsHeaderSynced] = useState(false);
    const [alertContent, setAlertContent] = useState({});
    const [toastContent, setToastContent] = useState([]);
    const [locationSearchText, setLocationSearchText] = useState("");
    const [collectionStoreId, setCollectionStoreId] = useState(undefined);
    const [isThirdPartyAgent, setIsThirdPartyAgent] = useState(undefined);
    const [userId, setUserId] = useState(undefined);
    const [isFormLoading, setFormLoading]= useState(false);

    const [,windowHeight] = useWindowSize();
    useEffect(() => {
        if (rest.routePath === "subscriptionMembers") {
            setFormLoading(true);
        }
    }, [rest.routePath]);
    const setCustomerId = (custId) => {
        setCustomerIdInContext(custId);
        Database.setValue(persistKey + customerId, custId)
    }

    const setTpaTokenId = (tpaId) => {
        setTpaTokenIdInContext(tpaId);
        Database.setValue(persistKey + tokenId, tpaId)
    }

    useEffect(() => {
        document.addEventListener('beforeunload', clearPersistedData);
        return () => {
            document.removeEventListener('beforeunload', clearPersistedData);
        }
    }, []);

    const clearPersistedData = () => {
        Database.removeValue(persistKey + tokenId);
        Database.removeValue(persistKey + customerId);
    }

    const headers = { 'Authorization': `Bearer ${tpaTokenId}` };

    return (
        <Route {...rest} render={(props) => (
            <AlertContext.Provider value={{ alertContent, setAlertContent, toastContent, setToastContent }}>
                <AgentAppContext.Provider value={{ alertContent, setAlertContent, toastContent, setToastContent, customerId: custId, setCustomerId, tpaTokenId, setTpaTokenId, locationSearchText, setLocationSearchText, userId, setUserId, collectionStoreId, setCollectionStoreId, isThirdPartyAgent, setIsThirdPartyAgent }}>
                    <div className="agent-app" style={{'--dynamic-viewport-height' : `${windowHeight}px`}}>
                        <AgentAppHeader setIsHeaderLoading={setIsHeaderLoading} setIsHeaderSynced={setIsHeaderSynced} isHeaderSynced={!isHeaderLoading && isHeaderSynced }  {...props} {...rest} />
                        {(isHeaderLoading || isFormLoading) && <div className="d-flex justify-content-center align-items-center h-100 position-absolute w-100 z-1">
                            <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText={"Please be patient while we prepare your data for loading!"}/>
                        </div>
                        }
                        {!isHeaderLoading && <>
                            {isHeaderSynced ?
                                <section className="mobile-responsive agent-app-content">                                    
                                    <Component {...props} {...rest} headers={headers} isAgentApp isFormLoading = {isFormLoading} setFormLoading = {setFormLoading}/>                                    
                                </section>
                                :
                                <CloseChromeTab displayText = {"Huh..! Your session has been expired."} buttonText={"Please Restart"} />
                            }
                        </>}
                    </div>
                </AgentAppContext.Provider>
            </AlertContext.Provider>
        )}
        />
    );
};

export default AgentAppRoute;
