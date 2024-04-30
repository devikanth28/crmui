import DynamicForm, { TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useContext } from "react";
import { API_URL, CRM_UI } from "../../services/ServiceConstants";
import Validate from "../../helpers/Validate";
import qs from 'qs';
import { AlertContext } from "../Contexts/UserContext";

const LegderSearch = ({helpers, ...props}) => {
    const { setStackedToastContent } = useContext(AlertContext)

    const validate = Validate()
    let filteredData = {}

    const sendRequest =(payload) =>{
        if(validate.isNotEmpty(payload))
            payload[0].preventDefault();
        let ledgerSearchSearchCriteria = helpers.collectValuesForSubmit("getLedgerSearchForm");
        let collectionCenterIds =validate.isNotEmpty(ledgerSearchSearchCriteria.collectionCenterIds) ? ledgerSearchSearchCriteria.collectionCenterIds : null;
        const date =validate.isNotEmpty(ledgerSearchSearchCriteria.date) ? ledgerSearchSearchCriteria.date : null;
        if(validate.isNotEmpty(date) && validate.isNotEmpty(collectionCenterIds)){
            props.handleOnSearchClick?.();
            filteredData['collectionCenterId'] = collectionCenterIds;
            filteredData['date'] = date;
            const qs = '?' + new URLSearchParams(filteredData).toString();
            props.history.push(`${CRM_UI}/ledgerSearch${qs}`);
        }
        else if(validate.isEmpty(date) && validate.isEmpty(collectionCenterIds)){
            setStackedToastContent({ toastMessage: "Please enter required fields", position: TOAST_POSITION.BOTTOM_START });
        }
        else if(validate.isEmpty(date)){
            setStackedToastContent({ toastMessage: "Please select the Date", position: TOAST_POSITION.BOTTOM_START });
        }
        else if(validate.isEmpty(collectionCenterIds)){
            setStackedToastContent({ toastMessage: "Please Select Collection Center", position: TOAST_POSITION.BOTTOM_START });
        }
    }

    const setValuesToForm = () =>{
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        let formValues = { ...params}
        let collectionCenterIds = []
        if(validate.isNotEmpty(params.collectionCenterId)){
            collectionCenterIds.push(params.collectionCenterId)
            formValues = {...formValues , "collectionCenterIds" : collectionCenterIds  }
          }
        let date = [];
        if (validate.isNotEmpty(params.date)) {
            date.push(params.date);
        }
        formValues = {...formValues, "date": date}
        if(validate.isNotEmpty(params)){
            helpers.updateSpecificValues(formValues,'getLedgerSearchForm');
        }
    }

    const submitOnEnter=()=>{
        sendRequest();
      }

    const observersMap = {
        'submit': [['click', payload=>sendRequest(payload)]],
        'getLedgerSearchForm': [['load',setValuesToForm], ['submit',submitOnEnter]]
    }


    return (
        <React.Fragment>
                    {<DynamicForm requestUrl={`${API_URL}getLedgerSearchForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />}    
        </React.Fragment>
    )
}
export default withFormHoc(LegderSearch);