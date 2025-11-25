import React, { useState, useEffect, useRef } from 'react';
import ChatService from './ChatService';
import VoiceEngine from './VoiceEngine';
import AiMessage from './AiMessage';
import UserMessage from './UserMessage';
import ModeSelector from './ModeSelector';
import ResumeUpload from './ResumeUpload';

const ChatWindow = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState('developer');
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userContext, setUserContext] = useState({});
  const [sessionId] = useState(Date.now().toString());

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const voiceEngine = useRef(new VoiceEngine());
  
  // Load persisted data on mount
  useEffect(() => {
    const savedName = localStorage.getItem('chatbot_user_name');
    const savedContext = localStorage.getItem('chatbot_user_context');
    const savedVoiceEnabled = localStorage.getItem('chatbot_voice_enabled');
    
    if (savedName) setUserName(savedName);
    if (savedContext) setUserContext(JSON.parse(savedContext));
    if (savedVoiceEnabled) setVoiceEnabled(JSON.parse(savedVoiceEnabled));
  }, []);
  
  // Persist user data
  useEffect(() => {
    if (userName) {
      localStorage.setItem('chatbot_user_name', userName);
      localStorage.setItem('chatbot_user_context', JSON.stringify(userContext));
    }
  }, [userName, userContext]);
  
  useEffect(() => {
    localStorage.setItem('chatbot_voice_enabled', JSON.stringify(voiceEnabled));
  }, [voiceEnabled]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'ai',
        content: `Hey there! 👋 I'm **Hemanth AI** - your personal guide to Kolluri Hemanth's portfolio!\n\n🎯 **I'm here to help you with:**\n\n💻 **Technical Questions** - Code, architecture, frameworks\n🎨 **Design Insights** - UI/UX, creativity, user experience\n🧑‍🏫 **Career Mentoring** - Growth paths, learning strategies\n📄 **Resume Reviews** - ATS optimization, feedback\n💼 **Project Deep-dives** - Live demos, technical details\n\n**First, what should I call you?** (This helps me personalize our conversation!)\n\n*Or jump right in with a question about Hemanth's work!*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: currentMode
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, currentMode]);

  // Handle sending messages
  const handleSendMessage = async (text = inputText, file = null) => {
    if ((!text.trim() && !file) || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text.trim() || (file ? `Uploaded: ${file.name}` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: file
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Add typing indicator
    const typingId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: typingId,
      type: 'ai',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTyping: true
    }]);

    try {
      // Detect and store user name
      const detectUserName = (text) => {
        const namePatterns = [
          /my name is ([a-zA-Z]+)/i,
          /i'm ([a-zA-Z]+)/i,
          /call me ([a-zA-Z]+)/i,
          /i am ([a-zA-Z]+)/i
        ];
        
        for (const pattern of namePatterns) {
          const match = text.match(pattern);
          if (match && match[1] && match[1].length > 1) {
            return match[1];
          }
        }
        
        // Simple name detection for first response
        if (!userName && messages.length <= 2 && text.match(/^[a-zA-Z]{2,15}$/)) {
          return text;
        }
        
        return null;
      };
      
      const detectedName = detectUserName(userMessage.content);
      if (detectedName && !userName) {
        setUserName(detectedName);
        setUserContext(prev => ({ ...prev, name: detectedName, firstInteraction: new Date() }));
      }
      
      // Prepare conversation history with context
      const conversationHistory = messages
        .filter(msg => msg.type !== 'ai' || !msg.isTyping)
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      // Process file if provided
      let fileData = null;
      if (file) {
        fileData = await ChatService.fileToBase64(file);
      }

      // Enhanced message with user context
      const enhancedMessage = userName ? 
        `${userMessage.content} [User: ${userName}, Context: ${JSON.stringify(userContext)}]` : 
        userMessage.content;

      // Send to AI with enhanced context
      const response = await ChatService.processMessage(
        enhancedMessage,
        conversationHistory,
        currentMode,
        fileData,
        userContext,
        sessionId
      );
      
      // Update context if provided
      if (response.contextUpdate) {
        setUserContext(prev => ({ ...prev, ...response.contextUpdate }));
      }

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== typingId));

      // Add AI response
      const aiMessage = {
        id: Date.now() + 2,
        type: 'ai',
        content: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: currentMode,
        success: response.success
      };

      setMessages(prev => [...prev, aiMessage]);

      // Auto-speak if voice enabled and response is successful
      if (voiceEnabled && response.success) {
        handleSpeak(response.message);
      }

    } catch (error) {
      console.error('Message send error:', error);
      
      // Remove typing indicator and add error message
      setMessages(prev => prev.filter(msg => msg.id !== typingId));
      setMessages(prev => [...prev, {
        id: Date.now() + 3,
        type: 'ai',
        content: "I'm having trouble connecting to the AI service right now. Please check your connection and try again! 🤖",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        success: false
      }]);
    }

    setIsLoading(false);
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (isListening) {
      voiceEngine.current.stopListening();
      setIsListening(false);
    } else {
      const success = voiceEngine.current.startListening(
        (transcript) => {
          setInputText(transcript);
          setIsListening(false);
        },
        (error) => {
          console.error('Voice input error:', error);
          setIsListening(false);
        }
      );
      setIsListening(success);
    }
  };

  // Handle text-to-speech
  const handleSpeak = (text) => {
    if (isSpeaking) {
      voiceEngine.current.stopSpeaking();
      setIsSpeaking(false);
    } else {
      const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
      voiceEngine.current.speak(cleanText, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }

    setIsUploading(true);
    setShowResumeUpload(false);
    
    await handleSendMessage('Please analyze this resume and provide feedback:', file);
    setIsUploading(false);
  };

  // Handle mode change
  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
    const modeNames = {
      developer: 'Developer',
      designer: 'Designer', 
      mentor: 'Mentor',
      career: 'Career Assistant',
      resume: 'Resume Reviewer'
    };
    
    const modeMessage = {
      id: Date.now(),
      type: 'ai',
      content: `Switched to **${modeNames[newMode]}** mode! 🔄\n\nI'm now optimized to help you with ${newMode === 'developer' ? 'technical questions and code guidance' : newMode === 'designer' ? 'UI/UX insights and design feedback' : newMode === 'mentor' ? 'career guidance and learning paths' : newMode === 'career' ? 'job search and interview preparation' : 'resume analysis and ATS optimization'}.\n\nWhat can I help you with?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: newMode
    };
    
    setMessages(prev => [...prev, modeMessage]);
  };

  // Keyboard shortcuts
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            <span className="chat-avatar-text">H</span>
            <div className="chat-status-dot"></div>
          </div>
          <div className="chat-header-text">
            <h3>Hemanth AI</h3>
            <span className="chat-status">Ready to help • {currentMode} mode</span>
          </div>
        </div>
        
        <div className="chat-header-controls">
          {/* Voice toggle */}
          <button
            className={`control-btn voice-toggle ${voiceEnabled ? 'active' : ''}`}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            title="Toggle voice responses"
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          
          {/* Mode selector */}
          <ModeSelector
            currentMode={currentMode}
            onModeChange={handleModeChange}
            isOpen={showModeSelector}
            onToggle={() => setShowModeSelector(!showModeSelector)}
          />
          
          {/* Close button */}
          <button className="control-btn close-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          message.type === 'ai' ? (
            <AiMessage
              key={message.id}
              message={message.content}
              timestamp={message.timestamp}
              isTyping={message.isTyping}
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
            />
          ) : (
            <UserMessage
              key={message.id}
              message={message.content}
              timestamp={message.timestamp}
              file={message.file}
            />
          )
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Resume Upload Modal */}
      {showResumeUpload && (
        <div className="resume-upload-modal">
          <div className="modal-backdrop" onClick={() => setShowResumeUpload(false)} />
          <div className="modal-content">
            <ResumeUpload
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
            />
          </div>
        </div>
      )}

      <div className="chat-input-area">
        <div className="chat-input-container">
          <div className="input-actions-left">
            {/* File upload button */}
            <button
              className="action-btn upload-btn"
              onClick={() => setShowResumeUpload(true)}
              title="Upload resume for analysis"
            >
              📎
            </button>
          </div>

          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message Hemanth AI (${currentMode} mode)...`}
              className="chat-input"
              rows={1}
              disabled={isLoading}
            />
          </div>

          <div className="input-actions-right">
            {/* Voice input button */}
            {voiceEngine.current.isSupported().speechRecognition && (
              <button
                className={`action-btn voice-btn ${isListening ? 'listening' : ''}`}
                onClick={handleVoiceInput}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? '🎙️' : '🎤'}
              </button>
            )}
            
            {/* Send button */}
            <button
              className={`action-btn send-btn ${inputText.trim() ? 'active' : ''}`}
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              title="Send message"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;