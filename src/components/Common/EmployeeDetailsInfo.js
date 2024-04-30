import React from "react";
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
const EmployeeDetailsInfo = (props)=>{
    return (
        <React.Fragment>
            <Modal centered isOpen={props.employeeDetails} toggle={()=>{props.setEmployeeDetails(!props.employeeDetails)}}>
                <ModalHeader className="p-2" toggle={()=>{props.setEmployeeDetails(!props.employeeDetails)}}>
                    Claimed Employee Details
                </ModalHeader>
                <ModalBody className="p-2">
                    <div className="row">
                        <div className="col">
                            <div class="form-floating">
                                <input aria-label="Employee Name" type="text" readonly="" id="Employee Name" class="form-control-plaintext" value="Sampath"/>
                                <label for="Employee Name">Employee Name</label>
                            </div>
                        </div>
                        <div className="col">
                            <div class="form-floating">
                                <input aria-label="Employee Id" type="text" readonly="" id="Employee Id" class="form-control-plaintext" value="MED-00900990"/>
                                <label for="Employee Id">Employee Id</label>
                            </div>
                        </div>
                        <div className="col">
                            <div class="form-floating">
                                <input aria-label="HRMS Id" type="text" readonly="" id="HRMS Id" class="form-control-plaintext" value="o25857"/>
                                <label for="HRMS Id">HRMS Id</label>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                {/* <ModalFooter className="p-2 justify-content-center">
                    <button type="button" class="btn brand-secondary btn-sm px-4">Clear</button>
                    <button type="button" class="btn btn-brand btn-sm px-4">Submit</button>

                </ModalFooter> */}
            </Modal>     
        </React.Fragment>
    )
}
export default EmployeeDetailsInfo