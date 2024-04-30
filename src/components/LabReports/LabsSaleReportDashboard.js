import DynamicForm, { CustomSpinners, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useRef, useState } from 'react';
import { downloadFile } from '../../helpers/LabOrderHelper';
import Validate from '../../helpers/Validate';
import LAB_ORDER_CONFIG from '../../services/LabOrder/LabOrderConfig';
import { API_URL } from '../../services/ServiceConstants';
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from '../Common/CommonStructure';
import { AlertContext } from '../Contexts/UserContext';

const LabsSaleReportDashboard = ({ helpers }) => {
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const { setAlertContent } = useContext(AlertContext);
  const validate = Validate();
  const [dateRange, setDateRange] = useState();
  const [loader, setIsLoading] = useState(false);

  const handleReportSelectionRadio = (payload) => {
    if (payload[0].target.value === "yesterdayReportSelect") {
      helpers.hideElement("daywiseSaleDate");
    } else {
      helpers.showElement("daywiseSaleDate");
    }
  }


  const getStartTime = (selectedDate) => {
    let tempDate = new Date(selectedDate);
    tempDate.setHours(0, 0, 0, 0);
    return tempDate;
  }

  const getEndTime = (selectedDate) => {
    let tempDate = new Date(selectedDate);
    tempDate.setHours(23, 59, 59, 99);
    return tempDate;
  }

  const validateLabsSaleReportSearchCriteria = (labsSaleReportSearchCriteria) => {
    const { collectionCenters, labDayAndDayWiseSaleRadioBtn, daywiseSaleDate } = labsSaleReportSearchCriteria;
    if (validate.isEmpty(labsSaleReportSearchCriteria)) {
      setAlertContent({ alertMessage: "All fields are mandatory" });
      return false;
    }
    if (validate.isEmpty(collectionCenters)) {
      setAlertContent({ alertMessage: "Please select the collection center" });
      return false;
    }
    if (validate.isEmpty(labDayAndDayWiseSaleRadioBtn)) {
      setAlertContent({ alertMessage: "Please select Type of Download" });
      return false;
    }
    if (labDayAndDayWiseSaleRadioBtn === "daywiseSaleReport" && validate.isEmpty(daywiseSaleDate)) {
      setAlertContent({ alertMessage: "Please Select Daywise Sale Date" });
      return false;
    }
    return true;
  }

  const downloadlabsSaleReport = () => {
    const labsSaleReportSearchCriteria = helpers.validateAndCollectValuesForSubmit("labsSaleReportForm", false, false, false);
    if (validate.isNotEmpty(labsSaleReportSearchCriteria) && validateLabsSaleReportSearchCriteria(labsSaleReportSearchCriteria)) {
      let selectedDate = null;
      if (labsSaleReportSearchCriteria.labDayAndDayWiseSaleRadioBtn === "yesterdayReportSelect") {
        selectedDate = new Date();
        selectedDate.setDate(selectedDate.getDate() - 1);
      } else {
        selectedDate = new Date(dateRange);
      }
      let labsSaleSearchCriteria = {
        centerId: labsSaleReportSearchCriteria.collectionCenters[0],
        fromDate: getStartTime(selectedDate),
        toDate: getEndTime(selectedDate)
      }
      downloadReceipt(labsSaleSearchCriteria);
    }
  }

  const downloadReceipt = async (value) => {
    setIsLoading(true);
    let dsrSearchCriteriaStr = encodeURIComponent(JSON.stringify(value));

    const downloadPdfUrl = `${API_URL}${LAB_ORDER_CONFIG.GET_LAB_ORDER_DSR.url}?dsrSearchCriteriaStr=${dsrSearchCriteriaStr}`;
    downloadFile(downloadPdfUrl).then(response => {
      if (response && response.status && response.status === "failure") {
        setAlertContent(response.message);
        setIsLoading(false);
      }
      else {
        setIsLoading(false);
      }
    }).catch(err => {
      setAlertContent("Unable to Download Report");
    });
  }

  const setDateRangeValue = (payload) => {
    setDateRange(payload[0].target.value);
  }

  const setCollectionCenters = (event) => {
    if (validate.isNotEmpty(event[0].target.value)) {
      helpers.showElement("group2")
    } else {
      helpers.hideElement("group2")
    }
  }

  const observersMap = {
    'labDayAndDayWiseSaleRadioBtn': [['click', handleReportSelectionRadio]],
    'downloadlabsSaleReport': [['click', downloadlabsSaleReport]],
    'daywiseSaleDate': [['change', setDateRangeValue]],
    'collectionCenters': [['change', setCollectionCenters], ['select', setCollectionCenters]]
  }


  return (
    <React.Fragment>
      <Wrapper>
        <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
          <p className="mb-0">Lab Sale Report</p>
        </HeaderComponent>
        <BodyComponent allRefs={{ headerRef, footerRef }} className="body-height">
          <DynamicForm requestUrl={`${API_URL}labsSaleReport`} requestMethod={'GET'} helpers={helpers} observers={observersMap} />
        </BodyComponent>
        <FooterComponent ref={footerRef} className="footer px-3 py-2">
          <div className="d-flex justify-content-start flex-row-reverse">
            <button type="button" class="px-4 btn-brand ms-2 btn" disabled={loader} onClick={() => { downloadlabsSaleReport() }}>
              {loader && <CustomSpinners spinnerText={'Download Report'} className={" spinner-position"} innerClass={"invisible"} />}
              {!loader && <React.Fragment>Download <span className='hide-on-mobile'>Report</span></React.Fragment>}</button>
            <button type="button" class="px-4 brand-secondary btn btn- " onClick={() => { helpers.resetForm("labsSaleReportForm", false, false, false, true); helpers.hideElement("group2"); helpers.hideElement("daywiseSaleDate"); }}>Clear</button>
          </div>
        </FooterComponent>
      </Wrapper>

    </React.Fragment>
  )
}

export default withFormHoc(LabsSaleReportDashboard);