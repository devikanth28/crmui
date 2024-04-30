import CommonDataGrid, { Badges, CallIcon, ChangeType, ClaimConstants, Claimed, ShowPrescription } from '@medplus/react-common-components/DataGrid';
import axios from 'axios';
import qs from 'qs';
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import CustomerIdLink from '../../helpers/CustomerIdLink';
import Validate from '../../helpers/Validate';
import useRowClassFunction from '../../hooks/useRowClassFunction';
import PrescriptionService from "../../services/Prescription/PrescriptionService";
import { CRM_UI } from "../../services/ServiceConstants";
import { Wrapper } from "../Common/CommonStructure";
import NoDataFound from '../Common/NoDataFound';
import SeachNow from '../Common/SearchNow';
import { AlertContext, UserContext } from '../Contexts/UserContext';
import { claimOrders, processOrderClaimedAlready, RECORD_TYPE, unclaimClaimedOrder, unclaimOrders } from '../../helpers/HelperMethods';
import HandleClaims from '../Common/HandleClaims';
import ClaimTabs from '../Common/ClaimTabs';
import { modifyUrlColumnOptions, COLUMN_OPTIONS_URL_KEY_CONSTANT, prepareModifiedColumnOptionsMap } from "../../helpers/ColumnOptionsHelper"
import { searchElement } from '../order/OrderSearchResult';
import { handleClaimRequest } from '../Common/HandleClaims';
import ShowPrescriptionModal from './ShowPrescriptionModal';
import OpenImageGallery from './OpenImageGallery';
import { OpenIcon } from "@medplus/react-common-components/DataGrid";
import ClaimUnclaimHandler from '../Common/ClaimUnclaimHandler';

