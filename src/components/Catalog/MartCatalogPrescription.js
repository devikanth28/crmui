import { ImageLightBox } from "@medplus/react-common-components/DynamicForm";
import { useContext, useEffect, useState } from "react";
import Validate from "../../helpers/Validate";
import CheckoutService from "../../services/Checkout/CheckoutService";
import { BodyComponent } from "../Common/CommonStructure";
import HealthRecordImage from "../Common/HealthRecordImage";
import { CustomerContext, ShoppingCartContext } from "../Contexts/UserContext";
import { PrescriptionConstants } from "../customer/Constants/CustomerConstants";


const MartCatalogPrescription = (props) => {


    const checkoutService = CheckoutService();
    const validate = Validate();
    const { customerId } = useContext(CustomerContext);
    const [selectedImagePath, setSelectedImagePath] = useState(undefined);
    const [isLightBoxOpen, setLightBoxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [imagesList, setImagesList] = useState([]);
    const [thumbNailImagesList, setThumbNailImagesList] = useState([]);
    const {shoppingCart, setShoppingCart} = useContext(ShoppingCartContext);


    useEffect(() => {
        if(validate.isNotEmpty(props?.prescriptionId)) {
            getMartCatalogPrescriptions();
        }
        if(validate.isNotEmpty(props?.recordId)) {
            getHealthRecordImageDetails(props?.recordId);
        }
    }, []);

    const getMartCatalogPrescriptions = () => {
        checkoutService.getMartCatalogPrescriptions({ headers: { customerId: customerId }, params: {presOrderId : props?.prescriptionId} }).then(async (response) => {
            if (validate.isNotEmpty(response) && response.statusCode == "SUCCESS" && validate.isNotEmpty(response.dataObject) && validate.isNotEmpty(response.dataObject.imageList)) {
                let prescriptionOrder = response.dataObject;
                let recordId = prescriptionOrder.recordId;
                if(validate.isNotEmpty(response.dataObject.imageList)) {
                    setImagePathsAndThumbNailPaths(response.dataObject.imageList);
                }
                if(((PrescriptionConstants.PRESCRIPTION_ORDER_CONVERTED_TO_OMS == prescriptionOrder.status || PrescriptionConstants.PRESCRIPTION_ORDER_CANCEL == prescriptionOrder.status) && (validate.isEmpty(shoppingCart.healthRecordId))) && validate.isNotEmpty(recordId)) {
                    const healthRecordResponse = await getHealthRecordDetails(recordId);
                    if (validate.isNotEmpty(healthRecordResponse) && "SUCCESS" == healthRecordResponse.statusCode && validate.isNotEmpty(healthRecordResponse.dataObject) && validate.isNotEmpty(healthRecordResponse.dataObject.recordImageDetailList)) {
                        setImagePathsAndThumbNailPaths(healthRecordResponse.dataObject.recordImageDetailList);
                    }
                }
            }
        }).catch((error) => {
            console.log("error is " + error);
        })
    }

    const getHealthRecordDetails = (healthRecordId) => {
        if(validate.isEmpty(healthRecordId)) {
            return;
        }
        return checkoutService.getHealthRecordDetails({ headers: { customerId: customerId }, params: { healthRecordId } });
    }

    const getHealthRecordImageDetails = async (healthRecordId) => {

        const healthRecordResponse = await getHealthRecordDetails(healthRecordId);
            if (validate.isNotEmpty(healthRecordResponse) && "SUCCESS" == healthRecordResponse.statusCode && validate.isNotEmpty(healthRecordResponse.dataObject) && validate.isNotEmpty(healthRecordResponse.dataObject.recordImageDetailList)) {
                    setImagePathsAndThumbNailPaths(response.dataObject.recordImageDetailList);
            }
    }

    const setImagePathsAndThumbNailPaths = (imagesList) => {
        if (validate.isNotEmpty(imagesList)) {
            const imagePathsList = imagesList.map(image => image.imagePath);
            setImagesList(imagePathsList);
            const thumbNailPathsLsit = imagesList.map(image => image.thumbnailPath);
            setThumbNailImagesList(thumbNailPathsLsit);
            setSelectedImagePath(imagePathsList[0]);
        }

    }

    return <>
        <BodyComponent>
            <HealthRecordImage setSelectedImagePath={setSelectedImagePath} selectedImagePath={selectedImagePath} thumbNailImagesList={thumbNailImagesList} imagesList={imagesList} setLightBoxOpen={setLightBoxOpen} />
            {imagesList && isLightBoxOpen &&
                <ImageLightBox imageIndex={activeIndex} prescImages={imagesList}
                    mainSrc={imagesList[activeIndex]}
                    nextSrc={imagesList[(activeIndex + 1) % imagesList.length]}
                    prevSrc={imagesList[(activeIndex + imagesList.length - 1) % imagesList.length]}
                    imageTitle={"Prescription Details"}
                    onCloseRequest={() => { setLightBoxOpen(false); setActiveIndex(0); }}
                    onMovePrevRequest={() => setActiveIndex((activeIndex + imagesList.length - 1) % imagesList.length)}
                    onMoveNextRequest={() => setActiveIndex((activeIndex + 1) % imagesList.length)}
                />
            }
        </BodyComponent>
    </>
}
export default MartCatalogPrescription;