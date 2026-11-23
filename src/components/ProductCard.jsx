import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../features/wishlist/wishlistSlice';
import { showNotification } from '../features/notification/notificationSlice';
import { ShoppingBag, Heart, Star, Check, Zap } from 'lucide-react';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isInWishlist = useSelector(selectIsInWishlist(product.id));
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    dispatch(
      showNotification({
        message: `Added "${product.title.slice(0, 24)}..." to cart!`,
        type: 'success',
      })
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    dispatch(
      showNotification({
        message: `Proceeding to checkout for "${product.title.slice(0, 20)}..."`,
        type: 'success',
      })
    );
    navigate('/checkout');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    dispatch(
      showNotification({
        message: isInWishlist
          ? `Removed from wishlist`
          : `Added to wishlist!`,
        type: isInWishlist ? 'info' : 'success',
      })
    );
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`} className="product-image-link">
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
            loading="lazy"
          />
        </Link>
        <button
          onClick={handleToggleWishlist}
          className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={isInWishlist ? '#ef4444' : 'none'} color={isInWishlist ? '#ef4444' : '#64748b'} />
        </button>
        <span className="category-pill">{product.category}</span>
      </div>

      <div className="product-info">
        <div className="product-rating">
          <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
          <span className="rating-score">{product.rating?.rate || '4.0'}</span>
          <span className="rating-count">({product.rating?.count || 0})</span>
        </div>

        <h3 className="product-title">
          <Link to={`/product/${product.id}`} title={product.title}>
            {product.title}
          </Link>
        </h3>

        <div className="product-price-section">
          <div className="product-price-wrapper">
            <span className="price-currency">$</span>
            <span className="price-amount">{Number(product.price).toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="product-actions-grid">
          <button
            onClick={handleAddToCart}
            className={`btn-add-cart ${justAdded ? 'added' : ''}`}
            aria-label="Add to Cart"
          >
            {justAdded ? (
              <>
                <Check size={16} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            className="btn-buy-now-card"
            aria-label="Buy Now"
            title="Instant Checkout"
          >
            <Zap size={15} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
