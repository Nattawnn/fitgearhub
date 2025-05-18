'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './adminproducts.css';

export default function AdminProducts() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    images: []
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: ''
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // API base URL detection
  const isProduction = 
    typeof window !== 'undefined' && 
    (window.location.hostname.includes('render.com') || 
     window.location.hostname === 'fitgearhub-frontend.onrender.com');
  
  // API base URL with correct paths
  const API_BASE_URL = isProduction
    ? 'https://fitgearhub-backend.onrender.com'
    : 'http://localhost:8000';
  
  // Specific endpoint paths
  const PRODUCTS_API = `${API_BASE_URL}/api/products/`;
  const CATEGORIES_API = `${API_BASE_URL}/api/categories/`;

  useEffect(() => {
    console.log('Is production environment:', isProduction);
    console.log('Using API URL:', API_BASE_URL);
    console.log('Products endpoint:', PRODUCTS_API);
    console.log('Categories endpoint:', CATEGORIES_API);
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from:', PRODUCTS_API);
      const response = await fetch(PRODUCTS_API, {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      console.log('Products data:', data);
      
      // Ensure products is always an array
      setProducts(Array.isArray(data) ? data : (data.results || []));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error loading products. Please try again.');
      setProducts([]);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from:', CATEGORIES_API);
      const response = await fetch(CATEGORIES_API, {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      
      // Ensure categories is always an array
      const categoriesArray = Array.isArray(data) ? data : (data.results || []);
      console.log('Categories data:', categoriesArray);
      setCategories(categoriesArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Error loading categories. Please try again.');
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!categoryFormData.name) {
      setError('Category name is required');
      return;
    }

    try {
      console.log('Creating category with data:', categoryFormData);
      const response = await fetch(CATEGORIES_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(categoryFormData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        
        let errorMessage = 'Failed to create category';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          // If parsing fails, use the status text
          errorMessage = `Failed to create category: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess('Category created successfully!');
      setCategoryFormData({ name: '' });
      fetchCategories(); // Refresh the categories list
      setShowCategoryForm(false);
    } catch (error) {
      console.error('Error creating category:', error);
      setError(error.message || 'Error creating category. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category?.id || '',
      images: []
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${PRODUCTS_API}${productId}/`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to delete product';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = `Failed to delete product: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setSuccess('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message || 'Error deleting product. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('stock', formData.stock);
      
      if (formData.category_id) {
        productData.append('category_id', formData.category_id);
      }
      
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          productData.append('uploaded_images', image);
        });
      }

      const url = editingProduct 
        ? `${PRODUCTS_API}${editingProduct.id}/`
        : PRODUCTS_API;
      
      const method = editingProduct ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: productData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to ${editingProduct ? 'update' : 'create'} product`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = `Failed to ${editingProduct ? 'update' : 'create'} product: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess(`Product ${editingProduct ? 'updated' : 'created'} successfully!`);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error submitting product:', error);
      setError(error.message || `Error ${editingProduct ? 'updating' : 'creating'} product. Please try again.`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      images: []
    });
    setPreviewUrl('');
    setShowForm(false);
    setEditingProduct(null);
  };

  const deleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${CATEGORIES_API}${categoryId}/`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        
        let errorMessage = 'Failed to delete category';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = `Failed to delete category: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      setSuccess('Category deleted successfully!');
      fetchCategories(); // Refresh the categories list
      fetchProducts();  // Refresh products as they might be affected
    } catch (error) {
      console.error('Error deleting category:', error);
      setError(error.message || 'Error deleting category. Please try again.');
    }
  };

  return (
    <div className="admin-products-page">
      <header className="admin-products-header">
        <h1>Product Management</h1>
        <div className="admin-products-header-buttons">
          <button 
            className="admin-products-add-btn admin-products-add-category-btn" 
            onClick={() => {
              setShowCategoryForm(!showCategoryForm);
              if (showForm) setShowForm(false);
            }}
          >
            {showCategoryForm ? 'Cancel' : 'Add Category'}
          </button>
          <button 
            className="admin-products-add-btn admin-products-add-product-btn" 
            onClick={() => {
              setShowForm(!showForm);
              if (showCategoryForm) setShowCategoryForm(false);
            }}
          >
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>
      </header>

      {error && <div className="admin-products-error-message">{error}</div>}
      {success && <div className="admin-products-success-message">{success}</div>}

      {/* Backend connection status */}
      <div className="admin-products-api-status">
        {isProduction ? (
          <p className="admin-products-info-message">Using production API at {API_BASE_URL}</p>
        ) : (
          <p className="admin-products-info-message">Using development API at {API_BASE_URL}</p>  
        )}
      </div>

      {showCategoryForm && (
        <div className="admin-products-form-container">
          <h2>Create New Category</h2>
          <form onSubmit={createCategory} className="admin-products-form">
            <div className="admin-products-form-group">
              <label htmlFor="category-name">Category Name*</label>
              <input 
                type="text" 
                id="category-name" 
                name="name" 
                value={categoryFormData.name}
                onChange={handleCategoryChange}
                required
              />
            </div>
            
            <div className="admin-products-form-actions">
              <button type="button" onClick={() => setShowCategoryForm(false)} className="admin-products-cancel-btn">
                Cancel
              </button>
              <button type="submit" className="admin-products-submit-btn">
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category List */}
      <div className="admin-products-categories-section">
        <h2>Current Categories</h2>
        {categories.length > 0 ? (
          <div className="admin-products-categories-chips">
            {categories.map(category => (
              <div key={category.id} className="admin-products-category-chip">
                {category.name}
                <button
                  className="admin-products-category-delete-btn"
                  onClick={() => deleteCategory(category.id)}
                  title="Delete category"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="admin-products-no-categories">No categories found. Please add some categories first.</p>
        )}
      </div>

      {showForm && (
        <div className="admin-products-form-container">
          <h2>{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
          <form onSubmit={handleSubmit} className="admin-products-form">
            <div className="admin-products-form-group">
              <label htmlFor="name">Product Name*</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-products-form-group">
              <label htmlFor="description">Description*</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
              ></textarea>
            </div>

            <div className="admin-products-form-row">
              <div className="admin-products-form-group">
                <label htmlFor="price">Price (THB)*</label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  value={formData.price}
                  onChange={handleChange}
                  min="0" 
                  step="0.01"
                  required
                />
              </div>

              <div className="admin-products-form-group">
                <label htmlFor="stock">Stock*</label>
                <input 
                  type="number" 
                  id="stock" 
                  name="stock" 
                  value={formData.stock}
                  onChange={handleChange}
                  min="0" 
                  required
                />
              </div>
            </div>

            <div className="admin-products-form-group">
              <label htmlFor="category_id">Category</label>
              <select 
                id="category_id" 
                name="category_id" 
                value={formData.category_id}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="admin-products-field-hint">
                  No categories available. Please add a category first.
                </p>
              )}
            </div>

            <div className="admin-products-form-group">
              <label htmlFor="images">Product Images (Up to 4 images)</label>
              <input 
                type="file" 
                id="images" 
                name="images"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files.length > 4) {
                    setError('You can only upload up to 4 images');
                    return;
                  }
                  setFormData({
                    ...formData,
                    images: files
                  });
                  const previewUrls = files.map(file => URL.createObjectURL(file));
                  setPreviewUrl(previewUrls);
                }}
                accept="image/*"
                multiple
                max="4"
              />
              {previewUrl && previewUrl.length > 0 && (
                <div className="admin-products-images-preview-container">
                  {Array.isArray(previewUrl) ? 
                    previewUrl.map((url, index) => (
                      <div key={index} className="admin-products-image-preview">
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          onError={(e) => {
                            console.error("Preview image failed to load:", e.target.src);
                            // For previews, use a simple data URI as fallback
                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTJweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+UHJldmlldyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                          }}
                        />
                      </div>
                    )) : 
                    <div className="admin-products-image-preview">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        onError={(e) => {
                          console.error("Preview image failed to load:", e.target.src);
                          // For previews, use a simple data URI as fallback
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTJweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+UHJldmlldyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                        }}
                      />
                    </div>
                  }
                </div>
              )}
            </div>

            <div className="admin-products-form-actions">
              <button type="button" onClick={resetForm} className="admin-products-cancel-btn">
                Cancel
              </button>
              <button type="submit" className="admin-products-submit-btn">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-products-list">
        <h2>Current Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.images && product.images.length > 0 ? (
                      <div className="admin-products-images-container">
                        {product.images.map((imageObj, index) => (
                          <img 
                            key={index}
                            src={imageObj.image} 
                            alt={`${product.name} - Image ${index + 1}`} 
                            className="admin-products-thumbnail"
                            onError={(e) => {
                              console.error("Admin product image failed to load:", e.target.src);
                              const originalSrc = e.target.src;
                              if (originalSrc.includes("localhost") || !originalSrc.includes("https://")) {
                                // If using localhost URL, try the production URL
                                const fixedUrl = `https://fitgearhub-backend.onrender.com${originalSrc.split('/media')[1]}`;
                                e.target.src = fixedUrl;
                              } else {
                                // Fallback to data URI
                                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZWVlZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4cHgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                              }
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="admin-products-no-image">No Image</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>฿{parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>{product.category ? product.category.name : 'Uncategorized'}</td>
                  <td className="admin-products-actions-cell">
                    <button 
                      className="admin-products-edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="admin-products-delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="admin-products-no-products">No products found. Add your first product!</p>
        )}
      </div>
    </div>
  );
}