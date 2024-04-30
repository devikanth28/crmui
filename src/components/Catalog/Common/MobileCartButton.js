import React from "react";
import { Button } from "react-bootstrap";

const CartButton = (props) => {
    const {quantity, openCartSection} = props;
    
    return (
        <div key={quantity} className={`toggle-cart bg-dark p-12 ${quantity > 0 ? 'shakeY' : ''}`} id="toggle-prescription-btn" onClick={() => openCartSection(true)}>
            <Button variant=" " type="button" className="btn p-0 text-white">
                <svg id="cart_black_icon_44px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 44 44">
                    <rect id="Rectangle_3287" data-name="Rectangle 3287" width="44" height="44" transform="translate(0 0)" fill="none" />
                    <g id="Group_14537" data-name="Group 14537" transform="translate(0.001 3)">
                        <path id="Path_22919" data-name="Path 22919" d="M50.376,179.467a1.435,1.435,0,1,0,0,2.869H56.1c2.374,5.881,4.713,11.774,7.069,17.666L61,205.218a1.435,1.435,0,0,0,1.329,1.987H86.245a1.435,1.435,0,1,0,0-2.869H64.484l1.241-2.959,23.032-1.839a1.478,1.478,0,0,0,1.285-1.105L92.911,186a1.5,1.5,0,0,0-1.4-1.749H59.956L58.4,180.363a1.47,1.47,0,0,0-1.329-.9Zm10.73,7.65H89.7l-2.226,9.656-21.807,1.732Zm6.008,21.045a4.782,4.782,0,1,0,4.783,4.783A4.805,4.805,0,0,0,67.115,208.162Zm14.347,0a4.782,4.782,0,1,0,4.783,4.783A4.8,4.8,0,0,0,81.462,208.162Zm-14.347,2.869a1.913,1.913,0,1,1-1.912,1.914A1.892,1.892,0,0,1,67.115,211.031Zm14.347,0a1.913,1.913,0,1,1-1.912,1.914A1.892,1.892,0,0,1,81.462,211.031Z" transform="translate(-48.941 -179.467)" fill="#fff" />
                    </g>
                </svg>
                <span className="mx-2">Cart</span>
            </Button>
        </div>
    );
};

export default CartButton;