import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/messages', '/user']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route requires protection
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isProtectedRoute) {
    // Check for Better Auth session cookie
    const sessionCookie = request.cookies.get('better-auth.session_token')

    if (!sessionCookie) {
      // Redirect to sign-in with return URL
      const signInUrl = new URL('/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files and API
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
