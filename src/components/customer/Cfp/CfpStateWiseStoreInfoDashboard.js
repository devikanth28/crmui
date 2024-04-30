
import qs from 'qs';
import React, { useEffect, useRef, useState, useContext } from 'react';
import Validate from '../../../helpers/Validate';
import CustomerService from '../../../services/Customer/CustomerService';
import { AlertContext } from '../../Contexts/UserContext';
import { Badges} from "@medplus/react-common-components/DataGrid";
import { Spinner } from 'react-bootstrap';
import NoDataFound from '../../Common/NoDataFound';

function CfpStateWiseStoreInfoDashboard(props) {

    const validate = Validate();
    const { setStackedToastContent } = useContext(AlertContext);
    const [stateWiseEscalatedCfpsCount, setStateWiseEscalatedCfpsCount] = useState([]);
    const [regionWiseEscalatedCfpStoresCount, setRegionWiseEscalatedCfpStoresCount] = useState([]);
    const [regionWiseEscalatedCfpStoresCountForState, setRegionWiseEscalatedCfpStoresCountForState] = useState([]);
    const [viewMoreClicked, setViewMoreClicked] = useState({});
    const [loading, setLoading] = useState(false);
    const CardHeightRef = useRef(null);

    useEffect(() => {
        if(props.activeTabId == 2){
            getStateWiseCFPActionsInfo();
        }
    }, [props.activeTabId]);

    
    const getStateWiseCFPActionsInfo = async() => {
        setLoading(true)
        await CustomerService().getStateWiseCFPActionsInfo().then(data => {
            if (data && data.statusCode === "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                if (validate.isNotEmpty(data.dataObject.stateWiseEscalatedCfpsCount)) {
                    setStateWiseEscalatedCfpsCount(data.dataObject.stateWiseEscalatedCfpsCount);
                    setRegionWiseEscalatedCfpStoresCount(data.dataObject.regionWiseEscalatedCfpStoresCount);
                }
            } else {
                setStackedToastContent({ toastMessage: data.message });
            }
            setLoading(false);
        }).catch((err) => {
            setStackedToastContent({ toastMessage: "Something went wrong, Please Try Again!" });
            setLoading(false);
        });
    }

    const getRegionWiseEscalatedCfpStoresCountForState = async(state) => {
        setLoading(true)
        await CustomerService().getRegionWiseEscalatedCfpStoresCountForState({state: state}).then(data => {
            if (data && data.statusCode === "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                if (validate.isNotEmpty(data.dataObject.regionWiseEscalatedCfpStoresCountForState)) {
                    setRegionWiseEscalatedCfpStoresCountForState(data.dataObject.regionWiseEscalatedCfpStoresCountForState);
                    setViewMoreClicked({[state]: true});
                }
            } else {
                setStackedToastContent({ toastMessage: data.message });
            }
            setLoading(false);
        }).catch((err) => {
            setStackedToastContent({ toastMessage: "Something went wrong, Please Try Again!" });
            setLoading(false);
        });
    }

    const navigateToCfpInfo = (store) => {
        const currentDate = new Date();

        const fromDate = new Date(currentDate);
        fromDate.setDate(currentDate.getDate() - 10);
        const formattedFromDate = fromDate.toISOString().slice(0, 10);

        const toDate = new Date(currentDate);
        toDate.setDate(currentDate.getDate() - 3);
        const formattedToDate = toDate.toISOString().slice(0, 10);

        let finalorderSearchCriteria = {
            storeId: store,
            status: "C,P",
            fromDate: formattedFromDate,
            toDate: formattedToDate
        };
        props.history.push(`/customer-relations/ui/cfpSearch?${qs.stringify(finalorderSearchCriteria)}`);
    }

    return (
        <React.Fragment>
            <div className="grid-container">
                {
                    loading ? <Spinner /> : null
                }
            {validate.isNotEmpty(regionWiseEscalatedCfpStoresCount) ? <div className='escalationsContainer h-100' ref={CardHeightRef}>
                { Object.entries(regionWiseEscalatedCfpStoresCount).map(([state, stateWiseStoreInfo]) => {
                        return (
                            <React.Fragment>
                            <div className='mh-100 escalations'>
                                <div className="card mh-100">
                                    <div className="card-header bg-transparent p-2">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <p className='mb-0 text-capitalize'>{state.toLowerCase()}</p>
                                            <Badges className={"badge text-dark bg-light"} text={stateWiseEscalatedCfpsCount[state]}  />
                                            {/* <p className='mb-0'>{]}</p> */}
                                        </div>
                                    </div>
                                    <div className='card-body p-2' style={{'max-height':`calc(${CardHeightRef?.current?.offsetHeight}px - 89px)`,'min-height':'146px','overflow-y':'auto'}}>
                                        <ul className='p-0 mb-0'>
                                            { Object.entries((viewMoreClicked && viewMoreClicked[state] && regionWiseEscalatedCfpStoresCountForState) ? regionWiseEscalatedCfpStoresCountForState : stateWiseStoreInfo).map(([store, count]) => {
                                                return (
                                                    <li className="d-flex justify-content-between font-12 pointer pb-2" onClick={() => navigateToCfpInfo(store)}>
                                                        <span className='mb-0 '>{store}</span>
                                                        <Badges className={"badge text-dark bg-light"} text={count}  />
                                                        
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    {(stateWiseEscalatedCfpsCount[state] > 5 && !viewMoreClicked[state]) ? <div class="card-footer bg-transparent p-2">
                                        <a href="javascript:void(0)" class="link-primary btn btn-sm" onClick={() => getRegionWiseEscalatedCfpStoresCountForState(state)}>View More</a>
                                    </div> : null}
                                    {viewMoreClicked[state] ? <div class="card-footer bg-transparent p-2">
                                        <a href="javascript:void(0)" class="link-primary btn btn-sm" onClick={() => setViewMoreClicked({[state]: false})}>View Less</a>
                                    </div> : null}
                                </div>
                            </div>
                            </React.Fragment>
                        )
                    })
                }
            </div> : !loading ? <NoDataFound text={"No any escalated CFP stores Info"} /> : null}
            </div>
        </React.Fragment>
    )
}

export default CfpStateWiseStoreInfoDashboard;