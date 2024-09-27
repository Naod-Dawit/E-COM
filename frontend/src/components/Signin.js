import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Signin.css'

const Signin = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/signin', { email: data.email, password: data.password });
      localStorage.setItem('token', response.data.token); 
      alert("Signin successful!");
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSignin}>
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
        <button type="submit">SIGN IN</button>
      </form>
      <Link to="/signup">SIGN UP</Link> <br />
      <Link to="/reset-password">Forgot Password?</Link>
    </div>
  );
};

export default Signin;
