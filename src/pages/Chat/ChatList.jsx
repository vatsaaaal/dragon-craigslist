import React, { useEffect, useState } from "react";
import { fetchUserId } from "../../hooks/useFetchUserId";
import axios from "axios";
import { Link } from "react-router-dom";

const ChatList = () => {
  const [products, setProducts] = useState([]); // State to store products
  const [currentUserId, setCurrentUserId] = useState(null); // State to store the current user ID
  const [error, setError] = useState(null);

  // Fetch user ID and associated products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch current user ID
        const user = await fetchUserId();
        if (user) {
          setCurrentUserId(user.user_id); // Store user ID in state

          // Fetch products the account has contacted the seller with
          const response = await axios.get(`http://localhost:3000/messages/past_product`, {
            withCredentials: true,
          });

          if (response.data && Array.isArray(response.data)) {
            setProducts(response.data); // Store product data in state
          } else {
            console.error("Failed to retrieve products from server");
          }
        }
      } catch (error) {
        setError("Error fetching products.");
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list">
      <h3>Products You’ve Interacted With</h3>
      {currentUserId && <p>Welcome, User {currentUserId}</p>}
      {error && <p className="error-message">{error}</p>}
      <ul>
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.product_id}>
              <Link to={`/chatbox/${product.product_id}`}>
                <strong>{product.product_name}</strong> (Product ID: {product.product_id})
              </Link>
            </li>
          ))
        ) : (
          !error && <p>No products available.</p>
        )}
      </ul>
    </div>
  );
};

export default ChatList;