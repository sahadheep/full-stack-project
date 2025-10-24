const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../utils/tokenUtils');

describe('Profile API', () => {
  let user;
  let token;
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.deleteMany({});
    await Profile.deleteMany({});
    const pwd = await bcrypt.hash('Password123', 10);
    user = await User.create({ name: 'ProfileUser', email: `p${Date.now()}@example.com`, password: pwd });
    token = generateAccessToken({ id: user._id.toString(), email: user.email });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('Create and get profile', async () => {
    const createRes = await request(app)
      .post('/api/profiles')
      .set('Authorization', `Bearer ${token}`)
      .field('bio', 'Hello')
      .field('age', '25')
      .field('gender', 'female')
      .expect(201);
    expect(createRes.body.data.userId).toBeTruthy();

    const getRes = await request(app).get(`/api/profiles/${user._id}`).expect(200);
    expect(getRes.body.data.age).toBe(25);
  });
});
