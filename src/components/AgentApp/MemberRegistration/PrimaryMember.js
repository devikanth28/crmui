import React from 'react'
import dateFormat from 'dateformat'
import Validate from '../../../helpers/Validate'
const PrimaryMember = ({memberInfo, topCustomerMail, showEmailInputContent}) => {
    const validate = Validate()
  return (
    <div>
    <label class="d-block pb-0 custom-fieldset">Primary Member</label>
    <div class="d-flex flex-wrap gap-2 mb-3">
       {memberInfo.patientName &&  <div class=" col-lg-2 col-12">
            <label class="font-12 text-secondary">Patient Name</label>
            <p class="mb-0 font-14">{memberInfo?.patientName}</p>
        </div> }
        
        {memberInfo?. gender && <div class="col-lg-1 col-5">
            <label class="font-12 text-secondary">Gender</label>
            <p class="mb-0 font-14">{"F" === memberInfo.gender ? "Female" : "M" === memberInfo.gender ? "Male" : "Other"}</p>
        </div>}

        {memberInfo?.dob && <div class="col-lg-1 col-6">
            <label class="font-12 text-secondary">Date Of Birth</label>
            <p class="mb-0 font-14">{dateFormat(new Date(memberInfo?.dob.split("/")[2], memberInfo?.dob.split("/")[1] - 1, memberInfo?.dob.split("/")[0]), "dd mmm, yyyy")}</p>
        </div>}

       <div class="col-lg-1 col">
           {validate.isNotEmpty(topCustomerMail)? <><label class="font-12 text-secondary">Email</label>
            <p class="mb-0 font-14">{memberInfo.email}</p></> :showEmailInputContent}
            
        </div>
    </div>
</div>
  )
}

export default PrimaryMember