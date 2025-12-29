import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { Lead, LeadInput } from '@/lib/types/lead';
import { updateLeadCalculations } from '@/lib/utils/businessLogic';
import { parseLeadFromDatabase } from '@/lib/utils/leadHelpers';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await sql`
      SELECT data, created_at, updated_at
      FROM leads
      WHERE user_id = ${session.user.id}
      ORDER BY updated_at DESC
    `;

    const leads: Lead[] = result.map((row: any) =>
      parseLeadFromDatabase(row.data, row.created_at, row.updated_at)
    );

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leadInput: LeadInput = await request.json();
    const now = new Date();
    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Convert date strings to Date objects (JSON deserialization converts Date to string)
    const rawLastActivityAt = leadInput.engagement.lastActivityAt;
    const lastActivityAt = rawLastActivityAt instanceof Date 
      ? rawLastActivityAt 
      : new Date(rawLastActivityAt);

    const newLead: Lead = {
      ...leadInput,
      id: leadId,
      createdAt: now,
      updatedAt: now,
      engagement: {
        replySpeed: leadInput.engagement.replySpeed,
        activityLevel: leadInput.engagement.activityLevel,
        totalInteractions: leadInput.engagement.totalInteractions,
        engagementScore: leadInput.engagement.engagementScore,
        lastActivityAt: lastActivityAt, // Explicitly set the Date object
      },
      monetization: {
        ...leadInput.monetization,
        offers: (leadInput.monetization.offers || []).map((offer: any) => ({
          ...offer,
          createdAt: offer.createdAt instanceof Date ? offer.createdAt : new Date(offer.createdAt),
        })),
        payments: (leadInput.monetization.payments || []).map((payment: any) => ({
          ...payment,
          receivedAt: payment.receivedAt instanceof Date ? payment.receivedAt : new Date(payment.receivedAt),
        })),
      },
      reminders: (leadInput.reminders || []).map((reminder: any) => ({
        ...reminder,
        dueAt: reminder.dueAt instanceof Date ? reminder.dueAt : new Date(reminder.dueAt),
        completedAt: reminder.completedAt ? (reminder.completedAt instanceof Date ? reminder.completedAt : new Date(reminder.completedAt)) : undefined,
      })),
      notes: (leadInput.notes || []).map((note: any) => ({
        ...note,
        createdAt: note.createdAt instanceof Date ? note.createdAt : new Date(note.createdAt),
      })),
      lastContactAt: leadInput.lastContactAt 
        ? (leadInput.lastContactAt instanceof Date ? leadInput.lastContactAt : new Date(leadInput.lastContactAt))
        : now,
    };

    const calculatedLead = updateLeadCalculations(newLead);

    // Insert JSONB data
    await sql`
      INSERT INTO leads (id, user_id, data, created_at, updated_at)
      VALUES (
        ${leadId}, 
        ${session.user.id}, 
        ${JSON.stringify(calculatedLead)}, 
        ${now.toISOString()}, 
        ${now.toISOString()}
      )
    `;

    return NextResponse.json(calculatedLead, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      hint: error?.hint,
    });
        return NextResponse.json(
          { error: 'Failed to create lead' },
          { status: 500 }
        );
  }
}

