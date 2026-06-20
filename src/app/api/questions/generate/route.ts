import { NextResponse } from 'next/server';
import DB from '@/lib/db';
import { Question } from '@/types';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categories = ['numerik', 'logika', 'verbal', 'situasional'], count = 20, excludeIds = [] } = body;

    // Fetch all questions from repository
    const allQuestions = await DB.questions.getAll();

    // Filter by requested categories
    const filteredRows = allQuestions.filter(q => categories.includes(q.category));

    // Map and parse options
    const parsedQuestions: Question[] = filteredRows.map((r) => ({
      id: r.id,
      category: r.category as Question['category'],
      question: r.question,
      options: JSON.parse(r.options),
      correct_index: r.correct_index,
      explanation: r.explanation
    }));

    // Split into unseen and seen
    const unseenQuestions = parsedQuestions.filter(q => !excludeIds.includes(q.id));
    const seenQuestions = parsedQuestions.filter(q => excludeIds.includes(q.id));

    // Shuffle both
    const shuffledUnseen = shuffleArray(unseenQuestions);
    const shuffledSeen = shuffleArray(seenQuestions);

    let finalQuestions: Question[] = [];

    if (shuffledUnseen.length >= count) {
      // If we have enough unseen questions, just take them
      finalQuestions = shuffledUnseen.slice(0, count);
    } else {
      // If unseen questions are not enough, take all unseen and fill the rest from seen
      finalQuestions = [...shuffledUnseen];
      const remainingNeeded = count - shuffledUnseen.length;
      finalQuestions.push(...shuffledSeen.slice(0, remainingNeeded));
      
      // Shuffle again so seen and unseen are mixed
      finalQuestions = shuffleArray(finalQuestions);
    }

    return NextResponse.json({ questions: finalQuestions });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
