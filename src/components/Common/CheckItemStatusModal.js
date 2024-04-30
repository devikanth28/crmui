import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import React from 'react'
import { Button, ModalTitle } from "react-bootstrap";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import DataGridHelper from '../../helpers/DataGridHelper';
import { getLabStausBadgeColourClass } from '../../helpers/LabOrderHelper';
import Validate from '../../helpers/Validate';
import DynamicGridHeight from './DynamicGridHeight';
const CheckItemStatusModal = (props) => {
    const {isConfirmationPopOver, setConfirmationPopOver, headerText, message} = props
    const checkStatusDatagrid = DataGridHelper().getCheckStatusDataGridObj();
    const CloseButton = <Button variant="" className="btn-close icon-hover" type="button" onClick={() => setConfirmationPopOver(!isConfirmationPopOver)}></Button>

    const orderStatusCallBack = {
        "status": (props) => {
            const { row } = props;
            return <React.Fragment>
                {Validate().isNotEmpty(row?.status) ?
                    <React.Fragment>
                        <span className={`${getLabStausBadgeColourClass(row?.status)} badge rounded-pill`}>{row?.status}</span>
                    </React.Fragment>
                    : "--"
                }
            </React.Fragment>
        }
    }
    const parsedHtml = { __html: message };
  return (
    <div>
        <Modal className={"modal-dialog-centered modal-lg"} isOpen={isConfirmationPopOver}>
                {props.headerText && <ModalHeader className='p-12' close={CloseButton}>
                    <ModalTitle className='h6'>{headerText}</ModalTitle>
                </ModalHeader>}
                <ModalBody>
                {Validate().isEmpty(message) ?
                 <DynamicGridHeight metaData = {checkStatusDatagrid} dataSet={props.checkStatusDataset} id="item-status-grid" className="card">
                     <CommonDataGrid {...checkStatusDatagrid} dataSet={props.checkStatusDataset} callBackMap={orderStatusCallBack}/></DynamicGridHeight> : <div dangerouslySetInnerHTML={parsedHtml} /> }
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center p-2">
                        <Button variant=" " size="sm" className="px-4 brand-secondary" onClick={() => setConfirmationPopOver(!isConfirmationPopOver)}>
                            Close
                        </Button>
                        
                </ModalFooter>
            </Modal>
    </div>
  )
}

export default CheckItemStatusModal