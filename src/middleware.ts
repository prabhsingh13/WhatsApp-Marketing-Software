import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths
  const isPublicPath = path === '/' || path === '/login' || path === '/register';

  // Get the user token from NextAuth
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If user is logged in and tries to access public pages → redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  // If user is not logged in and tries to access protected pages → redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Otherwise, continue
  return NextResponse.next();
}

// Path matching config
export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};
