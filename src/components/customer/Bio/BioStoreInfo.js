import DynamicForm, { TOAST_POSITION, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext } from 'react';
import CustomerService from '../../../services/Customer/CustomerService';
import { API_URL } from "../../../services/ServiceConstants";
import Validate from '../../../helpers/Validate';
import { AlertContext } from '../../Contexts/UserContext';

const BioStoreInfo = ({ helpers, mobileNo }) => {

    const validate = Validate();

    const {setStackedToastContent} = useContext(AlertContext)

    const sendStoreId = async () => {
        let values = helpers.validateAndCollectValuesForSubmit('customerStoreInfoForm',false,true,true);
        if(validate.isEmpty(values)){
            return;
        }
        try {
            helpers.disableElement('storeId');
            const obj = {
                storeId: helpers.getHtmlElementValue("storeIdValue"),
                mobileNo: mobileNo
            };
            const response = await CustomerService().getStoreInfo(obj);
            if (validate.isNotEmpty(response) && validate.isNotEmpty(response.message)) {
                setStackedToastContent({toastMessage:response.message, position:TOAST_POSITION.BOTTOM_START})
                if(response.statusCode==="SUCCESS"){
                    helpers.updateValue(null,"storeIdValue",false);
                }
            }
            helpers.enableElement('storeId');
        } catch (err) {
            console.log(err)
            helpers.enableElement('storeId');
        }
    }

    const observersMap = {
        'storeId': [['click', sendStoreId]]
    }

    return (<React.Fragment>
            <DynamicForm requestUrl={`${API_URL}sendStoreInfoToCustomerForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />
    </React.Fragment>
    )
}

export default withFormHoc(BioStoreInfo); 