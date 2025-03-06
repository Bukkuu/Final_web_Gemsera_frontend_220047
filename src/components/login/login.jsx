import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // Redirect after login
import "../signup/Signup.css"; // Keeping existing styles

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Login successful! Redirecting...");
      localStorage.setItem("token", res.data.token); // Store JWT token
      setTimeout(() => {
        window.location.href = "/"; // ✅ Redirect to homepage and force reload
      }, 2000); // Redirect after 2s
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid credentials. Try again!");
    }
  };

  return (
    <Form className="mt-4" onSubmit={handleSubmit}>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      <Form.Group className="position-relative mb-3">
        <input
          type="email"
          className="form-control"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
        />
        <FontAwesomeIcon icon={faEnvelope} className="ezy__signup15-icon" />
      </Form.Group>

      <Form.Group className="position-relative mb-3">
        <input
          type="password"
          className="form-control"
          id="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <FontAwesomeIcon icon={faLock} className="ezy__signup15-icon" />
      </Form.Group>

      <Button
        variant=""
        type="submit"
        className="ezy__signup15-btn-submit mt-3"
      >
        Login <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </Form>
  );
};

const Login15 = () => {
  return (
    <section className="ezy__signup15 gray d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <div className="ezy__signup15-form-card p-4 p-lg-5">
              <Row className="justify-content-between">
                <Col xs={12} md={6} className="order-2">
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 mt-5 mt-lg-0">
                    <img
                      src="https://cdn.easyfrontend.com/pictures/sign-in-up/abstract1.png"
                      alt=""
                    />
                    <div className="text-center mt-5">
                      <a href="/register">I don't have an account</a>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={6} lg={5} className="order-1 mt-4 mt-lg-0">
                  <div className="d-flex flex-column h-100 p-2">
                    <h2 className="ezy__signup15-heading">Login</h2>

                    <LoginForm />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login15;
