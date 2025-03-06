import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Prepend the backend URL to the image path
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `http://localhost:5000${product.image}`;

  // Calculate average rating
  const averageRating =
    product.reviews && product.reviews.length > 0
      ? (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : "N/A";

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found in localStorage!");
      setMessage("Please log in to add items to the cart.");
      return;
    }

    console.log("✅ Token being sent:", token);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Response from backend:", response.data);
      setMessage("Added to cart successfully!");
    } catch (error) {
      console.error(
        "❌ Error adding to cart:",
        error.response?.data || error.message
      );
      setMessage("Failed to add to cart. Please try again.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const handleViewDetails = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x300?text=Image+Not+Found";
          }}
        />
      </div>
      <div className="product-info">
        <div className="product-details">
          <span className="product-title">{product.name}</span>
          <span className="product-price">Rs. {product.price.toFixed(2)}</span>
        </div>
        <div className="product-rating">
          <span>
            Rating: {averageRating}/5 ({product.reviews?.length || 0} reviews)
          </span>
        </div>
        <div className="product-actions">
          <button className="btn view-btn" onClick={handleViewDetails}>
            View Details
          </button>
          <button className="btn cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      {message && (
        <p
          className={`cart-message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ProductCard;
