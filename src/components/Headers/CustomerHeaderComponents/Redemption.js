import React from 'react';
import Validate from '../../../helpers/Validate';
import gift_icon from '../../../images/gift-icon.svg';
const Redemption  = (props) => {
    return(
        <React.Fragment>
         <div className="justify-content-center">
        {Validate().isNotEmpty(props.isRedemptionAllowed) && props.isRedemptionAllowed === "Y" && <img style={{width:'50px',height:
        '50px'}}  src={gift_icon}></img> }
        </div>
        </React.Fragment>
    )
}

export default Redemption;
