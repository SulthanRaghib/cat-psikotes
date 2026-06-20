import { NextResponse } from 'next/server';
import DB from '@/lib/db';

export async function GET() {
  try {
    const subtests = await DB.subtests.getAll();
    return NextResponse.json({ subtests });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
