import { NextResponse } from 'next/server';
import DB from '@/lib/db';

export async function POST(request: Request, context: { params: Promise<{ id: string; sessionId: string }> }) {
  try {
    const { sessionId } = await context.params;
    const body = await request.json();
    const { itemsAttempted, correctCount, items } = body;
    
    const sId = parseInt(sessionId, 10);
    if (isNaN(sId)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }

    const session = await DB.sessions.getById(sId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Save all items
    if (items && Array.isArray(items) && items.length > 0) {
      const itemsToInsert = items.map((item: any) => ({
        item_index: item.itemIndex,
        stimulus_json: JSON.stringify(item.stimulus),
        correct_answer: item.correctAnswer,
        user_answer: item.userAnswer !== undefined ? item.userAnswer : null,
        is_correct: item.isCorrect ? 1 : 0,
        answered_at_ms: item.answeredAtMs,
      }));
      await DB.sessionItems.bulkCreate(sId, itemsToInsert);
    }

    // Calculate metrics
    const accuracyPercent = itemsAttempted > 0 ? Math.round((correctCount / itemsAttempted) * 100) : 0;
    const itemsPerMinute = session.time_limit_seconds > 0 ? (itemsAttempted / (session.time_limit_seconds / 60)) : 0;

    await DB.sessions.finish(sId, itemsAttempted, correctCount, accuracyPercent, itemsPerMinute);

    return NextResponse.json({ 
      ok: true,
      accuracyPercent,
      itemsPerMinute
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
