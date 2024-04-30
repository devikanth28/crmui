import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import Validate from '../../helpers/Validate';
import CRMService from '../../services/CRM/CRMService';
import { CRM_UI } from '../../services/ServiceConstants';
import  { getNotNullCriteria } from '../../helpers/HelperMethods';
import qs from 'qs';
import { AgentAppContext, AlertContext, LocalityContext, UserContext } from '../Contexts/UserContext';
import  { CustomSpinners, Loader, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import axios from 'axios';



const LocalitySearchComponent = (props) => {
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const validate = Validate();
    const localityService = CRMService();
    const [isLoading, setLoading] = useState(false);
    const [searchString,setSearchedString] = useState(false)
    const [localitySuggestions, setLocalitySuggestions] = useState([]);
    const localitySearchInputRef = useRef();
    const [localitySelectedName, setSelectedLocalityName] = useState("");
    const [localitySelectedList, setLocalitySelectedList] = useState(validate.isNotEmpty(props.localitySelectedList)?props.localitySelectedList:[]);
    const [locationLatLong,setLocationLatLong] = useState(undefined);
    const [source, setSource] = useState(undefined);
    const [showCancelButton, setShowCancelButton] = useState(true);     

    const userSessionInfo = useContext(UserContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const {martLocality, isLocalityComponentNeeded,reloadLocality} = useContext(LocalityContext);

    useEffect(()=>{
        if(validate.isNotEmpty(martLocality)){
            const localityInfo = {pincode:martLocality?.pincode || null, mainLocation:martLocality?.combination, placeId:martLocality?.placeId,location:martLocality?.combination}
            setLocalitySuggestions([localityInfo]);
            if(validate.isEmpty(localitySelectedName)){
                setSelectedLocalityName(martLocality.combination)
            }
            setLocalitySelectedList([{mainLocation:validate.isNotEmpty(localitySelectedName)?localitySelectedName: martLocality.combination,...martLocality,location:martLocality?.combination}]);
        }
      //  localitySearchInputRef.current.focus();
    },[martLocality,reloadLocality])

    useEffect(()=>{
        if(validate.isNotEmpty(params)){
            if(params.location){
                let selectedLocation = [{"mainLocation" : params.location?.split(",").map((eachWord)=>{return eachWord.trim()})[0]}];
                setLocalitySelectedList(selectedLocation);
            }
        }
    },[props.location.search])

    const getLocalityAutoSuggestions = (searchText) => {
         if(source) {
            source.cancel();
        } 
        const newSource = axios.CancelToken.source();
        setSource(newSource) 
        if (validate.isNotEmpty(searchText) && searchText.trim().length >= 3) {
            setLoading(true);
            let topGoogleLocations = [];
            localityService.getStoreLocalities({ localityString: searchText } , {cancelToken : newSource.token} ).then((response) => {
                if (validate.isNotEmpty(response) && 'SUCCESS' == response.statusCode) {
                    for (const eachGoogleLocation of response.dataObject) {
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

    const onSearch=(e)=>{
        e?.preventDefault();
        if(validate.isEmpty(localitySelectedName)){
            setStackedToastContent({toastMessage:"Please select locality to find stores" , position : TOAST_POSITION.BOTTOM_START});
            return;
        }
        let parameters = {location:localitySelectedName,v:Date.now()};
        props.history.push(`${CRM_UI}/storeLocator?${getNotNullCriteria(parameters)}`);
    }

    const localitySelection = (selectedLocality) => {
        props.selectedLocalityInfo(selectedLocality);
        if(validate.isNotEmpty(selectedLocality) && (validate.isEmpty(localitySearchInputRef?.current?.props?.options) || localitySuggestions.length>0) && localitySearchInputRef?.current?.isMenuShown){
            setSearchedString(false);
        }
        setLocalitySelectedList(selectedLocality);
        let selectedLocalityName = "";
        selectedLocality.map((eachLocality) => {
            selectedLocalityName = eachLocality.location;
        });
        setSelectedLocalityName(selectedLocalityName);
    }

    /* const handleEnterEvent = (e) => {
        e.preventDefault();
        const searchText = e.target.value;
        if(validate.isNotEmpty(searchText) && searchText.trim().length >= 3){
            if(localitySuggestions.length > 0){
                let localityArray=[];
                localitySelection( localityArray.concat(localitySuggestions[0]));
                onSearch(e);
            }
        }
    } */
    
    const handleonClear = (e) => {
       e.preventDefault();
       localitySearchInputRef.current.clear();
       setLocalitySelectedList([]);
       setLocalitySuggestions([]);
       setLocationLatLong(undefined);
       setShowCancelButton(false);
    }

    return (
        <React.Fragment>
        { validate.isNotEmpty(martLocality) && userSessionInfo ?
        <form className={`form-inline locality-dropdown ${props?.requestFrom && "Bio" == props?.requestFrom ? "w-100 d-flex justify-content-end" : ""}`} data-type="locality-search" onSubmit={()=>{return false;}}>
            <Form.Group className={`custom-form-elements custom-search-dropdown`} style={props.minHeightRequired ? (searchString  && localitySearchInputRef?.current?.isMenuShown) ? {'min-height':String(localitySuggestions.length>0?184+localitySuggestions.length*44:134)+'px'}:{'min-height':localitySelectedList.length>0?'134px':'unset'} : {}}>
                <div class="row g-2" id="group2" htmlelementtype="ELEMENTGROUP" index="0">
                   {props?.requestFrom && "Bio" != props?.requestFrom && <label for="group2" class="font-weight-bold custom-fieldset">Locality</label>}
                    <div class="col-12 px-0 catalog-search">
                        <div className='search-icons location-icon'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                <g id="location_black_icon_24px" transform="translate(-48.941 -142.962)">
                                    <rect id="Rectangle_3286" data-name="Rectangle 3286" width="24" height="24" transform="translate(48.941 142.962)" fill="none" />
                                    <g id="Group_14535" data-name="Group 14535">
                                        <path id="Union_130" data-name="Union 130" d="M-4748.071-675.757a8.605,8.605,0,0,1,1.363-9.931,8.44,8.44,0,0,1,6.228-2.494h.241a8.419,8.419,0,0,1,6.177,2.494,8.607,8.607,0,0,1,1.361,9.931,104.129,104.129,0,0,1-7.707,11.576A106.367,106.367,0,0,1-4748.071-675.757Zm2.493-8.854a7.039,7.039,0,0,0-1.111,8.128,91.342,91.342,0,0,0,6.287,9.685,89.372,89.372,0,0,0,6.321-9.685,7.043,7.043,0,0,0-1.112-8.128,6.76,6.76,0,0,0-5.046-2.01h-.241A6.742,6.742,0,0,0-4745.579-684.611Zm1.1,4.747a4.1,4.1,0,0,1,4.1-4.1,4.1,4.1,0,0,1,4.1,4.1,4.1,4.1,0,0,1-4.1,4.1A4.1,4.1,0,0,1-4744.482-679.864Zm1.559,0a2.539,2.539,0,0,0,2.537,2.535,2.538,2.538,0,0,0,2.537-2.535,2.539,2.539,0,0,0-2.537-2.537A2.54,2.54,0,0,0-4742.923-679.864Z" transform="translate(4801.327 831.143)" fill="#6c757d" />
                                    </g>
                                </g>
                            </svg>
                            </div>
                        {!isLoading &&  !props.loading && !showCancelButton && <button className="p-0 border-0 search-icons search-icon" disabled role="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g id="Search_black_icon_24px" transform="translate(-48.941 -105.819)"><rect id="Rectangle_3285" data-name="Rectangle 3285" width="24" height="24" transform="translate(48.941 105.819)" fill="none"></rect><path id="Path_22916" data-name="Path 22916" d="M72.711,128.457l-7.162-7.132a9.455,9.455,0,1,0-1.1,1.1l7.164,7.133a.78.78,0,1,0,1.1-1.1ZM50.5,115.262a7.853,7.853,0,1,1,7.853,7.853A7.862,7.862,0,0,1,50.5,115.262Z" fill="#6c757d"></path></g></svg>
                    </button>}
                {!isLoading && showCancelButton &&  !props.loading && isLocalityComponentNeeded && <button className="p-0 border-0 search-icons clear-icon" onClick={(e) =>handleonClear(e) } >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                        <g id="close_black_icon_24px" transform="translate(-48.941 -281.937)">
                            <rect id="Rectangle_3290" data-name="Rectangle 3290" width="18" height="18" transform="translate(48.941 281.937)" fill="none"/>
                            <path id="Path_1951" data-name="Path 1951" d="M72.622,304.007,62.517,293.924,72.6,283.84a1.108,1.108,0,0,0-1.567-1.566L60.945,292.356l-10.083-10.1a1.109,1.109,0,0,0-1.567,1.568l10.083,10.1L49.295,304.007a1.108,1.108,0,1,0,1.509,1.624c.02-.018.039-.037.058-.057L60.945,295.49l10.084,10.084a1.108,1.108,0,0,0,1.566,0h0a1.09,1.09,0,0,0,.052-1.541Z" fill="#6c757d"/>
                        </g>
                    </svg>
                </button>}
                            <AsyncTypeahead
                                id="LocalityName"
                                class="form-control"
                                filterBy={() => true}   
                                isLoading={isLoading}
                                disabled={!isLocalityComponentNeeded}
                                labelKey={(eachLocation)=>{
                                    return eachLocation.mainLocation;
                                }}
                                minLength={3}
                                maxResults={100}
                                delay={500}
                                ref={localitySearchInputRef}
                               /*  onKeyDown={event => {
                                    if (event.key === 'Enter') {
                                        handleEnterEvent(event);
                                    }
                                }} */
                                onMenuToggle = {(isOpen) => {
                                    if(isOpen) {
                                        setSearchedString(true);
                                    } else {
                                        setSearchedString(false);
                                    }
                                }
                                }
                                onSearch={getLocalityAutoSuggestions}
                                onChange={(selectedLocality) => {
                                    localitySelection(selectedLocality)
                                }
                                }
                                onInputChange ={(text,event) => {
                                    setShowCancelButton(text.length > 0 ? true : false);
                                    if(text.length < 3){
                                        setSearchedString(false)
                                    } else{
                                        setSearchedString(true)
                                    }
                                }}
                                defaultInputValue={props?.requestFrom && "Bio" == props?.requestFrom  && localitySuggestions.length == 0 && validate.isNotEmpty(martLocality) && validate.isNotEmpty(martLocality.combination) ? martLocality?.combination : ""}
                                options={localitySuggestions ? localitySuggestions:[]}
                                placeholder="Type your area name / pincode"
                                selected={props?.requestFrom && "Bio" == props?.requestFrom && localitySuggestions.length > 0 ? localitySelectedList : []}
                                renderMenuItemChildren={(eachLocation, props, index) => {
                                    return (<React.Fragment key={index}>
                                        <li className={index == 0 ? "g-0 active" : "no-gutters"} >
                                            <div className="col position-relative">
                                                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11 4a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path d="M7.5 4h1v9a.5.5 0 01-1 0V4z" />
                                                </svg>
                                                <p>
                                                    <span className="d-block text-wrap" title={eachLocation.mainLocation}>{eachLocation.mainLocation}</span>
                                                    <small className="m-0"><span className="d-block text-wrap" title={eachLocation.address}>{eachLocation.address}</span></small>
                                                </p>
                                                <svg className="chevron-right" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </li>
                                    </React.Fragment>);
                                }}
                            >
                                {(selected) => (
                                    <div className="rbt-aux">
                                        {!!selected.length && <CustomSpinners className="spinner-border-sm" animation="border" variant="brand" />}
                                    </div>
                                )}
                               {validate.isNotEmpty(props.loading) && props.loading && <div className='rbt-aux'> <CustomSpinners className="spinner-border-sm" animation="border" variant="brand" /></div>}
                            </AsyncTypeahead>
                    </div>
                </div>
            </Form.Group>
            {props?.requestFrom && "Bio" != props.requestFrom && <div class="border-top p-2 d-flex flex-row-reverse" id="group4" htmlelementtype="ELEMENTGROUP" rootindex="1">
                <button type="button" htmlelementtype="BUTTON" index="0" id="search" class="btn btn-dark px-4 btn" onClick={(e)=>{onSearch(e)}}><span class="visible">Search</span></button>
                {!isLocalityComponentNeeded && <button type="button" htmlelementtype="BUTTON" index="1" id="reset" class="btn brand-secondary mx-3 px-4 btn" onClick={(e)=>{handleonClear(e)}}><span class="visible">Clear</span></button>}
            </div>}
        </form>:<React.Fragment></React.Fragment>}
        </React.Fragment>
    )
}

export default LocalitySearchComponent;
