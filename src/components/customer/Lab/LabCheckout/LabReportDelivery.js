import React, { useContext, useEffect } from 'react';
import { LocalityContext } from '../../../Contexts/UserContext';
import Validate from '../../../../helpers/Validate';
import LabHomeDelivery from '../../../StaticUI/LabHomeDelivery';

const LabReportDelivery = (props) => {

    const validate = Validate();
    const { labLocality } = useContext(LocalityContext);

    useEffect(() => {
        props.jumpToTab('deliveryType');
        if(props.reportDeliveryType === 'H') {
            props.addReportDeliveryAddress('H', props.customerAddressFormData);
        } else {
            props.addReportDeliveryAddress('E');
        }
    },[]);

    const handleChange = (e) => {
        if (e.target.id == "homeDelivery") {
            props.setReportDeliveryType('H');
            props.addReportDeliveryAddress('H', props.customerAddressFormData);
        } else {
            props.setReportDeliveryType('E');
            props.addReportDeliveryAddress('E');
        }
    }

    return (
        <>
            <div id='deliveryType' className='scrolling-tabs p-12  tab-pane-height'>
                <label className='d-block pb-0 font-weight-bold custom-fieldset mb-2'>Select Report Delivery Type</label>
                <div class="form-check form-check-inline">
                    <label class="form-check-label" for="emailAndPrint">Send Email And Print Report at collection center</label>
                    <input class="form-check-input" type="radio" name="delivery" id="emailAndPrint" value="option1" onChange={(e) => handleChange(e)} checked={props.reportDeliveryType != 'H'} />
                    <p className='text-secondary font-12 mb-0'>Note: The report will be sent via email at free of cost and also can be collected at walkin center at free of cost.</p>
                </div>
                {!(validate.isEmpty(labLocality) || labLocality.homeReportDeliveryAllowed != 'Y' || labLocality.reportDeliveryCharges == 0) && <div class="form-check form-check-inline">
                    <label class="form-check-label" for="homeDelivery">Home Delivery</label>
                    <input class="form-check-input" type="radio" name="delivery" id="homeDelivery" value="option2" onChange={(e) => handleChange(e)} checked={props.reportDeliveryType == 'H'} />
                    {(validate.isEmpty(labLocality) || labLocality.homeReportDeliveryAllowed == 'Y' || labLocality.reportDeliveryCharges > 0) && <p className='text-secondary font-12 mb-0'>Note: Report Delivery charges {labLocality.reportDeliveryCharges}/- extra for home delivery </p>}
                </div>}
                {props.reportDeliveryType == 'H' && <>
                    <p className='custom-fieldset mt-3 mb-2'>Report Delivery Address (same as home collection address)</p>
                    <LabHomeDelivery customerAddressFormData={props.customerAddressFormData} addReportDeliveryAddress={props.addReportDeliveryAddress} setCustomerAddressFormData={props.setCustomerAddressFormData} isForReportDelivery tabId={props.tabId} reportDeliveryType={props.reportDeliveryType}/>
                </>}
            </div>
        </>
    );
}

export default LabReportDelivery;