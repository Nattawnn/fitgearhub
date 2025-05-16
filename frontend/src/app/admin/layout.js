'use client';

import { useState } from 'react';
import { FaChartBar, FaBox, FaUsers, FaShoppingCart, FaCog } from 'react-icons/fa';
import './admin.css';

export default function AdminLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const menuItems = [
    { icon: <FaChartBar />, label: 'Dashboard', path: '/admin' },
    { icon: <FaBox />, label: 'Products', path: '/admin/products' },
    { icon: <FaUsers />, label: 'Customers', path: '/admin/customers' },
    { icon: <FaShoppingCart />, label: 'Orders', path: '/admin/orders' },
    { icon: <FaCog />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>FitGearHub</h2>
          <button 
            className="collapse-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <a key={index} href={item.path} className="nav-item">
              <span className="nav-icon">{item.icon}</span>
              {!isSidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </a>
          ))}
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
} 