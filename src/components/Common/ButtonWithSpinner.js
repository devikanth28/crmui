import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import React from 'react';
import { Button } from 'react-bootstrap';

function ButtonWithSpinner({showSpinner,className,onClick,buttonText,...props}) {
    return (
        <Button style={props.style ? props.style : {}} id={props.id} size={props.size} disabled={props.disabled || showSpinner} variant={props.variant} className={className} onClick={(e) => { onClick() }} >{showSpinner ? <CustomSpinners spinnerText={buttonText ? buttonText : ""} className={"spinner-position"} innerClass={"invisible"} />: <>{buttonText}</>} </Button>
    );
}

export default ButtonWithSpinner;