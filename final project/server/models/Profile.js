const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  bio: { type: String, default: '' },
  age: { type: Number, min: 18, max: 100, default: null },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  interests: { type: [String], default: [] },
  location: {
    city: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  education: {
    batch: { type: String, default: '' },
    course: { type: String, default: '' },
    currentModule: { type: String, default: '' },
    graduationYear: { type: Number },
    college: { type: String, default: '' },
    role: { type: String, enum: ['student', 'teacher', 'alumni'], default: 'student' }
  },
  skills: [{ type: String }],
  avatarUrl: { type: String, default: '' },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
