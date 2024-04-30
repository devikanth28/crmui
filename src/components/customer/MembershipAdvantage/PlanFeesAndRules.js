import React, { useState } from 'react'
import DynamicGridHeight from '../../Common/DynamicGridHeight';
import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import { Collapse } from "reactstrap";
import Validate from '../../../helpers/Validate';
import { toCamelCase } from '../../../helpers/CommonHelper';
const PlanFeesAndRules = ({ feesDataset, rulesDataset, rulesDataGrid, feesDataGrid }) => {
    const [isCollapse, setCollpased] = useState(false);
    const validate = Validate();

     const feesCallBackMapping = {
         'renderFeesNameColumn': renderFeesNameColumn,
         'renderAgeRulesColumn': renderAgeRulesColumn,
     }

    const rulesCallBackMapping ={
        'renderRulesNameColumn':renderRulesNameColumn,
        'renderValueColumn':renderValueColumn
    }

    function renderAgeRulesColumn(props) {
        if (validate.isNotEmpty(props.row.ageRule) && validate.isNotEmpty(props.row.ageRule.name)) {
            return <React.Fragment>
                {props.row.ageRule.name}
            </React.Fragment>
        }
        return <>-</>
    }


    function renderFeesNameColumn(props) {
        if (validate.isNotEmpty(props.row.type) && validate.isNotEmpty(props.row.type.name)) {
            return <React.Fragment>
                {props.row.type.name}
            </React.Fragment>
        }
        return <>-</>
    }

    function renderRulesNameColumn(props) {
        if (validate.isNotEmpty(props.row.name)) {
            return <React.Fragment>
                {toCamelCase(props.row.name).split("_").join(" ")}
            </React.Fragment>
        }
        return <>-</>
    }

    function renderValueColumn(props) {
        if (validate.isNotEmpty(props.row.value)) {
            return <React.Fragment>
                {props.row.value}
            </React.Fragment>
        }
        return <>-</>
    }

    return (
        <div className='card mt-3'>
            <div className='d-flex justify-content-between p-12 border-bottom pointer' onClick={() => { setCollpased(!isCollapse) }}>
                <p class="fw-medium mb-0">Fees & Rules</p>

                <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={`collapse-arrow ${isCollapse ? 'rotate-bottom' : 'rotate-up-half'}`}>
                    <g id="topchevron_black_icon_24px" transform="translate(786 892.477) rotate(180)">
                        <rect id="Rectangle_4722" data-name="Rectangle 4722" width="24" height="24" transform="translate(762 868.477)" fill="none" />
                        <path id="Path_23401" data-name="Path 23401" d="M61.848,465.874l-5.541,5.541a1.256,1.256,0,1,0,1.776,1.776l4.653-4.64,4.655,4.655a1.261,1.261,0,0,0,2.149-.888,1.248,1.248,0,0,0-.373-.888l-5.543-5.556A1.26,1.26,0,0,0,61.848,465.874Z" transform="translate(711.498 410.651)" fill="#080808" />
                    </g>
                </svg></span>
            </div>

           <Collapse isOpen={isCollapse} className="feesAndRules p-12">
                <div className='row g-3 '>
                    <div className='col-lg-6 col-sm-12 col-md-6 col-12 col-xl-6'>
                        <div className='card'>
                            <h6 className='fw-medium p-12 border-bottom mb-0'>Fees</h6>
                            {validate.isNotEmpty(feesDataGrid)  && validate.isNotEmpty(feesDataset) && <DynamicGridHeight id="fees-datagrid" metaData={feesDataGrid} dataSet={[...feesDataset]} className="block-size-100">
                                <CommonDataGrid {...feesDataGrid} dataSet={[...feesDataset]}  callBackMap = {feesCallBackMapping}/>
                            </DynamicGridHeight>}
                        </div>
                    </div>
                    <div className='col-lg-6 col-sm-12 col-md-6 col-12 col-xl-6'>
                        <div className='card'>
                            <h6 className='fw-medium p-12 border-bottom mb-0'>Rules</h6>
                           {validate.isNotEmpty(rulesDataGrid) && validate.isNotEmpty(rulesDataset) && <DynamicGridHeight id="rules-datagrid" metaData={rulesDataGrid} dataSet={rulesDataset} className="block-size-100">
                                <CommonDataGrid {...rulesDataGrid} dataSet={rulesDataset} callBackMap={rulesCallBackMapping} />
                            </DynamicGridHeight>}
                        </div>
                    </div>
                </div>
            </Collapse>
        </div>
    )
}

export default PlanFeesAndRules;