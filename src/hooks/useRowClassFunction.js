import { useCallback } from "react"


/* 
this hook is used to return a rowClass function in datagrid which will handle model closing return row-popup-openend class

*/

const useRowClassFunction = ({uniqueId , selectedOrderId}) => {


    const rowClassFunction = useCallback((row) => {
        let rowClassName = '';
        if (row[uniqueId] == selectedOrderId) {
            rowClassName = "row-popup-opened";
        }
        return rowClassName;

    }, [selectedOrderId])

    const rowClaimedClassFunction = useCallback((row) => {
        let rowClassName = '';
        if (row[uniqueId] == selectedOrderId) {
            rowClassName = "row-edited-success";
        }
        return rowClassName;        
    }, [selectedOrderId])



    return [rowClassFunction, rowClaimedClassFunction]

}


export default useRowClassFunction;