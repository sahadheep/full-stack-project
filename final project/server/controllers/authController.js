// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/tokenUtils');
// const { validateRegister, validateLogin } = require('../validators/authValidator');

// async function register(req, res, next) {
//   try {
//     const { valid, errors } = validateRegister(req.body);
//     if (!valid) return res.status(400).json({ status: 'error', message: 'Validation failed', errors });

//     const { name, email, password } = req.body;
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(409).json({ status: 'error', message: 'Email already registered' });

//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(password, salt);
//     const user = await User.create({ name, email, password: hashed });

//     const accessToken = generateAccessToken({ id: user._id.toString(), email: user.email });
//     const refreshToken = generateRefreshToken({ id: user._id.toString(), email: user.email });

//     res.status(201).json({
//       status: 'success',
//       data: { user: { id: user._id, name: user.name, email: user.email }, accessToken, refreshToken }
//     });
//   } catch (err) {
//     next(err);
//   }
// }

// async function login(req, res, next) {
//   try {
//     const { valid, errors } = validateLogin(req.body);
//     if (!valid) return res.status(400).json({ status: 'error', message: 'Validation failed', errors });

//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

//     const accessToken = generateAccessToken({ id: user._id.toString(), email: user.email });
//     const refreshToken = generateRefreshToken({ id: user._id.toString(), email: user.email });

//     res.json({
//       status: 'success',
//       data: { user: { id: user._id, name: user.name, email: user.email }, accessToken, refreshToken }
//     });
//   } catch (err) {
//     next(err);
//   }
// }

// async function refreshToken(req, res, next) {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) return res.status(400).json({ status: 'error', message: 'Refresh token required' });
//     let payload;
//     try {
//       payload = verifyToken(refreshToken);
//     } catch (err) {
//       return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
//     }
//     const accessToken = generateAccessToken({ id: payload.id, email: payload.email });
//     res.json({ status: 'success', data: { accessToken } });
//   } catch (err) {
//     next(err);
//   }
// }

// module.exports = { register, login, refreshToken };

// const bcrypt = require('bcryptjs');
// const User = require('../models/User');

// const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/tokenUtils');
// const { validateRegister, validateLogin } = require('../validators/authValidator');

// async function register(req, res, next) {
//   try {
//     const { valid, errors } = validateRegister(req.body);
//     if (!valid) return res.status(400).json({ status: 'error', message: 'Validation failed', errors });

//     const { name, email, password } = req.body;
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(409).json({ status: 'error', message: 'Email already registered' });

//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(password, salt);
//     const user = await User.create({ name, email, password: hashed });

//     const accessToken = generateAccessToken({ id: user._id.toString(), email: user.email });
//     const refreshToken = generateRefreshToken({ id: user._id.toString(), email: user.email });

//     res.status(201).json({
//       status: 'success',
//       data: { user: { id: user._id, name: user.name, email: user.email }, accessToken, refreshToken }
//     });
//   } catch (err) {
//     next(err);
//   }
// }

// const Profile = require('../models/Profile'); // add at top of file

// // inside register(), right after user is created:
// await Profile.create({
//   userId: user._id,
//   bio: '',
//   age: null,
//   gender: '',
//   interests: [],
//   location: {}
// });







// async function login(req, res, next) {
//   try {
//     const { valid, errors } = validateLogin(req.body);
//     if (!valid) return res.status(400).json({ status: 'error', message: 'Validation failed', errors });

//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

//     const accessToken = generateAccessToken({ id: user._id.toString(), email: user.email });
//     const refreshToken = generateRefreshToken({ id: user._id.toString(), email: user.email });

//     res.json({
//       status: 'success',
//       data: { user: { id: user._id, name: user.name, email: user.email }, accessToken, refreshToken }
//     });
//   } catch (err) {
//     next(err);
//   }
// }

