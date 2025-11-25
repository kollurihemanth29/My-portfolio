const fetch = require('node-fetch');

async function testLyzrAPI() {
  const LYZR_API_KEY = 'sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W';
  const AGENT_ID = '69259a68c69ec8d9a07849bc';
  
  const payload = {
    agent_id: AGENT_ID,
    messages: [
      { role: 'user', content: 'Hello, this is a test message' }
    ],
    temperature: 0.7,
    top_p: 0.9
  };
  
  try {
    console.log('Testing Lyzr API connection...');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch('https://api.lyzr.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY,
        'Authorization': `Bearer ${LYZR_API_KEY}`
      },
      body: JSON.stringify(payload),
      timeout: 10000
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    if (response.ok) {
      const data = await response.json();
      console.log('SUCCESS! Lyzr API Response:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('ERROR Response:', errorText);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testLyzrAPI();