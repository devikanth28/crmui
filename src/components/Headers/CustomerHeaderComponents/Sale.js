import React from 'react';
import Validate from '../../../helpers/Validate';
import cash_icon from '../../../images/cash-icon.svg';
const Sale  = (props) => {
    return(
        <React.Fragment>
        <div className="justify-content-center">
        {Validate().isNotEmpty(props.isSaleAllowed) && props.isSaleAllowed === "Y" && <img style={{width:'50px',height:
        '50px'}}  src={cash_icon}></img> }
        </div>
        </React.Fragment>
    )
}

export default Sale;