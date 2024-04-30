import React, { useEffect, useState } from 'react';
import LabOrderService from '../../../../services/LabOrder/LabOrderService';
import NearByStores from '../../../Catalog/ProductDetails/NearByStores';
import { isResponseSuccess } from '../../../../helpers/CommonHelper';
import Validate from '../../../../helpers/Validate';

function TestServingCenters(props) {
    const [openLocationsModel, setOpenLocationsModel] = useState(false);
    const testServingCenters = props.testServingCenters;

    return (
        Validate().isNotEmpty(testServingCenters) ? <>
            <div className="col-lg-6 col pointer" onClick={() => { setOpenLocationsModel(true); }}>
                <div className="d-flex align-items-center p-12 border border-primary rounded h-100 ">
                    <div className="me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11.564" height="16" viewBox="0 0 11.564 16"><g id="reset_black_icon_16px" transform="translate(-2.476 -1)"><g id="Group_34581" data-name="Group 34581" transform="translate(2.476 1)">
                            <path id="Union_130" data-name="Union 130" d="M.658,8.283a5.737,5.737,0,0,1,.909-6.62A5.626,5.626,0,0,1,5.719,0H5.88A5.613,5.613,0,0,1,10,1.662a5.738,5.738,0,0,1,.908,6.62A69.415,69.415,0,0,1,5.768,16,70.906,70.906,0,0,1,.658,8.283ZM2.32,2.38A4.693,4.693,0,0,0,1.58,7.8a60.9,60.9,0,0,0,4.191,6.457A59.581,59.581,0,0,0,9.985,7.8,4.7,4.7,0,0,0,9.244,2.38,4.507,4.507,0,0,0,5.88,1.04H5.719A4.494,4.494,0,0,0,2.32,2.38Zm.731,3.164a2.73,2.73,0,1,1,2.73,2.731A2.731,2.731,0,0,1,3.051,5.544Zm1.039,0A1.691,1.691,0,1,0,5.782,3.853,1.693,1.693,0,0,0,4.091,5.544Z" transform="translate(0)" fill="#080808"></path>
                        </g></g>
                        </svg>
                    </div>
                    <p class="mb-0 font-14 text-wrap">Also available centers near you</p>
                </div>
            </div>
            <NearByStores productName={props.testName} storeInfo={testServingCenters} fromLab={true} openlocationflag={openLocationsModel} setOpenlocationflag={setOpenLocationsModel} isForLabs={true} />
        </> : <></>
    );
}

export default TestServingCenters;