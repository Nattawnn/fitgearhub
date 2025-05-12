'use client';

import React, { useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchHeader.css';

export default function SearchHeader({ searchActive, setSearchActive }) {
  const searchInputRef = useRef(null);

  const toggleSearch = () => {
    setSearchActive(!searchActive);
    if (!searchActive) {
      // Focus the search input after it becomes visible
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 300);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
    console.log('Search submitted:', searchInputRef.current.value);
    // You can add actual search functionality here
  };

  return (
    <div className="search-container">
      {!searchActive && (
        <FaSearch className="icon search-icon" onClick={toggleSearch} />
      )}
      <div className={`search-input-container ${searchActive ? 'active' : ''}`}>
        <form onSubmit={handleSearchSubmit}>
          <input 
            ref={searchInputRef}
            type="text" 
            className="search-input" 
            placeholder="Search products..." 
          />
        </form>
        <FaTimes className="search-close" onClick={toggleSearch} />
      </div>
    </div>
  );
} 