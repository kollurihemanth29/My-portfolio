const fetch = require('node-fetch');

// Lyzr Configuration
const LYZR_API_KEY = 'sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W';
const AGENT_ID = '69259a68c69ec8d9a07849bc';

// Base URL that we know works
const BASE_URL = 'https://agent-prod.studio.lyzr.ai';

async function exploreAPI() {
  console.log('🔍 EXPLORING LYZR API STRUCTURE');
  console.log('=' .repeat(50));
  
  // Common API paths to explore
  const pathsToCheck = [
    '/docs',
    '/openapi.json',
    '/api/v1',
    '/v1',
    '/api/v3',
    '/v3',
    '/health',
    '/status',
    '/agents',
    '/chat',
    '/inference'
  ];
  
  const headers = {
    'X-API-Key': LYZR_API_KEY,
    'Accept': 'application/json',
    'User-Agent': 'Lyzr-Portfolio-Integration/1.0'
  };
  
  for (const path of pathsToCheck) {
    try {
      console.log(`\n📡 GET ${BASE_URL}${path}`);
      
      const response = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: headers,
        timeout: 5000
      });
      
      console.log(`   📊 Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log(`   📄 Content-Type: ${contentType}`);
        
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log(`   📝 Response: ${JSON.stringify(data, null, 2)}`);
        } else {
          const text = await response.text();
          console.log(`   📝 Response: ${text.substring(0, 300)}${text.length > 300 ? '...' : ''}`);
        }
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Error: ${errorText.substring(0, 200)}${errorText.length > 200 ? '...' : ''}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

// Try to find the specific agent endpoint
async function testAgentEndpoints() {
  console.log('\n\n🤖 TESTING AGENT-SPECIFIC ENDPOINTS');
  console.log('=' .repeat(50));
  
  const agentEndpoints = [
    `/agents/${AGENT_ID}`,
    `/agents/${AGENT_ID}/chat`,
    `/agents/${AGENT_ID}/inference`,
    `/agents/${AGENT_ID}/completions`,
    `/api/agents/${AGENT_ID}/chat`,
    `/v1/agents/${AGENT_ID}/chat`,
    `/v3/agents/${AGENT_ID}/inference`,
    `/agent/${AGENT_ID}/chat`,
    `/agent/${AGENT_ID}/inference`
  ];
  
  const headers = {
    'X-API-Key': LYZR_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  const testPayload = {
    messages: [
      { role: 'user', content: 'Hello' }
    ],
    temperature: 0.7,
    max_tokens: 50
  };
  
  for (const endpoint of agentEndpoints) {
    try {
      console.log(`\n📡 Testing Agent Endpoint: ${endpoint}`);
      
      // Try GET first to see if endpoint exists
      const getResponse = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: { 'X-API-Key': LYZR_API_KEY, 'Accept': 'application/json' },
        timeout: 5000
      });
      
      console.log(`   📊 GET Status: ${getResponse.status} ${getResponse.statusText}`);
      
      // If GET doesn't give 404, try POST
      if (getResponse.status !== 404) {
        const postResponse = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(testPayload),
          timeout: 5000
        });
        
        console.log(`   📊 POST Status: ${postResponse.status} ${postResponse.statusText}`);
        
        if (postResponse.ok) {
          const data = await postResponse.json();
          console.log('   ✅ SUCCESS! Found working endpoint!');
          console.log(`   📝 Response: ${JSON.stringify(data, null, 2)}`);
          return { success: true, endpoint: `${BASE_URL}${endpoint}`, data };
        } else if (postResponse.status !== 404 && postResponse.status !== 405) {
          const errorText = await postResponse.text();
          console.log(`   📝 Error Details: ${errorText.substring(0, 300)}${errorText.length > 300 ? '...' : ''}`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  return { success: false };
}

async function runFullExploration() {
  await exploreAPI();
  const agentResult = await testAgentEndpoints();
  
  if (!agentResult.success) {
    console.log('\n🔍 NEXT STEPS:');
    console.log('1. Check the API documentation at: https://agent-prod.studio.lyzr.ai/docs');
    console.log('2. The API key is valid (no 403 errors with X-API-Key)');
    console.log('3. The server is responding (no DNS/connection errors)');
    console.log('4. Need to find the correct endpoint path and HTTP method');
  }
}

runFullExploration().catch(console.error);