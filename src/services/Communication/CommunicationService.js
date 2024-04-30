import COMMUNICATIONCONFIG from "./CommunicationConfig";
import { serverRequest } from "../../axios";

export default () => {

    function validateOrders(obj) {
        return serverRequest(COMMUNICATIONCONFIG.VALIDATE_ORDER_ID, {params: obj});
    }
    function getInsertCommunicationLog (obj) {
        return serverRequest(COMMUNICATIONCONFIG.INSERT_COMMUNICATION_LOG, {params: obj});
    }
    function getLogDetails (obj) {
        return serverRequest(COMMUNICATIONCONFIG.GET_LOG_DETAILS, {params: obj});
    }
    return Object.freeze({
        validateOrders,
        getInsertCommunicationLog,
        getLogDetails,
    });
}