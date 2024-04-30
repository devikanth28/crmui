import DynamicForm, { TOAST_POSITION, withFormHoc } from "@medplus/react-common-components/DynamicForm";
import React, { useCallback,useRef, useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CustomerService from "../../../../services/Customer/CustomerService";

import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import { gotoMartCustomerPage, redirectToCatalogIntermediateComponent } from "../../../../helpers/CommonRedirectionPages";
import Validate from "../../../../helpers/Validate";
import CloseIcon from '../../../../images/cross.svg';
import DetailModal from "../../../Common/DetailModal";
import DynamicGridHeight from "../../../Common/DynamicGridHeight";
import { AlertContext, UserContext } from "../../../Contexts/UserContext";
import CustomerDetails from "../../CustomerDetails";
import dateFormat from 'dateformat';
import { getBadgeColorClassForCfpStatus } from "./CfpSearchResult";





const dataGrid = {

    "idProperty": "requestId",
    "columns": [

        {
            "columnName": "Product ID",
            "rowDataKey": "productId"
        },
        {
            "columnName": "Product Name",
            "rowDataKey": "productName"
        },
        {
            "columnName": "Last Chronic Purchased Quantity",
            "rowDataKey": "lastChronicPurchasedQuantity",
            "cellClassName":"border-end-0"
        }
    ]
}

const followUpsDataGrid = {

    "idProperty": "followupId",
    "columns": [

        {
            "columnName": "Follow Up Date & Time",
            "rowDataKey": "followUpDateAndTime",
            "columnType": "DATE",
            "dateFormatStr": "ISO_DATE_12_TIME"
        },
        {
            "columnName": "Follow Up By",
            "rowDataKey": "followUpBy"
        },
        {
            "columnName": "Remarks",
            "rowDataKey": "remarks"
        },
        {
            "columnName": "Next Follow Up Date & Time",
            "rowDataKey": "nextActionDate",
            "columnType": "DATE",
            "dateFormatStr": "ISO_DATE_12_TIME",
            "cellClassName":"border-end-0",
        }
    ]
}

const CfpActionDetails = ({ helpers, ...props }) => {


    const [loading, isLoading] = useState(false);
    const [productDataGrid, setProductDataGrid] = useState(dataGrid);
    const [products, setProducts] = useState(undefined);
    const [followUpsGrid, setFollowUpsGrid] = useState(followUpsDataGrid);
    const [followUps, setFollowUps] = useState(undefined);
    const [cfpActionDetails, setCfpActionDetails] = useState(undefined);
    const userSessionInfo = useContext(UserContext);
    const footerRef = useRef();
    const { setStackedToastContent } = useContext(AlertContext);

    useEffect(() => {
        getCfpActionDetails();
    }, []);

    const getCfpActionDetails = async () => {
        isLoading(true);

        await CustomerService().getCfpActionDetails({ "actionId": props.actionId, "customerId": props.customerId }).then((response) => {
            if ("SUCCESS" === response.statusCode) {
                setCfpActionDetails(response.dataObject);
                setProducts(getProductsDataSet(response.dataObject.productNames,response.dataObject.cfpAction));
                if (Validate().isNotEmpty(response.dataObject.cfpAction.customerFuturePurchaseFollowUps)) {
                    setFollowUps(getFollowUpsDataSet(response.dataObject.cfpAction.customerFuturePurchaseFollowUps));
                }
                if (Validate().isNotEmpty(response.dataObject.dataSetRow)) {
                    let temp = [...props.dataSet];
                    props.dataSet.forEach((element, index) => {
                        if (element.actionId === props.actionId) {
                            temp[index] = response.dataObject.dataSetRow;
                        }
                    });
                    props.setDataSet(temp);
                }
            } else {
                setStackedToastContent({ toastMessage: Validate().isNotEmpty(response.message) ? response.message : "System experiencing some problem, Please try after some time" });
            }
        }, (err) => {
            console.log(err);
            setStackedToastContent({ toastMessage: "System experiencing some problem, Please try after some time" });
        })

        isLoading(false);
    }

    function getProductsDataSet(products, cfpAction) {
        let dataSet = [];
        Object.entries(products).forEach(([key, value]) => {
            let dataSetEntry = {
                "productId": key,
                "productName": value
            };
            if(cfpAction && Validate().isNotEmpty(cfpAction.customerFuturePurchaseActionDetail)){
                let cfpActionProduct = cfpAction.customerFuturePurchaseActionDetail.find((cfpActionProduct) => {
                    return cfpActionProduct.productId == key;
                })
                if(cfpActionProduct){
                    dataSetEntry = {...dataSetEntry, "lastChronicPurchasedQuantity": cfpActionProduct.quantity};
                }else{
                    dataSetEntry = {...dataSetEntry, "lastChronicPurchasedQuantity": "-"};
                }
            }else{
                dataSetEntry = {...dataSetEntry, "lastChronicPurchasedQuantity": "-"};
            }
            dataSet.push(dataSetEntry);
        })
        return dataSet;
    }

    function getFollowUpsDataSet(cfps) {
        let dataSet = [];
        cfps.forEach((each) => {
            dataSet.push({
                "followUpBy": each.createdBy,
                "nextActionDate": each.nextActionDate ? each.nextActionDate : '-',
                "remarks": each.remarks,
                "followUpDateAndTime": each.dateCreated
            });
        })
        return dataSet;
    }

    const toggle = () => props.setOpenModal(!props.openModal);

    const handleRemarkSelection = (payload) => {
        let remark = payload[0].target.value[0];
        if (Validate().isNotEmpty(remark) && cfpActionDetails.followUpRemarks[remark] === "Y") {
            helpers.showElement("nextActionDate");
            if ("Will come later" === remark) {
                helpers.updateValue(addDaysAndGetDate(2), "nextActionDate");
            } else {
                helpers.updateValue(addDaysAndGetDate(1), "nextActionDate");
            }
        } else {
            helpers.updateValue(null, "nextActionDate");
            helpers.hideElement("nextActionDate");
        }
    }

    const addDaysAndGetDate = (days) => {
        let d = new Date();
        d.setDate(d.getDate() + days);
        let month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-') + "T00:00";
    }

    const saveCustomerFuturePurchaseFollowup = (payload) => {
        // payload[0].preventDefault();
        const formValues = helpers.validateAndCollectValuesForSubmit("followUpForm", true, true, true);
        if (Validate().isEmpty(formValues) || Validate().isEmpty(formValues.followUpRemark)) {
            return false;
        }
        CustomerService().saveCfpFollowUp({ data: { remarks: formValues.followUpRemark[0], actionId: props.actionId, nextActionDate: formValues.nextActionDate } }).then(response => {
            if ("SUCCESS" === response.statusCode) {
                setStackedToastContent({ toastMessage: "Follow up updated successfully" });
                getCfpActionDetails();
                helpers.clear();
            } else {
                setStackedToastContent({ toastMessage: "Unable to update Follow up, Please try after some time" });
            }
        }, (err) => {
            console.log(err);
            setStackedToastContent({ toastMessage: "System experiencing some problem, Please try after some time" });
        })
    }

    const onRemarkChange = (payload) => {
        let remark = payload[0].target.value;
        if (Validate().isEmpty(remark) || Validate().isEmpty(cfpActionDetails.followUpRemarks[remark])) {
            helpers.updateValue(null, "nextActionDate");
            helpers.hideElement("nextActionDate");
        }
    }

    const observersMap = {
        'followUpRemark': [['select', handleRemarkSelection], ['change', onRemarkChange]],
    }
    const getFormJson = (remarkOptions) => {
        let followUpRemarkOptions = [];
        {
            remarkOptions && Object.entries(remarkOptions).map(([key, value]) => {
                followUpRemarkOptions.push(helpers.createOption(key, key, key))
            })
        }
        const obj = {
            "htmlElementType": "FORM",
            "id": "followUpForm",
            "name": null,
            "htmlGroups": [
                {
                    "htmlElementType": "ELEMENTGROUP",
                    "id": "group1",
                    "className": "row gy-3 gx-0 w-100",
                    "labelClassName": null,
                    "groups": null,
                    "groupElements": [
                        {
                            "htmlElementType": "DATALIST",
                            "id": "followUpRemark",
                            "label": "Select Follow Up Remark",
                            "name": "remark",
                            "value": null,
                            "onInputChangeEnable": false,
                            "className": " form-control",
                            "dataListClassName": "custom-datagrid col-12",
                            "labelClassName": "col-12",
                            "required": true,
                            "values": followUpRemarkOptions
                        },
                        {
                            "htmlElementType": "INPUT",
                            "id": "nextActionDate",
                            "label": "Reminder Date & Time",
                            "name": "nextActionDate",
                            "value": "",
                            "type": "datetime-local",
                            "labelClassName": "col-12",
                            "hidden": true,
                            "disabled": true
                        }
                    ]
                },
            ],
            "notes": null,
            "atleastOneFieldRequired": false,
            "submitDisabled": false,
            "className": "d-flex flex-wrap align-items-center",
            "hidden": false
        };
        return obj;
    }

    const headerPart = useCallback(() => {
        if (cfpActionDetails) {
            return (
                <React.Fragment>
                    <div class="align-items-center border-bottom d-flex justify-content-between px-2 px-lg-3 py-1">
                    <p className="mb-0"><span className="hide-on-mobile">Customer Future Purchase Details For </span>Action ID: <strong>{props.actionId}</strong></p>
                        <Button variant=" " onClick={() => toggle()} className="rounded-5 icon-hover btn-link">
                        <span className='custom-close-btn icon-hover'></span>
                        </Button>
                    </div>
                </React.Fragment>
            )
        }
    }, [cfpActionDetails])

    const handleFailure = () => {
        setStackedToastContent({ toastMessage: "Customer is Already Opened", position: TOAST_POSITION.BOTTOM_START })
    }

    const doSale = (isSaleProcessed) => {
        if(isSaleProcessed)
            confirm("Do Sale action has been visited earlier for this CFP. Please check order history before placing a new order. Do you want to continue?");
        CustomerService().addCfpProductsToCart({ data: { actionId: props.actionId, customerId: props.customerId } }).then(response => {
            if (response && response.statusCode === "SUCCESS") {
                redirectToCatalogIntermediateComponent({pageToRedirect : "checkout/showSwitchProducts", customerId: props.customerId, prescriptionId: null, cfpStoreId: cfpActionDetails.cfpAction.storeId, recordId: null, cfpLocality: cfpActionDetails.locality })

            } else {
                setStackedToastContent({ alertmessage: response.message })
            }

        }, (err) => {
            setStackedToastContent({ alertmessage: "Something went wrong, Please try after some time" });
        })
    }

    const bodyPart = useCallback(() => {
        if (!loading && cfpActionDetails) {
            return (
                <React.Fragment>
                    <div className="row g-3 h-100">
                        <div className="col-12 col-lg-4 h-100">
                            <div className="card h-100 mh-100">
                                <div className="p-12 border-bottom">
                                    <h4 className="fs-6 mb-0">Order Information</h4>
                                </div>
                                <div className="overflow-y-auto h-100">                                    
                                    <div className="p-12 mb-n3">
                                        <CustomerDetails customerId={cfpActionDetails.cfpAction.customerId} mobileNumber={cfpActionDetails.cfpAction.mobileNumber} customerName={cfpActionDetails.cfpAction.customerName} needRule={true} />
                                    </div>
                                    {userSessionInfo.roles && userSessionInfo.roles.includes("ROLE_CRM_CFP_UPDATE_STATUS") && (cfpActionDetails.cfpStatus == 'Pending' || cfpActionDetails.cfpStatus == 'Follow Ups') && Validate().isNotEmpty(cfpActionDetails.cfpAction.mobileNumber) &&
                                        <div className="p-12">
                                        <DynamicForm formJson={getFormJson(cfpActionDetails.followUpRemarks)} helpers={helpers} observers={observersMap} />
                                    </div>}
                                    <div className="p-12">
                                        <div className="row g-0">
                                            <div className="col-6">
                                                <p className="mb-0 text-secondary font-12">Status</p>
                                                <p className={`badge rounded-pill mb-0 ${getBadgeColorClassForCfpStatus(cfpActionDetails.cfpStatus)}`}>{cfpActionDetails.cfpStatus}</p>
                                            </div>
                                            <div className="col-6 text-end">
                                                <p className="mb-0 text-secondary font-12">CFP Date</p>
                                                <p className="mb-0 font-12">{dateFormat(cfpActionDetails.cfpDate, "mmm d, yyyy")}</p>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <p className="mb-0 text-secondary font-12">Store</p>
                                                <p className="mb-0 font-12">{cfpActionDetails.cfpAction.storeId}[{cfpActionDetails.storeName}]</p>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <p className="mb-0 text-secondary font-12">Follow Up Date & Time</p>
                                                <p className="mb-0 font-12">{dateFormat(cfpActionDetails.cfpActionDate, "mmm d, yyyy, HH:MM:ss")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {userSessionInfo.roles && userSessionInfo.roles.includes("ROLE_CRM_CFP_UPDATE_STATUS") && (cfpActionDetails.cfpStatus == 'Pending' || cfpActionDetails.cfpStatus == 'Follow Ups') && Validate().isNotEmpty(cfpActionDetails.cfpAction.mobileNumber) &&
                                    <div ref={footerRef} className="footer p-12 text-end">
                                        <Button variant=" " className='brand-secondary'  onClick={() => { doSale(cfpActionDetails?.isSaleProcessed) }}>Do Sale</Button>
                                        <Button variant=" " className='brand-secondary ms-2' onClick={(payload) => saveCustomerFuturePurchaseFollowup(payload)}>Do Follow up </Button>
                                </div>}
                            </div>
                           
                            
                        </div>
                        <div class="col-12 col-lg-8 h-100">
                            <div className="border rounded crm-modal h-100">
                                <div className="p-12 m-0">
                                    {products &&
                                        <React.Fragment>
                                            <div className={'col-12 mb-3'}>
                                                <p className=" custom-fieldset mb-1">Product Details</p>
                                                <DynamicGridHeight dataSet={products} metaData={productDataGrid} className="card">
                                                    <CommonDataGrid {...productDataGrid} dataSet={products} />
                                                </DynamicGridHeight>
                                            </div>
                                        </React.Fragment>
                                    }
                                    {followUps &&
                                        <div className={'col-12 mb-3'}>
                                            <p className=" custom-fieldset mb-1">Follow Up Details</p>
                                            <DynamicGridHeight dataSet={followUps} metaData={followUpsGrid} className="card">
                                                <CommonDataGrid {...followUpsGrid} dataSet={followUps} />
                                            </DynamicGridHeight>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>




                    {/* <div className="row g-3 h-100">
                        <div class="col-4 h-100">
                            <div className='card' style={{ "max-height": "100%" }}>
                            
                                <div><strong>Status: </strong> {cfpActionDetails.cfpStatus}</div>
                                <div><strong>Store: </strong> {cfpActionDetails.cfpAction.storeId}[{cfpActionDetails.storeName}]</div>
                                <div><strong>CFP Date:</strong> {cfpActionDetails.cfpDate}</div>
                                <div><strong>Follow Up Date & Time:</strong> {cfpActionDetails.cfpActionDate}</div>

                                {userSessionInfo.roles && userSessionInfo.roles.includes("ROLE_CRM_CFP_UPDATE_STATUS") && (cfpActionDetails.cfpStatus == 'Pending' || cfpActionDetails.cfpStatus == 'Follow Ups') && Validate().isNotEmpty(cfpActionDetails.cfpAction.mobileNumber) &&
                                    <div><Button onClick={() => { doSale() }}>Do Sale</Button>
                                        <Button onClick={() => { }}>Do Follow up </Button></div>
                                }
                            </div>
                        </div>

                    </div> */}
                </React.Fragment>)
        }
    }, [loading, cfpActionDetails])

    return <React.Fragment>
        {<DetailModal {...props} loading={loading} headerPart={headerPart} headerVisibility={true} bodyPart={bodyPart} bodyVisibility={true} bodyHeightClass={"overflow-hidden"} />}
    </React.Fragment>

}

export default withFormHoc(CfpActionDetails);