import React, { useRef, useState } from "react";
import DynamicForm from '@medplus/react-common-components/DynamicForm';
import { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import { API_URL, CRM_UI } from "../../services/ServiceConstants";
import dateFormat from 'dateformat';
import { CustomerContext, UserContext } from "../Contexts/UserContext";
import { useContext } from "react";
import qs from 'qs';
import { useEffect } from "react";

const CustomerOrderHistorySearchForm = ({ helpers, formData, ...props }) => {

    const {fromDate, setFromDate, toDate, setToDate} = props;

    const userSessionInfo = useContext(UserContext);
    const params = props?.urlParams ? props.urlParams : qs.parse(props?.location?.search, { ignoreQueryPrefix: true });
    const { customerId } = useContext(CustomerContext);

    useEffect(() => {
        if(userSessionInfo?.vertical && userSessionInfo.vertical == "V"){                    
            props.history.push({
                          pathname: `${CRM_UI}/customer/${customerId}/orderHistory/search`,
                          state: { urlParams: params }
                        });                     
        }
        else
            null 
      }, [])

    const setDateRange = () => {
        const prescriptionOrderSearchCriteria = helpers.validateAndCollectValuesForSubmit("filterDate", false, false, false);
        setFromDate(dateFormat(prescriptionOrderSearchCriteria.dateRange[0], 'yyyy-mm-dd 00:00:00'));
        setToDate(dateFormat(prescriptionOrderSearchCriteria.dateRange[1], 'yyyy-mm-dd 23:59:59'));
    }

    const handleDateChange = (payload) => {
        const [event, htmlElement] = payload;
        const { id } = htmlElement;
        const { value } = event.target;
        const checkDateTime = new Date(value).getTime();
        switch (id) {
            case 'fromDate':
                const toDateValue = helpers.getHtmlElementValue("toDate");
                let toDateTime = new Date(toDateValue).getTime();
                if ((toDateTime - checkDateTime) > 7776000000) {
                    helpers.updateSingleKeyValueIntoField("message", "Date Range cannot be greater than 90 days so, Please give Valid Date Range.", "toDate");
                } else if (toDateTime < checkDateTime) {
                    helpers.updateSingleKeyValueIntoField("message", "Please give From Date less than or equal to To Date.", "toDate");
                } else {
                    helpers.updateSingleKeyValueIntoField("message", "", "toDate");
                }
                break;
            case 'toDate':
                const fromDateValue = helpers.getHtmlElementValue("fromDate");
                let fromDateTime = new Date(fromDateValue).getTime();
                if ((checkDateTime - fromDateTime) > 7776000000) {
                    helpers.updateSingleKeyValueIntoField("message", "Date Range cannot be greater than 90 days so, Please give Valid Date Range.", "fromDate");
                } else if (checkDateTime < fromDateTime) {
                    helpers.updateSingleKeyValueIntoField("message", "Please give From Date less than or equal to To Date.", "fromDate");
                } else {
                    helpers.updateSingleKeyValueIntoField("message", "", "fromDate");
                }
                break;
            default:
                break;
        }
    }

    const observersMap = {
        'search': [['click', setDateRange]],
        // 'dateRange': [['change', handleDateChange]]
    }

    return <DynamicForm requestUrl={`${API_URL}customerOrderHistoryDateForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />;
}

export default withFormHoc(CustomerOrderHistorySearchForm);