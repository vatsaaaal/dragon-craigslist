import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';

const ChatRoom = () => {
  const { room_code } = useParams();
  const { messages = [], sendMessage = () => {} } = useChat(room_code) || {};
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      sendMessage(newMessage); // Send user and content
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-room">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.user}:</strong> {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
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
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
