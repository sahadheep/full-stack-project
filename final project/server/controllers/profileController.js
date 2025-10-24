const Profile = require('../models/Profile');
const User = require('../models/User');
const { validateProfile } = require('../validators/profileValidator');
const { uploadImage } = require('../services/cloudinaryService');
const path = require('path');

async function createProfile(req, res, next) {
  try {
    const body = { ...req.body };
    const { valid, errors } = validateProfile(body);
    if (!valid) return res.status(400).json({ status: 'error', message: 'Validation failed', errors });

  if (!req.user || !req.user.id) return res.status(401).json({ status: 'error', message: 'Not authenticated' });
  const userId = req.user.id;
    // If profile exists, update it instead
    const existing = await Profile.findOne({ userId });
    if (existing) {
      // Update existing profile
      if (req.file) {
        const uploaded = await uploadImage(require('fs').readFileSync(req.file.path), `avatar-${userId}`).catch(() => null);
        if (uploaded && uploaded.url) existing.avatarUrl = uploaded.url;
        else existing.avatarUrl = `/uploads/${path.basename(req.file.path)}`;
      }

      existing.bio = body.bio || existing.bio;
      existing.age = body.age ? Number(body.age) : existing.age;
      existing.gender = body.gender || existing.gender;
      existing.interests = Array.isArray(body.interests) ? body.interests : (body.interests ? [body.interests] : existing.interests);
      existing.location = body.location ? body.location : existing.location;

      await existing.save();
      return res.json({ status: 'success', data: existing });
    }

    let avatarUrl = '';
    if (req.file) {
      const uploaded = await uploadImage(require('fs').readFileSync(req.file.path), `avatar-${userId}`).catch(() => null);
      if (uploaded && uploaded.url) avatarUrl = uploaded.url;
      else avatarUrl = `/uploads/${path.basename(req.file.path)}`;
    }

    const profile = await Profile.create({
      userId,
      bio: body.bio || '',
      age: body.age ? Number(body.age) : undefined,
      gender: body.gender,
      interests: Array.isArray(body.interests) ? body.interests : (body.interests ? [body.interests] : []),
      location: body.location ? body.location : {},
      avatarUrl
    });

    res.status(201).json({ status: 'success', data: profile });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ status: 'error', message: 'userId required' });
    const profile = await Profile.findOne({ userId }).populate('userId', 'name email');
    if (!profile) return res.status(404).json({ status: 'error', message: 'Profile not found' });
    res.json({ status: 'success', data: profile });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const body = { ...req.body };
    const { valid, errors } = validateProfile(body);
    if (!valid) return res.status(400).json({ status: 'error', message: 'Validation failed', errors });

  if (!req.user || !req.user.id) return res.status(401).json({ status: 'error', message: 'Not authenticated' });
  const userId = req.user.id;
    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ status: 'error', message: 'Profile not found' });

    if (req.file) {
      const uploaded = await uploadImage(require('fs').readFileSync(req.file.path), `avatar-${userId}`).catch(() => null);
      if (uploaded && uploaded.url) profile.avatarUrl = uploaded.url;
      else profile.avatarUrl = `/uploads/${path.basename(req.file.path)}`;
    }

    if (body.bio !== undefined) profile.bio = body.bio;
    if (body.age !== undefined) profile.age = Number(body.age);
    if (body.gender !== undefined) profile.gender = body.gender;
    if (body.interests !== undefined) profile.interests = Array.isArray(body.interests) ? body.interests : [body.interests];
    if (body.location !== undefined) profile.location = body.location;

    await profile.save();
    res.json({ status: 'success', data: profile });
  } catch (err) {
    next(err);
  }
}

async function listProfiles(req, res, next) {
  try {
    const { page = 1, limit = 12, gender, ageMin, ageMax, name, class: className, section } = req.query;
    // Build base query; if user is authenticated, exclude their own profile
    const q = {};
    if (req.user && req.user.id) {
      q.userId = { $ne: req.user.id };
    }
    if (gender) q.gender = gender;
    if (ageMin || ageMax) q.age = {};
    if (ageMin) q.age.$gte = Number(ageMin);
    if (ageMax) q.age.$lte = Number(ageMax);
    if (name) q['userId.name'] = { $regex: name, $options: 'i' };
    // class and section are custom fields requested by user description; saved in profile.location.city or custom - handle as generic match
    if (className) q['class'] = { $regex: className, $options: 'i' }; // optional field
    if (section) q['section'] = { $regex: section, $options: 'i' };

    // Allows searching by user name via populate filter
    const skip = (Number(page) - 1) * Number(limit);
    const profiles = await Profile.find(q).populate('userId', 'name').skip(skip).limit(Number(limit)).lean();
    const total = await Profile.countDocuments(q);
    res.json({ status: 'success', data: { profiles, page: Number(page), totalPages: Math.ceil(total / Number(limit)), total } });
  } catch (err) {
    next(err);
  }
}

async function deleteProfile(req, res, next) {
  try {
    const { userId } = req.params;
    
    // Check if the user is trying to delete their own profile
    if (userId !== req.user.id) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'You can only delete your own profile' 
      });
    }

    // Find and delete the profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Profile not found' 
      });
    }

    // Delete the profile
    await Profile.deleteOne({ userId });

    // Also delete the user account
    await User.deleteOne({ _id: userId });

    res.json({ 
      status: 'success', 
      message: 'Profile and associated user account deleted successfully' 
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  createProfile, 
  getProfile, 
  updateProfile, 
  listProfiles,
  deleteProfile
};
