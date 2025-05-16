'use client';

import { useState, useEffect } from 'react';
import './order.css';
import Link from 'next/link';

export default function OrderPage() {
  const [orders, setOrders] = useState([
    {
      id: '1234215124123',
      date: '24 June 2024',
      total: 380,
      items: [
        {
          id: 1,
          name: 'Premium Boxing Gloves',
          description: 'Professional grade leather gloves\nColor: Red',
          status: 'delivered',
          quantity: 1,
          price: 180,
          image: 'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800160/b2zemgektesep1nqfirh.png'
        },
        {
          id: 2,
          name: 'Pro Performance Stud Shoes',
          description: 'Engineered for explosive acceleration\nSize: US 10',
          status: 'processing',
          quantity: 1,
          price: 180,
          image: 'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800238/vhorpxgcge2ommmcy3pl.png'
        },
        {
          id: 3,
          name: 'Elite Series Dumbbells',
          description: 'Precision-engineered cast iron\nWeight: 20kg',
          status: 'shipped',
          quantity: 1,
          price: 20,
          image: 'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800242/ucobyaucgrxgvyksfm5a.png'
        }
      ]
    },
    {
      id: '1234215124124',
      date: '24 June 2024',
      total: 380,
      items: [
        {
          id: 4,
          name: 'Premium Boxing Gloves',
          description: 'Professional grade leather gloves\nColor: Black',
          status: 'delivered',
          quantity: 1,
          price: 180,
          image: 'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800160/b2zemgektesep1nqfirh.png'
        },
        {
          id: 5,
          name: 'Pro Performance Stud Shoes',
          description: 'Engineered for explosive acceleration\nSize: US 9',
          status: 'processing',
          quantity: 1,
          price: 180,
          image: 'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800238/vhorpxgcge2ommmcy3pl.png'
        },
        {
          id: 6,
          name: 'Elite Series Dumbbells',
          description: 'Precision-engineered cast iron\nWeight: 15kg',
          status: 'shipped',
          quantity: 1,
          price: 20,
          image: 'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800242/ucobyaucgrxgvyksfm5a.png'
        }
      ]
    }
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        date: '24 June 2024',
        location: 'Online',
        isCompleted: true
      },
      {
        title: 'Order Confirmed',
        date: '24 June 2024',
        location: 'FitGear Hub',
        isCompleted: true
      },
      {
        title: 'Processing',
        date: '25 June 2024',
        location: 'Warehouse',
        isCompleted: status !== 'processing'
      },
      {
        title: 'Shipped',
        date: '26 June 2024',
        location: 'Distribution Center',
        isCompleted: status === 'shipped' || status === 'delivered'
      },
      {
        title: 'Delivered',
        date: '27 June 2024',
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

  if (orders.length === 0) {
    return (
      <div className="order-history-container">
        <h1 className="order-history-title">Order History</h1>
        <div className="empty-orders">
          <h3>No Orders Yet</h3>
          <p>Looks like you haven't made any orders yet.</p>
          <Link href="/catalog" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h1 className="order-history-title">Order History</h1>
      
      {orders.map((order) => (
        <div key={order.id} className="order-history-card">
          <div className="order-history-header">
            <div className="order-history-header-item">
              Order Place
              <strong>{order.date}</strong>
            </div>
            <div className="order-history-header-item">
              Order
              <strong>#{order.id}</strong>
            </div>
            <div className="order-history-header-item order-history-header-total">
              Total
              <strong>${order.total.toFixed(2)}</strong>
            </div>
          </div>
          
          {order.items.map((item) => (
            <div key={item.id} className="order-history-item">
              <div className="order-history-image">
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              
              <div className="order-history-details">
                <div className="order-history-name">{item.name}</div>
                {item.description.split('\n').map((line, i) => (
                  <div key={i} className="order-history-description">{line}</div>
                ))}
                <div className={`order-history-status ${item.status}`}>
                  {getStatusText(item.status)}
                </div>
              </div>
              
              <div className="order-history-price-quantity">
                <div className="order-history-quantity">Quantity: {item.quantity}</div>
                <div className="order-history-price">${item.price.toFixed(2)}</div>
                <button 
                  className="order-history-view-details"
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
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-header">
              <h2>Order Details</h2>
              <div className="modal-order-id">Order #{selectedItem.orderId}</div>
            </div>
            <div className="modal-body">
              <div className="modal-main-content">
                <div className="modal-left-section">
                  <div className="product-section">
                    <div className="modal-product-image">
                      <img src={selectedItem.image} alt={selectedItem.name} />
                    </div>
                    <div className="modal-product-info">
                      <div className="product-header">
                        <h3>{selectedItem.name}</h3>
                        <div className={`modal-status ${selectedItem.status}`}>
                          {getStatusText(selectedItem.status)}
                        </div>
                      </div>
                      
                      <div className="product-details">
                        <div className="detail-group">
                          <h4>Product Details</h4>
                          {selectedItem.description.split('\n').map((line, i) => (
                            <p key={i} className="modal-description">{line}</p>
                          ))}
                        </div>

                        <div className="detail-group">
                          <h4>Order Information</h4>
                          <div className="info-grid">
                            <div className="info-item">
                              <span>Order ID</span>
                              <strong>#{selectedItem.orderId}</strong>
                            </div>
                            <div className="info-item">
                              <span>Unit Price</span>
                              <strong>${selectedItem.price.toFixed(2)}</strong>
                            </div>
                            <div className="info-item">
                              <span>Quantity</span>
                              <strong>{selectedItem.quantity}</strong>
                            </div>
                            <div className="info-item">
                              <span>Total</span>
                              <strong>${(selectedItem.price * selectedItem.quantity).toFixed(2)}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="detail-group">
                          <h4>Shipping Details</h4>
                          <div className="shipping-info">
                            <div className="info-item">
                              <span>Delivery Method</span>
                              <strong>Express Delivery</strong>
                            </div>
                            <div className="info-item">
                              <span>Estimated Delivery</span>
                              <strong>27 June 2024</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-right-section">
                  <div className="tracking-section">
                    <h3>Order Tracking</h3>
                    <div className="tracking-timeline">
                      {getStatusSteps(selectedItem.status).map((step, index) => (
                        <div 
                          key={index} 
                          className={`timeline-item ${step.isCompleted ? 'completed' : ''} ${
                            index === getStatusSteps(selectedItem.status).findIndex(s => !s.isCompleted) ? 'active' : ''
                          }`}
                        >
                          <div className="timeline-content">
                            <div className="timeline-title">{step.title}</div>
                            <div className="timeline-date">{step.date}</div>
                            <div className="timeline-location">{step.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn track-order">
                <i className="fas fa-truck"></i>
                Track Order
              </button>
              <button className="modal-btn contact-support">
                <i className="fas fa-headset"></i>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
