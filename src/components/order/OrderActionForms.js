import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import dateFormat from 'dateformat';
import React, { useContext, useEffect, useState } from "react";
import FormHelpers from '../../helpers/FormHelpers';
import { RECORD_TYPE, unclaimClaimedOrder } from '../../helpers/HelperMethods';
import Validate from '../../helpers/Validate';
import LabOrderService from '../../services/LabOrder/LabOrderService';
import OrderService from '../../services/Order/OrderService';
import CommonConfirmationModal from '../Common/ConfirmationModel';
import { AlertContext } from '../Contexts/UserContext';
import { isResponseSuccess } from '../../helpers/CommonHelper';


const OrderActionForms = ({ helpers, actionFormToRender, ...props }) => {

    const orderInfo = props.orderInfo;
    const orderCancelReasonType = props.orderCancelReasonType
    const mobileNo = props.mobileNo

    const [patientDetailsEdited, setPatientDetailsEdited] = useState(false);
    const [addressDetailsEdited, setAddressDetailsEdited] = useState(false);
    const [showConfirmationModal, setConfirmationModal] = useState(false)
    const [confirmationModalData, setConfirmationModalData] = useState({});
    const { setStackedToastContent } = useContext(AlertContext);

    useEffect(() => {
        helpers.clear();
        switch (actionFormToRender) {
            case 'cancelForm':
                helpers.addForm(FormHelpers().getCancelForm(orderCancelReasonType, helpers));
                break;
            case 'labCancelForm':
                helpers.addForm(FormHelpers().getLabCancelForm(helpers));
                break;
            case 'requestCancelForm':
                helpers.addForm(FormHelpers().getCancelForm(orderCancelReasonType, helpers));
                break;
            case 'addPatientDetailsForm':
                helpers.addForm(FormHelpers().getAddPatientDetailsForm(orderInfo,'addPatientDetailsForm'));
                break;
            case 'editOrderDetailsForm':
                if (orderInfo.deliveryType === "S") {
                    helpers.addForm(FormHelpers().getAddPatientDetailsForm(orderInfo,'addPatientDetailsForm'));
                } else {
                    helpers.addForm(FormHelpers().getEditOrderDetailsForm(orderInfo, mobileNo));
                }
                break;
            case 'reScheduleForm':
                helpers.addForm(FormHelpers().getRescheduleDeliveryForm(helpers));
                break;
            default:
                break;
        }
    }, [actionFormToRender])

    const toggleConfirmation = (actionData) => {
        setConfirmationModal(!showConfirmationModal);
        setConfirmationModalData(actionData);
    }

    const cancelOrder = async () => {
        try{
            props.setActionInProgress(true);
            helpers.updateSingleKeyValueIntoField("isLoading", true, "submitCancelForm");
            const cancelFormData = helpers.validateAndCollectValuesForSubmit("cancelForm", false, false, false);
            if (Validate().isEmpty(orderInfo.orderId)) {
                setToastContent({toastMessage:"Empty Order Id"})
                return false;
            }
            let reasonType = cancelFormData.reasonType[0];
            const cancelReason = cancelFormData && cancelFormData.cancelReason;
            if(reasonType && reasonType.toUpperCase()=="OTHERS" && cancelReason){
                reasonType = reasonType + "$" + cancelReason;
            }
            const requestParameters = {
                'orderId': orderInfo.orderId,
                'orderType': orderInfo.orderType,
                'cancelReason': reasonType
            };
            const  isCancelOrder = actionFormToRender =="cancelForm";
            console.log(requestParameters,isCancelOrder);
            const response =  isCancelOrder ? await OrderService().cancelWebOrder(requestParameters) : await OrderService().requestCancelOrder(requestParameters);
                if ("SUCCESS" === response.statusCode) {
                    setToastContent({toastMessage:isCancelOrder ? "Order cancelled Successfully!" : "Order requested for cancel!"});
                   if(isCancelOrder){
                       unclaimClaimedOrder(requestParameters.orderId, RECORD_TYPE.MART_ORDER);
                   }
                    props.getOrderDetails();
                    props.closeActionForms();
                } else if (Validate().isNotEmpty(response.message)) {
                    setToastContent({toastMessage:response.message})
                } else {
                    setToastContent({toastMessage:`Unable to ${cancelOrder ? "" : "request"} cancel order, Please try again`})
                    props.closeActionForms();
                }
        }
        catch(err){
            console.log(err);
        }
        props.setActionInProgress(false);
        helpers.updateSingleKeyValueIntoField("isLoading", false, "submitCancelForm");
    }

    const cancelLabOrder = async () => {
        const cancelFormData = helpers.validateAndCollectValuesForSubmit("labCancelForm", false, false, false);
        helpers.disableElement("submitLabCancelForm")
        if (Validate().isEmpty(props.orderId)) {
            setStackedToastContent({toastMessage:"Empty Order Id"})
            return false;
        }
        const cancelReason = cancelFormData.cancelReason;
        let requestParameters = {
            orderId: props.orderId,
            reason: cancelReason,
            selectedTests: props.cancelOrderIds
        };
        if(props.onlyTestCancellation){
            requestParameters={...requestParameters, onlyTestCancellation:"Y"}
        }
        if(props.cancelProfileTests){ 
            props.setDisableMode(true);
            LabOrderService().cancelTestOrderItem(requestParameters).then((response) => {
                if (isResponseSuccess(response)) {
                    setStackedToastContent({toastMessage:"Order cancelled Successfully!"})
                    props.onSubmitClick(props.orderId);
                    props.setReloadPage(!props.reloadPage);
                    props.setShowActionForm(undefined);
                } else if (Validate().isNotEmpty(response.message)) {
                    setStackedToastContent({toastMessage:response.message})
                } else {
                    setStackedToastContent({toastMessage:"Unable to cancel order, Please try again"})
                    props.setShowActionForm(undefined);
                }
                props.setDisableMode(false);
            }).catch((err) => {
                console.log(err)
                setStackedToastContent({toastMessage:"Unable to process request, Please try again!"})
                props.setDisableMode(false);
            });
        } else{
            props.setDisableMode(true);
            await LabOrderService().cancelLabOrder(requestParameters).then((response) => {
                if ("SUCCESS" === response.statusCode) {
                    setStackedToastContent({toastMessage:"Order cancelled Successfully!"})
                    props.onSubmitClick(props.orderId);
                    props.setReloadPage(!props.reloadPage);
                    props.setShowActionForm(undefined);
                } else if (Validate().isNotEmpty(response.message)) {
                    setStackedToastContent({toastMessage:response.message})
                } else {
                    setStackedToastContent({toastMessage:"Unable to cancel order, Please try again"})
                    props.setShowActionForm(undefined);
                }
                props.setDisableMode(false)
                helpers.enableElement("submitLabCancelForm")
            }, (err) => {
                console.log(err);
                setStackedToastContent({toastMessage:"Unable to process request, Please try again!"})
                props.setDisableMode(false)
                helpers.enableElement("submitLabCancelForm")
            })
        }
        helpers.updateSingleKeyValueIntoField("isLoading", false, "submitLabCancelForm");
    }

    const rescheduleDelivery = async () => {
        props.setActionInProgress(true);
        helpers.updateSingleKeyValueIntoField("isLoading", true, "submitRescheduleDeliveryForm");
        const data = helpers.validateAndCollectValuesForSubmit("rescheduleDeliveryForm", false, false, false);

        console.log(new Date().toISOString());
        let hours = new Date(data.rescheduleDate).getHours();
        if (hours < 9 || hours > 21) {
            setStackedToastContent({toastMessage:"Please select time between 9AM to 9PM"})
            return false;
        }
        if (new Date(data.rescheduleDate) < new Date()) {
            setStackedToastContent({toastMessage:"Please select future date"})
            return false;
        }
        const requestParameters = {
            'orderId': orderInfo.orderId,
            'resheduleDate': dateFormat(data.rescheduleDate, 'yyyy-mm-dd hh:MM:ss'),
            'resheduleReason': data.reasonType[0],
            'resheduleComment': data.comment
        };
        await OrderService().rescheduleDelivery(requestParameters).then(res => {
            if ("SUCCESS" === res.message) {
                setStackedToastContent({toastMessage:"Order resheduled for delivery successfully"})
                props.getOrderDetails();
                props.closeActionForms();
            } else {
                setStackedToastContent({toastMessage:res.message})
            }
        }, err => {
            console.log(err);
        })
        props.setActionInProgress(false);
        helpers.updateSingleKeyValueIntoField("isLoading", false, "submitRescheduleDeliveryForm");
    }

    const setEditedDetailsFlag = (editedDetails) => {
        if (editedDetails === 'patientDetails')
            setPatientDetailsEdited(true);
        if (editedDetails === 'addressDetails')
            setAddressDetailsEdited(true);
    }

    const addPatientDetails = async () => {
        if (patientDetailsEdited) {
            props.setActionInProgress(true);
            helpers.updateSingleKeyValueIntoField("isLoading", true, "submitAddPatientDetailsForm");
            const addPatientDetailsFormData = helpers.validateAndCollectValuesForSubmit("addPatientDetailsForm", false, false, false);
            const requestParameters = {
                'orderId': orderInfo.orderId,
                'patientName': addPatientDetailsFormData.patientName,
                'patientAge': addPatientDetailsFormData.patientAge,
                'doctorName': addPatientDetailsFormData.doctorName
            };
            await OrderService().addPatientDetails(requestParameters).then((response) => {
                if ("SUCCESS" === response.statusCode) {
                    setStackedToastContent({toastMessage:'patient details updated Successfully!'})
                    props.getOrderDetails();
                    props.closeActionForms();
                } else {
                    setStackedToastContent({toastMessage:"Unable to update patient details, Please try again"})
                    props.closeActionForms();
                }
            }, (err) => {
                console.log(err);
            })
            props.setActionInProgress(false);
            helpers.updateSingleKeyValueIntoField("isLoading", false, "submitAddPatientDetailsForm");
        }else{
            setStackedToastContent({toastMessage:"There is no change in the details!"})
        }
    }

    const editOrderDetails = async () => {
        const editOrderDetailsFormData = helpers.validateAndCollectValuesForSubmit("editOrderDetailsForm", false, false, false);
        //editing patient details
        if (patientDetailsEdited) {
            props.setActionInProgress(true);
            helpers.updateSingleKeyValueIntoField("isLoading", true, "submitEditOrderDetailsForm");
            const editPatientRequestParameters = {
                'orderId': orderInfo.orderId,
                'patientName': editOrderDetailsFormData.patientName,
                'patientAge': editOrderDetailsFormData.patientAge,
                'doctorName': editOrderDetailsFormData.doctorName
            };
            await OrderService().addPatientDetails(editPatientRequestParameters).then((response) => {
                if ("SUCCESS" === response.statusCode) {
                    setStackedToastContent({toastMessage:'patient details updated Successfully!'})
                } else {
                    setStackedToastContent({toastMessage:"Unable to update patient details, Please try again"})
                    props.closeActionForms();
                }
            }, (err) => {
                console.log(err);
            })
        }
        //editing shipping address details
        if (addressDetailsEdited) {
            props.setActionInProgress(true);
            helpers.updateSingleKeyValueIntoField("isLoading", true, "submitEditOrderDetailsForm");
            const editAddressRequestParameters = {
                'editOrderId': orderInfo.orderId,
                'editAddress': editOrderDetailsFormData.editAddress,
                'mobileNum': editOrderDetailsFormData.mobileNum,
            };
            await OrderService().updateOrderShippingAddress(editAddressRequestParameters).then((response) => {
                if ("SUCCESS" === response.statusCode) {
                    setStackedToastContent({toastMessage:'address details updated Successfully!'})
                } else {
                    setStackedToastContent({toastMessage:"Unable to update address details, Please try again"})
                    props.closeActionForms();
                }
            }, (err) => {
                console.log(err);
            })
        }

        if(!patientDetailsEdited && !addressDetailsEdited){
            setStackedToastContent({toastMessage:"There is no change in the details!"})
        }else{
            props.getOrderDetails();
        }
        props.setActionInProgress(false);
        helpers.updateSingleKeyValueIntoField("isLoading", false, "submitEditOrderDetailsForm");
    }

    const onReasonTypeChange = (payload)=> {
        if(['cancelForm','requestCancelForm'].indexOf(actionFormToRender)==-1){
            return;
        }
        const [e] = payload;
        const [reasonType] = e.target.value;
        const cancelReason = helpers.getHtmlElementValue("cancelReason");
        if(!reasonType || (reasonType.toUpperCase()=='OTHERS' && !cancelReason)){
            helpers.disableElement("submitCancelForm");
        }
        else{
            helpers.enableElement("submitCancelForm");
        }
        if(reasonType && reasonType.toUpperCase()=='OTHERS'){
            helpers.showElement("cancelReason");
        }
        else{
            helpers.updateValue("","cancelReason");
            helpers.hideElement("cancelReason");
        }
    }

    const onCancelReasonChange = (payload)=> {
        if(['cancelForm','requestCancelForm'].indexOf(actionFormToRender)==-1){
            return;
        }
        const [e] = payload;
        const value = e.target.value;
        if(!value){
            helpers.disableElement("submitCancelForm");
        }
        else{
            helpers.enableElement("submitCancelForm");
        }
    }

    const observersMap = {
        'submitCancelForm': [['click',  cancelOrder]],
        'reasonType' : [['select',onReasonTypeChange]],
        'cancelReason'  :[['change',onCancelReasonChange]],
        'submitLabCancelForm':[['click', cancelLabOrder]],
        'submitAddPatientDetailsForm': [['click', addPatientDetails]],
        'submitEditOrderDetailsForm': [['click', editOrderDetails]],
        'submitRescheduleDeliveryForm': [['click', rescheduleDelivery]],
        'patientName': [['change', () => setEditedDetailsFlag("patientDetails")]],
        'patientAge': [['change', () => setEditedDetailsFlag("patientDetails")]],
        'doctorName': [['change', () => setEditedDetailsFlag("patientDetails")]],
        'editAddress': [['change', () => setEditedDetailsFlag("addressDetails")]],
        'mobileNum': [['change', () => setEditedDetailsFlag("addressDetails")]],
        'closeModal':[['click',()=>props.closeActionForms()]]
    } 

    return <React.Fragment>
        <DynamicForm formJson={null} helpers={helpers} observers={observersMap} />
        {
            showConfirmationModal
            ? <CommonConfirmationModal 
                headerText={confirmationModalData.headerText ? confirmationModalData.headerText : "Order Action"} 
                isConfirmationPopOver={showConfirmationModal} 
                setConfirmationPopOver={setConfirmationModal} 
                message={confirmationModalData.message ? confirmationModalData.message : "Do you want to confirm selected action"} 
                buttonText={confirmationModalData.buttonText ? confirmationModalData.buttonText : "Submit"}
                //onSubmit is required field for action confirmation
                onSubmit={()=>confirmationModalData.onSubmit()} setDisableMode={props.setDisableMode} disableMode={props.disableMode}/>
        : null
    }
    </React.Fragment>
}
export default withFormHoc(OrderActionForms);

