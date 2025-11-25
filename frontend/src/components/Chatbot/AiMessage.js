import React from 'react';

const AiMessage = ({ message, timestamp, isTyping, onSpeak, isSpeaking }) => {
  const formatMessage = (text) => {
    // Convert markdown-style formatting to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="message ai-message">
      <div className="message-avatar">
        <div className="ai-avatar">
          <span className="ai-initial">H</span>
          <div className="ai-pulse"></div>
        </div>
      </div>
      
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">Hemanth AI</span>
          <span className="message-time">{timestamp}</span>
        </div>
        
        <div className="message-bubble ai-bubble">
          {isTyping ? (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <>
              <div 
                className="message-text"
                dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
              />
              
              {/* Voice Controls */}
              <div className="message-actions">
                <button
                  className={`voice-btn ${isSpeaking ? 'speaking' : ''}`}
                  onClick={() => onSpeak(message)}
                  title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                >
                  {isSpeaking ? '🔊' : '🔉'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiMessage;