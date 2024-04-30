import React, { useContext } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Validate from "../../../helpers/Validate";
import NoDataFoundIcon from '../../../images/No-Data-Found.svg';
import ShoppingCart from "../../Checkout/ShoppingCart";
import { LocalityContext, ShoppingCartContext } from "../../Contexts/UserContext";

const CartModal = (props) => {
    const { cartHeader = null, cartBody = null, cartFooter = null, isCartOpen, closeCartSection } = props;
    const {redisCart, isOnlineCartAdded} = useContext(ShoppingCartContext)
    const {martLocality} = useContext(LocalityContext)
    const validate = Validate();

    const emptyCart = () => {
        return (
            <div style={{ marginTop: "5rem", marginBottom: "5rem" }}>
                <div className="text-center">
                    <img src={NoDataFoundIcon} alt="No Data Found" />
                        <p className="mb-0">No products to show..!</p>
                        <p className="mb-0">{`${(validate.isNotEmpty(redisCart) && !isOnlineCartAdded && martLocality?.hubId)? "Add products from the Online Cart or ":""}Search above to get the products.`}</p>   
                    {props.searchButton ? <Button variant="dark" className="mt-3" onClick={() => loadPage()}>Search Again</Button> : null}
                </div>
            </div>
        );
    }

    const CloseButton = <button type="button" className="btn btn-link align-self-center icon-hover rounded-5" onClick={() => closeCartSection(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <rect fill="none" width="24" height="24" />
            <path d="M20.76,19.55l-7.58-7.56,7.56-7.56a.846.846,0,0,0-.04-1.18.822.822,0,0,0-1.13,0L12,10.81,4.44,3.24A.827.827,0,0,0,3.27,4.41l7.56,7.58L3.27,19.55a.835.835,0,0,0,1.14,1.22l.04-.04L12,13.17l7.56,7.56a.833.833,0,0,0,1.17,0h0a.821.821,0,0,0,.04-1.16A.031.031,0,0,0,20.76,19.55Z" fill="#b9b9b9" />
        </svg>
    </button>

    return (
        <Modal className='modal-dialog-centered modal-xl crm-customer-app' isOpen={isCartOpen}>
            <ModalHeader className='d-flex justify-content-between align-items-center border-bottom px-3 py-2' close={CloseButton} >
                {cartHeader()}
            </ModalHeader>
            <ModalBody className='p-0'>
                {validate.isNotEmpty(cartBody) ? cartBody() : emptyCart()}
            </ModalBody>
            <ModalFooter>
                {cartFooter()}
            </ModalFooter>
        </Modal>
    );
};

export default CartModal;
