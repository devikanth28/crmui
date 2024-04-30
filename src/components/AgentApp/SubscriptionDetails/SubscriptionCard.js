import dateFormat from "dateformat";
import OrderHelper from "../../../helpers/OrderHelper";
import Validate from "../../../helpers/Validate";
import { BodyComponent, Wrapper } from "../../Common/CommonStructure";

const SubscriptionCard = ({ subscriptionInfo, ...props }) => {
    const { planName, subscriptionCode, exipryDate, status, startDate } = subscriptionInfo || {};
    const validate = Validate();


    return (
       
            <BodyComponent className="body-height p-0">
                {validate.isNotEmpty(subscriptionInfo) &&<>                        
                    <div onClick={props.handleRedirect} className="card p-12">
                    {validate.isNotEmpty(status) &&
                        <div> 
                            <p className={`${OrderHelper().getBadgeColorClassForStatus(status)} badge rounded-pill mb-0 mt-1`}>{OrderHelper().getStatusWithFirstLetterCapitalized(status)}</p>
                        </div>
                    }
                    <div class="d-flex flex-wrap planInfo gap-3">
                        {validate.isNotEmpty(planName) && <div class=" col-lg-2 planItem col-9 mt-3">
                            <label class="font-12 text-secondary">Display Name</label>
                            <p class="mb-0 font-14">{planName}</p>
                        </div>}
                        <div className="col-2 mt-3 text-end">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                <g id="rightchevron_black_icon_18px" transform="translate(-906.838 780) rotate(-90)">
                                    <rect id="Rectangle_4721" data-name="Rectangle 4721" width="18" height="18" transform="translate(762 906.838)" fill="none" />
                                    <path id="Path_23400" data-name="Path 23400" d="M61.559,501.985l4.049-4.049a.917.917,0,0,0-1.3-1.3l-3.4,3.39-3.4-3.4a.921.921,0,0,0-1.569.649.912.912,0,0,0,.272.649l4.049,4.059A.922.922,0,0,0,61.559,501.985Z" transform="translate(710.032 416.557)" fill="#080808" />
                                </g>
                            </svg>
                        </div>
                        {validate.isNotEmpty(subscriptionCode) && <div class="col-lg-1 planItem col-7">
                            <label class="font-12 text-secondary">Code</label>
                            <p class="mb-0 font-14">{subscriptionCode}</p>
                        </div>}
                        
                        {props.view == "CURRENT" && validate.isNotEmpty(exipryDate) && <div class="col-lg-1 planItem col-4">
                            <label class="font-12 text-secondary">Expiry</label>
                            <p class="mb-0 font-14">{dateFormat(exipryDate, "mmm dd,yyyy")}</p>
                        </div>}
                        {props.view == "UPCOMING" && validate.isNotEmpty(startDate) &&  <div class="col-lg-1 planItem col-4">
                            <label class="font-12 text-secondary">Valid From</label>
                            <p class="mb-0 font-14">{dateFormat(startDate, "mmm dd,yyyy")}</p>
                        </div>}
                       
                    </div>
                    </div>
                    </>

                }
            </BodyComponent>
        
    )
}

export default SubscriptionCard;