import { useContext, useEffect, useState } from "react";
import CheckoutService from "../services/Checkout/CheckoutService";
import { CRM_UI } from "../services/ServiceConstants";
import Validate from "./Validate";
import qs from 'qs';
import { CustomerContext, LocalityContext } from "../components/Contexts/UserContext";
import { BodyComponent, Wrapper } from "../components/Common/CommonStructure";
import UserService from "../services/Common/UserService";

const CatalogIntermediateComponent= (props) => {

    const checkoutService = CheckoutService();
    const validate = Validate();
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const { customerId } = useContext(CustomerContext);
    const {setMartLocality} = useContext(LocalityContext);
    const prescriptionId = params?.prescriptionId;
    const cfpStoreId = params?.cfpStoreId;
    const pageToRedirect = params?.pageToRedirect;
    const recordId = params?.recordId;
    const cfpLocality = params?.cfpLocality;
    const locality = params?.martLocality;
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {
        setCOData();
    },[]);

    const selectedLocalityInfo = async(customerId,params) => {
        return UserService().setLocality({ headers: { customerId: customerId }, params: params });
    }

    const setCOData = async() => {
        console.log("inter props "+JSON.stringify(props));
        if(validate.isNotEmpty(locality) && validate.isNotEmpty(locality.split(",")) && validate.isNotEmpty(locality.split(",")[1])){
            const martLocationResponse = await selectedLocalityInfo(customerId, { "locationInfo": { lattitude: locality.split(",")[0], longitude: locality.split(",")[1] } });
            if (validate.isNotEmpty(martLocationResponse) && validate.isNotEmpty(martLocationResponse.dataObject) && "SUCCESS" == martLocationResponse.statusCode) {
                setMartLocality(martLocationResponse.dataObject);
            }
        }
        if(validate.isEmpty(prescriptionId) && validate.isEmpty(recordId) && validate.isEmpty(cfpStoreId)){
            props?.history?.push({pathname: `${CRM_UI}/customer/${customerId}/catalog`,state: {locality:locality}});
            return;
        }
        checkoutService.setCOData({ headers: { customerId: customerId }, params : {prescriptionId, cfpStoreId, recordId}}).then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS") {
               if(validate.isNotEmpty(pageToRedirect) && (pageToRedirect == "catalog" || pageToRedirect == "checkout/showSwitchProducts") && validate.isNotEmpty(prescriptionId)) {
                  props?.history?.push({pathname: `${CRM_UI}/customer/${customerId}/${pageToRedirect}`,state: {prescriptionId: prescriptionId}});
                  return;
               }
               if(validate.isNotEmpty(pageToRedirect) && (pageToRedirect == "catalog" || pageToRedirect == "checkout/showSwitchProducts") && validate.isNotEmpty(recordId)) {
                props?.history?.push({pathname: `${CRM_UI}/customer/${customerId}/${pageToRedirect}`,state: {recordId: recordId}});
                return;
             } 
                if(pageToRedirect == "checkout/showSwitchProducts" && validate.isNotEmpty(cfpStoreId)) {
                     props?.history?.push({pathname: `${CRM_UI}/customer/${customerId}/${pageToRedirect}`,state: {cfpStoreId: cfpStoreId, cfpLocality : cfpLocality}});
                     return;
                }
            } 
            props?.history?.push(`${CRM_UI}/customer/${customerId}/catalog`);
        }).catch((error) => {
            console.log("error "+error);
        })
    }
    return(
        <Wrapper>
            <BodyComponent className="body-height" loading={isLoading}>
            </BodyComponent>
        </Wrapper>
    )
}

export default CatalogIntermediateComponent
