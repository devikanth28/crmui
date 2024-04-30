import React, { useContext, useEffect, useRef, useState } from 'react';
import { BodyComponent, HeaderComponent, Wrapper } from '../../Common/CommonStructure';
import { AlertContext, CustomerContext, UserContext } from '../../Contexts/UserContext';
import Validate from '../../../helpers/Validate';
import CustomerService from '../../../services/Customer/CustomerService';
import CommonDataGrid, { ChangeType } from '@medplus/react-common-components/DataGrid';
import { Button } from 'react-bootstrap';
import { ImageLightBox, StackedImages } from '@medplus/react-common-components/DynamicForm';
import { getCustomerRedirectionURL } from '../CustomerHelper';
import NoDataFound from '../../Common/NoDataFound';
import qs from 'qs';
import dateFormat from 'dateformat';
import HealthRecord from '../../healthRecord/HealthRecord';


const  HealthRecordsHistory = (props) => {
    const headerRef = useRef(null);
    const {customerId} = useContext(CustomerContext);
    const {setStackedToastContent} = useContext(AlertContext);
    const userSessionInfo = useContext(UserContext);
    let validate = Validate();

    const [dataSet,setDataSet] = useState([]);
    const [dataGrid,setDataGrid] = useState(undefined);
    const [loading,setLoading] = useState(false);
    const [imagesList,setImagesList] = useState([]);
    const [isLightBoxOpen,setLightBoxOpen] = useState(false);
    const [activeIndex,setActiveIndex] = useState(0);
    const [openHealthRecordModal, setOpenHealthRecordModal] = useState();
    const [selectedRecordId, setSelectedRecordId] = useState();
    const [highlightRow, setHighlightRow] = useState(false);
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });

    let defaultCreteria = {customerId:customerId,'limitTo':30,'limitFrom':0,'pageNumber':1};
    if(validate.isNotEmpty(params)){
        defaultCreteria = {
            customerId:customerId,
            'limitTo':30,
            'limitFrom':0,
            'pageNumber':1,
            'fromDate': validate.isNotEmpty(params.fromDateTime) ? dateFormat(params.fromDateTime,'yyyy-mm-dd 00:00:00') : null,
            'toDate': validate.isNotEmpty(params.toDateTime) ? dateFormat(params.toDateTime,'yyyy-mm-dd 23:59:59') : null,
            'patientName': params.patientName,
            'doctorName': params.doctorName
        }
    }

    useEffect(()=>{
        if(validate.isNotEmpty(customerId)){
            getInitialData();
        }
    },[customerId, props.location.search]);

    const getInitialData = async() => {
        setLoading(true);
        let data = await getHealthRecordHistoryForCustomer(defaultCreteria);
        if(validate.isNotEmpty(data)){
            setDataSet(data.dataSet);
            setDataGrid(data.dataGrid);
        } else {
            setDataGrid(undefined);
            setDataSet([]);
        }
        setLoading(false);
    }

    const getHealthRecordHistoryForCustomer = async(creteria) => {
        return CustomerService().getHealthRecordHistory(creteria).then(response => {
            if(validate.isNotEmpty(response)){
                if(validate.isNotEmpty(response.statusCode) && response.statusCode == 'SUCCESS' && validate.isNotEmpty(response.dataObject)){
                    return response.dataObject;
                } else {
                    setStackedToastContent({toastMessage: response.message ? response.message : 'Unable to get health record history'})
                }
            } else {
                setStackedToastContent({toastMessage:'Unable to get health record history'});
            }
        }).catch((e)=>{
            console.log(e)
            setStackedToastContent({toastMessage:'Unable to get health record history'});
        })
    }

    const redirectToHealthRecordPage = (recordId)=>{
        setSelectedRecordId(recordId);
        setOpenHealthRecordModal(true);
        // props.history.push(getCustomerRedirectionURL(customerId,`healthRecordHistory/h_${recordId}`));
    }
    const isRowHighlight = (recordId) =>{
        if(highlightRow && recordId==selectedRecordId){
            return true;
        }
        return false;
    }

    const handelOrderSearchModal = (value) => {
        setOpenHealthRecordModal(value);
        if(!value) {
            setTimeout(() => {
                setSelectedRecordId(undefined);
            },1000)
        }
    }

    const callBackMapping = {
        "renderHealthRecordImage": (rowData) => {
            let { row } = rowData;
            const imageList = row.recordImageDetailList;
            return <React.Fragment>
                     <slide onClick={() => redirectToHealthRecordPage(row.recordId)}>
                         <StackedImages setGridImgHeight={true} tooltip="View Prescriptions" images={imageList} maxImages="4" />
                     </slide>
            </React.Fragment>
        },
        "renderRecordType": (props) => {
            let {row} = props;
            return <React.Fragment>
                {row.recordType === "PRE" ? "Prescription" : row.recordType === "MED" ? "Medical Report" : row.recordType}
            </React.Fragment>
        },
        "renderUploadedDate": (rowData) => {
            return <React.Fragment>
                {dateFormat(rowData.row.dateCreated, "mmm dd, yyyy HH:MM")}
            </React.Fragment>
        },
        "rowClass": (rowData)=>{
            return isRowHighlight(rowData?.recordId) ? "border bg-body-secondary border-secondary-subtle":"";
        }
    }

    const remoteDataFunction = async ({ startIndex, limit, sortColumns, filters, pageNumber, changeType}) => {
        let params = { ...defaultCreteria, limitFrom: startIndex, limitTo: limit, pageNumber: pageNumber };
        const data = await getHealthRecordHistoryForCustomer({ ...params });
        if (userSessionInfo?.vertical && userSessionInfo.vertical == "V") {
            if(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet)) {
                 if(changeType == ChangeType.PAGINATION_INFO && startIndex > 0){
                     setDataSet([...dataSet, ...data.dataSet]);
                 } else {
                     setDataSet(data.dataSet);
                 }
            } 
        }else{
            setDataSet(validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet) ? data.dataSet : []);
        }
        return { dataSet: data?.dataSet ? data.dataSet : [], totalRowsCount: data.dataGrid.totalRowsCount, status: true }
    }

    return (
        <>
            <Wrapper>
                {openHealthRecordModal && <HealthRecord {...props} needBackButton={true} setHighlightRow={setHighlightRow} openHealthRecordModal={openHealthRecordModal} setOpenHealthRecordModal={handelOrderSearchModal} id={'h_'+selectedRecordId}/>}
                {!openHealthRecordModal && <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between px-3 py-2">
                    <p className="mb-0">Health Record History</p>
                </HeaderComponent>}
                {!openHealthRecordModal && <BodyComponent allRefs={{ headerRef }} className={'body-height overflow-hidden'} loading={loading}>
                    {!loading && (validate.isNotEmpty(dataSet) ? <div className={`h-100 w-100 card`}>
                        <div class={`row g-3 h-100`}>
                            <CommonDataGrid {...dataGrid} dataSet={dataSet}
                                callBackMap={callBackMapping}
                                remoteDataFunction={remoteDataFunction}
                            />
                        </div>
                    </div>:<NoDataFound text={"No Health Records found for the customer"}/>)}
                    {validate.isNotEmpty(imagesList) && isLightBoxOpen &&
                    <div>
                        <ImageLightBox imageIndex={activeIndex} prescImages={imagesList}
                            mainSrc={imagesList[activeIndex]}
                            nextSrc={imagesList[(activeIndex + 1) % imagesList.length]}
                            prevSrc={imagesList[(activeIndex + imagesList.length - 1) % imagesList.length]}
                            imageTitle={"Prescription Details"}
                            onCloseRequest={() => { setLightBoxOpen(false); setActiveIndex(0); }}
                            onMovePrevRequest={() => setActiveIndex((activeIndex + imagesList.length - 1) % imagesList.length)}
                            onMoveNextRequest={() => setActiveIndex((activeIndex + 1) % imagesList.length)}
                        />
                        </div>
                    }
                </BodyComponent>}

            </Wrapper >
        </>
    );
}

export default HealthRecordsHistory;