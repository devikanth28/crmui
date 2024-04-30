import React, { useState } from "react";
import { Claim, Unclaim } from "@medplus/react-common-components/DataGrid";
import OrderService from "../../services/Order/OrderService";
import Validate from "../../helpers/Validate";
import CommonConfirmationModal from '../Common/ConfirmationModel';

export const handleClaimRequest = async(props,recordIdsList) => {
  const validate = Validate();
  if (props.setEmployeeDetails) {
    props.setEmployeeDetails(!props.employeeDetails);
  }
  
  const claimStatus = validate.isEmpty(props.claimedBy) || props.claimedBy !== 'S' ? 'C' : 'U';

  const claimObject = {
    recordIds: recordIdsList.join(','),
    recordType: props.recordType,
    claimStatus: claimStatus,
  };

  OrderService().claimOrUnclaimOrder(claimObject)
    .then((data) => {
      if (data.statusCode === "SUCCESS") {
        if (props.onSuccess) {
          props.onSuccess(props.recordId);
        } 
      } else {
        if (props.onFailure) {
          props.onFailure(data.message, props.recordId);
        }
      }
    })
    .catch((error) => {
      console.log('Claim request failed:', error);
    });
}




export default function OrderClaimComponent(props) {
  const validate = Validate();
  const [toggleConfirmation, setToggleConfirmation] = useState(false); // Changed initial state

    return (
    <React.Fragment>
      {validate.isEmpty(props.recordIdsList) ? (
        validate.isEmpty(props.claimedBy) ? (
          <Claim handleOnClick={() => handleClaimRequest(props,[props.recordId])} id={"record_" + props.recordId} tooltip="Claim Order"/>
        ) : (
          props.claimedBy === 'S' && <Unclaim handleOnClick={() => handleClaimRequest(props,[props.recordId])} id={"record_" + props.recordId} tooltip="Unclaim Order"/>
        )
      ) : (
        props.recordIdsList.indexOf(props.recordId) !== -1 ? (
          validate.isEmpty(props.claimedBy) ? (
            <Claim handleOnClick={() => handleClaimRequest(props,props.recordIdsList)} id={"record_" + props.recordId} tooltip="Claim Order"/>
          ) : (
            props.claimedBy === 'S' && <Unclaim handleOnClick={() => handleClaimRequest(props,props.recordIdsList)} id={"record_" + props.recordId} tooltip="Unclaim Order"/>
          )
        ) : (
          validate.isEmpty(props.claimedBy) ? (
            <Claim handleOnClick={() => { setToggleConfirmation(true); }} id={"record_" + props.recordId} tooltip="Claim Order"/>
          ) : (
            props.claimedBy === 'S' && <Unclaim handleOnClick={() => { setToggleConfirmation(true); }} id={"record_" + props.recordId} tooltip="Unclaim Order"/>
          )
        )
      )}
      
      {toggleConfirmation && (
        <CommonConfirmationModal
         headerText={ validate.isEmpty(props.claimedBy) || props.claimedBy !== 'S'
          ? "Claim Order"
          : "Unclaim Order"}
        buttonText={validate.isEmpty(props.claimedBy) || props.claimedBy !== 'S'
        ? "Yes, Claim"
        : "Yes, Unclaim"}
          isConfirmationPopOver={true}
          setConfirmationPopOver={setToggleConfirmation}
          onSubmit={() => handleClaimRequest(props,[props.recordId])}
          message={
            validate.isEmpty(props.claimedBy) || props.claimedBy !== 'S'
              ? "You have already selected a list of other Order IDs to claim. Do you want to continue?"
              : "You have already selected a list of other order IDs to unclaim. Do you want to continue?"
          }
        />
      )}
    </React.Fragment>
  );
}
