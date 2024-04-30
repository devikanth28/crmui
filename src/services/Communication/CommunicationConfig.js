import {REQUEST_TYPE } from "../ServiceConstants";

const COMMUNICATIONCONFIG={
    VALIDATE_ORDER_ID: {
        url:    "/validateOrderIdToInsertInCommLog",
        method: REQUEST_TYPE.POST
    },
    INSERT_COMMUNICATION_LOG: {
        url:    "/insertcommunicationLog",
        method: REQUEST_TYPE.POST
    },
    GET_LOG_DETAILS: {
        url:    "/getLogDetails",
        method: REQUEST_TYPE.GET
    }
}
export default COMMUNICATIONCONFIG;