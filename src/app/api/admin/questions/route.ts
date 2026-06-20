import { NextResponse } from 'next/server';
import DB from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const questions = await DB.questions.getAll();
    // Sort by category manually to match old behavior
    questions.sort((a, b) => a.category.localeCompare(b.category));
    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const id = data.id || `q_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    await DB.questions.create({
      id,
      category: data.category,
      question: data.question,
      options: JSON.stringify(data.options),
      correct_index: data.correct_index,
      explanation: data.explanation,
      created_at: new Date().toISOString()
    });

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
    
    const records = questions.map((q: any) => ({
      id: q.id || `q_${Date.now()}_${Math.floor(Math.random() * 10000)}_${Math.random()}`,
      category: q.category,
      question: q.question,
      options: JSON.stringify(q.options),
      correct_index: q.correct_index,
      explanation: q.explanation,
      created_at: new Date().toISOString()
    }));

    await DB.questions.bulkCreate(records);

    return NextResponse.json({ success: true, count: questions.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
