import React from 'react';
import { MART_ORDER_DASHBOARD_ORDER_SEQUENCE } from './Constants';
import OrderDashboard from './OrderDashboard';

 function PrescriptionOrderDashboard(props) {
  return (
    <OrderDashboard orderSequence={MART_ORDER_DASHBOARD_ORDER_SEQUENCE.prescription} type="prescription"  {...props}/>
  )
};
export default PrescriptionOrderDashboard;
