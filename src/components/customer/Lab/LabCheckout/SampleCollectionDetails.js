import React from 'react';
import Validate from '../../../../helpers/Validate';
import dateFormat from 'dateformat'

function SampleCollectionDetails(props) {

    const validate = Validate();
    const slotDetails = props.slotDetails;

    if (validate.isEmpty(props.homeAddress) && validate.isEmpty(props.labAddress)) {
        return <></>
    }

    const getAddressForOrder = () => {
        if (props.homeAddress) {
            return (
                <>
                    <p className='font-weight-bold mb-0'>{props.homeAddress.firstName}</p>
                    <p className='font-14 mb-2 text-secondary'>{props.homeAddress.addressLine1 + ", " + props.homeAddress.addressLine2 + ", " + props.homeAddress.city + ", " + props.homeAddress.state + ", " + props.homeAddress.pincode + ", " + props.homeAddress.mobileNo}</p>
                </>
            )
        }
        return (
            <>
                <p className='font-weight-bold mb-0'>{props.labAddress.name}[{props.labAddress.storeId}]</p>
                <p className='font-14 mb-2 text-secondary'>{props.labAddress.address}</p>
            </>
        )
    }

    return (

        <div className='p-12'>
            <label className="custom-fieldset mb-2">Collection Details</label>
            <div>
                <p className='text-secondary font-14 mb-1'>Colection type</p>
                <p className=''>{validate.isNotEmpty(props.homeAddress) ? "Home Sample Collection" : "Diagnostic Centre Walk-in"}</p>
            </div>
            {slotDetails && <div>
                <p className='mb-1 text-secondary font-14'>Scheduled Slot</p>
                <p className='font-weight-bold'>{dateFormat(slotDetails.displayDate, "mmm dd,yyyy")} [{slotDetails.labTimeSlot.displayName}]</p>
            </div>}
            <p className='mb-1 text-secondary font-14'>Address</p>
            {getAddressForOrder()}
            
        </div>
        

    );
}

export default SampleCollectionDetails;