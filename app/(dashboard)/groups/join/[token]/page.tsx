import Link from 'next/link';

interface Props {
  params: { token: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function JoinPage({ params, searchParams }: Props) {
  const token = params.token;
  const name = Array.isArray(searchParams.name) ? searchParams.name[0] : searchParams.name;
  const duration = Array.isArray(searchParams.duration) ? searchParams.duration[0] : searchParams.duration;

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold text-slate-50">Join Group</h1>

      <div className="space-y-3 rounded border border-slate-800 bg-slate-900/40 p-4">
        <p className="text-sm text-slate-200">This is the placeholder join page for token:</p>
        <pre className="max-w-full overflow-auto rounded bg-slate-800 p-3 text-sm text-slate-100">{token}</pre>

        {name && (
          <p className="text-sm text-slate-200">Group name: <strong className="text-slate-100">{name}</strong></p>
        )}

        {duration && (
          <p className="text-sm text-slate-200">Duration (days): <strong className="text-slate-100">{duration}</strong></p>
        )}

        <p className="text-sm text-slate-400">Joining is not implemented yet — this page simply confirms the link.</p>

        <div className="mt-3">
          <Link href="/groups" className="rounded bg-primary px-3 py-1 text-sm text-white">Back to create</Link>
        </div>
      </div>
    </main>
  );
}
