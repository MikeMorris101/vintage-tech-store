import React, { useEffect } from 'react';
import localCart from '../utils/localCart';
import { useState } from 'react';

function getCartFromLocalStorage() {
  return localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : [];
}

const CartContext = React.createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState(getCartFromLocalStorage());
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    //local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    //cart items
    let newCartItems = cart.reduce((total, cartItem) => {
      return total + cartItem.amount;
    }, 0);
    setCartItems(newCartItems);
    let newTotal = cart.reduce((total, cartItem) => {
      return (total += cartItem.price * cartItem.amount);
    }, 0);
    newTotal = parseFloat(newTotal.toFixed(2));
    setTotal(newTotal);
    return () => {
      //cleanup;
    };
  }, [cart]);

  const removeItem = (id) => {
    setCart([...cart].filter((item) => item.id !== id));
  };
  const increaseAmount = (id) => {
    const newCart = cart.map((item) => {
      return item.id === id
        ? { ...item, amount: item.amount + 1 }
        : { ...item };
    });
    setCart(newCart);
  };
  const decreaseAmount = (id, amount) => {
    if (amount === 1) {
      removeItem(id);
    } else {
      const newCart = cart.map((item) => {
        return item.id === id
          ? { ...item, amount: item.amount - 1 }
          : { ...item };
      });
      setCart(newCart);
    }
  };
  const addToCart = (product) => {
    const { id, title, price, image, amount } = product;
    const item = [...cart].find((item) => item.id === id);
    if (item) {
      increaseAmount(id);
      return;
    } else {
      const newItem = { id, title, price, image, amount: 1 };
      const newCart = [...cart, newItem];
      setCart(newCart);
    }
  };
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        cartItems,
        removeItem,
        increaseAmount,
        decreaseAmount,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext, CartProvider };
