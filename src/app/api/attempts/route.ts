import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startedAt, finishedAt, categories, timerMode, answers } = body;

    const totalQuestions = answers.length;
    const correctCount = answers.filter((a: any) => a.isCorrect).length;
    const percent = Math.round((correctCount / Math.max(totalQuestions, 1)) * 100);

    const insertAttempt = db.prepare(`
      INSERT INTO attempts (started_at, finished_at, total_questions, correct_count, percent, categories, timer_mode)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertAnswer = db.prepare(`
      INSERT INTO attempt_answers (attempt_id, question_id, chosen_index, is_correct)
      VALUES (?, ?, ?, ?)
    `);

    let attemptId: number | bigint = 0;

    // Use transaction
    const processAttempt = db.transaction(() => {
      const result = insertAttempt.run(
        startedAt,
        finishedAt,
        totalQuestions,
        correctCount,
        percent,
        JSON.stringify(categories),
        timerMode ? 1 : 0
      );
      attemptId = result.lastInsertRowid;

      for (const ans of answers) {
        insertAnswer.run(
          attemptId,
          ans.questionId,
          ans.chosenIndex === null ? null : ans.chosenIndex,
          ans.isCorrect ? 1 : 0
        );
      }
    });

    processAttempt();

    return NextResponse.json({ id: attemptId, totalQuestions, correctCount, percent }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 8;

    const stmt = db.prepare(`SELECT * FROM attempts ORDER BY finished_at DESC LIMIT ?`);
    const rows = stmt.all(limit) as any[];

    const attempts = rows.map(r => ({
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
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    db.prepare('DELETE FROM attempts').run();
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
