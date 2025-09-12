import type { NextApiRequest, NextApiResponse } from 'next';

interface EmailStatus {
  id: string;
  agentName: string;
  email: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'replied' | 'failed';
  sentAt?: string;
  openedAt?: string;
  repliedAt?: string;
}

let emailStatuses: EmailStatus[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(emailStatuses);
  } else if (req.method === 'POST') {
    const status = req.body;
    status.id = String(Date.now());
    emailStatuses.push(status);
    res.status(201).json(status);
  } else if (req.method === 'PUT') {
    const { id, ...update } = req.body;
    emailStatuses = emailStatuses.map(s => s.id === id ? { ...s, ...update } : s);
    res.status(200).json({ success: true });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    emailStatuses = emailStatuses.filter(s => s.id !== id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}
