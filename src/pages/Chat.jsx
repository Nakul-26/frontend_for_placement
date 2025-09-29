import React, { useState } from 'react';
import './Chat.css';

const conversations = [
  { id: 1, name: 'John Doe', lastMessage: 'See you tomorrow!', avatar: 'JD' },
  { id: 2, name: 'Jane Smith', lastMessage: 'Thanks for the update.', avatar: 'JS' },
  { id: 3, name: 'Company Recruiter', lastMessage: 'Your application is under review.', avatar: 'CR' },
];

const messages = {
  1: [
    { sender: 'John Doe', text: 'Hey, how is the project going?' },
    { sender: 'You', text: 'It is going well, almost done.' },
    { sender: 'John Doe', text: 'Great! See you tomorrow!' },
  ],
  2: [
    { sender: 'Jane Smith', text: 'Can you send me the report?' },
    { sender: 'You', text: 'Yes, I will send it in an hour.' },
    { sender: 'Jane Smith', text: 'Thanks for the update.' },
  ],
  3: [
    { sender: 'Company Recruiter', text: 'Your application is under review.' },
  ],
};

const Chat = () => {
  const [activeConversation, setActiveConversation] = useState(1);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, you would send the message to the server
      console.log(`Sending message to conversation ${activeConversation}: ${message}`);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Conversations</h2>
        </div>
        <div className="conversation-list">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${activeConversation === conv.id ? 'active' : ''}`}
              onClick={() => setActiveConversation(conv.id)}
            >
              <div className="avatar">{conv.avatar}</div>
              <div className="conversation-details">
                <div className="conversation-name">{conv.name}</div>
                <div className="last-message">{conv.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-window">
        <div className="chat-header">
          <h3>{conversations.find((c) => c.id === activeConversation)?.name}</h3>
        </div>
        <div className="message-list">
          {messages[activeConversation].map((msg, index) => (
            <div key={index} className={`message-item ${msg.sender === 'You' ? 'sent' : 'received'}`}>
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
        </div>
        <div className="message-input-container">
          <input
            type="text"
            className="message-input"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="send-button" onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;