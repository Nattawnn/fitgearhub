'use client';
import { useState } from 'react';
import './checkout.css';
import { FaCreditCard, FaQrcode, FaTruck, FaLock } from 'react-icons/fa';
import Address from '../components/checkout/address';

export default function Checkout() {
    const [selectedPayment, setSelectedPayment] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    const sampleProducts = [
        { id: 1, name: 'Product Name', price: 100, quantity: 2, image: '/placeholder.jpg' },
        { id: 2, name: 'Product Name', price: 100, quantity: 2, image: '/placeholder.jpg' },
        { id: 3, name: 'Product Name', price: 100, quantity: 2, image: '/placeholder.jpg' },
        { id: 4, name: 'Product Name', price: 100, quantity: 2, image: '/placeholder.jpg' }
    ];

    const totalPrice = sampleProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    const handlePaymentSelect = (method) => {
        setSelectedPayment(method);
    };

    const handleCardInput = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (address) => {
        console.log('Address updated:', address);
        // Handle address update logic here
    };

    const handlePlaceOrder = () => {
        setShowConfirmation(true);
    };

    const handleConfirmOrder = () => {
        // Add your order processing logic here
        console.log('Order confirmed!');
        setShowConfirmation(false);
    };

    const handleCancelOrder = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-header">
                    <h1>Checkout</h1>
                    <div className="secure-checkout">
                        <FaLock />
                        <span>Secure Checkout</span>
                    </div>
                </div>

                {/* Address Section */}
                <div className="section address-section">
                    <div className="section-header">
                        <h2>Address</h2>
                        <span className="step-number">1</span>
                    </div>
                    <Address onAddressChange={handleAddressChange} />
                </div>

                {/* Product List Section */}
                <div className="section product-list-section">
                    <div className="section-header">
                        <h2>Product list</h2>
                        <span className="step-number">2</span>
                    </div>
                    <div className="product-list-header">
                        <span>Product</span>
                        <span>Price per item</span>
                        <span>Quantity</span>
                        <span>Total Price</span>
                    </div>
                    <div className="product-list">
                        {sampleProducts.map((product) => (
                            <div key={product.id} className="product-item">
                                <div className="product-info">
                                    <div className="product-image-placeholder"></div>
                                    <span className="product-name">{product.name}</span>
                                </div>
                                <span className="product-price">${product.price.toFixed(2)}</span>
                                <div className="quantity-controls">
                                    <button className="quantity-btn">-</button>
                                    <span className="product-quantity">{product.quantity}</span>
                                    <button className="quantity-btn">+</button>
                                </div>
                                <span className="product-total">${(product.price * product.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="product-list-total">
                        <span>Total Price</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="section payment-section">
                    <div className="section-header">
                        <h2>Select Payment</h2>
                        <span className="step-number">3</span>
                    </div>
                    <div className="payment-options">
                        <button 
                            className={`payment-option ${selectedPayment === 'qr' ? 'selected' : ''}`}
                            onClick={() => handlePaymentSelect('qr')}
                        >
                            <FaQrcode className="payment-icon" />
                            <span>QR Promptpay</span>
                        </button>
                        <button 
                            className={`payment-option ${selectedPayment === 'card' ? 'selected' : ''}`}
                            onClick={() => handlePaymentSelect('card')}
                        >
                            <FaCreditCard className="payment-icon" />
                            <span>Debit Card</span>
                        </button>
                        <button 
                            className={`payment-option ${selectedPayment === 'cod1' ? 'selected' : ''}`}
                            onClick={() => handlePaymentSelect('cod1')}
                        >
                            <FaTruck className="payment-icon" />
                            <span>ปลายทาง</span>
                        </button>
                        <button 
                            className={`payment-option ${selectedPayment === 'cod2' ? 'selected' : ''}`}
                            onClick={() => handlePaymentSelect('cod2')}
                        >
                            <FaTruck className="payment-icon" />
                            <span>ปลายทาง</span>
                        </button>
                    </div>

                    {/* Card Payment Form */}
                    {selectedPayment === 'card' && (
                        <div className="card-payment-form">
                            <div className="card-input-group">
                                <div className="card-input-row">
                                    <div className="card-input-field">
                                        <label>Card Number</label>
                                        <input
                                            type="text"
                                            name="number"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardDetails.number}
                                            onChange={handleCardInput}
                                            maxLength="19"
                                        />
                                    </div>
                                </div>
                                <div className="card-input-row">
                                    <div className="card-input-field">
                                        <label>Cardholder Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            value={cardDetails.name}
                                            onChange={handleCardInput}
                                        />
                                    </div>
                                </div>
                                <div className="card-input-row two-fields">
                                    <div className="card-input-field">
                                        <label>Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            placeholder="MM/YY"
                                            value={cardDetails.expiry}
                                            onChange={handleCardInput}
                                            maxLength="5"
                                        />
                                    </div>
                                    <div className="card-input-field">
                                        <label>CVV</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            placeholder="123"
                                            value={cardDetails.cvv}
                                            onChange={handleCardInput}
                                            maxLength="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* QR Code Display */}
                    {selectedPayment === 'qr' && (
                        <div className="qr-payment-section">
                            <div className="qr-code-container">
                                <div className="qr-placeholder">
                                    QR Code will be displayed here
                                </div>
                                <p>Scan with your banking app to pay</p>
                            </div>
                        </div>
                    )}

                    <div className="checkout-summary">
                        <div className="final-total">
                            <span>Total Price</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <button className="place-order-btn" onClick={handlePlaceOrder}>
                            <span>Place Your Order</span>
                            <FaLock className="lock-icon" />
                        </button>
                    </div>
                </div>

                {/* Confirmation Popup */}
                {showConfirmation && (
                    <div className="confirmation-popup-overlay">
                        <div className="confirmation-popup">
                            <h3>Confirm Your Order</h3>
                            <p>Are you sure you want to place this order? Total amount: ${totalPrice.toFixed(2)}</p>
                            <div className="confirmation-buttons">
                                <button className="confirm-btn" onClick={handleConfirmOrder}>
                                    Confirm Order
                                </button>
                                <button className="cancel-btn" onClick={handleCancelOrder}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
