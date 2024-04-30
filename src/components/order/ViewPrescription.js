import { ImageLightBox } from '@medplus/react-common-components/DynamicForm';
import { PrescriptionEditIcn, ShowPrescription } from "@medplus/react-common-components/DataGrid";
import React, { useContext, useEffect, useState } from "react";
import Validate from "../../helpers/Validate";
import OrderService from "../../services/Order/OrderService";
import FileSelect from '../Common/FileSelect';
import { AlertContext } from '../Contexts/UserContext';


const ViewPrescription = (props) => {

    const [isLightBoxOpen, setLightBoxOpen] = useState(false);
    const [imagesForLightBox, setImagesForLightBox] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const {setStackedToastContent} = useContext(AlertContext);

    useEffect(() => {
        if(Validate().isNotEmpty(uploadedFiles) && (uploadedFiles.length+imagesForLightBox.length) <= 12){
            uploadPrescForEditOrder();
        }
    }, [uploadedFiles])

    const getPrescriptionDetails = (prescriptionOrderId) => {
        setLightBoxOpen(true);
        OrderService().getPrescriptionDetails({ prescriptionOrderId: prescriptionOrderId }).then(res => {
            if ("SUCCESS" === res.statusCode && Validate().isNotEmpty(res.dataObject)) {
                setImagesForLightBox(res.dataObject.prescriptionOrder.imageList.map(each => each.imagePath));
                setLightBoxOpen(true);
            }
        }, err => {
            console.log(err);
        })
    }

    const uploadPrescForEditOrder = () => {
        setIsLoading(true);
        OrderService().uploadFilesToImageServer(uploadedFiles, "P", {}).then(response => {
            if (Validate().isNotEmpty(response) && Validate().isNotEmpty(response.response)) {
                OrderService().prescriptionUploadForEditOrder({ data: { "imageInfoList": JSON.stringify(response.response), "prescriptioOrderId": props.row.prescriptionOrderId, "orderId": props.row.orderId, "customerId": props.row.customerId } }).then(response => {
                    if ("SUCCESS" === response.statusCode) {
                        setStackedToastContent({toastMessage:"Prescription Uploaded successfully." });
                        setUploadedFiles([]);
                        setLightBoxOpen(false);
                    } else {
                        setStackedToastContent({toastMessage:"Unable to upload prescription"})
                    }
                }, err => {
                    setStackedToastContent({toastMessage:"Something went wrong, Please Try Again!"});
                    setLightBoxOpen(false);
                    console.log(err);
                })
            } else {
                setStackedToastContent({toastMessage:"Something went wrong, Please Try Again!"});
                setLightBoxOpen(false);
            }
            setIsLoading(false);
        }, err => {
            console.log(err);
            setStackedToastContent({toastMessage:"Something went wrong, Please Try Again!"});
            setLightBoxOpen(false);
            setIsLoading(false);
        })
    }
    return <React.Fragment>
        {
            props.tooltip === "View Prescription"
            ? <ShowPrescription tooltip={props.tooltip} handleOnClick = {() => { getPrescriptionDetails(props.row.prescriptionOrderId) }} />
            : null
        }
        {
            props.tooltip === "Edit Prescription"
            ? <PrescriptionEditIcn tooltip={props.tooltip} handleOnClick = {() => { getPrescriptionDetails(props.row.prescriptionOrderId) }} />
            : null
        }
        {imagesForLightBox && isLightBoxOpen &&
            <ImageLightBox imageIndex={activeIndex} prescImages={imagesForLightBox}
                forms={props.forms} displayForms={() => <FileSelect uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} filesLength={imagesForLightBox.length} isLoading={isLoading} />}
                mainSrc={imagesForLightBox[activeIndex]}
                nextSrc={imagesForLightBox[(activeIndex + 1) % imagesForLightBox.length]}
                prevSrc={imagesForLightBox[(activeIndex + imagesForLightBox.length - 1) % imagesForLightBox.length]}
                onCloseRequest={() => { setLightBoxOpen(false); setActiveIndex(0); setUploadedFiles([]) }}
                onMovePrevRequest={() => setActiveIndex((activeIndex + imagesForLightBox.length - 1) % imagesForLightBox.length)}
                onMoveNextRequest={() => setActiveIndex((activeIndex + 1) % imagesForLightBox.length)}
            />
        }
    </React.Fragment>
}

export default ViewPrescription;