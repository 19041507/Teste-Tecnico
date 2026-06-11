import { NextResponse } from 'next/server'
import { clearAuthCookies } from '@/core/auth/cookie-helpers'

/**
 * Logout MOCKADO (sem backend): apenas limpa os cookies de autenticação.
 */
export async function POST() {
  const response = NextResponse.json({ success: true })
  clearAuthCookies(response.cookies)
  return response
}
