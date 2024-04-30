import DynamicForm, { CustomSpinners, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import { useContext, useRef, useState } from 'react';
import Validate from "../../../helpers/Validate";
import AgentAppService from '../../../services/AgentApp/AgentAppService';
import { AGENT_UI, MA_API_URL } from '../../../services/ServiceConstants';
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../../Common/CommonStructure";
import { AgentAppContext, AlertContext } from '../../Contexts/UserContext';
import { CartSummary } from './CartSummary';

const MAPayment = ({ helpers, ...props }) => {

    const headerRef = useRef();
    const footerRef = useRef();
    const validate = Validate();
    const isRetryPayment = props?.isRetryPayment;
    const txnRefId = props?.txnRefId;
    const paymentInfo = isRetryPayment?props.paymentInfo:props?.location?.state?.paymentInfo;
    const [showQRButton, setShowQRButton] = useState(isRetryPayment?isRetryPayment:false);
    const [isCreateOrder, setIsCreateOrder] = useState(true);
    const [paymentType, setPaymentType] = useState("");
    const {setToastContent} = useContext(AlertContext)
    const { tpaTokenId, isThirdPartyAgent } = useContext(AgentAppContext);
    const [backDropLoader, setBackDropLoader] = useState(false)
    const maForAgentAppService = AgentAppService(tpaTokenId);

    if (validate.isEmpty(paymentInfo)) {
        return <h5>Payment Info Not Found</h5>
    }

    if(validate.isNotEmpty(isRetryPayment) && isRetryPayment && validate.isEmpty(txnRefId)){
        props.history.replace(`${AGENT_UI}/customerInfo`);
    }

    const handlePayment = (payload) => {
        setPaymentType(payload[0].target.value);
        clearFields();
        switch (payload[0].target.value) {
            case "CASH":
                setShowQRButton(false);
                handleCashPayment(helpers);
                break;
            case "CARD":
                setShowQRButton(false);
                handleCardPayment(helpers);
                break;
            case "QR":
                setShowQRButton(true);
                handleQrPayment(helpers);
                break;
            default:
                return <></>
        }
    }

    const clearFields = () => {
        setIsCreateOrder(true);
        helpers.updateErrorMessage("",'amount');
        helpers.updateValue("", 'amount');
        helpers.resetForm('cardOptions');
    }

    const handleAmount = (payload) => {

        const amount = payload[0].target.value;

        if (validate.isNotEmpty(amount) && (validate.isNumeric(amount) && paymentInfo.cartSummary.totalPrice == amount)) {
            setIsCreateOrder(false);
            helpers.updateErrorMessage("",'amount');
        } else {
            helpers.updateErrorMessage("Please enter valid amount " + paymentInfo.cartSummary.totalPrice,'amount');
            setIsCreateOrder(true);
        }

    }

    const createSubscriptionOrder = (paymentType) => {
        const cardValues = helpers.validateAndCollectValuesForSubmit("paymentOptionsForm");
        setBackDropLoader(true)
        maForAgentAppService.createSubscriptionOrder({ paymentType, deviceId : cardValues?.deviceId, txnId : cardValues?.transactionNumber, cardNo : cardValues?.cardNumber }).then((response) => {
            if (validate.isNotEmpty(response) && validate.isNotEmpty(response.responseData)) {
                if (paymentType == "QR" && validate.isNotEmpty(response.responseData.txnRefId)) {
                    redirectToQR(response.responseData.txnRefId);
                }
                else {
                    checkAndRedirectToThankYouPage();
                }
            }else if(validate.isNotEmpty(response) && response?.statusCode=='FAILURE'){
                setToastContent({toastMessage:"Failed To Create Order"});
                setBackDropLoader(false)
            }
        }).catch((error) => {
            console.log(error);
            setToastContent({toastMessage:"Failed To Create Order"});
            setBackDropLoader(false)
        });
    };

    const checkAndRedirectToThankYouPage = () => {
        props.history.replace(`${AGENT_UI}/maThankyou`);
    }

    const redirectToQR = (txnRefId) => {
        props.history.push({ pathname: `${AGENT_UI}/qr`, state: { txnRefId } });
    }

    const handleBack = () => {
        props.history.goBack();
    }
    const observersMap = {
        'paymentType': [['click', (payload) => handlePayment(payload)]],
        'amount': [['change', (payload) => handleAmount(payload)]]
    }

    return (
        <>
            <Wrapper>
                <HeaderComponent ref={headerRef} className="p-12 border-bottom">
                    Order Review
                </HeaderComponent>
                <BodyComponent className="body-height" allRefs={{ headerRef, footerRef }}>

                    {validate.isNotEmpty(paymentInfo.cartSummary) && <> 
                     <CartSummary title={true} cartSummary={paymentInfo.cartSummary} />
                     <DynamicForm requestUrl={`${MA_API_URL}/paymentOptionsForm?isRetryPayment=${isRetryPayment?isRetryPayment:''}`} helpers={helpers} requestMethod={'GET'} observers={observersMap} headers={props.headers} />
                     </>
                    }
                </BodyComponent>
                <FooterComponent ref={footerRef} className="p-12 border-top d-flex justify-content-end justify-content-lg-end">
                <button className="btn brand-secondary px-lg-4 me-3" onClick={handleBack}>
                            Back
                        </button>
                    {validate.isNotEmpty(paymentInfo.cartSummary) && 
                        <>
                            {((showQRButton || isThirdPartyAgent) || (validate.isNotEmpty(isRetryPayment) && isRetryPayment)) && <button type="submit" className='btn btn-brand p-2' onClick={() => isRetryPayment?redirectToQR(txnRefId):createSubscriptionOrder("QR")} disabled={backDropLoader}>{backDropLoader ? <CustomSpinners spinnerText={"Generate QR"} className={" spinner-position"} innerClass={"invisible"} />: "Generate QR"}</button>}
                            {!(showQRButton || isThirdPartyAgent) && !(validate.isNotEmpty(isRetryPayment) && isRetryPayment) &&<button type="submit" className='btn btn-brand p-2' onClick={() => createSubscriptionOrder(paymentType)} disabled = {isCreateOrder || backDropLoader}>{backDropLoader ? <CustomSpinners spinnerText={"Create Order"} className={" spinner-position"} innerClass={"invisible"} />: "Create Order"}</button>}
                        </>
                    }
                       
                </FooterComponent>
            </Wrapper>
        </>
    )
}

const handleCashPayment = (helpers) => {
    helpers.showElement("amount");
    helpers.hideElement("cardOptions");
}

const handleCardPayment = (helpers) => {
    helpers.showElement("amount");
    helpers.showElement("cardOptions");
}

const handleQrPayment = (helpers) => {
    helpers.hideElement("amount");
    helpers.hideElement("cardOptions");
}



export default withFormHoc(MAPayment);