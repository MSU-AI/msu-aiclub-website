import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'
  
  // Check for error parameters that might be returned from Supabase
  const error = searchParams.get('error')
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')
  
  // If there's an error and it's related to OTP expiry, handle it
  if (error && errorCode === 'otp_expired') {
    // Redirect to forgot password page with error message
    return NextResponse.redirect(
      `${origin}/auth/forgot-password?error=${encodeURIComponent(errorDescription ?? 'Your password reset link has expired. Please request a new one.')}`
    )
  }
  
  // Handle the code exchange for password reset
  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if this is a password reset flow
      if (next.includes('/auth/reset-password')) {
        // Set query param to indicate this is coming from a valid reset link
        return NextResponse.redirect(`${origin}/auth/reset-password?valid=true`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    // Handle error in code exchange
    return NextResponse.redirect(
      `${origin}/auth/forgot-password?error=${encodeURIComponent(error.message)}`
    )
  }
  
  // Return the user to an error page with instructions if no code is present
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