export default (props) => {

    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const bodyRef = useRef(null);


    const validate = Validate();
    const prescriptionService = PrescriptionService();
    const [selectedRows, setSelectedRows] = useState([]);
    const [gridData, setGridData] = useState(undefined);
    const [gridDataForCreatedState, setGridDataForCreatedStatus] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState({});
    const [loading, isLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(undefined);
    const [totalRecordsAnimation, setTotalRecordsAnimation] = useState(false);
    const [totalClaimedRecords, setTotalClaimedRecords] = useState(undefined);
    const [totalClaimedRecordsAnimation, setTotalClaimedRecordsAnimation] = useState(false);
    const [gridFlag, setGridFlag] = useState(false);
    const { setAlertContent, setStackedToastContent } = useContext(AlertContext);
    const userSessionInfo = useContext(UserContext);
    const [availableParams, setAvailableParams] = useState(true)
    const [noDataFlag, setNoDataFlag] = useState(false);
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(undefined);
    const [rowClassFunction] = useRowClassFunction({ uniqueId: "prescriptionOrderId", selectedOrderId: selectedPrescriptionId });
    const [claimedDataSet, setClaimedDataSet] = useState([]);
    const [activeTabId, setActiveTabId] = useState(2);
    const [claimedRecordsCount, setClaimedRecordsCount] = useState(0);
    const [columnOptionsMap, setColumnOptionsMap] = useState({});
    const [orderIdsList, setOrderIdsList] = useState([]);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [recordId, setRecordId] = useState();
    const [selectedPrescription, setSelectedPrescription] = useState();
    const [disableMode, setDisableMode] = useState(false);
    const [prescriptionIdList, setPrescriptionIdList] = useState([]);

    // 1-for claimed orders and 2-for search criteria results
    // const [windowResizeFlag,setWindowResizeFlag] = useState(false);
    // const [toatalNumberOfRecords,setTotalNumberOfRecords] = useState(null);
    // const [pageLimit,setPageLimit] = useState(0);

    const allowedOrdersClaimRight = useMemo(() => {
        if(userSessionInfo?.vertical && userSessionInfo.vertical == "V"){
            return false;
        }
        return true;
    }, [userSessionInfo])

    useEffect(() => {
        Object.entries(params).forEach(([key, value]) => {
            if (key == "activeClaimedTab") {
                delete params[key];
                setActiveTabId(1);
            }
            if (key == COLUMN_OPTIONS_URL_KEY_CONSTANT) {
                setColumnOptionsMap(prepareModifiedColumnOptionsMap(props));
            }
        });
        const rest = getActualSearchCriteria(params);
        const restCriteria = getActualSearchCriteria(searchCriteria);
        if (validate.isEqualObject(rest, restCriteria)) {
            return;
        }
        if (validate.isNotEmpty(params)) {
            setAvailableParams(false);
            let updatedParams = { ...params };
            const { status } = updatedParams;
            let limit = params.limitTo ? params.limitTo : 10;
            let startIndex = params.pageNumber ? (params.pageNumber - 1) * limit : 0;
            updatedParams = { ...updatedParams, startIndex: startIndex, limitTo: limit };
            if (status == 'created') {
                setGridFlag(true);
                getMetaInfo(true, params.pageNumber, limit);
            } else {
                setGridFlag(false);
                getMetaInfo(false, params.pageNumber, limit);
            }
            setSearchCriteria(updatedParams);
            getInittialData(updatedParams);
        }
    }, [props.location.search]);

    useEffect(() => {
        if (activeTabId == 1 && totalClaimedRecords != 0) {
            getInitialClaimedData();
        }
        setOrderIdsList([]);
        setClaimedRecordsCount(0);
    }, [activeTabId])

    const getActualSearchCriteria = (criteria) => {
        const { pageNumber, limitTo, startIndex, [COLUMN_OPTIONS_URL_KEY_CONSTANT]: columnOptionsUrlKey, ...rest } = criteria;
        return rest;
    }

    const getInittialData = async (searchCriteria) => {
        const searchParams = new URLSearchParams(props.location.search);
        if (!searchParams.has("activeClaimedTab")) {
            setActiveTabId(2);
        }
        isLoading(true);
        const data = await getData(searchCriteria);
        if (validate.isNotEmpty(data)) {
            if (data.dataSet) {
                setDataSet([...data.dataSet]);
            } else {
                setDataSet([]);
            }
            setTotalRecords(data.totalRecords);
            setTotalRecordsAnimation(true);
        }
        if (validate.isEmpty(claimedDataSet)) {
            getInitialClaimedData();
        }
        isLoading(false);
    }

    const getInitialClaimedData = async () => {
        isLoading(true);
        let updatedParams = { ...params };
        const { status } = updatedParams;
        if (status == 'created') {
            setGridFlag(true);
            getMetaInfo(true, params.pageNumber, 10);
        } else {
            setGridFlag(false);
            getMetaInfo(false, params.pageNumber, 10);
        }
        await prescriptionService.getPrescriptionClaimedOrders().then(data => {
            if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                setClaimedDataSet(data.dataObject.dataSet ? data.dataObject.dataSet : []);
                setTotalClaimedRecords(data.dataObject.totalRecords);
                console.log("setting into localStorage ;", data.dataObject.dataSet);
                setTotalClaimedRecordsAnimation(true);
            } else if (data && data.statusCode == "FAILURE" && data.message == "FAILURE") {
                setAlertContent({ alertMessage: "Error while fetching data" });
                setTotalClaimedRecords(0);
                setTotalClaimedRecordsAnimation(true);
            } else {
                setTotalClaimedRecords(0);
                setTotalClaimedRecordsAnimation(true);
            }
        }).catch((err) => {
            setAlertContent({ alertMessage: "Error while fetching data" });
            console.log(err)
        });
        isLoading(false);
    }

    const getMetaInfo = (createdStatus, pageNumber, limit) => {
        const data = prescriptionService.getPrescriptionMetaInfo({ createdStatus: createdStatus, pageNumber: pageNumber, limit: limit }).then(response => {
            if ('SUCCESS' === response.statusCode) {
                const { dataObject } = response;
                // let dataGrid = setLimit(dataObject);
                if (createdStatus && validate.isNotEmpty(dataObject)) {
                    setGridDataForCreatedStatus(dataObject);
                } else if (validate.isNotEmpty(dataObject)) {
                    setGridData(dataObject);
                }
                // return dataGrid;
            }
        }).catch(err => {
            setAlertContent({ alertMessage: "Error while getting prescription meta info" })
            console.log(err)
        });
        return data;
    }


    // const setLimit = (dataGrid) => {
    //     if (validate.isNotEmpty(dataGrid)) {
    //         const { filterRowHeight, headerRowHeight, rowHeight } = dataGrid;
    //         let rHeight = validate.isEmpty(rowHeight)?35:rowHeight;
    //         let hRowHeight = validate.isEmpty(headerRowHeight)?35:headerRowHeight;
    //         let fRowHeight = validate.isEmpty(filterRowHeight)?35:filterRowHeight;
    //         let bodyHeight = validate.isEmpty(bodyRef.current.offsetHeight)?456:bodyRef.current.offsetHeight;
    //         let paginationHeight = 60;
    //         let remainingBodyHeight = bodyHeight-hRowHeight-fRowHeight-paginationHeight;
    //         let numberOfRecords = Math.floor(remainingBodyHeight / rHeight);
    //         if(numberOfRecords>0){
    //             setTotalNumberOfRecords(numberOfRecords);
    //             return {...dataGrid};
    //         }else{
    //             numberOfRecords = 0;
    //             setTotalNumberOfRecords(numberOfRecords);
    //             return {...dataGrid};
    //         }
    //     }
    // }

    // const resizeStopped=()=>{
    //     if(gridFlag){
    //         setGridDataForCreatedStatus(setLimit(gridDataForCreatedState));
    //     }else{
    //         setGridData(setLimit(gridData));
    //     }
    //     if(toatalNumberOfRecords>dataSet.length && toatalNumberOfRecords<=totalRecords){
    //         setWindowResizeFlag(!windowResizeFlag);
    //     }
    // }
    // let doit;
    // onresize=()=>{
    //     clearTimeout(doit);
    //     doit = setTimeout(resizeStopped, 80);
    // }

    const getData = async (searchCriteria) => {
        const { v, ...rest } = searchCriteria;
        const data = await prescriptionService.getPrescriptionInfo(rest).then(data => {
            if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                return data.dataObject;
            } else if (data && data.statusCode == "FAILURE" && data.message == "FAILURE") {
                setAlertContent({ alertMessage: "Error while fetching data" });
            } else {
                setAlertContent({ alertMessage: data.message });
            }
        }).catch((err) => {
            setAlertContent({ alertMessage: "Error while fetching data" });
            console.log(err)
        });
        return data;
    }

    const appendParamsToUrl = (pageNumber, limitTo) => {
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        props.history.replace(`${CRM_UI}/prescriptionOrderSearch?${qs.stringify({ ...params, pageNumber: pageNumber, limitTo: limitTo })}`);
    }

    const remoteDataFunction = async ({ startIndex, limit, sortColumns, filters, pageNumber, changeType }) => {
        // setPageLimit(limit);
        let temObj = validate.isNotEmpty(searchCriteria) ? { ...searchCriteria, 'startIndex': startIndex, 'limitTo': limit } : { 'startIndex': startIndex, 'limitTo': limit }
        if (validate.isNotEmpty(sortColumns)) {
            temObj = { ...temObj, 'sortColumnIndex': sortColumns[0].columnKey, 'sortDirection': sortColumns[0].direction }
        }
        let value = filters.mobileNumber.value;
        if (validate.isNotEmpty(filters) && filters['mobileNumber'] && value && value.length !== 10) {
            return { status: false };
        }
        if (validate.isNotEmpty(value)) {
            temObj = { ...temObj, mobileNo: value };
        }
        appendParamsToUrl(pageNumber, limit);
        const data = await getData(temObj);
        if (validate.isEmpty(data) || validate.isEmpty(data.dataSet)) {
            setNoDataFlag(true);
        } else {
            setNoDataFlag(false);
        }
        if (userSessionInfo?.vertical && userSessionInfo.vertical == "V") {
            if (validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet)) {
                if (changeType == ChangeType.PAGINATION_INFO && startIndex > 0) {
                    setDataSet([...dataSet, ...data.dataSet]);
                } else {
                    setDataSet(data.dataSet);
                }
            }
        } else {
            setDataSet(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet) ? data.dataSet : []);
        }
        return { dataSet: data?.dataSet ? data.dataSet : [], totalRowsCount: data.totalRecords, status: true }
        /* if (validate.isNotEmpty(data)) {
            if (validate.isEmpty(data.dataSet)) {
                setNoDataFlag(true);
            } else {
                setNoDataFlag(false);
            }
            if(userSessionInfo?.vertical && userSessionInfo.vertical == "V"){
                setDataSet([...dataSet, ...data.dataSet]);
            }else{
                setDataSet(data.dataSet);
            }
            return { dataSet: data.dataSet, totalRowsCount: data.totalRecords, status: true }
        }
        return { status: false }; */
    }
    const makeCall = (outBoundUrl) => {
        axios({
            method: 'GET',
            url: outBoundUrl,
            contentType: "application/x-www-form-urlencoded",
            crossDomain: true,
        }).then((response) => {
            if (response.status == 200) {
                setStackedToastContent({ toastMessage: "Making a Call" });
            }
            else {
                setStackedToastContent({ toastMessage: "Failed to make a Call" })
            }
        }).catch(err => {
            setAlertContent({ alertMessage: "Failed to make a Call" })
            console.log("error =>" + err)
        });
    }

    const findOrders = (props) => {
            const searchParams = new URLSearchParams(window.location.search);
            let fromDate = searchParams.get("fromDate");
            let toDate = searchParams.get("toDate");
            window.open("prescriptionOrderSearch?mobileNo=" + props.mobileNo + "&fromDate=" + fromDate + "&toDate=" + toDate);
        }
        const prescriptionCancelled = async (prescriptionOrderId) => {
            removeHighlightForOrder();
            unclaimClaimedOrder(prescriptionOrderId, RECORD_TYPE.PRESCRIPTION_ORDER, onUnclaimSuccess(prescriptionOrderId));
            const data = await getData({ ...searchCriteria, prescriptionOrderId: prescriptionOrderId, status: 'cancelled' });
            setDataSet(dataSet.map(eachRecord => {
                if (eachRecord.prescriptionOrderId == prescriptionOrderId) {
                    return data.dataSet[0];
                }
                return eachRecord;
            }));
        }
        const onUnclaimSuccess = (prescriptionOrderId) => {
            const claimedData = claimedDataSet.filter(eachRecord => { return eachRecord.prescriptionOrderId != prescriptionOrderId; });
            setClaimedDataSet(claimedData);
            setTotalClaimedRecords(claimedData.length);
            setTotalClaimedRecordsAnimation(true);
        }

        const getIconHtml = () => {
            // return <HealthRecord></HealthRecord>
            return <ShowPrescription tooltip="Show Prescription" />
        }
        const getshowPrescriptionForm = (handleOpenLightBox, showPrescriptionActions,prescriptionOrderId) => {
            // window.open("healthrecord/" + "p_" + prescriptionOrderId);
           return <ShowPrescriptionModal setLightBoxOpen={handleOpenLightBox} prescriptionCancelled={prescriptionCancelled} requiredProps={showPrescriptionActions} />
        }

        const processClaimAction = (recordId, orderIdsList, row) => {
            if (validate.isEmpty(orderIdsList)) {
                orderIdsList.push(recordId);
            }
            else if (validate.isNotEmpty(orderIdsList) && orderIdsList.indexOf(recordId) == -1) {
                orderIdsList.length = 0;
                orderIdsList.push(recordId);
            }
            let claimObject = null;
            if (validate.isEmpty(row.claimedBy)) {
                claimObject = claimOrders(orderIdsList, dataSet, claimedDataSet, "prescriptionOrderId");
                setTotalClaimedRecords(totalClaimedRecords + orderIdsList.length);
                setTotalClaimedRecordsAnimation(true);

            } else {
                claimObject = unclaimOrders(orderIdsList, dataSet, claimedDataSet, "prescriptionOrderId");
                setTotalClaimedRecords(totalClaimedRecords - orderIdsList.length);
                setTotalClaimedRecordsAnimation(true);
            }
            setClaimedDataSet(claimObject?.claimedDataSet);
            setDataSet(claimObject?.dataset);
            setOrderIdsList([]);
            setClaimedRecordsCount(0);
            setTotalClaimedRecords(claimObject?.claimedDataSet?.length);
            setTotalClaimedRecordsAnimation(true);
            setSelectedPrescriptionId(recordId);
            removeHighlightForOrder();
            setStackedToastContent({ toastMessage: (orderIdsList.length == 1 ? ("Prescription Order ID(s) " + orderIdsList + " ") : ("Prescription Order ID(s) ")) + claimObject?.toastMessage });
        }

        const removeHighlightForOrder = () => {
            setTimeout(() => {
                setSelectedPrescriptionId(undefined);
            }, 2000)
        }

        const handleClaimFailure = (message, recordId) => {
            if (message.indexOf("already claimed by") != -1) {
                let processedDataset = processOrderClaimedAlready(recordId, dataSet, "prescriptionOrderId");
                setDataSet(processedDataset);
            }
            setStackedToastContent({ toastMessage: message });
        }

        function handleCheckBoxColumn(props) {
            const { row } = props;
            let orderIds = [...orderIdsList];
            const handleOnCheckBoxChange = (event) => {
                if (activeTabId == "2") {
                    if (event.target.checked == true) {
                        if ((totalClaimedRecords + claimedRecordsCount) > 9) {
                            alert("claim limit exceeded .")
                            return;
                        }
                        setClaimedRecordsCount((prevCount) => prevCount + 1);
                        orderIds.push(row);
                        setOrderIdsList(orderIds);
                    }
                    else {
                        let index_of_row = searchElement(row.prescriptionOrderId, orderIds, 'prescriptionOrderId')
                        if (index_of_row !== -1) {
                            orderIds.splice(index_of_row, 1);
                        }
                        setClaimedRecordsCount(prevCount => prevCount - 1);
                        setOrderIdsList(orderIds);
                    }
                }
                else {
                    if (event.target.checked == true) {
                        orderIds.push(row);
                        setOrderIdsList(orderIds);
                    }
                    else {
                        let index_of_row = searchElement(row.prescriptionOrderId, orderIds, 'prescriptionOrderId')
                        if (index_of_row !== -1) {
                            orderIds.splice(index_of_row, 1);
                        }
                        setOrderIdsList(orderIds);
                    }
                }
            }
            return <React.Fragment>
                {(!allowedOrdersClaimRight || row.status == "Cancelled" || (validate.isNotEmpty(row.claimedBy) && activeTabId == 2)) ? <></>
                    : <input type={'checkbox'} checked={searchElement(row.prescriptionOrderId, orderIdsList, 'prescriptionOrderId') !== -1} onChange={(event) => { handleOnCheckBoxChange(event) }} />
                }
            </React.Fragment>
        }

        function handleCheckBoxHeaderFunction(props) {

            const handleOnCheckAndUncheck = (event) => {
                if (event.target.checked == true) {
                    let claimedOrderIds = claimedDataSet.map(order => order);
                    setOrderIdsList(claimedOrderIds);
                }
                else {
                    setOrderIdsList([]);
                }

            }
            return <React.Fragment>
                {(activeTabId == 1 && allowedOrdersClaimRight) ?
                    <input type={'checkbox'} className={(orderIdsList.length != claimedDataSet.length && orderIdsList.length >= 1) ? "checkbox-indeterminante" : ""} checked={orderIdsList.length == claimedDataSet.length} onChange={(event) => { handleOnCheckAndUncheck(event) }} />
                    : <></>
                }
            </React.Fragment>
        }



        const callBackMapping = {
            "prescriptionOrderId": (props) => {
                const { row } = props;
                return <a className="btn btn-sm btn-link w-100" id={props.row.prescriptionOrderId} href="javascript:void(0)" rel="noopener" aria-label={props.row.prescriptionOrderId} role="link" title="View order details" onClick={() => {
                    // claimedDataSet.some(claimedOrdersList => claimedOrdersList.prescriptionOrderId === row.prescriptionOrderId) ?
                    (setShowPrescriptionModal(true), setSelectedPrescription(props.row))
                    // : ( setStackedToastContent({ toastMessage: "Please Claim this order first to open Prescription Detail Tab." }), setShowPrescriptionModal(false))
                }}>{props.row.prescriptionOrderId} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className='ms-1'><g id="link_open_black_icon_16px" transform="translate(-180.258 -387.452)"><rect id="Rectangle_3299" data-name="Rectangle 3299" width="16" height="16" rx="3" transform="translate(180.258 387.452)" fill="none"></rect><path id="Subtraction_86" data-name="Subtraction 86" d="M1427.6-7871h-4.565v-.946h4.565a1.457,1.457,0,0,0,1.027-.425,1.462,1.462,0,0,0,.427-1.027v-7.705a1.465,1.465,0,0,0-.427-1.029,1.464,1.464,0,0,0-1.027-.425h-7.7a1.455,1.455,0,0,0-1.452,1.454v7.3a.49.49,0,0,0,.3.477.5.5,0,0,0,.186.035.5.5,0,0,0,.366-.164l5.233-5.247h-3.184v-.944h4.323a.472.472,0,0,1,.473.471v4.325h-.944v-3.187l-5.243,5.269a1.443,1.443,0,0,1-1.025.432,1.423,1.423,0,0,1-.552-.111,1.43,1.43,0,0,1-.885-1.35v-7.3a2.4,2.4,0,0,1,2.4-2.4h7.7a2.4,2.4,0,0,1,2.4,2.4v7.705A2.4,2.4,0,0,1,1427.6-7871Z" transform="translate(-1235.241 8272.951)"></path></g></svg></a>
            },
            
            "Action": (props) => {
                const { row } = props;
                const { showPrescriptionActions } = row;
                const imagePaths = row.showPrescriptionActions.imagePathStr.split(',');
                let imageUrls = [];
                let formRequired = true;
                if (row.showPrescriptionActions.currentStatus == 'ConvertedToOMSOrder' || row.showPrescriptionActions.currentStatus == 'Cancelled') {
                    formRequired = false;
                }
                imagePaths.map(obj => {
                    imageUrls.push({ imagePath: obj });
                })
                return <div className='d-flex'>
                    {!allowedOrdersClaimRight || (validate.isNotEmpty(row.claimedBy) && row.claimedBy == "S" && activeTabId == 1) || (row.status == 'Cancelled')
                        ? <React.Fragment>
                            <CallIcon handleOnClick={() => makeCall(row.showPrescriptionActions.makeCallUrl)} />
                            {/* <OpenImageGallery customHtml={getIconHtml} images={imageUrls} includeLightBox={true} isFormRequired={formRequired} imageCaption={showPrescriptionActions.decoderComment} displayForms={(handleOpenLightBox) => getshowPrescriptionForm(handleOpenLightBox, showPrescriptionActions, row.prescriptionOrderId)} setSelectedPrescriptionId={setSelectedPrescriptionId} selectedPrescriptionId={row.prescriptionOrderId} /> */}
                            <ShowPrescription tooltip="Show Prescription" handleOnClick={()=> { setShowPrescriptionModal(true); setSelectedPrescription(row);}}/>
                        </React.Fragment>
                        : <React.Fragment />
                    }
                    {allowedOrdersClaimRight && validate.isNotEmpty(row.claimedBy) && (row.claimedBy == "O" || (row.claimedBy == "S" && activeTabId == 2))
                        ? <React.Fragment>
                            <Claimed id={"record_" + props.row.prescriptionOrderId} />
                        </React.Fragment>
                        : <React.Fragment />
                    }
                    {allowedOrdersClaimRight && !(row.claimedBy == "S" && activeTabId == 2) && (row.status != 'Cancelled' || row.claimedBy == 'S') && <HandleClaims recordId={row.prescriptionOrderId} recordType={RECORD_TYPE.PRESCRIPTION_ORDER} claimedBy={row.claimedBy} onSuccess={(recordId) => processClaimAction(recordId, orderIdsList, row)} onFailure={(message, recordId) => handleClaimFailure(message, recordId)} />}
                </div>
            },
            "viewCustomerPage": (props) => {
                const { row } = props;
                const { customerId } = row;
                if (customerId != 0 && customerId > 0 && validate.isNotEmpty(customerId)) {
                    return <React.Fragment>
                        <CustomerIdLink customerId={customerId} className={"d-flex align-items-center h-100"} anchorClassName={"w-100 btn btn-sm btn-link"} />
                    </React.Fragment>
                } else {
                    return <React.Fragment>
                        <span className='text-center'>-</span>
                    </React.Fragment>
                }
            },
            "findOrders": (props) => {
                const { row } = props;
                return <React.Fragment>
                    {validate.isNotEmpty(row.findOrders.mobileNo) &&
                        <div className="d-flex align-items-center h-100" onClick={() => findOrders(row.findOrders)}>
                            <a className="btn btn-sm btn-link w-100" rel="noopener" aria-label={row.findOrders.mobileNo} role="link" href='javascript:void(0)'> {row.findOrders.mobileNo}</a>
                        </div>
                    }
                </React.Fragment>
            },
            "globalStatus": (props) => {
                const { row } = props;
                const { status } = row;
                let showingStatus = status;
                let badgeColour = '';
                switch (status) {
                    case 'Created':
                        badgeColour = 'badge-created'
                        break
                    case 'ConvertedToOMSOrder':
                        showingStatus = 'Converted to OMS';
                        badgeColour = 'badge-Submitted';
                        break
                    case 'Decoded':
                        badgeColour = 'badge-Decoded';
                        break
                    case 'Pending':
                        badgeColour = 'badge-pending';
                        break
                    case 'Cancelled':
                        badgeColour = 'badge-Cancelled';
                        break
                    case "PartiallyDecoded":
                        showingStatus = 'Partially Decoded';
                        badgeColour = 'badge-PartiallyDecoded';
                }
                return <React.Fragment>
                    <Badges className={badgeColour} text={showingStatus} />
                </React.Fragment>
            },
            'rowClass': rowClassFunction,
            'checkBox': handleCheckBoxColumn,
            'checkBoxHeader': handleCheckBoxHeaderFunction
        }
        // const {paginationInfo} = gridInfoForCreatedStatus;
        // const recordsPerPageList=[toatalNumberOfRecords,toatalNumberOfRecords*2,toatalNumberOfRecords*3,toatalNumberOfRecords*4];
        // const gridDataSet = pageLimit===dataSet.length ? dataSet : dataSet.slice(0,toatalNumberOfRecords);
        // const pagination = {...paginationInfo,recordsPerPageList:recordsPerPageList,limit:pageLimit===dataSet.length ? pageLimit : toatalNumberOfRecords} ;
        // gridInfoForCreatedStatus = {...gridInfoForCreatedStatus,paginationInfo:pagination};
        const createStatusGridMetaInfo = useMemo(() => {
            return gridDataForCreatedState ? {
                ...gridDataForCreatedState, totalRowsCount: totalRecords,
                paginationInfo: activeTabId == 1 ? { isPaginationRequired: false } : {
                    ...gridDataForCreatedState?.paginationInfo,
                    initialPageNumber: params.pageNumber ? Number(params.pageNumber) : gridDataForCreatedState?.paginationInfo?.initialPageNumber,
                    limit: params.limitTo ? params.limitTo : gridDataForCreatedState?.paginationInfo?.limit
                }
            } : undefined;
        }, [totalRecords, params, gridDataForCreatedState])

        const allStatusGridMetaInfo = useMemo(() => {
            return gridData ? {
                ...gridData, totalRowsCount: totalRecords,
                paginationInfo: activeTabId == 1 ? { isPaginationRequired: false } : {
                    ...gridData?.paginationInfo,
                    initialPageNumber: params.pageNumber ? Number(params.pageNumber) : gridData?.paginationInfo?.initialPageNumber,
                    limit: params.limitTo ? params.limitTo : gridData?.paginationInfo?.limit
                }
            } : undefined;
        }, [totalRecords, params, gridData]);

        const gridMetaInfo = useMemo(() => {
            if (createStatusGridMetaInfo || allStatusGridMetaInfo) {
                return gridFlag ? { ...createStatusGridMetaInfo } : { ...allStatusGridMetaInfo };
            }
            return undefined;
        }, [gridFlag, createStatusGridMetaInfo, allStatusGridMetaInfo])

        const displayGridMetaInfo = useMemo(() => {
            if (!gridMetaInfo) {
                return undefined;
            }
            return activeTabId == 1 ? {
                ...gridMetaInfo, columns: [...gridMetaInfo.columns] ? [...gridMetaInfo.columns].map((column, index) => {
                    let columnObject = { ...column }
                    if (column.showFilter) {
                        columnObject['showFilter'] = false;
                    }
                    return columnObject;
                }) : undefined, paginationInfo: { ...gridMetaInfo?.paginationInfo, isPaginationRequired: false }
            } : { ...gridMetaInfo, totalRowsCount: totalRecords }
        }, [gridMetaInfo, activeTabId])

        const onColumnOptionChange = (rowDataKey, columnOptionsMap) => {
            modifyUrlColumnOptions(props, rowDataKey, columnOptionsMap);
        }

        const actionSuccess = (recordid, listofOrderIds) => {
            processClaimAction(listofOrderIds[0], listofOrderIds, orderIdsList[0])
        }

        const claimedSet = (claim) => {
            let listofOrderIds = orderIdsList.map(function (el) { return el.prescriptionOrderId; });
            handleClaimRequest({ 'recordId': listofOrderIds[0], 'claimedBy': (claim == ClaimConstants.CLAIM) ? ' ' : 'S', recordType: RECORD_TYPE.PRESCRIPTION_ORDER, 'onSuccess': (recordid) => { actionSuccess(recordid, listofOrderIds) }, 'onFailure': (message, recordid) => { handleClaimFailure(message, recordid) } }, listofOrderIds)
        }

        const openHealthRecord = () => {
            { setShowPrescriptionModal(false); }
            window.open("healthrecord/" + "p_" + selectedPrescription.prescriptionOrderId,'p');
        }

        const getBodyContent = (activeTabId) => {
            let gridDataSet = activeTabId == 1 ? claimedDataSet : dataSet
            return <React.Fragment>
                {!loading ? (((activeTabId == 2 && validate.isNotEmpty(dataSet)) || (activeTabId == 1 && validate.isNotEmpty(claimedDataSet))) && displayGridMetaInfo ?
                    <div className={`h-100`}>
                        <div className="card h-100">
                            <div className='card-body p-0'>
                                <CommonDataGrid {...displayGridMetaInfo}
                                    customGridToolbar={{component: ClaimUnclaimHandler, componentProps: {activeTabId, selectedRecordsLength: orderIdsList.length, claimedSet}}}
                                    dataSet={gridDataSet}
                                    callBackMap={callBackMapping}
                                    remoteDataFunction={remoteDataFunction}
                                    selectedRows={selectedRows}
                                    onRowSelectionCallback={setSelectedRows}
                                    onColumnOptionChange={onColumnOptionChange}
                                    columnOptionsMap={columnOptionsMap}
                                />
                            </div>
                        </div>
                    </div>
                    : ((activeTabId == 2 && totalRecords == 0) || (activeTabId == 1 && (totalClaimedRecords == 0 || typeof totalClaimedRecords == 'undefined')) ? <NoDataFound searchButton={activeTabId == 2} text={activeTabId == 2 ? "No orders found are based on the given criteria. Try other details!" : "No Claimed Orders found for you!"} /> : null))
                    : null
                }
            </React.Fragment>
        }

        return <React.Fragment>
            <Wrapper showHeader={false}>
                <ClaimTabs {...props} allowedOrderClaimRight={allowedOrdersClaimRight} selectedRecordsLength={orderIdsList.length} claimedSet={claimedSet} recordType={RECORD_TYPE.PRESCRIPTION_ORDER} setTotalClaimedRecords={setTotalClaimedRecords} loading={loading} headerRef={headerRef} footerRef={footerRef} tabOneHeaderContent={"My Claimed List"} tabTwoHeaderContent={"Prescription Search Results"} claimedCount={totalClaimedRecords} totalRecords={typeof totalRecords == "undefined" ? 0 : totalRecords} totalRecordsAnimation={totalRecordsAnimation} setTotalRecordsAnimation={setTotalRecordsAnimation} totalClaimedRecordsAnimation={totalClaimedRecordsAnimation} setTotalClaimedRecordsAnimation={setTotalClaimedRecordsAnimation} activeTabId={activeTabId} setActiveTabId={setActiveTabId}>
                    {activeTabId == 1 ? getBodyContent(1) : null}
                    {activeTabId == 2 ? getBodyContent(2) : null}
                    {availableParams && activeTabId == 2 && <SeachNow />}
                </ClaimTabs>
                {/* {showPrescriptionModal && <HealthRecord recordId={recordId}/>} */}
                {/* {showPrescriptionModal && <PrescriptionDetailModal prescriptionInfo={selectedPrescription}/>} */}
                {showPrescriptionModal && openHealthRecord()}
                {/* <HealthRecord recordId={`p_${selectedPrescription.prescriptionOrderId}`} prescriptionInfo={selectedPrescription} setSelectedPrescription={setSelectedPrescription} setDisableMode={setDisableMode} disableMode={disableMode} showPrescriptionModal={showPrescriptionModal} setShowPrescriptionModal={setShowPrescriptionModal} claimedDataSet = {claimedDataSet}/>} */}
            </Wrapper>
        </React.Fragment>
    }
