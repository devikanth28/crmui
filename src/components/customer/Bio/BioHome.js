import React, { useContext, useEffect, useRef, useState } from 'react';
import BioUser from './BioUser';
import Validate from "../../../helpers/Validate";
import CustomerService from '../../../services/Customer/CustomerService';
import { AlertContext, CustomerContext, DetailModelOpened } from '../../Contexts/UserContext';
import { Button, Card, CardBody, CardFooter } from 'react-bootstrap';
import BioDashBoard from './BioDashboard';
import { CustomSpinners, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import useRole from '../../../hooks/useRole';
import { Roles } from '../../../constants/RoleConstants';
import { DataGridComponent, DetailWrapper, FormsComponent, HeaderComponent } from '../../Common/CommonModel';
import BioWrapper from './BioWrapper';
import BioHeaderButton from './BioHeaderButton';
import { UncontrolledTooltip } from 'reactstrap';

const BioHome = (props) => {
  const [openDoctorRegForm, setOpenDocRegForm] = useState(false)
  const [customerData, setCustomerData] = useState(null);

  const [showFlag, setShowFlag] = useState(false);
  const { setStackedToastContent } = useContext(AlertContext);
  const [loader, setLoader] = useState(false);

  const customerId = props?.match?.params?.customerId;
  const { tokenId } = useContext(CustomerContext);
  const { customer, setCustomer } = useContext(CustomerContext);
  const [hasDoctorRegistrationeRole] = useRole([Roles.ROLE_CRM_REGISTERED_DOCTOR]);
  const validate = Validate();
  const { selectedFormsSection, setSelectedFormsSection } = useContext(DetailModelOpened)

  useEffect(() => {
    getCustomerInfo();
  }, [props.match.params.customerId || customerData, tokenId]);

  useEffect(() => {

  }, [customerData])

  const getCustomerInfo = async () => {
    try {
      const config = { headers: { customerId }, params: { customerId, tokenId } };
      const response = await CustomerService().getUserProfileInfo(config);
      if (validate.isNotEmpty(response) && response.statusCode === "SUCCESS" && validate.isNotEmpty(response.dataObject) && validate.isNotEmpty(response.dataObject.customerInfo)) {
        setCustomerData(response.dataObject);
        if (validate.isNotEmpty(response.dataObject.customerInfo))
          setCustomer({ ...customer, ...response.dataObject.customerInfo });
        if (response.dataObject.customerInfo.doNotDistrub === "N") {
          setShowFlag(true);
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const changeFlag = async () => {
    try {
      const config = { headers: { "customerId": customerId }, params: { "customerId": customerId, "updateFlag": showFlag ? "DoNotDisturb" : "GetUpdates", "tokenId": tokenId } };
      const response = await CustomerService().updateStatus(config);
      setLoader(false);
      if (validate.isNotEmpty(response) && response.statusCode === "SUCCESS") {
        setShowFlag(!showFlag)
        setCustomer({ ...customer, doNotDistrub: showFlag ? 'Y' : 'N' })
        setStackedToastContent({ toastMessage: "Updated Successfully.", position: TOAST_POSITION.BOTTOM_START })
      } else {
        setStackedToastContent({ toastMessage: "Customer not Synced, Please try after some time.", position: TOAST_POSITION.BOTTOM_START })
      }
    } catch (err) {
      setLoader(false);
      console.log("There was some error at server side:" + err);
    };
  }

  return (<React.Fragment>

    <BioWrapper>
      <DetailWrapper modalType="MART">
        <HeaderComponent id="HeaderComp">
          {customer?.registeredDoctorInfo?.status == "I" && hasDoctorRegistrationeRole && <BioHeaderButton openDoctorRegForm={openDoctorRegForm} setOpenDocRegForm={setOpenDocRegForm} customerId={customerId} />}
        </HeaderComponent>
        <FormsComponent tooltipText={"Customer Details"} headerText={"Customer Details"} className="h-100" id="FormsComp"> 
          {validate.isNotEmpty(customerData) && validate.isNotEmpty(customerData?.customerInfo) ? <Card className='h-100 border-0'>
          <div className='p-2 border-bottom align-items-center'>
          <div className='d-flex justify-content-between align-items-center'>
            <h4 className={`fs-6 mb-0`}>Customer Details</h4>
            <button type="button" id="formsCloseIcon" className="rounded-5 icon-hover btn btn-link hide-on-mobile" onClick={() => { setSelectedFormsSection(!selectedFormsSection) }}>
              <svg id="notification-icn" xmlns="http://www.w3.org/2000/svg" width="16" height="15.956" viewBox="0 0 16 15.956">
                <circle id="Ellipse_1160" data-name="Ellipse 1160" cx="4" cy="4" r="4" transform="translate(4 4.001)" fill="#ebebeb" opacity="0" />
                <path id="noun-down-scale-3676807-404040" d="M48.682,57.011,44.722,61a1,1,0,0,1-.575.224A.82.82,0,0,1,43.572,61a.772.772,0,0,1,0-1.118l3.96-3.96-2.267.192a.8.8,0,0,1-.128-1.6l4.471-.415a.78.78,0,0,1,.862.862l-.415,4.471a.8.8,0,0,1-.8.734h-.064a.794.794,0,0,1-.734-.862Zm9.262-11.529-3.96,3.992.224-2.3a.8.8,0,0,0-1.6-.128L52.2,51.518a.794.794,0,0,0,.224.639.77.77,0,0,0,.575.224h.064l4.471-.415a.8.8,0,1,0-.128-1.6l-2.267.224,3.96-3.96a.772.772,0,0,0,0-1.118.841.841,0,0,0-1.15-.032Z" transform="translate(-43.333 -45.271)" fill="#3f3f3f" />
              </svg>
              <UncontrolledTooltip placement="bottom" target="formsCloseIcon">
                Hide Customer Details
              </UncontrolledTooltip>
            </button>
            <button type="button" id="formsCloseIcon" className="rounded-5 icon-hover btn btn-link forms-toggle-button" onClick={() => { setSelectedFormsSection(!selectedFormsSection) }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <g id="topchevron_black_icon_18px" transform="translate(-762 -868.477)">
                  <rect id="Rectangle_4722" data-name="Rectangle 4722" width="18" height="18" transform="translate(762 868.477)" fill="none" />
                  <path id="Path_23401" data-name="Path 23401" d="M60.371,465.782l-4.156,4.156a.942.942,0,0,0,1.332,1.332l3.49-3.48,3.491,3.491a.945.945,0,0,0,1.611-.666.936.936,0,0,0-.279-.666L61.7,465.782A.945.945,0,0,0,60.371,465.782Z" transform="translate(710.138 408.731)" fill="#080808" />
                </g>
              </svg>
            </button>
        </div>
        </div>
            <CardBody className='overflow-y-auto scroll-on-hover'>
              {validate.isNotEmpty(customerData) && validate.isNotEmpty(customerData?.customerInfo) ? <BioUser customerData={customerData} getCustomerInfo={getCustomerInfo} history={props.history} /> : <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column "} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText='Please be patient while we prepare your data for loading!' />}
            </CardBody>
            <CardFooter className='bg-white'>
              <Button variant="brand" disabled={loader} className='w-100' onClick={() => { setLoader(true); changeFlag() }} >
                {loader ? <CustomSpinners spinnerText={{ showFlag } ? "Do Not Disturb" : "Get Updates"} className={"spinner-position"} /> : showFlag ? "Do Not Disturb" : "Get Updates"}
              </Button>
            </CardFooter>
          </Card>
            : <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column "} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText='Please be patient while we prepare your data for loading!' />}
        </FormsComponent>
        <DataGridComponent className="h-100" id="DataGridComp">
          {validate.isNotEmpty(customerData) && validate.isNotEmpty(getCustomerInfo) ? <div className=' p-12 h-100 overflow-y-auto h-100 scroll-on-hover'>
            {validate.isNotEmpty(customerData) && validate.isNotEmpty(getCustomerInfo) ? <BioDashBoard customerData={customerData} getCustomerInfo={getCustomerInfo} /> : <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column "} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText='Please be patient while we prepare your data for loading!' />}
          </div>
            : <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column "} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText='Please be patient while we prepare your data for loading!' />}
        </DataGridComponent>
      </DetailWrapper>
    </BioWrapper>
  </React.Fragment>
  )
}

export default BioHome; 