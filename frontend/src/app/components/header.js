import React from 'react';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import './header.css';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-container">
        <div className="logo-container">
          <span className="logo">FitGear Hub</span>
        </div>
        <div className="header-icons">
          <FaSearch className="icon" />
          <FaShoppingCart className="icon" />
          <FaUser className="icon" />
        </div>
      </div>
    </header>
  );
}
