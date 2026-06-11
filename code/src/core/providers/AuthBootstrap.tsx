'use client'

import { useAuthBroadcast } from '@/shared/hooks/useAuthBroadcast'
import { useTokenRefresh } from '@/shared/hooks/useTokenRefresh'

export function AuthBootstrap() {
  useAuthBroadcast()
  useTokenRefresh()
  return null
}
