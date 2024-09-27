import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/product.css";
import { CartContext } from "./Cartcontext";
import { BallTriangle } from "react-loader-spinner";
const ShowDescription = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <BallTriangle height="50px" width="40px" radius="2" color="green" />;
  }

  const handleNextImage = () => {
    setImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <Link to={"/"}>HOME</Link>
      <Link to={"/cart"}>CART</Link>

      <div className="product-description-container">
        <img
          src={product.images[imageIndex]}
          alt={product.title}
          className="product-image"
        />
        <p>
          {imageIndex + 1}/{product.images.length}
        </p>

        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="product-price">${product.price}</p>
          <p className="product-description">{product.description}</p>
          <button onClick={handlePrevImage}>&lt;</button>
          <button onClick={handleNextImage}>&gt;</button>
        </div>
        <button
          className="add-to-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
    </>
  );
};

export default ShowDescription;
