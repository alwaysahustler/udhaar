import { BottomNav } from '@/components/layout/bottom-nav';
import { TopNav } from '@/components/layout/top-nav';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <TopNav />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-20 pt-3">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}


