const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5050/api';

async function testAPI() {
  console.log('🧪 Testing DigiChit API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test signup endpoint
    console.log('\n2. Testing signup endpoint...');
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!'
    };

    const signupResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    const signupResult = await signupResponse.json();
    
    if (signupResponse.ok) {
      console.log('✅ Signup successful:', signupResult.message);
      console.log('   User ID:', signupResult.data.user.id);
      console.log('   Token received:', !!signupResult.data.token);
    } else {
      console.log('❌ Signup failed:', signupResult.message);
      if (signupResult.errors) {
        signupResult.errors.forEach(error => {
          console.log(`   - ${error.field}: ${error.message}`);
        });
      }
    }

    // Test signin endpoint
    console.log('\n3. Testing signin endpoint...');
    const signinData = {
      email: 'test@example.com',
      password: 'TestPass123!'
    };

    const signinResponse = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signinData),
    });

    const signinResult = await signinResponse.json();
    
    if (signinResponse.ok) {
      console.log('✅ Signin successful:', signinResult.message);
      console.log('   User:', signinResult.data.user.name);
      console.log('   Token received:', !!signinResult.data.token);
      
      // Test protected route
      console.log('\n4. Testing protected route...');
      const token = signinResult.data.token;
      
      const meResponse = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const meResult = await meResponse.json();
      
      if (meResponse.ok) {
        console.log('✅ Protected route successful:', meResult.data.user.name);
      } else {
        console.log('❌ Protected route failed:', meResult.message);
      }
    } else {
      console.log('❌ Signin failed:', signinResult.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running on port 5000');
  }
}

// Run the test
testAPI(); 