'use client'

import { defineAbilityFor, EMPTY_USER } from '@/core/permissions/permissions'
import { ReactNode, useContext, useEffect, useMemo } from 'react'
import { AbilityContext } from './abilityContext'
import { useSession } from '@/shared/hooks/useSession'
import { handleAuthExpired } from '@/core/auth/logout-broadcast'
import { logout } from '@/core/auth/services/authService'
import { Loader2 } from 'lucide-react'

interface AbilityProviderProps {
  children: ReactNode
}

export function AbilityProvider({ children }: AbilityProviderProps) {
  const { data: user, isLoading, isError } = useSession()

  useEffect(() => {
    if (isError) handleAuthExpired()
  }, [isError])

  useEffect(() => {
    if (user && !user.isActive) logout()
  }, [user])

  const ability = useMemo(() => defineAbilityFor(user ?? EMPTY_USER), [user])

  if (isLoading || isError || (user && !user.isActive)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}

export function useAbility() {
  const ability = useContext(AbilityContext)
  if (!ability) {
    throw new Error('useAbility must be used within an AbilityProvider')
  }

  return ability
}
