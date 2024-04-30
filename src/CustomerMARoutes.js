import React from 'react';
import CustomerRoute from './components/customer/CustomerRoute';
import Loadable from "react-loadable";

const Loading = <div className="load-chunks-bar" style={{ top: '4px' }}>
    <div className="bar"></div>
</div>

const AddMembersToPlan = Loadable({
    loader: () => import(/* webpackChunkName: "customer-medplusAdvantage" */ './components/customer/MembershipAdvantage/AddMembersToPlan'),
    loading: () => Loading,
    modules: ['medplusAdvantage']
});

const MedplusAdvantage = Loadable({
    loader: () => import(/* webpackChunkName: "customer-medplusAdvantage" */ './components/customer/MembershipAdvantage/MedplusAdvantageHome'),
    loading: () => Loading,
    modules: ['medplusAdvantage']
});

const MAOrderReview = Loadable({
    loader: () => import(/* webpackChunkName: "customer-medplusAdvantage" */ './components/customer/MembershipAdvantage/orderReview/OrderReview'),
    loading: () => Loading,
    modules: ['medplusAdvantage']
});

const MAThankYou = Loadable({
    loader: () => import(/* webpackChunkName: "customer-medplusAdvantage" */ './components/customer/MembershipAdvantage/ThankYouPage'),
    loading: () => Loading,
    modules: ['medplusAdvantage']
});

function CustomerMARoutes(props) {
    const path = props?.match?.path;
    return (
        <>
            <CustomerRoute exact path={`${path}`} component={MedplusAdvantage} {...props} />
            <CustomerRoute exact path={`${path}/addMembersToPlan`} component={AddMembersToPlan} {...props} />
            <CustomerRoute exact path={`${path}/maOrderReview`} component={MAOrderReview} {...props}/>
            <CustomerRoute exact path={`${path}/maThankyou`} component={MAThankYou} {...props}/>
        </>
    );
}

export default CustomerMARoutes;