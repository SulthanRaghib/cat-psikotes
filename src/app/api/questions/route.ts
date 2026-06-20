import { NextResponse } from 'next/server';
import DB from '@/lib/db';
import { Question } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriesParam = searchParams.get('categories');
    const countParam = searchParams.get('count');

    let categories = ['numerik', 'logika', 'verbal', 'situasional'];
    if (categoriesParam) {
      categories = categoriesParam.split(',');
    }

    const count = countParam ? parseInt(countParam, 10) : 20;

    // Fetch all questions from repository
    const allQuestions = await DB.questions.getAll();

    // Filter by requested categories
    const filteredRows = allQuestions.filter(q => categories.includes(q.category));

    // Map and parse options
    let questions: Question[] = filteredRows.map((r) => ({
      id: r.id,
      category: r.category as any,
      question: r.question,
      options: JSON.parse(r.options),
      correct_index: r.correct_index,
      explanation: r.explanation
    }));

    // Fisher-Yates shuffle
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    // Limit count
    questions = questions.slice(0, Math.min(count, questions.length));

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
