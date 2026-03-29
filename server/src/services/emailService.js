const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT, ADMIN_EMAIL } = require('../config/constants');

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

class EmailService {
  static async sendAdminNotification(subject, text) {
    if (!EMAIL_USER || !EMAIL_PASS) {
      console.warn('Email credentials not set. Skipping notification.');
      return;
    }

    try {
      await transporter.sendMail({
        from: EMAIL_USER,
        to: ADMIN_EMAIL,
        subject,
        text,
      });
      console.log('Email sent to admin');
    } catch (error) {
      console.error('Email send error:', error);
    }
  }
}

module.exports = EmailService;