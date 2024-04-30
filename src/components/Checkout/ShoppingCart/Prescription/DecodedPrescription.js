import { ShowPrescription } from "@medplus/react-common-components/DataGrid";
import { useState } from "react";
import OpenImageGallery from "../../../prescription/OpenImageGallery";

const DecodedPrescription = () => {

    const [showPrescImages, setShowPrescImages] = useState(true);
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(undefined);

    const getIconHtml = () => {
        return <ShowPrescription tooltip="Show Prescription" />
    }

    let imageUrls = [];
    imageUrls.push({ imagePath: "https://static1.medplusindia.com:666/displayprescriptionimages/static4/2024/0129/P_W_34eebcf63eaf7b4f70b48bcb83ab4d66.jpg" });

    return <>
        <div className='d-flex'>
            {showPrescImages &&
                <OpenImageGallery includeLightBox={true} customHtml={getIconHtml} images={imageUrls} setSelectedPrescriptionId={setSelectedPrescriptionId} selectedPrescriptionId={"30105041"} />
            }
        </div>
    </>
}

export default DecodedPrescription