import React, { useState } from "react";
import DynamicForm, { withFormHoc, CustomAlert } from '@medplus/react-common-components/DynamicForm';
import { API_URL, CRM_UI } from "../../services/ServiceConstants";
import Validate from "../../helpers/Validate";
import qs from 'qs';

const MWalletRefund = ({ helpers, formData, ...props }) => {

    const [alertMessage, setAlertMessage] = useState("");
    const [show, setShow] = useState();

    const getAlertContent = () => {
        return (
            <React.Fragment>
                {alertMessage}
            </React.Fragment>
        );
    }

    const showAlert = (message) => {
        setAlertMessage(message);
        setShow(true);
    }

    const getMWalletRefundInfo = (payload) => {
        payload[0].preventDefault();
        const searchCriteria = helpers.validateAndCollectValuesForSubmit("mWalletRefundForm");
        console.log(searchCriteria);
        if (validateSearchCriteria(searchCriteria)) {
            let mWalletSearchCriteria = {
                fromDate: searchCriteria.dateRange[0],
                toDate: searchCriteria.dateRange[1],
                mobileNo: searchCriteria.mobileNo,
                status: searchCriteria.status,
                customerId: searchCriteria.customerId,
                requestId: searchCriteria.requestId
            };
            props.history.push(`${CRM_UI}/findMWalletRefund?${qs.stringify(mWalletSearchCriteria)}`);
        }
    }

    const observersMap = {
        'search': [['click',(payload)=> getMWalletRefundInfo(payload)]],
    }

    const validateSearchCriteria = (searchCriteria) => {
        if ((Validate().isEmpty(searchCriteria.fromDate) && Validate().isNotEmpty(searchCriteria.toDate)) || (Validate().isNotEmpty(searchCriteria.fromDate) && Validate().isEmpty(searchCriteria.toDate))) {
            setAlertMessage("Please give Valid Date Range!")
            showAlert("Please give Valid Date Range!");
            return false;
        }
        const difference = new Date(searchCriteria.toDate).getTime() - new Date(searchCriteria.fromDate).getTime();
        if (Validate().isNotEmpty(searchCriteria.fromDate) && Validate().isNotEmpty(searchCriteria.toDate)) {
            if (difference < 0) {
                showAlert("From Date should be less than or equals to To Date!");
                return false;
            }
        }
        if (Validate().isNotEmpty(searchCriteria.fromDate) && Validate().isNotEmpty(searchCriteria.toDate)) {
            const diffDays = Math.ceil(difference / (1000 * 3600 * 24));
            if (diffDays > 31) {
                showAlert("Date Range cannot be greater than 31 days. Please give Valid Date Range.");
                return false;
            }
        }
        return true;
    }

    return (
        <React.Fragment>
            {show && <CustomAlert alertMessage={getAlertContent} isAutohide={true} isTransition={true} delayTime={2000} isShow={show} onClose={() => { setShow(false) }} isDismissibleRequired={true} alertType={'danger'} />}
            <DynamicForm requestUrl={`${API_URL}getMWalletRefund`} helpers={helpers} observers={observersMap} requestMethod={'GET'} />
        </React.Fragment>
    )
}

export default withFormHoc(MWalletRefund);