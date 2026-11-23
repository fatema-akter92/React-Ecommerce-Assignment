import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductDetails,
  clearSelectedProduct,
  selectSelectedProduct,
  selectDetailsStatus,
  selectDetailsError,
  selectAllProducts,
  getProducts,
} from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../features/wishlist/wishlistSlice';
import { showNotification } from '../features/notification/notificationSlice';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Zap,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = useSelector(selectSelectedProduct);
  const status = useSelector(selectDetailsStatus);
  const error = useSelector(selectDetailsError);
  const allProducts = useSelector(selectAllProducts);

  const isInWishlist = useSelector(selectIsInWishlist(Number(id)));
  // Track active product id to reset local UI inputs when navigating between products
  const [currentId, setCurrentId] = useState(id);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (currentId !== id) {
    setCurrentId(id);
    setQuantity(1);
    setIsAdded(false);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(getProductDetails(id));

    if (allProducts.length === 0) {
      dispatch(getProducts());
    }

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch, allProducts.length]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        ...product,
        quantity,
      })
    );
    dispatch(
      showNotification({
        message: `Added ${quantity} item(s) of "${product.title.slice(0, 20)}..." to your cart!`,
        type: 'success',
      })
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    dispatch(toggleWishlist(product));
    dispatch(
      showNotification({
        message: isInWishlist
          ? 'Removed from wishlist'
          : 'Added to your wishlist!',
        type: isInWishlist ? 'info' : 'success',
      })
    );
  };

  // Related products from the same category
  const relatedProducts = product
    ? allProducts
        .filter((item) => item.category === product.category && item.id !== product.id)
        .slice(0, 4)
    : [];

  if (status === 'loading') {
    return (
      <div className="details-loading-container">
        <div className="details-skeleton-grid">
          <div className="skeleton-image-large skeleton-shimmer"></div>
          <div className="skeleton-details-body">
            <div className="skeleton-badge skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-title-lg skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-subtitle skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-desc skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-desc skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed' || !product) {
    return (
      <div className="details-error-box">
        <h2>Unable to load product</h2>
        <p>{error || 'The requested product could not be found.'}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      {/* Navigation Breadcrumbs / Back button */}
      <div className="breadcrumbs-bar">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="breadcrumbs-trail">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <span className="crumb-category">{product.category}</span>
          <span className="separator">/</span>
          <span className="crumb-active">{product.title.slice(0, 30)}...</span>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="details-card">
        {/* Product Image Viewer */}
        <div className="details-image-wrapper">
          <img
            src={product.image}
            alt={product.title}
            className="details-main-image"
          />
        </div>

        {/* Product Info & Actions */}
        <div className="details-content">
          <div className="details-meta-header">
            <span className="category-pill-lg">{product.category}</span>
            <button
              onClick={handleToggleWishlist}
              className={`details-wishlist-btn ${isInWishlist ? 'active' : ''}`}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={20}
                fill={isInWishlist ? '#ef4444' : 'none'}
                color={isInWishlist ? '#ef4444' : '#64748b'}
              />
            </button>
          </div>

          <h1 className="details-title">{product.title}</h1>

          {/* Rating */}
          <div className="details-rating-row">
            <div className="stars-group">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.round(product.rating?.rate || 4) ? '#f59e0b' : '#e2e8f0'}
                  color={i < Math.round(product.rating?.rate || 4) ? '#f59e0b' : '#cbd5e1'}
                />
              ))}
            </div>
            <span className="rating-score-bold">{product.rating?.rate || '4.0'}</span>
            <span className="rating-count-muted">
              ({product.rating?.count || 0} verified customer reviews)
            </span>
          </div>

          {/* Price */}
          <div className="details-price-row">
            <span className="currency-symbol">$</span>
            <span className="price-big">{Number(product.price).toFixed(2)}</span>
            <span className="tax-included-tag">Free Shipping Eligible</span>
          </div>

          {/* Description */}
          <div className="details-description-section">
            <h3 className="section-label">Product Overview</h3>
            <p className="details-description-text">{product.description}</p>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="details-purchase-box">
            <div className="quantity-control-wrap">
              <span className="quantity-label">Quantity:</span>
              <div className="quantity-stepper">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="step-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-number">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="step-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="details-cta-buttons">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`btn btn-primary btn-add-cart-large ${isAdded ? 'added' : ''}`}
              >
                {isAdded ? (
                  <>
                    <Check size={20} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="btn btn-accent btn-buy-now"
              >
                <Zap size={18} />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="details-guarantees">
            <div className="guarantee-item">
              <Truck size={18} className="text-indigo-600" />
              <span>Fast 2-4 day tracked delivery</span>
            </div>
            <div className="guarantee-item">
              <RotateCcw size={18} className="text-indigo-600" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="guarantee-item">
              <ShieldCheck size={18} className="text-indigo-600" />
              <span>Authentic verified brand product</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2 className="related-title">Similar Items In {product.category}</h2>
          <div className="products-grid">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
