import { NextResponse } from 'next/server';
import DB from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const data = await DB.attempts.getById(id);

    if (!data) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    const { attempt: attemptRow, answers: answersRows } = data;

    // To populate question data, we can get all questions or specific ones
    // Since questions are cached or fast, getting all is fine
    const allQuestions = await DB.questions.getAll();
    const qMap = new Map(allQuestions.map(q => [q.id, q]));

    const attempt = {
      id: attemptRow.id,
      startedAt: attemptRow.started_at,
      finishedAt: attemptRow.finished_at,
      totalQuestions: attemptRow.total_questions,
      correctCount: attemptRow.correct_count,
      percent: attemptRow.percent,
      categories: JSON.parse(attemptRow.categories),
      timerMode: attemptRow.timer_mode === 1,
      answers: answersRows.map(a => {
        const q = qMap.get(a.question_id);
        return {
          id: a.id,
          questionId: a.question_id,
          chosenIndex: a.chosen_index,
          isCorrect: a.is_correct === 1,
          question: q?.question || 'Pertanyaan telah dihapus',
          options: q ? JSON.parse(q.options) : [],
          correctIndex: q?.correct_index || 0,
          explanation: q?.explanation || ''
        };
      })
    };

    return NextResponse.json({ attempt });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
