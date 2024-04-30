import React, { useContext, useEffect, useRef, useState } from "react";
import Validate from "../../../helpers/Validate";
import qs from 'qs';
import LabOrderService from "../../../services/LabOrder/LabOrderService";
import CommonDataGrid, { ApproveIcon, ChangeType } from "@medplus/react-common-components/DataGrid";
import NoDataFound from "../../Common/NoDataFound";
import { BodyComponent, HeaderComponent, Wrapper } from "../../Common/CommonStructure";
import { AlertContext, UserContext } from "../../Contexts/UserContext";
import SeachNow from "../../Common/SearchNow";
import { redirectCustomerPage } from "../../../helpers/CommonRedirectionPages";
import { CRM_UI } from "../../../services/ServiceConstants";
import DynamicForm, { TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm";
import CommonConfirmationModal from "../../Common/ConfirmationModel";
import {Button, Modal, ModalTitle } from "react-bootstrap";
import FormHelpers from "../../../helpers/FormHelpers";
import {  ModalBody, ModalHeader } from "reactstrap";
import CurrencyFormatter from "../../Common/CurrencyFormatter";


const LabOrderRefundSearchResults = ({ helpers, ...props }) => {
 
    const defaultCriteria = {
        startIndex: 0,
        limit: 30
    }
    const validate = Validate();
    const labOrderService = LabOrderService();
    const { setStackedToastContent } = useContext(AlertContext);
    const headerRef = useRef(0);
    const footerRef = useRef(0);
    const userSessionInfo = useContext(UserContext)

    const [searchCriteria, setSearchCriteria] = useState({});
    const [searchParamsExist, setSearchParamsExist] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gridData, setGridData] = useState(undefined);
    const [dataSet, setDataSet] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [storeIdNameMap, setStoreIdNameMap] = useState({});
    const [showConfirmationModal, setConfirmationModal] = useState(false);
    const [confirmationModalProps, setConfirmationModalProps] = useState({ message: "", onSubmit: null, headerText: "" });
    const [disableMode, setDisableMode] = useState(false);
    const [value, setValueForModal] = useState(null);
    const [showActionForm, setShowActionForm] = useState(false);

    useEffect(() => {
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        const paramsSearchCriteria = getActualSearchCriteria(params);
        const currentSearchCriteria = getActualSearchCriteria(searchCriteria);
        if (Validate().isEqualObject(paramsSearchCriteria, currentSearchCriteria)) {
            return;
        }
        if (Validate().isNotEmpty(params)) {
            setSearchParamsExist(true);
            let limitTo = params.limitTo ? params.limitTo : defaultCriteria.limit;
            setSearchCriteria({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
            getInitialData({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
        }
    }, [props.location.search]);

    const getActualSearchCriteria = (criteria) => {
        const { pageNumber, limitTo, limitFrom, ...rest } = criteria;
        return rest;
    }

    const getInitialData = async (searchCriteria) => {
        setLoading(true)
        const data = await getData(searchCriteria);
        setGridData(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataGrid) ? data.dataGrid : undefined);
        setDataSet(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet) ? [...data.dataSet] : []);
        setStoreIdNameMap(validate.isNotEmpty(data) && validate.isNotEmpty(data.storeIdNameMap) ? data.storeIdNameMap : {});
        setTotalRecords(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataGrid) && validate.isNotEmpty(data.dataGrid.totalRowsCount) ? data.dataGrid.totalRowsCount : 0);
        setLoading(false);
    }

    const getData = async (obj) => {
        const data = await labOrderService.getLabOrderRefundsInfo(obj).then(data => {
            if (data && data.statusCode == "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
                return data.dataObject;
            } else {
                setStackedToastContent({ toastMessage: data.message });
            }
        }).catch((err) => {
            console.log(err)
            setLoading(false);
        });
        return data;
    }

    const submitRefundDetails = async () => {
        const transactionObj = helpers.validateAndCollectValuesForSubmit("getLabOrderRefundFormForCard", false, false, false);
        if (validate.isNotEmpty(transactionObj.cardNo) && !validate.isNumeric(transactionObj.cardNo)) {
            setStackedToastContent({ toastMessage: "Only numbers are allowed for card number!" })
            return;
        }
        handleCompleteButton({ ...value, transactionObj });
    }

    const handleCompleteButton = async (row) => {
        setDisableMode(true);
        const obj = {
            refundId: row.refund.refundId,
            orderType: searchCriteria.orderType,
            orderId: row.refund.orderId,
            transactionId: (validate.isNotEmpty(row.transactionObj) && validate.isNotEmpty(row.transactionObj.transactionId)) ? row.transactionObj.transactionId : "",
            cardNo: (validate.isNotEmpty(row.transactionObj) && validate.isNotEmpty(row.transactionObj.cardNo)) ? row.transactionObj.cardNo : "",
            deviceId: (validate.isNotEmpty(row.transactionObj) && validate.isNotEmpty(row.transactionObj.deviceId)) ? row.transactionObj.deviceId : ""
        }
        await labOrderService.completeLabCodRefund(obj).then(data => {
            if (data && data.statusCode == "SUCCESS") {
                setStackedToastContent({ toastMessage: "refund completed successfully" });
                updateRecord(row.refund.refundId);
                setShowActionForm(false);
            }
            else
                setStackedToastContent({ toastMessage: data.message });
            setDisableMode(false);
        }).catch(err => {
            console.log(err)
            setStackedToastContent({ toastMessage: "Unable to process request, Please try again!" })
            setDisableMode(false);
        })
    }

    const updateRecord = async (refundId) => {
        const dataForRefundId = await getData({ orderType: searchCriteria.orderType, refundId: refundId, pageNumber: '', limitTo: '30', limitFrom: '0' }).then(response => {
            if (validate.isEmpty(response)) {
                return null;
            }
            return response.dataSet[0];
        })
        if (validate.isEmpty(dataForRefundId)) {
            let temporaryDataSet = [...dataSet];
            temporaryDataSet.splice(temporaryDataSet.findIndex(obj => obj.refund.refundId == refundId), 1);
            setDataSet([...temporaryDataSet]);
        } else {
            setDataSet(dataSet.map(eachRecord => {
                if (eachRecord.refund.refundId == refundId) {
                    return dataForRefundId;
                }
                return eachRecord;
            }));
        }
    }

    const handleFailure = ({ message }) => {
        setStackedToastContent({ toastMessage: message, position: TOAST_POSITION.BOTTOM_START })
    }

    const redirectToLabOrderSearch = (orderId) => {
        props.history.push(`${CRM_UI}/labOrder/searchResults?${qs.stringify({ orderId: orderId })}`)
    }

    const setPropsToConfirmationModal = (value) => {
        setValueForModal(value);
        let message = `
        
                         <div class="d-flex">
                                            ${value.refund.refundId ? `<div class="col-3">
                                                <div class="form-floating">
                                <input type="text" readonly class="form-control-plaintext form-control-sm" id="refundId" value=${value.refund.refundId} />
                                <label for="refundId">Refund ID</label>
                                                </div>
                                        </div>`:""}
                                    ${value.totalRefund ? `<div class="col-3">
                                        <div class="form-floating">
                                            <input type="text" readonly class="form-control-plaintext form-control-sm" id="TotalRefundAmount" value=${value.totalRefund} />
                                            <label for="TotalRefundAmount">Total Refund Amount</label>
                                        </div>
                                    </div>`:""}
                                    ${value.orderType == 'LabOrder' ? `<div class="col-3">
                                        <div class="form-floating">
                                            <input type="text" readonly class="form-control-plaintext form-control-sm" id="NetRefundAmount" value=${value.netAmountRefund} />
                                            <label for="NetRefundAmount">Net Refund Amount</label>
                                        </div>
                                    </div>`:''}
                                    ${value.orderType == 'LabOrder' ? `<div class="col-3">
                                        <div class="form-floating">
                                            <input type="text" readonly class="form-control-plaintext form-control-sm" id="MDxPointsRefund" value=${value.mdxPoints + " (worth Rs " + value.refund.mdxPointsWorth.toFixed(2) + ")"} />
                                            <label for="MDxPointsRefund"> MDx Points Refund</label>
                                        </div>
                                    </div>`:''}
                                </div>`





        // let message = `Total Refund Amount : ${value.totalRefund}<br/>`;
        // if (value.orderType == 'LabOrder') {
        //     message += `Net Refund Amount : ${value.netAmountRefund}<br/>MDx Points Refund : ${value.refund.mdxPoints + " (worth "}<span className="rupee">&#x20B9;</span>${value.refund.mdxPointsWorth.toFixed(2) + ")"}<br/>`;
        // }
        message;
        setConfirmationModalProps({ message: message, onSubmit: handleCompleteButton, headerText: `Please Confirm To Complete The Refund`, buttonText: "Yes,Complete The Refund" })
        if ("COSC" == value.refund.refundMode && ("CARD" == value.refund.coscPaymentMode || "EDC" == value.refund.coscPaymentMode || "PAYTM_EDC" == value.refund.coscPaymentMode || "PHONEPE" == value.refund.coscPaymentMode)) {
            setShowActionForm(true)
            helpers.addForm(FormHelpers().getLabOrderRefundFormForCard());
        }
        else
            setConfirmationModal(true);
    }

    const callBackMapping = {
        'refundID': (props) => {
            const { row } = props;
            return <React.Fragment>
                {row.refund.refundId}
            </React.Fragment>
        },
        'renderorderIdColumn': (props) => {
            return <React.Fragment>
                {props.row.refund.refundType == "LAB_ORDER" ? <a className={"btn btn-sm btn-link w-100"} id={props.row.refund.orderId} href="javascript:void(0)" rel="noopener" aria-label={props.row.refund.orderId} role="link" title="View order details" onClick={() => { redirectToLabOrderSearch(props.row.refund.orderId) }}>{props.row.refund.orderId}</a> :
                    props.row.refund.orderId}
            </React.Fragment>
        },
        'rendercollectionCenterIdColumn': (props) => {
            const { row } = props;
            return <React.Fragment>
                {row.refund.collectionCenterId} - {validate.isNotEmpty(storeIdNameMap[row.refund.collectionCenterId]) ? storeIdNameMap[row.refund.collectionCenterId] : ""}
            </React.Fragment>
        },
        'totalRefund': (props) => {
            const { row } = props;
            return <React.Fragment>
                <div className="text-end">
                    <CurrencyFormatter data={row.refund.totalRefund} decimalPlaces={2} />
                </div>
            </React.Fragment>
        },
        'netAmountRefund': (props) => {
            const { row } = props;
            return <React.Fragment>
                <div className="text-end">
                <CurrencyFormatter data={row.refund.totalNetRefund} decimalPlaces={2} />
                </div>
            </React.Fragment>
        },
        'mdxPointsRefund': (props) => {
            const { row } = props;
            return <React.Fragment>
                <div>
                    {row.refund.mdxPoints + ` (worth ${<CurrencyFormatter data={row.refund.mdxPointsWorth} decimalPlaces={2} />} )`}
                </div>
            </React.Fragment>
        },
        'rendercustomerIdColumn': (props) => {
            const { row } = props;
            return <React.Fragment>
                <a className="btn btn-sm btn-link w-100" id={row.refund.customerId} href="javascript:void(0)" rel="noopener" aria-label={row.refund.customerId} role="link" title="View Customer details" onClick={() => redirectCustomerPage({ customerId: row.refund.customerId, customerType: "POS", isMergedFlag: false }, handleFailure)}>{row.refund.customerId}</a>
            </React.Fragment>
        },
        "status": (props) => {
            let statusCellClass = "badge rounded-pill";
            if (props.row.status == 'Completed') {
                statusCellClass = statusCellClass + ' badge-Decoded'
            }
            else {
                statusCellClass = statusCellClass + ' badge-created'
            }

            return <React.Fragment>
                <div className={statusCellClass}>{props.row.status}</div>
            </React.Fragment>
        },
        "Action": (props) => {
            return <React.Fragment>
                {props.row.showCompleteButton ? <ApproveIcon handleOnClick={() => setPropsToConfirmationModal(props.row)} /> : ""}
            </React.Fragment>
        }


    }

    const appendParamsToUrl = (pageNumber, limitTo) => {
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        props.history.replace(`${CRM_UI}/labOrder/refundSearchResults?${qs.stringify({ ...params, pageNumber: pageNumber, limitTo: limitTo })}`);
    }

    const remoteDataFunction = async ({ startIndex, limit, filters, sortColumns, pageNumber, changeType }) => {
        let temObj = { ...searchCriteria, limitFrom: startIndex, limitTo: limit };
        if (validate.isNotEmpty(sortColumns)) {
            temObj = { ...temObj, 'sortColumnIndex': sortColumns[0].columnKey, 'sortDirection': sortColumns[0].direction }
        }
        if (validate.isNotEmpty(filters) && filters['membershipId'] && filters['membershipId'].value && filters['membershipId'].value.length !== 15) {
            return { status: false };
        }
        if (validate.isNotEmpty(filters.membershipId)) {
            let filterData = filters.membershipId.value
            if (validate.isNotEmpty(filterData)) {
                temObj = { ...temObj, 'membershipId': filterData };
            }
        }
        const data = await getData(temObj);
        appendParamsToUrl(pageNumber, limit);
        if (userSessionInfo?.vertical && userSessionInfo.vertical == "V") {
            if(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet)) {
                 if(changeType == ChangeType.PAGINATION_INFO && startIndex > 0){
                     setDataSet([...dataSet, ...data.dataSet]);
                 } else {
                     setDataSet(data.dataSet);
                 }
            } 
         }
         return { dataSet: data?.dataSet ? data.dataSet : [], totalRowsCount: data?.dataGrid?.totalRowsCount ? data.dataGrid.totalRowsCount : 0, status: true }
        /* if (validate.isNotEmpty(data)) {
            setDataSet(data.dataSet);
            return { dataSet: data.dataSet, totalRowsCount: data.dataGrid.totalRowsCount, status: true }
        } else {
            return { dataSet: [], totalRowsCount: 0, status: true }

        } */
    }

    const observersMap = {
        'closeModal': [['click', () => setShowActionForm(false)]],
        'submitRefundDetails': [['click', submitRefundDetails]]
    }

    const getHeaderText = () => {
        switch (searchCriteria.orderType) {
            case 'L': return "LAB Order Refund Information"
            case 'M': return "Membership Refund Information"
            case 'D': return "Doctor Consultation Refund Information"
            default: return "LAB Order Refund Information"
        }
    }
    const CloseButton = <Button variant="" className="btn-close icon-hover" type="button" onClick={()=>{setShowActionForm(!showActionForm)}}></Button>

    return (
        <React.Fragment>
            <Wrapper showHeader={false}>
                <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                    {getHeaderText()}
                </HeaderComponent>
                <BodyComponent loading={loading} allRefs={{ headerRef }} className={loading ? "" : "body-height"} >
                    {!loading && (validate.isNotEmpty(dataSet) ?

                        <div className={'h-100'}>
                            <div className="card h-100">
                                <div className="card-body p-0 h-100">
                                    <CommonDataGrid {...gridData} dataSet={[...dataSet]}
                                        remoteDataFunction={remoteDataFunction}
                                        callBackMap={callBackMapping} />
                                </div></div></div> : searchParamsExist ? <NoDataFound searchButton={true} text={"No refunds found based on the given criteria"} /> : null)}

                    {!searchParamsExist && <SeachNow />}
                </BodyComponent>
                {showConfirmationModal && <CommonConfirmationModal small rawHtml headerText={confirmationModalProps.headerText} isConfirmationPopOver={showConfirmationModal} setConfirmationPopOver={setConfirmationModal} message={confirmationModalProps.message} buttonText={"Yes, Complete Refund"} onSubmit={() => confirmationModalProps.onSubmit(value)} setDisableMode={setDisableMode} disableMode={disableMode} />}
                {showActionForm ?
                    <Modal
                        show={true}
                        backdrop="static"
                        onHide={() => { setShowActionForm(false) }}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <div className='custom-border-bottom-dashed'>
                            <ModalHeader className="p-12" close={CloseButton}>
                                <ModalTitle className='h6'>{confirmationModalProps.headerText}</ModalTitle>
                            </ModalHeader>
                            <ModalBody className='p-0'>
                                <div className="row">
                                    <div className="col-4">
                                        <div class="form-floating">
                                            <input type="text" readonly class="form-control-plaintext form-control-sm" id="TotalRefundAmount" value={value.totalRefund} />
                                            <label for="TotalRefundAmount">Total Refund Amount</label>
                                        </div>
                                    </div>
                                    {value.orderType == 'LabOrder' && <div className="col-4">
                                        <div class="form-floating">
                                            <input type="text" readonly class="form-control-plaintext form-control-sm" id="NetRefundAmount" value={value.netAmountRefund} />
                                            <label for="NetRefundAmount">Net Refund Amount</label>
                                        </div>
                                    </div>}
                                    {value.orderType == 'LabOrder' && <div className="col-4">
                                        <div class="form-floating">
                                            <input type="text" readonly class="form-control-plaintext form-control-sm" id="MDxPointsRefund" value={value.mdxPoints + " (worth Rs " + value.refund.mdxPointsWorth.toFixed(2) + ")"} />
                                            <label for="MDxPointsRefund"> MDx Points Refund</label>
                                        </div>
                                    </div>}
                                </div>






                                {/* <div className="mx-3">
                                            Total Refund Amount : {value.totalRefund}<br/>
                                            {value.orderType == 'LabOrder'?<div>
                                            Net Refund Amount : {value.netAmountRefund}<br/>
                                            MDx Points Refund : {value.refund.mdxPoints+" (worth "}<span className="rupee">&#x20B9;</span>{value.refund.mdxPointsWorth.toFixed(2)+")"}<br/> </div>: ""}
                                        </div> */}
                                <DynamicForm formJson={null} helpers={helpers} observers={observersMap} />
                            </ModalBody>
                        </div>
                    </Modal>
                    : null
                }
            </Wrapper>
        </React.Fragment>
    )
}

export default withFormHoc(LabOrderRefundSearchResults);