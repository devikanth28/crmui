import { useState } from "react";
import Validate from "../../../../helpers/Validate";

const ShipmentDetails=(props)=>{
    const {shoppingCart} = props
    if(Validate().isEmpty(shoppingCart)){
        return <></>
    }
    const {hubId,hubServingItemsCount,multipleShipmentServingStoreId,shoppingCartETA}=shoppingCart;
    if(Validate().isEmpty(hubServingItemsCount) || Validate().isEmpty(multipleShipmentServingStoreId) || Validate().isEmpty(shoppingCartETA) || Validate().isEmpty(hubId)){
        return<></>
    }

    const handleShipment=(isCustomerAgreeToSingleOrder)=>{
        props.setIsCustomerAgreeToSingleOrder(isCustomerAgreeToSingleOrder);
    }


    return (
        <div className="p-12 mb-4">
            <p className="custom-fieldset mb-2">Choose a Delivery Speed</p>
            <div className="row g-0">
                <div className="col-6">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="deliverySpeed" id="multipleDelivery" value="multiple" checked={props?.isCustomerAgreeToSingleOrder=="N"} onChange={()=>{handleShipment("N")}}/>
                        <label className="form-check-label" for="multipleDelivery">Multiple Shipments</label>
                    </div>
                    <p className="mb-0 ps-4 font-12 text-secondary mt-2">
                        {hubServingItemsCount && multipleShipmentServingStoreId &&
                            <small> {hubServingItemsCount} item(s) -- {shoppingCartETA[hubId]}.<br />
                                Remaining products -- {shoppingCartETA[multipleShipmentServingStoreId]}.
                            </small>
                        }
                    </p>
                </div>
                <div className="col-6">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="deliverySpeed" id="singleDelivery" value="single" checked={props?.isCustomerAgreeToSingleOrder=="Y"} onChange={()=>{handleShipment("Y")}}/>
                        <label className="form-check-label" for="singleDelivery">Single Shipment</label>
                    </div>
                    <p className="mb-0 ps-4 font-12 text-secondary mt-2">Get all your products -- <span className="ml-1 text-dark">{shoppingCartETA[multipleShipmentServingStoreId]}</span></p>
                </div>
            </div>
        </div>
    )
}
export default ShipmentDetails;