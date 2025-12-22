'use client';

import { useEffect } from 'react';

type ToastProps = {
  type: 'error' | 'success';
  message: string | null;
  onClose: () => void;
};

export function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onClose, 4000);
    return () => clearTimeout(id);
  }, [message, onClose]);

  if (!message) return null;

  const base =
    'fixed inset-x-4 bottom-20 z-50 mx-auto w-auto max-w-md rounded-2xl px-4 py-3 text-sm shadow-lg';
  const variant =
    type === 'error'
      ? 'bg-red-500/90 text-white'
      : 'bg-emerald-500/90 text-slate-950';

  return (
    <div className={`${base} ${variant}`}>
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold uppercase tracking-wide"
        >
          Close
        </button>
      </div>
    </div>
  );
}


