import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import dateFormat from 'dateformat';
import qs from 'qs';
import React, { useContext, useEffect, useState } from 'react';
import Validate from '../../../helpers/Validate';

import { API_URL, CRM_UI } from '../../../services/ServiceConstants';
import { AlertContext, CustomerContext, UserContext } from '../../Contexts/UserContext';



const HealthRecordsHistorySearchForm = ({ helpers, formData, ...props }) => {

    const { customerId } = useContext(CustomerContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const userSessionInfo = useContext(UserContext);
    const params = props?.urlParams ? props.urlParams : qs.parse(props.location.search, { ignoreQueryPrefix: true });


    useEffect(() => {
        if(userSessionInfo?.vertical && userSessionInfo.vertical == "V"){                    
            props.history.push({
                          pathname: `${CRM_UI}/customer/${customerId}/healthRecordHistory/search`,
                          state: { urlParams: params }
                        });                     
        }
        else
            null
        }, [])

    const sendRequest = () => {
        let healthRecordCriteria = helpers.validateAndCollectValuesForSubmit("healthRecordHistorySearchForm", false, false, false);
        if (Validate().isEmpty(healthRecordCriteria.dateRange) && Validate().isEmpty(healthRecordCriteria.doctorName) && Validate().isEmpty(healthRecordCriteria.patientName)) {
            setStackedToastContent({ toastMessage: "Please give Atleast one Search Criteria." });
            return;
        }
        if (Validate().isNotEmpty(healthRecordCriteria.dateRange) && healthRecordCriteria.dateRange.length > 1) {
            healthRecordCriteria.fromDate = dateFormat(healthRecordCriteria.dateRange[0], 'yyyy-mm-dd 00:00:00');
            healthRecordCriteria.toDate = dateFormat(healthRecordCriteria.dateRange[1], 'yyyy-mm-dd 23:59:59');
          }
        let searchCriteria = {
            fromDateTime: Validate().isNotEmpty(healthRecordCriteria?.fromDate) ? healthRecordCriteria.fromDate : null,
            toDateTime: Validate().isNotEmpty(healthRecordCriteria?.toDate) ? healthRecordCriteria.toDate : null,
            patientName: healthRecordCriteria.patientName,
            doctorName: healthRecordCriteria.doctorName
        };
        // const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        props.history.replace(`${CRM_UI}/customer/${customerId}/healthRecordHistory?${qs.stringify(searchCriteria)}`);
    }

    const searchValues =()=>{
        let formValues = { ...params };
        helpers.updateSpecificValues(formValues, "healthRecordHistorySearchForm");
    }

    const observerMap = {
        'healthRecordHistorySearchForm' : [['load', searchValues]],
        'search': [['click', () => sendRequest()]],
    }

    return (<React.Fragment>
        {<DynamicForm requestUrl={`${API_URL}healthRecordHistorySearchForm`} helpers={helpers} requestMethod={'GET'} observers={observerMap} />}
    </React.Fragment>
    )
}
export default withFormHoc(HealthRecordsHistorySearchForm); 