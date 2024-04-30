import Validate from "./Validate";

export const COLUMN_OPTIONS_URL_KEY_CONSTANT = "columnOptions";

export const modifyUrlColumnOptions = (props, rowDataKey, columnOptionsMap) => {
    const modifiedUrlQueryParams = modifyUrlParamsString(props, rowDataKey, columnOptionsMap);
    const newUrl = `${props.location.pathname}?${modifiedUrlQueryParams}`;
    props.history.push(newUrl);
}

const modifyUrlParamsString = (props, rowDataKey, columnOptionsMap) => {
    const queryParams = new URLSearchParams(props.location.search);
    let columnOptions = queryParams.get(COLUMN_OPTIONS_URL_KEY_CONSTANT);

    if (typeof columnOptions == "undefined" || Validate().isEmpty(columnOptions)) {
        columnOptions = newColumnOptionsChangedReference(rowDataKey, columnOptionsMap);
    } else {
        columnOptions = atob(columnOptions);
        if (columnOptions.indexOf(rowDataKey) !== -1) {
            columnOptions = columnOptions.replace(new RegExp(`${rowDataKey}-[lriu]`, 'g'), newColumnOptionsChangedReference(rowDataKey, columnOptionsMap));
        } else {
            columnOptions = columnOptions.concat(",").concat(newColumnOptionsChangedReference(rowDataKey, columnOptionsMap));
        }
    }

    columnOptions = btoa(columnOptions);
    queryParams.set(COLUMN_OPTIONS_URL_KEY_CONSTANT, columnOptions);
    return queryParams.toString();
}

const newColumnOptionsChangedReference = (rowDataKey, columnOptionsMap) => {
    if (typeof columnOptionsMap[rowDataKey].isVisible != "undefined" && !columnOptionsMap[rowDataKey].isVisible) {
        return rowDataKey + "-i";
    } else if (columnOptionsMap[rowDataKey].frozen) {
        switch (columnOptionsMap[rowDataKey].frozenColumnPosition.toUpperCase()) {
            case "LEFT":
                return rowDataKey + "-l"
                break;

            case "RIGHT":
                return rowDataKey + "-r"
                break;
        }
    } else if (typeof columnOptionsMap[rowDataKey].frozen != "undefined" && !columnOptionsMap[rowDataKey].frozen) {
        return rowDataKey + "-u";
    }
}

export const prepareModifiedColumnOptionsMap = (props) => {  
    let modifiedColumnOptionsMap = {};
    
    const queryParams = new URLSearchParams(props.location.search);
    let columnOptions = queryParams.get(COLUMN_OPTIONS_URL_KEY_CONSTANT);
    if (typeof columnOptions == "undefined" || Validate().isEmpty(columnOptions)) {
        return modifiedColumnOptionsMap;
    }
    columnOptions = atob(columnOptions);
    const columnsToModify = columnOptions.split(",");

    const urlColumnOptionsMap = {};
    columnsToModify.forEach((element) => {
        const [key, value] = element.split('-');
        urlColumnOptionsMap[key] = value;
    });

    if(Validate().isNotEmpty(urlColumnOptionsMap)){
        Object.entries(urlColumnOptionsMap).map(([key, value]) => {
            let modifiedColumnOption = {}
            if (value == "i") {
                modifiedColumnOption = {[key]:{"isVisible" : false}};
            } else if (value == "u") {
                modifiedColumnOption = {[key]:{"frozen" : false}};
            } else {
                switch (value) {
                    case "l":
                        modifiedColumnOption = {[key]:{"frozen" : true, "frozenColumnPosition" : "LEFT"}};
                        break;

                    case "r":
                        modifiedColumnOption = {[key]:{"frozen" : true, "frozenColumnPosition" : "RIGHT"}};
                        break;
                }
            }
            modifiedColumnOptionsMap = {...modifiedColumnOptionsMap, ...modifiedColumnOption};
        })
    }

    return modifiedColumnOptionsMap;
}