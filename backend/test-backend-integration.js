const fetch = require('node-fetch');

async function testBackendAPI() {
  console.log('🧪 Testing Updated Backend with Lyzr Integration');
  console.log('=' .repeat(50));
  
  const testPayload = {
    messages: [
      { role: 'user', content: 'Hello! Please introduce yourself as my AI career assistant.' }
    ],
    mode: 'career',
    sessionId: 'test-session-' + Date.now(),
    userContext: {
      name: 'Test User',
      firstInteraction: new Date().toISOString()
    }
  };
  
  try {
    console.log('📤 Sending request to backend API...');
    console.log('🔗 URL: http://localhost:5000/api/chat');
    console.log('📦 Payload:', JSON.stringify(testPayload, null, 2));
    console.log('');
    
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testPayload),
      timeout: 35000
    });
    
    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    console.log(`📄 Content-Type: ${response.headers.get('content-type')}`);
    console.log('');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Backend API is working!');
      console.log('🎉 Response from Lyzr through Backend:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.success && data.message) {
        console.log('\n🎯 AI Response Preview:');
        console.log(`"${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}"`);
        
        if (data.suggestions) {
          console.log('\n💡 Generated Suggestions:');
          data.suggestions.forEach((suggestion, index) => {
            console.log(`${index + 1}. ${suggestion}`);
          });
        }
        
        console.log('\n✅ Lyzr Integration Test: PASSED');
        console.log('🚀 Ready for frontend testing!');
      }
      
    } else {
      const errorText = await response.text();
      console.log('❌ Backend API Error:');
      console.log(errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.log('📝 Parsed Error:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.log('📝 Raw Error Text:', errorText);
      }
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    console.log('🔍 Error Code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on port 5000');
    }
  }
}

testBackendAPI().catch(console.error);