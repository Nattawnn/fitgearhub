'use client';

import './CatalogNav.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaChevronDown, FaFilter, FaTh, FaThList, FaTimes } from 'react-icons/fa';

export default function CatalogNav() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const item = searchParams.get('item');
  
  const hasFilters = category || subcategory || item;
  
  const clearFilters = () => {
    router.push('/catalog');
  };
  
  const getBreadcrumbPath = () => {
    const parts = [];
    
    if (category) {
      parts.push(category);
    }
    
    if (subcategory) {
      parts.push(subcategory);
    }
    
    if (item) {
      parts.push(item);
    }
    
    return parts;
  };
  
  const breadcrumbPath = getBreadcrumbPath();
  
  return (
    <div className="catalog-nav">
      <div className="breadcrumb">
        <div className="breadcrumb-item"><a href="/">Home</a></div>
        <div className="breadcrumb-item"><a href="/catalog">Catalog</a></div>
        {breadcrumbPath.map((part, index) => (
          <div className="breadcrumb-item" key={index}>
            {index === breadcrumbPath.length - 1 ? (
              <span className="active">{part}</span>
            ) : (
              <a href="#">{part}</a>
            )}
          </div>
        ))}
      </div>
      
      <div className="filter-bar">
        <div className="filter-section">
          <span className="filter-label">Filter by:</span>
          
          <div className="filter-dropdown">
            <button className="filter-button">
              Category <FaChevronDown />
            </button>
          </div>
          
          <div className="filter-dropdown">
            <button className="filter-button">
              Price Range <FaChevronDown />
            </button>
          </div>
          
          <div className="filter-dropdown">
            <button className="filter-button">
              Brand <FaChevronDown />
            </button>
          </div>
          
          <button className="filter-button">
            <FaFilter /> All Filters
          </button>
          
          {hasFilters && (
            <button className="filter-button clear-filters" onClick={clearFilters}>
              <FaTimes /> Clear Filters
            </button>
          )}
        </div>
        
        <div className="filter-section">
          <div className="sort-options">
            <span className="filter-label">Sort by:</span>
            <div className="filter-dropdown">
              <button className="filter-button">
                Featured <FaChevronDown />
              </button>
            </div>
          </div>
          
          <div className="view-options">
            <button className="view-option active"><FaTh /></button>
            <button className="view-option"><FaThList /></button>
          </div>
        </div>
      </div>
      
      {hasFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {category && (
            <span className="filter-tag">
              Category: {category} <FaTimes onClick={clearFilters} />
            </span>
          )}
          {subcategory && (
            <span className="filter-tag">
              {subcategory} <FaTimes onClick={clearFilters} />
            </span>
          )}
          {item && (
            <span className="filter-tag">
              {item} <FaTimes onClick={clearFilters} />
            </span>
          )}
        </div>
      )}
    </div>
  );
} 