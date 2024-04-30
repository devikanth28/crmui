import React from 'react'
import DynamicGridHeight from '../Common/DynamicGridHeight'
import CommonDataGrid, { AddIcon, AddIconButton } from '@medplus/react-common-components/DataGrid'
import DataGridHelper from '../../helpers/DataGridHelper'

const CartComplimentaryGrid=()=> {
  const complemetarymetaData=DataGridHelper().complimetaryProducts();

  const callBackMapping = {
    'renderActionColumn' : renderActionColumn,
    'openProductDetails' : openProductDetails
  }
  function openProductDetails({ row, column }){
    return (
        <React.Fragment>
            <a className="d-block" href="javascript:void(0)" >
                {row[column.key]}
            </a>
        </React.Fragment>
    );
  }
  const complimetaryProductDetails=[
    {
    "ComplimentaryName": "Dolo",
    "ComplimentaryPacksize" : "10 Units/Pack",
    "ComplimentaryRequiredQty" : 1,
    "ComplimentaryQty" : 1,
    "ComplimentaryMrp" : 0.00,
    "ComplimentaryAmount" : 0.00,
    "ComplimentaryDiscountPrice" : 0.00,
    "ComplimentaryActions" :""

  },
  {
    "ComplimentaryName": "Dolo",
    "ComplimentaryPacksize" : "10 Units/Pack",
    "ComplimentaryRequiredQty" : 1,
    "ComplimentaryQty" : 1,
    "ComplimentaryMrp" : 0,
    "ComplimentaryAmount" : 0,
    "ComplimentaryDiscountPrice" : 0,
    "ComplimentaryActions" :""
  },

  ]

  function renderActionColumn(props){
    return <React.Fragment>
        <AddIcon handleOnClick={(e) => {console.log("Add Product") }} className="btn-add-success"></AddIcon>
    </React.Fragment>
  }

  return (
    <React.Fragment>
      <label class="d-block pb-0 p-12 font-weight-bold custom-fieldset">Complementary Products for you With 45.82% Discount</label>
      <div className='p-12 pb-0'>
        <div className={`card mb-3 me-0 `}>
          <DynamicGridHeight id="Products" metaData={complemetarymetaData} dataSet={[...complimetaryProductDetails]} className="block-size-100">
            <CommonDataGrid {...complemetarymetaData} dataSet={[...complimetaryProductDetails]} callBackMap={callBackMapping}/>
          </DynamicGridHeight>
        </div>
      </div>
    </React.Fragment>

  )
}

export default CartComplimentaryGrid