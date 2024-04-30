import React from "react";
import LabActionsModal from "./LabActionsModal";
import MartActionsModal from "./MartActionsModal";

const ActionsModal = ({modalType, ...props}) => {

    switch(modalType){
        case 'LAB' : 
            return <LabActionsModal {...props} />
        case 'MART' :
            return <MartActionsModal {...props} />
        default :
            return null;
    }
};

export default ActionsModal;