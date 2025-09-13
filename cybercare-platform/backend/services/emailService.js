// backend/services/emailService.js - Email service for MFA codes
const nodemailer = require('nodemailer');

// Configure email transporter (using Gmail as example)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Send MFA code via email
const sendMFAEmail = async (email, code, companyName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@cybercare.md',
      to: email,
      subject: 'CyberCare - Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #3b82f6; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">CyberCare</h1>
            <p style="color: white; margin: 5px 0 0 0;">Moldova Cybersecurity Compliance Platform</p>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Verification Code</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Hello,<br><br>
              Someone requested to sign in to <strong>${companyName}</strong>'s CyberCare account. 
              If this was you, please use the verification code below:
            </p>
            
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${code}</span>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
              This code will expire in 10 minutes for security reasons.
            </p>
            
            <p style="color: #6b7280; font-size: 14px;">
              If you didn't request this code, please ignore this email or contact your IT administrator.
            </p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>This email was sent by CyberCare Platform - Moldova Law 142/2023 Compliance Solution</p>
            <p>© 2025 CyberCare. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`MFA code sent to ${email}`);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send welcome email for new users
const sendWelcomeEmail = async (email, companyName, tempPassword) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@cybercare.md',
      to: email,
      subject: 'Welcome to CyberCare - Account Created',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #059669; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to CyberCare!</h1>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Hello,<br><br>
              Your CyberCare account has been created for <strong>${companyName}</strong>.
            </p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #166534; margin-top: 0;">Account Details:</h3>
              <p style="color: #166534; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="color: #166534; margin: 5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
            </div>
            
            <p style="color: #dc2626; font-weight: 600; margin: 20px 0;">
              Please change your password after your first login.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://cybercare.md/login" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Login to CyberCare
              </a>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Welcome email error:', error);
    throw new Error('Failed to send welcome email');
  }
};

module.exports = {
  sendMFAEmail,
  sendWelcomeEmail
};