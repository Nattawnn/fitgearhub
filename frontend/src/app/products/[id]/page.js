'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaHeart, FaShoppingCart, FaStar, FaRegStar, FaShieldAlt, 
  FaTruck, FaUndo, FaCheck, FaChevronRight, FaShare 
} from 'react-icons/fa';
import './product.css';

export default function ProductDetail({ params }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isSticky, setIsSticky] = useState(false);

  // Handle sticky add to cart bar on mobile
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle quantity changes with validation
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  // Mock product data - in a real app this would come from an API
  const product = {
    id: params.id,
    name: "Premium Performance Boxing Gloves",
    price: 179.99,
    rating: 4.8,
    reviews: 156,
    reviewsData: [
      { id: 1, user: "John D.", rating: 5, comment: "Excellent quality and durability. Perfect for professional training.", date: "2024-02-15" },
      { id: 2, user: "Sarah M.", rating: 4, comment: "Great gloves, very comfortable. Sizing runs slightly large.", date: "2024-02-10" },
      { id: 3, user: "Mike R.", rating: 5, comment: "Best gloves I've ever used. Worth every penny.", date: "2024-02-05" }
    ],
    description: "Professional-grade boxing gloves engineered for elite performance. Features premium leather construction, advanced impact absorption, and ergonomic wrist support for optimal protection.",
    images: [
      "https://res.cloudinary.com/dstl8qazf/image/upload/v1746800160/b2zemgektesep1nqfirh.png",
      "https://res.cloudinary.com/dstl8qazf/image/upload/v1746800238/vhorpxgcge2ommmcy3pl.png",
      "https://res.cloudinary.com/dstl8qazf/image/upload/v1746800242/ucobyaucgrxgvyksfm5a.png"
    ],
    sizes: ["8oz", "10oz", "12oz", "14oz", "16oz"],
    colors: ["#d32f2f", "#000000", "#2e7d32"],
    features: [
      "Premium genuine leather construction",
      "Multi-layered foam padding system",
      "Moisture-wicking antimicrobial lining",
      "Anatomical thumb position",
      "Professional-grade wrist support"
    ],
    specs: [
      { label: "Material", value: "Premium Leather" },
      { label: "Padding", value: "Multi-Layer Foam" },
      { label: "Closure", value: "Hook & Loop" },
      { label: "Usage", value: "Training/Competition" },
      { label: "Weight", value: "16 oz (454g)" },
      { label: "Inner Material", value: "Antimicrobial Lining" },
      { label: "Warranty", value: "2 Years" },
      { label: "Origin", value: "Handcrafted in Pakistan" }
    ],
    stock: 15,
    category: "Combat Sports",
    subcategory: "Boxing"
  };

  // Mock related products
  const relatedProducts = [
    {
      id: 1,
      name: "Pro Hand Wraps",
      price: 12.99,
      image: "https://res.cloudinary.com/dstl8qazf/image/upload/v1746800160/b2zemgektesep1nqfirh.png",
      rating: 4.5
    },
    {
      id: 2,
      name: "Boxing Headgear",
      price: 89.99,
      image: "https://res.cloudinary.com/dstl8qazf/image/upload/v1746800238/vhorpxgcge2ommmcy3pl.png",
      rating: 4.7
    },
    {
      id: 3,
      name: "Premium Mouthguard",
      price: 29.99,
      image: "https://res.cloudinary.com/dstl8qazf/image/upload/v1746800242/ucobyaucgrxgvyksfm5a.png",
      rating: 4.6
    }
  ];

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

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    // Add to cart logic here
    console.log('Added to cart:', {
      productId: product.id,
      size: selectedSize,
      quantity: quantity
    });
  };

  return (
    <div className="pdp-page">
      {/* Breadcrumb Navigation */}
      <div className="pdp-breadcrumb-container">
        <div className="pdp-layout-container">
          <nav className="pdp-breadcrumb">
            <Link href="/">Home</Link>
            <FaChevronRight />
            <Link href="/catalog">Shop</Link>
            <FaChevronRight />
            <Link href={`/catalog?category=${product.category.toLowerCase()}`}>{product.category}</Link>
            <FaChevronRight />
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="pdp-layout-container">
        {/* Product Gallery and Info */}
        <div className="pdp-main">
          <div className="pdp-gallery">
            <div className="pdp-main-image">
              <div className="pdp-image-zoom-container">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="pdp-image"
                />
              </div>
            </div>
            <div className="pdp-thumbnail-strip">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`pdp-thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    width={80}
                    height={80}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pdp-info">
            <div className="pdp-header">
              <div className="pdp-category-tag">{product.category} / {product.subcategory}</div>
              <h1 className="pdp-title">{product.name}</h1>
              
              <div className="pdp-meta">
                <div className="pdp-ratings">
                  <div className="pdp-stars">
                    {renderStars(product.rating)}
                  </div>
                  <span className="pdp-rating-value">{product.rating}</span>
                  <span className="pdp-reviews-count">({product.reviews} reviews)</span>
                </div>
                
                <button className="pdp-share-button">
                  <FaShare /> Share
                </button>
              </div>

              <div className="pdp-price">
                ${product.price.toFixed(2)}
              </div>
            </div>

            <p className="pdp-description">{product.description}</p>

            {/* Size Selection */}
            <div className="pdp-size-selection">
              <div className="pdp-selection-header">
                <label>Select Size</label>
                <button className="pdp-size-guide-button">Size Guide</button>
              </div>
              <div className="pdp-size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`pdp-size-option ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="pdp-color-selection">
              <label>Available Colors</label>
              <div className="pdp-color-options">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="pdp-color-option"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="pdp-stock-status">
              {product.stock > 0 ? (
                <span className="pdp-in-stock">
                  <FaCheck /> In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="pdp-out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* Quantity Selection */}
            <div className="pdp-quantity-selection">
              <label>Quantity</label>
              <div className="pdp-quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="pdp-quantity-btn"
                  type="button"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                  min="1"
                  max={product.stock}
                  onBlur={() => {
                    if (!quantity || quantity < 1) setQuantity(1);
                    if (quantity > product.stock) setQuantity(product.stock);
                  }}
                  aria-label="Product quantity"
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="pdp-quantity-btn"
                  type="button"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pdp-actions">
              <button className="pdp-add-to-cart" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="pdp-wishlist">
                <FaHeart />
              </button>
            </div>

            {/* Premium Features */}
            <div className="pdp-premium-features">
              <div className="pdp-feature">
                <FaShieldAlt />
                <div className="pdp-feature-text">
                  <span className="pdp-feature-title">Premium Quality</span>
                  <span className="pdp-feature-desc">2-Year Warranty</span>
                </div>
              </div>
              <div className="pdp-feature">
                <FaTruck />
                <div className="pdp-feature-text">
                  <span className="pdp-feature-title">Free Shipping</span>
                  <span className="pdp-feature-desc">Orders over $100</span>
                </div>
              </div>
              <div className="pdp-feature">
                <FaUndo />
                <div className="pdp-feature-text">
                  <span className="pdp-feature-title">Easy Returns</span>
                  <span className="pdp-feature-desc">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="pdp-details">
          <div className="pdp-details-header">
            <h2>Product Specifications</h2>
          </div>
          
          <div className="pdp-details-content">
            <div className="pdp-specs-grid">
              {product.specs.map((spec, index) => (
                <div key={index} className="pdp-spec-item">
                  <span className="pdp-spec-label">{spec.label}</span>
                  <span className="pdp-spec-value">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="pdp-features-list">
              <h3>Premium Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <FaCheck /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="pdp-related-products">
          <h2>You Might Also Like</h2>
          <div className="pdp-related-products-grid">
            {relatedProducts.map((product) => (
              <div key={product.id} className="pdp-related-product-card">
                <div className="pdp-related-product-image">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                  />
                </div>
                <div className="pdp-related-product-info">
                  <h3>{product.name}</h3>
                  <div className="pdp-related-product-meta">
                    <span className="pdp-related-product-price">${product.price.toFixed(2)}</span>
                    <div className="pdp-related-product-rating">
                      {renderStars(product.rating)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart Bar (Mobile) */}
      <div className={`pdp-sticky-add-to-cart ${isSticky ? 'visible' : ''}`}>
        <div className="pdp-sticky-product-info">
          <span className="pdp-sticky-product-name">{product.name}</span>
          <span className="pdp-sticky-product-price">${product.price.toFixed(2)}</span>
        </div>
        <button className="pdp-sticky-add-to-cart-btn" onClick={handleAddToCart}>
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
}
