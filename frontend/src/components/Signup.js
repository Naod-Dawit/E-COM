import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Signup.css";

const Signup = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
  });
  const navigate = useNavigate();

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("email", data.email);
        alert("Signup successful! Please verify your email.");
        navigate("/verify-token");
      } else {
        alert(`Error signing up:` + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="signup-container">
      <h1>Welcome to the Naod E-Com</h1>

      <form onSubmit={handleSignup}>
        <input
          name="email"
          placeholder="Email"
          value={data.email}
          type="text"
          required
          onChange={handleInputs}
        />
        <input
          name="password"
          placeholder="Password"
          value={data.password}
          type="password"
          required
          onChange={handleInputs}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={data.name}
          onChange={handleInputs}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={data.age}
          onChange={handleInputs}
        />
        <button type="submit">Signup</button>
      </form>
      <Link to={"/signin"}>SIGN IN</Link>
    </div>
  );
};

export default Signup;
