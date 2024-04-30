import { useEffect } from "react";
import CheckoutService from "../services/Checkout/CheckoutService";
import { CRM_UI } from "../services/ServiceConstants";
import Validate from "./Validate";

const CatalogPrescription = (props) => {

    const checkoutService = CheckoutService();
    const customerId = props.match.params.customerId;
    const prescriptionId = props.match.params.prescriptionId;
    const validate = Validate();

    useEffect(() => {
        setPrescriptionIdInToken();
    },[]);

    const setPrescriptionIdInToken = () => {
        checkoutService.setPrescriptionIdInToken({ headers: { customerId: customerId }, params: {prescriptionId: prescriptionId} }).then((response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS") {
                props.history.push(`${CRM_UI}/customer/${customerId}/catalog/prescription`);
            }
        }).catch((error) => {
            console.log("error "+error);
        })
    }

}

export default CatalogPrescription
