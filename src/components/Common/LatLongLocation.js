import React from 'react'
import { OpenIcon } from "@medplus/react-common-components/DataGrid";
const LatLongLocation = (props) => {

    const isIosUser = () => {
        try{
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        }catch(err){
            console.log(err);
        }
        return false;
    }

    const getMapDirections = (destination) => {
        const destinationUrl = isIosUser() ? `http://maps.apple.com/?q=${destination}` : `https://www.google.com/maps/dir/?api=1&destination=${destination}`; 
        if (window.cordova) {
            cordova.InAppBrowser.open(destinationUrl, '_system');
        } else {
            window.open(destinationUrl);
        }
    }

    return (
        <React.Fragment>
            <a id="latLng" href="javascript:void(0)" onClick={() => getMapDirections(props.row.latLng)}>{props.row.latLng}</a>
            <OpenIcon id="latLng" handleOnClick={()=>getMapDirections(props.row.latLng)} tooltip="View Map" />
        </React.Fragment>
    )
}

export default LatLongLocation;
