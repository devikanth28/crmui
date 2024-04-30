import { CustomSpinners, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Validate from '../../../../helpers/Validate';
import AgentAppService from '../../../../services/AgentApp/AgentAppService';
import { AGENT_UI } from '../../../../services/ServiceConstants';
import { Wrapper } from '../../../Common/CommonStructure';
import { AgentAppContext, AlertContext } from '../../../Contexts/UserContext';
import { Button } from 'react-bootstrap';

const SearchLocation = (props) => {
    const searchText = props.searchText
    const validate = Validate()
    const [source, setSource] = useState(undefined);
    const [loading, setLoading] = useState(false)
    const { tpaTokenId, locationSearchText, setLocationSearchText } = useContext(AgentAppContext);
    const agentApService = AgentAppService(tpaTokenId)
    const { setToastContent } = useContext(AlertContext);
    const [localitySuggestions, setLocalitySuggestions] = useState([]);
    const [localitySelectedName, setSelectedLocalityName] = useState("");
    const [localitySelectedList, setLocalitySelectedList] = useState([]);
    const [locationLoading, isLocationLoading] = useState(false)
    const [showLocateMeButton, setShowLocateMeButton] = useState(false)

    useEffect(() => {
        if (validate.isNotEmpty(locationSearchText)) {
            getLocalityAutoSuggestions(locationSearchText)
        }
    }, [locationSearchText])

    useEffect(() => {
        if (navigator && 'geolocation' in navigator ) {
            setShowLocateMeButton(true)
        }else{
            console.log("Browser doesn't support geolocation!");
        }
    }, [])

    const getLocalityAutoSuggestions = (searchText) => {
      if(source) {
         source.cancel();
     } 
     const newSource = axios.CancelToken.source();
     setSource(newSource) 
     if (validate.isNotEmpty(searchText) && searchText.trim().length >= 3) {
         setLoading(true);
         let topGoogleLocations = [];
         agentApService.getStoreLocalities({ localityString: searchText } , {cancelToken : newSource.token} ).then((response) => {
             if (validate.isNotEmpty(response) && 'SUCCESS' == response.statusCode) {
                 for (const eachGoogleLocation of response['responseData']) {
                     let commaIndex = eachGoogleLocation.location.indexOf(",");
                     let location = eachGoogleLocation.location;
                     let address = "India";
                     if (location != undefined && location.indexOf(",") != -1) {
                         location = eachGoogleLocation.location.substring(0, commaIndex);
                         address = eachGoogleLocation.location.substring(commaIndex + 1, eachGoogleLocation.location.length);
                     }
                     eachGoogleLocation.mainLocation = location;
                     eachGoogleLocation.address = address;
                     topGoogleLocations.push(eachGoogleLocation);
                     if (topGoogleLocations.length >= 5) {
                         break;
                     }
                 }
                 setLocalitySuggestions(topGoogleLocations);
                  setLoading(false);
                 
             } else if ("FAILURE" == response.statusCode) {
                 console.log("Error: " + response.message);
                 setLocalitySuggestions([]);
                 setLoading(false);
             }
              setSource(undefined);
         }).catch((error) => {
             console.log(error);

         });
         
     }
 };

 const onSearch=(suggestion)=>{
    if (validate.isEmpty(suggestion)) {
        return;
    }
  setLocalitySelectedList(suggestion);
  setSelectedLocalityName(suggestion.location);
  if(validate.isEmpty(suggestion.location)){
      setToastContent({toastMessage:"Please select locality to find stores" , position : TOAST_POSITION.BOTTOM_START});
      return;
  }
  agentApService.setLocality({location: suggestion.location, placeId: suggestion.placeId, lattitude: suggestion.lattitude, longitude: suggestion.longitude }).then( data => {
          if(data && "SUCCESS" == data.statusCode && validate.isNotEmpty(data.responseData)){
              props.history.push(`${AGENT_UI}/searchCustomer`)
          }else{
              setToastContent({toastMessage:"Medplus Advantage is not configured in your location."  , position : TOAST_POSITION.BOTTOM_START});
          }
      }).catch( error =>{
          console.log(error)
          setToastContent({toastMessage: "Unable to get the location, Please try Again..!" , position : TOAST_POSITION.BOTTOM_START});
      })
      
  }

  const locateMe = () => {
    if(locationLoading){
        return
    }
    isLocationLoading(true)
    let successCallback = (position) => {
        let locationObject = {lattitude: position.coords.latitude, longitude: position.coords.longitude}
        agentApService.setLocality(locationObject).then(data => {
                if(data && "SUCCESS" == data.statusCode && validate.isNotEmpty(data.responseData)){
                    isLocationLoading(false)
                    props.history.push(`${AGENT_UI}/searchCustomer`)
                }else{
                    isLocationLoading(false)
                    setToastContent({toastMessage:"Medplus Advantage is not configured in your location." , position : TOAST_POSITION.BOTTOM_START});
                }
        }).catch( error =>{
            console.log(error)
            isLocationLoading(false)
            setToastContent({toastMessage: "Unable to locate your location, Please try Again..!" , position : TOAST_POSITION.BOTTOM_START});
        });
    };
    if ('geolocation' in navigator){ 
        var options = {timeout:6000};
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback ,options);
    }else{
        console.log("Browser doesn't support geolocation!");
    }
  }

  const errorCallback = (code) => {
    isLocationLoading(false)
    console.log(code);
    setToastContent({toastMessage: "Unable to locate your location, Please try Again..!" , position : TOAST_POSITION.BOTTOM_START});
 }

    return (
        <Wrapper className="mx-0">
            <div className="h-100">
                {validate.isNotEmpty(locationSearchText)
                    ? <React.Fragment>
                        
                        <div className="card border-0 h-100">
                            <div className="card-header border-dark bg-white">Search Results</div>
                            <div className='body-height h-100 p-0'>
                                <ul className="list-group list-group-flush">
                                    {localitySuggestions.length > 0 &&
                                        <React.Fragment>
                                            {localitySuggestions.map((suggestion, index) => (
                                                <li key={index} class="list-group-item d-flex align-items-center justify-content-between pointer btn-link" onClick={() => onSearch(suggestion)}>
                                                    <div>
                                                        <p className='mb-0'>{suggestion.mainLocation}</p>
                                                        <p className='font-12 text-secondary mb-0'>{suggestion.location}</p>
                                                    </div>
                                                    <div className='d-flex align-items-center ps-1'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                            <g id="leftchevron_black_icon_18px" transform="translate(0 18) rotate(-90)">
                                                                <rect id="Rectangle_4722" data-name="Rectangle 4722" width="18" height="18" fill="none" />
                                                                <path id="Path_23401" data-name="Path 23401" d="M4.43,5.773.274,1.617A.942.942,0,1,1,1.606.285L5.1,3.765,8.587.274A.945.945,0,0,1,10.2.94a.936.936,0,0,1-.279.666L5.762,5.773A.945.945,0,0,1,4.43,5.773Z" transform="translate(4.08 6.191)" fill="#080808" />
                                                            </g>
                                                        </svg>
                                                    </div>
                                                </li>
                                            ))
                                            }
                                        </React.Fragment>}
                                </ul>
                            </div>
                        </div>
                        
                    </React.Fragment>
                    : showLocateMeButton ? <div className='body-height  h-100'>
                        <div className='border d-flex justify-content-between align-items-center p-2'>
                            <div>
                                <p className='mb-0'>Use current location</p>
                                <p className='text-muted font-10 mb-0'>Using GPS</p>
                            </div>
                            <div>
                                <Button variant='dark' className='font-12' disabled={locationLoading} onClick={locateMe}>{locationLoading ? <CustomSpinners spinnerText={"Locate Me"} className={" spinner-position"} innerClass={"invisible"} />: "Locate Me"}</Button>
                            </div>
                        </div>
                    </div>: <></>
                }
                {loading &&
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <CustomSpinners outerClassName={"align-items-center d-flex custom-spinner flex-column page-loader"} innerClass={"custom-spinner-text-width"} animation="border" variant="brand" />
                    </div>
                }
            </div>
        </Wrapper>
    );
}

export default SearchLocation