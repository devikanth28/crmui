import React from 'react';
import { Button } from 'react-bootstrap';
import mart_icon from '../../../images/mart-cart-icon.svg';
import Validate from '../../../helpers/Validate';
import { CRM_UI } from '../../../services/ServiceConstants';

const MiniCart = (props) => {
  const martShoppingCart = props.isCatalog || props.location.pathname.includes('catalogSearch');
  const validate = Validate();
  const miniCart = props.miniCart;
  const showMiniCart = props.showMiniCart;

  const getMartMiniShoppingCart = () => {
        props.martMiniCart();
  }

  const redirectToShoppingCart = () => {
    props.history.push(`${CRM_UI}/shoppingCart`);
  }

  const clearShoppingCart = () => {
    props.clearCart();
  }

  return (
    <div className='inblock'>
      <div className="justify-content-center">
        <Button variant="light" className='me-2'><img src={mart_icon}></img> </Button>
        <a href=''>MiniCart</a>&nbsp;
        {martShoppingCart && <button className='rounded-circle' onClick={getMartMiniShoppingCart}>MartCart</button>}
      </div>

      {validate.isNotEmpty(miniCart) && miniCart.length > 0 && miniCart.map(eachCartItem => {
        return <React.Fragment>
          {validate.isNotEmpty(eachCartItem.productName) && validate.isNotEmpty(eachCartItem.quantity) && <p>{eachCartItem.productName} --- {eachCartItem.quantity} </p>}
        </React.Fragment>
      })}
      {showMiniCart && validate.isNotEmpty(miniCart) && <button onClick={clearShoppingCart}>Clear Cart</button>}
      {showMiniCart && validate.isNotEmpty(miniCart) && <button onClick={redirectToShoppingCart}>View ShoppingCart</button>}
      {!showMiniCart && validate.isEmpty(miniCart) && <p>You have not added any products to Cart </p>}
    </div>
  )
}
export default MiniCart
