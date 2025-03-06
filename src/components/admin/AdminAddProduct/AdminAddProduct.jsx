import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminAddProduct.css"; // Ensure this CSS file is updated below

const AdminAddProduct = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  // Fixed Categories
  const CATEGORIES = ["Gold", "AD", "Diamond", "Indian"];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: CATEGORIES[0], // Default to the first category
    stock: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // Preview image
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Unauthorized: Please login as admin.");
      return;
    }

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
      await axios.post(
        "http://localhost:5000/api/products",
        formDataObj,
        config
      );
      setMessage("✅ Product added successfully!");
      setImagePreview(null); // Reset image preview after submission
      setTimeout(() => {
        window.location.reload(); // Reload the page after 2 seconds
      }, 2000);
    } catch (error) {
      setMessage("❌ Error adding product. Please try again.");
    }
  };

  return (
    <div className="admin-product-container">
      <div className="admin-product-form animate__fadeIn">
        <h2>Add New Product</h2>
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
              placeholder="Enter product name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter product description"
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
              placeholder="Enter price in Rs."
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity</label>
            <input
              type="number"
              id="stock"
              name="stock"
              placeholder="Enter stock quantity"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="image-preview animate__fadeIn">
              <p>Image Preview:</p>
              <img src={imagePreview} alt="Preview" className="preview-image" />
            </div>
          )}

          <button type="submit" className="submit-button animate__fadeIn">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
