import React from 'react';

const UserMessage = ({ message, timestamp, file }) => {
  return (
    <div className="message user-message">
      <div className="message-content user-content">
        <div className="message-header user-header">
          <span className="message-time">{timestamp}</span>
          <span className="message-sender">You</span>
        </div>
        
        <div className="message-bubble user-bubble">
          {file && (
            <div className="file-attachment">
              <div className="file-icon">📄</div>
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          )}
          
          <div className="message-text">{message}</div>
        </div>
      </div>
      
      <div className="message-avatar user-avatar">
        <div className="user-avatar-circle">
          <span className="user-initial">U</span>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;