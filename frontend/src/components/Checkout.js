import React, { useContext, useState } from "react";
import { useStripe, CardElement, useElements } from "@stripe/react-stripe-js";
import { CartContext } from "./Cartcontext";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

const Checkout = () => {
  const { cart } = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const totalprice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setShowPaymentForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    try {
      const items = cart.map((item) => ({
        id: item.id,
        name: item.title, 
        quantity: item.quantity,
        price: item.price, 
      }));
      console.log(items);
      const response = await fetch(
        "https://e-com-5sgi.onrender.com/api/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ amount: totalprice, items }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { clientSecret } = await response.json();

      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
      } else {
        setError(null);
        setSucceeded(true);
        navigate("/confirmation");
      }
    } catch (error) {
      setError(`Payment failed: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="checkout-container">
      {showPaymentForm ? (
        <form id="payment-form" onSubmit={handleSubmit}>
          <h2>Enter your payment details</h2>
          <CardElement id="card-element" options={cardStyle} />
          <button
            disabled={processing || succeeded}
            id="submit"
            className="pay-button"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
          {error && (
            <div className="card-error" role="alert">
              {error}
            </div>
          )}
        </form>
      ) : (
        <button onClick={handleCheckout} className="checkout-button">
          Go to Checkout
        </button>
      )}
    </div>
  );
};

export default Checkout;
