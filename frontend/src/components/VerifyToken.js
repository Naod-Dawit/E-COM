import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyToken = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://e-com-5sgi.onrender.com/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: localStorage.getItem("email"), token }),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Email verified successfully!");
        navigate("/");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="signup-container">
      <h1>Verify Your Email</h1>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your verification token"
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerifyToken;
