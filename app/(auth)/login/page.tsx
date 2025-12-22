'use client';

import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useState, FormEvent } from 'react';
import { Toast } from '@/components/ui/toast';

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`
        }
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setSuccess('Magic link sent! Check your email to continue.');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 px-4 py-6 text-slate-50">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <h1 className="mb-2 text-center text-3xl font-semibold text-primary">
          SplitKar
        </h1>
        <p className="mb-8 text-center text-sm text-slate-300">
          Split UPI-friendly expenses with friends and family.
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4 rounded-2xl bg-slate-900/60 p-4 shadow-lg backdrop-blur"
        >
          <label className="block text-sm font-medium text-slate-200">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-primary/40 focus:ring-2"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
          >
            {loading ? 'Sending link…' : 'Continue with Email'}
          </button>

          <p className="pt-2 text-center text-xs text-slate-400">
            By continuing, you agree to SplitKar&apos;s{' '}
            <Link href="#" className="text-primary underline underline-offset-2">
              Terms
            </Link>
            .
          </p>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          Made for Indian expense groups – trips, flatmates, weddings &amp;
          more.
        </p>
      </div>

      <Toast type="error" message={error} onClose={() => setError(null)} />
      <Toast type="success" message={success} onClose={() => setSuccess(null)} />
    </main>
  );
}


