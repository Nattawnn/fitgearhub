'use client';

import { useState, useEffect } from 'react';
import './order.css';
import Link from 'next/link';
import { FaShoppingBag } from 'react-icons/fa';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to format price
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  useEffect(() => {
    // Fetch orders from localStorage
    const fetchOrders = () => {
      setLoading(true);
      try {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusText = (status) => {
    const statusMap = {
      delivered: 'Delivered',
      processing: 'Processing',
      shipped: 'Shipped'
    };
    return statusMap[status] || status;
  };

  const getStatusSteps = (status) => {
    const steps = [
      {
        title: 'Order Placed',
        date: new Date().toLocaleDateString(),
        location: 'Online',
        isCompleted: true
      },
      {
        title: 'Order Confirmed',
        date: new Date().toLocaleDateString(),
        location: 'FitGear Hub',
        isCompleted: true
      },
      {
        title: 'Processing',
        date: new Date(Date.now() + 86400000).toLocaleDateString(), // +1 day
        location: 'Warehouse',
        isCompleted: status !== 'processing'
      },
      {
        title: 'Shipped',
        date: new Date(Date.now() + 172800000).toLocaleDateString(), // +2 days
        location: 'Distribution Center',
        isCompleted: status === 'shipped' || status === 'delivered'
      },
      {
        title: 'Delivered',
        date: new Date(Date.now() + 259200000).toLocaleDateString(), // +3 days
        location: 'Customer Address',
        isCompleted: status === 'delivered'
      }
    ];
    return steps;
  };

  const handleViewDetails = (orderId, item) => {
    setSelectedItem({ ...item, orderId });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="fitgear-order-history-container">
        <h1 className="fitgear-order-history-title">Order History</h1>
        <div className="fitgear-loading-orders">Loading your orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="fitgear-order-history-container">
        <h1 className="fitgear-order-history-title">Order History</h1>
        <div className="fitgear-empty-orders">
          <FaShoppingBag className="fitgear-empty-icon" />
          <h3>No Orders Yet</h3>
          <p>Looks like you haven't made any orders yet.</p>
          <Link href="/catalog" className="fitgear-shop-now-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fitgear-order-history-container">
      <h1 className="fitgear-order-history-title">Order History</h1>
      
      {orders.map((order) => (
        <div key={order.id} className="fitgear-order-history-card">
          <div className="fitgear-order-history-header">
            <div className="fitgear-order-history-header-item">
              Order Placed
              <strong>{new Date(order.date).toLocaleDateString()}</strong>
            </div>
            <div className="fitgear-order-history-header-item">
              Order
              <strong>#{order.id}</strong>
            </div>
            <div className="fitgear-order-history-header-item fitgear-order-history-header-total">
              Total
              <strong>${formatPrice(order.total)}</strong>
            </div>
          </div>
          
          {order.items.map((item) => (
            <div key={item.id} className="fitgear-order-history-item">
              <div className="fitgear-order-history-image">
                {item.images && item.images.length > 0 ? (
                  <img 
                    src={item.images[0].image} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                ) : (
                  <div className="fitgear-placeholder-image"></div>
                )}
              </div>
              
              <div className="fitgear-order-history-details">
                <div className="fitgear-order-history-name">{item.name}</div>
                <div className="fitgear-order-history-description">
                  {item.size && <span>Size: {item.size}</span>}
                </div>
                <div className={`fitgear-order-history-status ${item.status || 'processing'}`}>
                  {getStatusText(item.status || 'processing')}
                </div>
              </div>
              
              <div className="fitgear-order-history-price-quantity">
                <div className="fitgear-order-history-quantity">Quantity: {item.quantity}</div>
                <div className="fitgear-order-history-price">${formatPrice(item.price)}</div>
                <button 
                  className="fitgear-order-history-view-details"
                  onClick={() => handleViewDetails(order.id, item)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {isModalOpen && selectedItem && (
        <div className="fitgear-modal-overlay" onClick={closeModal}>
          <div className="fitgear-modal-content" onClick={e => e.stopPropagation()}>
            <button className="fitgear-modal-close" onClick={closeModal}>×</button>
            <div className="fitgear-modal-header">
              <h2>Order Details</h2>
              <div className="fitgear-modal-order-id">Order #{selectedItem.orderId}</div>
            </div>
            <div className="fitgear-modal-body">
              <div className="fitgear-modal-main-content">
                <div className="fitgear-modal-left-section">
                  <div className="fitgear-product-section">
                    <div className="fitgear-modal-product-image">
                      {selectedItem.images && selectedItem.images.length > 0 ? (
                        <img src={selectedItem.images[0].image} alt={selectedItem.name} />
                      ) : (
                        <div className="fitgear-placeholder-image"></div>
                      )}
                    </div>
                    <div className="fitgear-modal-product-info">
                      <div className="fitgear-product-header">
                        <h3>{selectedItem.name}</h3>
                        <div className={`fitgear-modal-status ${selectedItem.status || 'processing'}`}>
                          {getStatusText(selectedItem.status || 'processing')}
                        </div>
                      </div>
                      
                      <div className="fitgear-product-details">
                        <div className="fitgear-detail-group">
                          <h4>Product Details</h4>
                          {selectedItem.size && (
                            <p className="fitgear-modal-description">Size: {selectedItem.size}</p>
                          )}
                        </div>

                        <div className="fitgear-detail-group">
                          <h4>Order Information</h4>
                          <div className="fitgear-info-grid">
                            <div className="fitgear-info-item">
                              <span>Order ID</span>
                              <strong>#{selectedItem.orderId}</strong>
                            </div>
                            <div className="fitgear-info-item">
                              <span>Unit Price</span>
                              <strong>${formatPrice(selectedItem.price)}</strong>
                            </div>
                            <div className="fitgear-info-item">
                              <span>Quantity</span>
                              <strong>{selectedItem.quantity}</strong>
                            </div>
                            <div className="fitgear-info-item">
                              <span>Total</span>
                              <strong>${formatPrice(selectedItem.price * selectedItem.quantity)}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="fitgear-detail-group">
                          <h4>Shipping Details</h4>
                          <div className="fitgear-shipping-info">
                            <div className="fitgear-info-item">
                              <span>Delivery Method</span>
                              <strong>Express Delivery</strong>
                            </div>
                            <div className="fitgear-info-item">
                              <span>Estimated Delivery</span>
                              <strong>{new Date(Date.now() + 259200000).toLocaleDateString()}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="fitgear-modal-right-section">
                  <div className="fitgear-tracking-section">
                    <h3>Order Tracking</h3>
                    <div className="fitgear-tracking-timeline">
                      {getStatusSteps(selectedItem.status || 'processing').map((step, index) => (
                        <div 
                          key={index} 
                          className={`fitgear-timeline-item ${step.isCompleted ? 'completed' : ''} ${
                            index === getStatusSteps(selectedItem.status || 'processing').findIndex(s => !s.isCompleted) ? 'active' : ''
                          }`}
                        >
                          <div className="fitgear-timeline-content">
                            <div className="fitgear-timeline-title">{step.title}</div>
                            <div className="fitgear-timeline-date">{step.date}</div>
                            <div className="fitgear-timeline-location">{step.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fitgear-modal-footer">
              <button className="fitgear-modal-btn track-order">
                Track Order
              </button>
              <button className="fitgear-modal-btn contact-support">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
