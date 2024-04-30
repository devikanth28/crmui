import React from 'react'
import DynamicGridHeight from '../Common/DynamicGridHeight'
import CommonDataGrid, { DeleteIcon } from '@medplus/react-common-components/DataGrid'

const LabTests=(props)=> {
    let testSummaryRows = [{ "testMrp": "Cart Total", "testPrice": "1200.00" }, { "testMrp": "Grand Total", "testPrice": "1200.00" }]

    const testMetaData = () => {
        let data = {
          "idProperty": "testDetails",
          "columns": [
            {
              "columnName": "Test Name",
              "rowDataKey": "TestName",
              "resizable": true,
            },
            {
              "columnName": "Sample Type",
              "rowDataKey": "sampleType",
              "resizable": true,
              "defaultColumnValue": "-",
            },
            {
              "columnName": "Sample Transport Condition",
              "rowDataKey": "sampleTransportCondition",
              "resizable": true,
              "defaultColumnValue": "-",
            },
            {
              "columnName": "MRP",
              "rowDataKey": "testMrp",
              "resizable": true,
              "cellClassName": "text-end",
              "columnSubtype": "AMOUNT",
              "columnType": "NUMBER",
              "bottomSummaryCellComponent" : {
                type: "FUNCTION",
                returnType: "REACT_NODE",
                name: 'renderCartTotalColumns'
            },
              "isSummaryColumnRequired": true,
            },
            {
              "columnName": "Price",
              "rowDataKey": "testPrice",
              "resizable": true,
              "cellClassName": "text-end",
              "columnSubtype": "AMOUNT",
              "columnType": "NUMBER",
              "isSummaryColumnRequired": true,
              "bottomSummaryCellComponent" : {
                type: "FUNCTION",
                returnType: "REACT_NODE",
                name: 'renderGrandTotalColumns'
            },
            },
            {
              "columnName": "Actions",
              "rowDataKey": "actions",
              "resizable": true,
              "cellClassName" : "actions-column border-end-0",
              "customRowRenderingFunction": {
                type: "FUNCTION",
                returnType: "REACT_NODE",
                name: 'renderTestActionsColumn'
            }
            },
  
          ]
        }
        return data;
  
      }
      const reviewMetaData = () => {
        let data = {
          "idProperty": "testDetails",
          "columns": [
            {
              "columnName": "Test Name",
              "rowDataKey": "TestName",
              "resizable": true,
            },
            {
              "columnName": "Sample Type",
              "rowDataKey": "sampleType",
              "resizable": true,
              "defaultColumnValue": "-",
            },
            {
              "columnName": "Sample Transport Condition",
              "rowDataKey": "sampleTransportCondition",
              "resizable": true,
              "defaultColumnValue": "-",
            },
            {
              "columnName": "MRP",
              "rowDataKey": "testMrp",
              "resizable": true,
              "cellClassName": "text-end",
              "columnSubtype": "AMOUNT",
              "columnType": "NUMBER",
              "bottomSummaryCellComponent" : {
                type: "FUNCTION",
                returnType: "REACT_NODE",
                name: 'renderCartTotalColumns'
            },
              "isSummaryColumnRequired": true,
            },
            {
              "columnName": "Price",
              "rowDataKey": "testPrice",
              "resizable": true,
              "cellClassName": "text-end",
              "columnSubtype": "AMOUNT",
              "columnType": "NUMBER",
              "isSummaryColumnRequired": true,
              "bottomSummaryCellComponent" : {
                type: "FUNCTION",
                returnType: "REACT_NODE",
                name: 'renderGrandTotalColumns'
            },
            }
  
          ]
        }
        return data;
  
      }
      const metaData = Object.freeze(testMetaData());
      const reviewmetaData = Object.freeze(reviewMetaData());

      const testDataset = [
        {
          "TestName": "MDx Fever Basic",
          "sampleType": "Blood",
          "sampleTransportCondition": "",
          "testMrp": 700,
          "testPrice": 600,
          "actions": ""
        },
        {
          "TestName": "MDx Fever Basic",
          "sampleType": "Blood",
          "sampleTransportCondition": "",
          "testMrp": 700,
          "testPrice": 600,
          "actions": ""
        },
        {
          "TestName": "MDx Fever Basic",
          "sampleType": "Blood",
          "sampleTransportCondition": "",
          "testMrp": 700,
          "testPrice": 600,
          "actions": ""
        },
      ]

      const callBackMapping = {
        'renderTestActionsColumn' : renderTestActionsColumn,
        'renderCartTotalColumns' : renderCartTotalColumns,
        'renderGrandTotalColumns':renderGrandTotalColumns
      }
      function renderTestActionsColumn(props){
        return <React.Fragment>
          <DeleteIcon></DeleteIcon>
        </React.Fragment>
      
      }
      function renderCartTotalColumns(props){
        return <React.Fragment>
          <p className='text-end font-weight-bold'>{props.row[props.column.key]}</p>
        </React.Fragment>
      
      }
      function renderGrandTotalColumns(props){
        return <React.Fragment>
          <p className='text-end font-weight-bold'><span className='rupee'>&#x20B9;</span>{props.row[props.column.key]}</p>
        </React.Fragment>
      
      }
  
  return (
    <React.Fragment>
        <label class="d-block pb-0 font-weight-bold custom-fieldset mb-2">
                  Test Details
                </label>
                <div className='pb-0'>
                  <div className={` card me-0 `}>
                    <DynamicGridHeight id="tests" metaData={props.review ? reviewmetaData : metaData} dataSet={[...testDataset]}>
                      <CommonDataGrid {...props.review ? reviewmetaData : metaData} dataSet={[...testDataset]} bottomSummaryRows={testSummaryRows} callBackMap={callBackMapping} />
                    </DynamicGridHeight>
                  </div>
                </div>
    </React.Fragment>
  )
}

export default LabTests