'use client';

import React from 'react';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './cart.css';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const router = useRouter();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    calculateSubtotal, 
    calculateTax, 
    calculateShipping, 
    calculateTotal 
  } = useCart();

  // Helper function to format price
  const formatPrice = (price) => {
    // Ensure price is a number before calling toFixed
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add some items before proceeding to checkout.');
      return;
    }
    
    router.push('/checkout');
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
                        {item.images && item.images.length > 0 ? (
                          <img 
                            src={item.images[0].image} 
                            alt={item.name} 
                            className="fitgear-product-thumbnail"
                          />
                        ) : (
                          <div className="fitgear-placeholder-image"></div>
                        )}
                      </div>
                      <div className="fitgear-product-details">
                        <h3>{item.name}</h3>
                        <p className="fitgear-product-id">SKU: FG-{item.id}00{item.id}</p>
                        {item.size && <p className="fitgear-product-size">Size: {item.size}</p>}
                      </div>
                    </div>
                    
                    <div className="fitgear-price-col">${formatPrice(item.price)}</div>
                    
                    <div className="fitgear-quantity-col">
                      <div className="fitgear-quantity-control">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}>-</button>
                        <input type="text" value={item.quantity} readOnly />
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}>+</button>
                      </div>
                    </div>
                    
                    <div className="fitgear-total-col">${formatPrice(item.price * item.quantity)}</div>
                    
                    <div className="fitgear-action-col">
                      <button 
                        className="fitgear-remove-item" 
                        onClick={() => removeFromCart(item.id, item.size)}
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
              <span>${formatPrice(calculateSubtotal())}</span>
            </div>
            
            <div className="fitgear-summary-row">
              <span>Tax (7%)</span>
              <span>${formatPrice(calculateTax())}</span>
            </div>
            
            <div className="fitgear-summary-row">
              <span>Shipping</span>
              <span>${formatPrice(calculateShipping())}</span>
            </div>
            
            <div className="fitgear-summary-row fitgear-total">
              <span>Total</span>
              <span>${formatPrice(calculateTotal())}</span>
            </div>
            
            <button 
              className="fitgear-checkout-btn" 
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
