import React,{useRef} from 'react'
import CatalogCartCard from './CatalogCartCard';
import { BodyComponent, FooterComponent, HeaderComponent } from '../Common/CommonStructure';
import CatalogCartSearch from './CatalogCartSearch';

function CatalogCart() {
    const headerRef = useRef(null);
    const footerRef = useRef(null);
  return (
    <React.Fragment>
        <HeaderComponent ref={headerRef}>
        <div className="p-3 border rounded border-bottom-0 rounded-bottom-0">
                <CatalogCartSearch></CatalogCartSearch>
        </div>
        </HeaderComponent>
        <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height p-0 ">

        <div className='border h-100'>
            <div className="overflow-y-auto" onH style={{ height: "calc(100% - 7.0625rem)"}} >
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <CatalogCartCard key={item} />
            ))}
            </div>
        <div className='custom-border-bottom-dashed mt-1'></div>
        <div className='text-end p-3'>
            <p className='mb-1'> MRP Total <span className='rupee'>&#x20B9;</span><span className='font-weight-bold'>117.20</span></p>
            <p className='text-success mb-1 font-14'>Discount <span className='rupee'>-&#x20B9;</span><span className='font-weight-bold'>11.72</span></p>
            <p className='mb-0'>Payable Amount <span className='rupee'>-&#x20B9;</span><span className='font-weight-bold'>105.72</span></p>

        </div>

        </div>
        </BodyComponent >
        <FooterComponent ref={footerRef}>
            <div className='border rounded rounded-top-0 d-flex flex-row-reverse p-2'>
                <button className=' px-4 py-2 btn btn-sm btn-brand'>Proceed to Checkout</button>
                <button className=' px-4 py-2 me-3 btn btn-sm brand-secondary'>Add My Online Cart</button>
            </div> 
            </FooterComponent>
    </React.Fragment>
  )
}

export default CatalogCart