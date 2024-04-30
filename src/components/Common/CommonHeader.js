import React from 'react'
import { Button } from 'react-bootstrap';
import CloseIcon from '../../images/cross.svg';
const CommonHeader = (props) => {
    return (
        <div className="d-flex justify-content-between border-bottom mb-3">
            <h6 className="title m-3"> Order Details for OrderId: OTGMM2202841079 (5000159) INAPHYD00384 [PBTA-OHS-HYD-INVENTORY]
                <span class="badge-created badge rounded-pill bg-primary ms-3">Created</span>
            </h6>
            <div class=" d-flex align-items-center">
                <a href="javascript:void(0)" title="previous Order" class="btn mr-2 my-0 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <g transform="translate(-868.477 786) rotate(-90)">
                            <rect fill="none" width="24" height="24" transform="translate(762 868.477)"></rect>
                            <path fill="#080808" d="M61.848,465.874l-5.541,5.541a1.256,1.256,0,1,0,1.776,1.776l4.653-4.64,4.655,4.655a1.261,1.261,0,0,0,2.149-.888,1.248,1.248,0,0,0-.373-.888l-5.543-5.556A1.26,1.26,0,0,0,61.848,465.874Z" transform="translate(711.498 410.651)"></path>
                        </g>
                    </svg>
                    <span class="ms-2">Previous Order</span>
                </a>
                <a href="javascript:void(0)" title="next Order" class="btn ml-2 my-0 ">
                    <span class="me-2">Next Order</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <g transform="translate(-906.838 786) rotate(-90)">
                            <rect fill="none" width="24" height="24" transform="translate(762 906.838)"></rect>
                            <path fill="#080808" d="M63.432,503.859l5.4-5.4a1.223,1.223,0,0,0-1.73-1.73l-4.533,4.52-4.533-4.533a1.228,1.228,0,0,0-2.092.865,1.216,1.216,0,0,0,.363.865l5.4,5.411A1.229,1.229,0,0,0,63.432,503.859Z" transform="translate(711.356 418.584)"></path>
                        </g>
                    </svg>
                </a>
                <Button variant="light" onClick={() => props.setShowModal(false)} className="rounded-5">
                    <img src={CloseIcon} alt="Close Icon" title="close" />
                </Button>
            </div>
        </div>
    )
}

export default CommonHeader
