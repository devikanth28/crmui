import React, { useContext, useEffect, useRef, useState } from "react"
import Validate from "../../helpers/Validate";
import EkycService from "../../services/Ekyc/EkycService";
import SeachNow from "../Common/SearchNow";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import CommonDataGrid, { CallIcon, SmsIcon } from "@medplus/react-common-components/DataGrid";
import NoDataFound from "../Common/NoDataFound";
import { AlertContext } from "../Contexts/UserContext";
import qs from 'qs';
import { makeOutBoundCall } from "../../helpers/CommonRedirectionPages";
import { CRM_UI } from "../../services/ServiceConstants";
import useRowClassFunction from "../../hooks/useRowClassFunction";
import CommonConfirmationModal from "../Common/ConfirmationModel";
import EKycModal from "./ekycModal";


export default (props) => {

    const defaultCriteria = {
        startIndex: 0,
        limit: 30
    }
    const validate = Validate();
    const ekycService = EkycService();
    const headerRef = useRef(0);
    const footerRef = useRef(0);
    const { setStackedToastContent } = useContext(AlertContext);

    const [gridData, setGridData] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const [initialLoading, setInitialLoading] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({});
    const [searchParamsExist, setSearchParamsExist] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedKycId, setSelectedKycId] = useState(undefined);
    const [showConfirmationModal, setConfirmationModal] = useState(false);
    const [value, setValueForModal] = useState(undefined);
    const [showKycModal, setShowKycModal] = useState(false);
    const [rowClassFunction] = useRowClassFunction({ uniqueId: "kycId", selectedOrderId: selectedKycId });
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });

    useEffect(() => {
        setConfirmationModal(false);
        setShowKycModal(false);
        const paramsSearchCriteria = getActualSearchCriteria(params);
        const currentSearchCriteria = getActualSearchCriteria(searchCriteria);
        if (validate.isEqualObject(paramsSearchCriteria, currentSearchCriteria)) {
            return;
        }
        if (validate.isNotEmpty(params)) {
            setSearchParamsExist(true);
            let limitTo = params.limitTo ? params.limitTo : defaultCriteria.limit;
            setSearchCriteria({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
            getInitialData({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
        }
    }, [props.location.search]);

    const getInitialData = async (searchCriteria) => {
        setInitialLoading(true)
        const data = await getData(searchCriteria);
        setGridData(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataGrid) ? data.dataGrid : undefined);
        setDataSet(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet) ? [...data.dataSet] : []);
        setTotalRecords(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataGrid) && validate.isNotEmpty(data.dataGrid.totalRowsCount) ? data.dataGrid.totalRowsCount : 0);
        setInitialLoading(false);
    }

    const getActualSearchCriteria = (criteria) => {
        const { pageNumber, limitTo, limitFrom, ...rest } = criteria;
        return rest;
    }

    const getData = async (obj) => {
        const data = await ekycService.getEKycInfo(obj).then(data => {
            if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                return data.dataObject;
            } else {
                setStackedToastContent({ toastMessage: data.message });
            }
        }).catch((err) => {
            console.log(err)
            setInitialLoading(false);
        });
        return data;
    }

    const handleSmsRequest = (row) => {
        if (validate.isEmpty(row.mobileNo)) {
            setStackedToastContent({ toastMessage: "Mobile number not available." });
            return;
        }
        setTimeout(() => { setSelectedKycId("") }, 3000);
        setConfirmationModal(true);
    }
    const sendSMSToCustomerForKycPending = async () => {
        ekycService.sendSMSToCustomerForKycPending({ mobileNo: value.mobileNo }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode == "SUCCESS") {
                setStackedToastContent({ toastMessage: "sms sent successfully" });
            }
            else {
                setStackedToastContent({ toastMessage: data.message });
            }
        }).catch(e => {
            console.log(e);
        })
        setTimeout(() => { setSelectedKycId("") }, 3000);
    }

    const onSubmitClick=(customerId)=>{
        setSelectedKycId(value.kycId);
        setShowKycModal(false);
        setTimeout(()=>{
          updateRecord(customerId);
        },1000)
      }

    const updateRecord = async (customerId) => {
        const dataForCustomerId = await getData({ ...searchCriteria, customerId: customerId, pageNumber: '', limitTo: '30', limitFrom: '0' }).then(response => {
          if (validate.isEmpty(response)) {
            return null;
          }
          return response.dataSet[0];
        })
        if (validate.isEmpty(dataForCustomerId)) {
          let temporaryDataSet = [...dataSet];
          temporaryDataSet.splice(temporaryDataSet.findIndex(obj => obj.customerKyc.customerId == customerId), 1);
          setDataSet([...temporaryDataSet]);
        } else {
          setDataSet(dataSet.map(eachRecord => {
            if (eachRecord.customerKyc.customerId == customerId) {
              return dataForCustomerId;
            }
            return eachRecord;
          }));
        }
        setTimeout(() => { setSelectedKycId(undefined) }, 3000);
      }

    const callBackMap = {
        'renderCustomerIdColumn': (props) => {
            return <React.Fragment>
                <a id={props.row.customerKyc.customerId} href="javascript:void(0)" rel="noopener" aria-label={props.row.customerKyc.customerId} role="link" onClick={() =>{setValueForModal(props.row) ;setShowKycModal(true)}}><span className='badge-created badge rounded-pill'>{props.row.customerKyc.customerId}</span></a>
            </React.Fragment>
        },
        'action': (props) => {
            const { row } = props;
            return <React.Fragment>
                <SmsIcon handleOnClick={() => { setSelectedKycId(row.kycId); setValueForModal(row); handleSmsRequest(row) }} />
                <CallIcon handleOnClick={() => makeOutBoundCall(row.callUrl)} />
            </React.Fragment>
        },
        'rowClassName': rowClassFunction
    }

    const appendParamsToUrl = (pageNumber, limitTo) => {
        props.history.replace(`${CRM_UI}/ekycSearch?${qs.stringify({ ...params, pageNumber: pageNumber, limitTo: limitTo })}`);
    }

    const remoteDataFunction = async ({ startIndex, limit, pageNumber }) => {
        let temObj = validate.isNotEmpty(searchCriteria) ? { ...searchCriteria, 'limitFrom': startIndex, 'limitTo': limit } : { 'limitFrom': startIndex, 'limitTo': limit }
        const data = await getData(temObj);
        appendParamsToUrl(pageNumber, limit);
        if (validate.isNotEmpty(data)) {
            setDataSet(data.dataSet);
            return { dataSet: data.dataSet, totalRowsCount: data.dataGrid.totalRowsCount, status: true }
        }
        return { status: false };
    }

    return <React.Fragment>
        <Wrapper showHeader={false}>
            <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                <p className="mb-0"> KYC Information</p>
            </HeaderComponent>
            <BodyComponent loading={initialLoading} allRefs={{ headerRef, footerRef }} className="body-height" >
                {!initialLoading && validate.isNotEmpty(dataSet) ? <div className={'h-100'}>
                    <div className="card h-100">
                        <div className="card-body p-0 h-100">
                            <CommonDataGrid
                                {...gridData}
                                remoteDataFunction={remoteDataFunction}
                                dataSet={dataSet}
                                callBackMap={callBackMap}
                            />
                        </div></div></div> : ((!initialLoading && totalRecords === 0 && searchParamsExist) && <NoDataFound searchButton text="No Customer EKYC's found  based on the given criteria. Try other details!" />)}
                {!searchParamsExist && <SeachNow />}
                {showConfirmationModal && <CommonConfirmationModal isConfirmationPopOver={showConfirmationModal} setConfirmationPopOver={setConfirmationModal} message={"Send SMS to customer for KYC pending."} buttonText={"Proceed"} onSubmit={() => sendSMSToCustomerForKycPending()} />}
            </BodyComponent>
            {showKycModal && <EKycModal customerId={value.customerKyc.customerId} setShowKycModal={setShowKycModal} showKycModal={showKycModal} onSubmitClick={onSubmitClick} setSelectedKycId={setSelectedKycId}/>}
        </Wrapper>
    </React.Fragment>


}