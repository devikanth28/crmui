import React, { useState } from 'react'
import { Collapse } from "reactstrap";
import DataGridHelper from '../../../helpers/DataGridHelper';
import DynamicGridHeight from '../../Common/DynamicGridHeight';
import CommonDataGrid from '@medplus/react-common-components/DataGrid';

const FeesAndRules = ({ fees, rules,...props}) => {

    const datagridHelper = DataGridHelper();
    const subscriptionFeesDataGrid = datagridHelper.getScriptionFeesDataGridObj();
    const subscriptionRulesDataGrid = datagridHelper.getScriptionRulesDataGridObj();
    const [isCollapse, setCollpased] = useState(props?.isOpen?props.isOpen:false);
    return (
        <div className='card'>
            <div className='d-flex justify-content-between p-12 border-bottom pointer' onClick={() => { setCollpased(!isCollapse) }}>
                <p class="fw-medium mb-0">Fees & Rules</p>

                <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={`collapse-arrow ${isCollapse ? 'rotate-bottom':'rotate-up-half'}`}>
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
                            <DynamicGridHeight id="fees-datagrid" metaData={subscriptionFeesDataGrid} dataSet={fees} className="block-size-100">
                                <CommonDataGrid {...subscriptionFeesDataGrid} dataSet={fees} callBackMap={{}} />
                            </DynamicGridHeight>
                        </div>
                    </div>
                    <div className='col-lg-6 col-sm-12 col-md-6 col-12 col-xl-6'>
                        <div className='card'>

                            <h6 className='fw-medium p-12 border-bottom mb-0'>Rules</h6>
                            <DynamicGridHeight id="rules-datagrid" metaData={subscriptionRulesDataGrid} dataSet={rules} className="block-size-100">
                                <CommonDataGrid {...subscriptionRulesDataGrid} dataSet={rules} callBackMap={{}} />
                            </DynamicGridHeight>
                        </div>
                    </div>
                </div>
            </Collapse>
        </div>
    )
}

export default FeesAndRules