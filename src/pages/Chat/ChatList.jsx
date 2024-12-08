import React, { useEffect, useState } from "react";
import { fetchUserId } from "../../hooks/useFetchUserId";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./ChatList.css";

const ChatList = () => {
  const [products, setProducts] = useState([]); // State to store products
  const [currentUserId, setCurrentUserId] = useState(null); // State to store the current user ID
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Fetch user ID and associated products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch user ID
        const user = await fetchUserId();
        if (user) {
          setCurrentUserId(user.user_id);
  
          // Fetch products associated with the user
          const response = await fetch("https://dragon-craigslist.onrender.com/past_product", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include credentials (cookies)
          });
  
          if (response.ok) {
            const data = await response.json(); // Parse the JSON response
            if (Array.isArray(data)) {
              setProducts(data); // Set products to state
              sessionStorage.setItem("products", JSON.stringify(data));
            } else {
              console.error("Unexpected response format:", data);
            }
          } else {
            console.error("Failed to fetch products:", response.statusText);
            setError("Failed to fetch products.");
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error fetching products.");
      }
    };
  
    fetchProducts();
  }, []);

  const handleChatClick = (product_id, seller_id, buyer_id) => {
    // Determine the receiver ID (it should not be the current user ID)
    const receiver_id = seller_id === currentUserId ? buyer_id : seller_id;
  
    if (receiver_id === currentUserId) {
      setError("You cannot send a message to yourself.");
      console.warn("Navigation prevented: User is trying to message themselves.");
      return; // Prevent further execution
    }
  
    // Set up bookInfo object in sessionStorage
    sessionStorage.setItem("bookInfo", JSON.stringify({ bookId: product_id, sellerId: receiver_id }));
    console.log("Book ID:", product_id);
    console.log("Receiver ID:", receiver_id);
  
    // Navigate to the chatbox page
    navigate(`/chatbox/${product_id}`);
  };
  


  return (
    <div className="chat-list-container">
      <h3>Products Interested In</h3>
      {error && <p className="error-message">{error}</p>}
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.product_id} className="product-card">
              <h4>Product ID: {product.product_id}</h4>
              <p>Seller: {product.seller_username}</p>
              <p>Buyer: {product.buyer_username}</p>
              <button
                className="chat-link"
                onClick={() => handleChatClick(product.product_id, product.seller_id, product.buyer_id)}
              >
                Go to Chat
              </button>
            </div>
          ))
        ) : (
          !error && <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ChatList;
