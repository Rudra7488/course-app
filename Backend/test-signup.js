import axios from 'axios';

async function testSignup() {
    try {
        const response = await axios.post('http://localhost:5000/user/signup', {
            firstname: 'Test',
            lastname: 'User',
            email: 'testuser@example.com',
            password: 'password123'
        });
        
        console.log('Signup successful:', response.data);
    } catch (error) {
        console.error('Signup failed:', error.response?.data || error.message);
    }
}

testSignup();