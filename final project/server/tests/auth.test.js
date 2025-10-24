const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    // Use real DB from env.example unless overridden - tests expect a running MongoDB
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('Register -> Login flow', async () => {
    const email = `test-${Date.now()}@example.com`;
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email, password: 'Password123' })
      .expect(201);
    expect(registerRes.body.data.accessToken).toBeDefined();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'Password123' })
      .expect(200);
    expect(loginRes.body.data.accessToken).toBeDefined();
  });

  test('Login with invalid credentials fails', async () => {
    await request(app).post('/api/auth/login').send({ email: 'nouser@example.com', password: 'x' }).expect(401);
  });
});
