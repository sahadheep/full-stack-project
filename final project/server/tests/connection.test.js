const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const Connection = require('../models/Connection');
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../utils/tokenUtils');

describe('Connection API', () => {
  let userA, userB, tokenA, tokenB;
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.deleteMany({});
    await Connection.deleteMany({});
    const pwd = await bcrypt.hash('Password123', 10);
    userA = await User.create({ name: 'A', email: `a${Date.now()}@example.com`, password: pwd });
    userB = await User.create({ name: 'B', email: `b${Date.now()}@example.com`, password: pwd });
    tokenA = generateAccessToken({ id: userA._id.toString(), email: userA.email });
    tokenB = generateAccessToken({ id: userB._id.toString(), email: userB.email });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('Send and accept connection', async () => {
    const sendRes = await request(app)
      .post('/api/connections/request')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ recipientId: userB._id })
      .expect(201);
    const connId = sendRes.body.data._id;

    await request(app)
      .post(`/api/connections/${connId}/accept`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);

    const listRes = await request(app)
      .get('/api/connections')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);
    expect(Array.isArray(listRes.body.data)).toBe(true);
  });
});
