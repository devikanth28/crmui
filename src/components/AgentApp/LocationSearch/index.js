import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import { useContext, useEffect, useState } from 'react';
import Validate from '../../../helpers/Validate';
import AgentAppService from '../../../services/AgentApp/AgentAppService';
import { AGENT_UI } from '../../../services/ServiceConstants';
import { Wrapper } from '../../Common/CommonStructure';
import { AgentAppContext, AlertContext } from '../../Contexts/UserContext';
import CloseChromeTab from '../common/CloseChromeTab';

const LocationSearch = (props) => {

    const { tpaTokenId, collectionStoreId, isThirdPartyAgent } = useContext(AgentAppContext);
    const agentAppService = AgentAppService(tpaTokenId);
    const validate = Validate();
    const [isLocalityLoading, setIsLocalityLoading] = useState(true)
    const [localityNotFound, setLoalityNotFound] = useState(false)
    const { setToastContent } = useContext(AlertContext);

    useEffect(()=>{
        if(!isThirdPartyAgent && validate.isNotEmpty(collectionStoreId)){
           agentAppService.setLocalityByCollectionCenterId({collectionStoreId}).then(data=>{
            if(data && "SUCCESS" === data.statusCode && validate.isNotEmpty(data.responseData)){
                props.history.replace(`${AGENT_UI}/searchCustomer`)
                return;
            }else if("NON_SERVING_LOCALITY" === data.message){
                setIsLocalityLoading(false)
                setLoalityNotFound(true)
            }
            }).catch( error =>{
                console.log(error)
                setIsLocalityLoading(false)
                setToastContent({toastMessage:"Unable to get locality details."});
            })
        }else if(isThirdPartyAgent){
            props.history.replace(`${AGENT_UI}/configureLocation`);
        }else{
            setIsLocalityLoading(false)
            setToastContent({toastMessage:"Invalid Data"});
        }
    }, [])
    
    return (<Wrapper>
        { isLocalityLoading &&  <div className="d-flex justify-content-center align-items-center vh-100">
            <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand"/>
        </div>
        }
        {
         localityNotFound &&
            <CloseChromeTab displayText={`Unable to get Locality details with the collection center Id : ${collectionStoreId}`} buttonText={'Change Collection Center'} />
        }
    </Wrapper>)
}

export default LocationSearch