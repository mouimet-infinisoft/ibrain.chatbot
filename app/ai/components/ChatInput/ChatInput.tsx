import React, { useState } from 'react';

interface ChatInputProps {
  visible: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ visible }) => {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    height:"75px",
    transform: visible ? 'translateX(-50%)' : 'translate(-50%, 100%)',
    opacity: visible ? 1 : 0,
    transition: 'transform 0.3s, opacity 0.3s',
    backgroundColor: '#f4f4f4',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
    boxSizing: 'border-box',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% - 40px)'
  };

  const inputStyle: React.CSSProperties = {
    flex: '1',
    height: '100%',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc',
    padding: '5px',
    marginRight: '10px',
  };

  const buttonStyle: React.CSSProperties = {
    width: '70px',
    height: '100%',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const handleButtonClick = () => {
    // Handle button click
  };

  return (
    <div style={containerStyle}>
      <input type="text" style={inputStyle} placeholder="Type your message..." />
      <button style={buttonStyle} onClick={handleButtonClick}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;