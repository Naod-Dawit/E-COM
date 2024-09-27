import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../styles/image.css";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./Cartcontext";
import { Vortex } from 'react-loader-spinner';
import Signout from "./signout";

const LandingPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You have to sign in to use the website");
          navigate('/signup');
          console.error("Token not found in localStorage");
          return;
        }

        const response = await axios.get("https://e-com-5sgi.onrender.com/api/getdata", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data);
      } catch (err) {
        console.error("Fetch data error:", err.response || err.message);
      } finally {
        setLoading(false); // Set loading to false once data is fetched or an error occurs
      }
    };
    fetchData();
  }, [navigate]);

  const description = (item) => {
    navigate(`/products/${item.id}`);
  };

  return (
    <>
      <Signout />
      <button id="CART" onClick={() => navigate("cart")}>🛒</button>

      {loading ? ( // Show the loader while data is being fetched
        <div className="loader-container">
          <Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
          />
        </div>
      ) : (
        <div className="container">
          {data.map((item) => (
            <div
              className="product-card"
              key={item.id}
              onClick={() => description(item)}
            >
              <img src={item.images[1]} alt={item.title} />
              <div className="product-details">
                <p className="product-title">{item.title}</p>
                <p className="product-price">${item.price}</p>
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default LandingPage;
