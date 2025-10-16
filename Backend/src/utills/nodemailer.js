import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL_ADDRESS,        
    pass: process.env.GMAIL_APP_PASSWORD,            
  },
});

export const sendEmail = async (to, subject, text, html = null) => {
  const mailOptions = {
    from: `Ahmed <${process.env.GMAIL_EMAIL_ADDRESS}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
}
};