import React, { useState, useEffect } from "react";
import "./categories.css";
import ProductCard from "../../common/ProductCard/ProductCard"; // Ensure the path is correct

export const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products by default
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (category = null) => {
    setLoading(true);
    setError(null);
    try {
      let url = "http://localhost:5000/api/products";
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError("Error fetching products: " + err.message);
    }
    setLoading(false);
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  return (
    <section className="ezy__epcategory10 dark-gray">
      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-12 mt-5">
            <div
              id="ezy__epcategory10-controls"
              className="carousel slide position-relative"
              data-ride="carousel"
            >
              <div className="carousel-inner position-relative overflow-visible">
                <div className="carousel-item active">
                  <div className="row">
                    {/* AD Earrings Button */}
                    <div className="col-12 col-md-6 col-lg-3 my-5">
                      <a
                        href="#!"
                        className={`ezy__epcategory10-item rounded-pill ${
                          selectedCategory === "AD" ? "active" : ""
                        }`}
                        onClick={() => handleCategoryClick("AD")}
                      >
                        <div className="ezy__epcategory10-img">
                          <img src="./ad.png" alt="AD Earrings" />
                        </div>
                        <h4 className="mb-4 fw-bold">AD Earrings</h4>
                      </a>
                    </div>

                    {/* Diamond Earrings Button */}
                    <div className="col-12 col-md-6 col-lg-3 my-5">
                      <a
                        href="#!"
                        className={`ezy__epcategory10-item rounded-pill ${
                          selectedCategory === "Diamond" ? "active" : ""
                        }`}
                        onClick={() => handleCategoryClick("Diamond")}
                      >
                        <div className="ezy__epcategory10-img">
                          <img src="./di.png" alt="Diamond Earrings" />
                        </div>
                        <h4 className="mb-4 fw-bold">Diamond Earrings</h4>
                      </a>
                    </div>

                    {/* Gold Earrings Button */}
                    <div className="col-12 col-md-6 col-lg-3 my-5">
                      <a
                        href="#!"
                        className={`ezy__epcategory10-item rounded-pill ${
                          selectedCategory === "Gold" ? "active" : ""
                        }`}
                        onClick={() => handleCategoryClick("Gold")}
                      >
                        <div className="ezy__epcategory10-img">
                          <img src="./go.png" alt="Gold Earrings" />
                        </div>
                        <h4 className="mb-4 fw-bold">Gold Earrings</h4>
                      </a>
                    </div>

                    {/* Indian Earrings Button */}
                    <div className="col-12 col-md-6 col-lg-3 my-5">
                      <a
                        href="#!"
                        className={`ezy__epcategory10-item rounded-pill ${
                          selectedCategory === "Indian" ? "active" : ""
                        }`}
                        onClick={() => handleCategoryClick("Indian")}
                      >
                        <div className="ezy__epcategory10-img">
                          <img src="./in.png" alt="Indian Earrings" />
                        </div>
                        <h4 className="mb-4 fw-bold">Indian Earrings</h4>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="carousel-control-prev ezy__epcategory10-arrow-left"
                type="button"
                data-bs-target="#ezy__epcategory10-controls"
                data-bs-slide="prev"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                className="carousel-control-next ezy__epcategory10-arrow-right"
                type="button"
                data-bs-target="#ezy__epcategory10-controls"
                data-bs-slide="next"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Display Products */}
      <div className="container mt-5">
        <h2 className="mb-4">
          {selectedCategory ? `${selectedCategory} Earrings` : "All Earrings"}
        </h2>
        {loading && <p>Loading products...</p>}
        {error && <p className="error">{error}</p>}
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="col-12 col-md-6 col-lg-3 my-3" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p>No products found in this category.</p>
          )}
        </div>
      </div>
    </section>
  );
};
