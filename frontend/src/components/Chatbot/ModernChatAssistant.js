import React, { useState, useRef, useEffect, useCallback } from 'react';
import chatService from './ChatService';
import './ModernChatAssistant.css';

const ModernChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      text: "👋 Hi! I'm Hemanth-AI, your intelligent assistant. I can help you explore my portfolio, analyze resumes, provide career guidance, and answer technical questions. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMode, setCurrentMode] = useState('developer');
  const [sessionId] = useState(`session-${Date.now()}`);
  const [userContext, setUserContext] = useState({});
  const [userName, setUserName] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mode configurations
  const modes = {
    developer: {
      icon: '💻',
      title: 'Developer Mode',
      color: 'var(--accent-blue)',
      description: 'Technical discussions & code guidance'
    },
    designer: {
      icon: '🎨',
      title: 'Design Mode',
      color: 'var(--accent-purple)',
      description: 'UI/UX insights & design feedback'
    },
    mentor: {
      icon: '🚀',
      title: 'Mentor Mode',
      color: 'var(--accent-green)',
      description: 'Career guidance & learning paths'
    },
    resume: {
      icon: '📄',
      title: 'Resume Reviewer',
      color: 'var(--accent-pink)',
      description: 'Resume analysis & optimization'
    },
    career: {
      icon: '📈',
      title: 'Career Assistant',
      color: 'var(--accent-blue)',
      description: 'Job search & interview prep'
    }
  };

  // Quick action suggestions
  const quickActions = {
    developer: [
      "Tell me about your tech stack",
      "Show me your projects",
      "Explain your coding approach",
      "What frameworks do you use?"
    ],
    designer: [
      "Review my design portfolio",
      "UI/UX best practices",
      "Design system approach",
      "Color scheme feedback"
    ],
    mentor: [
      "Career roadmap advice",
      "Learning resources",
      "Interview preparation",
      "Skill development tips"
    ],
    resume: [
      "Upload my resume for review",
      "ATS optimization tips",
      "Resume formatting guide",
      "Industry-specific advice"
    ],
    career: [
      "Job search strategies",
      "LinkedIn profile tips",
      "Salary negotiation",
      "Company research"
    ]
  };

  const handleSendMessage = useCallback(async (messageText = null) => {
    const text = messageText || inputMessage.trim();
    if (!text && !uploadedFile) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: text || (uploadedFile ? `📎 Uploaded: ${uploadedFile.name}` : ''),
      sender: 'user',
      timestamp: new Date(),
      file: uploadedFile
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShowQuickActions(false);

    try {
      const response = await chatService.sendMessage(
        [{ role: 'user', content: text }],
        currentMode,
        uploadedFile,
        userContext,
        sessionId
      );

      const botMessage = {
        id: `bot-${Date.now()}`,
        text: response.message || response.content || 'I apologize, but I encountered an issue processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        mode: currentMode
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Extract user name if provided
      if (text && !userName) {
        const nameMatch = text.match(/(?:i'm|i am|my name is|call me)\s+([a-zA-Z]{2,15})/i);
        if (nameMatch) {
          setUserName(nameMatch[1]);
          setUserContext(prev => ({ ...prev, userName: nameMatch[1] }));
        }
      }

    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: "I'm experiencing some technical difficulties. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
    setUploadedFile(null);
  }, [inputMessage, uploadedFile, currentMode, userContext, sessionId, userName, chatService]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      
      setUploadedFile(file);
      setCurrentMode('resume'); // Switch to resume mode for file analysis
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset notifications or perform opening actions
    }
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setShowQuickActions(true);
    
    const modeChangeMessage = {
      id: `mode-${Date.now()}`,
      text: `Switched to ${modes[mode].title}. ${modes[mode].description}`,
      sender: 'system',
      timestamp: new Date(),
      type: 'mode-change'
    };
    setMessages(prev => [...prev, modeChangeMessage]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`modern-chat-container ${isOpen ? 'chat-open' : ''}`}>
      {/* Floating Toggle Button */}
      <button className="chat-toggle-btn" onClick={toggleChat}>
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )}
        <div className="chat-notification-pulse"></div>
      </button>

      {/* Main Chat Window */}
      {isOpen && (
        <div className="modern-chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-avatar">
              <div className="avatar-gradient">
                <span className="avatar-text">H</span>
              </div>
              <div className="status-indicator"></div>
            </div>
            <div className="chat-info">
              <h3 className="chat-title">Hemanth-AI</h3>
              <p className="chat-subtitle">{modes[currentMode].description}</p>
            </div>
            <div className="header-actions">
              <button className="header-btn voice-btn" onClick={() => setIsVoiceActive(!isVoiceActive)}>
                {isVoiceActive ? '🔊' : '🔇'}
              </button>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="mode-selector">
            {Object.entries(modes).map(([key, mode]) => (
              <button
                key={key}
                className={`mode-btn ${currentMode === key ? 'active' : ''}`}
                onClick={() => handleModeChange(key)}
                style={{ '--mode-color': mode.color }}
              >
                <span className="mode-icon">{mode.icon}</span>
                <span className="mode-label">{mode.title}</span>
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender} ${message.type || ''}`}>
                {message.sender === 'bot' && (
                  <div className="message-avatar">
                    <span>{modes[message.mode || currentMode]?.icon || '🤖'}</span>
                  </div>
                )}
                <div className="message-content">
                  <div className="message-bubble">
                    {message.file && (
                      <div className="file-attachment">
                        <span className="file-icon">📎</span>
                        <span className="file-name">{message.file.name}</span>
                      </div>
                    )}
                    <p className="message-text">{message.text}</p>
                  </div>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <span>{modes[currentMode].icon}</span>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="quick-actions">
              <div className="quick-actions-title">Quick Actions:</div>
              <div className="quick-actions-grid">
                {quickActions[currentMode].map((action, index) => (
                  <button
                    key={index}
                    className="quick-action-btn"
                    onClick={() => handleSendMessage(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="chat-input-area">
            {uploadedFile && (
              <div className="file-preview">
                <span className="file-icon">📎</span>
                <span className="file-name">{uploadedFile.name}</span>
                <button className="remove-file" onClick={() => setUploadedFile(null)}>×</button>
              </div>
            )}
            
            <div className="input-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
              />
              
              <button 
                className="attachment-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload file"
              >
                📎
              </button>
              
              <input
                type="text"
                className="chat-input"
                placeholder={`Ask Hemanth-AI anything... (${modes[currentMode].title})`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              
              <button 
                className="send-btn"
                onClick={() => handleSendMessage()}
                disabled={isTyping || (!inputMessage.trim() && !uploadedFile)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernChatAssistant;