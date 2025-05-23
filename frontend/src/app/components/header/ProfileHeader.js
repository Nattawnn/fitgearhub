'use client';

import React, { forwardRef } from 'react';
import { FaUser, FaUserCircle, FaHistory, FaCog, FaSignOutAlt, FaHeart } from 'react-icons/fa';
import './ProfileHeader.css';

const ProfileHeader = forwardRef(({ profileOpen, setProfileOpen, setCartOpen }, ref) => {
  // Sample user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null, // In a real app, this would be an image URL
    isLoggedIn: true
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    if (setCartOpen) setCartOpen(false);
  };

  const handleSignOut = () => {
    console.log('User signed out');
    // In a real app, this would handle the sign out process
  };

  return (
    <div className="profile-container">
      <FaUser className={`icon icon-profile ${profileOpen ? 'active' : ''}`} onClick={toggleProfile} />
      {profileOpen && (
        <div className="profile-dropdown" ref={ref}>
          {user.isLoggedIn ? (
            <>
              <div className="profile-header">
                <div className="profile-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <FaUserCircle className="default-avatar" />
                  )}
                </div>
                <div className="profile-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="profile-menu">
                <a href="/profile" className="profile-menu-item">
                  <FaUserCircle />
                  <span>My Profile</span>
                </a>
                <a href="/orders" className="profile-menu-item">
                  <FaHistory />
                  <span>Order History</span>
                </a>
                <a href="/wishlist" className="profile-menu-item">
                  <FaHeart />
                  <span>Wishlist</span>
                </a>
                <a href="/settings" className="profile-menu-item">
                  <FaCog />
                  <span>Settings</span>
                </a>
                <button className="sign-out-button" onClick={handleSignOut}>
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="auth-options">
              <a href="/login" className="auth-button login-button">Log In</a>
              <a href="/register" className="auth-button register-button">Register</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader; 