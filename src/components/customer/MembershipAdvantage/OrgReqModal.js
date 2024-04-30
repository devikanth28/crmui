import DynamicForm, { withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Validate from "../../../helpers/Validate";
import MembershipService from "../../../services/Membership/MembershipService";
import { API_URL, REQUEST_TYPE } from '../../../services/ServiceConstants';
import ButtonWithSpinner from "../../Common/ButtonWithSpinner";
import { AlertContext, CustomerContext } from "../../Contexts/UserContext";
const OrgReqModal = ({ helpers, isModalOpen, ...props }) => {

    const { customer, customerId } = useContext(CustomerContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const validate = Validate();
    const [sendRequestLoader, setSendRequestLoader] = useState(false);

    const registerCompany = async () => {
        setSendRequestLoader(true);
        const fieldValues = helpers.validateAndCollectValuesForSubmit('getOrgRegisterForm');
        if (validate.isEmpty(fieldValues)) {
            setSendRequestLoader(false);
            return;
        }
        const organizationRequest = {
            customerId: fieldValues.customerId,
            customerMobile: fieldValues.customerMobile,
            customerName: fieldValues.customerName,
            hrMobile: fieldValues.companyHrMobile,
            hrName: fieldValues.companyHrName,
            organizationName: fieldValues.companyName
        }

        const res = await MembershipService().registerOrgReq(organizationRequest);
        if (validate.isNotEmpty(res) && validate.isNotEmpty(res.statusCode) && 'SUCCESS' == res.statusCode) {
            setStackedToastContent({ toastMessage: 'Request Submitted' });
            props.setOrgReqModal(false)
            setSendRequestLoader(false);
        }
        else {
            setStackedToastContent({ toastMessage: validate.isNotEmpty(res.message) ? res.message : "Error while registering Organization Request." });
            setSendRequestLoader(false);
        }
    }

    return (
        <Modal className={"modal-dialog-centered modal-lg"} isOpen={isModalOpen}>

            {<ModalHeader className='d-flex justify-content-between modal-header p-2' close={<Button variant="link" className="align-self-center icon-hover rounded-5" type="button" onClick={() => props.setOrgReqModal(!isModalOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <rect fill="none" width="24" height="24" />
                    <path d="M20.76,19.55l-7.58-7.56,7.56-7.56a.846.846,0,0,0-.04-1.18.822.822,0,0,0-1.13,0L12,10.81,4.44,3.24A.827.827,0,0,0,3.27,4.41l7.56,7.58L3.27,19.55a.835.835,0,0,0,1.14,1.22l.04-.04L12,13.17l7.56,7.56a.833.833,0,0,0,1.17,0h0a.821.821,0,0,0,.04-1.16A.031.031,0,0,0,20.76,19.55Z" fill="#b9b9b9" />
                </svg>
            </Button>}>
                Provide Your Company Details
            </ModalHeader>}
            <ModalBody className='p-2'>
                <DynamicForm requestMethod={REQUEST_TYPE.GET} requestUrl={`${API_URL}getOrgRegisterForm?customerId=${customerId}&customerName=${`${customer.firstName} ${customer.lastName}`}&customerMobile=${customer.mobileNumber}`} helpers={helpers} observers={{}} />
            </ModalBody>
            <ModalFooter className="justify-content-center p-2">
                <div>
                    <Button variant=" " size="sm" className="px-4 me-3 brand-secondary" onClick={() => props.setOrgReqModal(!isModalOpen)}> Close </Button>
                    <ButtonWithSpinner buttonText="Register" size="sm" className="px-4 me-3 brand-secondary" showSpinner={sendRequestLoader} onClick={() => { registerCompany() }} />
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default withFormHoc(OrgReqModal);