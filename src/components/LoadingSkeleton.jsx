import React from 'react';

export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image skeleton-shimmer"></div>
          <div className="skeleton-body">
            <div className="skeleton-badge skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-title skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-subtitle skeleton-shimmer"></div>
            <div className="skeleton-footer">
              <div className="skeleton-price skeleton-shimmer"></div>
              <div className="skeleton-button skeleton-shimmer"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
