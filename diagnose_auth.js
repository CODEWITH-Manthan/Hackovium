const axios = require('axios');

async function testAuth() {
  const baseURL = 'http://localhost:5002/api';
  const timestamp = Date.now();
  const username = `testuser_${timestamp}@example.com`;
  const password = 'testpassword123';

  console.log(`[TEST] Testing registration for: ${username}`);
  try {
    const regRes = await axios.post(`${baseURL}/register`, { username, password });
    console.log('[TEST] Registration success:', regRes.data);

    console.log('[TEST] Testing login...');
    const loginRes = await axios.post(`${baseURL}/login`, { username, password });
    console.log('[TEST] Login success. Token received.');
    const token = loginRes.data.token;

    console.log('[TEST] Testing profile creation...');
    const profileRes = await axios.post(`${baseURL}/solar-profile`, {
      profileName: `Profile_${timestamp}`,
      panelCapacity: 5.5,
      panelEfficiency: 20,
      tiltAngle: 15,
      locationCity: 'Mumbai',
      estimatedGeneration: 4.5
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('[TEST] Profile creation success:', profileRes.data.id);

    console.log('[TEST] Testing profile listing...');
    const listRes = await axios.get(`${baseURL}/solar-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('[TEST] Profiles listed count:', listRes.data.length);

    console.log('[TEST] ALL AUTH & PROFILE TESTS PASSED!');
  } catch (err) {
    console.error('[TEST] ERROR:', err.response?.data || err.message);
    if (err.response?.status === 401) console.error('[TEST] Token might be rejected.');
  }
}

testAuth();
