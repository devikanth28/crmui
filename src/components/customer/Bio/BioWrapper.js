import React, { useRef } from 'react'
import { BodyComponent, HeaderComponent, Wrapper } from '../../Common/CommonStructure'

const BioWrapper = (props) => {
    const headerRef = useRef(null);

  return (
    <Wrapper>
        <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
            <p className="mb-0">Customer Bio Details</p>
        </HeaderComponent>
        <BodyComponent allRefs={{headerRef}} className="body-height">
            {props.children}
        </BodyComponent>
    </Wrapper>
  )
}

export default BioWrapper;