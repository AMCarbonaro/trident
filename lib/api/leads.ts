import { Lead, LeadInput, FunnelStage } from '@/lib/types/lead';

/**
 * Converts date strings in a lead object to Date objects
 * This is needed because JSON responses serialize Date objects to strings
 */
function convertLeadDates(lead: any): Lead {
  return {
    ...lead,
    createdAt: new Date(lead.createdAt),
    updatedAt: new Date(lead.updatedAt),
    lastContactAt: lead.lastContactAt ? new Date(lead.lastContactAt) : undefined,
    notes: lead.notes?.map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
    })) || [],
    engagement: {
      ...lead.engagement,
      lastActivityAt: new Date(lead.engagement.lastActivityAt),
    },
    monetization: {
      ...lead.monetization,
      offers: lead.monetization?.offers?.map((offer: any) => ({
        ...offer,
        createdAt: new Date(offer.createdAt),
      })) || [],
      payments: lead.monetization?.payments?.map((payment: any) => ({
        ...payment,
        receivedAt: new Date(payment.receivedAt),
      })) || [],
    },
    reminders: lead.reminders?.map((reminder: any) => ({
      ...reminder,
      dueAt: new Date(reminder.dueAt),
      completedAt: reminder.completedAt ? new Date(reminder.completedAt) : undefined,
    })) || [],
  };
}

export async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch('/api/leads');
  
  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }

  const leads = await response.json();
  return leads.map((lead: any) => convertLeadDates(lead));
}

export async function createLead(leadInput: LeadInput): Promise<Lead> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadInput),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create lead');
  }

  const lead = await response.json();
  return convertLeadDates(lead);
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update lead');
  }

  const lead = await response.json();
  return convertLeadDates(lead);
}

export async function deleteLead(id: string): Promise<void> {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete lead');
  }
}

export async function moveLead(id: string, newStage: FunnelStage): Promise<Lead> {
  const response = await fetch(`/api/leads/${id}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage: newStage }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to move lead');
  }

  const lead = await response.json();
  return convertLeadDates(lead);
}

