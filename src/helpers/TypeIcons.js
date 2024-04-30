import React from 'react'
import { UncontrolledTooltip } from 'reactstrap'

export const ComplimentaryIcon = (props) => {
    return <React.Fragment>
        <button type="button" onClick={props.handleOnClick} id={`UncontrolledTooltipExample01_${props?.id}`} className="icon-hover btn-sm btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g id="complimentary-product-icn-24" transform="translate(-396 -484)">
                    <circle id="Ellipse_1194" data-name="Ellipse 1194" cx="12" cy="12" r="12" transform="translate(396 484)" fill="#efc3e6" />
                    <g id="prescription-icn-32" transform="translate(4937 -19938)">
                        <rect id="Rectangle_12079" data-name="Rectangle 12079" width="16" height="16" rx="4" transform="translate(-4537 20426)" fill="none" />
                        <path id="Union_192" data-name="Union 192" d="M-17.212-7871.75A1.789,1.789,0,0,1-19-7873.538v-7.483a1.79,1.79,0,0,1,1.787-1.789h1.294a1.366,1.366,0,0,1-.168-.174,1.864,1.864,0,0,1-.376-1.381,1.861,1.861,0,0,1,.711-1.243,1.868,1.868,0,0,1,1.144-.392,1.856,1.856,0,0,1,1.48.726,1.865,1.865,0,0,1,.281.612,1.827,1.827,0,0,1,.279-.612,1.862,1.862,0,0,1,1.48-.726,1.86,1.86,0,0,1,1.144.392,1.853,1.853,0,0,1,.711,1.243,1.856,1.856,0,0,1-.376,1.381,1.145,1.145,0,0,1-.168.174h1.3a1.789,1.789,0,0,1,1.787,1.789v7.483a1.789,1.789,0,0,1-1.787,1.787Zm4.906-1.081h3.824a.707.707,0,0,0,.707-.707v-3.2h-4.53Zm-5.613-.694a.707.707,0,0,0,.707.694h3.824v-3.909h-4.53Zm5.613-4.295h4.53v-3.2a.706.706,0,0,0-.7-.707h-3.826Zm-5.613-3.2v3.2h4.53v-3.907h-3.824A.707.707,0,0,0-17.919-7881.021Zm2.83-3.733a.79.79,0,0,0-.3.525.79.79,0,0,0,.158.583,5.038,5.038,0,0,0,1.564.73,5.023,5.023,0,0,0-.315-1.7.791.791,0,0,0-.625-.3A.778.778,0,0,0-15.089-7884.753Zm3.376.141a5.044,5.044,0,0,0-.315,1.7,4.939,4.939,0,0,0,1.565-.73.782.782,0,0,0,.156-.582.784.784,0,0,0-.3-.525.793.793,0,0,0-.483-.164A.788.788,0,0,0-11.712-7884.613Z" transform="translate(-4516 28313)" fill="#080808" />
                    </g>
                </g>
            </svg>
        </button>
        <UncontrolledTooltip placement="bottom" target={`UncontrolledTooltipExample01_${props?.id}`}>
            {props.tooltip ? props.tooltip : 'Complimentary Product'}
        </UncontrolledTooltip>
    </React.Fragment>
}

