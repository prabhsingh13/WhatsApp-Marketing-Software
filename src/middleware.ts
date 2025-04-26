import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Paths that can be accessed publicly
  const isPublicPath = path === '/login' || path === '/register' || path === '/'

  // Get the token from cookies
  const token = request.cookies.get('token')?.value || ''

  // If the user is logged in and tries to visit public paths, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  // If the user is not logged in and tries to access protected paths, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // Continue with the request if no conditions match
  return NextResponse.next()
}

// Path matching configuration
export const config = {
  matcher: ['/', '/login', '/register', '/dashboard', '/dashboard/:path*'],
}
