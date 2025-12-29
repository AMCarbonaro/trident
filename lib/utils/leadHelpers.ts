import { Lead } from '@/lib/types/lead';

/**
 * Parses JSONB data from Postgres and converts date strings to Date objects
 * @param data - The JSONB data from the database (can be string or object)
 * @param created_at - The created_at timestamp from the database
 * @param updated_at - The updated_at timestamp from the database
 * @returns A Lead object with all dates properly converted
 */
export function parseLeadFromDatabase(
  data: string | object,
  created_at: string | Date,
  updated_at: string | Date
): Lead {
  // Parse JSONB data (postgres returns it as a string)
  const lead = typeof data === 'string' ? JSON.parse(data) : data;
  
  // Convert date strings to Date objects
  lead.createdAt = new Date(created_at);
  lead.updatedAt = new Date(updated_at);
  
  // Convert nested date fields
  if (lead.engagement?.lastActivityAt) {
    lead.engagement.lastActivityAt = new Date(lead.engagement.lastActivityAt);
  }
  if (lead.lastContactAt) {
    lead.lastContactAt = new Date(lead.lastContactAt);
  }
  if (lead.notes) {
    lead.notes = lead.notes.map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
    }));
  }
  if (lead.monetization?.offers) {
    lead.monetization.offers = lead.monetization.offers.map((offer: any) => ({
      ...offer,
      createdAt: new Date(offer.createdAt),
    }));
  }
  if (lead.monetization?.payments) {
    lead.monetization.payments = lead.monetization.payments.map((payment: any) => ({
      ...payment,
      receivedAt: new Date(payment.receivedAt),
    }));
  }
  if (lead.reminders) {
    lead.reminders = lead.reminders.map((reminder: any) => ({
      ...reminder,
      dueAt: new Date(reminder.dueAt),
      completedAt: reminder.completedAt ? new Date(reminder.completedAt) : undefined,
    }));
  }
  
  return lead as Lead;
}

