import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useRef, useState } from "react";
import { downloadFile } from '../../helpers/LabOrderHelper';
import Validate from "../../helpers/Validate";
import LAB_ORDER_CONFIG from '../../services/LabOrder/LabOrderConfig';
import LabOrderService from "../../services/LabOrder/LabOrderService";
import { API_URL } from '../../services/ServiceConstants';
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure';
import NoDataFound from '../Common/NoDataFound';
import CurrencyFormatter from '../Common/CurrencyFormatter';

const LabsUserDSRDashboard = ({ helpers, ...props }) => {
    const validate = Validate();
    const labOrderService = LabOrderService();
    const [gridData, setGridData] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const [selectedCollection, setselectedCollection] = useState(false);
    const [responseObj, setResponseObj] = useState(undefined);
    const headerRef = useRef(0);
    const [loading,setLoading] = useState(false);
     
    const getUserWiseDSRData = async (obj) => {

        await labOrderService.getUserWiseDSRData(obj).then(data => {
            if (data && data.statusCode === "SUCCESS") {
                setGridData(data.dataObject.dataGrid);
                setDataSet(data.dataObject.dataSet);
                setselectedCollection(true)
                setResponseObj(data.dataObject.responseObj);
            } else {
                setGridData(undefined);
                setDataSet([]);
                setselectedCollection(true)
                setResponseObj(undefined);
            }
            setLoading(false);
        }).catch(error => {
            console.log("error " + JSON.stringify(error));
            setGridData([]);
            setDataSet([]);
            setLoading(false);

        });
    }

    const downloadReport = (responseObj) => {
        let userWiseDsrReportStr = encodeURIComponent(JSON.stringify(responseObj));

        const downloadPdfUrl = `${API_URL}${LAB_ORDER_CONFIG.DOWNLOAD_USER_DSR_REPORT.url}?userWiseDsrReportStr=${userWiseDsrReportStr}`;
        const response = downloadFile(downloadPdfUrl)
        if (response && response.status && response.status === "failure") {
            setAlertContent(response.message);
        }
    }

    const getUserWiseDSR = () => {
        
        const userDSRSearchCriteria = helpers.validateAndCollectValuesForSubmit("userDsrForm", false, false, false);
        if (validate.isNotEmpty(userDSRSearchCriteria) && validateUserDSRSearchCriteria(userDSRSearchCriteria)) {
            let todayDate = new Date();
            setLoading(true);
            getUserWiseDSRData({ dsrSearchCriteriaStr: { centerId: userDSRSearchCriteria.collectionCenters[0], fromDate: getStartTime(todayDate), toDate: todayDate } })

        }

    }
    const validateUserDSRSearchCriteria = (userDSRSearchCriteria) => {
        if (validate.isEmpty(userDSRSearchCriteria)) {
            setAlertContent({ alertMessage: "Please fill all the mandatory fields" });
            return false;
        }
        if (validate.isEmpty(userDSRSearchCriteria.collectionCenters)) {
            setAlertContent({ alertMessage: "Please select the collection center" });
            return false;
        }
        return true;
    }
    const getStartTime = (selectedDate) => {
        let tempDate = new Date(selectedDate);
        tempDate.setHours(0, 0, 0, 0);
        return tempDate;
    }

    const callBackMapping = {
        'receiptsValue': (props) => {
            const { row } = props;
            return <React.Fragment>
                <div className="text-end">
                    <CurrencyFormatter data={row['receiptsValue(Rs.)']} decimalPlaces={2} />
                </div>
            </React.Fragment>
        },
        'refundsValue': (props) => {
            const { row } = props;
            return <React.Fragment>
                <div className="text-end">
                <CurrencyFormatter data={row['refundsValue(Rs.)']} decimalPlaces={2} />
                </div>
            </React.Fragment>
        },
        'creditNoteValue': (props) => {
            const { row } = props;
            return <React.Fragment>
                <div className="text-end">
                <CurrencyFormatter data={row['creditNoteValue(Rs.)']} decimalPlaces={2} />
                </div>
            </React.Fragment>
        },
        'membershipFeesValue': (props) => {
            const { row } = props;
            return <React.Fragment>
                <div className="text-end">
                <CurrencyFormatter data={row['membershipFeesValue(Rs.)']} decimalPlaces={2} />
                </div>
            </React.Fragment>
        },
        'membershipRefundValue': (props) => {
            const { row } = props;
            return <React.Fragment>
                <div className="text-end">
                <CurrencyFormatter data={row['membershipRefundValue(Rs.)']} decimalPlaces={2} />
                </div>
            </React.Fragment>
        },
        'UserTotalCollection': (props) => {
            const { row } = props;
            return <React.Fragment>
                <div className="text-end">
                <CurrencyFormatter data={row['User Total Collection(Rs.)']} decimalPlaces={2} />
                </div>
            </React.Fragment>
        }
    }

    return <React.Fragment>
        <Wrapper showHeader={false}>
            <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                User Day Sale Report (DSR)
            </HeaderComponent>
            <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height">
                <div className='row align-item-center'>
                  <DynamicForm requestUrl={`${API_URL}userDsrForm`} requestMethod={'GET'} helpers={helpers}  />
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 d-flex gap-2 justify-content-start flex-row-reverse flex-md-row mb-3">
                        {<button type="button" className="px-4 btn-dark me-2 btn" style={{'height':'50px'}} onClick={() => getUserWiseDSR()}>Get Details</button>}
                        <button type="button" className="px-4 btn-outline-dark btn" style={{'height':'50px'}} onClick={() => { helpers.resetForm("userDsrForm"); setselectedCollection(null); setGridData(undefined) }}>Reset</button>
                    </div>
                </div>
                {validate.isNotEmpty(selectedCollection) && selectedCollection && <div style={{ 'height': `calc(100% - 91px)` }}>
                    {(validate.isNotEmpty(gridData) && validate.isNotEmpty(dataSet)) ?
                        <div className="card h-100" >
                            <div className='card-body h-100 p-0'>
                                <div className="text-end p-2">
                                    <button type="button" className="p-1 btn btn- btn-link text-dark" onClick={() => downloadReport(responseObj)}>

                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="align-text-top me-2">
                                        <g id="download-black-icn-16" transform="translate(-180.258 -387.452)">
                                            <rect id="Rectangle_3299" data-name="Rectangle 3299" width="16" height="16" rx="3" transform="translate(180.258 387.452)" fill="none"></rect>
                                            <g id="download-icn" transform="translate(180.259 386.725)">
                                                <path id="Subtraction_92" data-name="Subtraction 92" d="M1303.523-8060.166a.489.489,0,0,1-.488-.488.494.494,0,0,1,.45-.49h.045a2.3,2.3,0,0,0,1.223-.405,1.381,1.381,0,0,0,.591-1.15,1.845,1.845,0,0,0-.421-1.146l-.024-.034a1.764,1.764,0,0,0-1.491-.743h-.172a.241.241,0,0,1-.038,0,.44.44,0,0,1-.363-.17l-.008-.01a.434.434,0,0,1-.089-.423,2.75,2.75,0,0,0,.093-.719,2.73,2.73,0,0,0-2.7-2.756,2.731,2.731,0,0,0-2.7,2.756v.17a.491.491,0,0,1-.194.415.536.536,0,0,1-.3.089.463.463,0,0,1-.17-.031,2.8,2.8,0,0,0-1.055-.2,2.371,2.371,0,0,0-2.507,2.2,2.588,2.588,0,0,0,.281,1.219,1.753,1.753,0,0,0,1.484.907h.008a.043.043,0,0,1,.014,0,.3.3,0,0,0,.065.01.491.491,0,0,1,.413.476.49.49,0,0,1-.49.488.766.766,0,0,1-.164-.012l-.014,0a2.821,2.821,0,0,1-2.562-3.062,3.332,3.332,0,0,1,3.471-3.163,3.184,3.184,0,0,1,.634.057l.128.024.02-.127a3.8,3.8,0,0,1,1.237-2.258,3.629,3.629,0,0,1,2.394-.909,3.7,3.7,0,0,1,3.674,3.718,1.588,1.588,0,0,1-.012.243l-.02.122.122.022a2.749,2.749,0,0,1,1.79,1.1l0,.006a2.743,2.743,0,0,1,.63,1.733,2.618,2.618,0,0,1-2.716,2.52l-.024,0-.022.01A.143.143,0,0,1,1303.523-8060.166Z" transform="translate(-1291.125 8071.875)"></path>
                                                <path id="Subtraction_91" data-name="Subtraction 91" d="M1294.726-8068.672h-1.987a.489.489,0,0,1-.49-.488.49.49,0,0,1,.49-.488h1.987a.489.489,0,0,1,.488.488A.488.488,0,0,1,1294.726-8068.672Z" transform="translate(-1288.641 8080.381)"></path>
                                                <path id="Subtraction_90" data-name="Subtraction 90" d="M1292.737-8068.67h0a.493.493,0,0,1-.488-.478.484.484,0,0,1,.476-.486l1.679-.014a.483.483,0,0,1,.49.474.482.482,0,0,1-.476.488Z" transform="translate(-1282.268 8080.424)"></path>
                                                <path id="Subtraction_89" data-name="Subtraction 89" d="M1294.667-8062.738a.446.446,0,0,1-.314-.117l-1.93-1.608a.482.482,0,0,1-.172-.324.5.5,0,0,1,.115-.363.486.486,0,0,1,.369-.174.5.5,0,0,1,.318.117l1.126.948v-4.9a.489.489,0,0,1,.488-.488.489.489,0,0,1,.488.488v5.917a.489.489,0,0,1-.28.444A.481.481,0,0,1,1294.667-8062.738Z" transform="translate(-1286.507 8077.946)"></path>
                                                <path id="Subtraction_88" data-name="Subtraction 88" d="M1292.733-8067.1a.472.472,0,0,1-.373-.174.473.473,0,0,1-.107-.354.493.493,0,0,1,.178-.333l1.93-1.578a.47.47,0,0,1,.3-.111.5.5,0,0,1,.383.182.473.473,0,0,1,.109.349.494.494,0,0,1-.18.336l-1.946,1.566A.482.482,0,0,1,1292.733-8067.1Z" transform="translate(-1284.572 8082.307)"></path>
                                            </g>
                                        </g>
                                    </svg>

                                    Download</button></div>
                                <div style={{'height':`calc(100% - 50px)`}}>
                                    <CommonDataGrid {...gridData} dataSet={dataSet} callBackMap={callBackMapping} />
                                </div>
                            </div>
                        </div> : <div style={{ 'height': `calc(100% - 91px)` }}> <NoDataFound text={"No Details available with specific criteria"} searchButton={false} /></div>}
                </div>
                }
            </BodyComponent>
        </Wrapper>
    </React.Fragment>
}

export default withFormHoc(LabsUserDSRDashboard);