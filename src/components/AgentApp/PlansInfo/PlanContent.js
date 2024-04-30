import Validate from "../../../helpers/Validate";

export default (props)=>{
    const {planInfo} = props;
    if(Validate().isEmpty(planInfo)){
        return;
    }

    return (
        <div>
            <label class="d-block pb-0 custom-fieldset">Plan Information</label>
            <div class="d-flex flex-wrap planInfo gap-3">
                <div class=" col-lg-2 planItem col-12">
                    <label for="displayName" class="font-12 text-secondary">Display Name</label>
                    <p class="mb-0 font-14">{planInfo?.displayName}</p>
                </div>
                
                <div class="col-lg-1 planItem col-7">
                    <label for="tenureDays" class="font-12 text-secondary">Tenure Days</label>
                    <p class="mb-0 font-14">{planInfo?.tenureDays}</p>
                </div>
                <div class="col-lg-1 planItem col-3">
                    <label for="renewalDays" class="font-12 text-secondary">Renwal Days</label>
                    <p class="mb-0 font-14">{planInfo?.renewalDays}</p>
                </div>
                <div class="col-lg-1 planItem col-7">
                    <label for="price" class="font-12 text-secondary">Price</label>
                    <p class="mb-0 font-14">MRP<del className="mx-2 text-secondary">{planInfo?.amount}.00</del>{'₹'+planInfo?.price}</p>
                </div>

                {/* <div>
                <label for="price" class="font-12 text-secondary">MRP</label>
                    <p class="mb-0 text-secondary font-14">₹<del>{planInfo?.amount}.00</del></p>
                    </div> */}
                <div class="col-lg-1 planItem col-4">
                    <label for="coolingPeriod" class="font-12 text-secondary">Cooling Period</label>
                    <p class="mb-0 font-14">{planInfo?.coolingPeriod}</p>
                </div>
            </div>
        </div>
    )
}