import React, { useState } from "react";

import useRole from "../../../hooks/useRole";
import { Roles } from "../../../constants/RoleConstants";
import Validate from "../../../helpers/Validate";
import { Button, Modal } from "react-bootstrap";
import { UncontrolledTooltip } from "reactstrap";
import dateFormat from 'dateformat';
import edit_icon from '../../../images/edit_icon.svg'
import BioUserForm from "./BioUserForm";



const BioUserDetails = ({ hasSubscribedMedplusAdvantage, customerData, getCustomerInfo, props }) => {


    const { customerInfo, activeCustomerId, kycStatus, activeCustomerMobile, activeCustomerType, activeCustomerMerged } = customerData;

    const [showCustomerEditForm, setShowCustomerEditForm] = useState(false);
    const [hasCustomerCreateRole, hasCrmMediAssisitRole] = useRole([Roles.ROLE_CRM_CUSTOMER_CREATE, Roles.ROLE_CRM_MEDI_ASSISIT]);

    const hasCustomerEditRole = () => {
        return hasCustomerCreateRole && !hasCrmMediAssisitRole && validate.isNotEmpty(customerInfo) &&
            validate.isNotEmpty(customerInfo.accountStatus) && customerInfo.accountStatus === "ACTIVE" &&
            customerInfo.customerType !== 'KYNZO';
    }


    const validate = Validate();

    return (
        <React.Fragment>
            {customerInfo && validate.isNotEmpty(customerInfo.customerID) && <div className={`col ${Validate().isNotEmpty(props?.needRule) && props?.needRule == true ? 'custom-border-bottom-dashed' : ""}`}>
                <div className="d-flex justify-content-between mb-2 align-items-center">
                <p className='align-items-center d-flex font-12 mb-0 text-secondary'>Customer Details</p>
                {hasCustomerEditRole() && !showCustomerEditForm &&
                <div>
                    <Button variant=' ' className='rounded-5 icon-hover btn-link' id="editCustomerDetails" onClick={() => { setShowCustomerEditForm(prev => !prev) }}><img src={edit_icon} alt="edit Customer details" /></Button>
                    <UncontrolledTooltip placement="bottom" target="editCustomerDetails">
                        Edit Customer Details
                    </UncontrolledTooltip>
                </div>
            }
                </div>
                <div className='align-items-start d-flex justify-content-between'>
                    {validate.isNotEmpty(customerInfo.firstName) && validate.isNotEmpty(customerInfo.lastName) && <div>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>Name </p>
                        <div className='d-flex align-items-center gap-2'>
                            <h6 className='font-14 mb-0'>{customerInfo.firstName} {customerInfo.lastName}</h6>
                            {hasSubscribedMedplusAdvantage && <div>
                                <span id="Approved" class="badge-approved badge rounded-pill">MA Member</span>
                            </div>}
                        </div>
                    </div>}
                </div>
                <div className='row g-3 my-0'>
                    {validate.isNotEmpty(customerInfo.dateOfBirth) && <div className='col-12 col-xl-6'>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>Date of Birth </p>
                        <h6 className='font-14'>{new Date(customerInfo.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</h6>
                    </div>}
                    {validate.isNotEmpty(customerInfo.gender) && (customerInfo.gender == "F" || customerInfo.gender == "M") && validate.isNotEmpty(customerInfo.age) && <div className='col-12 col-xl-6'>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>Gender / Age</p>
                        <h6 className='font-14'>{customerInfo.gender == "F" ? <>Female</> : customerInfo.gender == "M" ? <>Male</> : <></>} / {customerInfo.age} Years</h6>
                    </div>}
                </div>
                <div className='row g-3 my-0'>
                    <div className='col-12 col-xl-6'>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>Customer ID</p>
                        <h6 className='font-14'>{customerInfo.customerID}</h6>
                    </div>
                    <div className='col-12 col-xl-6'>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>Ph.No</p>
                        <h6 className='font-14'><a href="tel:+"{...customerInfo.mobileNumber} title="Contact Customer" className='text-decoration-none'>{customerInfo.mobileNumber}</a></h6>
                    </div>
                    {validate.isNotEmpty(customerInfo.landLine) && <div className='col-12 col-xl-6'>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>LandLine</p>
                        <h6 className='font-14'>{customerInfo.landLine}</h6>
                    </div>}
                    {validate.isNotEmpty(customerInfo.emailId) && <div className='col-12 col-xl-6'>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>Email</p>
                        <h6 className='font-14'><a href="javascript:void(0)" onClick={() => window.open(`mailto:${customerInfo.emailId}`)} title={`Send an email to ${customerInfo.emailId}`} className="text-decoration-none">{customerInfo.emailId}</a></h6>
                    </div>}
                    {validate.isNotEmpty(customerInfo.dateCreated) && <div className='col-12 col-xl-6'>
                        <p className='align-items-center d-flex font-12 mb-0 text-secondary'>Date Created</p>
                        <h6 className='font-14'>{dateFormat(customerInfo.dateCreated,'yyyy-mm-dd')}</h6>
                    </div>}
                </div>
                {!hasCrmMediAssisitRole && validate.isNotEmpty(customerInfo.receiveUpdates) && customerInfo.receiveUpdates == '1' &&
                    <p className='align-items-center d-flex font-12 text-secondary mb-2 mt-2'>Note: Customer agreed to receive promotional mail and messages</p>
                }
            </div>
            }
            {/* {showCustomerEditForm && customerInfo && <Modal
                show={true}
                backdrop="static"
                onHide={() => { setShowCustomerEditForm(false) }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            > */}
                <BioUserForm showCustomerEditForm={showCustomerEditForm}  getCustomerInfo={getCustomerInfo} customerData={customerData} setShowCustomerEditForm={setShowCustomerEditForm} />
            {/* </Modal>} */}
            
        </React.Fragment>
    );
}
export default BioUserDetails;