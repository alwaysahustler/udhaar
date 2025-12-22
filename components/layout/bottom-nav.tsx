'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/dashboard', label: 'Home' },
  { href: '/groups', label: 'Groups' },
  { href: '/activity', label: 'Activity' },
  { href: '/profile', label: 'Profile' }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 px-4 py-2 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-between gap-1 text-xs">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center rounded-xl px-2 py-1 ${
                  active
                    ? 'text-primary'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


