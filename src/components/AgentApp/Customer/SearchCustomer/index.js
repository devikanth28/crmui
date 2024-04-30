import DynamicForm, { CustomSpinners, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import { useContext, useState } from "react";
import Validate from "../../../../helpers/Validate";
import AgentAppService from "../../../../services/AgentApp/AgentAppService";
import { AGENT_APP_SERVICES_API, AGENT_UI, API_URL } from "../../../../services/ServiceConstants";
import { BodyComponent, Wrapper } from "../../../Common/CommonStructure";
import { AlertContext } from "../../../Contexts/UserContext";

const SearchCustomer=({helpers,...props}) =>{
    const { setToastContent  } = useContext(AlertContext);
    const validate = Validate();
    const [customerLoading,setCustomerLoading] = useState(false);


    const checkMobileNumber = (formData) => {
        const { mobileNumber } = formData;
        if (validate.isEmpty(mobileNumber)) {
            setToastContent({toastMessage:"Please give mobile number for Finding Customer Details."});
            return false;
        }
        return true;
    }
    const redirectToCreateCustomer=()=>{
        props.history.replace(`${AGENT_UI}/createCustomer`);
    }

    const setFormDetails = () => {
        helpers.disableElement("search");
        const customerSearchCriteria = helpers.validateAndCollectValuesForSubmit("searchCustomer");
        if (validate.isNotEmpty(customerSearchCriteria) && checkMobileNumber(customerSearchCriteria)) {
            setCustomerLoading(true);
            helpers.updateSingleKeyValueIntoField("label", null,"search");
            AgentAppService().searchCustomer({mobileNo:customerSearchCriteria['mobileNumber']}).then(response=>{
                if(response.statusCode=="SUCCESS"){
                    props.history.push(`${AGENT_UI}/customerInfo`);
                }else if(response.statusCode=="WARNING"){
                    redirectToCreateCustomer();
                }else{
                    helpers.enableElement("search");
                    setToastContent({toastMessage:"Customer search failed! Try again"});
                }
                setCustomerLoading(false);
                helpers.updateSingleKeyValueIntoField("label","Search","search");
            }).catch(error=>{
                helpers.enableElement("search");
                setCustomerLoading(false);
                helpers.updateSingleKeyValueIntoField("label","Search","search");
                console.log(error)
            })
        }
    }

    const submitOnEnter = (payload) => {
        const [event] = payload;
        event.preventDefault();
        setFormDetails();
    }

    const customLoader = () => {
        return(
            <>
            {customerLoading && <CustomSpinners spinnerText={"Search"} className={" spinner-position"} innerClass={"invisible"} />}
            </>
        )
    }

    const customSpinner = {
        'search' : [['INSERT_IN' , customLoader]]
    } 

    const handleOnChange = (payload)=>{
        const event = payload[0]
        let errorMessage = validate.mobileNumber(event.target.value)
        if(errorMessage){
            helpers.disableElement("search");
        }else{
            helpers.enableElement("search");
        }
    }

    const observersMap = {
        'mobileNumber': [['change',handleOnChange]],
        'search': [['click',setFormDetails]],
        'searchCustomer': [['submit', submitOnEnter]],
    }

    return (
        <Wrapper>
            <BodyComponent className={"body-height h-100"}>
                <DynamicForm requestUrl={`${API_URL}${AGENT_APP_SERVICES_API}/searchCustomerForm`} helpers={helpers} requestMethod={'GET'} customHtml={customSpinner} observers={observersMap} headers={props.headers} />
            </BodyComponent>
        </Wrapper>
    );
}
export default withFormHoc(SearchCustomer);