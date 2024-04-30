import CommonDataGrid, { CallIcon, Shop, RecordIcon, Badges, CustomPopOver, DoctorIcon } from '@medplus/react-common-components/DataGrid';
import qs from 'qs';
import React, { useCallback, useContext, useEffect, useRef, useState , useMemo} from "react";
import { gotoMartCustomerPage, makeOutBoundCall } from "../../helpers/CommonRedirectionPages";
import CustomerService from "../../services/Customer/CustomerService";
import CreateCustomerForm from './CreateCustomerForm';
import Validate from '../../helpers/Validate';
import { CustomSpinners, TOAST_POSITION } from '@medplus/react-common-components/DynamicForm';
import { Wrapper, BodyComponent, FooterComponent, HeaderComponent } from "../Common/CommonStructure";
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { AlertContext } from '../Contexts/UserContext';
import CustomerIdLink from '../../helpers/CustomerIdLink';
import dateFormat from "dateformat";
import { flattenColumnsList } from '../../helpers/CommonHelper';

const CustomerIdCustomComponent = (props) => {
    const { row } = props;
    const { customerId,fullName  } = row;
    if (Validate().isNotEmpty(row.accountType)) {
        return <React.Fragment>
            {row.accountType === "POS" ? <CustomerIdLink customerId={customerId} fullName={fullName}/> :
                row.accountType === "ECOM" ? row.webLoginId : ""
            }
        </React.Fragment>
    }

}

const assignBadges = (props) => {
    const { row } = props;
    const { action } = row;
    switch (action) {
        case 'Active':
            return <Badges className={'badge-approved'} text={action} />
        case 'Inactive':
            return <Badges className={'badge-Cancelled'} text={action} />
    }
}

const GetGenderComponent = (props) => {
    let { row } = props;
    if (row.gender === 'F')
        return <React.Fragment>
            Female
        </React.Fragment>
    else if (row.gender === 'M')
        return <React.Fragment>
            Male
        </React.Fragment>
    else
        return <React.Fragment>
            -
        </React.Fragment>
}

