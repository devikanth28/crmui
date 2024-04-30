import React, { useContext, useEffect, useState } from 'react';
import PrescriptionService from '../../services/Prescription/PrescriptionService';
import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import Validate from '../../helpers/Validate';
import NoDataFound from '../Common/NoDataFound';
import DynamicGridHeight from '../Common/DynamicGridHeight';

const DecodedInformation = ({ healthRecordInfo, customerExists, recordId, setProdutsCount, setCheckedProducts, setAlertContent, checkedProducts }) => {
    const [dataSet, setDataSet] = useState();
    const [tableData, setTableData] = useState();
    const validate = Validate();
    const [checkedCheck, setCheckedCheck] = useState(healthRecordInfo.prescriptionStatus == "Partially Decoded" || healthRecordInfo.prescriptionStatus == "Decoded")

    useEffect(() => {
        getDecodedInfo(recordId);
        setCheckedProducts(checkedProducts);
    }, [recordId])

    const getDecodedInfo = async (recordId) => {
        await PrescriptionService().getDecodedInformation({ "recordId": recordId }).then(data => {
            if (data && data.statusCode == "SUCCESS") {
                setDataSet(data.dataObject.dataSet);
                setTableData(data.dataObject.dataGrid);
                if (healthRecordInfo.prescriptionStatus == "Partially Decoded" || healthRecordInfo.prescriptionStatus == "Decoded")
                    setCheckedProducts(data.dataObject.dataSet);
                setProdutsCount(data.dataObject.dataSet.length);
            }
        }).catch((err) => {
            setAlertContent({ alertMessage: "Error while fetching data" });
            console.log(err)
        });
    }

    function handleCheckBoxColumn(props) {
        const { row } = props;
        let productIds = [...checkedProducts];
        const handleOnCheckBoxChange = (event) => {
            if (event.target.checked == true) {
                productIds.push(row);
            }
            else {
                setCheckedCheck(false);
                productIds = productIds.filter(item => { return item.productId !== row.productId });
            }
            setCheckedProducts(productIds);
        }
        return <React.Fragment>
            {/* <input type={'checkbox'} disabled={!prescriptionIsClaimed && !(type == "h" && recordType == "Prescription")} checked={checkedProducts.some(objProductIdList => objProductIdList.productId === row.productId)} onChange={(event) => { handleOnCheckBoxChange(event) }} /> */}
            {customerExists && <input type={'checkbox'} checked={checkedCheck || checkedProducts.some(objProductIdList => objProductIdList.productId === row.productId)} onChange={(event) => { handleOnCheckBoxChange(event) }} />}
        </React.Fragment>
    }

    function handleCheckBoxHeaderFunction() {
        let productIds = [];
        const handleOnCheckAndUncheck = (event) => {
            if (event.target.checked == true) {
                productIds = dataSet;
            }
            else {
                setCheckedCheck(false);
                productIds = [];
            }
            setCheckedProducts(productIds);
        }
        return <React.Fragment>
            {/* <input type={'checkbox'} disabled={!prescriptionIsClaimed && !(type == "h" && recordType == "Prescription")} checked={dataSet.length == checkedProducts.length} onChange={(event) => { handleOnCheckAndUncheck(event) }} /> */}
            {customerExists && <input type={'checkbox'} checked={checkedCheck || dataSet.length == checkedProducts.length} onChange={(event) => { handleOnCheckAndUncheck(event) }} />}
        </React.Fragment>
    }

    function quantityColumn(props) {
        const { row } = props;
        return <React.Fragment>
            {row.quantity} Units/pack
        </React.Fragment>
    }

    function statusColumn(props) {
        const { row } = props;
        return <React.Fragment>
            <button className={`badge border-0 rounded-pill badge-${row.status ? 'approved' : 'rejected'}`}>{row.status ? 'In Stock' : 'Out of Stock'}</button>
        </React.Fragment>
    }

    const callBackMapping = {
        'checkBox': handleCheckBoxColumn,
        'checkBoxHeader': handleCheckBoxHeaderFunction,
        'quantity': quantityColumn,
    }

    return (
        <React.Fragment>
            {tableData ?
                <div className='h-100'>
                    {validate.isNotEmpty(dataSet) ?
                        <div className='h-100'>
                            <CommonDataGrid
                            {...tableData}
                            dataSet={dataSet}
                            callBackMap={callBackMapping}/>
                        </div> 
                    : <NoDataFound text="No Product found for this Prescription!" />}
                </div> : null}
        </React.Fragment>
    )
}
export default DecodedInformation;