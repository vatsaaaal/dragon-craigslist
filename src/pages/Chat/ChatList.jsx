import React, { useEffect, useState } from "react";
import { fetchUserId } from "../../hooks/useFetchUserId";
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
        console.log("Starting fetchProducts...");
  
        // Fetch user ID
        console.log("Fetching user ID...");
        const user = await fetchUserId();
        console.log("User fetched:", user);
  
        if (user) {
          setCurrentUserId(user.user_id);
  
          console.log("Fetching products for user ID:", user.user_id);
  
          // Fetch products associated with the user
          const response = await fetch("https://dragon-craigslist.onrender.com/messages/past_product", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include credentials (cookies)
          });
  
          console.log("Fetch response status:", response.status);
          console.log("Fetch response headers:", response.headers);
  
          if (response.ok) {
            const data = await response.json(); // Parse the JSON response
            console.log("Fetch response data:", data);
  
            if (Array.isArray(data)) {
              setProducts(data); // Set products to state
              sessionStorage.setItem("products", JSON.stringify(data));
            } else {
              console.error("Unexpected response format:", data);
            }
          } else {
            console.error("Failed to fetch products. Status text:", response.statusText);
            setError("Failed to fetch products.");
          }
        } else {
          console.warn("No user found. Skipping product fetch.");
        }
      } catch (error) {
        console.error("Error during fetchProducts:", error);
        setError("Error fetching products.");
      } finally {
        console.log("fetchProducts completed.");
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
