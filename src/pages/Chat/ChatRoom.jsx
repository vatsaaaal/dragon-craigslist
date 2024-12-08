import React, { useState } from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useParams } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import PageHeader from "../../components/Header";

const ChatRoom = () => {
  const { product_id, other_user_id } = useParams(); // Retrieve parameters from URL
  const { messages, sendMessage, currentUserId, currentUsername } = useChat(product_id, other_user_id);
  const [newMessage, setNewMessage] = useState('');

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

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 17,
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <PageHeader />
    <div className="chat-container">
      <div className="chat-room">
        <div className="messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.sender_id === currentUserId ? 'message-own' : 'message-other'}`}
            >
              <div className="message-header" data-sender-id={msg.sender_id}>
                {msg.sender_id === currentUserId
                  ? currentUsername // Show the current user's username
                  : msg.sender_username // Show the sender's username for received messages
                }
                <span
                  style={{
                    color: 'gray',
                    fontStyle: 'italic',
                    marginLeft: '10px',
                  }}
                >
                  {formatDate(msg.created)}
                </span>
              </div>
              <div className="message-content">
                {msg.content}
              </div>
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
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button onClick={handleSendMessage} disabled={newMessage.trim() === ''}>
            Send
          </button>
        </div>
      </div>
    </div>
    </Box>
    </Container>
  );
};

export default ChatRoom;
