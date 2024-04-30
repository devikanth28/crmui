import { CustomSpinners } from "@medplus/react-common-components/DynamicForm";
import React, { useContext, useEffect, useState } from 'react';
import Validate from '../../../../helpers/Validate';
import AgentAppService from '../../../../services/AgentApp/AgentAppService';
import { AgentAppContext } from '../../../Contexts/UserContext';
import AddMembersToSubscription from './AddMembersToSubscription';

const AddMembers = (props) => {

    const subscriptionId = props.match.params.subscriptionId;
    const { tpaTokenId } = useContext(AgentAppContext);
    const agentAppService = AgentAppService(tpaTokenId);
    const validate = Validate()
    const [subscription, setSubscription] = useState({})
    const [initialLoader, setInitialLoader] = useState(true)
    const [retry , setShowRetry] = useState(false);

    useEffect(() => {
        if(validate.isEmpty(subscriptionId)){
            props.history.goBack();
            return;
        }
        setInitialLoader(true);
        agentAppService.getSubscriptionDetail({subscriptionId}).then(data => {
          if(data && "SUCCESS" === data.statusCode && validate.isNotEmpty(data.responseData)) {
              let subscriptionObject = data.responseData;
              if(validate.isEmpty(subscriptionObject) ||  subscriptionObject.status != "ACTIVE" || subscriptionObject.renewalAllowed || !(subscriptionObject.plan.totalMaxAllowed < 0 || (subscriptionObject.members.length < subscriptionObject.plan.totalMaxAllowed)) ||  !checkIfAllMembersAreActive(subscriptionObject.members)) {
                  props.history.goBack();
                  return;
              } 
              setSubscription(subscriptionObject);

          }  else if ( data && "FAILURE" === data.statusCode && "NO_SUBSCRIPTIONS_AVAILABLE" === data.message ) {
                  props.history.goBack();
                  return;
          } else {
              setShowRetry(true);
          }
          setInitialLoader(false);
      });

    },[subscriptionId]);

    const checkIfAllMembersAreActive=(members)=>{
      let isActive = true;
      members.every(member=>{
          if(validate.isEmpty(member.subscriptionStatus) || member.subscriptionStatus !== "ACTIVE"){
              isActive= false;
              return false;
          }
          return true;
      })
      return isActive;
  }

  const handleCancel = () => {
    props.history.goBack();
}

  if (initialLoader) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" />
      </div>)
  }

if(retry) {
  return (
    <div>Unable to get Subscriptions. Please try again !</div>
  );
}


  return <React.Fragment>
    {validate.isNotEmpty(subscription) && <React.Fragment>
      <AddMembersToSubscription handleCancel={handleCancel} subscription={subscription} plan={subscription.plan} existingMembersCount={subscription.members.length} history={props.history} {...props} />
    </React.Fragment>}
  </React.Fragment>


}

export default AddMembers
