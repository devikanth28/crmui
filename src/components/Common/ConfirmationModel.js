import React from 'react';
import { Button, ModalTitle } from "react-bootstrap";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Validate from '../../helpers/Validate';

const CommonConfirmationModal = (props) => {
    const CloseButton = <Button variant="" className="btn-close icon-hover" type="button" onClick={() => setConfirmationPopOver(!isConfirmationPopOver)}></Button>
    const { isConfirmationPopOver, setConfirmationPopOver, message, buttonText, onSubmit, small, rawHtml } = props;

    const parsedHtml = { __html: message };

    return (
        <React.Fragment>
            <Modal className={(props.justcenter) ? "modal-dialog-centered" : small ? "modal-dialog-centered modal-lg" : " modal-dialog-centered modal-sm"} isOpen={isConfirmationPopOver}>
                {props.headerText && <ModalHeader className='p-12' close={CloseButton}>
                    <ModalTitle className='h6'>{props.headerText}</ModalTitle>
                </ModalHeader>}
                <ModalBody className='p-2'>
                {rawHtml ? <div dangerouslySetInnerHTML={parsedHtml} /> : <div>{message}</div>}
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center p-2">
                        <Button variant=" " size="sm" className="px-4 me-3 brand-secondary" onClick={() => setConfirmationPopOver(!isConfirmationPopOver)}>
                            Close
                        </Button>
                        {Validate().isNotEmpty(buttonText) && <Button variant="brand" size="sm" className="px-4" onClick={() => { onSubmit(); setConfirmationPopOver(!isConfirmationPopOver) }} disabled ={props.disableMode}>
                            {buttonText}
                        </Button>}
                </ModalFooter>
            </Modal>
        </React.Fragment>
    )
}

export default CommonConfirmationModal;