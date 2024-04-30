import React, { useEffect, useRef, useState,useContext } from "react";
import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import Validate from "../../helpers/Validate";
import qs from 'qs';
import { AlertContext } from '../../components/Contexts/UserContext';
import { TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import MWalletInfo from "./MWalletInfo";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import CommonModal from "../Common/CommonModal";
import { Button } from "reactstrap";
import { API_URL } from "../../services/ServiceConstants";
import { gotoMartCustomerPage } from "../../helpers/CommonRedirectionPages";
import CRMService from "../../services/CRM/CRMService";
import NoDataFound from "../Common/NoDataFound";
import SeachNow from "../Common/SearchNow";

const MWalletRefundInfo = (props) => {

    const obj = {
        "iDisplayStart": 0,
        "iDisplayLength": 10,
        "iSortCol_0": 0,
        "sSortDir_0": "desc"
    }
    const headerRef = useRef(null);
    const [loading, isLoading] = useState(false);
    const [dataGrid, setDataGrid] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState(obj);
    const [searchParamsExist, setSearchParamsExist] = useState(false);
    const [showMWalletDetails, setShowMWalletDetails] = useState(false);
    const [mWalletInfo, setmWalletInfo] = useState(undefined);
    const [isModalOpen, setModalOpen] = useState(false);

    const validate = Validate();
    const { setStackedToastContent } = useContext(AlertContext);

    useEffect(() => {
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        setSearchCriteria({ ...obj, ...params });
        if(validate.isNotEmpty(params)){
            setSearchParamsExist(true);
        }
        getInitialMWalletRefundData(validate.isNotEmpty(params) ? { ...obj, ...params } : obj); 
    }, [props.location.search]);

    const getInitialMWalletRefundData = async (params) => {
        const data = await getMWalletRefundInfo(params);
        isLoading(true);
        setDataGrid(data?.dataGrid);
        setDataSet(validate.isNotEmpty(data?.dataSet) ? data.dataSet : []);
        isLoading(false);
    }

    const getMWalletRefundInfo =  (searchCriteria) => {
        const data =  CRMService().getMWalletRefundInfo(searchCriteria).then(res => {
            if (validate.isNotEmpty(res) && validate.isNotEmpty(res.responseData) && validate.isNotEmpty(res.statusCode) && "SUCCESS" == res.statusCode) {
                return res.responseData;
            }
        }).catch(function (error) {
            console.log(error);
            return [];
        })
        return data;
    }

    const displayMWalletDetails = doc => {
        setShowMWalletDetails(true);
        setmWalletInfo(doc);
    }

    const handleFailure = () => {
        setStackedToastContent({ toastMessage: "Customer is already opened", position: TOAST_POSITION.BOTTOM_START })
      }

    const redirectToCommunication = comm => {
        const customer = comm.customerInfo;

        //preparing static data for dummy Customer, if customerInfo is not available
        const customerId = validate.isNotEmpty(customer) && validate.isNotEmpty(customer.customerID) ? customer.customerID : "73617001";
        const beautyCustomerId = validate.isNotEmpty(customer) && validate.isNotEmpty(customer.webLoginID) ? customer.webLoginID : "73617001";
        const mergeStatus = validate.isNotEmpty(customer) && validate.isNotEmpty(customer.isMerged) ? customer.isMerged : true;
        const mobile = validate.isNotEmpty(customer) && validate.isNotEmpty(customer.mobileNumber) ? customer.mobileNumber : "9160306160";
        const customerType = validate.isNotEmpty(customer) && validate.isNotEmpty(customer.customerType) ? customer.customerType : "abc";
        const firstName = validate.isNotEmpty(customer) && validate.isNotEmpty(customer.firstName) ? customer.firstName : "suvarsha";
        const lastName = validate.isNotEmpty(customer) && validate.isNotEmpty(customer.lastName) ? customer.lastName : "byreddy";
        gotoMartCustomerPage({ pageToRedirect: "Communication", customerId: customerId, beautyCustomerId: beautyCustomerId, mergeStatus: mergeStatus, mobile: mobile, customerType: customerType, firstName: firstName, lastName: lastName }, handleFailure)
    }

    const renderActionColumn = props => {
        const { row } = props;
        return <React.Fragment>
            {row.action && "Reject" === row.action && <span style={{ "cursor": "pointer", "color": "blue", "text-decoration": "underline" }} onClick={() => { alert("hello") }}>{row.action}</span>}
            {row.action && "Approve" === row.action && <span style={{ "cursor": "pointer", "color": "blue", "text-decoration": "underline" }}>{row.action}</span>}
        </React.Fragment>
    }

    const renderDocumentColumn = props => {
        const { row } = props;
        return <React.Fragment>
            {row.doc && <span style={{ "cursor": "pointer", "color": "blue", "text-decoration": "underline" }} onClick={() => displayMWalletDetails(row.doc)}>{row.doc.displayOriginalTitle}</span>}
        </React.Fragment>
    }

    const renderCommunicationColumn = props => {
        const { row } = props;
        return <React.Fragment>
            {row.comm && <span style={{ "cursor": "pointer", "color": "blue", "text-decoration": "underline" }} onClick={() => redirectToCommunication(row.comm)}>{row.comm.displayName}</span>}
        </React.Fragment>
    }

    const callBackMapping = {
        'renderActionColumn': renderActionColumn,
        'renderDocumentColumn': renderDocumentColumn,
        'renderCommunicationColumn': renderCommunicationColumn
    }

    const remoteDataFunction = async ({ startIndex, limit }) => {
        var params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        const searchCriteria = validate.isNotEmpty(params) ? { ...obj, ...params } : obj;
        let tempObj = Validate().isNotEmpty(searchCriteria) ? { ...searchCriteria, 'iDisplayStart': startIndex, 'iDisplayLength': limit } : { 'startIndex': startIndex, 'limit': limit };
        let data = await getMWalletRefundInfo(tempObj);
        if (Validate().isNotEmpty(data)) {
            return { dataSet: data.dataSet, totalRowsCount: data.dataGrid.totalRowsCount, status: true }
        }
    }

    return (
        <React.Fragment>
            <Wrapper showHeader={false}>
                <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                    <p className="mb-0">MWallet Refund Information</p>
                </HeaderComponent>
                <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height" >
                    {!loading && dataGrid ?
                    validate.isNotEmpty(dataSet) ?
                    <div style={{ height: "100vh" }}><CommonDataGrid {...dataGrid} dataSet={dataSet}
                        selectedRows={selectedRows}
                        onRowSelectionCallback={setSelectedRows}
                        callBackMap={callBackMapping}
                        remoteDataFunction={remoteDataFunction}
                    /></div> : <NoDataFound searchButton={true} text={"No orders found are based on the given criteria. Try other details!"} /> : null}
                    {!searchParamsExist && <SeachNow {...props} />}
                    {isModalOpen && <div>
                        <CommonModal setShowModal={setModalOpen} />
                    </div>}
                    {showMWalletDetails && <MWalletInfo MWalletInfo={mWalletInfo} showMWalletDetails={showMWalletDetails} setShowMWalletDetails={setShowMWalletDetails} />}
                </BodyComponent>
            </Wrapper>
        </React.Fragment>
    )
}

export default MWalletRefundInfo;