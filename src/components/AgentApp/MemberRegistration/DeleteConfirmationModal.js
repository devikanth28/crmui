import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const DeleteConfirmationModal = ({ isOpen, toggle, onDelete }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Confirmation</ModalHeader>
      <ModalBody>
        Are you sure you want to delete?
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onDelete}>Delete</Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteConfirmationModal;
