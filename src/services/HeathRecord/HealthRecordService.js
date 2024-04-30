import { serverRequest } from "../../axios";
import HEALTH_RECORD_CONFIG from "./HealthRecordConfig";

export default () => {
  
    function getHealthRecordDetails(param) {
        const obj = {
            ...HEALTH_RECORD_CONFIG.HEALTH_RECORD_INFO,
            url :  `${HEALTH_RECORD_CONFIG.HEALTH_RECORD_INFO.url}/${param}`,
        }
        return serverRequest(obj, {});
    }
    return Object.freeze({
        getHealthRecordDetails
    })
}