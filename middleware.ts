import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from './types/database';

const PUBLIC_ROUTES = [
  '/login',
  '/auth',
  '/manifest.webmanifest',
  '/manifest.json',
  '/icons',
  '/groups/join' // Allow join route - page will handle auth redirect
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const isPublic = PUBLIC_ROUTES.some((path) =>
    url.pathname === path || url.pathname.startsWith(path + '/')
  );

  const res = NextResponse.next({
    request: {
      headers: req.headers
    }
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        }
      }
    }
  );

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session && !isPublic) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (session && url.pathname === '/login') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};


