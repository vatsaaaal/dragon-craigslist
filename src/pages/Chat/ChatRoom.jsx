import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';

const ChatRoom = () => {
  const { product_id, other_user_id } = useParams(); // Retrieve parameters from URL
  const { messages, sendMessage, currentUserId } = useChat(product_id, other_user_id);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const getMessageStyle = (senderId) => {
    const colors = {
      1: { backgroundColor: '#ffe082', color: '#000' }, // Yellow
      2: { backgroundColor: '#c8e6c9', color: '#000' }, // Green
      3: { backgroundColor: '#d1c4e9', color: '#000' }, // Purple
      // Default style
      default: { backgroundColor: '#f5f5f5', color: '#000' },
    };
    return colors[senderId] || colors.default;
  };

  return (
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
                  ? msg.sender_username // Show "You" for the current user
                  : msg.receiver_username // Show sender's name for others
                }
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
  );
};

export default ChatRoom;
