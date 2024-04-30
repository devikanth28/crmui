import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import React from 'react';
import Validate from '../../../helpers/Validate';
import DynamicGridHeight from '../../Common/DynamicGridHeight';
import CurrencyFormatter from '../../Common/CurrencyFormatter';

const RefundOrderTabs = (props) => {
 
    const validate = Validate();
    const settlementDataGrid = props.dataGrid.settlementRefundGrid ? props.dataGrid.settlementRefundGrid : undefined;
    const settlementDataSet = props.dataSet.refundInfoSet.settlement ? props.dataSet.refundInfoSet.settlement : undefined;
    const refundDataGrid = props.dataGrid.refundGrid ? props.dataGrid.refundGrid : undefined;
    const refundDataSet = props.dataSet.refundInfoSet.refund ? props.dataSet.refundInfoSet.refund : undefined;

    const settlementSet = {};
    {
        validate.isNotEmpty(settlementDataSet) && Object.keys(settlementDataSet).map(key => {
            const productsSummary = [];
            if (validate.isNotEmpty(settlementDataSet[key].settlementPaymentRefundAmount) && settlementDataSet[key].settlementPaymentRefundAmount > 0 && validate.isNotEmpty(settlementDataSet[key].settlementPaymentRefundPts) && settlementDataSet[key].settlementPaymentRefundPts > 0) {
                productsSummary.push({
                    "refundIssueDate": "Total Settlement Amount",
                    "points": <React.Fragment><CurrencyFormatter data={settlementDataSet[key].settlementPaymentRefundAmount + settlementDataSet[key].settlementPaymentRefundPts} decimalPlaces={-1} /></React.Fragment>
                })
            }
            else if(validate.isNotEmpty(settlementDataSet[key].settlementPaymentRefundAmount) && settlementDataSet[key].settlementPaymentRefundAmount > 0){
                productsSummary.push({
                    "refundIssueDate": "Total Settlement Amount",
                    "points": <React.Fragment><CurrencyFormatter data={settlementDataSet[key].settlementPaymentRefundAmount} decimalPlaces={-1} /></React.Fragment>
                })
            }
            else if(validate.isNotEmpty(settlementDataSet[key].settlementPaymentRefundPts) && settlementDataSet[key].settlementPaymentRefundPts > 0){
                productsSummary.push({
                    "refundIssueDate": "Total Settlement Amount",
                    "points": <React.Fragment>{settlementDataSet[key].settlementPaymentRefundPts} {" pts"}</React.Fragment>
                })
            }
            settlementSet[key] = productsSummary;
        })
    }


    const refundSet = {};
    {
        validate.isNotEmpty(refundDataSet) && Object.keys(refundDataSet).map(key => {
            const refundSummary = [];
            if (validate.isNotEmpty(refundDataSet[key].refundedReportDeliveryCharges) && refundDataSet[key].refundedReportDeliveryCharges != 0) {
                refundSummary.push({
                    "mrp": "Refunded Report Delivery Charges",
                    "amount": <React.Fragment><CurrencyFormatter data={refundDataSet[key].refundedReportDeliveryCharges} decimalPlaces={-1} /></React.Fragment>
                })
            }
            if (validate.isNotEmpty(refundDataSet[key].refundedCollectionCharges) && refundDataSet[key].refundedCollectionCharges != 0) {
                refundSummary.push({
                    "mrp": "Refunded Collection Charges",
                    "amount": <React.Fragment><CurrencyFormatter data={refundDataSet[key].refundedCollectionCharges} decimalPlaces={2} /></React.Fragment>
                })
            }
            if (validate.isNotEmpty(refundDataSet[key].totalRefund) && refundDataSet[key].totalRefund > 0) {
                refundSummary.push({
                    "mrp": "Total Refund",
                    "amount": <React.Fragment><CurrencyFormatter data={refundDataSet[key].totalRefund} decimalPlaces={2} /></React.Fragment>
                })
            }
            if (validate.isNotEmpty(refundDataSet[key].netAmountRefund) && refundDataSet[key].netAmountRefund > 0) {
                refundSummary.push({
                    "mrp": "Net Amount Refund",
                    "amount": <React.Fragment><CurrencyFormatter data={refundDataSet[key].netAmountRefund} decimalPlaces={2} /></React.Fragment>
                })
            }
            if (validate.isNotEmpty(refundDataSet[key].mdxRefundPoints) || validate.isNotEmpty(refundDataSet[key].mdxRefundWorth)) {
                refundSummary.push({
                    "mrp": "MDx Points Refund",
                    "amount": <>{refundDataSet[key].mdxRefundPoints} pts ( Worth {<CurrencyFormatter data={refundDataSet[key].mdxRefundWorth} decimalPlaces={2} />} )</>
                })
            }
            refundSet[key] = refundSummary
        })
    }

    const refundDetailsCallBack = {
       "prices": (props) =>{
            const {row} =props;
            return <React.Fragment> {row.amount}</React.Fragment>
        },
        "amount": (props)=>{
            const {row} =props;
            return <React.Fragment> {validate.isNotEmpty(row.amount) && <div><CurrencyFormatter data={Number(row.amount)} decimalPlaces={2} /></div>}</React.Fragment>
        },
        "mrp": (props) =>{
            const {row} = props;
            return <React.Fragment>{validate.isNotEmpty(row.mrp) && <div><CurrencyFormatter data={Number(row.mrp)} decimalPlaces={2} /></div> }</React.Fragment>
        }
    }
    const settlementDetailsCallBack = {
        "prices": (props) => {
            const { row } = props;
            return <React.Fragment> {row.points}</React.Fragment>
        },
        "amount": (props)=>{
            const {row} =props;
            return <React.Fragment> {validate.isNotEmpty(row.points) && row.points.includes("pts") ? row.points : <div><CurrencyFormatter data={row.points} decimalPlaces={-1} /></div>}</React.Fragment>
        }
    }
    return (
        <React.Fragment>
            
             <p className="custom-fieldset mt-3 mb-1 ps-1"> Refund Details</p>
            {validate.isNotEmpty(settlementDataSet) && Object.keys(settlementDataSet).map(key => {
                return validate.isNotEmpty(settlementDataSet[key].settleDataSet) && <React.Fragment>
                            <div className="row m-0">
                                <div className="col-12 p-0">
                                    <h6 class="modal-title mb-3">Settlement ID : {key}</h6>
                                    <DynamicGridHeight dataSet={settlementDataSet[key].settleDataSet} gridMaxRows={settlementDataSet[key].settleDataSet.length} metaData={settlementDataGrid} id="refund-dataset" className="card scroll-grid-on-hover" bottomSummaryRows={settlementSet[key]}>
                                        <CommonDataGrid {...settlementDataGrid} dataSet={[...settlementDataSet[key].settleDataSet]}
                                            callBackMap={settlementDetailsCallBack}
                                            bottomSummaryRows={settlementSet[key]}
                                        />
                                   </DynamicGridHeight>
                                </div>
                            </div>
                        </React.Fragment>
                
            })}
            {validate.isNotEmpty(refundDataSet) && Object.keys(refundDataSet).map(key => {
                return validate.isNotEmpty(refundDataSet[key].refundDataSet) && <React.Fragment>
                            <div className="row m-0">
                                <div className="col-12 p-0">
                                    <h6 class="modal-title my-3">{key}</h6>
                                    <DynamicGridHeight dataSet={refundDataSet[key].refundDataSet} gridMaxRows={refundDataSet[key].refundDataSet.length} metaData={refundDataGrid}  bottomSummaryRows={refundSet[key]} id="refund-dataset"  className="card scroll-grid-on-hover">
                                        <CommonDataGrid {...refundDataGrid} dataSet={[...refundDataSet[key].refundDataSet]}
                                        callBackMap={refundDetailsCallBack}
                                        bottomSummaryRows={refundSet[key]}
                                        />
                                    </DynamicGridHeight>
                                </div>
                            </div>
                        </React.Fragment>                  
            })}
        </React.Fragment>
    );
}

export default RefundOrderTabs;