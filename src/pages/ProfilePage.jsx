import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectUserProfile,
  selectUserAddresses,
  selectUserOrders,
  updateProfile,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from '../features/user/userSlice';
import { selectWishlistItems } from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import { showNotification } from '../features/notification/notificationSlice';
import {
  User,
  MapPin,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Save,
  ShoppingBag,
  Heart,
} from 'lucide-react';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const profile = useSelector(selectUserProfile);
  const addresses = useSelector(selectUserAddresses);
  const orders = useSelector(selectUserOrders);
  const wishlistItems = useSelector(selectWishlistItems);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses' | 'orders'

  // Personal Info Form State
  const [profileForm, setProfileForm] = useState({
    fullName: profile.fullName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    avatar: profile.avatar || '',
  });

  // Add Address Form State
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    fullName: profile.fullName || '',
    phone: profile.phone || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileForm));
    dispatch(
      showNotification({
        message: 'Personal profile updated successfully!',
        type: 'success',
      })
    );
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addressForm.street || !addressForm.city || !addressForm.zip) {
      dispatch(
        showNotification({
          message: 'Please complete all address fields.',
          type: 'error',
        })
      );
      return;
    }
    dispatch(addAddress(addressForm));
    dispatch(
      showNotification({
        message: `New delivery address "${addressForm.label}" saved!`,
        type: 'success',
      })
    );
    setShowAddAddressModal(false);
    setAddressForm({
      label: 'Home',
      fullName: profile.fullName || '',
      phone: profile.phone || '',
      street: '',
      city: '',
      state: '',
      zip: '',
      isDefault: false,
    });
  };

  const handleReorder = (item) => {
    dispatch(
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        category: item.category || 'Product',
        quantity: 1,
      })
    );
    dispatch(
      showNotification({
        message: `Added "${item.title.slice(0, 20)}..." back to cart!`,
        type: 'success',
      })
    );
  };

  return (
    <div className="profile-page-container">
      {/* Header Banner */}
      <div className="profile-header-card">
        <div className="profile-avatar-wrapper">
          <img
            src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={profile.fullName}
            className="profile-avatar-img"
          />
        </div>
        <div className="profile-header-info">
          <h1 className="profile-name">{profile.fullName}</h1>
          <p className="profile-email">{profile.email}</p>
          <span className="profile-joined-badge">Member since {profile.joinedDate || '2024'}</span>
        </div>

        {/* Quick summary metrics */}
        <div className="profile-stats-grid">
          <div className="profile-stat-box" onClick={() => setActiveTab('orders')}>
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Orders</span>
          </div>
          <div className="profile-stat-box" onClick={() => setActiveTab('addresses')}>
            <span className="stat-number">{addresses.length}</span>
            <span className="stat-label">Addresses</span>
          </div>
          <Link to="/wishlist" className="profile-stat-box">
            <span className="stat-number">{wishlistItems.length}</span>
            <span className="stat-label">Wishlist</span>
          </Link>
        </div>
      </div>

      {/* Main Layout: Nav Tabs + Content Area */}
      <div className="profile-content-grid">
        {/* Sidebar Navigation */}
        <aside className="profile-sidebar-nav">
          <button
            onClick={() => setActiveTab('profile')}
            className={`profile-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User size={18} />
            <span>Personal Information</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`profile-nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
          >
            <MapPin size={18} />
            <span>Saved Addresses ({addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          >
            <Package size={18} />
            <span>Order History ({orders.length})</span>
          </button>
          <Link to="/wishlist" className="profile-nav-btn">
            <Heart size={18} />
            <span>Saved Wishlist ({wishlistItems.length})</span>
          </Link>
        </aside>

        {/* Tab Body */}
        <div className="profile-tab-body">
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === 'profile' && (
            <div className="profile-panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Personal Profile Details</h2>
                  <p className="panel-subtitle">Manage your personal contact details and avatar</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-field">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    required
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      value={profileForm.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      required
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="avatar">Profile Avatar URL</label>
                  <input
                    id="avatar"
                    type="url"
                    name="avatar"
                    placeholder="https://..."
                    value={profileForm.avatar}
                    onChange={handleProfileChange}
                  />
                  <small className="field-hint">Paste an image web URL to customize your avatar</small>
                </div>

                <button type="submit" className="btn btn-primary btn-icon">
                  <Save size={18} />
                  <span>Save Profile</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="profile-panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Saved Delivery Addresses</h2>
                  <p className="panel-subtitle">Your saved shipping destinations for one-click checkout</p>
                </div>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="btn btn-primary btn-sm btn-icon"
                >
                  <Plus size={16} />
                  <span>Add New Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="empty-addresses-state">
                  <MapPin size={36} className="text-slate-400" />
                  <p>No delivery addresses saved yet.</p>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="addresses-grid">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`address-card ${addr.isDefault ? 'default-address' : ''}`}
                    >
                      <div className="address-card-header">
                        <div className="address-label-wrap">
                          <span className="address-type-pill">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="default-pill">
                              <CheckCircle2 size={12} />
                              <span>Default</span>
                            </span>
                          )}
                        </div>
                        <div className="address-actions">
                          {!addr.isDefault && (
                            <button
                              onClick={() => dispatch(setDefaultAddress(addr.id))}
                              className="btn-text-sm"
                              title="Set as Default Address"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => dispatch(deleteAddress(addr.id))}
                            className="btn-trash-icon"
                            title="Delete address"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="address-body">
                        <h4 className="recipient-name">{addr.fullName}</h4>
                        <p className="recipient-phone">{addr.phone}</p>
                        <p className="recipient-street">{addr.street}</p>
                        <p className="recipient-city">
                          {addr.city}, {addr.state} {addr.zip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="profile-panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Order History & Invoices</h2>
                  <p className="panel-subtitle">Review previous purchases, shipping details, and track packages</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="empty-addresses-state">
                  <Package size={36} className="text-slate-400" />
                  <p>You haven't placed any orders yet.</p>
                  <Link to="/" className="btn btn-primary btn-sm">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.orderId} className="order-history-card">
                      <div className="order-header-bar">
                        <div className="order-main-meta">
                          <span className="order-id-label">Order <strong>#{order.orderId}</strong></span>
                          <span className="order-date-label">
                            <Clock size={14} />
                            <span>{order.date}</span>
                          </span>
                        </div>
                        <div className="order-status-group">
                          <span className={`status-pill status-${(order.status || 'Delivered').toLowerCase().replace(' ', '-')}`}>
                            {order.status || 'Delivered'}
                          </span>
                          <span className="order-total-amount">
                            ${Number(order.total).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="order-address-snippet">
                        <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                        <span>Delivered to: <strong>{order.deliveryAddress || 'Default Address'}</strong></span>
                      </div>

                      {/* Purchased Items in this order */}
                      <div className="order-items-preview-box">
                        {order.items && order.items.map((item, idx) => (
                          <div key={idx} className="order-item-row">
                            <img src={item.image} alt={item.title} className="order-item-img" />
                            <div className="order-item-details">
                              <h4 className="order-item-name">{item.title}</h4>
                              <span className="order-item-sub">
                                Qty: {item.quantity} &times; ${Number(item.price).toFixed(2)}
                              </span>
                            </div>
                            <button
                              onClick={() => handleReorder(item)}
                              className="btn btn-secondary btn-xs"
                            >
                              <ShoppingBag size={14} />
                              <span>Reorder</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for adding a new address */}
      {showAddAddressModal && (
        <div className="modal-backdrop" onClick={() => setShowAddAddressModal(false)}>
          <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Delivery Address</h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="modal-close-btn"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="address-modal-form">
              <div className="form-row-2">
                <div className="form-field">
                  <label>Address Label (e.g. Home, Office, Vacation)</label>
                  <input
                    type="text"
                    name="label"
                    required
                    placeholder="Home / Work"
                    value={addressForm.label}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="form-field">
                  <label>Recipient Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={addressForm.fullName}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="form-field">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="123 Main St, Apt 4B"
                    value={addressForm.street}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-field">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={addressForm.city}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="form-field">
                  <label>State / Province</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={addressForm.state}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="form-field">
                  <label>Postal / ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    value={addressForm.zip}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={addressForm.isDefault}
                  onChange={handleAddressChange}
                />
                <span>Set as my default shipping address</span>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
