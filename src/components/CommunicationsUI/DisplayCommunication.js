import React, { useRef } from "react";
import { BodyComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import CommonDataGrid from "@medplus/react-common-components/DataGrid";

const DisplayCommunication = (props) => {

    const headerRef = useRef(null);

    const communcationsDataGrid = {
        "idProperty": "rowIndex",
        "columns": [
            {
                "columnName": "CSR ID",
                "rowDataKey": "csrId",
                "resizable": true                
            },
            {
                "columnName": "Order ID",
                "rowDataKey": "orderId",
                "resizable": true,
                "customRowRenderingFunction": {
                    "type": "FUNCTION",
                    "returnType": "REACT_NODE",
                    "name": "renderOrderId"
                }
            },
            {
                "columnName": "Order Type",
                "rowDataKey": "orderType",
                "resizable": true,
            },
            {
                "columnName": "Reason",
                "rowDataKey": "reason",
                "resizable": true,                
            },
            {
                "columnName": "Mode of Contact",
                "rowDataKey": "modeOfContact",
                "resizable": true
            },
            {
                "columnName": "Message",
                "rowDataKey": "message",
                "resizable": true
            },
            {
                "columnName": "Date Created",
                "rowDataKey": "creationDate",
                "resizable": true,
                "isFrozen": true,
                "frozenColumnPosition": "RIGHT",
            }
        ]
    };

    const communicationDataSet = [
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000535",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000536",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000537",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000538",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000539",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000540",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000541",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000542",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000543",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000544",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000545",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000546",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000547",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000548",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000549",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000550",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        },
        {
            "csrId" : "Sai Chandu Belide",
            "orderId" : "5000551",
            "orderType" : "MART",
            "reason" : "Some Reason",
            "modeOfContact" : "messageout",
            "message" : "Dear MedPlus Cstmr, order OTGMM2300656863 is confirmed. You will receive an SMS when it is ready for pickup. Track: https://bit.ly/3oM1aPq&tempid=1007077441699631466&appid=medplusalt&contenttype=1&alert=1&selfid=true&intflag=false",
            "creationDate" : "07 Mar, 2024"
        }
    ];    

    const renderOrderId = ({row, column}) => {
        return(
            <a className="btn-link bg-transparend pointer w-100" href="#">{row.orderId}</a>
        );
    }

    const callBackMapping = {
        'renderOrderId' : renderOrderId
    }

    return (
        <Wrapper>
            <HeaderComponent ref={headerRef} className="custom-tabs-forms py-2 px-3">
                Display Communication
            </HeaderComponent>
            <BodyComponent allRefs={{ headerRef }} className="body-height">
                <div className="card h-100">
                    <CommonDataGrid {...communcationsDataGrid} dataSet={communicationDataSet} callBackMap={callBackMapping} />
                </div>
            </BodyComponent>
        </Wrapper>
    );
};

export default DisplayCommunication;