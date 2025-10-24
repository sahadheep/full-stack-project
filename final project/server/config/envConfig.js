const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '..', 'env.example');
if (fs.existsSync(path.join(__dirname, '..', '.env'))) {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const required = ['DB_URL', 'JWT_SECRET', 'PORT'];
const missing = required.filter(k => !process.env[k] || process.env[k].includes('<'));
if (missing.length > 0) {
  throw new Error(`Missing required env variables: ${missing.join(', ')}. Please copy env.example to .env and set values.`);
}

module.exports = {
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || ''
};
