import React, { useState } from 'react'
import CustomerDetails from './CustomerDetails'
import edit_icon from '../../images/edit_icon.svg'
import { Button, ButtonGroup } from 'react-bootstrap';
import { UncontrolledTooltip } from "reactstrap";
import MemberShipDetails from './MemberShipDetails';
const CustomerBioDetails = () => {
    const [hasSubscribedMedplusAdvantage, setHasSubscribedMedplusAdvantage] = useState(true);

    return (
        <React.Fragment>
            <div className='d-flex justify-content-between custom-border-bottom-dashed'>
                <CustomerDetails hasSubscribedMedplusAdvantage={hasSubscribedMedplusAdvantage} customerId={"79099888"} mobileNumber={"9987654987"} customerName={"Shiva Krishna Reddy"} emailId={"shiva_reddy@gmail.com"} dob={"Oct 04, 1998"} gender={"M"} />
                <Button variant=' ' className='position-absolute end-0 me-2 rounded-5 icon-hover btn-link' id="editCustomerDetails"><img src={edit_icon} alt="edit Customer details" /></Button>
                <UncontrolledTooltip placement="bottom" target="editCustomerDetails">
                    Edit Customer Details
                </UncontrolledTooltip>
            </div>
            <div className='d-flex justify-content-between custom-border-bottom-dashed my-3'>
                <div>
                    <p className='font-12 text-secondary mb-2'>Shipping Details </p>
                    <p className='mb-0 font-14'>Lodha Building</p>
                    <div className='text-secondary font-14'>
                        <p className='mb-0'> #14, Gachibowli, Hyderabad - 500075  </p>
                        <p>Telengana, India</p>
                    </div>
                </div>
                <Button variant=' ' className='position-absolute end-0 me-2 rounded-5 icon-hover btn-link' id="editShippingDetails"><img src={edit_icon} alt="edit Customer details" /></Button>
                <UncontrolledTooltip placement="bottom" target="editShippingDetails">
                    Edit Shipping Details
                </UncontrolledTooltip>
            </div>
            <MemberShipDetails />
            <div className='d-flex justify-content-between my-3'>
                <div my>
                    <p className='font-12 text-secondary mb-2'>Store Information </p>
                    <form className='input-group mb-3'>
                        <div className='col-8'>
                            <input aria-hidden="true" className="form-control border-radius-right-clear" readonly="" tabindex="-1" value="" placeholder='Enter Store ID' style={{height: "50px"}}  />
                        </div>
                        <div className='input-group-append col-4'>
                            <Button variant=" " if="sendStoreDetails" className='btn-send h-100 w-100'>
                                <span className="visible">Send</span>
                            </Button>
                            <UncontrolledTooltip placement="bottom" target="sendStoreDetails">
                                Send store details to customer
                            </UncontrolledTooltip>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CustomerBioDetails;