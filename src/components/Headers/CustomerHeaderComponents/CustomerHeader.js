import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Validate from "../../../helpers/Validate";
import UserService from '../../../services/Common/UserService';
import MedPlusLogo from '../../../images/MedPlusLogo.svg';
import { CustomerContext, LocalityContext, UserContext } from '../../Contexts/UserContext';
import { Button } from 'react-bootstrap';
import CustomerLocalitySearchForm from '../../customer/CustomerLocalitySearchForm';
import { UncontrolledTooltip } from 'reactstrap';


const CustomerHeader = (props) => {
  const defaultAddress = "Bhavani Nagar,Hyderabad";
  const [customerData, setCustomerData] = useState({});
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [isRedemptionBlocked, setIsRedemptionBlocked] = useState(false);
  const [isSaleBlocked, setIsSaleBlocked] = useState(true);
  const userSessionInfo = useContext(UserContext);
  const validate = Validate();
  const inputEl = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [userSectionColor, setUserSectionColor] = useState(sessionStorage.getItem("userColorCode"))
  const {setCustomer,setCustomerId,customerId, customer} = useContext(CustomerContext);


  useEffect(() => {
      setCustomerId(validate.isNotEmpty(customerId) ? customerId: props.match.params.customerId);
      //getCustomerHeaderData(validate.isNotEmpty(customerId) ? customerId: props.match.params.customerId);
  }, []);
  useEffect(() => {
    calculatebg()
  }, [])
  
  useEffect(()=>{
    if(validate.isEmpty(customer) || customer.refreshData){
        getCustomerData(validate.isNotEmpty(customerId) ? customerId: props.match.params.customerId);
    }
}, [customer, props?.match?.params?.customerId])

  const calculatebg = () => {
    if (sessionStorage.getItem("userColorCode") === null) {
      let x = Math.floor((Math.random() * 6) + 1);
      const colors = ['badge-approved', 'badge-pending', 'badge-created', 'badge-rejected', 'badge-Submitted', 'badge-Decoded', 'badge-Cancelled']
      setUserSectionColor(colors[x])
      sessionStorage.setItem("userColorCode", colors[x]);
    }

  }

  const getUsername = (username) => {
    let usernamesplit = username.split(' ');
    let userLetters = ''
    if (usernamesplit.length == 1) {
      userLetters = userLetters + usernamesplit[0].charAt(0)
    }
    else if (usernamesplit.length > 1) {
      userLetters = userLetters + (usernamesplit[0].charAt(0) + usernamesplit[1].charAt(0))
    }

    return userLetters

  }



  const getCustomerHeaderData = async (customerId) => {
    const data = await getData(customerId);
    if (validate.isNotEmpty(data)) {
      setCustomerData(data);
    }
  }

  useEffect(() => {
    if (props.searchFormComponent && Validate().isNotEmpty(props) && Validate().isEmpty(props.location.search)) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [props.location.pathname, props.location.search, props.searchFormComponent]);

  const getCustomerData = (customerId) => {
    const data = UserService().customerHeaderData({headers:{customerId}}).then(data => {
      if (data && data.statusCode === "SUCCESS" && validate.isNotEmpty(data.dataObject)) {
        setCustomer({ ...customer, ...data.dataObject.customer, subscribedHealthCareSubscriptionId: data.dataObject.subscribedHealthCareSubscriptionId, subscribedPharmaSubscriptionId: data.dataObject.subscribedPharmaSubscriptionId });
        setCustomerData(data.dataObject.customer);
      } else {
        console.log("error while fetching data")
      }
    }).catch((err) => {
      console.log(err)
    });
    return data;
  }

  return (
    <React.Fragment>
      <header ref={props.ref} className="px-3 py-2 bg-white d-flex justify-content-between shadow-sm position-sticky" style={{ 'top': 0, zIndex: 1020 }}>
        <div className="d-flex align-items-center">
          <div>
            <Link to='/customer-relations/'><img src={MedPlusLogo} alt="MedPlus Logo" /></Link>
          </div>
          <span className="mx-3 vertical-line"></span>
          <div>
            <p className="mb-0 font-14 text-brand line-height-sm">CRM</p>
            <div className='d-flex align-items-center'>
              <div className={isProfileActive ? 'active-profile-status' : 'inactive-profile-status'}></div>
              {validate.isNotEmpty(customerData) && <p className="mb-0 me-3">Bio Of {customerData.customerID} - {customerData.firstName} {customerData.lastName}</p>}
              <Button id="do-not-disturb-icn" variant=' ' className='btn-link icon-hover'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                  <g id="do-not-distrub-icn-16" transform="translate(-194 -84)">
                    <rect id="Rectangle_10433" data-name="Rectangle 10433" width="16" height="16" rx="3" transform="translate(194 84)" fill="none" />
                    <path id="Subtraction_124" data-name="Subtraction 124" d="M7,14a7,7,0,1,1,7-7A7.008,7.008,0,0,1,7,14ZM7,1.555A5.492,5.492,0,0,0,7,12.538a5.407,5.407,0,0,0,4.13-1.913,5.527,5.527,0,0,0,0-7.156A5.407,5.407,0,0,0,7,1.555Zm0,9.7a4.126,4.126,0,0,1-2.319-.709L7.929,7.274l2.545-2.567a4.219,4.219,0,0,1-2.545,6.447A4.118,4.118,0,0,1,7,11.259ZM3.525,9.386h0A4.22,4.22,0,0,1,7,2.834a4.152,4.152,0,0,1,2.32.71L7.93,4.946l-4.4,4.439Z" transform="translate(195 85)" fill="#ff1644" />
                  </g>
                </svg>
              </Button>
              <UncontrolledTooltip placement='bottom' target="do-not-disturb-icn">
                Do Not Disturb
              </UncontrolledTooltip>
              <Button id="redemption-icn" variant=' ' className='btn-link icon-hover'>
                {isRedemptionBlocked ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <g id="redemption-block-icn-16" transform="translate(-194 -84)">
                    <rect id="Rectangle_10433" data-name="Rectangle 10433" width="16" height="16" rx="3" transform="translate(194 84)" fill="none" />
                    <g id="redemption-icn" transform="translate(192.5 79.511)">
                      <path id="Path_51662" data-name="Path 51662" d="M28.5,44.325a3.647,3.647,0,0,1,2.611,3.482,3.552,3.552,0,0,1-.074.693h1.7V43.1H28.5Z" transform="translate(-22.165 -31.638)" fill="#ff1644" />
                      <path id="Path_51663" data-name="Path 51663" d="M63,48.5h3.762a.466.466,0,0,0,.472-.472V43.1H63Z" transform="translate(-51.575 -31.638)" fill="#ff1644" />
                      <path id="Path_51664" data-name="Path 51664" d="M33.179,8.9H30.937a1.483,1.483,0,0,0,.015-2.832,1.537,1.537,0,0,0-1.416.28l-1.4,1.2-1.4-1.2a1.491,1.491,0,0,0-2.4.768,1.488,1.488,0,0,0,.266,1.283,1.414,1.414,0,0,0,.738.5H23.074a.466.466,0,0,0-.472.472v.767a.466.466,0,0,0,.472.472h4.617V8.97h.855v1.638h4.617a.466.466,0,0,0,.472-.472V9.369a.445.445,0,0,0-.457-.473Zm-7.42-.87a.575.575,0,0,1-.443-.206.545.545,0,0,1-.1-.472.514.514,0,0,1,.369-.384.728.728,0,0,1,.177-.029.53.53,0,0,1,.354.133l1.136.974Zm4.736,0H29l1.136-.974a.561.561,0,0,1,.9.281.567.567,0,0,1-.546.693Z" transform="translate(-17.136)" fill="#ff1644" />
                      <path id="Path_51665" data-name="Path 51665" d="M5.3,56a2.8,2.8,0,1,0,2.8,2.8A2.8,2.8,0,0,0,5.3,56Zm1.534,2.523-.575.531a.168.168,0,0,0-.044.118l.163.767a.223.223,0,0,1-.324.236l-.679-.384a.111.111,0,0,0-.133,0l-.679.384a.222.222,0,0,1-.324-.236l.163-.767a.1.1,0,0,0-.044-.118l-.575-.531a.226.226,0,0,1,.118-.384l.782-.089a.11.11,0,0,0,.1-.074l.324-.708a.216.216,0,0,1,.4,0l.324.708a.111.111,0,0,0,.1.074l.782.089a.228.228,0,0,1,.118.384Z" transform="translate(0 -42.634)" fill="#ff1644" />
                    </g>
                  </g>
                </svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                    <g id="redemption-unblock-icn-16" transform="translate(-194 -84)">
                      <rect id="Rectangle_10433" data-name="Rectangle 10433" width="16" height="16" rx="3" transform="translate(194 84)" fill="none" />
                      <g id="redemption-icn" transform="translate(192.5 79.511)">
                        <path id="Path_51662" data-name="Path 51662" d="M28.5,44.325a3.647,3.647,0,0,1,2.611,3.482,3.552,3.552,0,0,1-.074.693h1.7V43.1H28.5Z" transform="translate(-22.165 -31.638)" fill="#11b094" />
                        <path id="Path_51663" data-name="Path 51663" d="M63,48.5h3.762a.466.466,0,0,0,.472-.472V43.1H63Z" transform="translate(-51.575 -31.638)" fill="#11b094" />
                        <path id="Path_51664" data-name="Path 51664" d="M33.179,8.9H30.937a1.483,1.483,0,0,0,.015-2.832,1.537,1.537,0,0,0-1.416.28l-1.4,1.2-1.4-1.2a1.491,1.491,0,0,0-2.4.768,1.488,1.488,0,0,0,.266,1.283,1.414,1.414,0,0,0,.738.5H23.074a.466.466,0,0,0-.472.472v.767a.466.466,0,0,0,.472.472h4.617V8.97h.855v1.638h4.617a.466.466,0,0,0,.472-.472V9.369a.445.445,0,0,0-.457-.473Zm-7.42-.87a.575.575,0,0,1-.443-.206.545.545,0,0,1-.1-.472.514.514,0,0,1,.369-.384.728.728,0,0,1,.177-.029.53.53,0,0,1,.354.133l1.136.974Zm4.736,0H29l1.136-.974a.561.561,0,0,1,.9.281.567.567,0,0,1-.546.693Z" transform="translate(-17.136)" fill="#11b094" />
                        <path id="Path_51665" data-name="Path 51665" d="M5.3,56a2.8,2.8,0,1,0,2.8,2.8A2.8,2.8,0,0,0,5.3,56Zm1.534,2.523-.575.531a.168.168,0,0,0-.044.118l.163.767a.223.223,0,0,1-.324.236l-.679-.384a.111.111,0,0,0-.133,0l-.679.384a.222.222,0,0,1-.324-.236l.163-.767a.1.1,0,0,0-.044-.118l-.575-.531a.226.226,0,0,1,.118-.384l.782-.089a.11.11,0,0,0,.1-.074l.324-.708a.216.216,0,0,1,.4,0l.324.708a.111.111,0,0,0,.1.074l.782.089a.228.228,0,0,1,.118.384Z" transform="translate(0 -42.634)" fill="#11b094" />
                      </g>
                    </g>
                  </svg>}
              </Button>
              <UncontrolledTooltip placement='bottom' target="redemption-icn">
                Redemption
              </UncontrolledTooltip>
              <Button id="sale-icn" variant=' ' className='btn-link icon-hover'>
                {isSaleBlocked ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <g id="sale-block-icn-16" transform="translate(-194 -84)">
                    <rect id="Rectangle_10433" data-name="Rectangle 10433" width="16" height="16" rx="3" transform="translate(194 84)" fill="none" />
                    <path id="sale-icn" d="M3.2,19.319V11.837a.638.638,0,0,1,.449-.6l.508-.15,1.227-.374v3.022l1.406-.269V10.3l1.257-.374,1.272-.374c.015,0,.03,0,.03-.015h.03a.558.558,0,0,1,.224,0h.03c.015,0,.03,0,.03.015l2.154.644a1.2,1.2,0,0,0-.195.195,1.337,1.337,0,0,0-.284.778L11.2,11.3,10.1,10.97V20.2l4.444-1.331v-2.5h.03a1.272,1.272,0,0,0,.793-.269,1.115,1.115,0,0,0,.224.015.717.717,0,0,0,.179-.015v3.217a.644.644,0,0,1-.434.6L9.678,21.623a.738.738,0,0,1-.179.03.768.768,0,0,1-.179-.03L3.648,19.917a.611.611,0,0,1-.449-.6Zm8.769-6.973a.317.317,0,0,1,.1-.479l.15-.09a.332.332,0,0,0,.165-.344l-.03-.165a.335.335,0,0,1,.314-.389l.165-.015a.322.322,0,0,0,.3-.24l.045-.165a.332.332,0,0,1,.314-.24.287.287,0,0,1,.12.03l.165.06a.455.455,0,0,0,.12.03.368.368,0,0,0,.254-.12l.12-.134a.343.343,0,0,1,.254-.12.35.35,0,0,1,.254.1l.12.134a.308.308,0,0,0,.254.1.442.442,0,0,0,.134-.03l.165-.075a.432.432,0,0,1,.134-.03.32.32,0,0,1,.314.24l.045.165a.335.335,0,0,0,.3.24h.165a.344.344,0,0,1,.314.389l-.03.165a.322.322,0,0,0,.165.344l.15.075a.332.332,0,0,1,.12.479l-.1.134a.337.337,0,0,0,0,.389l.1.134a.317.317,0,0,1-.1.479l-.15.09a.332.332,0,0,0-.165.344l.03.165a.335.335,0,0,1-.314.389l-.165.015a.322.322,0,0,0-.3.24l-.045.165a.332.332,0,0,1-.314.24.287.287,0,0,1-.12-.03l-.165-.06a.455.455,0,0,0-.12-.03.368.368,0,0,0-.254.12l-.12.134a.343.343,0,0,1-.254.12.35.35,0,0,1-.254-.1l-.106-.075a.308.308,0,0,0-.254-.1.442.442,0,0,0-.134.03l-.165.075a.432.432,0,0,1-.134.03.32.32,0,0,1-.314-.24l-.045-.165a.335.335,0,0,0-.3-.24H12.7a.344.344,0,0,1-.314-.389l.03-.165a.322.322,0,0,0-.165-.344l-.15-.075a.332.332,0,0,1-.12-.479l.1-.134a.337.337,0,0,0,0-.389Zm1.3.4.464.479.494.494,1.616-1.616-.494-.494-1.123,1.122-.464-.479Z" transform="translate(191.801 76.478)" fill="#ff1644" />
                  </g>
                </svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                    <g id="sale-unblock-icn-16" transform="translate(-194 -84)">
                      <rect id="Rectangle_10433" data-name="Rectangle 10433" width="16" height="16" rx="3" transform="translate(194 84)" fill="none" />
                      <path id="sale-icn" d="M3.2,19.319V11.837a.638.638,0,0,1,.449-.6l.508-.15,1.227-.374v3.022l1.406-.269V10.3l1.257-.374,1.272-.374c.015,0,.03,0,.03-.015h.03a.558.558,0,0,1,.224,0h.03c.015,0,.03,0,.03.015l2.154.644a1.2,1.2,0,0,0-.195.195,1.337,1.337,0,0,0-.284.778L11.2,11.3,10.1,10.97V20.2l4.444-1.331v-2.5h.03a1.272,1.272,0,0,0,.793-.269,1.115,1.115,0,0,0,.224.015.717.717,0,0,0,.179-.015v3.217a.644.644,0,0,1-.434.6L9.678,21.623a.738.738,0,0,1-.179.03.768.768,0,0,1-.179-.03L3.648,19.917a.611.611,0,0,1-.449-.6Zm8.769-6.973a.317.317,0,0,1,.1-.479l.15-.09a.332.332,0,0,0,.165-.344l-.03-.165a.335.335,0,0,1,.314-.389l.165-.015a.322.322,0,0,0,.3-.24l.045-.165a.332.332,0,0,1,.314-.24.287.287,0,0,1,.12.03l.165.06a.455.455,0,0,0,.12.03.368.368,0,0,0,.254-.12l.12-.134a.343.343,0,0,1,.254-.12.35.35,0,0,1,.254.1l.12.134a.308.308,0,0,0,.254.1.442.442,0,0,0,.134-.03l.165-.075a.432.432,0,0,1,.134-.03.32.32,0,0,1,.314.24l.045.165a.335.335,0,0,0,.3.24h.165a.344.344,0,0,1,.314.389l-.03.165a.322.322,0,0,0,.165.344l.15.075a.332.332,0,0,1,.12.479l-.1.134a.337.337,0,0,0,0,.389l.1.134a.317.317,0,0,1-.1.479l-.15.09a.332.332,0,0,0-.165.344l.03.165a.335.335,0,0,1-.314.389l-.165.015a.322.322,0,0,0-.3.24l-.045.165a.332.332,0,0,1-.314.24.287.287,0,0,1-.12-.03l-.165-.06a.455.455,0,0,0-.12-.03.368.368,0,0,0-.254.12l-.12.134a.343.343,0,0,1-.254.12.35.35,0,0,1-.254-.1l-.106-.075a.308.308,0,0,0-.254-.1.442.442,0,0,0-.134.03l-.165.075a.432.432,0,0,1-.134.03.32.32,0,0,1-.314-.24l-.045-.165a.335.335,0,0,0-.3-.24H12.7a.344.344,0,0,1-.314-.389l.03-.165a.322.322,0,0,0-.165-.344l-.15-.075a.332.332,0,0,1-.12-.479l.1-.134a.337.337,0,0,0,0-.389Zm1.3.4.464.479.494.494,1.616-1.616-.494-.494-1.123,1.122-.464-.479Z" transform="translate(191.801 76.478)" fill="#11b094" />
                    </g>
                  </svg>}
              </Button>
              <UncontrolledTooltip placement='bottom' target="sale-icn">
                Sale
              </UncontrolledTooltip>
            </div>
          </div>
        </div>
        <div className='d-flex align-items-center'>
          <CustomerLocalitySearchForm />
          <div className='d-flex align-items-cemter mx-3'>
            <Button variant=' ' className='btn-link icon-hover'>
              <div className='position-relative'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                  <g id="lab_cart_icon_16px" transform="translate(-180.258 -387.452)">
                    <rect id="Rectangle_3299" data-name="Rectangle 3299" width="16" height="16" rx="3" transform="translate(180.258 387.452)" fill="none" />
                    <g id="Diagnostics" transform="translate(-3.761 345.436)">
                      <path id="Path_42896" data-name="Path 42896" d="M674.96,527.144a.229.229,0,0,0,.325,0l1.831-1.831a.23.23,0,1,0-.325-.325l-1.831,1.831a.229.229,0,0,0,0,.325Z" transform="translate(-481.753 -475.857)" fill="#080808" />
                      <path id="Path_42896_-_Outline" data-name="Path 42896 - Outline" d="M674.918,527.178a.4.4,0,0,1-.283-.685l1.83-1.83a.4.4,0,0,1,.67.18.4.4,0,0,1-.1.387L675.2,527.06A.4.4,0,0,1,674.918,527.178Zm1.831-2.291a.058.058,0,0,0-.042.017l-1.831,1.831a.058.058,0,0,0,0,.083.059.059,0,0,0,.083,0l1.831-1.831a.059.059,0,0,0-.026-.1Z" transform="translate(-481.548 -475.653)" fill="#080808" />
                      <path id="Path_42897" data-name="Path 42897" d="M197.4,50.708a.229.229,0,0,0-.325,0l-3.433,3.433a1.373,1.373,0,0,0-1.211-.753,1.348,1.348,0,0,0-.806.27,2.964,2.964,0,0,1-1.6-4.165h.114a1.586,1.586,0,0,0,.844-.245l.725.725a.71.71,0,0,0,.494.211.721.721,0,0,0,.5-.2l1.346-1.348a.709.709,0,0,0,0-1l-3.7-3.707a.707.707,0,0,0-1,0L189,43.594a.945.945,0,0,0-1.327,1.327l.343.341a.707.707,0,0,0,0,1l.776.773a1.567,1.567,0,0,0-.2.492,5.263,5.263,0,0,0,1.108,7.694H188.54a.687.687,0,0,0-.687.687v.687a.458.458,0,0,0,.458.458h8.238a.458.458,0,0,0,.458-.458v-.687a.687.687,0,0,0-.687-.687h-2.6a1.337,1.337,0,0,0,.08-.458,1.2,1.2,0,0,0,0-.128l3.6-3.6a.229.229,0,0,0,0-.325Zm-4.968,3.137a.915.915,0,0,1,.732,1.465l.183.137-.185-.137a.914.914,0,1,1-.73-1.465Zm-2.5-4.826A1.144,1.144,0,0,1,189,47.9a.919.919,0,0,1,.018-.19,1.1,1.1,0,0,1,.24-.535,1.144,1.144,0,1,1,1.613,1.6,1.121,1.121,0,0,1-.943.247Zm-1.6-3.412,1.352-1.352a.245.245,0,0,1,.348,0l3.7,3.7a.245.245,0,0,1,0,.348l-1.343,1.346a.249.249,0,0,1-.35,0l-.7-.687a1.6,1.6,0,0,0-2.259-2.259l-.748-.757a.245.245,0,0,1,0-.343Zm-.478,5.263a4.822,4.822,0,0,1,.746-2.563,1.588,1.588,0,0,0,.963,1.08,3.433,3.433,0,0,0,1.723,4.625,1.373,1.373,0,0,0-.229.748,1.4,1.4,0,0,0,.08.458h-.522a4.806,4.806,0,0,1-2.762-4.348Zm8.7,5.034v.687h-8.238v-.687a.229.229,0,0,1,.229-.229h2.867a1.373,1.373,0,0,0,2.041,0h2.872a.229.229,0,0,1,.229.229Z" transform="translate(-0.204 -0.204)" fill="#080808" />
                      <path id="Path_42897_-_Outline" data-name="Path 42897 - Outline" d="M196.345,57.016h-8.238a.628.628,0,0,1-.628-.628V55.7a.857.857,0,0,1,.857-.857h.647a5.434,5.434,0,0,1-.754-7.6,1.732,1.732,0,0,1,.144-.386l-.684-.682a.879.879,0,0,1-.109-1.106l-.241-.239-.006-.008a1.116,1.116,0,0,1,1.567-1.567l.011.01.248.234a.879.879,0,0,1,1.11.106l3.7,3.708a.88.88,0,0,1,0,1.236L192.617,49.9a.887.887,0,0,1-.62.252h0a.875.875,0,0,1-.613-.261l-.632-.632a1.754,1.754,0,0,1-.816.2h-.01a2.793,2.793,0,0,0,1.473,3.8,1.529,1.529,0,0,1,.829-.249h0a1.544,1.544,0,0,1,1.242.649l3.279-3.279a.4.4,0,0,1,.528-.034l.006,0,.032.032a.4.4,0,0,1,0,.567L193.772,54.5c0,.021,0,.042,0,.064a1.505,1.505,0,0,1-.027.283h2.374a.857.857,0,0,1,.857.857v.687a.628.628,0,0,1-.628.628Zm-8.009-1.831a.516.516,0,0,0-.516.516v.687a.287.287,0,0,0,.287.287h8.238a.287.287,0,0,0,.287-.287V55.7a.516.516,0,0,0-.516-.516h-2.841l.083-.229a1.162,1.162,0,0,0,.07-.4v-.009a1.031,1.031,0,0,0,0-.11l0-.076,3.649-3.653a.058.058,0,0,0,0-.081l0,0a.06.06,0,0,0-.082,0l-3.6,3.6-.106-.21a1.2,1.2,0,0,0-1.059-.659,1.185,1.185,0,0,0-.7.236l-.074.056-.087-.032a3.134,3.134,0,0,1-1.694-4.4l.048-.091h.217a1.413,1.413,0,0,0,.753-.218l.115-.073.822.822a.536.536,0,0,0,.375.161.547.547,0,0,0,.38-.155l1.345-1.347a.539.539,0,0,0,0-.755l-3.695-3.706a.536.536,0,0,0-.756,0l-.117.117-.472-.444a.774.774,0,0,0-1.088,1.084l.457.454-.121.121a.536.536,0,0,0,0,.757l.871.869-.071.115a1.394,1.394,0,0,0-.177.438l-.009.04-.026.032a5.093,5.093,0,0,0,1.072,7.444l.459.312Zm8.18,1.373h-8.58V55.7a.4.4,0,0,1,.4-.4h2.943l.051.057a1.2,1.2,0,0,0,1.787,0l.051-.057h2.948a.4.4,0,0,1,.4.4Zm-8.238-.341h7.9V55.7a.058.058,0,0,0-.017-.041.059.059,0,0,0-.041-.017h-2.8a1.544,1.544,0,0,1-2.188,0h-2.794a.058.058,0,0,0-.058.058Zm3.948-.577a1.085,1.085,0,1,1,0-2.169h0a1.086,1.086,0,0,1,1.086,1.086,1.093,1.093,0,0,1-.126.507l.057.043-.2.274-.06-.045a1.089,1.089,0,0,1-.653.3C192.293,55.638,192.259,55.64,192.226,55.64Zm0-1.828a.743.743,0,1,0,0,1.486c.023,0,.046,0,.069,0A.746.746,0,0,0,192.82,55l.03-.04a.75.75,0,0,0,.121-.407.745.745,0,0,0-.745-.745Zm-1.052,1.373h-.8l-.034-.016a4.965,4.965,0,0,1-2.088-7.157l.21-.333.1.381a1.421,1.421,0,0,0,.86.964l.172.067-.079.166a3.262,3.262,0,0,0,1.637,4.395l.186.081-.112.169a1.2,1.2,0,0,0-.2.654,1.231,1.231,0,0,0,.07.4Zm-.725-.341h.261a1.573,1.573,0,0,1-.028-.286h0a1.54,1.54,0,0,1,.159-.671,3.6,3.6,0,0,1-1.708-4.615,1.766,1.766,0,0,1-.77-.772,4.628,4.628,0,0,0,2.086,6.346Zm1.558-5.152a.418.418,0,0,1-.295-.121l-.812-.8.1-.121a1.431,1.431,0,0,0-2.018-2.018l-.121.1-.86-.871a.416.416,0,0,1-.081-.467l-.014-.022,1.448-1.448a.416.416,0,0,1,.59,0l3.7,3.7a.416.416,0,0,1,0,.59L192.3,49.57A.419.419,0,0,1,192.007,49.692Zm-.645-.944.589.58a.081.081,0,0,0,.111,0l1.342-1.345a.074.074,0,0,0,0-.106l-3.7-3.706a.076.076,0,0,0-.106,0l-1.352,1.352a.074.074,0,0,0,0,.1l.641.649a1.773,1.773,0,0,1,2.472,2.472Zm-1.425.259a1.3,1.3,0,0,1-.248-.024,1.315,1.315,0,0,1-1.067-1.291,1.084,1.084,0,0,1,.021-.22,1.274,1.274,0,0,1,.276-.613,1.316,1.316,0,0,1,.952-.5l.08,0a1.315,1.315,0,0,1,.824,2.34A1.293,1.293,0,0,1,189.938,49.007Zm.013-2.306-.059,0a.975.975,0,0,0-.705.369l0,0a.933.933,0,0,0-.2.453v.008a.748.748,0,0,0-.015.155.973.973,0,0,0,.79.957.95.95,0,0,0,.8-.209l0,0a.973.973,0,0,0-.608-1.734Z" transform="translate(0 0)" fill="#080808" />
                    </g>
                  </g>
                </svg>
                <div class="cart-count" bis_skin_checked="1">0</div>
              </div>
            </Button>
            <Button variant=' ' className='btn-link icon-hover'>
              <div className='position-relative'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                  <g id="mart_cart_icon_16px" transform="translate(-180.258 -387.452)">
                    <rect id="Rectangle_3299" data-name="Rectangle 3299" width="16" height="16" rx="3" transform="translate(180.258 387.452)" fill="none" />
                    <g id="Pharmacy" transform="translate(172.582 379.684)">
                      <path id="Path_42606" data-name="Path 42606" d="M3.588,11.977a3.1,3.1,0,0,1-.444.036,3.13,3.13,0,0,1-2.217-.926A3.074,3.074,0,0,1,0,8.887,3.148,3.148,0,0,1,.926,6.623l5.7-5.7A3.074,3.074,0,0,1,8.822,0a3.14,3.14,0,0,1,2.263.926,3.072,3.072,0,0,1,.925,2.2,3.149,3.149,0,0,1-.925,2.263L9.324,7.108c2.588.146,4.464,1.076,4.464,2.279V11.4c0,1.441-2.633,2.3-5.178,2.3C6.425,13.7,4.182,13.067,3.588,11.977Zm.419-.576c0,.816,1.891,1.726,4.6,1.726s4.6-.91,4.6-1.726v-.928a7.431,7.431,0,0,1-4.6,1.216,7.434,7.434,0,0,1-4.6-1.216ZM1.333,7.03A2.578,2.578,0,0,0,.576,8.882a2.5,2.5,0,0,0,.754,1.795,2.552,2.552,0,0,0,2.1.741c0-.006,0-.011,0-.017V9.387c0-1.028,1.369-1.855,3.381-2.167L3.978,4.386ZM7.05,11a11.071,11.071,0,0,0,1.559.108c2.712,0,4.6-.91,4.6-1.726,0-.548-.856-1.138-2.239-1.467ZM4.006,9.387c0,.555.876,1.153,2.289,1.479l3.928-3.088A11.023,11.023,0,0,0,8.61,7.661C5.9,7.661,4.006,8.571,4.006,9.387ZM7.032,1.331,4.385,3.979,7.537,7.131c.316-.027.646-.041.984-.043l2.16-2.106a2.578,2.578,0,0,0,.755-1.851,2.507,2.507,0,0,0-.754-1.794A2.624,2.624,0,0,0,8.827.577,2.508,2.508,0,0,0,7.032,1.331ZM1.732,7.4l.2-.2.407.407-.2.2a1.406,1.406,0,0,0,0,2.01l-.407.407A1.976,1.976,0,0,1,1.732,7.4Z" transform="translate(8.824 8.916)" fill="#080808" />
                      <path id="Union_155_-_Outline" data-name="Union 155 - Outline" d="M8.433,13.675c-1.96,0-4.357-.537-5.1-1.714a2.958,2.958,0,0,1-.365.025,3.274,3.274,0,0,1-2.323-.97A3.219,3.219,0,0,1-.325,8.71,3.3,3.3,0,0,1,.644,6.341l5.7-5.7a3.224,3.224,0,0,1,2.3-.97h.026a3.3,3.3,0,0,1,2.344.97,3.217,3.217,0,0,1,.968,2.3,3.3,3.3,0,0,1-.968,2.371L9.49,6.806a8.211,8.211,0,0,1,2.927.735c.866.438,1.343,1.031,1.343,1.67v2.013a1.492,1.492,0,0,1-.5,1.073,3.742,3.742,0,0,1-1.233.756A10.021,10.021,0,0,1,8.433,13.675ZM3.494,11.637l.05.091c.519.955,2.576,1.648,4.89,1.648a9.714,9.714,0,0,0,3.488-.6c.576-.233,1.542-.745,1.542-1.552V9.211c0-1.093-1.818-1.989-4.323-2.13L8.8,7.062l2.006-1.954a3,3,0,0,0,.879-2.156A2.921,2.921,0,0,0,10.806.857,3,3,0,0,0,8.671-.026H8.647A2.929,2.929,0,0,0,6.553.855l-5.7,5.7A3.007,3.007,0,0,0-.026,8.708a2.924,2.924,0,0,0,.881,2.1,2.978,2.978,0,0,0,2.114.884,2.926,2.926,0,0,0,.422-.035ZM8.433,13.1a9.269,9.269,0,0,1-3.374-.568c-.875-.355-1.377-.832-1.377-1.307V9.969l.247.214a4.583,4.583,0,0,0,1.788.851,10.642,10.642,0,0,0,2.716.328,10.652,10.652,0,0,0,2.718-.328,4.58,4.58,0,0,0,1.788-.851l.247-.215v1.255c0,.476-.5.952-1.378,1.307A9.277,9.277,0,0,1,8.433,13.1ZM3.98,10.6v.623c0,.338.456.732,1.191,1.031a8.968,8.968,0,0,0,3.262.546,8.975,8.975,0,0,0,3.263-.546c.735-.3,1.191-.693,1.191-1.031V10.6a8.167,8.167,0,0,1-4.454,1.06A8.164,8.164,0,0,1,3.98,10.6Zm-1.013.805a2.692,2.692,0,0,1-1.917-.8,2.651,2.651,0,0,1-.8-1.9,2.728,2.728,0,0,1,.8-1.959L3.8,4,6.949,7.146l-.291.045c-1.976.305-3.253,1.1-3.253,2.02v2.007a.222.222,0,0,1,0,.023v.133l-.132.015A2.717,2.717,0,0,1,2.967,11.407ZM3.8,4.42,1.263,6.959A2.431,2.431,0,0,0,.549,8.7a2.354,2.354,0,0,0,.71,1.687l0,0a2.4,2.4,0,0,0,1.706.714c.046,0,.093,0,.14,0V9.211a1.815,1.815,0,0,1,1.005-1.48,6.376,6.376,0,0,1,2.214-.787Zm4.632,6.666a11.032,11.032,0,0,1-1.581-.111l-.345-.05,4.254-3.344.07.017a5.349,5.349,0,0,1,1.687.673,1.227,1.227,0,0,1,.668.941c0,.476-.5.952-1.378,1.307A9.276,9.276,0,0,1,8.433,11.086Zm-1.186-.362a10.939,10.939,0,0,0,1.186.064,8.975,8.975,0,0,0,3.263-.546c.735-.3,1.191-.693,1.191-1.031,0-.387-.644-.957-2.055-1.306Zm-1.092.127-.07-.016a5.44,5.44,0,0,1-1.722-.674,1.237,1.237,0,0,1-.682-.95c0-.476.5-.953,1.377-1.308a9.259,9.259,0,0,1,3.374-.569,11.229,11.229,0,0,1,1.637.12l.343.051ZM8.433,7.633a8.958,8.958,0,0,0-3.262.547c-.735.3-1.191.694-1.191,1.031,0,.394.659.97,2.1,1.316L9.676,7.7A10.974,10.974,0,0,0,8.433,7.633ZM1.557,10.259l-.106-.106a2.124,2.124,0,0,1,0-3.036l.3-.307.619.619-.307.307a1.256,1.256,0,0,0,0,1.8l.106.105Zm.2-3.025-.094.095a1.823,1.823,0,0,0-.1,2.5l.2-.2a1.553,1.553,0,0,1,.1-2.111l.1-.1ZM7.3,7.108,4,3.8,6.75,1.049a2.65,2.65,0,0,1,1.9-.8h0a2.782,2.782,0,0,1,1.959.8,2.666,2.666,0,0,1,.8,1.9,2.725,2.725,0,0,1-.8,1.957l-2.2,2.148h-.06c-.349,0-.677.018-.973.043ZM4.419,3.8l3,3c.268-.021.558-.033.866-.037L10.4,4.7a2.427,2.427,0,0,0,.71-1.742,2.37,2.37,0,0,0-.709-1.69A2.486,2.486,0,0,0,8.65.551a2.354,2.354,0,0,0-1.688.708Z" transform="translate(9 9.093)" fill="#080808" />
                    </g>
                  </g>
                </svg>
                <div class="cart-count" bis_skin_checked="1">0</div>
              </div>
            </Button>
          </div>
          <Dropdown>
            <Dropdown.Toggle variant=" " id="dropdown-basic" className="custom-btn-dropdown p-0">
              <div className="d-flex align-items-center">
                <div className="text-end line-height-sm">
                  <p className="mb-0 font-weight-bold font-12">{userSessionInfo.userDetails ? userSessionInfo.userDetails.name : ''}</p>
                  <p className="mb-0 text-secondary font-10">Emp ID: {userSessionInfo.userDetails ? userSessionInfo.userDetails.employeeId : ''}</p>
                  <p className="mb-0 text-secondary font-10">{userSessionInfo.userDetails ? userSessionInfo.userDetails.email : ''}</p>
                </div>
                <div className={`username ${userSectionColor} ms-2`} >
                  <span>{userSessionInfo.userDetails ? getUsername(userSessionInfo.userDetails.name) : ''}</span>
                </div>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="custom-dropdown custom-dropdown-menu">
              <Dropdown.Item className="custom-dropdown-item" href="/customer-relations/logout" onClick={() => sessionStorage.removeItem("userColorCode")}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
    </React.Fragment>
  )
}

export default CustomerHeader;