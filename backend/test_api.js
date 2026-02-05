const API_URL = 'http://localhost:5000/api';

const testEndpoints = async () => {
    console.log('Testing API endpoints...');

    try {
        // Test Health
        console.log('Testing Health Check...');
        const healthRes = await fetch(`${API_URL}/health`);
        const healthData = await healthRes.json();
        console.log('✅ Health Check Passed:', healthData);

        // Test Recent Songs
        console.log('Testing Get Recent Songs...');
        const recentRes = await fetch(`${API_URL}/songs/recent?limit=5`);
        if (!recentRes.ok) throw new Error(`Recent Songs Failed: ${recentRes.status}`);
        const recentData = await recentRes.json();
        console.log('✅ Recent Songs Fetched:', recentData.data.length, 'songs');

        // Test All Songs
        console.log('Testing Get All Songs...');
        const allRes = await fetch(`${API_URL}/songs?limit=5`);
        if (!allRes.ok) throw new Error(`All Songs Failed: ${allRes.status}`);
        const allData = await allRes.json();
        console.log('✅ All Songs Fetched:', allData.data.length, 'songs');

    } catch (error) {
        console.error('❌ API Test Failed:', error.message);
    }
};

testEndpoints();
