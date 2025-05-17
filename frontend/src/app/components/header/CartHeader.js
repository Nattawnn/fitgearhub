'use client';

import React, { forwardRef, useEffect } from 'react';
import { FaShoppingCart, FaTimes, FaTrash } from 'react-icons/fa';
import './CartHeader.css';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';

const CartHeader = forwardRef(({ setCartOpen, setProfileOpen }, ref) => {
  const router = useRouter();
  const { 
    cartItems, 
    cartCount, 
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    removeFromCart, 
    updateQuantity, 
    calculateTotal 
  } = useCart();

  // Sync the external cartOpen state with our context state
  useEffect(() => {
    setCartOpen(isCartOpen);
  }, [isCartOpen, setCartOpen]);

  const handleToggleCart = () => {
    toggleCart();
    if (setProfileOpen && isCartOpen) setProfileOpen(false);
  };

  const handleViewCart = () => {
    closeCart();
    router.push('/cart');
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  // Helper function to format price
  const formatPrice = (price) => {
    // Ensure price is a number before calling toFixed
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  return (
    <div className="cart-container">
      <FaShoppingCart 
        className={`icon icon-cart ${isCartOpen ? 'active' : ''}`} 
        onClick={handleToggleCart} 
      />
      {cartCount > 0 && (
        <span className="cart-count">{cartCount}</span>
      )}
      {isCartOpen && (
        <div className="cart-dropdown" ref={ref}>
          <div className="cart-header">
            <h3>Your Cart</h3>
            <span className="cart-close" onClick={handleToggleCart}><FaTimes /></span>
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
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0].image} alt={item.name} className="cart-item-img" />
                      ) : (
                        <div className="placeholder-image"></div>
                      )}
                    </div>
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <div className="cart-item-price">${formatPrice(item.price)}</div>
                      <div className="cart-item-actions">
                        <div className="quantity-control">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}>-</button>
                          <input type="text" value={item.quantity} readOnly />
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}>+</button>
                        </div>
                        <button 
                          className="remove-item" 
                          onClick={() => removeFromCart(item.id, item.size)}
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
                  <span>${formatPrice(calculateTotal())}</span>
                </div>
                <button className="view-cart-btn" onClick={handleViewCart}>View Cart</button>
                <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
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