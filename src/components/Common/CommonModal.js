import React from 'react';
import CommonTabs from './CommonTabs';
import CommonHeader from './CommonHeader';
import OrderDelivaryInfo from './OrderDelivaryInfo';

const CommonModal = (props) => {
    return (
        <React.Fragment>
            <div className="header bg-white height100vh custom-modal">
                <div class="row no-gutters m-0 ">
                    <CommonHeader setShowModal={props.setShowModal} />
                    <div class="col-sm-4">
                        <OrderDelivaryInfo />
                    </div>
                    <div class="col-sm-8">
                        <CommonTabs />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default CommonModal;