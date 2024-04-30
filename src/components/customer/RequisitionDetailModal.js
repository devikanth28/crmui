import React, { useContext, useEffect, useRef, useState } from 'react';
import Validate from '../../helpers/Validate';
import { BodyComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure';
import NoDataFound from '../Common/NoDataFound';
import CloseIcon from '../../images/cross.svg';
import { CustomSpinners, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import { Button } from 'react-bootstrap';
import CustomerService from '../../services/Customer/CustomerService';
import { AlertContext } from "../Contexts/UserContext";
import DynamicGridHeight from '../Common/DynamicGridHeight';
import OrderHelper from '../../helpers/OrderHelper';
import CustomerDetails from "../customer/CustomerDetails"

const RequisitionDetailModal = ({ customerId, customerMobileNo, requisitionStatus, dataGrid, dataset, totalRecords, requisitionId, isLoading, setShowRequisitionDetailModal, setIsLoading, requisitionType, procurementDataSet, setProcurementDataSet, getBadgeColorClassForStatus, handleRequisitionDetailModal }) => {

  const headerRef = useRef(0);
  const validate = Validate()
  const [procurementComments, setProcurementComments] = useState("")
  const { setStackedToastContent } = useContext(AlertContext);
  const tabsRef = useRef();
  const footerRef = useRef();
  const [isInvalidComment, setIsInvalidComment] = useState(false);
  const [isUpdatedMessage, setIsUpdatedMessage] = useState(false)
  let requisitionStatusClass = OrderHelper().getBadgeColorClassForStatus(requisitionStatus) + " badge rounded-pill";

  const updateCommunication = () => {
    if (procurementComments == "") {
      setIsInvalidComment(true);
      return
    }
    else {
      setIsInvalidComment(false);
    }
    updateProcurementComments(requisitionId, procurementComments)

  }
  const updateProcurementComments = async (requisitionId, procurementComments) => {
    setIsUpdatedMessage(true);
    const data = await updateCustomerProcurementComments(requisitionId, procurementComments);
    if (validate.isNotEmpty(data) && "SUCCESS" === data.statusCode) {
      setStackedToastContent({ toastMessage: data.message, position: TOAST_POSITION.BOTTOM_START })
      const filteredProcurementData = procurementDataSet.filter(each => {
        return each.requisitionId != requisitionId
      });
      setProcurementDataSet(filteredProcurementData)
    }
    setShowRequisitionDetailModal(false)
    setIsUpdatedMessage(false)
  }
  const updateCustomerProcurementComments = async (requisitionId, procurementComments) => {
    const data = await CustomerService().updateCustomerProcurementCommunication({ "requisitionId": requisitionId, "remarks": procurementComments }).then(data => {
      if (data && "SUCCESS" === data.statusCode) {
        return data;
      } else {
        setStackedToastContent({ toastMessage: data.message, position: TOAST_POSITION.BOTTOM_START })
        console.log(data.message)
      }
    }).catch((err) => {
      setStackedToastContent({ toastMessage: "Something went wrong, Please Try Again!", position: TOAST_POSITION.BOTTOM_START })
      console.log(err)
    });
    return data;
  }


  const UpdateCustomerProcurementComments = (procurementComment) => {
    setProcurementComments(procurementComment)
  }

  function renderProcurementStatusColumn(props) {
    let statusCellClass = getBadgeColorClassForStatus(props.row.procurementStatus) + " badge rounded-pill";
    return <React.Fragment>
      <div className={statusCellClass}>{OrderHelper().getStatusWithFirstLetterCapitalized(props.row.procurementStatus)}</div>
    </React.Fragment>
  }

  const callBackMapping = {
    renderProcurementStatusColumn
  }

  const toCamelCase = (string) => {
    let camelCasedString = string.split(" ")
    return camelCasedString[0].toLowerCase()[0].toUpperCase() + camelCasedString[0].slice(1).toLowerCase() + " " + camelCasedString[1].toLowerCase()[0].toUpperCase() + camelCasedString[1].slice(1).toLowerCase()
  }

  return <React.Fragment>
    <div className="custom-modal header">
      <Wrapper className="m-0 h-100">
        <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-1">
          <p className="d-flex align-items-center mb-0">
            <span className='hide-on-mobile'>Details for Customer </span>ID - <span className="fw-bold ms-1"> {customerId}</span><span className={requisitionStatusClass + " ms-3 status-truncation"}>
              {OrderHelper().getStatusWithFirstLetterCapitalized(requisitionStatus)}
            </span>
          </p>
          <div class=" d-flex align-items-center">
            <Button variant=" " onClick={() => handleRequisitionDetailModal(false)} className="rounded-5 icon-hover btn-link">
            <span className='custom-close-btn icon-hover'></span>
            </Button>
          </div>
        </HeaderComponent>
        <BodyComponent allRefs={{ headerRef }} className="body-height" >
          {!isLoading && validate.isNotEmpty(dataset) && validate.isNotEmpty(dataGrid) && <div class="row g-3 h-100 d-flex flex-column flex-lg-row">
            <div class="col-12 col-lg-4 h-100">
              <div className='card' style={{ "max-height": "100%" }}>
                <div className='p-12 border-bottom'>
                  <h4 className="mb-0 fs-6">
                    Customer Details
                  </h4>
                </div>
                <div className="overflow-y-auto p-12" >
                  <div className="custom-border-bottom-dashed">
                    <CustomerDetails customerId={customerId} mobileNumber={customerMobileNo} />
                  </div>
                  <div className={validate.isNotEmpty(requisitionStatus) && "INACTIVE" === requisitionStatus ? "my-3" : "mt-3"}>
                    {validate.isNotEmpty(requisitionType) && <div><p className='text-secondary mb-0 font-12'> Requisition Type</p>
                      <span className='font-12 mb-1'>{toCamelCase(requisitionType)}</span></div>
                    }
                  </div>
                  {validate.isNotEmpty(requisitionStatus) && "INACTIVE" === requisitionStatus ?
                    <React.Fragment>
                      <div className={"custom-border-bottom-dashed"} />
                      <div className='mt-3'>
                        <div class="form-floating">
                          <textarea
                            maxlength="200"
                            className={`form-control ${isInvalidComment ? "is-invalid" : ""}`}
                            min="4"
                            placeholder="Reasons"
                            index="1"
                            id="remarks"
                            rows="4"
                            required
                            onChange={(e) => UpdateCustomerProcurementComments(e.target.value)}
                          ></textarea>
                          <label for="remarks">Reasons</label>
                          <div class="invalid-feedback">
                            Please provide valid reasons.
                          </div>
                        </div>

                      </div>
                    </React.Fragment>
                    :
                    <></>
                  }
                </div>
                {validate.isNotEmpty(requisitionStatus) && "INACTIVE" === requisitionStatus &&
                  <div className='d-flex align-items-center justify-content-end footer p-12' ref={footerRef}>
                    <Button variant=' ' placeholder='Remarks' className="btn-sm brand-secondary" title="Update Customer" onClick={updateCommunication}>
                      {isUpdatedMessage ? <CustomSpinners spinnerText={"Update Customer"} className={" spinner-position"} innerClass={"invisible"} /> : <>Update Customer</>}
                    </Button>
                  </div>}
              </div>
            </div>

            <div class="col-12 col-lg-8 h-100">
              <div className="border rounded crm-modal h-100">
                <div className={`custom-tabs-forms d-flex justify-content-between pb-0`} ref={tabsRef}>
                  <div className='p-12'>
                    <h4 className="mb-0 fs-6">
                      Customer Requisition Details
                    </h4>
                  </div>
                </div>
                <div className="p-12 m-0">
                  <DynamicGridHeight dataSet={dataset} metaData={dataGrid} className="card">
                    <CommonDataGrid
                      {...dataGrid}
                      dataSet={dataset}
                      callBackMap={callBackMapping}
                    />
                  </DynamicGridHeight>

                </div>
              </div>
            </div>
          </div>}
          {Validate().isNotEmpty(isLoading) && isLoading && <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText='Please be patient while we prepare your data for loading!' />}
          {totalRecords == 0 && <NoDataFound text={`No Requisition Details found`} />}
        </BodyComponent>
      </Wrapper>
    </div>
  </React.Fragment>
}

export default RequisitionDetailModal
