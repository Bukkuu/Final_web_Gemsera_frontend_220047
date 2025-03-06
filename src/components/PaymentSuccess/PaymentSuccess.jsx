import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Alert,
  ListGroup,
  Button,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // To fetch cart data from your backend
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch order data from the cart API
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store the auth token in localStorage
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch cart data from your backend
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Transform the cart data to match the order structure (assuming cart contains products with id, name, quantity, price, and image)
        const cartItems = response.data.items || []; // Adjust based on your API response structure
        const formattedOrders = cartItems.map((item) => ({
          id: item.productId || item._id, // Adjust based on your API response
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image.startsWith("http")
            ? item.image
            : `http://localhost:5000${item.image}`, // Prepend backend URL to image path
        }));

        setOrders(formattedOrders);
      } catch (err) {
        setError("Error fetching order details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleBackToHome = () => {
    navigate("/"); // Redirect to homepage
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="ezy__loading">Loading order details...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="ezy__payment-success py-3">
      {" "}
      {/* Reduced padding */}
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="text-center ezy__success-content">
            <div className="ezy__checkmark mb-2">✓</div> {/* Reduced margin */}
            <h2 className="ezy__success-title mb-3">
              Payment Successful!
            </h2>{" "}
            {/* Reduced margin */}
            <p className="ezy__success-text mb-4">
              Thank you for your purchase. Your payment has been processed
              successfully.
            </p>
            {orders.length > 0 ? (
              <ListGroup className="ezy__order-list mt-3">
                {orders.map((order) => (
                  <ListGroup.Item
                    key={order.id}
                    className="ezy__order-item py-2 px-4"
                  >
                    {" "}
                    {/* Reduced padding */}
                    <Row className="align-items-center g-1">
                      {" "}
                      {/* Reduced gutter */}
                      <Col xs={4} className="p-0">
                        <div className="ezy__order-image-container">
                          <Image
                            src={order.image}
                            alt={order.name}
                            fluid
                            rounded
                            className="ezy__order-image"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/150?text=Image+Not+Found";
                            }}
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                            }} // Fixed size with cover
                          />
                        </div>
                      </Col>
                      <Col xs={8}>
                        <div className="ezy__order-details-container">
                          <div className="ezy__order-name mb-1">
                            {" "}
                            {/* Reduced margin */}
                            {order.name}
                          </div>
                          <div className="ezy__order-info">
                            <span className="ezy__order-quantity me-2">
                              {" "}
                              {/* Reduced margin */}
                              Quantity: {order.quantity}
                            </span>
                            <span className="ezy__order-price">
                              Price: Rs. {order.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="ezy__no-orders mt-3">
                No orders found in your cart.
              </p>
              //   {/* Reduced margin */}
            )}
            <Button
              variant="primary"
              onClick={handleBackToHome}
              className="mt-3 ezy__continue-btn" // Reduced margin
            >
              Back to Home
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSuccess;
