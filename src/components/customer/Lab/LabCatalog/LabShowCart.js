import React, { useContext, useEffect, useRef, useState } from 'react';
import CurrencyFormatter from '../../../Common/CurrencyFormatter';
import { AlertContext, CustomerContext, ShoppingCartContext } from '../../../Contexts/UserContext';
import { LAB_ORDER } from '../../Constants/CustomerConstants';
import { getCustomerRedirectionURL } from '../../CustomerHelper';
import IndividualTestItem from './IndividualTestItem';
import { BodyComponent, FooterComponent, HeaderComponent } from '../../../Common/CommonStructure';
import Validate from '../../../../helpers/Validate';
import ProductSearchSuggestions from '../../../Catalog/ProductSearch/SearchSuggestion';
import CartModal from '../../../Catalog/Common/CartModal';
import NoDataFoundIcon from '../../../../images/No-Data-Found.svg'


function LabShowCart(props) {
    const { setStackedToastContent } = useContext(AlertContext);
    const cartSummary = props.cartSummary;
    const { customerId } = useContext(CustomerContext);
    const {labShoppingCart} = useContext(ShoppingCartContext);
    const searchHeaderRef = useRef();
    const footerRef = useRef();
    const [isGenderRestricted, setIsGenderRestricted] = useState(false);
    const [isDuplicateItem, setIsDuplicateItem] = useState(false);
    const [showCheckOutButton, setCheckOutButton] = useState(false);

    useEffect(()=>{
        setCheckOutButton(Validate().isNotEmpty(labShoppingCart) && labShoppingCart?.shoppingCartItems.length > 0);
    },[ labShoppingCart, labShoppingCart?.shoppingCartItems])

    useEffect(() => {
        if (labShoppingCart && labShoppingCart?.shoppingCartItems && labShoppingCart?.shoppingCartItems.length > 0) {
            let shoppingCartItems = labShoppingCart?.shoppingCartItems;
            let genderRestricted = false;
            let duplicateItem = false;
            for (let index = 0; index < shoppingCartItems.length; index++) {
                if (shoppingCartItems[index].genderRestricted) {
                    genderRestricted = true;
                }
                if (shoppingCartItems[index].duplicateItem) {
                    duplicateItem = true;
                }
            }
            setIsGenderRestricted(genderRestricted);
            setIsDuplicateItem(duplicateItem);
        }
    }, [labShoppingCart])

    const redirectToShoppingCart = () => {
        if (isGenderRestricted) {
            setStackedToastContent({ toastMessage: "Please remove Gender Restricted tests from cart" });
            return
        }
        if (isDuplicateItem) {
            setStackedToastContent({ toastMessage: "Please remove Duplicate tests from cart." });
            return;
        }

        props.history.push(getCustomerRedirectionURL(customerId, `${LAB_ORDER}/labcart`));
    }

    const showSelectedTest = (selectedTestId) => {
        let testId = selectedTestId.split("_")[selectedTestId.split("_").length - 1];
        props.setSelectedTestId(testId);
        props.history.push(getCustomerRedirectionURL(customerId, `${LAB_ORDER}/${testId}`))
    }

    const labListBody=()=>{
        return <React.Fragment>
            {Validate().isNotEmpty(labShoppingCart) ?
            <div className='border border-bottom-0 h-100'>
                    {labShoppingCart?.shoppingCartItems && <div className="overflow-y-auto" style={{ height: "calc(100% - 7.0625rem)" }} >
                        {labShoppingCart?.shoppingCartItems.map((eachTest) => {
                            return (
                                <div className="border-bottom">
                                    <IndividualTestItem addToCartLoading={props.addToCartLoading} setAddToCartLoading={props.setAddToCartLoading} test={eachTest}  setCartSummary={props.setCartSummary} showSelectedTest={showSelectedTest} />
                                </div>
                            )
                        })}
                    </div>}
                    <div className='custom-border-bottom-dashed mt-1' />
                    {cartSummary && <div className='p-3'>
                        {(cartSummary.totalPrice && cartSummary.totalPrice > 0) ? <div className='row g-0'>
                            <p className='col text-end mb-0'>MRP Total </p>
                            <p className='col-6 col-lg-2 col-xl-4 text-end mb-0'>
                                <span className='font-weight-bold'>
                                    <CurrencyFormatter data={cartSummary.totalPrice} decimalPlaces={2} />
                                </span>
                            </p>
                        </div> : <></>}
                        {(cartSummary.collectionCharges && cartSummary.collectionCharges > 0) ? <div className='row g-0'>
                            <p className='col text-end mb-0'>Collection Charges</p>
                            <p className='col-6 col-lg-2 col-xl-4 text-end mb-0'>
                                <span className='font-weight-bold'>
                                    <CurrencyFormatter data={cartSummary.collectionCharges} decimalPlaces={2} />
                                </span>
                            </p>
                        </div> : <></>}
                        {(cartSummary.reportDeliveryCharges && cartSummary.reportDeliveryCharges > 0) ? <div className='row g-0'>
                            <p className='col text-end mb-0'>Report Delivery Charges</p>
                            <p className='col-6 col-lg-2 col-xl-4 text-end mb-0'>
                                <span className='font-weight-bold'>
                                    <CurrencyFormatter data={cartSummary.reportDeliveryCharges} decimalPlaces={2} />
                                </span>
                            </p>
                        </div> : <></>}
                        {(cartSummary.totalDiscount && cartSummary.totalDiscount > 0) ? <div className='row g-0'>
                            <p className='col text-end mb-0 text-success font-14'>Discount</p>
                            <p className='col-6 col-lg-2 col-xl-4 text-end mb-0'>
                                <span className='font-weight-bold'>
                                    <CurrencyFormatter data={cartSummary.totalDiscount} decimalPlaces={2} />
                                </span>
                            </p>
                        </div> : <></>}
                        {(cartSummary.totalAmount && cartSummary.totalAmount > 0) ? <div className='row g-0'>
                            <p className='col text-end mb-0'>Payable Amount</p>
                            <p className='col-6 col-lg-2 col-xl-4 text-end mb-0'>
                                <span className='font-weight-bold'>
                                    <CurrencyFormatter data={cartSummary.totalAmount} decimalPlaces={2} />
                                </span>
                            </p>
                        </div> : <></>}
                    </div>}
                </div> : <div className='d-flex justify-content-center align-items-center h-100 border border-bottom-0'>
                    <div className="text-center">
                        <img src={NoDataFoundIcon} alt="No Data Found" />
                        <p className="mb-0">No Lab Tests / Health packages to show..!</p>
                        <p className="mb-0">Search above to get the Lab Tests / Health packages.</p>                             
                    </div>      
                </div>}
        </React.Fragment>
    }

    const labcartfooter=()=>{
        return (
            <React.Fragment>
                <div className={`d-flex flex-row-reverse ${!props.showCartSection ? 'border rounded rounded-top-0 p-12' : 'w-100'}`}>
                    <button className='btn btn-brand btn-sm px-4 py-2 w-100' onClick={() => { redirectToShoppingCart() }} disabled={!showCheckOutButton}>Proceed to Checkout</button>
                </div>
            </React.Fragment>
        )
    }

    return (<>
        <div className='d-none d-xl-block h-100'>
        <HeaderComponent ref={searchHeaderRef} >
                                <div className='p-12  border rounded border-bottom-0 rounded-bottom-0'>
                                    <ProductSearchSuggestions suggestions={props.suggestions} setSuggestions={props.setSuggestions} loading={props.suggestionLoading} setSelectedTestId={props.setSelectedTestId} getSuggestions={props.getSuggestions} placeholder="Search lab test or Health package" fromLab={true} {...props}/>
                                </div>
                            </HeaderComponent>
        
            <BodyComponent allRefs={{ "headerRef":searchHeaderRef,"footerRef": footerRef }} className="body-height p-0 border-top">
                {labListBody()}
            </BodyComponent>
            <FooterComponent ref={footerRef}>
                {labcartfooter()}
            </FooterComponent>
        </div>
        <div className="d-xl-none p-12 shadow-sm bg-white search-container">
            <ProductSearchSuggestions suggestions={props.suggestions} setSuggestions={props.setSuggestions} loading={props.suggestionLoading} setSelectedTestId={props.setSelectedTestId} getSuggestions={props.getSuggestions} placeholder="Search lab test or Health package" fromLab={true} {...props} />
            <CartModal cartHeader={() => {return "Lab Shopping Cart"}} cartBody={labListBody} cartFooter={labcartfooter} isCartOpen={props.showCartSection} closeCartSection={props.setShowCartSection} history={props.history}/>
        </div>
    </>
    )
}

export default LabShowCart;