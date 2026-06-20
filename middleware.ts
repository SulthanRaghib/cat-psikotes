import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './src/lib/auth';

const protectedRoutes = ['/admin'];
const publicRoutes = ['/admin/login'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  const isProtectedRoute = protectedRoutes.some(r => path === r || path.startsWith(`${r}/`) && !publicRoutes.includes(path));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get('admin_session')?.value;
  let session = null;
  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch (e) {
      session = null;
    }
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }

  if (isPublicRoute && session && !req.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  if (path === '/admin/login' && session) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
