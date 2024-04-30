import DynamicForm, { TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm"
import React, { useContext , useEffect } from "react"
import Validate from "../../../helpers/Validate";
import { API_URL, CRM_UI } from "../../../services/ServiceConstants";
import { AlertContext , UserContext} from "../../Contexts/UserContext";
import qs from 'qs';
import dateFormat from 'dateformat';

const LabOrderRefundSearchForm = ({ helpers, formData, ...props }) => {

  const validate = Validate();
  const { setStackedToastContent } = useContext(AlertContext);
  const params = props?.urlParams ? props.urlParams : qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const userSessionInfo = useContext(UserContext);

  let filteredData = {}

  useEffect(() => {
    (userSessionInfo?.vertical && userSessionInfo.vertical == "V")
                    ? props.history.push({
                      pathname: `${CRM_UI}/labOrder/refundSearchResults/search`,
                      state: { urlParams: params }
                    }) : null 
  }, [])

  const validateSearchCriteria = (labOrderRefundSearchCriteria) => {
    for (let key in labOrderRefundSearchCriteria) {
      if (validate.isNotEmpty(labOrderRefundSearchCriteria[key])) {
        if (key !== 'dateRange')
        filteredData[key] = labOrderRefundSearchCriteria[key]
      }
    }
    if (Object.keys(filteredData).length === 0) {
      setStackedToastContent({ toastMessage: "Please give Atleast one Search Criteria for Finding Refunds", position: TOAST_POSITION.BOTTOM_START })
      return false;
    }
    if (validate.isEmpty(labOrderRefundSearchCriteria.orderType)) {
      setStackedToastContent({toastMessage:"Please Select Order Type"})
      return false;
    }
    filteredData["v"] = Date.now();
    return true;
  }

  const LabOrderRefundSearchForm = (payload) => {
    payload[0].preventDefault();
    let labOrderRefundSearchCriteria = helpers.validateAndCollectValuesForSubmit("labOrderRefundSearch", true, true, true);
    if(validate.isNotEmpty(labOrderRefundSearchCriteria.dateRange) && labOrderRefundSearchCriteria.dateRange.length > 1) {
      labOrderRefundSearchCriteria.fromDate = dateFormat(labOrderRefundSearchCriteria.dateRange[0],'yyyy-mm-dd 00:00:00');
      labOrderRefundSearchCriteria.toDate = dateFormat(labOrderRefundSearchCriteria.dateRange[1],'yyyy-mm-dd 23:59:59');
    }
    if (validateSearchCriteria(labOrderRefundSearchCriteria)) {
      const qs = '?' + new URLSearchParams(filteredData).toString()
      props.history.push(`${CRM_UI}/labOrder/refundSearchResults${qs}`);
    }
  }
  
  const updateValues = () => {
    let formValues = { ...params, fromDate: dateFormat(params.fromDate, 'yyyy-mm-dd'), toDate: dateFormat(params.toDate, 'yyyy-mm-dd') };
    if (validate.isNotEmpty(params.status)) {
      formValues = { ...formValues, status: [params.status] }
    }
    //For Eliminating daterange default values
    if (validate.isNotEmpty(props.location.search)) {
      formValues = { ...formValues, "dateRange": [] };
    }
    if (validate.isNotEmpty(params.fromDate) && Validate().isNotEmpty(params.toDate)) {
      let dateRange = [];
      dateRange.push(params.fromDate);
      dateRange.push(params.toDate);
      formValues = { ...formValues, "dateRange": dateRange };
    }
    if (validate.isNotEmpty(params.collectionCenterId)) {
      formValues = { ...formValues, collectionCenterId: [params.collectionCenterId] }
    }
    if (validate.isNotEmpty(params.orderId)) {
      formValues = { ...formValues, orderId: [params.orderId] }
    }

    if (validate.isNotEmpty(params.paymentStatus)) {
      formValues = { ...formValues, paymentStatus: [params.paymentStatus] }
    }
    if (validate.isNotEmpty(params.refundId)) {
      formValues = { ...formValues, refundId: [params.refundId] }
    }

    helpers.updateSpecificValues(formValues, "labOrderRefundSearch");
  }

  
  const observersMap = {
    'submit': [['click',(payload)=>LabOrderRefundSearchForm(payload)]],
    'labOrderRefundSearch': [['load', updateValues], ['submit',LabOrderRefundSearchForm]],
  }
  return (
    <React.Fragment>
      {<DynamicForm requestUrl={`${API_URL}getLabOrderRefundSearchForm`} headers={{ "x-requested-with": "XMLHttpRequest" }} helpers={helpers} requestMethod={'GET'} observers={observersMap} />}
    </React.Fragment>
  )
}

export default withFormHoc(LabOrderRefundSearchForm);