// async function refreshToken(req, res, next) {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) return res.status(400).json({ status: 'error', message: 'Refresh token required' });
//     let payload;
//     try {
//       payload = verifyToken(refreshToken);
//     } catch (err) {
//       return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
//     }
//     const accessToken = generateAccessToken({ id: payload.id, email: payload.email });
//     res.json({ status: 'success', data: { accessToken } });
//   } catch (err) {
//     next(err);
//   }
// }

// module.exports = { register, login, refreshToken };







// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Profile = require('../models/Profile');
// const { JWT_SECRET } = require('../config/envConfig');

// // Generate JWT token
// function generateToken(user) {
//   return jwt.sign(
//     { id: user._id, email: user.email },
//     JWT_SECRET,
//     { expiresIn: '7d' }
//   );
// }

// // ====================== REGISTER ======================
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Basic validation
//     if (!name || !email || !password)
//       return res.status(400).json({ status: 'error', message: 'All fields are required' });

//     const existing = await User.findOne({ email });
//     if (existing)
//       return res.status(400).json({ status: 'error', message: 'User already exists' });

//     // Hash password
//     const hashed = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashed
//     });

//     // ✅ Automatically create an empty profile for this user
//     await Profile.create({
//       userId: user._id,
//       bio: '',
//       age: null,
//       gender: '',
//       interests: [],
//       location: {}
//     });

//     // Generate token
//     const token = generateToken(user);

//     res.status(201).json({
//       status: 'success',
//       message: 'User registered successfully',
//       data: {
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email
//         }
//       }
//     });
//   } catch (err) {
//     console.error('Register error:', err);
//     res.status(500).json({ status: 'error', message: 'Server error during registration' });
//   }
// };

// // ====================== LOGIN ======================
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ status: 'error', message: 'Email and password are required' });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(404).json({ status: 'error', message: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

//     const token = generateToken(user);

//     res.json({
//       status: 'success',
//       message: 'Login successful',
//       data: {
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email
//         }
//       }
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ status: 'error', message: 'Server error during login' });
//   }
// };




const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { generateTokens, verifyToken } = require('../utils/tokenUtils');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { blacklistToken } = require('../services/tokenBlacklistService');

async function register(req, res, next) {
  try {
    const { valid, errors } = validateRegister(req.body);
    if (!valid) return res.status(400).json({ status: 'error', message: 'Validation failed', errors });

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ status: 'error', message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashed });
    
    // Create profile for new user
    await Profile.create({
      userId: user._id,
      bio: '',
      interests: [],
      location: { city: '', country: '' }
    });

    const { accessToken, refreshToken, expiresIn } = generateTokens(user);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        accessToken,
        refreshToken,
        expiresIn
      }
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { valid, errors } = validateLogin(req.body);
    if (!valid) return res.status(400).json({ status: 'error', message: 'Validation failed', errors });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    const { accessToken, refreshToken, expiresIn } = generateTokens(user);

    // Send tokens in HTTP-only cookies for better security
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        accessToken,
        expiresIn
      }
    });
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token required',
        code: 'REFRESH_TOKEN_REQUIRED'
      });
    }

    try {
      // Verify the refresh token
      const payload = verifyToken(refreshToken, 'refresh');
      
      // Find the user
      const user = await User.findById(payload.id);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken, expiresIn } = generateTokens(user);

      // Blacklist the old refresh token
      blacklistToken(refreshToken, 300); // Blacklist for 5 minutes

      // Set new refresh token in cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        status: 'success',
        data: { accessToken, expiresIn }
      });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Refresh token has expired',
          code: 'REFRESH_TOKEN_EXPIRED'
        });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.headers.authorization?.split(' ')[1];

    // Blacklist both tokens
    if (refreshToken) {
      blacklistToken(refreshToken, 7 * 24 * 60 * 60); // 7 days
    }
    if (accessToken) {
      blacklistToken(accessToken, 900); // 15 minutes
    }

    // Clear the refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refreshToken, logout };

