import React, { useContext, useRef, useState } from 'react'
import { Collapse, UncontrolledTooltip } from 'reactstrap';
import Validate from '../../helpers/Validate';
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure';
import EachTest from './EachTest';
import LabCatalogTestDetailPage from "./LabCatalogTestDetailPage";
import TestSearchSuggestion from "./TestSearchSuggestion";
import { getCustomerRedirectionURL } from '../customer/CustomerHelper';
import { CustomerContext, UserContext } from '../Contexts/UserContext';
import CurrencyFormatter from '../Common/CurrencyFormatter';
import CartButton from '../Catalog/Common/MobileCartButton';
import CartModal from '../Catalog/Common/CartModal';
const LabCatalogSearch = (props) => {
    const [isProductsListOpened, setIsProductsListOpened] = useState(false);
    const headerRef = useRef();
    const footerRef = useRef();
    const searchHeaderRef = useRef();
    const validate = Validate()
    const  {customerId}  = useContext(CustomerContext);
    const userSessionInfo = useContext(UserContext);
    const [showCartSection, setShowCartSection] = useState(false);
    const suggestions = [
        {
            productName:"MDX Anemia",
            mrp:200
        },
        {
            productName:"3T MRI",
            mrp:200
        },
        {
            productName:"Blood Glucode Fasting",
            mrp:200
        },
        {
            productName:"CBP",
            mrp:200
        },
        {
            productName:"CBP",
            mrp:200
        },
        {
            productName:"CBP",
            mrp:200
        },
        {
            productName:"CBP",
            mrp:200
        },
        {
            productName:"Hemoglobin",
            mrp:200
        }
]
const labCartBody=()=>{
    return(   
        <div className='h-100'>
            <div className="overflow-y-auto" style={{ height: "calc(100% - 7.0625rem)" }} >
        {suggestions.map((eachTest, index)=>{
        return(
            <div className="border-bottom">
                <EachTest eachProduct={eachTest}/>
            </div>
        )
    })}
    </div>
    <div className='custom-border-bottom-dashed mt-1'/>
                    <div className='p-3'>
                        <div className='row g-0'>
                            <p className='col text-end mb-0'>MRP Total</p>
                            <p className='col-6 col-lg-2 col-xl-4 text-end mb-0'>
                                <span className='font-weight-bold'>
                                    <CurrencyFormatter data={100} decimalPlaces={2} />
                                </span>
                            </p>
                        </div>
                        <div className='row g-0'>
                            <p className='col text-end mb-0 text-success'>Discount</p>
                            <p className='col-6 col-lg-2 col-xl-4 text-success text-end mb-0'>
                                <span className='font-weight-bold'>-
                                    <CurrencyFormatter data={77} decimalPlaces={2} />
                                </span>
                            </p>
                        </div>
                        <div className='row g-0'>
                            <p className='col text-end mb-0'>Payable Amount</p>
                            <p className='col-6 col-lg-2 col-xl-4 text-end mb-0'>
                                <span className='font-weight-bold'>
                                    <CurrencyFormatter data={33} decimalPlaces={2} />
                                </span>
                            </p>
                        </div>
                    </div></div>)


}

const labCartFooter=()=>{
    return <div className=' rounded-top-0 d-flex flex-row-reverse p-12 border-top'>
    <button className=' px-4 py-2 ms-3 btn btn-sm btn-brand' onClick={()=>{props.history.push(getCustomerRedirectionURL(customerId, "labcart"))}}>Proceed to Checkout</button>
    <button className=' px-4 py-2 btn btn-sm brand-secondary'>Add My Online Cart</button>
</div>
    

}
  return (
    <Wrapper>
            <HeaderComponent className={"border-bottom"} ref={headerRef}>
                <div className="d-flex align-items-center justify-content-between p-12">
                    <p className="mb-0">Search Catalogue</p>
                    
                </div>
            </HeaderComponent>
            <BodyComponent allRefs={{ headerRef}} className="body-height" >
                <div className="catalog-body">
                {userSessionInfo.vertical != "V" ?  <div className=' col-12 col-xl-4 h-100 card'>
                    <HeaderComponent ref={searchHeaderRef} >
                            <div className='p-12'>
                                <TestSearchSuggestion/>
                            </div>
                        </HeaderComponent>
                <BodyComponent allRefs={{ searchHeaderRef,footerRef}} className="body-height p-0 border-top">
                    {labCartBody()}

                        </BodyComponent>    
                        <FooterComponent ref={footerRef}>
                            {labCartFooter()}
                        </FooterComponent>
                    </div> :
                    <div className='sticky-product-search'><div className="p-12 shadow-sm bg-white" style={{height: "4rem", margin: "-0.75rem"}}>
            <TestSearchSuggestion/></div>
            <CartModal cartHeader={() => {return "Lab Shopping Cart"}} cartBody={labCartBody} cartFooter={labCartFooter} isCartOpen={showCartSection} closeCartSection={setShowCartSection}/>
            </div>}
                    
                  <div className="col-12 col-xl-8 ps-xl-2 h-100 mt-2 mt-lg-0">
                      <div className="h-100 border rounded">
                          <LabCatalogTestDetailPage />
                      </div>
                  </div>
                    <CartButton quantity={6} openCartSection={setShowCartSection}/> 
                </div>                
            </BodyComponent>

        </Wrapper>
  )
}

export default LabCatalogSearch