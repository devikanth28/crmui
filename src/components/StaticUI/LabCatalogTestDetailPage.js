import React, { useState } from 'react'
import { TabContent, TabPane } from 'reactstrap';
import NavTabs from '../Common/NavTabs';
import PackageTestCard from './PackageTestCard';
import { BodyComponent } from '../Common/CommonStructure';
import NearByStores from '../Catalog/ProductDetails/NearByStores';

const LabCatalogTestDetailPage = () => {
    const [openLocationsModel, setOpenLocationsModel] = useState(false);
    const [tabId, setTabId] = useState('1');
    const [buttonDisabled,setButtonDisabled] = useState(false);

    const tabs = ["Packages", "Description", "Parameters", "Overview of Test","FAQ"];
    const storeInfo={
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
    const handleTabId = (tabId) => {
        let numToString = tabId.toString();
        setTabId(numToString)
    }

    const onButtonClick=()=>{
        setButtonDisabled(!buttonDisabled)

    }
  return (
      <BodyComponent className='p-12 body-height '>
    <div class="d-flex flex-wrap row gy-2">
          <div className="col-12 col-lg-4">
              <label className="font-12 text-secondary">Test Code / Test Name</label>
              <p className="mb-0 font-14 font-weight-bold">PO0001 - MDX Anemia Advanced</p>
          </div>
          <div className="col-6 col-lg-4">
              <label className="font-12 text-secondary">Sub Name</label>
              <p className="mb-0 font-14 font-weight-bold">MDX Anemia Advanced</p>
          </div>
          <div className="col-6 col-lg-4">
              <label className="font-12 text-secondary">Sample Collection Type</label>
              <p className="mb-0 font-14 font-weight-bold">Home and Walk-In</p>
          </div>
          <div className="col-6 col-lg-4">
              <label className="font-12 text-secondary">MRP</label>
              <p className="mb-0 font-14 font-weight-bold"><span className='rupee'>&#x20B9;</span>6601/-</p>
          </div>
          <div className="col-6 col-lg-4">
              <label className="font-12 text-secondary">Price</label>
              <p className="mb-0 font-14 font-weight-bold"><span className='rupee'>&#x20B9;</span>6601/-</p>
          </div>
          <div className="col-12">
              <label className="font-12 text-secondary">Profile Tests</label>
              <p className="mb-0 font-14 font-weight-bold">Complete Blood Picture (CBP) , Folate - Serum</p>
          </div>
    </div>
          <div className="d-lg-flex gap-2 my-3">
              <div className="col-lg-5 col pointer" onClick={() => { setOpenLocationsModel(true) }}>
                  <div className="d-flex align-items-center p-12 border border-primary rounded h-100 ">
                      <div className="me-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11.564" height="16" viewBox="0 0 11.564 16"><g id="reset_black_icon_16px" transform="translate(-2.476 -1)"><g id="Group_34581" data-name="Group 34581" transform="translate(2.476 1)">
                              <path id="Union_130" data-name="Union 130" d="M.658,8.283a5.737,5.737,0,0,1,.909-6.62A5.626,5.626,0,0,1,5.719,0H5.88A5.613,5.613,0,0,1,10,1.662a5.738,5.738,0,0,1,.908,6.62A69.415,69.415,0,0,1,5.768,16,70.906,70.906,0,0,1,.658,8.283ZM2.32,2.38A4.693,4.693,0,0,0,1.58,7.8a60.9,60.9,0,0,0,4.191,6.457A59.581,59.581,0,0,0,9.985,7.8,4.7,4.7,0,0,0,9.244,2.38,4.507,4.507,0,0,0,5.88,1.04H5.719A4.494,4.494,0,0,0,2.32,2.38Zm.731,3.164a2.73,2.73,0,1,1,2.73,2.731A2.731,2.731,0,0,1,3.051,5.544Zm1.039,0A1.691,1.691,0,1,0,5.782,3.853,1.693,1.693,0,0,0,4.091,5.544Z" transform="translate(0)" fill="#080808"></path>
                          </g></g>
                          </svg>
                      </div>
                      <p class="mb-0 font-14 text-wrap">Also available centers near you</p>
                  </div>
              </div>
                  <button type="button" className="col-12 me-2 p-0 col-lg-3 btn-success btn-sm btn btn-primary mt-2 mt-lg-0"  disabled={buttonDisabled} onClick={onButtonClick} style={{height : "50px"}}>Book Test</button>
                  <button className="col-12 me-2 p-0 col-lg-3 btn-sm btn brand-secondary rounded mt-2 mt-lg-0" style={{height : "50px"}}>Become a Member for <span>&#x20B9;</span>50</button>
          </div>
          <NearByStores productName={"BOROLINE ANTISEPTIC CREAM 20 GM"} storeInfo={storeInfo} openlocationflag={openLocationsModel} setOpenlocationflag={setOpenLocationsModel} labFlag={true} />

          <div className='d-lg-flex col-12 mb-2'>
            <div className='col-12 col-lg-6 mb-1'>
                <label className='font-12 text-secondary'>Test Requirements</label>
                <p className='font-14 font-weight-bold mb-0'>Sample Type: fasting sodium fluoride plasma</p>
            </div>
            <div className='col-12 col-lg-6'> 
                <label className='font-12 text-secondary'>Test Precautions</label>
                <p className='mb-0 font-14'>Test is performed on a blood sample. An eight hour fast is required. No food or drink, water is OK. Do not drink alcohol for at least 24 hrs before the test.</p>
            </div>
          </div>
         
          <label class="d-block py-0 font-weight-bold custom-fieldset mb-1">Test Information</label>    
          <div className={`custom-tabs-forms mobile-compatible-tabs d-flex pb-0 card`}>
              <NavTabs tabs={tabs} onTabChange={handleTabId} />


              <TabContent activeTab={tabId}>
                  <TabPane tabId="1">
                      <div className='p-12 row g-3'>
                          {[1, 2, 3, 4, 5, 6,  4, 5, 6].map((item) => (
                            <div className='col-lg-4 col-12'>
                                <PackageTestCard key={item}/>
                            </div>

                          ))}
                      </div>
                  </TabPane>
                  <TabPane tabId="2">
                    <p>Description</p>
                  </TabPane>
                  <TabPane tabId="3">
                    <p>Parameters</p>
                  </TabPane>
                  <TabPane tabId="4">
                    <p>overview of Test</p>
                  </TabPane>
                  <TabPane tabId="5">
                    <p>FAQ</p>
                  </TabPane>
              </TabContent>

          </div>
          </BodyComponent>
  )
}

export default LabCatalogTestDetailPage