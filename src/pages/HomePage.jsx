import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProducts,
  getCategories,
  selectFilteredProducts,
  selectAllProducts,
  selectProductsStatus,
  selectProductsError,
} from '../features/products/productsSlice';
import { selectUserProfile } from '../features/user/userSlice';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import { Sparkles, ShoppingBag, User, MapPin } from 'lucide-react';

export default function HomePage() {
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const filteredProducts = useSelector(selectFilteredProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const user = useSelector(selectUserProfile);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getProducts());
      dispatch(getCategories());
    }
  }, [status, dispatch]);

  const handleRetry = () => {
    dispatch(getProducts());
    dispatch(getCategories());
  };

  return (
    <div className="home-page-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <Sparkles size={16} className="text-amber-400" />
            <span>Discover The Best Deals Today</span>
          </span>
          <h1 className="hero-title">
            Modern Shopping, <br />
            <span className="hero-gradient-text">Seamless Experience</span>
          </h1>
          <p className="hero-description">
            Explore our curated catalog of electronics, trendy apparel, and fine jewelry. Buy instantly with 1-click checkout or customize your shopping cart.
          </p>
          <div className="hero-cta-group">
            <div className="hero-buttons-row">
              <a href="#catalog" className="btn btn-primary btn-lg">
                <ShoppingBag size={18} />
                <span>Explore & Buy</span>
              </a>
              <Link to="/profile" className="btn btn-secondary btn-lg btn-hero-profile">
                <User size={18} className="text-indigo-600" />
                <span>My Profile ({user.fullName.split(' ')[0]})</span>
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-pill">
                <strong>20+</strong> Products
              </div>
              <div className="stat-pill">
                <strong>⚡ 1-Click</strong> Buy Now
              </div>
              <Link to="/profile" className="stat-pill stat-pill-link">
                <MapPin size={13} className="text-indigo-500" />
                <span>Saved Addresses</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="catalog-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-title">Our Featured Collection</h2>
            <p className="section-subtitle">
              Browse top-tier products across popular categories with instant search & sorting.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <FilterBar
          totalCount={allProducts.length}
          filteredCount={filteredProducts.length}
        />

        {/* Dynamic Content: Loading, Error, or Products Grid */}
        {status === 'loading' && <LoadingSkeleton count={8} />}

        {status === 'failed' && (
          <ErrorState error={error} onRetry={handleRetry} />
        )}

        {status === 'succeeded' && filteredProducts.length === 0 && (
          <div className="empty-results-box">
            <div className="empty-results-icon">🔍</div>
            <h3>No products found</h3>
            <p>We couldn't find any items matching your selected criteria. Try adjusting your search or resetting filters.</p>
          </div>
        )}

        {status === 'succeeded' && filteredProducts.length > 0 && (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
