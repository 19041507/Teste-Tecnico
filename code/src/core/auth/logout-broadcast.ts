const AUTH_BROADCAST_CHANNEL = 'motiron-auth'

export function broadcastLogout() {
  if (typeof window === 'undefined') return

  const channel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL)
  channel.postMessage({ type: 'LOGGED_OUT' })
  channel.close()
}

// One-way latch: once the session is expired, subsequent concurrent calls are no-ops.
// The page navigates away, so the flag never needs to be reset.
let sessionExpired = false

/** Broadcast logout to other tabs and redirect this tab to /signin. */
export function handleAuthExpired(): void {
  if (sessionExpired) return
  sessionExpired = true
  broadcastLogout()
  if (typeof window !== 'undefined') {
    window.location.href = '/signin'
  }
}
