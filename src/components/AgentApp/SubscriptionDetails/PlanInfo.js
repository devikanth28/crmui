import React from 'react'

const PlanInfo = (props) => {
    return (
        <div>
            <label class="d-block pb-0 custom-fieldset">Plan Information</label>
            <div class="d-flex flex-wrap planInfo">
                {props.planInfo.displayName && <div class="col-6 col-lg-2 planItem">
                    <div class="form-floating">
                        <input type="text" readonly="" class="form-control-plaintext form-control-sm" id="displayName" value={props.planInfo.displayName} />
                        <label for="displayName">Display Name</label>
                    </div>
                </div>}
                {props.planInfo.loyalityCode &&
                    <div class="col-6 col-lg-2 planItem">
                        <div class="form-floating">
                            <input type="text" readonly="" class="form-control-plaintext form-control-sm" id="loyalityType" value={props.planInfo.loyalityCode} />
                            <label for="loyalityType">Loyality Type</label>
                        </div>
                    </div>
                }
                {props.planInfo.price &&
                    <div class="col-6 col-lg-1 planItem">
                        <div class="form-floating">
                            <input type="text" readonly="" class="form-control-plaintext form-control-sm" id="price" value={props.planInfo.price} />
                            <label for="price">Price</label>
                        </div>
                    </div>
                }
                {props.planInfo.tenureDays &&
                    <div class="col-6 col-lg-1 planItem">
                        <div class="form-floating">
                            <input type="text" readonly="" class="form-control-plaintext form-control-sm" id="tenureDays" value={props.planInfo.tenureDays} />
                            <label for="tenureDays">Tenure Days</label>
                        </div>
                    </div>
                }
                {props.planInfo.renewalDays &&
                    <div class="col-6 col-lg-1 planItem">
                        <div class="form-floating">
                            <input type="text" readonly="" class="form-control-plaintext form-control-sm" id="renewalDays" value={props.planInfo.renewalDays} />
                            <label for="renewalDays">Renewal Days</label>
                        </div>
                    </div>
                }
                {props.planInfo.coolingPeriod &&
                    <div class="col-6 col-lg-1 planItem">
                        <div class="form-floating">
                            <input type="text" readonly="" class="form-control-plaintext form-control-sm" id="coolingPeriod" value={props.planInfo.coolingPeriod} />
                            <label for="coolingPeriod">Cooling Period</label>
                        </div>
                    </div>
                }
                {props.planInfo.onlineVisibility &&
                    <div class="col-6 col-lg-1 planItem">
                        <div class="form-floating">
                            <input type="text" readonly="" class="form-control-plaintext form-control-sm" id="onlineVisibility" value={props.planInfo.onlineVisibility} />
                            <label for="onlineVisibility">Online Visibility</label>
                        </div>
                    </div>
                }

            </div></div>
    )
}

export default PlanInfo