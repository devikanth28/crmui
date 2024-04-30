import React from "react";
import Validate from "../../../helpers/Validate";

const DisplayThankYouOrder=(props)=>{

    const {orderInfo} = props;
    const validate = Validate();
    if(validate.isEmpty(orderInfo)){
        return
    }
    return(
        <div className="row g-0 custom-border-bottom-dashed mb-3">
            {validate.isNotEmpty(orderInfo) && <React.Fragment>
                <p className="text-secondary mb-2">Order {orderInfo?.orderSno}</p>
                <div>
                    <h4 className="mb-2">
                        Order ID - <span className="text-brand fw-bold">{orderInfo?.displayOrderId}</span>
                    </h4>
                    <p className="text-secondary">{orderInfo?.deliveryTime}</p>
                </div>
            </React.Fragment>}
        </div>
    )
}
export default DisplayThankYouOrder;