import React from 'react';

const UserName = (props) => {
  const customerDataObject=props.customerObject
  return (
    <div className='inblock' style={{textAlign: 'right' }}>
        <a>
        { customerDataObject.customerStatus.status !== 'A' &&  
        <strong style={{ color:'red' }}>INACTIVE </strong>}
        <strong>{customerDataObject.firstName} &nbsp; {customerDataObject.lastName}</strong><br/>
        <div style={{display:' flex', flexDirection: 'row'}}>{customerDataObject.customerID}
        {customerDataObject.webLoginID && (<span>-{customerDataObject.webLoginID}</span>)}</div>
        </a> 
    </div>
  )
}
export default UserName;
