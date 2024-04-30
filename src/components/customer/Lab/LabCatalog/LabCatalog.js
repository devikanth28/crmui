import React, { useContext, useEffect, useRef, useState } from "react";
import { BodyComponent, HeaderComponent, Wrapper } from "../../../Common/CommonStructure";
import ProductSearchSuggestions from "../../../Catalog/ProductSearch/SearchSuggestion";
import Validate from "../../../../helpers/Validate";
import { AlertContext, CustomerContext, LocalityContext, ShoppingCartContext, UserContext } from "../../../Contexts/UserContext";
import LabOrderService from "../../../../services/LabOrder/LabOrderService";
import { isResponseSuccess } from "../../../../helpers/CommonHelper";
import LabShowCart from "./LabShowCart";
import LabCatalogTestDetail from "./LabCatalogTestDetail";
import { isTestAddedToCart } from "../CustomerLabHelper";
import { prepareRequestFrom } from "../../../../helpers/HelperMethods";
import useRole from "../../../../hooks/useRole";
import { Roles } from "../../../../constants/RoleConstants";
import CartButton from "../../../Catalog/Common/MobileCartButton";

const LabCatalog = (props) => {
    
    const [suggestions, setSuggestions] = useState([]);
    const headerRef = useRef();
    const footerRef = useRef();
    const searchHeaderRef = useRef();
    const validate = Validate();
    const { customerId } = useContext(CustomerContext);
    const { labLocality } = useContext(LocalityContext);
    const { labShoppingCart, setLabShoppingCart } = useContext(ShoppingCartContext);
    const { setStackedToastContent } = useContext(AlertContext);
    const userSessionInfo = useContext(UserContext);
    const [isPathlabAgent, isFrontOfficeOrderCreate] = useRole([Roles.ROLE_CRM_PHLEBOTOMIST_PATHLAB_AGENT, Roles.ROLE_CRM_LAB_FRONT_OFFICE_ORDER_CREATE]);
    const [suggestionLoading, isSuggestionLoading] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState(undefined);
    const [cartSummary, setCartSummary] = useState({});
    const [loading, setLoading] = useState(false);
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [showCartSection, setShowCartSection] = useState(false);


    useEffect(() => {
        getCustomerLabShoppingCart();
    }, [labLocality]);

    useEffect(() => {
        if(validate.isNotEmpty(props?.match?.params?.testId)) {
            setSelectedTestId(props?.match?.params?.testId);
        }
    },[props?.match?.params?.testId])

    const getCustomerLabShoppingCart = () => {
        const requestFrom = prepareRequestFrom(isPathlabAgent, isFrontOfficeOrderCreate);
        const config = { headers: { customerId: customerId }, params: { customerId: customerId, requestFrom: requestFrom } }
        setLoading(true);
        LabOrderService().getLabShoppingCart(config).then(response => {
            if (isResponseSuccess(response) && validate.isNotEmpty(response.responseData) && validate.isNotEmpty(response.responseData.shoppingCart)) {
                setLabShoppingCart(response.responseData.shoppingCart);
                setCartSummary(response?.responseData?.cartSummary)
                setLoading(false);
            } else {
                setLabShoppingCart({});
                setCartSummary({});
                setLoading(false);
            }
        }).catch((e) => {
            setLoading(false);
            setStackedToastContent({ toastMessage: "Unable to get shopping cart" });
            console.log(e);
        });
    }

    const getSuggestions = async (searchKeyword) => {
        if (validate.isNotEmpty(searchKeyword) && searchKeyword.trim().length > 1) {
            isSuggestionLoading(true);
            let response = await getTestSearch(searchKeyword);
            if (isResponseSuccess(response)) {
                let productResponse = response?.dataObject?.displaySearchItems;
                if (validate.isNotEmpty(productResponse)) {
                    setSuggestions(productResponse);
                }
            } else {
                setSuggestions([]);
                setStackedToastContent({ toastMessage: validate.isNotEmpty(response?.message) ? response?.message : "Unable to get test suggestions" });
            }
            isSuggestionLoading(false);
        }
    }

    const getTestSearch = (searchedText) => {
        const searchCriteria = {
            searchKey: searchedText,
            customerId: customerId
        };
        const config = { headers: { customerId: customerId }, params: { ...searchCriteria } }
        return LabOrderService().getLabTestSuggestions(config);
    }

    

    return (
        <React.Fragment>

            <Wrapper>
                <HeaderComponent className={"border-bottom"} ref={headerRef}>
                    <div className="d-flex align-items-center justify-content-between p-12">
                        <p className="mb-0">Search Catalogue</p>
                    </div>
                </HeaderComponent>
                <BodyComponent allRefs={{ headerRef }} className="body-height" loading={loading}>
                    {!loading && <div className="catalog-body">
                        <div className='col-12 col-xl-4 pe-xl-2 h-100 sticky-product-search'>
                            <LabShowCart  addToCartLoading={addToCartLoading} setAddToCartLoading={setAddToCartLoading} cartSummary={cartSummary} setCartSummary={setCartSummary} history={props.history} suggestions={suggestions} setSuggestions={setSuggestions} loading={suggestionLoading} setSelectedTestId={setSelectedTestId} getSuggestions={getSuggestions} showCartSection={showCartSection} setShowCartSection={setShowCartSection}/>
                         </div> 
                         <div className="col-12 col-xl-8 ps-xl-2 h-100 mt-2 mt-lg-0">
                                <LabCatalogTestDetail addToCartLoading={addToCartLoading} setAddToCartLoading={setAddToCartLoading}  testId={selectedTestId ? selectedTestId : null} isTestAddedToCart={selectedTestId ? isTestAddedToCart(selectedTestId.split("_")[selectedTestId.split("_").length - 1], labShoppingCart) : null} setCartSummary={setCartSummary} {...props}/>
                        </div>
                        <CartButton quatity={labShoppingCart?.shoppingCartItems?.length} openCartSection={setShowCartSection}/>
                    </div>}
                </BodyComponent>

            </Wrapper>
        </React.Fragment>
    )
}
export default LabCatalog;