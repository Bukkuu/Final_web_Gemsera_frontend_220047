import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import "./productDescription.css";

const ProductDescription = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching product details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId: id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product added to cart successfully!");
    } catch (err) {
      alert(
        "Error adding product to cart: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Number(e.target.value));
    setQuantity(value > (product?.stock || 0) ? product.stock : value);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const handleRatingChange = (e) => {
    const value = Math.max(1, Math.min(5, Number(e.target.value)));
    setReview({ ...review, rating: value });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in to leave a review.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        review,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review submitted successfully!");
      const { data } = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
      setProduct(data);
      setReview({ rating: 0, comment: "" });
    } catch (err) {
      if (
        err.response?.data?.message === "You have already reviewed this product"
      ) {
        alert("You have already reviewed this product.");
      } else {
        alert(
          "Error submitting review: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const userHasReviewed = product?.reviews?.some((review) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;
      return review.user?.toString() === userId;
    } catch (e) {
      console.error("Error parsing token:", e);
      return false;
    }
  });

  if (loading) {
    return (
      <Container
        fluid
        className="ezy__product-desc py-5"
        style={{ padding: 0 }}
      >
        <p className="text-center text-muted animate__fadeIn">
          Loading product details...
        </p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        fluid
        className="ezy__product-desc py-5"
        style={{ padding: 0 }}
      >
        <p className="text-center error-message animate__fadeIn">{error}</p>
      </Container>
    );
  }

  return (
    <Container fluid className="ezy__product-desc py-5" style={{ padding: 0 }}>
      <Row className="justify-content-center g-0 h-100">
        <Col lg={10} className="d-flex justify-content-center">
          <Card
            className="ezy__product-desc-card shadow-lg animate__fadeIn h-100 w-100"
            style={{ maxWidth: "1200px" }}
          >
            <Row className="g-0 h-100">
              <Col
                md={5}
                className="d-flex align-items-center justify-content-center p-0"
              >
                <div className="ezy__product-desc-image">
                  <img
                    src={
                      product.image.startsWith("http")
                        ? product.image
                        : `http://localhost:5000${product.image}`
                    }
                    alt={product.name}
                    className="img-fluid rounded-start"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400?text=Image+Not+Found";
                    }}
                  />
                </div>
              </Col>
              <Col
                md={7}
                className="p-4 d-flex flex-column justify-content-between"
              >
                <div>
                  <h2 className="ezy__product-desc-title">{product.name}</h2>
                  <p className="ezy__product-desc-price">
                    Rs. {product.price.toFixed(2)}
                  </p>
                  <p className="ezy__product-desc-category">
                    Category: {product.category}
                  </p>
                  <p className="ezy__product-desc-stock">
                    {product.stock > 0
                      ? `In Stock: ${product.stock}`
                      : "Out of Stock"}
                  </p>
                  <div className="ezy__product-desc-text">
                    <h5>Description</h5>
                    <p>{product.description || "No description available"}</p>
                  </div>
                </div>
                {product.stock > 0 && (
                  <div className="d-flex align-items-center mt-3">
                    <Form.Label className="text-white me-3">
                      Quantity:
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="ezy__product-desc-quantity"
                    />
                    <Button
                      className="ezy__product-desc-btn ms-3"
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
            <Card.Body className="p-4">
              <h4 className="text-white mb-3">
                Reviews ({product.reviews.length || 0})
              </h4>
              {product.reviews.length === 0 ? (
                <p className="text-muted">No reviews yet.</p>
              ) : (
                product.reviews.map((review, index) => (
                  <div key={index} className="ezy__product-desc-review mb-3">
                    <p className="text-light mb-1">
                      <strong>
                        User{" "}
                        {review.user
                          ? review.user.name || "Anonymous"
                          : "Anonymous"}
                      </strong>{" "}
                      - {review.rating || "N/A"}/5
                    </p>
                    <p className="text-light">
                      {review.comment || "No comment provided"}
                    </p>
                    <hr className="ezy__product-desc-review-separator" />
                  </div>
                ))
              )}
              {token && !userHasReviewed && (
                <div className="mt-4">
                  <h5 className="text-white mb-3">Leave a Review</h5>
                  <Form onSubmit={handleSubmitReview}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-white">
                        Rating (1-5)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="5"
                        value={review.rating}
                        onChange={handleRatingChange}
                        placeholder="Enter rating (1-5)"
                        className="ezy__product-desc-review-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-white">Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="comment"
                        value={review.comment}
                        onChange={handleReviewChange}
                        placeholder="Write your review here..."
                        className="ezy__product-desc-review-input"
                      />
                    </Form.Group>
                    <Button type="submit" className="ezy__product-desc-btn">
                      Submit Review
                    </Button>
                  </Form>
                </div>
              )}
              {userHasReviewed && (
                <p className="text-muted">
                  You have already reviewed this product.
                </p>
              )}
              {!token && (
                <p className="text-muted">Please log in to leave a review.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDescription;
