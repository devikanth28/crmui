import Validate from "../../../../helpers/Validate";

export default (props) => {

	const validate = Validate();

	if(validate.isEmpty(props.pickStoreDetails) && validate.isEmpty(props.shipmentOmsAddress)) {
		return <></>
	}

	return (
		<div className="d-flex justify-content-between">
			<div className={`card p-12 ${props?.fullWidthRequired ? "col-12" : "col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 col-xxl-5"}`}>
				<p className="mb-0 text-secondary font-14">
					{validate.isNotEmpty(props.pickStoreDetails) ? "Store ID" : "Shipping Address"}
				</p>
				{ validate.isNotEmpty(props.pickStoreDetails) && <>
					<p className="font-weight-bold mb-2">{props.pickStoreDetails.name_s}</p>
					<p className="font-14 text-secondary">{props.pickStoreDetails.address_s}</p>
				</> }
				{ validate.isNotEmpty(props.shipmentOmsAddress) && <>
					<p className="font-weight-bold mb-2">{props.shipmentOmsAddress.firstName}</p>
					<p className="font-14 text-secondary">{(props.shipmentOmsAddress?.addressLine1 ? props.shipmentOmsAddress.addressLine1 +", " : "") + (props.shipmentOmsAddress?.addressLine2 ? props.shipmentOmsAddress.addressLine2 +", " : "") + (props.shipmentOmsAddress?.city ? props.shipmentOmsAddress.city+", " : " ") + (props.shipmentOmsAddress?.state ? props.shipmentOmsAddress.state +", ":"") + (props.shipmentOmsAddress?.pinCode ? props.shipmentOmsAddress.pinCode + ", ": "") + (props.shipmentOmsAddress?.shippingMobileNo ? props.shipmentOmsAddress.shippingMobileNo :"")}</p>
				</>}
			</div>
		</div>
	);
};
