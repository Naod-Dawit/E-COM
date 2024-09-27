import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signout = () => {
    const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      await axios.post("http://localhost:8000/api/signout", {}, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.removeItem("token");
      navigate("/signin");
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

  return <button style={{
    backgroundColor: 'red',
    margin:'0px'

    
  }} onClick={handleSignout}>Sign Out</button>;
};

export default Signout;
