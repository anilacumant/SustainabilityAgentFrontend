import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from "uuid";
import api from "../../api.js"
import './ChatModal.css';

const ChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const messagesEndRef = useRef(null);
  const session_id = localStorage.getItem("chatSession") || uuidv4();
  localStorage.setItem("chatSession", session_id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      sender: 'ai',
      text: "Hello! I'm your eco-assistant. How can I help you today?",

    };
    setMessages([welcomeMessage]);

    // Simulate carbon savings
    const interval = setInterval(() => {
      setCarbonSaved(prev => prev + Math.random() * 0.5);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call
      const { data } = await api.post("/api/chat", 
        { message: input?.trim() || "",session_id: session_id, }, 
      );
      
      const aiResponse = {
        id: Date.now(),
        sender: 'ai',
        text: data.reply,
        
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now(),
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
        suggestions: ['Try again', 'Contact support']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    handleSendMessage();
  };

  return (
    <div className="eco-chat-modal">
      <div className="eco-chat-header">
        <div className="eco-chat-title">

          <h2>Eco Assistant</h2>
        </div>
        
        <button className="eco-close-button" onClick={onClose}>×</button>
      </div>

      <div className="eco-chat-body">
        {messages.map((message) => (
          <div key={message.id} className={`eco-message ${message.sender}`}>
            <p>{message.text}</p>
            {message.suggestions && (
              <div className="eco-suggestions">
                {message.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="eco-suggestion-button"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="eco-loading">
            <div className="eco-loading-dot"></div>
            <div className="eco-loading-dot"></div>
            <div className="eco-loading-dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="eco-chat-footer">
        <textarea
          className="eco-chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        <button
          className="eco-send-button"
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatModal;