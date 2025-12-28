import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
    const groupId = params.id;

    // Get group details
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, name, created_by')
      .eq('id', groupId)
      .single();

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Get group members
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select('user_id, joined_at')
      .eq('group_id', groupId);

    if (membersError) {
      console.error('Failed to fetch members:', membersError);
    }

    // Get profiles for all members
    const memberIds = (members || []).map((m: any) => m.user_id);
    const { data: memberProfiles } = memberIds.length > 0
      ? await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', memberIds)
      : { data: [] };

    // Create a map of user_id to profile
    const profileMap = new Map(
      (memberProfiles || []).map((p: any) => [p.id, p])
    );

    // Get creator profile
    const { data: creator } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', group.created_by)
      .single();

    return NextResponse.json({
      group: {
        id: group.id,
        name: group.name,
        created_by: group.created_by,
        creator: creator || null
      },
      members: (members || []).map((m: any) => ({
        user_id: m.user_id,
        joined_at: m.joined_at,
        profile: profileMap.get(m.user_id) || null
      }))
    });
  } catch (err) {
    console.error('Unexpected error fetching group:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
    const groupId = params.id;

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if group exists
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id')
      .eq('id', groupId)
      .single();

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return NextResponse.json({ message: 'Already a member', joined: true });
    }

    // Add user to group
    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: user.id,
        joined_at: new Date().toISOString()
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Failed to join group:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Successfully joined group', joined: true });
  } catch (err) {
    console.error('Unexpected error joining group:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