export const CouponIcon = (props) => {
    return <React.Fragment>
        <button type="button" onClick={props.handleOnClick} id={`UncontrolledTooltipExample02_${props?.id}`} className="icon-hover btn-sm btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g id="coupon-applied-icn-24" transform="translate(-396 -484)">
                    <circle id="Ellipse_1194" data-name="Ellipse 1194" cx="12" cy="12" r="12" transform="translate(396 484)" fill="#d3d3d3" />
                    <g id="prescription-icn-32" transform="translate(4937 -19938)">
                        <rect id="Rectangle_12079" data-name="Rectangle 12079" width="16" height="16" rx="4" transform="translate(-4537 20426)" fill="none" />
                        <path id="Union_191" data-name="Union 191" d="M-5637.339,12202.866a.493.493,0,0,1-.493-.493.539.539,0,0,0-.16-.386.542.542,0,0,0-.386-.159.535.535,0,0,0-.386.159.54.54,0,0,0-.159.386.493.493,0,0,1-.493.493h-8.094a.492.492,0,0,1-.49-.493v-7.883a.492.492,0,0,1,.49-.49h8.094a.492.492,0,0,1,.493.49.545.545,0,0,0,.159.389.535.535,0,0,0,.386.159.53.53,0,0,0,.386-.159.544.544,0,0,0,.16-.389.492.492,0,0,1,.493-.49h3.1a.491.491,0,0,1,.49.49v7.883a.492.492,0,0,1-.49.493Zm.043-7.292a1.554,1.554,0,0,1-.588.367v4.982a1.557,1.557,0,0,1,.588.368,1.49,1.49,0,0,1,.368.591h2.2v-6.9h-2.2A1.538,1.538,0,0,1-5637.3,12195.574Zm-9.72,6.309h7.19a1.524,1.524,0,0,1,.368-.591,1.543,1.543,0,0,1,.591-.368v-4.982a1.541,1.541,0,0,1-.591-.367,1.56,1.56,0,0,1-.368-.591h-7.19Zm3.858-.781-.027-.027a1.172,1.172,0,0,1-.318-.806,1.183,1.183,0,0,1,.343-.833,1.174,1.174,0,0,1,.836-.346,1.165,1.165,0,0,1,.83.346,1.165,1.165,0,0,1,.349.833,1.172,1.172,0,0,1-.346.833,1.172,1.172,0,0,1-.833.347A1.163,1.163,0,0,1-5643.158,12201.1Zm.7-.971a.2.2,0,0,0-.058.138.2.2,0,0,0,.046.132l.009.006a.184.184,0,0,0,.141.059.2.2,0,0,0,.138-.055.194.194,0,0,0,.055-.139.2.2,0,0,0-.055-.141l-.019-.015a.19.19,0,0,0-.12-.04A.191.191,0,0,0-5642.463,12200.131Zm-2.7.576a.5.5,0,0,1-.08-.689l3.017-3.779a.492.492,0,0,1,.386-.187.492.492,0,0,1,.306.107.49.49,0,0,1,.077.688l-3.017,3.782a.485.485,0,0,1-.383.185A.484.484,0,0,1-5645.161,12200.707Zm-.04-3.277-.027-.03a1.158,1.158,0,0,1-.319-.8,1.167,1.167,0,0,1,.346-.833,1.162,1.162,0,0,1,.833-.346,1.165,1.165,0,0,1,.83.346,1.165,1.165,0,0,1,.349.833,1.177,1.177,0,0,1-.346.833,1.173,1.173,0,0,1-.833.347A1.163,1.163,0,0,1-5645.2,12197.43Zm.7-.974a.194.194,0,0,0-.058.141.2.2,0,0,0,.046.129l.009.009a.2.2,0,0,0,.141.059.2.2,0,0,0,.138-.056.2.2,0,0,0,.055-.141.185.185,0,0,0-.058-.138l-.015-.019a.205.205,0,0,0-.122-.038A.187.187,0,0,0-5644.505,12196.456Z" transform="translate(1111.875 8235.875)" fill="#080808" />
                    </g>
                </g>
            </svg>
        </button>
        <UncontrolledTooltip placement="bottom" target={`UncontrolledTooltipExample02_${props?.id}`}>
            {props.tooltip ? props.tooltip : 'Coupon Applied'}
        </UncontrolledTooltip>
    </React.Fragment>
}

export const PrescriptionRequiredIcon = (props) => {
    return <React.Fragment>
        <button type="button" onClick={props.handleOnClick} id={`UncontrolledTooltipExample03_${props?.id}`} className="icon-hover btn-sm btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g id="prescription-required-icn-24" transform="translate(-396 -484)">
                    <circle id="Ellipse_1194" data-name="Ellipse 1194" cx="12" cy="12" r="12" transform="translate(396 484)" fill="#a7ccf8" />
                    <g id="prescription-icn-32" transform="translate(4937 -19938)">
                        <rect id="Rectangle_12079" data-name="Rectangle 12079" width="16" height="16" rx="4" transform="translate(-4537 20426)" fill="none" />
                        <path id="Subtraction_65" data-name="Subtraction 65" d="M7.166,12a.712.712,0,0,1-.481-.191L5.14,10.345,3.591,11.809A.7.7,0,0,1,3.109,12a.712.712,0,0,1-.481-.191.618.618,0,0,1-.2-.454.628.628,0,0,1,.2-.454L4.184,9.443l-2.83-2.67V9.825a.624.624,0,0,1-.2.454.7.7,0,0,1-.481.186H.664A.7.7,0,0,1,.2,10.279.623.623,0,0,1,0,9.825V.638A.619.619,0,0,1,.2.186.69.69,0,0,1,.675,0H3.109a3.162,3.162,0,0,1,2.7,1.469,2.81,2.81,0,0,1,0,2.934,3.162,3.162,0,0,1-2.7,1.469h-.8l2.83,2.67L6.684,7.073a.7.7,0,0,1,.481-.186.68.68,0,0,1,.179.022.658.658,0,0,1,.481.454.618.618,0,0,1-.175.618L6.094,9.443,7.651,10.9a.637.637,0,0,1,.2.454.618.618,0,0,1-.2.454A.7.7,0,0,1,7.166,12ZM1.355,1.278h0V4.593H3.109a1.776,1.776,0,0,0,1.521-.831,1.572,1.572,0,0,0,0-1.655,1.778,1.778,0,0,0-1.521-.828Z" transform="translate(-4533 20428)" fill="#080808" />
                    </g>
                </g>
            </svg>
        </button>
        <UncontrolledTooltip placement="bottom" target={`UncontrolledTooltipExample03_${props?.id}`}>
            {props.tooltip ? props.tooltip : 'Prescription Required'}
        </UncontrolledTooltip>
    </React.Fragment>
}

