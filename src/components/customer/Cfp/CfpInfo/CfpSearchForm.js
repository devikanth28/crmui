import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import dateFormat from 'dateformat';
import qs from 'qs';
import React, { useContext ,useEffect } from 'react';
import { getNotNullCriteria } from '../../../../helpers/HelperMethods';
import Validate from '../../../../helpers/Validate';
import { API_URL, CRM_UI } from '../../../../services/ServiceConstants';
import { AlertContext , UserContext} from '../../../Contexts/UserContext';

const CfpSearchForm = ({ helpers, formData, ...props }) => {

    const { setStackedToastContent } = useContext(AlertContext);
    const params = props?.urlParams ? props.urlParams : qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const userSessionInfo = useContext(UserContext);

    useEffect(() => {
        (userSessionInfo?.vertical && userSessionInfo.vertical == "V")
                        ? props.history.push({
                          pathname: `${CRM_UI}/cfpSearch/search`,
                          state: { urlParams: params }
                        }) : null 
      }, [])


    const validateSearchCriteria = (cfpSearchCriteria) => {
        if (Validate().isEmpty(cfpSearchCriteria)) {
            setStackedToastContent({ toastMessage: "Please give Atleast one Search Criteria." })
            return false;
        }

        if (Validate().isEmpty(cfpSearchCriteria.dateRange)) {
            return false;
        }
        let fromDate = dateFormat(cfpSearchCriteria.dateRange[0], "yyyy-mm-dd")
        let toDate = dateFormat(cfpSearchCriteria.dateRange[1], "yyyy-mm-dd")
        if ((Validate().isEmpty(fromDate) && Validate().isNotEmpty(toDate)) || (Validate().isNotEmpty(fromDate) && Validate().isEmpty(toDate))) {
            setStackedToastContent({ toastMessage: "Please give Valid Date Range!" })
            return false;
        }
        const difference = new Date(toDate).getTime() - new Date(fromDate).getTime();
        const days = difference / (1000 * 60 * 60 * 24);
        if (difference < 0) {
            setStackedToastContent({ toastMessage: "Please give Valid Date Range!" })
            return false;
        }
        if (days >= 30) {
            setStackedToastContent({ toastMessage: "Date Range cannot be greater than 30 days. Please give Valid Date Range!" })
            return false;
        }
        return true;
    }

    const searchCfpData = (payload) => {
        payload[0].preventDefault();
        const cfpSearchCriteria = helpers.validateAndCollectValuesForSubmit("cfpSearchForm");
        if (validateSearchCriteria(cfpSearchCriteria)) {
            let storeId = "";
            if (Validate().isNotEmpty(cfpSearchCriteria.storeId)) {
                storeId = cfpSearchCriteria.storeId[0];
            }
            let status = "";
            if (Validate().isNotEmpty(cfpSearchCriteria.status)) {
                status = cfpSearchCriteria.status[0];
            }
            let fromDate = null;
            let toDate = null;
            if (Validate().isNotEmpty(cfpSearchCriteria.dateRange)) {
                fromDate = dateFormat(cfpSearchCriteria.dateRange[0], "yyyy-mm-dd") + " 00:00:00";
                toDate = dateFormat(cfpSearchCriteria.dateRange[1], "yyyy-mm-dd") + " 23:59:59";
            }
            props.handleOnSearchClick?.();
            let finalSearchCriteria = {
                customerId: cfpSearchCriteria.customerId, mobileNumber: cfpSearchCriteria.mobileNumber, storeId: storeId,
                status: status, fromDate: fromDate, toDate: toDate, v: Date.now()
            };
            finalSearchCriteria = getNotNullCriteria(finalSearchCriteria);
            console.log("finalSearchCriteria", finalSearchCriteria);
            props.history.push(`${CRM_UI}/cfpSearch?${finalSearchCriteria}`);
        }
    }

    const updateValues = () => {
        let formValues = { ...params, fromDate: dateFormat(params.fromDate, 'yyyy-mm-dd'), toDate: dateFormat(params.toDate, 'yyyy-mm-dd') };
        if (Validate().isNotEmpty(params.storeId)) {
            formValues = { ...formValues, storeId: [params.storeId] }
        }
        if (Validate().isNotEmpty(params.status)) {
            formValues = { ...formValues, status: params.status }
        }
        //For Eliminating daterange default values
        if (Validate().isNotEmpty(props.location.search)) {
            formValues = { ...formValues, "dateRange": [] };
        }
        if (Validate().isNotEmpty(params.fromDate) && Validate().isNotEmpty(params.toDate)) {
            let dateRange = [];
            dateRange.push(params.fromDate);
            dateRange.push(params.toDate);
            formValues = { ...formValues, "dateRange": dateRange };
        }

        helpers.updateSpecificValues(formValues, "cfpSearchForm");
    }

    const clearAndSetDateRangeValues = () => {
        helpers.resetForm("cfpSearchForm");
        let dateRange = [];
        dateRange.push(new Date().setDate(new Date().getDate() - 10));
        dateRange.push(new Date());
        helpers.updateSpecificValues({"dateRange": dateRange}, "cfpSearchForm");
    }

    const observersMap = {
        'search': [['click', (payload) => searchCfpData(payload)]],
        'cfpSearchForm': [['load', updateValues]],
        'reset': [['click', clearAndSetDateRangeValues]]
    }
    return (<React.Fragment>
        {<DynamicForm requestUrl={`${API_URL}cfpSearchForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} headers={{ 'X-Requested-With': "XMLHttpRequest" }} />}
    </React.Fragment>
    )
}
export default withFormHoc(CfpSearchForm);