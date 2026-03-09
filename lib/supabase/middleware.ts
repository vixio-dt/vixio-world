import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

type CookieToSet = {
  name: string
  value: string
  options?: CookieOptions
}

export async function updateSession(request: NextRequest) {
  // If Supabase env vars are missing the client construction itself throws
  // (new URL(undefined)). Guard everything so the app stays reachable.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('[middleware] Supabase env vars not set – running without auth')
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  let user = null
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: CookieToSet[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase unreachable – treat as unauthenticated so the app still renders
    console.error('[middleware] Supabase auth check failed – treating as unauthenticated')
  }

  // Protected routes - redirect to login if not authenticated
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/signup')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                           request.nextUrl.pathname.startsWith('/boards') ||
                           request.nextUrl.pathname.startsWith('/canon') ||
                           request.nextUrl.pathname.startsWith('/assets') ||
                           request.nextUrl.pathname.startsWith('/characters') ||
                           request.nextUrl.pathname.startsWith('/locations') ||
                           request.nextUrl.pathname.startsWith('/organizations') ||
                           request.nextUrl.pathname.startsWith('/timeline') ||
                           request.nextUrl.pathname.startsWith('/items') ||
                           request.nextUrl.pathname.startsWith('/rules') ||
                           request.nextUrl.pathname.startsWith('/stories') ||
                           request.nextUrl.pathname.startsWith('/graph') ||
                           request.nextUrl.pathname.startsWith('/chat') ||
                           request.nextUrl.pathname.startsWith('/import') ||
                           request.nextUrl.pathname.startsWith('/export')

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
