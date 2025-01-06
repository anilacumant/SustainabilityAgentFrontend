import React, { useState } from "react";
import "./ChatModal.css"; // Import ChatModal styles

const ChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Corrected handleSendMessage function
  const handleSendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    // Add user message to the chat
    setMessages((prevMessages) => [...prevMessages, { sender: "user", text: input }]);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.reply) {
        // Add AI response to the chat
        setMessages((prevMessages) => [...prevMessages, { sender: "ai", text: data.reply }]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prevMessages) => [...prevMessages, { sender: "ai", text: "Something went wrong, please try again later." }]);
    }

    setInput(""); // Clear input field
  };

  return (
    <div className="chat-modal">
      <div className="chat-header">
        <h2>Chat with AI</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatModal;
