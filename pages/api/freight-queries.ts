import type { NextApiRequest, NextApiResponse } from 'next';

interface FreightQuery {
  id: string;
  origin: string;
  destination: string;
  cargoType: string;
  weight: string;
  dimensions: string;
  pickupDate: string;
  deliveryDate: string;
  specialRequirements: string;
}

let queries: FreightQuery[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(queries);
  } else if (req.method === 'POST') {
    const query = req.body;
    query.id = String(Date.now());
    queries.push(query);
    res.status(201).json(query);
  } else if (req.method === 'PUT') {
    const { id, ...update } = req.body;
    queries = queries.map(q => q.id === id ? { ...q, ...update } : q);
    res.status(200).json({ success: true });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    queries = queries.filter(q => q.id !== id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}
