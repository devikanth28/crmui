import React, { useEffect, useState , useContext} from "react";
import Validate from "../../helpers/Validate";
import PrescriptionService from "../../services/Prescription/PrescriptionService";
import OpenImageGallery from "../prescription/OpenImageGallery";
import { AlertContext } from '../Contexts/UserContext';
import {TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';



const PrescriptionOrderComponent = (props) => {

    const {orderId} = props;
    const { setStackedToastContent } = useContext(AlertContext);
    const [imageUrls,setImageUrls] = useState([]);
    const validate = Validate()

    useEffect(() => {
        if(validate.isNotEmpty(orderId) && validate.isEmpty(imageUrls) && imageUrls.length == 0){
            getPrescriptionData({ orderId})
        }
    },[orderId])

    const getPrescriptionData = async(orderId) =>{
        const data = await getPrescription(orderId);
        let imageUrls = []
        validate.isNotEmpty(data) && validate.isNotEmpty(data.imageList) && data.imageList.map(imageObj => {
            imageUrls.push({"imagePath":imageObj.imagePath})
        })
        setImageUrls(imageUrls)
    }

    const getPrescription = async (orderId) => {

        return await PrescriptionService().getPrescriptionDetails(orderId).then((PrescriptionData) => {
            if (PrescriptionData && Validate().isNotEmpty(PrescriptionData.dataObject) && PrescriptionData.statusCode === "SUCCESS") {
                return PrescriptionData.dataObject;
            } else{
                setStackedToastContent({toastMessage: data.message , position : TOAST_POSITION.BOTTOM_START})
                return [];
            }
        }).catch((err) => {
           setStackedToastContent({ toastMessage: "Unable to get Prescription details , please try again", position: TOAST_POSITION.BOTTOM_START });
            return [];
        });
    }


    return <div class = "d-flex justify-content-center align-items-center h-100">
                <OpenImageGallery customHtml={() => {return <a href="javascript:void(0)" className="btn btn-sm btn-link w-100" rel="noopener" aria-label={orderId} role="link" title=" ">{orderId}</a>}} images={imageUrls} includeLightBox={true} isFormRequired={false}/>
            </div> 

}


export default PrescriptionOrderComponent;