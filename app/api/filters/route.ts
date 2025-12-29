import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { SavedView } from '@/lib/stores/filterStore';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await sql`
      SELECT id, name, filters, created_at
      FROM saved_views
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    const views: SavedView[] = result.map((row: any) => ({
      id: row.id,
      name: row.name,
      filters: row.filters,
    }));

    return NextResponse.json(views);
  } catch (error) {
    console.error('Error fetching saved views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved views' },
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

    const { name, filters } = await request.json();

    if (!name || !filters) {
      return NextResponse.json(
        { error: 'Name and filters are required' },
        { status: 400 }
      );
    }

    const viewId = `view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await sql`
      INSERT INTO saved_views (id, user_id, name, filters, created_at)
      VALUES (${viewId}, ${session.user.id}, ${name}, ${JSON.stringify(filters)}, ${new Date().toISOString()})
    `;

    const newView: SavedView = {
      id: viewId,
      name,
      filters,
    };

    return NextResponse.json(newView, { status: 201 });
  } catch (error) {
    console.error('Error creating saved view:', error);
    return NextResponse.json(
      { error: 'Failed to create saved view' },
      { status: 500 }
    );
  }
}

