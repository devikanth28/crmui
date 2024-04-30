import Validate from "../../../helpers/Validate";

const validate = Validate();

export default (props)=>{
    const plan = props.plan;
    const isCombo = validate.isEmpty(plan?.benefitType);
    return (
        <div className="pointer">
            {!isCombo && <PlanCard plan={plan} redirectUrl={()=>{props.handleRedirect(plan?.planId)}}/> }
            {isCombo && <ComboPlanCard plan={plan} redirectUrl={()=>{props.handleRedirect(plan?.planId)}}/>}
        </div>
    )
}

const PlanCard=(props)=>{
    const {plan} = props;
    return <div onClick={()=>{props.redirectUrl()}}>
        <div className='card p-12 mb-3'>
            <div className='d-flex justify-content-between align-items-center'>
                <div>
                    <h6 className='mb-0 text-wrap'>{plan.name}</h6>
                    {plan.price && <p className='font-14 mb-0 text-secondary'>Price <span className='rupee'>&#x20B9;</span>{plan.price}</p>}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g id="rightchevron_black_icon_24px" transform="translate(-906.838 786) rotate(-90)">
                        <rect id="Rectangle_4721" data-name="Rectangle 4721" width="24" height="24" transform="translate(762 906.838)" fill="none" />
                        <path id="Path_23400" data-name="Path 23400" d="M63.432,503.859l5.4-5.4a1.223,1.223,0,0,0-1.73-1.73l-4.533,4.52-4.533-4.533a1.228,1.228,0,0,0-2.092.865,1.216,1.216,0,0,0,.363.865l5.4,5.411A1.229,1.229,0,0,0,63.432,503.859Z" transform="translate(711.356 418.584)" fill="#080808" />
                    </g>
                </svg>
            </div>
        </div>
    </div>
}

const ComboPlanCard=(props)=>{
    const {plan} = props;
    if(validate.isNotEmpty(plan) &&  (validate.isEmpty(plan.pharmaPlan) || validate.isEmpty(plan.healthPlan))){
        return <div></div>
    }
    return <div onClick={()=>{props.redirectUrl()}}>
        <div className='card mb-3'>
            <div className='p-12 border-bottom fw-bold d-flex justify-content-between'>
                <p className='mb-0'>{plan.name}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g id="rightchevron_black_icon_24px" transform="translate(-906.838 786) rotate(-90)">
                        <rect id="Rectangle_4721" data-name="Rectangle 4721" width="24" height="24" transform="translate(762 906.838)" fill="none" />
                        <path id="Path_23400" data-name="Path 23400" d="M63.432,503.859l5.4-5.4a1.223,1.223,0,0,0-1.73-1.73l-4.533,4.52-4.533-4.533a1.228,1.228,0,0,0-2.092.865,1.216,1.216,0,0,0,.363.865l5.4,5.411A1.229,1.229,0,0,0,63.432,503.859Z" transform="translate(711.356 418.584)" fill="#080808" />
                    </g>
                </svg>
            </div>
            <div className='d-flex justify-content-between align-items-center p-12'>
                <div>
                    <h6 className='mb-0 text-wrap'>{plan.pharmaPlan?.name}</h6>
                    {plan.pharmaPlan.price && <p className='font-14 mb-0 text-secondary'>Price <span className='rupee'>&#x20B9;</span>{plan.pharmaPlan.price}</p>}
                </div>
            </div>
            <div className="border-bottom"></div>
            <div className='d-flex justify-content-between align-items-center p-12'>
                <div>
                    <h6 className='mb-0 text-wrap'>{plan.healthPlan.name}</h6>
                    {plan.healthPlan.price && <p className='font-14 mb-0 text-secondary'>Price <span className='rupee'>&#x20B9;</span>{plan.healthPlan.price}</p>}
                </div>
            </div>
        </div>
    </div>
}
