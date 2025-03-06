import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import TopRatedProductCard from "../../common/ProductCard/ProductCard";
import "./topRatedProducts.css";

const TopRatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");

        const productsWithRatings = data.map((product) => {
          const totalRatings = product.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const averageRating =
            product.reviews.length > 0
              ? totalRatings / product.reviews.length
              : 0;
          return { ...product, averageRating };
        });

        const sortedProducts = productsWithRatings.sort(
          (a, b) => b.averageRating - a.averageRating
        );

        setProducts(sortedProducts);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching top rated products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedProducts();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center ezy__loading-container">
        <Spinner animation="border" role="status" className="ezy__spinner">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2 ezy__loading-text">Loading top rated products...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center ezy__error-container">
        <p className="ezy__error-text">{error}</p>
      </Container>
    );
  }

  return (
    <Container fluid className="ezy__top-rated ezy__top-rated-bg py-5">
      <div className="ezy__header mb-5">
        <h2 className="ezy__title">Top Rated Products</h2>
        <p className="ezy__subtitle">Discover our highest-rated items</p>
      </div>
      <Row xs={1} md={2} lg={3} xl={4} className="g-4 ezy__product-grid">
        {products.map((product) => (
          <Col
            key={product._id}
            className="ezy__product-col d-flex justify-content-center"
          >
            <TopRatedProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TopRatedProducts;
