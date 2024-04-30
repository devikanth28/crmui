import React from 'react'

const MemberShipDetails = () => {
  return (
      <div className='custom-border-bottom-dashed'>
      <span className='text-secondary font-12 mb-2'>Membership Details</span>
      <p className='mb-0 font-14'>Helath Care Plan</p>
        <p className='font-12'><span className='text-secondary'>Start -</span> Sep 21, 2022 <span className='text-secondary'>| Expiry -</span> Sep 21, 2023</p>
        <p className='text-secondary font-12 mb-1'>Members Added</p>
        <p className='mb-1 font-14'>Sameer Singh - <span className='text-secondary'> 32 years / Male</span></p>
        <p className='font-14'>Ranjeet Rajan - <span className='text-secondary'> 42 years / Male</span></p>
      </div>
  )
}

export default MemberShipDetails;
