const fetch = require('node-fetch');

// Lyzr Configuration
const LYZR_API_KEY = 'sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W';
const AGENT_ID = '69259a68c69ec8d9a07849bc';

// Updated API endpoints for Lyzr v3
const LYZR_API_ENDPOINTS = [
  'https://api.lyzr.app/v3/inference/chat',
  'https://lyzr.app/api/v3/inference/chat',
  'https://api.lyzr.ai/v3/inference/chat',
  'https://lyzr.ai/api/v3/inference/chat'
];

async function testLyzrAPI() {
  console.log('🧪 Testing Lyzr API Connection...\n');
  
  const testPayload = {
    agent_id: AGENT_ID,
    user_id: 'test-user',
    messages: [
      {
        role: 'user',
        content: 'Hello, can you introduce yourself briefly?'
      }
    ],
    temperature: 0.7,
    max_tokens: 100,
    stream: false
  };

  for (let i = 0; i < LYZR_API_ENDPOINTS.length; i++) {
    const endpoint = LYZR_API_ENDPOINTS[i];
    console.log(`📡 Testing endpoint ${i + 1}/${LYZR_API_ENDPOINTS.length}: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': LYZR_API_KEY,
          'Authorization': `Bearer ${LYZR_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(testPayload),
        timeout: 10000
      });

      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ SUCCESS! API Response received:');
        console.log('   📝 Response:', JSON.stringify(data, null, 2));
        console.log('\n🎉 Working endpoint found:', endpoint);
        return { success: true, endpoint, data };
      } else {
        const errorText = await response.text();
        console.log(`   ❌ HTTP Error: ${response.status}`);
        console.log(`   📝 Error details: ${errorText}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
      
      if (error.code === 'ENOTFOUND') {
        console.log('   🔍 DNS Resolution Failed - Domain not accessible');
      } else if (error.code === 'ETIMEDOUT') {
        console.log('   ⏰ Request Timeout - Server not responding');
      } else if (error.code === 'ECONNREFUSED') {
        console.log('   🚫 Connection Refused - Service not running');
      }
    }
    
    console.log(''); // Add spacing between tests
  }

  console.log('❌ All endpoints failed. Lyzr API may be temporarily unavailable.');
  return { success: false };
}

// Additional DNS test
async function testDNS() {
  console.log('🔍 Testing DNS Resolution for Lyzr domains...\n');
  
  const domains = ['api.lyzr.app', 'lyzr.app', 'api.lyzr.ai', 'lyzr.ai'];
  
  for (const domain of domains) {
    try {
      const testUrl = `https://${domain}`;
      console.log(`🌐 Testing ${domain}...`);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        timeout: 5000
      });
      
      console.log(`   ✅ ${domain} is accessible (${response.status})`);
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        console.log(`   ❌ ${domain} - DNS resolution failed`);
      } else {
        console.log(`   ⚠️  ${domain} - ${error.message}`);
      }
    }
  }
  console.log('');
}

// Run tests
async function runAllTests() {
  await testDNS();
  await testLyzrAPI();
}

runAllTests().catch(console.error);