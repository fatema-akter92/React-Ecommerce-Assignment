import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalCount,
  clearCart,
} from '../features/cart/cartSlice';
import {
  selectUserProfile,
  selectUserAddresses,
  selectUserDefaultAddress,
  addOrder,
} from '../features/user/userSlice';
import { showNotification } from '../features/notification/notificationSlice';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle,
  ArrowLeft,
  Lock,
  User,
  Check,
} from 'lucide-react';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const totalCount = useSelector(selectCartTotalCount);

  // User Profile & Addresses
  const profile = useSelector(selectUserProfile);
  const savedAddresses = useSelector(selectUserAddresses);
  const defaultAddress = useSelector(selectUserDefaultAddress);

  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress ? defaultAddress.id : 'custom'
  );

  const [formData, setFormData] = useState({
    firstName: profile.fullName ? profile.fullName.split(' ')[0] : 'Alex',
    lastName: profile.fullName ? profile.fullName.split(' ').slice(1).join(' ') : 'Morgan',
    email: profile.email || 'alex.morgan@example.com',
    phone: profile.phone || '+1 (555) 234-5678',
    address: defaultAddress ? defaultAddress.street : '742 Evergreen Terrace',
    city: defaultAddress ? defaultAddress.city : 'Springfield',
    state: defaultAddress ? defaultAddress.state : 'Oregon',
    zip: defaultAddress ? defaultAddress.zip : '97477',
    paymentMethod: 'card',
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '123',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax + shipping;

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    const names = (addr.fullName || profile.fullName).split(' ');
    setFormData((prev) => ({
      ...prev,
      firstName: names[0] || prev.firstName,
      lastName: names.slice(1).join(' ') || prev.lastName,
      phone: addr.phone || prev.phone,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      navigate('/');
      return;
    }

    setIsSubmitting(true);

    const generatedOrderId = 'APX-' + Math.floor(100000 + Math.random() * 900000);
    const today = new Date().toISOString().split('T')[0];

    // Simulate order placement
    setTimeout(() => {
      setOrderId(generatedOrderId);
      setIsSubmitting(false);
      setOrderComplete(true);

      // Save order to Redux profile order history
      dispatch(
        addOrder({
          orderId: generatedOrderId,
          date: today,
          status: 'Processing',
          items: cartItems.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.category,
          })),
          subtotal,
          tax,
          shipping,
          total: grandTotal,
          deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state || ''} ${formData.zip}`,
        })
      );

      dispatch(clearCart());
      dispatch(
        showNotification({
          message: 'Order placed successfully! Saved to your profile order history.',
          type: 'success',
        })
      );
    }, 1200);
  };

  if (orderComplete) {
    return (
      <div className="checkout-success-container">
        <div className="checkout-success-card">
          <div className="success-icon-wrap">
            <CheckCircle size={56} className="text-emerald-500" />
          </div>
          <h1 className="success-title">Thank You For Your Order!</h1>
          <p className="order-id-badge">Order ID: <strong>{orderId}</strong></p>
          <p className="success-desc">
            We have received your order and are packing your items. A confirmation receipt has been sent to <strong>{formData.email || 'your email'}</strong>.
          </p>
          <div className="success-details-box">
            <div className="success-row">
              <span>Customer:</span>
              <strong>{formData.firstName} {formData.lastName}</strong>
            </div>
            <div className="success-row">
              <span>Delivery Address:</span>
              <strong>{formData.address}, {formData.city} {formData.zip}</strong>
            </div>
            <div className="success-row">
              <span>Total Paid:</span>
              <strong className="text-emerald-600">${grandTotal.toFixed(2)}</strong>
            </div>
          </div>
          <div className="success-cta-actions">
            <Link to="/profile" className="btn btn-secondary btn-lg">
              <User size={18} />
              <span>View in My Orders</span>
            </Link>
            <Link to="/" className="btn btn-primary btn-lg">
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-card">
          <h2>Your Cart is Empty</h2>
          <p>Please add products to your cart before proceeding to checkout.</p>
          <Link to="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <div className="checkout-breadcrumbs">
        <Link to="/cart" className="btn-back">
          <ArrowLeft size={18} />
          <span>Back to Cart</span>
        </Link>
        <h1 className="page-title">Secure Checkout</h1>
      </div>

      <div className="checkout-grid">
        {/* Form Column */}
        <div className="checkout-form-column">
          <form onSubmit={handleSubmitOrder} className="checkout-form">
            {/* Quick Saved Address Picker from Profile */}
            {savedAddresses.length > 0 && (
              <section className="form-section">
                <div className="section-header-compact">
                  <h2 className="form-section-title no-border">Select Delivery Address</h2>
                  <Link to="/profile" className="link-manage-address">
                    Manage Addresses &rarr;
                  </Link>
                </div>
                <div className="checkout-address-cards-row">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`checkout-address-card ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="card-top">
                          <span className="address-badge">{addr.label}</span>
                          {isSelected && <Check size={16} className="text-indigo-600" />}
                        </div>
                        <h4 className="addr-recipient">{addr.fullName}</h4>
                        <p className="addr-text">{addr.street}</p>
                        <p className="addr-text">{addr.city}, {addr.state} {addr.zip}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Contact Details */}
            <section className="form-section">
              <h2 className="form-section-title">1. Contact Information</h2>
              <div className="form-row-2">
                <div className="form-field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </section>

            {/* Shipping Details */}
            <section className="form-section">
              <h2 className="form-section-title">2. Shipping Address Details</h2>
              <div className="form-field">
                <label htmlFor="address">Street Address</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="zip">Postal / ZIP Code</label>
                  <input
                    id="zip"
                    type="text"
                    name="zip"
                    required
                    value={formData.zip}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="form-section">
              <h2 className="form-section-title">3. Payment Information</h2>
              <div className="payment-options">
                <label className={`payment-radio-card ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                  />
                  <CreditCard size={20} className="text-indigo-600" />
                  <span>Credit / Debit Card</span>
                </label>

                <label className={`payment-radio-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <Truck size={20} className="text-indigo-600" />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="card-input-box">
                  <div className="form-field">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Expires</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-field">
                      <label>CVC</label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-checkout-large"
            >
              <Lock size={18} />
              <span>{isSubmitting ? 'Processing Order...' : `Pay $${grandTotal.toFixed(2)}`}</span>
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-summary-column">
          <div className="order-summary-card">
            <h2 className="summary-title">Order Review ({totalCount} items)</h2>

            <div className="checkout-items-preview">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item-preview-row">
                  <img src={item.image} alt={item.title} className="preview-img" />
                  <div className="preview-info">
                    <span className="preview-title">{item.title}</span>
                    <span className="preview-meta">
                      Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                    </span>
                  </div>
                  <span className="preview-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total-row">
                <span>Grand Total</span>
                <span className="total-amount-highlight">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="secure-badge-box">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span>100% Encrypted & Safe Order Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
