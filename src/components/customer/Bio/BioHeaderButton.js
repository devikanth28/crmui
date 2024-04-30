
import { useContext, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import Validate from "../../../helpers/Validate"
import CustomerService from "../../../services/Customer/CustomerService"
import { AlertContext, CustomerContext } from "../../Contexts/UserContext"
import NewDoctorRegistration from "./NewDoctorRegistration"
import { CustomSpinners } from "@medplus/react-common-components/DynamicForm"

const BioHeaderButton = ({ openDoctorRegForm, setOpenDocRegForm, customerId }) => {

    const [doctorDetails, setDoctorDetails] = useState({})
    const validate = Validate();
    const [backDropLoader, setBackDropLoader] = useState(false)
    const { setStackedToastContent } = useContext(AlertContext);
    const { customer, setCustomer } = useContext(CustomerContext);
    const customerService = CustomerService();
    
    const updateDoctorClinicDetails = () => {
        if (validate.isNotEmpty(doctorDetails.clinicName) && (validate.isEmpty(doctorDetails.address) || validate.isEmpty(doctorDetails.pincode) || validate.isEmpty(doctorDetails.city) || validate.isEmpty(doctorDetails.state))) {
            setStackedToastContent({ toastMessage: "Clinic address is mandatory" })
            return;
        }
        setBackDropLoader(true)
        doctorDetails['customerId'] = customerId;
        customerService.updateDoctorClinicDetails(doctorDetails).then(data => {
            if (data && "SUCCESS" == data.statusCode && validate.isNotEmpty(data.dataObject)) {
                setCustomer({ ...customer, ...data.dataObject });
                closeModal()
            } else if ("FAILURE" == data.statusCode) {
                setStackedToastContent({ toastMessage: data.message })
                closeModal()
            }
            setBackDropLoader(false)
        }).catch(err => {
            console.log("Error while fetching doctor's Information", err);
            setStackedToastContent({ toastMessage: "Something went wrong, please try again later", position: TOAST_POSITION.BOTTOM_START });
            closeModal()
            setBackDropLoader(false)
        })

    }

    const enableUpdateDoctorRegButton = () => {
        if (validate.isNotEmpty(doctorDetails) && validate.isNotEmpty(doctorDetails?.clinicName?.trim()) && (validate.isEmpty(doctorDetails?.address?.trim()) || validate.isEmpty(doctorDetails?.pincode?.trim()) || validate.isEmpty(doctorDetails?.city?.trim()) || validate.isEmpty(doctorDetails?.state?.trim()))) {
            return true;
        }else{
            return false;
        }
    }

    const closeModal = () => {
        setOpenDocRegForm(false);
    }

    return (
        <>
            <div className='d-flex gap-2'>
                <div style={{'padding-bottom':"0.75rem"}} className='separator-end'><Button variant="outline-dark" className="btn-sm px-3" onClick={() => setOpenDocRegForm(true)} >Register as a Doctor</Button></div>
                {openDoctorRegForm && <Modal
                    show={true}
                    backdrop="static"
                    onHide={() => { setOpenDocRegForm(false) }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <div className='custom-border-bottom-dashed'>
                        <Modal.Header closeButton>
                            <Modal.Title className='h6'>Register as a Doctor</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                            <NewDoctorRegistration setDoctorDetails={setDoctorDetails} />
                        </Modal.Body>
                        <Modal.Footer className='d-flex flex-row-reverse gap-2 justify-content-center'>
                            <Button className={'px-4'} onClick={updateDoctorClinicDetails} disabled={backDropLoader || enableUpdateDoctorRegButton()}>{backDropLoader?<CustomSpinners spinnerText={"Search"} className={" spinner-position"} innerClass={"invisible"} />:"Update as Doctor"}</Button>
                            <Button className='brand-secondary px-4' disabled={backDropLoader} onClick={() => { closeModal() }}  >Cancel</Button>
                        </Modal.Footer>
                    </div>
                </Modal>}
            </div>
        </>
    )
}

export default BioHeaderButton