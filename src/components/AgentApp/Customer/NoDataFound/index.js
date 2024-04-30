import NoDataFoundIcon from '../../../../images/No-Data-Found.svg'
import { Button } from "react-bootstrap";
import Validate from '../../../../helpers/Validate';

export default (props)=>{
    const validate = Validate();
    const callBackFunction=(payload)=>{
        if(props?.callBack){
            props?.callBack(payload);
        }
    }

    return <div>
        <div className="text-center m-5 p-12">
            {validate.isNotEmpty(props.isImageRequired) && props.isImageRequired && <>
            <img src={NoDataFoundIcon} alt="No Data Found" />
            <p className="mb-0">{props.message ? props.message : "No Data Found"}</p></>}
            {props.buttonName && <Button variant="primary" className="mt-3" onClick={(payload) => {callBackFunction(payload)}}>{props.buttonName}</Button>}
        </div>
    </div>
}