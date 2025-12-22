'use client';

import { useEffect, useState, FormEvent } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Toast } from '@/components/ui/toast';

export default function ProfilePage() {
  const supabase = createSupabaseBrowserClient();
  const [fullName, setFullName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setInitialLoading(true);
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, upi_id')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          // ignore, user may not have a profile yet for MVP
          return;
        }

        if (data && isMounted) {
          setFullName(data.full_name ?? '');
          setUpiId(data.upi_id ?? '');
        }
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('You must be logged in to update your profile.');
        return;
      }

      const { error: upsertError } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          full_name: fullName.trim() || null,
          upi_id: upiId.trim() || null,
          avatar_url: null
        },
        { onConflict: 'id' }
      );

      if (upsertError) {
        setError(upsertError.message);
        return;
      }

      setSuccess('Profile updated successfully.');
    } catch (_err) {
      setError('Something went wrong while saving your profile.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 py-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-50">
          Complete your profile
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Add your name and UPI ID so friends know who you are and can settle
          quickly.
        </p>
      </header>

      <section className="rounded-2xl bg-slate-900/70 p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-200">
              Full name
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-primary/40 focus:ring-2"
                placeholder="e.g. Rohan Sharma"
                disabled={initialLoading || loading}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-200">
              UPI ID
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-primary/40 focus:ring-2"
                placeholder="e.g. rohan@upi"
                disabled={initialLoading || loading}
              />
            </label>
            <p className="mt-1 text-[11px] text-slate-400">
              We never share your UPI publicly. It&apos;s only used to help
              close balances with trusted contacts.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      </section>

      <Toast type="error" message={error} onClose={() => setError(null)} />
      <Toast
        type="success"
        message={success}
        onClose={() => setSuccess(null)}
      />
    </main>
  );
}


