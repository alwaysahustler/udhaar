import Link from 'next/link';

export function TopNav() {
  return (
    <header className="border-b border-slate-900 bg-slate-950/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          href="/dashboard"
          className="text-lg font-semibold text-primary md:text-xl"
        >
          SplitKar
        </Link>

        <nav className="hidden gap-4 text-sm text-slate-200 md:flex">
          <Link href="/groups" className="hover:text-primary">
            Groups
          </Link>
          <Link href="/activity" className="hover:text-primary">
            Activity
          </Link>
          <Link href="/profile" className="hover:text-primary">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}