export const GenderRestrictTypeIcon = (props) => {
    console.log("props.id", props.id)
    return <React.Fragment>
        <button type="button" onClick={props.handleOnClick} id={`UncontrolledTooltipExample04_${props?.id}`} className="icon-hover btn-sm btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" id={`UncontrolledTooltipExample03_${props?.id}`} className="icon-hover btn-sm btn">
                <g id="gender-specific-icn-24" transform="translate(-367 -484)">
                    <circle id="Ellipse_1194" data-name="Ellipse 1194" cx="12" cy="12" r="12" transform="translate(367 484)" fill="#efc3e6" />
                    <g id="np_gender_5399083_000000" transform="translate(360.071 475.461)">
                        <path id="Path_53540" data-name="Path 53540" d="M16.791,33.3h-.56V31.826a4.659,4.659,0,0,0,3.212-2,4.633,4.633,0,0,0,0-5.228,2.7,2.7,0,0,0-1.1.662,3.382,3.382,0,0,1-2.2,5.289,3.492,3.492,0,0,1-.553.045,3.38,3.38,0,1,1,0-6.76,3.492,3.492,0,0,1,.553.045q.178-.216.374-.413a5.045,5.045,0,0,1,.726-.608,4.658,4.658,0,1,0-2.294,8.968V33.3h-.56a.64.64,0,1,0,0,1.28h.56V35a.64.64,0,1,0,1.28,0v-.419h.56a.64.64,0,1,0,0-1.28Z" transform="translate(0 -7.17)" />
                        <path id="Path_53541" data-name="Path 53541" d="M44.92,13.74a.706.706,0,0,0-.454-.2s-.006,0-.01,0h-2.38a.64.64,0,0,0,0,1.28h.781l-1.6,1.523a4.659,4.659,0,0,0-6.677,6.322,2.714,2.714,0,0,0,1.1-.665,3.381,3.381,0,0,1,.029-3.945,3.668,3.668,0,0,1,.342-.4c.061-.061.125-.122.189-.176.038-.035.08-.067.118-.1s.07-.051.1-.077.07-.051.106-.074c.093-.061.186-.118.282-.17.048-.026.1-.051.147-.074a1.548,1.548,0,0,1,.15-.067c.051-.019.1-.042.154-.058a3.286,3.286,0,0,1,.6-.154,3.323,3.323,0,0,1,.537-.045,3.38,3.38,0,1,1,0,6.76,3.678,3.678,0,0,1-.563-.045,5.205,5.205,0,0,1-1.1,1.021,4.7,4.7,0,0,0,1.664.3,4.653,4.653,0,0,0,3.721-7.455l1.66-1.58v.893a.64.64,0,0,0,1.28,0V14.178a.664.664,0,0,0-.176-.438Z" transform="translate(-18.166)" />
                    </g>
                </g>
            </svg>
        </button>
<UncontrolledTooltip placement="bottom" target={`UncontrolledTooltipExample04_${props?.id}`}>
            {props.tooltip ? props.tooltip : 'Gender Restrict'}
        </UncontrolledTooltip>
    </React.Fragment>
}

export const H1DrugIcon = (props) => {
    return <React.Fragment>
        <button type="button"  id={`UncontrolledTooltipExample04_${props?.id}`} className="icon-hover btn-sm btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
        <g id="schedule-drug-icn-16" transform="translate(-367 -521)">
            <circle id="Ellipse_1194" data-name="Ellipse 1194" cx="8" cy="8" r="8" transform="translate(367 521)" fill="#f5d0b7" />
            <path id="Path_53542" data-name="Path 53542" d="M6.451-1.543H5.011v-3H2.2v3H.762v-6.99H2.2V-5.7H5.011V-8.533h1.44Zm4.482,0H9.545V-6.891l-1.656.514V-7.506l2.9-1.037h.149Z" transform="translate(369.238 534.543)" fill="#080808" />
        </g>
    </svg>
        </button>
<UncontrolledTooltip placement="bottom" target={`UncontrolledTooltipExample04_${props?.id}`}>
            {props.tooltip ? props.tooltip : 'Scheduled Drug'}
        </UncontrolledTooltip>
    </React.Fragment>
}

