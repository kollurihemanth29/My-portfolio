import React from 'react';

const ChatBubble = ({ isOpen, onClick, hasUnread }) => {
  return (
    <div 
      className={`chat-bubble ${isOpen ? 'open' : ''} ${hasUnread ? 'unread' : ''}`}
      onClick={onClick}
    >
      <div className="bubble-content">
        {isOpen ? (
          <span className="bubble-icon close-icon">✕</span>
        ) : (
          <>
            <span className="bubble-icon chat-icon">💬</span>
            <div className="bubble-pulse"></div>
            {hasUnread && <div className="bubble-notification"></div>}
          </>
        )}
      </div>
      
      {!isOpen && (
        <div className="bubble-tooltip">
          <span>Chat with Hemanth AI</span>
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;