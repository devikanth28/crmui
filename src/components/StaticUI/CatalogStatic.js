import React, { useRef ,useContext } from "react";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import CatalogCart from "./CatalogCart";
import CatalogProductDetails from "./CatalogProductDetails";

const CatalogStatic = () => {
    const headerRef = useRef(0);
    return (
        <React.Fragment>
            <Wrapper>
                <HeaderComponent className={"border-bottom"} ref={headerRef}>
                    <div className="d-flex align-items-center justify-content-between p-12">
                        <p className="mb-0">Search Catalogue</p>
                        <button type="button" className="btn btn-sm link-success btn-link border-0">
                            <svg className="align-text-top me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <g id="Group_28287" data-name="Group 28287" transform="translate(-1135.314)">
                                    <path id="Path_47170" data-name="Path 47170" d="M38,30a8,8,0,1,0,8,8A8.007,8.007,0,0,0,38,30Zm0,14.905A6.905,6.905,0,1,1,44.905,38,6.915,6.915,0,0,1,38,44.905Z" transform="translate(1105.314 -30)" fill="#11b094" />
                                    <path id="Path_47171" data-name="Path 47171" d="M5.975.164a.539.539,0,0,0-.775,0L3.078,2.286.939.164a.539.539,0,0,0-.775,0,.539.539,0,0,0,0,.775L2.3,3.061.181,5.2a.539.539,0,0,0,0,.775.562.562,0,0,0,.387.152.562.562,0,0,0,.387-.152L3.078,3.836,5.217,5.975a.571.571,0,0,0,.775,0,.539.539,0,0,0,0-.775L3.853,3.061,5.992.922A.534.534,0,0,0,5.975.164Z" transform="translate(1143.302 3.66) rotate(45)" fill="#11b094" />
                                </g>
                            </svg>
                            Add My Online Cart
                        </button>
                    </div>
                </HeaderComponent>
                <BodyComponent allRefs={{ headerRef }} className="body-height" >
                    <div className="row g-3 h-100">
                        <div className="col-4 h-100">
                            <CatalogCart></CatalogCart>
                        </div>
                        <div className="col-8 h-100">
                            <div className="h-100 border rounded">
                                <CatalogProductDetails></CatalogProductDetails>
                            </div>
                        </div>
                    </div>
                </BodyComponent>
            </Wrapper>
        </React.Fragment>
    )
}
export default CatalogStatic