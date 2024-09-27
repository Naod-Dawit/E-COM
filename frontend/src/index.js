import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./components/Cartcontext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


const PUBLISHABLEKEY='pk_test_51PpRlJDhY4vz0hkIiYAXRVCwDv4w3HespI3VOujZx4DEDWnGCuEE7mOOOUu0ihGvG0dSPwX1Bd5R7Ha3pv0yFMDn00wG46vQ4C'


const stripePromise = loadStripe(PUBLISHABLEKEY);






const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
    </Elements>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
