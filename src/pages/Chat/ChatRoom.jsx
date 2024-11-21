import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';

const ChatRoom = () => {
  const { room_code } = useParams();
  const { messages, sendMessage, userId } = useChat(room_code);
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
              className={`message ${msg.sender_id === userId ? 'message-own' : 'message-other'}`}
            >
              <div className="message-header">
                User {msg.sender_id}
              </div>
              <div className="message-content">
                {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
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
          <button onClick={handleSendMessage} disabled={newMessage.trim() === ''} >Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;