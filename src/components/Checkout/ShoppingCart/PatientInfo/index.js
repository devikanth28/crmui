import { useContext, useEffect, useState } from "react";
import Validate from "../../../../helpers/Validate";
import CheckoutService from "../../../../services/Checkout/CheckoutService";
import DoctorService from "../../../../services/Doctor/DoctorService";
import { AlertContext, CustomerContext } from "../../../Contexts/UserContext";
import NewPatientForm from "./NewPatientForm";
import PatientCard from "./PatientCard";
import LabOrderService from "../../../../services/LabOrder/LabOrderService";


export default (props) => {
    const isLabs = props.isLabs;
    const validate = Validate();
    const doctorService = DoctorService();
    const checkoutService = CheckoutService();
    const labOrderService = LabOrderService();
    const  {customerId}  = useContext(CustomerContext);
    const { setStackedToastContent } = useContext(AlertContext)
    const [patients, setPatients] = useState(undefined);
    const [selectedPatientId,setSelectedPatientId] = useState(undefined);
    const [isPatientAvaliable,setIsPatientAvaliable] = useState(undefined);
    const [showNewPatientModal,setShowNewPatientModal] = useState(false);
    const [subscribedMemberIds,setSubscribedMemberIds] = useState(undefined);
    const [selectedPatientInfo, setSelectedPatientInfo] = useState({});

    useEffect(() => {
        if(validate.isNotEmpty(customerId)){
            getPatients(customerId);
        }
    }, []);

    useEffect(()=>{
        if(validate.isNotEmpty(selectedPatientInfo)){
            addSelectedPatient(selectedPatientInfo);
        }
    },[selectedPatientId,isPatientAvaliable])

    const addSelectedPatient=async(patientInfo)=>{
        let apiResponse = {};
        if(!isLabs) {
            apiResponse = await addPatientToShoppingCart(patientInfo);
            if(validate.isNotEmpty(apiResponse) && validate.isNotEmpty(apiResponse.dataObject) && "SUCCESS"==apiResponse?.statusCode){
                props.setSelectedPatientInfo(apiResponse.dataObject);
            }else{
                setStackedToastContent({ toastMessage: "Failed to add patient to the shopping cart" });
            }
        } else {
            if(validate.isEmpty(patientInfo?.patientId) || validate.isEmpty(patientInfo?.doctorName) || validate.isEmpty(patientInfo?.gender) || validate.isEmpty(patientInfo?.age)) {
                setSelectedPatientId(undefined);
                setSelectedPatientInfo(undefined);
                return;
            } 
            apiResponse = await addPatientToLabShoppingCart(patientInfo);
            if(validate.isNotEmpty(apiResponse) && validate.isNotEmpty(apiResponse.responseData) && "SUCCESS"==apiResponse?.statusCode){
                props.populateShoppingCartData(apiResponse.responseData);
                props.setIsValidPatient(true);
            }else{
                setStackedToastContent({ toastMessage: "Failed to add patient to the shopping cart" });
            }
        }
    }
    const patientIdFlag = isPatientAvaliable &&  validate.isNotEmpty(props.selectedPatientId) && (validate.isEmpty(selectedPatientId) || (validate.isNotEmpty(selectedPatientId) && props.selectedPatientId==selectedPatientId));
    const addPatientToShoppingCart=(patientInfo)=>{
        return checkoutService.addPatientToShoppingCart({headers:{customerId:customerId},params:{patientId:(validate.isNotEmpty(selectedPatientId)) ? selectedPatientId : props?.selectedPatientId, doctorName : validate.isNotEmpty(selectedPatientInfo?.doctorName) ? selectedPatientInfo?.doctorName : patientInfo.doctorName}});
    }

    const addPatientToLabShoppingCart = (patientInfo) => {
        return labOrderService.addPatientToLabShoppingCart({headers:{customerId:customerId}, params:{patientId:(validate.isNotEmpty(patientInfo?.patientId)) ? patientInfo?.patientId : props?.selectedPatientId, doctorName: validate.isNotEmpty(selectedPatientInfo?.doctorName) ? selectedPatientInfo?.doctorName : patientInfo.doctorName}});
    }

    const getPatients = async (customerId) => {
        const patientsResponse = await doctorService.getPatients({headers:{customerId:customerId}});
        setPatientsResponse(patientsResponse, undefined);
    }

    const deletePatient = (patientInfo) => {
        return doctorService.deletePatient( {headers:{customerId:customerId},params:{'patientId':patientInfo?.patientId}} );
    }

    const setPatientsResponse = (response, toastMessage, isFromDelete = false, isAddPatient=false) => {
        if (validate.isNotEmpty(response) && validate.isNotEmpty(response?.dataObject) && "SUCCESS" == response.statusCode && (isFromDelete || validate.isNotEmpty(response.dataObject?.members))) {
            let members = isFromDelete?response.dataObject:response.dataObject.members;
            setPatients(members)
            if(validate.isNotEmpty(response.dataObject?.subscribedMemberIds)){
                setSubscribedMemberIds(response.dataObject?.subscribedMemberIds)
            }
            let patientAvailable = false;
            if((!isAddPatient && validate.isEmpty(selectedPatientId)) || isFromDelete){
                let primaryPatient = undefined;
                members.filter(patientInfo=>{
                    if(validate.isNotEmpty(props?.selectedPatientId) && patientInfo?.patientId==props?.selectedPatientId){
                        patientAvailable = true
                        primaryPatient = patientInfo;
                    }
                    if(patientInfo?.relationship?.relationshipType == 'SELF'){
                        primaryPatient = patientInfo;
                    }
                })
                    setSelectedPatientId(primaryPatient?.patientId);
                    setSelectedPatientInfo(primaryPatient);
                    setIsPatientAvaliable(patientAvailable);
                if (isFromDelete && validate.isNotEmpty(toastMessage) && "SUCCESS" == response.statusCode) {
                    setStackedToastContent({ toastMessage: toastMessage })
                }
                return;
            }
            if(isAddPatient) {
                setSelectedPatientId(response.dataObject.patientId);
                let selectedPatient = members.filter(patientInfo=>{
                    if(patientInfo?.patientId == response.dataObject.patientId){
                        return patientInfo;
                    }
                });
                setSelectedPatientInfo(selectedPatient[0]);
            } else {
                setSelectedPatientId(undefined);
            }
        }
        if (validate.isNotEmpty(toastMessage) && "SUCCESS" == response.statusCode) {
            setStackedToastContent({ toastMessage: "Patient added successfully" })
        }
    }

    const addNewPatient=async(patientInfo)=>{
        const response = await addOrEditPatient(patientInfo);
        setPatientsResponse(response, response.message,false,true);
    }

    const handleEditPatient = async (patientInfo) => {
        const response = await addOrEditPatient(patientInfo);
        setPatientsResponse(response, "Patient saved successfully",false,true);
    }

    const handleRemovePatient = async (patientInfo) => {
        const response = await deletePatient(patientInfo);
        setPatientsResponse(response, "Patient removed successfully",true);
    }

    const addOrEditPatient = (patient) => {
        return doctorService.addOrEditPatient({headers:{customerId:customerId},params:{patient:patient}});
    }

    return (
        <>
            {validate.isNotEmpty(patients) && <div className="p-12">
            <p className="custom-fieldset mb-2">Select Patient</p>
                <div className="card p-12">
                    <div className="row g-3">
                        {validate.isNotEmpty(patients) && patients.map(eachPatient => {
                            return <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-4 col-xxl-4"><PatientCard handleRemove={handleRemovePatient} patientInfo={eachPatient} handleEdit={handleEditPatient} {...props} setSelectedPatientId={setSelectedPatientId} setSelectedPatientInfo={setSelectedPatientInfo} selectedPatientId={patientIdFlag? props?.selectedPatientId : selectedPatientId} subscribedMemberIds={subscribedMemberIds} isLabs/></div>
                        })
                        }
                    </div>
                    <div className="mt-3">
                        <button type="button" class="btn btn-sm brand-secondary" onClick={() => { setShowNewPatientModal(!showNewPatientModal) }}>Add New Patient</button>
                    </div>
                </div>
            {showNewPatientModal && <NewPatientForm openAddPatientflag={showNewPatientModal} setOpenAddPatientflag={(flag) => { setShowNewPatientModal(flag) }} isAddNew={true} addNewPatient={(patientInfo) => { addNewPatient(patientInfo) }} isLabs/>}
            </div>}
        </>
    )
}