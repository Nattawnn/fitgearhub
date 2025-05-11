'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './catalog.css';

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate product data
  useEffect(() => {
    const fetchProducts = () => {
      // Mock data - would be fetched from an API in a real application
      const mockProducts = [
        {
          id: 1,
          name: 'Pro Elite Training Shoes',
          price: 189.99,
          category: 'footwear',
          image: '/images/catalog/elite-shoes.jpg',
          features: ['Impact Protection', 'Breathable Mesh'],
          isNew: true,
          isBestseller: true,
          colors: ['Black/Red', 'Navy/White', 'Gray/Neon'],
          rating: 4.8,
        },
        {
          id: 2,
          name: 'Performance Compression Tights',
          price: 79.99,
          category: 'apparel',
          image: '/images/catalog/compression-tights.jpg',
          features: ['4-Way Stretch', 'Moisture Wicking'],
          isNew: false,
          isBestseller: true,
          colors: ['Black', 'Navy', 'Carbon'],
          rating: 4.9,
        },
        {
          id: 3,
          name: 'Carbon Fiber Fitness Watch',
          price: 299.99,
          category: 'accessories',
          image: '/images/catalog/fitness-watch.jpg',
          features: ['Heart Rate Monitor', '7-Day Battery Life'],
          isNew: true,
          isBestseller: false,
          colors: ['Black', 'Silver'],
          rating: 4.7,
        },
        {
          id: 4,
          name: 'Advanced Recovery Massage Gun',
          price: 229.99,
          category: 'equipment',
          image: '/images/catalog/massage-gun.jpg',
          features: ['6 Speed Settings', 'Ultra-Quiet Motor'],
          isNew: true,
          isBestseller: false,
          colors: ['Black/Silver'],
          rating: 4.9,
        },
        {
          id: 5,
          name: 'Ultralight Running Jacket',
          price: 119.99,
          category: 'apparel',
          image: '/images/catalog/running-jacket.jpg',
          features: ['Waterproof', 'Reflective Details'],
          isNew: false,
          isBestseller: true,
          colors: ['Blue', 'Black', 'Red'],
          rating: 4.6,
        },
        {
          id: 6,
          name: 'Pro Series Kettlebell Set',
          price: 249.99,
          category: 'equipment',
          image: '/images/catalog/kettlebell-set.jpg',
          features: ['Competition Grade', 'Ergonomic Handle'],
          isNew: false,
          isBestseller: false,
          colors: ['Black'],
          rating: 4.9,
        },
        {
          id: 7,
          name: 'Performance Hydration Pack',
          price: 89.99,
          category: 'accessories',
          image: '/images/catalog/hydration-pack.jpg',
          features: ['2L Capacity', 'Ventilated Back Panel'],
          isNew: true,
          isBestseller: false,
          colors: ['Black/Blue', 'Red/Black'],
          rating: 4.7,
        },
        {
          id: 8,
          name: 'Premium Training Gloves',
          price: 39.99,
          category: 'accessories',
          image: '/images/catalog/training-gloves.jpg',
          features: ['Anti-Slip Grip', 'Wrist Support'],
          isNew: false,
          isBestseller: true,
          colors: ['Black', 'Gray'],
          rating: 4.8,
        }
      ];
      
      setProducts(mockProducts);
      setIsLoading(false);
    };

    // Simulate API call delay
    setTimeout(fetchProducts, 800);
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="catalog-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>ELEVATE YOUR PERFORMANCE</h1>
          <p>Premium gear engineered for those who demand excellence</p>
          <button className="cta-button">SHOP THE COLLECTION</button>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="category-section">
        <div className="section-title">
          <h2>PREMIUM COLLECTIONS</h2>
          <div className="accent-line"></div>
        </div>
        <div className="category-nav">
          <button 
            className={activeCategory === 'all' ? 'active' : ''} 
            onClick={() => setActiveCategory('all')}
          >
            All Products
          </button>
          <button 
            className={activeCategory === 'footwear' ? 'active' : ''} 
            onClick={() => setActiveCategory('footwear')}
          >
            Footwear
          </button>
          <button 
            className={activeCategory === 'apparel' ? 'active' : ''} 
            onClick={() => setActiveCategory('apparel')}
          >
            Apparel
          </button>
          <button 
            className={activeCategory === 'equipment' ? 'active' : ''} 
            onClick={() => setActiveCategory('equipment')}
          >
            Equipment
          </button>
          <button 
            className={activeCategory === 'accessories' ? 'active' : ''} 
            onClick={() => setActiveCategory('accessories')}
          >
            Accessories
          </button>
        </div>
      </section>

      {/* Product Grid */}
      <section className="products-grid-section">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading premium products...</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <div className="product-image">
                    {/* Using a div with background as a placeholder for the image */}
                    <div className="placeholder-image"></div>
                  </div>
                  <div className="product-badges">
                    {product.isNew && <span className="badge new-badge">NEW</span>}
                    {product.isBestseller && <span className="badge bestseller-badge">BESTSELLER</span>}
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-features">
                    {product.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  <div className="product-meta">
                    <div className="product-rating">
                      <span className="stars">★★★★★</span>
                      <span className="rating-value">{product.rating}</span>
                    </div>
                    <div className="product-colors">
                      {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
                    </div>
                  </div>
                  <div className="product-price">${product.price.toFixed(2)}</div>
                  <button className="add-to-cart-button">ADD TO CART</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Spotlight */}
      <section className="product-spotlight">
        <div className="section-title">
          <h2>FEATURED TECHNOLOGY</h2>
          <div className="accent-line"></div>
        </div>
        <div className="spotlight-container">
          <div className="spotlight-image">
            <div className="placeholder-spotlight-image"></div>
          </div>
          <div className="spotlight-content">
            <h3>PRO ELITE TRAINING SHOES</h3>
            <div className="tech-highlights">
              <div className="tech-point">
                <div className="tech-icon"></div>
                <div className="tech-info">
                  <h4>ADAPTIVE CUSHIONING</h4>
                  <p>Response foam adapts to your stride, providing customized impact protection for every training style.</p>
                </div>
              </div>
              <div className="tech-point">
                <div className="tech-icon"></div>
                <div className="tech-info">
                  <h4>DYNAMIC STABILITY</h4>
                  <p>Strategic support structures engage during lateral movements, preventing rollover without restricting natural motion.</p>
                </div>
              </div>
              <div className="tech-point">
                <div className="tech-icon"></div>
                <div className="tech-info">
                  <h4>TEMPERATURE CONTROL</h4>
                  <p>Breathable mesh panels utilize body heat to create airflow, keeping your feet cool during intense workouts.</p>
                </div>
              </div>
            </div>
            <div className="spotlight-cta">
              <div className="price-badge">$189.99</div>
              <button className="spotlight-button">SHOP NOW</button>
            </div>
            <div className="athlete-quote">
              "These shoes have transformed my training. The stability during HIIT is unmatched."
              <span className="quote-author">- Alex Chen, Professional Trainer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Story */}
      <section className="collection-story">
        <div className="section-title">
          <h2>THE ELITE SERIES</h2>
          <div className="accent-line"></div>
        </div>
        <div className="story-container">
          <div className="story-content">
            <h3>ENGINEERED FOR CHAMPIONS</h3>
            <p>Developed in collaboration with elite athletes across multiple disciplines, our Elite Series represents the pinnacle of performance technology. Each piece is tested in extreme conditions to ensure it meets the demands of world-class competitors.</p>
            <p>From moisture-wicking fabrics that adapt to your body temperature to compression patterns that enhance blood flow during recovery, every detail is meticulously crafted to support peak performance.</p>
            <div className="story-cta">
              <button className="story-button">EXPLORE THE COLLECTION</button>
              <div className="qr-code">
                <div className="qr-placeholder"></div>
                <span>Scan for videos</span>
              </div>
            </div>
          </div>
          <div className="story-images">
            <div className="story-image-main"></div>
            <div className="story-image-small"></div>
            <div className="story-image-small"></div>
          </div>
        </div>
      </section>

      {/* Limited Edition Banner */}
      <section className="limited-banner">
        <div className="banner-content">
          <div className="limited-badge">LIMITED RELEASE</div>
          <h3>ALTITUDE COLLECTION</h3>
          <p>Engineered for high-performance in extreme conditions. Available for 2 weeks only.</p>
          <div className="countdown">14 DAYS REMAINING</div>
          <button className="banner-button">SHOP NOW</button>
        </div>
      </section>
    </div>
  );
}
