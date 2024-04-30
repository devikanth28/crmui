
import React from 'react'
import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import { API_URL } from '../../services/ServiceConstants';
const CustomerProcurementSearchForm = ({ helpers, formData, ...props }) => {
    return (
        <React.Fragment>
           {<DynamicForm requestUrl={`${API_URL}customerProcurementSearchForm`} helpers={helpers} requestMethod={'GET'} observers={{}} headers={{'X-Requested-With':"XMLHttpRequest"}} />}
        </React.Fragment>
    )
}

export default withFormHoc(CustomerProcurementSearchForm)