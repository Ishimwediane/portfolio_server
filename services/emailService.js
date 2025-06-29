import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  // For Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use App Password for Gmail
      }
    });
  }

  // For Outlook/Hotmail
  if (process.env.EMAIL_SERVICE === 'outlook') {
    return nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // For custom SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email template
const createEmailTemplate = ({ name, email, subject, message }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #007bff; margin-bottom: 10px;">Contact Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #007bff; margin-bottom: 10px;">Message:</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This email was sent from your portfolio contact form.</p>
          <p>Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  `;
};

// Send email function
export const sendEmail = async ({ name, email, subject, message }) => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    
    // Email options
    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      replyTo: email, // Reply will go to the sender
      subject: `Portfolio Contact: ${subject}`,
      html: createEmailTemplate({ name, email, subject, message }),
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
        
        Timestamp: ${new Date().toLocaleString()}
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

// Test email function (for development)
export const testEmail = async () => {
  try {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Email',
      message: 'This is a test email from the portfolio backend.'
    };
    
    await sendEmail(testData);
    console.log('✅ Test email sent successfully');
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
  }
}; 