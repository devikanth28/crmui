import dateFormat from 'dateformat';
import DynamicGridHeight from '../Common/DynamicGridHeight';
import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import React, { useContext } from 'react';
import { Card, CardBody } from 'reactstrap';
import DataGridHelper from '../../helpers/DataGridHelper';
import { UserContext } from '../Contexts/UserContext';
import Validate from '../../helpers/Validate';

export default ({ freeTestCoupon, dataGrid, ...props }) => {

    const { noOfTimesCouponUsed, validity, noofTimesCouponCanBeUse, couponCode, freeTests } = freeTestCoupon;
    const userSessionInfo = useContext(UserContext);
    const validate = Validate();

    return <React.Fragment><Card className='mt-2'>
        <CardBody className='p-0'>
        <div className="d-flex flex-wrap justify-content-between mt-2 mx-3">
                {couponCode && <div className="d-flex flex-column content-width mb-3">
                    <span className="font-12 text-secondary">Coupon code</span>
                    <span className="font-14" style={{fontWeight:'bold'}}>{couponCode}</span>
                </div>}
                {freeTestCoupon.couponCode && <div className="d-flex flex-column content-width">
                    <span className="font-12 text-secondary">Coupon used</span>
                    <span className="font-14">{`${noOfTimesCouponUsed}/${noofTimesCouponCanBeUse}`}</span>
                </div>}
                {freeTestCoupon.couponCode && <div className="d-flex flex-column">
                    <span className="font-12 text-secondary">Coupon valid till</span>
                    <span className="font-14">{dateFormat(validity, "mmm dd, yyyy")}</span>
                </div>}
            </div>
            <div>
                {validate.isNotEmpty(dataGrid) && validate.isNotEmpty(freeTests) && 
                    <React.Fragment>
                        <DynamicGridHeight dataSet={freeTests} gridMaxRows={freeTests.length} metaData={dataGrid} id={`free-test-order-dataset ${couponCode}`} className="scroll-grid-on-hover">
                            <CommonDataGrid
                                {...DataGridHelper().checkGridSpecificationsForVertical(userSessionInfo?.vertical, dataGrid)}
                                dataSet={freeTests}
                                callBackMap={() => { }}
                            />
                        </DynamicGridHeight>
                    </React.Fragment>
                }
            </div>
        </CardBody>
    </Card>
    </React.Fragment>

}