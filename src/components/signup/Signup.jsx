import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // Redirect after signup
import "../signup/Signup.css";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    uemail: "",
    email: "",
    pass: "",
    conPass: "",
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

    // Check if passwords match
    if (formData.pass !== formData.conPass) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name: formData.uemail,
        email: formData.email,
        password: formData.pass,
      });

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2s
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong!");
    }
  };

  return (
    <Form className="mt-4" onSubmit={handleSubmit}>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      <Form.Group className="position-relative mb-3">
        <input
          type="text"
          className="form-control"
          id="uemail"
          value={formData.uemail}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <FontAwesomeIcon icon={faUser} className="ezy__signup15-icon" />
      </Form.Group>

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
          id="pass"
          value={formData.pass}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <FontAwesomeIcon icon={faLock} className="ezy__signup15-icon" />
      </Form.Group>

      <Form.Group className="position-relative mb-3">
        <input
          type="password"
          className="form-control"
          id="conPass"
          value={formData.conPass}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />
        <FontAwesomeIcon icon={faLock} className="ezy__signup15-icon" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check>
          <input
            className="form-check-input"
            type="checkbox"
            id="terms"
            required
          />
          <label className="form-check-label" htmlFor="terms">
            I agree to the <a href="#!">Terms & Conditions</a>
          </label>
        </Form.Check>
      </Form.Group>

      <Button
        variant=""
        type="submit"
        className="ezy__signup15-btn-submit mt-3"
      >
        Register <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </Form>
  );
};

const Signup15 = () => {
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
                      <a href="/login">I am already a member</a>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={6} lg={5} className="order-1 mt-4 mt-lg-0">
                  <div className="d-flex flex-column h-100 p-2">
                    <h2 className="ezy__signup15-heading">Sign Up</h2>

                    <SignUpForm />
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

export default Signup15;
