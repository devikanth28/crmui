import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import dateFormat from 'dateformat';
import qs from 'qs';
import React, { useContext, useEffect, useState } from 'react';
import FormHelpers from '../../helpers/FormHelpers';
import Validate from '../../helpers/Validate';
import { API_URL, CRM_UI } from '../../services/ServiceConstants';
import { AlertContext, UserContext } from '../Contexts/UserContext';


const OrderSearchForm = ({ helpers, formData, ...props }) => {

    const [advanceSearchClicked, setAdvanceSearchClicked] = useState(false);
    const { setStackedToastContent } = useContext(AlertContext);
    const userSessionInfo = useContext(UserContext);
    const params = props?.urlParams ? props.urlParams : qs.parse(props.location.search, { ignoreQueryPrefix: true });

    useEffect(() => {
        if(userSessionInfo?.vertical && userSessionInfo.vertical == "V"){                    
            props.history.push({
                          pathname: `${CRM_UI}/orderSearch/search`,
                          state: { urlParams: params }
                        });                     
        }
        else
            null 
      }, [])

      useEffect(() => {
        if(userSessionInfo?.vertical && userSessionInfo.vertical == "V" && Validate().isNotEmpty(document.getElementById("advanceSearch"))) onClickAdvanceSearch();
      }, [document.getElementById("advanceSearch")]);
   
    const validateSearchCriteria = (orderSearchCriteria) => {
        let fromDate="";
        let toDate="";
        let allFieldsEmpty = true;
        if(Validate().isNotEmpty(orderSearchCriteria.dateRange)){
            fromDate = dateFormat(orderSearchCriteria.dateRange[0], "yyyy-mm-dd")
            toDate = dateFormat(orderSearchCriteria.dateRange[1], "yyyy-mm-dd")
        }
        Object.entries(orderSearchCriteria).forEach(([key, value]) => {
            if (Validate().isNotEmpty(value)) {
                allFieldsEmpty = false;
            }
        });
        if (allFieldsEmpty) {
            setStackedToastContent({toastMessage:"Please give Atleast one Search Criteria for Finding Mart Orders."})
            return false;
        }
        if ((Validate().isEmpty(fromDate) && Validate().isNotEmpty(toDate)) || (Validate().isNotEmpty(fromDate) && Validate().isEmpty(toDate))) {
            setStackedToastContent({toastMessage:"Please give Valid Date Range!"})
            return false;
        }
        if (Validate().isEmpty(orderSearchCriteria.mobileNo) && Validate().isEmpty(orderSearchCriteria.customerId) && Validate().isEmpty(orderSearchCriteria.beautyCustomerId) && Validate().isEmpty(orderSearchCriteria.orderId) && Validate().isEmpty(orderSearchCriteria.cartId)) {
            if (Validate().isEmpty(fromDate) && Validate().isEmpty(toDate)) {
                setStackedToastContent({toastMessage:"Please give Valid Date Range!"})
                return false;
            }
        }
        const difference = new Date(toDate).getTime() - new Date(fromDate).getTime();
        const days = difference / (1000 * 60 * 60 * 24);
        if (difference < 0) {
            setStackedToastContent({toastMessage:"From Date should be less than or equals to To Date!"})
            return false;
        }
        if (days >= 30) {
            setStackedToastContent({toastMessage:"Date Range cannot be greater than 30 days. Please give Valid Date Range!"})
            return false;
        }
        return true;
    }

    const orderSearchData = (payload) => {
        payload[0].preventDefault();
        const orderSearchCriteria = helpers.validateAndCollectValuesForSubmit("martOrderSearchForm", false, false, false);
        let hubOrdersFlag = null;
        let aggregateOrdersFlag = null;
        if (Validate().isNotEmpty(orderSearchCriteria.orderOptions)) {
            if (orderSearchCriteria.orderOptions.includes("hubOrdersFlag")) {
                hubOrdersFlag = "Y"
            }
            if (orderSearchCriteria.orderOptions.includes("aggregateOrdersFlag")) {
                aggregateOrdersFlag = "Y"
            }
        }
        let refillOrdersOnly = null;
        let includeRefillOrders = null;
        if (Validate().isNotEmpty(orderSearchCriteria.refillOptions)) {
            if (orderSearchCriteria.refillOptions.includes("refillOrdersOnly")) {
                refillOrdersOnly = "Y"
            }
            if (orderSearchCriteria.refillOptions.includes("includeRefillOrders")) {
                includeRefillOrders = "Y"
            }
        }
        let status = null;
        if (Validate().isNotEmpty(orderSearchCriteria.status)) {
            status = orderSearchCriteria.status[0];
        }
        let requestFromList = null;
        if(Validate().isNotEmpty(orderSearchCriteria.requestFrom)){
            Object.values(orderSearchCriteria.requestFrom).map((eachRequestFrom, index) => {
                if(index===0){
                    requestFromList=eachRequestFrom;
                }else{
                    requestFromList=requestFromList+","+eachRequestFrom;
                }
            })
        }
        let ePrescriptionCriteriaList = null;
        if(Validate().isNotEmpty(orderSearchCriteria.ePrescription)){
            Object.values(orderSearchCriteria.ePrescription).map((ePrescriptionCriteria, index) => {
                if(index===0){
                    ePrescriptionCriteriaList=ePrescriptionCriteria;
                }else{
                    ePrescriptionCriteriaList=ePrescriptionCriteriaList+","+ePrescriptionCriteria;
                }
            })
        }
        if (validateSearchCriteria(orderSearchCriteria)) {
            let fromDate = null;
            let toDate = null;
            if (Validate().isNotEmpty(orderSearchCriteria.dateRange)) {
                fromDate = dateFormat(orderSearchCriteria.dateRange[0], "yyyy-mm-dd") + " 00:00:00";
                toDate = dateFormat(orderSearchCriteria.dateRange[1], "yyyy-mm-dd") + " 23:59:59";
            }
            props.handleOnSearchClick?.();
            let finalorderSearchCriteria = {
                customerId: orderSearchCriteria.customerId,
                orderType: orderSearchCriteria.orderType, orderId: orderSearchCriteria.orderId, fromDate: fromDate, toDate: toDate,
                mobileNo: orderSearchCriteria.mobileNo, status: status,
                orderDeliveryType: orderSearchCriteria.orderDeliveryType, cartId: orderSearchCriteria.cartId,
                ePrescription: ePrescriptionCriteriaList, paymentType: orderSearchCriteria.paymentType, refillOrdersOnly: refillOrdersOnly,
                includeRefillOrders: includeRefillOrders, aggregateOrdersFlag: aggregateOrdersFlag, hubOrdersFlag: hubOrdersFlag,
                searchDuration: null, couponCode: orderSearchCriteria.couponCode, requestFrom: requestFromList,
                paymentStatus: orderSearchCriteria.paymentStatus, affiliateId: orderSearchCriteria.affiliateId, v: Date.now()
            };
            Object.entries(finalorderSearchCriteria).forEach(([key, value]) => {
                if (Validate().isEmpty(value))
                    delete finalorderSearchCriteria[key]
            });
            finalorderSearchCriteria['showAdvanceSearchOptions'] = advanceSearchClicked;
            props.history.push(`${CRM_UI}/orderSearch?${qs.stringify(finalorderSearchCriteria)}`);
        }
    }

    const updateValues = () => {
        let formValues = { ...params, fromDate: dateFormat(params.fromDate, 'yyyy-mm-dd'), toDate: dateFormat(params.toDate, 'yyyy-mm-dd') };
        if (Validate().isNotEmpty(params.status)) {
            formValues = { ...formValues, status: [params.status] }
        }
        //For Eliminating daterange default values
        if(Validate().isNotEmpty(props.location.search)){
            formValues = {...formValues, "dateRange": []};
        }
        if (Validate().isNotEmpty(params.fromDate) && Validate().isNotEmpty(params.toDate)) {
            let dateRange = [];
            dateRange.push(params.fromDate);
            dateRange.push(params.toDate);
            formValues = {...formValues, "dateRange": dateRange};
        }
        if (Validate().isNotEmpty(params.refillOrdersOnly)) {
            formValues = { ...formValues, refillOptions: "refillOrdersOnly" }
        }
        if (Validate().isNotEmpty(params.includeRefillOrders)) {
            formValues = { ...formValues, refillOptions: "includeRefillOrders" }
        }
        let orderOptions = [];
        if (Validate().isNotEmpty(params.hubOrdersFlag)) {
            orderOptions.push("hubOrdersFlag");
        }
        if (Validate().isNotEmpty(params.aggregateOrdersFlag)) {
            orderOptions.push("aggregateOrdersFlag");
        }
        formValues = { ...formValues, orderOptions: orderOptions }
        if(Validate().isNotEmpty(params.paymentStatus)){
            helpers.showElement("paymentStatus");
        }
        let requestFromList = []
        if(Validate().isNotEmpty(params.requestFrom)){
            Object.values(params.requestFrom.split(",")).forEach((eachRequestFrom) => {
                requestFromList.push(eachRequestFrom);
            })
        }
        formValues = { ...formValues, requestFrom: requestFromList }
        let ePrescriptionCriteriaList = []
        if(Validate().isNotEmpty(params.ePrescription)){
            Object.values(params.ePrescription.split(",")).forEach((ePrescriptionCriteria) => {
                ePrescriptionCriteriaList.push(ePrescriptionCriteria);
            })
        }
        formValues = { ...formValues, ePrescription: ePrescriptionCriteriaList }
        if(Validate().isNotEmpty(params.showAdvanceSearchOptions) && params.showAdvanceSearchOptions == "true"){
            onClickAdvanceSearch();
        }

        helpers.updateSpecificValues(formValues, "martOrderSearchForm");
    }

    const checkForPaymentStatusCriteria = (payload) => {
        if(payload[0].target.value==="O"){
            helpers.showElement("paymentStatus")
        }else{
            helpers.hideElement("paymentStatus")
        }
    }

    const submitOnClick = () => {
        orderSearchData();
    }

    const onClickAdvanceSearch = () => {
        helpers.showElement("ePrescription");
        helpers.showElement("orderOptions");
        helpers.showElement("refillOptions");
        helpers.showElement("orderType");
        helpers.showElement("affiliateId");
        helpers.hideElement("advanceSearch");
        setAdvanceSearchClicked(true);
    }

    const observersMap = {
        'search': [['click', (payload)=>orderSearchData(payload)]],
        'martOrderSearchForm': [['load', updateValues], ['submit', submitOnClick]],
        'paymentType': [['click', checkForPaymentStatusCriteria]],
        'reset': [['click', checkForPaymentStatusCriteria]],
        'advanceSearch': [['click', onClickAdvanceSearch]],
        'customerId': [['change', (payload)=>FormHelpers().onInputCustomerId(payload, helpers, "customerId")]]
    }

    return (<React.Fragment>
        {<DynamicForm requestUrl={`${API_URL}martOrderSearchForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} headers={{'X-Requested-With':"XMLHttpRequest"}} />}
    </React.Fragment>
    )
}
export default withFormHoc(OrderSearchForm); 