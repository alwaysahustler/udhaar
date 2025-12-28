'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

interface GroupMember {
  user_id: string;
  joined_at: string;
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface GroupData {
  group: {
    id: string;
    name: string;
    created_by: string;
    creator: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  };
  members: GroupMember[];
}

interface Props {
  params: { token: string };
}

function JoinPageContent({ params }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();
  const token = params.token;
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === true) {
      fetchGroupDetails();
    } else if (isAuthenticated === false) {
      // Redirect to login with return URL
      const name = searchParams.get('name');
      const duration = searchParams.get('duration');
      const returnUrl = `/groups/join/${token}${name ? `?name=${encodeURIComponent(name)}&duration=${encodeURIComponent(duration || '')}` : ''}`;
      router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
    }
  }, [isAuthenticated, token, searchParams, router]);

  async function checkAuth() {
    try {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (err) {
      setIsAuthenticated(false);
    }
  }

  async function fetchGroupDetails() {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`/api/groups/${token}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Failed to fetch group details');
        return;
      }

      setGroupData(data);
      
      // Check if current user is already a member
      const {
        data: { user }
      } = await supabase.auth.getUser();
      
      if (user && data.members) {
        const member = data.members.find((m: GroupMember) => m.user_id === user.id);
        setIsMember(!!member);
      }
    } catch (err) {
      setError('Failed to fetch group details. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!groupData) return;

    try {
      setJoining(true);
      setError('');

      const res = await fetch(`/api/groups/${token}`, {
        method: 'POST'
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Failed to join group');
        return;
      }

      setIsMember(true);
      // Refresh group data to show updated member list
      await fetchGroupDetails();
    } catch (err) {
      setError('Failed to join group. Please try again.');
    } finally {
      setJoining(false);
    }
  }

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <main className="mx-auto w-full max-w-2xl p-6">
        <div className="space-y-3 rounded border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-sm text-slate-200">Redirecting to login...</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-2xl p-6">
        <div className="space-y-3 rounded border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-sm text-slate-200">Loading group details...</p>
        </div>
      </main>
    );
  }

  if (error && !groupData) {
    return (
      <main className="mx-auto w-full max-w-2xl p-6">
        <h1 className="mb-4 text-2xl font-semibold text-slate-50">Join Group</h1>
        <div className="space-y-3 rounded border border-red-800 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">{error}</p>
          <Link href="/groups" className="inline-block rounded bg-primary px-3 py-1 text-sm text-white">
            Back to Groups
          </Link>
        </div>
      </main>
    );
  }

  if (!groupData) {
    return null;
  }

  const name = searchParams.get('name');
  const duration = searchParams.get('duration');

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold text-slate-50">Join Group</h1>

      <div className="space-y-6">
        {/* Group Details */}
        <div className="rounded border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="mb-4 text-xl font-medium text-slate-100">{groupData.group.name || name || 'Group'}</h2>
          
          <div className="space-y-3 text-sm">
            {duration && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Duration:</span>
                <span className="text-slate-200">{duration} days</span>
              </div>
            )}

            {groupData.group.creator && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Created by:</span>
                <span className="text-slate-200">
                  {groupData.group.creator.full_name || 'Unknown'}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Members:</span>
              <span className="text-slate-200">{groupData.members.length}</span>
            </div>
          </div>
        </div>

        {/* Members List */}
        {groupData.members.length > 0 && (
          <div className="rounded border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="mb-4 text-lg font-medium text-slate-100">Members</h3>
            <div className="space-y-2">
              {groupData.members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center gap-3 rounded bg-slate-800/40 p-3"
                >
                  {member.profile?.avatar_url ? (
                    <img
                      src={member.profile.avatar_url}
                      alt={member.profile.full_name || 'Member'}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm text-slate-300">
                      {(member.profile?.full_name || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">
                      {member.profile?.full_name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-slate-400">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Join Button */}
        {!isMember && (
          <div className="space-y-3">
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={joining}
              className="w-full rounded bg-primary px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {joining ? 'Joining...' : 'Join Group'}
            </button>
          </div>
        )}

        {isMember && (
          <div className="rounded border border-green-800 bg-green-900/20 p-4">
            <p className="text-sm text-green-400">You are already a member of this group!</p>
            <Link
              href="/dashboard"
              className="mt-3 inline-block rounded bg-primary px-3 py-1 text-sm text-white"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        <div className="pt-2">
          <Link href="/groups" className="text-sm text-slate-400 hover:text-slate-300">
            ← Back to Groups
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function JoinPage({ params }: Props) {
  return (
    <Suspense fallback={
      <main className="mx-auto w-full max-w-2xl p-6">
        <div className="space-y-3 rounded border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-sm text-slate-200">Loading...</p>
        </div>
      </main>
    }>
      <JoinPageContent params={params} />
    </Suspense>
  );
}

