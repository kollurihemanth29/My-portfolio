const fetch = require('node-fetch');

// Lyzr Configuration
const LYZR_API_KEY = 'sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W';
const AGENT_ID = '69259a68c69ec8d9a07849bc';

// WORKING ENDPOINT
const LYZR_API_URL = `https://agent-prod.studio.lyzr.ai/v3/inference/${AGENT_ID}/generate_response/`;

async function testWorkingLyzrAPI() {
  console.log('🎯 TESTING WORKING LYZR API ENDPOINT');
  console.log('=' .repeat(50));
  console.log(`🔗 Endpoint: ${LYZR_API_URL}`);
  console.log('');
  
  // Correct payload format based on validation error feedback
  const payload = {
    messages: [
      {
        role: 'user',
        content: 'Hello! Please introduce yourself as my AI career assistant for this portfolio website.'
      }
    ],
    response_format: null,
    run_id: null,
    ops_metadata: null
  };
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': LYZR_API_KEY,
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
      timeout: 30000  // Longer timeout for AI response
    });
    
    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    console.log(`📄 Content-Type: ${response.headers.get('content-type')}`);
    console.log('');
    
    if (response.ok) {
      const data = await response.json();
      console.log('🎉 SUCCESS! Lyzr API is working perfectly!');
      console.log('✅ AI Response Received:');
      console.log(JSON.stringify(data, null, 2));
      
      return { 
        success: true, 
        data,
        endpoint: LYZR_API_URL,
        method: 'POST',
        payload_format: payload,
        headers_format: headers
      };
      
    } else {
      const errorText = await response.text();
      console.log(`❌ API Error (${response.status}):`);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.log('📝 Parsed Error Details:', JSON.stringify(errorJson, null, 2));
        
        if (errorJson.detail && Array.isArray(errorJson.detail)) {
          console.log('\n📋 Validation Issues:');
          errorJson.detail.forEach((detail, index) => {
            console.log(`${index + 1}. ${detail.msg} at ${JSON.stringify(detail.loc)}`);
          });
        }
      } catch (e) {
        console.log('📝 Raw Error Text:', errorText);
      }
      
      return { success: false, error: errorText, status: response.status };
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return { success: false, error: error.message, code: error.code };
  }
}

// Test multiple message formats to find what works
async function testMultipleFormats() {
  console.log('🧪 TESTING MULTIPLE MESSAGE FORMATS');
  console.log('=' .repeat(40));
  
  const messageFormats = [
    {
      name: "Simple String Messages",
      messages: [
        { role: 'user', content: 'Hello! Please introduce yourself briefly.' }
      ]
    },
    {
      name: "With System Message",
      messages: [
        { role: 'system', content: 'You are a helpful AI career assistant for a portfolio website.' },
        { role: 'user', content: 'Hello! Please introduce yourself briefly.' }
      ]
    },
    {
      name: "Detailed Message Objects",
      messages: [
        { 
          role: 'user', 
          content: 'Hello! Please introduce yourself as my AI career assistant.',
          timestamp: new Date().toISOString()
        }
      ]
    }
  ];
  
  for (const format of messageFormats) {
    console.log(`\n🔧 Testing: ${format.name}`);
    
    const testPayload = {
      messages: format.messages,
      response_format: null,
      run_id: `test-run-${Date.now()}`,
      ops_metadata: {
        test: true,
        format: format.name
      }
    };
    
    try {
      const response = await fetch(LYZR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': LYZR_API_KEY,
          'Accept': 'application/json'
        },
        body: JSON.stringify(testPayload),
        timeout: 20000
      });
      
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS with this format!');
        console.log('📝 AI Response:', JSON.stringify(data, null, 2));
        
        // Return the successful configuration
        return {
          success: true,
          working_format: format.name,
          endpoint: LYZR_API_URL,
          payload: testPayload,
          response: data
        };
      } else if (response.status === 422) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.log('⚠️  Validation issues:', errorJson.detail?.map(d => d.msg).join(', '));
        } catch (e) {
          console.log('⚠️  Validation error:', errorText.substring(0, 100));
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ Error: ${errorText.substring(0, 150)}${errorText.length > 150 ? '...' : ''}`);
      }
      
    } catch (error) {
      console.log(`❌ Network error: ${error.message}`);
    }
    
    // Wait between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return { success: false };
}

async function runCompleteAPITest() {
  console.log('🚀 COMPLETE LYZR API INTEGRATION TEST');
  console.log('=' .repeat(60));
  
  // First try the basic working format
  let result = await testWorkingLyzrAPI();
  
  if (!result.success) {
    console.log('\n🔄 Basic format failed, trying alternative formats...');
    result = await testMultipleFormats();
  }
  
  if (result.success) {
    console.log('\n🎉 LYZR API INTEGRATION SUCCESSFUL!');
    console.log('=' .repeat(50));
    console.log(`✅ Working Endpoint: ${result.endpoint || LYZR_API_URL}`);
    console.log('✅ Authentication: x-api-key header');
    console.log('✅ Method: POST');
    console.log('✅ Payload format validated');
    console.log('\n🔧 Ready to update your backend with working configuration!');
    
    return result;
  } else {
    console.log('\n❌ All formats failed. Need further investigation.');
    console.log('💡 The endpoint exists and auth works - likely a payload format issue.');
  }
  
  return result;
}

runCompleteAPITest().catch(console.error);