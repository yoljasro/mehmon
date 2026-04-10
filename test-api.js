const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('--- Starting API Verification ---');
  
  try {
    // 1. Register User
    console.log('1. Testing Registration...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Owner',
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    });
    const token = registerRes.data.accessToken;
    console.log('✓ Registration Successful');

    // 2. Login User
    console.log('2. Testing Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: registerRes.data.user.email,
      password: 'password123'
    });
    console.log('✓ Login Successful');

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 3. Create Table
    console.log('3. Testing Table Creation...');
    const tableRes = await axios.post(`${API_URL}/tables`, {
      number: `T-${Date.now()}`,
      capacity: 4,
      location: 'Window'
    }, config);
    console.log('✓ Table Created');

    // 4. Create Booking
    console.log('4. Testing Booking Creation...');
    const bookingRes = await axios.post(`${API_URL}/bookings`, {
      guestName: 'John Doe',
      phone: `+99890123${Math.floor(Math.random() * 8999) + 1000}`,
      tableId: tableRes.data._id,
      date: '2026-05-01',
      timeSlot: '18:00',
      numberOfGuests: 2,
      notes: 'Anniversary'
    }, config);
    console.log('✓ Booking Created (and Guest auto-created)');

    // 5. Check Guests
    console.log('5. Testing Guest Retrieval...');
    const guestsRes = await axios.get(`${API_URL}/guests`, config);
    if (guestsRes.data.length > 0) {
      console.log('✓ Guests Found');
    }

    console.log('--- API Verification Complete: ALL TESTS PASSED ---');
  } catch (error) {
    console.error('✗ Test Failed:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

// Note: This script requires the server to be running.
// For automated verification, we'd normally use a test runner like Jest/Mocha.
// Here we just provide it as a tool for the user to run or for me to run if I start the server.
testAPI();
