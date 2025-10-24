const db = require('../config/db');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Connection = require('../models/Connection');
const bcrypt = require('bcryptjs');

async function seed() {
  await db.connect();
  await User.deleteMany({});
  await Profile.deleteMany({});
  await Connection.deleteMany({});

  const pwd = await bcrypt.hash('Password123', 10);
  const users = await User.create([
    { name: 'Alice Johnson', email: 'alice@example.com', password: pwd },
    { name: 'Bob Smith', email: 'bob@example.com', password: pwd },
    { name: 'Charlie Brown', email: 'charlie@example.com', password: pwd }
  ]);

  const profiles = await Profile.create([
    { userId: users[0]._id, bio: 'Loves reading', age: 28, gender: 'female', interests: ['reading', 'travel'], location: { city: 'Chennai', country: 'India' } },
    { userId: users[1]._id, bio: 'Music and sports', age: 30, gender: 'male', interests: ['music', 'cricket'], location: { city: 'Bengaluru', country: 'India' } },
    { userId: users[2]._id, bio: 'Foodie', age: 26, gender: 'male', interests: ['cooking', 'movies'], location: { city: 'Hyderabad', country: 'India' } }
  ]);

  await Connection.create({ requester: users[0]._id, recipient: users[1]._id, status: 'pending' });

  console.log('Seeded users:', users.map(u => u.email));
  await db.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
