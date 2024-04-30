import DynamicForm, { withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React from "react";
import { API_URL } from "../../../../services/ServiceConstants";

export default withFormHoc(({helpers, ...props}) => {

    const selectEDCDevice = (event) => {
        let deviceId = event[1].value[0];
        props.setSelectedEdcDevice(deviceId);
    }

    const observers = {
        'edcDevices' : [['select' , selectEDCDevice]]
    }

    return  <React.Fragment>
                <DynamicForm requestUrl={`${API_URL}membershipPaymentEDCDevicesForm?collectionCenterId=${props.collectionCenterId}`} helpers={helpers} requestMethod={'GET'} observers={observers} />
            </React.Fragment>
})