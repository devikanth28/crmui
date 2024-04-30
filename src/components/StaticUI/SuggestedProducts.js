import React from 'react'
import { UncontrolledTooltip } from 'reactstrap'

const SuggestedProducts=()=> {
  return (
    <React.Fragment>
        <div className='border rounded p-12'>
            <div>
                <p className='custom-fieldset mb-2'>Suggested Alternative</p>
                <a className='text-primary mt-2 mb-1 text-decoration-none font-weight-bold' href="javascript:void(0)" id="productname">Rabzo D Cap</a>
                <p className='text-secondary mb-3 font-12'>Dr Reddy Laboratories Ltd</p>
                <p className='font-14 font-weight-bold'><span>MRP  <span className='rupee'>&#x20B9;</span>146.0</span><span className='m-1'>|</span><span>10 Units / Packs</span></p>
                
            </div>
            <UncontrolledTooltip placement="bottom" target={"productname"}>        
                                Rapo D CAP
                            </UncontrolledTooltip>
            <div>
                <p className='font-14 font-weight-bold mb-1'>Member Price <span className='rupee'>&#x20B9;</span>00.00</p>
                <div className='d-flex justify-content-center'>
                    <button className='btn btn-sm btn-outline-primary py-2 px-4 align-content-center w-100'>Become a Member for ₹50</button>
                </div>
            </div>

        </div>
    </React.Fragment>
  )
}

export default SuggestedProducts