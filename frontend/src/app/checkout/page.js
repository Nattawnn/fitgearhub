'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './checkout.css';
import { FaCreditCard, FaQrcode, FaTruck, FaLock } from 'react-icons/fa';
import Address from '../components/checkout/address';
import { useCart } from '../contexts/CartContext';

export default function Checkout() {
    const router = useRouter();
    const { 
        cartItems, 
        calculateSubtotal, 
        calculateTax, 
        calculateShipping, 
        calculateTotal,
        clearCart
    } = useCart();
    
    const [selectedPayment, setSelectedPayment] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });
    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        addressDetail: '',
        district: '',
        province: '',
        postalCode: '',
        country: 'Thailand'
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);

    // Redirect to cart if cart is empty
    useEffect(() => {
        if (cartItems.length === 0 && !orderPlaced) {
            router.push('/cart');
        }
    }, [cartItems, router, orderPlaced]);

    // Helper function to format price
    const formatPrice = (price) => {
        const numPrice = parseFloat(price);
        return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
    };

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

    const handleAddressChange = (newAddress) => {
        console.log('Address changed:', newAddress);
        setAddress(newAddress);
    };

    const validateCheckout = () => {
        // Validate address
        const requiredFields = ['fullName', 'phoneNumber', 'addressDetail', 'district', 'province', 'postalCode'];
        for (const field of requiredFields) {
            if (!address[field]) {
                alert(`Please enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }

        // Validate payment method
        if (!selectedPayment) {
            alert('Please select a payment method');
            return false;
        }

        // Validate card details if credit card is selected
        if (selectedPayment === 'card') {
            if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
                alert('Please fill in all card details');
                return false;
            }
        }

        return true;
    };

    const handlePlaceOrder = () => {
        if (validateCheckout()) {
            setShowConfirmation(true);
        }
    };

    const handleConfirmOrder = async () => {
        setIsProcessing(true);
        try {
            // API Base URL
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
                (typeof window !== 'undefined' && 
                (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                ? `http://${window.location.hostname}:8000/api`
                : 'https://fitgearhub-backend.onrender.com/api');

            // Create order in backend
            // Note: In a real app, this would include authentication
            const order = {
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    size: item.size || null
                })),
                shipping_address: {
                    full_name: address.fullName,
                    phone_number: address.phoneNumber,
                    street_address: address.addressDetail,
                    city: address.district,
                    state: address.province || '',
                    postal_code: address.postalCode,
                    country: address.country
                },
                payment_method: selectedPayment,
                subtotal: calculateSubtotal(),
                tax: calculateTax(),
                shipping: calculateShipping(),
                total: calculateTotal()
            };

            // In a real implementation, you would send this to your backend
            console.log('Submitting order:', order);
            
            // Simulate a successful order for demonstration
            // In a real app, you would call your API here
            setTimeout(() => {
                // Generate a random order ID
                const generatedOrderId = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
                setOrderId(generatedOrderId);
                
                // Save order to localStorage for order history
                try {
                    // Get existing orders
                    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                    
                    // Create new order record
                    const newOrder = {
                        id: generatedOrderId,
                        date: new Date().toISOString(),
                        total: calculateTotal(),
                        items: cartItems.map(item => ({
                            ...item,
                            status: 'processing' // Start with processing status
                        }))
                    };
                    
                    // Add to existing orders
                    existingOrders.unshift(newOrder); // Add to beginning of array
                    
                    // Save back to localStorage
                    localStorage.setItem('orders', JSON.stringify(existingOrders));
                } catch (error) {
                    console.error('Error saving order to localStorage:', error);
                }
                
                setOrderPlaced(true);
                setShowConfirmation(false);
                clearCart(); // Clear the cart after successful order
            }, 2000);
            
            // Uncomment this section to connect to the actual backend
            /*
            const response = await fetch(`${API_BASE_URL}/checkout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const data = await response.json();
            setOrderId(data.order_number);
            
            // Save order to localStorage for order history
            try {
                // Get existing orders
                const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                
                // Create new order record
                const newOrder = {
                    id: data.order_number,
                    date: new Date().toISOString(),
                    total: calculateTotal(),
                    items: cartItems.map(item => ({
                        ...item,
                        status: 'processing' // Start with processing status
                    }))
                };
                
                // Add to existing orders
                existingOrders.unshift(newOrder); // Add to beginning of array
                
                // Save back to localStorage
                localStorage.setItem('orders', JSON.stringify(existingOrders));
            } catch (error) {
                console.error('Error saving order to localStorage:', error);
            }
            
            setOrderPlaced(true);
            setShowConfirmation(false);
            clearCart(); // Clear the cart after successful order
            */
            
        } catch (error) {
            console.error('Error placing order:', error);
            alert('There was an error processing your order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancelOrder = () => {
        setShowConfirmation(false);
    };

    // If order is placed, show success message
    if (orderPlaced) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="order-success">
                        <div className="success-icon">✓</div>
                        <h2>Order Placed Successfully!</h2>
                        <p>Your order number is: <strong>{orderId}</strong></p>
                        <p>We've sent the order confirmation to your email.</p>
                        <div className="success-buttons">
                            <button 
                                className="continue-shopping-btn"
                                onClick={() => router.push('/catalog')}
                            >
                                Continue Shopping
                            </button>
                            <button 
                                className="view-orders-btn"
                                onClick={() => router.push('/orders')}
                            >
                                View Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                        {cartItems.map((item) => (
                            <div key={item.id} className="product-item">
                                <div className="product-info">
                                    {item.images && item.images.length > 0 ? (
                                        <img 
                                            src={item.images[0].image} 
                                            alt={item.name} 
                                            className="product-image"
                                        />
                                    ) : (
                                        <div className="product-image-placeholder"></div>
                                    )}
                                    <span className="product-name">
                                        {item.name}
                                        {item.size && <span className="product-size">Size: {item.size}</span>}
                                    </span>
                                </div>
                                <span className="product-price">${formatPrice(item.price)}</span>
                                <div className="quantity-controls">
                                    <span className="product-quantity">{item.quantity}</span>
                                </div>
                                <span className="product-total">${formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="product-list-total">
                        <span>Total Price</span>
                        <span>${formatPrice(calculateTotal())}</span>
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
                            className={`payment-option ${selectedPayment === 'cod' ? 'selected' : ''}`}
                            onClick={() => handlePaymentSelect('cod')}
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
                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${formatPrice(calculateSubtotal())}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (7%)</span>
                                <span>${formatPrice(calculateTax())}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>${formatPrice(calculateShipping())}</span>
                            </div>
                        </div>
                        <div className="final-total">
                            <span>Total Price</span>
                            <span>${formatPrice(calculateTotal())}</span>
                        </div>
                        <button 
                            className="place-order-btn" 
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                        >
                            <span>{isProcessing ? 'Processing...' : 'Place Your Order'}</span>
                            <FaLock className="lock-icon" />
                        </button>
                    </div>
                </div>

                {/* Confirmation Popup */}
                {showConfirmation && (
                    <div className="confirmation-popup-overlay">
                        <div className="confirmation-popup">
                            <h3>Confirm Your Order</h3>
                            <p>Are you sure you want to place this order? Total amount: ${formatPrice(calculateTotal())}</p>
                            <div className="confirmation-buttons">
                                <button 
                                    className="confirm-btn" 
                                    onClick={handleConfirmOrder}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Processing...' : 'Confirm Order'}
                                </button>
                                <button 
                                    className="cancel-btn" 
                                    onClick={handleCancelOrder}
                                    disabled={isProcessing}
                                >
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
