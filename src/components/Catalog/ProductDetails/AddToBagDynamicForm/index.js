import DynamicForm, { ALERT_TYPE, CustomSpinners, withFormHoc } from '@medplus/react-common-components/DynamicForm';
import { useContext, useEffect, useState } from 'react';
import { Roles } from '../../../../constants/RoleConstants';
import Validate from '../../../../helpers/Validate';
import useRole from '../../../../hooks/useRole';
import CatalogService from '../../../../services/Catalog/CatalogService';
import { AlertContext, CustomerContext, LocalityContext, ShoppingCartContext } from '../../../Contexts/UserContext';
import { MEDPLUS_ADVANTAGE } from '../../../customer/Constants/CustomerConstants';
import { getCustomerRedirectionURL } from '../../../customer/CustomerHelper';



const AddToBag = (props) => {

    const { helpers } = props;
    const validate = Validate()
    const productDetailInfo = props.productDetailInfo
    const variantInfo= productDetailInfo.variationProductsInfo;
    const productInfo = productDetailInfo.product;
    const [selectedVariant, setSelectedVariant] = useState("")
    const [hasCrmOrderCreateRole] = useRole([Roles.ROLE_CRM_ORDER_CREATE]);
    const [productAvailableQty, setProductAvailableQty] = useState(null)
    const {shoppingCart, setShoppingCart, isOnlineCartAdded} = useContext(ShoppingCartContext)
    const {martLocality} = useContext(LocalityContext)
    const {setStackedToastContent} = useContext(AlertContext)
    const { customerId, customer} = useContext(CustomerContext)
    const subscribedPharmaSubscriptionId = customer?.subscribedPharmaSubscriptionId
    const [loading, setLoading] = useState(false)
    const catalogService = CatalogService();
    const [quantity, setQuantity] = useState("");
    let selectedProductInShoppingCart = ""
    if(validate.isNotEmpty(shoppingCart)){
        selectedProductInShoppingCart = shoppingCart?.shoppingCartItems.find(product => product.productId === productInfo.productId)
    }
   
    useEffect(()=>{
            setQuantity(validate.isNotEmpty(selectedProductInShoppingCart) ? selectedProductInShoppingCart.packSizeQuantity: "") 
            updateValues(selectedProductInShoppingCart?.packSizeQuantity)
    },[shoppingCart])

    let obj = {
        "htmlElementType": "FORM",
        "id": "CatalogDynamicForm",
        "label": null,
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
                "className": "row g-2",
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
                        "id": "selectVariant",
                        "label": "Select Variant",
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
                        "helperText": null,
                        "dataListClassName": "col-12 col-sm-12 col-md-4 col-lg-2 col-xl-4 col-xxl-3 me-2 p-0",
                        "regex": null,
                        "minLength": null,
                        "maxLength": 30,
                        "min": null,
                        "max": null,
                        "placeholder": null,
                        "hidden": false,
                        
                    },
                    {
                        "htmlElementType": "INPUT",
                        "id": "qtyInPacks",
                        "label": "Enter Quantity in Packs",
                        "name": null,
                        "value": null,
                        "className": null,
                        "readOnly": false,
                        "maxLength": 2,
                        "min": 1,
                        "max": productInfo.catalogRestrictedQty? productInfo.catalogRestrictedQty : 99,
                        "disabled": false,
                        "autofocus": true,
                        "required": true,
                        "style": null,
                        "attributes": { 'autocomplete': 'off' },
                        "message": null,
                        "htmlActions": null,
                        "elementSize": null,
                        "helperText": "The max.qty allowed at a time is 99",
                        "labelClassName": "col-12 col-md-5 col-lg-5  me-2 p-0",
                        "type": "text",
                        "placeholder": null,
                        "hidden": false
                    }, {
                        "htmlElementType": "BUTTON",
                        "id": "addProduct",
                        "label": "Add to Bag",
                        "name": null,
                        "value": null,
                        "className": "col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-3 btn-success btn-sm me-2",
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": false,
                        "style": {"height":"50px"},
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
                    },
                    {
                        "htmlElementType": "BUTTON",
                        "id": "becomeMember",
                        "label": "Become Member for ₹50",
                        "name": null,
                        "value": null,
                        "className": "col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 btn-sm btn-outline-primary",
                        "readOnly": false,
                        "disabled": false,
                        "autofocus": false,
                        "required": false,
                        "style": {"height":"50px"},
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
                        "submit": false,
                        "hidden": false
                    }
                ]
            }
        ],
        "notes": null,
        "atleastOneFieldRequired": false,
        "submitDisabled": false,
        "hidden": false
    };

    const isDrugSchduleX = (product) => {
        if (Validate().isEmpty(product) || Validate().isEmpty(product.drugSchedule)) {
            return false;
        }
        let isDrugSchduleX = false;   
        product.drugSchedule.map(each => {
            if (each == 'X') {
                isDrugSchduleX = true;
            }
        })
        return isDrugSchduleX;
    }

    const updateValues = (updatedQuantity='') => {
        if(hasCrmOrderCreateRole && validate.isNotEmpty(productDetailInfo) && validate.isNotEmpty(productInfo) && productInfo.fridgeItemAllowed){
            let productAvailableQty = null
            if( validate.isNotEmpty(shoppingCart) && shoppingCart.cartError && validate.isNotEmpty(shoppingCart.productAvailableQty) && validate.isNotEmpty(shoppingCart.productAvailableQty[productInfo.productId])){
                productAvailableQty = shoppingCart.productAvailableQty[productInfo.productId]
                setProductAvailableQty(productAvailableQty) 
            }
            if(( validate.isEmpty(productAvailableQty) || productAvailableQty > 0 ) && !isDrugSchduleX(productInfo) && ((productInfo.isInStock) && (productDetailInfo.availQty > 0) && (validate.isNotEmpty(productInfo.isSellable) && productInfo.isSellable === "Y") && (validate.isNotEmpty(productInfo.packSizeMrp) && productInfo.packSizeMrp > 0 )) && (productInfo.isGeneral === "Y" || productDetailInfo.isFridgeItemAllowed) && (validate.isEmpty(productDetailInfo?.replacementProduct?.name))){
                helpers.showElement("qtyInPacks")
                helpers.updateValue(updatedQuantity?updatedQuantity: validate.isEmpty(selectedProductInShoppingCart)? "": quantity, "qtyInPacks", false);
                helpers.showElement("addProduct")
                if(validate.isNotEmpty(productDetailInfo.membershipPrice) && validate.isEmpty(subscribedPharmaSubscriptionId) && productDetailInfo.bestPharmaPlanPrice ){
                    helpers.showElement("becomeMember")
                    const becomeMemberElement = helpers.getHtmlElement("becomeMember");
                    becomeMemberElement.label = `Become Member for ₹${productDetailInfo.bestPharmaPlanPrice}`
                }else{
                    helpers.hideElement("becomeMember")
                }
            }else{
                helpers.hideElement("qtyInPacks")
                helpers.hideElement("addProduct")
                helpers.hideElement("becomeMember")
            }
        }

        if (validate.isNotEmpty(productInfo.isGeneral) && "Y" === productInfo.isGeneral && validate.isNotEmpty(props.productDetailInfo.variationProductsInfo)) {
            helpers.showElement("selectVariant");
            let variantNames = []
            let selectedVariantName = []
            variantInfo.map(each => {
                if (each.productId === productInfo.productId) {
                    setSelectedVariant(each.productId)
                    selectedVariantName.push(each.variantName)
                }
                variantNames.push(createOption(each.productId, each.variantName, each.variantName, each.productId, each.variantName))
            })
            helpers.updateSingleKeyValueIntoField('values', variantNames, "selectVariant");
            helpers.updateSingleKeyValueIntoField('value', selectedVariantName, "selectVariant");
        }else{
            helpers.hideElement("selectVariant");
        }
    }
    

    const createOption = (id, label, name, value, displayValue) => {
        return {
            "htmlElementType": "OPTION",
            "id": id,
            "label": label,
            "name": name,
            "value": value,
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
            "displayValue": displayValue,
            "selected": false,
            "hidden": false
        }
    }

    const onSelectVariant = (payload) =>{
         const event = payload[0]
         if(validate.isNotEmpty(event.target.value) && event.target.value.length>0 && productInfo.productId !== event.target.value[0]){
             props.getProductDetails(event.target.value[0])
         }

    }

    const addProductInCart = async (productId, qty) => {
        let hubStoreId = martLocality.hubId;
        productInfo.quantity = quantity;
    
        if (validate.isEmpty(quantity) || productInfo.quantity <= 0) {
            setStackedToastContent({ toastMessage: " Please Enter a valid quantity" });
            helpers.enableElement("addProduct")
            handleLoaders(false)
            return;
        }
        if (validate.isEmpty(hubStoreId)) {
            setStackedToastContent({ toastMessage: "Please Select or Change Locality." });
            helpers.enableElement("addProduct")
            handleLoaders(false)
            return;
        }
        if (validate.isEmpty(customerId)) {
            setStackedToastContent({ toastMessage: "Invalid customer ID." });
            helpers.enableElement("addProduct")
            handleLoaders(false)
            return;
        }
        if(validate.isNotEmpty(shoppingCart) && selectedProductInShoppingCart && selectedProductInShoppingCart.packSizeQuantity === qty){
            setStackedToastContent({ toastMessage: `The product: ${productInfo?.productName} , with quantity: ${quantity}, is already available in the cart.` }); 
            helpers.enableElement("addProduct")
            handleLoaders(false)
            return;
        }
        const config = {
            headers: { customerId: customerId },
            params: { productId: productId, requestedQuantity: qty, isRecommendedProduct: false }
        };
    
        try {
            const response = await catalogService.addOrModifyProductToCart(config);
            if (validate.isNotEmpty(response)) {
                if (validate.isNotEmpty(response.dataObject) && "SUCCESS" === response.statusCode) {
                    setStackedToastContent({ toastMessage: `Product ${selectedProductInShoppingCart ? "quantity updated":"added"} successfully..!` });
                    if (validate.isNotEmpty(response.dataObject.catalogRestrictedQty)) {
                        props.setCatalogRestrictedQty(response.dataObject.catalogRestrictedQty);
                        await getCartInfo();
                    }
                } else if ("FAILURE" === response.statusCode && validate.isNotEmpty(response.message)) {
                    if ("There is some Problem with the request. Please Try again!" === response.message) {
                        setStackedToastContent({ toastMessage: "Unable to add the product in cart. Please try again" });
                        handleLoaders(false);
                        return;
                    }
                    setStackedToastContent({ toastMessage: response.message });
                }
            }
            helpers.enableElement("addProduct")
            handleLoaders(false);
        } catch (error) {
            helpers.enableElement("addProduct")
            handleLoaders(false);
            console.log(error);
        }
    }

    const getCartInfo = async () => {
        const config = { headers: { customerId: customerId }, params: { onlineCartAdded: isOnlineCartAdded, isFromCatalogPage: true} }
        await catalogService.getCartInfo(config).then(data => {
            if (data && "SUCCESS" === data.statusCode && validate.isNotEmpty(data.dataObject)) {
                setShoppingCart(data.dataObject)
            } else if ("FAILURE" === data.statusCode && validate.isNotEmpty(data.dataObject) && "EMPTY_CART" === data.dataObject) {
                setShoppingCart({})
                setStackedToastContent({ toastMessage: `Online shopping cart for the customer: ${customerId}, is empty. Please add some products to proceed further..!` })
            }
            else {
                setStackedToastContent({ toastMessage: data.message })
            }
            handleLoaders(false);

        }).catch(error => {
            setStackedToastContent({ toastMessage: "Unable to get Shopping Cart details..!" })
            handleLoaders(false);
            console.log(error)
        })

    }
    

    const handleChange = (payload) => {
        const event = payload[0]
        const numberpattern = /^[0-9\b]+$/;
     if (event.target.value === '' || numberpattern.test(event.target.value)) {
        setQuantity(event.target.value);
      }else if(validate.isNotEmpty(event.target.value) && !numberpattern.test(event.target.value)){
        helpers.updateSingleKeyValueIntoField('value', "", "qtyInPacks");
      }

    }

    const handleAddProductClick = (payload) =>{
        handleLoaders(true)
        helpers.disableElement("addProduct")
        addProductInCart(productInfo.productId, quantity)
    }

    const handleBecomeMemberClick = (payload) => {
        props.history.push(getCustomerRedirectionURL(customerId,MEDPLUS_ADVANTAGE))
    }
    const customLoader = () => {
        return(
            <>
            {loading && <CustomSpinners spinnerText={"submit"} className={" spinner-position"} innerClass={"invisible"} />}
            </>
        )
    }
    
    const customSpinner = {
        'addProduct' : [['INSERT_IN' , customLoader]]
    } 

    const handleLoaders = (loading)=> {
        helpers.updateSingleKeyValueIntoField("label",loading ? null : "Add to Bag","addProduct");
        setLoading(loading);
    }

    const observersMap = {
        'CatalogDynamicForm': [['load', updateValues]],
        'selectVariant' : [['select', onSelectVariant]],
        'qtyInPacks' : [['change', handleChange]],
        'addProduct' : [['click', handleAddProductClick]],
        'becomeMember' : [['click', handleBecomeMemberClick]]
    }

    

    return (
        <>
        <DynamicForm formJson={obj} helpers={helpers} observers={observersMap}  customHtml={customSpinner}/>
        {validate.isNotEmpty(productAvailableQty) && productAvailableQty > 0 && <div class="mt-5">Available Quantity : {productAvailableQty}</div> }
		{validate.isNotEmpty(productAvailableQty) && productAvailableQty == 0 &&<div class="mt-5" > This product is not allowed for <strong>add to cart</strong></div>}
        </>
    )
}

export default withFormHoc(AddToBag) 