import { NextResponse } from 'next/server';
import DB from '@/lib/db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    
    const sessions = await DB.sessions.getRecent(id, limit);
    return NextResponse.json({ sessions });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { timeLimitSeconds } = body;
    
    if (!timeLimitSeconds) {
      return NextResponse.json({ error: "Missing timeLimitSeconds" }, { status: 400 });
    }

    const sessionId = await DB.sessions.create(id, timeLimitSeconds);
    return NextResponse.json({ sessionId }, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
