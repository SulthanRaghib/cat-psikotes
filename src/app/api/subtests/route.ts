import { NextResponse } from 'next/server';
import DB from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    let subtests = await DB.subtests.getAll();
    
    if (category) {
      subtests = subtests.filter(s => s.category === category);
    }
    
    return NextResponse.json({ subtests });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
