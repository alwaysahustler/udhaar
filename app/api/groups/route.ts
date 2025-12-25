import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServerClient();

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const name = (body.name || '').trim();
    const duration = Number(body.duration ?? 0);

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('groups')
      // cast to any because DB typings are narrow in this workspace's setup
      .insert({ name, created_by: user.id } as any)
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create group:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: (data as any).id });
  } catch (err) {
    console.error('Unexpected error creating group:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
