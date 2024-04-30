import React from "react";
import { Button } from "react-bootstrap";
import Validate from "../../helpers/Validate";
import CurrencyFormatter from "../Common/CurrencyFormatter";

const PrepareGridForPrescription = (props) => {
 
    const omsOrderItem = props.orderInfo.omsOrderItem;

    return (
        <React.Fragment>
            <div className="overflow-auto h-100 scroll-on-hover">
                <p className="border-bottom px-3 py-2">Product Details</p>                
                <ul className="list-group m-2">
                    {omsOrderItem.map((eachOrder) => {
                        return (
                            <React.Fragment>
                                <li className="list-group-item">
                                    <p className="font-weight-bold mb-0" title={eachOrder.productName}>{eachOrder.productName}</p>
                                    <div className="font-14">
                                        <span className="text-truncate" title={eachOrder.quantity}>MRP <CurrencyFormatter data={eachOrder.mrp} decimalPlaces={2} /></span>
                                        <span className="mx-3 text-secondary">|</span>
                                        <span className="text-truncate" title={eachOrder.mrp}>Qty {eachOrder.quantity}</span>
                                        <span className="mx-3 text-secondary">|</span>
                                        <span className="text-truncate" title={eachOrder.mrp}>Total <CurrencyFormatter data={eachOrder.mrp * eachOrder.quantity} decimalPlaces={2} /></span>
                                    </div>
                                </li>
                            </React.Fragment>
                        );
                    })}
                    <li className="list-group-item d-flex justify-content-end align-items-center p-2">
                        <div>
                            {Validate().isNotEmpty(props.orderInfo.orderAmount) && <p className="text-end font-weight-bold mb-0">Total Amount : <CurrencyFormatter data={props.orderInfo.orderAmount} decimalPlaces={2} /></p>}    
                        </div>
                        {/* <div className="d-flex gap-2">                       
                            <Button variant=' ' className="btn-sm px-3 brand-secondary">Cancel</Button>
                            <Button variant="success" className="btn-sm px-3">Approve</Button>                            
                        </div>                         */}
                    </li>
                </ul>
            </div>
        </React.Fragment>
    );
};

export default PrepareGridForPrescription;