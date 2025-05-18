'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaHeart, FaShoppingCart, FaStar, FaRegStar, FaShieldAlt, 
  FaTruck, FaUndo, FaCheck, FaChevronRight, FaShare 
} from 'react-icons/fa';
import './product.css';
import { useCart } from '../../contexts/CartContext';

export default function ProductDetail({ params }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isSticky, setIsSticky] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  // Helper function to format price
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  // Detect environment and set API URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
    (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? `http://${window.location.hostname}:8000/api`
      : 'https://fitgearhub-backend.onrender.com/api');

  // Reset added animation after timeout
  useEffect(() => {
    let timeout;
    if (addedToCart) {
      timeout = setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [addedToCart]);

  // Handle sticky add to cart bar on mobile
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const apiUrl = `${API_BASE_URL}/products/${params.id}/`;
        console.log('Fetching product from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          console.error('Error response:', await response.text());
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        
        // Fetch related products from same category
        if (data.category) {
          try {
            const relatedUrl = `${API_BASE_URL}/products/?category=${data.category.id}&exclude=${params.id}`;
            console.log('Fetching related products from:', relatedUrl);
            
            const relatedResponse = await fetch(relatedUrl);
            if (!relatedResponse.ok) {
              console.error('Error fetching related products:', await relatedResponse.text());
              throw new Error(`Failed to fetch related products: ${relatedResponse.status}`);
            }
            
            const relatedData = await relatedResponse.json();
            // Check if the response has results property (paginated response)
            const relatedProducts = relatedData.results || relatedData;
            // Ensure we're working with an array
            if (Array.isArray(relatedProducts)) {
              setRelatedProducts(relatedProducts.slice(0, 3)); // Get first 3 related products
            } else {
              console.log('Related products response is not an array:', relatedProducts);
              setRelatedProducts([]);
            }
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
            setRelatedProducts([]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        // Try alternative URL
        try {
          console.log('Trying alternative product URL...');
          const altUrl = `https://fitgearhub-backend.onrender.com/api/products/${params.id}/`;
          console.log('Alt product URL:', altUrl);
          
          const altResponse = await fetch(altUrl);
          if (!altResponse.ok) {
            throw new Error(`Alternative product URL failed: ${altResponse.status}`);
          }
          
          const altData = await altResponse.json();
          setProduct(altData);
          setError(null);
          
          // Try to fetch related products
          if (altData.category) {
            try {
              const altRelatedUrl = `https://fitgearhub-backend.onrender.com/api/products/?category=${altData.category.id}&exclude=${params.id}`;
              const altRelatedResponse = await fetch(altRelatedUrl);
              
              if (altRelatedResponse.ok) {
                const altRelatedData = await altRelatedResponse.json();
                const altRelatedProducts = altRelatedData.results || altRelatedData;
                
                if (Array.isArray(altRelatedProducts)) {
                  setRelatedProducts(altRelatedProducts.slice(0, 3));
                }
              }
            } catch (altRelatedError) {
              console.error('Error fetching alternative related products:', altRelatedError);
              setRelatedProducts([]);
            }
          }
        } catch (altErr) {
          console.error('Alternative URL also failed:', altErr);
          setError('Failed to load product. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  // Handle quantity changes with validation
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      alert('Please select a size');
      return;
    }
    try {
      const success = addToCart(product, quantity, selectedSize);
      
      if (success) {
        setAddedToCart(true);
        // No need for alert as we now have visual feedback
        // alert('Item added to cart successfully!');
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="pdp-page">
        <div className="pdp-layout-container">
          <div className="pdp-loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pdp-page">
        <div className="pdp-layout-container">
          <div className="pdp-error">
            {error || 'Product not found'}
          </div>
        </div>
      </div>
    );
  }

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
            {product.category && (
              <>
                <Link href={`/catalog?category=${product.category.id}`}>{product.category.name}</Link>
                <FaChevronRight />
              </>
            )}
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
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImage].image}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="pdp-image"
                    onError={(e) => {
                      console.error("Product image failed to load:", e.target.src);
                      const originalSrc = e.target.src;
                      if (originalSrc.includes("localhost") || !originalSrc.includes("https://")) {
                        // If using localhost URL, try the production URL
                        const fixedUrl = `https://fitgearhub-backend.onrender.com${originalSrc.split('/media')[1]}`;
                        e.target.src = fixedUrl;
                      } else {
                        // Fallback to data URI
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjJweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";
                      }
                    }}
                  />
                ) : (
                  <div className="pdp-no-image">No Image Available</div>
                )}
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="pdp-thumbnail-strip">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`pdp-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image.image}
                      alt={`${product.name} view ${index + 1}`}
                      width={80}
                      height={80}
                      onError={(e) => {
                        console.error("Thumbnail image failed to load:", e.target.src);
                        const originalSrc = e.target.src;
                        if (originalSrc.includes("localhost") || !originalSrc.includes("https://")) {
                          // If using localhost URL, try the production URL
                          const fixedUrl = `https://fitgearhub-backend.onrender.com${originalSrc.split('/media')[1]}`;
                          e.target.src = fixedUrl;
                        } else {
                          // Fallback to data URI
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZWVlZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4cHgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPk5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+";
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pdp-info">
            <div className="pdp-header">
              {product.category && (
                <div className="pdp-category-tag">
                  {product.category.name} {product.subcategory && `/ ${product.subcategory}`}
                </div>
              )}
              <h1 className="pdp-title">{product.name}</h1>
              
              <div className="pdp-meta">
                {product.rating && (
                  <div className="pdp-ratings">
                    <div className="pdp-stars">
                      {renderStars(product.rating)}
                    </div>
                    <span className="pdp-rating-value">{product.rating}</span>
                    <span className="pdp-reviews-count">
                      ({product.reviews_count || 0} reviews)
                    </span>
                  </div>
                )}
                
                <button className="pdp-share-button">
                  <FaShare /> Share
                </button>
              </div>

              <div className="pdp-price">
                ${formatPrice(product.price)}
              </div>
            </div>

            <p className="pdp-description">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
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
            )}

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
              <button 
                className={`pdp-add-to-cart ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {addedToCart ? (
                  <>
                    <FaCheck /> Added to Cart
                  </>
                ) : (
                  <>
                    <FaShoppingCart /> Add to Cart
                  </>
                )}
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
              {/* Use API data if available, otherwise show default specs */}
              {(product.specifications ? Object.entries(product.specifications) : [
                ['Warranty', '2 Years Limited Warranty'],
                ['Shipping', 'Free Shipping (Orders over $100)'],
                ['Returns', '30-Day Easy Returns'],
                ['Support', '24/7 Customer Support'],
                ['Quality', 'Premium Quality Guaranteed'],
                ['Material', 'High-Grade Materials'],
                ['Origin', 'Imported'],
                ['Care Instructions', 'Follow Product Label Instructions']
              ]).map(([key, value], index) => (
                <div key={index} className="pdp-spec-item">
                  <span className="pdp-spec-label">{key}</span>
                  <span className="pdp-spec-value">{value}</span>
                </div>
              ))}
            </div>

            <div className="pdp-features-list">
              <h3>Premium Features</h3>
              <ul>
                {/* Use API data if available, otherwise show default features */}
                {(product.features && product.features.length > 0 ? product.features : [
                  'Premium Quality Materials',
                  'Durable Construction',
                  'Ergonomic Design',
                  'Easy Maintenance',
                  'Versatile Usage',
                  'Modern Aesthetics'
                ]).map((feature, index) => (
                  <li key={index}>
                    <FaCheck /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pdp-related-products">
            <h2>You Might Also Like</h2>
            <div className="pdp-related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  href={`/products/${relatedProduct.id}`} 
                  key={relatedProduct.id} 
                  className="pdp-related-product-card"
                >
                  <div className="pdp-related-product-image">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <Image
                        src={relatedProduct.images[0].image}
                        alt={relatedProduct.name}
                        width={200}
                        height={200}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        onError={(e) => {
                          console.error("Related product image failed to load:", e.target.src);
                          const originalSrc = e.target.src;
                          if (originalSrc.includes("localhost") || !originalSrc.includes("https://")) {
                            // If using localhost URL, try the production URL
                            const fixedUrl = `https://fitgearhub-backend.onrender.com${originalSrc.split('/media')[1]}`;
                            e.target.src = fixedUrl;
                          } else {
                            // Fallback to data URI
                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";
                          }
                        }}
                      />
                    ) : (
                      <div className="pdp-no-image">No Image Available</div>
                    )}
                  </div>
                  <div className="pdp-related-product-info">
                    <h3>{relatedProduct.name}</h3>
                    <div className="pdp-related-product-meta">
                      <span className="pdp-related-product-price">
                        ${formatPrice(relatedProduct.price)}
                      </span>
                      {relatedProduct.rating && (
                        <div className="pdp-related-product-rating">
                          {renderStars(relatedProduct.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Cart Bar (Mobile) */}
      <div className={`pdp-sticky-add-to-cart ${isSticky ? 'visible' : ''}`}>
        <div className="pdp-sticky-product-info">
          <span className="pdp-sticky-product-name">{product.name}</span>
          <span className="pdp-sticky-product-price">${formatPrice(product.price)}</span>
        </div>
        <button 
          className={`pdp-sticky-add-to-cart-btn ${addedToCart ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {addedToCart ? <FaCheck /> : <FaShoppingCart />} 
          {addedToCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
