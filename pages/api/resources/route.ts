import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const college = searchParams.get('college');
    const category = searchParams.get('category');
    const course = searchParams.get('course');
    const semester = searchParams.get('semester');
    const subject = searchParams.get('subject');

    let query = supabase.from('resources').select('*');

    if (college) query = query.eq('college', college);
    if (category) query = query.eq('category', category);
    if (course) query = query.eq('course', course);
    if (semester) query = query.eq('semester', semester);
    if (subject) query = query.eq('subject', subject);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, data: [], message: 'No resources found' });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch resources' }, { status: 500 });
  }
}