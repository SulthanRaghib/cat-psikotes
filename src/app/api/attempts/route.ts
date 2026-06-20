import { NextResponse } from 'next/server';
import DB from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startedAt, finishedAt, categories, timerMode, answers } = body;

    const totalQuestions = answers.length;
    const correctCount = answers.filter((a: any) => a.isCorrect).length;
    const percent = Math.round((correctCount / Math.max(totalQuestions, 1)) * 100);

    const attemptData = {
      startedAt,
      finishedAt,
      totalQuestions,
      correctCount,
      percent,
      categories,
      timerMode,
      answers
    };

    const result = await DB.attempts.save(attemptData);

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await DB.attempts.deleteAll();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 8;

    const recentAttempts = await DB.attempts.getRecent(limit);

    const attempts = recentAttempts.map(r => ({
      id: r.id,
      startedAt: r.started_at,
      finishedAt: r.finished_at,
      totalQuestions: r.total_questions,
      correctCount: r.correct_count,
      percent: r.percent,
      categories: JSON.parse(r.categories),
      timerMode: r.timer_mode === 1
    }));

    return NextResponse.json({ attempts });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
