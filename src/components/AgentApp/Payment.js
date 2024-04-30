import { useContext, useEffect, useState } from "react";
import Validate from "../../helpers/Validate";
import AgentAppService from "../../services/AgentApp/AgentAppService";
import { AGENT_UI } from '../../services/ServiceConstants';
import { AgentAppContext } from '../Contexts/UserContext';

const CASH = 'CASH';
const DEVICE = 'DEVICE';
const QR = 'QR';

const Payment = (props) => {
    
    const { tpaTokenId } = useContext(AgentAppContext);
    const [selectedType, setSelectedType] = useState(undefined);
    const [isQRPayment,setIsQRPayment] = useState(false);

    const paymentInfo = props?.location?.state?.paymentInfo;

    const maForAgentAppService = AgentAppService(tpaTokenId);
    const validate = Validate();
    
    if(validate.isEmpty(paymentInfo)) {
        return  <h5>Payment Info Not Found</h5>
    }

    const createSubscriptionOrder = (paymentType, deviceId = null) => {
        maForAgentAppService.createSubscriptionOrder({ paymentType, deviceId }).then((response) => {
            if (validate.isNotEmpty(response) && validate.isNotEmpty(response.responseData)) {
                checkAndRedirectToThankYouPage(response.responseData.orders);
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    const checkAndRedirectToThankYouPage = (ordersList) => {
        let orderIdsList = ordersList.map(order=>order?.order?.orderId);
        if(validate.isNotEmpty(orderIdsList)) {
            props.history.push({pathname:`${AGENT_UI}/thankYou`,state:{orderIdsList}})
        }
    }

    if(isQRPayment) {
        return <QRForm {...props}/>
    }

    return <>
        {!paymentInfo.isThirdPartyAgent && <>
            <button onClick={() => setSelectedType(CASH)}>cash</button>
            {validate.isNotEmpty(paymentInfo.edcInfo) && <button onClick={() => setSelectedType(DEVICE)}>card</button>}
        </>}
        {paymentInfo.isThirdPartyAgent && <button onClick={() => {setSelectedType(QR); setIsQRPayment(true)}}>QR</button>}
        {validate.isNotEmpty(selectedType) && <ShowForm createSubscriptionOrder={createSubscriptionOrder} selectedType={selectedType} {...props} />}    
    </>
}

const ShowForm = (props) => {
    switch (props.selectedType) {
        case CASH:
            return <CashForm {...props} />
        case DEVICE:
            return <CardForm {...props}/>
        case QR:
            return <QRForm {...props}/>
        default:
            return <></>
        }
    }
    
const CashForm = (props) => {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");

    const validate = Validate();
    const handleChange = (e) => {
        if(validate.isEmpty(e.target.value) || (validate.isNumeric(e.target.value) && e.target.value > 0)) {
            setError("");
            setAmount(e.target.value); 
        } else {
            setError("Invalid Input!");
        }
    }

    return <>
        <span>Enter Amount : </span><input type="text" value={amount} onChange={handleChange} />
        {validate.isNotEmpty(error) && <p>{error}</p>}
        {paymentInfo.totalPrice == amount && <button onClick={() => props.createSubscriptionOrder(CASH)}>Submit</button>}
    </>
}

const CardForm = (props) => {

    const [deviceId, setDeviceId] = useState(undefined);
    const validate = Validate();

    if (!(Array.isArray(paymentInfo.edcInfo) || paymentInfo.edcInfo.length <= 0)) {
        return <>No devices found!</>
    }
    return <>
    <label htmlFor="edcDevices">Select Device : </label>
    <select name="edcDevices" id="edcDevices">
        <option>Please select</option>
        {paymentInfo.edcInfo.map(eachDevice => {
            return <option onClick={() => setDeviceId(eachDevice.deviceId)}>{eachDevice.deviceId}</option>
        })}
    </select>
    {validate.isNotEmpty(deviceId) && <button onClick={() => props.createSubscriptionOrder(DEVICE, deviceId)}>Submit</button>}
    </>
}


const QRForm = (props) => {
    const [isQRLoading, setIsQRLoading] = useState(true);
    const [qrResponse, setQRResponse] = useState(undefined);
    const maForAgentAppService = AgentAppService(tpaTokenId);

    useEffect(() => {
        createQrRequest();
    }, []);

    const createQrRequest = () => {
        maForAgentAppService.createQrRequest(obj).then(response => {
            if (response?.responseData) {
                setQRResponse(response.responseData);
                setIsQRLoading(false);
            }
        }).catch(error => {
            console.log(error);
            setIsQRLoading(false);
        });
    }

    return <>
        <>
            {isQRLoading && <>QR IMAGE LOADING</>}
            {!isQRLoading && <>QR IMAGE</>}
        </>
    </>
    
}

export default Payment;