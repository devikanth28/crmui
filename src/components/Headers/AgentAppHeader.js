import { useContext, useEffect } from "react";
import AgentAppService from "../../services/AgentApp/AgentAppService";
import { AgentAppContext } from "../Contexts/UserContext";
import CommonAgentAppHeader from "./CommonAgentAppHeader";

const AgentAppHeader = (props) => {

    const { tpaTokenId, setTpaTokenId, setIsThirdPartyAgent, setCollectionStoreId, setUserId } = useContext(AgentAppContext);
    const tokenId = props?.location?.state || tpaTokenId;
    const agentAppServices = AgentAppService(tokenId);

    useEffect(() => {
        getHeaderInfo();
    }, []);

    const getHeaderInfo = () => {
        agentAppServices.getHeaderInfo().then((res) => {
            if(res?.statusCode === "SUCCESS" && res?.responseData) {
                setTpaTokenId(res.responseData.tokenId);
                setUserId(res.responseData.userId);
                setIsThirdPartyAgent("true" === res.responseData.isThirdPartyAgent);
                setCollectionStoreId(res.responseData.collectionStoreId);
                props.setIsHeaderSynced(true);
            }
            props.setIsHeaderLoading(false);
        }).catch((err) => {
            console.log(err);
            props.setIsHeaderLoading(false);
        })
    }

    return(
         <CommonAgentAppHeader {...props} />
    )
}

export default AgentAppHeader;