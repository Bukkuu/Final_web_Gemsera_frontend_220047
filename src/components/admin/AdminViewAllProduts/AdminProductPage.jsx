import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminProductPage.css"; // Ensure this CSS file is updated below

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [message, setMessage] = useState(""); // Added message state
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fixed Categories
  const CATEGORIES = ["Gold", "AD", "Diamond", "Indian"];

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data);
    } catch (err) {
      setError("Error fetching products: " + err.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      fetchProducts();
    }
  }, [navigate, token, fetchProducts]);

  const handleEdit = (id) => {
    setEditProductId(id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Product deleted successfully!");
        fetchProducts(); // Refresh the product list
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      } catch (error) {
        setMessage("❌ Error deleting product: " + error.message);
      }
    }
  };

  return (
    <div className="admin-product-container">
      {editProductId ? (
        <AdminEditProduct
          productId={editProductId}
          setEditProductId={setEditProductId}
          fetchProducts={fetchProducts}
          categories={CATEGORIES}
        />
      ) : (
        <div className="admin-product-list animate__fadeIn">
          <h2>Manage Products</h2>
          {loading && <p className="loading-text">Loading products...</p>}
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price (Rs.)</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="product-image"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>Rs. {product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(product._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AdminEditProduct = ({
  productId,
  setEditProductId,
  fetchProducts,
  categories,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: categories[0], // Default to the first category
    stock: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // Fetch product function
  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ ...data, image: null });
      setImagePreview(`http://localhost:5000${data.image}`); // Add backend URL
    } catch (error) {
      setMessage("Error fetching product details: " + error.message);
    }
  }, [productId, token]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // Preview new image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const formDataObj = new FormData();
    for (let key in formData) {
      formDataObj.append(key, formData[key]);
    }
    try {
      await axios.put(
        `http://localhost:5000/api/products/${productId}`,
        formDataObj,
        config
      );
      setMessage("✅ Product updated successfully!");
      fetchProducts(); // Refresh the product list
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      setEditProductId(null); // Close the edit form
    } catch (error) {
      setMessage("❌ Error updating product: " + error.message);
    }
  };

  return (
    <div className="admin-product-form animate__fadeIn">
      <h2>Edit Product</h2>
      {message && (
        <p
          className={
            message.includes("✅") ? "success-message" : "error-message"
          }
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="price">Price (Rs.)</label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price in Rs."
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock Quantity</label>
          <input
            type="number"
            id="stock"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        {imagePreview && (
          <div className="image-preview animate__fadeIn">
            <p>Image Preview:</p>
            <img
              src={
                imagePreview.startsWith("blob:")
                  ? imagePreview
                  : `http://localhost:5000${imagePreview}`
              }
              alt="Preview"
              className="preview-image"
            />
          </div>
        )}
        <div className="button-group">
          <button type="submit" className="submit-button animate__fadeIn">
            Update Product
          </button>
          <button
            type="button"
            onClick={() => setEditProductId(null)}
            className="cancel-button animate__fadeIn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductPage;
