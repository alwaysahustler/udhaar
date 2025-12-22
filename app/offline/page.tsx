export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
      <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
      <p className="mt-2 text-sm text-slate-400">
        SplitKar needs an internet connection to sync your latest expenses.
        We&apos;ll reconnect automatically when you&apos;re back online.
      </p>
    </main>
  );
}


