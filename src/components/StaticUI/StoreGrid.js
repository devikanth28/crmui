import React from 'react'
import DataGridHelper from '../../helpers/DataGridHelper'
import DynamicGridHeight from '../Common/DynamicGridHeight';
import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import { Input } from 'reactstrap';

const StoreGrid=(props)=> {
    const storesMetadata = DataGridHelper().StoreList();

    const callBackMapping={
        "renderActionColumn" : renderActionColumn
    }

    function renderActionColumn(props){
        return <Input type="radio" className="" />

    }

    const StoresData=[
        {
            "StoreName" : "Madhapur Mart Medplus",
            "StoreAddress" : "No. 6-1-107/1 To 20, S2, Sri Rama Jaya Chandra Enclave, Padmarao Nagar, Secudera-500 025",
            "StoreNumber" : "7680932909",
            "StoreActions" : ""
        },
        {
            "StoreName" : "Madhapur Mart Medplus",
            "StoreAddress" : "No. 6-1-107/1 To 20, S2, Sri Rama Jaya Chandra Enclave, Padmarao Nagar, Secudera-500 025",
            "StoreNumber" : "7680932909",
            "StoreActions" : ""
        },
    ]
  return (
    <React.Fragment>
        <label class="d-block  p-12 font-weight-bold pb-0">Select Stores From List</label>
                    <div className='p-12 pb-0'>
                        <div className={`card mb-3 me-0`}>
                            <DynamicGridHeight id="stores" metaData={storesMetadata} dataSet={[...StoresData]} className="block-size-100">
                                <CommonDataGrid {...storesMetadata} dataSet={[...StoresData]} callBackMap={callBackMapping}/>
                            </DynamicGridHeight>
                        </div>
                    </div>
    </React.Fragment>
  )
}

export default StoreGrid