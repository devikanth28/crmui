import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {ImageLightBox} from '@medplus/react-common-components/DynamicForm';


const OpenImageGallery = (props) =>{

    const [isLightBoxOpen, setLightBoxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [imagesForLightBox, setImagesForLightBox] = useState([]);

    useEffect(()=>{
        if(props.images){
            setImagesForLightBox(props.images.map(({ imagePath }) => imagePath))
        }
    },[props.images])

    const onButtonClick = () =>{
        if(props.includeLightBox) {
            setLightBoxOpen(true);
            props.setSelectedPrescriptionId(props.selectedPrescriptionId);
        }
    }

    const handleOpenLightBox=(openLightBox)=>{
        if(typeof openLightBox == 'boolean'){
            setLightBoxOpen(openLightBox);
        }
    }

    return (
        <React.Fragment>
            <div onClick={onButtonClick}>
                {props.customHtml()}
            </div>
            {props.includeLightBox && imagesForLightBox && isLightBoxOpen &&
                <ImageLightBox imageIndex={activeIndex} prescImages={imagesForLightBox}
                forms={props.isFormRequired} displayForms={()=>props.displayForms(handleOpenLightBox)}
                mainSrc={imagesForLightBox[activeIndex]}
                nextSrc={imagesForLightBox[(activeIndex + 1) % imagesForLightBox.length]}
                prevSrc={imagesForLightBox[(activeIndex + imagesForLightBox.length - 1) % imagesForLightBox.length]}
                imageTitle={"Prescription Details"}
                onCloseRequest={() => {setLightBoxOpen(false); setTimeout(() => {
                    props.setSelectedPrescriptionId(undefined);
                },2000); setActiveIndex(0)}}
                onMovePrevRequest={() => setActiveIndex((activeIndex + imagesForLightBox.length - 1) % imagesForLightBox.length)}
                onMoveNextRequest={() => setActiveIndex((activeIndex + 1) % imagesForLightBox.length)}
                imageCaption={props.imageCaption}
                />
            }
        </React.Fragment>
    )
}

OpenImageGallery.propTypes = {
    /**
     * Images list, with full imagePaths including server/domain names 
     */
    images: PropTypes.arrayOf(PropTypes.shape({
        imagePath: PropTypes.string,
    })),
    /**
     * LightBox feature flag
     */
    includeLightBox: PropTypes.bool,
    /**
     * Whether Form Required or Not
     */
    isFormRequired : PropTypes.bool,
    /**
     * Caption to show on Modal 
     */
    imageCaption : PropTypes.string,
    /**
     * Returns Html
     */
    customHtml : PropTypes.func,
    /**
     * displayForms which returns Form Html
     */
    displayForms : PropTypes.func,
  }

export default OpenImageGallery