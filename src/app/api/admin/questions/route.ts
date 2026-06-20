import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const questions = db.prepare('SELECT * FROM questions ORDER BY category').all();
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const id = data.id || `q_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    const stmt = db.prepare(`
      INSERT INTO questions (id, category, question, options, correct_index, explanation)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      data.category,
      data.question,
      JSON.stringify(data.options),
      data.correct_index,
      data.explanation
    );

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Bulk Import
export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { questions } = await request.json();
    
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO questions (id, category, question, options, correct_index, explanation)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((qs: any[]) => {
      for (const q of qs) {
        const id = q.id || `q_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        insertStmt.run(
          id,
          q.category,
          q.question,
          JSON.stringify(q.options),
          q.correct_index,
          q.explanation
        );
      }
    });

    transaction(questions);

    return NextResponse.json({ success: true, count: questions.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
