import React, { useContext } from 'react';
import CurrencyFormatter from '../../../Common/CurrencyFormatter';
import LabCartActionButton from './LabCartActionButton';
import { isTestAddedToCart } from '../CustomerLabHelper';
import { LAB_ORDER } from '../../Constants/CustomerConstants';
import { getCustomerRedirectionURL } from '../../CustomerHelper';
import { CustomerContext, ShoppingCartContext } from '../../../Contexts/UserContext';

function EachPackageTestCard(props) {
    const { customerId } = useContext(CustomerContext);
    const { labShoppingCart, setLabShoppingCart } = useContext(ShoppingCartContext);
    const eachPackageTest = props.eachPackageTest;
    return (
        <div class="card mb-0 p-12" style={{ minHeight: "12.4725rem" }}>
            <div class="mb-3" >
                <h6 class="text-dark text-truncate-2 mb-0 pointer" style={{ minHeight: "2.39875rem" }} onClick={() => props.history.push(getCustomerRedirectionURL(customerId, `${LAB_ORDER}/${eachPackageTest.code}`))}> {eachPackageTest.name}</h6>{eachPackageTest.noOfParameters ? <small class="text-muted">( {eachPackageTest.noOfParameters} Items)</small> : null}
            </div>
            <div class="d-flex align-items-center justify-content-between mb-4">
                {eachPackageTest.mrp ? <div>
                    <p class="small text-secondary mb-0">MRP Price</p>
                    <h6 class="mb-0">
                        <CurrencyFormatter data={eachPackageTest.mrp} decimalPlaces={2} />
                    </h6>
                </div> : <></>}
                {eachPackageTest.subscriptionPrice ? <div>
                    <p class="small text-secondary mb-0">MA Price</p>
                    <h6 class="mb-0"><CurrencyFormatter data={eachPackageTest.subscriptionPrice} decimalPlaces={2} /></h6>
                </div> : <></>}
            </div>
            <div class="text-end">
                <LabCartActionButton addToCartLoading={props.addToCartLoading} setAddToCartLoading={props.setAddToCartLoading} testCode={eachPackageTest.code} isaddedToCart={isTestAddedToCart(eachPackageTest.code, labShoppingCart)} handleCallback={(response) => { setLabShoppingCart(response?.responseData?.shoppingCart); props.setCartSummary(response?.responseData?.cartSummary) }} addBtn={"Book Test"} addBtnClass="btn btn-sm btn-success font14 nonmemberprice" />
            </div>
        </div>
    )
}

export default EachPackageTestCard;