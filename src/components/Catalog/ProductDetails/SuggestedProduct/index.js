import Validate from '../../../../helpers/Validate';
import { getCustomerRedirectionURL } from '../../../customer/CustomerHelper';
import { MEDPLUS_ADVANTAGE } from '../../../customer/Constants/CustomerConstants';
import React, { useContext } from 'react';
import { CustomerContext, ShoppingCartContext } from '../../../Contexts/UserContext';
import CurrencyFormatter from '../../../Common/CurrencyFormatter';
import { RedirectToProductDetail } from '../../RedirectToProductDetail';

const SuggestedProducts = (props) => {
    const suggesteAlternativeProduct = props.suggestedAlternativeProduct;
    const suggestedAlternativeProductDiscountInfo = props.suggestedAlternativeProductDiscountInfo;
    const { customerId , customer} = useContext(CustomerContext)
    const subscribedPharmaSubscriptionId = customer?.subscribedPharmaSubscriptionId
    const validate = Validate();
    const {setProductId}  = useContext(ShoppingCartContext)

    const onClickProductName = (productId) =>{
        setProductId(productId)
        RedirectToProductDetail(productId, customerId, props.history)
    }

    return (
        <React.Fragment>
            {suggesteAlternativeProduct?.map((item) => {
                return (
                    <React.Fragment>
                        <div className='border rounded p-12'>
                            <div>
                                <p className='custom-fieldset mb-2'>Suggested Alternative</p>
                                {validate.isNotEmpty(item.productName) && <a className='text-primary mt-2 mb-1 text-decoration-none font-weight-bold' href="javascript:void(0)" id="productname" onClick={() => onClickProductName(item.productId)}>{item.productName}</a>}
                                {validate.isNotEmpty(item.manufacturer) && <p className='text-secondary mb-3 font-12'>{item.manufacturer}</p>}
                                <p className='font-14 font-weight-bold'>{validate.isNotEmpty(item.mrpPrice) && <span>MRP <CurrencyFormatter data={item.mrpPrice} decimalPlaces={2} /></span>}<span className='m-1'>|</span>{validate.isNotEmpty(item.attribute?.packSize) && <span>{item.attribute?.packSize} Units / Packs</span>}</p>

                            </div>
                            {!subscribedPharmaSubscriptionId && validate.isNotEmpty(props.bestPharmaPlanInfo) && <div>
                                {
                                    suggestedAlternativeProductDiscountInfo && suggestedAlternativeProductDiscountInfo.map((discount) => {
                                        return (
                                            <>
                                                {validate.isNotEmpty(discount.membershipPrice) && <div className='align-items-center d-flex'>
                                                    <p className='font-14 font-weight-bold mb-1'>Member Price <CurrencyFormatter data={discount.membershipPrice} decimalPlaces={-1} /></p>
                                                    {validate.isNotEmpty(discount.membershipPricePerUnit) && item.attribute?.packSize > 1 && <small class="d-block font-12 ml-2">(<CurrencyFormatter data={discount.membershipPricePerUnit} decimalPlaces={-1} /> per unit)</small>}
                                                </div>}
                                            </>
                                        )
                                    })
                                }
                            </div>}
                            {!subscribedPharmaSubscriptionId && validate.isNotEmpty(props.bestPharmaPlanInfo) && <div class="my-3 custom-border-bottom-dashed" />}
                            <div className="align-items-center d-flex justify-content-between mt-2 no-gutters" style={{ "gap": "0.5rem" }}>
                            {!(!subscribedPharmaSubscriptionId && validate.isNotEmpty(props.bestPharmaPlanInfo)) &&
                                    suggestedAlternativeProductDiscountInfo && suggestedAlternativeProductDiscountInfo.map((discount) => {
                                        return (
                                            <>
                                                {validate.isNotEmpty(discount.membershipPrice) && <div>
                                                    <p lassName='font-14 font-weight-bold mb-1'> Member Price <CurrencyFormatter data={discount.membershipPrice} decimalPlaces={-1} /> {validate.isNotEmpty(discount.membershipPricePerUnit) && item.attribute?.packSize > 1 && <small class="d-block font-12 text-right">(<CurrencyFormatter data={discount.membershipPricePerUnit} decimalPlaces={-1} /> per unit)</small>}</p>
                                                </div>}
                                            </>
                                        )
                                    })
                                }
                                {!subscribedPharmaSubscriptionId &&<div className='col-12 col-sm-6 col-md-4 col-lg-4 col-xl-12 col-xxl-12'>
                                    {validate.isNotEmpty(props.bestPharmaPlanInfo) && <button title="MedPlus Advantage Member Price" className="brand-secondary btn font-12 py-2 rounded-pill w-100" type="button" role="button" onClick={() => { props.history.push(getCustomerRedirectionURL(customerId, MEDPLUS_ADVANTAGE)) }} style={{ "line-height": "initial" }}>
                                        <span>Become a Member for <CurrencyFormatter data={props.bestPharmaPlanInfo.price? props.bestPharmaPlanInfo.price: 0} decimalPlaces={2} /></span>
                                    </button>}
                                </div>}
                            </div>
                        </div>
                    </React.Fragment>
                )
            })}
        </React.Fragment>
    )
}

export default SuggestedProducts;