import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const attemptStmt = db.prepare(`SELECT * FROM attempts WHERE id = ?`);
    const attemptRow = attemptStmt.get(id) as any;

    if (!attemptRow) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    const answersStmt = db.prepare(`
      SELECT a.*, q.question, q.options, q.correct_index, q.explanation
      FROM attempt_answers a
      JOIN questions q ON a.question_id = q.id
      WHERE a.attempt_id = ?
    `);
    const answersRows = answersStmt.all(id) as any[];

    const attempt = {
      id: attemptRow.id,
      startedAt: attemptRow.started_at,
      finishedAt: attemptRow.finished_at,
      totalQuestions: attemptRow.total_questions,
      correctCount: attemptRow.correct_count,
      percent: attemptRow.percent,
      categories: JSON.parse(attemptRow.categories),
      timerMode: attemptRow.timer_mode === 1,
      answers: answersRows.map(a => ({
        id: a.id,
        questionId: a.question_id,
        chosenIndex: a.chosen_index,
        isCorrect: a.is_correct === 1,
        question: a.question,
        options: JSON.parse(a.options),
        correctIndex: a.correct_index,
        explanation: a.explanation
      }))
    };

    return NextResponse.json({ attempt });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
