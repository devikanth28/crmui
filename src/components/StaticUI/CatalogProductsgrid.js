import React from 'react'
import DataGridHelper from '../../helpers/DataGridHelper'
import OrderHelper from '../../helpers/OrderHelper';
import DynamicGridHeight from "../Common/DynamicGridHeight";
import CommonDataGrid, { DeleteIcon } from "@medplus/react-common-components/DataGrid";

const CatalogProductsgrid=(props)=> {
  const cardProducts=DataGridHelper().productsInCart();
  let ProductsInCartSummaryRows=[{"productCartunits":"Cart Total","productCartMRP": "00.00"},{"productCartunits":"Discount Amount","productCartMRP":"00.00"},{"productCartunits":"Medplus Payback Points to br Credited","productCartMRP":"00.00"},{"productCartunits":"Grand Total","productCartMRP":"00.00"}]

const callBackMapping = {
  'renderTypeColumn' : renderTypeColumn,
  'renderActionColumn' : renderActionColumn,
  'renderProductCartAmountSummaryColumns': renderProductCartAmountSummaryColumns,
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

function renderProductCartAmountSummaryColumns(props){
  return <React.Fragment>
                <div className="text-end">
                    <span className="rupee">&#x20B9;</span>{props.row[props.column.key]}
                </div>
            </React.Fragment>

}


function renderActionColumn(props){
  return <React.Fragment>
    <DeleteIcon handleOnClick={(e) => {console.log("Delete Product") }}></DeleteIcon>
  </React.Fragment>
}

function renderTypeColumn(props){
        if(props.row.productType){
          return(
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g id="prescription-required-icn-24" transform="translate(-396 -484)">
              <circle id="Ellipse_1194" data-name="Ellipse 1194" cx="12" cy="12" r="12" transform="translate(396 484)" fill="#a7ccf8"/>
              <g id="prescription-icn-32" transform="translate(4937 -19938)">
                <rect id="Rectangle_12079" data-name="Rectangle 12079" width="16" height="16" rx="4" transform="translate(-4537 20426)" fill="none"/>
                <path id="Subtraction_65" data-name="Subtraction 65" d="M7.166,12a.712.712,0,0,1-.481-.191L5.14,10.345,3.591,11.809A.7.7,0,0,1,3.109,12a.712.712,0,0,1-.481-.191.618.618,0,0,1-.2-.454.628.628,0,0,1,.2-.454L4.184,9.443l-2.83-2.67V9.825a.624.624,0,0,1-.2.454.7.7,0,0,1-.481.186H.664A.7.7,0,0,1,.2,10.279.623.623,0,0,1,0,9.825V.638A.619.619,0,0,1,.2.186.69.69,0,0,1,.675,0H3.109a3.162,3.162,0,0,1,2.7,1.469,2.81,2.81,0,0,1,0,2.934,3.162,3.162,0,0,1-2.7,1.469h-.8l2.83,2.67L6.684,7.073a.7.7,0,0,1,.481-.186.68.68,0,0,1,.179.022.658.658,0,0,1,.481.454.618.618,0,0,1-.175.618L6.094,9.443,7.651,10.9a.637.637,0,0,1,.2.454.618.618,0,0,1-.2.454A.7.7,0,0,1,7.166,12ZM1.355,1.278h0V4.593H3.109a1.776,1.776,0,0,0,1.521-.831,1.572,1.572,0,0,0,0-1.655,1.778,1.778,0,0,0-1.521-.828Z" transform="translate(-4533 20428)" fill="#080808"/>
              </g>
              </g>
          </svg>)
            
          }
          else{
            return <div className=''>-</div>
          }

}



  const productDetails=[
    {
      "productType" : false,
      "productCartName" : "RABESEC DSR CAP" ,
      "productCartStatus" : "pending",
      "productCartOffersApplied" : "20% Off On 2 Packs",
      "productCartPackSize" : "10 Units/Pack",
      "productCartDeliveryTime" : "2 Qty Within Delivery By Jan 23,2024",
      "productCartQuantity" : 1,
      "productCartunits" : 1,
      "productCartMRP" : 161.05,
      "productCartActions" : ""
    },
    {
      "productType" : true,
      "productCartName" : "RABESEC DSR CAP" ,
      "productCartStatus" : "pending",
      "productCartOffersApplied" : "20% Off On 2 Packs",
      "productCartPackSize" : "10 Units/Pack",
      "productCartDeliveryTime" : "2 Qty Within Delivery By Jan 23,2024",
      "productCartQuantity" : 1,
      "productCartunits" : 1,
      "productCartMRP" : 161.05,
      "productCartActions" : ""
    },
    {
      "productType" : true,
      "productCartName" : "RABESEC DSR CAP" ,
      "productCartStatus" : "pending",
      "productCartOffersApplied" : "20% Off On 2 Packs",
      "productCartPackSize" : "10 Units/Pack",
      "productCartDeliveryTime" : "2 Qty Within Delivery By Jan 23,2024",
      "productCartQuantity" : 1,
      "productCartunits" : 1,
      "productCartMRP" : 161.05,
      "productCartActions" : ""
    },
    {
      "productType" : true,
      "productCartName" : "RABESEC DSR CAP" ,
      "productCartStatus" : "pending",
      "productCartOffersApplied" : "20% Off On 2 Packs",
      "productCartPackSize" : "10 Units/Pack",
      "productCartDeliveryTime" : "2 Qty Within Delivery By Jan 23,2024",
      "productCartQuantity" : 1,
      "productCartunits" : 1,
      "productCartMRP" : 161.05,
      "productCartActions" : ""
    },
    {
      "productType" : true,
      "productCartName" : "RABESEC DSR CAP" ,
      "productCartStatus" : "pending",
      "productCartOffersApplied" : "20% Off On 2 Packs",
      "productCartPackSize" : "10 Units/Pack",
      "productCartDeliveryTime" : "2 Qty Within Delivery By Jan 23,2024",
      "productCartQuantity" : 1,
      "productCartunits" : 1,
      "productCartMRP" : 161.05,
      "productCartActions" : ""
    },


  ]
  return (
    <React.Fragment>
        <label class="d-block pb-0 p-12 font-weight-bold custom-fieldset">Products In Cart</label>
                    <div className='p-12 pb-0'>
                        <div className={`card mb-3 me-0 `}>
                            <DynamicGridHeight id="products" metaData={cardProducts} dataSet={[...productDetails]} className="block-size-100" extraRows={4}>
                                <CommonDataGrid {...cardProducts} dataSet={[...productDetails]} callBackMap={callBackMapping} bottomSummaryRows={ProductsInCartSummaryRows}/>
                            </DynamicGridHeight>
                        </div>
                    </div>
    </React.Fragment>
  )
}

export default CatalogProductsgrid