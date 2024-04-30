import React from 'react';
import Validate from '../../../helpers/Validate';
import CurrencyFormatter from '../../Common/CurrencyFormatter';

export const CartSummary = (props) => {

    const validate = Validate();
    return (
        <>
            {validate.isNotEmpty(props.cartSummary) &&
                <>
                    {props.title && <label className="d-block pb-0 custom-fieldset mb-1">Cart Summary</label>}
                    <div className='col-12 col-md-4 col-sm-12'>
                        <div className='d-flex flex-row justify-content-between'>
                            <p className='font-14'>Total No.of Members</p>
                            <p className='text-end font-14'>{props.cartSummary.totalMembers}</p>
                        </div>
                        {validate.isNotEmpty(props.cartSummary.plans) && props.cartSummary.plans.length > 1 ?
                            <div className=''>
                                <p className='font-14 fw-bold'>Base Plan Charges</p>

                                {props.cartSummary.plans.map(eachPlan => {
                                    return (
                                        <div className='d-flex flex-row justify-content-between'>
                                            <p className='text-end font-14'>{eachPlan.displayName}</p>
                                            <p className='text-end font-14'><CurrencyFormatter data={eachPlan.amount} /></p>
                                        </div>
                                    )
                                })
                                }
                            </div> :
                            <div className='d-flex flex-row justify-content-between'>
                                {validate.isNotEmpty(props.cartSummary.primaryFee) && parseFloat(props.cartSummary.primaryFee) > 0 &&
                                    <>
                                        <p className='text-end font-14'> Base Plan Charges</p>
                                        <p className='text-end font-14'><CurrencyFormatter data={props.cartSummary.primaryFee} /></p>
                                    </>

                                }
                            </div>
                        }
                        {validate.isNotEmpty(props.cartSummary.addOnFees) &&
                            <div>
                                <p className='font-14 fw-bold'>Additional Member Charges</p>
                                {props.cartSummary.addOnFees.map(eachAddOnFee => {
                                    return (
                                        <>
                                           {eachAddOnFee.totalAddOnfee &&  <div className='d-flex flex-row justify-content-between'>
                                           <p className='font-14'>Age Group {eachAddOnFee.displayName}&nbsp; ({eachAddOnFee.noOfMembers})</p>
                                                <p className='text-end font-14'><CurrencyFormatter data={eachAddOnFee.totalAddOnfee} /></p>
                                            </div>}

                                        </>
                                    )
                                })}
                        </div>
                    }
                       {props.cartSummary.totalDisc>0 &&
                        <div className='d-flex flex-row justify-content-between'>
                            <p className='font-14'>Discount Applied</p>
                            <p className='text-end font-14'>-<CurrencyFormatter data={props.cartSummary.totalDisc} /></p>
                        </div>
                        }
                        {props.cartSummary.additionalRenewalDisc>0 &&
                            <div className='d-flex flex-row justify-content-between'>
                                <p className='font-14'>Renewal Discount Applied</p>
                                <p className='text-end font-14'>-<CurrencyFormatter data={props.cartSummary.additionalRenewalDisc} /></p>
                            </div>
                        }
                        <div className='custom-border-bottom-dashed'></div>
                        {validate.isNotEmpty(props.cartSummary.totalPrice) && props.cartSummary.totalPrice > 0 &&
                            <div className='d-flex flex-row justify-content-between'>
                                <p className='font-16 font-weight-bold mt-3'>{props?.amountPaid?'Total amount paid':'Total amount to be paid'}</p>
                                <p className='text-end font-16 font-weight-bold mt-3'><CurrencyFormatter data={props.cartSummary.totalPrice}></CurrencyFormatter></p>
                            </div>
                        }
                        <div className='border-bottom'></div>
                    </div>
                </>
            }
        </>
    )

}