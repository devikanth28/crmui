import React, { useState} from 'react';

import Validate from '../../helpers/Validate';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem }  from 'reactstrap';


const ProductSearchDropDown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);

    const restrictedQty = parseInt(props.restrictedQty);
    let selectedQty = parseInt(props.selectedQty);
    const isPacksRequired = Validate().isNotEmpty(props.isPacksRequired) ? props.isPacksRequired : true;
    let  maxQty = restrictedQty > 0 ? restrictedQty : 99; 
    selectedQty =  (restrictedQty > 0 && restrictedQty < selectedQty) ? restrictedQty : selectedQty;
    let startIndex  = Validate().isNotEmpty(props.startIndex) ? props.startIndex : 1 ;

    let dropDownClass = Validate().isNotEmpty(props.dropDownClass) ? "custom-dropdown "+props.dropDownClass : "custom-dropdown";
    let qtyToChange = [];
    for (let qty = startIndex; qty <= maxQty ; qty++) {
        qtyToChange.push(qty);
    }
    return (
        <React.Fragment>
            <div className={dropDownClass}>
        <Dropdown isOpen={dropdownOpen} toggle={toggle} onClick={(e)=>e.stopPropagation()}> 
            <DropdownToggle caret className={`btn btn-block pr-5 rounded-pill border ${props.roundedButton}`} color="white">
                <React.Fragment>{`Qty ${selectedQty}`} {isPacksRequired && '(Packs)'}</React.Fragment>
            </DropdownToggle>
            <DropdownMenu modifiers={[{
              setMaxHeight: {
                enabled: true,
                order: 890,
                fn: (data) => {
                  return {
                    ...data,
                    styles: {
                      ...data.styles,
                      overflow: 'auto',
                      maxHeight: 200,
                    },
                  };
                },
              },
            }]}
        >
           {qtyToChange.map((qty) =>{
            return(
                <DropdownItem className={selectedQty == qty ? 'active':''} key={props.productId+"-"+qty} value={qty} onClick={(e)=> selectedQty != qty && props.updateCartQty(props.productId,qty,e)}>
                <React.Fragment>{qty} {isPacksRequired && '(Packs)'}</React.Fragment>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16.621 16">
                    <g transform="translate(-12 -13)">
                        <rect width="16" height="16" transform="translate(12 13)" fill="none"></rect>
                        <path d="M18,9,9.75,17.25,6,13.5" transform="translate(8.5 7.5)" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </g>
                </svg>
                </DropdownItem>
            )})}
            </DropdownMenu>
        </Dropdown>
      </div>
        </React.Fragment>
    )
}

export default ProductSearchDropDown;
