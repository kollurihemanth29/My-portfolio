const fetch = require('node-fetch');

// Lyzr Configuration
const LYZR_API_KEY = 'sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W';
const AGENT_ID = '69259a68c69ec8d9a07849bc';
const BASE_URL = 'https://agent-prod.studio.lyzr.ai';

async function tryAllChatEndpoints() {
  console.log('🔍 TESTING ALL POSSIBLE CHAT ENDPOINTS & METHODS');
  console.log('=' .repeat(60));
  
  // From the OpenAPI spec, let's try all chat-related endpoints
  const endpoints = [
    { 
      path: '/v3/inference/chat', 
      methods: ['POST', 'GET', 'PUT'], 
      description: 'Main chat inference endpoint' 
    },
    { 
      path: `/v3/inference/${AGENT_ID}/generate_response/`, 
      methods: ['POST'], 
      description: 'Generate response with agent ID in path' 
    },
    { 
      path: '/v3/inference/chat_completions', 
      methods: ['POST'], 
      description: 'OpenAI-style chat completions' 
    },
    { 
      path: '/chat_completions', 
      methods: ['POST'], 
      description: 'Direct chat completions' 
    }
  ];

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': LYZR_API_KEY,
    'Accept': 'application/json'
  };

  const testPayloads = [
    // Standard Lyzr format
    {
      name: "Lyzr Standard Format",
      payload: {
        user_id: 'test-user',
        agent_id: AGENT_ID,
        session_id: 'test-session-' + Date.now(),
        message: 'Hello! Please introduce yourself.',
        system_prompt_variables: {},
        filter_variables: {}
      }
    },
    // OpenAI-style format
    {
      name: "OpenAI Style Format",
      payload: {
        messages: [
          { role: 'user', content: 'Hello! Please introduce yourself.' }
        ],
        stream: false
      }
    },
    // Generate response format (from OpenAPI spec)
    {
      name: "Generate Response Format",
      payload: {
        messages: [
          { role: 'user', content: 'Hello! Please introduce yourself.' }
        ],
        response_format: null,
        run_id: null,
        ops_metadata: null
      }
    }
  ];

  for (const endpoint of endpoints) {
    console.log(`\n📡 Testing: ${endpoint.path}`);
    console.log(`📝 Description: ${endpoint.description}`);
    
    for (const method of endpoint.methods) {
      console.log(`\n   🔧 Method: ${method}`);
      
      if (method === 'GET') {
        // For GET requests, try without payload
        try {
          const response = await fetch(`${BASE_URL}${endpoint.path}`, {
            method: 'GET',
            headers: { 'x-api-key': LYZR_API_KEY, 'Accept': 'application/json' },
            timeout: 10000
          });
          
          console.log(`   📊 ${method} Status: ${response.status} ${response.statusText}`);
          
          if (response.status !== 405 && response.status !== 404) {
            const responseText = await response.text();
            console.log(`   📝 Response: ${responseText.substring(0, 300)}${responseText.length > 300 ? '...' : ''}`);
          }
        } catch (error) {
          console.log(`   ❌ ${method} Error: ${error.message}`);
        }
      } else {
        // For POST/PUT requests, try different payload formats
        for (const payloadFormat of testPayloads) {
          try {
            console.log(`      📦 Payload: ${payloadFormat.name}`);
            
            const response = await fetch(`${BASE_URL}${endpoint.path}`, {
              method: method,
              headers: headers,
              body: JSON.stringify(payloadFormat.payload),
              timeout: 10000
            });
            
            console.log(`      📊 ${method} Status: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
              const data = await response.json();
              console.log('      ✅ SUCCESS! Found working combination!');
              console.log(`      🎯 Endpoint: ${BASE_URL}${endpoint.path}`);
              console.log(`      🔧 Method: ${method}`);
              console.log(`      📦 Payload Format: ${payloadFormat.name}`);
              console.log(`      📝 Response: ${JSON.stringify(data, null, 2)}`);
              return {
                success: true,
                endpoint: `${BASE_URL}${endpoint.path}`,
                method: method,
                payloadFormat: payloadFormat.name,
                payload: payloadFormat.payload,
                response: data
              };
            } else if (response.status === 400 || response.status === 422) {
              // These are validation errors, not method errors - good sign!
              const errorText = await response.text();
              console.log(`      ⚠️  Validation Error (${response.status}): ${errorText.substring(0, 200)}...`);
              
              try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.detail && Array.isArray(errorJson.detail)) {
                  console.log(`      📝 Validation Details:`);
                  errorJson.detail.forEach(detail => {
                    console.log(`         • ${detail.msg} at ${JSON.stringify(detail.loc)}`);
                  });
                }
              } catch (e) {
                // Couldn't parse as JSON, that's ok
              }
            } else if (response.status !== 405 && response.status !== 404) {
              const errorText = await response.text();
              console.log(`      📝 Error (${response.status}): ${errorText.substring(0, 200)}${errorText.length > 200 ? '...' : ''}`);
            }
            
          } catch (error) {
            console.log(`      ❌ ${method} Error: ${error.message}`);
          }
        }
      }
    }
  }
  
  return { success: false };
}

tryAllChatEndpoints().then(result => {
  if (!result.success) {
    console.log('\n🔍 ANALYSIS:');
    console.log('• The API server is responding (not connection issues)');
    console.log('• The API key authentication seems to work (no 403 errors)');
    console.log('• Getting 405 Method Not Allowed suggests endpoint/method mismatch');
    console.log('• May need to check Lyzr documentation for latest API changes');
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Contact Lyzr support for current API documentation');
    console.log('2. Check if the agent ID is valid and active');
    console.log('3. Verify API key has proper permissions');
  }
}).catch(console.error);