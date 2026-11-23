import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectWishlistItems,
  removeFromWishlist,
  clearWishlist,
} from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import { showNotification } from '../features/notification/notificationSlice';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  const handleMoveToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product.id));
    dispatch(
      showNotification({
        message: `Moved "${product.title.slice(0, 22)}..." to your cart!`,
        type: 'success',
      })
    );
  };

  const handleRemove = (product) => {
    dispatch(removeFromWishlist(product.id));
    dispatch(
      showNotification({
        message: `Removed from wishlist.`,
        type: 'info',
      })
    );
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-card">
          <div className="empty-cart-icon-circle">
            <Heart size={48} className="text-rose-400" />
          </div>
          <h2 className="empty-cart-title">Your Wishlist is Empty</h2>
          <p className="empty-cart-desc">
            Save items you love here! Click the heart icon on any product to save it for later.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            <span>Discover Items</span>
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
          <h1 className="page-title">My Wishlist</h1>
          <p className="page-subtitle">
            You have <strong>{wishlistItems.length}</strong> saved item{wishlistItems.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          onClick={() => dispatch(clearWishlist())}
          className="btn-clear-cart"
        >
          <Trash2 size={16} />
          <span>Clear Wishlist</span>
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((product) => (
          <div key={product.id} className="wishlist-card">
            <div className="wishlist-card-thumb">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="wishlist-image"
                />
              </Link>
              <button
                onClick={() => handleRemove(product)}
                className="wishlist-delete-btn"
                title="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="wishlist-card-body">
              <span className="category-pill">{product.category}</span>
              <h3 className="wishlist-item-title">
                <Link to={`/product/${product.id}`}>{product.title}</Link>
              </h3>
              <div className="wishlist-price">
                ${Number(product.price).toFixed(2)}
              </div>
              <button
                onClick={() => handleMoveToCart(product)}
                className="btn btn-primary btn-full-width"
              >
                <ShoppingBag size={16} />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
