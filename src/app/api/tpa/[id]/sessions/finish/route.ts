import { NextResponse } from 'next/server';
import DB from '@/lib/db';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const p = await params;
    const subtestId = p.id;
    const body = await request.json();
    const { sessionId, answers, timeSpent } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // 1. Fetch the correct answers from DB
    let questions: any[] = [];
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('tpa_questions')
        .select('id, correct_answer, question_text')
        .eq('subtest_id', subtestId);
      if (error) throw error;
      questions = data || [];
    } else {
      const dbPath = path.join(process.cwd(), "data", "app_v3.db");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Database = require("better-sqlite3");
      const db = new Database(dbPath);
      questions = db.prepare("SELECT id, correct_answer, question_text FROM tpa_questions WHERE subtest_id = ?").all(subtestId);
    }

    // 2. Score the test
    let correctCount = 0;
    let itemsAttempted = 0;
    const sessionItems = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct_answer ? 1 : 0;
      
      if (userAnswer) itemsAttempted++;
      if (isCorrect) correctCount++;

      sessionItems.push({
        item_index: i,
        stimulus_json: JSON.stringify({ question: q.question_text, type: 'tpa_multiple_choice' }),
        correct_answer: q.correct_answer === 'A' ? 1 : q.correct_answer === 'B' ? 2 : q.correct_answer === 'C' ? 3 : q.correct_answer === 'D' ? 4 : 5,
        user_answer: userAnswer === 'A' ? 1 : userAnswer === 'B' ? 2 : userAnswer === 'C' ? 3 : userAnswer === 'D' ? 4 : userAnswer === 'E' ? 5 : null,
        is_correct: isCorrect,
        answered_at_ms: Date.now()
      });
    }

    const accuracyPercent = itemsAttempted > 0 ? Math.round((correctCount / itemsAttempted) * 100) : 0;
    const itemsPerMinute = timeSpent > 0 ? Number(((itemsAttempted / timeSpent) * 60).toFixed(2)) : 0;

    // 3. Save session items
    await DB.sessionItems.bulkCreate(sessionId, sessionItems);

    // 4. Update session
    await DB.sessions.finish(sessionId, itemsAttempted, correctCount, accuracyPercent, itemsPerMinute);

    return NextResponse.json({ success: true, correctCount, accuracyPercent });
  } catch (error: any) {
    console.error('Error finishing TPA session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
