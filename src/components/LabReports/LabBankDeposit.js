import DynamicForm, { withFormHoc, CustomSpinners } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Validate from '../../helpers/Validate';
import { API_URL } from '../../services/ServiceConstants';
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure';
import CommonDataGrid ,{DeleteIcon} from '@medplus/react-common-components/DataGrid';
import { AlertContext,  UserContext } from "../Contexts/UserContext";
import OrderService from '../../services/Order/OrderService';
import DynamicGridHeight from '../Common/DynamicGridHeight';
import dateFormat from 'dateformat';
import CurrencyFormatter from '../Common/CurrencyFormatter';

const bankDepositDataGrid = {
  "idProperty": "labBankDepositId",
  "columns": [
      {
          "columnName": "Sale Date",
          "rowDataKey": "saleDate" ,
          "columnType": "DATE",
          "dateFormatStr": "NORMAL_DATE_WITH_24_TIME"
      },
      {
          "columnName": "Bank Name",
          "rowDataKey": "bankName" ,
          "isSummaryColumnRequired": true
      },
      {
          "columnName": "Amount",
          "rowDataKey": "amount",
          "columnType":	"NUMBER",
          "columnSubtype":"AMOUNT",
          "isSummaryColumnRequired": true,
          "bottomSummaryCellComponent" : {
            type: "FUNCTION",
            returnType: "REACT_NODE",
            name: 'renderTotalAmountColumn'
        } 
      },
      {
          "columnName": "Action",
          "rowDataKey": "action",
          "cellClassName":'border-end-0',
          "customRowRenderingFunction": { name: "renderClearActionColumn", returnType: "REACT_NODE", type: "FUNCTION" }
      }

    ]
}

