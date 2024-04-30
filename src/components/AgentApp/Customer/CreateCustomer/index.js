import { useContext, useState } from "react";
import Validate from "../../../../helpers/Validate";
import AgentAppService from "../../../../services/AgentApp/AgentAppService";
import { AGENT_APP_SERVICES_API, AGENT_UI, API_URL } from "../../../../services/ServiceConstants"
import DynamicForm, { ALERT_TYPE, CustomSpinners, withFormHoc} from '@medplus/react-common-components/DynamicForm';
import { AlertContext } from "../../../Contexts/UserContext";
import { BodyComponent, Wrapper } from "../../../Common/CommonStructure";

const CreateCustomer=({helpers,...props}) =>{

    const validate = Validate();
    const {setAlertContent} = useContext(AlertContext);
    const [isLoading, setLoading] = useState(false);

    const checkFields = (formData) => {
        const { customerName,mobileNumber,gender } = formData;
        if (validate.isEmpty(customerName) || validate.isEmpty(mobileNumber) || validate.isEmpty(gender)) {
            setAlertContent({alertMessage:"Please give Details to create customer." ,alertType: ALERT_TYPE.WARNING});
            return false;
        }
        return true;
    }

    const handleLoaders = (loading)=> {
        helpers.updateSingleKeyValueIntoField("label",loading ? null : "submit","submit");
        setLoading(loading);
    }

    const createCustomer = async (obj) => {
        handleLoaders(true)
        AgentAppService().createCustomerByAgent(obj).then(response => {
            if (response.statusCode == "SUCCESS") {
                props.history.push(`${AGENT_UI}/customerInfo`);
            }else{
                helpers.enableElement("submit")
                setAlertContent({alertMessage:"Customer creation failed" ,alertType: ALERT_TYPE.WARNING});
            }
            handleLoaders(false)
        }).catch(error => {
            helpers.enableElement("submit")
            setAlertContent({alertMessage:"Customer creation failed" ,alertType: ALERT_TYPE.WARNING});
            handleLoaders(false);
            console.log(error);
        })
    }

   

    const setFormDetails = () => {
        
        const customerSearchCriteria = helpers.validateAndCollectValuesForSubmit("createCustomer");
        if (validate.isNotEmpty(customerSearchCriteria) && checkFields(customerSearchCriteria)) {
            helpers.disableElement("submit")
            createCustomer(customerSearchCriteria);
        }
    }

    const handleFailure=(response)=>{
        if(response.statusCode=="FAILURE"){
            setAlertContent({alertMessage:"Customer creation failed" ,alertType: ALERT_TYPE.WARNING});
            props.history.push(`${AGENT_UI}/searchCustomer`)
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
            {isLoading && <CustomSpinners spinnerText={"submit"} className={" spinner-position"} innerClass={"invisible"} />}
            </>
        )
    }

    const customSpinner = {
        'submit' : [['INSERT_IN' , customLoader]]
    } 

    const observersMap = {
        'submit': [['click',setFormDetails]],
        'createCustomer' : [['submit',submitOnEnter],['response',handleFailure]]
      }
    return <Wrapper>
            <BodyComponent className={"body-height"}>
                <DynamicForm requestUrl={`${API_URL}${AGENT_APP_SERVICES_API}/createCustomerForm`} helpers={helpers} customHtml={customSpinner} requestMethod={'GET'} observers={observersMap} headers={props.headers}/>
            </BodyComponent>
        </Wrapper>
}
export default withFormHoc(CreateCustomer)