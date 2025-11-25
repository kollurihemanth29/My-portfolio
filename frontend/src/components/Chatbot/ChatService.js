// Lyzr API Integration Service
class ChatService {
  constructor() {
    this.apiKey = 'sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W';
    this.agentId = '69259a68c69ec8d9a07849bc';
    this.baseUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat`;
    this.projectsApiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/projects`;
  }

  // System persona prompt
  getSystemPrompt(mode = 'developer') {
    return `You are **Hemanth-AI**, the intelligent AI version of **Kolluri Hemanth**.
You act as his personal portfolio assistant, career mentor, technical guide, and resume reviewer.
You represent his personality, tone, skills, and expertise.

Current mode: ${mode}

PERSONALITY: Friendly, modern, confident developer-mentor tone. Clear and conversational. 
Crisp and short unless user requests in-depth detail. Use simple language for beginners. No robotic language.

MODES:
- Developer: Deep technical answers, code explanations, architecture guidance
- Designer: UI/UX analysis, layout improvements, design tips  
- Mentor: Career guidance, roadmaps, interview prep, motivation
- Career Assistant: Resume optimization, job search strategies, ATS tips
- Resume Reviewer: PDF analysis, actionable improvements, ATS scoring

RULES:
- Never invent achievements or projects
- If unsure say: "I don't have that info yet"
- Always end with a follow-up question
- Use Hemanth's real personality and experience only
- Keep responses engaging and helpful`;
  }

  // Send message via backend proxy
  async sendMessage(messages, mode = 'developer', file = null, userContext = {}, sessionId = null) {
    try {
      // Generate session ID if not provided
      const currentSessionId = sessionId || `session-${Date.now()}`;

      const payload = {
        messages: [
          { role: 'system', content: this.getSystemPrompt(mode) },
          ...messages
        ],
        mode: mode,
        file: file,
        userContext: userContext,
        sessionId: currentSessionId
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        timeout: 30000 // 30 second timeout for AI processing
      });

      if (!response.ok) {
        throw new Error(`Backend API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle enhanced responses with AI agent features
      return {
        success: true,
        message: data.message || "Got your message!",
        source: data.source || 'api',
        suggestions: data.suggestions || [],
        contextUpdate: data.contextUpdate || {},
        mode: mode
      };

    } catch (error) {
      console.error('ChatService Error:', error);
      
      return {
        success: false,
        message: "I'm having trouble connecting to the AI service right now. Please try again in a moment!",
        error: error.message
      };
    }
  }

  // Fetch projects from backend for context
  async fetchProjects() {
    try {
      const response = await fetch(this.projectsApiUrl);
      if (response.ok) {
        const data = await response.json();
        return data.data || data.projects || [];
      }
    } catch (error) {
      console.error('Projects fetch error:', error);
    }
    return [];
  }

  // Update user context
  async updateUserContext(sessionId, userContext) {
    try {
      await fetch(`${this.baseUrl.replace('/chat', '/chat/context')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId, userContext })
      });
    } catch (error) {
      console.error('Context update failed:', error);
    }
  }

  // Get conversation history
  async getConversationHistory(sessionId) {
    try {
      const response = await fetch(`${this.baseUrl.replace('/chat', '/chat/history')}/${sessionId}`);
      const data = await response.json();
      return data.history || [];
    } catch (error) {
      console.error('History retrieval failed:', error);
      return [];
    }
  }



  // Convert file to base64 for upload
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve({
          base64: base64,
          name: file.name,
          type: file.type,
          size: file.size
        });
      };
      reader.onerror = error => reject(error);
    });
  }

  // Enhanced message processing with context management
  async processMessage(userMessage, conversationHistory, mode, file = null, userContext = {}, sessionId = null) {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    // Check if user is asking about projects
    const projectKeywords = ['project', 'codehub', 'telecom', 'inventory', 'github', 'demo', 'built', 'created'];
    const isProjectQuery = projectKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );

    let enhancedMessage = userMessage;

    // Fetch and inject project context if relevant
    if (isProjectQuery) {
      const projects = await this.fetchProjects();
      if (projects.length > 0) {
        const projectContext = projects.map(p => 
          `${p.title}: ${p.description} (Stack: ${p.technologies?.join(', ') || 'N/A'})`
        ).join('\n');
        
        enhancedMessage = `${userMessage}\n\nContext - My Projects:\n${projectContext}`;
        messages[messages.length - 1].content = enhancedMessage;
      }
    }

    return await this.sendMessage(messages, mode, file, userContext, sessionId);
  }
}

const chatService = new ChatService();
export default chatService;