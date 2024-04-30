import LocalitySearchComponent from '@medplus/react-common-components/LocalitySearchComponent';
import React from 'react';

const LocalityElement = (props) => {
    return (
    <React.Fragment>
    <LocalitySearchComponent defaultAddress={props.defaultAddress} displayFullAddress="true" customerId={props.customerId}/>
    </React.Fragment>
    )
   
}

export default LocalityElement;
