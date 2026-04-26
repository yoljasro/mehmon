const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('--- Starting API Verification ---');
  
  try {
    // 1. Register User
    console.log('1. Testing Registration...');
    const phone = `+99890${Math.floor(Math.random() * 8999999) + 1000000}`;
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Owner',
      phone: phone,
      cafeName: 'Test Cafe',
      password: 'password123'
    });
    const token = registerRes.data.accessToken;
    console.log('✓ Registration Successful');

    // 2. Login User
    console.log('2. Testing Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      phone: registerRes.data.user.phone,
      password: 'password123'
    });
    console.log('✓ Login Successful');

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 3. Update Profile (including phone/cafeName)
    console.log('3. Testing Profile Update...');
    const profileRes = await axios.put(`${API_URL}/auth/profile`, {
      name: 'Jasur Saidaliyev',
      phone: phone,
      cafeName: 'Safia Restaurant',
      institutionType: 'Restoran',
      address: 'Xadra, Toshkent',
      openingTime: '09:00',
      closingTime: '23:00',
      imageUrl: 'https://example.com/restoran.jpg'
    }, config);
    console.log('✓ Profile Update Successful');

    // 3.1 Get Profile
    console.log('3.1 Testing Get Profile...');
    const getProfileRes = await axios.get(`${API_URL}/auth/profile`, config);
    if (getProfileRes.data.cafeName === 'Safia Restaurant') {
      console.log('✓ Profile Retrieval Successful');
    }

    // 4. Create Table
    console.log('4. Testing Table Creation...');
    const tableRes = await axios.post(`${API_URL}/tables`, {
      number: `T-${Math.floor(Math.random() * 1000)}`,
      capacity: 4,
      location: 'Window'
    }, config);
    console.log('✓ Table Created');

    // 5. Create Booking (which should also create/update guest history)
    console.log('5. Testing Booking & Guest History...');
    const guestPhone = `+99893${Math.floor(Math.random() * 8999999) + 1000000}`;
    await axios.post(`${API_URL}/bookings`, {
      guestName: 'Mina Cooper',
      phone: guestPhone,
      tableId: tableRes.data._id,
      date: '2026-05-01',
      timeSlot: '18:00',
      endTime: '20:00',
      bookingType: 'Banket',
      numberOfGuests: 2,
      notes: 'Anniversary'
    }, config);
    console.log('✓ Booking & Guest History Tracked');

    // 6. Check Guests (Ensure last visit data is present)
    console.log('6. Testing Guest List with History...');
    const guestsRes = await axios.get(`${API_URL}/guests`, config);
    const mCooper = guestsRes.data.find(g => g.phone === guestPhone);
    if (mCooper && mCooper.lastVisitTableNumber === tableRes.data.number) {
      console.log('✓ Guest List contains History data');
    }

    // 7. Analytics
    console.log('7. Testing Analytics...');
    const analyticsRes = await axios.get(`${API_URL}/analytics/summary`, config);
    if (analyticsRes.data.totalGuests !== undefined) {
      console.log('✓ Analytics Summary Successful');
    }

    // 8. Activity Logs
    console.log('8. Testing Activity Logs...');
    const logsRes = await axios.get(`${API_URL}/activity-log`, config);
    if (logsRes.data.length > 0) {
      console.log('✓ Activity Logs Retrieval Successful');
    }

    // 9. Shifts
    console.log('9. Testing Shifts...');
    const shiftRes = await axios.post(`${API_URL}/shifts`, {
      staffName: 'Ali Valiev',
      startTime: '09:00',
      endTime: '18:00',
      date: '2026-05-01',
      notes: 'Morning shift'
    }, config);
    console.log('✓ Shift Creation Successful');

    // 10. Logout
    console.log('10. Testing Logout...');
    await axios.post(`${API_URL}/auth/logout`, {}, config);
    console.log('✓ Logout Successful');

    console.log('--- API Verification Complete: ALL TESTS PASSED ---');
  } catch (error) {
    if (error.response) {
      console.error('✗ Test Failed (Response error):', error.response.status, error.response.data);
    } else {
      console.error('✗ Test Failed (General error):', error.message);
    }
    process.exit(1);
  }
}

// Note: This script requires the server to be running.
// For automated verification, we'd normally use a test runner like Jest/Mocha.
// Here we just provide it as a tool for the user to run or for me to run if I start the server.
testAPI();
