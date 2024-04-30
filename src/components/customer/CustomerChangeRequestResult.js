import React, { useContext } from "react";
import { useState } from "react";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import { useRef } from "react";
import qs from 'qs';
import { useEffect } from "react";
import Validate from "../../helpers/Validate";
import UserService from "../../services/Common/UserService";
import { AlertContext, UserContext } from "../Contexts/UserContext";
import CommonDataGrid, { ChangeType } from "@medplus/react-common-components/DataGrid";
import NoDataFound from "../Common/NoDataFound";
import { CallIcon } from "@medplus/react-common-components/DataGrid";
import { ApproveIcon } from "@medplus/react-common-components/DataGrid";
import { CancelIcon } from "@medplus/react-common-components/DataGrid";
import { SmsIcon } from "@medplus/react-common-components/DataGrid";
import { API_URL, CRM_UI } from "../../services/ServiceConstants";
import DynamicForm, { TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm";
import { Button, Modal } from "react-bootstrap";
import CommonConfirmationModal from "../Common/ConfirmationModel";
import FormHelpers from "../../helpers/FormHelpers";
import { makeOutBoundCall, redirectCustomerPage } from "../../helpers/CommonRedirectionPages";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const CustomerChangeRequestResult = ({ helpers, formData, ...props }) => {

    const defaultCriteria = {
        startIndex: 0,
        limit: 30
    }

    const { setStackedToastContent } = useContext(AlertContext)

    const headerRef = useRef(null);
    const [searchCriteria, setSearchCriteria] = useState({});
    const userSessionInfo = useContext(UserContext);
    const [gridData, setGridData] = useState(undefined);
    const [loading, setLoading] = useState(false)
    const [dataSet, setDataSet] = useState([]);
    const [showActionForm, setShowActionForm] = useState(false);
    const [showConfirmationModal, setConfirmationModal] = useState(false);
    const [rejectAction, setRejectAction] = useState(false);
    const [value, setValueForModal] = useState(undefined);
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const validate = Validate();

    useEffect(() => {
        if (validate.isNotEmpty(params)) {
            const paramsSearchCriteria = getActualSearchCriteria(params);
            const currentSearchCriteria = getActualSearchCriteria(searchCriteria);
            if (validate.isEqualObject(paramsSearchCriteria, currentSearchCriteria)) {
                return;
            }
        }
        let limitTo = params.limitTo ? params.limitTo : defaultCriteria.limit;
        setSearchCriteria({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
        getInitialData({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
    }, [props.location.search])

    const getInitialData = async (searchCriteria) => {
        setLoading(true);
        const data = await getCustomerRequestDetails(searchCriteria);
        setGridData((validate.isNotEmpty(data) && validate.isNotEmpty(data.dataGrid)) ? data.dataGrid : undefined);
        setDataSet((validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet)) ? [...data.dataSet] : []);
    }

    const getActualSearchCriteria = (criteria) => {
        const {pageNumber,limitTo,limitFrom,...rest} = criteria;
        return rest;
    }

    const getCustomerRequestDetails = async (obj) => {
        return await UserService().searchCustomerRequest(obj).then((data) => {
            if (data && validate.isNotEmpty(data.dataObject) && data.statusCode === "SUCCESS") {
                setDataSet(data.dataSet)
                setLoading(false)
                return data.dataObject;
            } else if (data && data.statusCode === "FAILURE") {
                setStackedToastContent({ toastMessage: data.message, position: TOAST_POSITION.BOTTOM_START });
                setLoading(false)
                return [];
            } else {
                setLoading(false)
                return [];
            }
        }).catch((err) => {
            setStackedToastContent({ toastMessage: "Unable to get follow up details , please try again", position: TOAST_POSITION.BOTTOM_START });
            setLoading(false)
            return [];
        });
    }

    const ValidateFormFields = (fieldValues) => {
        if (validate.isNotEmpty(fieldValues.dateOfBirth)) {
            let todayDate = new Date();
            let dateStr = fieldValues.dateOfBirth.split("-");
            let selectedDate = new Date(dateStr[0], dateStr[1] - 1, dateStr[2]);
            selectedDate.setHours("23", "59", "59");
            if (selectedDate >= todayDate) {
                setStackedToastContent({ toastMessage: "Please select the date of birth less than current date" });
                return false;
            }
        }
        if (validate.isEmpty(fieldValues.address)) {
            helpers.updateSingleKeyValueIntoField("message", "Please provide address to create a customer", "address", false);
            return false;
        }
        if (validate.isNotEmpty(fieldValues.hiddenAge)) {
            let intAge = fieldValues.hiddenAge;
            if (intAge != null && (0 < intAge && 101 > intAge)) {
                return true;
            } else {
                setStackedToastContent({ toastMessage: "Please Enter Age greater than or equal to 1" });
                helpers.updateValue("", "dateOfBirth");
                return false;
            }
        }
    }

    const updateRecord = () => {
        let temporaryDataSet = [...dataSet];
        temporaryDataSet.splice(temporaryDataSet.findIndex(obj => obj.index == value.index), 1);
        setDataSet([...temporaryDataSet]);
    }

    const submitApproveForm = async () => {
        const approveFormObj = helpers.validateAndCollectValuesForSubmit('newCustomerForm');
        console.log(approveFormObj);
        if (validate.isNotEmpty(approveFormObj)) {
            if (ValidateFormFields(approveFormObj)) {
                UserService().approveCustomerChangeRequest({ fullName: approveFormObj.fullName, gender: approveFormObj.gender[0], dateOfBirth: approveFormObj.dateOfBirth, age: approveFormObj.hiddenAge, address: approveFormObj.address, mobileNumber: approveFormObj.mobileNumber, postalCode: approveFormObj.postalCode, city: approveFormObj.city, state: approveFormObj.states[0], approveComment: approveFormObj.approveComment, requestedID: value.requestedId, requestedCustomerID: value.CustomerId }).then(data => {
                    if (validate.isNotEmpty(data) && data.statusCode == "SUCCESS") {
                        setStackedToastContent({ toastMessage: "Customer Request Approved Succesfully" });
                        setShowActionForm(false);
                        updateRecord();
                    }
                    else {
                        setStackedToastContent({ toastMessage: data.message });
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        }
        return;
    }

    const handleSmsRequest = async () => {
        await UserService().sendSmsToCustomerForChangeRequest({ mobileNo: value.newAddress.mobile.split(" ")[1] }).then(data => {
            if (validate.isNotEmpty(data) && data.statusCode == "SUCCESS") {
                setStackedToastContent({ toastMessage: "SMS sent successfully " });
            } else {
                setStackedToastContent({ toastMessage: data.message });
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const submitRejectForm = async () => {
        const rejectFormObj = helpers.validateAndCollectValuesForSubmit("rejectForm", false, false, false);
        console.log(rejectFormObj);
        let rejectObj = {
            rejectComment: rejectFormObj.rejectReason,
            reason: rejectFormObj.reasonType[0],
            requestedCustomerID: value.CustomerId,
            requestedID: value.requestedId
        }
        UserService().rejectCustomerChangeRequest(rejectObj).then((data) => {
            if (data.statusCode == "SUCCESS") {
                setStackedToastContent({ toastMessage: "SUCCESS" });
                setShowActionForm(false);
                setRejectAction(false)
                updateRecord();
            } else {
                setStackedToastContent({ toastMessage: data.message });
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const updateCustomerDetails = async () => {
        if (validate.isNotEmpty(value.newAddress.mobile)) {
            helpers.updateValue(value.newAddress.mobile.split(" ")[1], "mobileNumber", false);
        }
        if (validate.isNotEmpty(value.newCustomerInfo.Email)) {
            helpers.updateValue(value.newCustomerInfo.Email, "emailId", false);
        }
        if (validate.isNotEmpty(value.newCustomerInfo.DOB)) {
            helpers.updateValue(value.newCustomerInfo.DOB, "dateOfBirth", false);
            setAge(value.newCustomerInfo.DOB)
        }else {
            helpers.updateValue(value.oldCustomerFullData.dateOfBirth, "dateOfBirth", false);
            setAge(value.oldCustomerFullData.dateOfBirth)
        }
        if (validate.isNotEmpty(value.newCustomerInfo['Customer Name'])) {
            helpers.updateValue(value.newCustomerInfo['Customer Name'], "fullName", false);
        }
        if (validate.isNotEmpty(value.newAddress.address)) {
            helpers.updateValue(value.newAddress.address, "address", false);
        }
        if (validate.isNotEmpty(value.newAddress.pincode)) {
            helpers.updateValue(value.newAddress.pincode, "postalCode", false);
        }
        if (validate.isNotEmpty(value.newAddress.city)) {
            helpers.updateValue(value.newAddress.city, "city", false);
        }
    }

    const setAge = (dateOfBirth) => {
        let age = undefined;
        let today = new Date();
        let birthDate = new Date(dateOfBirth);
        let yearDiff = today.getFullYear() - birthDate.getFullYear();
        let monthDiff = today.getMonth() - birthDate.getMonth();
        let dateDiff = today.getDate() - birthDate.getDate();

        if (yearDiff > 0) {
            if (monthDiff < 0) {
                age = yearDiff - 1
            } else {
                age = yearDiff
            }
        } else if (yearDiff === 0 && monthDiff > 0) {
            age = yearDiff;
        } else if (yearDiff === 0 && monthDiff === 0 && dateDiff >= 0) {
            age = yearDiff;
        } else {
            age = undefined;
        }


        if (age < 0 || age > 100 || age === undefined) {
            setStackedToastContent({ toastMessage: "Please select valid Date Of Birth" })
            helpers.updateValue("", "age");
            helpers.hideElement("age");
        } else {
            if (age === 0) {
                helpers.updateValue('0', "hiddenAge");
                helpers.updateValue('0' + " Year(s)", "age");
            } else {
                helpers.updateValue(age, "hiddenAge");
                helpers.updateValue(age + " Year(s)", "age");
            }
            helpers.showElement("age")
        }
    }

    const callBackMapping = {
        "renderoldCustomerInfoColumn": (props) => {
            const { row } = props
            return <React.Fragment>
                {
                    validate.isNotEmpty(row.oldCustomerInfo) ?
                        Object.keys(row.oldCustomerInfo).map((index, value) => {
                            if (validate.isEmpty(row.oldCustomerInfo[index])) {
                                return;
                            }
                            return <>
                                <h8>{index} : </h8>
                                <h9>{row.oldCustomerInfo[index]}
                                    {value != (Object.keys(row.oldCustomerInfo).length) - 1 ? <> , </> : <></>}
                                </h9></>;
                        }) : <>-</>}
            </React.Fragment>
        },
        "rendernewCustomerInfoColumn": (props) => {
            const { row } = props
            return <React.Fragment>
                {
                    validate.isNotEmpty(row.newCustomerInfo) ?
                        Object.keys(row.newCustomerInfo).map((index, value) => {
                            if (validate.isEmpty(row.newCustomerInfo[index])) {
                                return;
                            }
                            return <>
                                <h8>{index} : </h8>
                                <h9>{row.newCustomerInfo[index]}
                                    {value != (Object.keys(row.newCustomerInfo).length) - 1 ? <> , </> : <></>}
                                </h9></>;
                        }) : <>-</>}
            </React.Fragment>
        },
        "renderoldAddressColumn": (props) => {
            const { row } = props;
            if (validate.isNotEmpty(row.oldAddress)) {
                const addressElements = [
                    validate.isNotEmpty(row.oldAddress.address) ? row.oldAddress.address : null,
                    validate.isNotEmpty(row.oldAddress.locality) ? row.oldAddress.locality : null,
                    validate.isNotEmpty(row.oldAddress.city) ? row.oldAddress.city : null,
                    validate.isNotEmpty(row.oldAddress.state) ? row.oldAddress.state : null,
                    validate.isNotEmpty(row.oldAddress.pincode) ? row.oldAddress.pincode : null,
                    validate.isNotEmpty(row.oldAddress.mobile) ? row.oldAddress.mobile : null,
                    validate.isNotEmpty(row.oldAddress.phone) ? row.oldAddress.phone : null,
                ].filter(Boolean); 
            
                const oldFullAddress = addressElements.join(', ');
            
                return <React.Fragment>{oldFullAddress}</React.Fragment>;
            }
            else
                return <React.Fragment>-</React.Fragment>
        },
        "rendernewAddressColumn": (props) => {
            const { row } = props
            if (validate.isNotEmpty(row.newAddress)) {
                const addressElements = [
                    validate.isNotEmpty(row.newAddress.address) ? row.newAddress.address : null,
                    validate.isNotEmpty(row.newAddress.locality) ? row.newAddress.locality : null,
                    validate.isNotEmpty(row.newAddress.city) ? row.newAddress.city : null,
                    validate.isNotEmpty(row.newAddress.state) ? row.newAddress.state : null,
                    validate.isNotEmpty(row.newAddress.pincode) ? row.newAddress.pincode : null,
                    validate.isNotEmpty(row.newAddress.mobile) ? row.newAddress.mobile : null,
                    validate.isNotEmpty(row.newAddress.phone) ? row.newAddress.phone : null,
                ].filter(Boolean);
            
                const newFullAddress = addressElements.join(', ');
            
                return <React.Fragment>{newFullAddress}</React.Fragment>;
            }
            else
                return <React.Fragment>-</React.Fragment>
        },
        "renderActionColumn": (props) => {
            const { row } = props
            return <React.Fragment>
                <div className="d-flex w-100">
                    <ApproveIcon handleOnClick={() => handleApproveAction(row)} />
                    <CancelIcon tooltip={"Reject"} handleOnClick={() => handleReject(row)} />
                    {validate.isNotEmpty(row.oldCustomerFullData) && <>
                        <SmsIcon handleOnClick={() => { setValueForModal(row), setConfirmationModal(true) }} />
                        <CallIcon handleOnClick={() => makeOutBoundCall(row.callUrl)} /></>}
                </div>
            </React.Fragment>
        },
        "renderCustomerIdColumn": (props) => {
            const { row } = props
            return <React.Fragment>
                <a className="btn btn-sm btn-link w-100" id={row.CustomerId} href="javascript:void(0)" rel="noopener" aria-label={row.CustomerId} role="link" title="View Customer details" onClick={() => redirectCustomerPage({ customerId: row.CustomerId, webLoginId: row.oldCustomerFullData?.webLoginID, isMergedFlag: row.oldCustomerFullData?.merged, mobile: row.oldCustomerFullData?.mobileNumber, customerType: 'POS' }, handleFailure)}>{row.CustomerId}</a>
            </React.Fragment>
        }
    };

    const handleFailure = ({ message }) => {
        setStackedToastContent({ toastMessage: message })
    }


    const handleReject = (value) => {
        helpers.clear();
        setShowActionForm(true)
        setRejectAction(true);
        setValueForModal(value);
        helpers.addForm(FormHelpers().getCustomerChangeRejectForm(helpers));
    }

    const handleApproveAction = (value) => {
        helpers.clear();
        setValueForModal(value);
        setShowActionForm(true);
        setRejectAction(false);
    }

    const appendParamsToUrl = (pageNumber, limitTo) => {
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        props.history.replace(`${CRM_UI}/customerChangeRequest?${qs.stringify({ ...params, pageNumber: pageNumber, limitTo: limitTo })}`);
    }

    const remoteDataFunction = async ({ startIndex, limit, filters, pageNumber, changeType }) => {
        let temObj = { ...searchCriteria, limitFrom: startIndex, limitTo: limit };
        let value  = filters.CustomerId.value;
        if(validate.isNotEmpty(filters) && filters['CustomerId'] && value && value.length !=8 ){
            return {status:false};
        }
        if(validate.isNotEmpty(value)){
            temObj = {...temObj,customerId:value};
        }
        const data = await getCustomerRequestDetails(temObj);
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
        'newCustomerForm': [['load', updateCustomerDetails]],
        'closeModal': [['click', () => setShowActionForm(false)]],
        'submitRejectForm': [['click', () => submitRejectForm()]],
        'dateOfBirth': [['change', (payload) => setAge(payload[0].target.value)]],
    }
    const CloseButton = <Button variant="" className="btn-close icon-hover" type="button" onClick={() => setShowActionForm(!showActionForm)}> </Button>

    return (
        <React.Fragment>
            <Wrapper showHeader={false}>
                <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                    <p className="mb-0"> Customer Request Details</p>
                </HeaderComponent>
                <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height" >
                    {!loading ? validate.isNotEmpty(dataSet) ?
                        <div className={`h-100`}>
                            <div className="card h-100">
                                <div className='card-body p-0'>
                                    <CommonDataGrid {...gridData} dataSet={dataSet} callBackMap={callBackMapping} remoteDataFunction={remoteDataFunction} />
                                </div>
                            </div>
                        </div>
                        : <NoDataFound text="No Customer changes data found for this customer with given criteria, try with other details!" searchButton={true} /> : null}
                </BodyComponent>
                {showActionForm ?
                    <Modal
                        show={true}
                        backdrop="static"
                        onHide={() => { setShowActionForm(false) }}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <div className=''>
                            <ModalHeader className="p-12" close={CloseButton}>
                                <Modal.Title className='h6'>Request For {rejectAction ? "Rejection" : "Approval"}</Modal.Title>
                            </ModalHeader>
                            <ModalBody className={!rejectAction?'':'p-0'}>
                                {rejectAction ? <DynamicForm form={null} helpers={helpers} observers={observersMap} /> :
                                    <DynamicForm requestUrl={`${API_URL}customerChangeRequestForm`} requestMethod={'GET'} helpers={helpers} observers={observersMap} />}
                            </ModalBody>
                            {!rejectAction && <ModalFooter className="justify-content-center">
                                <Button id="cancel" className="ms-2 col-3 brand-secondary btn-light" onClick={() => setShowActionForm(false)}>Close</Button>
                                <Button id="submit" className="ms-2 col-3 btn-brand" onClick={() => submitApproveForm()}>Submit</Button>
                            </ModalFooter>}
                        </div>
                    </Modal>
                    : null
                }
                {showConfirmationModal && <CommonConfirmationModal isConfirmationPopOver={showConfirmationModal} setConfirmationPopOver={setConfirmationModal} message={"Send SMS to customer for not responding to the call."} buttonText={"Proceed"} onSubmit={() => handleSmsRequest()} />}
            </Wrapper>
        </React.Fragment>
    )
}

export default withFormHoc(CustomerChangeRequestResult);