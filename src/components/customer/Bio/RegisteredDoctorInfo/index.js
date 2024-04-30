import { useContext } from "react"
import { CustomerContext } from "../../../Contexts/UserContext"
import Validate from "../../../../helpers/Validate"

const RegisteredDocInfo = () => {
  const { customer } = useContext(CustomerContext)
  const registeredDoctorsInfo = customer?.registeredDoctorInfo
  const clinicAddress = customer?.clinicAddress
  return (
    <div className='custom-border-bottom-dashed mb-3'>
      <p className='text-secondary font-12'>Registered Doctor Info</p>
      {
        (Validate().isEmpty(registeredDoctorsInfo?.qualification) && Validate().isEmpty(registeredDoctorsInfo?.specialization) && Validate().isEmpty(registeredDoctorsInfo?.clinicName)) ?
          <>
            Doctor's Information not Found
          </> :
          <>
            {registeredDoctorsInfo?.qualification && <div>Qualification : {registeredDoctorsInfo?.qualification}</div>}
            {registeredDoctorsInfo?.specialization && <div>Specialization : {registeredDoctorsInfo?.specialization}</div>}
            {registeredDoctorsInfo?.clinicName &&
              <div>
                <strong>Clinic Info</strong>
                {registeredDoctorsInfo?.clinicName && <div>Name: {registeredDoctorsInfo?.clinicName}</div>}
                {clinicAddress?.address && <div>Address: {clinicAddress?.address}</div>}
                {clinicAddress?.state && <div>State: {clinicAddress?.state}</div>}
                {clinicAddress?.city && <div>City: {clinicAddress?.city}</div>}
                {clinicAddress?.pincode && <div>PinCode: {clinicAddress?.pincode}</div>}
              </div>
            }
          </>
      }
    </div>
  )
}

export default RegisteredDocInfo