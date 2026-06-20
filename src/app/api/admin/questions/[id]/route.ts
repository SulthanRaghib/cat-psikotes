import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = params.id;
    const data = await request.json();

    const stmt = db.prepare(`
      UPDATE questions 
      SET category = ?, question = ?, options = ?, correct_index = ?, explanation = ?
      WHERE id = ?
    `);

    stmt.run(
      data.category,
      data.question,
      JSON.stringify(data.options),
      data.correct_index,
      data.explanation,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = params.id;
    db.prepare('DELETE FROM questions WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
