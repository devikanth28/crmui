import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useState } from 'react';
import { AlertContext } from '../components/Contexts/UserContext';
import CustomerService from '../services/Customer/CustomerService';
import FormHelpers from './FormHelpers';
import Validate from './Validate';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

const SendSmsToCustomer = ({ helpers, ...props }) => {
    const {orderType , refillId , customerId , displayOrderId, customerName , mobileNo} = props;
    const {setStackedToastContent} = useContext(AlertContext);
    const [smsOptions, setSmsOptions] = useState({});
    const [selectedOption, setSelectedOption] = useState();

    let sendSmsObject = {
        'mobileNo': mobileNo,
        'prescriptionId': displayOrderId,
        'customerId': customerId,
        'customerName': customerName,
    };

    useEffect(() => {
        if (Validate().isNotEmpty(orderType)) {
            switch (orderType) {
                case "MART":
                    setSmsOptions({
                        'Corona19': 'Corona_19',
                        'customerNotResponding': 'Customer is not reachable/responding',
                        'prescrNotValid': 'Prescription not valid/available',
                        'wrongLocation': 'Wrong Pincode/Location',
                        'serviceNotAvailable': 'Service not available',
                        'orderCannotProcessed': 'Order cannot be processed',
                        'paymentFailed': 'Payment failed-COD Available',
                        'omsOrderEdited': 'Products Not Available(Edited)',
                        'paymentFailedCODNotAvailable': 'Payment failed-COD Not Available',
                        'multipleOrder': 'Multiple Order'
                    });
                    if (Validate().isNotEmpty(refillId)) {
                        setSmsOptions({ ...smsOptions, 'refillOrderCustomerNotResponding': 'Refill-Customer is not reachable/responding' });
                    }
                    break;

                case "PRESCRIPTION":
                    setSmsOptions({
                        'Corona19': 'Corona_19',
                        'alertSMS': 'Send Alert Message',
                        'noCOD': 'No COD Available',
                        'notResponding': 'Customer is not reachable/responding',
                        'notValidPresc': 'Prescription not valid',
                        'multipleUpload': 'Identical/Multiple uploads',
                        'pharmaSaleNotAllowedd': 'Pharma Sale not allowed',
                        'alreadyPlacedOrder': 'Already Placed order, hence cancelled',
                        'cannotDispenceOnline': 'Can\'t Dispence onlines',
                        'moreThan24hrsCustomerNotResponded': 'More than 24 hrs customer not responded',
                        'requestedByCustomer': 'Requested by customer'
                    });
                    break;

                case "LAB":
                    setSmsOptions({
                        'customerNotResponding': 'Customer is not reachable/responding',
                        'serviceNotAvailable': 'Service not available',
                        'paymentFailed': 'Payment failed-COD Available',
                        'paymentFailedCODNotAvailable': 'Payment failed-COD Not Available',
                    });
                    break;

                case "CRM":
                    setSmsOptions({
                        'customerNotResponding' : 'Customer is not reachable/responding',
                        'serviceNotAvailable':  'Service not available',
                        'orderCannotProcessed' : 'Order cannot be processed',
                        'omsOrderEdited' : 'Products Not Available(Edited)'
                    });
                    break;

                case "CRM_WITH_REFILL":
                    setSmsOptions({
                            'customerNotResponding' : 'Customer is not reachable/responding',
                            'serviceNotAvailable':  'Service not available',
                            'orderCannotProcessed' : 'Order cannot be processed',
                            'omsOrderEdited' : 'Products Not Available(Edited)',
                            'refillOrderCustomerNotResponding' : 'Refill-Customer is not reachable/responding'
                    })
                    break;

                default:
                    break;
            }
        }

    }, [orderType])

    useEffect(() => {
        if(Validate().isNotEmpty(smsOptions)){
            helpers.addForm(FormHelpers().getSelectSmsForm(smsOptions, helpers));
        }
    }, [smsOptions])

    const sendSmsToCustomer = () => {
        if (Validate().isEmpty(selectedOption)) {            
            setStackedToastContent({toastMessage:"Please select a message to send SMS"});
            return false;
        }
        sendSmsObject = { ...sendSmsObject, 'smsTemplate': selectedOption, 'orderType': orderType }
        sendSms(sendSmsObject);
    }

    const sendSms = async (sendSmsObject) => {
        if (Validate().isNotEmpty(sendSmsObject)) {
            const data = await CustomerService().sendSms(sendSmsObject).then(data => {
                if (data && data.statusCode === "SUCCESS") {
                    setStackedToastContent({toastMessage:"SMS sent successfully!"});
                    helpers.updateValue(null, "smsSelected", false);
                } else {
                    setStackedToastContent({toastMessage:"error while sending sms, please try again"});
                    console.log("error while sending sms, please try again")
                }
            }).catch((err) => {
                console.log(err)
            });
            return data;
        }
    }

    return (
        <React.Fragment>
            <Dropdown>
                <Dropdown.Toggle variant="outline-dark" className='btn-sm' id="dropdown-basic">
                    Select SMS
                </Dropdown.Toggle>

                <Dropdown.Menu className='pb-0'>

                    <div style={{width:"max-content"}}>
                        {smsOptions && Object.entries(smsOptions).map(([key, value]) => {
                        
                            return  (
                            <React.Fragment>
                                <div className='px-3 sendItem py-2 border-bottom' onClick={() => setSelectedOption(key)}>
                                <Form.Check
                                    type={"radio"}
                                    id={`${key}`}
                                    label={`${value}`}
                                    name="SendSmsOptions"
                                    className='font-14 mb-0'
                                    style={{paddingTop:"2px"}}
                                    checked={selectedOption == key}
                                />
                                </div>

                            </React.Fragment>
                            )
                        })}
                    </div>
                    {/* <Dropdown.Divider className='mb-0'/> */}
                    <Dropdown.Item className='btn btn-sm text-center py-2 text-success' as="button" onClick={()=>{sendSmsToCustomer()}}>Send SMS</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>        </React.Fragment>
    )
}

export default withFormHoc(SendSmsToCustomer);
