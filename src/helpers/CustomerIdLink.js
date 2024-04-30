import React,{useContext} from 'react';
import { AlertContext } from '../components/Contexts/UserContext';
import { TOAST_POSITION , ALERT_TYPE} from '@medplus/react-common-components/DynamicForm';
import { existedCustomerData } from './CommonRedirectionPages';

const CustomerIdLink = ({customerId, fullName, className , anchorClassName}) => {
  const { setStackedToastContent } = useContext(AlertContext);

  const handleFailure = ({message}) => {
    setStackedToastContent({ toastMessage: message, position: TOAST_POSITION.BOTTOM_START , backgroundColor: ALERT_TYPE.DARK })
  }

  return (
      <React.Fragment>
        <div className={className} onClick={() => existedCustomerData({ customerId: customerId , fullName:fullName}, handleFailure)}>
          <a className={anchorClassName} href="javascript:void(0)" rel="noopener" aria-label={customerId} role="link">{customerId}</a>
        </div>
      </React.Fragment>
  )
}

export default CustomerIdLink
