const fetch = require('node-fetch');

// Lyzr Configuration
const LYZR_API_KEY = 'sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W';
const AGENT_ID = '69259a68c69ec8d9a07849bc';

// CORRECT API ENDPOINT from OpenAPI spec
const LYZR_API_URL = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat';

async function testCorrectLyzrAPI() {
  console.log('🎯 TESTING CORRECT LYZR API ENDPOINT');
  console.log('=' .repeat(50));
  console.log(`🔗 Endpoint: ${LYZR_API_URL}`);
  console.log(`🤖 Agent ID: ${AGENT_ID}`);
  console.log(`🔑 API Key: ${LYZR_API_KEY.substring(0, 20)}...`);
  console.log('');
  
  // Correct payload format from OpenAPI spec
  const payload = {
    user_id: 'test-user',
    system_prompt_variables: {},
    agent_id: AGENT_ID,
    session_id: 'test-session-' + Date.now(),
    message: 'Hello! Please introduce yourself as my AI career assistant.',
    filter_variables: {},
    internal_call: false,
    simulation_mode: false
  };
  
  // Correct headers from OpenAPI spec
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': LYZR_API_KEY,  // Note: lowercase 'x-api-key' as per OpenAPI spec
    'Accept': 'application/json'
  };
  
  try {
    console.log('📤 Sending request to Lyzr API...');
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    console.log('');
    
    const response = await fetch(LYZR_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
      timeout: 15000
    });
    
    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    console.log(`📄 Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Lyzr API is working!');
      console.log('🎉 API Response:');
      console.log(JSON.stringify(data, null, 2));
      
      return { 
        success: true, 
        data,
        endpoint: LYZR_API_URL,
        payload_format: payload,
        headers_format: headers
      };
    } else {
      const errorText = await response.text();
      console.log('❌ API Error Response:');
      console.log(errorText);
      
      // Try to parse as JSON for better error details
      try {
        const errorJson = JSON.parse(errorText);
        console.log('📝 Parsed Error Details:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.log('📝 Raw Error Text:', errorText);
      }
      
      return { success: false, error: errorText, status: response.status };
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    console.log('🔍 Error Code:', error.code);
    console.log('🔍 Error Type:', error.type);
    
    return { success: false, error: error.message, code: error.code };
  }
}

// Also test the /health endpoint to confirm connectivity
async function testHealthEndpoint() {
  console.log('\n🏥 TESTING HEALTH ENDPOINT');
  console.log('=' .repeat(30));
  
  try {
    const healthResponse = await fetch('https://agent-prod.studio.lyzr.ai/health', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      timeout: 5000
    });
    
    console.log(`📊 Health Status: ${healthResponse.status} ${healthResponse.statusText}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Service Health:', JSON.stringify(healthData, null, 2));
      return true;
    }
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
    return false;
  }
}

async function runCompleteTest() {
  console.log('🧪 LYZR API INTEGRATION TEST');
  console.log('=' .repeat(60));
  console.log('Based on OpenAPI specification from:');
  console.log('https://agent-prod.studio.lyzr.ai/openapi.json');
  console.log('');
  
  // Test health first
  const healthOk = await testHealthEndpoint();
  
  if (healthOk) {
    console.log('\n✅ Service is healthy, proceeding with chat API test...\n');
    const result = await testCorrectLyzrAPI();
    
    if (result.success) {
      console.log('\n🎯 PERFECT! Ready to update your backend code with:');
      console.log(`🔗 Endpoint: ${result.endpoint}`);
      console.log('🔑 Headers: x-api-key (lowercase)');
      console.log('📦 Payload format validated');
      console.log('\n✅ Lyzr integration is ready for production!');
    } else {
      console.log('\n⚠️ API test failed, but we have the correct format.');
      console.log('🔍 Check API key validity or agent configuration.');
    }
  } else {
    console.log('\n❌ Service health check failed.');
    console.log('🔍 Check if the service is temporarily down.');
  }
}

runCompleteTest().catch(console.error);