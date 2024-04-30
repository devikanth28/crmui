import React from 'react'
import DataGridHelper from '../../helpers/DataGridHelper'
import DynamicGridHeight from '../Common/DynamicGridHeight';
import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import { StackedImages } from '@medplus/react-common-components/DynamicForm';
import { Input } from 'reactstrap';

const HealthRecordGrid=()=>{
    const HealthRecordMetadata = DataGridHelper().HealthRecordList();

    const callBackMapping ={
        "renderPresImageColumn" : renderPresImageColumn,
        "renderActionColumn" : renderActionColumn,
        "openDetails" : openDetails
    }

function openDetails({ row, column }){
    return (
            <React.Fragment>
                <a className="d-block" href="javascript:void(0)" >
                    {row[column.key]}
                </a>
            </React.Fragment>
        );
      }
function renderActionColumn(props){
    return <Input type="radio" className="" />
}

function renderPresImageColumn(props){
    return(
    <div className="pointer">
        <StackedImages includeLightBox images={[{"imagePath":props.row[props.column.key], "thumbnailPath":props.row[props.column.key]}]} maxImages="4" setGridImgHeight={true}></StackedImages>
    </div> 
    )
}

    const HealthRecordData=[
        {
            "RecordName" : "Sampath Prescription",
            "RecordPrescription" : "https://static2.medplusmart.com/products/_113277b_/HUGG0194_L.jpg",
            "RecordDoctorName" : "Anurag Singh",
            "RecordDate" : "July 13,2023 14:20",
            "RecordActions" : ""
        },
        {
            "RecordName" : "Sampath Prescription",
            "RecordPrescription" : "https://static2.medplusmart.com/products/_c6290e7_/DOQT0111_L.jpg",
            "RecordDoctorName" : "Anurag Singh",
            "RecordDate" : "July 13,2023 14:20",
            "RecordActions" : ""
        },
    ]
  return (
    <React.Fragment>
        <label class="d-block pb-0 p-12 font-weight-bold">Select Health Records From List</label>
                    <div className='p-12 pb-0'>
                        <div className={`card mb-3 me-0 `}>
                            <DynamicGridHeight id="Records" metaData={HealthRecordMetadata} dataSet={[...HealthRecordData]} className="block-size-100 ">
                                <CommonDataGrid {...HealthRecordMetadata} dataSet={[...HealthRecordData]} callBackMap={callBackMapping}/>
                            </DynamicGridHeight>
                        </div>
                    </div>
    </React.Fragment>
  )
}

export default HealthRecordGrid