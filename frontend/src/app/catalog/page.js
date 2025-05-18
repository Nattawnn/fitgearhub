'use client';

import './catalog.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaHeart, FaShoppingCart, FaCheck } from 'react-icons/fa';
import CatalogNav from '../components/CatalogNav';
import SkeletonCatalog from './skeleton/skeletoncatalog';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

// Detect environment and set API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? `http://${window.location.hostname}:8000/api`
    : 'https://fitgearhub-backend.onrender.com/api');

// Set media base URL
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? `http://${window.location.hostname}:8000`
    : 'https://fitgearhub-backend.onrender.com');

// Add debugging for API URL
console.log('Using API URL:', API_BASE_URL);
console.log('Using Media URL:', MEDIA_BASE_URL);

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    subcategory: null,
    item: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [activeImageIndexes, setActiveImageIndexes] = useState({});
  const [addedProducts, setAddedProducts] = useState({});
  
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  
  // Helper function to format price
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

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

  // Reset added animation after timeout
  useEffect(() => {
    const timeouts = Object.keys(addedProducts).map(id => {
      if (addedProducts[id]) {
        return setTimeout(() => {
          setAddedProducts(prev => ({
            ...prev,
            [id]: false
          }));
        }, 2000);
      }
      return null;
    }).filter(Boolean);
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [addedProducts]);

  // Fetch categories with better error handling
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fullUrl = `${API_BASE_URL}/categories/`;
        console.log('Fetching categories from:', fullUrl);
        
        const response = await fetch(fullUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const data = await response.json();
        console.log('Categories data:', data);
        setCategories(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Try alternative API URL if the main one fails
        try {
          console.log('Trying alternative URL...');
          const altUrl = 'https://fitgearhub-backend.onrender.com/api/categories/';
          console.log('Alt URL:', altUrl);
          
          const altResponse = await fetch(altUrl, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          
          if (!altResponse.ok) {
            throw new Error(`Alternative URL failed: ${altResponse.status}`);
          }
          
          const altData = await altResponse.json();
          console.log('Alt categories data:', altData);
          setCategories(Array.isArray(altData) ? altData : []);
          setError(null);
        } catch (altError) {
          console.error('Alternative URL also failed:', altError);
          setError('Failed to load categories. Please try again later.');
          setCategories([]);
        }
      }
    };

    fetchCategories();
  }, []);
  
  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let url = `${API_BASE_URL}/products/`;
        const params = new URLSearchParams();
        
        if (activeFilters.category) {
          params.append('category', activeFilters.category);
        }
        
        if (searchParams.get('search')) {
          params.append('search', searchParams.get('search'));
        }
        
        params.append('ordering', '-created_at');
        
        const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;
        console.log('Fetching products from:', finalUrl);
        
        const response = await fetch(finalUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products data:', data);
        
        // Handle both array and paginated responses
        const productsList = Array.isArray(data) ? data : (data.results || []);
        setProducts(productsList);
        setFilteredProducts(productsList);
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Try alternative API URL if the main one fails
        try {
          console.log('Trying alternative products URL...');
          let altUrl = 'https://fitgearhub-backend.onrender.com/api/products/';
          const params = new URLSearchParams();
          
          if (activeFilters.category) {
            params.append('category', activeFilters.category);
          }
          
          if (searchParams.get('search')) {
            params.append('search', searchParams.get('search'));
          }
          
          params.append('ordering', '-created_at');
          
          const altFinalUrl = `${altUrl}${params.toString() ? `?${params.toString()}` : ''}`;
          console.log('Alt products URL:', altFinalUrl);
          
          const altResponse = await fetch(altFinalUrl, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          
          if (!altResponse.ok) {
            throw new Error(`Alternative products URL failed: ${altResponse.status}`);
          }
          
          const altData = await altResponse.json();
          const altProductsList = Array.isArray(altData) ? altData : (altData.results || []);
          setProducts(altProductsList);
          setFilteredProducts(altProductsList);
          setError(null);
        } catch (altError) {
          console.error('Alternative products URL also failed:', altError);
          setError('Failed to load products. Please try again later.');
          setProducts([]);
          setFilteredProducts([]);
        } finally {
          setIsLoading(false);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [activeFilters, searchParams]);

  // Function to add item to cart
  const handleAddToCart = (product) => {
    try {
      const success = addToCart(product, 1);
      
      if (success) {
        // Set added animation state
        setAddedProducts(prev => ({
          ...prev,
          [product.id]: true
        }));
        
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

  // Get filter text for display
  const getFilterText = () => {
    if (activeFilters.item) return activeFilters.item;
    if (activeFilters.subcategory) return activeFilters.subcategory;
    if (activeFilters.category) return activeFilters.category;
    return 'Premium Fitness Gear';
  };

  // Add this function to handle image hover
  const handleImageHover = (productId, imageIndex) => {
    setActiveImageIndexes(prev => ({
      ...prev,
      [productId]: imageIndex
    }));
  };

  // Add this function to handle mouse leave
  const handleImageLeave = (productId) => {
    setActiveImageIndexes(prev => ({
      ...prev,
      [productId]: 0
    }));
  };

  if (isLoading) {
    return <SkeletonCatalog />;
  }

  if (error) {
    return (
      <div className="fitgear-catalog-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
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
        <CatalogNav categories={categories} />
        
        <div className="fitgear-catalog-products-grid">
          {filteredProducts.map(product => (
            <Link href={`/products/${product.id}`} key={product.id} className="fitgear-catalog-product-card">
              <div className="fitgear-catalog-product-image-container"
                   onMouseLeave={() => handleImageLeave(product.id)}>
                {product.images && product.images.length > 0 ? (
                  <>
                    <img 
                      src={product.images[activeImageIndexes[product.id] || 0].image}
                      alt={product.name} 
                      className="fitgear-catalog-product-image"
                      onError={(e) => {
                        console.error("Image failed to load:", e.target.src);
                        // Replace placeholder.com with data URI
                        const originalSrc = e.target.src;
                        try {
                          if (originalSrc.includes("localhost") || !originalSrc.includes("https://")) {
                            // Extract path after /media/ if it exists
                            if (originalSrc.includes('/media/')) {
                              const mediaPath = originalSrc.split('/media/')[1];
                              const fixedUrl = `${MEDIA_BASE_URL}/media/${mediaPath}`;
                              console.log("Trying fixed URL:", fixedUrl);
                              e.target.src = fixedUrl;
                            } else {
                              throw new Error("Cannot fix URL - no media path");
                            }
                          } else {
                            throw new Error("Using fallback image");
                          }
                        } catch (err) {
                          console.log("Using fallback image:", err.message);
                          // Fallback to data URI instead of placeholder.com
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMThweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";
                        }
                      }}
                    />
                    {product.images.length > 1 && (
                      <div className="fitgear-catalog-product-thumbnails">
                        {product.images.slice(1, 4).map((img, index) => (
                          <img
                            key={index}
                            src={img.image}
                            alt={`${product.name} thumbnail ${index + 2}`}
                            className="fitgear-catalog-thumbnail"
                            onMouseEnter={() => handleImageHover(product.id, index + 1)}
                            onError={(e) => {
                              // Similar error handling for thumbnails
                              const originalSrc = e.target.src;
                              try {
                                if (originalSrc.includes("localhost") || !originalSrc.includes("https://")) {
                                  // Extract path after /media/ if it exists
                                  if (originalSrc.includes('/media/')) {
                                    const mediaPath = originalSrc.split('/media/')[1];
                                    const fixedUrl = `${MEDIA_BASE_URL}/media/${mediaPath}`;
                                    console.log("Trying fixed thumbnail URL:", fixedUrl);
                                    e.target.src = fixedUrl;
                                  } else {
                                    throw new Error("Cannot fix thumbnail URL - no media path");
                                  }
                                } else {
                                  throw new Error("Using fallback thumbnail");
                                }
                              } catch (err) {
                                console.log("Using fallback thumbnail:", err.message);
                                // Fallback to data URI instead of placeholder.com
                                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTBweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+Tm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";
                              }
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="fitgear-catalog-product-image-placeholder">
                    No Image Available
                  </div>
                )}
                
                <div className="fitgear-catalog-quick-actions">
                  <button className="fitgear-catalog-action-button" onClick={(e) => {
                    e.preventDefault();
                    // Add to wishlist functionality
                  }}>
                    <FaHeart />
                  </button>
                  <button 
                    className={`fitgear-catalog-action-button ${addedProducts[product.id] ? 'added' : ''}`} 
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                  >
                    {addedProducts[product.id] ? <FaCheck /> : <FaShoppingCart />}
                  </button>
                </div>
              </div>
              
              <div className="fitgear-catalog-product-info">
                {product.category && (
                  <div className="fitgear-catalog-product-category">{product.category.name}</div>
                )}
                <h3 className="fitgear-catalog-product-title">{product.name}</h3>
                
                <p className="fitgear-catalog-product-description">{product.description}</p>
                
                <div className="fitgear-catalog-stock-indicator">
                  {product.stock <= 5 ? (
                    <span className="fitgear-catalog-low-stock">Only {product.stock} left in stock</span>
                  ) : (
                    <span className="fitgear-catalog-in-stock">In Stock</span>
                  )}
                </div>
                
                <div className="fitgear-catalog-product-footer">
                  <div className="fitgear-catalog-product-price">${formatPrice(product.price)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}