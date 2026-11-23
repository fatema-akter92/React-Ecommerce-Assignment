import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalCount,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from '../features/cart/cartSlice';
import { selectUserDefaultAddress } from '../features/user/userSlice';
import { showNotification } from '../features/notification/notificationSlice';
import ConfirmModal from '../components/ConfirmModal';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  CheckCircle,
  Zap,
  MapPin,
} from 'lucide-react';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const totalCount = useSelector(selectCartTotalCount);
  const defaultAddress = useSelector(selectUserDefaultAddress);

  // Promo code feature
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  // Confirmation modal state (Bonus requirement)
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {},
  });

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SAVE10') {
      setDiscountPercent(10);
      setPromoApplied(true);
      dispatch(
        showNotification({
          message: 'Promo code SAVE10 applied! 10% discount added.',
          type: 'success',
        })
      );
    } else {
      dispatch(
        showNotification({
          message: 'Invalid promo code. Try "SAVE10" for 10% off.',
          type: 'error',
        })
      );
    }
  };

  const promptRemoveItem = (item) => {
    setModalConfig({
      isOpen: true,
      title: 'Remove item from cart?',
      message: `Are you sure you want to remove "${item.title}" from your shopping cart?`,
      confirmText: 'Remove Item',
      onConfirm: () => {
        dispatch(removeFromCart(item.id));
        dispatch(
          showNotification({
            message: `Removed "${item.title.slice(0, 20)}..." from cart.`,
            type: 'info',
          })
        );
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const promptClearCart = () => {
    setModalConfig({
      isOpen: true,
      title: 'Clear entire shopping cart?',
      message: 'This will remove all items currently in your cart. This action cannot be undone.',
      confirmText: 'Clear Cart',
      onConfirm: () => {
        dispatch(clearCart());
        dispatch(
          showNotification({
            message: 'All items removed from your shopping cart.',
            type: 'info',
          })
        );
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Calculations
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.08; // 8% tax
  const grandTotal = taxableAmount + tax + shipping;

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-card">
          <div className="empty-cart-icon-circle">
            <ShoppingBag size={48} className="text-slate-400" />
          </div>
          <h2 className="empty-cart-title">Your Shopping Cart is Empty</h2>
          <p className="empty-cart-desc">
            Looks like you haven't added anything to your cart yet. Explore our wide collection and find your favorite items today!
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            <span>Explore Products</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-page-header">
        <div>
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">
            You have <strong>{totalCount}</strong> item{totalCount === 1 ? '' : 's'} in your cart
          </p>
        </div>
        <button onClick={promptClearCart} className="btn-clear-cart">
          <Trash2 size={16} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="cart-layout-grid">
        {/* Cart Items List */}
        <div className="cart-items-column">
          <div className="cart-items-card">
            {cartItems.map((item) => {
              const itemTotal = item.price * item.quantity;
              return (
                <div key={item.id} className="cart-item-row">
                  {/* Thumbnail */}
                  <Link to={`/product/${item.id}`} className="cart-item-thumb-link">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="cart-item-img"
                    />
                  </Link>

                  {/* Details */}
                  <div className="cart-item-info">
                    <span className="cart-item-category">{item.category}</span>
                    <h3 className="cart-item-title">
                      <Link to={`/product/${item.id}`}>{item.title}</Link>
                    </h3>
                    <div className="cart-item-unit-price">
                      ${Number(item.price).toFixed(2)} each
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="cart-item-quantity-box">
                    <button
                      type="button"
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                      className="qty-btn"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => dispatch(increaseQuantity(item.id))}
                      className="qty-btn"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Line Item Total */}
                  <div className="cart-item-total">
                    <span className="item-subtotal-price">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => promptRemoveItem(item)}
                    className="btn-remove-item"
                    aria-label={`Remove ${item.title}`}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-continue-shopping">
            <Link to="/" className="btn-text-link">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="cart-summary-column">
          <div className="order-summary-card">
            <h2 className="summary-title">Order Summary</h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="promo-form">
              <div className="promo-input-group">
                <Tag size={16} className="promo-icon" />
                <input
                  type="text"
                  placeholder="Promo code (try SAVE10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-input"
                />
                <button type="submit" className="btn-promo-apply">
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="promo-success-badge">
                  <CheckCircle size={14} />
                  <span>10% Discount Applied!</span>
                </div>
              )}
            </form>

            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Subtotal ({totalCount} items)</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row text-emerald-600">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="summary-value">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span className="summary-value">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="summary-row">
                <span>Estimated Tax (8%)</span>
                <span className="summary-value">${tax.toFixed(2)}</span>
              </div>

              {subtotal < 50 && (
                <div className="free-shipping-meter">
                  <p className="meter-text">
                    Add <strong>${(50 - subtotal).toFixed(2)}</strong> more to qualify for <strong>FREE Shipping</strong>!
                  </p>
                  <div className="meter-bar-track">
                    <div
                      className="meter-bar-fill"
                      style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row summary-total-row">
                <span>Total Amount</span>
                <span className="total-amount-highlight">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {defaultAddress && (
              <div className="cart-delivery-note">
                <MapPin size={15} className="text-indigo-600 flex-shrink-0" />
                <span className="delivery-note-text">
                  Delivering to: <strong>{defaultAddress.street}, {defaultAddress.city}</strong>
                  <Link to="/profile" className="note-link"> (Change)</Link>
                </span>
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-checkout-full"
            >
              <Zap size={18} />
              <span>⚡ Buy Now / Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div className="secure-badge-box">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span>Safe & 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
