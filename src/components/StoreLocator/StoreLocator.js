import React, { useEffect, useRef, useState ,useContext } from "react";
import Validate from "../../helpers/Validate";
import CRMService from "../../services/CRM/CRMService";
import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import { AlertContext, SidebarContext } from "../Contexts/UserContext";
import NoDataFound from "../Common/NoDataFound";
import qs from 'qs';
import SeachNow from "../Common/SearchNow";
import { Button } from "react-bootstrap";
/* import  LocalitySearchComponent from '@medplus/react-common-components/LocalitySearchComponent'; */

const StoreLocator = props => {
    const [loading, setLoading] = useState(false);
    const [storesList, setStoresList] = useState([]);
    const localityService = CRMService();
    const [sourceLatLong, setSourceLatLong] = useState('');
    const [searchLocation, setSearchLocation] = useState(undefined);
    const [newStores, setNewStores]=useState([])
    const headerRef = useRef(null);
    const validate = Validate();
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const { setStackedToastContent } = useContext(AlertContext);
    const { sidebarCollapsedFlag } = useContext(SidebarContext);


    useEffect(() => {
        if(validate.isNotEmpty(params)){
            getSelectedLocalityLatLong(params.location);
        }
    }, [props.location.search]);

    const getSelectedLocalityLatLong = (location) => {
        if(validate.isNotEmpty(location)){
            setLoading(true);
        }
        if(validate.isEmpty(location)){
            return;
        }
        let locationObject = { location : location }
        localityService.getStoreLocalityInfo({locationAddress : JSON.stringify(locationObject)}).then(async response => {
            if(validate.isNotEmpty(response) && response.statusCode === "SUCCESS") {
                getStoresInfo(response.dataObject['MART'].locationLatLong);
            } else if("FAILURE" == response.statusCode) {
                console.log("Error: "+ response.message);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    const getStoresInfo = async (latLong) => {
        setSourceLatLong(latLong);
        const data = await getStores(latLong);
        if(validate.isEmpty(data)){
            setStackedToastContent({toastMessage:"NO Data Found"});
            return
        }
        setStoresList(validate.isNotEmpty(data.storesList) ? data.storesList : []);
        setNewStores(validate.isNotEmpty(data.storesList) ? data.storesList : []);
        setLoading(false);
    }

    const getStores = async (latLong) => {
        return await CRMService().getStoresInfo({ latLong: latLong }).then(res => {
            if (validate.isNotEmpty(res) && validate.isNotEmpty(res.dataObject) && validate.isNotEmpty(res.statusCode) && "SUCCESS" === res.statusCode) {
                return res.dataObject;
            }
        }).catch(function (error) {
            setLoading(false);
            console.log(error);
        })
    }

    const redirectToGoogleMaps = destinationLocation => {
        if (validate.isNotEmpty(destinationLocation)) {
            window.open(`https://www.google.com/maps?saddr=${sourceLatLong}&daddr=${destinationLocation}`);
        }
    }



    const handleSearchLocation = (e) =>{
        const inputValue = e.target.value;
        setSearchLocation(inputValue);
        if(validate.isEmpty(e.target.value)){
            setNewStores(storesList)
        }
        else {
            const filterdLocations = storesList.filter((eachStore)=>{
                return eachStore.name_s.toUpperCase().includes(inputValue.toUpperCase())
            })
            setNewStores(filterdLocations);
        }
        
    }
    return (
        <React.Fragment>
            <Wrapper showHeader={false}>
                <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex px-3 py-2">
                    <div className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><g transform="translate(0 0.406)"><circle cx="18" cy="18" r="18" transform="translate(0 -0.406)" fill="#f5f5f7"></circle><g transform="translate(8.2 7.794)"><g transform="translate(0 0)"><rect width="21" height="21" transform="translate(-0.2 -0.2)" fill="none"></rect></g><g transform="translate(3.086 0)"><path d="M.85,10.868A7.6,7.6,0,0,1,2.033,2.184,7.219,7.219,0,0,1,7.418,0h.208a7.2,7.2,0,0,1,5.343,2.184,7.581,7.581,0,0,1,1.173,8.683A89.94,89.94,0,0,1,7.48,21,92.707,92.707,0,0,1,.85,10.868ZM3.008,3.129a6.2,6.2,0,0,0-.965,7.108A80.551,80.551,0,0,0,7.48,18.711a78.765,78.765,0,0,0,5.468-8.474,6.181,6.181,0,0,0-.955-7.1A5.813,5.813,0,0,0,7.626,1.376H7.418A5.8,5.8,0,0,0,3.008,3.129ZM4.09,7.187A3.41,3.41,0,1,1,7.5,10.6,3.408,3.408,0,0,1,4.09,7.187Zm1.3.01A2.11,2.11,0,1,0,7.5,5.087,2.11,2.11,0,0,0,5.391,7.2Z" transform="translate(-0.286 -0.2)"></path></g></g></g></svg>
                        <p className="mb-0 fw-medium ps-2">{params.location ? params.location : 'Find a MedPlus Store'}</p>
                    </div>
                  
                    <Button variant="link link-primary link-sm" onClick={()=>{   window.location.replace(window.location.pathname);}}>Change Location</Button>
                  

                </HeaderComponent>
                {/* <LocalitySearchComponent /> */}
                <BodyComponent loading={loading} allRefs={{ headerRef }} className="body-height" >
                    {validate.isEmpty(storesList) ? validate.isNotEmpty(params) && !loading && <NoDataFound text={"No stores found"}/> : !loading && storesList && validate.isNotEmpty(storesList) &&
                            <div className="h-100">
                            <div className="input-group storeLocatorSearch">                                
                                    <input type="text" className="form-control mb-3" placeholder="Filter Locations" aria-label="Filter Locations" aria-describedby="Filter Locations" value={searchLocation} onChange={(e)=>{handleSearchLocation(e)}}/>
                                    <div className="input-group-append position-absolute z-10" onClick={(e)=>{handleSearchLocation(e)}}>
                                        <button className="btn-close btn btn-sm" type="button"></button>
                                    </div>
                            </div>
                                {/* <input type="search" autocomplete="off" className="form-control mb-3" style={{'width':`calc(33.33% - 1rem)`}}  aria-describedby="Filter Locations" value={searchLocation} onChange={(e)=>{handleSearchLocation(e)}} placeholder="Filter Locations"/> */}
                                <div className="address-container near-by-store-info gap-3">
                                    {newStores.map((store) => {
                                        return (
                                            <React.Fragment>
                                                <address className={`address-outline address-no-style px-3 store-info rounded cursor-auto ${!sidebarCollapsedFlag ? "three-column m-0" : "four-column m-0"}`}>
                                                    <div className="d-flex justify-content-between">
                                                        {validate.isNotEmpty(store.name_s) && <p className="title">{store.name_s}</p>}
                                                        {validate.isNotEmpty(store.dist) && <p className='distance'>{store.dist.toFixed(2)} Kms </p>}
                                                    </div>
                                                    {validate.isNotEmpty(store.address_s) && <p className="text-capitalize mb-3 text-secondary font-12" style={{ "wordWrap": "break-word" }}>
                                                        {store.address_s}
                                                    </p>}

                                                    {validate.isNotEmpty(store.phoneNumber_s) &&
                                                        <a className="text-primary btn btn-link btn-sm me-2" style={{'margin-left':'-0.5rem'}} onClick={() => window.open(`tel:+91 ${store.phoneNumber_s}`)} title="Call to Store" href="javascript:void(0);">
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
                                                            {store.phoneNumber_s}</a>
                                                    }
                                                    {
                                                        validate.isNotEmpty(store.locationLatLong) &&
                                                        <a className="text-primary btn btn-link btn-sm"  onClick={() => redirectToGoogleMaps(store.locationLatLong)} title="Get Directions" href="javascript:void(0);">
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
                                                        
                                                        // <span style={{ "cursor": "pointer", "color": "blue", "text-decoration": "underline" }} onClick={() => redirectToGoogleMaps(store.locationLatLong)}>Get Directions</span>
                                                    }
                                                    {/* <a className="text-primary btn btn-link btn-sm mr-n2"  target="_blank" title="Get Directions">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <g id="Group_5452" data-name="Group 5452" transform="translate(-336.08 -141.659)">
                  <rect id="Rectangle_3144" data-name="Rectangle 3144" width="16" height="16" transform="translate(336.08 141.659)" fill="none" />
                  <g id="Group_5451" data-name="Group 5451" transform="translate(336.335 141.914)">
                    <g id="Group_5449" data-name="Group 5449">
                      <path id="Path_2570" data-name="Path 2570" d="M347.527,145.064a7.872,7.872,0,1,0,7.872,7.872A7.882,7.882,0,0,0,347.527,145.064Zm0,14.878a7.006,7.006,0,1,1,7.006-7.006A7.014,7.014,0,0,1,347.527,159.942Z" transform="translate(-339.655 -145.064)" fill="#404040" />
                    </g>
                    <g id="Group_5450" data-name="Group 5450" transform="translate(3.264 4.026)">
                      <path id="Path_2571" data-name="Path 2571" d="M350.8,150.1a.861.861,0,0,0-.394.1l-6.2,3.186a.866.866,0,0,0,.212,1.615l2.611.568a.119.119,0,0,1,.084.067l1.112,2.429a.866.866,0,0,0,1.623-.138l1.789-6.736a.867.867,0,0,0-.3-.895h0A.861.861,0,0,0,350.8,150.1Zm-1.844,7.263a.118.118,0,0,1-.109-.07l-1.139-2.485-2.671-.581a.12.12,0,0,1-.03-.224l5.472-2.813a.119.119,0,0,1,.13.013.121.121,0,0,1,.041.125l-1.578,5.946a.12.12,0,0,1-.106.089Z" transform="translate(-343.741 -150.104)" fill="#404040" />
                    </g>
                  </g>
                </g>
              </svg>
              Get Directions
            </a> */}

                                                    {/* { <a className='mr-2 small btn btn-link btn-sm ml-n2 text-primary' title ="Check Center Timings" href="javascript:void(0)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <g id="Group_5460" data-name="Group 5460" transform="translate(-2750 -4333)">
                  <rect id="Rectangle_2076" data-name="Rectangle 2076" width="16" height="16" transform="translate(2750 4333)" fill="none" />
                  <path id="Union_25" data-name="Union 25" d="M2.345,13.656A8,8,0,1,1,13.657,2.344,8,8,0,1,1,2.345,13.656ZM1.12,8.008A6.88,6.88,0,1,0,8,1.12,6.89,6.89,0,0,0,1.12,8.008Zm6.548,1.8a.552.552,0,0,1-.392-.157.54.54,0,0,1-.165-.385V5.882a.549.549,0,0,1,1.1,0V8.709h1.971a.549.549,0,0,1,0,1.1Z" transform="translate(2750 4333)" fill="#404040" />
                </g>
              </svg>
              Check Center Timings
            </a>} */}
                                                </address>
                                            </React.Fragment>
                                        )
                                    })}
                                </div>
                                {/* <CommonDataGrid {...dataGrid} dataSet={dataSet} selectedRows={selectedRows} onRowSelectionCallback={setSelectedRows} callBackMap={callBackMapping} remoteDataFunction={remoteDataFunction} /> */}
                            </div>
                    }
                    {validate.isEmpty(params) && <SeachNow message={'To see the store list, select a locality.'} />}
                </BodyComponent>
            </Wrapper>
        </React.Fragment>
    )
}

export default StoreLocator;