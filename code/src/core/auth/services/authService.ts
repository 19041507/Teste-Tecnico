import { SigninFormData } from '@/core/auth/types/signin'
import { type Session } from '@/core/auth/types/session'
import { broadcastLogout, handleAuthExpired } from '@/core/auth/logout-broadcast'
import { refreshAccessToken, RefreshFailedError } from '@/core/http/axios'

export const signin = async (data: SigninFormData) => {
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? 'Credenciais inválidas.')
  }
}

export const getSession = async (): Promise<Session> => {
  const fetchSession = () =>
    fetch('/api/auth/session', { credentials: 'include' })

  let res = await fetchSession()

  if (res.status === 401) {
    try {
      await refreshAccessToken()
    } catch (err) {
      if (err instanceof RefreshFailedError) handleAuthExpired()
      throw new Error('Sessão expirada.')
    }
    res = await fetchSession()
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? 'Não autenticado.')
  }

  return res.json()
}

export const logout = async () => {
  broadcastLogout()
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
  if (typeof window !== 'undefined') window.location.href = '/signin'
}
