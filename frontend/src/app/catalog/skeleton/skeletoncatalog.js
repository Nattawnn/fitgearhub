'use client';

import './skeletoncatalog.css';

export default function SkeletonCatalog() {
  // Function to render a skeleton product card
  const renderSkeletonProductCard = () => {
    return (
      <div className="skeleton-product-card">
        <div className="skeleton-image-container skeleton"></div>
        
        <div className="skeleton-product-info">
          <div className="skeleton-category skeleton"></div>
          <div className="skeleton-product-title skeleton"></div>
          
          <div className="skeleton-product-specs">
            <div className="skeleton-spec-item skeleton"></div>
            <div className="skeleton-spec-item skeleton"></div>
          </div>
          
          <div className="skeleton-description skeleton"></div>
          <div className="skeleton-description-2 skeleton"></div>
          
          <div className="skeleton-color-options">
            <div className="skeleton-color skeleton"></div>
            <div className="skeleton-color skeleton"></div>
            <div className="skeleton-color skeleton"></div>
          </div>
          
          <div className="skeleton-stock skeleton"></div>
          
          <div className="skeleton-footer">
            <div className="skeleton-price skeleton"></div>
            <div className="skeleton-ratings skeleton"></div>
          </div>
        </div>
      </div>
    );
  };

  // Function to render a skeleton scroll card
  const renderSkeletonScrollCard = () => {
    return (
      <div className="skeleton-product-card skeleton-scroll-card">
        <div className="skeleton-image-container skeleton" style={{ height: '200px' }}></div>
        <div className="skeleton-product-info">
          <div className="skeleton-product-title skeleton"></div>
          <div className="skeleton-footer">
            <div className="skeleton-price skeleton"></div>
            <div className="skeleton-ratings skeleton"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="catalog-page">
      {/* Skeleton Header Section */}
      <section className="skeleton-header">
        <div className="container">
          <div className="skeleton-header-content">
            <div className="skeleton-title skeleton"></div>
            <div className="skeleton-subtitle skeleton"></div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Skeleton Navigation */}
        <div className="skeleton-nav skeleton"></div>
        
        {/* Skeleton Featured Products */}
        <div className="featured-row">
          <div className="skeleton-featured-header">
            <div className="skeleton-featured-title skeleton"></div>
            <div className="skeleton-featured-line"></div>
          </div>
          
          <div className="skeleton-products-grid">
            {[1, 2, 3].map((_, index) => (
              <div key={`featured-${index}`}>
                {renderSkeletonProductCard()}
              </div>
            ))}
          </div>
        </div>
        
        {/* Skeleton More Products */}
        <div className="skeleton-products-grid">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={`product-${index}`}>
              {renderSkeletonProductCard()}
            </div>
          ))}
        </div>
        
        {/* Skeleton Recently Viewed Section */}
        <section className="skeleton-recently-viewed">
          <div className="skeleton-recently-header">
            <div className="skeleton-recently-title skeleton"></div>
            <div className="skeleton-view-all skeleton"></div>
          </div>
          
          <div className="skeleton-horizontal-scroll">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={`recent-${index}`}>
                {renderSkeletonScrollCard()}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 