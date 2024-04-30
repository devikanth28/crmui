import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect } from 'react'
import FormHelpers from '../../../helpers/FormHelpers';
import { getDateInYMDFormat } from '../../../helpers/HelperMethods';
import Validate from '../../../helpers/Validate';
import { AlertContext } from '../../Contexts/UserContext';

function CfpActionsStatusCountForm({ helpers, ...props }) {

    useEffect(() => {
        if(props.loading){
            helpers.updateSingleKeyValueIntoField("isLoading", true, "cfpSubmit");
        }else{
            helpers.updateSingleKeyValueIntoField("isLoading", false, "cfpSubmit");
        }
    }, [props.loading])

    const {setStackedToastContent} = useContext(AlertContext);

    const onClickSubmitCfpInfoForm = () => {
        const cfpInfoFormData = helpers.validateAndCollectValuesForSubmit("cfpInfoForm", false, false, false);
        if(Validate().isEmpty(cfpInfoFormData.dateRange[0]) || Validate().isEmpty(cfpInfoFormData.dateRange[1])){
            setStackedToastContent({ toastMessage: "Please Give Valid Date Range" });
            return;
        }
        let fromDate = getDateInYMDFormat(cfpInfoFormData.dateRange[0]);
        let toDate = getDateInYMDFormat(cfpInfoFormData.dateRange[1]);
        props.requestStatusWiseCFPActionsCountInfo(fromDate, toDate);
    }

    const observersMap = {
        'cfpSubmit': [['click', onClickSubmitCfpInfoForm]],
    }

    return (
        <React.Fragment>
            {<DynamicForm formJson={FormHelpers().getCFPInfoForm()} helpers={helpers} observers={observersMap} />}
        </React.Fragment>
    )
}

export default withFormHoc(CfpActionsStatusCountForm);
