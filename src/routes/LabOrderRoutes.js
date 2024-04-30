import React from "react";
import CustomerRoute from "../components/customer/CustomerRoute";
import Loading from "../components/Common/Loading";
import Loadable from "react-loadable";
import { Switch } from "react-router-dom";


const LabShoppingCart = Loadable({
    loader: () => import(/* webpackChunkName: "LabShoppingCart" */ '../components/customer/Lab/LabCheckout/LabShoppingCart'),
    loading: () => Loading,
    modules: ['CustomerLabOrder']

})

const LabCatalog = Loadable({
    loader: () => import(/* webpackChunkName: "LabCatalog" */ '../components/customer/Lab/LabCatalog/LabCatalog'),
    loading: () => Loading,
    modules: ['CustomerLabCatalog']

})

const LabReview = Loadable({
    loader: () => import(/* webpackChunkName: "LabReview" */ '../components/customer/Lab/LabCheckout/LabReview'),
    loading: () => Loading,
    modules: ['CustomerLabOrder']

})

const LabOrderThankYou = Loadable({
    loader: () => import(/* webpackChunkName: "LabOrderThankYou" */ '../components/customer/Lab/LabCheckout/LabOrderThankYou'),
    loading: () => Loading,
    modules: ['CustomerLabOrder']

})

export default (props) => {

    const path = props?.match?.path;

    return <Switch>
        <CustomerRoute exact path={`${path}/labcart/:labOrderId?`} component={LabShoppingCart} {...props} />
        <CustomerRoute exact path={`${path}/review`} component={LabReview} {...props} />
        <CustomerRoute exact path={`${path}/thankYou`} component={LabOrderThankYou} {...props} />
        <CustomerRoute exact path={`${path}/:testId?`} component={LabCatalog} {...props} />
    </Switch>
}