import React from "react"
import { Wrapper, BodyComponent } from "./Common/CommonStructure";
import CRMBanner from '../images/crm-amico.svg'
import { Button } from "react-bootstrap";

export default (props) =>{
    return <React.Fragment>
        <Wrapper>
            <BodyComponent> 
                <div className="row g-0 h-100">
                    <div className="col-12 col-lg-5 col-md-12 col-sm-12 col-xl-5 col-xxl-5">
                        <div className="d-flex flex-column h-100 justify-content-between">
                            <div className="ms-3 ms-lg-5 mt-3 mt-lg-5">
                                <p className="mb-0 text-secondary">Welcome to</p>
                                <h1>
                                    <span className="h4 fw-light mb-0">Customer RelationShip</span> 
                                    <span className="font-weight-bold d-block h1" style={{'font-size':"2.81rem"}}>Management</span>
                                </h1>
                                <p className="mb-0 text-secondary">We put the needs of our customers first!</p>
                            </div>
                            <div className="d-lg-none mx-3">
                                <img src={CRMBanner} className="img-fluid" alt="Inovice Banner"/>                    
                            </div>
                            <div className="d-flex align-items-center mb-3 ms-3 mb-lg-5 ms-lg-5">
                                <p className="mb-0 text-secondary me-3">Let’s begin the journey</p>
                                <Button variant="brand">Start Exploring</Button>{' '}
                            </div>
                        </div>
                    </div>
                    <div className="col-7 d-none bg-light d-lg-flex align-items-center justify-content-center">
                        <img src={CRMBanner} alt="Inovice Banner" />
                    </div>
                </div>
            </BodyComponent>
        </Wrapper>
    </React.Fragment>
}