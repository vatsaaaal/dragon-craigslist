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

  return (
    <div className="chat-container">
      <div className="chat-room">
        <div className="messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.sender_id === currentUserId ? 'message-own' : 'message-other'}`}
            >
              <div className="message-header">
                {msg.sender_id === currentUserId 
                  ? 'You' 
                  : `User ${msg.sender_id}`}
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
