import React from 'react';
import CurrencyFormatter from '../../../Common/CurrencyFormatter';
import Validate from '../../../../helpers/Validate';
import useRole from '../../../../hooks/useRole';
import { Roles } from '../../../../constants/RoleConstants';

function TestDetailSummary(props) {
    
    const testDetails = props.testDetails;
    const validate = Validate();
    const [isFrontOfficeOrderCreate] = useRole([Roles.ROLE_CRM_LAB_FRONT_OFFICE_ORDER_CREATE]);
    
    const getServiceOptionDisplayName = (serviceOption) => {
        let serviceOptions = {
            "HOME_COLLECTION_AND_WALKIN": "Home and Walk-In",
            "HOME_COLLECTION": "Home Collection",
            "WALKIN": "Walk-In",
            "TELE_MEDICINE": "Tele-Medicine"
        }
        return serviceOptions[serviceOption];
    }
    
    return (
        <div class="d-flex flex-wrap row gy-2">
            <div className="col-12 col-lg-4">
                <label className="font-12 text-secondary">Test Code / Test Name</label>
                <p className="mb-0 font-14 font-weight-bold">{testDetails.code} - {testDetails.name}</p>
            </div>
            {testDetails.alternateKeywords && <div className="col-6 col-lg-4">
                <label className="font-12 text-secondary">Sub Name</label>
                <p className="mb-0 font-14 font-weight-bold">{testDetails.alternateKeywords.join(", ")}</p>
            </div>}
            <div className="col-6 col-lg-4">
                <label className="font-12 text-secondary">Sample Collection Type</label>
                <p className="mb-0 font-14 font-weight-bold">{getServiceOptionDisplayName(testDetails.serviceOption)}</p>
            </div>
            <div className="col-6 col-lg-4">
                <label className="font-12 text-secondary">MRP</label>
                <p className="mb-0 font-14 font-weight-bold"><CurrencyFormatter data={testDetails.mrp} decimalPlaces={2} /></p>
            </div>
            {testDetails.mrp && testDetails.price && (testDetails.price != testDetails.mrp) &&<div className="col-6 col-lg-4">
                <label className="font-12 text-secondary">Price</label>
                <p className="mb-0 font-14 font-weight-bold"><CurrencyFormatter data={testDetails.price} decimalPlaces={2} /></p>
            </div>}
            {testDetails.subscriptionPrice && <div className="col-6 col-lg-4">
                <label className="font-12 text-secondary">MA Price</label>
                <p className="mb-0 font-14 font-weight-bold"><CurrencyFormatter data={testDetails.subscriptionPrice} decimalPlaces={2} /></p>
            </div>}
            {testDetails.sampleTypeName && <div className="col-6 col-lg-4">
                <label className="font-12 text-secondary">Sample Type</label>
                <p className="mb-0 font-14 font-weight-bold">{testDetails.sampleTypeName}</p>
            </div>}
            {testDetails.departmentName && <div className="col-6 col-lg-4">
                <label className="font-12 text-secondary">Department Name</label>
                <p className="mb-0 font-14 font-weight-bold">{testDetails.departmentName}</p>
            </div>}
            {(testDetails.coolOfPeriod && testDetails.coolOfPeriod != 0) && <div className="col-6 col-lg-4">
                <label className="font-12 text-secondary">Cool Of Period</label>
                <p className="mb-0 font-14 font-weight-bold">{testDetails.coolOfPeriod}</p>
            </div>}
            {testDetails.sampleTransportCondition && <div className="col-6 col-lg-4">
                <label className="font-12 text-secondary">Sample Transport Condition Type</label>
                <p className="mb-0 font-14 font-weight-bold">{testDetails.sampleTransportCondition}</p>
            </div>}
            {((validate.isNotEmpty(testDetails.reportDeliveryTime) && testDetails.reportDeliveryTime > 0) || (!testDetails.codallowed && !!isFrontOfficeOrderCreate)) && <div>
                <span><strong>Note: </strong></span>
                {(validate.isNotEmpty(testDetails.reportDeliveryTime) && testDetails.reportDeliveryTime > 0) && <span> Reports available in <strong>{testDetails.reportDeliveryTime}</strong> hours after sample collection.</span>}
                {(!testDetails.codallowed && !isFrontOfficeOrderCreate) && <span> Cash on collection is not available for this test.</span>}
                {validate.isNotEmpty(testDetails.genderSpecification) && <span> Booking allowed for {testDetails.genderSpecification} patients only</span>}
            </div>}
            {(validate.isNotEmpty(testDetails.processingSourceType) && testDetails.processingSourceType =='OUTSOURCED') && <div>
                <span id='outsourceType'><strong>Outsourced Test </strong></span>
            </div>}
        </div>
    );
}

export default TestDetailSummary;