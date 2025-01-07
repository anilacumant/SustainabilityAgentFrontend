/* ChatModal Component with Positioning and CSS Adjustments */
import React, { useState } from "react";
import "./ChatModal.css";

const ChatModal = ({ onClose, position }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

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
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "ai", text: data.reply },
        ]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
    }
  };

  return (
    <div
      className={`chat-modal ${position}`}
      style={{ position: "fixed", bottom: "60px", right: "20px" }}
    >
      <div className="chat-header">
        <h2>Chat with AI</h2>
        <button className="close-button" onClick={onClose}>✖</button>
      </div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <textarea
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="send-button" onClick={handleSendMessage}>➤</button>
      </div>
    </div>
  );
};

export default ChatModal;