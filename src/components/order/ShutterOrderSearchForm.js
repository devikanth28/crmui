import React from 'react'
import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import { API_URL } from '../../services/ServiceConstants';
const ShutterOrderSearchForm = ({ helpers, formData, ...props }) => {

    return (
        <React.Fragment>
           {<DynamicForm requestUrl={`${API_URL}shutterOrderSearchForm`} helpers={helpers} requestMethod={'GET'} observers={{}} headers={{'X-Requested-With':"XMLHttpRequest"}} />}
        </React.Fragment>
    )
}

export default withFormHoc(ShutterOrderSearchForm);