'use client';

import React, { useEffect, useState, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import './header.css';
import SearchHeader from './header/SearchHeader';
import CartHeader from './header/CartHeader';
import ProfileHeader from './header/ProfileHeader';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  const [isHovered, setIsHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const cartRef = useRef(null);
  const profileRef = useRef(null);

  const categories = [
    {
      name: 'Sports',
      subcategories: [
        { name: 'Basketball', items: ['Balls', 'Hoops', 'Accessories'] },
        { name: 'Soccer', items: ['Balls', 'Goals', 'Cleats'] },
        { name: 'Tennis', items: ['Rackets', 'Balls', 'Apparel'] }
      ]
    },
    {
      name: 'Fitness',
      subcategories: [
        { name: 'Weights', items: ['Dumbbells', 'Kettlebells', 'Barbells'] },
        { name: 'Cardio', items: ['Treadmills', 'Exercise Bikes', 'Ellipticals'] },
        { name: 'Yoga', items: ['Mats', 'Blocks', 'Clothing'] }
      ]
    }
  ];

  const handleCategoryClick = (category, e) => {
    e.stopPropagation();
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  const handleItemClick = (category, subcategory, item, e) => {
    e.preventDefault();
    // Navigate to catalog page with filters
    router.push(`/catalog?category=${category}&subcategory=${subcategory}&item=${item}`);
    // Close the menu after navigation
    setActiveCategory(null);
  };

  // Determine if header should be white
  const shouldHeaderBeWhite = isHovered || activeCategory || cartOpen || profileOpen;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveCategory(null);
      }
      
      // Check if click is outside cart dropdown
      const cartIcon = document.querySelector('.icon-cart');
      const isCartIconClicked = cartIcon && cartIcon.contains(event.target);
      const isClickInsideCart = cartRef.current && cartRef.current.contains(event.target);
      
      if (cartOpen && !isCartIconClicked && !isClickInsideCart) {
        setCartOpen(false);
      }
      
      // Check if click is outside profile dropdown
      const profileIcon = document.querySelector('.icon-profile');
      const isProfileIconClicked = profileIcon && profileIcon.contains(event.target);
      const isClickInsideProfile = profileRef.current && profileRef.current.contains(event.target);
      
      if (profileOpen && !isProfileIconClicked && !isClickInsideProfile) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartOpen, profileOpen]);

  return (
    <div className="header-wrapper" ref={menuRef}>
      <header 
        className={`site-header ${!isHomePage ? 'header-with-bg' : ''} ${shouldHeaderBeWhite ? 'header-hovered' : ''} ${searchActive ? 'search-active' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="container header-container">
          <div className="logo-container">
            <span className="logo">FitGear Hub</span>
          </div>
          
          <nav className="main-nav">
            {categories.map((category) => (
              <div key={category.name} className="nav-item">
                <button 
                  className={`nav-link ${activeCategory === category.name ? 'active' : ''}`}
                  onClick={(e) => handleCategoryClick(category.name, e)}
                >
                  {category.name} <FaChevronDown className={`dropdown-icon ${activeCategory === category.name ? 'rotate' : ''}`} />
                </button>
              </div>
            ))}
          </nav>
          
          <div className="header-icons">
            <SearchHeader searchActive={searchActive} setSearchActive={setSearchActive} />
            <CartHeader 
              ref={cartRef}
              cartOpen={cartOpen} 
              setCartOpen={setCartOpen} 
              setProfileOpen={setProfileOpen} 
            />
            <ProfileHeader 
              ref={profileRef}
              profileOpen={profileOpen} 
              setProfileOpen={setProfileOpen} 
              setCartOpen={setCartOpen} 
            />
          </div>
        </div>
      </header>

      {activeCategory && (
        <div className="mega-menu">
          <div className="container">
            {categories.map((category) => (
              activeCategory === category.name && (
                <div key={category.name} className="category-dropdown">
                  <div className="subcategories">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.name} className="subcategory">
                        <h4>{subcategory.name}</h4>
                        <ul>
                          {subcategory.items.map((item) => (
                            <li key={item}>
                              <a 
                                href="#" 
                                onClick={(e) => handleItemClick(category.name, subcategory.name, item, e)}
                              >
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
