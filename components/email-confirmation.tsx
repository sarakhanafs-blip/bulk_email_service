'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  FileText
} from 'lucide-react';

interface FreightQuery {
  origin: string;
  destination: string;
  cargoType: string;
  weight: string;
  dimensions: string;
  pickupDate: string;
  deliveryDate: string;
  specialRequirements: string;
}

interface EmailStatus {
  id: string;
  agentName: string;
  email: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'replied' | 'failed';
  sentAt?: string;
  openedAt?: string;
  repliedAt?: string;
}

interface EmailConfirmationProps {
  recipients?: Array<{ id: string; name: string; email: string }>;
}

export function EmailConfirmation({ recipients }: EmailConfirmationProps) {
  // Freight Query State
  const [freightQuery, setFreightQuery] = useState<FreightQuery>({
    origin: '',
    destination: '',
    cargoType: '',
    weight: '',
    dimensions: '',
    pickupDate: '',
    deliveryDate: '',
    specialRequirements: ''
  });

  // Submit Freight Query to backend
  // const handleSubmitFreightQuery = async () => {
  //   await fetch('/api/freight-queries', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(freightQuery)
  //   });
  // };


// Utility: delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleSubmitFreightQueries = async (queries: any[]) => {
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];

    await fetch('/api/freight-queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });

    console.log(`Email request sent for: ${query.email}`);

    // Add buffer (15 seconds)
    if (i < queries.length - 1) {
      await delay(15000); // 15000ms = 15 seconds
    }
  }
};


  // Email template & subject
  const [emailSubject, setEmailSubject] = useState('Freight Quote Request - Urgent');
  const [emailTemplate, setEmailTemplate] = useState(`Dear [Agent Name],

I hope this message finds you well. We have a freight shipment opportunity that matches your service area and capabilities.

**Shipment Details:**
• Origin: [Origin]
• Destination: [Destination]
• Cargo Type: [Cargo Type]
• Weight: [Weight]
• Dimensions: [Dimensions]
• Pickup Date: [Pickup Date]
• Delivery Date: [Delivery Date]

Please review the details and provide your best quote. We're looking for competitive rates and reliable service.

Best regards,
Acumen Freight Solutions`);

  // Email statuses
  const [emailStatuses, setEmailStatuses] = useState<EmailStatus[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Load initial recipients or fetch from backend
  useEffect(() => {
    fetch('/api/email-status')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(recipients) && recipients.length > 0) {
          const mapped = recipients.map(r => ({
            id: r.id,
            agentName: r.name,
            email: r.email,
            status: 'pending' as const,
          }));
          setEmailStatuses(mapped);
        } else if (Array.isArray(data) && data.length > 0) {
          setEmailStatuses(data);
        } else {
          fetch('/api/agents')
            .then(res => res.json())
            .then((agents) => {
              const seeded: EmailStatus[] = agents.map((a: any) => ({
                id: a.id,
                agentName: a.name,
                email: a.email,
                status: 'pending'
              }));
              setEmailStatuses(seeded);
            });
        }
      })
      .catch(err => console.error('[EmailConfirmation] Failed to fetch email statuses:', err));
  }, [recipients]);

  // Send emails one by one
  const handleSendEmails = async () => {
    setIsSending(true);
    
    for (let i = 0; i < emailStatuses.length; i++) {
      const current = emailStatuses[i];
      const personalizedBody = emailTemplate
        .replace(/\[Agent Name\]/g, current.agentName)
        .replace(/\[Origin\]/g, freightQuery.origin)
        .replace(/\[Destination\]/g, freightQuery.destination)
        .replace(/\[Cargo Type\]/g, freightQuery.cargoType)
        .replace(/\[Weight\]/g, freightQuery.weight)
        .replace(/\[Dimensions\]/g, freightQuery.dimensions)
        .replace(/\[Pickup Date\]/g, freightQuery.pickupDate)
        .replace(/\[Delivery Date\]/g, freightQuery.deliveryDate);

      try {
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: current.email,
            subject: emailSubject,
            text: personalizedBody
          })
        });

        if (!res.ok) throw new Error('Failed to send');

        setEmailStatuses(prev => prev.map((status, index) => 
          index === i 
            ? { ...status, status: 'sent', sentAt: new Date().toLocaleString() }
            : status
        ));
      } catch (err) {
        setEmailStatuses(prev => prev.map((status, index) => 
          index === i 
            ? { ...status, status: 'failed' }
            : status
        ));
      }
    }
    
    setIsSending(false);
  };

  // Status UI helpers
  const getStatusIcon = (status: EmailStatus['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'sent': return <Send className="h-4 w-4 text-blue-600" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'opened': return <Mail className="h-4 w-4 text-indigo-600" />;
      case 'replied': return <CheckCircle className="h-4 w-4 text-green-700" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: EmailStatus['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      sent: 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      opened: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      replied: 'bg-green-100 text-green-900 border-green-300',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };
    return <Badge className={colors[status]} variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Campaign Management</h2>
          <p className="text-gray-600">Send bulk freight queries and track responses</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="secondary">{emailStatuses.length} Recipients</Badge>
          <Badge className="bg-green-100 text-green-800">
            {emailStatuses.filter(s => s.status === 'replied').length} Replies
          </Badge>
        </div>
      </div>

      {/* Email Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Email Template</CardTitle>
          <CardDescription>Customize the message sent to agents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email Subject</Label>
            <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email Body</Label>
            <Textarea 
              value={emailTemplate} 
              onChange={(e) => setEmailTemplate(e.target.value)} 
              rows={12} 
              className="font-mono text-sm" 
            />
            <p className="text-xs text-gray-600">Use placeholders like [Agent Name], [Origin], [Destination]</p>
          </div>
        </CardContent>
      </Card>

      {/* Send Campaign */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Send className="h-5 w-5" /> Send Campaign</CardTitle>
          <CardDescription>Review and send your bulk freight query</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSendEmails} 
            disabled={isSending}
            className="w-full h-12 text-lg"
          >
            {isSending ? (
              <>
                <Clock className="h-5 w-5 mr-2 animate-spin" /> Sending Emails...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" /> Send Bulk Query to {emailStatuses.length} Agents
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Email Status Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Email Status Tracking</CardTitle>
          <CardDescription>Monitor delivery and responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailStatuses.map(status => (
            <div key={status.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                {getStatusIcon(status.status)}
                <div>
                  <p className="font-semibold">{status.agentName}</p>
                  <p className="text-sm text-gray-600">{status.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {status.sentAt && <p className="text-gray-600 text-sm">Sent: {status.sentAt}</p>}
                {status.repliedAt && <p className="text-green-600 text-sm font-semibold">Replied: {status.repliedAt}</p>}
                {getStatusBadge(status.status)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
