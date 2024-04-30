import DynamicForm, { TOAST_POSITION, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useState } from 'react';
import CustomerService from '../../../services/Customer/CustomerService';
import { API_URL } from "../../../services/ServiceConstants";
import Validate from '../../../helpers/Validate';
import { Button, Modal } from 'react-bootstrap';
import edit_icon from '../../../images/edit_icon.svg'
import { UncontrolledTooltip } from 'reactstrap';
import { AlertContext, CustomerContext } from '../../Contexts/UserContext';
import ButtonWithSpinner from '../../Common/ButtonWithSpinner';
import CommonConfirmationModal from '../../Common/ConfirmationModel';

var base64 = require('base-64');

const BioShippingAddress = ({ helpers, formData, initialLoad, ...props }) => {

    const { shippingAddress } = props.customerInfo;

    const { address, locality, city, state, country, pincode, localityId, addressType } = shippingAddress;

    const [showComponentShipping, setShowComponentShipping] = useState(false);

    const [localitySuggestions, setLocalitySuggestions] = useState([]);

    const [buttonSpinner, setButtonSpinner] = useState(false);

    const [isConfirmationPopOver , setConfirmationPopOver] = useState(false);

    const validate = Validate();
    const {setStackedToastContent} = useContext(AlertContext)
    const {tokenId,customerId} = useContext(CustomerContext)


    function debounce(a, b, c) { var d, e; return function () { function h() { d = null, c || (e = a.apply(f, g)) } var f = this, g = arguments; return clearTimeout(d), d = setTimeout(h, b), c && !d && (e = a.apply(f, g)), e } };

    const setCard = () => {
        if (validate.isNotEmpty(shippingAddress)) {
            const fieldValues = { address, "locality": [locality], city, state, country, pincode, "customerId": customerId, "localityId": localityId ? localityId : 99999, addressType:addressType };
            helpers.updateSpecificValues(fieldValues, 'customerAddressForm');
            helpers.updateKeyValuesToAllFields("message","","customerAddressForm")
        }
    }

    const handleUpdateConfirmation = () => {
            updateShipping();
    };

    const updateShippingForm = async (formValues) => {
        const config = { data: formValues };
        try {
            const response = await CustomerService().updateShippingData(config);
            if (validate.isNotEmpty(response)) {
                if (response.statusCode === "FAILURE") {
                    setButtonSpinner(false);
                    setStackedToastContent({toastMessage: "Customer Address Updation failed,please try again", position:TOAST_POSITION.BOTTOM_START});
                } else if (response.statusCode === "SUCCESS") {
                    setButtonSpinner(false);
                    setStackedToastContent({toastMessage: "Customer Address Updated", position:TOAST_POSITION.BOTTOM_START})
                    props.getCustomerInfo();
                    setShowComponentShipping(false);
                }
            }
        } catch (err) {
            setButtonSpinner(false);
            console.log(err);
        }
    }

    const updateShipping = () => {
        setButtonSpinner(true);
        let formValues = helpers.validateAndCollectValuesForSubmit('customerAddressForm',true,true,true);
        if (validate.isEmpty(formValues)) {
            setButtonSpinner(false);
            return;
        } else {
            formValues.locality = formValues.locality[0];
            formValues.customerId = customerId;
            formValues.address = formValues.address;
            updateShippingForm(formValues);
        }
       
    }

    const prepareAndInsertOptions = (Obj, elementId) => {
        const options = [];
        for (const value of Obj) {
            options.push(helpers.createOption(value.placeId, value.location, value.location));
        }
        helpers.updateSingleKeyValueIntoField("values", options, elementId);
    }

    const suggestions = (payload) => {
        let searchText = payload[0].target.value;
        getLocalityAutoSuggestions(searchText);
    }

    const getLocalityAutoSuggestions = debounce(async (searchText) => {
        if (!(validate.isNotEmpty(searchText) && searchText.length > 0)) {
            setLocalitySuggestions([]);
        }
        if (validate.isNotEmpty(searchText) && searchText.trim().length >= 3) {
            let paramsObj = { localitySearchStr: base64.encode(searchText),tokenId: tokenId}
            try {
                const response = await CustomerService().getLocalityAutoSuggestions(paramsObj);
                if (validate.isNotEmpty(response) && response.statusCode === "SUCCESS") {
                    let topGoogleLocations = [];
                    for (const eachGoogleLocation of response.dataObject.suggestedLocations) {
                        let commaIndex = eachGoogleLocation.location.indexOf(",");
                        let location = eachGoogleLocation.location;
                        let address = "India";
                        if (location != undefined && location.indexOf(",") != -1) {
                            location = eachGoogleLocation.location.substring(0, commaIndex);
                            address = eachGoogleLocation.location.substring(commaIndex + 1, eachGoogleLocation.location.length);
                        }
                        eachGoogleLocation.mainLocation = location;
                        eachGoogleLocation.address = address;
                        topGoogleLocations.push(eachGoogleLocation);
                        if (topGoogleLocations.length >= 5) {
                            break;
                        }
                    }
                    if(validate.isNotEmpty(topGoogleLocations)){
                        prepareAndInsertOptions(topGoogleLocations, "locality");
                    }
                    setLocalitySuggestions(topGoogleLocations);
                } else if (response.statusCode === "FAILURE") {
                    console.log("Error: " + response.message);
                    setStackedToastContent({toastMessage: response.message});
                    setLocalitySuggestions([]);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }, 500);

    const setRestAddress = () => {
        if (validate.isNotEmpty(helpers.getHtmlElementValue("locality"))) {
            const displayValue = helpers.getHtmlElementValue("locality")[0];
            setSelectedLocality(displayValue);
        }
    }

    const setSelectedLocality = async (location) => {
        let locationObject = { location: location }
        let paramsObj = { locationInfo: JSON.stringify(locationObject), tokenId:tokenId }
        try {
            const response = await CustomerService().setSelectedLocality(paramsObj);
            if (validate.isNotEmpty(response) && validate.isNotEmpty(response.dataObject) && response.statusCode === "SUCCESS") {
                helpers.updateValue(response.dataObject.configId,'localityId')
                helpers.updateValue(response.dataObject.city, "city");
                helpers.updateValue(response.dataObject.state, "state");
                helpers.updateValue(response.dataObject.pincode, "pincode");
                helpers.updateValue('INDIA',"country");
            } else if (response.statusCode == "FAILURE") {
                console.log("Error: " + response.message);
                setStackedToastContent({toastMessage:"Unable to get locality data"})
            }
        } catch (err) {
            console.log(err);
        }
    }

    const observersMap = {
        'customerAddressForm': [['load', setCard]],
        'locality': [['change', suggestions], ['select', setRestAddress]],
    }

    const closeModal = () => {
        setShowComponentShipping(false);
    }

    const onHandleClick = () => {
        let formValues = helpers.validateAndCollectValuesForSubmit('customerAddressForm');
        if(validate.isEmpty(formValues)) {
            return;
        }
        if(validate.isEmpty(formValues.locality)) {
            helpers.updateErrorMessage("locality is mandatory", "locality");
            return;
        }
        if(isEqual(formValues)){
            setShowComponentShipping(false);
            return;
        }
        setConfirmationPopOver(true);
    }

    const isEqual = (formValues) => {
        if(formValues.address == address && 
            formValues.addressType == addressType && 
            formValues.city == city && 
            formValues.country == country && 
            formValues.locality[0] == locality && 
            formValues.localityId == localityId && 
            formValues.pincode == pincode && 
            formValues.state == state) {
            return true;
        }
        return false;
    }

    return (<React.Fragment>
        <div className='align-items-start d-flex justify-content-between w-100'>
            <div className='mb-3 col'>
                <div>
                {!showComponentShipping && 
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <p className='font-12 text-secondary mb-0'>Shipping Details </p>
                    <Button variant=' ' className='rounded-5 icon-hover btn-link' id="editShippingDetails" onClick={() => { setShowComponentShipping(!showComponentShipping) }}><img src={edit_icon} alt="edit Shipping details" /></Button>
                    <UncontrolledTooltip placement="bottom" target="editShippingDetails">
                        Edit Shipping Details
                    </UncontrolledTooltip>
                </div>
            }
                </div>
                {shippingAddress &&
                    <React.Fragment>
                        {validate.isNotEmpty(address) && <p className='mb-0 font-14'>{address}</p>}
                        <div className='text-secondary font-14'>
                            {(validate.isNotEmpty(locality) || validate.isNotEmpty(city) || validate.isNotEmpty(pincode)) && <p className='mb-0'>{locality} {city} {pincode} </p>}
                            {(validate.isNotEmpty(state) || validate.isNotEmpty(country)) && <p className='mb-0'> {state} {country} </p>}
                        </div>
                    </React.Fragment>
                }
            </div>
            {showComponentShipping && !isConfirmationPopOver && <Modal
                show={true}
                backdrop="static"
                onHide={() => { setShowComponentShipping(false) }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <div className='custom-border-bottom-dashed'>
                    <Modal.Header closeButton>
                        <Modal.Title className='h6'>Edit Shipping Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <DynamicForm requestUrl={`${API_URL}getShippingAddressForm`} helpers={helpers} requestMethod={'GET'} observers={observersMap} />
                    </Modal.Body>
                    <Modal.Footer className='d-flex flex-row-reverse gap-2 justify-content-center'>
                        {/* <Button className='px-4' onClick={() => { updateShipping() }}>Update</Button> */}
                        <ButtonWithSpinner showSpinner={buttonSpinner} disabled={buttonSpinner} className={'px-4' } onClick={() => onHandleClick()} buttonText={'Update'}></ButtonWithSpinner>
                        <Button variant=' ' disabled = {buttonSpinner} className='brand-secondary px-4' onClick = {()=> {closeModal()}} >Cancel</Button>
                    </Modal.Footer>
                </div>
            </Modal>}
            {isConfirmationPopOver && <CommonConfirmationModal small headerText={"Edit Shipping Address"} message="Are you sure, you want to update shipping address?" isConfirmationPopOver={isConfirmationPopOver} setConfirmationPopOver={setConfirmationPopOver} buttonText={"Yes"} onSubmit={() => handleUpdateConfirmation()} />}
            
        </div>
    </React.Fragment>
    )
}

export default withFormHoc(BioShippingAddress); 