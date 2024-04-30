import React, { useRef, useState } from 'react'
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure'
import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import DynamicGridHeight from '../Common/DynamicGridHeight';
import NearByStores from '../Catalog/ProductDetails/NearByStores';
import storeIcon from '../../images/store-locator-icn.svg'
import { Button } from 'react-bootstrap';

const ReorderModel = (props) => {
    const headerRef = useRef();
    const footerRef = useRef();
    const [openLocationsModel, setOpenLocationsModel] = useState(false);
    function renderselectColumn(props) {
        return <input type='checkbox' id="myCheckbox" name="myCheckbox" value="checkboxValue" />
    }
    const orderDetailsMetadata = () => {
        let orderDetails = {
            "idProperty": "rowIndex",
            "columns": [
                {
                    "columnName": "Select",
                    "rowDataKey": "select",
                    "resizable": true,
                    "cellClassName": "actions-column",
                    "customRowRenderingFunction": {
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderselectColumn"
                    }

                },

                {
                    "columnName": "Items purchased",
                    "rowDataKey": "itemsPurchased",
                    "resizable": true,
                },
                {
                    "columnName": "Pack Size",
                    "rowDataKey": "packSize",
                    "resizable": true,
                },
                {
                    "columnName": "Ordered QTY (units)",
                    "rowDataKey": "QTY",
                    "resizable": true,
                },
                {
                    "columnName": "Unit price",
                    "rowDataKey": "unitPrice",
                    "resizable": true,
                    "cellClassName" : "text-end",
                    "columnSubtype" : "AMOUNT",
                    "columnType" : "NUMBER"
                },
                {
                    "columnName": "QTY",
                    "rowDataKey": "quantity",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderQuantityColumn"
                    }
                },
                {
                    "columnName": "Available",
                    "rowDataKey": "available",
                    "resizable": true,
                    "customRowRenderingFunction": {
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderAvailabeColumn"
                    }
                }

            ],
        }
        return orderDetails;
    }
    const labOrderDetailsMetadata = () => {
        let labOrderDetails = {
            "idProperty": "rowIndex",
            "columns": [
                {
                    "columnName": "Select",
                    "rowDataKey": "select",
                    "resizable": true,
                    "cellClassName": "actions-column",
                    "customRowRenderingFunction": {
                        "type": "FUNCTION",
                        "returnType": "REACT_NODE",
                        "name": "renderLabSelectColumn"
                    }

                },
                {
                    "columnName": "Test Code",
                    "rowDataKey": "testCode",
                    "resizable": true,
                },

                {
                    "columnName": "Test Name/Profile Name",
                    "rowDataKey": "testName",
                    "resizable": true,
                },
                {
                    "columnName": "MRP",
                    "rowDataKey": "MRP",
                    "resizable": true,
                    "cellClassName": "text-end",
                    "columnSubtype": "AMOUNT",
                    "columnType": "NUMBER"
                },
            ],
        }
        return labOrderDetails;
    }

    const storeInfo = {
        "results": {
            "INTGHYD00491": {
                "categoryId_s": "1",
                "citycode_s": "HYD",
                "address_s": "H. No 12-7-133/108/22/8, Plot No. 447 Part, Sy No: 1011/5, 6, 7A, 8, 9 and 11, Anjaneya Nagar, Kukatpally Village, Balanagar, Rangareddy Dist, Telangana",
                "formTemplateId_s": "8",
                "inventoryStoreId_s": "INAPHYD00001",
                "opticalStoreStatus_s": "N",
                "GstStateCode_s": "36",
                "FSSAI_s": "23622032002122",
                "pincode_s": "500072",
                "storeType": "Store",
                "PrintHeader_s": " ",
                "OrderIndent_s": "N",
                "TINNo_s": "36259073275",
                "isVaccinationAllowed_s": "N",
                "hubType_s": "1",
                "status_s": "A",
                "name_s": "MEDPLUS MOOSAPET ANJANEYA NAGAR",
                "locality_s": "Moosapet",
                "statecode_s": "TG",
                "DLNO_s": "TG/15/02/2015-11273 TG/15/02/2015-11274",
                "city_s": "HYDERABAD",
                "franchiseType_s": "0",
                "NoStockHub_s": "Y",
                "storeId_s": "INTGHYD00491",
                "state_s": "TELANGANA",
                "country_s": "IN",
                "phoneNumber_s": "7660027094",
                "allowedPickup_s": "Y",
                "locationLatLong": "17.46974000,78.41811000",
                "isOverFlowStore_s": "NO",
                "hubId_s": "INTGHYD00491",
                "GstinNo_s": "36AAACO7727M1Z0",
                "CompanyAddress_s": "H. No: 11-6-56, Survey No: 257 & 258/1, Opp:IDPL Railway Siding Road,(Moosapet),Kukatpally Hyderabad Hyderabad TG 500037 IN",
                "CompanyStateAddress_s": "H. No.11-6-56,257/258/1, OPP IDPL RAILWAY SIDING, MOOSAPET,KUKATPAL, Hyderabad, Telangana-500037",
                "CompanyName_s": "OPTIVAL HEALTH SOLUTIONS PVT LTD",
                "accountID_s": "9667",
                "accountCode_s": "OTG",
                "CinNo_s": "U85110TG2005PTC046821",
                "tenantId_s": "1",
                "company_s": "Optival",
                "accountType_s": "O",
                "dist": "1.1531574",
                "avlQty": "7.0"
            },
            "INAPHYD00045": {
                "categoryId_s": "1",
                "citycode_s": "HYD",
                "address_s": "Shop No.2, Plot No.192, Happy Home Apts, Mothinagar, Balanagar-500 018",
                "formTemplateId_s": "8",
                "inventoryStoreId_s": "INAPHYD00001",
                "opticalStoreStatus_s": "N",
                "GstStateCode_s": "36",
                "FSSAI_s": "23618032000405",
                "pincode_s": "500018",
                "storeType": "Store",
                "PrintHeader_s": "MEDPLUS - PHARMACY",
                "OrderIndent_s": "N",
                "neighbourhood_s": "Bus Stop",
                "TINNo_s": "36259073275",
                "isVaccinationAllowed_s": "N",
                "hubType_s": "0",
                "status_s": "A",
                "name_s": "MEDPLUS MOTI NAGAR",
                "locality_s": "MOTHINAGAR",
                "landmark_s": "BESIDES TO DONBOSKO SCHOOL",
                "statecode_s": "TG",
                "DLNO_s": "449/RR/AP/2005/R",
                "city_s": "HYDERABAD",
                "franchiseType_s": "0",
                "NoStockHub_s": "Y",
                "storeId_s": "INAPHYD00045",
                "state_s": "TELANGANA",
                "country_s": "IN",
                "phoneNumber_s": "7660027045",
                "Fax_s": "040-27607871",
                "allowedPickup_s": "Y",
                "locationLatLong": "17.45439000,78.42493000",
                "isOverFlowStore_s": "NO",
                "hubId_s": "INTGHYD00467",
                "GstinNo_s": "36AAACO7727M1Z0",
                "CompanyAddress_s": "H. No: 11-6-56, Survey No: 257 & 258/1, Opp:IDPL Railway Siding Road,(Moosapet),Kukatpally Hyderabad Hyderabad TG 500037 IN",
                "CompanyStateAddress_s": "H. No.11-6-56,257/258/1, OPP IDPL RAILWAY SIDING, MOOSAPET,KUKATPAL, Hyderabad, Telangana-500037",
                "CompanyName_s": "OPTIVAL HEALTH SOLUTIONS PVT LTD",
                "accountID_s": "9667",
                "accountCode_s": "OTG",
                "CinNo_s": "U85110TG2005PTC046821",
                "tenantId_s": "1",
                "company_s": "Optival",
                "accountType_s": "O",
                "dist": "2.0076296",
                "avlQty": "5.0"
            },

            "INTGHYD00462": {
                "categoryId_s": "1",
                "citycode_s": "HYD",
                "address_s": "D.no,3-18,54/A,ground Floor,Chanda Nagar Viilage,Sherlingampally madal,Ranga Reddy-Dist",
                "formTemplateId_s": "8",
                "inventoryStoreId_s": "INAPHYD00001",
                "opticalStoreStatus_s": "N",
                "GstStateCode_s": "36",
                "FSSAI_s": "23618032000414",
                "pincode_s": "500067",
                "storeType": "Store",
                "PrintHeader_s": "MEDPLUS",
                "OrderIndent_s": "N",
                "TINNo_s": "36259073275",
                "isVaccinationAllowed_s": "N",
                "hubType_s": "1",
                "status_s": "A",
                "name_s": "MEDPLUS MADINAGUDA MY HOME JEWEL",
                "locality_s": "chanda nagar",
                "statecode_s": "TG",
                "DLNO_s": "TG/15/02/2014-920/TG/15/02/2014/919",
                "city_s": "HYDERABAD",
                "franchiseType_s": "0",
                "NoStockHub_s": "N",
                "storeId_s": "INTGHYD00462",
                "state_s": "TELANGANA",
                "country_s": "IN",
                "phoneNumber_s": "8498095521",
                "allowedPickup_s": "Y",
                "locationLatLong": "17.49082900,78.33704380",
                "isOverFlowStore_s": "NO",
                "hubId_s": "INTGHYD00462",
                "GstinNo_s": "36AAACO7727M1Z0",
                "CompanyAddress_s": "H. No: 11-6-56, Survey No: 257 & 258/1, Opp:IDPL Railway Siding Road,(Moosapet),Kukatpally Hyderabad Hyderabad TG 500037 IN",
                "CompanyStateAddress_s": "H. No.11-6-56,257/258/1, OPP IDPL RAILWAY SIDING, MOOSAPET,KUKATPAL, Hyderabad, Telangana-500037",
                "CompanyName_s": "OPTIVAL HEALTH SOLUTIONS PVT LTD",
                "accountID_s": "9667",
                "accountCode_s": "OTG",
                "CinNo_s": "U85110TG2005PTC046821",
                "tenantId_s": "1",
                "company_s": "Optival",
                "accountType_s": "O",
                "dist": "9.942087",
                "avlQty": "5.0"
            }
        },
        "length": 3,
        "totalProducts": 0
    }

    const orderDetailss = Object.freeze(props.orderInfo ? orderDetailsMetadata() : labOrderDetailsMetadata());
    const callBackMapping = {
        'renderselectColumn': renderselectColumn,
        'renderAvailabeColumn': renderAvailabeColumn,
        'renderLabSelectColumn': renderLabSelectColumn,
        'renderQuantityColumn': renderQuantityColumn
    }
    function renderAvailabeColumn() {
        return <div className='pointer'>
            <img src={storeIcon} onClick={() => { setOpenLocationsModel(true) }}></img>
        </div>
    }

    function renderLabSelectColumn() {
        return <input type='checkbox' id="myCheckbox" name="myCheckbox" value="checkboxValue"></input>
    }
    function renderQuantityColumn() {
        return <input type='text' className='form-input-height form-control' placeholder='Enter Quantity' />
    }




    const orderData = [{
        "select": "",
        "itemsPurchased": "cipla",
        "packSize": 10,
        "QTY": 11,
        "unitPrice": 11,
        "quantity": 10,
        "available": ""
    },
    {
        "select": "",
        "itemsPurchased": "cipla",
        "packSize": 10,
        "QTY": 11,
        "unitPrice": 11,
        "quantity": 10,
        "available": ""
    },
    {
        "select": "",
        "itemsPurchased": "cipla",
        "packSize": 10,
        "QTY": 11,
        "unitPrice": 11,
        "quantity": 10,
        "available": ""
    }
    ]

    const labData = [{
        "testCode": "P00025",
        "testName": "MDx Fever Basic",
        "MRP": 100
    },
    {
        "testCode": "P00025",
        "testName": "MDx Fever Basic",
        "MRP": 100
    }
    ]


    return (
        <div className='custom-modal header'>
            <Wrapper className="m-0">
                <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-1">
                    <p className="mb-0"><span className='hide-on-mobile'>{props.orderInfo ? "" : "Lab "}Order Details for Order ID </span><span className='font-weight-bold'>GRMMM2400000025</span></p>
                    <div class=" d-flex align-items-center">
                        <Button variant="link" onClick={() => {props.handleSetOpenReorderModal(false)}} className="rounded-5 icon-hover">
                            <span className='custom-close-btn icon-hover'></span>
                        </Button>
                    </div>
                </HeaderComponent>
                <BodyComponent allRefs={{ "headerRef": headerRef ,"footerRef":footerRef}}>
                    <div className="col-12 p-12">
                        <p className="custom-fieldset  mb-1">{props.orderInfo ? "Order Details" : "Lab Order Details"}</p>
                        <div className='card'>
                            {props.orderInfo ? <DynamicGridHeight id="rules-datagrid" metaData={orderDetailss} dataSet={orderData}>
                                <CommonDataGrid
                                    {...orderDetailss}
                                    dataSet={[...orderData]}
                                    callBackMap={callBackMapping}
                                />

                            </DynamicGridHeight> :
                                <DynamicGridHeight id="rules-datagrid" metaData={orderDetailss} dataSet={labData}>
                                    <CommonDataGrid
                                        {...orderDetailss}
                                        dataSet={[...labData]}
                                        callBackMap={callBackMapping}
                                    />
                                </DynamicGridHeight>
                            }
                        </div>
                    </div>
                    <NearByStores productName={"BOROLINE ANTISEPTIC CREAM 20 GM"} storeInfo={storeInfo} openlocationflag={openLocationsModel} setOpenlocationflag={setOpenLocationsModel} />
                </BodyComponent>
                <FooterComponent ref={footerRef}>
                    <div className='footer d-flex flex-row-reverse p-2'>
                        <button className=' px-4 py-2  btn  btn-brand'>Add to Cart</button>
                    </div> 
                </FooterComponent>
            </Wrapper>
        </div>
    )
}

export default ReorderModel