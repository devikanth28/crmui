import { useContext, useEffect } from "react";
import AgentAppService from "../../../services/AgentApp/AgentAppService";
import { AGENT_UI } from "../../../services/ServiceConstants";
import Validate from "../../../helpers/Validate";
import { AlertContext } from "../../Contexts/UserContext";
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import { Wrapper } from "../../Common/CommonStructure";

export default (props) => {

    const tpaTokenId = props.match.params.tpaTokenId;
    const userId = props.match.params.userId;
    const collectionStoreId = props.match.params.collectionStoreId;
    const isThirdPartyAgent = props.match.params.isThirdPartyAgent;

	const agentAppService = AgentAppService(tpaTokenId);
    const { setToastContent } = useContext(AlertContext);
    const validate = Validate();

    useEffect(() => {
        const tokenObj = {
            collectionStoreId,
            isThirdPartyAgent,
            userId
        };
        agentAppService.setMATokenData(tokenObj).then(res => {
            if("SUCCESS" === res?.statusCode) {
                props.history.replace({pathname:`${AGENT_UI}/searchLocation`,state:tpaTokenId});
                return;
            }
            if(validate.isNotEmpty(res?.message)) {
                setToastContent(res.message);
            } else {
                setToastContent("Oops...! Something went wrong!!!");
            }
        }).catch(error => {
            console.log(error);
            setToastContent("Oops...! Something went wrong!!!");
        })
    }, []);

	return (
        <Wrapper>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" />
            </div>
        </Wrapper>
    );
};
