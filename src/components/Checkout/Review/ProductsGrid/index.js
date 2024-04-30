import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import DataGridHelper from "../../../../helpers/DataGridHelper";
import CurrencyFormatter from "../../../Common/CurrencyFormatter";
import DynamicGridHeight from "../../../Common/DynamicGridHeight";
import { ComplimentaryIcon, PrescriptionRequiredIcon } from "../../../../helpers/TypeIcons";

export default (props) => {

	const productsMetaData = DataGridHelper().ReviewProductList();

	const cartSummaryDisplayDataset = [{
		'mrp' : <div className="font-weight-bold">Cart Total</div>,
		'amount' : <div className="text-end font-weight-bold"><CurrencyFormatter data={props.orderTotal} decimalPlaces={2}/></div>
	},
	{
		'mrp' : <div className="font-weight-bold">Discount Amount</div>,
		'amount' : <div className="text-end font-weight-bold"><CurrencyFormatter data={props.discountTotal} decimalPlaces={2}/></div>
	},
	{
		'mrp' : <div className="font-weight-bold">Medplus PayBack Points to be Credited</div>,
		'amount' : <div className="text-end font-weight-bold"><CurrencyFormatter data={props?.totalPBPoints ? props.totalPBPoints : 0} decimalPlaces={2}/></div>
	},
	{
		'mrp' : <div className="font-weight-bold">Delivery Charges {props?.isCouponApplied && <>(Coupon Applied)</>}</div>,
		'amount' : props.omsOrder.orderSerivceCharge?.[0].serviceCharge > 0 ?
			<>{props?.isCouponApplied ?
				<div className="text-end font-weight-bold"><del><CurrencyFormatter data={props.omsOrder.orderSerivceCharge[0].serviceCharge} decimalPlaces={2} /></del><>{props.omsOrder.totalServiceCharges > 0 ? <CurrencyFormatter data={props.omsOrder.totalServiceCharges} decimalPlaces={2} /> : 'FREE'}</></div>
				:
				<div className="text-end font-weight-bold"><CurrencyFormatter data={props.omsOrder.orderSerivceCharge[0].serviceCharge} decimalPlaces={2} /></div>

			}
			</> :
			<>FREE</>
	},
	{
		'mrp' : <div className="font-weight-bold">Order Total</div>,
		'amount' : <div className="text-end font-weight-bold"><CurrencyFormatter data={props.orderAmount} decimalPlaces={2}/></div>
	}];

	const renderTypeColumn = (props) => {
        if (props.row.isPrescriptionRequired) {
            return <PrescriptionRequiredIcon id={props.row.productId} />
        }
        else if(props?.row?.complimentaryType && "ADDED" == props.row.complimentaryType){
             return <ComplimentaryIcon id={props.row.productId} />
         }
        else {
            return <div className=''>-</div>
        }
    }

	const callBackMapping={
        'renderTypeColumn' : renderTypeColumn,
    }

	return <>
		<label class="d-block pb-0 p-12 font-weight-bold custom-fieldset">
			Products In Cart
			{!(props?.noOfOrders==1 && props.orderSno==1) && <span className="text-warning ms-1"> - Order {props.orderSno}</span>}
		</label>
		<div className="p-12 py-0 font-12"><span className="text-secondary">{props.deliveryTime}</span></div>
		<div className="p-12 pb-0">
			<div className={`card me-0 `}>
				<DynamicGridHeight id={`reviewProducts + ${props.orderSno}`} metaData={productsMetaData} dataSet={props.dataSet} className="block-size-100">
					<CommonDataGrid {...productsMetaData} dataSet={props.dataSet} bottomSummaryRows={cartSummaryDisplayDataset} callBackMap={callBackMapping}/>
				</DynamicGridHeight>
			</div>
		</div>
	</>
};