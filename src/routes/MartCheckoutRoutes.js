import Loadable from "react-loadable";
import { Switch } from "react-router-dom";
import Loading from "../components/Common/Loading";
import CustomerRoute from "../components/customer/CustomerRoute";

const MartShoppingCart = Loadable({
    loader: ()=> import(/* webpackChunkName: "ShoppingCart" */ '../components/Checkout/ShoppingCart'),
    loading: () => Loading,
    modules: ['shoppingCart']
});

const switchProducts = Loadable({
    loader: ()=> import(/* webpackChunkName: "ShoppingCart" */ '../components/Checkout/ShoppingCart/SwitchProducts'),
    loading: () => Loading,
    modules: ['shoppingCart']
});

const MartOrderReview = Loadable({
    loader: () => import(/* webpackChunkName: "Review" */ '../components/Checkout/Review'),
    loading: () => Loading,
    modules: ['orderReview']
});

const MartThankYou = Loadable({
    loader: () => import(/* webpackChunkName: "ThankYou" */ '../components/Checkout/ThankYou'),
    loading: () => Loading,
    modules: ['thankYou']
});

export default (props) => {

    const path = props?.match?.path;

    return <Switch>
            <CustomerRoute exact path={`${path}/showSwitchProducts`} routePath={"switchProducts"} component={switchProducts} {...props}/>
            <CustomerRoute exact path={`${path}/shoppingCart`} routePath={"shoppingCart"} component={MartShoppingCart} {...props}/>
            <CustomerRoute exact path={`${path}/orderReview`} routePath={"orderReview"} component={MartOrderReview} {...props}/>
            <CustomerRoute exact path={`${path}/thankyou/:cartId`} routePath={"thankyou"} component={MartThankYou} {...props}/>
        </Switch>
}