'use client';

import React, { useState } from 'react';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import './cart.css';

export default function Cart() {
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
    },
    {
      id: 3,
      name: 'Performance Compression Shirt',
      price: 49.99,
      quantity: 1,
      image: '/images/product-3.jpg'
    }
  ]);

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
    <div className="fitgear-cart-page">
      <div className="fitgear-cart-header">
        <Link href="/catalog" className="fitgear-back-to-shopping">
          <FaArrowLeft /> Continue Shopping
        </Link>
        <h1>Your Cart</h1>
        <p className="fitgear-item-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="fitgear-cart-content">
        <div className="fitgear-cart-items-container">
          {cartItems.length === 0 ? (
            <div className="fitgear-empty-cart-message">
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <Link href="/catalog" className="fitgear-shop-now-btn">Shop Now</Link>
            </div>
          ) : (
            <>
              <div className="fitgear-cart-items-header">
                <div className="fitgear-product-col">Product</div>
                <div className="fitgear-price-col">Price</div>
                <div className="fitgear-quantity-col">Quantity</div>
                <div className="fitgear-total-col">Total</div>
                <div className="fitgear-action-col"></div>
              </div>
              
              <div className="fitgear-cart-items-list">
                {cartItems.map(item => (
                  <div className="fitgear-cart-item-row" key={item.id}>
                    <div className="fitgear-product-col">
                      <div className="fitgear-product-image">
                        <div className="fitgear-placeholder-image"></div>
                      </div>
                      <div className="fitgear-product-details">
                        <h3>{item.name}</h3>
                        <p className="fitgear-product-id">SKU: FG-{item.id}00{item.id}</p>
                      </div>
                    </div>
                    
                    <div className="fitgear-price-col">${item.price.toFixed(2)}</div>
                    
                    <div className="fitgear-quantity-col">
                      <div className="fitgear-quantity-control">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <input type="text" value={item.quantity} readOnly />
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    
                    <div className="fitgear-total-col">${(item.price * item.quantity).toFixed(2)}</div>
                    
                    <div className="fitgear-action-col">
                      <button 
                        className="fitgear-remove-item" 
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="fitgear-cart-summary">
            <h2>Order Summary</h2>
            
            <div className="fitgear-summary-row">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            
            <div className="fitgear-summary-row">
              <span>Tax (7%)</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            
            <div className="fitgear-summary-row">
              <span>Shipping</span>
              <span>${calculateShipping().toFixed(2)}</span>
            </div>
            
            <div className="fitgear-summary-row fitgear-total">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            
            <button className="fitgear-checkout-btn">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}
