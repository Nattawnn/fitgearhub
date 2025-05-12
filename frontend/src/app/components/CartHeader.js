'use client';

import React, { useState, forwardRef } from 'react';
import { FaShoppingCart, FaTimes, FaTrash } from 'react-icons/fa';
import './CartHeader.css';

const CartHeader = forwardRef(({ cartOpen, setCartOpen, setProfileOpen }, ref) => {
  // Sample cart items - in a real app, this would come from context/state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Premium Running Shoes',
      price: 129.99,
      quantity: 1,
      image: '/images/product-1.jpg'
    },
    {
      id: 2,
      name: 'Fitness Tracker Watch',
      price: 89.99,
      quantity: 2,
      image: '/images/product-2.jpg'
    }
  ]);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
    if (setProfileOpen) setProfileOpen(false);
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <FaShoppingCart className={`icon icon-cart ${cartOpen ? 'active' : ''}`} onClick={toggleCart} />
      {cartItems.length > 0 && (
        <span className="cart-count">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
      )}
      {cartOpen && (
        <div className="cart-dropdown" ref={ref}>
          <div className="cart-header">
            <h3>Your Cart</h3>
            <span className="cart-close" onClick={toggleCart}><FaTimes /></span>
          </div>
          
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-image">
                      <div className="placeholder-image"></div>
                    </div>
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <div className="cart-item-price">${item.price.toFixed(2)}</div>
                      <div className="cart-item-actions">
                        <div className="quantity-control">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <input type="text" value={item.quantity} readOnly />
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <button 
                          className="remove-item" 
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="cart-buttons">
                  <button className="view-cart-btn">View Cart</button>
                  <button className="checkout-btn">Checkout</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
});

CartHeader.displayName = 'CartHeader';

export default CartHeader; 