const CustomerDashboard = (props) => {
    const validate = Validate();

    const headerRef = useRef(null);
    const footerRef = useRef(null);

    const {setAlertContent} = useContext(AlertContext);
    const [loading, isLoading] = useState(false);
    const [paramsObj, setParamsObj] = useState(null);
    const [gridData, setGridData] = useState(undefined);
    const [customerForm, disableCreateCustomerForm] = useState(false);
    const [dataSet, setDataSet] = useState([]);
    const [activeTab, setActiveTab] = useState();
    const [clearFormData, setClearFormData] = useState(false);
    const [searchBy, setSearchBy] = useState(null);
    const { setStackedToastContent } = useContext(AlertContext);
    const [customerCreationLoader,setCustomerCreationLoader] = useState(false);
    const [closePopOver, setClosePopOver] = useState(false);

    const handleFailure = () => {
        setStackedToastContent({ toastMessage: "Customer is already opened", position: TOAST_POSITION.BOTTOM_START })
    }

    useEffect(() => {
        if (Validate().isNotEmpty(props.location.search)) {
            let params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
            setParamsObj(params);
            const { customerId, mobileNo, emailId } = params;
            let searchByValue = null;
            if (validate.isNotEmpty(customerId)) {
                searchByValue = customerId;
            } if (validate.isNotEmpty(mobileNo)) {
                searchByValue = validate.isEmpty(searchByValue) ? mobileNo : searchByValue + ',' + mobileNo;
            } if (validate.isNotEmpty(emailId)) {
                searchByValue = validate.isEmpty(searchByValue) ? emailId : searchByValue + ',' + emailId;
            }
            setSearchBy(searchByValue);
            let obj = { ...params, 'startIndex': 0, 'limit': 10 };
            getInitialCustomerData(obj);
        }

    }, [props.location.search]);



    const getInitialCustomerData = async (obj) => {
        isLoading(true);
        let initialCustomerData = await getCustomerData(obj);
        if (Validate().isNotEmpty(initialCustomerData)) {
            setGridData(initialCustomerData.dataGrid);
            setDataSet(initialCustomerData.dataSet);
            disableCreateCustomerForm(false);
        } else {
            setGridData(undefined);
            setDataSet([]);
            disableCreateCustomerForm(true);
        }
        isLoading(false);
    }

    const getCustomerData = async (obj) => {
        const {v,...rest} = obj;
        return await CustomerService().customerHome(rest).then((data) => {
            if (data && data.statusCode === "SUCCESS") {
                setActiveTab('1');
                return data.dataObject;
            } else {
                setActiveTab('2');
                return [];
            }
        }).catch((err) => {
            setActiveTab('1')
            setAlertContent({alertmessage:"Error while searching customer, Please try after some time"});
            return [];
        });
    }

    const remoteDataFunction = async ({ startIndex, limit }) => {
        let tempObj = Validate().isNotEmpty(paramsObj) ? { ...paramsObj, 'startIndex': startIndex, 'limit': limit } : { 'startIndex': startIndex, 'limit': limit };
        let data = await getCustomerData(tempObj);
        if (Validate().isNotEmpty(data)) {
            return { dataSet: data.dataSet, totalRowsCount: data.dataGrid.totalRowsCount, status: true }
        }
    }

    const ActionCustomComponent = (props) => {
        const { row } = props;
        const { action } = row;
        if (action === "Active") {
            return <React.Fragment>
                <CallIcon handleOnClick={() => { makeOutBoundCall(row.callActionUrl) }} tooltip={"Call Customer"} />
                <RecordIcon tooltip="Record Call" handleOnClick={() => { gotoMartCustomerPage({ pageToRedirect: "Communication", customerId: row.customerId, beautyCustomerId: row.webLoginId, mergeStatus: row.isMergedFlag, mobile: row.mobile, customerType: row.customerType, firstName: row.firstName, lastName: row.lastName },handleFailure) }} />
                <Shop handleOnClick={() => { gotoMartCustomerPage({ pageToRedirect: "Catalog", customerId: row.customerId, beautyCustomerId: row.webLoginId, mergeStatus: row.isMergedFlag, mobile: row.mobile, customerType: row.customerType, firstName: row.firstName, lastName: row.lastName },handleFailure) }} />
            </React.Fragment>
        } else {
            return <React.Fragment>-</React.Fragment>
        }
    
    }
    const setAgeColumn = (props) => {
        const {row} = props;
        const {dateOfBirth,age} = row;
        return <React.Fragment>
            {validate.isNotEmpty(dateOfBirth)? age+" - "+dateFormat(dateOfBirth, "mmm dd, yyyy") : age}
        </React.Fragment>
    }

    const assignCustomerType = useCallback(({row,column}) => {
        return <>
        {row.type === "A" ? <div className='d-flex justify-content-center'><DoctorIcon/></div> : "-" }
        </>
    },[])

    const getDoctorInfo = (doctorInfo) => {
        return (
          <React.Fragment>
            {validate.isNotEmpty(doctorInfo) &&
              <ul className="mb-0 ps-3">
                {doctorInfo.map((eachDoctorInfo, index) => ((validate.isNotEmpty(eachDoctorInfo) && index != 0) && <li key={index}>{eachDoctorInfo}</li>))}
              </ul>
            }
          </React.Fragment>
        );
      }

      const columnsLength = useMemo(() => {
        if(gridData?.columns) {
           const columns = flattenColumnsList(gridData?.columns);
           return columns.length;
        } else {
          return 0;
        }
      
      },[gridData])

      const popoverPosition=(idx)=>{
        if(idx==columnsLength-1 || idx==columnsLength-2){
          return "left"
        }
        else 
        return "right"
      }

    const setDoctorInfo = (props) => {
        return validate.isNotEmpty(props.row.fullName) ? <React.Fragment>
        {props.row.fullName.length > 1 ? 
        (<>
        <div title="Click to View Doctor Details" id={props.column.key + props.row.cartId} className="d-flex align-items-center justify-content-between pointer">
             <p  className="text-truncate mb-0">{props.row.fullName[0]}</p>
            <svg  xmlns="http://www.w3.org/2000/svg" id="note_black_icon_18px" width="16" height="16" viewBox="-1 0 20 18">
                <path id="Icon_awesome-info-circle" data-name="Icon awesome-info-circle" d="M9.563.563a9,9,0,1,0,9,9A9,9,0,0,0,9.563.563Zm0,3.992A1.524,1.524,0,1,1,8.038,6.079,1.524,1.524,0,0,1,9.563,4.554Zm2.032,9.218a.436.436,0,0,1-.435.435H7.966a.436.436,0,0,1-.435-.435V12.9a.436.436,0,0,1,.435-.435H8.4V10.143H7.966a.436.436,0,0,1-.435-.435V8.837A.436.436,0,0,1,7.966,8.4h2.323a.436.436,0,0,1,.435.435v3.629h.435a.436.436,0,0,1,.435.435Z" transform="translate(-0.563 -0.563)" style={{"fill":"#fff", "stroke":"#6c757d"}} />
            </svg>

        </div>
        <CustomPopOver target={props.column.key+props.row.cartId} value={getDoctorInfo(props.row.fullName)} closePopOver={closePopOver} setClosePopOver={setClosePopOver} headerText={"Doctor Details"} placement={popoverPosition(props.column.idx)} /></>) 
        : (<p id={props.column.key + props.row.cartId} className="text-truncate pointer">{props.row.fullName.join(", ")}</p>) }
            </React.Fragment> :
        <>-</>
    }

    const callBackMapping = {
        "customerId": CustomerIdCustomComponent,
        "renderActionColumn": ActionCustomComponent,
        "getGender": GetGenderComponent,
        "getCompleteAge": setAgeColumn,
        "renderStatusColumn": assignBadges,
        "customerTypeFunction": assignCustomerType,
        "doctorInfo" : setDoctorInfo
    }

    const handleLoader = (flag) => {
        setCustomerCreationLoader(flag);
    }

    return <React.Fragment>
        <Wrapper showHeader={false}>
            <HeaderComponent ref={headerRef} className="align-items-center border-bottom d-flex justify-content-between custom-tabs-forms pb-0">
                <Nav tabs className='pt-1'>
                    <NavItem>
                        <NavLink disabled={activeTab != '1'} className={activeTab == '1' ? 'active' : ''}>
                            Customer Search Results
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink disabled={activeTab != '2'} className={activeTab == '2' ? 'active' : ''}>
                            Create Customer
                        </NavLink>
                    </NavItem>
                </Nav>
            </HeaderComponent>
            <BodyComponent loading={loading} allRefs={customerForm ? { headerRef, footerRef } : { headerRef }} className="body-height" >
                <TabContent activeTab={activeTab} className={!loading ? 'h-100':""}>
                    <TabPane tabId={'1'} className={!loading ? 'h-100':""}>
                        {!loading && validate.isNotEmpty(dataSet) && <div className={'h-100'}>
                            <p className='mb-2'>Search Results By <span className='fw-bold'>'{searchBy}'</span></p>
                            <div className='card' style={{height:`calc(100% - 2rem)`}}>
                                <div className='card-body p-0'>
                                    <CommonDataGrid {...gridData} dataSet={dataSet}
                                        remoteDataFunction={remoteDataFunction}
                                        callBackMap={callBackMapping}
                                    />
                                </div>
                            </div>
                            
                          </div>}
                    </TabPane>
                    <TabPane tabId={'2'} className={!loading ? 'h-100':""}>
                        {!loading && paramsObj && validate.isEmpty(dataSet) && <CreateCustomerForm fieldValues={paramsObj} {...props} clearFormData={clearFormData} setCustomerCreationLoader={setCustomerCreationLoader} onSubmit= {handleLoader}/>}
                    </TabPane>
                </TabContent>
            </BodyComponent>
            {customerForm && <FooterComponent ref={footerRef}>
                <div className='border-top px-3 py-2 d-flex flex-row-reverse full-width-buttons bg-white'>
                    {<button form='newCustomerForm' className='btn btn-danger ms-3'>{customerCreationLoader? <CustomSpinners spinnerText={"Create New Customer"} className={" spinner-position"} innerClass={"invisible"} /> : 'Create New Customer'}</button>}
                    <button className='btn brand-secondary btn' onClick={() => setClearFormData(!clearFormData)}>Clear</button>
                </div>
            </FooterComponent>}
        </Wrapper>
    </React.Fragment>

}

export default CustomerDashboard;