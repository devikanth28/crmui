import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import Validate from '../../../helpers/Validate';
import { useTimer } from "../../../hooks/useTimer";
import AgentAppService from '../../../services/AgentApp/AgentAppService';
import { AGENT_UI } from '../../../services/ServiceConstants';
import { BodyComponent, FooterComponent, Wrapper } from '../../Common/CommonStructure';
import { AgentAppContext, AlertContext } from '../../Contexts/UserContext';
import { CustomSpinners } from '@medplus/react-common-components/DynamicForm';

function QR(props) {
  const [showCheckStatus, setShowCheckStatus] = useState(false);
  const { tpaTokenId, userId } = useContext(AgentAppContext);
  const { setToastContent } = useContext(AlertContext)
  const [expired, setExpired] = useState(false);
  const [qrPaymentId, setQrPaymentId] = useState(props?.location?.state?.qrPaymentId)
  const [qrData, setQrData] = useState(props?.location?.state?.qrData);
  const txnRefId = props?.location?.state?.txnRefId;
  const [timerDiff, , setTimer, clearTimer,] = useTimer();
  const count = useRef(0);
  const [backDropLoader, setBackDropLoader] = useState(false)

  const agentAppService = AgentAppService(tpaTokenId);
  const validate = Validate();
  const footerRef = useRef();

  useEffect(() => {
    if (validate.isNotEmpty(qrPaymentId)) {
      const timer = setTimeout(() => {
        handleTimer();
      }, 10000);
      return () => {
        clearTimeout(timer);
      }
    }

  }, [qrPaymentId]);

  useEffect(() => {
    if (validate.isNotEmpty(txnRefId)) {
      createQrRequest();
    }
  }, []);

  useEffect(() => {

    if (validate.isEmpty(qrPaymentId)) {
      return;
    }

    if (count.current > 10) {
      setShowCheckStatus(true);
      setBackDropLoader(false);
      clearTimer();
      return;
    }

    if (timerDiff == 0) {
      checkQrTxStatus();
      handleTimer();
      count.current++;
    }

  }, [timerDiff])

  const handleTimer = () => {
    let currentDate = new Date();
    const requestTimer = 5;
    currentDate.setSeconds(currentDate.getSeconds() + requestTimer);
    setTimer(currentDate.getTime());
  }

  const checkQrTxStatus = () => {
    setBackDropLoader(true)
    agentAppService.checkQrTxStatus({ qrPaymentId, orderType: "MEDPLUS_ADVANTAGE", userId }).then((response) => {
      if (validate.isNotEmpty(response) && validate.isNotEmpty(response.responseInfo)) {
        const status = response.responseInfo?.responseStatus;
        if (status == 'SUCCESS') {
          clearTimer();
          props.history.push(`${AGENT_UI}/maThankyou`);
        } else if (status == 'EXPIRED') {
          setExpired(true);
        } else if (status == 'PENDING') {
          setToastContent({ toastMessage: "Payment pending please wait" });
        } else {
          setToastContent({ toastMessage: response.responseInfo.responseMessage ? response.responseInfo.responseMessage : "Something went Wrong" });
        }
      }else{
        setToastContent({toastMessage: "Unable to get QR status. Please try again..!"})
      }
      setBackDropLoader(false);
    }).catch(error => {
      setBackDropLoader(false)
      setToastContent({ toastMessage:"Something went Wrong" });
      console.log(error);
    });
  }

  const createQrRequest = () => {
    setBackDropLoader(true)
    agentAppService.createQrRequest({ referenceId: txnRefId, orderType: "MEDPLUS_ADVANTAGE", userId }).then((response) => {
      if (validate.isNotEmpty(response) && validate.isNotEmpty(response.responseInfo) && response.responseInfo.responseStatus == 'SUCCESS') {
        setExpired(false);
        setQrData(response.qrData);
        setQrPaymentId(response.qrPaymentId);
      } else {
        setToastContent({ toastMessage: `Unable to ${expired ? 'Re-' : ''}Generate QR` });
      }
      setBackDropLoader(false)
    }).catch(error => {
      console.log(error);
      setToastContent({ toastMessage: "Something went wrong. Please try again." });
      setBackDropLoader(false)
    });
  }

  return (

    <Wrapper>
      <BodyComponent className='body-height d-flex justify-content-center align-items-center' allRefs={{ footerRef }}>
        {qrData &&
          <QRCode value={qrData} />
        }
      </BodyComponent>
      <FooterComponent ref={footerRef} className="p-12 border-top d-flex justify-content-end justify-content-lg-end">
        {showCheckStatus && !expired && <Button variant='brand' disabled={backDropLoader} onClick={checkQrTxStatus}>{backDropLoader ? <CustomSpinners spinnerText={"Check Status"} className={" spinner-position"} innerClass={"invisible"} />: "Check Status"}</Button>}
        {expired && <Button variant='brand' onClick={createQrRequest} disabled={backDropLoader}> {backDropLoader ? <CustomSpinners spinnerText={"Regenerate QR"} className={" spinner-position"} innerClass={"invisible"} />: "Regenerate QR"}</Button>}
      </FooterComponent>
    </Wrapper>
  );
}

export default QR;