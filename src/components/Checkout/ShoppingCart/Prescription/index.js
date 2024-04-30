import PrescriptionDetails from "./PrescriptionDetails";

const Prescription = (props) => {
    const isRequiredPrescription = props?.isRequiredPrescription;
    
    return <>
        {(props?.isRequiredPrescription || props?.prescImgList) && <PrescriptionDetails isRequiredPrescription = {props?.isRequiredPrescription} setIsPrescriptionSectionSelected = {props.setIsPrescriptionSectionSelected} prescImgList={props?.prescImgList} decoderComment = {props?.decoderComment} prescStatus = {props?.prescStatus} setPrescImgList = {props?.setPrescImgList} decodedCart = {props?.decodedCart}/>}
    </>
}

export default Prescription