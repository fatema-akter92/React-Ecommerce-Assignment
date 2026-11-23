import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartTotalCount } from '../features/cart/cartSlice';
import { selectWishlistItems } from '../features/wishlist/wishlistSlice';
import { selectUserProfile } from '../features/user/userSlice';
import { ShoppingBag, Heart, Store, Menu, X, User, MapPin, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = useSelector(selectCartTotalCount);
  const wishlistItems = useSelector(selectWishlistItems);
  const userProfile = useSelector(selectUserProfile);
  const wishlistCount = wishlistItems.length;

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Top Utility Announcement Bar with direct link to Profile */}
      <div className="top-announcement-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <Sparkles size={14} className="text-amber-300" />
            <span>Free Express Shipping on Orders Over $50.00!</span>
          </div>
          <div className="top-bar-right">
            <Link to="/profile" className="top-profile-link">
              <MapPin size={13} />
              <span>Deliver to: <strong>{userProfile.fullName}</strong> (Manage Addresses) &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      <header className="navbar-header">
        <div className="navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <div className="brand-icon-wrapper">
              <Store className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="brand-title">
              Apex<span className="brand-accent">Store</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Cart
            </NavLink>
            <NavLink
              to="/wishlist"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Wishlist
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => `nav-link nav-link-profile ${isActive ? 'active' : ''}`}
            >
              <User size={16} />
              <span>My Profile</span>
            </NavLink>
          </nav>

          {/* Action icons (Wishlist, Cart, Profile Pill) */}
          <div className="navbar-actions">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="action-icon-btn"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart size={19} className="icon" />
              {wishlistCount > 0 && (
                <span className="badge wishlist-badge">{wishlistCount}</span>
              )}
            </Link>

            {/* Cart Link with Live Redux Item Count */}
            <Link
              to="/cart"
              className="action-icon-btn cart-btn-badge"
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <ShoppingBag size={19} className="icon" />
              <span className="cart-label-text">Cart</span>
              {cartItemCount > 0 && (
                <span className="badge cart-badge">{cartItemCount}</span>
              )}
            </Link>

            {/* User Profile Pill Button (Bold & Clear) */}
            <Link
              to="/profile"
              className="profile-pill-button"
              title="View & Edit My Profile, Addresses, Orders"
            >
              <img
                src={userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={userProfile.fullName}
                className="navbar-avatar-mini"
              />
              <span className="profile-pill-text">
                <span className="profile-pill-label">Profile</span>
                <strong className="profile-pill-name">{userProfile.fullName.split(' ')[0]}</strong>
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            {/* User Profile Card inside Mobile Drawer */}
            <Link
              to="/profile"
              onClick={closeMenu}
              className="mobile-profile-hero-card"
            >
              <img
                src={userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={userProfile.fullName}
                className="mobile-profile-avatar"
              />
              <div className="mobile-profile-info">
                <span className="mobile-user-name">{userProfile.fullName}</span>
                <span className="mobile-user-sub">Manage Profile, Addresses & Orders &rarr;</span>
              </div>
            </Link>

            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/cart"
              onClick={closeMenu}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            >
              <span>Shopping Cart</span>
              {cartItemCount > 0 && (
                <span className="drawer-badge">{cartItemCount}</span>
              )}
            </NavLink>
            <NavLink
              to="/wishlist"
              onClick={closeMenu}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="drawer-badge">{wishlistCount}</span>
              )}
            </NavLink>
            <NavLink
              to="/profile"
              onClick={closeMenu}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            >
              <div className="mobile-profile-inline">
                <User size={18} />
                <span>My Profile & Saved Addresses</span>
              </div>
            </NavLink>
          </div>
        )}
      </header>
    </>
  );
}
