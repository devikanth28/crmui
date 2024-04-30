import React from 'react';
import Validate from '../../../helpers/Validate';
import dateFormat from 'dateformat';

const SubscriptionInfo = ({ subscriptionInfo }) => {
    const { startDate, endDate, subscriptionCode, dateCreated } = subscriptionInfo || {};
    const validate = Validate();
    return (
        <div className='card p-12 mb-3'>
            {validate.isNotEmpty(subscriptionInfo) && <>
                <div class="d-flex flex-wrap planInfo gap-3">
                    {validate.isNotEmpty(subscriptionCode) &&
                     <div class=" col-lg-2 planItem col-7">
                     <label class="font-12 text-secondary">Code</label>
                     <p class="mb-0 font-14">{subscriptionCode}</p>
                 </div>
                    }
                    {validate.isNotEmpty(startDate) &&
                        <div className="col-lg-1 planItem col-4">
                                <label className='font-12 text-secondary'>Start Date</label>
                                <p className='mb-0 font-14'>{dateFormat(startDate,"mmm dd,yyyy")}</p>
                        </div>
                    }
                    {validate.isNotEmpty(endDate) &&
                        <div class="col-lg-1 planItem col-7">
                                <label className='font-12 text-secondary'>End Date</label>
                                <p className='mb-0 font-14'>{dateFormat(endDate,"mmm dd,  yyyy")}</p>
                        </div>
                    }
                    {validate.isNotEmpty(dateCreated) &&
                        <div className="col-lg-1 planItem col-4">
                                <label className='font-12 text-secondary'>Created On</label>
                                <p className='mb-0 font-14'>{dateFormat(dateCreated,"mmm dd, yyyy")}</p>
                        </div>
                    }
                </div>
            </>
            
            }
        </div>
    )
}

export default SubscriptionInfo