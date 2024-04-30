import React, { useEffect, useState } from "react";
import Validate from "../../helpers/Validate";
import {ImageLightBox} from '@medplus/react-common-components/DynamicForm';
import CustomerService from "../../services/Customer/CustomerService";

const PrescriptionLightBox = (props) => {

    const defaultCriteria = {
        prescriptionOrderId: props.selectedId,
        customerId: 58620047
    }

    const validate = Validate();
    const customerService = CustomerService();
    const [activeIndex, setActiveIndex] = useState(0);
    const [imagesForLightBox, setImagesForLightBox] = useState([]);
    const [imagesList, setImagesList] = useState([]);

    useEffect(()=>{
        if(validate.isNotEmpty(imagesList)){
            setImagesForLightBox(imagesList.map(({ imagePath }) => imagePath))
        }
    },[imagesList])

    useEffect(() => {
        if(validate.isNotEmpty(props.selectedId)){
            getPrescriptionOrderDetails();
        }
    },[]);

    const getPrescriptionOrderDetails = () => {
        customerService.getPrescriptionOrderDetails(defaultCriteria).then((response) => {
            if (response.statusCode === "SUCCESS" && validate.isNotEmpty(response.dataObject)) {
                setImagesList(response.dataObject.imagesList);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    return(
        <React.Fragment>
            {imagesForLightBox && props.isLightBoxOpen &&
                <ImageLightBox imageIndex={activeIndex} prescImages={imagesForLightBox}
                mainSrc={imagesForLightBox[activeIndex]}
                nextSrc={imagesForLightBox[(activeIndex + 1) % imagesForLightBox.length]}
                prevSrc={imagesForLightBox[(activeIndex + imagesForLightBox.length - 1) % imagesForLightBox.length]}
                onCloseRequest={() => {props.setLightBoxOpen(false);setActiveIndex(0)}}
                onMovePrevRequest={() => setActiveIndex((activeIndex + imagesForLightBox.length - 1) % imagesForLightBox.length)}
                onMoveNextRequest={() => setActiveIndex((activeIndex + 1) % imagesForLightBox.length)}
                />
            }
        </React.Fragment>
    )

}

export default PrescriptionLightBox;