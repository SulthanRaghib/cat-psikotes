import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import DB from '@/lib/db';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const p = await params;
    const subtestId = p.id;
    
    // We fetch questions from Supabase if DB.provider is supabase, otherwise SQLite
    // Since DB provider interface doesn't have tpaQuestions yet, we'll access it directly here to save time
    
    let questions = [];
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data, error } = await supabase
        .from('tpa_questions')
        .select('id, number, question_text, image_url, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation')
        .eq('subtest_id', subtestId)
        .order('number', { ascending: true });
        
      if (error) throw error;
      questions = data || [];
    } else {
      const dbPath = path.join(process.cwd(), "data", "app_v3.db");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Database = require("better-sqlite3");
      const db = new Database(dbPath);
      questions = db.prepare("SELECT id, number, question_text, image_url, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation FROM tpa_questions WHERE subtest_id = ? ORDER BY number ASC").all(subtestId);
    }

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Error fetching TPA questions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
