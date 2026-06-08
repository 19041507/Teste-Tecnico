'use client'

import { useEffect } from 'react'
import { handleAuthExpired } from '@/core/auth/logout-broadcast'
import { useSession } from '@/shared/hooks/useSession'
import { refreshAccessToken, RefreshFailedError } from '@/core/http/axios'

// Maximum lead time before token expiry at which proactive refresh fires
const MAX_REFRESH_LEAD_MS = 5 * 60 * 1000

export function useTokenRefresh() {
  const { data: user } = useSession()

  useEffect(() => {
    if (!user?.expiresAt) return

    const expiresAtMs = user.expiresAt * 1000
    const now = Date.now()
    const timeUntilExpiryMs = expiresAtMs - now

    // Already expired — the reactive 401 path in the axios interceptor covers recovery
    if (timeUntilExpiryMs <= 0) return

    // Lead time is half the remaining lifetime, capped at MAX_REFRESH_LEAD_MS.
    // This prevents an immediate fire for short-lived tokens (e.g. 1-min test tokens)
    // while still ensuring a 5-min window for production tokens (30 min).
    const leadTimeMs = Math.min(MAX_REFRESH_LEAD_MS, timeUntilExpiryMs / 2)
    const delay = Math.max(0, timeUntilExpiryMs - leadTimeMs)

    const doRefresh = async () => {
      try {
        // Shares the same mutex as the axios 401 interceptor — prevents concurrent calls
        await refreshAccessToken()
        // Cookie updated; next natural profile refetch (window focus / stale) picks up
        // the new expiresAt and reschedules this timer
      } catch (err) {
        // Only redirect on confirmed auth rejection — ignore network / server errors
        if (err instanceof RefreshFailedError) handleAuthExpired()
      }
    }

    const timer = setTimeout(doRefresh, delay)
    return () => clearTimeout(timer)
  }, [user?.expiresAt])
}
