const express = require('express');
const router = express.Router();

// Lyzr AI Chat endpoint - Direct API integration
router.post('/chat', async (req, res) => {
  try {
    const { messages, mode = 'developer', file = null, sessionId, userContext = {} } = req.body;
    
    // Extract user information for personalization
    const userName = userContext.name || extractUserName(messages);
    const conversationLength = messages.length;
    
    console.log(`Lyzr Chat Request - Mode: ${mode}, User: ${userName || 'Anonymous'}, Messages: ${conversationLength}`);
    
    // Lyzr API configuration from environment variables
    const LYZR_API_KEY = process.env.LYZR_API_KEY || 'sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W';
    const AGENT_ID = process.env.LYZR_AGENT_ID || '69259a68c69ec8d9a07849bc';
    // Working Lyzr API endpoint discovered through testing
    const LYZR_API_URL = `https://agent-prod.studio.lyzr.ai/v3/inference/${AGENT_ID}/generate_response/`;

    // Enhance user message with context for Lyzr API
    const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const contextEnhancedMessage = enhanceMessageWithContext(messages, mode, userName, userContext, file);
    
    // Update the messages array with enhanced context
    const enhancedMessages = [...messages];
    enhancedMessages[enhancedMessages.length - 1].content = contextEnhancedMessage;

    // Prepare payload for working Lyzr API format
    const payload = {
      messages: [
        { role: 'system', content: getSystemPrompt(mode, userName, userContext) },
        ...enhancedMessages
      ],
      response_format: null,
      run_id: `run-${Date.now()}-${sessionId}`,
      ops_metadata: {
        session_id: sessionId,
        user_id: sessionId || 'anonymous',
        mode: mode,
        timestamp: new Date().toISOString()
      }
    };

    // Note: File handling optimized for message context only
    // Large file payloads are handled via message context instead of direct upload

    // Make request to Lyzr API
    const fetch = require('node-fetch');
    let apiResponse = null;
    
    try {
      console.log(`Making Lyzr API call to: ${LYZR_API_URL}`);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(LYZR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': LYZR_API_KEY,  // lowercase 'x-api-key' as per working API spec
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        timeout: 30000  // Increased timeout for AI processing
      });

      console.log(`Lyzr API Response Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log('Lyzr API Response:', JSON.stringify(data, null, 2));
        
        // Lyzr API returns response in 'response' field
        apiResponse = data.response || 
                     data.content ||
                     data.message ||
                     JSON.stringify(data);
        
        // Check for Lyzr API errors in response
        if (apiResponse && typeof apiResponse === 'string' && apiResponse.includes('Error in LLM generation')) {
          console.warn('Lyzr API returned error in response:', apiResponse);
          // Continue processing, but log the warning
        }
        
      } else {
        const errorText = await response.text();
        console.error('Lyzr API Error Response:', errorText);
        throw new Error(`Lyzr API returned ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error calling Lyzr API:', error.message);
      console.error('Error details:', error);
      
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable. Please try again in a few moments.',
        error: 'Lyzr API connection failed',
        details: error.message,
        sessionId,
        timestamp: new Date().toISOString()
      });
    }
    
    // Return Lyzr API response
    if (apiResponse && typeof apiResponse === 'string' && apiResponse.trim()) {
      // Generate smart suggestions based on the response
      const suggestions = generateSmartSuggestions(mode, apiResponse);
      
      res.json({
        success: true,
        message: apiResponse.trim(),
        mode: mode,
        source: 'lyzr_api',
        suggestions: suggestions,
        userName: userName,
        sessionId: sessionId,
        timestamp: new Date().toISOString()
      });
    } else {
      // Return error if no valid response received
      console.error('No valid response received from Lyzr API');
      res.status(503).json({
        success: false,
        message: 'AI service returned an invalid response. Please try again.',
        error: 'Invalid Lyzr API response',
        sessionId,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Chat API Error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced system prompt for Lyzr agent
function getSystemPrompt(mode, userName, userContext) {
  const basePrompt = `You are Hemanth-AI, the intelligent assistant for Kolluri Hemanth's portfolio. You represent his personality, expertise, and professional experience.

PERSONALITY: Friendly, confident, knowledgeable developer and mentor. Use a conversational but professional tone. Be enthusiastic about technology and helping others.

CONTEXT:
- User: ${userName || 'Visitor'}
- Mode: ${mode}
- Conversation context: ${JSON.stringify(userContext)}

HEMANTH'S BACKGROUND:
- Full-Stack Developer specializing in React.js, Node.js, MongoDB
- Experience in building scalable web applications
- Passionate about AI/ML integration and modern development practices
- Strong foundation in both frontend and backend technologies

KEY PROJECTS:
- CodeHub: Social platform for developers (React, Node.js, MongoDB)
- Telecom Management System: Enterprise CRUD operations
- Portfolio Website: React frontend with AI chatbot integration

TECHNICAL SKILLS:
- Frontend: React.js, JavaScript (ES6+), HTML5, CSS3, Bootstrap
- Backend: Node.js, Express.js, RESTful APIs
- Databases: MongoDB, MySQL
- Tools: Git, GitHub, VS Code, Postman
- Cloud: AWS basics, Docker understanding

RESPONSE FORMATTING (CRITICAL - Follow ChatGPT/Gemini Style):
- Use clear headings and subheadings with proper formatting
- Structure responses with numbered lists, bullet points, and sections  
- Include relevant emojis for visual appeal and categorization
- Use **bold text** for emphasis and key points
- Create logical flow: Introduction -> Main Content -> Actionable Steps -> Conclusion
- Add code blocks with proper syntax highlighting when showing code
- Use tables or structured comparisons when appropriate
- Include practical examples and real-world applications
- End with clear next steps or follow-up questions
- Keep paragraphs concise and scannable

MODE-SPECIFIC INSTRUCTIONS:
${getModeInstructions(mode)}

RESUME ANALYSIS GUIDANCE:
When a user uploads a resume file, provide detailed feedback on:
- Overall structure and formatting
- Technical skills section optimization
- Project descriptions and impact quantification
- ATS (Applicant Tracking System) compatibility
- Industry-specific keywords and buzzwords
- Contact information and professional summary
- Experience section with action verbs and metrics
- Education and certification presentation

ALWAYS:
- Structure responses professionally with clear headings, bullet points, and logical sections
- Use formatting elements: emojis, bold text, code blocks, and numbered lists for clarity
- Provide specific, actionable advice with step-by-step guidance
- Include practical examples from Hemanth's work and industry best practices
- Be encouraging and supportive while maintaining professionalism
- Create scannable content with short paragraphs and visual hierarchy
- End with clear next steps or thought-provoking follow-up questions
- Personalize responses using the user's name and context when available
- When files are mentioned, acknowledge them and provide comprehensive structured analysis
- For technical topics, include code examples, best practices, and implementation tips
- Match the response depth to the user's question complexity and expertise level`;

  return basePrompt;
}

function getModeInstructions(mode) {
  const instructions = {
    developer: '🔧 Developer Mode - Technical Excellence\n- Provide structured technical analysis with clear code examples\n- Use headings like "## Architecture Overview", "## Implementation Steps", "## Best Practices"\n- Include code blocks with syntax highlighting and explanations\n- Break down complex concepts into digestible sections\n- Add performance tips and security considerations\n- End with actionable next steps and learning resources',
    designer: '🎨 Design Mode - Creative Solutions\n- Structure responses with visual hierarchy: "## Design Analysis", "## UX Recommendations"\n- Use bullet points for design principles and guidelines\n- Include before/after comparisons and improvement suggestions\n- Add color theory, typography, and layout sections when relevant\n- Provide actionable design tasks with tool recommendations',
    mentor: '🚀 Mentor Mode - Growth & Guidance\n- Format as structured learning path: "## Current State -> ## Goals -> ## Action Plan"\n- Use numbered steps for career progression advice\n- Include milestone markers and success metrics\n- Add resource recommendations with links and descriptions\n- Create weekly/monthly action items for skill development',
    career: '📈 Career Mode - Strategic Planning\n- Structure with career framework: "## Assessment -> ## Strategy -> ## Execution"\n- Use comparison tables for job opportunities and skills\n- Include timeline-based planning with clear milestones\n- Add market analysis and industry insights sections\n- Provide interview prep checklists and networking strategies',
    resume: '📄 Resume Mode - Professional Enhancement\n- Format analysis as: "## Overall Assessment -> ## Section-by-Section Review -> ## Action Items"\n- Use scoring system (1-10) for different resume sections\n- Create before/after examples for improvements\n- Include ATS optimization checklist with specific keywords\n- Add industry-specific recommendations with formatting guidelines\n- Provide 30-60-90 day improvement timeline'
  };
  
  return instructions[mode] || instructions.developer;
}
  


// Extract user name from conversation
function extractUserName(messages) {
  for (const msg of messages) {
    if (msg.role === 'user') {
      const nameMatch = msg.content.match(/(?:i'm|i am|my name is|call me)\s+([a-zA-Z]{2,15})/i);
      if (nameMatch) return nameMatch[1];
      
      // Simple name detection for short responses
      if (msg.content.match(/^[a-zA-Z]{2,15}$/) && messages.length <= 3) {
        return msg.content;
      }
    }
  }
  return null;
}

// Enhanced message context processing for Lyzr API
function enhanceMessageWithContext(messages, mode, userName, userContext, file) {
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  let contextInfo = [];
  
  if (userName) {
    contextInfo.push(`User name: ${userName}`);
  }
  
  if (userContext.firstInteraction) {
    const daysSinceFirst = Math.floor((Date.now() - new Date(userContext.firstInteraction)) / (1000 * 60 * 60 * 24));
    if (daysSinceFirst > 0) {
      contextInfo.push(`Returning user (${daysSinceFirst} days ago)`);
    } else {
      contextInfo.push('First-time user');
    }
  }
  
  if (file) {
    contextInfo.push(`Resume file uploaded: ${file.name} (${file.type}, ${(file.size/1024).toFixed(1)}KB) - The user has shared their resume for analysis. Based on the filename and document type, please provide comprehensive resume feedback including: structure and formatting review, content analysis for key sections (summary, experience, skills, education), ATS optimization suggestions, industry-specific recommendations, and actionable improvement tips. Focus on both technical accuracy and presentation quality.`);
  }
  
  if (contextInfo.length > 0) {
    return `${lastMessage}\n\n[Context: ${contextInfo.join(', ')}]`;
  }
  
  return lastMessage;
}



// Generate contextual suggestions
function generateSmartSuggestions(mode, apiResponse) {
  const baseSuggestions = {
    developer: [
      "Show me the technical architecture",
      "What frameworks does he prefer?",
      "Can you explain his coding approach?",
      "Tell me about his development process"
    ],
    designer: [
      "Show me his design philosophy",
      "What UI/UX principles does he follow?",
      "Can you show design examples?",
      "How does he approach user experience?"
    ],
    mentor: [
      "What advice would he give beginners?",
      "How can I improve my skills?",
      "What's his learning journey?",
      "Can you suggest a roadmap?"
    ],
    career: [
      "How can I stand out to employers?",
      "What makes a strong portfolio?",
      "Interview preparation tips?",
      "Industry trends and advice?"
    ],
    resume: [
      "Upload my resume for review",
      "ATS optimization tips?",
      "How to highlight technical skills?",
      "What employers look for?"
    ]
  };
  
  // Return mode-specific suggestions
  return baseSuggestions[mode] || baseSuggestions.developer;
}

// User context management endpoint
router.post('/chat/context', async (req, res) => {
  try {
    const { sessionId, userContext } = req.body;
    
    // In production, this would be stored in Redis or database
    // For now, we'll just acknowledge the context update
    
    res.json({
      success: true,
      message: 'Context updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update context'
    });
  }
});

// Chat history endpoint
router.get('/chat/history/:sessionId', async (req, res) => {
  try {
    // In production, retrieve from database
    res.json({
      success: true,
      history: [], // Would contain previous conversations
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve history'
    });
  }
});

module.exports = router;