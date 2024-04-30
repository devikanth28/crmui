import React, { useContext } from 'react'
import LabCartActionButton from './LabCartActionButton';
import { DeleteIcon } from '@medplus/react-common-components/DataGrid';
import { ShoppingCartContext } from '../../../Contexts/UserContext';
import CurrencyFormatter from '../../../Common/CurrencyFormatter';
import Validate from '../../../../helpers/Validate';

const IndividualTestItem = (props) => {

    const { setLabShoppingCart } = useContext(ShoppingCartContext);
    const validate = Validate();
    const test = props.test;

    return (
        <div className={`${test.genderRestricted || test.duplicateItem ? 'border border-danger' : ''} d-flex justify-content-between p-12`} >
            <div>
                <a className="text-primary pointer text-decoration-none fw-medium" id={`test_${test.testCode}`} onClick={() => props.showSelectedTest(`test_${test.testCode}`)}>{test.testName}</a>
                <p className="font-12 text-secondary mb-0">MRP
                    {(validate.isNotEmpty(test.price) && validate.isNotEmpty(test.mrp) && test.price != test.mrp) ?
                        <>
                            <del className="m-1 text-secondary"><CurrencyFormatter data={test.mrp} decimalPlaces={2} /></del>
                            <span className="m-1 text-black"><CurrencyFormatter data={test.price} decimalPlaces={2} /></span>
                        </>
                        :
                        <span className="m-1 text-black"><CurrencyFormatter data={test.mrp} decimalPlaces={2} /></span>}</p>
                {test.genderRestricted && <small>Note: Services restricted for different gender patients cannot be added in the same cart</small>}
                {test.duplicateItem && <small>Note: This test is already a part of a package/s in this cart. Kindly remove to proceed.</small>}
            </div>
            <div>
                <LabCartActionButton addToCartLoading={props.addToCartLoading} setAddToCartLoading={props.setAddToCartLoading} variant="link" testCode={test.testCode} isaddedToCart={true} handleCallback={(response) => { setLabShoppingCart(response?.responseData?.shoppingCart); props.setCartSummary(response?.responseData?.cartSummary) }} removeBtn={<DeleteIcon tooltip="Remove test" />} />
            </div>
        </div>
    )
}

export default IndividualTestItem