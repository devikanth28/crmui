import React, { useContext, useState } from 'react';
import BioShippingAddress from './BioShippingAddress';
import BioStoreInfo from './BioStoreInfo';
import BioSubscriptions from './BioSubscriptions';
import BioUserDetails from './BioUserDetails';
import RegisteredDocInfo from './RegisteredDoctorInfo';
import { CustomerContext } from '../../Contexts/UserContext';


const BioUser = ({customerData, getCustomerInfo, history }) => {

    const [hasSubscribedMedplusAdvantage, setHasSubscribedMedplusAdvantage] = useState(false);
    const {customer} = useContext(CustomerContext)
    const isSubscribedMember = (flag) => {
        setHasSubscribedMedplusAdvantage(flag);
    }

    return (<React.Fragment>
            <div className='d-flex justify-content-between custom-border-bottom-dashed mb-3'>
                <BioUserDetails hasSubscribedMedplusAdvantage={hasSubscribedMedplusAdvantage} customerData={customerData} getCustomerInfo={getCustomerInfo} />
            </div>
            <div className='d-flex justify-content-between custom-border-bottom-dashed mb-3'>
                <BioShippingAddress customerInfo={customerData.customerInfo} getCustomerInfo={getCustomerInfo} />
            </div>
            {customer?.registeredDoctorInfo?.status != "I" && <div key={customer?.registeredDoctorInfo?.status} className='d-flex justify-content-between custom-border-bottom-dashed mb-3'>
                <RegisteredDocInfo/>
            </div>}
        	<BioSubscriptions customerId={customerData.customerInfo.customerID} customerInfo={customerData?.customerInfo} isSubscribedMember={isSubscribedMember} history={history} />
            <div className='d-flex justify-content-between mt-4'>
                <div className='w-100'>
                    <p className='font-12 text-secondary mb-2'>Store Information </p>
                    <BioStoreInfo mobileNo={customerData.customerInfo.mobileNumber} />
                </div>
            </div>
    </React.Fragment>
    )
}

export default BioUser; 