import CustomerService from '../../../services/Customer/CustomerService';
import React, { useContext, useEffect, useState } from 'react';
import Validate from '../../../helpers/Validate';
import { format } from 'date-fns';
import dateFormat from 'dateformat';
import useRole from '../../../hooks/useRole';
import { Roles } from '../../../constants/RoleConstants';
import { getGenderString } from '../../../helpers/CommonHelper';
import { AlertContext, CustomerContext } from '../../Contexts/UserContext';
import { CustomSpinners, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import { Button, Card, CardBody } from 'react-bootstrap';
import { getCustomerRedirectionURL } from '../CustomerHelper';
import { CustomerConstants, MEDPLUS_ADVANTAGE} from '../Constants/CustomerConstants';

const BioSubscriptions = (props) => {

  const validate = Validate();

  const [subscription, setActiveSubscription] = useState();

  const [members, setMembers] = useState();
  const [loader, setLoader] = useState(false);

  const [isCustomerPointsAvailable, setIsCustomerPointsAvailable] = useState(false);

  const [customerPointsHistory, setCustomerPointsHistory] = useState({});

  const [hasCrmLabViewSubscriptionRole] = useRole([Roles.ROLE_CRM_LAB_VIEW_SUBSCRIPTION]);
  const { setStackedToastContent } = useContext(AlertContext);
  const {customerId,setSubscription} = useContext(CustomerContext)

  useEffect(() => {
    getSubscriptionsInfo();
    getCustomerPoints();
  }, []);

  const getSubscriptionsInfo = async () => {
    try {
      await CustomerService().getSubscriptions({ customerId: props.customerId, requestFrom: "Bio" }).then(response => {
        setLoader(true);
        if (validate.isNotEmpty(response) && validate.isNotEmpty(response.statusCode)) {
          if (validate.isNotEmpty(response.dataObject) && "SUCCESS" == response.statusCode) {
            setMembers(validate.isNotEmpty(response) && validate.isNotEmpty(response.dataObject) && validate.isNotEmpty(response.dataObject.membersInfo) ? response.dataObject.membersInfo : []);
            if (validate.isNotEmpty(response.dataObject.subscriptions)) {
              const activeSubscriptions = [];
              response.dataObject.subscriptions.forEach(s => {
                if (s.status === "ACTIVE" || s.status === "PENDING") {
                  var sDate = new Date(s.startDate);
                  var eDate = new Date(s.endDate);
                  var currentDate = new Date();
                  if (currentDate >= sDate && currentDate <= eDate) {
                    activeSubscriptions.push(s);
                    props.isSubscribedMember(true);
                  }
                }
              });
              setActiveSubscription(activeSubscriptions);
            }
            if ("FAILURE" == response.statusCode) {
              setStackedToastContent({ toastMessage: response?.message, position: TOAST_POSITION.BOTTOM_START })
            }
          }
          setLoader(false);
        }
      }).catch(err => {
        console.log("Error while fetching subscriptions", err);
        setStackedToastContent({ toastMessage: "Something went wrong, please try again later", position: TOAST_POSITION.BOTTOM_START });
      })
    }
    catch (err) {
      console.log("Error occured while fetching subscriptions ", err);
      setStackedToastContent({ toastMessage: "Something went wrong, please try again later", position: TOAST_POSITION.BOTTOM_START });
    }
  }

  const getCustomerPoints = async () => {
    try {
      const customerPointsParameters = {
        customerId: props.customerId,
        pointsType: "MDX"
      }
      const response = await CustomerService().getCustomerPointsHistory(customerPointsParameters);
      if (validate.isNotEmpty(response) && response.statusCode === "SUCCESS" && validate.isNotEmpty(response.dataObject) && validate.isNotEmpty(response.dataObject.available)) {
        setIsCustomerPointsAvailable(response.dataObject.available >= 0);
        setCustomerPointsHistory(response.dataObject)
      }
    }
    catch (err) {
      setStackedToastContent({ toastMessage: "Something went wrong, please try again later", position: TOAST_POSITION.BOTTOM_START });
      console.log("Error occured while fetching customer points history", err);
    }
  }

  const pageRedirection = (pageToRedirect) => {
    window.open("/crm/mart-customer.crm?customerId=" + props.customerId + "&mobile=" + props.customerInfo?.mobileNumber + "&customerType=" + props.customerInfo?.customerType + "&mergeStatus=" + props.customerInfo?.merged + "&fName=" + props.customerInfo?.firstName + "&lName=" + props.customerInfo?.lastName + pageToRedirect, "_blank")
  }

  return (
    <React.Fragment>
      {loader && <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" spinnerText='loading membership details' />}
      {<div>
          {!loader && validate.isNotEmpty(subscription) && subscription.map((eachSub, index) => {
            return (
              <React.Fragment>
              <div className='custom-border-bottom-dashed mb-3'>
                <p className='text-secondary font-12 mb-12'>Membership Details</p>
                <Card className='border-0'>
                  <CardBody className=' p-0'>
                    {validate.isNotEmpty(eachSub.benefitType) &&<>
                    
                      <div className='flex-wrap'>
                        <div className='col-12'>

                        <small className="text-secondary font-12">{"HEALTH_CARE" == eachSub.benefitType ? "HEALTH CARE" : "PHARMACY" == eachSub.benefitType ? "PHARMACY CARE" : `${eachSub.benefitType}`}</small>
                        {validate.isNotEmpty(eachSub.plan) && <p className='font-14 mb-1'>{eachSub.plan?.displayName}</p>}
                        </div>
                        <div>

                        {validate.isNotEmpty(eachSub.dateCreated) &&
                          <div className='col-12'>
                            <small className='text-secondary font-12'>Created</small>
                            <p className='font-14 mb-1'>{dateFormat(eachSub.dateCreated, "mmm d, yyyy HH:mm:ss")}</p>
                          </div>
                        }
                        </div>
                      </div>
                    </>
                    }
                    <div className='row mt-3 flex-wrap justify-content-between'>
                      {validate.isNotEmpty(eachSub) && validate.isNotEmpty(eachSub.benefitType) &&
                        <p className='w-auto d-flex flex-column font-14 text-start mb-0'>
                          <span className='text-secondary font-12'>Subscription Code</span>
                          <h6 className='font-14'>{eachSub.subscriptionCode}</h6>
                        </p>
                      }
                      {validate.isNotEmpty(eachSub.startDate) && validate.isNotEmpty(eachSub.endDate) &&
                        <React.Fragment>
                          <div className='d-flex justify-content-between mb-2'>
                          <p className='w-auto d-flex flex-column text-start mb-0'>
                            <span className='text-secondary font-12'>Start</span>
                            <h6 className='font-14'>{dateFormat(eachSub.startDate, 'mmm d, yyyy')}</h6>
                          </p>
                          <p className='w-auto d-flex flex-column font-14 text-start mb-0'>
                            <span className='text-secondary font-12'>Expiry</span>
                            <h6 className='font-14'>{dateFormat(eachSub.endDate, 'mmm d, yyyy')}</h6>
                          </p>
                          </div>
                        </React.Fragment>
                      }
                    </div>
                  </CardBody>
                </Card>
                </div>
                {subscription.length !== index && subscription.length>1 && <hr className='border-secondary mt-0' />}
                
              </React.Fragment>
            )
          })  
        }

        {!loader && validate.isNotEmpty(subscription) && validate.isNotEmpty(members) && members.length > 0 &&
          <div className='custom-border-bottom-dashed mb-3 mt-4'>
            <p className='text-secondary font-12'>Members Added</p>
            <div className='row mt-3 flex-wrap'>
              {members.map(eachMember => {
                return (
                  <React.Fragment>
                    {(validate.isNotEmpty(eachMember.patientName) && validate.isNotEmpty(eachMember.gender) && validate.isNotEmpty(eachMember.age)) && <p className='w-auto d-flex flex-column font-14 text-start'><span className='font-14 font-weight-bold'>{eachMember.patientName}</span><h6 className='text-secondary font-12'> {eachMember.age} years / {getGenderString(eachMember.gender)}</h6></p>}
                  </React.Fragment>
                )
              })}
            </div>
            {isCustomerPointsAvailable &&
              <div className='d-flex flex-column'>
                <span className='text-secondary font-12'>MDx Points Balance</span>
                {isCustomerPointsAvailable && validate.isNotEmpty(customerPointsHistory) && validate.isNotEmpty(customerPointsHistory.available) && <h6 className='font-14'>{customerPointsHistory.available.toFixed(2)}&nbsp;&nbsp;Pts</h6>}
                {(customerPointsHistory.credited > 0 || hasCrmLabViewSubscriptionRole) && <div className='d-flex justify-content-center gap-2 my-2'>
                  {customerPointsHistory.credited > 0 && <Button variant="link" size="sm" className="w-50" onClick={() => { pageRedirection('#/ValuePlus?showMDxPointsTab=true') }}>MDx Ledger</Button>}
                  {hasCrmLabViewSubscriptionRole && <Button variant="link" size="sm" className="w-50" onClick={() => { setSubscription({}); props.history.push(getCustomerRedirectionURL(customerId, MEDPLUS_ADVANTAGE)) }}>Subscription Details</Button>}
                </div>}
              </div>
            }
          </div>
        }

        {!loader && validate.isEmpty(subscription) &&
          <div className="row text-center custom-border-bottom-dashed">
            <p className='text-secondary text-center'>No Subscription available</p>
          </div>
        }
      </div>}
    </React.Fragment>
  )
}

export default BioSubscriptions; 