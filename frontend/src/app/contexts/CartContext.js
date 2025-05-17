'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage when component mounts (client-side only)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        updateCartCount(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      updateCartCount(cartItems);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const updateCartCount = (items) => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const addToCart = (product, quantity = 1, size = null) => {
    if (!product) return false;
    
    // Ensure price is stored as a number
    const productWithValidPrice = {
      ...product,
      price: parseFloat(product.price) || 0
    };
    
    setCartItems(prevItems => {
      // Check if the product is already in the cart
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === product.id && (!size || item.size === size)
      );

      if (existingItemIndex !== -1) {
        // If the product is already in the cart, update the quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // If the product is not in the cart, add it
        return [...prevItems, {
          ...productWithValidPrice,
          quantity,
          size,
          addedAt: new Date().toISOString()
        }];
      }
    });
    
    // Automatically open the cart when an item is added
    openCart();
    
    return true; // Success response
  };

  const removeFromCart = (id, size = null) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === id && (!size || item.size === size)))
    );
  };

  const updateQuantity = (id, newQuantity, size = null) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        (item.id === id && (!size || item.size === size)) 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.07; // 7% tax
  };

  const calculateShipping = () => {
    return cartItems.length > 0 ? 9.99 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      calculateSubtotal,
      calculateTax,
      calculateShipping,
      calculateTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 