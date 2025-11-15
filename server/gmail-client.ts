import nodemailer from 'nodemailer';

export interface EmailConfig {
  user: string;
  pass: string;
}

export async function getGmailTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD environment variables are required');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  return transporter;
}
