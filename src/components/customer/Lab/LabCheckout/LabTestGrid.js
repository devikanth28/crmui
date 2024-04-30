import React, { useState } from "react";
import CommonDataGrid, { CustomPopOver, DeleteIcon } from '@medplus/react-common-components/DataGrid';
import DynamicGridHeight from "../../../Common/DynamicGridHeight";
import LabCartActionButton from '../LabCatalog/LabCartActionButton';
import { testDetailReviewGridMetaData, testDetailsGridMetaData } from "./MetaData";
import { GenderRestrictTypeIcon, ProfileIcon } from "@medplus/react-common-components/DataGrid"


const LabTestGrid = (props) => {
    const [closePopOver, setClosePopOver] = useState(false);

    const testDataset = props.testDataset;
    const testSummaryRows = props.testSummaryRows;

    const helper = () => {
        const testMetaData = () => {
            return testDetailsGridMetaData(props.showTypeColumn);
        }
        const reviewTestMetaData = () => {
            return testDetailReviewGridMetaData;
        }
        return Object.freeze({
            testMetaData,
            reviewTestMetaData
        })
    }

    const testMetaData = helper().testMetaData();
    const reviewMetaData = helper().reviewTestMetaData();

    const callBackMapping = {
        'renderTypeColumn':renderTypeColumn,
        'renderTestActionsColumn': renderTestActionsColumn,
        'renderCartTotalColumns': renderCartTotalColumns,
        'renderGrandTotalColumns': renderGrandTotalColumns,
        'renderInfo':renderTestInfo
    }

    function renderTestInfo(rowProps) {
        return <React.Fragment>
            <div title="Click to Test Info" id={rowProps.row.testCode} className= {rowProps?.row?.duplicateItem ? "d-flex align-items-center justify-content-between pointer row-edited-error" : "d-flex align-items-center justify-content-between pointer"}>
                <p className="text-truncate mb-0">{rowProps.row.testName}</p>
                {rowProps?.row?.duplicateItem && <>
                    <svg xmlns="http://www.w3.org/2000/svg" id="note_black_icon_18px" width="16" height="16" viewBox="-1 0 20 18">
                        <path id="Icon_awesome-info-circle" data-name="Icon awesome-info-circle" d="M9.563.563a9,9,0,1,0,9,9A9,9,0,0,0,9.563.563Zm0,3.992A1.524,1.524,0,1,1,8.038,6.079,1.524,1.524,0,0,1,9.563,4.554Zm2.032,9.218a.436.436,0,0,1-.435.435H7.966a.436.436,0,0,1-.435-.435V12.9a.436.436,0,0,1,.435-.435H8.4V10.143H7.966a.436.436,0,0,1-.435-.435V8.837A.436.436,0,0,1,7.966,8.4h2.323a.436.436,0,0,1,.435.435v3.629h.435a.436.436,0,0,1,.435.435Z" transform="translate(-0.563 -0.563)" style={{ "fill": "#fff", "stroke": "#6c757d" }} />
                    </svg>
                    <CustomPopOver target={rowProps.row.testCode} value={"This test is already a part of a package/s in this cart. Kindly remove to proceed."} closePopOver={closePopOver} setClosePopOver={setClosePopOver} headerText={"Test Details"} />
                </>
                }
            </div>
        </React.Fragment>
    }

    function renderTypeColumn(rowProps) {
        return(
            <div className="align-items-center d-flex justify-content-center">
                {rowProps?.row?.genderRestricted && <GenderRestrictTypeIcon id={rowProps.row.testCode} />}
                {rowProps?.row?.profile && <ProfileIcon id={rowProps.row.testCode}/>}
            </div>
        )
    }

    function renderTestActionsColumn(rowProps) {
        return <React.Fragment>
            <LabCartActionButton testCode={rowProps.row.testCode} isaddedToCart={true} handleCallback={(response) => { props.setTestDataSet(response?.responseData?.shoppingCart?.shoppingCartItems); props.getCustomerLabShoppingCart(); }} removeBtn={<DeleteIcon tooltip="Remove test" />} addToCartLoading={props.addToCartLoading} setAddToCartLoading={props.setAddToCartLoading} history={props.history} />
        </React.Fragment>
    }

    function renderCartTotalColumns(props) {
        return <React.Fragment>
            <p className='text-end font-weight-bold'>{props.row[props.column.key]}</p>
        </React.Fragment>

    }

    function renderGrandTotalColumns(props) {
        return <React.Fragment>
            <p className='text-end font-weight-bold'>{props.row[props.column.key]}</p>
        </React.Fragment>

    }

    return (
        <div id="TestDetails" className="scrolling-tabs p-12">
            <label class="d-block pb-0 font-weight-bold custom-fieldset mb-2">
                Test Details
            </label>
            <div className='pb-0'>
                {!props.isReviewPage ? <div className={` card me-0 `}>
                    <DynamicGridHeight id="tests" metaData={testMetaData} dataSet={[...testDataset]} bottomSummaryRows={testSummaryRows}>
                        <CommonDataGrid {...testMetaData} dataSet={[...testDataset]} bottomSummaryRows={testSummaryRows} callBackMap={callBackMapping} />
                    </DynamicGridHeight>
                </div> :
                    <div className={` card me-0 `}>
                        <DynamicGridHeight id="tests" metaData={reviewMetaData} dataSet={[...testDataset]} bottomSummaryRows={testSummaryRows}>
                            <CommonDataGrid {...reviewMetaData} dataSet={[...testDataset]} bottomSummaryRows={testSummaryRows} callBackMap={callBackMapping} />
                        </DynamicGridHeight>
                    </div>
                }
            </div>
        </div>
    )
}

export default LabTestGrid;