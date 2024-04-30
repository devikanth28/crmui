import React, { useContext, useState } from 'react';
import { Button, Modal, ModalTitle } from "react-bootstrap";
import Validate from '../../helpers/Validate';
import { AlertContext } from '../Contexts/UserContext';
import LabOrderService from '../../services/LabOrder/LabOrderService';
import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import { RECORD_TYPE, unclaimClaimedOrder } from '../../helpers/HelperMethods';
import DynamicGridHeight from '../Common/DynamicGridHeight';
import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import { isResponseSuccess } from '../../helpers/CommonHelper';
import { ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
const CancelOrder = (props) => {
  let orderInfo = props.orderInfo;
  const [isModalOpen, setModalOpen] = useState(props.showCancelModal);
  const [cancelReason, setCancelReason] = useState(undefined);
  const { setStackedToastContent } = useContext(AlertContext);
  const [isLoading, setLoading] = useState(false);
  const [isCancelProfileItems, setIsCancelProfileItems] = useState(Validate().isNotEmpty(props.dataGrid))
  const toggle = () => {
    setModalOpen(!isModalOpen);
    props.setShowCancelModal(undefined);
    props.setDisableMode(false);
  }

  const CloseButton = <Button variant="" className="btn-close icon-hover" type="button" onClick={toggle}></Button>

  // const setPropsToModal=()=>{
  //   if(Validate().isEmpty(cancelReason)){
  //     setStackedToastContent({toastMessage:"Please Enter Cancel Reason"});
  //     return;
  //   }
  //   props.setShowCancelModal(!props.showCancelModal);
  //   props.setPropsToDeleteModal(cancelReason);
  // }

  const canceLabOrder = async () => {
    if(isCancelProfileItems){
      setIsCancelProfileItems(!isCancelProfileItems);
      props.setDisableMode(true);
      return;
    }
    
    if (Validate().isEmpty(cancelReason)) {
      setStackedToastContent({ toastMessage: "Please Enter Reason To Cancel" });
      return;
    }
    let requestParameters = {
      orderId: props.orderId,
      reason: cancelReason,
      selectedTests: props.cancelOrderIds
    }
    if (props.onlyTestCancellation) {
      requestParameters = { ...requestParameters, onlyTestCancellation: "Y" }
    }
    if (props.cancelProfileTests) {
      props.setShowCancelModal(!props.showCancelModal);
      // props.setPropsToDeleteModal(cancelReason);
      props.setDisableMode(true);
      setLoading(true);
      LabOrderService().cancelTestOrderItem(requestParameters).then((response) => {
        if (isResponseSuccess(response)) {
          setStackedToastContent({ toastMessage: "Tests cancelled Successfully!" })
          if (props.setCancelItemselectedRows) {
            props.setCancelItemselectedRows([]);
          }
          if (Validate().isNotEmpty(props.onSubmitClick)) {
            props.onSubmitClick(props.orderId);
          } props.setReloadPage(!props.reloadPage);
          props.setShowActionForm(undefined);
        } else if (Validate().isNotEmpty(response.message)) {
          setStackedToastContent({ toastMessage: response.message })
        } else {
          setStackedToastContent({ toastMessage: "Unable to cancel test, Please try again" })
          props.setShowActionForm(undefined);
        }
        props.setDisableMode(false);
        setLoading(false);
      }).catch((err) => {
        console.log(err)
        setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" })
        props.setDisableMode(false);
        setLoading(false);
      });
    } else {
      props.setDisableMode(true);
      setLoading(true);
      await LabOrderService().cancelLabOrder(requestParameters).then((response) => {
        if ("SUCCESS" === response.statusCode) {
          setStackedToastContent({ toastMessage: "Order cancelled Successfully!" })
          unclaimClaimedOrder(props.orderId,RECORD_TYPE.LAB_ORDER);
          if (Validate().isNotEmpty(props.onSubmitClick)) {
            props.onSubmitClick(props.orderId);
          }
          if (props.from != "LAB_ORDER_PAGE") {
            props.setReloadPage(!props.reloadPage);
            props.setShowActionForm(undefined);
          }
          else {
            props.setShowCancelModal(!props.showCancelModal);
          }
        } else {
          setStackedToastContent({ toastMessage: "Unable to cancel order. Please cancel individual item" });
          if (props.from != "LAB_ORDER_PAGE") {
            props.setShowActionForm(undefined);
          }
        } 
        props.setDisableMode(false)
        setLoading(false)
        // helpers.enableElement("submitLabCancelForm")
      }).catch((err) => {
        console.log(err);
        setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" })
        props.setDisableMode(false)
        // helpers.enableElement("submitLabCancelForm")
      });
    }
  }
  console.log("props.dataGrid",props.dataGrid)
  return (
    <React.Fragment>
      {isModalOpen && <Modal
        show={true}
        backdrop="static"
        onHide={() => { toggle() }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >   <ModalHeader className='p-12' close={CloseButton}>
          <ModalTitle className='h6'>{isCancelProfileItems? props.cancelItemsInfo?.title : orderInfo?.title}</ModalTitle>
        </ModalHeader>
        <ModalBody className='pt-0'>
        {isCancelProfileItems ? <DynamicGridHeight metaData={props.dataGrid} dataSet={props.testProfileSet} className="card"> 
                            <CommonDataGrid {...props.dataGrid} dataSet={props.testProfileSet}
                                callBackMap={props.checkboxAction}
                                selectedRows={props.cancelItemselectedRows}
                                onRowSelectionCallback={props.setCancelItemselectedRows} 
                            />
          </DynamicGridHeight> : <>
            <div className="row">
              <div className='col-5 p-0'>
                <div className='form-floating'>
                  <input aria-label="text input" type="text" id="OrderId" class="form-control-plaintext" value={orderInfo?.orderId} />
                  <label for="OrderId">Order Id</label>
                </div>
              </div>
              {
                orderInfo?.scheduledSlot &&
                <div className='col-5'>
                  <div className='form-floating'>
                    <input aria-label="text input" type="text" id="ScheduledSlot" class="form-control-plaintext" value={orderInfo?.scheduledSlot} />
                    <label for="ScheduledSlot">Scheduled Slot</label>
                  </div>
                </div>}
            </div>
            <textarea maxLength="200" className="form-control" id="remarks" rows="4" placeholder={orderInfo?.placeholder} onChange={(e) => setCancelReason(e.target.value)} autoFocus={true} value={orderInfo?.remarks} tabIndex={1}></textarea></> }
           
        </ModalBody>
        <ModalFooter className="p-2 justify-content-center">
          <div>
            <button type="button" tabindex="3" class="px-4 me-3 brand-secondary btn-sm btn" onClick={toggle}>Close</button>
            {/* {isLoading ? <CustomSpinners spinnerText={orderInfo?.buttonText} className={" spinner-position"} innerClass={"invisible"}/> : <button type="button" tabindex="2" class="px-4 btn-sm btn btn-brand" onClick={()=>canceLabOrder()}>{orderInfo?.buttonText}</button>} */}
            <Button variant="brand" className="btn-sm" onClick={() => canceLabOrder()}>{isLoading ? <CustomSpinners spinnerText={orderInfo?.buttonText} className={"spinner-position"} innerClass={"invisible"} /> : isCancelProfileItems ? props.cancelItemsInfo?.buttonText : orderInfo?.buttonText}</Button>
          </div>
        </ModalFooter>
      </Modal>}
    </React.Fragment>
  )
}

export default CancelOrder