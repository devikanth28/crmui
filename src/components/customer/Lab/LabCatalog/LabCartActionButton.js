import React, { useContext, useState } from 'react';
import { AlertContext, CustomerContext } from '../../../Contexts/UserContext';
import LabOrderService from '../../../../services/LabOrder/LabOrderService';
import { isResponseSuccess } from '../../../../helpers/CommonHelper';
import ButtonWithSpinner from '../../../Common/ButtonWithSpinner';
import { getCustomerRedirectionURL } from '../../CustomerHelper';
import { LAB_ORDER } from '../../Constants/CustomerConstants';
import Validate from '../../../../helpers/Validate';
import { Roles } from '../../../../constants/RoleConstants';
import useRole from '../../../../hooks/useRole';
import { prepareRequestFrom } from '../../../../helpers/HelperMethods';

function LabCartActionButton(props) {
    const isaddedToCart = props.isaddedToCart;
    const testCode = props.testCode;
    const [isPathlabAgent, isFrontOfficeOrderCreate] = useRole([Roles.ROLE_CRM_PHLEBOTOMIST_PATHLAB_AGENT, Roles.ROLE_CRM_LAB_FRONT_OFFICE_ORDER_CREATE]);
    const { customerId } = useContext(CustomerContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const [loading, setLoading] = useState(false);
    const handleLabCartACtionButton = () => {
        const requestFrom = prepareRequestFrom(isPathlabAgent, isFrontOfficeOrderCreate);
        const config = { headers: { customerId: customerId }, params: { testId: testCode, customerId: customerId, requestFrom: requestFrom } }
        setLoading(true);
        props.setAddToCartLoading(true);
        if (!isaddedToCart) {
            addTestToCart(config);
        } else {
            removeTestFromCart(config);
        }
    }
    
    const addTestToCart = (config) => {
        LabOrderService().addTestToCart(config).then((response) => {
            if (isResponseSuccess(response) && response.responseData) {
                if (props.handleCallback) {
                    props.handleCallback(response);
                }
            } else {
                setStackedToastContent({ toastMessage: response?.message ? response.message : "something went wrong" });
            }
            setLoading(false);
            props.setAddToCartLoading(false);
        }).catch((error) => {
            setLoading(false);
            props.setAddToCartLoading(false);
            setStackedToastContent({ toastMessage: "Unable to add test to cart!" })
            console.log(error);
        });

    }
    const removeTestFromCart = (config) => {
        LabOrderService().removeTestFromCart(config).then((response) => {
            if (isResponseSuccess(response) && response.responseData) {
                if (props.handleCallback) {
                    props.handleCallback(response);
                }
            } else {
                setStackedToastContent({ toastMessage: response?.message ? response.message : "something went wrong" });
                if (props.history) {
                    setTimeout(() => {
                        props.history.push(getCustomerRedirectionURL(customerId, LAB_ORDER))
                    }, 3000)
                }
                if (props.handleCallback) {
                    props.handleCallback(response);
                }
            }
            setLoading(false);
            props.setAddToCartLoading(false);
        }).catch((error) => {
            setLoading(false);
            props.setAddToCartLoading(false);
            setStackedToastContent({ toastMessage: "Unable to remove test form cart!" })
            console.log(error);
        });
    }
    return (
        <>
            {(isaddedToCart && Validate().isNotEmpty(props.removeBtn)) ?
                <ButtonWithSpinner disabled={props.addToCartLoading} style={props.removeBtnStyle} variant={props.variant ? props.variant : ""} showSpinner={loading} className={props.removeBtnClass ? props.removeBtnClass : "icon-hover"} onClick={() => { handleLabCartACtionButton() }} buttonText={props.removeBtn}></ButtonWithSpinner>
                :
                <ButtonWithSpinner disabled={props.addToCartLoading} style={props.addBtnStyle} variant={props.variant ? props.variant : ""} showSpinner={loading} className={props.addBtnClass} onClick={() => { handleLabCartACtionButton() }} buttonText={isaddedToCart ? "Added" : props.addBtn}></ButtonWithSpinner>
                }
        </>
    );
}

export default LabCartActionButton;