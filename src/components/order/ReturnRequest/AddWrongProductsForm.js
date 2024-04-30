import CommonDataGrid from "@medplus/react-common-components/DataGrid";
import DynamicForm, { withFormHoc } from '@medplus/react-common-components/DynamicForm';
import React, { useContext, useState } from "react";
import Validate from "../../../helpers/Validate";
import OrderService from "../../../services/Order/OrderService";
import { AlertContext } from "../../Contexts/UserContext";

const AddWrongProductsForm = ({ helpers, wrongProducts, setWrongProducts, ...props }) => {

    const [products, setProducts] = useState({});
    const { setStackedToastContent } = useContext(AlertContext);

    let obj = {
        "htmlElementType": "FORM",
        "id": "addWrongProductsForm",
        "label": "Add new Product details",
        "name": null,
        "value": null,
        "className": null,
        "readOnly": false,
        "disabled": false,
        "autofocus": false,
        "required": false,
        "style": null,
        "attributes": null,
        "message": null,
        "htmlActions": null,
        "elementSize": null,
        "defaultValue": null,
        "helperText": null,
        "labelClassName": null,
        "htmlGroups": [
            {
                "htmlElementType": "ELEMENTGROUP",
                "id": "group1",
                "label": null,
                "name": null,
                "value": null,
                "className": "row g-3 mb-4",
                "readOnly": false,
                "disabled": false,
                "autofocus": false,
                "required": false,
                "style": null,
                "attributes": null,
                "message": null,
                "htmlActions": null,
                "elementSize": null,
                "defaultValue": null,
                "helperText": null,
                "labelClassName": null,
                "groups": null,
                "groupElements": [
                    {
                        "htmlElementType": "DATALIST",
                        "id": "name",
                        "label": "Product Name",
                        "name": null,
                        "value": null,
                        "onInputChangeEnable": true,
                        "className": null,
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": true,
                        "style": null,
                        "attributes": null,
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "defaultValue": null,
                        "helperText": null,
                        "labelClassName": "col-5",
                        "regex": null,
                        "minLength": null,
                        "maxLength": 30,
                        "min": null,
                        "max": null,
                        "placeholder": null,
                        "hidden": false,
                        "values": []
                    },
                    {
                        "htmlElementType": "INPUT",
                        "id": "packSize",
                        "label": "Pack Size",
                        "name": null,
                        "value": null,
                        "className": null,
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": true,
                        "style": null,
                        "attributes": null,
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "defaultValue": 1,
                        "helperText": null,
                        "labelClassName": "col-3",
                        "type": "number",
                        "regex": "^[0-9]+$",
                        "minLength": null,
                        "maxLength": 4,
                        "min": 1,
                        "max": 1000,
                        "placeholder": null,
                        "hidden": false
                    },
                    {
                        "htmlElementType": "INPUT",
                        "id": "qtyInPacks",
                        "label": "QTY Recieved (in Packs)",
                        "name": null,
                        "value": null,
                        "className": null,
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": true,
                        "style": null,
                        "attributes": null,
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "defaultValue": 1,
                        "helperText": null,
                        "labelClassName": "col-3",
                        "type": "number",
                        "regex": "^[0-9]+$",
                        "minLength": null,
                        "maxLength": 2,
                        "min": 1,
                        "max": 99,
                        "placeholder": null,
                        "hidden": false
                    }, {
                        "htmlElementType": "BUTTON",
                        "id": "addProduct",
                        "label": "Add",
                        "name": null,
                        "value": null,
                        "className": "col-1",
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": false,
                        "style": null,
                        "attributes": null,
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "defaultValue": null,
                        "helperText": null,
                        "labelClassName": null,
                        "src": null,
                        "href": null,
                        "reset": false,
                        "submit": true,
                        "hidden": false
                    }
                ]
            }
        ],
        "notes": null,
        "atleastOneFieldRequired": false,
        "submitDisabled": true,
        "hidden": false
    };

    const addedProductsGrid = {
        "idProperty": "name",
        "columns": [
            {
                "columnName": "Product Name",
                "rowDataKey": "name",
            },
            {
                "columnName": "Pack Size",
                "rowDataKey": "packSize"
            },
            {
                "columnName": "Quantity(in packs)",
                "rowDataKey": "qtyInPacks"
            },
            {
                "columnName": "Quantity(in units)",
                "rowDataKey": "qtyInUnits"
            },
            {
                "columnName": "Action",
                "rowDataKey": "action",
                "customRowRenderingFunction": { name: "renderActionColumn", returnType: "REACT_NODE", type: "FUNCTION" }
            }
        ]
    }

    const addProduct = () => {
        let formValues = helpers.validateAndCollectValuesForSubmit("addWrongProductsForm", false, false, false);
        let product = products[formValues.name];
        if (Validate().isNotEmpty(wrongProducts[product.productName])) {
            setStackedToastContent({toastMessage:"Product: " + product.productName + " already existed!"});
            return false;
        }
        if (Object.keys(wrongProducts).length === props.productsLength) {
            setStackedToastContent({toastMessage:"Max limit(" + props.productsLength + ") exceeded"});
            return false;
        }

        let qtyInUnits = formValues.qtyInPacks * formValues.packSize;
        formValues = { ...formValues, name: product.productName, qtyInUnits: qtyInUnits }
        let temp = { ...wrongProducts, [product.productName]: formValues };
        setWrongProducts(temp);
        helpers.resetForm("addWrongProductsForm");
    }

    const getProductSuggestions = (payload) => {
        let searchInput = payload[0].target.value;
        if (searchInput && searchInput.length < 3) {
            return;
        }
        let suggestions = [];
        OrderService().getProducts({ searchKeyword: searchInput }).then(res => {
            if ("SUCCESS" === res.statusCode && Validate().isNotEmpty(res.dataObject)) {
                setProducts(res.dataObject);
                Object.values(res.dataObject).forEach(element => {
                    suggestions.push(helpers.createOption(element.productId, element.productName, element.productId));
                });
                helpers.updateSingleKeyValueIntoField("values", suggestions, "name");
            }
        }, err => {
            console.log(err);
        })
    }

    const updatePackSize = (payload) => {
        helpers.updateSingleKeyValueIntoField("value", products[payload[0].target.value].packSize, "packSize")
    }
    const observersMap = {
        'addProduct': [['click', addProduct]],
        'name': [['change', getProductSuggestions], ['select', updatePackSize]]
    }
    const callBackMapping = {
        "renderActionColumn": (props) => {
            const removeProduct = () => {
                let temp = { ...wrongProducts };
                delete temp[props.row.name];
                setWrongProducts(temp);
            }
            return <button onClick={() => removeProduct()}>X</button>;
        }
    }

    return <React.Fragment>
        <DynamicForm formJson={obj} helpers={helpers} observers={observersMap} />
        {Validate().isNotEmpty(wrongProducts) && <CommonDataGrid
            {...addedProductsGrid}
            dataSet={Object.values(wrongProducts)}
            callBackMap={callBackMapping}
        />}
    </React.Fragment>
}
export default withFormHoc(AddWrongProductsForm);