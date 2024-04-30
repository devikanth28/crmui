import { serverRequest } from "../../axios";
import Doctor_Config from "./DoctorConfig";


export default ()=>{
    function getPatients(config){
        return serverRequest(Doctor_Config.API.GET_PATIENTS,config);
    }

    function addOrEditPatient(config){
        return serverRequest(Doctor_Config.API.ADD_OR_EDIT_PATIENT,config);
    }

    function deletePatient(config){
        return serverRequest(Doctor_Config.API.DELTE_PATIENT,config);
    }

    return Object.freeze({
        getPatients,
        addOrEditPatient,
        deletePatient
    })
    }