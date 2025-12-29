import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';

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
      DELETE FROM saved_views
      WHERE id = ${params.id} AND user_id = ${session.user.id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Saved view not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Saved view deleted successfully' });
  } catch (error) {
    console.error('Error deleting saved view:', error);
    return NextResponse.json(
      { error: 'Failed to delete saved view' },
      { status: 500 }
    );
  }
}

