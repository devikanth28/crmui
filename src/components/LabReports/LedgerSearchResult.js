import React, { useContext, useEffect, useRef, useState } from "react";
import qs from 'qs';
import { TOAST_POSITION } from "@medplus/react-common-components/DynamicForm";
import UserService from "../../services/Common/UserService";
import { BodyComponent, FooterComponent, HeaderComponent, Wrapper } from "../Common/CommonStructure";
import Validate from "../../helpers/Validate";
import { AlertContext } from "../Contexts/UserContext";
import NoDataFound from "../Common/NoDataFound";
import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import SeachNow from "../Common/SearchNow";
import DynamicGridHeight from "../Common/DynamicGridHeight";
import CurrencyFormatter from "../Common/CurrencyFormatter";

const LedgerSearchResult = ({helpers,...props}) =>{

    const { setStackedToastContent } = useContext(AlertContext)
    const [gridData, setGridData] = useState(undefined);
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const [loading, setLoading] = useState(false)
    const headerRef = useRef(null);
    const validate = Validate();
    const [dataSet, setDataSet] = useState([]);
    const [totalReceivedAmount, setTotalReceivedAmount]  =useState(0);
    const [searchParamsExist, setSearchParamsExist] = useState(false);
    const footerRef = useRef(null);

    useEffect(()=>{
        if (Validate().isNotEmpty(params)) {
            setSearchParamsExist(true);
            getInitialData({ ...params,})
        }
    },[props.location.search])

    const getInitialData = async (searchCriteria) => {
        setLoading(true);
        const data = await getLedgers(searchCriteria);
        setGridData((validate.isNotEmpty(data) && validate.isNotEmpty(data.dataGrid)) ? data.dataGrid : undefined);
        setDataSet((validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet)) ? [...data.dataSet] : []);
    }

    const getLedgers = async (obj) => {
        return await UserService().getLedgers(obj).then((data) => {
            if (data && validate.isNotEmpty(data.dataObject) && data.statusCode === "SUCCESS") {
                setDataSet(data.dataSet)
                setTotalReceivedAmount(data.dataObject.totalReceivedAmount);
                setLoading(false)
                return data.dataObject;
            } else if (data && data.statusCode === "FAILURE") { 
                setStackedToastContent({ toastMessage: data.message, position: TOAST_POSITION.BOTTOM_START });
                setLoading(false)
                return [];
            } else {
                setLoading(false)
                return [];
            }
        }).catch((err) => {
            setStackedToastContent({ toastMessage: "Unable to get follow up details , please try again", position: TOAST_POSITION.BOTTOM_START });
            setLoading(false)
            return [];
        });
    }

    return(
        <React.Fragment>
            <Wrapper showHeader={false}>
                <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                    <p className="mb-0"> Find Ledgers</p>
                </HeaderComponent>
                <BodyComponent loading={loading} allRefs={{ headerRef, footerRef }} className="body-height" >
                    {!loading ? validate.isNotEmpty(dataSet) ?
                    <div className={`h-100`}>
                        <div className="card h-100">
                            <div className='card-body p-0'>
                             <CommonDataGrid {...gridData} dataSet={dataSet} callBackMap={[]}/>
                            </div>
                        </div>
                    </div>
                    : (searchParamsExist && <NoDataFound text="No data found, try with other details!" searchButton={true} />) : null}
                    {!searchParamsExist && <SeachNow {...props} />}
               </BodyComponent>
               {validate.isNotEmpty(totalReceivedAmount) && validate.isNotEmpty(dataSet) && <FooterComponent ref={footerRef} className="footer px-3 py-2">
                        <div className="text-end"><span className="text-secondary font-14">Total Received Amount </span> <span className="font-weight-bold"><CurrencyFormatter data={totalReceivedAmount} decimalPlaces={2}/></span></div>
               </FooterComponent>}
            </Wrapper>
        </React.Fragment>
    )
}
export default LedgerSearchResult;