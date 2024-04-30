import DynamicForm, { TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm"
import React, { useContext } from "react"
import Validate from "../../helpers/Validate";
import { API_URL} from "../../services/ServiceConstants";
import { AlertContext } from "../Contexts/UserContext";
import MembershipService from "../../services/Membership/MembershipService";
import { downloadFileInBrowser } from "../../helpers/CommonHelper";

const MembershipExcelDownload = ({ helpers, formData, ...props }) => {

  const validate = Validate();
  const { setStackedToastContent } = useContext(AlertContext);
  const SERVER_EXPERIENCING_SOME_PROBLEM = "Server experiencing some problem";

  const membershipExcelDownloadSearchForm = (payload) => {
    payload[0].preventDefault();
    let downloadSubscriptionSearchCriteria = helpers.validateAndCollectValuesForSubmit("downloadMembershipForm", true, true, true);
    if(validate.isEmpty(downloadSubscriptionSearchCriteria) || validate.isEmpty(downloadSubscriptionSearchCriteria.organization) || downloadSubscriptionSearchCriteria.organization.length == 0)
      setStackedToastContent({ toastMessage: "Please select a corporate.", position: TOAST_POSITION.BOTTOM_START })
    else {
      helpers.updateSingleKeyValueIntoField("isLoading",true,"submit")
      helpers.updateSingleKeyValueIntoField("loaderClassName","spinner-border-sm page-loader","submit")
      MembershipService().downloadMembershipInfo({ orgId: downloadSubscriptionSearchCriteria.organization[0] }).then(response => {
          downloadFileInBrowser(response,"corporate-subscriptions.xls");
          helpers.updateSingleKeyValueIntoField("isLoading",false,"submit")

      }).catch(error => {
        console.log(error);
        setStackedToastContent({ toastMessage: SERVER_EXPERIENCING_SOME_PROBLEM,position: TOAST_POSITION.BOTTOM_START });
        helpers.updateSingleKeyValueIntoField("isLoading",false,"submit")
    
      });
    }
  
    }
    
  const observersMap = {
    'submit': [['click', membershipExcelDownloadSearchForm]],
  }
  return (
    <React.Fragment>
      {<DynamicForm requestUrl={`${API_URL}downloadSubscription`} headers={{ "x-requested-with": "XMLHttpRequest" }} helpers={helpers} requestMethod={'GET'} observers={observersMap} />}
    </React.Fragment>
  )
}

export default withFormHoc(MembershipExcelDownload);