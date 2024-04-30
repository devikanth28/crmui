import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import axios from 'axios';
import base64 from 'base-64';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Validate from '../../../helpers/Validate';
import NoDataFoundIcon from '../../../images/No-Data-Found.svg';
import CatalogService from '../../../services/Catalog/CatalogService';
import { BodyComponent, FooterComponent, HeaderComponent } from '../../Common/CommonStructure';
import CurrencyFormatter from '../../Common/CurrencyFormatter';
import { AlertContext, CustomerContext, LocalityContext, ShoppingCartContext, UserContext } from '../../Contexts/UserContext';
import { getCustomerRedirectionURL } from '../../customer/CustomerHelper';
import CartModal from '../Common/CartModal';
import IndividualProductInCart from './MiniCart';
import ProductSearchSuggestions from "./SearchSuggestion";

const ProductSearch = (props) => {


    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const validate = Validate();
    const catalogService = CatalogService();
    const [loading, isLoading] = useState(false);
    const [searchedText, setSearchedText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [source, setSource] = useState(undefined);
    const { customerId } = useContext(CustomerContext);
    const { shoppingCart, isOnlineCartAdded, redisCart } = useContext(ShoppingCartContext);
    const { setAlertContent } = useContext(AlertContext)
    const [outOfStockProdInCart, isOutOfStockProdInCart] = useState(false)
    const userSessionInfo = useContext(UserContext);
    const [backDropLoader, setBackDropLoader] = useState(false)
    const [showCheckOutButton, setCheckOutButton] = useState(false);
    const {martLocality,setReloadLocality} = useContext(LocalityContext)
    const [cartContainsComplimentary, isCartContainsComplimentary] = useState(false)
    const [cartSummartExcludingComplimentary ,  setCartSummaryExcludingComplimentary] = useState({
        grandTotal: 0,
        discount: 0,
        totalAmount: 0,
      });

    useEffect(()=>{
        if(validate.isNotEmpty(shoppingCart) && validate.isNotEmpty(shoppingCart.shoppingCartItems) && shoppingCart.shoppingCartItems.length > 0){
            let isAnyOutOfStock = false;
            shoppingCart.shoppingCartItems.map(eachItem=>{
                if(eachItem.quantity==0){
                    isAnyOutOfStock = true
                }
            })
            isOutOfStockProdInCart(isAnyOutOfStock);
        }
        setCheckOutButton(validate.isNotEmpty(shoppingCart) && shoppingCart.shoppingCartItems.length > 0);
        prepareCartSummaryExcludingComplimentary()
    },[redisCart, shoppingCart, shoppingCart.shoppingCartItems])

    const prepareCartSummaryExcludingComplimentary = () => {
        let newCartSummaryExCompliDetailMap = { ...cartSummartExcludingComplimentary };
    
        if (validate.isNotEmpty(shoppingCart?.shoppingCartItems)) {
          shoppingCart.shoppingCartItems.forEach((shoppingCartItem) => {
            if (shoppingCartItem.complimentaryType === 'ADDED') {
              isCartContainsComplimentary(true)
              const compItemAmount = shoppingCartItem.packSizeQuantity * shoppingCartItem.packMrp;
              const totalAmount = shoppingCart?.cartSummary?.totalMrp - compItemAmount;
              const discountTotal = shoppingCart?.cartSummary?.totalDiscount - (compItemAmount - shoppingCartItem?.discountList?.[0]?.discountPrice);
              const grandTotal = totalAmount - discountTotal;
    
              newCartSummaryExCompliDetailMap = {
                grandTotal,
                discount: discountTotal,
                totalAmount,
              };
            }else{
                isCartContainsComplimentary(false)
            }
          });
        }
    
        setCartSummaryExcludingComplimentary(newCartSummaryExCompliDetailMap);
      };
    

    const getSuggestions = async (searchKeyword) => {
        if (validate.isNotEmpty(searchKeyword) && searchKeyword.trim().length > 2) {
            isLoading(true);
            let options = [];
            searchKeyword = base64.encode(searchKeyword);
            let response = await getProductSearch(searchKeyword);
            if (response && "SUCCESS" === response.statusCode) {
                let productResponse = response?.dataObject?.productResponse;
                if (validate.isNotEmpty(productResponse)) {
                    let topProductSuggestions = [];
                    for (const eachProductSuggestions of productResponse) {
                        if ("FUZZY_RESULT" !== eachProductSuggestions.productId) {
                            eachProductSuggestions["TYPE"] = "PRODUCT_SUGGESTION";
                            options.push(eachProductSuggestions);
                            topProductSuggestions.push(eachProductSuggestions);
                            if (topProductSuggestions.length >= 15) {
                                break;
                            }
                        }
                    }
                }
                setSuggestions(options);
            } else {
                console.log("Error: " + response?.message);
            }
            isLoading(false);
        }
    }

    const getProductSearch = (searchedText) => {
        if (source) {
            source.cancel();
        }
        const newSource = axios.CancelToken.source();
        setSource(newSource)
        const searchCriteria = {
            searchQuery: searchedText,
            pageNumber: 1,
            recordsCount: 15,
            allFieldsRequired: true,
        };
        const config = { headers: { customerId }, params: { searchCriteria: JSON.stringify(searchCriteria) } }
        return catalogService.getProductSearch(config, { cancelToken: newSource.token });
    }

    const proceedToCheckout = () => {
        setReloadLocality(true);
        if (outOfStockProdInCart) {
            setAlertContent({ alertMessage: "remove out of stock products from cart before checkout..!" })
            return
        }
        props.history.push(getCustomerRedirectionURL(customerId, "checkout/showSwitchProducts"))
    }

    const productsListBody = () => {
        return <React.Fragment>
        {validate.isNotEmpty(shoppingCart) 
            ?
                <React.Fragment>
                    <div className='border border-bottom-0 h-100'>
                        <div className="overflow-y-auto" style={{ height: "calc(100% - 7.0625rem)" }} >
                            {validate.isNotEmpty(shoppingCart.shoppingCartItems) && shoppingCart.shoppingCartItems.map((eachProduct, index) => (
                                'ADDED' !== eachProduct.complimentaryType && <IndividualProductInCart setCheckOutButton={setCheckOutButton} backDropLoader={backDropLoader} setBackDropLoader={setBackDropLoader} isLastProduct={index == (shoppingCart.shoppingCartItems.length - 1)} catalogRestrictedQty={props.catalogRestrictedQty} isOutOfStockProdInCart={isOutOfStockProdInCart} productId={index} productAvailableQty={shoppingCart.productAvailableQty} eachProduct={eachProduct} history={props.history} />
                            ))}
                        </div>
                        <div className='custom-border-bottom-dashed mt-1'></div>
                        {backDropLoader ?  <CustomSpinners spinnerText={"Total Payable Amount"} outerClassName="align-items-center d-flex flex-column justify-content-center mt-4" className={" d-flex flex-column p-3"} innerClass={"invisible"} />:  <div className='d-flex flex-column p-3'>
                            <div className='row g-0'>
                                <p className='col text-end mb-0'>MRP Total</p>
                                <p className='col-6 col-lg-2 col-xl-4 text-end mb-0'>
                                    <span className='font-weight-bold'>
                                        <CurrencyFormatter data={cartContainsComplimentary? cartSummartExcludingComplimentary.totalAmount :shoppingCart.cartSummary.totalMrp} decimalPlaces={2} />
                                    </span>
                                </p>
                            </div>
                            <div className='row g-0'>
                                <p className='col text-end mb-0 text-success'>Discount</p>
                                <p className='col-6 col-lg-2 col-xl-4 text-end mb-0'>
                                    <span className='font-weight-bold text-success'>
                                        -<CurrencyFormatter data={cartContainsComplimentary? cartSummartExcludingComplimentary.discount :shoppingCart.cartSummary.totalDiscount} decimalPlaces={2} />
                                    </span>
                                </p>
                            </div>
                            <div className='row g-0'>
                                <p className='col text-end mb-0'>Payable Amount</p>
                                <p className='col-6 col-lg-2 col-xl-4 text-end mb-0'>
                                    <span className='font-weight-bold'>
                                        <CurrencyFormatter data={cartContainsComplimentary? cartSummartExcludingComplimentary.grandTotal :shoppingCart.cartSummary.totalAmount} decimalPlaces={2} />
                                    </span>
                                </p>
                            </div>
                        </div>}
                    </div>
                </React.Fragment>
            :   <div className='d-flex justify-content-center align-items-center h-100 border border-bottom-0'>
                    <div className="text-center">
                        <img src={NoDataFoundIcon} alt="No Data Found" />
                        <p className="mb-0">No products to show..!</p>
                        <p className="mb-0">{`${(validate.isNotEmpty(redisCart) && !isOnlineCartAdded && martLocality?.hubId)? "Add products from the Online Cart or ":""}Search above to get the products.`}</p>                             
                    </div>      
                </div>
            }
        </React.Fragment>;
    }

    const productsListFooter = () => {
        return (
            <React.Fragment>
                <div className={`d-flex flex-row-reverse ${!props.showCartSection ? 'border rounded rounded-top-0 p-12' : 'w-100'}`}>
                <button className=' px-4 py-2 ms-3 btn btn-sm btn-brand' onClick={proceedToCheckout} disabled={!showCheckOutButton}>Proceed to Checkout</button>
                </div>
            </React.Fragment>
        );
    }

    return (
        <>
        <div className="d-none d-xl-block h-100">
            <HeaderComponent ref={headerRef}>
                <div className={`p-12 border rounded border-bottom-0 rounded-bottom-0`}>
                    <ProductSearchSuggestions suggestions={suggestions} setSuggestions={setSuggestions} loading={loading}  getSuggestions={getSuggestions} setSearchedText={setSearchedText} history={props.history}/>
                </div>
            </HeaderComponent>
            <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height p-0">
                {productsListBody()}
            </BodyComponent>
            <FooterComponent ref={footerRef}>
                <div className='d-none d-xl-block'>{productsListFooter()}</div>
            </FooterComponent>
        </div>
        <div className="d-xl-none p-12 shadow-sm bg-white search-container">
            <ProductSearchSuggestions suggestions={suggestions} setSuggestions={setSuggestions} loading={loading} getSuggestions={getSuggestions} setSearchedText={setSearchedText} />
            <CartModal cartHeader={() => {return "Shopping Cart"}} cartBody={validate.isNotEmpty(shoppingCart?.shoppingCartItems) ? productsListBody : null} cartFooter={productsListFooter} isCartOpen={props.showCartSection} closeCartSection={props.setShowCartSection} history={props.history}/>
        </div>
</>
    )
}

export default ProductSearch