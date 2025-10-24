const nodemailer = require('nodemailer');
const config = require('../config/envConfig');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD
  }
});

// Email template for connection request
const connectionRequestTemplate = (requesterName, recipientName) => ({
  subject: `New Connection Request from ${requesterName}`,
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2C6BED;">New Connection Request</h2>
      <p>Hello ${recipientName},</p>
      <p><strong>${requesterName}</strong> wants to connect with you on our platform.</p>
      <p>Login to your account to view and respond to this request.</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <p style="margin: 0;">This is an automated message, please do not reply to this email.</p>
      </div>
    </div>
  `
});

async function sendConnectionRequestEmail(recipientEmail, requesterName, recipientName) {
  try {
    const { subject, html } = connectionRequestTemplate(requesterName, recipientName);
    
    const mailOptions = {
      from: config.EMAIL_USER,
      to: recipientEmail,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

module.exports = {
  sendConnectionRequestEmail
};