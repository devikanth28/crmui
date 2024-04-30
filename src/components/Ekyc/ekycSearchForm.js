import DynamicForm, { TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm"
import { API_URL, CRM_UI, REQUEST_TYPE } from "../../services/ServiceConstants"
import React, { useContext } from "react"
import Validate from "../../helpers/Validate"
import { AlertContext} from "../Contexts/UserContext"
import qs from 'qs';


const ekycSearchForm = ({helpers,formData, ...props}) =>{
    const validate = Validate();
    const {setStackedToastContent} = useContext(AlertContext);
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });

    let filteredData = {};
    const validateSearchCriteria = (ekycSearchCriteria) => {
        for (let key in ekycSearchCriteria) {
            if (validate.isNotEmpty(ekycSearchCriteria[key])) {
                filteredData[key] = ekycSearchCriteria[key]
            }
        }
        if (Object.keys(filteredData).length === 0) {
            setStackedToastContent({ toastMessage: "Please give Atleast one Search Criteria for Finding KYCs.", position: TOAST_POSITION.BOTTOM_START })
            return false;
        }
        filteredData["v"] = Date.now();
        return true;
    }

    const ekycSearchForm = (payload) => {
        payload[0].preventDefault;
        const ekycSearchCriteria = helpers.validateAndCollectValuesForSubmit('ekycForm',false,false,false);
        if (validateSearchCriteria(ekycSearchCriteria)) {
            const qs = '?' + new URLSearchParams(filteredData).toString()
            props.history.push(`${CRM_UI}/ekycSearch${qs}`);
        }
    }
    const updateValuesToForm = () =>{
        if(validate.isNotEmpty(params)){
            let formValues = {...params};
            if(validate.isNotEmpty(params.kycStatus)){
                formValues = {...formValues,kycStatus:[params.kycStatus]}
            }
            helpers.updateSpecificValues(formValues, "ekycForm");
        }

    }
    const observersMap = {
        'submit': [['click',(payload) =>ekycSearchForm(payload)]],
        'ekycForm': [['load',updateValuesToForm]]
    }
    return( <React.Fragment>
         {<DynamicForm requestUrl={API_URL+"getEkycForm"} headers={{"x-requested-with":"XMLHttpRequest"}} requestMethod={REQUEST_TYPE.GET} helpers={helpers} observers={observersMap}/>}
         </React.Fragment>)
}

export default withFormHoc(ekycSearchForm);