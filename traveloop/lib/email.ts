import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(options: EmailOptions) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@traveloop.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

export function generateOTPEmail(otp: string, appName: string = 'Traveloop') {
  return {
    subject: `Reset Your ${appName} Password`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.2);
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: white;
            margin: 0;
            letter-spacing: 2px;
          }
          .content {
            padding: 40px 30px;
            background: white;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            color: #666;
            margin-bottom: 30px;
            text-align: center;
          }
          .otp-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
          }
          .otp {
            font-size: 36px;
            font-weight: bold;
            color: white;
            letter-spacing: 8px;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .otp-label {
            color: rgba(255,255,255,0.9);
            font-size: 14px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .footer-text {
            font-size: 12px;
            color: #999;
            margin: 0;
          }
          .security-note {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .security-note p {
            margin: 0;
            color: #856404;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">✈️ ${appName}</h1>
          </div>
          <div class="content">
            <h2 class="title">Password Reset Request</h2>
            <p class="message">
              You requested to reset your password for your ${appName} account. 
              Use the verification code below to proceed with the password reset.
            </p>
            
            <div class="otp-container">
              <div class="otp-label">Your Verification Code</div>
              <div class="otp">${otp}</div>
            </div>
            
            <div class="security-note">
              <p>
                <strong>Security Notice:</strong> This code will expire in 10 minutes. 
                Never share this code with anyone. If you didn't request this password reset, 
                please ignore this email.
              </p>
            </div>
            
            <p class="message">
              If you have any issues, please contact our support team.
            </p>
          </div>
          <div class="footer">
            <p class="footer-text">
              © 2024 ${appName}. All rights reserved.<br>
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
