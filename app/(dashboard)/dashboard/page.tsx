import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  let greeting = 'Welcome to SplitKar 👋';
  let subtitle = 'Get started by creating a group for your expenses.';
  let hasProfile = false;

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        hasProfile = true;
      }

      if (profile?.full_name) {
        greeting = `Hi, ${profile.full_name.split(' ')[0]} 👋`;
        subtitle = 'Track, split, and settle your Indian expenses with ease.';
      }
    }
  } catch (error) {
    // fail silently for MVP, UI stays generic
  }

  return (
    <section className="flex flex-1 flex-col gap-4 py-4">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold">{greeting}</h1>
        <p className="mt-1 text-sm text-slate-300">{subtitle}</p>

        {!hasProfile && (
          <div className="flex flex-col gap-2 rounded-2xl bg-amber-500/10 p-3 text-xs text-amber-200 md:flex-row md:items-center md:justify-between">
            <span>
              Complete your profile with your name and UPI ID so friends can
              recognise you and settle easily.
            </span>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-3 py-1 font-semibold text-slate-950 shadow-sm md:text-sm"
            >
              Complete profile
            </Link>
          </div>
        )}
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="col-span-2 space-y-3">
          <div className="rounded-2xl bg-slate-900/70 p-4">
            <h2 className="mb-1 text-sm font-semibold text-slate-100">
              Active Groups
            </h2>
            <p className="text-xs text-slate-400">
              Create a group for your flat, trip, or event. Splits are auto
              calculated.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/70 p-4">
            <h2 className="mb-1 text-sm font-semibold text-slate-100">
              Recent Activity
            </h2>
            <p className="text-xs text-slate-400">
              Your latest expenses and settlements will show up here.
            </p>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl bg-slate-900/70 p-4">
            <h2 className="mb-1 text-sm font-semibold text-slate-100">
              Net Position
            </h2>
            <p className="text-xs text-slate-400">
              See how much you owe or are owed across groups.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}


