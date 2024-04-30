import { useContext, useEffect, useState } from "react";
import Validate from "../../../../../helpers/Validate";
import CheckoutService from "../../../../../services/Checkout/CheckoutService";
import StoreDetails from "../../../../Common/StoreDetails";
import { AlertContext, CustomerContext } from "../../../../Contexts/UserContext";

const StorePick = (props) => {
    const [availableStores, setAvailableStores] = useState([]);
    const { customerId } = useContext(CustomerContext);
    const [selectedStoreId, setSelectedStoreId] = useState(undefined);
    const { setStackedToastContent } = useContext(AlertContext);
    
    const checkoutService = CheckoutService();
    const validate = Validate();

    useEffect(()=> {
        getPickStoreDetails();
    },[]);

   
    const getPickStoreDetails = () => {
        const config = {headers: {customerId : customerId }};
        checkoutService.getPickStoreDetails(config).then((response)=>{
            if(validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.dataObject) && validate.isNotEmpty(response.dataObject.availableStores)) {
                setAvailableStores(response.dataObject.availableStores);
                if(validate.isNotEmpty(props?.cfpStoreId)) {
                    response.dataObject.availableStores.map(eachStore => {
                        if(eachStore.storeId == props?.cfpStoreId) {
                            setPickUpStoreInfo(eachStore.storeId);
                        }
                    });
                }
            } 
        }).catch((error) => {
            console.log("error is "+error);
        });
    }

    const setPickUpStoreInfo = (pickStoreId) => {
        setStackedToastContent({ toastMessage: "Selected Store Id " + pickStoreId });
        setSelectedStoreId(pickStoreId);
        props.setStoreDeliveryDetails({pickStoreId, "deliveryType" : "S"});
    }
    
  return (
    <>
    {validate.isNotEmpty(availableStores) &&
        <StoreDetails stores = {availableStores} isFromMart handleStores = {setPickUpStoreInfo} selectedStoreId={selectedStoreId}/>
    }
    </>
  )
};

export default StorePick;
