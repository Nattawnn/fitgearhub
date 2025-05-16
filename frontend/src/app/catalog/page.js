'use client';

import './catalog.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaSearch, FaHeart, FaShoppingCart, FaRegListAlt, FaExchangeAlt, FaStar, FaRegStar, FaDumbbell, FaRunning, FaRegClock } from 'react-icons/fa';
import CatalogNav from '../components/CatalogNav';
import SkeletonCatalog from './skeleton/skeletoncatalog';
import Link from 'next/link';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    subcategory: null,
    item: null
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get filter parameters from URL
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const item = searchParams.get('item');
    
    if (category || subcategory || item) {
      setActiveFilters({
        category: category || null,
        subcategory: subcategory || null,
        item: item || null
      });
    }
  }, [searchParams]);
  
  useEffect(() => {
    // Simulate loading state
    setIsLoading(true);
    
    // Mock product data for demonstration
    const productData = [
      {
        id: 1,
        name: 'Premium Boxing Gloves',
        category: 'Combat Sports',
        subcategory: 'Boxing',
        itemType: 'Accessories',
        price: 180,
        rating: 4.7,
        reviews: 42,
        badge: 'bestseller',
        description: 'Professional grade leather gloves with superior wrist support and impact absorption.',
        image: 'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800160/b2zemgektesep1nqfirh.png',
        thumbnails: [
          'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800160/b2zemgektesep1nqfirh.png',
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40'
        ],
        colors: ['#d32f2f', '#000000', '#2e7d32'],
        specs: [
          { icon: <FaDumbbell />, text: 'Pro Grade' },
          { icon: <FaRunning />, text: 'Endurance+' }
        ],
        stock: 15
      },
      {
        id: 2,
        name: 'Pro Performance Stud Shoes',
        category: 'Sports',
        subcategory: 'Soccer',
        itemType: 'Cleats',
        price: 180,
        rating: 4.8,
        reviews: 35,
        badge: 'new',
        description: 'Engineered for explosive acceleration with carbon fiber reinforced cleats and adaptive fit.',
        image: 'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800238/vhorpxgcge2ommmcy3pl.png',
        thumbnails: [
          'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800238/vhorpxgcge2ommmcy3pl.png',
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40'
        ],
        colors: ['#303f9f', '#f57c00', '#000000'],
        specs: [
          { icon: <FaRunning />, text: 'Speed+' },
          { icon: <FaRegClock />, text: 'Durable' }
        ],
        stock: 8
      },
      {
        id: 3,
        name: 'Elite Series Dumbbells',
        category: 'Fitness',
        subcategory: 'Weights',
        itemType: 'Dumbbells',
        price: 180,
        rating: 4.9,
        reviews: 56,
        description: 'Precision-engineered cast iron with ergonomic grip and balanced weight distribution.',
        image: 'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800242/ucobyaucgrxgvyksfm5a.png',
        thumbnails: [
          'https://res.cloudinary.com/dstl8qazf/image/upload/v1746800242/ucobyaucgrxgvyksfm5a.png',
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40'
        ],
        colors: ['#424242', '#9e9e9e'],
        specs: [
          { icon: <FaDumbbell />, text: 'Heavy Duty' },
          { icon: <FaRunning />, text: 'Grip+' }
        ],
        stock: 22
      },
      {
        id: 4,
        name: 'Competition Basketball',
        category: 'Sports',
        subcategory: 'Basketball',
        itemType: 'Balls',
        price: 180,
        rating: 4.6,
        reviews: 28,
        description: 'Official size and weight with micro-fiber cover for exceptional grip and durability.',
        image: 'https://via.placeholder.com/382x532/FF6B35/FFFFFF?text=Basketball',
        thumbnails: [
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40'
        ],
        colors: ['#ff9800', '#000000'],
        specs: [
          { icon: <FaDumbbell />, text: 'Competition' },
          { icon: <FaRegClock />, text: 'Long-lasting' }
        ],
        stock: 17
      },
      {
        id: 5,
        name: 'Advanced Training Resistance Bands',
        category: 'Fitness',
        subcategory: 'Yoga',
        itemType: 'Accessories',
        price: 180,
        rating: 4.5,
        reviews: 31,
        badge: 'bestseller',
        description: 'Progressive resistance set with reinforced latex construction and secure anchoring system.',
        image: 'https://via.placeholder.com/382x532/002e5f/FFFFFF?text=Bands',
        thumbnails: [
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40'
        ],
        colors: ['#4caf50', '#f44336', '#2196f3'],
        specs: [
          { icon: <FaRunning />, text: 'All Levels' },
          { icon: <FaRegClock />, text: 'Anti-Snap' }
        ],
        stock: 5
      },
      {
        id: 6,
        name: 'Carbon Fiber Tennis Racket',
        category: 'Sports',
        subcategory: 'Tennis',
        itemType: 'Rackets',
        price: 180,
        rating: 4.7,
        reviews: 23,
        description: 'Tournament-grade carbon fiber frame with vibration dampening and optimal string tension.',
        image: 'https://via.placeholder.com/382x532/001f3f/FFFFFF?text=Racket',
        thumbnails: [
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40'
        ],
        colors: ['#000000', '#3f51b5'],
        specs: [
          { icon: <FaDumbbell />, text: 'Lightweight' },
          { icon: <FaRunning />, text: 'Control+' }
        ],
        stock: 11
      },
      {
        id: 7,
        name: 'Premium Soccer Ball',
        category: 'Sports',
        subcategory: 'Soccer',
        itemType: 'Balls',
        price: 120,
        rating: 4.8,
        reviews: 42,
        description: 'Professional match ball with advanced aerodynamics and water-resistant technology.',
        image: 'https://via.placeholder.com/382x532/4CAF50/FFFFFF?text=Soccer+Ball',
        thumbnails: [
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40'
        ],
        colors: ['#4CAF50', '#FFFFFF', '#000000'],
        specs: [
          { icon: <FaDumbbell />, text: 'Match Quality' },
          { icon: <FaRegClock />, text: 'Durable' }
        ],
        stock: 25
      },
      {
        id: 8,
        name: 'Tennis Ball Set',
        category: 'Sports',
        subcategory: 'Tennis',
        itemType: 'Balls',
        price: 25,
        rating: 4.5,
        reviews: 38,
        description: 'Tournament-grade tennis balls with consistent bounce and visibility.',
        image: 'https://via.placeholder.com/382x532/FFEB3B/FFFFFF?text=Tennis+Balls',
        thumbnails: [
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40',
          'https://via.placeholder.com/40x40'
        ],
        colors: ['#FFEB3B'],
        specs: [
          { icon: <FaDumbbell />, text: 'Competition' },
          { icon: <FaRegClock />, text: 'Extra Bounce' }
        ],
        stock: 50
      }
    ];
    
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setProducts(productData);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter products based on active filters
  useEffect(() => {
    if (!products.length) return;
    
    let filtered = [...products];
    
    if (activeFilters.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === activeFilters.category.toLowerCase()
      );
    }
    
    if (activeFilters.subcategory) {
      filtered = filtered.filter(product => 
        product.subcategory.toLowerCase() === activeFilters.subcategory.toLowerCase()
      );
    }
    
    if (activeFilters.item) {
      filtered = filtered.filter(product => 
        product.itemType.toLowerCase() === activeFilters.item.toLowerCase()
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, activeFilters]);

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="star" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<FaStar key={i} className="star" style={{ opacity: '0.5' }} />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }
    return stars;
  };

  // Recently viewed products (simplified for demo)
  const recentlyViewed = products.slice(0, 4);
  
  // Products to display (filtered or all)
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;
  
  // Get filter text for display
  const getFilterText = () => {
    if (activeFilters.item) {
      return `${activeFilters.item}`;
    }
    if (activeFilters.subcategory) {
      return `${activeFilters.subcategory}`;
    }
    if (activeFilters.category) {
      return `${activeFilters.category}`;
    }
    return 'Premium Fitness Gear';
  };

  if (isLoading) {
    return <SkeletonCatalog />;
  }

  return (
    <main className="fitgear-catalog-page">
      <section className="fitgear-catalog-header">
        <div className="fitgear-catalog-header-content">
          <h1 className="fitgear-catalog-title">{getFilterText()}</h1>
          <p className="fitgear-catalog-subtitle">
            {activeFilters.category || activeFilters.subcategory || activeFilters.item
              ? `Browse our selection of ${getFilterText().toLowerCase()} products`
              : 'Discover our curated collection of high-performance equipment designed for athletes who demand excellence and precision in every workout.'}
          </p>
        </div>
      </section>

      <div className="fitgear-catalog-container">
        <CatalogNav />
        
        <div className="fitgear-catalog-featured-row">
          <div className="fitgear-catalog-featured-header">
            <h2 className="fitgear-catalog-featured-title">
              {activeFilters.category || activeFilters.subcategory || activeFilters.item
                ? `${getFilterText()} Products`
                : 'Featured Equipment'}
            </h2>
            <div className="fitgear-catalog-featured-line"></div>
          </div>
          
          <div className="fitgear-catalog-products-grid">
            {displayProducts.slice(0, 3).map(product => (
              <Link href={`/products/${product.id}`} key={product.id} className="fitgear-catalog-product-card">
                {product.badge && (
                  <div className={`fitgear-catalog-product-badge fitgear-catalog-badge-${product.badge}`}>
                    {product.badge === 'bestseller' ? 'Best Seller' : 'New Arrival'}
                  </div>
                )}
                
                <div className="fitgear-catalog-product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="fitgear-catalog-product-image"
                  />
                  
                  <div className="fitgear-catalog-product-thumbnails">
                    {product.thumbnails.map((thumb, idx) => (
                      <img 
                        key={idx} 
                        src={thumb} 
                        alt={`${product.name} view ${idx+1}`} 
                        className="fitgear-catalog-thumbnail"
                      />
                    ))}
                  </div>
                  
                  <div className="fitgear-catalog-quick-actions">
                    <button className="fitgear-catalog-action-button" onClick={(e) => e.preventDefault()}>
                      <FaHeart />
                    </button>
                    <button className="fitgear-catalog-action-button" onClick={(e) => e.preventDefault()}>
                      <FaExchangeAlt />
                    </button>
                  </div>
                </div>
                
                <div className="fitgear-catalog-product-info">
                  <div className="fitgear-catalog-product-category">{product.category}</div>
                  <h3 className="fitgear-catalog-product-title">{product.name}</h3>
                  
                  <div className="fitgear-catalog-product-specs">
                    {product.specs.map((spec, idx) => (
                      <div key={idx} className="fitgear-catalog-spec-item">
                        <span className="fitgear-catalog-spec-icon">{spec.icon}</span>
                        <span>{spec.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="fitgear-catalog-product-description">{product.description}</p>
                  
                  <div className="fitgear-catalog-color-options">
                    {product.colors.map((color, idx) => (
                      <div 
                        key={idx} 
                        className={`fitgear-catalog-color-option ${idx === 0 ? 'active' : ''}`} 
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="fitgear-catalog-stock-indicator">
                    {product.stock <= 5 ? (
                      <span className="fitgear-catalog-low-stock">Only {product.stock} left in stock</span>
                    ) : (
                      <span className="fitgear-catalog-in-stock">In Stock</span>
                    )}
                  </div>
                  
                  <div className="fitgear-catalog-product-footer">
                    <div className="fitgear-catalog-product-price">${product.price}</div>
                    
                    <div className="fitgear-catalog-ratings">
                      <div className="fitgear-catalog-stars">
                        {renderStars(product.rating)}
                      </div>
                      <span className="fitgear-catalog-review-count">({product.reviews})</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {displayProducts.length > 3 && (
          <div className="fitgear-catalog-products-container">
            <div className="fitgear-catalog-products-grid">
              {displayProducts.slice(3).map(product => (
                <Link href={`/products/${product.id}`} key={product.id} className="fitgear-catalog-product-card">
                  {product.badge && (
                    <div className={`fitgear-catalog-product-badge fitgear-catalog-badge-${product.badge}`}>
                      {product.badge === 'bestseller' ? 'Best Seller' : 'New Arrival'}
                    </div>
                  )}
                  
                  <div className="fitgear-catalog-product-image-container">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="fitgear-catalog-product-image"
                    />
                    
                    <div className="fitgear-catalog-product-thumbnails">
                      {product.thumbnails.map((thumb, idx) => (
                        <img 
                          key={idx} 
                          src={thumb} 
                          alt={`${product.name} view ${idx+1}`} 
                          className="fitgear-catalog-thumbnail"
                        />
                      ))}
                    </div>
                    
                    <div className="fitgear-catalog-quick-actions">
                      <button className="fitgear-catalog-action-button" onClick={(e) => e.preventDefault()}>
                        <FaHeart />
                      </button>
                      <button className="fitgear-catalog-action-button" onClick={(e) => e.preventDefault()}>
                        <FaExchangeAlt />
                      </button>
                    </div>
                  </div>
                  
                  <div className="fitgear-catalog-product-info">
                    <div className="fitgear-catalog-product-category">{product.category}</div>
                    <h3 className="fitgear-catalog-product-title">{product.name}</h3>
                    
                    <div className="fitgear-catalog-product-specs">
                      {product.specs.map((spec, idx) => (
                        <div key={idx} className="fitgear-catalog-spec-item">
                          <span className="fitgear-catalog-spec-icon">{spec.icon}</span>
                          <span>{spec.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    <p className="fitgear-catalog-product-description">{product.description}</p>
                    
                    <div className="fitgear-catalog-color-options">
                      {product.colors.map((color, idx) => (
                        <div 
                          key={idx} 
                          className={`fitgear-catalog-color-option ${idx === 0 ? 'active' : ''}`} 
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="fitgear-catalog-stock-indicator">
                      {product.stock <= 5 ? (
                        <span className="fitgear-catalog-low-stock">Only {product.stock} left in stock</span>
                      ) : (
                        <span className="fitgear-catalog-in-stock">In Stock</span>
                      )}
                    </div>
                    
                    <div className="fitgear-catalog-product-footer">
                      <div className="fitgear-catalog-product-price">${product.price}</div>
                      
                      <div className="fitgear-catalog-ratings">
                        <div className="fitgear-catalog-stars">
                          {renderStars(product.rating)}
                        </div>
                        <span className="fitgear-catalog-review-count">({product.reviews})</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <section className="fitgear-catalog-recently-viewed">
          <div className="fitgear-catalog-recently-viewed-header">
            <h2 className="fitgear-catalog-recently-viewed-title">Recently Viewed</h2>
            <a href="#" className="fitgear-catalog-view-all">View All</a>
          </div>
          
          <div className="fitgear-catalog-horizontal-scroll">
            {recentlyViewed.map(product => (
              <div key={product.id} className="fitgear-catalog-product-card fitgear-catalog-scroll-card">
                <div className="fitgear-catalog-product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="fitgear-catalog-product-image"
                  />
                </div>
                
                <div className="fitgear-catalog-product-info">
                  <h3 className="fitgear-catalog-product-title">{product.name}</h3>
                  <div className="fitgear-catalog-product-footer">
                    <div className="fitgear-catalog-product-price">${product.price}</div>
                    <div className="fitgear-catalog-stars">
                      {renderStars(product.rating)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}