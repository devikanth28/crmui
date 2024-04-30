import DynamicForm, { withFormHoc } from "@medplus/react-common-components/DynamicForm"
import React, { useContext } from "react"
import { Button, ModalTitle } from "react-bootstrap"
import { Modal, ModalBody, ModalHeader } from "reactstrap"
import Validate from "../../helpers/Validate"
import { AlertContext } from "../Contexts/UserContext"
import { API_URL } from "../../services/ServiceConstants"
import { getDateInYMDFormat } from "../../helpers/HelperMethods"
import { calculateAgeWithMonthsandDays } from "../../helpers/CommonHelper"
import CustomerService from "../../services/Customer/CustomerService"

export default withFormHoc(({ helpers, showEditPatientModal, setShowEditPatientModal, patientInfo, onSuccessOfPatientUpdation, ...props }) => {
    const validate = Validate();
    const { setToastContent } = useContext(AlertContext)

    const setFormValues = () => {
        if (validate.isEmpty(patientInfo)) {
            return;
        }
        helpers.updateValue(patientInfo.patientName, 'patientName');
        calculateAge(patientInfo.dateOfBirth);
        helpers.updateValue(patientInfo.gender, 'gender');
        helpers.updateValue(getDateInYMDFormat(patientInfo.dateOfBirth), "dateOfBirth");
    }

    const updatePatient = async () => {
        helpers.disableElement('update');
        let formValues = helpers.validateAndCollectValuesForSubmit("editPatientDetailForm");
        if (validate.isEmpty(formValues)) {
            return;
        }
        try {
            let response = await CustomerService().updateCustomerPatient({ patientId: patientInfo.patientId, customerId: patientInfo.customerId, gender: formValues.gender, patientName: formValues.patientName, dateOfBirth: formValues.dateOfBirth });
            if (validate.isNotEmpty(response) && validate.isNotEmpty(response.statusCode) && response.statusCode == 'SUCCESS') {
                setToastContent({ toastMessage: "Patient details updated successfully" });
                setShowEditPatientModal(false);
                onSuccessOfPatientUpdation();
            } else {
                setToastContent({ toastMessage:response.message? response.message: "Unable to update patient at the moment,please try after sometime" });
            }
        } catch (error) {
            console.log('Error:', error);
            setToastContent({ toastMessage: "Unable to update patient at the moment,please try after sometime" })
        }
        helpers.enableElement('update');
    }
    const calculateAge = (dateOfBirth) => {
        const { years, months } = calculateAgeWithMonthsandDays(dateOfBirth)
        if (validate.isEmpty(years) || years == 0) {
            helpers.updateValue(validate.isNumeric(months.toString())? months == 1 ? `${months} month` : `${months} months`:`0 months`, 'patientAge');
            return;
        }
        helpers.updateValue(validate.isNumeric(years.toString())? (years == 1 ? `${years} year` : `${years} years`):`0 years`, 'patientAge')
    }
    const observersMap = {
        'editPatientDetailForm': [['load', () => setFormValues()]],
        'dateOfBirth': [['change', (e) => calculateAge(e[0].target.value)]],
        'update': [['click', () => updatePatient()]],
        'close': [['click', () => setShowEditPatientModal(false)]]
    }
    const CloseButton = <Button variant="" className="btn-close icon-hover" type="button" onClick={() => setShowEditPatientModal(!showEditPatientModal)}></Button>
    return <React.Fragment>
        <Modal
            isOpen={true}
            onHide={() => { setShowEditPatientModal(false) }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <ModalHeader className="p-12" close={CloseButton}>
                <ModalTitle className='h6'>{'Edit Patient Details'}</ModalTitle>
            </ModalHeader>
            <ModalBody className='p-0'>
                <DynamicForm requestUrl={`${API_URL}getPatientEditForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />
            </ModalBody>
        </Modal>
    </React.Fragment>

})
