import React from 'react';
import './App.css';
import Home from './pages/Home';
import Footer from './components/Footer';
import ModernChatAssistant from './components/Chatbot/ModernChatAssistant';

function App() {
  return (
    <div className="App">
      <Home />
      <Footer />
      
      {/* Modern AI Chat Assistant */}
      <ModernChatAssistant />
    </div>
  );
}

export default App;
