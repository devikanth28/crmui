import React from 'react';
import Validate from '../../../helpers/Validate';
import blocked_icon from '../../../images/blocked-icon.svg';
const DoNotDisturb  = (props) => {
    return(
        <React.Fragment>
         <div className="justify-content-center">
        {Validate().isNotEmpty(props.doNotDisturbFlag) && props.doNotDisturbFlag === "Y" && <img style={{width:'50px',height:
        '50px'}}  src={blocked_icon}></img> }
        </div>
        </React.Fragment>
    )
}

export default DoNotDisturb;