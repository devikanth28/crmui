import BarGraph from "@medplus/mart-common-components/HealthTrendsPdf";
import React from 'react';
import { MART_ORDER_DASHBOARD_ORDER_SEQUENCE as orderSequence } from './Constants';
const OrderDashboardBarGraph = (props) => {
     let labels=[];
     let ledgers=[];
     let count=[];
     let backgroundColor=[];
     let barData={};
     let { seperator, ...finalOrderSequence }=orderSequence.mart;
     if(props.type !== undefined &&  props.type == "prescription"){
        finalOrderSequence=orderSequence.prescription;
     }
     if(props.type !== undefined &&  props.type == "lab"){
        finalOrderSequence=orderSequence.lab;
     }
     if(props.type !== undefined &&  props.type == "cfp"){
        finalOrderSequence=orderSequence.cfp;
     }
     for (const [key, value] of Object.entries(finalOrderSequence)) {
        if(props.orderCount[key]>0){
            labels.push(value.BarGraphLabelName);
            ledgers.push(value.BarGraphLabelName+" ("+value.displayName+")");
            count.push(props.orderCount[key]);
            backgroundColor.push(value.color);
        }
    }
    barData.data=count;
    barData.backgroundColor=backgroundColor;
    barData.labels = ledgers


    return(
        <>
        <h6 className="custom-fieldset mb-2 mt-3">{props.type == "cfp" ? "Customer Future Purchase Info" : "Order Status Details"}</h6>
        <div className="p-3 border">
            <BarGraph fromcrm="true" labels={labels} barData={barData} isMobile="true" />
        </div>
         </>
    )

} 
export default OrderDashboardBarGraph;
