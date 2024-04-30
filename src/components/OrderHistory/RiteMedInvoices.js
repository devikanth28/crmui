import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import React, { useState } from 'react';
import DataGridHelper from '../../helpers/DataGridHelper';
import PrepareOrderDetails from '../order/PrepareOrderDetails';

const RiteMedInvoices = () => {
    const [selectedInvoiceId, setSelectedInvoiceID] = useState(undefined);
    const [openOrderDetailModal, setOrderDetailModal] = useState(false)

    const riteMedInvoiceDataGrid = DataGridHelper().RiteMedInvoice();

    const riteMedInvoiceDataSet = [
        {
            "invoiceId": "232403520000004",
            "dateCreated":"Mar 25, 2024",
            "storeAddr":"INTGHYD70023[MEDPLUS FRANCHISE VASANTH NAGAR PHASE II]",
            "promotionType":"Discount",
            "amount":20.00,
        }
    ];


    const openModal = (invoiceId) => {
                setSelectedId(invoiceId);
                setOpenOrderDetailModal(true);

    }

    const callBackMapping = {
        "renderInvoiceId":(props) => {
            console.log(row)
            const {row} = props;
            return <React.Fragment>
                <a className="btn btn-sm btn-link w-100 text-start" onClick={() => openModal(row.invoiceId)} href="javascript:void(0)" rel="noopener" aria-label={row.invoiceId} role="link" title="View Order details" id={row.invoiceId}>{row.invoiceId}</a>

            </React.Fragment>
        }
    }

  return (
        <div className='p-12 pb-0 h-100'>
                        <div className={`card mb-3 me-0 h-100`}>
                                <CommonDataGrid {...riteMedInvoiceDataGrid} dataSet={[...riteMedInvoiceDataSet]} callBackMap={callBackMapping}/>
                        </div>
                        {openOrderDetailModal && <PrepareOrderDetails orderId={5000130}/>}
                    </div>
  )
}

export default RiteMedInvoices