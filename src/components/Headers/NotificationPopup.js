import React, { useState } from 'react'
import { Collapse, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
const NotificationPopup = (props) => {
    const [transition, ControlTransition] = useState(props.filterModalOpen)
    const handleTransition = (from) => {
        if(from == 'close') {
            ControlTransition(!transition)
            const timeout = setTimeout(() => {
                props.NotificationModal()
              }, 500);
          
             return () => clearTimeout(timeout);
        }
    }
    const CloseButton = <button type="button" onClick={()=>{handleTransition("close")}} className="bg-white border-0" data-dismiss="modal" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <rect fill="none" width="24" height="24" />
    <path d="M20.76,19.55l-7.58-7.56,7.56-7.56a.846.846,0,0,0-.04-1.18.822.822,0,0,0-1.13,0L12,10.81,4.44,3.24A.827.827,0,0,0,3.27,4.41l7.56,7.58L3.27,19.55a.835.835,0,0,0,1.14,1.22l.04-.04L12,13.17l7.56,7.56a.833.833,0,0,0,1.17,0h0a.821.821,0,0,0,.04-1.16A.031.031,0,0,0,20.76,19.55Z" fill="#b9b9b9" />
  </svg></button>
  return (
      <Modal className={`modal-dialog-right notification doctor-filter-modal`} modalClassName={transition ? "fadeInRight" : "fadeOutRight"} isOpen={props.filterModalOpen} toggle={() => { handleTransition("close") }}>
          <ModalHeader toggle={props.NotificationModal} close={CloseButton}>
              Notifications
          </ModalHeader>
          <ModalBody className='p-3'>
                {[1,2,3,4].map(()=>{
                    return(
                        <React.Fragment>
                            <div class="col mb-3 mb-0">
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <h5 class="card-title">Special title treatment</h5>
                                        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                        <a href="#" class="btn btn-link ps-0">Go somewhere</a>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                })}
          </ModalBody>
      </Modal>
  )
}

export default NotificationPopup