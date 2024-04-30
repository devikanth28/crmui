import React, { useState } from 'react'
import { Button, Modal, ModalTitle } from "react-bootstrap";
import OrderActionForms from './OrderActionForms';
import { ModalBody, ModalHeader } from 'reactstrap';

const MartOrderCancelForm = (props) => {
    const [isModalOpen, setModalOpen] = useState(props.showCancelModal);
    const toggle = () => {
        setModalOpen(!isModalOpen);
        props.setShowCancelModal(!props.showCancelModal);
      }
      const CloseButton = <Button variant="" className="btn-close icon-hover" type="button" onClick={toggle}></Button>
  return (
   <React.Fragment>
       {isModalOpen && <Modal
        show={true}
        backdrop="static"
        onHide={() => { toggle() }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
            <ModalHeader className='p-12' close={CloseButton}>
          <ModalTitle className='h6'>{props.title}</ModalTitle>
        </ModalHeader>
        <ModalBody className='p-0'>
          <div className="row">
            <div className='col-5'>
              <div className='form-floating'>
                <input aria-label="text input" type="text" id="OrderId" class="form-control-plaintext" value={props.orderInfo.displayOrderId} />
                <label for="OrderId">Order Id</label>
              </div>
            </div>
          </div>
          {/* <textarea maxLength="200" className="form-control" id="remarks" rows="4" placeholder={"reasons"} autoFocus={true} value={"remarks"} tabIndex={1}></textarea> */}
          <OrderActionForms setActionInProgress={props.setActionInProgress} actionFormToRender={props.actionFormToRender} orderCancelReasonType={props.orderCancelReasonType} orderInfo={props.orderInfo} mobileNo={props.mobileNo} getOrderDetails={props.getOrderDetails} closeActionForms={props.closeActionForms} setDisableMode={props.setDisableMode} disableMode={props.disableMode}/>
        </ModalBody>
        </Modal>}
      
   </React.Fragment>
  )
}

export default MartOrderCancelForm