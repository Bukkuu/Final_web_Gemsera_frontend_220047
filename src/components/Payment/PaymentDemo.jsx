import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { Button, Container, Row, Col, Alert } from "react-bootstrap";
import "./PaymentDemo.css";
// payment
const stripePromise = loadStripe(
  "pk_test_51Qy9TFICDuzmFrlVIFbeDOoHj8e6fHSQlnYw3KdeDJPJHaDgRvuM0C5jR9rryMkrUxhatYPhJijRIN59Jb1qFeRn00lLB4mzmW"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // If there is a client secret in the URL (after a redirect), check the payment status.
  useEffect(() => {
    const urlClientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (urlClientSecret && stripe) {
      stripe
        .retrievePaymentIntent(urlClientSecret)
        .then(({ paymentIntent }) => {
          switch (paymentIntent.status) {
            case "succeeded":
              setMessage("Payment succeeded!");
              break;
            case "processing":
              setMessage("Your payment is processing.");
              break;
            case "requires_payment_method":
              setMessage("Your payment was not successful, please try again.");
              break;
            default:
              setMessage("Something went wrong.");
              break;
          }
        });
    }
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/payment-success", // Adjust to your success URL
      },
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Payment processing...");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <Button
        variant="primary"
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="mt-3 w-100 ezy__pay-btn"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
      {message && (
        <Alert
          variant={message.includes("succeeded") ? "success" : "danger"}
          className="mt-3"
        >
          {message}
        </Alert>
      )}
    </form>
  );
};

const PaymentDemo = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Read the "amount" query parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const amount = params.get("amount");
    // Convert the amount to the smallest currency unit (e.g., paise for INR)
    const paymentAmount = amount ? parseFloat(amount) * 100 : 0;

    axios
      .post("http://localhost:5000/api/create-payment-intent", {
        amount: paymentAmount,
      })
      .then((response) => {
        setClientSecret(response.data.clientSecret);
      })
      .catch((err) => {
        setError("Error initializing payment: " + err.message);
      });
  }, []);

  const options = {
    clientSecret,
  };

  return (
    <Container className="ezy__payment-demo py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Payment Checkout</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm />
            </Elements>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentDemo;
