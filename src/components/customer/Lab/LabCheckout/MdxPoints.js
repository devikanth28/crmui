import React from "react";
import Validate from "../../../../helpers/Validate";

const MdxPoints = (props) => {

    const validate = Validate();
    const cartSummary = props.cartSummary;

    return (
        <>
            {cartSummary && <div id='MdxWallet' className='scrolling-tabs p-12'>
                <div style={{ width: "280px" }}>
                    <label className='d-block pb-0 font-weight-bold custom-fieldset mb-2'>MDx Wallet</label>
                    <div class="align-items-baseline d-flex">
                        <input type="checkbox" class="custom-control-input" id="MdxPoints" onClick={() => props.handleMdxUsageClick(!props.mdxFlag)} checked={props.mdxFlag} />
                        {(cartSummary.customerMdxPoints && parseFloat(cartSummary.customerMdxPoints) > 0) && <div>
                                <p class="font-weight-normal mb-0">Total Available Points : {parseFloat(cartSummary.customerMdxPoints).toFixed(2)} pts</p>
                            </div>}
                        <label for="MdxPoints" class="custom-control-label ms-2 pointer w-100">
                            <div class="d-flex justify-content-between">
                                {validate.isNotEmpty(cartSummary.customerMdxPoints) && parseFloat(cartSummary.customerMdxPoints) > 0 &&
                                    <div>
                                        <p class="font-weight-normal mb-0">MDx Wallet</p>
                                        <p class="font-weight-normal font-12 text-secondary mb-0">Balance Points:
                                            {(cartSummary.applyMdxPointsPayment && cartSummary.applicableMdxPoints && parseFloat(cartSummary.applicableMdxPoints) > 0) ? parseFloat(cartSummary.customerMdxPoints - cartSummary.applicableMdxPoints).toFixed(2) : parseFloat(cartSummary.customerMdxPoints).toFixed(2)}</p>
                                    </div>
                                }
                                <div>
                                    <p class="font-weight-normal mb-0">Points Used</p>
                                    <p class="font-weight-normal font-12 text-secondary mb-0 float-right">{(cartSummary.applyMdxPointsPayment && cartSummary.applicableMdxPoints && parseFloat(cartSummary.applicableMdxPoints) > 0) ? parseFloat(cartSummary.applicableMdxPoints).toFixed(2) : 0}</p>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default MdxPoints;