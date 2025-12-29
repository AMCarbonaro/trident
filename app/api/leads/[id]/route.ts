import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { Lead } from '@/lib/types/lead';
import { updateLeadCalculations } from '@/lib/utils/businessLogic';
import { parseLeadFromDatabase } from '@/lib/utils/leadHelpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await sql`
      SELECT data, created_at, updated_at
      FROM leads
      WHERE id = ${params.id} AND user_id = ${session.user.id}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const row = result[0];
    const lead = parseLeadFromDatabase(row.data, row.created_at, row.updated_at);
    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First verify ownership
    const existingResult = await sql`
      SELECT data, created_at, updated_at
      FROM leads
      WHERE id = ${params.id} AND user_id = ${session.user.id}
    `;

    if (existingResult.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const updates: Partial<Lead> = await request.json();
    const existingLead = parseLeadFromDatabase(
      existingResult[0].data,
      existingResult[0].created_at,
      existingResult[0].updated_at
    );

    const updatedLead: Lead = {
      ...existingLead,
      ...updates,
      id: params.id,
      updatedAt: new Date(),
    };

    const calculatedLead = updateLeadCalculations(updatedLead);

    await sql`
      UPDATE leads
      SET data = ${JSON.stringify(calculatedLead)}, updated_at = ${new Date().toISOString()}
      WHERE id = ${params.id} AND user_id = ${session.user.id}
    `;

    calculatedLead.createdAt = new Date(existingResult[0].created_at);
    calculatedLead.updatedAt = new Date();

    return NextResponse.json(calculatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await sql`
      DELETE FROM leads
      WHERE id = ${params.id} AND user_id = ${session.user.id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}

