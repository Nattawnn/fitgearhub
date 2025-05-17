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
    image: null
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: ''
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/categories/`);
      if (!response.ok) throw new Error('Failed to fetch categories');
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
      const response = await fetch(`${API_BASE_URL}/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create category');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form validation
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
      
      if (formData.image) {
        productData.append('image', formData.image);
      }

      console.log('Submitting product with data:', Object.fromEntries(productData));

      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        body: productData,
      });

      if (!response.ok) {
        console.error('Error response:', response);
        const errorText = await response.text();
        console.error('Error text:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`Failed to create product: ${response.status} ${response.statusText}`);
        }
        
        throw new Error(errorData.detail || 'Failed to create product');
      }

      const data = await response.json();
      setSuccess('Product created successfully!');
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message || 'Error creating product. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      image: null
    });
    setPreviewUrl('');
    setShowForm(false);
  };

  return (
    <div className="admin-products-page">
      <header className="admin-header">
        <h1>Product Management</h1>
        <div className="admin-header-buttons">
          <button 
            className="add-category-btn" 
            onClick={() => {
              setShowCategoryForm(!showCategoryForm);
              if (showForm) setShowForm(false);
            }}
          >
            {showCategoryForm ? 'Cancel' : 'Add Category'}
          </button>
          <button 
            className="add-product-btn" 
            onClick={() => {
              setShowForm(!showForm);
              if (showCategoryForm) setShowCategoryForm(false);
            }}
          >
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showCategoryForm && (
        <div className="product-form-container">
          <h2>Create New Category</h2>
          <form onSubmit={createCategory} className="product-form">
            <div className="form-group">
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
            
            <div className="form-actions">
              <button type="button" onClick={() => setShowCategoryForm(false)} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category List */}
      <div className="categories-list-section">
        <h2>Current Categories</h2>
        {categories.length > 0 ? (
          <div className="categories-chips">
            {categories.map(category => (
              <div key={category.id} className="category-chip">
                {category.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-categories">No categories found. Please add some categories first.</p>
        )}
      </div>

      {showForm && (
        <div className="product-form-container">
          <h2>Create New Product</h2>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
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

            <div className="form-group">
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

            <div className="form-row">
              <div className="form-group">
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

              <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="category_id">Category</label>
              <select 
                id="category_id" 
                name="category_id" 
                value={formData.category_id}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) && categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="field-hint">
                  No categories available. Please add a category first.
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="image">Product Image</label>
              <input 
                type="file" 
                id="image" 
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Create Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-list">
        <h2>Current Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          <table className="products-table">
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
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="product-thumbnail"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>฿{parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>{product.category ? product.category.name : 'Uncategorized'}</td>
                  <td className="actions-cell">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-products">No products found. Add your first product!</p>
        )}
      </div>
    </div>
  );
}