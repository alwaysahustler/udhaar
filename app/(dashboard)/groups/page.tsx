'use client';

import { useEffect, useState } from 'react';

export default function GroupsPage() {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('7');
  const [customDays, setCustomDays] = useState('');
  const [link, setLink] = useState('');
  const [origin, setOrigin] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin);
  }, []);

  function validate() {
    setError('');
    if (!name.trim()) {
      setError('Please provide a group name');
      return false;
    }

    const dur = duration === 'custom' ? Number(customDays) : Number(duration);
    if (!Number.isFinite(dur) || dur <= 0) {
      setError('Please provide a valid duration (in days)');
      return false;
    }

    return true;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setCreating(true);

    try {
      const dur = duration === 'custom' ? Number(customDays) : Number(duration);

      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), duration: dur })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Failed to create group');
        return;
      }

      const id = data.id;
      const url = `${origin}/groups/join/${id}?name=${encodeURIComponent(name.trim())}&duration=${dur}`;
      setLink(url);
    } catch (err) {
      setError('Failed to create group. Please try again.');
    } finally {
      setCreating(false);
    }
  }

  async function copyLink() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
    } catch (err) {
      // ignore
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold text-slate-50">Create a Group</h1>

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-slate-300">Group name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Trip to Goa"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-300">Duration (days)</label>
          <div className="flex gap-3">
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-100"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="custom">Custom</option>
            </select>

            {duration === 'custom' && (
              <input
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                className="w-32 rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-100"
                placeholder="days"
                inputMode="numeric"
              />
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            disabled={creating}
          >
            {creating ? 'Creating…' : 'Create group & generate link'}
          </button>

          {link && (
            <div className="ml-2 flex flex-1 items-center gap-3 rounded border border-slate-800 bg-slate-900/40 px-3 py-2">
              <input readOnly value={link} className="flex-1 bg-transparent text-sm text-slate-200" />
              <button
                type="button"
                onClick={copyLink}
                className="rounded bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:bg-slate-700"
              >
                Copy
              </button>
            </div>
          )}
        </div>

        <p className="mt-2 text-sm text-slate-400">Share the generated link with others to let them join your group.</p>
      </form>
    </main>
  );
}
