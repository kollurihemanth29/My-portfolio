const fetch = require('node-fetch');

// Lyzr Configuration
const LYZR_API_KEY = 'sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W';
const AGENT_ID = '69259a68c69ec8d9a07849bc';

// Comprehensive list of possible Lyzr API endpoints
const LYZR_API_ENDPOINTS = [
  // Studio endpoints (from documentation)
  'https://agent-prod.studio.lyzr.ai/v1/chat/completions',
  'https://agent-prod.studio.lyzr.ai/v3/inference/chat',
  'https://agent-prod.studio.lyzr.ai/api/v1/chat',
  'https://agent-prod.studio.lyzr.ai/api/v3/inference/chat',
  
  // Studio alternative formats
  'https://studio.lyzr.ai/api/v1/chat/completions',
  'https://studio.lyzr.ai/api/v3/inference/chat',
  
  // Lyzr.app endpoints (since domain is accessible)
  'https://lyzr.app/api/v1/chat/completions',
  'https://lyzr.app/api/v3/inference/chat',
  'https://lyzr.app/v1/chat/completions',
  'https://lyzr.app/v3/inference/chat',
  
  // Alternative patterns
  'https://api.studio.lyzr.ai/v1/chat/completions',
  'https://api.studio.lyzr.ai/v3/inference/chat'
];

async function testLyzrEndpoint(endpoint, testNumber, total) {
  console.log(`\n📡 [${testNumber}/${total}] Testing: ${endpoint}`);
  
  // Different payload formats to test
  const payloadFormats = [
    {
      name: "Standard Chat Format",
      payload: {
        agent_id: AGENT_ID,
        messages: [
          { role: 'user', content: 'Hello, please introduce yourself briefly.' }
        ],
        temperature: 0.7,
        max_tokens: 100
      }
    },
    {
      name: "Extended Format with User ID",
      payload: {
        agent_id: AGENT_ID,
        user_id: 'test-user',
        messages: [
          { role: 'user', content: 'Hello, please introduce yourself briefly.' }
        ],
        temperature: 0.7,
        max_tokens: 100,
        stream: false
      }
    }
  ];

  // Different authentication methods
  const authMethods = [
    {
      name: "X-API-Key + Bearer",
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': LYZR_API_KEY,
        'Authorization': `Bearer ${LYZR_API_KEY}`,
        'Accept': 'application/json'
      }
    },
    {
      name: "Authorization Bearer Only",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LYZR_API_KEY}`,
        'Accept': 'application/json'
      }
    },
    {
      name: "X-API-Key Only",
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': LYZR_API_KEY,
        'Accept': 'application/json'
      }
    }
  ];

  for (let authMethod of authMethods) {
    for (let payloadFormat of payloadFormats) {
      try {
        console.log(`   🔑 Auth: ${authMethod.name} | 📦 Format: ${payloadFormat.name}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: authMethod.headers,
          body: JSON.stringify(payloadFormat.payload),
          timeout: 8000
        });

        console.log(`   📊 Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('   ✅ SUCCESS! API Response received:');
          console.log('   📝 Response:', JSON.stringify(data, null, 2));
          console.log(`\n🎉 WORKING CONFIGURATION FOUND!`);
          console.log(`🔗 Endpoint: ${endpoint}`);
          console.log(`🔑 Auth Method: ${authMethod.name}`);
          console.log(`📦 Payload Format: ${payloadFormat.name}`);
          return { 
            success: true, 
            endpoint, 
            authMethod: authMethod.name,
            payloadFormat: payloadFormat.name,
            data 
          };
        } else {
          const errorText = await response.text();
          console.log(`   ❌ Error ${response.status}: ${errorText.substring(0, 200)}${errorText.length > 200 ? '...' : ''}`);
        }
        
      } catch (error) {
        if (error.code === 'ENOTFOUND') {
          console.log(`   ❌ DNS Failed: ${error.message}`);
          break; // No point trying other auth methods if DNS fails
        } else if (error.code === 'ETIMEDOUT') {
          console.log(`   ⏰ Timeout: ${error.message}`);
        } else if (error.code === 'ECONNREFUSED') {
          console.log(`   🚫 Connection Refused: ${error.message}`);
          break; // No point trying other auth methods if connection is refused
        } else {
          console.log(`   ❌ Network Error: ${error.message}`);
        }
      }
    }
  }

  return { success: false };
}

async function testAllEndpoints() {
  console.log('🧪 COMPREHENSIVE LYZR API TESTING');
  console.log('=' .repeat(50));
  
  for (let i = 0; i < LYZR_API_ENDPOINTS.length; i++) {
    const result = await testLyzrEndpoint(LYZR_API_ENDPOINTS[i], i + 1, LYZR_API_ENDPOINTS.length);
    
    if (result.success) {
      console.log('\n🎯 TEST COMPLETED SUCCESSFULLY!');
      return result;
    }
    
    // Add delay between tests to avoid rate limiting
    if (i < LYZR_API_ENDPOINTS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n❌ ALL TESTS FAILED');
  console.log('🔍 Possible issues:');
  console.log('   • API endpoints have changed');
  console.log('   • Authentication method is different'); 
  console.log('   • Service is temporarily unavailable');
  console.log('   • Different payload format required');
  console.log('   • Rate limiting or IP restrictions');
  
  return { success: false };
}

// Run comprehensive tests
testAllEndpoints().catch(console.error);