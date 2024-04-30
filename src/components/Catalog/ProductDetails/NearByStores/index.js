import React, { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import Validate from '../../../../helpers/Validate';
import NoDataFoundIcon from '../../../../images/No-Data-Found.svg';
import { LocalityContext } from '../../../Contexts/UserContext';

const NearByStores=(props)=>{
	const storeInfo = props.storeInfo;
    const validate = Validate();
    const { martLocality, labLocality } = useContext(LocalityContext);
    const convertStoreInfoToList = (storeInfo) => {
        let storeList = [];
    
        Object.keys(storeInfo.results).forEach(key => {
            storeList.push(storeInfo.results[key]);
        });
    
        return storeList;
    }
    
    const getDirection = (selectedStore) =>{
        let direction = ''
        let locality = props.isForLabs ? labLocality : martLocality;
        if (validate.isNotEmpty(selectedStore?.locationLatLong) && validate.isNotEmpty(locality?.locationLatLong)){
            direction = "http://maps.google.com/?saddr=" + locality.locationLatLong+"&daddr="+selectedStore.locationLatLong 
        }
        return direction
    }
    const CloseButton = <Button variant="link" className="align-self-center icon-hover rounded-5" type="button" onClick={() => props.setOpenlocationflag(!props.openlocationflag)}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <rect fill="none" width="24" height="24" />
      <path d="M20.76,19.55l-7.58-7.56,7.56-7.56a.846.846,0,0,0-.04-1.18.822.822,0,0,0-1.13,0L12,10.81,4.44,3.24A.827.827,0,0,0,3.27,4.41l7.56,7.58L3.27,19.55a.835.835,0,0,0,1.14,1.22l.04-.04L12,13.17l7.56,7.56a.833.833,0,0,0,1.17,0h0a.821.821,0,0,0,.04-1.16A.031.031,0,0,0,20.76,19.55Z" fill="#b9b9b9" />
    </svg>
  </Button>


   
  return (
    <React.Fragment>
        <Modal className='modal-dialog-centered modal-xl crm-customer-app' isOpen={props.openlocationflag}>
            <ModalHeader className='d-flex justify-content-between align-items-center border-bottom px-3 py-2' close={CloseButton} >
                Available in Stores
            </ModalHeader>
            <ModalBody>{
                validate.isEmpty(storeInfo) &&
                    <div style={{marginTop: "5rem",marginBottom: "5rem"}}>
                        <div className="text-center">
                              <img src={NoDataFoundIcon} alt="No Data Found" />
                              {props.fromLab ? <>
                                  <p className="mb-0">The Test {props.productName}</p>
                                  <p className="mb-0">is not Available in any nearby Test centers..!</p>
                              </> : <>
                                      <p className="mb-0">The Product {props.productName}</p>
                                      <p className="mb-0">is not Available in any nearby Stores..!</p>
                              </>}
                            {props.searchButton ? <Button variant="dark" className="mt-3" onClick={() => loadPage()}>Search Again</Button> : null }
                        </div>
                    </div>
                }
                  {validate.isNotEmpty(storeInfo) && <div className='address-container near-by-store-info gap-3'>
                      {props.fromLab ? <>
                          {storeInfo.map((eachStore) => {
                              return (
                                  <>
                                      <address className='`address-outline address-no-style one-column three-column px-3 store-info rounded cursor-auto m-0'>
                                          <div className='d-flex justify-content-between'>
                                              <p className="title" >{eachStore.name}</p>
                                          </div>
                                          <p className="text-capitalize mb-3 text-secondary font-12 text-break">{eachStore.address}</p>

                                          <a className="text-primary btn btn-link btn-sm me-2" style={{ 'margin-left': '-0.5rem' }} title="Call to Store" href={`tel:${eachStore.phoneNumber}`}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="me-2">
                                                  <g id="Group_1501" data-name="Group 1501" transform="translate(0.842 0.487)">
                                                      <rect id="Rectangle_2075" data-name="Rectangle 2075" width="16" height="16" transform="translate(-0.842 -0.487)" fill="none" />
                                                        <g id="Group_1500" data-name="Group 1500" transform="translate(-0.081 0.069)">
                                                          <path id="Path_1067" data-name="Path 1067" d="M13.152,11.537,11.2,10.173a1.789,1.789,0,0,0-2.431.434l-.312.45A17.1,17.1,0,0,1,6.279,9.2,17.193,17.193,0,0,1,4.42,7.019l.45-.312A1.747,1.747,0,0,0,5.3,4.268L3.94,2.325a1.753,1.753,0,0,0-2-.655,3.21,3.21,0,0,0-.564.274L1.1,2.15a1.661,1.661,0,0,0-.213.19A2.952,2.952,0,0,0,.13,3.681C-.449,5.868.96,9.137,3.65,11.827c2.248,2.248,4.968,3.65,7.094,3.65a4.229,4.229,0,0,0,1.052-.13,2.952,2.952,0,0,0,1.341-.754,2.284,2.284,0,0,0,.206-.236l.2-.282a2.736,2.736,0,0,0,.259-.541A1.707,1.707,0,0,0,13.152,11.537Zm-.373,1.623h0a2.043,2.043,0,0,1-.145.312l-.16.236c-.03.038-.069.076-.1.114a1.87,1.87,0,0,1-.853.472,3,3,0,0,1-.77.091c-1.844,0-4.267-1.28-6.324-3.33C2.042,8.672.709,5.754,1.189,3.963a1.87,1.87,0,0,1,.472-.853.845.845,0,0,1,.084-.084l.229-.168a2.4,2.4,0,0,1,.343-.168.828.828,0,0,1,.2-.03.66.66,0,0,1,.533.29L4.412,4.9a.668.668,0,0,1,.107.5.653.653,0,0,1-.274.419l-.884.617a.552.552,0,0,0-.152.739,17.027,17.027,0,0,0,2.3,2.8,17.027,17.027,0,0,0,2.8,2.3.546.546,0,0,0,.739-.152l.617-.884a.642.642,0,0,1,.427-.259.693.693,0,0,1,.5.1l1.951,1.364A.622.622,0,0,1,12.779,13.16Z" transform="translate(-0.001 -0.518)" fill="#404040" />
                                                          <path id="Path_1068" data-name="Path 1068" d="M15.287,2.445a7.728,7.728,0,0,0-5-2.255A.548.548,0,0,0,9.71.7a.556.556,0,0,0,.511.579A6.68,6.68,0,0,1,16.461,7.52a.545.545,0,0,0,.571.511h0a.546.546,0,0,0,.511-.579A7.7,7.7,0,0,0,15.287,2.445Z" transform="translate(-2.312 -0.189)" fill="#404040" />
                                                          <path id="Path_1069" data-name="Path 1069" d="M9.02,4.32a4.872,4.872,0,0,1,4.557,4.557.558.558,0,0,0,.579.511h0a.548.548,0,0,0,.511-.579A5.958,5.958,0,0,0,9.1,3.23a.58.58,0,0,0-.587.511A.551.551,0,0,0,9.02,4.32Z" transform="translate(-2.026 -0.913)" fill="#404040" />
                                                      </g>
                                                  </g>
                                              </svg>
                                              {eachStore.phoneNumber}
                                          </a>
                                          <a className="text-primary btn btn-link btn-sm" title="Get Directions" href={getDirection(eachStore)}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="me-2">
                                                  <g id="Group_5452" data-name="Group 5452" transform="translate(-336.08 -141.659)">
                                                      <rect id="Rectangle_3144" data-name="Rectangle 3144" width="16" height="16" transform="translate(336.08 141.659)" fill="none"></rect>
                                                      <g id="Group_5451" data-name="Group 5451" transform="translate(336.335 141.914)">
                                                          <g id="Group_5449" data-name="Group 5449"><path id="Path_2570" data-name="Path 2570" d="M347.527,145.064a7.872,7.872,0,1,0,7.872,7.872A7.882,7.882,0,0,0,347.527,145.064Zm0,14.878a7.006,7.006,0,1,1,7.006-7.006A7.014,7.014,0,0,1,347.527,159.942Z" transform="translate(-339.655 -145.064)" fill="#404040"></path></g>
                                                          <g id="Group_5450" data-name="Group 5450" transform="translate(3.264 4.026)"><path id="Path_2571" data-name="Path 2571" d="M350.8,150.1a.861.861,0,0,0-.394.1l-6.2,3.186a.866.866,0,0,0,.212,1.615l2.611.568a.119.119,0,0,1,.084.067l1.112,2.429a.866.866,0,0,0,1.623-.138l1.789-6.736a.867.867,0,0,0-.3-.895h0A.861.861,0,0,0,350.8,150.1Zm-1.844,7.263a.118.118,0,0,1-.109-.07l-1.139-2.485-2.671-.581a.12.12,0,0,1-.03-.224l5.472-2.813a.119.119,0,0,1,.13.013.121.121,0,0,1,.041.125l-1.578,5.946a.12.12,0,0,1-.106.089Z" transform="translate(-343.741 -150.104)" fill="#404040"></path></g>
                                                      </g>
                                                  </g>
                                              </svg>
                                              Get Directions</a>
                                      </address>
                                  </>
                              )
                          })}
                      </> : <>
                      
                {convertStoreInfoToList(storeInfo).map((item) => {
                    return (
                        <React.Fragment>
                            <address className='`address-outline address-no-style one-column three-column px-3 store-info rounded cursor-auto m-0'>
                                <div className='d-flex justify-content-between'>
                                    <p className="title" >{item.name_s}</p>
                                    <p className='distance'>{Math.round(item.dist * 100) / 100} Kms</p>
                                </div>
                                <p className="text-capitalize mb-3 text-secondary font-12 text-break">{item.address_s}</p>
                                {!props.labFlag && <p className='mb-3 font-12'>Stock Availability : <span>{Math.floor(item.avlQty)}</span></p>}
                                
                                <a className="text-primary btn btn-link btn-sm me-2" style={{ 'margin-left': '-0.5rem' }} title="Call to Store" href={`tel:${item.phoneNumber_s}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="me-2">
                                        <g id="Group_1501" data-name="Group 1501" transform="translate(0.842 0.487)">
                                            <rect id="Rectangle_2075" data-name="Rectangle 2075" width="16" height="16" transform="translate(-0.842 -0.487)" fill="none" />                                                    <g id="Group_1500" data-name="Group 1500" transform="translate(-0.081 0.069)">
                                                <path id="Path_1067" data-name="Path 1067" d="M13.152,11.537,11.2,10.173a1.789,1.789,0,0,0-2.431.434l-.312.45A17.1,17.1,0,0,1,6.279,9.2,17.193,17.193,0,0,1,4.42,7.019l.45-.312A1.747,1.747,0,0,0,5.3,4.268L3.94,2.325a1.753,1.753,0,0,0-2-.655,3.21,3.21,0,0,0-.564.274L1.1,2.15a1.661,1.661,0,0,0-.213.19A2.952,2.952,0,0,0,.13,3.681C-.449,5.868.96,9.137,3.65,11.827c2.248,2.248,4.968,3.65,7.094,3.65a4.229,4.229,0,0,0,1.052-.13,2.952,2.952,0,0,0,1.341-.754,2.284,2.284,0,0,0,.206-.236l.2-.282a2.736,2.736,0,0,0,.259-.541A1.707,1.707,0,0,0,13.152,11.537Zm-.373,1.623h0a2.043,2.043,0,0,1-.145.312l-.16.236c-.03.038-.069.076-.1.114a1.87,1.87,0,0,1-.853.472,3,3,0,0,1-.77.091c-1.844,0-4.267-1.28-6.324-3.33C2.042,8.672.709,5.754,1.189,3.963a1.87,1.87,0,0,1,.472-.853.845.845,0,0,1,.084-.084l.229-.168a2.4,2.4,0,0,1,.343-.168.828.828,0,0,1,.2-.03.66.66,0,0,1,.533.29L4.412,4.9a.668.668,0,0,1,.107.5.653.653,0,0,1-.274.419l-.884.617a.552.552,0,0,0-.152.739,17.027,17.027,0,0,0,2.3,2.8,17.027,17.027,0,0,0,2.8,2.3.546.546,0,0,0,.739-.152l.617-.884a.642.642,0,0,1,.427-.259.693.693,0,0,1,.5.1l1.951,1.364A.622.622,0,0,1,12.779,13.16Z" transform="translate(-0.001 -0.518)" fill="#404040" />
                                                <path id="Path_1068" data-name="Path 1068" d="M15.287,2.445a7.728,7.728,0,0,0-5-2.255A.548.548,0,0,0,9.71.7a.556.556,0,0,0,.511.579A6.68,6.68,0,0,1,16.461,7.52a.545.545,0,0,0,.571.511h0a.546.546,0,0,0,.511-.579A7.7,7.7,0,0,0,15.287,2.445Z" transform="translate(-2.312 -0.189)" fill="#404040" />
                                                <path id="Path_1069" data-name="Path 1069" d="M9.02,4.32a4.872,4.872,0,0,1,4.557,4.557.558.558,0,0,0,.579.511h0a.548.548,0,0,0,.511-.579A5.958,5.958,0,0,0,9.1,3.23a.58.58,0,0,0-.587.511A.551.551,0,0,0,9.02,4.32Z" transform="translate(-2.026 -0.913)" fill="#404040" />
                                        </g>
                                        </g>
                                    </svg>
                                {item.phoneNumber_s}
                                </a>
                                <a className="text-primary btn btn-link btn-sm"  title="Get Directions" href={getDirection(item)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"  className="me-2">
                                        <g id="Group_5452" data-name="Group 5452" transform="translate(-336.08 -141.659)">
                                            <rect id="Rectangle_3144" data-name="Rectangle 3144" width="16" height="16" transform="translate(336.08 141.659)" fill="none"></rect>
                                            <g id="Group_5451" data-name="Group 5451" transform="translate(336.335 141.914)">
                                                <g id="Group_5449" data-name="Group 5449"><path id="Path_2570" data-name="Path 2570" d="M347.527,145.064a7.872,7.872,0,1,0,7.872,7.872A7.882,7.882,0,0,0,347.527,145.064Zm0,14.878a7.006,7.006,0,1,1,7.006-7.006A7.014,7.014,0,0,1,347.527,159.942Z" transform="translate(-339.655 -145.064)" fill="#404040"></path></g>
                                                 <g id="Group_5450" data-name="Group 5450" transform="translate(3.264 4.026)"><path id="Path_2571" data-name="Path 2571" d="M350.8,150.1a.861.861,0,0,0-.394.1l-6.2,3.186a.866.866,0,0,0,.212,1.615l2.611.568a.119.119,0,0,1,.084.067l1.112,2.429a.866.866,0,0,0,1.623-.138l1.789-6.736a.867.867,0,0,0-.3-.895h0A.861.861,0,0,0,350.8,150.1Zm-1.844,7.263a.118.118,0,0,1-.109-.07l-1.139-2.485-2.671-.581a.12.12,0,0,1-.03-.224l5.472-2.813a.119.119,0,0,1,.13.013.121.121,0,0,1,.041.125l-1.578,5.946a.12.12,0,0,1-.106.089Z" transform="translate(-343.741 -150.104)" fill="#404040"></path></g>
                                             </g>
                                         </g>
                                    </svg>
                                    Get Directions</a>
                            </address>
                        </React.Fragment>
                    )
                }
                )}
                      </>}

                </div>}
            </ModalBody>
        </Modal>
    </React.Fragment>
  )
}

export default NearByStores