import DynamicForm from "@medplus/react-common-components/DynamicForm";
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import Validate from "../../../../../helpers/Validate";
import CheckoutService from "../../../../../services/Checkout/CheckoutService";
import { CustomerContext, LocalityContext } from "../../../../Contexts/UserContext";
const obj = {
	"htmlElementType": "FORM",
	"id": "deliveryForm",
	"label": null,
	"name": null,
	"value": null,
	"className": null,
	"readOnly": false,
	"disabled": false,
	"autofocus": false,
	"required": false,
	"style": null,
	"attributes": null,
	"message": null,
	"htmlActions": null,
	"elementSize": null,
	"defaultValue": null,
	"helperText": null,
	"labelClassName": null,
	"htmlGroups": [
		{
			"htmlElementType": "ELEMENTGROUP",
			"id": "group1",
			"label": null,
			"name": null,
			"value": null,
			"className": "row g-3",
			"readOnly": false,
			"disabled": false,
			"autofocus": false,
			"required": false,
			"style": null,
			"attributes": null,
			"message": null,
			"htmlActions": null,
			"elementSize": null,
			"defaultValue": null,
			"helperText": null,
			"labelClassName": null,
			"groups": null,
			"groupElements": [
				{
					"htmlElementType": "INPUT",
					"id": "firstName",
					"label": "Customer Name",
					"name": null,
					"value": null,
					"className": null,
					"readOnly": false,
					"disabled": true,
					"autofocus": false,
					"required": true,
					"style": null,
					"attributes": null,
					"message": null,
					"htmlActions": null,
					"elementSize": null,
					"helperText": null,
					"labelClassName": "col-12 col-lg-4",
					"type": "text",
					"placeholder": null,
					"hidden": false
				},
				{
					"htmlElementType": "INPUT",
					"id": "receiversName",
					"label": "Receiver's Name",
					"name": null,
					"value": null,
					"className": null,
					"readOnly": false,
					"disabled": false,
					"autofocus": false,
					"required": false,
					"style": null,
					"attributes": { 'autocomplete': 'off' },
					"message": null,
					"htmlActions": null,
					"elementSize": null,
					"helperText": null,
					"labelClassName": "col-12 col-lg-4",
					"type": "text",
					"placeholder": null,
					"hidden": false,
					"regex": "^[a-zA-Z][a-zA-Z ]*$",
					"maxlength": 45,
				},
				{
					"htmlElementType": "INPUT",
					"id": "medplusId",
					"label": "MedPlus ID",
					"name": null,
					"value": null,
					"className": null,
					"readOnly": false,
					"disabled": true,
					"autofocus": false,
					"required": true,
					"style": null,
					"attributes": null,
					"message": null,
					"htmlActions": null,
					"elementSize": null,
					"helperText": null,
					"labelClassName": "col-12 col-lg-4",
					"type": "text",
					"placeholder": null,
					"hidden": false
				},
				{
					"htmlElementType": "INPUT",
					"id": "addressLine1",
					"label": "Address",
					"name": null,
					"value": null,
					"className": null,
					"readOnly": false,
					"disabled": false,
					"autofocus": false,
					"required": false,
					"style": null,
					"attributes": { 'autocomplete': 'off' },
					"message": null,
					"htmlActions": null,
					"elementSize": null,
					"helperText": null,
					"labelClassName": "col-12",
					"type": "text",
					"placeholder": null,
					"hidden": false,
					"maxlength": 300,
				},
				{
					"htmlElementType": "INPUT",
					"id": "city",
					"label": "City",
					"name": null,
					"value": null,
					"className": null,
					"readOnly": false,
					"disabled": true,
					"autofocus": false,
					"required": true,
					"style": null,
					"attributes": null,
					"message": null,
					"htmlActions": null,
					"elementSize": null,
					"helperText": null,
					"labelClassName": "col-12 col-lg-4",
					"type": "text",
					"placeholder": null,
					"hidden": false
				},
				{
					"htmlElementType": "INPUT",
					"id": "state",
					"label": "State",
					"name": null,
					"value": null,
					"className": null,
					"readOnly": false,
					"disabled": true,
					"autofocus": false,
					"required": true,
					"style": null,
					"attributes": null,
					"message": null,
					"htmlActions": null,
					"elementSize": null,
					"helperText": null,
					"labelClassName": "col-12 col-lg-4",
					"type": "text",
					"placeholder": null,
					"hidden": false
				},
				{
					"htmlElementType": "INPUT",
					"id": "pincode",
					"label": "Pincode",
					"name": null,
					"value": null,
					"className": null,
					"readOnly": false,
					"disabled": true,
					"autofocus": false,
					"required": true,
					"style": null,
					"attributes": null,
					"message": null,
					"htmlActions": null,
					"elementSize": null,
					"helperText": null,
					"labelClassName": "col-12 col-lg-4",
					"type": "text",
					"placeholder": null,
					"hidden": false
				},
				{
					"htmlElementType": "INPUT",
					"id": "emailID",
					"label": "Email ID",
					"name": null,
					"value": null,
					"className": null,
					"readOnly": false,
					"disabled": true,
					"autofocus": false,
					"required": false,
					"style": null,
					"attributes": null,
					"message": null,
					"htmlActions": null,
					"elementSize": null,
					"helperText": null,
					"labelClassName": "col-12 col-lg-4",
					"type": "text",
					"placeholder": null,
					"hidden": false
				},
				{
					"htmlElementType": "INPUT",
					"id": "mobileNo",
					"label": "Mobile Number",
					"name": null,
					"value": null,
					"className": null,
					"readOnly": false,
					"disabled": false,
					"autofocus": false,
					"required": false,
					"style": null,
					"attributes": { 'autocomplete': 'off' },
					"message": null,
					"htmlActions": null,
					"elementSize": null,
					"helperText": null,
					"labelClassName": "col-12 col-sm-6 col-lg-4",
					"type": "text",
					"placeholder": null,
					"hidden": false,
					"maxlength": 10,
				},
				{
					"htmlElementType": "RADIO",
					"id": "cardOrder",
					"label": "Card Order",
					"name": null,
					"value": null,
					"className": "col-12 ps-4 ps-sm-2 col-sm-6 col-lg-4",
					"readOnly": false,
					"disabled": false,
					"autofocus": false,
					"required": false,
					"style": null,
					"attributes": null,
					"message": null,
					"htmlActions": null,
					"elementSize": null,
					"defaultValue": "N",
					"helperText": null,
					"labelClassName": "d-flex text-muted mb-0 font-12",
					"values": [
						{
							"htmlElementType": "OPTION",
							"id": "rcmYesOption",
							"label": "Yes",
							"name": "",
							"value": "Y",
							"className": null,
							"readOnly": false,
							"disabled": false,
							"autofocus": false,
							"required": false,
							"style": null,
							"attributes": null,
							"message": null,
							"htmlActions": null,
							"elementSize": null,
							"defaultValue": null,
							"helperText": null,
							"labelClassName": null,
							"displayValue": "Yes",
							"selected": false,
							"hidden": false
						},
						{
							"htmlElementType": "OPTION",
							"id": "rcmNoOption",
							"label": "No",
							"name": "",
							"value": "N",
							"className": null,
							"readOnly": false,
							"disabled": false,
							"autofocus": false,
							"required": false,
							"style": null,
							"attributes": null,
							"message": null,
							"htmlActions": null,
							"elementSize": null,
							"defaultValue": null,
							"helperText": null,
							"labelClassName": null,
							"displayValue": "No",
							"selected": false,
							"hidden": false
						}
					],
					"hidden": false
				},
				{
					"htmlElementType": "DATALIST",
					"id": "customerStoreId",
					"label": "customer Store ID",
					"name": null,
					"value": null,
					"dataListClassName": "custom-datagrid",
					"multiple": false,
					"readOnly": false,
					"disabled": false,
					"autofocus": false,
					"required": false,
					"style": null,
					"attributes": null,
					"message": null,
					"htmlActions": null,
					"elementSize": null,
					"helperText": null,
					"labelClassName": "col-12",
					"type": "text",
					"placeholder": null,
					"hidden": false,
				},
			]
		},
	],
	"notes": null,
	"atleastOneFieldRequired": false,
	"submitDisabled": false,
	"hidden": false
}
const HomeDelivery = forwardRef((props,ref) => {
	const { helpers } = props;
	

	const { martLocality } = useContext(LocalityContext);
	const { customer, customerId } = useContext(CustomerContext);
	const [cardOrder, setCardOrder] = useState(undefined);

	const validate = Validate();
	const checkoutService = CheckoutService();

	useEffect(() => {
		getCustomerCartOrderStoreId();
	}, []);

	useImperativeHandle(ref, () => ({
		validateRequiredFields
	  }));

	const getCustomerCartOrderStoreId = () => {
		const config = { headers: { customerId: customerId } };
		checkoutService.getCustomerCartOrderStoreId(config).then((response) => {
			if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.dataObject)) {
				let customerStoreDetails = response.dataObject.deliverableStoresDetails;
				let prevSelectedCustomerStoreId = response.dataObject.prevSelectedStoreId;
				let storeIds = [];
				let prevSelectedCustomerStore = "";
				Object.entries(customerStoreDetails).map((key) => {
					let customerStore = "";
					if (key[0] == martLocality.hubId) {
						prevSelectedCustomerStore = key[0];
						customerStore = key[0]+"(Hub Id)" + "-" + key[1];
					} else {
						customerStore = key[0] + "-" + key[1];
					}
					const options = helpers.createOption(key[0], customerStore, key[0]);
					storeIds.push(options)
				})
				helpers.updateSingleKeyValueIntoField("values", storeIds, "customerStoreId");
				helpers.updateValue([prevSelectedCustomerStore] , "customerStoreId");
			}
		}).catch((error) => {
			console.log("error is " + error);
		})
	}

	const prepareCustomerName = () => {
		return (customer.firstName != null && customer.lastName!=null) ? customer.firstName + " " + customer.lastName : (customer.firstName!=null ? customer.firstName : (customer.lastName!=null? customer.lastName : ""))
	}

	const onFormLoad = () => {
		if (validate.isNotEmpty(martLocality) && validate.isNotEmpty(customer)) {
			helpers.updateValue(martLocality.state, "state");
			helpers.updateValue(martLocality.city, "city");
			helpers.updateValue(martLocality.pincode, "pincode");
			helpers.updateValue(prepareCustomerName(), "firstName");
			helpers.updateValue(customer.firstName!=null ? customer.firstName : (customer.lastName != null ? customer.lastName : ""), "receiversName");
			helpers.updateValue(customer.emailId, "emailID");
			helpers.updateValue(customer.mobileNumber, "mobileNo");
			helpers.updateValue(customer.customerID, "medplusId");
		}
	}

	const validateRequiredFields = () => {

		const homeDeliverySearchCriteria = helpers.validateAndCollectValuesForSubmit("deliveryForm");
		if(validate.isEmpty(homeDeliverySearchCriteria)) {
			return false;
		}
		if(!handleReceiversName() || !handleAddressLine() || !handleMobileNumber()) {
			return false;
		}
		prepareHomeDeliveryDetails();
		return true;
	}

	const handleMobileNumber = () => {
		const errorMessage = validate.mobileNumber(helpers.getHtmlElementValue("mobileNo"));
		if(validate.isNotEmpty(errorMessage)) {
			helpers.updateErrorMessage(errorMessage,"mobileNo");
			return false;
		}
		return true;
	}

	const handleAddressLine = () => {
		if(validate.isEmpty(helpers.getHtmlElementValue("addressLine1"))) {
			helpers.updateErrorMessage("Please Enter Valid Address","addressLine1");
			return false;
		}
		return true;
	}

	const handleReceiversName = () => {
		if(validate.isEmpty(helpers.getHtmlElementValue("receiversName"))) {
			helpers.updateErrorMessage("Please Enter Valid Receiver's Name","receiversName");
			return false;
		}
		return true;
	}

	const handleCardOrder = (payload) => {
		helpers.updateValue(payload[0].target.value, "cardOrder");
		setCardOrder(payload[0].target.value);
	}
	

	const prepareHomeDeliveryDetails = () => {

		let fieldsIds = [];
		fieldsIds.push("receiversName");
		fieldsIds.push("addressLine1");
		fieldsIds.push("mobileNo");
		const homeDeliveryDetails = helpers.collectSpecificFieldValues("deliveryForm", fieldsIds);
		const deliveryDetails = {
			"address" : JSON.stringify(homeDeliveryDetails),
			"deliveryType" : "D",
			"customerStoreId" : helpers.getHtmlElementValue("customerStoreId"),
			"isCardOrder" : helpers.getHtmlElementValue("cardOrder"),
		}
		
		props.homeDeliveryInfo.current = deliveryDetails;
	}

	const observersMap = {
		"deliveryForm": [["load", onFormLoad]],
		"mobileNo" : [['blur', handleMobileNumber]],
		"addressLine1" : [['blur', handleAddressLine]],
		"receiversName" : [['blur', handleReceiversName]],
		"cardOrder": [['change', handleCardOrder]],
	}

	return (
		<DynamicForm formJson={obj} helpers={helpers} observers={observersMap} />
	)
});

export default  HomeDelivery;
