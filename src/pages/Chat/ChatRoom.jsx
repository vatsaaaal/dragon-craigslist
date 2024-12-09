import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useChat } from '../../hooks/useChat';
import PageHeader from "../../components/Header";

const ChatRoom = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { product_id, other_user_id } = useParams(); // Retrieve parameters from URL
  const { messages, sendMessage, currentUserId, currentUsername } = useChat(product_id, other_user_id);
  const [productDetails, setProductDetails] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fetch product details when component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/products/${product_id}`,
          { withCredentials: true }
        );
        setProductDetails(response.data.product);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details.');
        setLoading(false);
      }
    };

    if (product_id) {
      fetchProductDetails();
    } else {
      setError('Invalid product ID.');
      setLoading(false);
    }
  }, [product_id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Typography variant="body1" align="center">
          Loading product details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          textAlign: "center",
        }}
      >
        <Typography variant="body1" align="center" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 13, width: "100%" }}>
        <PageHeader />
        <div className="main-container">
          {/* Product Details Section */}
          {productDetails ? (
            <div className="product-details">
              <Typography variant="h5" component="div" gutterBottom>
                {productDetails.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {productDetails.description}
              </Typography>
              <Typography variant="body2" color="text.primary">
                <strong>Price:</strong> ${productDetails.price}
              </Typography>
              <Typography variant="body2" color="text.primary">
                <strong>Seller:</strong> {productDetails.user_id}
              </Typography>
            </div>
          ) : (
            <Typography variant="body1" align="center" color="error">
              Product details not available.
            </Typography>
          )}
  
          {/* Chat Container Section */}
          <div className="chat-container">
            <div className="chat-room">
              <div className="messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.sender_id === currentUserId
                        ? "message-own"
                        : "message-other"
                    }`}
                  >
                    <div
                      className="message-header"
                      data-sender-id={msg.sender_id}
                    >
                      {msg.sender_id === currentUserId
                        ? currentUsername
                        : msg.sender_username}
                      <span
                        style={{
                          color: "gray",
                          fontStyle: "italic",
                          marginLeft: "10px",
                        }}
                      >
                        {formatDate(msg.created)}
                      </span>
                    </div>
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))}
              </div>
              <div className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={newMessage.trim() === ""}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Container>
  );
};

export default ChatRoom;
