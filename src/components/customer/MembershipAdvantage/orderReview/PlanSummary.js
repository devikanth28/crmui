import React from 'react'
import CurrencyFormatter from '../../../Common/CurrencyFormatter'
import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import ButtonWithSpinner from '../../../Common/ButtonWithSpinner';

export const PlanSummary = ( {cartSummary, thankyouPage} )=>{

    const multiPlans = cartSummary?.plans?.length > 1;
    const addOnFees = cartSummary?.addOnFees;
    const totalMembers = cartSummary?.totalMembers;
    const primaryFee = parseFloat(cartSummary?.primaryFee).toFixed(2);
    const totalDisc = parseFloat(cartSummary?.totalDisc).toFixed(2);
    const renewalDisc = parseFloat(cartSummary?.additionalRenewalDisc).toFixed(2);
    const totalPrice = parseFloat(cartSummary?.totalPrice).toFixed(2);

    let amountLabel = 'Total amount to be paid';
    if(thankyouPage){
        if(cartSummary.paymentType === "CREDIT_CARD" || cartSummary.paymentType === "CASH" || (cartSummary.paymentType === "PAYTM_EDC" && cartSummary.paymentStatus === "SUCCESS")){
            amountLabel = 'Total amount paid';
        }
    }

    return(
    <>
        <label className="d-block pb-0 custom-fieldset mb-1">Cart Summary</label>
        <div className='col-12 col-md-4 col-sm-12'>
            <div className='d-flex flex-row justify-content-between'>
                <p className='font-14'>No.of Members</p>
                <p className='text-end font-14'>{totalMembers}</p>
            </div>
            {primaryFee > 0 && <div className='d-flex flex-row justify-content-between'>
                <p className={`${multiPlans ? "text-secondary font-14" : "font-14"}`}>Base Plan Charges</p>
                {!multiPlans && <p className='text-end font-14'><CurrencyFormatter data={primaryFee}/></p>}
            </div>}
            {multiPlans && 
                <React.Fragment>
                    {cartSummary?.plans.map(eachPlan => {
                        return  <React.Fragment>
                                    <div className='d-flex flex-row justify-content-between'>
                                        <p className='font-14'>{eachPlan.displayName}</p>
                                        <p className='text-end font-14'><CurrencyFormatter data={eachPlan.amount}/></p>
                                    </div>
                                </React.Fragment>
                    })}
                </React.Fragment>
            }
            {addOnFees?.length > 0 &&
                <React.Fragment>
                    {addOnFees.map(eachAddOnFee => {
                        return  <React.Fragment>
                                    <div className='d-flex flex-row justify-content-between'>
                                        <p className='font-14'>Additional Member Charges [{eachAddOnFee.displayName}] ({eachAddOnFee.noOfMembers})</p>
                                        <p className='text-end font-14'><CurrencyFormatter data={eachAddOnFee.totalAddOnfee}/></p>
                                    </div>
                                </React.Fragment>
                    })
                        
                    }
                </React.Fragment>
            }
            {totalDisc > 0 && <div className='d-flex flex-row justify-content-between'>
                <p className='font-14'>Discount Applied</p>
                <p className='text-end font-14 text-success'>-<CurrencyFormatter data={totalDisc}/></p>
            </div>}
            {renewalDisc > 0 && <div className='d-flex flex-row justify-content-between'>
                <p className='font-14'>Renewal Discount Applied</p>
                <p className='text-end font-14'><CurrencyFormatter data={renewalDisc}/></p>
            </div>}
            {thankyouPage && <PaymentType cartSummary={cartSummary} />}
            <div className='custom-border-bottom-dashed'></div>
            <div className='d-flex flex-row justify-content-between'>
                <p className='font-16 font-weight-bold mt-3'>{amountLabel}</p>
                <p className='text-end font-16 font-weight-bold mt-3'><CurrencyFormatter data={totalPrice}></CurrencyFormatter></p>
            </div>
            <div className='border-bottom border-secondary mb-3'></div>
        </div>
    </>
    )
}

const PaymentType = ({cartSummary}) => {

    const getPaymentStatus = (status) => {
        if(status === "PENDING"){
            return "Pending";
        }else if(status === "FAIL"){
            return "Failed";
        }else if(status === "SUCCESS"){
            return "Done";
        }
    }

    const getPaymentType = (paymentType) => {
        if(paymentType === "PAYTM_EDC") {
            return "EDC Device";
        }else if(paymentType === "CASH") {
            return "Cash";
        }else if(paymentType === "CREDIT_CARD"){
            return "Card"
        }else if(paymentType === "ONLINE") {
            return "Online";
        }
    }

    return  <React.Fragment>
                <div className='d-flex flex-row justify-content-between'>
                    <p className='font-14'>Payment Type</p>
                    <p className='text-end font-14'>{getPaymentType(cartSummary.paymentType)}</p>
                </div>
                {cartSummary.paymentType === "PAYTM_EDC" && <div className='d-flex flex-row justify-content-between'>
                    <p className='font-14'>Payment Status</p>
                    <div className='d-flex'>
                        <p className='text-end font-14 me-2'>{getPaymentStatus(cartSummary.paymentStatus)}</p>
                    </div>
                </div>}
            </React.Fragment>
}