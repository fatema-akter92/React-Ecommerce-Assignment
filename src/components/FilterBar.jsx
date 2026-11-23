import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  resetFilters,
  selectSearchQuery,
  selectSelectedCategory,
  selectSortBy,
  selectCategories,
} from '../features/products/productsSlice';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterBar({ totalCount, filteredCount }) {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const selectedCategory = useSelector(selectSelectedCategory);
  const sortBy = useSelector(selectSortBy);
  const categories = useSelector(selectCategories);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || sortBy !== 'default';

  return (
    <div className="filter-bar-card">
      {/* Top row: Search input & sorting */}
      <div className="filter-top-row">
        {/* Search by name */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products by title..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="search-input"
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="clear-search-btn"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Price & Rating Sorting */}
        <div className="sort-wrapper">
          <SlidersHorizontal size={16} className="sort-icon" />
          <label htmlFor="sort-select" className="sr-only">Sort products</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className="sort-select"
          >
            <option value="default">Sort by: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="category-pills-row">
        <span className="category-label">Category:</span>
        <div className="category-pills-scroll">
          <button
            onClick={() => dispatch(setSelectedCategory('all'))}
            className={`category-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setSelectedCategory(cat))}
              className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Meta Bar: Product count and reset */}
      <div className="filter-meta-row">
        <span className="results-count">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> items
          {selectedCategory !== 'all' && (
            <span className="meta-tag">
              in <em>{selectedCategory}</em>
            </span>
          )}
        </span>

        {hasActiveFilters && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="btn-reset-filters"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
