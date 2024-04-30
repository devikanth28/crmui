import { useContext } from "react"
import { LocalityContext } from "../../../Contexts/UserContext"

export default (props) => {

    const {martLocality} = useContext(LocalityContext);

    return <>
       {(("D" == props.deliveryType && martLocality.hdcodAllowed) || ("S" == props.deliveryType && martLocality.spcodAllowed)) && <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="payment" id="COD" value={props?.paymentType} checked = {"C" == props?.paymentType} onClick={() => props?.setPaymentType('C')} />
            <label class="form-check-label" for="COD">COD</label>
        </div>}
        {martLocality.allowedOnlinePayment && <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="payment" id="Online" value={props?.paymentType} checked = {"O" == props?.paymentType} onClick={() => props?.setPaymentType('O')} />
            <label class="form-check-label" for="Online">Online</label>
        </div>}
    </>
}