import React, { useState } from 'react';
import '../styles/resetpassword.css';

const Resetpassword = () => {
  const [email, setEmail] = useState('');
  const [tokenSent, setTokenSent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/reset-password', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (response.ok) {
      alert("Reset token sent to: " + email);
      setTokenSent(true);
    } else {
      alert(result.message);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/verify-reset-token', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, token: resetToken })
    });
    const result = await response.json();
    if (response.ok) {
      setIsTokenValid(true);
      alert("Token is valid. Please enter your new password.");
    } else {
      alert(result.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const response = await fetch('http://localhost:8000/api/reset-password-final', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, newPassword })
    });
    const result = await response.json();
    if (response.ok) {
      alert("Password reset successfully!");
      setTokenSent(false);
      setIsTokenValid(false);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="reset-container">
      {!tokenSent && (
        <div>
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <button type="submit">Send Reset Token</button>
          </form>
        </div>
      )}

      {tokenSent && !isTokenValid && (
        <div>
          <form onSubmit={handleTokenSubmit}>
            <input
              type="number"
              placeholder="Enter the token sent to your email"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
            />
            <button type="submit">Verify Token</button>
          </form>
        </div>
      )}

      {isTokenValid && (
        <div>
          <form onSubmit={handlePasswordReset}>
            <input
              type="password"
              placeholder="Enter new Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm new Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Resetpassword;
