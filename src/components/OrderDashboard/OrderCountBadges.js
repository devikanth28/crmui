import React from 'react';
import Validate from '../../helpers/Validate';
import { Badges } from '@medplus/react-common-components/DataGrid';

function OrderCountBadges(props) {
    
    
    const handleClick = (orderCount, statusKey) => {
        if (Validate().isNotEmpty(orderCount) && orderCount > 0){
            props.handleOrderStatusClick(statusKey)
        }
    }

    const getDisplayCount = (count) => {
        if (count > 99) {
            return 99;
        } else {
            return count;
        }
      }

    const dayString = props.dateDifferences > 1 ? 'days' : 'day';
    
      const getTextForBadge =(value)=>{
        return (<React.Fragment>
            {getDisplayCount(Validate().isNotEmpty(value)?value:0)}
            {(Validate().isNotEmpty(value)?value:0)> 99 && <sup>
                <svg xmlns="http://www.w3.org/2000/svg" width="4.398" height="4.4" viewBox="0 0 4.398 4.4">
                    <g id="Group_34028" data-name="Group 34028" transform="translate(-116.25 -4.25)">
                        <path id="Path_50482" data-name="Path 50482" d="M.451-3.221H1.936V-2.4H.451V-.811H-.471V-2.4H-1.963v-.817H-.471v-1.49H.451Z" transform="translate(118.463 9.211)" fill="#080808" />
                        <path id="Path_50482_-_Outline" data-name="Path 50482 - Outline" d="M-.471-4.711v1.49H-1.963V-2.4H-.471V-.811H.451V-2.4H1.936v-.817H.451v-1.49H-.471m0-.25H.451a.25.25,0,0,1,.25.25v1.24H1.936a.25.25,0,0,1,.25.25V-2.4a.25.25,0,0,1-.25.25H.7V-.811a.25.25,0,0,1-.25.25H-.471a.25.25,0,0,1-.25-.25V-2.154H-1.963a.25.25,0,0,1-.25-.25v-.817a.25.25,0,0,1,.25-.25H-.721v-1.24A.25.25,0,0,1-.471-4.961Z" transform="translate(118.463 9.211)" fill="#fff" />
                    </g>
                </svg>
                </sup>}
        </React.Fragment>);
      }

    return (
        <>
            <div className='card mh-100'>
                <div>
                    {props.dateDifferences && <h6 className='mb-0 p-12'>{`Records as per ${props.dateDifferences} ${dayString} ${props.type == "cfp" ? "" : " (Statuses)"}`}</h6>}
                    {props.headingText && <h6>{props.headingText}</h6>}
                    {props.orderSequence && props.orderCount && <>
                        <hr className='m-0'/>
                    </>}
                </div>
                <div className="list-group border-top-0 overflow-y-auto scroll-on-hover" style={props.dateDifferences ? {'height':`calc(100% - 43.2px)`} : {'height': `calc(100% - 0px)`}}>
                            {props.orderSequence && Object.keys(props.orderSequence).map((each) => {
                                if (each == "seperator") {
                                    return (
                                        <p class="list-group-item small mb-0 border-0" style={{ background: props.orderSequence[each].color }}>
                                            {props.orderSequence[each].displayName}
                                        </p>
                                    )
                                } else {
                                    return (
                                        <a href="javascript:void(0)" class="list-group-item list-group-item-action border-0 d-flex" title={Validate().isNotEmpty(props.orderCount[each]) ? (`${props.orderSequence[each].displayName}: ${props.orderCount[each]} orders`) : ''} onClick={(e) => { e.preventDefault();handleClick(props.orderCount[each], props.orderSequence[each].statusKey)}}>
                                            <span className="me-2 position-relative">
                                                <Badges className={props.orderSequence[each].className} text={getTextForBadge(props.orderCount[each])}  id={props.orderSequence[each].displayName} />
                                            </span>
                                            <span>{props.orderSequence[each].displayName}</span>
                    
                                            {/* <span className='me-2 badge rounded-pill' style={{ background: props.orderSequence[each].color }}>{props.orderCount[each] ? props.orderCount[each] > 99 ? "99+" : props.orderCount[each] : 0}</span> <small></small> */}
                                        </a>
                                    )
                                }
                            })}
                        </div>
            </div>
        </>
    );
}

export default OrderCountBadges;