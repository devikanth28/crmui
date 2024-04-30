import { END_POINT, REQUEST_TYPE } from "../ServiceConstants";
const Doctor_Config={
    API:{
        GET_PATIENTS: {
            url: "/checkout/getPatients",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.DOCTOR_CONSULTATION
        },
        ADD_OR_EDIT_PATIENT: {
            url: "/checkout/addOrEditPatient",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.DOCTOR_CONSULTATION
        },
        DELTE_PATIENT: {
            url: "/checkout/deletePatient",
            method: REQUEST_TYPE.POST,
            endPoint: END_POINT.DOCTOR_CONSULTATION
        },
    }
}
export default Doctor_Config