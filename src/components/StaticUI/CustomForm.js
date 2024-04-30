import React from "react";
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const CustomForm = () => {
    return (
        <React.Fragment>
            <React.Fragment>
                <Card className='h-100'>
                    <Card.Header>Customer Prescription</Card.Header>
                    <Card.Body>
                        <Form.Group className="row custom-form-label g-2 mb-2" controlId="Reasons">
                            <Form.Label className="font-weight-bold custom-fieldset">Reasons for Cancellation</Form.Label>
                            <FloatingLabel
                                controlId="customReasons"
                                label="Reasons">
                                <Form.Control type="text" placeholder=' ' />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="customComments"
                                label="Comments">
                                <Form.Control type="textarea" style={{ 'height': '100px' }} placeholder=' ' />
                            </FloatingLabel>
                            <Form.Group className="d-flex justify-content-end mt-3">
                                <Button role="button" aria-label="Cancel Prescription" variant=" " className='brand-secondary btn-sm'>Cancel Prescription</Button>
                            </Form.Group>
                        </Form.Group>
                        <Form.Group className="row custom-form-label g-2 mb-2" controlId="CustomerSms">
                            <Form.Label className="font-weight-bold custom-fieldset">Customer SMS</Form.Label>
                            <FloatingLabel
                                controlId="CustomerSms"
                                label="Select an SMS">
                                <Form.Control type="text" placeholder=' ' />
                            </FloatingLabel>
                            <Form.Group className="d-flex justify-content-end mt-3">
                                <Button role="button" aria-label="Send SMS" variant=" " className='brand-secondary btn-sm'>Send SMS</Button>
                            </Form.Group>
                        </Form.Group>

                    </Card.Body>
                    <Card.Footer>
                        <div className="d-grid">
                            <Button role="button" aria-label="Shop Prescription Products" variant="brand" size="sm">Shop Prescription Products</Button>
                        </div>
                    </Card.Footer>
                </Card>
            </React.Fragment>
        </React.Fragment>
    )
}
export default CustomForm