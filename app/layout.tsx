import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SplitKar',
  description: 'Indian expense splitting made simple'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        {children}
      </body>
    </html>
  );
}


