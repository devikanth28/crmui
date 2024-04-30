
import { Button } from "react-bootstrap";
import { UncontrolledTooltip } from "reactstrap";
import Validate from "../../../../helpers/Validate";
import { useContext, useEffect, useState } from "react";
import CheckoutService from "../../../../services/Checkout/CheckoutService";
import { AlertContext, CustomerContext, ShoppingCartContext } from "../../../Contexts/UserContext";
import CurrencyFormatter from "../../../Common/CurrencyFormatter";
import { CRM_UI } from "../../../../services/ServiceConstants";
import { RedirectToProductDetail } from "../../RedirectToProductDetail";

export default function IndividualProductInCart(props) {

    const validate = Validate();
    const eachProduct = props.eachProduct
    const [errorMessgae, setErrorMessgae] = useState("")
    const { customerId } = useContext(CustomerContext)
    const [quantity, setQuantity] = useState(eachProduct.packSizeQuantity);
    const checkoutService = CheckoutService();
    const { setShoppingCart, productId, setProductId } = useContext(ShoppingCartContext)
    const { setStackedToastContent } = useContext(AlertContext)
    
    let productTotalDiscount = 0;

    if(validate.isNotEmpty(eachProduct?.discountList)){
        eachProduct.discountList.forEach((eachDiscount)=>{
            if(parseInt(eachDiscount.promotiontype)!=2 && validate.isNotEmpty(eachDiscount.discountPercent) && validate.isNotEmpty(eachDiscount.noOfPacks)){
                productTotalDiscount +=  eachDiscount.discountPrice*eachDiscount.noOfPacks;
            } else if(parseInt(eachDiscount.promotiontype)===2 && validate.isNotEmpty(eachDiscount.noOfPacks)){
                productTotalDiscount +=  eachProduct.packMrp*eachDiscount.noOfPacks;
            }
        })
    }
    
    const modifyCartItem = (productId, quantity) => {
        let params = {}
        params[productId] = quantity;
        props.setBackDropLoader(true)
        return checkoutService.modifyCart({ headers: { customerId }, params: { "CART_OBJECT": params } });
    }

    useEffect(()=>{
        if(eachProduct.quantity==0){
            props.isOutOfStockProdInCart(true)
        }
        setErrorMessgae("")
        props.setCheckOutButton(true)
        setQuantity(eachProduct.packSizeQuantity);
    },[eachProduct])

    const setShoppingCartResponse = (shoppingCartResponse) => {
        if (validate.isNotEmpty(shoppingCartResponse) && validate.isNotEmpty(shoppingCartResponse.dataObject) && "SUCCESS" == shoppingCartResponse?.statusCode) {
            setShoppingCart(shoppingCartResponse.dataObject);
        } else {
            if("FAILURE" === shoppingCartResponse.statusCode  &&  "EMPTY_CART" === shoppingCartResponse.message){
                setShoppingCart({})
                props.setBackDropLoader(false)
                return;
            }
            setStackedToastContent({ toastMessage: shoppingCartResponse.message })
            setQuantity(eachProduct.packSizeQuantity)
        }
        props.setBackDropLoader(false)
    }

    const deleteCartItem = async (productId) => {
        if (validate.isNotEmpty(productId) && validate.isNotEmpty(customerId)) {
            const shoppingCartResponse = await modifyCartItem(productId, 0);
            setShoppingCartResponse(shoppingCartResponse);
        }
    }

    const getChangeQuantity = async (shoppingCartItem) => {
        if(validate.isEmpty(quantity)){
            return false;
        }
        shoppingCartItem.modifiedQty = quantity;
        if (validate.isEmpty(shoppingCartItem.modifiedQty)) {
            shoppingCartItem.modifiedQty = shoppingCartItem.packSizeQuantity;
        }
        if (validate.isNotEmpty(shoppingCartItem) && validate.isNotEmpty(shoppingCartItem.modifiedQty) && validate.isNotEmpty(customerId)) {
            if (parseInt(shoppingCartItem.modifiedQty) <= 0) {
                setErrorMessgae("Please enter quantity more than zero ");
                props.setCheckOutButton(false)
                return false;
            }
            setErrorMessgae("");
            props.setCheckOutButton(true)
            if(shoppingCartItem.modifiedQty === shoppingCartItem.packSizeQuantity){
                setStackedToastContent({ toastMessage: `The product: ${eachProduct?.productName} , with quantity: ${quantity}, is already available in the cart. Please give some other quantity.` }); 
                return false;
            }
            if (shoppingCartItem.modifiedQty != shoppingCartItem.packSizeQuantity) {
                const shoppingCartResponse = await modifyCartItem(shoppingCartItem.productId, Number(shoppingCartItem.modifiedQty));
                setShoppingCartResponse(shoppingCartResponse);
            }
        }
    }

    const handleChange = (event) => {
        const numberpattern = /^[0-9\b]+$/;
        if (event.target.value === '' || numberpattern.test(event.target.value)) {
            setQuantity(event.target.value);
        };
    }

    const productClick = (eachProduct) => {
        setProductId(eachProduct.productId)
        RedirectToProductDetail(eachProduct.productId, customerId,props.history)
    }

    return (
        <>
            <div className={`selectedItem ${!props.isLastProduct ? "border-bottom" : ""} ${productId == eachProduct.productId ? "bg-info-light":""}`}>
                <div className="h-100 p-12">
                    <div>
                        <div className="d-flex justify-content-between">
                            <div>
                                <a className="text-primary pointer text-decoration-none fw-medium" id={`product_${productId}`} onClick={()=> {productClick(eachProduct)}}  >{eachProduct.productName}</a>
                                <p className="font-12 text-secondary mb-2">MRP / Pack &nbsp;
                                <span className="text-black">
                                    <CurrencyFormatter data={eachProduct.packMrp} decimalPlaces={2} />
                                </span> 
                                <span className="mx-1">|</span> {eachProduct.packSize} Unit(s) / Pack</p>
                            </div>
                            <div>
                                <Button variant="link" className="icon-hover" id="deleteProduct" disabled={props.backDropLoader} onClick={() => deleteCartItem(eachProduct.productId)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                        <g id="delete_black_icon_24px" transform="translate(-180.258 -281.937)">
                                            <rect id="Rectangle_12684" data-name="Rectangle 12684" width="18" height="18" rx="3" transform="translate(180.258 281.937)" fill="none" />
                                            <g id="Group_34714" data-name="Group 34714" transform="translate(181.918 282.937)">
                                                <path id="Union_200" data-name="Union 200" d="M4.1,16a2.272,2.272,0,0,1-2.228-2.3V3.2H.536a.549.549,0,0,1,0-1.1H4.421V1.95A1.95,1.95,0,0,1,4.97.575,1.863,1.863,0,0,1,6.309,0H8.686a1.923,1.923,0,0,1,1.889,1.951V2.1H14.12a.549.549,0,0,1,0,1.1h-1V13.7A2.273,2.273,0,0,1,10.895,16ZM2.933,13.7A1.189,1.189,0,0,0,4.1,14.9h6.795a1.19,1.19,0,0,0,1.168-1.2V3.2H2.933ZM5.484,1.951l0,.153H9.514V1.951A.842.842,0,0,0,8.686,1.1H6.307A.846.846,0,0,0,5.484,1.951ZM9.843,13.643a.57.57,0,0,1-.538-.6V6.524a.567.567,0,0,1,.538-.548h.02a.566.566,0,0,1,.56.546v6.571a.568.568,0,0,1-.561.552Zm-2.368,0a.571.571,0,0,1-.538-.6V6.521a.559.559,0,1,1,1.118,0v6.571a.568.568,0,0,1-.56.552Zm-2.366,0a.571.571,0,0,1-.539-.6V6.521a.559.559,0,1,1,1.118,0v6.571a.568.568,0,0,1-.561.552Z" transform="translate(0 0)" fill="#e71c37" />
                                            </g>
                                        </g>
                                    </svg>
                                </Button>
                                <UncontrolledTooltip placement="bottom" target={"deleteProduct"}>
                                    Delete
                                </UncontrolledTooltip>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between row">
                            <div className="col">
                                <div className="d-flex align-items-center">

                                    {eachProduct.quantity !==0 && <div class="form-floating w-100 me-2">
                                        {/* <input placeholder=" "  size="sm" aria-label="text input" index="0" autocomplete="off" type="text"  class="form-control"/> */}
                                        <input placeholder=" " pattern="[0-9]*" onChange={handleChange} value={quantity} onBlur={() => getChangeQuantity(eachProduct)} aria-label="text input" htmlelementtype="INPUT" index="0" maxLength={2} min={1} max={validate.isNotEmpty(props.catalogRestrictedQty)?props.catalogRestrictedQty:eachProduct.catalogRestrictedQty ? eachProduct.catalogRestrictedQty : 99} required autocomplete="off" type="text" id="qtyInput" class={`${errorMessgae ? "is-invalid" : ""} form-control`} disabled={props.backDropLoader}></input>
                                        <label htmlFor="qtyInput" for="Quantity (Packs)">Quantity (Packs)</label>
                                        {validate.isNotEmpty(errorMessgae) ? <p class="text-danger font-14">{errorMessgae}</p> : ''}
                                    </div>}
                                    {eachProduct.quantity == 0 && <div >
                                        <p className="badge badge-pending mb-0">Out of Stock</p>
                                    </div>} 
                                </div>
                                {validate.isNotEmpty(props.productAvailableQty) && props.productAvailableQty[eachProduct.productId] ?
                                    <p className="text-secondary mb-0 font-12"> Max. Allowed Qty: {props.productAvailableQty[eachProduct.productId]}</p>
                                    : null
                                }
                            </div>
                            <div className="col-6 col-xl-5 text-end">
                                <p className="row mb-0 g-0">
                                    <span className="col-12 col-lg-9 col-xl-12 fw-light font-14 text-secondary">Price </span><span className="col-12 col-lg-3 col-xl-12 font-weight-bold">
                                    {productTotalDiscount > 0 && (productTotalDiscount < eachProduct.totalMrp) &&
                                            <>
                                                <del className="text-secondary"><CurrencyFormatter data={parseFloat(eachProduct.totalMrp)} decimalPlaces={2} /></del> &nbsp;
                                                <CurrencyFormatter data={productTotalDiscount} decimalPlaces={2} />
                                            </>
                                        }
                                        {(productTotalDiscount <= 0 || (productTotalDiscount >= eachProduct.totalMrp)) &&
                                            <>
                                                <CurrencyFormatter data={parseFloat(eachProduct.totalMrp)} decimalPlaces={2} />
                                            </>
                                        }
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
