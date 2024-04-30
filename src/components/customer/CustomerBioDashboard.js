import React from "react";
import { CardBody } from "react-bootstrap";
import { Card, CardHeader, FormGroup, Input } from "reactstrap";
import DocumentUpload from "@medplus/react-common-components/DocumentUpload"

const CustomerBioDashboard = () => {

    return (
        <React.Fragment>
            <div className="custom-model-filter-container">
                <div>
                <h4 className="h6 custom-fieldset mb-2">Dashboard</h4>
                <div className="row g-2">
                    <div className="col">
                        <Card>
                            <CardHeader className="bg-white">
                                Points history
                            </CardHeader>
                            <CardBody className="row text-center">
                                <div className="col">
                                    <p className="mb-0 text-secondary">Locality Points</p>
                                    <p className="mb-0">00</p>
                                </div>
                                <div className="col">
                                    <p className="mb-0 text-secondary">Payback Points</p>
                                    <p className="mb-0">00</p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col">
                        <Card>
                            <CardHeader className="bg-white">
                                Order history
                            </CardHeader>
                            <CardBody className="row text-center">
                                <div className="col">
                                    <p className="mb-0 text-secondary">Total Mart Orders</p>
                                    <p className="mb-0">00</p>
                                </div>
                                <div className="col">
                                    <p className="mb-0 text-secondary">Recent Mart Order ID</p>
                                    <p className="mb-0">OKAMM2300411154</p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
                </div>

                <div className="my-2">
                <h4 className="h6 custom-fieldset mb-2">Change Mobile Number</h4>
                <div className="row g-2">
                    <div className="col">
                        <Card>
                            <CardHeader className="bg-white">
                                <div className="row g-3">
                                    <div className="col">
                                        <FormGroup check>
                                            <Input type="radio" className="me-2" />
                                            With Existing Mobile Number                                            
                                        </FormGroup>
                                    </div>
                                    <div className="col">
                                        <FormGroup check>
                                            <Input type="radio" className="me-2" />
                                            With New Mobile Number                                           
                                        </FormGroup>
                                    </div>
                                    <div className="col">
                                        <FormGroup check>
                                            <Input type="radio" className="me-2" />
                                            Customer KYC                                            
                                        </FormGroup>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody className="row text-center" style={{ minHeight: "5rem" }}>
                            </CardBody>
                        </Card>
                    </div>
                </div>
                </div>

                <div className="my-2">
                <h4 className="h6 custom-fieldset mb-2">Create Prescription Order</h4>
                <DocumentUpload onErrorResponse={() => { }} onSuccessResponse={() => {  }} onDeleteResponse={() => { }} fileSelectOption={true} documentScanOption={true} />
                </div>
            </div>
        </React.Fragment>
    );
};

export default CustomerBioDashboard;