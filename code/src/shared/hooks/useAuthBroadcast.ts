'use client'

import { useEffect } from 'react'

export function useAuthBroadcast() {
  useEffect(() => {
    const channel = new BroadcastChannel('motiron-auth')

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'LOGGED_OUT') {
        window.location.href = '/signin'
      }
    }

    channel.addEventListener('message', handleMessage)
    return () => {
      channel.removeEventListener('message', handleMessage)
      channel.close()
    }
  }, [])
}
