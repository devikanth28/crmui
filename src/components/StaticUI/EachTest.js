import React from 'react'
import { Button } from "react-bootstrap";
import { UncontrolledTooltip } from "reactstrap";
const EachTest = (props) => {
    const eachProduct = props.eachProduct;
  return (
    <div className="d-flex justify-content-between p-12">
                            <div>
                                <a className="text-primary pointer text-decoration-none fw-medium" id={`product_${props?.productId}`}  >{eachProduct?.productName}</a>
                                <p className="font-12 text-secondary mb-0">MRP <span className="rupee">&#x20B9;</span><span className="text-black">{eachProduct?.mrp.toFixed(2)}</span></p>
                            </div>
                            <div>
                                <Button variant="link" className="icon-hover" id="deleteProduct" >
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
  )
}

export default EachTest