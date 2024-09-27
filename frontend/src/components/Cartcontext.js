import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const removeFromCart = (itemToRemove) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.id === itemToRemove.id
    );

    if (existingItem.quantity > 1) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.id === itemToRemove.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      setCart(updatedCart);
    } else {
      const updatedCart = cart.filter(
        (cartItem) => cartItem.id !== itemToRemove.id
      );
      setCart(updatedCart);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
