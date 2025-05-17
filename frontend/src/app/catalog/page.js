'use client';

import './catalog.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import CatalogNav from '../components/CatalogNav';
import SkeletonCatalog from './skeleton/skeletoncatalog';
import Link from 'next/link';

// Detect environment and set API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? `http://${window.location.hostname}:8000/api`
    : 'https://fitgearhub-backend.onrender.com/api');

console.log('Using API URL:', API_BASE_URL); // Add this for debugging

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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from:', `${API_BASE_URL}/categories/`);
        const response = await fetch(`${API_BASE_URL}/categories/`, {
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
        setError('Failed to load categories. Please try again later.');
        setCategories([]);
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
        setError('Failed to load products. Please try again later.');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [activeFilters, searchParams]);

  // Function to add item to cart
  const addToCart = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add_item/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to add item to cart');
      }
      
      alert('Item added to cart successfully!');
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
                  <button className="fitgear-catalog-action-button" onClick={(e) => {
                    e.preventDefault();
                    addToCart(product.id);
                  }}>
                    <FaShoppingCart />
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
                  <div className="fitgear-catalog-product-price">${product.price}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}