const LabBankDeposit = (props) => {
  const {helpers}=props;
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const { setAlertContent , setStackedToastContent } = useContext(AlertContext);
  const validate = Validate();
  const [dataSet, setDataSet] = useState([]);
  const [datagrid, setDataGrid] = useState(bankDepositDataGrid);
  const [totalRowsCount, setTotalRowsCount] = useState(undefined);
  const userSessionInfo = useContext(UserContext);
  const [loading,setLoading] = useState(false);
  let amountSummary = [{"bankName" : "TotalAmount", "amount" : 0.0}]

  const handleOnRadioChange = (payload) => { 
    setDataSet([]);
    setTotalRowsCount(0);
    const store = helpers.collectSpecificFieldValues('labBankDepositForm','collectionCenters');
    if(validate.isEmpty(store) || validate.isEmpty(store.collectionCenters)){
      helpers.hideElement("group2");
      helpers.hideElement("group3");
      setAlertContent({ alertMessage: "Please Select Collection Center"})
    } 
    helpers.enableElement("bankDepositDate");
    helpers.updateValue("","banksDropDown");
    helpers.clearErrorMessageForField("banksDropDown");
    helpers.updateValue("","amount");
    helpers.clearErrorMessageForField("amount");
    helpers.updateValue("","bankDepositDate");
    helpers.clearErrorMessageForField("bankDepositDate");
  }

  const validateLabBankDepositSearchCriteria = (bankDepositSearchCriteria) => {
    if(validate.isNotEmpty(bankDepositSearchCriteria)){
      const { banksDropDown , bankDepositDate , ...others} = bankDepositSearchCriteria;
      let record = dataSet.find(obj => obj.bankName == banksDropDown[0].split(":")[1] && obj.saleDate == bankDepositDate);
      if(validate.isNotEmpty(record)){
        setAlertContent({ alertMessage: "Already data exists for same bank with same date"});
        return false;
      }
      return true;
    }
    return false;
  }

  const createDataSet = (bankDepositSearchCriteria) => {
    if(validate.isNotEmpty(bankDepositSearchCriteria)){
        let { banksDropDown , amount, bankDepositDate , NoOfDays, collectionCenters, ...other} = bankDepositSearchCriteria;
        let serialNo  = dataSet.length + 1; 
        let temporaryDataSet = [...dataSet];
        temporaryDataSet.push({ "sNo" : serialNo , "saleDate" : bankDepositDate , "bankName" : banksDropDown[0].split(":")[1] , "bankId" : banksDropDown[0].split(":")[0], "amount" : amount });
        setDataSet(temporaryDataSet);
        setTotalRowsCount(dataSet.length);
        if(NoOfDays == "SingleDayAmount" && temporaryDataSet.length > 0){
          helpers.updateSpecificValues({"banksDropDown" : "" , "amount" : ""},"labBankDepositForm");
          helpers.disableElement("bankDepositDate");
        }
        else{
          helpers.updateSpecificValues({"banksDropDown" : "" , "amount" : "", "bankDepositDate" : ""},"labBankDepositForm");
          helpers.enableElement("bankDepositDate");

        }
    }
  }

  const createBankDeposit = () => {
    const bankDepositSearchCriteria = helpers.validateAndCollectValuesForSubmit('labBankDepositForm');
    if(validateLabBankDepositSearchCriteria(bankDepositSearchCriteria)){
        createDataSet(bankDepositSearchCriteria)
    }
  }

  const depositAmountForEnteredData = () => {
    const store = helpers.collectSpecificFieldValues('labBankDepositForm','collectionCenters');
    if(validate.isNotEmpty(store) && validate.isNotEmpty(store.collectionCenters)){
      setLoading(true);
      let finalObj = {
      storeId: store.collectionCenters[0],
      createdBy: userSessionInfo.userDetails.userId || "", 
      dateCreated: new Date(),
      bankDepositDetails: dataSet.map(entry => {
        return {
          depositedDate: entry.saleDate,
          bankName: entry.bankName,
          amount: entry.amount,
          bankId: entry.bankId
        };
      })
    };
    let obj = { bankDepositsInfoStr : encodeURIComponent(JSON.stringify(finalObj))};
    OrderService().createBankDeposit(obj)
    .then((data) => {
      if(data && data.statusCode== "SUCCESS"){
        setDataSet([]);
        setStackedToastContent({toastMessage:"Bank Details updated Successfully"});
      }
      else if(data && data.dataObject && data.dataObject.message){
        setStackedToastContent({toastMessage: data.dataObject.message});
      }
      setLoading(false);
    }).catch((error) => {
      console.log("Error Occured: ",error);
      setStackedToastContent({toastMessage: "Something went wrong, updation failed"});
      setLoading(false);
    });
    helpers.enableElement("bankDepositDate");
    helpers.updateSpecificValues({"bankDepositDate": ""},"labBankDepositForm");
  }
  else{
    setAlertContent({ alertMessage: "Please Select Collection Center"});
  }
  }

  const handleOnClear = () => {
    setDataSet([]);
    setTotalRowsCount(0);
    helpers.resetForm('labBankDepositForm');
    helpers.hideElement("group2");
    helpers.hideElement("group3");
    helpers.updateSpecificValues({"NoOfDays" : "SingleDayAmount"},'labBankDepositForm');
  }

  const setCollectionCenters =(event) =>{
    if(validate.isNotEmpty(event[0].target.value)) {
      helpers.showElement("group2");
      helpers.showElement("group3");
    } 
  }

  const clearActionColumn = (props) => {
    const {row} = props;
    function handleOnClearRow (sNo) {
      let temporaryDataSet = [...dataSet];
      temporaryDataSet.splice(sNo - 1, 1);
      if(validate.isNotEmpty(temporaryDataSet)){
        temporaryDataSet.forEach((obj, index) => {
        obj.sNo = index + 1
        })
      }
      setDataSet([...temporaryDataSet]);
      setTotalRowsCount(dataSet.length);
      if(validate.isEmpty(temporaryDataSet)){
        helpers.enableElement("bankDepositDate");
        helpers.updateSpecificValues({"bankDepositDate": ""},"labBankDepositForm");
      }
    }
    return (
    <React.Fragment>
      <DeleteIcon handleOnClick={(e) => { handleOnClearRow(row.sNo)}}/>
    </React.Fragment>
    )
  }

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    for (const row of dataSet) {
    totalAmount = (parseFloat(totalAmount) +  parseFloat(row.amount)).toFixed(2);
    }
    return(
      <React.Fragment>
         <div className='text-end'>
          <CurrencyFormatter data={totalAmount} decimalPlaces={2} />

          </div>
      </React.Fragment>
    )
  }

  const observersMap = {
    'NoOfDays': [['click', handleOnRadioChange]],
    'collectionCenters':[['change',setCollectionCenters],['select',setCollectionCenters]],
    'add':[['click',createBankDeposit]]
  }

  const callBackMapping ={
    "renderClearActionColumn" : clearActionColumn,
    "renderTotalAmountColumn" : calculateTotalAmount
  }

  return (
    <React.Fragment>
      <Wrapper>
          <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
            <p className="mb-0">Lab Bank Deposit</p>
          </HeaderComponent>
          <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height">
            {loading &&  <CustomSpinners spinnerText={"updating Bank Details"} outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand"/>}
             {!loading && <><DynamicForm requestUrl={`${API_URL}labsBankDepositForm`} requestMethod={'GET'} helpers={helpers} observers={observersMap} />
                {validate.isNotEmpty(dataSet)  &&
                  <div className='card'>
                     <div className='card-body p-0 block-size-100'>
                <DynamicGridHeight dataSet={dataSet} metaData={datagrid} bottomSummaryRows={amountSummary}>
                  <CommonDataGrid key={JSON.stringify(dataSet)} {...datagrid} dataSet={dataSet} callBackMap={callBackMapping} bottomSummaryRows={amountSummary} totalRowsCount={totalRowsCount} />
                </DynamicGridHeight>
                     </div>
                  </div>
                }</>}
          </BodyComponent>
         {!loading && <FooterComponent ref={footerRef}  className="footer px-3 py-2">
              <div className="d-flex justify-content-start flex-row-reverse">
                <button type="button" class="px-4 btn-brand ms-2 btn" onClick={()=>{depositAmountForEnteredData()}}  disabled={dataSet.length == 0} >Submit</button>
                <button type="button" class="px-4 brand-secondary btn" onClick={()=>{handleOnClear()}}>Clear</button>
              </div>
          </FooterComponent> }
      </Wrapper>

    </React.Fragment>
  )
}

export default withFormHoc(LabBankDeposit);