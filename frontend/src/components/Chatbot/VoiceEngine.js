// Voice Engine for Speech Recognition and Text-to-Speech
class VoiceEngine {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
    
    this.initializeSpeechRecognition();
  }

  initializeSpeechRecognition() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
    }
  }

  // Start voice recognition
  startListening(onResult, onError) {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
      return false;
    }

    this.isListening = true;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.isListening = false;
      onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      this.isListening = false;
      onError('Could not start speech recognition');
      return false;
    }
  }

  // Stop voice recognition
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Speak text using text-to-speech
  speak(text, options = {}) {
    // Stop any current speech
    this.stopSpeaking();

    if (!text || !this.synthesis) {
      return false;
    }

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    this.currentUtterance.rate = options.rate || 0.9;
    this.currentUtterance.pitch = options.pitch || 1;
    this.currentUtterance.volume = options.volume || 0.8;
    
    // Try to use a pleasant voice
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Alex') ||
      voice.name.includes('Samantha') ||
      voice.lang.includes('en-US')
    );
    
    if (preferredVoice) {
      this.currentUtterance.voice = preferredVoice;
    }

    // Event handlers
    this.currentUtterance.onstart = options.onStart || (() => {});
    this.currentUtterance.onend = options.onEnd || (() => {});
    this.currentUtterance.onerror = options.onError || (() => {});

    try {
      this.synthesis.speak(this.currentUtterance);
      return true;
    } catch (error) {
      console.error('Speech synthesis error:', error);
      return false;
    }
  }

  // Stop current speech
  stopSpeaking() {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synthesis && this.synthesis.speaking;
  }

  // Get available voices
  getAvailableVoices() {
    return this.synthesis ? this.synthesis.getVoices() : [];
  }

  // Check browser support
  isSupported() {
    return {
      speechRecognition: !!this.recognition,
      speechSynthesis: !!this.synthesis
    };
  }
}

export default VoiceEngine;