import React, { useContext, useEffect, useState } from 'react';
import Validate from '../../helpers/Validate';
import LocalitySearchComponent from '../StoreLocator/LocalitySearchComponent';
import UserService from '../../services/Common/UserService';
import { CustomerContext, LocalityContext } from '../Contexts/UserContext';
import { CRMRedirectionConstants } from '../../constants/CRMConstants';
import { getCustomerRedirectionURL } from './CustomerHelper';
import qs from 'qs';

const CustomerLocalitySearchForm = (props) => {
   const {setMartLocality,setLabLocality } = useContext(LocalityContext);
   const {customerId,tokenId} = useContext(CustomerContext);
   const validate = Validate();
   const [localitySelectedList,setLocalitySelectedList] = useState([]);
   const [loading,setLoading] = useState(false);


   useEffect(() => {
    if(validate.isNotEmpty(props.location.search)){
        const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        if(validate.isNotEmpty(params) && validate.isNotEmpty(params.locality)){
            let selectedLocation={}
            if(validate.isNotEmpty(params.locality.split(',')))
                selectedLocation = {"lattitude" : params.locality.split(',')[0],"longitude":params.locality.split(',')[1]}
            else
                selectedLocation = {'location': params.locality}
            selectedLocalityInfo(selectedLocation);
        }
    }

   },[props.location.search])

   const validateToken = () => {
    UserService().validateToken({headers:{customerId},params:{tokenId:tokenId}}).then(res=>{
        if(validate.isNotEmpty(res) && validate.isNotEmpty(res.dataObject) && "SUCCESS" == res.statusCode){
            setMartLocality(validate.isNotEmpty(res.dataObject.locInfo) ? res.dataObject.locInfo : {});
            setLabLocality(validate.isNotEmpty(res.dataObject.labLocalityInfo) ? res.dataObject.labLocalityInfo : {});
        }
    }).catch(err=>{
        console.log("Error Occured : ", err);
    })
   }

   const selectedLocalityInfo = locality => {
    if(validate.isNotEmpty(locality)){
        setLoading(true);
        const localityInfo = {pincode:locality[0]?.pincode || null, location:locality[0]?.location, placeId:locality[0]?.placeId,lattitude:locality.lattitude,longitude:locality.longitude}
        const config={headers:{customerId:customerId}, params:{"locationInfo":localityInfo}}
        UserService().setLocality(config).then(res=> {
            if(validate.isNotEmpty(res) && validate.isNotEmpty(res.dataObject) && "SUCCESS" == res.statusCode){
                if(validate.isEmpty(locality.mainLocation)){
                    locality.mainLocation = res.dataObject.combination;
                }
                setLocalitySelectedList(locality);
                setMartLocality(res.dataObject);
                let path = Object.keys(CRMRedirectionConstants).filter(key => { return props.location.pathname.includes(CRMRedirectionConstants[key])})
                if(Validate().isNotEmpty(path)){
                    props.history.replace(getCustomerRedirectionURL(customerId,CRMRedirectionConstants[path[0]]));
                } else {
                    props.history.replace(props.location.pathname);
                }
                validateToken();
            }
            if("FAILURE" == res.statusCode){
                setLocalitySelectedList("");
            }
            setLoading(false);
        }).catch(err=> {
            console.log(err);
            setLoading(false);
        })
           
   }
}

    return (
        <React.Fragment>
            <LocalitySearchComponent defaultAddress={props.defaultAddress} displayFullAddress="true" customerId={props.customerId} location={location} localitySelectedList={localitySelectedList} selectedLocalityInfo={selectedLocalityInfo} loading={loading} requestFrom={"Bio"} {...props} />
        </React.Fragment>
    )
}

export default CustomerLocalitySearchForm