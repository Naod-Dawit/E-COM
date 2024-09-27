import React, { useContext } from "react";
import "../styles/cart.css";
import { CartContext } from "./Cartcontext";
import { Link} from "react-router-dom";

import Checkout from "./Checkout";
const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const handleRemove = (item) => {
    removeFromCart(item);
  };


  
   const totalprice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
    <Link to={"/"}>HOME</Link>
    <Link to={"/cart"}>CART</Link>

    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.images[0]} alt={item.title} />
              <div className="item-details">
                <p>{item.title}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price per item: ${item.price}</p>
                <p>Total: ${item.price * item.quantity}</p>
                <button onClick={() => handleRemove(item)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
          <div className="cart-summary">
            <h1>Total price is ${totalprice.toFixed(2)}</h1>
         
          </div>
      <Checkout/>
    </div>
    </>
  );
};

export default Cart;
