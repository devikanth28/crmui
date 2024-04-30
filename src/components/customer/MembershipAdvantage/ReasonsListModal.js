import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { API_URL, REQUEST_TYPE } from '../../../services/ServiceConstants';
import { Button } from 'react-bootstrap'

const ReasonsListModal = ({ setSelectedReason, setConfirmationPopOver, isConfirmationPopOver, reasons, onSelectReason, selectedReason, isOpen, onSubmit, helpers }) => {
    const CloseButton = <Button variant=" " className="align-self-center icon-hover rounded-5 btn-link" type="button" onClick={() =>{ setSelectedReason(false), setConfirmationPopOver(!isConfirmationPopOver)}}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <rect fill="none" width="24" height="24" />
      <path d="M20.76,19.55l-7.58-7.56,7.56-7.56a.846.846,0,0,0-.04-1.18.822.822,0,0,0-1.13,0L12,10.81,4.44,3.24A.827.827,0,0,0,3.27,4.41l7.56,7.58L3.27,19.55a.835.835,0,0,0,1.14,1.22l.04-.04L12,13.17l7.56,7.56a.833.833,0,0,0,1.17,0h0a.821.821,0,0,0,.04-1.16A.031.031,0,0,0,20.76,19.55Z" fill="#b9b9b9" />
    </svg>
  </Button>
   const observersMap = {
    "cancelReason" : [['select', (e)=> {console.log(e),setSelectedReason(e[0].target.value[0])}]],
}
  return (
    <Modal className="modal-dialog-centered modal-lg" isOpen={isConfirmationPopOver}>
      <ModalHeader className='p-2' close={CloseButton}>
        Select a reason for cancellation
      </ModalHeader>
      <ModalBody>
        <DynamicForm requestMethod={REQUEST_TYPE.GET} requestUrl={`${API_URL}getOrderCancelReasons`} helpers={helpers} observers={observersMap}/>
      </ModalBody>
      <ModalFooter>
        <Button variant=" " className="px-4 me-3 brand-secondary" onClick={() => {(setSelectedReason(false), setConfirmationPopOver(!isConfirmationPopOver) )}}>
          Close
        </Button>
        <Button variant=" " className='btn-brand' disabled={!selectedReason} onClick={() =>{onSubmit(); setConfirmationPopOver(!isConfirmationPopOver)} }>
          Cancel Order
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default withFormHoc(ReasonsListModal);
