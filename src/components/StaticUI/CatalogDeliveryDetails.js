import React from "react";
const CatalogDeliveryDetails = (props) => {
    return (
        <React.Fragment>
            <div className="p-12">
                <p className="custom-fieldset mb-2">Delivery Details -
                    <span className="text-red ms-1">Order {props.order}</span>
                </p>
                <div className="d-flex justify-content-between">
                    <div className="col-4">
                        <p className="mb-0 text-secondary font-14">Store Id</p>
                        <p className="font-weight-bold mb-2">MedPlus Mart Madhapur</p>
                        <p className="font-14 text-secondary">D.No.1-101, Ground Floor, Madhapur Village, Sherilingampally Madal, Rangareddy</p>
                    </div>
                    <div className="col-5">
                        <p className="mb-0 text-secondary font-14">Shipping Address</p>
                        <p className="font-weight-bold mb-2">Sampath Kumar Cg</p>
                        <p className="font-14 text-secondary">Flat No 102, Siri Nivas Apartment, Street No 5, Balaji Nagar Colony, P, 15,16,17, Chenchu Guda, Kukatpally, Hyderabad, Telangana, 500072, 4666870341</p>
                    </div>
                    <div className="col-3">
                        <p className="mb-0 text-secondary font-14">Date & Time</p>
                        <p className="font-weight-bold mb-2">Jan 29, 2024 - 2PM</p>
                      
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}
export default CatalogDeliveryDetails