import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[send-email] Request received:', { method: req.method, bodyKeys: Object.keys(req.body || {}) });

  if (req.method !== 'POST') {
    console.warn('[send-email] Method not allowed:', req.method);
    return res.status(405).end();
  }

  const { to, subject, text } = req.body;
  // console.log('[send-email] Parsed body:', { to, subjectLength: subject?.length, textLength: text?.length });

  if (!to || !subject || !text) {
    console.error('[send-email] Missing required fields:', { hasTo: !!to, hasSubject: !!subject, hasText: !!text });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check SMTP environment variables
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('[send-email] Missing SMTP credentials:', { 
      hasHost: !!process.env.SMTP_HOST,
      hasPort: !!process.env.SMTP_PORT,
      hasUser: !!process.env.SMTP_USER, 
      hasPass: !!process.env.SMTP_PASS 
    });
    return res.status(500).json({ error: 'SMTP credentials not configured' });
  }

  // console.log('[send-email] Creating transporter with SMTP service...');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  // secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER, // full email address
    pass: process.env.SMTP_PASS,
  },
});

const info = await transporter.sendMail({
  from: process.env.SMTP_USER, // use client email, not Gmail
  to,
  subject,
  text,
});



  // Test connection
  try {
    console.log('[send-email] Testing SMTP connection...');
    await transporter.verify();
    console.log('[send-email] SMTP connection verified successfully');
  } catch (verifyError) {
    console.error('[send-email] SMTP verification failed:', verifyError);
    return res.status(500).json({ 
      error: 'SMTP connection failed', 
      details: verifyError instanceof Error ? verifyError.message : 'Unknown error'
    });
  }

  try {
    res.status(200).json({ 
      success: true, 
      messageId: info?.messageId,
      accepted: info?.accepted,
      rejected: info?.rejected
    });
  } catch (error) {
    console.error('[send-email] Failed to send email:', error);
    res.status(500).json({ 
      error: 'Failed to send email', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
