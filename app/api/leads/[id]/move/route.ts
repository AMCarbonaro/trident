import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { FunnelStage } from '@/lib/types/lead';
import { updateLeadCalculations } from '@/lib/utils/businessLogic';
import { parseLeadFromDatabase } from '@/lib/utils/leadHelpers';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stage } = await request.json();

    if (!stage || !Object.values(FunnelStage).includes(stage)) {
      return NextResponse.json(
        { error: 'Invalid stage' },
        { status: 400 }
      );
    }

    // Verify ownership and get existing lead
    const existingResult = await sql`
      SELECT data, created_at, updated_at
      FROM leads
      WHERE id = ${params.id} AND user_id = ${session.user.id}
    `;

    if (existingResult.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const existingLead = parseLeadFromDatabase(
      existingResult[0].data,
      existingResult[0].created_at,
      existingResult[0].updated_at
    );
    
    const updatedLead = {
      ...existingLead,
      stage: stage as FunnelStage,
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
    console.error('Error moving lead:', error);
    return NextResponse.json(
      { error: 'Failed to move lead' },
      { status: 500 }
    );
  }
}

