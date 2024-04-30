import React, { useEffect, useRef, useState } from "react";
import CommunicationService from "../../services/Communication/CommunicationService";
import Validate from "../../helpers/Validate";
import NoDataFound from "../Common/NoDataFound";
import CommonDataGrid, { CustomPopOver } from "@medplus/react-common-components/DataGrid";
import {UncontrolledPopover, PopoverBody, PopoverHeader } from "reactstrap";
import DynamicGridHeight from "../Common/DynamicGridHeight";
const CommunicationDisplay = (props) => {

    const defaultCriteria = {
        startIndex: 0,
        limit: 10
    }

    const headerRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const validate = Validate();
    const [dataSet, setDataSet] = useState([]);
    const [gridData, setGridData] = useState(undefined);
    const [searchCriteria, setSearchCriteria] = useState({});
    const [closePropover , setClosePopover] = useState(false)
    const params = { customerId: props.customerId, orderId: props.orderId, displayOrderId: props.displayOrderId, orderType: props.orderType }

    useEffect(() => {
        if (validate.isNotEmpty(params)) {
            const paramsSearchCriteria = getActualSearchCriteria(params);
            const currentSearchCriteria = getActualSearchCriteria(searchCriteria);
            if (validate.isEqualObject(paramsSearchCriteria, currentSearchCriteria)) {
                return;
            }
        }
        let limitTo = params.limitTo ? params.limitTo : defaultCriteria.limit;
        setSearchCriteria({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
        getInitialData({ ...params, limitFrom: params.pageNumber ? (params.pageNumber - 1) * limitTo : 0, limitTo: limitTo });
    }, [props.customerId, props.orderId, props.orderType, props.displayOrderId])

    
    useEffect(() => {
        let element = document.querySelector("div#OrderSearchModel");
        if(element !== null) {
            element.addEventListener('scroll', ()=>{
                setClosePopover(true)
            });
        
        }
        // cleanup this component
        return () => {
            if(element != null ){
                element.removeEventListener('scroll', () => {
                    setClosePopover(false)
                  });
            }
        };
      }, []);

    const getActualSearchCriteria = (criteria) => {
        const { pageNumber, limitTo, limitFrom, ...rest } = criteria;
        return rest;
    }

    const getInitialData = async (searchCriteria) => {
        setLoading(true);
        if (props.customerId && (props.orderId || props.displayOrderId)) {
            const data = await showCommunicationDetails(searchCriteria);
            setGridData((validate.isNotEmpty(data) && validate.isNotEmpty(data.dataGrid)) ? data.dataGrid : undefined);
            setDataSet((validate.isNotEmpty(data) && validate.isNotEmpty(data.dataSet)) ? [...data.dataSet] : []);
        }
        setLoading(false)
    }

    const showCommunicationDetails = async (obj) => {
        return await CommunicationService().getLogDetails(obj).then((data) => {
            if (data && data.statusCode === "SUCCESS") {
                return data.dataObject;
            } else if (data && data.statusCode === "FAILURE") {
                return [];
            } else {
                return [];
            }
        }).catch(() => {
            alert("The System is Offline")
            setLoading(false)
            return [];
        });
    }

    const remoteDataFunction = async ({ startIndex, limit }) => {
        let temObj = { ...searchCriteria, limitFrom: startIndex, limitTo: limit };
        const data = await showCommunicationDetails(temObj);

        if (validate.isNotEmpty(data)) {
            setDataSet(data.dataSet);
            return { dataSet: data.dataSet, totalRowsCount: data.dataGrid.totalRowsCount, status: true }
        } else {
            return { dataSet: [], totalRowsCount: 0, status: true }
        }
    }

const getDescriptionColumn = ({ row, column }) => {
    return (
        <React.Fragment>
            {
                validate.isNotEmpty(row) && validate.isNotEmpty(row.message) ?
                    <React.Fragment>
                        <p id={`description-column_${row.communicationId}`} className="text-truncate pointer" title="Click To Show Description">{row.message}</p>
                        <CustomPopOver value={row.message} target ={`description-column_${row.communicationId}`} headerText ={column.name} closePopOver={closePropover}  setClosePopOver={setClosePopover}/>
                       
                    </React.Fragment>
                    :
                    <p>-</p>
            }
        </React.Fragment>
    ); 
}
const callBackMap = {
    "descriptionPopOver" : getDescriptionColumn
}
    return (
        <React.Fragment>
              {!loading && validate.isNotEmpty(dataSet) ? 
                        <div className="card border-0 h-unset" style={{height: `${props.containerHeight}px`}}>
                            <DynamicGridHeight metaData={gridData} dataSet={dataSet} gridMaxRows={dataSet.length} id="communication-display-grid" className='card-body p-0 scroll-grid-on-hover'>
                                <CommonDataGrid {...gridData} dataSet={dataSet} callBackMap={callBackMap} remoteDataFunction={remoteDataFunction} />
                            </DynamicGridHeight>
                        </div> 
                    :   <div className="h-unset" style={{height: props.containerHeight ? `${props.containerHeight}px` : `100%`}}><NoDataFound text="No communication found for this Order."/></div>
                }
        </React.Fragment>
    )
}
export default CommunicationDisplay;
