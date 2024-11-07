import React from 'react';

const MessageInput = ({ message, onMessageChange, onSendMessage }) => (
  <div className="message-input">
    <input
      type="text"
      value={message}
      onChange={(e) => onMessageChange(e.target.value)}
      placeholder="Type your message..."
      onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
    />
    <button onClick={onSendMessage}>Send</button>
  </div>
);

export default MessageInput;
